#!/usr/bin/env bash
# ==============================================================================
# BATERIA DE TESTES NÃO INVASIVOS DA FASE 1 NA VPS (MODOS A, B, C)
# ==============================================================================
# Projeto: Plataforma Cursos (Cursos-API / Painel do Mentor)
# Arquivo: docs/operacoes/testar-fase1-vps.sh
# Uso:     ./docs/operacoes/testar-fase1-vps.sh [estatico|servidor|bateria|parar|homologacao]
#
# REGRA MANDATÓRIA: NENHUMA senha, token ou credencial em texto puro neste script.
# Marcador oficial: [TOKEN_REMOVIDO_E_ROTACIONADO].
# Tokens de teste entram EXCLUSIVAMENTE via variáveis de ambiente no terminal.
# ==============================================================================

set -euo pipefail

REPO_DIR="/root/cursos-api"
CANDIDATOS_DIR="/tmp/fase1_candidatos"
TEST_DIR="/tmp/fase1_teste"
PID_FILE="/tmp/fase1_teste_server.pid"
LOG_FILE="/tmp/fase1_teste_server.log"
PORT="${TEST_PORT:-3334}"
AULA_ID="${TEST_AULA_ID:-27}"

# Hashes SHA-256 oficiais dos 2 arquivos de código entregues na Fase 1
HASH_STREAM_ESPERADO="2be71f49646bde330ec0c822ff611be9e173e44c2057d23f381c81ef94e1e07b"
HASH_PAINEL_ESPERADO="3d9501a300d8b4e7a3ec11cc0a66d548f7663e6e87f2e1a47321e06fa536f0e4"

log_info()  { echo -e "\033[1;34m[INFO]\033[0m $1"; }
log_ok()    { echo -e "\033[1;32m[OK]\033[0m $1"; }
log_warn()  { echo -e "\033[1;33m[AVISO]\033[0m $1"; }
log_erro()  { echo -e "\033[1;31m[ERRO]\033[0m $1" >&2; }

verificar_requisitos_candidatos() {
  if [ ! -d "$CANDIDATOS_DIR" ]; then
    log_erro "Diretório de candidatos $CANDIDATOS_DIR não encontrado."
    log_erro "Execute a transferência prévia dos artefatos conforme docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md."
    exit 1
  fi
  if [ ! -f "$CANDIDATOS_DIR/src/routes/stream.js" ]; then
    log_erro "Candidato stream.js não encontrado em $CANDIDATOS_DIR/src/routes/stream.js"
    exit 1
  fi
  if [ ! -f "$CANDIDATOS_DIR/src/static/painel-mentor.html" ]; then
    log_erro "Candidato painel-mentor.html não encontrado em $CANDIDATOS_DIR/src/static/painel-mentor.html"
    exit 1
  fi
}

modo_estatico() {
  log_info "=== CAMADA 1: TESTE ESTÁTICO NÃO INVASIVO (MODO A) ==="
  verificar_requisitos_candidatos

  log_info "1. Conferindo hashes SHA-256 dos artefatos em $CANDIDATOS_DIR..."
  local hash_stream
  local hash_painel
  hash_stream=$(sha256sum "$CANDIDATOS_DIR/src/routes/stream.js" | awk '{print $1}')
  hash_painel=$(sha256sum "$CANDIDATOS_DIR/src/static/painel-mentor.html" | awk '{print $1}')

  if [ "$hash_stream" != "$HASH_STREAM_ESPERADO" ]; then
    log_erro "Hash divergente em stream.js!"
    log_erro "  Esperado: $HASH_STREAM_ESPERADO"
    log_erro "  Obtido:   $hash_stream"
    exit 1
  fi
  log_ok "Hash de stream.js confere: $hash_stream"

  if [ "$hash_painel" != "$HASH_PAINEL_ESPERADO" ]; then
    log_erro "Hash divergente em painel-mentor.html!"
    log_erro "  Esperado: $HASH_PAINEL_ESPERADO"
    log_erro "  Obtido:   $hash_painel"
    exit 1
  fi
  log_ok "Hash de painel-mentor.html confere: $hash_painel"

  log_info "2. Checagem sintática Node.js (node --check)..."
  if node --check "$CANDIDATOS_DIR/src/routes/stream.js"; then
    log_ok "Sintaxe de stream.js validada (exit code 0)."
  else
    log_erro "Falha na checagem sintática de stream.js."
    exit 1
  fi

  log_info "3. Checagem estrutural do HTML do painel..."
  if head -n 1 "$CANDIDATOS_DIR/src/static/painel-mentor.html" | grep -qi "doctype html"; then
    log_ok "painel-mentor.html inicia com <!doctype html>."
  else
    log_warn "painel-mentor.html não inicia explicitamente com <!doctype html>."
  fi

  local count_session
  count_session=$(grep -c "sessionStorage" "$CANDIDATOS_DIR/src/static/painel-mentor.html" || true)
  log_ok "Uso de sessionStorage detectado ($count_session ocorrências)."

  if grep -i "localStorage" "$CANDIDATOS_DIR/src/static/painel-mentor.html"; then
    log_erro "VIOLAÇÃO: localStorage detectado em painel-mentor.html (contrato exige zero localStorage)!"
    exit 1
  else
    log_ok "Zero referências a localStorage confirmadas no painel."
  fi

  log_info "4. Gerando diffs contra a árvore base (sem aplicar)..."
  if [ -d "$REPO_DIR" ]; then
    cd "$REPO_DIR"
    mkdir -p /tmp/diffs_fase1
    git show 47aa7b1:src/routes/stream.js 2>/dev/null | diff -u - "$CANDIDATOS_DIR/src/routes/stream.js" > /tmp/diffs_fase1/stream.patch || true
    git show 47aa7b1:src/static/painel-mentor.html 2>/dev/null | diff -u - "$CANDIDATOS_DIR/src/static/painel-mentor.html" > /tmp/diffs_fase1/painel.patch || true
    log_ok "Diffs salvos em /tmp/diffs_fase1/ (tamanho stream: $(wc -l < /tmp/diffs_fase1/stream.patch), painel: $(wc -l < /tmp/diffs_fase1/painel.patch) linhas)."

    log_info "5. Verificando que o repositório em $REPO_DIR permaneceu limpo..."
    local status_repo
    status_repo=$(git status --porcelain)
    if [ -z "$status_repo" ]; then
      log_ok "Repositório $REPO_DIR 100% LIMPO (git status vazio)."
    else
      log_warn "Repositório $REPO_DIR contém alterações pré-existentes:"
      echo "$status_repo"
    fi
  else
    log_warn "Diretório de repositório $REPO_DIR não existe no host local (pulando diff git)."
  fi

  log_ok "=== FIM DA CAMADA 1: Todos os testes estáticos passaram com sucesso! ==="
}

modo_servidor() {
  log_info "=== CAMADA 2: INICIALIZANDO SERVIDOR SOMENTE LEITURA NA PORTA $PORT ==="
  verificar_requisitos_candidatos

  if [ -f "$PID_FILE" ]; then
    local pid_existente
    pid_existente=$(cat "$PID_FILE")
    if kill -0 "$pid_existente" 2>/dev/null; then
      log_warn "Servidor já em execução com PID $pid_existente na porta $PORT."
      return 0
    fi
    rm -f "$PID_FILE"
  fi

  log_info "1. Montando ambiente isolado em $TEST_DIR a partir de $REPO_DIR..."
  rm -rf "$TEST_DIR"
  mkdir -p "$TEST_DIR"

  rsync -a --exclude='.git' --exclude='node_modules' "$REPO_DIR/" "$TEST_DIR/"

  if [ -d "$REPO_DIR/node_modules" ]; then
    ln -s "$REPO_DIR/node_modules" "$TEST_DIR/node_modules"
    log_ok "Link simbólico para node_modules criado com sucesso."
  else
    log_erro "node_modules de produção não encontrado em $REPO_DIR/node_modules."
    exit 1
  fi

  log_info "2. Sobrepondo candidatos em $TEST_DIR/src/..."
  cp "$CANDIDATOS_DIR/src/routes/stream.js" "$TEST_DIR/src/routes/stream.js"
  cp "$CANDIDATOS_DIR/src/static/painel-mentor.html" "$TEST_DIR/src/static/painel-mentor.html"
  log_ok "Candidatos sobrepostos com sucesso."

  log_info "3. Iniciando processo com READ_ONLY_TEST=true na porta $PORT..."
  cd "$TEST_DIR"
  PORT="$PORT" READ_ONLY_TEST="true" node src/server.js > "$LOG_FILE" 2>&1 &
  local novo_pid=$!
  echo "$novo_pid" > "$PID_FILE"

  sleep 2

  if kill -0 "$novo_pid" 2>/dev/null; then
    log_ok "Servidor iniciado com sucesso! PID: $novo_pid escutando na porta $PORT."
    log_ok "Log em tempo real: tail -f $LOG_FILE"
    log_warn "AVISO: Este servidor está ativo na porta $PORT com READ_ONLY_TEST=true."
    log_warn "O serviço na porta 3334 NÃO constitui homologação de produção."
  else
    log_erro "Falha ao iniciar o servidor. Verifique o log em $LOG_FILE:"
    cat "$LOG_FILE"
    exit 1
  fi
}

modo_parar() {
  log_info "Parando servidor de teste na porta $PORT..."
  if [ -f "$PID_FILE" ]; then
    local pid
    pid=$(cat "$PID_FILE")
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" || true
      sleep 1
      if kill -0 "$pid" 2>/dev/null; then
        kill -9 "$pid" || true
      fi
      log_ok "Servidor PID $pid encerrado."
    else
      log_warn "Processo PID $pid já não estava em execução."
    fi
    rm -f "$PID_FILE"
  else
    log_warn "Arquivo de PID $PID_FILE não encontrado."
  fi
  rm -rf "$TEST_DIR"
  log_ok "Diretório de teste $TEST_DIR removido."
}

modo_bateria() {
  log_info "=== CAMADA 2: EXECUTANDO BATERIA DE TESTES CONTRA PORTA $PORT ==="

  local base_url="http://localhost:$PORT"
  local token_mentor="${TEST_TOKEN_MENTOR:-}"
  local token_estranho="${TEST_TOKEN_ESTRANHO:-}"
  local token_aluno="${TEST_TOKEN_ALUNO:-}"

  # Teste 1: Health
  log_info "Item 1: GET /health..."
  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/health" || echo "000")
  if [ "$http_code" = "200" ]; then
    log_ok "Item 1 OK: Health retornou 200."
  else
    log_erro "Item 1 FALHOU: Health retornou HTTP $http_code (esperado 200)."
  fi

  # Teste 5: Sem token -> 401
  log_info "Item 5: GET /stream/$AULA_ID sem token..."
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/stream/$AULA_ID" || echo "000")
  if [ "$http_code" = "401" ]; then
    log_ok "Item 5 OK: Sem token retornou HTTP 401 Unauthorized."
  else
    log_erro "Item 5 FALHOU: Retornou HTTP $http_code (esperado 401)."
  fi

  # Teste 8: Path traversal
  if [ -n "$token_mentor" ]; then
    log_info "Item 8: Path traversal com token de mentor..."
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_mentor" "$base_url/stream/27%2F..%2F..%2Fetc%2Fpasswd" || echo "000")
    if [ "$http_code" = "400" ] || [ "$http_code" = "403" ]; then
      log_ok "Item 8 OK: Path traversal rejeitado com HTTP $http_code."
    else
      log_erro "Item 8 FALHOU: Path traversal retornou HTTP $http_code (esperado 400 ou 403)."
    fi
  else
    log_warn "Item 8 PULADO: TEST_TOKEN_MENTOR não definido no ambiente."
  fi

  # Teste 9: Escrita bloqueada pelo guard READ_ONLY_TEST
  log_info "Item 9: POST /stream/$AULA_ID (escrita bloqueada)..."
  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$base_url/stream/$AULA_ID" || echo "000")
  if [ "$http_code" = "403" ]; then
    log_ok "Item 9 OK: POST bloqueado com HTTP 403 Forbidden pelo guard READ_ONLY_TEST."
  else
    log_erro "Item 9 FALHOU: POST retornou HTTP $http_code (esperado 403)."
  fi

  # Teste 10: Upload de vídeo bloqueado
  log_info "Item 10: POST /mentor/cursos/upload-video-vps (escrita bloqueada)..."
  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$base_url/mentor/cursos/upload-video-vps" || echo "000")
  if [ "$http_code" = "403" ]; then
    log_ok "Item 10 OK: Upload de vídeo bloqueado com HTTP 403 Forbidden pelo guard READ_ONLY_TEST."
  else
    log_erro "Item 10 FALHOU: Upload retornou HTTP $http_code (esperado 403)."
  fi

  # Teste 4: Usuário sem relação -> 403
  if [ -n "$token_estranho" ]; then
    log_info "Item 4: Usuário estranho no stream..."
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_estranho" "$base_url/stream/$AULA_ID" || echo "000")
    if [ "$http_code" = "403" ]; then
      log_ok "Item 4 OK: Usuário estranho rejeitado com HTTP 403 Forbidden."
    else
      log_erro "Item 4 FALHOU: Retornou HTTP $http_code (esperado 403)."
    fi
  else
    log_warn "Item 4 PULADO: TEST_TOKEN_ESTRANHO não definido no ambiente."
  fi

  # Teste 2: Stream com Range 206
  if [ -n "$token_mentor" ]; then
    log_info "Item 2: Stream autorizado com header Range..."
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_mentor" -H "Range: bytes=0-1048576" "$base_url/stream/$AULA_ID" || echo "000")
    if [ "$http_code" = "206" ]; then
      log_ok "Item 2 OK: Stream retornou HTTP 206 Partial Content."
    else
      log_warn "Item 2: Retornou HTTP $http_code (se arquivo físico da aula $AULA_ID não existir, esperado 404)."
    fi
  else
    log_warn "Item 2 PULADO: TEST_TOKEN_MENTOR não definido no ambiente."
  fi

  # Teste 12 e 13: Verificação de vazamento de tokens
  if [ -n "$token_mentor" ]; then
    log_info "Item 12 e 13: Checando ausência do token em disco e nos logs..."
    if grep -rq "$token_mentor" /tmp/fase1_* 2>/dev/null; then
      log_erro "VIOLAÇÃO: Token do mentor encontrado em arquivos em disco sob /tmp/fase1_*!"
    else
      log_ok "Item 12 OK: Token do mentor NÃO foi gravado em disco."
    fi

    if [ -f "$LOG_FILE" ] && grep -q "$token_mentor" "$LOG_FILE"; then
      log_erro "VIOLAÇÃO: Token do mentor detectado no log do servidor $LOG_FILE!"
    else
      log_ok "Item 13 OK: Token do mentor NÃO vazou no log do servidor."
    fi
  fi

  log_ok "=== Bateria concluída. Consulte docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md para a matriz detalhada. ==="
}

modo_homologacao() {
  cat <<'EOF_HOMOLOG'
=== CAMADA 3: INSTRUÇÕES PARA AMBIENTE DE ESCRITA SEPARADO ===

Para testar mutações (POST/PUT/DELETE, criação de cursos, upload de vídeo) com
segurança máxima, suba um ambiente de escrita sob demanda a partir do backup:

1. Restaurar banco isolado na porta 5433 a partir do backup 20261031_195147:
   docker run -d --name cursos-postgres-homologacao -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=cursos_homolog -p 5433:5432 postgres:15
   docker exec -i cursos-postgres-homologacao psql -U postgres cursos_homolog < /root/backups/cursos/20261031_195147/postgres.sql

2. Subir Redis de homologação na porta 6380:
   docker run -d --name cursos-redis-homologacao -v /root/backups/cursos/20261031_195147/redis-dump.rdb:/data/dump.rdb -p 6380:6379 redis:7-alpine

3. Criar diretório de vídeos separado:
   mkdir -p /srv/cursos/videos-homologacao

4. Iniciar servidor na porta 3334 apontando para as portas isoladas:
   PORT=3334 DB_PORT=5433 DB_NAME=cursos_homolog REDIS_PORT=6380 LOCAL_VIDEO_DIR=/srv/cursos/videos-homologacao READ_ONLY_TEST=false node src/server.js

5. Ao terminar, destruir os containers descartáveis:
   docker rm -f cursos-postgres-homologacao cursos-redis-homologacao
   rm -rf /srv/cursos/videos-homologacao

NUNCA execute testes de escrita contra o banco de produção!
EOF_HOMOLOG
}

case "${1:-}" in
  estatico)
    modo_estatico
    ;;
  servidor)
    modo_servidor
    ;;
  bateria)
    modo_bateria
    ;;
  parar)
    modo_parar
    ;;
  homologacao)
    modo_homologacao
    ;;
  *)
    echo "Uso: $0 {estatico|servidor|bateria|parar|homologacao}"
    echo ""
    echo "  estatico    - Camada 1: valida hashes SHA-256, sintaxe Node, integridade HTML e diffs (zero processos)"
    echo "  servidor    - Camada 2: inicia servidor descartável em /tmp/fase1_teste/ na porta $PORT com READ_ONLY_TEST=true"
    echo "  bateria     - Camada 2: executa bateria de testes contra localhost:$PORT (tokens via ambiente)"
    echo "  parar       - Camada 2: encerra o servidor de teste e limpa /tmp/fase1_teste/"
    echo "  homologacao - Camada 3: exibe instruções para subir banco descartável sob demanda a partir do backup"
    exit 1
    ;;
esac
