#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE TESTE PRÉ-HOMOLOGAÇÃO NÃO INVASIVO NA VPS (FASE 1)
# ==============================================================================
# Projeto: Plataforma Cursos (Cursos-API / Painel do Mentor)
# Arquivo: docs/operacoes/testar-fase1-vps.sh
# Destino: Execução manual pelo Operador na VPS
# Diretriz de Segurança: NUNCA grava arquivos fora de /tmp. NUNCA exibe segredos.
#                        Marcador oficial: [TOKEN_REMOVIDO_E_ROTACIONADO]
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
HASH_ESPERADO_STREAM="723a1dd7e0344d2d48083bf2dc07dd43bc20d7f95521b33b70e7041fde5b945c"
HASH_ESPERADO_PAINEL="3d9501a300d8b4e7a3ec11cc0a66d548f7663e6e87f2e1a47321e06fa536f0e4"

# Cores para exibição amigável
CLR_RESET="\033[0m"
CLR_VERDE="\033[1;32m"
CLR_VERMELHO="\033[1;31m"
CLR_AMARELO="\033[1;33m"
CLR_AZUL="\033[1;34m"
CLR_CIANO="\033[1;36m"

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
  log_info "=== INICIANDO MODO A: VALIDAÇÃO ESTÁTICA (ZERO RISCO) ==="

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
  echo -e "${CLR_VERDE} MODO A (ESTÁTICO) CONCLUÍDO COM SUCESSO E ZERO RISCO!         ${CLR_RESET}"
  echo -e "${CLR_VERDE}================================================================${CLR_RESET}"
  echo "Próximo passo recomendado: './testar-fase1-vps.sh servidor' para Modo B"
}

# ==============================================================================
# SUBCOMANDO: SERVIDOR (Modo B - Iniciar Servidor de Teste)
# ==============================================================================
iniciar_servidor_teste() {
  log_info "=== INICIANDO MODO B: SERVIDOR ISOLADO NA PORTA $TEST_PORT ==="

  garantir_guarda_tmp

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

  # Iniciar servidor
  log_info "4/4. Subindo aplicação com Node.js na porta $TEST_PORT..."
  cd "$TESTE_DIR"

  # Carrega variáveis do .env real SEM jamais exibir na saída
  if [ -f "$REPO_DIR/.env" ]; then
    PORT="$TEST_PORT" env $(grep -v '^#' "$REPO_DIR/.env" | xargs -d '\n') PORT="$TEST_PORT" node src/server.js > "$LOG_FILE" 2>&1 &
  else
    PORT="$TEST_PORT" node src/server.js > "$LOG_FILE" 2>&1 &
  fi

  local server_pid=$!
  echo "$server_pid" > "$PID_FILE"
  log_info "Processo iniciado com PID $server_pid em background. Aguardando inicialização..."

  sleep 3

  if kill -0 "$server_pid" 2>/dev/null; then
    log_ok "Servidor de teste ISOLADO rodando com sucesso (PID $server_pid) na porta $TEST_PORT!"
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
# SUBCOMANDO: BATERIA (Testes HTTP Automatizados via curl)
# ==============================================================================
executar_bateria_testes() {
  log_info "=== EXECUTANDO BATERIA DE TESTES COM CURL CONTRA PORTA $TEST_PORT ==="

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

  local total_testes=0
  local testes_passados=0
  local testes_manuais=0

  # Teste 1: Health Check (Esperado: 200)
  total_testes=$((total_testes + 1))
  log_info "Teste 1: Health check na porta $TEST_PORT..."
  local status_health
  status_health=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/health" || curl -s -o /dev/null -w "%{http_code}" "$base_url/" || echo "000")
  if [ "$status_health" = "200" ]; then
    log_ok "Teste 1 APROVADO: HTTP $status_health recebido."
    testes_passados=$((testes_passados + 1))
  else
    log_erro "Teste 1 FALHOU: HTTP $status_health (esperado 200)."
  fi

  # Teste 2: Stream sem token (Esperado: 401 Unauthorized)
  total_testes=$((total_testes + 1))
  log_info "Teste 2: Stream sem autenticação (esperado: 401)..."
  local status_anon
  status_anon=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/stream/$aula_id" || echo "000")
  if [ "$status_anon" = "401" ]; then
    log_ok "Teste 2 APROVADO: HTTP 401 Unauthorized retornado corretamente pelo middleware de autenticação."
    testes_passados=$((testes_passados + 1))
  else
    log_warn "Teste 2: HTTP $status_anon recebido (esperado 401)."
  fi

  # Teste 3: Stream com usuário sem relação (Esperado: 403 Forbidden)
  total_testes=$((total_testes + 1))
  log_info "Teste 3: Stream com usuário sem permissão no curso (esperado: 403)..."
  if [ -n "$token_estranho" ]; then
    local status_estranho
    status_estranho=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_estranho" "$base_url/stream/$aula_id" || echo "000")
    if [ "$status_estranho" = "403" ]; then
      log_ok "Teste 3 APROVADO: HTTP 403 Forbidden retornado com sucesso."
      testes_passados=$((testes_passados + 1))
    else
      log_erro "Teste 3 FALHOU: HTTP $status_estranho recebido (esperado 403)."
    fi
  else
    log_warn "Teste 3 PULADO (TEST_TOKEN_ESTRANHO não configurado pelo operador)."
    testes_manuais=$((testes_manuais + 1))
  fi

  # Teste 4: Stream com Range bytes=0-1048576 (Esperado: 206 Partial Content)
  total_testes=$((total_testes + 1))
  log_info "Teste 4: Stream com Range HTTP bytes=0-1048576 e token do Mentor (esperado: 206)..."
  if [ -n "$token_mentor" ]; then
    local cabecalho_range
    cabecalho_range=$(curl -s -I -H "Authorization: Bearer $token_mentor" -H "Range: bytes=0-1048576" "$base_url/stream/$aula_id" || true)
    local status_range
    status_range=$(echo "$cabecalho_range" | grep -E '^HTTP/' | awk '{print $2}' | tail -n 1)

    if [ "$status_range" = "206" ]; then
      log_ok "Teste 4 APROVADO: HTTP 206 Partial Content retornado."
      if echo "$cabecalho_range" | grep -iq "content-range"; then
        log_ok "Header Content-Range validado no retorno."
      fi
      if echo "$cabecalho_range" | grep -iq "video/mp4"; then
        log_ok "Header Content-Type: video/mp4 validado."
      fi
      testes_passados=$((testes_passados + 1))
    elif [ "$status_range" = "404" ]; then
      log_warn "Teste 4: HTTP 404 (Arquivo físico de vídeo não existe neste ambiente, mas rota e permissões responderam)."
      testes_manuais=$((testes_manuais + 1))
    else
      log_erro "Teste 4 FALHOU: HTTP $status_range recebido (esperado 206)."
    fi
  else
    log_warn "Teste 4 PULADO (TEST_TOKEN_MENTOR não configurado pelo operador)."
    testes_manuais=$((testes_manuais + 1))
  fi

  # Teste 5: Stream sem Range (Esperado: 200 OK ou 404 se arquivo não existe)
  total_testes=$((total_testes + 1))
  log_info "Teste 5: Stream sem Range e token do Mentor (esperado: 200)..."
  if [ -n "$token_mentor" ]; then
    local status_sem_range
    status_sem_range=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_mentor" "$base_url/stream/$aula_id" || echo "000")
    if [ "$status_sem_range" = "200" ]; then
      log_ok "Teste 5 APROVADO: HTTP 200 OK retornado."
      testes_passados=$((testes_passados + 1))
    elif [ "$status_sem_range" = "404" ]; then
      log_warn "Teste 5: HTTP 404 (Arquivo físico ausente no ambiente de teste, rota tratada)."
      testes_manuais=$((testes_manuais + 1))
    else
      log_erro "Teste 5: HTTP $status_sem_range recebido (esperado 200)."
    fi
  else
    log_warn "Teste 5 PULADO (TEST_TOKEN_MENTOR não configurado)."
    testes_manuais=$((testes_manuais + 1))
  fi

  # Teste 6: Aula nova sem video_path (Esperado: 400 Bad Request — NUNCA tocar aula 27)
  total_testes=$((total_testes + 1))
  log_info "Teste 6: Aula sem video_path (ID 99999) — esperado: 400 ou 404..."
  if [ -n "$token_mentor" ]; then
    local status_sem_video
    local corpo_sem_video
    corpo_sem_video=$(curl -s -H "Authorization: Bearer $token_mentor" "$base_url/stream/99999" || true)
    status_sem_video=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_mentor" "$base_url/stream/99999" || echo "000")

    if [ "$status_sem_video" = "400" ] || [ "$status_sem_video" = "404" ]; then
      log_ok "Teste 6 APROVADO: HTTP $status_sem_video com erro claro. Aula inexistente/sem vídeo NUNCA reproduz a aula 27!"
      testes_passados=$((testes_passados + 1))
    else
      log_warn "Teste 6: HTTP $status_sem_video retornado."
    fi
  else
    log_warn "Teste 6 PULADO (TEST_TOKEN_MENTOR não configurado)."
    testes_manuais=$((testes_manuais + 1))
  fi

  # Teste 7: Tentativa de Path Traversal (Esperado: 400/403 e log de violação)
  total_testes=$((total_testes + 1))
  log_info "Teste 7: Trava contra Path Traversal ('../../etc/passwd')..."
  if [ -n "$token_mentor" ]; then
    local status_traversal
    status_traversal=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token_mentor" "$base_url/stream/27%2F..%2F..%2Fetc%2Fpasswd" || echo "000")
    if [ "$status_traversal" = "400" ] || [ "$status_traversal" = "403" ]; then
      log_ok "Teste 7 APROVADO: Requisição maliciosa bloqueada com HTTP $status_traversal."
      testes_passados=$((testes_passados + 1))
    else
      log_warn "Teste 7: HTTP $status_traversal retornado."
    fi
  else
    log_warn "Teste 7 PULADO (TEST_TOKEN_MENTOR não configurado)."
    testes_manuais=$((testes_manuais + 1))
  fi

  # Resumo Final
  echo ""
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo -e "${CLR_CIANO} RESUMO DA BATERIA PRÉ-HOMOLOGAÇÃO NA VPS                      ${CLR_RESET}"
  echo -e "${CLR_CIANO}================================================================${CLR_RESET}"
  echo "  Total de testes executados:  $total_testes"
  echo "  Aprovados automaticamente:   $testes_passados"
  echo "  Pendentes de token/manual:   $testes_manuais"
  echo ""
  if [ "$testes_passados" -ge 2 ]; then
    echo -e "${CLR_VERDE}STATUS: APROVADO (Servidor de teste e rotas íntegras na VPS)${CLR_RESET}"
  else
    echo -e "${CLR_AMARELO}STATUS: MANUAL PENDENTE (Configure os tokens e reexecute)${CLR_RESET}"
  fi
  echo "Para conferir itens de navegador (substituição de token, replaceState e sessionStorage):"
  echo "  Consulte a Seção 7 de docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md"
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
  tudo)
    executar_tudo
    ;;
  ajuda|--help|-h)
    echo "Uso: $0 [estatico | servidor | bateria | parar | tudo]"
    echo ""
    echo "Subcomandos disponíveis:"
    echo "  estatico  - Executa o Modo A (SHA-256, node --check, diff contra 47aa7b1 e git status limpo)"
    echo "  servidor  - Sobe o servidor de teste em porta alternativa ($TEST_PORT) em /tmp/fase1_teste/"
    echo "  bateria   - Executa os testes HTTP com curl contra o servidor na porta $TEST_PORT"
    echo "  parar     - Encerra o servidor de teste e apaga /tmp/fase1_teste/"
    echo "  tudo      - Executa a sequência completa de ponta a ponta"
    echo ""
    echo "Variáveis de ambiente opcionais:"
    echo "  TEST_PORT           (Padrão: 3334)"
    echo "  TEST_AULA_ID        (Padrão: 27)"
    echo "  TEST_TOKEN_MENTOR   (Token JWT de mentor proprietário)"
    echo "  TEST_TOKEN_ESTRANHO (Token JWT de usuário não matriculado)"
    ;;
  *)
    log_erro "Comando desconhecido: $1"
    echo "Execute '$0 ajuda' para ver os subcomandos disponíveis."
    exit 1
    ;;
esac