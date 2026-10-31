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
   - Referência Visual e UX do Novo Player: Adapta Alunos (`https://alunos.adapta.org/area/conteudo/aula/7869245`).

2. **Diagnóstico Principal:**
   - O painel legado em HTML/JS possui rotas funcionais para cadastro de cursos e etapas, porém contém vulnerabilidades de segurança (ex: mock codificado fixo da Aula 27 no `stream.js`, ausência de autorização no endpoint `/stream/:aulaId` para o mentor inspecionar seus próprios vídeos, falta de limpeza atômica em falhas de upload local, e duplicação de autenticação).
   - O frontend React moderno permite transformar o painel do mentor e o player em uma experiência ágil, responsiva, com navegação lateral por módulos/etapas, barra de progresso, suporte unificado a fontes de vídeo (Local VPS, YouTube, Cloudinary, OneDrive) e conformidade estrita com as regras de permissão.

---

## SEÇÃO ESPECIAL 1: SITUAÇÃO DOS COMMITS DO WORKSPACE

Em atendimento aos 7 pontos de auditoria formulados pelo operador da VPS a respeito dos commits `34df2d6` e `ecf1cc0`:

1. **Onde foram criados:** Os commits `34df2d6` e `ecf1cc0` foram criados estritamente dentro do workspace efêmero de prévia do GoSkip.
2. **Relação com o repositório oficial:** Eles **NÃO pertencem** e **NÃO foram criados** no repositório oficial `github.com/ronydgarcia-max/cursos-api`.
3. **Relação com a branch de trabalho:** Eles **NÃO pertencem** à branch de trabalho `correcao-fluxo-cursos`.
4. **Envio ao GitHub:** Eles **NÃO foram enviados (push)** ao GitHub e não constam em nenhum branch remoto do repositório.
5. **Impacto em produção:** Eles **NÃO alteram** e **NÃO impactam** o ambiente de produção da VPS em nenhuma circunstância.
6. **Conteúdo exclusivo:** Eles contêm única e exclusivamente arquivos de documentação técnica e prototipagem do workspace (notadamente `docs/RELATORIO_FASE_0_MENTOR.md`, documentos operacionais e o componente de visualização em `src/pages/Index.tsx`).
7. **Destino e isolamento:** Ficam mantidos no workspace do GoSkip exclusivamente como material de referência, alinhamento técnico e conferência visual. **NÃO serão publicados nem mesclados na VPS.**

> **Conclusão:** Commits de relatório e protótipo do GoSkip permanecem 100% segregados do código-fonte de produção e jamais serão misturados à branch `correcao-fluxo-cursos` sem autorização expressa do operador.

---

## SEÇÃO ESPECIAL 2: SEGURANÇA DOS RELATÓRIOS E SANITIZAÇÃO DE SECRETS

### 1. Auditoria de Token Exposto no Histórico

- Foi identificado que um relatório preliminar anterior continha um token de deploy de webhook do EasyPanel.
- **Classificação:** `EXPOSTO - ROTACIONAR`.
- **Ação Imediata no Workspace:** Qualquer ocorrência ou menção a valores de credenciais foi substituída pelo marcador padrão `[TOKEN_REMOVIDO_E_ROTACIONADO]`. O valor real foi completamente expurgado e **não é reproduzido em nenhum arquivo**.
- **Solicitação Formal ao Operador:** Foi registrada a solicitação formal de rotação imediata do token de deploy / API no dashboard do EasyPanel na VPS.

### 2. Política Geral de Sanitização

Nenhum arquivo deste workspace (documentos, scripts ou protótipos) armazena senhas, API keys, cookies, headers Authorization, chaves privadas, strings de conexão ou valores reais de segredos. São mantidos apenas:

- Nome da variável de ambiente;
- Serviço do EasyPanel onde é utilizada;
- Finalidade técnica;
- Exemplo fictício e seguro quando necessário.

### 3. Lista de Secrets Removidos / Mascarados

| Variável / Secret          | Serviço EasyPanel       | Finalidade Técnica                                  | Estado / Valor Sanitizado                               |
| -------------------------- | ----------------------- | --------------------------------------------------- | ------------------------------------------------------- |
| `EASYPANEL_DEPLOY_TOKEN`   | EasyPanel Webhooks      | Gatilho de deploy automático via webhook            | `[TOKEN_REMOVIDO_E_ROTACIONADO]` (EXPOSTO - ROTACIONAR) |
| `JWT_SECRET`               | Cursos-API              | Assinatura e validação dos tokens JWT dos usuários  | Nome mantido; valor real omitido                        |
| `MENTOR_JWT_SECRET`        | Cursos-API / SSO        | Validação de tokens de login SSO do mentor          | Nome mantido; valor real omitido                        |
| `CURSOS_API_BRIDGE_SECRET` | Cursos-API              | Proteção de comunicação interna via bridge          | Nome mantido; valor real omitido                        |
| `POSTGRES_PASSWORD`        | PostgreSQL / Cursos-API | Senha do banco relacional PostgreSQL                | Nome mantido; valor real omitido                        |
| `DATABASE_URL`             | Cursos-API              | String de conexão com o banco de dados              | `postgresql://cursos_user:***@postgres:5432/cursos_db`  |
| `REDIS_PASSWORD`           | Redis / Cursos-API      | Autenticação no Redis para cache e rate-limit       | Nome mantido; valor real omitido                        |
| `REDIS_URL`                | Cursos-API              | String de conexão do Redis                          | `redis://:***@redis:6379`                               |
| `CLOUDINARY_API_SECRET`    | Cursos-API              | Chave de autenticação na API do Cloudinary          | Nome mantido; valor real omitido                        |
| `MS_GRAPH_CLIENT_SECRET`   | Cursos-API              | Segredo de aplicativo Azure para streaming OneDrive | Nome mantido; valor real omitido                        |
| `GROQ_API_KEY`             | Cursos-API              | Chave de API para moderação de conteúdo por IA      | Nome mantido; valor real omitido                        |

---

## SEÇÃO ESPECIAL 3: VERSÕES, DEPENDÊNCIAS E MIGRATIONS

### 1. Tabela do Estado Conhecido de Ambiente e Runtime

| Componente               | Estado Conhecido no Workspace                                                        | Declaração Conflitante                               | Ação / Depende de Confirmação na VPS                                                                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js Runtime**      | `Dockerfile` declara `FROM node:20-alpine`                                           | Tentativa de `node` falhou no container              | **NÃO CONFIRMADO (Evidência OCI)**: Execução falhou com `OCI runtime exec failed: exec: "node": executable file not found in $PATH`. Ver diagnóstico detalhado na Seção Especial 6.                                                                     |
| **Scripts de Migration** | `src/database/migrate.js` aplica arquivos contidos em `src/database/migrations/*.js` | Existe um arquivo `migration.sql` na raiz do projeto | **A confirmar na VPS**: Como `runMigrations()` só lê `src/database/migrations/`, o `migration.sql` da raiz **NÃO é executado automaticamente**. O operador deve confirmar se os `ALTER TABLE` desse arquivo já foram rodados manualmente no PostgreSQL. |
| **Tabelas Principais**   | `cursos`, `etapas`/`aulas`, `usuarios`, `matriculas`, `progresso`                    | Nomes históricos: `etapas` vs `aulas`                | O código usa majoritariamente `aulas` com colunas `video_path` e `video_type`. Confirmado via código Express.                                                                                                                                           |
| **Diretório de Vídeos**  | Host: `/srv/cursos/videos/` -> Container: `/app/videos/`                             | Confirmado no inventário da VPS                      | **Confirmado pelo operador**: Host `/srv/cursos/videos/` montado em `/app/videos/` no container.                                                                                                                                                        |

### 2. Diretrizes de Migrations para a Fase 1

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

| Item                                           | Status                   | Justificativa / Observação                                                                                                                                        |
| ---------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Autenticação JWT e extração de token           | Funcionando              | Suporta Bearer, headers alternativos e query token                                                                                                                |
| Middleware `apenasMentor`                      | Funcionando              | Checa `mentor_status = 'aprovado'` ou `role = 'admin'`                                                                                                            |
| Isolamento de cursos por mentor                | Funcionando              | Queries filtram sempre por `mentor_id = req.usuario.id`                                                                                                           |
| Upload de MP4 local para VPS                   | Funcionando parcialmente | Salva o arquivo e retorna o path, mas em erro de rename pode deixar rastro e falta confirmação de deleção de arquivo órfão                                        |
| Streaming HTTP Range local                     | Com erro / Incompleto    | Dicionário estático `LOCAL_VIDEO_FILES = { 27: ... }` com path hardcoded para aula 27. Deve ler `aulas.video_path` dinamicamente do banco de dados                |
| Autorização no `/stream/:aulaId` para o Mentor | Incompleto               | Rota exige que `usuario_id` esteja em `matriculas`. O mentor do curso não consegue pré-visualizar sua própria aula no player do painel sem estar matriculado nele |
| Exclusão de vídeo local ao deletar etapa       | Inseguro / Parcial       | `path.resolve` é usado, mas falta trava explícita de escape de diretório antes de `fs.unlinkSync`                                                                 |
| Trava de curso com alunos                      | Funcionando              | Impede edição se `total_matriculas > 0`                                                                                                                           |
| Player de visualização no painel               | Incompleto               | O painel legado só exibia embed de YouTube em `<iframe>`; vídeos locais, OneDrive e Cloudinary ficavam sem pré-visualização completa                              |
| UX do Player e Módulos (Referência Adapta)     | Incompleto               | Referência Adapta tem sidebar com lista de aulas, progresso, player centralizado, tabs de materiais e navegação sequencial                                        |

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

## ANÁLISE COMPARATIVA: NOVO PLAYER (REFERÊNCIA ADAPTA) E LIMITAÇÕES

> **DECLARAÇÃO DE LIMITAÇÃO OBRIGATÓRIA:**  
> A análise atual da interface do player de referência é baseada na descrição funcional e na especificação conceitual da plataforma Adapta Alunos (`https://alunos.adapta.org/area/conteudo/aula/7869245`), **NÃO na página real inspecionada diretamente pelo GoSkip**, uma vez que a URL exige autenticação restrita de aluno ativo.  
> Os **screenshots reais do player de referência SERÃO ENVIADOS SEPARADAMENTE pelo operador** e **NÃO estão disponíveis nesta rodada**. Nenhuma conclusão visual definitiva é tomada antes do envio dessas capturas.

- **Layout Conceitual:** Estrutura limpa com tema escuro/elegante.
- **Área Central:** Player em destaque (proporção 16:9) com controles de velocidade, tela cheia, qualidade e volume.
- **Sidebar Retrátil:** Módulos expansíveis (accordion), checklist de aulas concluídas, ícone do tipo de mídia (vídeo, documento, quiz), duração e indicação da aula ativa.
- **Abaixo do Player:** Título da aula, botão "Marcar como Concluída", navegação rápida "Aula Anterior" e "Próxima Aula", além de abas para "Descrição", "Materiais de Apoio (PDF)" e "Anotações/Dúvidas".
- **Adaptação para o Painel do Mentor:** O mentor precisa de um modo de **Pré-visualização do Aluno** dentro do painel para testar suas aulas locais, YouTube, OneDrive e Cloudinary exatamente como o aluno verá, com botão de troca de etapa e teste de streaming.

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

## SEÇÃO ESPECIAL 6: DIAGNÓSTICO DO RUNTIME NODE.JS (SITUAÇÃO: NÃO CONFIRMADO)

Durante a auditoria executada na VPS pelo operador, a tentativa de checar a versão do Node dentro do container `cursos-api` retornou a seguinte mensagem de erro:

```text
OCI runtime exec failed: exec failed: unable to start container process: exec: "node": executable file not found in $PATH
```

### 1. Conclusão Técnica

A versão real do Node.js em produção **CONTINUA NÃO CONFIRMADA**.

### 2. Hipóteses Técnicas a Validar na VPS

1. **Runtime Alternativo:** A imagem construída pelo EasyPanel (`easypanel/cursos-api/cursos-api:latest`) pode utilizar outro runtime de JavaScript moderno (como Bun ou Deno) em vez de Node clássico.
2. **Container ou Instância Incorreta:** Como existem 5+ instâncias com identificadores alfanuméricos gerados pelo EasyPanel/Swarm, o comando pode ter sido acionado contra um container legado, parado ou que executa apenas entrypoint estático/proxy.
3. **Instalação em Caminho Não Padrão:** O binário pode estar em diretório customizado não exportado no `$PATH` padrão do container (ex.: `/usr/local/bin`, `~/.nvm`, etc.).

### 3. Comandos de Diagnóstico Sugeridos para o Operador na VPS

Para esclarecer definitivamente o runtime antes da Fase 1, o operador deve executar como root na VPS:

```bash
# A. Inspecionar o sistema operacional e procurar executáveis de runtime:
docker exec <CONTAINER_CURSOS_API_ATIVO> sh -c "which node || which bun || which deno; cat /etc/os-release"

# B. Checar processos ativos dentro do container principal:
docker exec <CONTAINER_CURSOS_API_ATIVO> sh -c "ps aux || ps -ef"

# C. Checar o Dockerfile utilizado na raiz do repositório na VPS:
cat /root/cursos-api/Dockerfile || docker inspect <CONTAINER_CURSOS_API_ATIVO> --format '{{json .Config.Entrypoint}} {{json .Config.Cmd}}'
```

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
  8. Manifesto Git e metadados operacionais
  9. `SHA256SUMS.txt` (Assinatura e somas de verificação SHA-256 de todos os artefatos)
- **Validações Concluídas pelo Operador:**
  - Hashes SHA-256 validados com sucesso via checksum.
  - Execução de `restaurar-cursos-vps.sh --dry-run` concluída com **100% de sucesso**.
  - Nenhuma alteração aplicada na produção.

---

## PENDÊNCIAS RESTANTES PRÉ-FASE 1 (LISTA OFICIAL DOS 6 ITENS)

Com a incorporação do inventário EasyPanel e a confirmação do backup e dry-run pelo operador, restam exatamente **6 pendências mandatórias** antes do início da Fase 1:

1. **Rotação Obrigatória do Token do EasyPanel:** O operador deve rotacionar no painel EasyPanel o token de deploy/API exposto em relatórios anteriores deste projeto.
2. **Análise de `src/routes/provas.js`:** Arquivo real a ser enviado pelo operador para análise técnica da lógica de avaliações.
3. **Screenshots Desktop e Celular do Player:** Capturas de tela da área de membros do player de referência (Adapta) a serem enviadas pelo operador.
4. **Confirmação da Versão Real do Node.js:** Esclarecimento do erro OCI e confirmação se a produção usa Node 18, Node 20, Bun ou Deno.
5. **Confirmação sobre Migrations do PostgreSQL:** Confirmação de que o `migration.sql` da raiz já foi executado no PostgreSQL ou se é necessário script idempotente de alinhamento.
6. **Avaliação de Necessidade de Backup dos Dados do Redis:** Avaliação pelo operador se os dados em cache/rate-limit do Redis exigem snapshot persistente ou se podem ser recriados sob demanda.

_(Após o atendimento destes 6 itens, o relatório final da Fase 0 será concluído para emissão do termo de autorização da Fase 1)._

---

## FASE 1: PLANO DA REESCRITA DO PAINEL

### 1. Arquivos que NÃO Serão Alterados nesta Rodada (e Protegidos até Autorização)

Conforme regra estrita do operador, **nenhum código de produção é alterado nesta rodada**. A lista de componentes protegidos inclui:

- `src/routes/mentor.js` (Protegido — inalterado)
- `src/routes/etapas.js` (Protegido — inalterado)
- `src/static/painel-mentor.html` (Protegido — inalterado)
- `src/routes/stream.js` (Protegido — inalterado)
- Banco de dados PostgreSQL e esquemas (Inalterado)
- Migrations (`migration.sql` e `src/database/migrations/`) (Inalterado)
- Autenticação e middlewares JWT / Bridge (Inalterado)
- Configurações do EasyPanel (Inalterado)
- `Dockerfile` e imagens Docker (Inalterado)
- Scripts de deploy em produção (Inalterado)
- Frontend do aluno (Inalterado)
- Rotas públicas da API (Inalterado)

### 2. Arquivos Candidatos a Alteração na Fase 1 (Dependem de Autorização Expressa)

Somente após a autorização do operador, do backup confirmado na VPS e do recebimento de `provas.js` e screenshots:

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

| Risco                                         | Impacto | Probabilidade | Mitigação Planejada                                                                              |
| --------------------------------------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------ |
| Quebra de streaming na aula 27 já existente   | Alto    | Média         | Manter `LOCAL_VIDEO_FILES[27]` como fallback incondicional caso `video_path` seja nulo           |
| Sobrecarga de disco por uploads locais órfãos | Médio   | Média         | Implementar limpeza automática de arquivos temporários e deleção ao substituir vídeo             |
| Conflito de versão Node.js no build           | Alto    | Baixa         | Confirmar previamente se a VPS roda Node 18 ou Node 20 antes de gerar dependências               |
| DDL concorrente ou falha de migration         | Crítico | Baixa         | Nenhuma migration automática na Fase 1; qualquer DDL deve ser testada e com rollback documentado |

### 3. Critérios de Autorização da Fase 1

A autorização para a Fase 1 depende dos seguintes critérios formais:

- [x] **Backup completo preparado e confirmado pelo operador:** Concluído em `/root/backups/cursos/20261031_195147` com bundle Git, fonte, vídeos, dump Postgres, PocketBase e SHA-256.
- [x] **Restauração em modo `--dry-run` validada pelo operador:** Execução com 100% de sucesso sem alterar produção.
- [x] **Inventário EasyPanel estruturado na VPS:** Concluído e incorporado em `/root/INVENTARIO_EASYPANEL.md`.
- [ ] **Rotação do token EasyPanel exposto:** Pendente de execução manual pelo operador no painel da VPS.
- [ ] **Recebimento e análise de `src/routes/provas.js`:** Pendente de envio pelo operador.
- [ ] **Recebimento de screenshots desktop e celular do player:** Pendente de envio pelo operador.
- [ ] **Confirmação da versão real do Node.js (ou runtime):** Pendente do diagnóstico via comandos sugeridos na Seção Especial 6.
- [ ] **Confirmação do estado do `migration.sql`:** Pendente de confirmação no PostgreSQL.
- [ ] **Avaliação sobre dados do Redis:** Pendente de validação pelo operador.
- [ ] **Atualização do relatório final e termo formal assinado pelo mantenedor.**

### 4. Critérios de Aceite Técnico da Fase 1 (Pós-Autorização)

- [ ] Todo streaming local dinâmico lê de `aulas.video_path` com segurança contra path traversal comprovada.
- [ ] Mentores conseguem pré-visualizar suas aulas no novo player sem receber erro 403.
- [ ] Novo painel do mentor entrega interface responsiva com player, sidebar de módulos e suporte aos 4 tipos de vídeo.
- [ ] O script de rollback restaura o ambiente para o commit estável `47aa7b1` em menos de 10 minutos caso acionado.
