# CHECKLIST DE CONDIÇÕES DE AUTORIZAÇÃO PRÉ-FASE 1 (CURSOS-API)

**Documento:** `docs/operacoes/CHECKLIST_PRE_FASE1.md`  
**Escopo:** Critérios estritos de governança que regulam o início da Fase 1 (Reescrita e correções de código da API).  
**Regra Mandatória:** Nenhuma alteração de código ou publicação na VPS deve ocorrer antes da validação integral deste checklist.

---

## 1. ITENS JÁ CONFIRMADOS E AUDITADOS (PRÉ-REQUISITOS ATENDIDOS)

Estes itens foram verificados e auditados no workspace:

- [x] **1. Branch Oficial de Trabalho Definida:** A branch de trabalho é estritamente `correcao-fluxo-cursos` no repositório `github.com/ronydgarcia-max/cursos-api`. A branch `main` está protegida e não será utilizada sem aprovação expressa.
- [x] **2. Commit Base Estável Identificado:** Commit estável confirmado na VPS e repositório: `47aa7b1`.
- [x] **3. Isolamento da Prévia GoSkip:** O commit `34df2d6` criado no workspace de prévia do GoSkip (documentação e protótipo) NÃO faz parte do repositório real `cursos-api`, NÃO foi enviado ao GitHub e NÃO está na branch `correcao-fluxo-cursos`.
- [x] **4. Análise e Diagnóstico Técnico da Fase 0 Concluídos:** Mapeamento exaustivo de 24 arquivos, 16 rotas, fluxos de autenticação, streaming da aula 27 e falhas de autorização documentados no `docs/RELATORIO_FASE_0_MENTOR.md`.
- [x] **5. Scripts Operacionais e Planos Entregues:**
  - Script idempotente de backup com 13 itens e integridade: `docs/operacoes/backup-cursos-vps.sh`
  - Script de restauração guiada com `--dry-run`: `docs/operacoes/restaurar-cursos-vps.sh`
  - Plano de rollback em 8 etapas e 8 testes de homologação: `docs/operacoes/PLANO_ROLLBACK.md`
  - Template de inventário do EasyPanel e análise de dependências: `docs/operacoes/INVENTARIO_EASYPANEL.md`
- [x] **6. Ausência Total de Segredos no Código:** Nenhum token, senha, chave privada ou credencial real inserida no código ou na documentação deste workspace.

---

## 2. ITENS PENDENTES QUE O OPERADOR DA VPS PRECISA DEVOLVER

A autorização para a Fase 1 só se torna efetiva após o operador executar na VPS e confirmar os seguintes pontos:

- [ ] **1. Execução do Backup na VPS:** Executar `backup-cursos-vps.sh` na VPS como root e confirmar a geração do diretório `/srv/backups/cursos/<timestamp>/` contendo o manifesto `backup-manifest.txt` com status `APROVADO PARA RESTAURAÇÃO`.
- [ ] **2. Teste de Restauração em Modo `--dry-run`:** Executar `./restaurar-cursos-vps.sh /srv/backups/cursos/<timestamp> --dry-run` e confirmar que a validação de checksums SHA-256 e o manifesto passaram com 100% de sucesso.
- [ ] **3. Inventário do EasyPanel Preenchido:** Preencher o arquivo `INVENTARIO_EASYPANEL.md` com os dados reais obtidos dos 4 serviços (`cursos-api`, `postgres`, `pocketbase`, `redis`) rodando na VPS.
- [ ] **4. Envio do Arquivo `provas.js` Real:** Enviar o conteúdo real do arquivo de rotas/regras de provas (`src/routes/provas.js` ou equivalente) para validação do fluxo de avaliações do mentor.
- [ ] **5. Screenshots da Referência Visual do Player:** Enviar capturas de tela da navegação e visualização da referência `alunos.adapta.org` ou validar os requisitos do mock adaptado.
- [ ] **6. Confirmação da Versão Real do Node.js na VPS:** Confirmar a versão do Node.js utilizada no container `cursos-api` (ex: Node 18 LTS ou Node 20 LTS via `node -v` dentro do container).
- [ ] **7. Verificação do Arquivo `migration.sql` da Raiz:** Confirmar se o arquivo `migration.sql` localizado na raiz do projeto na VPS é o schema consolidado em produção ou se há migrations pendentes não aplicadas.
- [ ] **8. Confirmação dos Volumes Docker e Diretório de Vídeos:** Confirmar que o diretório `/srv/cursos/videos/` está ativo no host e com permissões corretas de gravação para o container `/app/videos/`.
- [ ] **9. ROTAÇÃO OBRIGATÓRIA DO TOKEN DO EASYPANEL:** O operador deve rotacionar no painel do EasyPanel o token de API / credenciais que possam ter sido expostos em comunicações ou relatórios técnicos preliminares anteriores.
- [ ] **10. Sanitização do `DOCUMENTACAO.md` na VPS:** O arquivo `DOCUMENTACAO.md` presente no repositório na VPS será sanitizado no primeiro commit da Fase 1 para remover qualquer resquício de credencial legada.
- [ ] **11. Confirmação de que Nenhum Commit Não Autorizado foi Publicado:** O operador deve atestar que nenhum commit intermediário ou não homologado foi publicado na VPS ou mesclado na branch `correcao-fluxo-cursos`.

---

## 3. DECLARAÇÃO DE LIBERAÇÃO DA FASE 1

```
[ ] LIBERAÇÃO DA FASE 1 AUTORIZADA PELO RESPONSÁVEL

Responsável: _________________________________________
Data / Hora: _________________________________________
Ponto de Restauração Ativo: /srv/backups/cursos/____________________
Hash do Backup Verificado: _________________________________________
```
