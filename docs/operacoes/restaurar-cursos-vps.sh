#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE RESTAURAÇÃO OPERACIONAL - CURSOS-API (VPS)
# Arquivo: docs/operacoes/restaurar-cursos-vps.sh
# Finalidade: Restauração guiada e segura a partir de snapshot de backup.
# Execução: Executado manualmente como root na VPS.
# Uso: ./restaurar-cursos-vps.sh /srv/backups/cursos/<timestamp> [--dry-run]
# ==============================================================================

set -euo pipefail
IFS=$'\n\t'

SCRIPT_VERSION="1.0.0-fase0"
DRY_RUN=false

# Avaliação dos parâmetros
if [ "$#" -lt 1 ]; then
  echo "USO: $0 <caminho_do_diretorio_de_backup> [--dry-run]"
  echo "Exemplo: $0 /srv/backups/cursos/20250510_143000 --dry-run"
  exit 1
fi

BACKUP_DIR="$1"

if [ "${2:-}" = "--dry-run" ] || [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=true
  if [ "$1" = "--dry-run" ]; then
    BACKUP_DIR="${2:-}"
  fi
fi

if [ -z "${BACKUP_DIR}" ] || [ ! -d "${BACKUP_DIR}" ]; then
  echo "[ERRO] Diretório de backup inexistente ou inacessível: '${BACKUP_DIR}'" >&2
  exit 1
fi

PROJECT_DIR="${PROJECT_DIR:-/root/cursos-api}"
VIDEOS_HOST_DIR="${VIDEOS_HOST_DIR:-/srv/cursos/videos}"

# Nomes padrão ou configuráveis dos containers
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-cursos-api_postgres}"
POCKETBASE_CONTAINER="${POCKETBASE_CONTAINER:-cursos-api_pocketbase}"
REDIS_CONTAINER="${REDIS_CONTAINER:-cursos-api_redis}"
API_CONTAINER="${API_CONTAINER:-cursos-api_app}"

PGDATABASE="${PGDATABASE:-cursos}"
PGUSER="${PGUSER:-postgres}"

log_step() {
  echo -e "\n======================================================================"
  echo -e " [ETAPA RESTAURAÇÃO] $1"
  echo -e "======================================================================"
}

confirm_step() {
  local prompt_text="$1"
  if [ "${DRY_RUN}" = true ]; then
    echo "[DRY-RUN] Simulação: passo '${prompt_text}' seria executado agora."
    return 0
  fi

  echo -en "\n--> DESEJA EXECUTAR ESTA ETAPA? (${prompt_text}) [s/N]: "
  read -r resposta
  if [[ ! "${resposta}" =~ ^[sS]$ ]]; then
    echo "[PULADO] Etapa ignorada a pedido do operador."
    return 1
  fi
  return 0
}

find_container() {
  local pattern="$1"
  local found
  found=$(docker ps --format '{{.Names}}' | grep -i "${pattern}" | head -n 1 || true)
  echo "${found}"
}

# Auto-descoberta dos nomes reais no Docker/EasyPanel
ACTUAL_PG=$(find_container "postgre")
[ -n "${ACTUAL_PG}" ] && POSTGRES_CONTAINER="${ACTUAL_PG}"

ACTUAL_PB=$(find_container "pocketbase")
[ -n "${ACTUAL_PB}" ] && POCKETBASE_CONTAINER="${ACTUAL_PB}"

ACTUAL_REDIS=$(find_container "redis")
[ -n "${ACTUAL_REDIS}" ] && REDIS_CONTAINER="${ACTUAL_REDIS}"

ACTUAL_API=$(find_container "cursos")
[ -n "${ACTUAL_API}" ] && API_CONTAINER="${ACTUAL_API}"

echo "======================================================================"
echo " SCRIPT DE RESTAURAÇÃO GUIADA - CURSOS-API"
echo " Versão:           ${SCRIPT_VERSION}"
echo " Modo de Execução: $( [ "${DRY_RUN}" = true ] && echo "DRY-RUN (Simulação segura sem alterações)" || echo "PRODUÇÃO INTERATIVA (Real)" )"
echo " Diretório Alvo:   ${BACKUP_DIR}"
echo " Projeto Git:      ${PROJECT_DIR}"
echo " Vídeos Persist.:  ${VIDEOS_HOST_DIR}"
echo " Containers:       Postgres(${POSTGRES_CONTAINER}), PocketBase(${POCKETBASE_CONTAINER}), Redis(${REDIS_CONTAINER}), API(${API_CONTAINER})"
echo "======================================================================"

# ==============================================================================
# VALIDAÇÃO PRÉVIA: MANIFESTO E CHECKSUMS
# ==============================================================================
log_step "Validação Prévia de Integridade e Manifesto"

if [ -f "${BACKUP_DIR}/backup-manifest.txt" ]; then
  echo "[OK] Manifesto encontrado:"
  head -n 20 "${BACKUP_DIR}/backup-manifest.txt"
else
  echo "[AVISO] Manifesto backup-manifest.txt ausente no diretório informado."
fi

echo -e "\nListagem dos artefatos disponíveis:"
ls -lh "${BACKUP_DIR}"

if [ -f "${BACKUP_DIR}/checksums.sha256" ]; then
  echo -e "\nVerificando integridade SHA-256..."
  cd "${BACKUP_DIR}"
  if sha256sum -c "${BACKUP_DIR}/checksums.sha256"; then
    echo "[OK] Todos os checksums conferem perfeitamente."
  else
    echo "[ERRO] Divergência nos checksums de integridade!" >&2
    if [ "${DRY_RUN}" = false ]; then
      echo -n "Deseja continuar mesmo com falha no checksum? [s/N]: "
      read -r continue_err
      if [[ ! "${continue_err}" =~ ^[sS]$ ]]; then
        echo "Operação abortada pelo operador."
        exit 1
      fi
    fi
  fi
fi

if [ "${DRY_RUN}" = true ]; then
  echo -e "\n[DRY-RUN] Plano de Restauração que seria executado:"
  echo " 1. Restaurar Repositório Git (bundle / tag estável) em ${PROJECT_DIR}"
  echo " 2. Restaurar Banco de Dados PostgreSQL (pg_restore --clean) no container ${POSTGRES_CONTAINER}"
  echo " 3. Restaurar Dados do PocketBase no container ${POCKETBASE_CONTAINER}"
  echo " 4. Restaurar Vídeos Persistentes em ${VIDEOS_HOST_DIR}"
  echo " 5. Reiniciar Serviços no Docker / EasyPanel"
  echo -e "\nFim do modo --dry-run. Nenhuma alteração foi realizada no sistema."
  exit 0
fi

# ==============================================================================
# PASSO 1: RESTAURAR O REPOSITÓRIO GIT E WORKING TREE
# ==============================================================================
log_step "Passo 1/5: Restaurar Repositório Git e Working Tree"

if confirm_step "Restaurar estado do Git e código fonte para a versão do backup"; then
  if [ -f "${BACKUP_DIR}/git-state.env" ]; then
    # shellcheck source=/dev/null
    source "${BACKUP_DIR}/git-state.env"
    echo "Commit alvo registrado no backup: ${COMMIT_HASH:-N/A}"
    echo "Tag anotada de backup:            ${TAG:-N/A}"
  fi

  cd "${PROJECT_DIR}"
  
  if [ -f "${BACKUP_DIR}/repo-bundle-with-tag.bundle" ]; then
    echo "Importando referências a partir do bundle..."
    git bundle verify "${BACKUP_DIR}/repo-bundle-with-tag.bundle"
    git fetch "${BACKUP_DIR}/repo-bundle-with-tag.bundle" '*:*'
  elif [ -f "${BACKUP_DIR}/repo-bundle.bundle" ]; then
    git bundle verify "${BACKUP_DIR}/repo-bundle.bundle"
    git fetch "${BACKUP_DIR}/repo-bundle.bundle" '*:*'
  fi

  if [ -n "${TAG:-}" ] && git rev-parse "${TAG}" >/dev/null 2>&1; then
    echo "Fazendo checkout da tag: ${TAG}"
    git checkout "${TAG}"
  elif [ -n "${COMMIT_HASH:-}" ] && [ "${COMMIT_HASH}" != "SEM_GIT" ]; then
    echo "Fazendo checkout do commit: ${COMMIT_HASH}"
    git checkout "${COMMIT_HASH}"
  else
    echo "Restaurando working-tree.tar.gz sobre ${PROJECT_DIR}..."
    tar -xzf "${BACKUP_DIR}/working-tree.tar.gz" -C "${PROJECT_DIR}"
  fi
  echo "[OK] Código fonte e Git restaurados com sucesso."
fi

# ==============================================================================
# PASSO 2: RESTAURAR BANCO DE DADOS POSTGRESQL (pg_restore --clean)
# ==============================================================================
log_step "Passo 2/5: Restaurar Banco PostgreSQL (pg_restore --clean)"

if confirm_step "Restaurar dump do PostgreSQL no container ${POSTGRES_CONTAINER}"; then
  if [ -f "${BACKUP_DIR}/postgres-full.dump" ]; then
    echo "Executando pg_restore com --clean --if-exists no container ${POSTGRES_CONTAINER}..."
    docker exec -i -e PGPASSWORD="${PGPASSWORD:-}" "${POSTGRES_CONTAINER}" \
      pg_restore -U "${PGUSER}" -d "${PGDATABASE}" --clean --if-exists -v < "${BACKUP_DIR}/postgres-full.dump" || {
        echo "[AVISO] pg_restore retornou avisos não fatais (esperado em objetos já existentes ou roles)."
      }
    echo "[OK] Banco PostgreSQL restaurado."
  else
    echo "[ALERTA] Arquivo postgres-full.dump não encontrado no diretório de backup."
  fi
fi

# ==============================================================================
# PASSO 3: RESTAURAR POCKETBASE
# ==============================================================================
log_step "Passo 3/5: Restaurar Dados do PocketBase"

if confirm_step "Restaurar dados do PocketBase no container ${POCKETBASE_CONTAINER}"; then
  if [ -f "${BACKUP_DIR}/pocketbase-data.tar.gz" ] && [ -s "${BACKUP_DIR}/pocketbase-data.tar.gz" ]; then
    echo "Parando temporariamente o container do PocketBase para substituição consistente dos dados..."
    docker stop "${POCKETBASE_CONTAINER}" || true

    mkdir -p /tmp/pb_restore
    tar -xzf "${BACKUP_DIR}/pocketbase-data.tar.gz" -C /tmp/pb_restore

    if docker exec "${POCKETBASE_CONTAINER}" test -d /pb_data 2>/dev/null; then
      docker cp /tmp/pb_restore/. "${POCKETBASE_CONTAINER}:/pb_data/"
    elif docker exec "${POCKETBASE_CONTAINER}" test -d /app/pb_data 2>/dev/null; then
      docker cp /tmp/pb_restore/. "${POCKETBASE_CONTAINER}:/app/pb_data/"
    fi
    rm -rf /tmp/pb_restore

    docker start "${POCKETBASE_CONTAINER}"
    echo "[OK] PocketBase restaurado e container reiniciado."
  else
    echo "[AVISO] pocketbase-data.tar.gz vazio ou não presente. Etapa pulada."
  fi
fi

# ==============================================================================
# PASSO 4: RESTAURAR DIRETÓRIO DE VÍDEOS PERSISTENTES
# ==============================================================================
log_step "Passo 4/5: Restaurar Vídeos Persistentes (/srv/cursos/videos/)"

if confirm_step "Descompactar vídeos persistentes em ${VIDEOS_HOST_DIR}"; then
  if [ -f "${BACKUP_DIR}/videos-persistent.tar.gz" ]; then
    mkdir -p "${VIDEOS_HOST_DIR}"
    echo "Restaurando arquivos de vídeo sobre ${VIDEOS_HOST_DIR}..."
    tar -xzf "${BACKUP_DIR}/videos-persistent.tar.gz" -C "${VIDEOS_HOST_DIR}"
    echo "[OK] Diretório de vídeos restaurado."
  else
    echo "[ALERTA] Arquivo videos-persistent.tar.gz não encontrado."
  fi
fi

# ==============================================================================
# PASSO 5: REINICIAR SERVIÇOS NO DOCKER / EASYPANEL
# ==============================================================================
log_step "Passo 5/5: Reiniciar Serviços Docker / EasyPanel"

if confirm_step "Reiniciar os 4 containers da aplicação (${REDIS_CONTAINER}, ${POSTGRES_CONTAINER}, ${POCKETBASE_CONTAINER}, ${API_CONTAINER})"; then
  echo "Reiniciando Redis..."
  docker restart "${REDIS_CONTAINER}" || true
  
  echo "Reiniciando PostgreSQL..."
  docker restart "${POSTGRES_CONTAINER}" || true
  
  echo "Reiniciando PocketBase..."
  docker restart "${POCKETBASE_CONTAINER}" || true
  
  echo "Reiniciando Cursos-API..."
  docker restart "${API_CONTAINER}" || true

  echo -e "\nAguardando estabilização dos serviços (5 segundos)..."
  sleep 5

  echo -e "\nStatus atual dos containers:"
  docker ps --filter "name=cursos" --filter "name=postgres" --filter "name=pocketbase" --filter "name=redis"
fi

echo -e "\n======================================================================"
echo " [CURSOS-API] PROCESSO DE RESTAURAÇÃO FINALIZADO!"
echo " Próximo passo obrigatório: executar a homologação em 8 etapas do PLANO_ROLLBACK.md"
echo "======================================================================"
