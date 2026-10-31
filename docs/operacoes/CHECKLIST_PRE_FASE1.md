# CHECKLIST DE CONDIÇÕES DE AUTORIZAÇÃO PRÉ-FASE 1 (CURSOS-API)

**Documento:** `docs/operacoes/CHECKLIST_PRE_FASE1.md`  
**Escopo:** Critérios estritos de governança que regulam o início da Fase 1 (Reescrita e correções de código da API).  
**Regra Mandatória:** Nenhuma alteração de código ou publicação na VPS deve ocorrer antes da validação integral deste checklist.  
**Repositório Oficial:** `github.com/ronydgarcia-max/cursos-api` | **Branch Autorizada:** `correcao-fluxo-cursos` | **Commit Base Estável:** `47aa7b1`

---

## 1. ITENS JÁ CONFIRMADOS E AUDITADOS NO WORKSPACE (PRONTOS)

Estes itens foram verificados, documentados e validados no workspace de trabalho do GoSkip:

- [x] **1. Branch Oficial de Trabalho Definida:** A branch de trabalho é estritamente `correcao-fluxo-cursos` no repositório `github.com/ronydgarcia-max/cursos-api`. A branch `main` está protegida e NÃO será utilizada sem autorização expressa.
- [x] **2. Commit Base Estável Identificado:** Commit de referência estável confirmado na VPS e repositório: `47aa7b1`.
- [x] **3. Isolamento dos Commits do Workspace GoSkip:** Os commits `34df2d6` e `ecf1cc0` criados no workspace de prévia do GoSkip (documentação e protótipo) NÃO fazem parte do repositório real `cursos-api`, NÃO pertencem à branch `correcao-fluxo-cursos`, NÃO foram enviados ao GitHub, não alteram produção e NÃO serão publicados na VPS.
- [x] **4. Análise e Diagnóstico Técnico da Fase 0 Concluídos:** Mapeamento exaustivo de 24 arquivos, 16 rotas, fluxos de autenticação, streaming da aula 27 e falhas de autorização documentados no `docs/RELATORIO_FASE_0_MENTOR.md`.
- [x] **5. Scripts Operacionais e Planos Entregues:**
  - Script idempotente de backup com 13 itens e integridade: `docs/operacoes/backup-cursos-vps.sh`
  - Script de restauração guiada com `--dry-run`: `docs/operacoes/restaurar-cursos-vps.sh`
  - Plano de rollback em 8 etapas e 8 testes de homologação: `docs/operacoes/PLANO_ROLLBACK.md`
  - Template de inventário do EasyPanel e análise de dependências: `docs/operacoes/INVENTARIO_EASYPANEL.md`
  - Fluxo de deploy no GitHub e EasyPanel em 14 etapas: `docs/operacoes/FLUXO_DEPLOY_GITHUB.md`
  - Política de segurança e sanitização de secrets: `docs/operacoes/SEGURANCA_SECRETS.md`
- [x] **6. Ausência Total de Segredos no Código e Documentos:** Nenhum token, senha, chave privada ou credencial real inserida no código ou na documentação deste workspace. Tokens expostos em relatórios anteriores marcados como `[TOKEN_REMOVIDO_E_ROTACIONADO]` e classificados como `EXPOSTO - ROTACIONAR`.
- [x] **7. Plano de Correção do Streaming Documentado:** Especificação da leitura dinâmica de `aulas.video_path`, proteção contra path traversal em `/app/videos/`, fallback temporário para a aula 27 e liberação para o mentor do curso documentados sem alteração de código nesta rodada.
- [x] **8. Delimitação Clara de Arquivos da Fase 1:** Lista de arquivos intocados e protegidos (mentor.js, etapas.js, painel-mentor.html, stream.js, banco, migrations, etc.) rigorosamente respeitada.

---

## 2. ITENS PENDENTES DO OPERADOR DA VPS (BLOQUEADORES DA FASE 1)

A autorização para a Fase 1 só se torna efetiva após o operador executar na VPS e confirmar os seguintes pontos:

- [ ] **1. Execução do Backup na VPS:** Executar `backup-cursos-vps.sh` na VPS como root e confirmar a geração do diretório `/srv/backups/cursos/<timestamp>/` contendo o manifesto `backup-manifest.txt` com status `APROVADO PARA RESTAURAÇÃO`.
- [ ] **2. Teste de Restauração em Modo `--dry-run`:** Executar `./restaurar-cursos-vps.sh /srv/backups/cursos/<timestamp> --dry-run` e confirmar que a validação de checksums SHA-256 e o manifesto passaram com 100% de sucesso.
- [ ] **3. Inventário do EasyPanel Preenchido:** Preencher o arquivo `INVENTARIO_EASYPANEL.md` com os dados reais obtidos dos 4 serviços (`cursos-api`, `postgres`, `pocketbase`, `redis`) rodando na VPS.
- [ ] **4. ROTAÇÃO OBRIGATÓRIA DO TOKEN DO EASYPANEL:** O operador deve rotacionar no painel do EasyPanel o token de API / webhook de deploy que foi exposto em comunicações técnicas preliminares anteriores.
- [ ] **5. Confirmação da Versão Real do Node.js na VPS:** Executar `docker exec <container_api> node -v` para confirmar se o ambiente de produção roda Node 18 ou Node 20 (resolvendo o conflito entre Dockerfile e DOCUMENTACAO.md).
- [ ] **6. Verificação do Arquivo `migration.sql` da Raiz:** Confirmar se as instruções SQL do arquivo `migration.sql` na raiz do projeto na VPS já foram aplicadas manualmente no PostgreSQL ou se estão pendentes.
- [ ] **7. Confirmação dos Volumes Docker e Diretório de Vídeos:** Confirmar que o diretório `/srv/cursos/videos/` está ativo no host e com permissões corretas de gravação para o container `/app/videos/`.
- [ ] **8. Sanitização do `DOCUMENTACAO.md` na VPS:** Garantir que o repositório na VPS não contenha credenciais antigas em arquivos Markdown.
- [ ] **9. Confirmação de Isolamento da Branch:** Atestar que nenhum commit não autorizado foi mesclado na branch `correcao-fluxo-cursos` ou enviado para a branch `main`.

---

## 3. ITENS AGUARDANDO ENVIO DE ARQUIVOS PELO OPERADOR (SEPARADOS)

Estes arquivos **NÃO estão disponíveis nesta rodada** e SERÃO ENVIADOS SEPARADAMENTE pelo operador:

- [ ] **1. Envio do Arquivo `src/routes/provas.js` Real:** O operador enviará o arquivo real de rotas e lógica de provas/avaliações. **Status atual:** Pendente de recebimento; não inventado nem assumido na Fase 0.
- [ ] **2. Envio de Screenshots Reais do Player de Referência:** O operador enviará capturas de tela da área restrita do player de referência (`alunos.adapta.org`). **Status atual:** Pendente de recebimento; a análise atual foi declarada expressamente como baseada em descrição funcional e mock conceitual, não na inspeção direta da página que exige login.

---

## 4. DECLARAÇÃO DE LIBERAÇÃO DA FASE 1

```text
[ ] LIBERAÇÃO DA FASE 1 AUTORIZADA PELO RESPONSÁVEL

Responsável: _________________________________________
Data / Hora: _________________________________________
Ponto de Restauração Ativo: /srv/backups/cursos/____________________
Hash do Backup Verificado: _________________________________________
Confirmação de Rotação do Token EasyPanel: [ ] SIM [ ] NÃO
Confirmação da Versão do Node.js na VPS: [ ] Node 18  [ ] Node 20
Confirmação do migration.sql da Raiz: [ ] Já Aplicado [ ] Não Aplicado
```
