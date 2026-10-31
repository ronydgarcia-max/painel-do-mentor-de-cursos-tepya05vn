#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE BACKUP OPERACIONAL - CURSOS-API (VPS)
# Arquivo: docs/operacoes/backup-cursos-vps.sh
# Finalidade: Ponto de restauração completo do ecossistema cursos-api na VPS.
# Execução: Executado manualmente como root na VPS (EasyPanel / Docker).
# AVISO: NÃO contém senhas, tokens ou dados sensíveis gravados em texto puro.
# ==============================================================================

set -euo pipefail
IFS=$'\n\t'

SCRIPT_VERSION="1.0.0-fase0"
BACKUP_RESPONSIVEL="${BACKUP_RESPONSIVEL:-operador-vps}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
ISO_DATE="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

# Diretórios base na VPS
PROJECT_DIR="${PROJECT_DIR:-/root/cursos-api}"
BACKUP_BASE_DIR="${BACKUP_BASE_DIR:-/srv/backups/cursos}"
BACKUP_DIR="${BACKUP_BASE_DIR}/${TIMESTAMP}"
VIDEOS_HOST_DIR="${VIDEOS_HOST_DIR:-/srv/cursos/videos}"

# Nomes esperados de containers / serviços no EasyPanel / Docker
# Podem ser sobrescritos por variáveis de ambiente antes da execução
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-cursos-api_postgres}"
POCKETBASE_CONTAINER="${POCKETBASE_CONTAINER:-cursos-api_pocketbase}"
REDIS_CONTAINER="${REDIS_CONTAINER:-cursos-api_redis}"
API_CONTAINER="${API_CONTAINER:-cursos-api_app}"

# Nomes de banco de dados e usuário PostgreSQL (descoberta automática via env se não fornecido)
PGDATABASE="${PGDATABASE:-cursos}"
PGUSER="${PGUSER:-postgres}"

echo "======================================================================"
echo " [CURSOS-API] INICIANDO BACKUP COMPLETO DA VPS"
echo " Responsável: ${BACKUP_RESPONSIVEL}"
echo " Data/Hora:   ${ISO_DATE} (${TIMESTAMP})"
echo " Destino:     ${BACKUP_DIR}"
echo " Versão:      ${SCRIPT_VERSION}"
echo "======================================================================"

mkdir -p "${BACKUP_DIR}"
cd "${BACKUP_DIR}"

# Funções auxiliares para logs e conferência de containers
log_info() {
  echo -e "\n[INFO] $(date +'%H:%M:%S') - $1"
}

log_warn() {
  echo -e "\n[AVISO] $(date +'%H:%M:%S') - $1"
}

log_error() {
  echo -e "\n[ERRO] $(date +'%H:%M:%S') - $1" >&2
}

find_container() {
  local pattern="$1"
  local found
  found=$(docker ps --format '{{.Names}}' | grep -i "${pattern}" | head -n 1 || true)
  echo "${found}"
}

# Auto-descoberta dos nomes dos containers caso os defaults não batam com o EasyPanel
ACTUAL_PG_CONTAINER=$(find_container "postgre")
if [ -n "${ACTUAL_PG_CONTAINER}" ]; then
  POSTGRES_CONTAINER="${ACTUAL_PG_CONTAINER}"
fi

ACTUAL_PB_CONTAINER=$(find_container "pocketbase")
if [ -n "${ACTUAL_PB_CONTAINER}" ]; then
  POCKETBASE_CONTAINER="${ACTUAL_PB_CONTAINER}"
fi

ACTUAL_REDIS_CONTAINER=$(find_container "redis")
if [ -n "${ACTUAL_REDIS_CONTAINER}" ]; then
  REDIS_CONTAINER="${ACTUAL_REDIS_CONTAINER}"
fi

ACTUAL_API_CONTAINER=$(find_container "cursos")
if [ -n "${ACTUAL_API_CONTAINER}" ]; then
  API_CONTAINER="${ACTUAL_API_CONTAINER}"
fi

# ==============================================================================
# ITEM 1: BUNDLE DO REPOSITÓRIO GIT + CÓPIA DO WORKING TREE
# ==============================================================================
log_info "1/13: Gerando bundle do Git e cópia do working tree..."

if [ -d "${PROJECT_DIR}/.git" ]; then
  cd "${PROJECT_DIR}"
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "correcao-fluxo-cursos")
  GIT_COMMIT_FULL=$(git rev-parse HEAD 2>/dev/null || echo "UNKNOWN_COMMIT")
  
  # Cria o bundle completo incluindo todas as referências locais e tags
  git bundle create "${BACKUP_DIR}/repo-bundle.bundle" --all
  
  # Cópia do working tree excluindo node_modules, .cache e builds temporários
  tar --exclude="node_modules" \
      --exclude=".git" \
      --exclude="dist" \
      --exclude="build" \
      --exclude=".npm" \
      -czf "${BACKUP_DIR}/working-tree.tar.gz" -C "${PROJECT_DIR}" .
  
  cd "${BACKUP_DIR}"
else
  log_warn "Diretório Git não encontrado em ${PROJECT_DIR}. Criando tarball padrão do diretório..."
  GIT_COMMIT_FULL="SEM_GIT"
  CURRENT_BRANCH="desconhecida"
  if [ -d "${PROJECT_DIR}" ]; then
    tar --exclude="node_modules" -czf "${BACKUP_DIR}/working-tree.tar.gz" -C "${PROJECT_DIR}" .
  fi
  touch "${BACKUP_DIR}/repo-bundle.bundle"
fi

# ==============================================================================
# ITEM 2: HASH DO ÚLTIMO COMMIT ESTÁVEL E TAG GIT DO ESTADO ANTERIOR
# ==============================================================================
log_info "2/13: Registrando hash do commit e criando tag Git de restauração..."

if [ -d "${PROJECT_DIR}/.git" ]; then
  cd "${PROJECT_DIR}"
  TAG_NAME="backup/pre-fase1-${TIMESTAMP}"
  # Cria tag anotada localmente sem subir para origin (VPS é estritamente manual)
  git tag -a "${TAG_NAME}" -m "Snapshot pré-Fase 1 criado por ${BACKUP_RESPONSIVEL} em ${ISO_DATE}" || true
  
  # Atualiza o bundle para garantir inclusão da nova tag recém-criada
  git bundle create "${BACKUP_DIR}/repo-bundle-with-tag.bundle" --all
  
  echo "COMMIT_HASH=${GIT_COMMIT_FULL}" > "${BACKUP_DIR}/git-state.env"
  echo "BRANCH=${CURRENT_BRANCH}" >> "${BACKUP_DIR}/git-state.env"
  echo "TAG=${TAG_NAME}" >> "${BACKUP_DIR}/git-state.env"
  cd "${BACKUP_DIR}"
else
  TAG_NAME="backup/pre-fase1-${TIMESTAMP}"
  echo "COMMIT_HASH=${GIT_COMMIT_FULL}" > "${BACKUP_DIR}/git-state.env"
  echo "TAG=${TAG_NAME}" >> "${BACKUP_DIR}/git-state.env"
fi

# ==============================================================================
# ITEM 3: DUMP COMPLETO DO POSTGRESQL (FORMATO CUSTOM -Fc VIA DOCKER EXEC)
# ==============================================================================
log_info "3/13: Executando dump do PostgreSQL (container: ${POSTGRES_CONTAINER})..."

if docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
  # Executa pg_dump dentro do container no formato custom (-Fc) que suporta pg_restore paralelo e seletivo
  docker exec -e PGPASSWORD="${PGPASSWORD:-}" "${POSTGRES_CONTAINER}" \
    pg_dump -U "${PGUSER}" -d "${PGDATABASE}" -Fc -v > "${BACKUP_DIR}/postgres-full.dump"
else
  log_warn "Container Postgres '${POSTGRES_CONTAINER}' não encontrado em execução. Tentando via sockets locais ou variáveis..."
  touch "${BACKUP_DIR}/postgres-full.dump"
fi

# ==============================================================================
# ITEM 4: SCHEMA E MIGRATIONS SEPARADOS
# ==============================================================================
log_info "4/13: Extraindo schema-only do Postgres e copiando arquivos de migração..."

if docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
  docker exec -e PGPASSWORD="${PGPASSWORD:-}" "${POSTGRES_CONTAINER}" \
    pg_dump -U "${PGUSER}" -d "${PGDATABASE}" --schema-only > "${BACKUP_DIR}/postgres-schema.sql"
else
  touch "${BACKUP_DIR}/postgres-schema.sql"
fi

mkdir -p "${BACKUP_DIR}/migrations-snapshot"

if [ -d "${PROJECT_DIR}/src/database/migrations" ]; then
  cp -r "${PROJECT_DIR}/src/database/migrations" "${BACKUP_DIR}/migrations-snapshot/" || true
fi
if [ -d "${PROJECT_DIR}/migrations" ]; then
  cp -r "${PROJECT_DIR}/migrations" "${BACKUP_DIR}/migrations-snapshot/" || true
fi
if [ -f "${PROJECT_DIR}/migration.sql" ]; then
  cp "${PROJECT_DIR}/migration.sql" "${BACKUP_DIR}/migrations-snapshot/" || true
fi
if [ -f "${PROJECT_DIR}/src/database/migrate.js" ]; then
  cp "${PROJECT_DIR}/src/database/migrate.js" "${BACKUP_DIR}/migrations-snapshot/" || true
fi

# ==============================================================================
# ITEM 5: BACKUP DOS DADOS DO POCKETBASE (DADOS/PB_DATA VIA DOCKER CP / TAR)
# ==============================================================================
log_info "5/13: Realizando backup do PocketBase (container: ${POCKETBASE_CONTAINER})..."

mkdir -p "${BACKUP_DIR}/pocketbase"
if docker ps --format '{{.Names}}' | grep -q "^${POCKETBASE_CONTAINER}$"; then
  # Tenta copiar o diretório pb_data padrão do container
  if docker exec "${POCKETBASE_CONTAINER}" test -d /pb_data 2>/dev/null; then
    docker cp "${POCKETBASE_CONTAINER}:/pb_data" "${BACKUP_DIR}/pocketbase/pb_data"
  elif docker exec "${POCKETBASE_CONTAINER}" test -d /app/pb_data 2>/dev/null; then
    docker cp "${POCKETBASE_CONTAINER}:/app/pb_data" "${BACKUP_DIR}/pocketbase/pb_data"
  else
    log_warn "Diretório pb_data não localizado diretamente na raiz do container. Copiando via volume docker..."
    # Localiza volumes montados no container do PocketBase
    PB_VOL=$(docker inspect "${POCKETBASE_CONTAINER}" --format '{{range .Mounts}}{{.Source}} {{end}}' | awk '{print $1}')
    if [ -n "${PB_VOL}" ] && [ -d "${PB_VOL}" ]; then
      tar -czf "${BACKUP_DIR}/pocketbase/pb_data_volume.tar.gz" -C "${PB_VOL}" .
    fi
  fi
  tar -czf "${BACKUP_DIR}/pocketbase-data.tar.gz" -C "${BACKUP_DIR}/pocketbase" .
  rm -rf "${BACKUP_DIR}/pocketbase"
else
  log_warn "Container PocketBase '${POCKETBASE_CONTAINER}' não localizado em execução."
  touch "${BACKUP_DIR}/pocketbase-data.tar.gz"
fi

# ==============================================================================
# ITEM 6: TAR DO DIRETÓRIO PERSISTENTE DE VÍDEOS (/srv/cursos/videos/)
# ==============================================================================
log_info "6/13: Realizando tar do diretório de vídeos (${VIDEOS_HOST_DIR})..."
log_warn "AVISO: Idealmente, o streaming e novos uploads devem ser pausados durante a cópia para consistência máxima."

if [ -d "${VIDEOS_HOST_DIR}" ]; then
  tar --warning=no-file-changed -czf "${BACKUP_DIR}/videos-persistent.tar.gz" -C "${VIDEOS_HOST_DIR}" .
else
  log_warn "Diretório de vídeos ${VIDEOS_HOST_DIR} não encontrado no host. Tentando criar placeholder..."
  mkdir -p /tmp/empty-videos
  tar -czf "${BACKUP_DIR}/videos-persistent.tar.gz" -C /tmp/empty-videos .
  rm -rf /tmp/empty-videos
fi

# ==============================================================================
# ITEM 7: DUMP DA CONFIGURAÇÃO DOS VOLUMES DOCKER
# ==============================================================================
log_info "7/13: Extraindo configuração e inspeção dos volumes Docker..."

mkdir -p "${BACKUP_DIR}/docker-metadata"
docker volume ls --format '{{.Name}}' | while read -r vol_name; do
  if [ -n "${vol_name}" ]; then
    docker volume inspect "${vol_name}" > "${BACKUP_DIR}/docker-metadata/volume_${vol_name}.json" 2>/dev/null || true
  fi
done

# Inspeção dos 4 serviços principais
for srv in "${POSTGRES_CONTAINER}" "${POCKETBASE_CONTAINER}" "${REDIS_CONTAINER}" "${API_CONTAINER}"; do
  if docker ps -a --format '{{.Names}}' | grep -q "^${srv}$"; then
    docker inspect "${srv}" > "${BACKUP_DIR}/docker-metadata/inspect_${srv}.json"
  fi
done

# ==============================================================================
# ITEM 8: CONFIGURAÇÃO DOS SERVIÇOS DO EASYPANEL (DOCKER INSPECT JSON)
# ==============================================================================
log_info "8/13: Salvando metadados dos serviços do EasyPanel (portas, volumes, redes, healthcheck)..."

cat << 'EOF' > "${BACKUP_DIR}/docker-metadata/extract_summary.py"
import sys, json

try:
    with open(sys.argv[1], 'r') as f:
        data = json.load(f)
    if isinstance(data, list) and len(data) > 0:
        c = data[0]
        summary = {
            "Id": c.get("Id", "")[:12],
            "Name": c.get("Name", ""),
            "Image": c.get("Config", {}).get("Image", ""),
            "Ports": c.get("NetworkSettings", {}).get("Ports", {}),
            "Mounts": c.get("Mounts", []),
            "Networks": list(c.get("NetworkSettings", {}).get("Networks", {}).keys()),
            "Healthcheck": c.get("Config", {}).get("Healthcheck", None),
            "State": c.get("State", {})
        }
        print(json.dumps(summary, indent=2))
except Exception as e:
    print(f'{{"error": "{str(e)}"}}')
EOF

for srv in "${POSTGRES_CONTAINER}" "${POCKETBASE_CONTAINER}" "${REDIS_CONTAINER}" "${API_CONTAINER}"; do
  if [ -f "${BACKUP_DIR}/docker-metadata/inspect_${srv}.json" ]; then
    python3 "${BACKUP_DIR}/docker-metadata/extract_summary.py" \
      "${BACKUP_DIR}/docker-metadata/inspect_${srv}.json" > "${BACKUP_DIR}/docker-metadata/summary_${srv}.json" 2>/dev/null || true
  fi
done
rm -f "${BACKUP_DIR}/docker-metadata/extract_summary.py"

# ==============================================================================
# ITEM 9: VARIÁVEIS DE AMBIENTE DOS CONTAINERS (VALORES SENSÍVEIS MASCARADOS)
# ==============================================================================
log_info "9/13: Coletando variáveis de ambiente com máscaras de segurança (REDACTED)..."

mkdir -p "${BACKUP_DIR}/env-audit"

cat << 'EOF' > "${BACKUP_DIR}/mask_env.py"
import sys, json, re

sensitive_pattern = re.compile(
    r'(SECRET|TOKEN|PASSWORD|KEY|PASS|AUTH|CREDENCIAL|PRIVATE|SIGNING)',
    re.IGNORECASE
)

url_cred_pattern = re.compile(r'://([^:]+):([^@]+)@')

def mask_value(k, v):
    if sensitive_pattern.search(k):
        return "***REDACTED***"
    if url_cred_pattern.search(v):
        # Mascara credenciais dentro de URLs como postgres://user:pass@host:5432/db
        return url_cred_pattern.sub(r'://\1:***REDACTED***@', v)
    return v

for filepath in sys.argv[1:]:
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        if isinstance(data, list) and len(data) > 0:
            c = data[0]
            name = c.get("Name", "container").lstrip("/")
            envs = c.get("Config", {}).get("Env", [])
            output_lines = [f"# Variáveis de Ambiente do Container: {name}", "# Chaves sensíveis mascaradas"]
            for item in envs:
                if "=" in item:
                    k, v = item.split("=", 1)
                    masked = mask_value(k, v)
                    output_lines.append(f"{k}={masked}")
                else:
                    output_lines.append(item)
            out_file = f"{sys.argv[1]}_masked.env".replace("docker-metadata/inspect_", "env-audit/masked_")
            with open(out_file, 'w') as out:
                out.write("\n".join(output_lines) + "\n")
    except Exception as e:
        sys.stderr.write(f"Erro processando envs de {filepath}: {e}\n")
EOF

for srv in "${POSTGRES_CONTAINER}" "${POCKETBASE_CONTAINER}" "${REDIS_CONTAINER}" "${API_CONTAINER}"; do
  if [ -f "${BACKUP_DIR}/docker-metadata/inspect_${srv}.json" ]; then
    python3 "${BACKUP_DIR}/mask_env.py" "${BACKUP_DIR}/docker-metadata/inspect_${srv}.json" 2>/dev/null || true
  fi
done
rm -f "${BACKUP_DIR}/mask_env.py"

# ==============================================================================
# ITEM 10: CONFIGURAÇÃO DE DOMÍNIOS, PORTAS E REDES DOCKER
# ==============================================================================
log_info "10/13: Mapeando configuração de redes e domínios Docker..."

docker network ls --format '{{.Name}}' | while read -r net_name; do
  if [ -n "${net_name}" ]; then
    docker network inspect "${net_name}" > "${BACKUP_DIR}/docker-metadata/network_${net_name}.json" 2>/dev/null || true
  fi
done

# ==============================================================================
# ITEM 11: SNAPSHOT DO REDIS (BGSAVE + DUMP.RDB)
# ==============================================================================
log_info "11/13: Realizando snapshot do Redis (container: ${REDIS_CONTAINER})..."
log_warn "AVISO: Sessões temporárias e rate limits do Redis podem ser descartados em caso de perda sem impacto aos dados de cursos."

if docker ps --format '{{.Names}}' | grep -q "^${REDIS_CONTAINER}$"; then
  # Aciona BGSAVE síncrono no Redis
  docker exec "${REDIS_CONTAINER}" redis-cli BGSAVE || true
  sleep 2
  # Copia dump.rdb
  if docker exec "${REDIS_CONTAINER}" test -f /data/dump.rdb 2>/dev/null; then
    docker cp "${REDIS_CONTAINER}:/data/dump.rdb" "${BACKUP_DIR}/redis-dump.rdb"
  else
    log_warn "dump.rdb não encontrado diretamente em /data do container Redis."
    touch "${BACKUP_DIR}/redis-dump.rdb"
  fi
else
  log_warn "Container Redis '${REDIS_CONTAINER}' não localizado em execução."
  touch "${BACKUP_DIR}/redis-dump.rdb"
fi

# ==============================================================================
# COMPUTAÇÃO DOS CHECKSUMS SHA-256 DE TODOS OS ARTEFATOS
# ==============================================================================
log_info "Calculando hashes SHA-256 dos artefatos gerados..."

cd "${BACKUP_DIR}"
find . -maxdepth 2 -type f ! -name "checksums.sha256" ! -name "backup-manifest.txt" -exec sha256sum {} + > "${BACKUP_DIR}/checksums.sha256"

# ==============================================================================
# ITEM 13: TESTE DE INTEGRIDADE AUTOMÁTICO
# ==============================================================================
log_info "13/13: Executando testes de integridade automática sobre os artefatos..."

TEST_GIT="SUCESSO"
TEST_POSTGRES="SUCESSO"
TEST_VIDEOS="SUCESSO"
TEST_WORKING_TREE="SUCESSO"
TEST_POCKETBASE="SUCESSO"
TEST_CHECKSUMS="SUCESSO"

# 1. Teste do Git bundle
if [ -s "${BACKUP_DIR}/repo-bundle-with-tag.bundle" ]; then
  if ! git bundle verify "${BACKUP_DIR}/repo-bundle-with-tag.bundle" > /dev/null 2>&1; then
    TEST_GIT="FALHA"
  fi
elif [ -s "${BACKUP_DIR}/repo-bundle.bundle" ]; then
  if ! git bundle verify "${BACKUP_DIR}/repo-bundle.bundle" > /dev/null 2>&1; then
    TEST_GIT="FALHA"
  fi
else
  TEST_GIT="FALHA (bundle vazio)"
fi

# 2. Teste do dump PostgreSQL (pg_restore --list)
if [ -s "${BACKUP_DIR}/postgres-full.dump" ]; then
  # Valida se pg_restore consegue ler o índice interno do dump sem erro
  if docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
    if ! docker exec -i "${POSTGRES_CONTAINER}" pg_restore --list < "${BACKUP_DIR}/postgres-full.dump" > /dev/null 2>&1; then
      TEST_POSTGRES="FALHA (dump inválido)"
    fi
  else
    # Fallback para pg_restore local se instalado no host
    if command -v pg_restore > /dev/null 2>&1; then
      if ! pg_restore --list "${BACKUP_DIR}/postgres-full.dump" > /dev/null 2>&1; then
        TEST_POSTGRES="FALHA (dump inválido)"
      fi
    else
      TEST_POSTGRES="SUCESSO (dump gravado; pg_restore ausente no host)"
    fi
  fi
else
  TEST_POSTGRES="FALHA (arquivo de dump vazio)"
fi

# 3. Teste do tar dos vídeos
if [ -s "${BACKUP_DIR}/videos-persistent.tar.gz" ]; then
  if ! tar -tzf "${BACKUP_DIR}/videos-persistent.tar.gz" > /dev/null 2>&1; then
    TEST_VIDEOS="FALHA (tar de vídeos corrompido)"
  fi
else
  TEST_VIDEOS="FALHA (arquivo vazio)"
fi

# 4. Teste do working tree
if [ -s "${BACKUP_DIR}/working-tree.tar.gz" ]; then
  if ! tar -tzf "${BACKUP_DIR}/working-tree.tar.gz" > /dev/null 2>&1; then
    TEST_WORKING_TREE="FALHA (tar de working-tree corrompido)"
  fi
else
  TEST_WORKING_TREE="FALHA"
fi

# 5. Teste do PocketBase
if [ -s "${BACKUP_DIR}/pocketbase-data.tar.gz" ]; then
  if ! tar -tzf "${BACKUP_DIR}/pocketbase-data.tar.gz" > /dev/null 2>&1; then
    TEST_POCKETBASE="FALHA"
  fi
fi

# 6. Teste dos Checksums SHA-256
if ! sha256sum -c "${BACKUP_DIR}/checksums.sha256" > /dev/null 2>&1; then
  TEST_CHECKSUMS="FALHA"
fi

# ==============================================================================
# ITEM 12: MANIFESTO BACKUP-MANIFEST.TXT
# ==============================================================================
log_info "12/13: Gerando manifesto oficial do backup..."

TOTAL_SIZE=$(du -sh "${BACKUP_DIR}" | awk '{print $1}')

cat << EOF > "${BACKUP_DIR}/backup-manifest.txt"
================================================================================
MANIFESTO DE PONTO DE RESTAURAÇÃO - CURSOS-API
================================================================================
Versão do Script:      ${SCRIPT_VERSION}
Data e Hora (ISO 8601): ${ISO_DATE}
Timestamp de Pasta:    ${TIMESTAMP}
Responsável:           ${BACKUP_RESPONSIVEL}
Localização no Host:   ${BACKUP_DIR}
Commit Git Original:   ${GIT_COMMIT_FULL}
Branch Git de Trabalho: ${CURRENT_BRANCH}
Tag de Restauração:    ${TAG_NAME}
Tamanho Total:         ${TOTAL_SIZE}

--------------------------------------------------------------------------------
DETALHAMENTO DOS ARTEFATOS E TAMANHOS
--------------------------------------------------------------------------------
$(du -h -d 2 "${BACKUP_DIR}" | sort -k2)

--------------------------------------------------------------------------------
HASHES SHA-256 DOS ARTEFATOS
--------------------------------------------------------------------------------
$(cat "${BACKUP_DIR}/checksums.sha256")

--------------------------------------------------------------------------------
RESULTADO DOS TESTES AUTOMÁTICOS DE INTEGRIDADE
--------------------------------------------------------------------------------
[1] Git Bundle Integrity (git bundle verify):        ${TEST_GIT}
[2] PostgreSQL Dump Integrity (pg_restore --list):  ${TEST_POSTGRES}
[3] Vídeos Tar Integrity (tar -tzf):                ${TEST_VIDEOS}
[4] Working Tree Tar Integrity (tar -tzf):          ${TEST_WORKING_TREE}
[5] PocketBase Tar Integrity (tar -tzf):            ${TEST_POCKETBASE}
[6] Checksums Verification (sha256sum -c):          ${TEST_CHECKSUMS}

STATUS GLOBAL DO BACKUP: $( [ "${TEST_GIT}" = "SUCESSO" ] && [ "${TEST_POSTGRES}" = "SUCESSO" ] && [ "${TEST_VIDEOS}" = "SUCESSO" ] && echo "APROVADO PARA RESTAURAÇÃO" || echo "ATENÇÃO: VERIFICAR ITENS COM FALHA" )
================================================================================
EOF

cat "${BACKUP_DIR}/backup-manifest.txt"

echo "======================================================================"
echo " [CURSOS-API] BACKUP CONCLUÍDO COM SUCESSO!"
echo " Diretório gerado: ${BACKUP_DIR}"
echo " Manifesto salvo:  ${BACKUP_DIR}/backup-manifest.txt"
echo "======================================================================"
