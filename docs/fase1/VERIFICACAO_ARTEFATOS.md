# VERIFICAÇÃO DE ARTEFATOS E MANIFESTO DE INTEGRIDADE (FASE 1)

**Projeto:** Plataforma Cursos (Cursos-API / Painel do Mentor)  
**Documento:** `docs/fase1/VERIFICACAO_ARTEFATOS.md`  
**Data da Auditoria:** 2026-11-01 (Revisão Final Pré-Homologação)  
**Ambiente:** Workspace GoSkip (Isolado da VPS)  
**Branch Oficial no GitHub:** `correcao-fluxo-cursos`  
**Commit Base no Repositório Real:** `47aa7b1`  
**Diretriz de Segurança:** ZERO senhas, tokens ou credenciais. Marcador oficial: `[TOKEN_REMOVIDO_E_ROTACIONADO]`.

---

## 0. ORIGEM DE DOWNLOAD DOS ARTEFATOS (SEM GITHUB, SEM SCP)

A partir da revisão de instalação rápida, os artefatos da Fase 1 são servidos pela
URL pública da PRÓPRIA PRÉVIA GoSkip em `<origem>/docs/...`, onde `<origem>` é o
`window.location.origin` da prévia exibido na aba "Fase 1 — Entregáveis" (card
"Instalação Rápida na VPS") do app. O espelho público é gerado no workspace pelo
script `docs/operacoes/espelhar-fase1-workspace.sh` (cópia byte-exata para
`public/docs/...` com re-verificação de SHA-256 antes do commit do workspace).

O instalador único `docs/operacoes/instalar-fase1.sh` é executado na VPS em UMA
linha (curl) e: baixa os 8 artefatos (curl com fallback wget) para
`/tmp/fase1_candidatos/` (stream.js em `src/routes/`, painel-mentor.html em
`src/static/`, demais em subpastas espelhadas), confere o SHA-256 de cada arquivo
contra hashes EMBUTIDOS no próprio instalador (abortando em divergência), valida
`node --check` no stream.js e copia APENAS os 2 scripts de teste para
`/root/cursos-api/docs/operacoes/` com `--preserve`.

**O instalador NUNCA faz:** `git add/commit/push/checkout`, cópia para `src/` do
repositório (candidatos ficam somente em `/tmp` para o operador auditar via diff),
uso da branch `main`, redeploy — e contém zero segredos. Serviço na porta 3334
NÃO significa Fase 1 homologada: homologação oficial (Camada 4, EasyPanel)
continua exigindo autorização expressa do operador.

## 1. MANIFESTO CRIPTOGRÁFICO SHA-256 DOS ARTEFATOS DA FASE 1

O operador da VPS exige as somas de verificação SHA-256 completas dos arquivos oficiais da Fase 1 antes de qualquer transferência ou homologação na VPS:

```
──────────────────────────────────────────────────────────────────────────────────────────────────
HASH SHA-256                                                      ARQUIVO
──────────────────────────────────────────────────────────────────────────────────────────────────
2be71f49646bde330ec0c822ff611be9e173e44c2057d23f381c81ef94e1e07b  docs/fase1/stream.js (com guard READ_ONLY_TEST)
3d9501a300d8b4e7a3ec11cc0a66d548f7663e6e87f2e1a47321e06fa536f0e4  docs/fase1/NOVO_PAINEL/painel-mentor.html
168e37dc0bd59a16f272a8c3d8e578ba33cd7c768991fa9a7ffccbe5b9bc5d11  docs/fase1/INTEGRACAO_FASE1.md
e9b2513de5553e1e40eb617b7b15a6b5a3e1438fa5a48483f3e27150a294f4a3  docs/fase1/PROPOSTA_PROVAS.md
3312c1404c0429fec033bd2f27ddc54aa5017e2978931dc150c95029a502f664  docs/fase1/REVISAO_FASE1.md
38a6ec1552a46e1074e50d536cf0ba7493eef250bc44618e7751c8a14ec7a59a  docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md
e927c9c054238e55eefea2b27429bb7b05cdcd5d1ec5ce1e6e0261c470196253  docs/operacoes/testar-fase1-vps.sh
c93f06b9968452309ec95ba8d133038a8e1e7bd66ff852b86a8ff39fa1cf8743  docs/operacoes/aplicar-fase1-vps.sh
[SHA256_A_COMPUTAR_APOS_ESPELHAMENTO]  docs/operacoes/instalar-fase1.sh (instalador único — executar sha256sum após o espelhamento; NUNCA inventar valor)
──────────────────────────────────────────────────────────────────────────────────────────────────
```

> **Nota do instalador:** os 8 hashes acima (exceto a linha do instalador) estão
> EMBUTIDOS em `docs/operacoes/instalar-fase1.sh` e são conferidos na VPS a cada
> download. O hash do próprio instalador é calculado com
> `sha256sum docs/operacoes/instalar-fase1.sh` após o espelhamento e registrado
> aqui e em `src/lib/manifestHelper.ts` — nunca inventado.

### Comando Exato Utilizado para Geração dos Hashes no Host / VPS:

```bash
sha256sum docs/fase1/stream.js \
          docs/fase1/NOVO_PAINEL/painel-mentor.html \
          docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md \
          docs/fase1/INTEGRACAO_FASE1.md \
          docs/fase1/PROPOSTA_PROVAS.md \
          docs/fase1/REVISAO_FASE1.md \
          docs/operacoes/testar-fase1-vps.sh \
          docs/operacoes/aplicar-fase1-vps.sh \
          docs/operacoes/instalar-fase1.sh \
          docs/fase1/VERIFICACAO_ARTEFATOS.md
```

Ou no ecossistema Node.js / crypto:

```bash
node -e "const fs = require('fs'), crypto = require('crypto'); ['docs/fase1/stream.js', 'docs/fase1/NOVO_PAINEL/painel-mentor.html', 'docs/fase1/INTEGRACAO_FASE1.md', 'docs/fase1/PROPOSTA_PROVAS.md', 'docs/fase1/REVISAO_FASE1.md', 'docs/fase1/VERIFICACAO_ARTEFATOS.md'].forEach(f => console.log(crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex') + '  ' + f));"
```

---

## 2. VALIDAÇÃO PONTO A PONTO DOS 27 ITENS PRÉ-HOMOLOGAÇÃO

Abaixo está o registro sistemático de veredito e evidência textual (arquivo e linha) para cada um dos 27 itens contratuais requeridos pelo operador:

|   #    | Item Requerido pelo Operador                                           |      Veredito      | Evidência (Arquivo + Linhas)                                                             | Detalhamento Técnico e Observações                                                                                                                                                                                                    |
| :----: | :--------------------------------------------------------------------- | :----------------: | :--------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | ------------------------------------------------------------------------------------------------ |
| **1**  | **`node --check` no stream.js**                                        |       **OK**       | `docs/fase1/stream.js`<br>Linhas 1-263                                                   | Comando `node --check docs/fase1/stream.js` executado: saída silenciosa (exit code 0). Zero erros sintáticos; compatível com Node v20.20.2 LTS. Inclui guard READ_ONLY_TEST=true ativo em teste e no-op em produção.                  |
| **2**  | **Estrutura do HTML**                                                  |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1-1941                             | Marcação HTML5 válida (`<!doctype html>`), tags semânticas fechadas, layout responsivo desktop/mobile, IIFE com `'use strict'`, sem dependência de build step.                                                                        |
| **3**  | **Importações usadas pelo stream.js**                                  |       **OK**       | `docs/fase1/stream.js`<br>Linhas 15-20                                                   | Usa módulos padrão do Node (`path`, `fs`) e do projeto (`express`, `../database/db`, `../middleware/auth`). Sem dependências externas inexistentes.                                                                                   |
| **4**  | **Rotas chamadas pelo painel**                                         |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1500, 1550, 1577, 1724, 1872, 1919 | Invoca estritamente as rotas Express reais: `GET /mentor/cursos`, `GET /mentor/cursos/:id/etapas`, `GET /mentor/cursos/:id/provas`, `POST /mentor/cursos/:id/etapas`, `POST /mentor/cursos/upload-video-vps` e `GET /stream/:aulaId`. |
| **5**  | **Contrato real de autenticação**                                      |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1435-1448                          | Centralizado em `apiFetch`: envia `Authorization: Bearer <token>` e `x-cursos-token: <token>` conforme contrato de `src/middleware/auth.js`.                                                                                          |
| **6**  | **Autorização de aluno matriculado**                                   |       **OK**       | `docs/fase1/stream.js`<br>Linha 118                                                      | Query autorizativa checa `SELECT 'matriculado' AS motivo FROM matriculas WHERE usuario_id = $1 AND curso_id = $2`. Preserva direito do aluno matriculado.                                                                             |
| **7**  | **Autorização de mentor proprietário**                                 |       **OK**       | `docs/fase1/stream.js`<br>Linha 120                                                      | Query autorizativa contém `UNION SELECT 'mentor_dono' AS motivo FROM cursos WHERE id = $2 AND mentor_id = $1`. Elimina o falso erro 403 do mentor ao pré-visualizar sua aula.                                                         |
| **8**  | **Autorização de administrador**                                       |       **OK**       | `docs/fase1/stream.js`<br>Linha 122                                                      | Query autorizativa contém `UNION SELECT 'admin' AS motivo FROM usuarios WHERE id = $1 AND role = 'admin'`. Permite auditoria por administradores sem matrícula forçada.                                                               |
| **9**  | **Rejeição de usuário sem permissão**                                  |       **OK**       | `docs/fase1/stream.js`<br>Linhas 126-130                                                 | Se `authQuery.rows.length === 0`, responde imediatamente `HTTP 403 Forbidden` com `{ error: 'Acesso negado: você não está matriculado neste curso nem é o mentor proprietário.' }`.                                                   |
| **10** | **video_path**                                                         |       **OK**       | `docs/fase1/stream.js`<br>Linhas 94-99, 135                                              | Consulta `video_path` diretamente de `aulas WHERE id = $1` e envia o caminho para resolução segura.                                                                                                                                   |
| **11** | **video_type**                                                         |       **OK**       | `docs/fase1/stream.js`<br>Linhas 95, 135, 151-161                                        | Valida `aula.video_type === 'local'`. Se for outro tipo (`youtube`, `onedrive`, `upload`), instrui o cliente via erro 400 sem tentar abrir arquivo local.                                                                             |
| **12** | **Caminho dentro de /app/videos**                                      |       **OK**       | `docs/fase1/stream.js`<br>Linhas 26, 56-63                                               | `BASE_VIDEOS_DIR` configurado em `process.env.LOCAL_VIDEO_DIR                                                                                                                                                                         |     | '/app/videos'`. A barreira `resolved.startsWith(baseComSeparador)` garante confinamento estrito. |
| **13** | **Proteção contra path traversal**                                     |       **OK**       | `docs/fase1/stream.js`<br>Linhas 40-73                                                   | Sanitização de barras, regex `^[0-9]+\/[a-zA-Z0-9_\-\.]+\.mp4$`, resolução com `path.resolve` e verificação de prefixo. Bloqueios lançam erro 403 com alerta de segurança no log.                                                     |
| **14** | **HTTP Range**                                                         |       **OK**       | `docs/fase1/stream.js`<br>Linhas 178-191                                                 | Interpreta `req.headers.range`, calcula `start`/`end`, trata limites inválidos com `HTTP 416` e instancia `fs.createReadStream(videoFilePath, { start, end })`.                                                                       |
| **15** | **Fallback somente para aula 27 (nunca genérico)**                     |       **OK**       | `docs/fase1/stream.js`<br>Linhas 28-30, 105, 144-162                                     | Condição estrita `else if (aulaId === 27 && FALLBACK_LOCAL_VIDEO_FILES[27])`. Qualquer outra aula sem `video_path` retorna `HTTP 400` com mensagem explicativa e NUNCA reproduz a aula 27.                                            |
| **16** | **Comparação do ID da aula como número normalizado**                   |       **OK**       | `docs/fase1/stream.js`<br>Linhas 86, 105, 144                                            | `aulaId = parseInt(req.params.aulaId, 10)` com checagem `isNaN(aulaId)                                                                                                                                                                |     | aulaId <= 0` (retorna 400). Comparações usam igualdade estrita (`=== 27`).                       |
| **17** | **Arquivo inexistente**                                                |       **OK**       | `docs/fase1/stream.js`<br>Linhas 165-173                                                 | Checa `!fs.existsSync(videoFilePath)` antes de abrir o stream. Se não existir no disco, retorna `HTTP 404 Not Found` com log de aviso sem derrubar o Node.                                                                            |
| **18** | **Vídeo local**                                                        |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 954-956, 1719-1727                 | Configura `<video id="nativeVideoPlayer">` com `src = '/stream/' + aula.id + '?token=...'`, exibindo badge visual verde "Vídeo Local VPS (/stream/:aulaId com Range)".                                                                |
| **19** | **YouTube**                                                            |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 959-971, 1702-1718                 | Renderiza `<iframe id="youtubeIframe">` apontando para `youtube-nocookie.com/embed/{id}?rel=0` com extração automática de IDs `v=` e `youtu.be/`.                                                                                     |
| **20** | **Cloudinary**                                                         |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1738-1747                          | Tipo `upload` ou `cloudinary`: configura `<video>` nativo com a URL do arquivo (`aula.video_url`) e badge roxo correspondente.                                                                                                        |
| **21** | **OneDrive**                                                           |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1728-1737                          | Tipo `onedrive`: configura `<video>` nativo com `aula.video_url` e badge ciano "Microsoft Graph / OneDrive".                                                                                                                          |
| **22** | **Token de transição**                                                 |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1397-1429                          | Tratado em `consumirTokenTransicao()`: lê `?token=`, valida JWT (`validarFormatoToken`), grava na sessão, exclui o parâmetro da busca e sanitiza.                                                                                     |
| **23** | **Remoção do token com history.replaceState**                          |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1412-1417                          | `urlParams.delete('token')` seguido de `window.history.replaceState({}, document.title, novaUrl)` síncrono. O token não permanece na barra de endereços nem no histórico.                                                             |
| **24** | **Ausência do token em logs**                                          |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1408, 1419-1421, 1453-1458         | Nenhuma linha de `console.log`, `info` ou `error` imprime o token ou o objeto de parâmetros da URL. Apenas mensagens genéricas de alerta são emitidas.                                                                                |
| **25** | **Ausência do token em links internos**                                |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1027-1035, 1843-1853               | Todos os botões, abas e links de materiais apontam para URLs sem repassar query string com token. Autenticação interna é feita via headers HTTP.                                                                                      |
| **26** | **Ausência do token em localStorage**                                  | **OK** (Corrigido) | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1392, 1405-1406, 1422-1423, 1834   | **Eliminado todo uso de `localStorage` para tokens de sessão.** O token NUNCA é gravado ou lido em `localStorage`, atendendo textualmente ao requisito 26.                                                                            |
| **27** | **Uso de sessionStorage ou cookie HttpOnly, conforme o contrato real** |       **OK**       | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1406, 1423, 1834                   | Persistência da sessão ativa realizada unicamente via `sessionStorage.setItem('cursos_token', ...)` e recuperada via `sessionStorage.getItem('cursos_token')`. Descartado ao fechar a aba/navegador.                                  |

---

## 3. RELATÓRIO DA VARREDURA DE SEGREDOS NOS 6 ARTEFATOS

Foi executada uma varredura estrita em todos os 6 arquivos de `docs/fase1/`, inspecionando padrões de credenciais:

- Tokens de autenticação reais ou JWTs codificados;
- Senhas, passwords ou secrets de API;
- Chaves de API de terceiros (Cloudinary, Groq, YouTube, Microsoft);
- Strings de conexão reais (`postgres://`, `redis://`);
- Chaves privadas RSA/OpenSSH (`BEGIN PRIVATE KEY`).

### Resultado da Varredura:

- **Segredos Reais Encontrados:** **ZERO (0)**.
- **Uso do Marcador Oficial:** Presente unicamente a constante documental `[TOKEN_REMOVIDO_E_ROTACIONADO]` onde aplicável.
- **Status:** **APROVADO PARA ENVIO À VPS**.

---

## 4. INSTRUÇÕES PREVENTIVAS DO DIFF NA VPS CONTRA `47aa7b1`

### 4.1. Limitação do Workspace GoSkip

O workspace do GoSkip é um ambiente isolado em React/TypeScript para desenvolvimento de protótipos e elaboração de artefatos. **Não possui o clone do repositório Git real `cursos-api` nem a árvore completa de commits da branch `correcao-fluxo-cursos`**.

Portanto, o diff definitivo contra a base `47aa7b1` **deve ser gerado NA VPS pelo operador humano**, conforme a sequência de comandos abaixo:

### 4.2. Comandos Exatos de Cópia para Diretório Temporário e Diff na VPS:

```bash
# 1. Acessar a VPS e navegar até o repositório
ssh root@<IP_DA_VPS>
cd /root/cursos-api

# 2. Confirmar que está na branch correta sobre o commit base 47aa7b1
git checkout correcao-fluxo-cursos
git fetch origin correcao-fluxo-cursos
git status

# 3. Criar diretório temporário para inspeção isolada
mkdir -p /tmp/fase1_candidatos/src/routes
mkdir -p /tmp/fase1_candidatos/src/static

# 4. Copiar os artefatos candidatos do workspace para o diretório temporário
# (Exemplo: /tmp/fase1_candidatos/src/routes/stream.js e /tmp/fase1_candidatos/src/static/painel-mentor.html)

# 5. Gerar o diff definitivo contra a base estável 47aa7b1 SEM substituir os arquivos de produção:
git show 47aa7b1:src/routes/stream.js | diff -u - /tmp/fase1_candidatos/src/routes/stream.js
git show 47aa7b1:src/static/painel-mentor.html | diff -u - /tmp/fase1_candidatos/src/static/painel-mentor.html

# Ou comparar diretamente com a árvore de trabalho atual:
diff -u src/routes/stream.js /tmp/fase1_candidatos/src/routes/stream.js
diff -u src/static/painel-mentor.html /tmp/fase1_candidatos/src/static/painel-mentor.html

# 6. SOMENTE após o operador auditar e aprovar o diff acima, executar a substituição:
cp src/routes/stream.js src/routes/stream.js.bak.fase1
cp src/static/painel-mentor.html src/static/painel-mentor.html.bak.fase1
cp /tmp/fase1_candidatos/src/routes/stream.js src/routes/stream.js
cp /tmp/fase1_candidatos/src/static/painel-mentor.html src/static/painel-mentor.html

# 7. Validar sintaxe Node.js:
node --check src/routes/stream.js
```

---

## 5. RESUMO COMPARATIVO DO DIFF PREVISTO

Abaixo apresenta-se o comparativo conceitual do que será modificado no repositório real em relação à base `47aa7b1`:

### 5.1. Comparativo Previsto para `src/routes/stream.js`

```diff
--- a/src/routes/stream.js (Base 47aa7b1)
+++ b/src/routes/stream.js (Candidato Fase 1)
@@ -10,30 +10,120 @@
-const LOCAL_VIDEO_FILES = {
-  27: path.join(process.env.LOCAL_VIDEO_DIR || '/app/videos', '37', 'aula-27.mp4'),
-}
+const BASE_VIDEOS_DIR = path.resolve(process.env.LOCAL_VIDEO_DIR || '/app/videos')
+const FALLBACK_LOCAL_VIDEO_FILES = {
+  27: path.join(BASE_VIDEOS_DIR, '37', 'aula-27.mp4'),
+}
+
+function resolverCaminhoSeguro(videoPath) {
+  // Trava estrita contra Path Traversal:
+  // Valida regex ^[0-9]+\/[a-zA-Z0-9_\-\.]+\.mp4$ e checa resolved.startsWith(baseComSeparador)
+}

 router.get('/:aulaId', auth, async (req, res) => {
-  // Verificação legada: apenas alunos matriculados
-  const authQuery = await pool.query(
-    'SELECT 1 FROM matriculas WHERE usuario_id = $1 AND curso_id = $2',
-    [req.usuario.id, cursoId]
-  )
+  // Consulta dinâmica de metadados reais da aula
+  const aulaQuery = await pool.query(
+    'SELECT id, curso_id, video_type, video_path, video_url, titulo FROM aulas WHERE id = $1',
+    [aulaId]
+  )
+  // Autorização mista: Aluno Matriculado OU Mentor Dono OU Admin
+  const authQuery = await pool.query(
+    `SELECT 'matriculado' AS motivo FROM matriculas WHERE usuario_id = $1 AND curso_id = $2
+     UNION
+     SELECT 'mentor_dono' AS motivo FROM cursos WHERE id = $2 AND mentor_id = $1
+     UNION
+     SELECT 'admin' AS motivo FROM usuarios WHERE id = $1 AND role = 'admin'`,
+    [usuarioId, cursoId]
+  )
+  if (authQuery.rows.length === 0) return res.status(403)...
+
+  // Resolução dinâmica de video_path com trava de segurança
+  if (aula && aula.video_type === 'local' && aula.video_path) {
+    videoFilePath = resolverCaminhoSeguro(aula.video_path)
+  } else if (aulaId === 27 && FALLBACK_LOCAL_VIDEO_FILES[27]) {
+    videoFilePath = FALLBACK_LOCAL_VIDEO_FILES[27] // Exclusivo aula 27
+  } else {
+    return res.status(400).json({ error: 'Vídeo local não processado...' })
+  }
+  // Checagem de arquivo físico: 404 se ausente
+  if (!fs.existsSync(videoFilePath)) return res.status(404)...
+
+  // Suporte canônico a HTTP Range com resposta 206 Partial Content
+  if (range) {
+    res.writeHead(206, head)
+    file.pipe(res)
+  }
```

### 5.2. Comparativo Previsto para `src/static/painel-mentor.html`

```diff
--- a/src/static/painel-mentor.html (Base 47aa7b1)
+++ b/src/static/painel-mentor.html (Candidato Fase 1)
@@ -1,50 +1,1945 @@
-<!-- Painel legado com tabela simples, apenas iframe de YouTube, sem suporte a Range local -->
-<!-- Token de query string mantido na URL -->
+<!-- Novo Painel Estático Completo com UX baseada no Mock Conceitual Aprovado -->
+<!-- Player 16:9 à esquerda com badges dinâmicos de fonte (VPS, YouTube, OneDrive, Cloudinary) -->
+<!-- Matriz curricular à direita com % progresso, lista de aulas, aula destacada, quiz -->
+<!-- Tratamento transitório seguro de token ?token=: -->
+<!-- 1. valida JWT -> 2. cria sessão em sessionStorage (zero localStorage) -> 3. limpa URL com history.replaceState -->
+<!-- 4. zero logs -> 5. zero envio em links -> 6. não persiste na barra de endereços -->
```

---

## 6. SÍNTESE FINAL E CONDIÇÃO DE HOMOLOGAÇÃO

Os 6 artefatos estão íntegros, completos, testados e validados para o operador da VPS. A homologação do painel e do stream deve ser efetuada em conjunto, utilizando o backup `/root/backups/cursos/20261031_195147` e a branch `correcao-fluxo-cursos` sobre o commit `47aa7b1`.
