# INVENTÁRIO TÉCNICO DE SERVIÇOS NO EASYPANEL - CURSOS-API

**Documento:** `docs/operacoes/INVENTARIO_EASYPANEL.md`  
**Origem dos Dados:** Arquivo real da VPS `/root/INVENTARIO_EASYPANEL.md` (Data: `Sat Oct 31 19:53:19 -03 2026`, Host: `srv845644`).  
**Objetivo:** Mapeamento minucioso dos serviços rodando na VPS via EasyPanel para governança, rollback e contingência da Fase 0 / Fase 1.  
**REGRA ABSOLUTA DE SEGURANÇA:** Proibido armazenar senhas, tokens ou segredos reais. Apenas os **nomes das variáveis de ambiente** são registrados.

---

## 1. RESUMO DOS SERVIÇOS DO PROJETO CURSOS

O projeto Cursos é composto diretamente por 4 serviços orquestrados no EasyPanel:

| Serviço EasyPanel | Nome do Container no Host                           | Imagem Docker                            | Portas                                | Volumes Persistentes                                                             | Redes Docker                        |
| ----------------- | --------------------------------------------------- | ---------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------- |
| **Cursos-API**    | `cursos-api_cursos-api.1.*` (5+ réplicas)           | `easypanel/cursos-api/cursos-api:latest` | `3333/tcp` (sem porta pública direta) | Host `/srv/cursos/videos/` -> Container `/app/videos/`                           | `easypanel`                         |
| **PostgreSQL**    | `cursos-api_postgres.1.mpp4zqgnifgzjkh2y0hz9f4hm`   | `postgres:17`                            | `5432/tcp` (não exposta externamente) | `/etc/easypanel/projects/cursos-api/postgres/data` -> `/var/lib/postgresql/data` | `easypanel`, `easypanel-cursos-api` |
| **Redis**         | `cursos-api_redis.1.t9nm3rw7cag3ooovnskhnjlok`      | `redis:7`                                | `6379/tcp` (não exposta externamente) | `/etc/easypanel/projects/cursos-api/redis/data` -> `/data`                       | `easypanel`, `easypanel-cursos-api` |
| **PocketBase**    | `cursos-api_pocketbase.1.kohju1jfjbvrbafqt44xbe0qu` | `ghcr.io/muchobien/pocketbase:latest`    | Sem porta externa visível             | Gerenciado internamente pelo EasyPanel                                           | `easypanel`                         |

_Proxy Reverso de Borda:_ Traefik `3.6.7` escuta nas portas `80/tcp` e `443/tcp` para roteamento externo e SSL.

---

## 2. INVENTÁRIO DETALHADO POR SERVIÇO (CURSOS)

### SERVIÇO 1: Cursos-API (Backend Express)

- **Identificador no Host:** `cursos-api_cursos-api.1.*` (múltiplos containers da mesma imagem detectados: `jsmxpl7rmip278eajgb5f5ms4`, `j5smm6275xwx0p0iinl3sb49h`, `4gevvrjk3f2wk36ydjublduq8`, `43ad3ku8iu2na3bbgpwah6lni`, `lm6isq5x8musocfsnnciz9gqh`)
- **Imagem Utilizada:** `easypanel/cursos-api/cursos-api:latest`
- **Porta do Container:** `3333/tcp`
- **Porta Externa / Exposta na VPS:** Nenhuma publicação direta visível em IP público; acesso e SSL mediados pelo Traefik.
- **Volumes Persistentes Confirmados:**
  - Host: `/srv/cursos/videos/` -> Container: `/app/videos/` (leitura/escrita para uploads MP4 de até 1GB e streaming HTTP Range)
- **Rede Docker:** `easypanel`
- **Diagnóstico de Runtime Node.js:**
  - Tentativa de execução de `node` dentro do container falhou:
    ```text
    OCI runtime exec failed: exec failed: unable to start container process: exec: "node": executable file not found in $PATH
    ```
  - **Situação:** Versão do Node continua **NÃO CONFIRMADA**.
  - **Hipóteses:** Runtime alternativo (Bun/Deno), instância inativa consultada ou binário fora do `$PATH`.
  - **Comando sugerido ao operador:** `docker exec <container> sh -c "which node || which bun || which deno; cat /etc/os-release"`

---

### SERVIÇO 2: PostgreSQL (Banco de Dados Principal)

- **Identificador no Host:** `cursos-api_postgres.1.mpp4zqgnifgzjkh2y0hz9f4hm`
- **Imagem Utilizada:** `postgres:17`
- **Porta do Container:** `5432/tcp`
- **Porta Exposta na VPS:** Nenhuma porta externa publicada no host (acesso restrito aos containers autorizados nas redes internas).
- **Volumes Persistentes Montados:**
  - Host: `/etc/easypanel/projects/cursos-api/postgres/data` -> Container: `/var/lib/postgresql/data`
- **Redes Docker:**
  - `easypanel`
  - `easypanel-cursos-api`
- **Variáveis de Ambiente (SOMENTE NOMES REGISTRADOS):**
  - `GOSU_VERSION`
  - `LANG`
  - `PATH`
  - `PGDATA`
  - `PG_MAJOR`
  - `PG_VERSION`
  - `POSTGRES_DB`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_USER`

---

### SERVIÇO 3: Redis (Cache, Rate Limit e Sessões)

- **Identificador no Host:** `cursos-api_redis.1.t9nm3rw7cag3ooovnskhnjlok`
- **Imagem Utilizada:** `redis:7`
- **Porta do Container:** `6379/tcp`
- **Porta Exposta na VPS:** Nenhuma porta externa publicada no host.
- **Volumes Persistentes Montados:**
  - Host: `/etc/easypanel/projects/cursos-api/redis/data` -> Container: `/data`
- **Redes Docker:**
  - `easypanel`
  - `easypanel-cursos-api`
- **Variáveis de Ambiente (SOMENTE NOMES REGISTRADOS):**
  - `PATH`
  - `REDIS_PASSWORD`
  - `REDIS_VERSION`

---

### SERVIÇO 4: PocketBase (Serviço de Autenticação / SSO)

- **Identificador no Host:** `cursos-api_pocketbase.1.kohju1jfjbvrbafqt44xbe0qu`
- **Imagem Utilizada:** `ghcr.io/muchobien/pocketbase:latest`
- **Portas:** Sem porta externa publicada visível.
- **Redes Docker:**
  - `easypanel`

---

## 3. OUTROS SERVIÇOS NO HOST (FORA DO ESCOPO DIRETO DE CURSOS)

Apenas para inventário do servidor `srv845644`, foram identificados outros containers em execução que pertencem a outros projetos ou à gestão do host:

| Container                            | Imagem                                | Portas                           | Projeto                       |
| ------------------------------------ | ------------------------------------- | -------------------------------- | ----------------------------- |
| `easypanel-traefik.1.*`              | `traefik:3.6.7`                       | `80/tcp`, `443/tcp` (HTTP/HTTPS) | EasyPanel Core / Roteamento   |
| `easypanel.1.*`                      | `easypanel/easypanel:latest`          | `3000/tcp`                       | EasyPanel Dashboard           |
| `devocional-api`                     | `devocional-conexao-batista-api`      | `3100->3333/tcp`                 | Devocional (Outro Projeto)    |
| `devocional-static`                  | `nginx:alpine`                        | `80/tcp`                         | Devocional (Outro Projeto)    |
| `devocional-backend-proxy`           | `nginx:alpine`                        | `80/tcp`                         | Devocional (Outro Projeto)    |
| `devocional-devocional-pocketbase-1` | `ghcr.io/muchobien/pocketbase:latest` | `8090/tcp` (loopback)            | Devocional (Outro Projeto)    |
| `admin-conexao-admin-frontend-1`     | `admin-conexao-frontend:latest`       | `8080->80/tcp`                   | Admin Conexão (Outro Projeto) |
| `admin-conexao-admin-api-1`          | `admin-conexao-backend:latest`        | `4000/tcp`                       | Admin Conexão (Outro Projeto) |
| `vscode-dev`                         | `codercom/code-server:latest`         | `8081->8080/tcp`                 | Utilitário Host               |

_Nota:_ Os serviços devocional e admin-conexao foram mantidos estritamente fora do escopo de modificações do projeto Cursos.
