# CHECKLIST DE CONDIÇÕES DE AUTORIZAÇÃO PRÉ-FASE 1 (CURSOS-API)

**Documento:** `docs/operacoes/CHECKLIST_PRE_FASE1.md`  
**Escopo:** Critérios estritos de governança que regulam o início da Fase 1 (Reescrita e correções de código da API).  
**Regra Mandatória:** Nenhuma alteração de código ou publicação na VPS deve ocorrer antes da validação integral deste checklist.  
**Repositório Oficial:** `github.com/ronydgarcia-max/cursos-api` | **Branch Autorizada:** `correcao-fluxo-cursos` | **Commit Base Estável:** `47aa7b1`  
**Aviso GoSkip:** Este GoSkip workspace é estritamente painel de documentação/prévia; nada de produção é alterado aqui.

---

## 1. ITENS CONFIRMADOS E AUDITADOS PELO OPERADOR NA VPS (CONCLUÍDOS)

Estes itens foram executados e atestados formalmente pelo **OPERADOR DA VPS**:

- [x] **1. Backup Completo Executado pelo Operador:** Concluído em `/root/backups/cursos/20261031_195147` em `2026-10-31 19:51:47 -03`, contendo:
  - `cursos-api.bundle` (bundle Git completo)
  - `cursos-api-source.tar.gz` (código versionado)
  - `cursos-videos.tar.gz` (vídeos de `/srv/cursos/videos/`)
  - `postgres.sql` (export estrutural e de dados do PostgreSQL 17)
  - Volumes do PocketBase
  - Configurações estruturais do PostgreSQL e Redis
  - `redis-dump.rdb` (Snapshot RDB do Redis validado com `redis-check-rdb`: arquivo íntegro, checksum interno OK, ZERO chaves no momento do backup, ZERO expirações)
  - Manifesto Git e arquivo de somas de verificação
- [x] **2. Hashes SHA-256 Validados pelo Operador:** Arquivo `SHA256SUMS.txt` gerado e conferido com 100% de integridade dos arquivos gerados.
- [x] **3. Restauração em Modo `--dry-run` Validada pelo Operador:** Execução de `restaurar-cursos-vps.sh --dry-run` finalizada com sucesso, sem erros e sem qualquer alteração na produção.
- [x] **4. Inventário EasyPanel Gerado na VPS pelo Operador:** Arquivo `/root/INVENTARIO_EASYPANEL.md` gerado no host `srv845644` e incorporado ao workspace, detalhando os 4 serviços (Cursos-API, PostgreSQL 17, Redis 7, PocketBase) sem qualquer secret em texto puro.
- [x] **5. Confirmação dos Caminhos de Vídeo:** Mapeamento validado entre Host (`/srv/cursos/videos/`) e Container (`/app/videos/`).
- [x] **6. Backup dos Dados do Redis Confirmado (RESOLVIDO):** Snapshot RDB gerado e validado pelo operador via `redis-check-rdb` em `/root/backups/cursos/20261031_195147/redis-dump.rdb`: arquivo válido, checksum OK, zero chaves, zero expirações. Pendência de backup do Redis **RESOLVIDA**.
- [x] **7. Runtime Node Confirmado pelo Operador (Node v20.20.2):** Container real em execução `cursos-api_cursos-api.1.jsmxpl7rmip278eajgb5f5ms4`. Referências a Node 18 em Dockerfile e documentação estão desatualizadas (correção do Dockerfile agendada para Fase 1, sem alteração agora).
- [x] **8. PostgreSQL e Migrations Confirmadas Aplicadas pelo Operador:** Container `cursos-api_postgres.1.mpp4zqgnifgzjkh2y0hz9f4hm`. A tabela `cursos` já possui todas as colunas (`video_url`, `video_type`, `video_public_id`, `thumbnail_url`, `confirmed_author`, `ia_score`, `matriz_curricular`, `subcategoria`). Migration já aplicada: **NÃO executar `migration.sql` novamente**. Duplicidade de `matriz_curricular` será corrigida apenas no arquivo da migration na Fase 1, sem tocar banco.
- [x] **9. Arquivo `src/routes/provas.js` Recebido e Analisado:** Código completo examinado e documentado. Mapeadas rotas GET/POST/PUT/DELETE, proteção `apenasMentor`, transação atômica BEGIN/COMMIT/ROLLBACK, validações de negócio, riscos de segurança e funcionalidades a preservar.

---

## 2. ITENS PRONTOS E AUDITADOS NO WORKSPACE GOSKIP (DOCUMENTAÇÃO E PROTÓTIPO)

- [x] **1. Branch Oficial e Commit Base Identificados:** `correcao-fluxo-cursos` no repositório `github.com/ronydgarcia-max/cursos-api`, commit base `47aa7b1`.
- [x] **2. Isolamento dos Commits Internos do Workspace:** Os commits criados no GoSkip pertencem exclusivamente ao workspace efêmero de documentação e prévia, não estão no repositório oficial, não afetam produção e jamais serão publicados na VPS.
- [x] **3. Sanitização Total de Credenciais e Secrets:** Todos os arquivos registram exclusivamente nomes de variáveis de ambiente. Qualquer menção a token antigo foi substituída por `[TOKEN_REMOVIDO_E_ROTACIONADO]` com status `EXPOSTO - ROTACIONAR`.
- [x] **4. Mapeamento Técnico de Riscos e Fluxo de Deploy:** Documentados `docs/RELATORIO_FASE_0_MENTOR.md`, `FLUXO_DEPLOY_GITHUB.md` (14 etapas) e `PLANO_ROLLBACK.md`.

---

## 3. AS EXATAMENTE 2 PENDÊNCIAS RESTANTES PRÉ-FASE 1 (BLOQUEADORAS DO INÍCIO DA FASE 1)

Com a resolução e confirmação pelo operador do **Runtime Node v20.20.2**, do **PostgreSQL com Migrations aplicadas** e o recebimento/análise técnica de **`src/routes/provas.js`**, a transição para a Fase 1 depende agora de **EXATAMENTE 2 PENDÊNCIAS MANDATÓRIAS**:

- [ ] **1. Rotação do Token EasyPanel Exposto:** O operador deve rotacionar no painel do EasyPanel na VPS o token de deploy/API que apareceu em relatórios anteriores deste projeto (marcador: `[TOKEN_REMOVIDO_E_ROTACIONADO]`, status: `EXPOSTO - ROTACIONAR`).
- [ ] **2. Screenshots Desktop e Celular do Player de Referência:** Capturas de tela da área de membros do player de referência (Adapta) a serem enviadas pelo operador para guiar o visual definitivo e responsivo.

---

## 4. TERMO DE AUTORIZAÇÃO DA FASE 1 (A PREENCHER APÓS AS 2 PENDÊNCIAS)

```text
[ ] FASE 1 FORMALMENTE AUTORIZADA PELO RESPONSÁVEL DO PROJETO

Responsável: __________________________________________________
Data e Hora: __________________________________________________
Snapshot de Backup Validado: /root/backups/cursos/20261031_195147 (SHA-256 OK, Redis RDB OK)
Token EasyPanel Rotacionado: [ ] SIM  [ ] NÃO
Screenshots do Player Recebidos: [ ] SIM  [ ] NÃO

--- VALIDAÇÕES PRÉVIAS JÁ CONCLUÍDAS PELO OPERADOR E AUDITORIA ---
Runtime Node.js: [x] CONFIRMADO Node v20.20.2 (container cursos-api_cursos-api.1.jsmxpl7rmip278eajgb5f5ms4)
PostgreSQL & Migrations: [x] CONFIRMADO tabela cursos completa, migration aplicada; não reexecutar migration.sql
Arquivo provas.js: [x] RECEBIDO E ANALISADO (rotas GET/POST/PUT/DELETE, apenasMentor, transação BEGIN/COMMIT)
Backup Redis RDB: [x] CONFIRMADO (redis-dump.rdb, zero chaves, zero expirações)
```
