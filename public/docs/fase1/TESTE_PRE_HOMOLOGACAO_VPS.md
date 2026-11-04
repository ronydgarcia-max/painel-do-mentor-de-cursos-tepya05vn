# GUIA DE TESTE PRÉ-HOMOLOGAÇÃO NÃO INVASIVO NA VPS (FASE 1)

**Projeto:** Plataforma Cursos (Cursos-API / Painel do Mentor)  
**Documento:** `docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md`  
**Data da Atualização:** 2026-11-01 (Ajuste Pré-Homologação Solicitado pelo Cliente)  
**Ambiente de Execução:** VPS própria (`/root/cursos-api`, host `srv845644`) — **Execução manual exclusiva pelo Operador**  
**Repositório Real:** `github.com/ronydgarcia-max/cursos-api`  
**Branch de Trabalho:** `correcao-fluxo-cursos`  
**Commit Base Estável:** `47aa7b1`  
**Backup Integral de Referência:** `/root/backups/cursos/20261031_195147` (`postgres.sql`, `redis-dump.rdb`, volume PocketBase, vídeos)  
**Status Atual da Homologação:** **NÃO AUTORIZADA / NÃO APLICADA** (Nenhum arquivo de produção foi substituído, nenhum commit foi gerado, nenhum rebuild foi disparado no EasyPanel).  
**Regra Permanente de Segurança:** ZERO senhas, tokens ou credenciais em arquivos, scripts ou saídas. Marcador oficial: `[TOKEN_REMOVIDO_E_ROTACIONADO]`. Tokens de teste entram exclusivamente via variáveis de ambiente transitórias no terminal do operador.

---

## 1. OBJETIVO E PRINCÍPIO DE NÃO INVASÃO

O operador da VPS perguntou: _"como posso testar na VPS antes de oficializarmos?"_

Este guia fornece o caminho técnico **100% seguro e não invasivo** para testar os artefatos da Fase 1 (`src/routes/stream.js` e `src/static/painel-mentor.html`) diretamente na VPS, **SEM**:

1. Tocar no repositório de produção (`/root/cursos-api` permanece com `git status` perfeitamente limpo);
2. Criar commits ou fazer `git push` no GitHub;
3. Disparar rebuild ou deploy no EasyPanel;
4. Reiniciar ou afetar o container ativo de produção (`cursos-api_cursos-api.1...`);
5. Gravar arquivos em qualquer diretório fora de `/tmp`;
6. Executar novas migrations ou alterar tabelas no PostgreSQL (as migrations já foram confirmadas aplicadas);
7. Expor qualquer token, senha ou segredo em tela ou em disco.

---

## 2. AVISO CRÍTICO: AS 4 CAMADAS DE TESTE E VALIDAÇÃO

> **AVISO EXPRESSO EXIGIDO PELO CLIENTE:**  
> **"NÃO DECLARAR A FASE 1 HOMOLOGADA APENAS PORQUE O SERVIÇO INICIOU NA PORTA 3334!"**  
> A inicialização do processo em porta alternativa comprova apenas que o código compila e sobe, mas não constitui homologação de produção nem autorização de deploy.

O processo de teste e validação da Fase 1 estrutura-se rigorosamente em **4 camadas distintas**:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CAMADA 1: Teste Estático (Modo A)                                                     │
│ - ./testar-fase1-vps.sh estatico                                                       │
│ - Validação SHA-256, node --check, diffs contra 47aa7b1, git status 100% limpo        │
│ - Zero processos iniciados, zero risco.                                                │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CAMADA 2: Teste de Leitura em Porta 3334 (Modo B - Somente Leitura)                    │
│ - ./testar-fase1-vps.sh servidor && ./testar-fase1-vps.sh bateria                      │
│ - Proteção OBRIGATÓRIA: READ_ONLY_TEST=true                                            │
│ - Processo isolado em /tmp/fase1_teste/, usando mesmo PostgreSQL em SOMENTE LEITURA   │
│ - Mutações (POST/PUT/PATCH/DELETE) são bloqueadas com HTTP 403 Forbidden               │
│ - Valida: health, autorização, Range 206, traversal, 401 sem token, fallback aula 27   │
│ - NÃO altera PostgreSQL real, PocketBase real, Redis real ou /srv/cursos/videos/       │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CAMADA 3: Teste de Escrita em Banco Separado (Homologação sob Demanda)                 │
│ - ./testar-fase1-vps.sh homologacao (instruções manuais para o operador)              │
│ - Ambiente isolado criado sob demanda a partir do backup 20261031_195147               │
│ - PostgreSQL, PocketBase, Redis e /srv/cursos/videos-homologacao/ SEPARADOS           │
│ - Permite testar criação/edição de cursos, etapas, provas, publicação e uploads        │
│ - NUNCA compartilha o banco de produção.                                               │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CAMADA 4: Homologação Oficial no EasyPanel                                            │
│ - Apenas após aprovação formal do operador com a frase contratual                      │
│ - Commit e push na branch correcao-fluxo-cursos sobre 47aa7b1                          │
│ - Rebuild e redeploy do container de produção via EasyPanel                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. REGRA DO MODO B: PROTEÇÃO EXPLÍCITA `READ_ONLY_TEST=true`

### Determinação expressa do cliente:

> _"O teste na porta 3334 só poderá usar o mesmo PostgreSQL se estiver em modo somente leitura. A porta alternativa isola o processo, mas não isola o banco."_

Para cumprir essa regra, o módulo `src/routes/stream.js` incorpora um guard nativo de leitura:

```javascript
const IS_READ_ONLY_TEST = process.env.READ_ONLY_TEST === 'true'

router.use((req, res, next) => {
  if (IS_READ_ONLY_TEST) {
    const metodosMutacao = ['POST', 'PUT', 'PATCH', 'DELETE']
    if (metodosMutacao.includes(req.method.toUpperCase())) {
      return res.status(403).json({
        error:
          'Operação de escrita rejeitada: serviço em MODO SOMENTE LEITURA (READ_ONLY_TEST=true).',
        read_only_test: true,
        method_blocked: req.method,
        status: 403,
      })
    }
  }
  next()
})
```

### Comportamento sob `READ_ONLY_TEST=true`:

- **Bloqueia com HTTP 403:** qualquer tentativa de `POST`, `PUT`, `PATCH`, `DELETE`, upload de arquivo, substituição de vídeo, confirmação ou publicação de curso, criação/edição de curso, criação/edição de etapa, alteração de prova.
- **Permite somente:** `GET /health`, login controlado, leitura de metadados, verificação de autorização (aluno/mentor/admin), streaming de vídeo, cabeçalho `Range` (HTTP 206), validação contra path traversal e tratamento de arquivo inexistente.
- **Garantia física:** Nenhuma gravação no PostgreSQL de produção, no PocketBase, no Redis ou no diretório `/srv/cursos/videos/`.
- **Em produção (sem a flag):** O guard é um **no-op** inofensivo; todas as rotas autorizadas do painel e do stream funcionam normalmente.
- **Trava no script:** O subcomando `./testar-fase1-vps.sh servidor` sobe obrigatoriamente com `READ_ONLY_TEST=true` e recusa iniciar se o operador tentar desativar essa proteção sem configurar banco isolado.

---

## 4. PREPARAÇÃO: TRANSFERÊNCIA DOS CANDIDATOS PARA `/tmp/fase1_candidatos/`

Na VPS, como usuário `root`, crie a pasta temporária onde os arquivos candidatos serão inspecionados:

```bash
mkdir -p /tmp/fase1_candidatos/src/routes
mkdir -p /tmp/fase1_candidatos/src/static
```

Copie os arquivos do workspace para a VPS via SCP, rsync ou colando o conteúdo exato:

- `docs/fase1/stream.js` → `/tmp/fase1_candidatos/src/routes/stream.js`
- `docs/fase1/NOVO_PAINEL/painel-mentor.html` → `/tmp/fase1_candidatos/src/static/painel-mentor.html`

> **Importante:** Os arquivos de produção em `/root/cursos-api/src/routes/stream.js` e `/root/cursos-api/src/static/painel-mentor.html` **NÃO são tocados**.

---

## 5. CAMADA 1: VALIDAÇÃO ESTÁTICA (ZERO RISCO)

Execute o Modo A para conferir integridade criptográfica, sintaxe e diffs sem executar nenhum serviço:

```bash
./docs/operacoes/testar-fase1-vps.sh estatico
```

Ou execute manualmente os 5 passos:

### Passo A1 — Conferência dos Hashes SHA-256

```bash
sha256sum /tmp/fase1_candidatos/src/routes/stream.js
# Esperado: 6caf954f02dc65623d6eaeb3e73866dec3147bd0d94e8d2e5c027cc291802fd2

sha256sum /tmp/fase1_candidatos/src/static/painel-mentor.html
# Esperado: b9c3c701fd9e2e5bc51b619366b79c0223372fbff854a04aacd3c3f6f34d11d8
```

### Passo A2 — Checagem Sintática no Node.js (`node --check`)

```bash
node --check /tmp/fase1_candidatos/src/routes/stream.js
# Saída esperada: exit code 0 silencioso
```

### Passo A3 — Checagem Estrutural do HTML do Painel

```bash
head -n 1 /tmp/fase1_candidatos/src/static/painel-mentor.html
grep -c "sessionStorage" /tmp/fase1_candidatos/src/static/painel-mentor.html
grep -i "localStorage" /tmp/fase1_candidatos/src/static/painel-mentor.html || echo "OK: zero localStorage"
```

### Passo A4 — Geração do Diff contra o Commit Base `47aa7b1` SEM Aplicar

```bash
cd /root/cursos-api
git show 47aa7b1:src/routes/stream.js | diff -u - /tmp/fase1_candidatos/src/routes/stream.js > /tmp/diff_fase1_stream.patch
git show 47aa7b1:src/static/painel-mentor.html | diff -u - /tmp/fase1_candidatos/src/static/painel-mentor.html > /tmp/diff_fase1_painel.patch
```

### Passo A5 — Prova de que NADA foi Tocado no Repositório Real

```bash
cd /root/cursos-api
git status
# Esperado: working tree clean
```

---

## 6. CAMADA 2: SERVIDOR SOMENTE LEITURA EM PORTA 3334

O Modo B executa uma instância descartável em `/tmp/fase1_teste/` escutando na porta `3334`, conectando ao PostgreSQL do `.env` real **exclusivamente com `READ_ONLY_TEST=true`**.

### Passo B1 — Inicialização do Servidor

```bash
./docs/operacoes/testar-fase1-vps.sh servidor
```

O script:

1. Limpa `/tmp/fase1_teste/` e copia o repositório sem `.git`;
2. Sobrepõe os candidatos em `/tmp/fase1_teste/src/`;
3. Cria link simbólico para `node_modules` de produção;
4. Inicia com `PORT=3334 READ_ONLY_TEST=true node src/server.js > /tmp/fase1_teste_server.log 2>&1 &`.

### Passo B2 — Bateria Automatizada dos 13 Itens

Com o servidor de pé na porta 3334, exporte as variáveis de teste e rode a bateria:

```bash
export TEST_PORT=3334
export TEST_AULA_ID=27
export TEST_TOKEN_MENTOR="seu_token_jwt_de_mentor"
export TEST_TOKEN_ESTRANHO="seu_token_jwt_sem_relacao"
export TEST_TOKEN_ALUNO="seu_token_jwt_de_aluno"

./docs/operacoes/testar-fase1-vps.sh bateria
```

---

## 7. MATRIZ DE VERIFICAÇÃO DOS 13 ITENS CONTRATUAIS DO CLIENTE

|  Item  | Descrição Exata do Cliente                                     | Verificação / Comando `curl`                                                                                        |                       Resultado Esperado                        |
| :----: | :------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------: |
| **1**  | **Health retorna 200**                                         | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3334/health`                                               |                           **200 OK**                            |
| **2**  | **Stream autorizado retorna 206 com Content-Range**            | `curl -i -H "Authorization: Bearer $TEST_TOKEN_MENTOR" -H "Range: bytes=0-1048576" http://localhost:3334/stream/27` |     **206 Partial Content** com `Content-Range: bytes ...`      |
| **3**  | **Stream sem Range retorna 200**                               | `curl -i -H "Authorization: Bearer $TEST_TOKEN_MENTOR" http://localhost:3334/stream/27`                             |                           **200 OK**                            |
| **4**  | **Usuário sem relação retorna 403**                            | `curl -i -H "Authorization: Bearer $TEST_TOKEN_ESTRANHO" http://localhost:3334/stream/27`                           |                        **403 Forbidden**                        |
| **5**  | **Sem token retorna 401**                                      | `curl -i http://localhost:3334/stream/27`                                                                           |                      **401 Unauthorized**                       |
| **6**  | **Aula 27 usa fallback somente se o registro legado permitir** | Inspeciona `stream.js` (`aulaId === 27 && FALLBACK_LOCAL_VIDEO_FILES[27]`)                                          |             Fallback restrito estritamente ao ID 27             |
| **7**  | **Aula nova sem video_path retorna erro claro**                | `curl -i -H "Authorization: Bearer $TEST_TOKEN_MENTOR" http://localhost:3334/stream/99999`                          |           **400 Bad Request** (nunca toca a aula 27)            |
| **8**  | **Path traversal retorna 400 ou 403**                          | `curl -i -H "Authorization: Bearer $TEST_TOKEN_MENTOR" http://localhost:3334/stream/27%2F..%2F..%2Fetc%2Fpasswd`    |      **400 ou 403** com log `[STREAM SECURITY VIOLATION]`       |
| **9**  | **Nenhuma rota de escrita altera o banco**                     | `curl -i -X POST http://localhost:3334/stream/27` e `curl -i -X DELETE http://localhost:3334/stream/27`             |        **403 Forbidden** via guard `READ_ONLY_TEST=true`        |
| **10** | **Nenhum upload altera /srv/cursos/videos/**                   | `curl -i -X POST http://localhost:3334/mentor/cursos/upload-video-vps`                                              |        **403 Forbidden** (gravação no storage rejeitada)        |
| **11** | **Tokens entram apenas por variável de ambiente**              | Inspeciona terminal do operador                                                                                     | `$TEST_TOKEN_*` exportados no shell, zero arquivos com segredos |
| **12** | **Tokens não são gravados em disco**                           | `grep -rq "$TEST_TOKEN_MENTOR" /tmp/fase1_*`                                                                        |                  **Zero ocorrências** em disco                  |
| **13** | **Nenhum token aparece nos logs**                              | `grep "$TEST_TOKEN_MENTOR" /tmp/fase1_teste_server.log`                                                             |             **Zero ocorrências** no log do servidor             |

---

## 8. CAMADA 3: AMBIENTE DE ESCRITA SEPARADO (HOMOLOGAÇÃO SOB DEMANDA)

### Determinação expressa do cliente:

> _"Para testar funções de escrita, preparar um ambiente separado: PostgreSQL de homologação, PocketBase de homologação, Redis de homologação, diretório /srv/cursos/videos-homologacao/, API na porta 3334, credenciais de teste, dados de teste. O ambiente de escrita deve ser criado a partir do backup e nunca compartilhar o banco de produção."_

> **ATENÇÃO:** O GoSkip **NÃO executa** comandos na VPS. O roteiro abaixo é um **manual técnico de apoio sob demanda** para execução manual exclusiva pelo **Operador da VPS**, caso ele decida testar fluxos de criação/edição/publicação/upload antes do deploy no EasyPanel:

### 8.1. Restaurar o PostgreSQL de Homologação a partir do Backup

O operador sobe um container descartável do PostgreSQL na porta `5433` e restaura o dump confirmado `/root/backups/cursos/20261031_195147/postgres.sql`:

```bash
docker run -d --name cursos-postgres-homologacao \
  -e POSTGRES_PASSWORD=homolog_secret \
  -e POSTGRES_DB=cursos_homologacao \
  -p 5433:5432 postgres:15

# Restaurar os dados do backup
docker exec -i cursos-postgres-homologacao psql -U postgres cursos_homologacao < \
  /root/backups/cursos/20261031_195147/postgres.sql
```

### 8.2. Subir Redis de Homologação em Porta Isolada

```bash
docker run -d --name cursos-redis-homologacao \
  -v /root/backups/cursos/20261031_195147/redis-dump.rdb:/data/dump.rdb \
  -p 6380:6379 redis:7-alpine
```

### 8.3. Criar Diretório de Vídeos de Homologação

```bash
mkdir -p /srv/cursos/videos-homologacao
# Copia opcional de vídeos legados para teste de reprodução
rsync -a /srv/cursos/videos/ /srv/cursos/videos-homologacao/ || true
```

### 8.4. Subir a API de Teste Conectada ao Ambiente de Homologação

Com o banco e storage isolados, a API pode subir com `READ_ONLY_TEST=false`:

```bash
cd /tmp/fase1_teste
PORT=3334 \
DB_HOST=127.0.0.1 \
DB_PORT=5433 \
DB_NAME=cursos_homologacao \
DB_USER=postgres \
DB_PASSWORD=homolog_secret \
REDIS_PORT=6380 \
LOCAL_VIDEO_DIR=/srv/cursos/videos-homologacao \
READ_ONLY_TEST=false \
node src/server.js
```

### 8.5. Testes Permitidos Exclusivamente na Camada 3:

- Criação e edição de cursos (`POST/PUT /mentor/cursos`);
- Criação e ordenação de etapas (`POST/PUT /mentor/cursos/:id/etapas`);
- Alteração e publicação de provas (`POST/PUT /mentor/cursos/:id/provas`);
- Upload físico de vídeo MP4 (`POST /mentor/cursos/upload-video-vps`);
- Confirmação e publicação de curso.

Ao término, o operador destrói os containers descartáveis (`docker rm -f cursos-postgres-homologacao cursos-redis-homologacao`) e apaga `/srv/cursos/videos-homologacao`. **O banco de produção permaneceu 100% intocado durante todo o processo.**

---

## 9. CAMADA 4: HOMOLOGAÇÃO OFICIAL NO EASYPANEL

A homologação de produção só ocorre quando o operador autorizar formalmente com a frase contratual combinada na Fase 0:

1. Auditoria e aplicação do diff na branch `correcao-fluxo-cursos` sobre o commit base `47aa7b1`;
2. `node --check src/routes/stream.js`;
3. `git commit -m "feat(fase1): reescrita do painel do mentor e streaming seguro"`;
4. `git push origin correcao-fluxo-cursos` (NUNCA main);
5. Rebuild e redeploy do serviço `Cursos-API` no EasyPanel;
6. Acompanhamento dos logs e validação no domínio oficial.

---

## 10. ENCERRAMENTO E LIMPEZA

```bash
./docs/operacoes/testar-fase1-vps.sh parar

# Confirmação final da integridade da árvore de trabalho
cd /root/cursos-api
git status
```
