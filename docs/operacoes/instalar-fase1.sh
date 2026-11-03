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
#   2. Confere o SHA-256 de CADA arquivo contra hashes EMBUTIDOS neste instalador
#      (manifesto vigente) e ABORTA com mensagem clara em caso de divergência;
#   3. Valida a sintaxe do stream.js baixado com node --check;
#   4. Copia APENAS os dois scripts de teste/aplicação para
#      /root/cursos-api/docs/operacoes/ com cp --preserve (timestamps e modo),
#      criando o diretório se necessário. NENHUM outro arquivo do repositório
#      é criado, alterado ou removido.
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

# ==============================================================================
# MANIFESTO DE INTEGRIDADE: hashes SHA-256 EMBUTIDOS (devem bater com
# docs/fase1/VERIFICACAO_ARTEFATOS.md e com o app da prévia, aba Fase 1).
# Formato: <hash>  <caminho relativo a partir de $CANDIDATOS_DIR>
# ==============================================================================
read -r -d '' MANIFESTO_SHA256 <<'EOF_SHA' || true
2be71f49646bde330ec0c822ff611be9e173e44c2057d23f381c81ef94e1e07b  src/routes/stream.js
3d9501a300d8b4e7a3ec11cc0a66d548f7663e6e87f2e1a47321e06fa536f0e4  src/static/painel-mentor.html
168e37dc0bd59a16f272a8c3d8e578ba33cd7c768991fa9a7ffccbe5b9bc5d11  docs/fase1/INTEGRACAO_FASE1.md
e9b2513de5553e1e40eb617b7b15a6b5a3e1438fa5a48483f3e27150a294f4a3  docs/fase1/PROPOSTA_PROVAS.md
3312c1404c0429fec033bd2f27ddc54aa5017e2978931dc150c95029a502f664  docs/fase1/REVISAO_FASE1.md
38a6ec1552a46e1074e50d536cf0ba7493eef250bc44618e7751c8a14ec7a59a  docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md
e927c9c054238e55eefea2b27429bb7b05cdcd5d1ec5ce1e6e0261c470196253  docs/operacoes/testar-fase1-vps.sh
c93f06b9968452309ec95ba8d133038a8e1e7bd66ff852b86a8ff39fa1cf8743  docs/operacoes/aplicar-fase1-vps.sh
EOF_SHA

# Lista de downloads: <caminho do artefato na ORIGEM>|<destino relativo a $CANDIDATOS_DIR>
# stream.js e painel-mentor.html vão para os caminhos finais (src/routes/ e src/static/)
# para que os scripts de teste e o diff do operador os encontrem onde serão aplicados;
# os demais ficam em subpastas espelhadas de docs/. Todos os 8 são conferidos contra
# o MANIFESTO_SHA256 acima. VERIFICACAO_ARTEFATOS.md e o instalador em si não entram
# na lista: o instalador é o próprio script em execução e VERIFICACAO_ARTEFATOS.md é
# o documento que registra os hashes (ambos disponíveis para download manual na prévia).
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

# Confere o SHA-256 de UM arquivo contra o hash embutido esperado.
verificar_hash_unico() {
  local caminho="$1"
  local esperado="$2"
  local nome="$3"
  local calculado
  if command -v sha256sum >/dev/null 2>&1; then
    calculado=$(sha256sum "$caminho" | awk '{print $1}')
  elif command -v shasum >/dev/null 2>&1; then
    calculado=$(shasum -a 256 "$caminho" | awk '{print $1}')
  else
    log_erro "Nem sha256sum nem shasum disponíveis nesta VPS — não é possível conferir integridade."
    exit 1
  fi
  if [ "$calculado" != "$esperado" ]; then
    log_erro "=============================================================="
    log_erro "FALHA DE INTEGRIDADE SHA-256: $nome"
    log_erro "  Esperado: $esperado"
    log_erro "  Obtido:   $calculado"
    log_erro "O arquivo baixado NÃO confere com o manifesto oficial."
    log_erro "Instalação ABORTADA — nada foi alterado fora de /tmp."
    log_erro "=============================================================="
    exit 1
  fi
  log_ok "SHA-256 confere: $nome"
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
log_info "1/5. Baixando os 8 artefatos da origem informada (curl com fallback wget)..."

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

log_info "2/5. Conferindo SHA-256 de cada arquivo contra o manifesto EMBUTIDO..."
while IFS= read -r linha; do
  [ -z "$linha" ] && continue
  hash_esperado=$(echo "$linha" | awk '{print $1}')
  caminho_rel=$(echo "$linha" | awk '{print $2}')
  verificar_hash_unico "$CANDIDATOS_DIR/$caminho_rel" "$hash_esperado" "$caminho_rel"
done <<EOF_SHA
$MANIFESTO_SHA256
EOF_SHA

log_info "3/5. Validando sintaxe do stream.js com node --check..."
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

log_info "4/5. Copiando os 2 scripts de teste para $OPERACOES_DESTINO (com --preserve)..."
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

log_info "5/5. Próximos passos para o operador (na VPS):"
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
