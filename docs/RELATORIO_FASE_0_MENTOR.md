# PAINEL DE REVISÃO E AUDITORIA TÉCNICA - PAINEL DO MENTOR & NOVO PLAYER (FASE 0)

Este documento registra a análise técnica completa, estruturada e exaustiva da **Fase 0** e o **Plano de Reescrita Controlada da Fase 1**, conforme as diretrizes estritas do projeto **Cursos API (Conexão Batista)**.

> **Regra do Projeto:** Nenhuma alteração de código é aplicada na VPS sem análise prévia entregue e autorização explícita do mantenedor. O GoSkip não possui acesso direto à VPS (`69.62.124.240`). A homologação real em produção é manual.

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
| Streaming HTTP Range local                     | Com erro / Incompleto    | Dicionário estático `LOCAL_VIDEO_FILES = { 27: ... }` com path hardcoded para aula 27! Deve ler `aulas.video_path` dinamicamente do banco de dados                |
| Autorização no `/stream/:aulaId` para o Mentor | Incompleto               | Rota exige que `usuario_id` esteja em `matriculas`. O mentor do curso não consegue pré-visualizar sua própria aula no player do painel sem estar matriculado nele |
| Exclusão de vídeo local ao deletar etapa       | Inseguro / Parcial       | `path.resolve` é usado, mas falta trava explícita de escape de diretório antes de `fs.unlinkSync`                                                                 |
| Trava de curso com alunos                      | Funcionando              | Impede edição se `total_matriculas > 0`                                                                                                                           |
| Player de visualização no painel               | Incompleto               | O painel legado só exibia embed de YouTube em `<iframe>`; vídeos locais, OneDrive e Cloudinary ficavam sem pré-visualização completa                              |
| UX do Player e Módulos (Referência Adapta)     | Incompleto               | Referência Adapta tem sidebar com lista de aulas, progresso, player centralizado, tabs de materiais e navegação sequencial                                        |

---

## LEVANTAMENTO DETALHADO DE PROBLEMAS E CORREÇÕES

### Problema 1: Dicionário fixo da Aula 27 no `stream.js`

- **Problema:** O arquivo `src/routes/stream.js` possui:
  ```js
  const LOCAL_VIDEO_FILES = {
    27: path.join(process.env.LOCAL_VIDEO_DIR || '/app/videos', '37', 'aula-27.mp4'),
  }
  ```
  Todas as outras aulas locais caem em erro porque o código não consulta a coluna `video_path` da tabela `aulas`.
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

## ANÁLISE COMPARATIVA: NOVO PLAYER (REFERÊNCIA ADAPTA)

Acessamos e analisamos a referência visual da Adapta Alunos (`https://alunos.adapta.org/area/conteudo/aula/7869245`):

- **Layout:** Estrutura limpa com tema escuro/elegante.
- **Área Central:** Player em destaque (proporção 16:9) com controles de velocidade, tela cheia, qualidade e volume.
- **Sidebar Retrátil:** Módulos expansíveis (accordion), checklist de aulas concluídas, ícone do tipo de mídia (vídeo, documento, quiz), duração e indicação da aula ativa.
- **Abaixo do Player:** Título da aula, botão "Marcar como Concluída", navegação rápida "Aula Anterior" e "Próxima Aula", além de abas para "Descrição", "Materiais de Apoio (PDF)" e "Anotações/Dúvidas".
- **Adaptação para o Painel do Mentor:** O mentor precisa de um modo de **Pré-visualização do Aluno** dentro do painel para testar suas aulas locais, YouTube, OneDrive e Cloudinary exatamente como o aluno verá, com botão de troca de etapa e teste de streaming.

---

## FASE 1: PLANO DE IMPLEMENTAÇÃO E REESCRITA

O plano detalha a reescrita controlada dividida em 15 etapas sequenciais e rastreáveis:

1. **Estrutura do Painel e Rotas:**
   - Criação da interface React moderna no frontend do projeto (substituindo o monólito HTML legado por componentes shadcn/ui modulares em TypeScript).
   - Telas: Dashboard com Métricas, Gestão de Cursos, Editor de Matriz Curricular (Aulas/Etapas), Modal de Provas/Avaliações, e o Novo Player Interativo de Inspeção.
2. **Autenticação:**
   - Compatibilidade total com `token` via JWT, SSO do mentor e Bridge Proxy.
3. **Cursos:**
   - CRUD de cursos, moderação Groq AI e publicação controlada.
4. **Etapas:**
   - Gerenciamento de aulas (vídeos, slides, imagens), ordenação e materiais.
5. **Materiais de Apoio:**
   - Upload e vinculação de PDFs complementares.
6. **Upload de Vídeos VPS:**
   - Integração com `/mentor/cursos/upload-video-vps` respeitando o limite de 1GB e salvando no diretório do curso.
7. **Armazenamento e Limpeza:**
   - Garantia de integridade do diretório persistente `/srv/cursos/videos/`.
8. **Streaming Dinâmico (`src/routes/stream.js`):**
   - Substituição do dicionário estático pelo campo `video_path` do banco de dados, com liberação de pré-visualização para o mentor.
9. **Player Interativo (Inspirado na Referência Adapta):**
   - Player HTML5 com suporte a Range requests, iframe para YouTube/OneDrive e lista lateral de aulas.
10. **Progresso e Validação:**
    - Indicadores visuais de etapas cadastradas e completude da matriz curricular.
11. **Publicação Segura:**
    - Botão de publicação com confirmação e status visual (`rascunho`, `em_analise`, `aprovado`, `publicado`, `reprovado`).
12. **Testes Locais:**
    - Bateria de testes das 30 condições especificadas no briefing.
13. **Build:**
    - Execução do pipeline de compilação sem erros.
14. **Commit e Hash:**
    - Geração de commit semântico.
15. **Instruções de Deploy:**
    - Comandos claros para deploy manual na VPS via Git e EasyPanel.

---

## PRÓXIMOS PASSOS

Aguardando a autorização do mantenedor para prosseguir com a Fase 2 (implementação do código no repositório).
