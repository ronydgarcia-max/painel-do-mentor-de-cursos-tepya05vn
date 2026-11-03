#!/usr/bin/env bash
# ==============================================================================
# INSTALADOR ÚNICO DOS ARTEFATOS DA FASE 1 NA VPS (PRÉ-HOMOLOGAÇÃO, SOMENTE TESTE)
# ==============================================================================
# Projeto: Plataforma Cursos (Cursos-API / Painel do Mentor)
# Arquivo: docs/operacoes/instalar-fase1.sh
# Uso:     curl -fsSL <ORIGEM>/docs/operacoes/instalar-fase1.sh | bash
#          (ou bash instalar-fase1.sh <ORIGEM>)
#
# O QUE FAZ (apenas pré-homologação, NÃO é a homologação oficial):
#   1. Baixa os 8 artefatos oficiais da Fase 1 da ORIGEM informada, via curl
#      (com fallback wget), para /tmp/fase1_candidatos/ (isolado, nada em produção);
#   2. Calcula o SHA-256 REAL de cada arquivo baixado NA PRÓPRIA VPS
#      (sha256sum, com fallback shasum) e IMPRIME a tabela arquivo→hash;
#   3. EXIGE a confirmação do operador: os hashes exibidos aqui devem conferir
#      com os hashes que a página da prévia calcula de forma INDEPENDENTE no
#      navegador (Web Crypto, aba "Fase 1 — Entregáveis"). Sem o "s" do
#      operador, aborta sem ter alterado nada fora de /tmp;
#      Alternativa NÃO interativa e segura: exportar EFASE1_SHA256 no formato
#      "caminho=hash;caminho=hash;..." — nesse caso o script compara
#      automaticamente e aborta em qualquer divergência, sem perguntar;
#   4. Valida a sintaxe do stream.js baixado com node --check;
#   5. Copia APENAS os dois scripts de teste/aplicação para
#      /root/cursos-api/docs/operacoes/ com cp --preserve (timestamps e modo),
#      criando o diretório se necessário. NENHUM outro arquivo do repositório
#      é criado, alterado ou removido.
#
# POR QUE A INTEGRIDADE É VERIFICADA ASSIM (e não com hashes embutidos):
#   Este instalador é gerado no workspace GoSkip, um ambiente SEM execução de
#   shell — não há como calcular SHA-256 lá dentro e embutir o valor aqui.
#   Inventar um hash seria pior do que não ter hash: daria falsa sensação de
#   integridade. Por isso o hash é calculado duas vezes, por fontes
#   INDEPENDENTES: (a) sha256sum na VPS, sobre os bytes efetivamente baixados;
#   (b) Web Crypto no navegador, sobre os bytes servidos pela prévia. O
#   operador compara as duas tabelas antes de confirmar. Essa dupla
#   verificação independente cumpre o papel do manifesto embutido.
#
# O QUE NUNCA FAZ:
#   - Não executa git add / git commit / git push / git checkout (nenhum!);
#   - Não copia nada para src/ do repositório (stream.js e painel-mentor.html
#     ficam SOMENTE em /tmp/fase1_candidatos/ para o operador auditar via diff);
#   - Não usa a branch main nem dispara redeploy do EasyPanel;
#   - Não contém e não pede segredo nenhum (tokens de teste entram como
#     variáveis TEST_TOKEN_* definidas pelo operador no shell, se desejar).
#
# Diretriz de Segurança: ZERO senhas, tokens ou credenciais neste arquivo.
# Marcador oficial: [TOKEN_REMOVIDO_E_ROTACIONADO].
# Homologação oficial (Camada 4, EasyPanel) continua exigindo autorização
# expressa do operador — este instalador NÃO homologa nada.
# ==============================================================================

set -euo pipefail

REPO_DIR="/root/cursos-api"
CANDIDATOS_DIR="/tmp/fase1_candidatos"
OPERACOES_DESTINO="${REPO_DIR}/docs/operacoes"

# Origem dos artefatos: argumento $1 (recomendado) ou variável de ambiente ORIGEM_FASE1.
ORIGEM="${1:-${ORIGEM_FASE1:-}}"
if [ -z "$ORIGEM" ]; then
  echo "[ERRO] Origem dos artefatos não informada." >&2
  echo "Uso:   bash instalar-fase1.sh https://<host-da-previa>" >&2
  echo "       curl -fsSL https://<host-da-previa>/docs/operacoes/instalar-fase1.sh | bash -s -- https://<host-da-previa>" >&2
  echo "       (ou: export ORIGEM_FASE1=https://<host-da-previa> antes de executar)" >&2
  exit 1
fi
# Remove barra final da origem, se houver
ORIGEM="${ORIGEM%/}"

# Lista de downloads: <caminho do artefato na ORIGEM>|<destino relativo a $CANDIDATOS_DIR>
# stream.js e painel-mentor.html vão para os caminhos finais (src/routes/ e src/static/)
# para que os scripts de teste e o diff do operador os encontrem onde serão aplicados;
# os demais ficam em subpastas espelhadas de docs/. Todos os 8 têm o SHA-256
# calculado na VPS e exibido na tabela para conferência do operador.
# VERIFICACAO_ARTEFATOS.md e o instalador em si não entram na lista: o instalador
# é o próprio script em execução e VERIFICACAO_ARTEFATOS.md é o documento que
# registra o mecanismo de verificação (ambos disponíveis na prévia).
LISTA_ARQUIVOS=(
  "docs/fase1/stream.js|src/routes/stream.js"
  "docs/fase1/NOVO_PAINEL/painel-mentor.html|src/static/painel-mentor.html"
  "docs/fase1/INTEGRACAO_FASE1.md|docs/fase1/INTEGRACAO_FASE1.md"
  "docs/fase1/PROPOSTA_PROVAS.md|docs/fase1/PROPOSTA_PROVAS.md"
  "docs/fase1/REVISAO_FASE1.md|docs/fase1/REVISAO_FASE1.md"
  "docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md|docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md"
  "docs/operacoes/testar-fase1-vps.sh|docs/operacoes/testar-fase1-vps.sh"
  "docs/operacoes/aplicar-fase1-vps.sh|docs/operacoes/aplicar-fase1-vps.sh"
)

log_info() { echo -e "\033[1;34m[INFO]\033[0m $1"; }
log_ok()   { echo -e "\033[1;32m[OK]\033[0m $1"; }
log_warn() { echo -e "\033[1;33m[AVISO]\033[0m $1"; }
log_erro() { echo -e "\033[1;31m[ERRO]\033[0m $1" >&2; }

# Download de um arquivo com curl e fallback wget (bytes exatos, sem reescrita).
baixar_arquivo() {
  local url="$1"
  local destino="$2"
  if command -v curl >/dev/null 2>&1; then
    if curl -fsSL --retry 2 --connect-timeout 15 -o "$destino" "$url"; then
      return 0
    fi
    rm -f "$destino"
  fi
  if command -v wget >/dev/null 2>&1; then
    if wget -q --tries=2 --timeout=15 -O "$destino" "$url"; then
      return 0
    fi
    rm -f "$destino"
  fi
  return 1
}

# Calcula o SHA-256 REAL de um arquivo NA VPS (sha256sum com fallback shasum).
calcular_sha256_vps() {
  local caminho="$1"
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$caminho" | awk '{print $1}'
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$caminho" | awk '{print $1}'
  else
    log_erro "Nem sha256sum nem shasum disponíveis nesta VPS — não é possível calcular o SHA-256."
    exit 1
  fi
}

# Normaliza "hash" para minúsculas sem espaços (comparação canônica).
normalizar_hash() {
  echo "$1" | tr -d '[:space:]' | tr 'A-F' 'a-f'
}

log_info "=================================================================="
log_info " INSTALADOR DA FASE 1 — PRÉ-HOMOLOGAÇÃO (SOMENTE LEITURA/TESTE)"
log_info " Origem: $ORIGEM"
log_info " Destino dos candidatos: $CANDIDATOS_DIR (isolado em /tmp)"
log_info "=================================================================="

# Guarda de segurança: candidatos SOMENTE sob /tmp
case "$CANDIDATOS_DIR" in
  /tmp/*) ;;
  *)
    log_erro "TRAVA DE SEGURANÇA: destino deve estar estritamente sob /tmp."
    exit 1
    ;;
esac

mkdir -p "$CANDIDATOS_DIR"
log_info "1/6. Baixando os 8 artefatos da origem informada (curl com fallback wget)..."

for entrada in "${LISTA_ARQUIVOS[@]}"; do
  caminho_origem="${entrada%%|*}"
  destino_rel="${entrada##*|}"
  destino_abs="$CANDIDATOS_DIR/$destino_rel"
  mkdir -p "$(dirname "$destino_abs")"
  url="$ORIGEM/$caminho_origem"
  if baixar_arquivo "$url" "$destino_abs"; then
    log_ok "Baixado: $caminho_origem"
  else
    log_erro "Falha ao baixar: $url"
    log_erro "Verifique a origem (a URL da prévia deve servir os artefatos em caminhos públicos diretos)."
    log_erro "Instalação ABORTADA — nada foi alterado fora de /tmp."
    exit 1
  fi
done

# ------------------------------------------------------------------------------
# 2/6. Cálculo do SHA-256 REAL de cada arquivo baixado, NA VPS, e tabela final.
#      Nenhum hash é embutido neste script: o valor vem dos bytes efetivamente
#      baixados (fonte 1 de 2; a fonte 2 é a Web Crypto no navegador da prévia).
# ------------------------------------------------------------------------------
log_info "2/6. Calculando o SHA-256 real de cada arquivo NA VPS..."

TABELA_HASHES=""
declare -A HASH_CALCULADO=()
for entrada in "${LISTA_ARQUIVOS[@]}"; do
  destino_rel="${entrada##*|}"
  hash_atual=$(calcular_sha256_vps "$CANDIDATOS_DIR/$destino_rel")
  HASH_CALCULADO["$destino_rel"]="$hash_atual"
  if [ -z "$TABELA_HASHES" ]; then
    TABELA_HASHES="$hash_atual  $destino_rel"
  else
    TABELA_HASHES="$TABELA_HASHES
$hash_atual  $destino_rel"
  fi
done

echo ""
echo "================ TABELA SHA-256 CALCULADA NA VPS ================"
echo "$TABELA_HASHES"
echo "================================================================="
echo ""
log_info "Compare a tabela acima com a tabela exibida na PRÉVIA"
log_info "(aba \"Fase 1 — Entregáveis\", card \"Instalação Rápida na VPS\","
log_info "botão \"Recalcular hashes\" — cálculo independente via Web Crypto"
log_info "no navegador, sobre os mesmos arquivos servidos por esta origem)."
echo ""

# ------------------------------------------------------------------------------
# 3/6. Verificação da integridade:
#      (a) EFASE1_SHA256="caminho=hash;..."  → comparação automática;
#      (b) sem EFASE1_SHA256                 → confirmação interativa do operador.
#      Em ambos os casos, divergência ou recusa ABORTA sem alterar nada
#      fora de /tmp.
# ------------------------------------------------------------------------------
log_info "3/6. Verificação de integridade (VPS × navegador / EFASE1_SHA256)..."

if [ -n "${EFASE1_SHA256:-}" ]; then
  # Modo não interativo seguro: compara automaticamente cada par caminho=hash.
  declare -A ESPERADO_OPERADOR=()
  IFS=';' read -r -a PARES <<< "$EFASE1_SHA256"
  for par in "${PARES[@]}"; do
    [ -z "$par" ] && continue
    chave="${par%%=*}"
    valor="${par#*=}"
    chave="$(echo "$chave" | tr -d '[:space:]')"
    valor="$(normalizar_hash "$valor")"
    if [ -z "$chave" ] || [ -z "$valor" ]; then
      log_erro "EFASE1_SHA256 mal formatado (esperado 'caminho=hash;...'): entrada '$par'."
      exit 1
    fi
    conhecida=0
    for entrada in "${LISTA_ARQUIVOS[@]}"; do
      [ "${entrada##*|}" = "$chave" ] && conhecida=1
    done
    if [ "$conhecida" -ne 1 ]; then
      log_erro "EFASE1_SHA256 menciona caminho desconhecido: '$chave'."
      log_erro "Use exatamente os caminhos relativos exibidos na tabela acima."
      exit 1
    fi
    ESPERADO_OPERADOR["$chave"]="$valor"
  done

  divergencias=0
  verificadas_auto=0
  for entrada in "${LISTA_ARQUIVOS[@]}"; do
    destino_rel="${entrada##*|}"
    if [ -n "${ESPERADO_OPERADOR[$destino_rel]:-}" ]; then
      verificadas_auto=$((verificadas_auto + 1))
      if [ "$(normalizar_hash "${HASH_CALCULADO[$destino_rel]}")" != "${ESPERADO_OPERADOR[$destino_rel]}" ]; then
        log_erro "=============================================================="
        log_erro "FALHA DE INTEGRIDADE SHA-256: $destino_rel"
        log_erro "  Informado (EFASE1_SHA256): ${ESPERADO_OPERADOR[$destino_rel]}"
        log_erro "  Calculado na VPS:          ${HASH_CALCULADO[$destino_rel]}"
        log_erro "O arquivo baixado NÃO confere com o valor informado pelo operador."
        log_erro "Instalação ABORTADA — nada foi alterado fora de /tmp."
        log_erro "=============================================================="
        divergencias=$((divergencias + 1))
      fi
    fi
  done
  if [ "$divergencias" -gt 0 ]; then
    exit 1
  fi
  if [ "$verificadas_auto" -eq "${#LISTA_ARQUIVOS[@]}" ]; then
    log_ok "Todos os $verificadas_auto hashes conferem com EFASE1_SHA256 — prosseguindo sem confirmação interativa."
  else
    log_warn "EFASE1_SHA256 cobriu $verificadas_auto de ${#LISTA_ARQUIVOS[@]} entradas; as demais exigem confirmação interativa."
    EFASE1_SHA256=""
  fi
fi

if [ -z "${EFASE1_SHA256:-}" ]; then
  # Confirmação interativa. IMPORTANTE: quando o script roda via pipe
  # (curl ... | bash), o stdin é o próprio script — a leitura da resposta
  # DEVE vir do terminal de controle (/dev/tty), nunca do stdin.
  if [ -t 0 ]; then
    read -r -p "Os hashes da VPS conferem com os da prévia? Digite 's' para prosseguir, qualquer outra coisa ABORTA: " resposta <&0 || resposta=""
  elif read -r resposta </dev/tty 2>/dev/null; then
    : # resposta lida do terminal de controle (execução via pipe)
  else
    resposta=""
  fi
  if [ "$resposta" != "s" ]; then
    log_erro "================================================================"
    log_erro "Confirmação NÃO obtida (resposta: '${resposta:-<vazia>}')."
    log_erro "Instalação ABORTADA por decisão do operador ou ausência de terminal."
    log_erro "Nada foi alterado fora de /tmp/fase1_candidatos."
    log_erro "Alternativas: (1) executar sem pipe (bash /tmp/instalar-fase1.sh $ORIGEM);"
    log_erro "(2) modo automático: EFASE1_SHA256=\"caminho=hash;caminho=hash\" bash instalar-fase1.sh $ORIGEM"
    log_erro "(usando os hashes da tabela da prévia)."
    log_erro "================================================================"
    exit 1
  fi
  log_ok "Confirmação do operador recebida — hashes conferidos visualmente (VPS × navegador)."
fi

# ------------------------------------------------------------------------------
# 4/6. Validação de sintaxe do stream.js baixado (node --check).
# ------------------------------------------------------------------------------
log_info "4/6. Validando sintaxe do stream.js com node --check..."
if ! command -v node >/dev/null 2>&1; then
  log_erro "Node.js não encontrado na VPS — necessário para node --check."
  exit 1
fi
if node --check "$CANDIDATOS_DIR/src/routes/stream.js"; then
  log_ok "Sintaxe de stream.js validada (exit code 0)."
else
  log_erro "Falha na checagem de sintaxe de stream.js baixado. Instalação ABORTADA."
  exit 1
fi

# ------------------------------------------------------------------------------
# 5/6. Cópia APENAS dos 2 scripts de teste para docs/operacoes/ do repositório.
# ------------------------------------------------------------------------------
log_info "5/6. Copiando os 2 scripts de teste para $OPERACOES_DESTINO (com --preserve)..."
if [ ! -d "$REPO_DIR" ]; then
  log_erro "Repositório $REPO_DIR não encontrado nesta VPS — abortando."
  exit 1
fi
mkdir -p "$OPERACOES_DESTINO"
cp --preserve=mode,timestamps \
  "$CANDIDATOS_DIR/docs/operacoes/testar-fase1-vps.sh" \
  "$CANDIDATOS_DIR/docs/operacoes/aplicar-fase1-vps.sh" \
  "$OPERACOES_DESTINO/"
chmod +x "$OPERACOES_DESTINO/testar-fase1-vps.sh" "$OPERACOES_DESTINO/aplicar-fase1-vps.sh"
log_ok "Scripts copiados com --preserve (modo e timestamps preservados)."

# ------------------------------------------------------------------------------
# 6/6. Próximos passos do operador (nenhuma ação automática adicional).
# ------------------------------------------------------------------------------
log_info "6/6. Próximos passos para o operador (na VPS):"
echo ""
echo "  # 1) Camada 1 — Teste estático (zero risco):"
echo "  ./docs/operacoes/testar-fase1-vps.sh estatico"
echo ""
echo "  # 2) Camada 2 — Servidor somente leitura na porta 3334 (READ_ONLY_TEST=true obrigatório):"
echo "  ./docs/operacoes/testar-fase1-vps.sh servidor"
echo ""
echo "  # 3) Camada 2 — Bateria dos 13 testes (tokens como placeholders; definir no shell se desejar):"
echo "  TEST_TOKEN_MENTOR='<TEST_TOKEN_MENTOR>' TEST_TOKEN_ESTRANHO='<TEST_TOKEN_ESTRANHO>' \\"
echo "    ./docs/operacoes/testar-fase1-vps.sh bateria"
echo ""
echo -e "\033[1;31m[AVISO IMPORTANTE]\033[0m Serviço respondendo na porta 3334 NÃO significa Fase 1 homologada."
echo "  A porta isola o processo, mas NÃO o banco; a homologação oficial (Camada 4, EasyPanel)"
echo "  continua exigindo autorização expressa do operador."
echo ""
echo -e "\033[1;32m[CONCLUÍDO]\033[0m Candidatos íntegros em $CANDIDATOS_DIR. Nada em $REPO_DIR foi alterado"
echo "  além da cópia dos 2 scripts de teste em $OPERACOES_DESTINO. Nenhum commit/push foi executado."
