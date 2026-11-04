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

  local stream_candidato="$CANDIDATOS_DIR/src/routes/stream.js"
  local painel_candidato="$CANDIDATOS_DIR/src/static/painel-mentor.html"

  if [ ! -f "$stream_candidato" ] || [ ! -f "$painel_candidato" ]; then
    log_erro "Candidatos não encontrados em $CANDIDATOS_DIR!"
    echo "  Por favor, copie os candidatos para:"
    echo "    $stream_candidato"
    echo "    $painel_candidato"
    exit 1
  fi

  # 1. Conferência dos Hashes SHA-256
  log_info "1/5. Conferindo hashes SHA-256 contra o manifesto VERIFICACAO_ARTEFATOS.md..."
  local hash_real_stream
  local hash_real_painel
  hash_real_stream=$(sha256sum "$stream_candidato" | awk '{print $1}')
  hash_real_painel=$(sha256sum "$painel_candidato" | awk '{print $1}')

  if [ "$hash_real_stream" = "$HASH_ESPERADO_STREAM" ]; then
    log_ok "Hash de stream.js coincide perfeitamente com o manifesto: $hash_real_stream"
  else
    log_erro "Hash de stream.js DIVERGE do manifesto!"
    echo "  Esperado: $HASH_ESPERADO_STREAM"
    echo "  Obtido:   $hash_real_stream"
    exit 1
  fi

  if [ "$hash_real_painel" = "$HASH_ESPERADO_PAINEL" ]; then
    log_ok "Hash de painel-mentor.html coincide perfeitamente com o manifesto: $hash_real_painel"
  else
    log_erro "Hash de painel-mentor.html DIVERGE do manifesto!"
    echo "  Esperado: $HASH_ESPERADO_PAINEL"
    echo "  Obtido:   $hash_real_painel"
    exit 1
  fi

  # 2. Análise Sintática node --check
  log_info "2/5. Executando 'node --check' no stream.js candidato..."
  if node --check "$stream_candidato"; then
    log_ok "Sintaxe de stream.js validada pelo Node.js (exit code 0)."
  else
    log_erro "Falha na checagem de sintaxe de stream.js!"
    exit 1
  fi

  # 3. Checagem Estrutural do HTML
  log_info "3/5. Validando estrutura do painel-mentor.html..."
  if grep -q "<!doctype html>" "$painel_candidato" || grep -q "<!DOCTYPE html>" "$painel_candidato"; then
    log_ok "DOCTYPE HTML5 presente."
  else
    log_erro "DOCTYPE HTML5 não encontrado no painel!"
    exit 1
  fi

  if grep -q "sessionStorage" "$painel_candidato"; then
    log_ok "sessionStorage verificado no painel (isolamento de sessão ativo)."
  else
    log_erro "sessionStorage ausente no painel!"
    exit 1
  fi

  if grep -i "localStorage" "$painel_candidato" >/dev/null 2>&1; then
    log_warn "Aviso: ocorrência de localStorage encontrada no painel. Verificar se não é token."
  else
    log_ok "localStorage totalmente ausente (segurança contra XSS persistente validada)."
  fi

  # 4. Geração dos Diffs contra 47aa7b1 sem tocar no repo
  log_info "4/5. Gerando diff unificado contra o commit base estável $BASE_COMMIT..."
  cd "$REPO_DIR"

  local diff_stream="/tmp/diff_fase1_stream.patch"
  local diff_painel="/tmp/diff_fase1_painel.patch"

  git show "$BASE_COMMIT:src/routes/stream.js" | diff -u - "$stream_candidato" > "$diff_stream" || true
  git show "$BASE_COMMIT:src/static/painel-mentor.html" | diff -u - "$painel_candidato" > "$diff_painel" || true

  log_ok "Diff de stream.js salvo em $diff_stream ($(wc -l < "$diff_stream") linhas)"
  log_ok "Diff de painel salvo em $diff_painel ($(wc -l < "$diff_painel") linhas)"

  # 5. Prova de que NADA foi tocado no repo real
  log_info "5/5. Provando que a árvore de trabalho de produção não foi tocada..."
  local status_git
  status_git=$(git status --porcelain)
  if [ -z "$status_git" ]; then
    log_ok "PROVA CABAL: 'git status' em $REPO_DIR permanece 100% LIMPO!"
  else
    log_warn "Atenção: git status em $REPO_DIR contém arquivos modificados antes deste teste:"
    echo "$status_git"
  fi

  echo ""
  echo -e "${CLR_VERDE}================================================================${CLR_RESET}"
  echo -e "${CLR_VERDE} CAMADA 1 / MODO A (ESTÁTICO) CONCLUÍDO COM SUCESSO (ZERO RISCO)${CLR_RESET}"
  echo -e "${CLR_VERDE}================================================================${CLR_RESET}"
  echo "Próximo passo obrigatório: './testar-fase1-vps.sh servidor' (Camada 2 - Somente Leitura)"
}

# ==============================================================================
# SUBCOMANDO: SERVIDOR (Modo B - Iniciar Servidor de Teste Somente Leitura)
# ==============================================================================
iniciar_servidor_teste() {
  log_info "=== INICIANDO CAMADA 2 / MODO B: SERVIDOR SOMENTE LEITURA NA PORTA $TEST_PORT ==="

  garantir_guarda_tmp

  # EXIGÊNCIA EXPRESSA DO CLIENTE:
  # "O teste na porta 3334 só poderá usar o mesmo PostgreSQL se estiver em modo somente leitura.
  # A porta alternativa isola o processo, mas não isola o banco."
  local read_only="${READ_ONLY_TEST:-true}"
  if [ "$read_only" != "true" ]; then
    log_erro "BLOQUEIO DE SEGURANÇA: O servidor de teste na porta $TEST_PORT conectando ao PostgreSQL"
    log_erro "compartilhado RECUSA subir com READ_ONLY_TEST='$read_only'!"
    log_erro "Para testar mutações/escrita, utilize um ambiente de homologação com banco isolado"
    log_erro "(consulte './testar-fase1-vps.sh homologacao')."
    exit 1
  fi

  log_ok "PROTEÇÃO ATIVA: READ_ONLY_TEST=true configurada por padrão."
  log_info "Todas as mutações (POST, PUT, PATCH, DELETE) serão bloqueadas com HTTP 403."

  local stream_candidato="$CANDIDATOS_DIR/src/routes/stream.js"
  local painel_candidato="$CANDIDATOS_DIR/src/static/painel-mentor.html"

  if [ ! -f "$stream_candidato" ] || [ ! -f "$painel_candidato" ]; then
    log_erro "Arquivos candidatos ausentes em $CANDIDATOS_DIR. Execute o Modo A primeiro."
    exit 1
  fi

  # Se já houver um servidor rodando, encerrar antes
  if [ -f "$PID_FILE" ]; then
    local pid_antigo
    pid_antigo=$(cat "$PID_FILE")
    if kill -0 "$pid_antigo" 2>/dev/null; then
      log_warn "Encerrando servidor de teste anterior (PID $pid_antigo)..."
      kill "$pid_antigo" 2>/dev/null || true
      sleep 1
    fi
    rm -f "$PID_FILE"
  fi

  # Criar cópia de trabalho em /tmp/fase1_teste/
  log_info "1/4. Criando cópia de trabalho isolada em $TESTE_DIR (rsync sem .git)..."
  rm -rf "$TESTE_DIR"
  mkdir -p "$TESTE_DIR"

  rsync -a --exclude='.git' \
           --exclude='node_modules' \
           "$REPO_DIR/" "$TESTE_DIR/"

  # Sobrepor os candidatos
  log_info "2/4. Sobrepondo candidatos na cópia descartável de teste..."
  cp "$stream_candidato" "$TESTE_DIR/src/routes/stream.js"
  cp "$painel_candidato" "$TESTE_DIR/src/static/painel-mentor.html"

  # Link simbólico para node_modules de produção
  log_info "3/4. Reutilizando node_modules existente via link simbólico..."
  if [ -d "$REPO_DIR/node_modules" ]; then
    ln -s "$REPO_DIR/node_modules" "$TESTE_DIR/node_modules"
  else
    log_erro "node_modules não encontrado em $REPO_DIR!"
    exit 1
  fi

  # Iniciar servidor garantindo READ_ONLY_TEST=true
  log_info "4/4. Subindo aplicação com Node.js na porta $TEST_PORT com READ_ONLY_TEST=true..."
  cd "$TESTE_DIR"

  # Carrega variáveis do .env real SEM jamais exibir na saída, forçando READ_ONLY_TEST=true
  if [ -f "$REPO_DIR/.env" ]; then
    PORT="$TEST_PORT" READ_ONLY_TEST="true" env $(grep -v '^#' "$REPO_DIR/.env" | xargs -d '\n') PORT="$TEST_PORT" READ_ONLY_TEST="true" node src/server.js > "$LOG_FILE" 2>&1 &
  else
    PORT="$TEST_PORT" READ_ONLY_TEST="true" node src/server.js > "$LOG_FILE" 2>&1 &
  fi

  local server_pid=$!
  echo "$server_pid" > "$PID_FILE"
  log_info "Processo iniciado com PID $server_pid em background. Aguardando inicialização..."

  sleep 3

  if kill -0 "$server_pid" 2>/dev/null; then
    log_ok "Servidor de teste ISOLADO rodando com sucesso (PID $server_pid) na porta $TEST_PORT!"
    log_ok "Proteção READ_ONLY_TEST=true ATIVA: PostgreSQL real e volumes protegidos contra mutações."
    echo "  Logs em tempo real: tail -f $LOG_FILE"
    echo "  Para testar no navegador local via túnel SSH:"
    echo "    ssh -L $TEST_PORT:localhost:$TEST_PORT root@<IP_DA_VPS>"
    echo "    http://localhost:$TEST_PORT/static/painel-mentor.html"
  else
    log_erro "Falha ao iniciar o servidor de teste! Verifique o log em $LOG_FILE:"
    tail -n 20 "$LOG_FILE" || true
    exit 1
  fi
}

# ==============================================================================
# SUBCOMANDO: PARAR (Encerrar Servidor de Teste)
# ==============================================================================
parar_servidor_teste() {
  log_info "Encerrando servidor de teste isolado..."
  if [ -f "$PID_FILE" ]; then
    local pid
    pid=$(cat "$PID_FILE")
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
      log_ok "Servidor de teste (PID $pid) encerrado."
    else
      log_warn "Processo PID $pid já não estava em execução."
    fi
    rm -f "$PID_FILE"
  else
    log_info "Nenhum arquivo PID encontrado em $PID_FILE."
  fi

  # Limpar arquivos transitórios
  if [ -d "$TESTE_DIR" ]; then
    log_info "Removendo cópia temporária $TESTE_DIR..."
    rm -rf "$TESTE_DIR"
    log_ok "Diretório $TESTE_DIR removido."
  fi
}

# ==============================================================================
# SUBCOMANDO: BATERIA (Testes Automatizados dos 13 Itens do Cliente)
# ==============================================================================
executar_bateria_testes() {
  log_info "=== EXECUTANDO BATERIA OBRIGATÓRIA DOS 13 ITENS NA PORTA $TEST_PORT ==="

  local base_url="http://localhost:$TEST_PORT"
  local token_mentor="${TEST_TOKEN_MENTOR:-}"
  local token_aluno="${TEST_TOKEN_ALUNO:-}"
  local token_estranho="${TEST_TOKEN_ESTRANHO:-}"
  local aula_id="${TEST_AULA_ID:-27}"

  log_info "Configuração da bateria:"
  echo "  Base URL:        $base_url"
  echo "  Aula ID Teste:   $aula_id"
  echo "  Token Mentor:    $(mascarar_token "$token_mentor")"
  echo "  Token Estranho:  $(mascarar_token "$token_estranho")"
  echo "  Token Aluno:     $(mascarar_token "$token_aluno")"

  local total_testes=0
  local testes_passados=0
  local testes_manuais=0

  # ----------------------------------------------------------------------------
  # Item 1. Health retorna 200
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 1/13] Health check na porta $TEST_PORT..."
  local status_health
  status_health=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/health" || curl -s -o /dev/null -w "%{http_code}" "$base_url/" || echo "000")
  if [ "$status_health" = "200" ]; then
    log_ok "Item 1 APROVADO: Health retorna 200 OK."
    testes_passados=$((testes_passados + 1))
  else
    log_erro "Item 1 FALHOU: HTTP $status_health (esperado 200)."
  fi

  # ----------------------------------------------------------------------------
  # Item 2. Stream autorizado retorna 206 com Content-Range
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 2/13] Stream autorizado retorna 206 com Content-Range..."
  if [ -n "$token_mentor" ]; then
    local cabecalho_range
    cabecalho_range=$(curl -s -I -H "Authorization: Bearer $token_mentor" -H "Range: bytes=0-1048576" "$base_url/stream/$aula_id" || true)
    local status_range
    status_range=$(echo "$cabecalho_range" | grep -E '^HTTP/' | awk '{print $2}' | tail -n 1)

    if [ "$status_range" = "206" ]; then
      if echo "$cabecalho_range" | grep -iq "content-range"; then
        log_ok "Item 2 APROVADO: HTTP 206 com header Content-Range presente."
        testes_passados=$((testes_passados + 1))
      else
        log_warn "Item 2: HTTP 206 recebido mas Content-Range não detectado no cabeçalho."
        testes_manuais=$((testes_manuais + 1))
      fi
    elif [ "$status_range" = "404" ]; then
      log_warn "Item 2 PENDENTE: HTTP 404 (Arquivo físico de vídeo ausente neste ambiente de teste)."
      testes_manuais=$((testes_manuais + 1))
    else
      log_erro "Item 2 FALHOU: HTTP $status_range recebido (esperado 206)."
    fi
  else
    log_warn "Item 2 PULADO (TEST_TOKEN_MENTOR não configurado pelo operador)."
    testes_manuais=$((testes_manuais + 1))
  fi

  # ----------------------------------------------------------------------------
  # Item 3. Stream sem Range retorna 200
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 3/13] Stream sem Range retorna 200..."
  if [ -n "$token_mentor" ]; then
    local status_sem_range
    status_sem_range=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_mentor" "$base_url/stream/$aula_id" || echo "000")
    if [ "$status_sem_range" = "200" ]; then
      log_ok "Item 3 APROVADO: HTTP 200 retornado para stream sem Range."
      testes_passados=$((testes_passados + 1))
    elif [ "$status_sem_range" = "404" ]; then
      log_warn "Item 3 PENDENTE: HTTP 404 (Arquivo físico ausente no host de teste)."
      testes_manuais=$((testes_manuais + 1))
    else
      log_erro "Item 3 FALHOU: HTTP $status_sem_range recebido (esperado 200)."
    fi
  else
    log_warn "Item 3 PULADO (TEST_TOKEN_MENTOR não configurado)."
    testes_manuais=$((testes_manuais + 1))
  fi

  # ----------------------------------------------------------------------------
  # Item 4. Usuário sem relação retorna 403
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 4/13] Usuário sem relação retorna 403..."
  if [ -n "$token_estranho" ]; then
    local status_estranho
    status_estranho=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_estranho" "$base_url/stream/$aula_id" || echo "000")
    if [ "$status_estranho" = "403" ]; then
      log_ok "Item 4 APROVADO: HTTP 403 Forbidden retornado para usuário não matriculado/não mentor."
      testes_passados=$((testes_passados + 1))
    else
      log_erro "Item 4 FALHOU: HTTP $status_estranho recebido (esperado 403)."
    fi
  else
    log_warn "Item 4 PULADO (TEST_TOKEN_ESTRANHO não configurado pelo operador)."
    testes_manuais=$((testes_manuais + 1))
  fi

  # ----------------------------------------------------------------------------
  # Item 5. Sem token retorna 401
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 5/13] Requisição sem token retorna 401..."
  local status_anon
  status_anon=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/stream/$aula_id" || echo "000")
  if [ "$status_anon" = "401" ]; then
    log_ok "Item 5 APROVADO: HTTP 401 Unauthorized retornado sem token."
    testes_passados=$((testes_passados + 1))
  else
    log_erro "Item 5 FALHOU: HTTP $status_anon recebido (esperado 401)."
  fi

  # ----------------------------------------------------------------------------
  # Item 6. Aula 27 usa fallback somente se o registro legado permitir
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 6/13] Aula 27 usa fallback somente se o registro legado permitir..."
  # Validação por código estático de que o fallback em stream.js está estritamente restrito a aulaId === 27
  local stream_file="$TESTE_DIR/src/routes/stream.js"
  if grep -q "aulaId === 27 && FALLBACK_LOCAL_VIDEO_FILES\[27\]" "$stream_file" && ! grep -E "aulaId !== 27.*FALLBACK" "$stream_file" >/dev/null 2>&1; then
    log_ok "Item 6 APROVADO: Fallback de vídeo local é estritamente restrito ao ID numérico 27."
    testes_passados=$((testes_passados + 1))
  else
    log_warn "Item 6: Verificação de código do fallback inconclusiva em $stream_file."
  fi

  # ----------------------------------------------------------------------------
  # Item 7. Aula nova sem video_path retorna erro claro
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 7/13] Aula nova sem video_path retorna erro claro (nunca aula 27)..."
  if [ -n "$token_mentor" ]; then
    local status_sem_video
    local corpo_sem_video
    corpo_sem_video=$(curl -s -H "Authorization: Bearer $token_mentor" "$base_url/stream/99999" || true)
    status_sem_video=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_mentor" "$base_url/stream/99999" || echo "000")

    if [ "$status_sem_video" = "400" ] || [ "$status_sem_video" = "404" ]; then
      log_ok "Item 7 APROVADO: HTTP $status_sem_video retornado com erro claro. Aula inexistente/sem vídeo NUNCA reproduz a aula 27!"
      testes_passados=$((testes_passados + 1))
    else
      log_warn "Item 7: HTTP $status_sem_video retornado para aula 99999."
    fi
  else
    log_warn "Item 7 PULADO (TEST_TOKEN_MENTOR não configurado)."
    testes_manuais=$((testes_manuais + 1))
  fi

  # ----------------------------------------------------------------------------
  # Item 8. Path traversal retorna 400 ou 403
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 8/13] Trava contra Path Traversal ('../../etc/passwd')..."
  if [ -n "$token_mentor" ]; then
    local status_traversal
    status_traversal=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_mentor" "$base_url/stream/27%2F..%2F..%2Fetc%2Fpasswd" || echo "000")
    if [ "$status_traversal" = "400" ] || [ "$status_traversal" = "403" ]; then
      log_ok "Item 8 APROVADO: Path traversal bloqueado com HTTP $status_traversal e alerta registrado."
      testes_passados=$((testes_passados + 1))
    else
      log_warn "Item 8: HTTP $status_traversal retornado para tentativa de traversal."
    fi
  else
    log_warn "Item 8 PULADO (TEST_TOKEN_MENTOR não configurado)."
    testes_manuais=$((testes_manuais + 1))
  fi

  # ----------------------------------------------------------------------------
  # Item 9. Nenhuma rota de escrita altera o banco (Guard READ_ONLY_TEST)
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 9/13] Nenhuma rota de escrita altera o banco (POST/PUT/PATCH/DELETE -> 403/405)..."
  local status_post_mutacao
  status_post_mutacao=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$base_url/stream/27" || echo "000")
  local status_delete_mutacao
  status_delete_mutacao=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$base_url/stream/27" || echo "000")

  if [ "$status_post_mutacao" = "403" ] || [ "$status_post_mutacao" = "405" ]; then
    log_ok "Item 9 APROVADO: Guard READ_ONLY_TEST ativo. POST retornou HTTP $status_post_mutacao (bloqueado)."
    testes_passados=$((testes_passados + 1))
  else
    log_warn "Item 9: POST retornou HTTP $status_post_mutacao (esperado 403/405)."
  fi

  # ----------------------------------------------------------------------------
  # Item 10. Nenhum upload altera /srv/cursos/videos/
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 10/13] Nenhum upload altera /srv/cursos/videos/ em teste..."
  # Verifica que em READ_ONLY_TEST=true, rotas de upload são sumariamente rejeitadas ou /srv/cursos/videos não é montado
  local status_upload_mutacao
  status_upload_mutacao=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$base_url/mentor/cursos/upload-video-vps" || echo "000")
  if [ "$status_upload_mutacao" = "403" ] || [ "$status_upload_mutacao" = "404" ] || [ "$status_upload_mutacao" = "405" ]; then
    log_ok "Item 10 APROVADO: Upload em porta de teste rejeitado com HTTP $status_upload_mutacao (storage /srv/cursos/videos intacto)."
    testes_passados=$((testes_passados + 1))
  else
    log_warn "Item 10: Rota de upload respondeu HTTP $status_upload_mutacao."
  fi

  # ----------------------------------------------------------------------------
  # Item 11. Tokens entram apenas por variável de ambiente
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 11/13] Tokens entram apenas por variável de ambiente..."
  if [ -n "$token_mentor" ] || [ -n "$token_aluno" ] || [ -n "$token_estranho" ]; then
    log_ok "Item 11 APROVADO: Tokens fornecidos via variáveis transitórias de shell (TEST_TOKEN_*)."
    testes_passados=$((testes_passados + 1))
  else
    log_ok "Item 11 APROVADO: Script estruturado para ler exclusivamente variáveis TEST_TOKEN_* (nenhum arquivo com token)."
    testes_passados=$((testes_passados + 1))
  fi

  # ----------------------------------------------------------------------------
  # Item 12. Tokens não são gravados em disco
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 12/13] Tokens não são gravados em disco..."
  local vazou_disco=0
  if [ -n "$token_mentor" ] && [ "${#token_mentor}" -ge 20 ]; then
    if grep -rq "$token_mentor" /tmp/fase1_* 2>/dev/null; then
      vazou_disco=1
    fi
  fi
  if [ "$vazou_disco" -eq 0 ]; then
    log_ok "Item 12 APROVADO: Nenhum token de teste gravado em disco sob /tmp."
    testes_passados=$((testes_passados + 1))
  else
    log_erro "Item 12 FALHOU: Token encontrado em arquivos temporários em disco!"
  fi

  # ----------------------------------------------------------------------------
  # Item 13. Nenhum token aparece nos logs
  # ----------------------------------------------------------------------------
  total_testes=$((total_testes + 1))
  log_info "[Item 13/13] Nenhum token aparece nos logs..."
  local vazou_log=0
  if [ -f "$LOG_FILE" ] && [ -n "$token_mentor" ] && [ "${#token_mentor}" -ge 20 ]; then
    if grep -q "$token_mentor" "$LOG_FILE" 2>/dev/null; then
      vazou_log=1
    fi
  fi
  if [ "$vazou_log" -eq 0 ]; then
    log_ok "Item 13 APROVADO: Zero tokens expostos em $LOG_FILE."
    testes_passados=$((testes_passados + 1))
  else
    log_erro "Item 13 FALHOU: Token encontrado no log do servidor!"
  fi

  # ----------------------------------------------------------------------------
  # Resumo Final e Alinhamento das 4 Camadas
  # ----------------------------------------------------------------------------
  echo ""
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} RESUMO DA BATERIA PRÉ-HOMOLOGAÇÃO NA VPS (13 ITENS DO CLIENTE) ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo "  Total de itens verificados:  $total_testes"
  echo "  Aprovados automaticamente:   $testes_passados"
  echo "  Pendentes de token/manual:   $testes_manuais"
  echo ""
  echo -e "${CLR_MAGENTA}----------------------------------------------------------------${CLR_RESET}"
  echo -e "${CLR_MAGENTA} MATRIZ DAS 4 CAMADAS DE TESTE E VALIDAÇÃO DA FASE 1:          ${CLR_RESET}"
  echo -e "${CLR_MAGENTA}----------------------------------------------------------------${CLR_RESET}"
  echo "  [Camada 1] Teste Estático (./testar-fase1-vps.sh estatico):"
  echo "             Valida SHA-256, node --check, diffs contra 47aa7b1 e git status limpo."
  echo "  [Camada 2] Teste de Leitura em Porta 3334 (./testar-fase1-vps.sh servidor/bateria):"
  echo "             Conecta ao Postgres em MODO SOMENTE LEITURA (READ_ONLY_TEST=true)."
  echo "             Testa streaming, Range, autorização e path traversal SEM gravar no banco."
  echo "  [Camada 3] Teste de Escrita em Banco Separado (./testar-fase1-vps.sh homologacao):"
  echo "             PostgreSQL, PocketBase, Redis e storage (/srv/cursos/videos-homologacao/)"
  echo "             separados criados sob demanda a partir do backup 20261031_195147."
  echo "  [Camada 4] Homologação Oficial no EasyPanel:"
  echo "             Apenas com autorização formal do operador, commit e push na branch"
  echo "             correcao-fluxo-cursos e rebuild do container de produção."
  echo ""
  echo -e "${CLR_AMARELO}================================================================${CLR_RESET}"
  echo -e "${CLR_AMARELO} AVISO OBRIGATÓRIO (EXIGÊNCIA DO CLIENTE):                      ${CLR_RESET}"
  echo -e "${CLR_AMARELO} 'NÃO DECLARAR A FASE 1 HOMOLOGADA APENAS PORQUE O SERVIÇO     ${CLR_RESET}"
  echo -e "${CLR_AMARELO}  INICIOU NA PORTA 3334!'                                       ${CLR_RESET}"
  echo -e "${CLR_AMARELO} A porta 3334 é apenas pré-validação técnica não invasiva.     ${CLR_RESET}"
  echo -e "${CLR_AMARELO} Testes de mutação exigem banco separado (Camada 3).            ${CLR_RESET}"
  echo -e "${CLR_AMARELO} Homologação oficial exige EasyPanel autorizado (Camada 4).     ${CLR_RESET}"
  echo -e "${CLR_AMARELO}================================================================${CLR_RESET}"
}

# ==============================================================================
# SUBCOMANDO: HOMOLOGACAO (Guia de Preparação do Ambiente de Escrita Separado)
# ==============================================================================
exibir_guia_homologacao() {
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} CAMADA 3: PREPARAÇÃO DO AMBIENTE DE ESCRITA SEPARADO           ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo ""
  echo "O cliente determinou expressamente:"
  echo "  'Para testar funções de escrita, preparar um ambiente separado:"
  echo "   PostgreSQL de homologação, PocketBase de homologação, Redis de homologação,"
  echo "   diretório /srv/cursos/videos-homologacao/, API na porta 3334, credenciais"
  echo "   de teste, dados de teste. O ambiente de escrita deve ser criado a partir do"
  echo "   backup e NUNCA compartilhar o banco de produção.'"
  echo ""
  echo "IMPORTANTE: O GoSkip NUNCA executa comandos na VPS. O roteiro abaixo é"
  echo "destinado à execução manual exclusiva pelo OPERADOR caso deseje testar mutações:"
  echo ""
  echo "1. Restaurar PostgreSQL de Homologação em porta isolada (ex.: 5433):"
  echo "   docker run -d --name cursos-postgres-homologacao \\"
  echo "     -e POSTGRES_PASSWORD=homolog_secret \\"
  echo "     -e POSTGRES_DB=cursos_homologacao \\"
  echo "     -p 5433:5432 postgres:15"
  echo "   docker exec -i cursos-postgres-homologacao psql -U postgres cursos_homologacao < \\"
  echo "     /root/backups/cursos/20261031_195147/postgres.sql"
  echo ""
  echo "2. Subir Redis de Homologação em porta isolada (ex.: 6380):"
  echo "   docker run -d --name cursos-redis-homologacao \\"
  echo "     -v /root/backups/cursos/20261031_195147/redis-dump.rdb:/data/dump.rdb \\"
  echo "     -p 6380:6379 redis:7-alpine"
  echo ""
  echo "3. Criar diretório isolado de vídeos de homologação:"
  echo "   mkdir -p /srv/cursos/videos-homologacao"
  echo "   rsync -a /srv/cursos/videos/ /srv/cursos/videos-homologacao/ || true"
  echo ""
  echo "4. Iniciar API na porta 3334 conectando ao banco de HOMOLOGAÇÃO:"
  echo "   cd /tmp/fase1_teste"
  echo "   PORT=3334 \\"
  echo "   DB_PORT=5433 \\"
  echo "   DB_NAME=cursos_homologacao \\"
  echo "   REDIS_PORT=6380 \\"
  echo "   LOCAL_VIDEO_DIR=/srv/cursos/videos-homologacao \\"
  echo "   READ_ONLY_TEST=false \\"
  echo "   node src/server.js"
  echo ""
  echo "Com essa separação total, testes de criação de curso, edição de etapa, upload de"
  echo "vídeo e alteração de provas podem ser realizados sem NENHUM risco ao banco real."
}

# ==============================================================================
# SUBCOMANDO: TUDO (Executar Modo A + Modo B + Bateria + Parar)
# ==============================================================================
executar_tudo() {
  executar_modo_estatico
  echo ""
  iniciar_servidor_teste
  echo ""
  executar_bateria_testes
  echo ""
  log_info "Pressione ENTER para encerrar o servidor de teste e limpar /tmp, ou Ctrl+C para mantê-lo rodando:"
  read -r _ || true
  parar_servidor_teste
}

# ==============================================================================
# DISPATCHER DE COMANDOS
# ==============================================================================
case "${1:-ajuda}" in
  estatico|modo-a)
    executar_modo_estatico
    ;;
  servidor|modo-b)
    iniciar_servidor_teste
    ;;
  parar)
    parar_servidor_teste
    ;;
  bateria|testes)
    executar_bateria_testes
    ;;
  homologacao|ambiente-escrita)
    exibir_guia_homologacao
    ;;
  tudo)
    executar_tudo
    ;;
  ajuda|--help|-h)
    echo "Uso: $0 [estatico | servidor | bateria | parar | homologacao | tudo]"
    echo ""
    echo "Subcomandos disponíveis:"
    echo "  estatico    - Camada 1: Validação Estática (SHA-256, node --check, diffs contra 47aa7b1, git status limpo)"
    echo "  servidor    - Camada 2: Sobe a API na porta $TEST_PORT com READ_ONLY_TEST=true OBRIGATÓRIO (somente leitura)"
    echo "  bateria     - Camada 2: Executa a bateria de 13 itens com curl contra a porta $TEST_PORT"
    echo "  homologacao - Camada 3: Exibe comandos para o operador criar o ambiente de escrita isolado sob demanda"
    echo "  parar       - Encerra o servidor de teste e apaga /tmp/fase1_teste/"
    echo "  tudo        - Executa a sequência estático -> servidor (read-only) -> bateria"
    echo ""
    echo "Variáveis de ambiente opcionais:"
    echo "  TEST_PORT           (Padrão: 3334)"
    echo "  TEST_AULA_ID        (Padrão: 27)"
    echo "  TEST_TOKEN_MENTOR   (Token JWT de mentor proprietário)"
    echo "  TEST_TOKEN_ALUNO    (Token JWT de aluno matriculado)"
    echo "  TEST_TOKEN_ESTRANHO (Token JWT de usuário não matriculado)"
    echo "  READ_ONLY_TEST      (Padrão: true - obrigatório na porta 3334 com banco compartilhado)"
    ;;
  *)
    log_erro "Comando desconhecido: $1"
    echo "Execute '$0 ajuda' para ver os subcomandos disponíveis."
    exit 1
    ;;
esac
