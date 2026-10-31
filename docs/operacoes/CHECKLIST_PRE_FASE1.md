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
  - Manifesto Git e arquivo de somas de verificação
- [x] **2. Hashes SHA-256 Validados pelo Operador:** Arquivo `SHA256SUMS.txt` gerado e conferido com 100% de integridade dos arquivos gerados.
- [x] **3. Restauração em Modo `--dry-run` Validada pelo Operador:** Execução de `restaurar-cursos-vps.sh --dry-run` finalizada com sucesso, sem erros e sem qualquer alteração na produção.
- [x] **4. Inventário EasyPanel Gerado na VPS pelo Operador:** Arquivo `/root/INVENTARIO_EASYPANEL.md` gerado no host `srv845644` e incorporado ao workspace, detalhando os 4 serviços (Cursos-API, PostgreSQL 17, Redis 7, PocketBase) sem qualquer secret em texto puro.
- [x] **5. Confirmação dos Caminhos de Vídeo:** Mapeamento validado entre Host (`/srv/cursos/videos/`) e Container (`/app/videos/`).

---

## 2. ITENS PRONTOS E AUDITADOS NO WORKSPACE GOSKIP (DOCUMENTAÇÃO E PROTÓTIPO)

- [x] **1. Branch Oficial e Commit Base Identificados:** `correcao-fluxo-cursos` no repositório `github.com/ronydgarcia-max/cursos-api`, commit base `47aa7b1`.
- [x] **2. Isolamento dos Commits Internos do Workspace:** Os commits `34df2d6`, `ecf1cc0` e `505e672` pertencem exclusivamente ao workspace efêmero do GoSkip, não estão no repositório oficial, não afetam produção e jamais serão publicados na VPS.
- [x] **3. Sanitização Total de Credenciais e Secrets:** Todos os arquivos registram exclusivamente nomes de variáveis de ambiente. Qualquer menção a token antigo foi substituída por `[TOKEN_REMOVIDO_E_ROTACIONADO]`.
- [x] **4. Mapeamento Técnico de Riscos e Fluxo de Deploy:** Documentados `docs/RELATORIO_FASE_0_MENTOR.md`, `FLUXO_DEPLOY_GITHUB.md` (14 etapas) e `PLANO_ROLLBACK.md`.

---

## 3. AS 6 PENDÊNCIAS RESTANTES PRÉ-FASE 1 (BLOQUEADORAS DO INÍCIO DA FASE 1)

A transição da Fase 0 para a Fase 1 continua **BLOQUEADA** até a conclusão das seguintes 6 pendências:

- [ ] **1. Rotação do Token EasyPanel Exposto:** O operador deve rotacionar no painel do EasyPanel na VPS o token de deploy/API que apareceu em comunicações técnicas anteriores.
- [ ] **2. Análise de `src/routes/provas.js`:** Arquivo real a ser enviado pelo operador para que a lógica de avaliações seja analisada antes da reescrita (nada de provas foi inventado ou assumido).
- [ ] **3. Screenshots Desktop e Celular do Player de Referência:** Capturas de tela da área de membros do player de referência (Adapta) a serem enviadas pelo operador para guiar o visual definitivo.
- [ ] **4. Confirmação da Versão Real do Node.js (ou Runtime):** Esclarecer a falha `OCI runtime exec failed: exec: "node": executable file not found in $PATH` rodando no container ativo:
  ```bash
  docker exec <container> sh -c "which node || which bun || which deno; cat /etc/os-release"
  ```
- [ ] **5. Confirmação sobre Migrations do PostgreSQL:** Confirmar na VPS se os comandos DDL contidos em `migration.sql` (raiz do projeto) já foram rodados manualmente no PostgreSQL ou se requerem script idempotente.
- [ ] **6. Avaliação sobre Necessidade de Backup dos Dados do Redis:** Avaliar se as chaves em memória do Redis exigem export persistente ou se o serviço opera apenas com cache e rate-limit voláteis.

---

## 4. TERMO DE AUTORIZAÇÃO DA FASE 1 (A PREENCHER APÓS AS 6 PENDÊNCIAS)

```text
[ ] FASE 1 FORMALMENTE AUTORIZADA PELO RESPONSÁVEL DO PROJETO

Responsável: __________________________________________________
Data e Hora: __________________________________________________
Snapshot de Backup Validado: /root/backups/cursos/20261031_195147 (SHA-256 OK)
Token EasyPanel Rotacionado: [ ] SIM  [ ] NÃO
Runtime Confirmado: [ ] Node 18  [ ] Node 20  [ ] Bun  [ ] Outro: ________
Arquivo provas.js Recebido e Analisado: [ ] SIM  [ ] NÃO
Screenshots do Player Recebidos: [ ] SIM  [ ] NÃO
Alinhamento de Migrations Confirmado: [ ] SIM  [ ] NÃO
Decisão sobre Dados Redis: [ ] Volátil  [ ] Persistente
```
