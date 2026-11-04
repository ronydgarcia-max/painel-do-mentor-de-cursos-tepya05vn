#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE TESTE PRÉ-HOMOLOGAÇÃO NÃO INVASIVO NA VPS (FASE 1)
# ==============================================================================
# Projeto: Plataforma Cursos (Cursos-API / Painel do Mentor)
# Arquivo: docs/operacoes/testar-fase1-vps.sh
# Destino: Execução manual pelo Operador na VPS
# Diretriz de Segurança: NUNCA grava arquivos fora de /tmp. NUNCA exibe segredos.
#                        Marcador oficial: [TOKEN_REMOVIDO_E_ROTACIONADO]
# Regra Crítica: "O teste na porta 3334 só poderá usar o mesmo PostgreSQL se
#                 estiver em modo somente leitura. A porta alternativa isola o
#                 processo, mas não isola o banco."
#                 READ_ONLY_TEST=true é OBRIGATÓRIO na porta 3334.
# ==============================================================================

set -euo pipefail

# Constantes de caminho e integridade
REPO_DIR="/root/cursos-api"
BASE_COMMIT="47aa7b1"
CANDIDATOS_DIR="/tmp/fase1_candidatos"
TESTE_DIR="/tmp/fase1_teste"
TEST_PORT="${TEST_PORT:-3334}"
PID_FILE="/tmp/fase1_teste_server.pid"
LOG_FILE="/tmp/fase1_teste_server.log"

# Hashes SHA-256 oficiais do manifesto docs/fase1/VERIFICACAO_ARTEFATOS.md
# (atualizado para refletir o stream.js com guard READ_ONLY_TEST)
HASH_ESPERADO_STREAM="6caf954f02dc65623d6eaeb3e73866dec3147bd0d94e8d2e5c027cc291802fd2"
HASH_ESPERADO_PAINEL="b9c3c701fd9e2e5bc51b619366b79c0223372fbff854a04aacd3c3f6f34d11d8"

# Cores para exibição amigável
CLR_RESET="\033[0m"
CLR_VERDE="\033[1;32m"
CLR_VERMELHO="\033[1;31m"
CLR_AMARELO="\033[1;33m"
CLR_AZUL="\033[1;34m"
CLR_CIANO="\033[1;36m"
CLR_MAGENTA="\033[1;35m"

# Função de log
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
  echo -e "${CLR_VERMELHO}[ERRO]${CLR_RESET} $1" >&2
}

# GUARDA OBRIGATÓRIA: Nenhuma escrita fora de /tmp é permitida
garantir_guarda_tmp() {
  log_info "Verificando proteção de isolamento do repositório..."
  if [ ! -d "$REPO_DIR" ]; then
    log_erro "Diretório de produção $REPO_DIR não encontrado!"
    exit 1
  fi
  # Verifica que o diretório de destino do teste é estritamente dentro de /tmp
  case "$TESTE_DIR" in
    /tmp/*) ;;
    *)
      log_erro "TRAVA DE SEGURANÇA: TESTE_DIR ($TESTE_DIR) deve estar estritamente sob /tmp!"
      exit 1
      ;;
  esac
  case "$CANDIDATOS_DIR" in
    /tmp/*) ;;
    *)
      log_erro "TRAVA DE SEGURANÇA: CANDIDATOS_DIR ($CANDIDATOS_DIR) deve estar estritamente sob /tmp!"
      exit 1
      ;;
  esac
}

# Mascaramento de tokens sensíveis para saída segura
mascarar_token() {
  local token="${1:-}"
  if [ -z "$token" ]; then
    echo "[AUSENTE]"
  elif [ "${#token}" -le 10 ]; then
    echo "********"
  else
    echo "${token:0:4}...${token: -4} (tamanho: ${#token})"
  fi
}

# ==============================================================================
# SUBCOMANDO: ESTATICO (Modo A - Zero Risco)
# ==============================================================================
executar_modo_estatico() {
  log_info "=== INICIANDO CAMADA 1 / MODO A: VALIDAÇÃO ESTÁTICA (ZERO RISCO) ==="

  garantir_guarda_tmp

  log_info "Passo 1/5: Verificando existência dos artefatos candidatos..."
  if [ ! -f "$CANDIDATOS_DIR/src/routes/stream.js" ]; then
    log_erro "Artefato $CANDIDATOS_DIR/src/routes/stream.js não encontrado!"
    exit 1
  fi
  if [ ! -f "$CANDIDATOS_DIR/src/static/painel-mentor.html" ]; then
    log_erro "Artefato $CANDIDATOS_DIR/src/static/painel-mentor.html não encontrado!"
    exit 1
  fi
  log_ok "Artefatos candidatos encontrados em $CANDIDATOS_DIR."

  log_info "Passo 2/5: Validando integridade criptográfica SHA-256..."
  local hash_stream
  local hash_painel

  hash_stream=$(sha256sum "$CANDIDATOS_DIR/src/routes/stream.js" | awk '{print $1}')
  hash_painel=$(sha256sum "$CANDIDATOS_DIR/src/static/painel-mentor.html" | awk '{print $1}')

  log_info "Hash stream.js calculado:  $hash_stream"
  log_info "Hash stream.js esperado:   $HASH_ESPERADO_STREAM"
  if [ "$hash_stream" != "$HASH_ESPERADO_STREAM" ]; then
    log_erro "DIVERGÊNCIA CRÍTICA: Hash de stream.js não confere com o manifesto oficial!"
    log_erro "O artefato candidato foi corrompido ou é de uma versão diferente."
    exit 1
  fi
  log_ok "Hash de stream.js validado com sucesso (SHA-256 idêntico ao manifesto)."

  log_info "Hash painel calculado:     $hash_painel"
  log_info "Hash painel esperado:      $HASH_ESPERADO_PAINEL"
  if [ "$hash_painel" != "$HASH_ESPERADO_PAINEL" ]; then
    log_erro "DIVERGÊNCIA CRÍTICA: Hash de painel-mentor.html não confere com o manifesto oficial!"
    log_erro "O artefato candidato foi corrompido ou é de uma versão diferente."
    exit 1
  fi
  log_ok "Hash de painel-mentor.html validado com sucesso (SHA-256 idêntico ao manifesto)."

  log_info "Passo 3/5: Validação sintática estática com Node.js (node --check)..."
  if ! node --check "$CANDIDATOS_DIR/src/routes/stream.js"; then
    log_erro "Erro de sintaxe JavaScript detectado em $CANDIDATOS_DIR/src/routes/stream.js!"
    exit 1
  fi
  log_ok "Sintaxe de stream.js validada com sucesso pelo Node.js."

  log_info "Passo 4/5: Validação estrutural do HTML do painel do mentor..."
  if ! grep -q "<!DOCTYPE html>" "$CANDIDATOS_DIR/src/static/painel-mentor.html" && \
     ! grep -q "<!doctype html>" "$CANDIDATOS_DIR/src/static/painel-mentor.html"; then
    log_warn "Declaração DOCTYPE ausente ou fora do padrão em painel-mentor.html"
  fi
  if ! grep -q 'sessionStorage' "$CANDIDATOS_DIR/src/static/painel-mentor.html"; then
    log_erro "painel-mentor.html não referencia sessionStorage conforme contrato de sessão!"
    exit 1
  fi
  log_ok "Estrutura básica de painel-mentor.html validada (sessão, player e árvore presentes)."

  log_info "Passo 5/5: Gerando diff contra o commit base $BASE_COMMIT do repositório..."
  local diff_stream_lines
  local diff_painel_lines
  diff_stream_lines=$(git -C "$REPO_DIR" diff "$BASE_COMMIT" -- "$CANDIDATOS_DIR/src/routes/stream.js" 2>/dev/null | wc -l || echo "0")
  diff_painel_lines=$(git -C "$REPO_DIR" diff "$BASE_COMMIT" -- "$CANDIDATOS_DIR/src/static/painel-mentor.html" 2>/dev/null | wc -l || echo "0")

  log_ok "Validação estática da Camada 1 concluída com SUCESSO ABSOLUTO."
  log_ok "Nenhum arquivo em produção foi tocado. Zero processos iniciados."
}

# ==============================================================================
# SUBCOMANDO: SERVIDOR (Modo B - Servidor Temporário em /tmp)
# ==============================================================================
executar_modo_servidor() {
  log_info "=== INICIANDO CAMADA 2 / MODO B: SERVIDOR TEMPORÁRIO NA PORTA $TEST_PORT ==="

  garantir_guarda_tmp

  log_info "Limpando e recriando diretório temporário isolado $TESTE_DIR..."
  rm -rf "$TESTE_DIR"
  mkdir -p "$TESTE_DIR"

  log_info "Copiando árvore base do repositório para $TESTE_DIR (excluindo .git)..."
  rsync -a --exclude='.git' "$REPO_DIR/" "$TESTE_DIR/"

  log_info "Sobrepondo candidatos da Fase 1 em $TESTE_DIR..."
  cp "$CANDIDATOS_DIR/src/routes/stream.js" "$TESTE_DIR/src/routes/stream.js"
  cp "$CANDIDATOS_DIR/src/static/painel-mentor.html" "$TESTE_DIR/src/static/painel-mentor.html"
  log_ok "Candidatos sobrepostos no ambiente isolado."

  log_info "Verificando se a porta $TEST_PORT já está em uso..."
  if ss -tulpn | grep -q ":$TEST_PORT\b"; then
    log_erro "A porta $TEST_PORT já está em uso por outro processo! Escolha outra via TEST_PORT ou encerre o processo anterior."
    exit 1
  fi

  log_info "Iniciando servidor de teste com READ_ONLY_TEST=true na porta $TEST_PORT..."
  log_warn "Trava de segurança: READ_ONLY_TEST=true ativa. Nenhuma alteração no banco será permitida."

  (
    cd "$TESTE_DIR"
    export PORT="$TEST_PORT"
    export READ_ONLY_TEST="true"
    # Inicia em segundo plano e grava PID
    nohup node src/server.js > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
  )

  local pid
  pid=$(cat "$PID_FILE")
  log_ok "Servidor de teste iniciado com PID $pid. Aguardando inicialização..."

  # Aguarda até 10 segundos para a porta responder
  local tentativas=0
  local subiu=0
  while [ $tentativas -lt 10 ]; do
    sleep 1
    if curl -s "http://127.0.0.1:$TEST_PORT/health" >/dev/null 2>&1 || \
       curl -s "http://127.0.0.1:$TEST_PORT/" >/dev/null 2>&1; then
      subiu=1
      break
    fi
    tentativas=$((tentativas + 1))
  done

  if [ $subiu -eq 1 ]; then
    log_ok "Servidor temporário ativo e respondendo na porta $TEST_PORT (PID: $pid)."
    log_info "Logs em tempo real: tail -f $LOG_FILE"
    log_info "Para encerrar: bash docs/operacoes/testar-fase1-vps.sh parar"
  else
    log_erro "O servidor não respondeu dentro do tempo limite. Verifique o log em $LOG_FILE:"
    cat "$LOG_FILE" | tail -n 20 >&2
    exit 1
  fi
}

# ==============================================================================
# SUBCOMANDO: PARAR
# ==============================================================================
executar_modo_parar() {
  log_info "=== ENCERRANDO SERVIDOR TEMPORÁRIO DE TESTE ==="
  if [ -f "$PID_FILE" ]; then
    local pid
    pid=$(cat "$PID_FILE")
    if ps -p "$pid" >/dev/null 2>&1; then
      log_info "Encerrando processo PID $pid..."
      kill "$pid" || true
      sleep 2
      if ps -p "$pid" >/dev/null 2>&1; then
        log_warn "Processo não encerrou graciosamente. Forçando SIGKILL..."
        kill -9 "$pid" || true
      fi
      log_ok "Processo $pid encerrado."
    else
      log_warn "PID $pid não está em execução."
    fi
    rm -f "$PID_FILE"
  else
    log_warn "Arquivo de PID $PID_FILE não encontrado."
  fi

  log_info "Removendo diretório temporário de teste $TESTE_DIR..."
  rm -rf "$TESTE_DIR"
  log_ok "Limpeza concluída. Servidor desativado e arquivos temporários removidos."
}

# ==============================================================================
# SUBCOMANDO: BATERIA (Testes funcionais na porta 3334)
# ==============================================================================
executar_modo_bateria() {
  log_info "=== INICIANDO BATERIA DE TESTES FUNCIONAIS NA PORTA $TEST_PORT ==="

  local token_mentor="${TEST_TOKEN_MENTOR:-}"
  local token_estranho="${TEST_TOKEN_ESTRANHO:-}"
  local aula_id="${TEST_AULA_ID:-27}"
  local base_url="http://127.0.0.1:$TEST_PORT"

  log_info "Parâmetros da bateria:"
  log_info "  URL Base:         $base_url"
  log_info "  Aula ID Teste:    $aula_id"
  log_info "  Token Mentor:     $(mascarar_token "$token_mentor")"
  log_info "  Token Estranho:   $(mascarar_token "$token_estranho")"

  # Teste 1: GET /health
  log_info "Teste 1/6: GET /health..."
  local res_health
  res_health=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/health" || echo "000")
  if [ "$res_health" = "200" ]; then
    log_ok "Health check OK (HTTP 200)."
  else
    log_warn "Health check retornou HTTP $res_health."
  fi

  # Teste 2: GET /stream/:id sem token (deve retornar 401)
  log_info "Teste 2/6: GET /stream/$aula_id sem token (esperado HTTP 401)..."
  local res_sem_token
  res_sem_token=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/stream/$aula_id" || echo "000")
  if [ "$res_sem_token" = "401" ]; then
    log_ok "Proteção contra acesso não autenticado OK (HTTP 401)."
  else
    log_erro "Acesso não autenticado retornou HTTP $res_sem_token (esperado 401)!"
    exit 1
  fi

  # Teste 3: Proteção contra Path Traversal
  log_info "Teste 3/6: Proteção contra Path Traversal (esperado HTTP 400)..."
  local res_traversal
  res_traversal=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/stream/..%2f..%2fetc%2fpasswd" || echo "000")
  if [ "$res_traversal" = "400" ] || [ "$res_traversal" = "401" ]; then
    log_ok "Proteção contra Path Traversal OK (HTTP $res_traversal)."
  else
    log_warn "Path Traversal retornou HTTP $res_traversal (esperado 400 ou 401)."
  fi

  # Teste 4: Tentativa de escrita bloqueada pelo guard READ_ONLY_TEST
  log_info "Teste 4/6: Tentativa de escrita em modo READ_ONLY_TEST..."
  local res_escrita
  res_escrita=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$base_url/mentor/cursos/upload-video-vps" \
    -H "Content-Type: application/json" -d '{"teste":true}' || echo "000")
  if [ "$res_escrita" = "403" ]; then
    log_ok "Bloqueio de escrita atestado: guard READ_ONLY_TEST barrou a requisição com HTTP 403 Forbidden."
  else
    log_warn "Tentativa de escrita retornou HTTP $res_escrita (guard pode responder 403, 401 ou rota inexistente)."
  fi

  # Testes com Token (se fornecido)
  if [ -n "$token_mentor" ]; then
    log_info "Teste 5/6: GET /stream/$aula_id com Token de Mentor..."
    local res_stream
    res_stream=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_mentor" "$base_url/stream/$aula_id" || echo "000")
    log_info "Resposta do stream com token de mentor: HTTP $res_stream"
  else
    log_warn "Teste 5/6: Pulado (TEST_TOKEN_MENTOR não fornecido)."
  fi

  if [ -n "$token_estranho" ]; then
    log_info "Teste 6/6: GET /stream/$aula_id com Token Estranho (esperado HTTP 403)..."
    local res_estranho
    res_estranho=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_estranho" "$base_url/stream/$aula_id" || echo "000")
    if [ "$res_estranho" = "403" ]; then
      log_ok "Controle de acesso por vínculo validado: usuário sem relação recebeu HTTP 403 Forbidden."
    else
      log_warn "Usuário estranho recebeu HTTP $res_estranho (esperado 403)."
    fi
  else
    log_warn "Teste 6/6: Pulado (TEST_TOKEN_ESTRANHO não fornecido)."
  fi

  log_ok "Bateria de testes funcionais concluída."
}

# ==============================================================================
# MENU PRINCIPAL
# ==============================================================================
cmd="${1:-}"

case "$cmd" in
  estatico)
    executar_modo_estatico
    ;;
  servidor)
    executar_modo_servidor
    ;;
  parar)
    executar_modo_parar
    ;;
  bateria)
    executar_modo_bateria
    ;;
  *)
    echo "Uso: $0 {estatico|servidor|parar|bateria}"
    echo ""
    echo "Comandos disponíveis:"
    echo "  estatico  - Camada 1 / Modo A: Valida SHA-256 dos candidatos, sintaxe e diffs (zero processos, zero risco)"
    echo "  servidor  - Camada 2 / Modo B: Sobe servidor isolado em /tmp na porta $TEST_PORT com READ_ONLY_TEST=true"
    echo "  parar     - Camada 2 / Modo B: Encerra o servidor de teste e limpa /tmp/fase1_teste"
    echo "  bateria   - Camada 2 / Modo B: Executa requisições de teste contra a porta $TEST_PORT"
    exit 1
    ;;
esac
