# Inventário EasyPanel - Cursos

Data: Sat Oct 31 19:53:19 -03 2026
Servidor: srv845644

## Containers relacionados

| Nome | Imagem | Portas |
| devocional-api | devocional-conexao-batista-api | 0.0.0.0:3100->3333/tcp, [::]:3100->3333/tcp |
| devocional-static | nginx:alpine | 80/tcp |
| admin-conexao-admin-frontend-1 | admin-conexao-frontend:latest | 0.0.0.0:8080->80/tcp, [::]:8080->80/tcp |
| devocional-devocional-pocketbase-1 | ghcr.io/muchobien/pocketbase:latest | 127.0.0.1:8090->8090/tcp |
| easypanel.1.nitdrbgdknkodesidpd2tu1cr | easypanel/easypanel:latest | 0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp |
| cursos-api_postgres.1.mpp4zqgnifgzjkh2y0hz9f4hm | postgres:17 | 5432/tcp |
| cursos-api_cursos-api.1.jsmxpl7rmip278eajgb5f5ms4 | easypanel/cursos-api/cursos-api:latest | 3333/tcp |
| cursos-api_cursos-api.1.j5smm6275xwx0p0iinl3sb49h | easypanel/cursos-api/cursos-api:latest | |
| cursos-api_redis.1.t9nm3rw7cag3ooovnskhnjlok | redis:7 | 6379/tcp |
| cursos-api_cursos-api.1.4gevvrjk3f2wk36ydjublduq8 | easypanel/cursos-api/cursos-api:latest | |
| cursos-api_cursos-api.1.43ad3ku8iu2na3bbgpwah6lni | easypanel/cursos-api/cursos-api:latest | |
| cursos-api_pocketbase.1.kohju1jfjbvrbafqt44xbe0qu | ghcr.io/muchobien/pocketbase:latest | |
| easypanel-traefik.1.a9npy8dzv7v3zb5k4frtwjdi9 | traefik:3.6.7 | 0.0.0.0:80->80/tcp, [::]:80->80/tcp, 0.0.0.0:443->443/tcp, [::]:443->443/tcp |
| cursos-api_cursos-api.1.lm6isq5x8musocfsnnciz9gqh | easypanel/cursos-api/cursos-api:latest | |
| admin-conexao-admin-api-1 | admin-conexao-backend:latest | 4000/tcp |
| devocional-backend-proxy | nginx:alpine | 80/tcp |
| vscode-dev | codercom/code-server:latest | 0.0.0.0:8081->8080/tcp, [::]:8081->8080/tcp |

## Serviço: devocional-api

### Imagem

devocional-conexao-batista-api

### Portas

3333/tcp -> 0.0.0.0:3100
3333/tcp -> [::]:3100

### Volumes

### Redes

easypanel

### Variáveis, somente nomes

APPROVAL_API_URL
APPROVAL_PROVIDER
APPROVAL_TOKEN_HEADER
CORS_ALLOWED_ORIGINS
INTEGRATION_TIMEOUT_MS
NODE_ENV
NODE_VERSION
PATH
POCKETBASE_ADMIN_EMAIL
POCKETBASE_ADMIN_PASSWORD
POCKETBASE_URL
PORT
RATE_LIMIT_MAX
RUN_STANDALONE_API
SESSION_SECRET
YARN_VERSION

## Serviço: devocional-devocional-pocketbase-1

### Imagem

ghcr.io/muchobien/pocketbase:latest

### Portas

8090/tcp -> 127.0.0.1:8090

### Volumes

/opt/devocional/pb_hooks -> /pb_hooks
/opt/devocional/pb_migrations -> /pb_migrations
/opt/devocional/nginx-admin.conf -> /etc/nginx/conf.d/admin.conf
/opt/devocional/pb_data -> /pb_data

### Redes

easypanel

### Variáveis, somente nomes

B2B_SECRET
PATH
PB_ADMIN_EMAIL
PB_ADMIN_PASSWORD

## Serviço: cursos-api_postgres.1.mpp4zqgnifgzjkh2y0hz9f4hm

### Imagem

postgres:17

### Portas

### Volumes

/etc/easypanel/projects/cursos-api/postgres/data -> /var/lib/postgresql/data

### Redes

easypanel
easypanel-cursos-api

### Variáveis, somente nomes

GOSU_VERSION
LANG
PATH
PGDATA
PG_MAJOR
PG_VERSION
POSTGRES_DB
POSTGRES_PASSWORD
POSTGRES_USER

## Serviço: cursos-api_redis.1.t9nm3rw7cag3ooovnskhnjlok

### Imagem

redis:7

### Portas

### Volumes

/etc/easypanel/projects/cursos-api/redis/data -> /data

### Redes

easypanel
easypanel-cursos-api

### Variáveis, somente nomes

PATH
REDIS_PASSWORD
REDIS_VERSION

## Node

OCI runtime exec failed: exec failed: unable to start container process: exec: "node": executable file not found in $PATH

## Caminhos de vídeos

- Host: /srv/cursos/videos/
- Container: /app/videos/
