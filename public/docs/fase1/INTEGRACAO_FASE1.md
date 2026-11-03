# GUIA DE INTEGRAÇÃO DA FASE 1 NA VPS — CURSOS-API (VERSÃO FINAL)

**Documento:** `docs/fase1/INTEGRACAO_FASE1.md`  
**Repositório Oficial:** `github.com/ronydgarcia-max/cursos-api`  
**Branch de Trabalho Autorizada:** `correcao-fluxo-cursos`  
**Commit Base Estável:** `47aa7b1`  
**Serviço no EasyPanel:** `Cursos-API`  
**Ponto de Restauração / Backup Confirmado:** `/root/backups/cursos/20261031_195147`  
**Regra Mandatória de Segurança:** ZERO senhas, tokens, chaves ou credenciais em texto puro. Marcador oficial: `[TOKEN_REMOVIDO_E_ROTACIONADO]`.

---

## 1. AVISO VINCULANTE: HOMOLOGAÇÃO CONJUNTA E REVISÃO PRÉVIA DE CÓDIGO

> ⚠️ **AVISO OBRIGATÓRIO DO OPERADOR:**
>
> 1. **Homologação Conjunta Obrigatória:** O novo painel estático (`src/static/painel-mentor.html`) e o módulo de streaming (`src/routes/stream.js`) **DEVEM SER HOMOLOGADOS E APLICADOS JUNTOS**. Aplicar apenas o painel sem o stream fará com que os vídeos locais do novo player falhem com erro 403 para o mentor.
> 2. **Revisão de Código Precedente:** A aplicação na VPS só pode ocorrer **DEPOIS que o operador revisar integralmente os arquivos de código entregues**, seus respectivos hashes SHA-256 e o relatório de auditoria `docs/fase1/REVISAO_FASE1.md`.
> 3. **Ambiente GoSkip Isolado:** O GoSkip não possui acesso SSH à VPS nem credenciais de push no GitHub. Toda a aplicação é 100% manual e de inteira responsabilidade do operador humano.
> 4. **Branch `main` Protegida:** NUNCA faça commit ou push na branch `main`. Utilize exclusivamente a branch `correcao-fluxo-cursos` baseada no commit `47aa7b1`.

---

## 2. BACKUP UTILIZADO E PONTO DE RESTAURAÇÃO

- **Caminho Físico no Host da VPS:** `/root/backups/cursos/20261031_195147`
- **Validação Prévia Realizada:** Dry-run concluído com 100% de sucesso, somas SHA-256 atestadas via `SHA256SUMS.txt`, dump do banco `postgres.sql` íntegro e snapshot `redis-dump.rdb` validado com utilitário oficial `redis-check-rdb`.
- **Independência de Containers:** O ponto de restauração não depende de volumes efêmeros nem de arquivos dentro de containers Docker.

---

## 3. ARQUIVOS QUE SERÃO SUBSTITUÍDOS

| Arquivo no Workspace                        | Destino no Repositório Real (`/root/cursos-api`) | Papel Técnico                                                                                     |
| :------------------------------------------ | :----------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| `docs/fase1/stream.js`                      | `src/routes/stream.js`                           | Substituto com consulta dinâmica, trava de path traversal, auth aluno/mentor/admin e Range 206    |
| `docs/fase1/NOVO_PAINEL/painel-mentor.html` | `src/static/painel-mentor.html`                  | Novo painel estático em arquivo único, UX baseada no mock conceitual, responsivo e sem build step |
| `docs/fase1/PROPOSTA_PROVAS.md`             | `docs/fase1/PROPOSTA_PROVAS.md`                  | Documentação técnica dos 4 achados de `provas.js` (**DOCUMENTAÇÃO PURA — código inalterado**)     |
| `docs/fase1/INTEGRACAO_FASE1.md`            | `docs/fase1/INTEGRACAO_FASE1.md`                 | Este guia operacional final de integração e homologação                                           |
| `docs/fase1/REVISAO_FASE1.md`               | `docs/fase1/REVISAO_FASE1.md`                    | Relatório ponto a ponto dos 17 itens exigidos pelo operador                                       |
| `docs/fase1/VERIFICACAO_ARTEFATOS.md`       | `docs/fase1/VERIFICACAO_ARTEFATOS.md`            | Manifesto SHA-256, testes locais, comandos exatos, varredura de segredos e diff                   |

---

## 4. COMANDOS DE CÓPIA E APLICAÇÃO NA VPS

### Passo 1: Acessar a VPS e navegar até o repositório

```bash
ssh root@<IP_DA_VPS>
cd /root/cursos-api
```

### Passo 2: Garantir que está na branch autorizada sobre a base `47aa7b1`

```bash
git status
git checkout correcao-fluxo-cursos
git log -1 --oneline
# Deve confirmar que a base direta é o commit 47aa7b1
```

### Passo 3: Criar diretório temporário para inspeção e cópia segura dos candidatos

> ⚠️ **REGRA MANDATÓRIA DE SEGURANÇA:** Os arquivos originais em produção **NÃO PODEM SER SUBSTITUÍDOS DIRETAMENTE**. Os artefatos candidatos devem ser copiados primeiro para um diretório temporário isolado (`/tmp/fase1_candidatos/`). O diff definitivo contra o commit base `47aa7b1` deve ser gerado e auditado visualmente pelo operador antes de qualquer substituição.

```bash
# OPÇÃO A (RECOMENDADA): Instalador automático de linha única (via prévia GoSkip):
curl -fsSL https://painel-do-mentor-de-cursos-ebb88--preview.goskip.app/docs/operacoes/instalar-fase1.sh | bash

# OPÇÃO B: Instalador automático via GitHub raw (repositório oficial isolado):
ORIGEM_FASE1="https://raw.githubusercontent.com/ronydgarcia-max/painel-do-mentor-de-cursos-tepya05vn/main" \
  curl -fsSL https://raw.githubusercontent.com/ronydgarcia-max/painel-do-mentor-de-cursos-tepya05vn/main/docs/operacoes/instalar-fase1.sh | bash

# (O instalador baixa os 8 artefatos para /tmp/fase1_candidatos/, calcula SHA-256
# na VPS, exige confirmação visual ou EFASE1_SHA256, roda node --check no stream.js
# e copia apenas testar-fase1-vps.sh e aplicar-fase1-vps.sh para docs/operacoes/).

# OPÇÃO C (Manual / scp clássico):
mkdir -p /tmp/fase1_candidatos/src/routes
mkdir -p /tmp/fase1_candidatos/src/static
mkdir -p /tmp/fase1_candidatos/docs/fase1
# /tmp/fase1_candidatos/src/routes/stream.js            <- docs/fase1/stream.js
# /tmp/fase1_candidatos/src/static/painel-mentor.html   <- docs/fase1/NOVO_PAINEL/painel-mentor.html
```

### Passo 4: Auditoria do Diff Definitivo na VPS contra o Commit Base `47aa7b1`

Com os arquivos candidatos posicionados em `/tmp/fase1_candidatos/`, o operador executa o diff comparando a base real `47aa7b1` com os candidatos temporários **SEM TOCAR nos arquivos de produção atuais**:

```bash
cd /root/cursos-api

# Comparar a versão estável 47aa7b1 de stream.js com o candidato temporário:
git show 47aa7b1:src/routes/stream.js | diff -u - /tmp/fase1_candidatos/src/routes/stream.js

# Comparar a versão estável 47aa7b1 de painel-mentor.html com o candidato temporário:
git show 47aa7b1:src/static/painel-mentor.html | diff -u - /tmp/fase1_candidatos/src/static/painel-mentor.html

# Ou comparar diretamente contra a árvore de trabalho da branch correcao-fluxo-cursos:
diff -u src/routes/stream.js /tmp/fase1_candidatos/src/routes/stream.js
diff -u src/static/painel-mentor.html /tmp/fase1_candidatos/src/static/painel-mentor.html
```

### Passo 5: Criar backup local e aplicar a substituição apenas após revisão aprovada

Somente após o operador aprovar visualmente o diff das saídas acima:

```bash
# Backup preventivo dos arquivos atuais
cp src/routes/stream.js src/routes/stream.js.bak.fase1
cp src/static/painel-mentor.html src/static/painel-mentor.html.bak.fase1

# Substituição definitiva dos arquivos a partir do diretório temporário
cp /tmp/fase1_candidatos/src/routes/stream.js src/routes/stream.js
cp /tmp/fase1_candidatos/src/static/painel-mentor.html src/static/painel-mentor.html

# Copiar os relatórios de auditoria para rastreabilidade
mkdir -p docs/fase1
cp -r /tmp/fase1_candidatos/docs/fase1/* docs/fase1/ 2>/dev/null || true
```

---

## 6. VALIDAÇÃO SINTÁTICA LOCAL NA VPS

Antes de commitar ou acionar rebuild, valide a sintaxe do arquivo JavaScript substituído (pode ser executado tanto no candidato em `/tmp/fase1_candidatos/src/routes/stream.js` quanto no destino final):

```bash
# Validação sintática do arquivo Node.js com node --check
node --check src/routes/stream.js
# ou de forma abreviada:
node -c src/routes/stream.js
# Saída esperada: Silenciosa (Exit code 0). Qualquer erro de sintaxe interrompe o processo aqui.

# Validação do checksum SHA-256 para conferir integridade da transferência
sha256sum src/routes/stream.js src/static/painel-mentor.html
```

---

## 7. COMMIT, PUSH E REBUILD DO CURSOS-API NO EASYPANEL

### Passo 1: Commit e Push na branch de trabalho

```bash
git add src/routes/stream.js src/static/painel-mentor.html
git commit -m "feat(mentor): implementa novo painel estatico e streaming dinamico seguro (Fase 1)"
git push origin correcao-fluxo-cursos
# NUNCA ENVIAR PARA A BRANCH MAIN
```

### Passo 2: Rebuild do serviço Cursos-API no EasyPanel

1. Acessar o painel do EasyPanel (`https://<EASYPANEL_HOST>:3000`).
2. Abrir o projeto `cursos-api`.
3. Selecionar o serviço de aplicação `Cursos-API`.
4. Disparar o comando **Rebuild / Redeploy** utilizando a branch `correcao-fluxo-cursos`.
5. Aguardar o build da imagem Docker e o reinício das réplicas.

---

## 8. HEALTH CHECK E TESTES FUNCIONAIS

### 8.1. Health Check Imediato

```bash
# Verificar logs do container ativo
docker logs -f --tail 50 $(docker ps --format '{{.Names}}' | grep -i 'cursos-api' | head -n 1)

# Health check local via loopback
curl -I http://127.0.0.1:3333/
# Deve retornar HTTP 200/302 sem erros 502/503
```

### 8.2. Bateria de Testes Funcionais Obrigatórios

1. **Teste 1: Consumo e Limpeza de Token em Query String (`painel-mentor.html`)**
   - **Ação:** Acessar no navegador `https://<DOMINIO>/painel?token=<JWT_MENTOR>`.
   - **Critério:** O badge superior deve indicar "Mentor Ativo", a lista de cursos reais do mentor deve carregar no select, e a barra de endereços do navegador deve ter a query string sanitizada imediatamente sem exibir o token (`window.history.replaceState`).
2. **Teste 2: Isolamento de Mentor**
   - **Ação:** Requisitar `/mentor/cursos/<ID_CURSO_DE_OUTRO_MENTOR>/etapas` com o token do mentor.
   - **Critério:** Retorno `403 Forbidden` ou `404 Not Found`. Nenhum dado de outro mentor é acessível.
3. **Teste 3: Upload de Vídeo MP4 para a VPS**
   - **Ação:** Na aba "Gestão de Aulas & Upload VPS", enviar um MP4 de teste.
   - **Critério:** Arquivo gravado em `/srv/cursos/videos/{curso_id}/` e retorno 200 com JSON contendo `video_path`.
4. **Teste 4: Streaming com HTTP Range e Resposta 206**
   - **Ação:** Executar curl simulando solicitação de Range:
     ```bash
     curl -I -H "Range: bytes=0-1048576" -H "Authorization: Bearer <TOKEN_MENTOR>" http://127.0.0.1:3333/stream/<AULA_ID>
     ```
   - **Critério:** Retorno HTTP `206 Partial Content`, cabeçalho `Content-Range: bytes 0-1048576/<TOTAL>` e `Content-Type: video/mp4`.
5. **Teste 5: Autorização do Mentor Proprietário (Sem Erro 403)**
   - **Ação:** O mentor reproduz sua aula no novo player sem estar matriculado nela como aluno.
   - **Critério:** Vídeo reproduz imediatamente. Query com `UNION SELECT ... cursos.mentor_id = $1` libera o acesso.
6. **Teste 6: Fallback Estrito Exclusivo da Aula 27**
   - **Ação:** Requisitar `/stream/27` (aula legada) e requisitar `/stream/<OUTRA_AULA_SEM_VIDEO>`.
   - **Critério:** A aula 27 reproduz o fallback legado `/app/videos/37/aula-27.mp4`. Qualquer outra aula sem vídeo retorna `HTTP 400` com mensagem clara e NÃO reproduz o vídeo de outra aula.
7. **Teste 7: Proteção Contra Path Traversal**
   - **Ação:** Teste de requisição para caminho com `../../etc/passwd`.
   - **Critério:** Rejeição imediata com HTTP `400` ou `403` e log de segurança emitido: `[STREAM SECURITY VIOLATION]`.
8. **Teste 8: Compatibilidade dos 4 Formatos de Vídeo no Player**
   - **Ação:** Alternar entre aulas com tipo `local`, `youtube`, `onedrive` e `cloudinary`.
   - **Critério:** Badges visuais mudam corretamente e o player carrega `<video>` nativo ou `<iframe>` do YouTube sem quebrar o layout.

---

## 9. PLANO DE ROLLBACK RÁPIDO

Se qualquer anomalia for detectada durante os testes funcionais:

### Opção A: Reversão Rápida de Código via Git (Até 2 minutos)

```bash
cd /root/cursos-api
git checkout 47aa7b1
git clean -fd
```

No EasyPanel, acionar novo **Rebuild** do serviço `Cursos-API`. O sistema retornará imediatamente ao estado exato do commit base estável `47aa7b1`.

### Opção B: Restauração Completa de Snapshot (Em caso de falha grave)

Caso tenha havido qualquer perda de arquivos ou inconsistência:

```bash
cd /root
./docs/operacoes/restaurar-cursos-vps.sh /root/backups/cursos/20261031_195147
```

---

## 10. EXECUÇÃO AUTOMATIZADA VIA SCRIPT OPERACIONAL NA VPS (`aplicar-fase1-vps.sh`)

Para atender à necessidade do operador de automatizar com máxima segurança todo o passo a passo de aplicação, foi disponibilizado o script interativo `docs/operacoes/aplicar-fase1-vps.sh`.

### 10.1. Princípio de Segurança e Auditoria Visual

> ⚠️ **REGRA INEGOCIÁVEL:**  
> O GoSkip **NÃO possui acesso à VPS**. O script é fornecido como artefato para ser copiado e executado pelo operador **DENTRO DA VPS**.  
> Além disso, o script **NUNCA executa ações destrutivas ou irreversíveis sem confirmação explícita do operador** (prompt `confirmar? [s/N]` com abort padrão).  
> **O passo do diff permanece como AUDITORIA VISUAL do operador**: o script gera e exibe os diffs unificados contra `47aa7b1`, mas quem analisa e aprova a modificação antes da substituição é o operador humano.

### 10.2. A Ordem Exata dos 9 Passos Automatizados

O script estrutura a operação exatamente na sequência requerida:

| Passo | Subcomando                          | Ação Executada                                                                                                                    | Nível de Risco e Salvaguarda                                                         |
| :---: | :---------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **1** | `./aplicar-fase1-vps.sh verificar`  | Valida acesso a `/root/cursos-api`, branch `correcao-fluxo-cursos`, base estável `47aa7b1`, `git status` e presença de candidatos | Somente leitura / Validação prévia                                                   |
| **2** | `./aplicar-fase1-vps.sh copiar`     | Prepara `/tmp/fase1_candidatos/src/routes` e `/tmp/fase1_candidatos/src/static` com os candidatos da Fase 1                       | Isolado em `/tmp` (produção intocada)                                                |
| **3** | `./aplicar-fase1-vps.sh diff`       | Gera diffs contra `47aa7b1` em `/tmp/diff_fase1_*.patch` e exibe resumo de linhas alteradas                                       | **AUDITORIA VISUAL DO OPERADOR** (aprovação humana)                                  |
| **4** | `./aplicar-fase1-vps.sh substituir` | Cria backups locais `.bak.fase1` dos originais e copia candidatos de `/tmp` para `src/`                                           | **Ação Destrutiva: Exige confirmação explícita [s/N]**                               |
| **5** | `./aplicar-fase1-vps.sh validar`    | Executa `node --check src/routes/stream.js` e confere hashes SHA-256 contra o manifesto                                           | Aborta imediatamente em erro de sintaxe                                              |
| **6** | `./aplicar-fase1-vps.sh commit`     | `git add` restrito aos 2 arquivos, commit rastreável e `git push origin correcao-fluxo-cursos`                                    | **Trava rígida: NUNCA faz push para `main`; aborta fora de `correcao-fluxo-cursos`** |
| **7** | `./aplicar-fase1-vps.sh redeploy`   | Dispara Rebuild no EasyPanel via API com token mascarado ou documenta alternativa manual                                          | **Token lido exclusivamente de variável de ambiente `$EASYPANEL_TOKEN`**             |
| **8** | `./aplicar-fase1-vps.sh testes`     | Executa a bateria dos 8 testes pós-deploy (auth, mentor, upload, Range, stream sem 403, traversal, Groq, publicação)              | Tokens só por variável de ambiente, mascarados                                       |
| **9** | `./aplicar-fase1-vps.sh rollback`   | Reverte os 2 arquivos via `.bak.fase1` ou `git checkout 47aa7b1`, commita reversão e mede tempo                                   | **Mede e imprime tempo gasto (meta < 3 min)**; aponta snapshot                       |

### 10.3. Modo Guiado Completo

Para executar o fluxo sequencial passo a passo com confirmação interativa antes de cada etapa de substituição, commit ou redeploy:

```bash
cd /root/cursos-api
./docs/operacoes/aplicar-fase1-vps.sh tudo
```

### 10.4. Execução de Subcomandos Independentes

O operador pode executar qualquer subcomando isoladamente:

```bash
# 1. Verificar ambiente
./docs/operacoes/aplicar-fase1-vps.sh verificar

# 2. Copiar candidatos para /tmp
./docs/operacoes/aplicar-fase1-vps.sh copiar

# 3. Gerar diffs para auditoria visual
./docs/operacoes/aplicar-fase1-vps.sh diff

# 4. Substituir arquivos reais (após auditar o diff)
./docs/operacoes/aplicar-fase1-vps.sh substituir

# 5. Validar sintaxe Node.js e hashes
./docs/operacoes/aplicar-fase1-vps.sh validar

# 6. Commit e Push na branch autorizada
./docs/operacoes/aplicar-fase1-vps.sh commit

# 7. Redeploy EasyPanel (token nunca salvo em disco)
EASYPANEL_TOKEN="[TOKEN_ROTACIONADO]" ./docs/operacoes/aplicar-fase1-vps.sh redeploy

# 8. Bateria dos 8 testes
TEST_TOKEN_MENTOR="[TOKEN_MENTOR]" ./docs/operacoes/aplicar-fase1-vps.sh testes

# 9. Rollback rápido em menos de 3 minutos
./docs/operacoes/aplicar-fase1-vps.sh rollback
```

---

## 11. CRITÉRIO DE APROVAÇÃO FINAL

A homologação da Fase 1 será considerada formalmente **APROVADA** quando, e somente quando:

1. O serviço `Cursos-API` estiver respondendo com status 200 no health check;
2. Todos os 8 testes funcionais acima descritos passarem com sucesso;
3. O novo painel estático carregar o layout 16:9 + matriz curricular em desktop e celular;
4. Nenhum log de erro não tratado (500) for observado no container do `Cursos-API`;
5. O operador registrar formalmente a aprovação para encerramento da Fase 1.
