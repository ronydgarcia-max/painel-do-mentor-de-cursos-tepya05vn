# GUIA DE TESTE PRÉ-HOMOLOGAÇÃO NÃO INVASIVO NA VPS (FASE 1)

**Projeto:** Plataforma Cursos (Cursos-API / Painel do Mentor)  
**Documento:** `docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md`  
**Data da Elaboração:** 2026-11-01  
**Ambiente de Execução:** VPS própria (`/root/cursos-api`, host `srv845644`) — **Execução manual exclusiva pelo Operador**  
**Repositório Real:** `github.com/ronydgarcia-max/cursos-api`  
**Branch de Trabalho:** `correcao-fluxo-cursos`  
**Commit Base Estável:** `47aa7b1`  
**Backup Integral de Referência:** `/root/backups/cursos/20261031_195147`  
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

O teste é dividido em dois modos complementares:

- **MODO A (Estático — Zero Risco):** Validação criptográfica (SHA-256), análise sintática com `node --check`, validação estrutural do HTML e geração dos diffs unificados contra o commit base `47aa7b1` sem aplicar nada.
- **MODO B (Isolado em Porta Alternativa — Teste Funcional Real):** Execução de uma instância temporária e descartável da aplicação em `/tmp/fase1_teste/` escutando em porta alternativa (ex.: `3334`), reutilizando dependências e conexão Postgres do `.env` real (sem exibir valores), permitindo inspecionar o novo painel no navegador e executar bateria completa de `curl` contra a rota de streaming e proteção de segurança.

---

## 2. O QUE NÃO DÁ PARA TESTAR ANTES DA APLICAÇÃO OFICIAL

Para total clareza e alinhamento de expectativas, os seguintes pontos **NÃO podem e NÃO devem ser testados no teste pré-homologação** (ficam reservados estritamente para a homologação oficial após autorização formal do operador):

| Recurso / Ação                                                          | Por que NÃO testar agora?                                                                                                                                        | Quando será testado?                                                                  |
| :---------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **Rebuild no EasyPanel**                                                | Disparar rebuild no EasyPanel lê o repositório remoto do GitHub e recria o container de produção, o que violaria o isolamento pré-homologação.                   | Somente na homologação oficial, após commit e push na branch `correcao-fluxo-cursos`. |
| **Upload real de vídeo na VPS (`/srv/cursos/videos` ou `/app/videos`)** | A gravação em disco no storage compartilhado de produção altera o estado físico dos volumes e pode conflitar com permissões de usuário do container em execução. | Na homologação oficial, validando o endpoint `POST /mentor/cursos/upload-video-vps`.  |
| **Novo painel servido pela URL/domínio oficial de produção**            | Exigiria substituição de `src/static/painel-mentor.html` na árvore de produção e deploy no EasyPanel.                                                            | Na homologação oficial, após validação e merge.                                       |
| **Novas migrations ou alterações DDL no PostgreSQL**                    | As migrations já foram confirmadas como aplicadas pelo operador; criar migrations violaria a integridade do banco.                                               | Não aplicável (DDL já finalizado).                                                    |

---

## 3. PREPARAÇÃO: TRANSFERÊNCIA DOS CANDIDATOS PARA `/tmp/fase1_candidatos/`

Na VPS, como usuário `root`, crie a pasta temporária onde os dois arquivos candidatos serão inspecionados:

```bash
mkdir -p /tmp/fase1_candidatos/src/routes
mkdir -p /tmp/fase1_candidatos/src/static
```

Copie os arquivos do workspace para a VPS via SCP, rsync ou colando o conteúdo exato:

- `docs/fase1/stream.js` → `/tmp/fase1_candidatos/src/routes/stream.js`
- `docs/fase1/NOVO_PAINEL/painel-mentor.html` → `/tmp/fase1_candidatos/src/static/painel-mentor.html`

> **Importante:** Os arquivos de produção em `/root/cursos-api/src/routes/stream.js` e `/root/cursos-api/src/static/painel-mentor.html` **NÃO são tocados**.

---

## 4. MODO A: VALIDAÇÃO ESTÁTICA (ZERO RISCO)

O Modo A confere integridade criptográfica, sintaxe e diffs sem executar nenhum serviço.

### Passo A1 — Conferência dos Hashes SHA-256 contra o Manifesto Oficial

Compare os hashes dos arquivos copiados com os valores documentados em `docs/fase1/VERIFICACAO_ARTEFATOS.md`:

```bash
sha256sum /tmp/fase1_candidatos/src/routes/stream.js
# Saída esperada:
# 723a1dd7e0344d2d48083bf2dc07dd43bc20d7f95521b33b70e7041fde5b945c  /tmp/fase1_candidatos/src/routes/stream.js

sha256sum /tmp/fase1_candidatos/src/static/painel-mentor.html
# Saída esperada:
# 3d9501a300d8b4e7a3ec11cc0a66d548f7663e6e87f2e1a47321e06fa536f0e4  /tmp/fase1_candidatos/src/static/painel-mentor.html
```

Se qualquer hash divergir, significa que houve truncamento ou caractere espúrio na transferência. Reenvie o arquivo antes de prosseguir.

### Passo A2 — Checagem Sintática no Node.js (`node --check`)

Valide a sintaxe do `stream.js` candidato com o binário oficial do Node v20 na VPS:

```bash
node --check /tmp/fase1_candidatos/src/routes/stream.js
echo "Exit code: $?"
```

_Saída esperada:_ Saída silenciosa e `Exit code: 0`.

### Passo A3 — Checagem Estrutural do HTML do Painel

Valide que o painel contém a marcação HTML5 completa, a trava de `'use strict'`, a ausência de chamadas a `localStorage` para tokens e a presença de `sessionStorage`:

```bash
# 1. Checar DOCTYPE e fechamento
head -n 1 /tmp/fase1_candidatos/src/static/painel-mentor.html
tail -n 2 /tmp/fase1_candidatos/src/static/painel-mentor.html

# 2. Confirmar uso de sessionStorage
grep -c "sessionStorage" /tmp/fase1_candidatos/src/static/painel-mentor.html
# Esperado: >= 3 ocorrências

# 3. Confirmar ZERO uso de localStorage para tokens (segurança contra XSS persistente)
grep -i "localStorage" /tmp/fase1_candidatos/src/static/painel-mentor.html || echo "OK: localStorage ausente"
```

### Passo A4 — Geração do Diff Definitivo contra o Commit Base `47aa7b1` SEM Aplicar

No diretório `/root/cursos-api`, gere o diff unificado entre o commit base congelado `47aa7b1` e os arquivos candidatos em `/tmp`, gravando a saída em `/tmp/diff_fase1_stream.patch` e `/tmp/diff_fase1_painel.patch`:

```bash
cd /root/cursos-api

# Diff de stream.js:
git show 47aa7b1:src/routes/stream.js | diff -u - /tmp/fase1_candidatos/src/routes/stream.js > /tmp/diff_fase1_stream.patch
echo "Linhas no diff de stream.js: $(wc -l < /tmp/diff_fase1_stream.patch)"

# Diff de painel-mentor.html:
git show 47aa7b1:src/static/painel-mentor.html | diff -u - /tmp/fase1_candidatos/src/static/painel-mentor.html > /tmp/diff_fase1_painel.patch
echo "Linhas no diff de painel-mentor.html: $(wc -l < /tmp/diff_fase1_painel.patch)"
```

Inspecione os diffs gerados:

```bash
cat /tmp/diff_fase1_stream.patch | head -n 40
```

### Passo A5 — Prova de que NADA foi Tocado no Repositório Real

Execute a prova cabal de que nenhuma alteração foi introduzida na árvore de trabalho ou índice do Git:

```bash
cd /root/cursos-api
git status
```

_Saída esperada obrigatória:_

```text
On branch correcao-fluxo-cursos
Your branch is up to date with 'origin/correcao-fluxo-cursos'.
nothing to commit, working tree clean
```

---

## 5. MODO B: SERVIDOR ISOLADO EM PORTA ALTERNATIVA (TESTE REAL)

O Modo B permite testar a aplicação em execução real, conectada ao banco de dados, sem interferir no serviço de produção (`Cursos-API`).

```text
┌────────────────────────────────────────────────────────┐
│ PRODUÇÃO ATIVA (Intocada)                             │
│ /root/cursos-api  -->  EasyPanel / Porta 3000          │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ AMBIENTE DE TESTE ISOLADO                              │
│ /tmp/fase1_teste/  -->  Node v20 / Porta 3334          │
│ (.env de produção carregado apenas em memória)         │
└────────────────────────────────────────────────────────┘
```

### Passo B1 — Criação da Cópia de Trabalho Isolada em `/tmp/fase1_teste/`

Copie o código-fonte de `/root/cursos-api` excluindo `.git` e artefatos voláteis:

```bash
rm -rf /tmp/fase1_teste
mkdir -p /tmp/fase1_teste

rsync -a --exclude='.git' \
         --exclude='node_modules' \
         /root/cursos-api/ /tmp/fase1_teste/
```

### Passo B2 — Sobreposição dos Candidatos na Cópia

Substitua os arquivos apenas dentro de `/tmp/fase1_teste/`:

```bash
cp /tmp/fase1_candidatos/src/routes/stream.js /tmp/fase1_teste/src/routes/stream.js
cp /tmp/fase1_candidatos/src/static/painel-mentor.html /tmp/fase1_teste/src/static/painel-mentor.html
```

### Passo B3 — Reutilização Segura de `node_modules`

Para evitar downloads de pacotes ou `npm install`, crie um link simbólico direto para o `node_modules` já existente no repositório de produção:

```bash
ln -s /root/cursos-api/node_modules /tmp/fase1_teste/node_modules
```

### Passo B4 — Inicialização do Servidor de Teste na Porta 3334

A aplicação lê as variáveis de conexão com o PostgreSQL a partir do `.env` existente em `/root/cursos-api/.env`, mas sobrescreve a porta para `3334` via linha de comando, sem jamais imprimir o conteúdo do `.env`:

```bash
cd /tmp/fase1_teste

# Iniciar em background redirecionando logs para /tmp/fase1_teste_server.log:
PORT=3334 env $(grep -v '^#' /root/cursos-api/.env | xargs -d '\n') PORT=3334 node src/server.js > /tmp/fase1_teste_server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > /tmp/fase1_teste_server.pid
echo "Servidor de teste iniciado com PID $SERVER_PID na porta 3334"
```

Aguarde 2 segundos e confira se a porta está ativa:

```bash
sleep 2
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3334/health || curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3334/
```

_Saída esperada:_ `HTTP Status: 200`.

---

## 6. BATERIA DE TESTES AUTOMATIZÁVEIS VIA CURL

Com o servidor de teste de pé em `http://localhost:3334`, o operador executa os testes abaixo.

### 6.1. Definição Segura de Variáveis de Ambiente Transitórias

Os tokens entram exclusivamente na sessão do shell e nunca são gravados em arquivo:

```bash
# O operador exporta temporariamente seus tokens de teste:
export TEST_PORT=3334
export TEST_AULA_ID=27              # ID da aula para teste de stream
export TEST_TOKEN_MENTOR="seu_token_jwt_de_mentor_aqui"
export TEST_TOKEN_ALUNO="seu_token_jwt_de_aluno_matriculado_aqui"
export TEST_TOKEN_ESTRANHO="seu_token_jwt_sem_relacao_com_curso"
```

### 6.2. Matriz de Resultados Esperados por Teste

|   #    | Teste / Cenário                                | Comando `curl`                                                                                                      |           Código HTTP Esperado           | Headers / Corpo Esperados                                                                   |
| :----: | :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :--------------------------------------: | :------------------------------------------------------------------------------------------ |
| **T1** | **Health Check**                               | `curl -i http://localhost:3334/health`                                                                              |                **200 OK**                | Servidor ativo e respondendo                                                                |
| **T2** | **Stream sem token**                           | `curl -i http://localhost:3334/stream/27`                                                                           |           **401 Unauthorized**           | Middleware de autenticação rejeita requisição anônima                                       |
| **T3** | **Stream com usuário sem relação**             | `curl -i -H "Authorization: Bearer $TEST_TOKEN_ESTRANHO" http://localhost:3334/stream/27`                           |            **403 Forbidden**             | `{"error":"Acesso negado: você não está matriculado..."}`                                   |
| **T4** | **Stream com Mentor Proprietário (com Range)** | `curl -i -H "Authorization: Bearer $TEST_TOKEN_MENTOR" -H "Range: bytes=0-1048576" http://localhost:3334/stream/27` |         **206 Partial Content**          | `Content-Range: bytes 0-1048576/...`<br>`Content-Type: video/mp4`<br>`Accept-Ranges: bytes` |
| **T5** | **Stream com Mentor Proprietário (sem Range)** | `curl -i -H "Authorization: Bearer $TEST_TOKEN_MENTOR" http://localhost:3334/stream/27`                             |                **200 OK**                | `Content-Length: ...`<br>`Content-Type: video/mp4`                                          |
| **T6** | **Aula nova sem `video_path` (ex.: ID 99999)** | `curl -i -H "Authorization: Bearer $TEST_TOKEN_MENTOR" http://localhost:3334/stream/99999`                          | **400 Bad Request** ou **404 Not Found** | Erro explícito de vídeo não processado (NUNCA toca o vídeo da aula 27)                      |
| **T7** | **Tentativa de Path Traversal no endpoint**    | `curl -i -H "Authorization: Bearer $TEST_TOKEN_MENTOR" http://localhost:3334/stream/27%2F..%2F..%2Fetc%2Fpasswd`    | **400 Bad Request** ou **403 Forbidden** | Alerta `[STREAM SECURITY VIOLATION]` gerado em `/tmp/fase1_teste_server.log`                |

Inspecione os logs do servidor de teste para confirmar a ausência de erros não tratados:

```bash
tail -n 30 /tmp/fase1_teste_server.log
```

---

## 7. CHECKLIST DE TESTE NO NAVEGADOR (ITENS MANUAIS)

Alguns itens dependem de renderização DOM e comportamento do navegador (JavaScript da página). Eles estão mapeados aos itens correspondentes de `docs/fase1/VERIFICACAO_ARTEFATOS.md`:

### Como Acessar o Painel de Teste no Navegador:

Se a porta `3334` não estiver aberta no firewall externo da VPS, o operador pode criar um túnel SSH seguro a partir do seu computador local:

```bash
# No terminal do computador do operador:
ssh -L 3334:localhost:3334 root@<IP_DA_VPS>
```

Em seguida, abrir no navegador local: `http://localhost:3334/static/painel-mentor.html?token=SEU_TOKEN_AQUI`

### Checklist Manual:

- [ ] **Item 18 (Vídeo Local):** Ao selecionar aula com `video_type === 'local'`, o player `<video>` é instanciado com `/stream/:aulaId` e exibe o badge verde _"Vídeo Local VPS"_.
- [ ] **Item 19 (YouTube):** Ao selecionar aula de YouTube, o iframe `youtube-nocookie.com/embed/...` é carregado e exibe o badge vermelho _"YouTube"_.
- [ ] **Item 20 (Cloudinary):** Ao selecionar aula de upload/Cloudinary, o player nativo exibe o badge roxo _"Cloudinary / Storage"_.
- [ ] **Item 21 (OneDrive):** Ao selecionar aula de OneDrive, o player nativo exibe o badge ciano _"Microsoft Graph / OneDrive"_.
- [ ] **Item 22 e 23 (Token de transição e history.replaceState):** Ao carregar a página com `?token=...`, o parâmetro `?token` desaparece imediatamente da barra de endereços sem recarregar a página (`window.history.replaceState`).
- [ ] **Item 24 (Ausência de token em logs):** Abrir as ferramentas de desenvolvedor (F12 > Console). Nenhuma linha imprime o token JWT.
- [ ] **Item 26 e 27 (sessionStorage vs localStorage):** No console do navegador (F12 > Application/Armazenamento):
  - `sessionStorage.getItem('cursos_token')` contém o token da sessão ativa.
  - `localStorage.getItem('cursos_token')` retorna estritamente `null`.

---

## 8. ENCERRAMENTO E LIMPEZA COMPLETA DO TESTE

Após concluir os testes no Modo A e Modo B, encerre a instância de teste e remova os arquivos temporários:

```bash
# 1. Encerrar o servidor de teste
if [ -f /tmp/fase1_teste_server.pid ]; then
  kill $(cat /tmp/fase1_teste_server.pid) 2>/dev/null || true
  rm -f /tmp/fase1_teste_server.pid
fi

# 2. Remover diretórios de teste em /tmp
rm -rf /tmp/fase1_teste
rm -rf /tmp/fase1_candidatos
rm -f /tmp/diff_fase1_*.patch
rm -f /tmp/fase1_teste_server.log

# 3. Confirmar que o repositório de produção continua 100% limpo
cd /root/cursos-api
git status
```

_Resultado Final:_ A VPS retorna exatamente ao estado inicial, sem nenhum resíduo de arquivos, nenhum commit indesejado e com a garantia documentada do teste antes de qualquer homologação oficial.
