# FLUXO DE DEPLOY VIA GITHUB & EASYPANEL (CURSOS-API)

**Documento:** `docs/operacoes/FLUXO_DEPLOY_GITHUB.md`  
**Repositório Oficial:** `github.com/ronydgarcia-max/cursos-api`  
**Branch de Trabalho Autorizada:** `correcao-fluxo-cursos`  
**Commit de Referência Estável:** `47aa7b1`  
**Serviço no EasyPanel:** `Cursos-API`  
**Ambiente:** VPS de Produção do Projeto

---

## AVISOS MANDATÓRIOS DE SEGURANÇA E GOVERNANÇA

> ⚠️ **AVISO 1 — PROTEÇÃO DA BRANCH MAIN:**  
> A branch `main` do repositório `github.com/ronydgarcia-max/cursos-api` **NÃO SERÁ USADA SEM AUTORIZAÇÃO EXPRESSA** do operador. Todo o desenvolvimento e entrega da Fase 1 ocorrem unicamente na branch `correcao-fluxo-cursos`.

> ⚠️ **AVISO 2 — ISOLAMENTO DOS COMMITS DO WORKSPACE:**  
> Commits criados no workspace do GoSkip (tais como `34df2d6`, `ecf1cc0` e similares de relatório/prototipagem) **NÃO SÃO PUBLICADOS AUTOMATICAMENTE** e não fazem parte do repositório de produção. Ficam restritos à visualização e documentação interna da prévia.

> ⚠️ **AVISO 3 — LIMITAÇÃO DE ACESSO DO GOSKIP À VPS:**  
> O GoSkip **NÃO TEM ACESSO DIRETO À VPS**. Deploy, homologação, conferência de logs e testes em produção são procedimentos **100% MANUAIS EXECUTADOS PELO OPERADOR HUMANO**. O GoSkip apenas entrega o código revisado e os manuais técnicos.

---

## AS 14 ETAPAS EXATAS DO FLUXO DE DEPLOY

O ciclo seguro de entrega segue estritamente as 14 etapas sequenciais abaixo:

### Etapa 1: Alteração Local pelo GoSkip

- O GoSkip realiza as alterações cirúrgicas acordadas no código do workspace (somente após autorização expressa da Fase 1).
- Respeito estrito aos contratos de API e regras de autorização de mentores.

### Etapa 2: Testes Locais

- Execução estática e dinâmica de testes locais no workspace:
  - Validação de tipagem e integridade estrutural;
  - Teste de regressão lógica dos contratos de rota;
  - Verificação de ausência de segredos e credenciais em texto puro.

### Etapa 3: Build

- Compilação do projeto para garantir ausência de erros de sintaxe ou empacotamento:
  ```bash
  npm run build
  ```
- O build deve concluir com status de sucesso antes de qualquer commit.

### Etapa 4: Commit

- Criação de commit semântico, atômico e rastreável:
  ```bash
  git add <arquivos_especificos>
  git commit -m "feat(mentor): <descricao_da_entrega_autorizada>"
  ```
- Registro formal do hash do commit gerado.

### Etapa 5: Push para `correcao-fluxo-cursos`

- Envio exclusivo para a branch de trabalho homologada:
  ```bash
  git push origin correcao-fluxo-cursos
  ```
- **Proibido** realizar push para a branch `main`.

### Etapa 6: EasyPanel Reconstrói o Serviço Cursos-API

- O operador acessa o dashboard do EasyPanel na VPS (`https://<EASYPANEL_HOST>`):
- Navega até o projeto `cursos-api` e localiza o serviço `Cursos-API`.
- Dispara o gatilho de reconstrução (**Rebuild / Redeploy**) a partir da branch `correcao-fluxo-cursos`.

### Etapa 7: Logs do Deploy

- O operador acompanha os logs de build e inicialização em tempo real no EasyPanel:
- Verificar se o container subiu limpo sem exceções do Node.js:
  - Carregamento bem-sucedido das variáveis de ambiente;
  - Conexão estabelecida com o pool do PostgreSQL (`src/database/db.js`);
  - Conexão estabelecida com o Redis (`src/database/redis.js`);
  - Express escutando na porta configurada (ex: `3333`).

### Etapa 8: Health Check

- O operador executa verificação de disponibilidade via terminal ou navegador:
  ```bash
  curl -I http://localhost:3333/
  # ou endpoint de saúde se configurado
  ```
- O serviço deve responder sem erro 502/503.

### Etapa 9: Teste da API

- Validação das rotas centrais de autenticação e integridade:
  - Requisição sem token em `/mentor/dashboard` deve retornar HTTP `401 Unauthorized` ou `403 Forbidden` (comprovando que os middlewares de proteção estão ativos).

### Etapa 10: Teste do Mentor

- Login com credenciais ou token de mentor válido:
  ```bash
  curl -s -H "Authorization: Bearer <TOKEN_MENTOR>" http://localhost:3333/mentor/cursos
  ```
- Conferir se retorna HTTP `200 OK` e o JSON com a lista de cursos do mentor.

### Etapa 11: Teste do Aluno

- Validação do fluxo do frontend do aluno:
  - Listagem de cursos disponíveis;
  - Acesso às aulas matriculadas sem quebra de contrato.

### Etapa 12: Teste do Upload

- Teste de envio de thumbnail ou vídeo MP4 de teste para a VPS:
  - Requisição multipart em `/mentor/cursos/upload-video-vps`;
  - Conferência de que o arquivo foi gravado no volume `/app/videos/{curso_id}/` e que o caminho retornado é seguro.

### Etapa 13: Teste do Streaming

- Requisição com suporte a Range bytes na rota de stream:
  ```bash
  curl -I -H "Range: bytes=0-1024" -H "Authorization: Bearer <TOKEN_VALIDO>" http://localhost:3333/stream/<aula_id>
  ```
- Conferir retorno HTTP `206 Partial Content`, cabeçalho `Content-Range: bytes 0-1024/...` e streaming contínuo.

### Etapa 14: Confirmação ou Rollback

- **Se todos os testes (8 a 13) passarem:** O operador declara a homologação concluída para a entrega.
- **Se qualquer teste falhar:** O operador aciona imediatamente o **Plano de Rollback** (`docs/operacoes/PLANO_ROLLBACK.md`):
  - Retornar o serviço Cursos-API no EasyPanel para o commit estável `47aa7b1`;
  - Executar restauração via `./restaurar-cursos-vps.sh /srv/backups/cursos/<timestamp>` se houve alteração de banco.
