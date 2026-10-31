# INVENTÁRIO TÉCNICO DE SERVIÇOS NO EASYPANEL - CURSOS-API

**Documento:** `docs/operacoes/INVENTARIO_EASYPANEL.md`  
**Objetivo:** Mapeamento minucioso dos 4 serviços rodando na VPS via EasyPanel para auditoria, automação e contingência operacional.  
**AVISO DE SEGURANÇA:** Proibido armazenar senhas, tokens ou segredos reais neste arquivo. Registrar **apenas os nomes** das variáveis de ambiente.

---

## 1. COMANDOS DOCKER PARA O OPERADOR OBTER CADA DADO NA VPS

O operador deve rodar estes comandos via SSH como root para inspecionar e preencher este inventário:

```bash
# 1. Listar todos os containers em execução com status, portas e nomes
docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

# 2. Inspecionar um serviço específico (JSON completo)
docker inspect <NOME_DO_CONTAINER>

# 3. Listar apenas os volumes montados em cada container
docker inspect <NOME_DO_CONTAINER> --format '{{range .Mounts}}{{.Type}} {{.Source}} -> {{.Destination}} ({{.Mode}}){{"\n"}}{{end}}'

# 4. Listar todas as redes Docker e ver containers conectados
docker network ls
docker network inspect <NOME_DA_REDE> --format '{{range $id, $cont := .Containers}}{{$cont.Name}} ({{$cont.IPv4Address}}){{"\n"}}{{end}}'

# 5. Listar volumes Docker criados no host
docker volume ls

# 6. Listar apenas os NOMES das variáveis de ambiente (sem valores nem segredos)
docker inspect <NOME_DO_CONTAINER> --format '{{range .Config.Env}}{{println (slice (split . "=") 0 1)}}{{end}}'

# 7. Verificar configuração de Healthcheck
docker inspect <NOME_DO_CONTAINER> --format '{{json .Config.Healthcheck}}'
```

---

## 2. ANÁLISE DE DEPENDÊNCIAS ENTRE OS SERVIÇOS

O ecossistema **Cursos-API** opera com interdependências claras:

```
[ Usuário / Navegador / Aluno / Mentor ]
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Cursos-API (Express / Porta 3333 / Container: cursos-api)│
└──────────────┬──────────────────┬───────────────────────────┘
               │                  │
    ┌──────────▼─────────┐        │        ┌───────────────────────────┐
    │ 2. PostgreSQL      │        ├───────►│ 4. Redis                  │
    │ (Container: db)    │        │        │ (Container: redis)        │
    │                    │        │        │                           │
    │ - Usuários         │        │        │ - Rate limit login/bridge │
    │ - Cursos e Etapas  │        │        │ - Cache temporário        │
    │ - Aulas e Vídeos   │        │        │ - Sessões voláteis        │
    │ - Matrículas       │        │        └───────────────────────────┘
    │ - Progresso Aluno  │        │
    │ - Avaliações/Provas│        │        ┌───────────────────────────┐
    │ - Status Publicação│        └───────►│ 3. PocketBase             │
    └────────────────────┘                 │ (Container: pocketbase)   │
                                           │                           │
                                           │ - Identidade / SSO        │
                                           │ - Auth centralizada       │
                                           │ *(a confirmar operador)   │
                                           └───────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│ INTEGRAÇÕES EXTERNAS (APIs de Terceiros)                     │
├─────────────────────────────────────────────────────────────┤
│ • Cloudinary:      Armazenamento de imagens, capas e vídeos │
│ • Groq AI:         Moderação automática de conteúdo         │
│ • Microsoft Graph: Streaming de vídeos hospedados no        │
│                    OneDrive corporativo                     │
└─────────────────────────────────────────────────────────────┘
```

- **Cursos-API:** Nó central da aplicação. Depende obrigatoriamente do PostgreSQL para inicialização de modelos e rotas. Depende do Redis para rate-limit seguro do `/auth/bridge-login`. Utiliza o PocketBase para fluxos de autenticação SSO/legado.
- **Armazenamento de Vídeo Local:** O diretório persistente `/srv/cursos/videos/` no host é montado em `/app/videos/` no container `Cursos-API`.

---

## 3. BLOCOS DE INVENTÁRIO POR SERVIÇO (TEMPLATE A PREENCHER PELO OPERADOR)

### SERVIÇO 1: Cursos-API (Backend Central Express)

- **Nome exato do serviço / container:** `cursos-api` (ou conforme listado em `docker ps`)
- **Imagem utilizada:** `node:18-alpine` (ou `node:20-alpine` / build local EasyPanel)
- **Porta interna do container:** `3333`
- **Porta externa / exposta na VPS:** `3333` (ou mapeamento reverso EasyPanel)
- **Volumes persistentes montados:**
  - `/srv/cursos/videos/` -> `/app/videos` (bind mount com leitura/escrita)
  - `/root/cursos-api` (caso use bind mount de código)
- **Rede Docker:** Rede interna do EasyPanel (ex: `easypanel-network`)
- **Domínio configurado:** `<DOMINIO_API_CURSOS>` (ex: `cursos-api.<dominio>.com`)
- **Health check configurado:** `curl -f http://localhost:3333/ || exit 1` (interval: 30s, timeout: 5s, retries: 3)
- **Variáveis de ambiente (NOMES APENAS):**
  - `PORT`
  - `NODE_ENV`
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `MENTOR_JWT_SECRET`
  - `CURSOS_API_BRIDGE_SECRET`
  - `REDIS_URL`
  - `REDIS_HOST`
  - `REDIS_PORT`
  - `POCKETBASE_URL`
  - `LOCAL_VIDEO_DIR`
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `GROQ_API_KEY`
  - `MS_GRAPH_CLIENT_ID`
  - `MS_GRAPH_TENANT_ID`
  - `MS_GRAPH_CLIENT_SECRET`
- **Dependências diretas:** PostgreSQL (inicia primeiro), Redis, PocketBase
- **Ordem de inicialização recomendada:** 4º (inicia após banco, cache e auth)
- **Procedimento de restart:** `docker restart <CONTAINER_API>` ou botão Restart no EasyPanel
- **Procedimento de rollback:** Restaurar commit/bundle no host, reiniciar o container via EasyPanel para rebuild/reload do código.

---

### SERVIÇO 2: PostgreSQL (Banco de Dados Principal)

- **Nome exato do serviço / container:** `cursos-api_postgres` (ou conforme listado em `docker ps`)
- **Imagem utilizada:** `postgres:15-alpine` (ou versão real em uso)
- **Porta interna do container:** `5432`
- **Porta externa / exposta na VPS:** `5432` (ou não exposta externamente, apenas na rede interna)
- **Volumes persistentes montados:**
  - Volume do Postgres (ex: `/var/lib/docker/volumes/.../_data` -> `/var/lib/postgresql/data`)
- **Rede Docker:** Rede interna do EasyPanel (ex: `easypanel-network`)
- **Domínio configurado:** Sem domínio público (acesso interno via container name ou localhost)
- **Health check configurado:** `pg_isready -U postgres`
- **Variáveis de ambiente (NOMES APENAS):**
  - `POSTGRES_DB`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `PGDATA`
- **Dependências diretas:** Nenhuma (serviço base primário)
- **Ordem de inicialização recomendada:** 1º (deve subir antes da API)
- **Procedimento de restart:** `docker restart <CONTAINER_POSTGRES>`
- **Procedimento de rollback:** `pg_restore --clean --if-exists` a partir do dump `-Fc` gerado pelo script de backup.

---

### SERVIÇO 3: PocketBase (Serviço de SSO / Autenticação)

- **Nome exato do serviço / container:** `cursos-api_pocketbase` (ou conforme listado em `docker ps`)
- **Imagem utilizada:** `pocketbase:latest` (ou imagem customizada)
- **Porta interna do container:** `8090`
- **Porta externa / exposta na VPS:** `8090` (ou proxy reverso EasyPanel)
- **Volumes persistentes montados:**
  - `pb_data` -> `/pb_data`
- **Rede Docker:** Rede interna do EasyPanel (ex: `easypanel-network`)
- **Domínio configurado:** `<DOMINIO_POCKETBASE>`
- **Health check configurado:** `wget --no-verbose --tries=1 --spider http://localhost:8090/api/health || exit 1`
- **Variáveis de ambiente (NOMES APENAS):**
  - `POCKETBASE_ENCRYPTION_KEY`
  - `POCKETBASE_DATA_DIR`
- **Dependências diretas:** Nenhuma
- **Ordem de inicialização recomendada:** 2º (junto ou após o PostgreSQL)
- **Procedimento de restart:** `docker restart <CONTAINER_POCKETBASE>`
- **Procedimento de rollback:** Substituição do diretório `pb_data` a partir do `pocketbase-data.tar.gz` do backup.

---

### SERVIÇO 4: Redis (Cache, Rate Limit e Sessões Temporárias)

- **Nome exato do serviço / container:** `cursos-api_redis` (ou conforme listado em `docker ps`)
- **Imagem utilizada:** `redis:7-alpine`
- **Porta interna do container:** `6379`
- **Porta externa / exposta na VPS:** `6379` (ou restrita à rede Docker interna)
- **Volumes persistentes montados:**
  - Volume redis (ex: `/data`)
- **Rede Docker:** Rede interna do EasyPanel (ex: `easypanel-network`)
- **Domínio configurado:** Sem domínio público
- **Health check configurado:** `redis-cli ping`
- **Variáveis de ambiente (NOMES APENAS):**
  - `REDIS_PASSWORD`
- **Dependências diretas:** Nenhuma
- **Ordem de inicialização recomendada:** 1º (junto com o banco)
- **Procedimento de restart:** `docker restart <CONTAINER_REDIS>`
- **Procedimento de rollback:** Cópia do arquivo `dump.rdb` e reinicialização do container Redis (ou purga segura de chaves de rate-limit).
