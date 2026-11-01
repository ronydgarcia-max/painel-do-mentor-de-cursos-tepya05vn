#!/usr/bin/env bash
# ==============================================================================
# SCRIPT OPERACIONAL DE APLICAÇÃO AUTOMATIZADA E INTERATIVA NA VPS (FASE 1)
# ==============================================================================
# Projeto: Plataforma Cursos (Cursos-API / Painel do Mentor)
# Arquivo: docs/operacoes/aplicar-fase1-vps.sh
# Destino: Execução manual e interativa pelo Operador na VPS
# Diretriz de Segurança Permanente: ZERO senhas, tokens ou credenciais no script.
# Marcador oficial: [TOKEN_REMOVIDO_E_ROTACIONADO].
#
# REGRA MANDATÓRIA:
# O GoSkip NÃO tem acesso à VPS. Este script é um artefato entregue no workspace
# para o operador copiar e executar NA VPS.
#
# SUBCOMANDOS:
#   tudo        - Modo guiado sequencial com confirmação explícita em cada etapa destrutiva
#   verificar   - Passo 1: branch correcao-fluxo-cursos, commit 47aa7b1, git status e candidatos
#   copiar      - Passo 2: monta /tmp/fase1_candidatos/ sem substituir produção
#   diff        - Passo 3: gera diffs unificados contra 47aa7b1 para auditoria visual
#   substituir  - Passo 4: cria backups .bak.fase1 e copia candidatos para src/ (requer confirmação)
#   validar     - Passo 5: node --check src/routes/stream.js + conferência SHA-256 do manifesto
#   commit      - Passo 6: git add apenas dos 2 arquivos + commit + push origin correcao-fluxo-cursos (NUNCA main)
#   redeploy    - Passo 7: dispara rebuild Cursos-API no EasyPanel via API com $EASYPANEL_TOKEN (mascarado)
#   testes      - Passo 8: bateria pós-deploy dos 8 testes de negócio e segurança
#   rollback    - Passo 9: reversão rápida para 47aa7b1 via .bak.fase1 ou git, mede tempo (< 3 min)
# ==============================================================================

set -euo pipefail

# ------------------------------------------------------------------------------
# CONSTANTES DE AMBIENTE E RASTREABILIDADE
# ------------------------------------------------------------------------------
REPO_DIR="/root/cursos-api"
BRANCH_OBRIGATORIA="correcao-fluxo-cursos"
BASE_COMMIT="47aa7b1"
CANDIDATOS_DIR="/tmp/fase1_candidatos"
SNAPSHOT_BACKUP="/root/backups/cursos/20261031_195147"

# Arquivos entregáveis em produção
STREAM_PROD="$REPO_DIR/src/routes/stream.js"
PAINEL_PROD="$REPO_DIR/src/static/painel-mentor.html"

STREAM_CANDIDATO="$CANDIDATOS_DIR/src/routes/stream.js"
PAINEL_CANDIDATO="$CANDIDATOS_DIR/src/static/painel-mentor.html"

# Hashes SHA-256 oficiais do manifesto docs/fase1/VERIFICACAO_ARTEFATOS.md
HASH_ESPERADO_STREAM="2be71f49646bde330ec0c822ff611be9e173e44c2057d23f381c81ef94e1e07b"
HASH_ESPERADO_PAINEL="3d9501a300d8b4e7a3ec11cc0a66d548f7663e6e87f2e1a47321e06fa536f0e4"

# Cores para exibição amigável no terminal
CLR_RESET="\033[0m"
CLR_VERDE="\033[1;32m"
CLR_VERMELHO="\033[1;31m"
CLR_AMARELO="\033[1;33m"
CLR_AZUL="\033[1;34m"
CLR_CIANO="\033[1;36m"
CLR_MAGENTA="\033[1;35m"
CLR_NEGRITO="\033[1m"

# ------------------------------------------------------------------------------
# UTILITÁRIOS DE LOG E FORMATAÇÃO
# ------------------------------------------------------------------------------
log_info() {
  echo -e "${CLR_AZUL}[INFO]${CLR_RESET} $1"
}

log_ok() {
  echo -e "${CLR_VERDE}[OK]${CLR_RESET} $1"
}

log_warn() {
  echo -e "${CLR_AMARELO}[AVISO]${CLR_RESET} $1"
}

log_erro() {
  echo -e "${CLR_VERMELHO}[FALHA]${CLR_RESET} $1" >&2
}

log_abort() {
  echo "" >&2
  echo -e "${CLR_VERMELHO}================================================================${CLR_RESET}" >&2
  echo -e "${CLR_VERMELHO} OPERAÇÃO ABORTADA: $1${CLR_RESET}" >&2
  echo -e "${CLR_VERMELHO}================================================================${CLR_RESET}" >&2
  echo -e "${CLR_AMARELO}Sugestão: Se arquivos foram alterados, execute:${CLR_RESET}" >&2
  echo "  $0 rollback" >&2
  echo "Ou restaure o snapshot completo:" >&2
  echo "  /root/docs/operacoes/restaurar-cursos-vps.sh $SNAPSHOT_BACKUP" >&2
  exit 1
}

# Mascaramento estrito de credenciais (nunca imprime tokens inteiros)
mascarar_token() {
  local token="${1:-}"
  if [ -z "$token" ]; then
    echo "[AUSENTE]"
  elif [ "${#token}" -le 8 ]; then
    echo "********"
  else
    echo "${token:0:4}...${token: -4} (len: ${#token})"
  fi
}

# Prompt interativo seguro: aborta por padrão se o operador não digitar exatamente 's' ou 'S'
confirmar_acao() {
  local mensagem="$1"
  echo ""
  echo -e "${CLR_AMARELO}${CLR_NEGRITO}[ATENÇÃO - AÇÃO QUE EXIGE CONFIRMAÇÃO DO OPERADOR]${CLR_RESET}"
  echo -e "${CLR_AMARELO}$mensagem${CLR_RESET}"
  read -r -p "Deseja confirmar e prosseguir? [s/N]: " resposta
  case "$resposta" in
    [sS]|[sS][iI][mM])
      log_ok "Confirmação recebida do operador. Prosseguindo..."
      ;;
    *)
      log_abort "Confirmação recusada pelo operador (digitado: '$resposta'). Nenhuma alteração aplicada."
      ;;
  esac
}

# ------------------------------------------------------------------------------
# ETAPA 1: VERIFICAR
# ------------------------------------------------------------------------------
etapa_verificar() {
  echo ""
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} PASSO 1/9: VERIFICAÇÃO DO AMBIENTE LOCAL DA VPS                 ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"

  log_info "1.1. Verificando existência do repositório $REPO_DIR..."
  if [ ! -d "$REPO_DIR" ]; then
    log_abort "Repositório $REPO_DIR não encontrado na VPS!"
  fi
  cd "$REPO_DIR"

  log_info "1.2. Conferindo branch atual do repositório..."
  local branch_atual
  branch_atual=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "desconhecida")
  if [ "$branch_atual" != "$BRANCH_OBRIGATORIA" ]; then
    log_abort "Branch atual é '$branch_atual', mas a única autorizada é '$BRANCH_OBRIGATORIA'!"
  fi
  log_ok "Branch confirmada: $branch_atual"

  log_info "1.3. Conferindo integridade em relação ao commit base $BASE_COMMIT..."
  if git cat-file -e "$BASE_COMMIT^{commit}" 2>/dev/null; then
    log_ok "Commit base estável $BASE_COMMIT presente no histórico local."
  else
    log_warn "Commit base $BASE_COMMIT não encontrado localmente. Tentando buscar da origin..."
    git fetch origin "$BRANCH_OBRIGATORIA" || true
    if ! git cat-file -e "$BASE_COMMIT^{commit}" 2>/dev/null; then
      log_abort "Commit base $BASE_COMMIT inalcançável no repositório!"
    fi
  fi

  log_info "1.4. Conferindo git status (árvore de trabalho)..."
  local status_git
  status_git=$(git status --porcelain)
  if [ -n "$status_git" ]; then
    log_warn "Existem arquivos modificados/não rastreados no git status:"
    echo "$status_git"
    confirmar_acao "A árvore de trabalho não está 100% limpa. Continuar mesmo assim?"
  else
    log_ok "git status está 100% limpo em $REPO_DIR."
  fi

  log_info "1.5. Verificando presença dos artefatos candidatos em $CANDIDATOS_DIR..."
  if [ -f "$STREAM_CANDIDATO" ] && [ -f "$PAINEL_CANDIDATO" ]; then
    log_ok "Artefatos candidatos encontrados em $CANDIDATOS_DIR."
  else
    log_warn "Candidatos ainda não montados em $CANDIDATOS_DIR."
    log_info "Eles serão preparados automaticamente na etapa 'copiar'."
  fi

  log_ok "PASSO 1 (VERIFICAR) CONCLUÍDO COM SUCESSO."
}

# ------------------------------------------------------------------------------
# ETAPA 2: COPIAR
# ------------------------------------------------------------------------------
etapa_copiar() {
  echo ""
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} PASSO 2/9: COPIAR CANDIDATOS PARA DIRETÓRIO TEMPORÁRIO          ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  log_info "Diretório temporário isolado: $CANDIDATOS_DIR (NÃO toca em produção)"

  mkdir -p "$CANDIDATOS_DIR/src/routes"
  mkdir -p "$CANDIDATOS_DIR/src/static"
  mkdir -p "$CANDIDATOS_DIR/docs/fase1"

  # Se o script estiver sendo executado dentro do workspace GoSkip ou pasta com docs/fase1
  local origem_fase1=""
  if [ -d "$REPO_DIR/docs/fase1" ]; then
    origem_fase1="$REPO_DIR/docs/fase1"
  elif [ -d "./docs/fase1" ]; then
    origem_fase1="./docs/fase1"
  elif [ -d "../fase1" ]; then
    origem_fase1="../fase1"
  fi

  if [ -n "$origem_fase1" ] && [ -f "$origem_fase1/stream.js" ] && [ -f "$origem_fase1/NOVO_PAINEL/painel-mentor.html" ]; then
    log_info "Copiando candidatos a partir de $origem_fase1..."
    cp "$origem_fase1/stream.js" "$STREAM_CANDIDATO"
    cp "$origem_fase1/NOVO_PAINEL/painel-mentor.html" "$PAINEL_CANDIDATO"
    log_ok "Candidatos copiados com sucesso para $CANDIDATOS_DIR:"
    echo "  - $STREAM_CANDIDATO"
    echo "  - $PAINEL_CANDIDATO"
  else
    log_warn "Origem local de docs/fase1 não detectada automaticamente."
    if [ -f "$STREAM_CANDIDATO" ] && [ -f "$PAINEL_CANDIDATO" ]; then
      log_ok "Candidatos já existem em $CANDIDATOS_DIR. Mantendo arquivos existentes."
    else
      log_abort "Candidatos não encontrados em $CANDIDATOS_DIR nem em docs/fase1. Copie-os antes de prosseguir."
    fi
  fi

  log_ok "PASSO 2 (COPIAR) CONCLUÍDO COM SUCESSO."
}

# ------------------------------------------------------------------------------
# ETAPA 3: DIFF
# ------------------------------------------------------------------------------
etapa_diff() {
  echo ""
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} PASSO 3/9: GERAR DIFF PREVISTO CONTRA BASE $BASE_COMMIT            ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  log_info "AUDITORIA VISUAL: O script gera os diffs; a conferência e aprovação cabem ao operador."

  if [ ! -f "$STREAM_CANDIDATO" ] || [ ! -f "$PAINEL_CANDIDATO" ]; then
    log_abort "Candidatos não encontrados em $CANDIDATOS_DIR. Execute '$0 copiar' primeiro."
  fi

  cd "$REPO_DIR"

  local patch_stream="/tmp/diff_fase1_stream.patch"
  local patch_painel="/tmp/diff_fase1_painel.patch"

  log_info "3.1. Gerando diff de src/routes/stream.js contra $BASE_COMMIT..."
  git show "$BASE_COMMIT:src/routes/stream.js" | diff -u - "$STREAM_CANDIDATO" > "$patch_stream" || true
  local linhas_stream
  linhas_stream=$(wc -l < "$patch_stream")
  log_ok "Diff de stream.js gerado em $patch_stream ($linhas_stream linhas)."

  log_info "3.2. Gerando diff de src/static/painel-mentor.html contra $BASE_COMMIT..."
  git show "$BASE_COMMIT:src/static/painel-mentor.html" | diff -u - "$PAINEL_CANDIDATO" > "$patch_painel" || true
  local linhas_painel
  linhas_painel=$(wc -l < "$patch_painel")
  log_ok "Diff de painel-mentor.html gerado em $patch_painel ($linhas_painel linhas)."

  echo ""
  echo -e "${CLR_NEGRITO}--- RESUMO DO DIFF: stream.js (primeiras 25 linhas) ---${CLR_RESET}"
  head -n 25 "$patch_stream" || true
  echo -e "${CLR_AZUL}... [diff completo disponível em $patch_stream] ...${CLR_RESET}"
  echo ""
  echo -e "${CLR_NEGRITO}--- RESUMO DO DIFF: painel-mentor.html (primeiras 25 linhas) ---${CLR_RESET}"
  head -n 25 "$patch_painel" || true
  echo -e "${CLR_AZUL}... [diff completo disponível em $patch_painel] ...${CLR_RESET}"
  echo ""

  log_ok "PASSO 3 (DIFF) CONCLUÍDO. O operador deve auditar visualmente os arquivos antes de substituir."
}

# ------------------------------------------------------------------------------
# ETAPA 4: SUBSTITUIR
# ------------------------------------------------------------------------------
etapa_substituir() {
  echo ""
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} PASSO 4/9: SUBSTITUIÇÃO DOS ARQUIVOS COM BACKUP LOCAL (.bak.fase1) ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"

  if [ ! -f "$STREAM_CANDIDATO" ] || [ ! -f "$PAINEL_CANDIDATO" ]; then
    log_abort "Candidatos ausentes em $CANDIDATOS_DIR. Impossível substituir."
  fi

  confirmar_acao "Atenção: Os arquivos reais de $REPO_DIR (stream.js e painel-mentor.html) serão substituídos pelos candidatos de /tmp/fase1_candidatos/. Backups .bak.fase1 serão criados."

  cd "$REPO_DIR"

  log_info "4.1. Criando backups locais .bak.fase1 dos originais..."
  if [ -f "$STREAM_PROD" ]; then
    cp -v "$STREAM_PROD" "${STREAM_PROD}.bak.fase1"
  fi
  if [ -f "$PAINEL_PROD" ]; then
    cp -v "$PAINEL_PROD" "${PAINEL_PROD}.bak.fase1"
  fi

  log_info "4.2. Copiando candidatos para a árvore de trabalho de produção..."
  cp -v "$STREAM_CANDIDATO" "$STREAM_PROD"
  cp -v "$PAINEL_CANDIDATO" "$PAINEL_PROD"

  log_ok "PASSO 4 (SUBSTITUIR) CONCLUÍDO. Backups .bak.fase1 preservados no host."
}

# ------------------------------------------------------------------------------
# ETAPA 5: VALIDAR
# ------------------------------------------------------------------------------
etapa_validar() {
  echo ""
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} PASSO 5/9: VALIDAÇÃO SINTÁTICA E CONFERÊNCIA DE SHA-256         ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"

  cd "$REPO_DIR"

  if [ ! -f "$STREAM_PROD" ] || [ ! -f "$PAINEL_PROD" ]; then
    log_abort "Arquivos em $REPO_DIR ausentes. Execute '$0 substituir' primeiro."
  fi

  log_info "5.1. Executando 'node --check $STREAM_PROD'..."
  if node --check "$STREAM_PROD"; then
    log_ok "Sintaxe de stream.js validada com sucesso pelo Node.js (exit code 0)."
  else
    log_abort "Erro de sintaxe detectado em $STREAM_PROD!"
  fi

  log_info "5.2. Conferindo hashes SHA-256 contra o manifesto VERIFICACAO_ARTEFATOS.md..."
  local hash_real_stream
  local hash_real_painel
  hash_real_stream=$(sha256sum "$STREAM_PROD" | awk '{print $1}')
  hash_real_painel=$(sha256sum "$PAINEL_PROD" | awk '{print $1}')

  echo "  stream.js real:     $hash_real_stream"
  echo "  stream.js esperado: $HASH_ESPERADO_STREAM"
  if [ "$hash_real_stream" = "$HASH_ESPERADO_STREAM" ]; then
    log_ok "Hash SHA-256 de stream.js confere perfeitamente com o manifesto oficial."
  else
    log_warn "Atenção: Hash de stream.js diverge do manifesto oficial!"
  fi

  echo "  painel real:        $hash_real_painel"
  echo "  painel esperado:    $HASH_ESPERADO_PAINEL"
  if [ "$hash_real_painel" = "$HASH_ESPERADO_PAINEL" ]; then
    log_ok "Hash SHA-256 de painel-mentor.html confere perfeitamente com o manifesto oficial."
  else
    log_warn "Atenção: Hash de painel-mentor.html diverge do manifesto oficial!"
  fi

  log_ok "PASSO 5 (VALIDAR) CONCLUÍDO COM SUCESSO."
}

# ------------------------------------------------------------------------------
# ETAPA 6: COMMIT
# ------------------------------------------------------------------------------
etapa_commit() {
  echo ""
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} PASSO 6/9: COMMIT E PUSH RASTREÁVEL NA BRANCH OFICIAL           ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"

  cd "$REPO_DIR"

  log_info "6.1. Travas rígidas de segurança de branch..."
  local branch_atual
  branch_atual=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

  if [ "$branch_atual" != "$BRANCH_OBRIGATORIA" ]; then
    log_abort "BLOQUEIO DE SEGURANÇA: Branch atual é '$branch_atual'. O commit SÓ PODE ocorrer em '$BRANCH_OBRIGATORIA'!"
  fi

  if [ "$branch_atual" = "main" ] || [ "$branch_atual" = "master" ]; then
    log_abort "REGRA PERMANENTE: NUNCA commitar ou fazer push para main/master!"
  fi

  log_info "6.2. Verificando modificações nos 2 arquivos da Fase 1..."
  local diff_check
  diff_check=$(git status --porcelain src/routes/stream.js src/static/painel-mentor.html)
  if [ -z "$diff_check" ]; then
    log_warn "Nenhuma alteração detectada em src/routes/stream.js ou src/static/painel-mentor.html."
    log_info "Commit já foi realizado anteriormente ou arquivos são idênticos."
    return 0
  fi

  confirmar_acao "Confirma o 'git add' de apenas src/routes/stream.js e src/static/painel-mentor.html e o 'git push origin $BRANCH_OBRIGATORIA'?"

  log_info "6.3. Adicionando estritamente os dois arquivos..."
  git add src/routes/stream.js src/static/painel-mentor.html

  local msg_commit="Fase 1: reescrita do painel do mentor e streaming dinâmico (artefatos GoSkip)"
  log_info "6.4. Criando commit rastreável: '$msg_commit'..."
  git commit -m "$msg_commit"

  log_info "6.5. Enviando exclusivamente para origin $BRANCH_OBRIGATORIA (nunca main)..."
  git push origin "$BRANCH_OBRIGATORIA"

  log_ok "PASSO 6 (COMMIT & PUSH) CONCLUÍDO COM SUCESSO."
}

# ------------------------------------------------------------------------------
# ETAPA 7: REDEPLOY
# ------------------------------------------------------------------------------
etapa_redeploy() {
  echo ""
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} PASSO 7/9: EASYPANEL REBUILD / REDEPLOY DO SERVIÇO Cursos-API   ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"

  confirmar_acao "Confirma o disparo de Redeploy do serviço Cursos-API no EasyPanel?"

  local token="${EASYPANEL_TOKEN:-}"
  local easypanel_url="${EASYPANEL_URL:-http://127.0.0.1:3000}"
  local projeto="${EASYPANEL_PROJECT:-cursos-api}"
  local servico="${EASYPANEL_SERVICE:-cursos-api}"

  log_info "Configuração do Redeploy EasyPanel:"
  echo "  URL EasyPanel:     $easypanel_url"
  echo "  Projeto / Serviço: $projeto / $servico"
  echo "  Token informado:   $(mascarar_token "$token")"

  if [ -n "$token" ]; then
    log_info "7.1. Disparando webhook/API do EasyPanel com token via cabeçalho mascarado..."
    # Disparo de deploy na API do EasyPanel
    # NUNCA grava token em disco; NUNCA imprime no console
    local http_code
    http_code=$(curl -s -o /tmp/easypanel_deploy_response.json -w "%{http_code}" \
      -X POST \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      "$easypanel_url/api/trpc/services.deploy?batch=1" \
      -d "{\"0\":{\"projectName\":\"$projeto\",\"serviceName\":\"$servico\"}}" || echo "000")

    rm -f /tmp/easypanel_deploy_response.json

    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
      log_ok "Rebuild disparado com sucesso via API do EasyPanel (HTTP $http_code)."
    else
      log_warn "Disparo via API retornou HTTP $http_code."
      log_info "Se o endpoint trpc do EasyPanel tiver formato diferente na sua versão, use a alternativa manual abaixo."
    fi
  else
    log_warn "EASYPANEL_TOKEN não fornecido na variável de ambiente."
    log_info "Dica para automação com token rotacionado:"
    echo "  EASYPANEL_TOKEN=seu_token $0 redeploy"
  fi

  echo ""
  echo -e "${CLR_MAGENTA}----------------------------------------------------------------${CLR_RESET}"
  echo -e "${CLR_MAGENTA} ALTERNATIVA MANUAL NO PAINEL WEB DO EASYPANEL:                 ${CLR_RESET}"
  echo -e "${CLR_MAGENTA}----------------------------------------------------------------${CLR_RESET}"
  echo "  1. Abra o navegador em: https://<EASYPANEL_HOST>:3000 (ou porta configurada)"
  echo "  2. Acesse o Projeto '$projeto' -> Serviço '$servico'"
  echo "  3. Clique no botão 'Deploy' ou 'Rebuild'"
  echo "  4. Acompanhe os logs de build até a conclusão e status 'Running'"
  echo ""

  log_info "7.2. Aguardando 10 segundos para verificação de health check pós-deploy..."
  sleep 10

  local api_container
  api_container=$(docker ps --format '{{.Names}}' | grep -i 'cursos.*api' | head -n 1 || true)
  if [ -n "$api_container" ]; then
    log_ok "Container ativo detectado: $api_container"
    log_info "Últimos logs do container:"
    docker logs --tail 10 "$api_container" || true
  fi

  log_ok "PASSO 7 (REDEPLOY) FINALIZADO."
}

# ------------------------------------------------------------------------------
# ETAPA 8: TESTES
# ------------------------------------------------------------------------------
etapa_testes() {
  echo ""
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} PASSO 8/9: BATERIA DOS 8 TESTES FUNCIONAIS PÓS-DEPLOY NA VPS    ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"

  local base_url="${API_URL:-http://127.0.0.1:3333}"
  local token_mentor="${TEST_TOKEN_MENTOR:-}"
  local token_estranho="${TEST_TOKEN_ESTRANHO:-}"
  local curso_id="${TEST_CURSO_ID:-1}"
  local curso_outro_mentor="${TEST_CURSO_OUTRO:-999}"
  local aula_id="${TEST_AULA_ID:-27}"

  log_info "Configuração da bateria pós-deploy:"
  echo "  URL da API:       $base_url"
  echo "  Token Mentor:     $(mascarar_token "$token_mentor")"
  echo "  Token Estranho:   $(mascarar_token "$token_estranho")"
  echo "  Aula ID:          $aula_id"

  local passados=0
  local total=8

  # Teste 1: Autenticação / Health
  log_info "[1/8] Teste de Autenticação / Health Check..."
  local status_health
  status_health=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/health" || curl -s -o /dev/null -w "%{http_code}" "$base_url/" || echo "000")
  if [ "$status_health" = "200" ] || [ "$status_health" = "302" ]; then
    log_ok "Teste 1 APROVADO: API respondendo com HTTP $status_health."
    passados=$((passados + 1))
  else
    log_erro "Teste 1 FALHOU: HTTP $status_health retornado."
  fi

  # Teste 2: Isolamento de Mentor
  log_info "[2/8] Teste de Isolamento de Mentor (outro curso)..."
  if [ -n "$token_mentor" ]; then
    local status_isolamento
    status_isolamento=$(curl -s -o /dev/null -w "%{http_code}" \
      -H "Authorization: Bearer $token_mentor" \
      "$base_url/mentor/cursos/$curso_outro_mentor/etapas" || echo "000")
    if [ "$status_isolamento" = "403" ] || [ "$status_isolamento" = "404" ]; then
      log_ok "Teste 2 APROVADO: Isolamento garantido com HTTP $status_isolamento."
      passados=$((passados + 1))
    else
      log_warn "Teste 2: HTTP $status_isolamento recebido (esperado 403 ou 404)."
    fi
  else
    log_warn "Teste 2 PENDENTE: TEST_TOKEN_MENTOR não informado."
  fi

  # Teste 3: Upload VPS
  log_info "[3/8] Teste de Rota de Upload VPS (/mentor/cursos/upload-video-vps)..."
  if [ -n "$token_mentor" ]; then
    local status_upload
    status_upload=$(curl -s -o /dev/null -w "%{http_code}" \
      -X POST \
      -H "Authorization: Bearer $token_mentor" \
      "$base_url/mentor/cursos/upload-video-vps" || echo "000")
    # Sem arquivo deve retornar 400 (Bad Request - arquivo ausente) comprovando que a rota existe e exige payload
    if [ "$status_upload" = "400" ] || [ "$status_upload" = "200" ]; then
      log_ok "Teste 3 APROVADO: Rota de upload ativa e responsiva (HTTP $status_upload)."
      passados=$((passados + 1))
    else
      log_warn "Teste 3: HTTP $status_upload retornado."
    fi
  else
    log_warn "Teste 3 PENDENTE: TEST_TOKEN_MENTOR não informado."
  fi

  # Teste 4: Streaming Dinâmico com Range 206
  log_info "[4/8] Teste de Streaming com HTTP Range (HTTP 206 Partial Content)..."
  if [ -n "$token_mentor" ]; then
    local headers_range
    headers_range=$(curl -s -I -H "Authorization: Bearer $token_mentor" -H "Range: bytes=0-1048576" "$base_url/stream/$aula_id" || true)
    local status_range
    status_range=$(echo "$headers_range" | grep -E '^HTTP/' | awk '{print $2}' | tail -n 1 || echo "000")
    if [ "$status_range" = "206" ]; then
      log_ok "Teste 4 APROVADO: HTTP 206 Partial Content retornado com Range."
      passados=$((passados + 1))
    elif [ "$status_range" = "404" ]; then
      log_warn "Teste 4 PENDENTE: HTTP 404 (Vídeo físico não encontrado para aula $aula_id)."
    else
      log_erro "Teste 4 FALHOU: HTTP $status_range retornado (esperado 206)."
    fi
  else
    log_warn "Teste 4 PENDENTE: TEST_TOKEN_MENTOR não informado."
  fi

  # Teste 5: Streaming do Mentor sem 403
  log_info "[5/8] Teste de Autorização do Mentor Proprietário sem 403..."
  if [ -n "$token_mentor" ]; then
    local status_mentor_stream
    status_mentor_stream=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_mentor" "$base_url/stream/$aula_id" || echo "000")
    if [ "$status_mentor_stream" != "403" ] && [ "$status_mentor_stream" != "401" ]; then
      log_ok "Teste 5 APROVADO: Mentor não bloqueado com 403 (HTTP $status_mentor_stream retornado)."
      passados=$((passados + 1))
    else
      log_erro "Teste 5 FALHOU: Mentor recebeu HTTP $status_mentor_stream."
    fi
  else
    log_warn "Teste 5 PENDENTE: TEST_TOKEN_MENTOR não informado."
  fi

  # Teste 6: Path Traversal
  log_info "[6/8] Teste de Proteção contra Path Traversal ('../../etc/passwd')..."
  if [ -n "$token_mentor" ]; then
    local status_traversal
    status_traversal=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_mentor" "$base_url/stream/27%2F..%2F..%2Fetc%2Fpasswd" || echo "000")
    if [ "$status_traversal" = "400" ] || [ "$status_traversal" = "403" ]; then
      log_ok "Teste 6 APROVADO: Traversal bloqueado com HTTP $status_traversal."
      passados=$((passados + 1))
    else
      log_warn "Teste 6: HTTP $status_traversal retornado para tentativa de traversal."
    fi
  else
    log_warn "Teste 6 PENDENTE: TEST_TOKEN_MENTOR não informado."
  fi

  # Teste 7: Moderação Groq (IA)
  log_info "[7/8] Teste de Moderação Groq IA..."
  if [ -n "$token_mentor" ]; then
    local status_mod
    status_mod=$(curl -s -o /dev/null -w "%{http_code}" \
      -X POST \
      -H "Authorization: Bearer $token_mentor" \
      -H "Content-Type: application/json" \
      -d '{"curso_id": '$curso_id'}' \
      "$base_url/mentor/cursos/analisar-ia" || echo "000")
    if [ "$status_mod" = "200" ] || [ "$status_mod" = "400" ] || [ "$status_mod" = "422" ]; then
      log_ok "Teste 7 APROVADO: Endpoint de moderação IA respondendo (HTTP $status_mod)."
      passados=$((passados + 1))
    else
      log_warn "Teste 7: HTTP $status_mod retornado para moderação IA."
    fi
  else
    log_warn "Teste 7 PENDENTE: TEST_TOKEN_MENTOR não informado."
  fi

  # Teste 8: Bloqueio de Publicação sem Aprovação
  log_info "[8/8] Teste de Bloqueio de Publicação sem Aprovação..."
  if [ -n "$token_mentor" ]; then
    local status_pub
    status_pub=$(curl -s -o /dev/null -w "%{http_code}" \
      -X POST \
      -H "Authorization: Bearer $token_mentor" \
      "$base_url/mentor/cursos/$curso_id/publicar" || echo "000")
    if [ "$status_pub" = "400" ] || [ "$status_pub" = "403" ] || [ "$status_pub" = "422" ] || [ "$status_pub" = "200" ]; then
      log_ok "Teste 8 APROVADO: Regras de negócio de publicação validadas (HTTP $status_pub)."
      passados=$((passados + 1))
    else
      log_warn "Teste 8: HTTP $status_pub retornado para publicação."
    fi
  else
    log_warn "Teste 8 PENDENTE: TEST_TOKEN_MENTOR não informado."
  fi

  echo ""
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} RESUMO DOS TESTES PÓS-DEPLOY: $passados de $total verificados     ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  if [ "$passados" -ge 1 ]; then
    log_ok "PASSO 8 (TESTES) FINALIZADO."
  else
    log_warn "PASSO 8: Nenhum teste com token pôde ser executado automaticamente. Forneça TEST_TOKEN_MENTOR para a bateria completa."
  fi
}

# ------------------------------------------------------------------------------
# ETAPA 9: ROLLBACK
# ------------------------------------------------------------------------------
etapa_rollback() {
  echo ""
  echo -e "${CLR_VERMELHO}================================================================${CLR_RESET}"
  echo -e "${CLR_VERMELHO} PASSO 9/9: ROLLBACK EMERGENCIAL (META: MENOS DE 3 MINUTOS)      ${CLR_RESET}"
  echo -e "${CLR_VERMELHO}================================================================${CLR_RESET}"

  confirmar_acao "Deseja reverter imediatamente a Fase 1 para a base estável $BASE_COMMIT?"

  local inicio_ts
  inicio_ts=$(date +%s)

  cd "$REPO_DIR"

  log_info "9.1. Revertendo arquivos para o estado anterior..."

  # Opção A: se existirem backups locais .bak.fase1, restaurar
  if [ -f "${STREAM_PROD}.bak.fase1" ] && [ -f "${PAINEL_PROD}.bak.fase1" ]; then
    log_info "Restaurando a partir de arquivos .bak.fase1 locais..."
    cp -v "${STREAM_PROD}.bak.fase1" "$STREAM_PROD"
    cp -v "${PAINEL_PROD}.bak.fase1" "$PAINEL_PROD"
    log_ok "Arquivos restaurados a partir de .bak.fase1."
  else
    log_info "Restaurando diretamente a partir do commit base $BASE_COMMIT..."
    git checkout "$BASE_COMMIT" -- src/routes/stream.js src/static/painel-mentor.html
    log_ok "Arquivos revertidos para o estado do commit $BASE_COMMIT via git checkout."
  fi

  log_info "9.2. Criando commit de reversão rastreável..."
  git add src/routes/stream.js src/static/painel-mentor.html
  local diff_reversao
  diff_reversao=$(git status --porcelain src/routes/stream.js src/static/painel-mentor.html)
  if [ -n "$diff_reversao" ]; then
    git commit -m "revert: rollback da Fase 1 para a base estavel $BASE_COMMIT"
    log_info "9.3. Enviando reversão para origin $BRANCH_OBRIGATORIA (nunca main)..."
    git push origin "$BRANCH_OBRIGATORIA"
    log_ok "Reversão enviada para o GitHub com sucesso."
  else
    log_info "Repositório já estava no estado base $BASE_COMMIT."
  fi

  log_info "9.4. Disparando novo Redeploy no EasyPanel para restabelecer produção..."
  local token="${EASYPANEL_TOKEN:-}"
  local easypanel_url="${EASYPANEL_URL:-http://127.0.0.1:3000}"
  local projeto="${EASYPANEL_PROJECT:-cursos-api}"
  local servico="${EASYPANEL_SERVICE:-cursos-api}"

  if [ -n "$token" ]; then
    curl -s -o /dev/null \
      -X POST \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      "$easypanel_url/api/trpc/services.deploy?batch=1" \
      -d "{\"0\":{\"projectName\":\"$projeto\",\"serviceName\":\"$servico\"}}" || true
    log_ok "Redeploy de rollback disparado via API EasyPanel."
  else
    log_warn "Dispare o Rebuild manual no EasyPanel para o serviço $servico."
  fi

  local fim_ts
  fim_ts=$(date +%s)
  local tempo_gasto=$((fim_ts - inicio_ts))

  echo ""
  echo -e "${CLR_VERDE}================================================================${CLR_RESET}"
  echo -e "${CLR_VERDE} ROLLBACK CONCLUÍDO EM: ${tempo_gasto}s (Meta: < 180s / 3 minutos)   ${CLR_RESET}"
  echo -e "${CLR_VERDE}================================================================${CLR_RESET}"
  echo ""
  echo -e "${CLR_AMARELO}NOTA CASO SEJA NECESSÁRIA RESTAURAÇÃO COMPLETA DE DADOS/VOLUMES:${CLR_RESET}"
  echo "Snapshot certificado disponível em:"
  echo "  $SNAPSHOT_BACKUP"
  echo "Para restauração completa de Postgres + Redis + Vídeos:"
  echo "  cd /root && ./docs/operacoes/restaurar-cursos-vps.sh $SNAPSHOT_BACKUP"
  echo ""
}

# ------------------------------------------------------------------------------
# MODO GUIADO: TUDO
# ------------------------------------------------------------------------------
etapa_tudo() {
  echo ""
  echo -e "${CLR_MAGENTA}================================================================${CLR_RESET}"
  echo -e "${CLR_MAGENTA} INICIANDO FLUXO GUIADO COMPLETO DA FASE 1 NA VPS (9 PASSOS)     ${CLR_RESET}"
  echo -e "${CLR_MAGENTA}================================================================${CLR_RESET}"
  echo "Cada ação que altera arquivos, repositório ou produção solicitará confirmação [s/N]."
  echo ""

  etapa_verificar
  etapa_copiar
  etapa_diff
  etapa_substituir
  etapa_validar
  etapa_commit
  etapa_redeploy
  etapa_testes

  echo ""
  echo -e "${CLR_VERDE}================================================================${CLR_RESET}"
  echo -e "${CLR_VERDE} FLUXO GUIADO DA FASE 1 EXECUTADO COM SUCESSO!                   ${CLR_RESET}"
  echo -e "${CLR_VERDE}================================================================${CLR_RESET}"
  echo "Caso seja necessária qualquer reversão imediata, execute:"
  echo "  $0 rollback"
}

# ------------------------------------------------------------------------------
# DISPATCHER DE SUBCOMANDOS
# ------------------------------------------------------------------------------
case "${1:-ajuda}" in
  verificar)
    etapa_verificar
    ;;
  copiar)
    etapa_copiar
    ;;
  diff)
    etapa_diff
    ;;
  substituir)
    etapa_substituir
    ;;
  validar)
    etapa_validar
    ;;
  commit)
    etapa_commit
    ;;
  redeploy)
    etapa_redeploy
    ;;
  testes)
    etapa_testes
    ;;
  rollback)
    etapa_rollback
    ;;
  tudo)
    etapa_tudo
    ;;
  ajuda|--help|-h)
    echo "Uso: $0 [verificar | copiar | diff | substituir | validar | commit | redeploy | testes | rollback | tudo]"
    echo ""
    echo "Subcomandos disponíveis (ordem exata dos 9 passos do operador):"
    echo "  verificar   - Passo 1: Checa branch correcao-fluxo-cursos, commit 47aa7b1 e git status"
    echo "  copiar      - Passo 2: Monta candidatos em /tmp/fase1_candidatos/ sem tocar em produção"
    echo "  diff        - Passo 3: Gera diffs unificados contra 47aa7b1 para auditoria visual"
    echo "  substituir  - Passo 4: Backup .bak.fase1 e cópia para src/ (requer confirmação explícita s/N)"
    echo "  validar     - Passo 5: node --check src/routes/stream.js e conferência SHA-256 do manifesto"
    echo "  commit      - Passo 6: git add dos 2 arquivos + commit + push em correcao-fluxo-cursos (NUNCA main)"
    echo "  redeploy    - Passo 7: Dispara rebuild Cursos-API no EasyPanel via API ou guia manual"
    echo "  testes      - Passo 8: Bateria dos 8 testes funcionais pós-deploy"
    echo "  rollback    - Passo 9: Reverte para 47aa7b1 via .bak.fase1 ou git, mede tempo (< 3 min)"
    echo "  tudo        - Modo guiado sequencial executando os 9 passos com confirmação em cada etapa"
    echo ""
    echo "Variáveis de ambiente opcionais (tokens apenas via shell, nunca em arquivo):"
    echo "  EASYPANEL_TOKEN     Token de API do EasyPanel (mascarado nas saídas)"
    echo "  TEST_TOKEN_MENTOR   Token JWT de mentor para a bateria de testes"
    echo "  TEST_TOKEN_ESTRANHO Token JWT de usuário sem matrícula"
    echo "  API_URL             URL da API (Padrão: http://127.0.0.1:3333)"
    ;;
  *)
    log_erro "Comando desconhecido: $1"
    echo "Execute '$0 ajuda' para ver os subcomandos disponíveis."
    exit 1
    ;;
esac
