# PAINEL DE REVISÃO E AUDITORIA TÉCNICA - PAINEL DO MENTOR & NOVO PLAYER (FASE 0)

Este documento registra a análise técnica completa, estruturada e exaustiva da **Fase 0** e o **Plano de Reescrita Controlada da Fase 1**, conforme as diretrizes estritas do projeto **Cursos API (Conexão Batista)**.

> **Regra do Projeto:** Nenhuma alteração de código é aplicada na VPS sem análise prévia entregue e autorização explícita do mantenedor. O GoSkip não possui acesso direto à VPS do projeto. A homologação real em produção é manual.
>
> **Repositório Oficial:** `github.com/ronydgarcia-max/cursos-api` | **Branch de Trabalho:** `correcao-fluxo-cursos` | **Commit Base Estável:** `47aa7b1`  
> **Serviços EasyPanel:** Cursos-API, PocketBase, PostgreSQL, Redis.

---

## SUMÁRIO EXECUTIVO

1. **Escopo Analisado:**
   - Backend Express (`src/routes/mentor.js`, `src/routes/etapas.js`, `src/routes/stream.js`, `src/routes/auth.js`, `src/routes/sso.js`, `src/routes/bridge-proxy.js`).
   - Frontend legado HTML/JS (`src/static/painel-mentor.html`).
   - Infraestrutura VPS: Armazenamento persistente `/srv/cursos/videos/{curso_id}/` montado no container em `/app/videos/`.
   - Referência Visual e UX do Novo Player: Mock visual conceitual do player aprovado pelo operador no workspace do GoSkip (substituindo pendência de screenshots da página externa).

2. **Diagnóstico Principal:**
   - O painel legado em HTML/JS possui rotas funcionais para cadastro de cursos e etapas, porém contém vulnerabilidades de segurança (ex: mock codificado fixo da Aula 27 no `stream.js`, ausência de autorização no endpoint `/stream/:aulaId` para o mentor inspecionar seus próprios vídeos, falta de limpeza atômica em falhas de upload local, e duplicação de autenticação).
   - O frontend React moderno permite transformar o painel do mentor e o player em uma experiência ágil, responsiva, com navegação lateral por módulos/etapas, barra de progresso, suporte unificado a fontes de vídeo (Local VPS, YouTube, Cloudinary, OneDrive) e conformidade estrita com as regras de permissão.

---

## SEÇÃO ESPECIAL 1: SITUAÇÃO DOS COMMITS DO WORKSPACE

Em atendimento aos 7 pontos de auditoria formulados pelo operador da VPS a respeito dos commits de workspace `34df2d6`, `ecf1cc0` e `505e672`:

1. **Onde foram criados:** Os commits `34df2d6`, `ecf1cc0` e `505e672` foram criados estritamente dentro do workspace efêmero de prévia do GoSkip.
2. **Relação com o repositório oficial:** Eles **NÃO pertencem** e **NÃO foram criados** no repositório oficial `github.com/ronydgarcia-max/cursos-api`.
3. **Relação com a branch de trabalho:** Eles **NÃO pertencem** à branch de trabalho oficial `correcao-fluxo-cursos`.
4. **Envio ao GitHub:** Eles **NÃO foram enviados (push)** ao GitHub e não constam em nenhum branch remoto do repositório.
5. **Impacto em produção:** Eles **NÃO alteram** e **NÃO impactam** o ambiente de produção da VPS em nenhuma circunstância.
6. **Conteúdo exclusivo:** Eles contêm única e exclusivamente arquivos de documentação técnica e prototipagem do workspace (notadamente `docs/RELATORIO_FASE_0_MENTOR.md`, documentos operacionais e o componente de visualização em `src/pages/Index.tsx`).
7. **Destino e isolamento:** Ficam mantidos no workspace do GoSkip exclusivamente como material de referência, alinhamento técnico e conferência visual. **NÃO devem ser publicados nem mesclados na VPS sob nenhuma hipótese.**

> **Conclusão:** Commits de relatório e protótipo do GoSkip (`34df2d6`, `ecf1cc0`, `505e672`) permanecem 100% segregados do código-fonte de produção e jamais serão misturados à branch `correcao-fluxo-cursos`.

---

## SEÇÃO ESPECIAL 2: SEGURANÇA DOS RELATÓRIOS E SANITIZAÇÃO DE SECRETS

### 1. Auditoria e Rotação do Token do EasyPanel (CONCLUÍDA PELO OPERADOR)

- Foi identificado em rodadas preliminares que um token de deploy de webhook/API do EasyPanel constava no histórico.
- **Ação Imediata no Workspace:** Qualquer ocorrência ou menção a valores de credenciais foi substituída pelo marcador padrão `[TOKEN_REMOVIDO_E_ROTACIONADO]`. O valor real foi completamente expurgado e **nunca é reproduzido em nenhum relatório, commit, arquivo, screenshot ou mensagem**.
- **Resolução Externa pelo Operador:** O **OPERADOR DA VPS** revogou no painel do EasyPanel a chave API antiga exposta e gerou uma **NOVA CHAVE**. O novo valor **NUNCA DEVE APARECER** neste workspace. Usar exclusivamente o marcador sanitizado `[TOKEN_REMOVIDO_E_ROTACIONADO]`.
- **Status da Pendência:** **CONCLUÍDA E ENCERRADA**. A rotação foi atestada pelo operador; nenhuma pendência de credencial permanece aberta.

### 2. Política Geral de Sanitização

Nenhum arquivo deste workspace (documentos, scripts ou protótipos) armazena senhas, API keys, cookies, headers Authorization, chaves privadas, strings de conexão ou valores reais de segredos. São mantidos apenas:

- Nome da variável de ambiente;
- Serviço do EasyPanel onde é utilizada;
- Finalidade técnica;
- Exemplo fictício e seguro quando necessário.

### 3. Lista de Secrets Removidos / Mascarados

| Variável / Secret          | Serviço EasyPanel       | Finalidade Técnica                                  | Estado / Valor Sanitizado                                                            |
| -------------------------- | ----------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `EASYPANEL_DEPLOY_TOKEN`   | EasyPanel Webhooks      | Gatilho de deploy automático via webhook            | `[TOKEN_REMOVIDO_E_ROTACIONADO]` (ROTACIONADO PELO OPERADOR - CHAVE ANTIGA REVOGADA) |
| `JWT_SECRET`               | Cursos-API              | Assinatura e validação dos tokens JWT dos usuários  | Nome mantido; valor real omitido                                                     |
| `MENTOR_JWT_SECRET`        | Cursos-API / SSO        | Validação de tokens de login SSO do mentor          | Nome mantido; valor real omitido                                                     |
| `CURSOS_API_BRIDGE_SECRET` | Cursos-API              | Proteção de comunicação interna via bridge          | Nome mantido; valor real omitido                                                     |
| `POSTGRES_PASSWORD`        | PostgreSQL / Cursos-API | Senha do banco relacional PostgreSQL                | Nome mantido; valor real omitido                                                     |
| `DATABASE_URL`             | Cursos-API              | String de conexão com o banco de dados              | `postgresql://cursos_user:***@postgres:5432/cursos_db`                               |
| `REDIS_PASSWORD`           | Redis / Cursos-API      | Autenticação no Redis para cache e rate-limit       | Nome mantido; valor real omitido                                                     |
| `REDIS_URL`                | Cursos-API              | String de conexão do Redis                          | `redis://:***@redis:6379`                                                            |
| `CLOUDINARY_API_SECRET`    | Cursos-API              | Chave de autenticação na API do Cloudinary          | Nome mantido; valor real omitido                                                     |
| `MS_GRAPH_CLIENT_SECRET`   | Cursos-API              | Segredo de aplicativo Azure para streaming OneDrive | Nome mantido; valor real omitido                                                     |
| `GROQ_API_KEY`             | Cursos-API              | Chave de API para moderação de conteúdo por IA      | Nome mantido; valor real omitido                                                     |

---

## SEÇÃO ESPECIAL 3: VERSÕES, DEPENDÊNCIAS E MIGRATIONS

### 1. Tabela do Estado Conhecido de Ambiente e Runtime

| Componente               | Estado Conhecido no Workspace                                                        | Situação Confirmada pelo Operador                 | Ação / Decisão Técnica para Fase 1                                                                                                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js Runtime**      | `Dockerfile` declara `FROM node:20-alpine` (desatualizado)                           | **CONFIRMADO PELO OPERADOR**: Node v20.20.2       | Container real em execução: `cursos-api_cursos-api.1.jsmxpl7rmip278eajgb5f5ms4`. Referências a Node 18 em Dockerfile/documentação estão desatualizadas. Correção do Dockerfile fica para a Fase 1 (não alterar agora).                            |
| **Scripts de Migration** | `src/database/migrate.js` aplica arquivos contidos em `src/database/migrations/*.js` | **CONFIRMADO APLICADO**: Migration já aplicada    | Container PostgreSQL: `cursos-api_postgres.1.mpp4zqgnifgzjkh2y0hz9f4hm`. A tabela `cursos` já possui todas as colunas. **NÃO executar migration.sql novamente**. Corrigir duplicidade de `matriz_curricular` apenas no código na Fase 1, sem DDL. |
| **Tabelas Principais**   | `cursos`, `etapas`/`aulas`, `provas`, `provas_perguntas`, `provas_alternativas`      | Colunas adicionais confirmadas na tabela `cursos` | Colunas presentes em `cursos`: `video_url`, `video_type`, `video_public_id`, `thumbnail_url`, `confirmed_author`, `ia_score`, `matriz_curricular`, `subcategoria`.                                                                                |
| **Diretório de Vídeos**  | Host: `/srv/cursos/videos/` -> Container: `/app/videos/`                             | Confirmado no inventário da VPS                   | **Confirmado pelo operador**: Host `/srv/cursos/videos/` montado em `/app/videos/` no container.                                                                                                                                                  |

### 2. Diretrizes de Migrations e Banco de Dados (PostgreSQL Confirmado)

- **Confirmação na VPS:** O operador confirmou no container `cursos-api_postgres.1.mpp4zqgnifgzjkh2y0hz9f4hm` que a tabela `cursos` **já possui** as colunas:
  - `video_url`
  - `video_type`
  - `video_public_id`
  - `thumbnail_url`
  - `confirmed_author`
  - `ia_score`
  - `matriz_curricular`
  - `subcategoria`
- **Aviso Crítico de Operação:** **NÃO EXECUTAR `migration.sql` NOVAMENTE NO BANCO DE DADOS.** A migration já se encontra aplicada no PostgreSQL 17 de produção.
- **Tratamento da Duplicidade de `matriz_curricular`:** Foi identificada uma duplicidade da instrução `ALTER TABLE cursos ADD COLUMN IF NOT EXISTS matriz_curricular ...` no arquivo físico `migration.sql`. Esta duplicidade será corrigida **SOMENTE NO CÓDIGO DA MIGRATION DURANTE A FASE 1** — nenhuma alteração ou comando DDL deve ser acionado no banco agora.
- **Princípio de Minimização:** A reescrita do painel **NÃO criará nenhuma migration nova** sem estrita necessidade funcional comprovada.
- **Rollback de Schema:** Caso alguma alteração DDL seja autorizada na Fase 1, o procedimento de rollback correspondente (script `DOWN` e plano de restauração via `pg_dump`) será documentado e testado antes do merge.

---

## SEÇÃO ESPECIAL 4: PLANO DE CORREÇÃO DO STREAMING (DOCUMENTAÇÃO — SEM IMPLEMENTAR NESTA RODADA)

> **ATENÇÃO:** Nenhuma linha de código em `src/routes/stream.js` está sendo alterada nesta rodada. Esta seção apenas documenta a especificação técnica aprovada pelo operador.

### 1. Diagnóstico do Problema Atual

Atualmente, `GET /stream/:aulaId` contém um dicionário fixo estático:

```js
const LOCAL_VIDEO_FILES = {
  27: path.join(process.env.LOCAL_VIDEO_DIR || '/app/videos', '37', 'aula-27.mp4'),
}
```

Se qualquer outra aula com `video_type = 'local'` for solicitada, o endpoint falha com erro 400 (`Vídeo local não configurado para esta aula`), inviabilizando todas as novas aulas gravadas na VPS. Além disso, se o mentor dono do curso acessar a rota para inspecionar seu vídeo, recebe 403 (`Você não está matriculado neste curso`).

### 2. Correção Recomendada e Aprovada

Quando a Fase 1 for expressamente autorizada, a rota de streaming será corrigida conforme os seguintes pilares:

1. **Consulta Dinâmica ao Banco:**
   - Buscar na tabela `aulas` (ou `etapas`) as colunas `video_path`, `video_type` e `curso_id` pelo `aulaId`.
   - Se `video_type === 'local'` e `video_path` estiver preenchido, obter o caminho gravado (ex: `37/pending-uuid.mp4` ou `37/aula-27.mp4`).

2. **Resolução e Proteção Contra Path Traversal:**
   - Resolver o caminho absoluto usando:
     ```js
     const baseDir = path.resolve(process.env.LOCAL_VIDEO_DIR || '/app/videos')
     const resolvedPath = path.resolve(baseDir, aula.video_path)
     ```
   - Validar estritamente que `resolvedPath.startsWith(baseDir + path.sep)`. Se violado, rejeitar imediatamente com HTTP 400 / 403 e log de alerta de segurança.

3. **Verificação de Existência do Arquivo:**
   - Verificar se o arquivo existe em disco (`fs.existsSync(resolvedPath)`). Se ausente, retornar HTTP 404 (`Arquivo de vídeo não encontrado no servidor`).

4. **Fallback Temporário para a Aula 27:**
   - Manter o mapa fixo `LOCAL_VIDEO_FILES[27]` exclusivamente como fallback de retrocompatibilidade para o caso de a aula 27 ainda não ter o campo `video_path` preenchido no banco de dados.

5. **Liberação de Acesso para o Mentor Proprietário:**
   - Ajustar a checagem de autorização:
     ```sql
     SELECT 1 FROM matriculas m WHERE m.usuario_id = $1 AND m.curso_id = $2
     UNION
     SELECT 1 FROM cursos c WHERE c.id = $2 AND c.mentor_id = $1
     UNION
     SELECT 1 FROM usuarios u WHERE u.id = $1 AND u.role = 'admin'
     ```
   - O mentor do curso conseguirá inspecionar e testar o vídeo no novo player sem precisar de matrícula artificial.

6. **Limpeza de Vídeo Antigo em Substituição:**
   - Quando o mentor fizer upload de um novo vídeo para uma aula já existente, validar o `video_path` anterior e remover o arquivo antigo do disco de forma atômica para evitar acúmulo de arquivos órfãos no volume `/srv/cursos/videos/`.

---

## RELATÓRIO OBRIGATÓRIO DA FASE 0

### 1. Arquivos Encontrados

- `/root/cursos-api/src/routes/mentor.js`
- `/root/cursos-api/src/routes/etapas.js`
- `/root/cursos-api/src/routes/provas.js` (Recebido e analisado na Fase 0)
- `/root/cursos-api/src/static/painel-mentor.html`
- `/root/cursos-api/src/routes/stream.js`
- `/root/cursos-api/src/middleware/auth.js`
- `/root/cursos-api/src/middleware/bridge.js`
- `/root/cursos-api/src/routes/auth.js`
- `/root/cursos-api/src/routes/sso.js`
- `/root/cursos-api/src/routes/bridge-proxy.js`
- `/root/cursos-api/src/database/db.js`
- `/root/cursos-api/src/database/postgres.js`
- `/root/cursos-api/src/database/redis.js`
- `/root/cursos-api/src/database/migrate.js`
- `/root/cursos-api/migration.sql`
- `/root/cursos-api/migrations/002_extend_mentor_status.sql`
- `/root/cursos-api/migrations/003_progresso_aluno.js`
- `/root/cursos-api/migrations/002_material_pdf.js`
- `/root/cursos-api/migrations/001_etapas_provas.js`
- `/root/cursos-api/package.json`
- `/root/cursos-api/package-lock.json`
- `/root/cursos-api/Dockerfile`
- `/root/cursos-api/README.md`
- `/root/cursos-api/DOCUMENTACAO.md`
- `/root/cursos-api/RELATORIO-BACKEND.md`
- `/root/cursos-api/RELATORIO-FRONTEND.md`

### 2. Arquivos Utilizados pelo Painel

- `src/routes/mentor.js` (Rotas de cursos, dashboard, alunos e upload VPS).
- `src/routes/etapas.js` (CRUD de etapas/aulas, upload de imagens/slides/materiais de apoio).
- `src/routes/provas.js` (CRUD completo de avaliações, perguntas e alternativas associadas ao curso/etapa).
- `src/static/painel-mentor.html` (Interface do mentor servida via `/painel`).
- `src/middleware/auth.js` (Middleware de validação JWT).
- `src/routes/stream.js` (Streaming de vídeo com suporte a HTTP Range).
- `src/database/db.js` (Pool do PostgreSQL).

### 3. Arquivos Não Utilizados / Redundantes

- `src/database/postgres.js` (Duplicação do `db.js` criando pool paralelo).
- Cópias de backup não expostas: `src/routes/mentor.js.backup.1792423980`, `src/routes/backup/mentor_Back.js`, `src/routes/stream.js.backup-before-local-video`, etc.

### 4. Arquivos Ausentes

- `/root/cursos-api/src/server.js` (Não existe; o entry point é exclusivamente `src/index.js`).
- `/root/cursos-api/src/app.js` (Não existe; centralizado em `src/index.js`).
- `/root/cursos-api/src/services/video.js` e `src/services/videos.js` (Lógica de vídeo distribuída entre `upload.js` e rotas de `mentor.js`).

### 5. Rotas Encontradas

- `GET /mentor/dashboard`: Estatísticas de cursos, alunos e taxa de conclusão.
- `GET /mentor/alunos`: Listagem de alunos matriculados nos cursos do mentor.
- `GET /mentor/avaliacoes`: Avaliações pendentes.
- `GET /mentor/cursos`: Listagem dos cursos criados pelo mentor.
- `POST /mentor/cursos`: Criação de curso (status inicial `rascunho`).
- `GET /mentor/cursos/:id`: Detalhes do curso do mentor.
- `PUT /mentor/cursos/:id`: Atualização de curso (bloqueado se houver matrículas ativas ou status `em_analise`).
- `DELETE /mentor/cursos/:id`: Exclusão de curso e limpeza no Cloudinary.
- `POST /mentor/cursos/:id/enviar-analise`: Envio com moderação Groq AI.
- `PUT /mentor/cursos/:id/publicar`: Publicação efetiva (apenas se status for `aprovado`).
- `POST /mentor/cursos/upload`: Upload de thumbnail de vitrine (Cloudinary).
- `POST /mentor/cursos/upload-video`: Upload de vídeo para Cloudinary (até 100MB).
- `POST /mentor/cursos/upload-video-vps`: Upload de MP4 para a VPS em `/app/videos/{curso_id}/` (até 1GB).
- `GET /mentor/cursos/:id/etapas`: Listagem das aulas/etapas ordenadas.
- `POST /mentor/cursos/:id/etapas`: Criação de etapa (vídeo, slide ou imagem).
- `PUT /mentor/cursos/:id/etapas/:etapaId`: Atualização de etapa.
- `DELETE /mentor/cursos/:id/etapas/:etapaId`: Exclusão de etapa e arquivo em disco/Cloudinary.
- `GET /mentor/cursos/:id/provas`: Listagem de provas do curso com subselect do total de perguntas.
- `GET /mentor/cursos/:id/provas/:provaId`: Detalhes completos da prova com perguntas e alternativas montadas em memória.
- `POST /mentor/cursos/:id/provas`: Criação atômica de prova, perguntas e alternativas via transação SQL (`BEGIN`/`COMMIT`/`ROLLBACK`).
- `PUT /mentor/cursos/:id/provas/:provaId`: Atualização parcial de prova (título, nota mínima, etapa associada).
- `DELETE /mentor/cursos/:id/provas/:provaId`: Exclusão de prova por `id` e `curso_id`.
- `GET /stream/:aulaId`: Streaming de vídeo com suporte a Range bytes.

### 6. Registro das Rotas

- Centralizado no `src/index.js` montando rotas sob `/mentor`, `/stream`, `/auth`, `/cursos`, `/usuarios` e `/aluno`.

### 7. Fluxo de Autenticação

- Token JWT via cabeçalho `Authorization: Bearer <token>` ou `x-cursos-token` ou query string `?token=`.
- Assinado com `JWT_SECRET`.
- Integração SSO via `src/routes/sso.js` validando `MENTOR_JWT_SECRET` e redirecionando para `/painel?token=...`.
- Integração Bridge via `src/routes/bridge-proxy.js` e `src/routes/auth.js` (`/auth/bridge-login`) com proteção por `CURSOS_API_BRIDGE_SECRET` e rate limit no Redis.

### 8. Fluxo de Autorização

- Middleware `apenasMentor`: consulta `usuarios` por `req.usuario.id`.
- Requer estritamente `mentor_status === 'aprovado' || role === 'admin'`.
- Cada operação verifica se o `curso_id` pertence ao `mentor_id = req.usuario.id`.

### 9. Fluxo de Cursos

- Criado em `rascunho` -> submetido para moderação (`em_analise`) -> aprovado pela moderação/IA (`aprovado`) -> mentor aciona `publicar` -> `publicado`.
- Trava de integridade: se já houver alunos matriculados, alteração estrutural do curso é bloqueada.

### 10. Fluxo de Etapas (Aulas)

- Tipos suportados: `video`, `slide`, `imagem`.
- Tipos de vídeo: `local` (VPS), `youtube`, `onedrive`, `upload` (Cloudinary).
- Ordem sequencial automática (`MAX(ordem) + 1`).
- Suporte a material de apoio PDF complementar (`material_pdf_url`).

### 11. Fluxo de Upload

- Arquivos temporários salvos via Multer em `/app/videos/tmp`.
- Validação de mimetype (`video/mp4` ou extensão `.mp4`).
- Ao validar o `curso_id`, renomeia para `/app/videos/{curso_id}/pending-{uuid}.mp4` e retorna `video_path: "{curso_id}/{fileName}"`.

### 12. Fluxo de Vídeos & Armazenamento

- Host VPS: `/srv/cursos/videos/{curso_id}/`.
- Container: `/app/videos/{curso_id}/`.
- Nomes de arquivos gerados como `pending-{UUID}.mp4` ou mapeamento específico de aulas.

### 13. Fluxo de Streaming

- Rota `GET /stream/:aulaId`.
- Verifica se o aluno está matriculado (`SELECT 1 FROM matriculas WHERE usuario_id = $1 AND curso_id = $2`).
- Suporte a cabeçalhos `Range: bytes=start-end`. Retorna status `206 Partial Content` com `Content-Range` e `Content-Length`.

---

## TABELA DE CLASSIFICAÇÃO DOS ITENS

| Item                                           | Status                   | Justificativa / Observação                                                                                                                                                          |
| ---------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Autenticação JWT e extração de token           | Funcionando              | Suporta Bearer, headers alternativos e query token                                                                                                                                  |
| Middleware `apenasMentor`                      | Funcionando              | Checa `mentor_status = 'aprovado'` ou `role = 'admin'`                                                                                                                              |
| Isolamento de cursos por mentor                | Funcionando              | Queries filtram sempre por `mentor_id = req.usuario.id`                                                                                                                             |
| Upload de MP4 local para VPS                   | Funcionando parcialmente | Salva o arquivo e retorna o path, mas em erro de rename pode deixar rastro e falta confirmação de deleção de arquivo órfão                                                          |
| Streaming HTTP Range local                     | Com erro / Incompleto    | Dicionário estático `LOCAL_VIDEO_FILES = { 27: ... }` com path hardcoded para aula 27. Deve ler `aulas.video_path` dinamicamente do banco de dados                                  |
| Autorização no `/stream/:aulaId` para o Mentor | Incompleto               | Rota exige que `usuario_id` esteja em `matriculas`. O mentor do curso não consegue pré-visualizar sua própria aula no player do painel sem estar matriculado nele                   |
| Exclusão de vídeo local ao deletar etapa       | Inseguro / Parcial       | `path.resolve` é usado, mas falta trava explícita de escape de diretório antes de `fs.unlinkSync`                                                                                   |
| Trava de curso com alunos                      | Funcionando              | Impede edição se `total_matriculas > 0`                                                                                                                                             |
| Player de visualização no painel               | Incompleto               | O painel legado só exibia embed de YouTube em `<iframe>`; vídeos locais, OneDrive e Cloudinary ficavam sem pré-visualização completa                                                |
| UX do Player e Módulos (Mock Aprovado)         | Referência Aprovada      | Mock conceitual do workspace aprovado pelo operador: player à esquerda, matriz curricular à direita, progresso %, aula destacada, anterior/próxima, materiais, quiz, selos de vídeo |

---

## LEVANTAMENTO DETALHADO DE PROBLEMAS E CORREÇÕES

### Problema 1: Dicionário fixo da Aula 27 no `stream.js`

- **Problema:** O arquivo `src/routes/stream.js` possui mapa estático com a aula 27.
- **Causa:** Solução temporária (hotfix) aplicada para resolver a aula 27 sem generalizar para as demais aulas locais.
- **Arquivo:** `src/routes/stream.js`.
- **Rota:** `GET /stream/:aulaId`.
- **Correção Recomendada:** Consultar a coluna `video_path` e `video_type` da tabela `aulas`. Se `video_type === 'local'` e `video_path` estiver preenchido, resolver o caminho seguro em `/app/videos/` e transmitir o vídeo. Manter fallback transparente para a aula 27 caso `video_path` não esteja no banco.
- **Como Testar:** Fazer requisição GET `/stream/{id}` com cabeçalho `Range: bytes=0-1024` e verificar status 206 e Content-Range válido.
- **Rollback:** Restaurar o arquivo `src/routes/stream.js.backup-before-local-video`.

### Problema 2: Mentor bloqueado no Streaming da própria aula

- **Problema:** A rota `GET /stream/:aulaId` rejeita com `403 Você não está matriculado neste curso` se o mentor tentar pré-visualizar a aula no player do painel sem ter se matriculado como aluno.
- **Causa:** A query de checagem só verifica `matriculas`.
- **Arquivo:** `src/routes/stream.js`.
- **Rota:** `GET /stream/:aulaId`.
- **Correção Recomendada:** Permitir acesso ao stream se o usuário for aluno matriculado OU se for o mentor proprietário do curso (`cursos.mentor_id = req.usuario.id`) OU se for `admin`.
- **Como Testar:** Fazer requisição com token de mentor proprietário do curso e conferir retorno 200/206 sem erro 403.
- **Rollback:** Reverter condição SQL na query de autorização do stream.

### Problema 3: Trava de Path Traversal ao excluir vídeo local

- **Problema:** No arquivo `src/routes/etapas.js` linha 294, a exclusão do arquivo local valida `startsWith`, mas `normalizarVideoPath` não impedia completamente variações de caminhos relativos em caso de inputs manuais maliciosos.
- **Causa:** Validação permissiva na entrada de `video_path`.
- **Arquivo:** `src/routes/etapas.js`.
- **Correção Recomendada:** Sanitizar estritamente `video_path` para aceitar unicamente o padrão regex `^[0-9]+\/[a-zA-Z0-9_\-\.]+\.mp4$`.
- **Como Testar:** Enviar requisição com `../../etc/passwd` e verificar rejeição imediata com erro 400.

---

## ANÁLISE COMPARATIVA: NOVO PLAYER E MOCK CONCEITUAL APROVADO PELO OPERADOR

### 1. Aprovação Formal do Mock pelo Operador como Referência Visual da Fase 1

O operador da VPS enviou e aprovou o mock visual do novo player como referência de layout e experiência para a Fase 1. Em suas palavras literais:

> _"O mock enviado deve ser considerado a referência visual desejada para o novo player do painel/aluno de Cursos."_

A proposta visual aprovada contém:

- **Player principal à esquerda** (proporção 16:9, controles de reprodução, badges de fonte e metadados).
- **Painel de matriz curricular à direita** com:
  - Progresso percentual visual do curso/módulo.
  - Lista sequencial de aulas com duração informada.
  - Aula atual destacada com estado ativo.
  - Indicação clara de itens de quiz/avaliação.
- **Botão aula anterior** e **botão próxima aula**.
- **Seção de materiais de apoio** (ex: PDFs complementares para download).
- **Suporte visual explícito aos formatos de vídeo suportados:**
  - Vídeo local VPS (`/stream/{id}` e `video_path` com HTTP Range 206).
  - YouTube (embed oficial).
  - OneDrive / Microsoft Graph.
  - Cloudinary.

> **Regra de Propriedade Intelectual e UX:** Usar o mock como referência de layout e experiência, sem copiar código, imagens, textos, scripts ou identidade visual de terceiros.

### 2. As 7 Ressalvas Literais do Operador

A aprovação do mock pelo operador foi concedida com **7 ressalvas literais**, que ficam formalmente registradas e vinculantes para qualquer implementação futura:

1. **O mock é conceitual.**
2. **O mock foi produzido no workspace do GoSkip.**
3. **O mock não representa uma captura real da página externa.**
4. **A implementação deverá usar os dados e rotas reais do projeto Cursos.**
5. **O player deverá preservar /stream/{id}, video_path, vídeos locais, YouTube, Cloudinary e OneDrive.**
6. **O player deverá funcionar em desktop e celular.**
7. **O progresso, módulos, duração, materiais e navegação deverão vir dos dados reais do backend.**

> **Declaração de Suficiência e Trava da Fase 1:**  
> **"Considerar esta referência visual suficiente para planejar a Fase 1, mas não iniciar a Fase 1 sem autorização expressa do operador."**

### 3. Substituição da Pendência de Screenshots Externos

A pendência prévia de envio de screenshots da referência externa (Adapta) fica formal e integralmente **SUBSTITUÍDA pelo mock aprovado**. A referência visual do projeto passa a ser o mock construído no workspace, não a página externa logada.

Com essa substituição:

- **Pendências Externas Restantes:** **NENHUMA** (todas as pendências técnicas da Fase 0 estão resolvidas: backup validado, dry-run concluído, Redis RDB íntegro, inventário EasyPanel mapeado, token EasyPanel rotacionado e sanitizado, Node v20.20.2 atestado, migrations confirmadas no PostgreSQL, `provas.js` analisado e referência visual do player aprovada).
- **Condição Única para Iniciar a Fase 1:** Autorização expressa e formal do operador através da frase exata: `"Autorizo iniciar a Fase 1 da reescrita do painel do mentor."`

---

## SEÇÃO ESPECIAL 5: INVENTÁRIO DO EASYPANEL INCORPORADO (EVIDÊNCIA REAL DA VPS)

Com base no inventário gerado pelo operador na VPS (`/root/INVENTARIO_EASYPANEL.md` em `Sat Oct 31 19:53:19 -03 2026`, servidor `srv845644`), os dados estruturais dos **4 serviços do projeto Cursos** foram formalmente incorporados:

### 1. Os 4 Serviços do Projeto Cursos

#### A. PostgreSQL (`cursos-api_postgres.1.mpp4zqgnifgzjkh2y0hz9f4hm`)

- **Imagem:** `postgres:17`
- **Portas:** `5432/tcp` (sem porta externa pública publicada no host; acesso restrito às redes internas Docker)
- **Volumes Persistentes:**
  - Host: `/etc/easypanel/projects/cursos-api/postgres/data` -> Container: `/var/lib/postgresql/data`
- **Redes Docker:** `easypanel`, `easypanel-cursos-api`
- **Variáveis de Ambiente (apenas nomes registrados):** `GOSU_VERSION`, `LANG`, `PATH`, `PGDATA`, `PG_MAJOR`, `PG_VERSION`, `POSTGRES_DB`, `POSTGRES_PASSWORD`, `POSTGRES_USER`

#### B. Cursos-API (`cursos-api_cursos-api.*` - múltiplas instâncias/réplicas ativas)

- **Imagem:** `easypanel/cursos-api/cursos-api:latest`
- **Portas:** `3333/tcp` interna (sem publicação direta visível em IP público; roteamento e terminação TLS gerenciados pelo Traefik)
- **Instâncias Detectadas:** 5+ containers ativos da mesma imagem (ex.: `cursos-api_cursos-api.1.jsmxpl7rmip278eajgb5f5ms4`, `j5smm6275xwx0p0iinl3sb49h`, `4gevvrjk3f2wk36ydjublduq8`, `43ad3ku8iu2na3bbgpwah6lni`, `lm6isq5x8musocfsnnciz9gqh`)
- **Volumes e Caminhos de Vídeos:**
  - Host: `/srv/cursos/videos/` -> Container: `/app/videos/`
- **Redes Docker:** `easypanel`

#### C. Redis (`cursos-api_redis.1.t9nm3rw7cag3ooovnskhnjlok`)

- **Imagem:** `redis:7`
- **Portas:** `6379/tcp` interna (sem porta externa exposta)
- **Volumes Persistentes:**
  - Host: `/etc/easypanel/projects/cursos-api/redis/data` -> Container: `/data`
- **Redes Docker:** `easypanel`, `easypanel-cursos-api`
- **Variáveis de Ambiente (apenas nomes registrados):** `PATH`, `REDIS_PASSWORD`, `REDIS_VERSION`

#### D. PocketBase (`cursos-api_pocketbase.1.kohju1jfjbvrbafqt44xbe0qu`)

- **Imagem:** `ghcr.io/muchobien/pocketbase:latest`
- **Portas:** Sem porta externa publicada visível (acesso interno via proxy reverso/rede interna)
- **Redes Docker:** `easypanel`

### 2. Infraestrutura de Borda e Outros Serviços no Host (Fora do Escopo Direto)

- **Traefik:** `traefik:3.6.7` gerenciando portas `80/tcp` e `443/tcp` (HTTP/HTTPS) para roteamento público e certificados SSL.
- **EasyPanel Core:** `easypanel/easypanel:latest` expondo porta `3000/tcp`.
- **Outros Serviços Hospedados (Fora do Escopo de Cursos):**
  - `devocional-api` (`devocional-conexao-batista-api`, portas 3100->3333)
  - `devocional-static` e `devocional-backend-proxy` (`nginx:alpine`, porta 80)
  - `devocional-devocional-pocketbase-1` (`ghcr.io/muchobien/pocketbase:latest`, porta local de loopback)
  - `admin-conexao-admin-frontend-1` (`admin-conexao-frontend:latest`, porta 8080->80)
  - `admin-conexao-admin-api-1` (`admin-conexao-backend:latest`, porta 4000)
  - `vscode-dev` (`codercom/code-server:latest`, porta 8081->8080)

---

## SEÇÃO ESPECIAL 6: RUNTIME NODE.JS CONFIRMADO PELO OPERADOR (NODE v20.20.2)

> **ATRIBUIÇÃO MANDATÓRIA:** Diagnóstico e validação executados e atestados formalmente pelo **OPERADOR DA VPS**.

### 1. Dados Técnicos Confirmados do Runtime em Produção

- **Versão Real do Node.js:** `v20.20.2`
- **Container em Execução:** `cursos-api_cursos-api.1.jsmxpl7rmip278eajgb5f5ms4`
- **Ambiente Operacional:** Node v20 LTS moderno rodando sob o stack gerenciado pelo EasyPanel.
- **Diagnóstico do Erro OCI Anterior:** O erro `OCI runtime exec failed: exec: "node": executable file not found in $PATH` ocorreu por tentativa de execução pontual contra réplica/container estático intermediário ou fora do container worker principal. No container ativo `cursos-api_cursos-api.1.jsmxpl7rmip278eajgb5f5ms4`, o executável foi localizado e a versão **v20.20.2** foi confirmada com 100% de precisão.

### 2. Status do Dockerfile e Documentação

- O `Dockerfile` e arquivos de documentação que mencionam Node 18 estão **DESATUALIZADOS**.
- **Diretriz Técnica para a Fase 1:** A referência oficial de runtime é **Node 20** (`v20.20.2`). A correção formal do `Dockerfile` e de documentações secundárias fica agendada para a **Fase 1**. **Nenhum arquivo Dockerfile é alterado nesta rodada da Fase 0**.

---

## SEÇÃO ESPECIAL 7: CONFIRMAÇÃO DO BACKUP COMPLETO (AÇÃO CONCLUÍDA PELO OPERADOR)

> **ATRIBUIÇÃO MANDATÓRIA:** Todas as ações abaixo foram executadas e validadas exclusivamente pelo **OPERADOR DA VPS**, sem intervenção de execução direta pelo GoSkip.

- **Data e Hora da Conclusão:** `2026-10-31 19:51:47 -03`
- **Localização do Snapshot:** `/root/backups/cursos/20261031_195147`
- **Itens Contidos e Validados:**
  1. `cursos-api.bundle` (Bundle completo do repositório Git com histórico e tags)
  2. `cursos-api-source.tar.gz` (Código-fonte versionado e arquivos de configuração)
  3. `cursos-videos.tar.gz` (Arquivos de vídeo de `/srv/cursos/videos/`)
  4. `postgres.sql` (Dump estrutural e de dados do PostgreSQL 17)
  5. Volumes do PocketBase (Arquivos de dados e configurações do PocketBase)
  6. Configurações estruturais do PostgreSQL
  7. Configurações estruturais do Redis
  8. `redis-dump.rdb` (Snapshot RDB do Redis validado com `redis-check-rdb`: arquivo íntegro, checksum interno OK, ZERO chaves no momento do backup, ZERO expirações — pendência de backup do Redis RESOLVIDA pelo operador)
  9. Manifesto Git e metadados operacionais
  10. `SHA256SUMS.txt` (Assinatura e somas de verificação SHA-256 de todos os artefatos)
- **Validações Concluídas pelo Operador:**
  - Hashes SHA-256 validados com sucesso via checksum.
  - Snapshot do Redis `redis-dump.rdb` validado com utilitário oficial `redis-check-rdb`: integridade confirmada, checksum OK, zero chaves ativas, zero expirações.
  - Execução de `restaurar-cursos-vps.sh --dry-run` concluída com **100% de sucesso**.
  - Nenhuma alteração aplicada na produção.

---

## SEÇÃO ESPECIAL 8: ANÁLISE TÉCNICA EXAUSTIVA DE `src/routes/provas.js`

O arquivo oficial `src/routes/provas.js` foi fornecido pelo operador e incorporado ao escopo de auditoria da Fase 0. Abaixo consta o detalhamento completo de sua arquitetura, fluxos, queries e avaliação de riscos.

### 1. Arquitetura do Router e Autorização

- **Montagem do Router:** O módulo cria um `express.Router()` destinado ao gerenciamento de provas e questionários dos cursos criados pelo mentor.
- **Middleware Local `apenasMentor`:**
  ```js
  async function apenasMentor(req, res, next) {
    if (!req.usuario || !req.usuario.id) return res.status(401).json({ error: 'Não autenticado' })
    const result = await pool.query('SELECT role, mentor_status FROM usuarios WHERE id = $1', [
      req.usuario.id,
    ])
    const u = result.rows[0]
    if (!u) return res.status(404).json({ error: 'Usuário não encontrado' })
    const ehMentor = u.mentor_status === 'aprovado' || u.role === 'admin'
    if (!ehMentor)
      return res.status(403).json({
        error: 'Apenas mentores aprovados têm acesso a esta área',
        status_atual: u.mentor_status,
      })
    req.usuario.role = u.role
    req.usuario.mentor_status = u.mentor_status
    next()
  }
  ```
- **Avaliação de Duplicação com `src/middleware/auth.js`:**
  - O arquivo aplica `router.use(auth, apenasMentor)` a todas as rotas do módulo.
  - O middleware local `apenasMentor` executa uma query pontual na tabela `usuarios` checando `mentor_status === 'aprovado' || role === 'admin'`.
  - Essa checagem duplica a lógica existente em outros endpoints de mentor (`src/routes/mentor.js` e middlewares globais).
  - _Recomendação para a Fase 1:_ Unificar o middleware `apenasMentor` em módulo compartilhado (`src/middleware/autorizacao.js` ou em `src/middleware/auth.js`), evitando consultas redundantes e divergências de regra de negócio entre rotas.
- **Helper `obterCursoDoMentor(cursoId, mentorId)`:**
  - Executa: `SELECT * FROM cursos WHERE id = $1 AND mentor_id = $2`.
  - Garante isolamento estrito: um mentor **jamais** consegue listar, detalhar, criar, alterar ou excluir provas de cursos pertencentes a outro usuário.

### 2. Rotas Mapeadas e Operações

| Rota Express                  | Método   | Descrição Funcional                                  | Lógica de Banco / SQL                                                                                                                                                                                                                              |
| :---------------------------- | :------- | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/cursos/:id/provas`          | `GET`    | Lista todas as provas de um curso                    | `SELECT p.*, (SELECT COUNT(*)::int FROM provas_perguntas pp WHERE pp.prova_id = p.id) AS total_perguntas FROM provas p WHERE p.curso_id = $1 ORDER BY p.id ASC`                                                                                    |
| `/cursos/:id/provas/:provaId` | `GET`    | Busca detalhes da prova com perguntas e alternativas | Consulta `provas` (validando `curso_id`), consulta `provas_perguntas` ordenada por `ordem ASC, id ASC`, e consulta `provas_alternativas` via `INNER JOIN`. Monta o payload aninhado em memória via `map/filter`.                                   |
| `/cursos/:id/provas`          | `POST`   | Cria nova prova com perguntas e alternativas em lote | Inicia transação `BEGIN`. Insere em `provas RETURNING *`, itera sobre `perguntas`, insere em `provas_perguntas RETURNING id`, itera sobre `alternativas`, insere em `provas_alternativas`. Finaliza com `COMMIT` ou `ROLLBACK` em caso de exceção. |
| `/cursos/:id/provas/:provaId` | `PUT`    | Atualização parcial da prova                         | Permite atualizar `titulo`, `nota_minima` (0 a 100) e `etapa_id` (com validação se a etapa pertence ao curso na tabela `aulas`). Executa `UPDATE provas ... RETURNING *`.                                                                          |
| `/cursos/:id/provas/:provaId` | `DELETE` | Exclui prova do curso                                | Executa `DELETE FROM provas WHERE id = $1 AND curso_id = $2`.                                                                                                                                                                                      |

### 3. Validações e Regras de Negócio no `POST`

- **Título:** Obrigatório (`!titulo` retorna 400).
- **Perguntas:** Obrigatório array não vazio (`Array.isArray(perguntas) && perguntas.length > 0`).
- **Etapa Opcional (`etapa_id`):** Se informado, valida se existe registro correspondente na tabela `aulas` com `id = etapa_id AND curso_id = req.params.id`. Se inválido, retorna 400 (`Etapa inválida`).
- **Nota Mínima (`nota_minima`):** Se omitido, assume default `60`. Valida range numérico estrito entre `0` e `100`.
- **Validação de Perguntas:** Cada item deve conter `texto` preenchido e array `alternativas` com no mínimo 2 itens.
- **Validação de Alternativa Correta:** Exige obrigatoriamente que ao menos uma alternativa contenha `correta === true`.
- **Geração de Letras:** Mapeia posições para letras `['A', 'B', 'C', 'D', 'E']`, com fallback dinâmico `String.fromCharCode(65 + j)` para questionários com mais de 5 alternativas.

### 4. Tabelas do Banco Envolvidas

1. `cursos`: Validação de propriedade (`id`, `mentor_id`).
2. `usuarios`: Verificação de perfil e aprovação do mentor (`id`, `role`, `mentor_status`).
3. `aulas`: Validação de integridade referencial da etapa associada (`id`, `curso_id`).
4. `provas`: Cabeçalho da avaliação (`id`, `curso_id`, `etapa_id`, `titulo`, `nota_minima`, `created_at`, `updated_at`).
5. `provas_perguntas`: Questões da prova (`id`, `prova_id`, `ordem`, `texto`).
6. `provas_alternativas`: Opções de resposta (`id`, `pergunta_id`, `letra`, `texto`, `correta`).

### 5. Observações de Risco e Pontos a Revisar na Fase 1

1. **Vazamento de Mensagens Internas no Tratamento de Erros (HTTP 500):**
   - No bloco `catch` do `POST /cursos/:id/provas`:
     ```js
     res.status(500).json({ error: err.message || 'Erro ao criar prova' })
     ```
   - Erros de validação disparados com `throw new Error('Cada pergunta precisa de texto...')` respondem com status 500 (em vez de 400 Bad Request) e erros de sintaxe ou conexão com o PostgreSQL podem vazar mensagens internas da engine no JSON de resposta.
   - _Ajuste Fase 1:_ Tratar erros de validação com HTTP 400 e mascarar erros genéricos de banco com HTTP 500 padronizado.
2. **Deleção Sem Verificação de Linhas Afetadas:**
   - No `DELETE /cursos/:id/provas/:provaId`:
     ```js
     await pool.query('DELETE FROM provas WHERE id = $1 AND curso_id = $2', [
       req.params.provaId,
       req.params.id,
     ])
     res.json({ success: true })
     ```
   - Se a prova não existir ou o `id` estiver errado, a query executa sem erro e retorna `{ success: true }` mesmo sem ter apagado nenhum registro (`rowCount === 0`).
   - _Ajuste Fase 1:_ Checar `result.rowCount === 0` e responder `404 Prova não encontrada`.
3. **Ausência de Trava de Ciclo de Vida do Curso:**
   - Em `mentor.js`, cursos com status `em_analise`, `aprovado` ou que já possuem alunos matriculados têm regras estritas que impedem edição de conteúdo.
   - No `provas.js`, **não há verificação do status do curso nem de matrículas ativas**. Um mentor poderia criar, alterar ou excluir provas de um curso já publicado ou com alunos respondendo avaliações.
   - _Ajuste Fase 1:_ Adicionar validação de ciclo de vida (`curso.status !== 'em_analise'` e bloqueio de exclusão se houver respostas de alunos registradas).
4. **Atualização Parcial de Perguntas/Alternativas (PUT):**
   - O `PUT /cursos/:id/provas/:provaId` atualmente permite atualizar apenas `titulo`, `nota_minima` e `etapa_id`. Não há endpoint para edição de perguntas ou alternativas sem recriar a prova inteira.
   - _Ajuste Fase 1:_ Avaliar suporte a edição ou substituição atômica de questões no novo painel.

### 6. Funcionalidades Críticas a PRESERVAR na Fase 1

- **Transacionalidade Atômica:** O uso explícito de `BEGIN`, `COMMIT` e `ROLLBACK` via `pool.connect()` no cadastro de provas deve ser rigorosamente mantido.
- **Validações de Domínio:** Exigência de pelo menos 1 pergunta, no mínimo 2 alternativas por pergunta, e obrigatoriedade de exatamente uma alternativa correta.
- **Letras Sequenciais Automáticas:** Mapeamento de `A`, `B`, `C`, `D`, `E` com fallback dinâmico `String.fromCharCode(65 + j)`.
- **Isolamento de Tenant:** Garantia incondicional de que qualquer consulta de leitura ou mutação passe por `obterCursoDoMentor(cursoId, mentorId)`.

---

## SITUAÇÃO DAS PENDÊNCIAS PRÉ-FASE 1 (ZERO PENDÊNCIAS EXTERNAS RESTANTES)

Com os avanços confirmados e formalmente atestados pelo **OPERADOR DA VPS** e pela auditoria da Fase 0:

- **Backup Completo da VPS:** Executado e confirmado pelo operador em `/root/backups/cursos/20261031_195147` (cursos-api.bundle, cursos-api-source.tar.gz, cursos-videos.tar.gz, postgres.sql, PocketBase, redis-dump.rdb, manifests, configurações estruturais, SHA256SUMS.txt).
- **Dry-run de Restauração:** Executado pelo operador com `restaurar-cursos-vps.sh --dry-run`, 100% OK e sem alterações em produção.
- **Redis RDB:** Snapshot `redis-dump.rdb` validado com `redis-check-rdb`, checksum OK, zero chaves, zero expirações.
- **Inventário EasyPanel Real:** Confirmado no host `srv845644` com 4 serviços: Cursos-API, PocketBase, PostgreSQL e Redis.
- **Rotação do Token EasyPanel (CONCLUÍDA):** Chave API antiga revogada e nova criada pelo operador no painel da VPS. O novo valor NUNCA deve ser registrado em relatórios, commits, arquivos, screenshots ou mensagens — mantido exclusivamente o marcador `[TOKEN_REMOVIDO_E_ROTACIONADO]`. Pendência encerrada.
- **Runtime Node.js:** Confirmado pelo operador como **Node v20.20.2** no container `cursos-api_cursos-api.1.jsmxpl7rmip278eajgb5f5ms4`. Dockerfile e documentações com Node 18 marcados como desatualizados (correção do Dockerfile é tema da Fase 1).
- **PostgreSQL / Migrations Aplicadas:** Confirmado pelo operador no container `cursos-api_postgres.1.mpp4zqgnifgzjkh2y0hz9f4hm` que a tabela `cursos` já possui as 8 colunas (`video_url`, `video_type`, `video_public_id`, `thumbnail_url`, `confirmed_author`, `ia_score`, `matriz_curricular`, `subcategoria`). **Aviso explícito: NÃO reexecutar `migration.sql`**. Duplicidade de `matriz_curricular` a corrigir somente no código da migration, sem tocar no banco.
- **Arquivo `src/routes/provas.js`:** Recebido, integralmente analisado e documentado na Seção Especial 8. O arquivo `provas.js` **NÃO deve ser alterado**.
- **Referência Visual do Player (RESOLVIDA E APROVADA):** A pendência de screenshots externos foi **SUBSTITUÍDA** pelo mock conceitual aprovado pelo operador no workspace do GoSkip, contendo player à esquerda, matriz curricular à direita com progresso %, lista de aulas com duração, aula atual destacada, botões anterior/próxima aula, materiais de apoio, quiz e selos de suporte para vídeo local VPS / YouTube / OneDrive.
- **Branch Oficial e Commit Base:** Branch exclusiva `correcao-fluxo-cursos` no repositório `github.com/ronydgarcia-max/cursos-api`; commit base estável `47aa7b1` (inalterado). Proibido usar branch `main` sem autorização expressa.
- **Commits GoSkip de Workspace:** Commits `34df2d6`, `ecf1cc0` e `505e672` são restritos ao protótipo/documentação e **NÃO devem ser publicados na VPS**.

**Pendências Externas Restantes:** **NENHUMA**. Todas as pendências técnicas da Fase 0 estão resolvidas.

> **AUTORIZAÇÃO DA FASE 1:** A Fase 1 permanece bloqueada aguardando **EXCLUSIVAMENTE** a autorização expressa do operador com o envio da frase exata:  
> `"Autorizo iniciar a Fase 1 da reescrita do painel do mentor."`

---

## FASE 1: PLANO DA REESCRITA DO PAINEL

### 1. Arquivos que NÃO Serão Alterados nesta Rodada (e Protegidos até Autorização)

Conforme regra estrita do operador, **nenhum código de produção é alterado nesta rodada**. A lista de componentes protegidos inclui:

- `src/routes/mentor.js` (Protegido — inalterado)
- `src/routes/etapas.js` (Protegido — inalterado)
- `src/static/painel-mentor.html` (Protegido — inalterado)
- `src/routes/stream.js` (Protegido — inalterado)
- `src/routes/provas.js` (Protegido — inalterado)
- Banco de dados PostgreSQL e esquemas (Inalterado)
- Migrations (`migration.sql` e `src/database/migrations/`) (Inalterado)
- Autenticação e middlewares JWT / Bridge (Inalterado)
- Configurações do EasyPanel (Inalterado)
- `Dockerfile` e imagens Docker (Inalterado)
- Scripts de deploy em produção (Inalterado)
- Frontend do aluno (Inalterado)
- Rotas públicas da API (Inalterado)

### 2. Arquivos Candidatos a Alteração na Fase 1 (Dependem de Autorização Expressa)

Somente após a autorização expressa do operador via frase exata:

- `src/routes/stream.js` (Apenas para o streaming dinâmico seguro e autorização do mentor).
- `src/static/painel-mentor.html` ou novo bundle frontend estático servido na rota do mentor.
- Arquivos complementares mapeados após análise de `src/routes/provas.js`.

---

## TESTES PLANEJADOS, RISCOS E CRITÉRIOS DE ACEITE DA FASE 1

### 1. Testes Planejados

1. **Teste de Autenticação:** Login via JWT Bearer, header `x-cursos-token` e SSO.
2. **Teste de Isolamento de Mentor:** Tentativa de alteração de curso de outro mentor (deve retornar 403/404).
3. **Teste de Upload VPS:** Envio de MP4 até 1GB e conferência de gravação em `/app/videos/{curso_id}/`.
4. **Teste de Streaming Local Dinâmico:** Requisição `GET /stream/:aulaId` com Range `bytes=0-1024` para aula diferente da 27 (status 206).
5. **Teste de Streaming do Mentor:** Acesso de mentor proprietário à própria aula (deve retornar 200/206, sem 403).
6. **Teste de Path Traversal:** Envio de caminhos relativos maliciosos em exclusão e stream (deve rejeitar com 400).
7. **Teste de Moderação Groq:** Submissão de curso para análise e retorno de parecer estruturado.
8. **Teste de Publicação:** Bloqueio de publicação em curso não aprovado.

### 2. Matriz de Riscos da Fase 1

| Risco                                         | Impacto | Probabilidade | Mitigação Planejada                                                                                                                                     |
| --------------------------------------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Quebra de streaming na aula 27 já existente   | Alto    | Média         | Manter `LOCAL_VIDEO_FILES[27]` como fallback incondicional caso `video_path` seja nulo                                                                  |
| Sobrecarga de disco por uploads locais órfãos | Médio   | Média         | Implementar limpeza automática de arquivos temporários e deleção ao substituir vídeo                                                                    |
| Conflito de versão Node.js no build           | Alto    | Baixa         | Runtime Node v20.20.2 confirmado pelo operador; alinhar dependências e Dockerfile exclusivamente no padrão Node 20 LTS                                  |
| Reexecução inadvertida de migration           | Crítico | Baixa         | Trava documental explícita: NÃO reexecutar `migration.sql`; colunas da tabela cursos já existem; duplicidade de matriz_curricular corrigir só no código |
| DDL concorrente ou falha de migration         | Crítico | Baixa         | Nenhuma migration automática na Fase 1; qualquer DDL deve ser testada e com rollback documentado                                                        |
| Regressão em avaliações/provas                | Alto    | Baixa         | Manter transação atômica BEGIN/COMMIT/ROLLBACK, validações de domínio e isolamento de mentor mapeados na análise técnica                                |
| Vazamento de secrets ou tokens no deploy      | Crítico | Baixa         | Sanitização rigorosa pré-commit; proibição absoluta de senhas, chaves ou tokens nos repositórios e relatórios                                           |

### 3. Critérios de Autorização da Fase 1

A autorização formal para o início da Fase 1 depende dos seguintes critérios:

- [x] **Backup completo preparado e confirmado pelo operador:** Concluído em `/root/backups/cursos/20261031_195147` com bundle Git, fonte, vídeos, dump Postgres, PocketBase, Redis RDB (`redis-dump.rdb` validado com `redis-check-rdb`, zero chaves, zero expirações) e SHA-256.
- [x] **Restauração em modo `--dry-run` validada pelo operador:** Execução com 100% de sucesso sem alterar produção (`restaurar-cursos-vps.sh --dry-run`).
- [x] **Inventário EasyPanel estruturado na VPS:** Concluído e incorporado em `/root/INVENTARIO_EASYPANEL.md` (4 serviços: Cursos-API, PocketBase, Postgre, Redis).
- [x] **Backup dos dados do Redis (RDB):** Concluído e validado pelo operador via `redis-check-rdb` (`redis-dump.rdb` íntegro, checksum OK, zero chaves, zero expirações).
- [x] **Rotação do token do EasyPanel (CONCLUÍDA PELO OPERADOR):** Chave antiga revogada e nova criada pelo operador no painel da VPS. Marcador `[TOKEN_REMOVIDO_E_ROTACIONADO]` mantido, sem nenhum valor real exposto. Pendência encerrada.
- [x] **Confirmação da versão real do Node.js:** Node v20.20.2 confirmado pelo operador no container real `cursos-api_cursos-api.1.jsmxpl7rmip278eajgb5f5ms4`. Dockerfile/docs com Node 18 marcados como desatualizados.
- [x] **Confirmação das Migrations no PostgreSQL:** Confirmado pelo operador no container `cursos-api_postgres.1.mpp4zqgnifgzjkh2y0hz9f4hm` que a tabela `cursos` possui as 8 colunas. Migration aplicada. Não executar `migration.sql` novamente. Correção de duplicidade fica para código da Fase 1.
- [x] **Recebimento e análise técnica de `src/routes/provas.js`:** Arquivo fornecido pelo operador, analisado minuciosamente na Seção Especial 8. Não alterar `provas.js`.
- [x] **Branch de trabalho oficial:** `correcao-fluxo-cursos` no repositório `github.com/ronydgarcia-max/cursos-api`. Branch `main` não autorizada.
- [x] **Commit base estável:** `47aa7b1` (inalterado).
- [x] **Isolamento de commits de workspace:** `34df2d6`, `ecf1cc0` e `505e672` segregados e NÃO publicados na VPS.
- [x] **Referência visual do player aprovada pelo operador:** Mock visual conceitual do workspace aprovado com as 7 ressalvas literais do operador; pendência de screenshots externos substituída pelo mock; zero pendências externas restantes.
- [ ] **Envio da frase exata de autorização pelo operador:** "Autorizo iniciar a Fase 1 da reescrita do painel do mentor." — a Fase 1 só começa após o envio exato desta frase.

### 4. Critérios de Aceite Técnico da Fase 1 (Pós-Autorização)

- [ ] Todo streaming local dinâmico lê de `aulas.video_path` com segurança contra path traversal comprovada.
- [ ] Mentores conseguem pré-visualizar suas aulas no novo player sem receber erro 403.
- [ ] Novo painel do mentor entrega interface responsiva com player, sidebar de módulos e suporte aos 4 tipos de vídeo.
- [ ] O script de rollback restaura o ambiente para o commit estável `47aa7b1` em menos de 10 minutos caso acionado.
