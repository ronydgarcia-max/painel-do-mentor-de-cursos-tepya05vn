# PLANO OPERACIONAL DE ROLLBACK - CURSOS-API (VPS)

**Documento:** `docs/operacoes/PLANO_ROLLBACK.md`  
**Escopo:** Procedimento manual de emergência para reversão rápida e segura em caso de falha após deploys na VPS.  
**Ambiente:** VPS EasyPanel (Cursos-API, PocketBase, PostgreSQL, Redis)  
**Branch de trabalho:** `correcao-fluxo-cursos` | **Commit Base Estável:** `47aa7b1`

---

## 1. PREMISSA FUNDAMENTAL E REGRAS DE SEGURANÇA

> **PREMISSA EXPLÍCITA:**  
> **O rollback não deve depender de arquivos dentro do container atual.**  
> Todos os artefatos de restauração (bundle Git, dump do Postgres `-Fc`, tar de vídeos, snapshot do PocketBase, configs e scripts) ficam armazenados em `/srv/backups/cursos/<timestamp>/` diretamente no sistema de arquivos do Host (VPS), fora do ciclo de vida dos containers Docker efêmeros.  
> Se o container da API ou do banco for corrompido, recriado ou destruído, o ponto de restauração no host permanece intacto e acessível pelo operador.

### Regras Complementares:

1. **Sem senhas em texto puro:** Todas as credenciais de banco e tokens devem ser fornecidos via variáveis de ambiente da sessão (`PGPASSWORD`, `JWT_SECRET`, etc.) ou gerenciadas no painel do EasyPanel.
2. **Confirmação a cada etapa:** O operador deve executar as etapas na ordem exata definida neste plano.
3. **Ponto de Restauração Ativo:** Identificar o diretório de backup correspondente antes de iniciar:
   ```bash
   BACKUP_DIR="/srv/backups/cursos/<timestamp_desejado>"
   # Exemplo: BACKUP_DIR="/srv/backups/cursos/20250510_143000"
   ```

---

## 2. PLANO DE ROLLBACK EM 8 ETAPAS (ORDEM EXATA)

A execução deve seguir rigorosamente a sequência de 1 a 8:

### ETAPA 1: Restaurar o commit anterior

- **Objetivo:** Reverter o código-fonte do backend e frontend para o estado estável pré-deploy (`47aa7b1` ou tag anotada `backup/pre-fase1-<timestamp>`).
- **Comando ou Ação:**

  ```bash
  cd /root/cursos-api

  # Opção A: Checkout direto da tag de backup criada no host
  git fetch /srv/backups/cursos/<timestamp>/repo-bundle-with-tag.bundle '*:*'
  git checkout backup/pre-fase1-<timestamp>

  # Opção B: Caso a tag não esteja disponível, checkout do commit estável confirmado:
  git checkout 47aa7b1

  # Em caso de arquivos residuais no working tree:
  git clean -fd
  ```

- **Critério de Sucesso:** `git status` limpo e `git rev-parse HEAD` apontando exatamente para o commit anterior desejado.
- **Como Verificar:**
  ```bash
  git log -1 --oneline
  # Deve exibir: 47aa7b1 (ou o hash exato da tag de backup)
  ```

---

### ETAPA 2: Restaurar o banco, se houver migration incompatível

- **Objetivo:** Garantir integridade referencial nas tabelas (`usuarios`, `cursos`, `aulas`, `etapas`, `matriculas`, `avaliacoes_respostas`) eliminando schemas alterados por migrations incompatíveis da Fase 1.
- **Comando ou Ação:**

  ```bash
  # Localizar container do PostgreSQL
  PG_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i 'postgre' | head -n 1)

  # Executar pg_restore com flag --clean e --if-exists a partir do dump do host
  docker exec -i -e PGPASSWORD="${PGPASSWORD}" "${PG_CONTAINER}" \
    pg_restore -U postgres -d cursos --clean --if-exists -v < /srv/backups/cursos/<timestamp>/postgres-full.dump
  ```

- **Critério de Sucesso:** Dump restaurado sem erros fatais; tabelas e sequences recriadas conforme estado anterior.
- **Como Verificar:**
  ```bash
  docker exec -i "${PG_CONTAINER}" psql -U postgres -d cursos -c "\dt"
  docker exec -i "${PG_CONTAINER}" psql -U postgres -d cursos -c "SELECT COUNT(*) FROM cursos; SELECT COUNT(*) FROM aulas;"
  ```

---

### ETAPA 3: Restaurar os vídeos

- **Objetivo:** Garantir que o diretório persistente `/srv/cursos/videos/` reflita o estado exato anterior, recuperando eventuais arquivos deletados ou sobrescritos erroneamente.
- **Comando ou Ação:**

  ```bash
  # Restaurar os vídeos a partir do tarball do host
  tar -xzf /srv/backups/cursos/<timestamp>/videos-persistent.tar.gz -C /srv/cursos/videos/

  # Garantir permissões de leitura e escrita para o container
  chmod -R 755 /srv/cursos/videos/
  ```

- **Critério de Sucesso:** Todos os diretórios de cursos (`/srv/cursos/videos/<curso_id>/`) e arquivos `.mp4` presentes e legíveis.
- **Como Verificar:**
  ```bash
  ls -lh /srv/cursos/videos/
  # Testar se a aula 27 está presente no path esperado:
  ls -lh /srv/cursos/videos/37/aula-27.mp4 || ls -lh /srv/cursos/videos/
  ```

---

### ETAPA 4: Recriar os serviços no EasyPanel

- **Objetivo:** Reiniciar ou recriar os 4 containers para que carreguem as variáveis de ambiente, volumes e o código fonte restaurado.
- **Comando ou Ação:**
  - **Via Painel EasyPanel:** Acessar o dashboard do EasyPanel -> Projeto `cursos-api` -> Clicar em **Restart** ou **Redeploy** nos 4 serviços na ordem:
    1. Redis
    2. PostgreSQL
    3. PocketBase
    4. Cursos-API
  - **Via Terminal (Docker CLI):**

    ```bash
    REDIS_C=$(docker ps --format '{{.Names}}' | grep -i 'redis' | head -n 1)
    PG_C=$(docker ps --format '{{.Names}}' | grep -i 'postgre' | head -n 1)
    PB_C=$(docker ps --format '{{.Names}}' | grep -i 'pocketbase' | head -n 1)
    API_C=$(docker ps --format '{{.Names}}' | grep -i 'cursos' | head -n 1)

    docker restart "${REDIS_C}" "${PG_C}" "${PB_C}"
    sleep 3
    docker restart "${API_C}"
    ```
- **Critério de Sucesso:** Os 4 containers com status `Up` (sem reinicializações em loop ou crash).
- **Como Verificar:**
  ```bash
  docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
  ```

---

### ETAPA 5: Validar a API

- **Objetivo:** Verificar se o Express está respondendo adequadamente na porta `3333` e se os endpoints públicos e de saúde estão ativos.
- **Comando ou Ação:**
  ```bash
  # Teste local direto na VPS
  curl -I http://127.0.0.1:3333/
  curl -I http://127.0.0.1:3333/mentor/dashboard
  ```
- **Critério de Sucesso:** Endpoint raiz retorna HTTP 200 (ou redirect esperado) e `/mentor/dashboard` retorna HTTP 401/403 (exigindo token JWT, o que comprova que o middleware de autenticação está ativo e operando).
- **Como Verificar:**
  ```bash
  curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3333/
  # Conferir logs de inicialização da API:
  docker logs --tail 50 "${API_C}"
  ```

---

### ETAPA 6: Validar o player

- **Objetivo:** Comprovar que o endpoint de streaming (`GET /stream/:aulaId`) responde com suporte a `Range` bytes (HTTP 206 Partial Content).
- **Comando ou Ação:**
  ```bash
  # Teste com Range bytes para a aula 27
  curl -v -H "Range: bytes=0-1024" "http://127.0.0.1:3333/stream/27" -o /dev/null
  ```
- **Critério de Sucesso:** Resposta HTTP `206 Partial Content` com cabeçalho `Content-Range: bytes 0-1024/...` e `Content-Type: video/mp4`.
- **Como Verificar:**
  ```bash
  curl -sI -H "Range: bytes=0-100" "http://127.0.0.1:3333/stream/27" | grep -E "HTTP/|Content-Range|Content-Type"
  ```

---

### ETAPA 7: Validar o login do mentor

- **Objetivo:** Garantir que mentores autorizados conseguem obter token e acessar os dados de seus cursos.
- **Comando ou Ação:**
  1. Acessar via navegador a URL do painel: `https://<DOMINIO_MENTOR>/painel` (ou via token SSO).
  2. Ou validar a rota de login/bridge via curl:
     ```bash
     curl -X POST http://127.0.0.1:3333/auth/bridge-login \
       -H "Content-Type: application/json" \
       -H "x-bridge-secret: ${CURSOS_API_BRIDGE_SECRET}" \
       -d '{"usuario_id": 1, "email": "mentor@exemplo.com"}'
     ```
- **Critério de Sucesso:** Retorno do token JWT ou login com sucesso no painel web, listando os cursos do mentor sem erro de banco de dados.
- **Como Verificar:** Testar `GET /mentor/cursos` com o Bearer token gerado retornando status 200 e array JSON de cursos.

---

### ETAPA 8: Validar o acesso do aluno

- **Objetivo:** Assegurar que os alunos matriculados continuam assistindo às aulas e registrando progresso.
- **Comando ou Ação:**
  1. Acessar o frontend do aluno (plataforma de cursos).
  2. Fazer login com usuário aluno de teste matriculado.
  3. Abrir um curso e reproduzir uma aula com vídeo.
- **Critério de Sucesso:** Player do aluno carrega o vídeo normalmente, sem tela preta, e marca progresso na tabela `progresso_aulas`.
- **Como Verificar:**
  ```bash
  # Conferir no Postgres se há registros de progresso recentes:
  docker exec -i "${PG_CONTAINER}" psql -U postgres -d cursos -c \
    "SELECT usuario_id, aula_id, concluida, updated_at FROM progresso_aulas ORDER BY updated_at DESC LIMIT 5;"
  ```

---

## 3. OS 8 ITENS DE HOMOLOGAÇÃO FINAL DO OPERADOR

Estes itens representam os testes manuais de negócio que **apenas o operador da VPS pode declarar formalmente como homologados e concluídos**:

- [ ] **1. Testar Login do Mentor:** Acessar a interface de autenticação do mentor, submeter credenciais/SSO e confirmar entrada no painel de controle.
- [ ] **2. Testar Cursos:** Abrir a lista de cursos do mentor, verificar se os cursos existentes permanecem visíveis, com status corretos (`rascunho`, `aprovado`, `publicado`).
- [ ] **3. Testar Etapas:** Acessar o editor curricular de um curso existente, verificar se os módulos e aulas/etapas aparecem na ordem cadastrada.
- [ ] **4. Testar Upload de Vídeo:** Realizar o envio de um arquivo MP4 de teste através de `/mentor/cursos/upload-video-vps` e validar se o arquivo é gravado no host em `/srv/cursos/videos/{curso_id}/`.
- [ ] **5. Testar Substituição de Vídeo:** Alterar a mídia de uma aula existente (troca de arquivo ou alteração de tipo para YouTube/OneDrive) e confirmar persistência no banco.
- [ ] **6. Testar Streaming:** Reproduzir vídeo local via endpoint `/stream/:aulaId` em navegador Chrome/Firefox e conferir fluidez do buffer.
- [ ] **7. Testar Player Interativo:** Verificar layout, controles de velocidade, volume, fullscreen e renderização de materiais complementares em PDF.
- [ ] **8. Testar Aula 27 e Frontend do Aluno:** Reproduzir especificamente a Aula 27 (vídeo local canônico) na área do aluno e certificar-se de que nenhum aluno ativo sofreu interrupção de acesso.
