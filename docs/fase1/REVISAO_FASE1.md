# REVISÃO PONTO A PONTO PRÉ-HOMOLOGAÇÃO DA FASE 1

**Projeto:** Plataforma Cursos (Cursos-API / Painel do Mentor)  
**Documento:** `docs/fase1/REVISAO_FASE1.md`  
**Ambiente:** Prévia do GoSkip (Isolado da VPS de Produção)  
**Branch Oficial no GitHub:** `correcao-fluxo-cursos`  
**Commit Base no Repositório Real:** `47aa7b1`  
**Diretriz de Segurança:** Nenhuma credencial presente. Marcador oficial: `[TOKEN_REMOVIDO_E_ROTACIONADO]`.

---

## 1. INTRODUÇÃO E OBJETIVO DA REVISÃO

Esta revisão atende ao pedido textual do operador da VPS:

> _"Antes de qualquer aplicação na VPS, entregar os artefatos completos da Fase 1: 1. docs/fase1/NOVO_PAINEL/painel-mentor.html; 2. docs/fase1/stream.js; 3. docs/fase1/INTEGRACAO_FASE1.md; 4. docs/fase1/PROPOSTA_PROVAS.md; 5. diff completo contra o commit base 47aa7b1; 6. hash SHA-256 de cada arquivo; 7. resultado dos testes locais; 8. comando exato de validação executado; 9. confirmação de que nenhum segredo está nos arquivos."_

Neste documento, é realizada a auditoria técnica exaustiva dos **17 itens críticos** solicitados pelo operador, documentando veredito (`OK`, `Ajustado nesta revisão` ou `Limitação`), evidências nos arquivos com trecho e linha, e detalhamento das rotas e compatibilidades.

---

## 2. REVISÃO EXAUSTIVA DOS 17 PONTOS CRÍTICOS

|   #    | Ponto Exigido pelo Operador                      |          Veredito          | Evidência (Arquivo e Linhas)                                                             | O que Mudou / Detalhamento Técnico                                                                                                                                                                                                                                                                                                                                                                            |
| :----: | :----------------------------------------------- | :------------------------: | :--------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1**  | **Endpoints reais usados pelo novo painel**      |           **OK**           | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1457, 1507, 1534, 1681, 1828, 1875 | O painel invoca unicamente as rotas Express reais mapeadas na Fase 0: `GET /mentor/cursos`, `GET /mentor/cursos/:id/etapas`, `GET /mentor/cursos/:id/provas`, `POST /mentor/cursos/:id/etapas`, `POST /mentor/cursos/upload-video-vps` e `GET /stream/:aulaId`. Nenhuma rota fictícia foi utilizada.                                                                                                          |
| **2**  | **Autenticação por token**                       |           **OK**           | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1435-1442                          | Centralizada na função `apiFetch(endpoint, options)`. Toda requisição para a API injeta os cabeçalhos de autenticação quando o token está presente na sessão ativa: `Authorization: Bearer <token>` e `x-cursos-token: <token>`.                                                                                                                                                                              |
| **3**  | **Uso de token em query string**                 | **Ajustado nesta revisão** | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1377-1433                          | O consumo de `?token=` foi endurecido para cumprir os 6 requisitos do operador: validação estrita de formato JWT (`validarFormatoToken`), consumo único para criar sessão (`sessionStorage` e `localStorage`), sanitização atômica imediata via `history.replaceState`, ausência de logs e não propagação em links internos.                                                                                  |
| **4**  | **Conversão do token para Bearer**               |           **OK**           | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1439-1442                          | Implementado textualmente em `apiFetch`: `headers['Authorization'] = 'Bearer ' + state.token`. Compatível com o middleware `auth.js` do backend real (`req.headers.authorization.split(' ')[1]`).                                                                                                                                                                                                             |
| **5**  | **Limpeza do token com history.replaceState**    | **Ajustado nesta revisão** | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1412-1418                          | Após extrair e validar o token da query string, o parâmetro `token` é removido de `URLSearchParams` e a URL do navegador é limpa no mesmo tick síncrono via `window.history.replaceState({}, document.title, novaUrl)`. Se o usuário recarregar a página, compartilhar o link ou inspecionar o histórico, o token não está exposto.                                                                           |
| **6**  | **Autorização de aluno matriculado**             |           **OK**           | `docs/fase1/stream.js`<br>Linha 118                                                      | A query de autorização executa `SELECT 'matriculado' AS motivo FROM matriculas WHERE usuario_id = $1 AND curso_id = $2`. Preserva 100% o direito de acesso do aluno legitimamente matriculado no curso.                                                                                                                                                                                                       |
| **7**  | **Autorização de mentor proprietário**           |           **OK**           | `docs/fase1/stream.js`<br>Linha 120                                                      | Adicionada cláusula `UNION SELECT 'mentor_dono' AS motivo FROM cursos WHERE id = $2 AND mentor_id = $1`. Corrige a falha legada onde o mentor recebia `HTTP 403` ao testar e pré-visualizar as aulas de seu próprio curso no painel.                                                                                                                                                                          |
| **8**  | **Autorização de administrador**                 |           **OK**           | `docs/fase1/stream.js`<br>Linha 122                                                      | Adicionada cláusula `UNION SELECT 'admin' AS motivo FROM usuarios WHERE id = $1 AND role = 'admin'`. Permite que administradores da plataforma auditem os vídeos sem necessidade de matrícula artificial.                                                                                                                                                                                                     |
| **9**  | **Consulta real de video_path**                  |           **OK**           | `docs/fase1/stream.js`<br>Linhas 94-99, 135                                              | O endpoint consulta a tabela `aulas` com `SELECT id, curso_id, video_type, video_path, video_url, titulo FROM aulas WHERE id = $1`. O valor de `video_path` gravado no banco (ex.: `37/pending-uuid.mp4`) é extraído e enviado à função de resolução segura.                                                                                                                                                  |
| **10** | **Consulta real de video_type**                  |           **OK**           | `docs/fase1/stream.js`<br>Linhas 95, 135, 151                                            | O streaming local verifica estritamente `if (aula && aula.video_type === 'local' && aula.video_path)`. Se a aula for cadastrada como `youtube`, `onedrive` ou `upload`, a rota não tenta ler arquivo local e orienta o cliente a usar a URL direta.                                                                                                                                                           |
| **11** | **Proteção contra path traversal**               |           **OK**           | `docs/fase1/stream.js`<br>Linhas 40-73                                                   | A função `resolverCaminhoSeguro(videoPath)` sanitiza barras invertidas, aplica regex de formato esperado (`^[0-9]+\/[a-zA-Z0-9_\-\.]+\.mp4$`), resolve o caminho com `path.resolve(BASE_VIDEOS_DIR, sanitizedPath)` e trava com `resolved.startsWith(baseComSeparador)`. Se houver escape de diretório (ex.: `../../etc/passwd`), lança exceção com `statusCode = 403` e emite alerta de violação no console. |
| **12** | **Suporte HTTP Range**                           |           **OK**           | `docs/fase1/stream.js`<br>Linhas 165-190                                                 | O header `req.headers.range` é lido, processado para extrair `start` e `end`. Se o intervalo for inválido, responde `416 Range Not Satisfiable` com `Content-Range: bytes */fileSize`. Se válido, cria `fs.createReadStream(videoFilePath, { start, end })`.                                                                                                                                                  |
| **13** | **Resposta 206**                                 |           **OK**           | `docs/fase1/stream.js`<br>Linhas 180-189                                                 | Ao responder fatias de bytes com Range, o stream emite cabeçalhos canônicos: `206 Partial Content`, `Content-Range: bytes start-end/fileSize`, `Accept-Ranges: bytes`, `Content-Length: chunksize`, `Content-Type: video/mp4` e faz `file.pipe(res)`.                                                                                                                                                         |
| **14** | **Fallback da aula 27**                          | **Ajustado nesta revisão** | `docs/fase1/stream.js`<br>Linhas 28-30, 103-110, 144-162                                 | Endurecido conforme determinação textual do operador: o fallback dispara **SOMENTE E EXCLUSIVAMENTE** quando `aulaId === 27`. Qualquer outra aula sem `video_path` retorna `HTTP 400` com erro claro e detalhado. Nenhuma aula nova reproduzirá acidentalmente o vídeo da aula 27.                                                                                                                            |
| **15** | **Tratamento de arquivo inexistente**            |           **OK**           | `docs/fase1/stream.js`<br>Linhas 164-172                                                 | O caminho físico resolvido é checado com `fs.existsSync(videoFilePath)`. Se o arquivo MP4 não existir no disco da VPS, responde `HTTP 404 Not Found` com `{ error: 'Arquivo de vídeo não encontrado no servidor de arquivos.', aula_id: aulaId }`, evitando crash do processo Node.                                                                                                                           |
| **16** | **Compatibilidade com o frontend atual**         |           **OK**           | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 1-1900                             | O arquivo é 100% autônomo (HTML + CSS + JS inline), zero dependência de npm/build step, servido diretamente na rota estática `/painel` do Express. Preserva os elementos esperados pelo fluxo de SSO (`/painel?token=...`), consome as mesmas entidades de banco e não quebra integrações existentes.                                                                                                         |
| **17** | **Compatibilidade com os quatro tipos de vídeo** |           **OK**           | `docs/fase1/NOVO_PAINEL/painel-mentor.html`<br>Linhas 944-972, 1642-1708                 | O player implementa chaveamento dinâmico automático com badges visuais específicos: 1) `local` (reproduz via `<video>` chamando `/stream/:aulaId`); 2) `youtube` (renderiza `<iframe>` com `youtube-nocookie.com/embed/{id}`); 3) `onedrive` (reproduz via `<video src="{aula.video_url}">`); 4) `upload`/`cloudinary` (reproduz via `<video src="{aula.video_url}">`).                                       |

---

## 3. ENDPOINTS REAIS UTILIZADOS PELO NOVO PAINEL DO MENTOR

Conforme levantamento estrutural da Fase 0 (`docs/RELATORIO_FASE_0_MENTOR.md`), o novo painel estático (`painel-mentor.html`) conecta-se exclusivamente aos seguintes endpoints da API backend em Node.js/Express:

1. **`GET /mentor/cursos`**
   - **Arquivo Backend:** `src/routes/mentor.js`
   - **Função no Painel:** Carrega a lista de cursos de propriedade do mentor autenticado para preencher o seletor principal (`#selectCursoMentor`).
2. **`GET /mentor/cursos/:id/etapas`**
   - **Arquivo Backend:** `src/routes/etapas.js`
   - **Função no Painel:** Carrega todas as aulas e etapas ordenadas do curso selecionado, renderizando a Matriz Curricular lateral e calculando a barra de progresso.
3. **`GET /mentor/cursos/:id/provas`**
   - **Arquivo Backend:** `src/routes/provas.js`
   - **Função no Painel:** Carrega as avaliações e questionários cadastrados para o curso, exibindo os badges de "Quiz" na lista de aulas e os cards na aba "Avaliações / Quizzes".
4. **`POST /mentor/cursos/:id/etapas`**
   - **Arquivo Backend:** `src/routes/etapas.js`
   - **Função no Painel:** Criação de nova aula/etapa com metadados de título, tipo (`video`, `slide`, `imagem`), tipo de vídeo (`local`, `youtube`, `onedrive`, `upload`), URL externa e material complementar em PDF.
5. **`POST /mentor/cursos/upload-video-vps`**
   - **Arquivo Backend:** `src/routes/mentor.js`
   - **Função no Painel:** Upload direto via `multipart/form-data` do arquivo de vídeo MP4 para gravação no volume persistente da VPS (`/srv/cursos/videos/{curso_id}/`).
6. **`GET /stream/:aulaId`**
   - **Arquivo Backend:** `src/routes/stream.js`
   - **Função no Painel:** Endpoint de streaming com suporte a Range bytes e autorização mista (aluno/mentor/admin) invocado pela tag `<video>` do player para aulas do tipo `local`.

---

## 4. DETALHAMENTO DOS ENDURECIMENTOS APLICADOS

### 4.1. Endurecimento 1: Fallback Estrito da Aula 27 no `stream.js`

- **Exigência do Operador:** _"O fallback da aula 27 não pode ser genérico. Ele só pode ocorrer para o registro legado explicitamente identificado. Para aulas novas sem video_path, retornar erro claro e não reproduzir automaticamente o vídeo de outra aula."_
- **Ajuste Realizado:**
  1. A checagem de fallback agora exige explicitamente `aulaId === 27`.
  2. Foi removida qualquer possibilidade de indexação dinâmica do objeto `FALLBACK_LOCAL_VIDEO_FILES` com IDs arbitrários.
  3. Caso uma aula exista no banco de dados e tenha `video_type === 'local'`, mas seu `video_path` esteja nulo ou vazio (aula nova ainda sem upload concluído), a rota retorna:
     ```json
     {
       "error": "Vídeo local não processado ou video_path não definido para esta aula. Faça o upload do arquivo MP4 antes da reprodução.",
       "aula_id": 123,
       "video_type": "local"
     }
     ```
  4. Nenhuma aula com ID diferente de 27 consegue acionar o fallback do arquivo `/app/videos/37/aula-27.mp4`.

### 4.2. Endurecimento 2: Ciclo de Vida do Token em Query String no `painel-mentor.html`

- **Exigência do Operador:** _"O token recebido por query string deve ser tratado como mecanismo de transição. Após ser consumido: 1. validar o token; 2. criar a sessão necessária; 3. remover o token da URL com history.replaceState; 4. não registrar o token em logs; 5. não enviar o token em links; 6. não mantê-lo na URL durante a navegação."_
- **Ajuste Realizado:**
  1. **Validação prévia:** Função `validarFormatoToken` checa se o valor possui estrutura JWT de três partes base64url (`header.payload.signature`) antes de aceitá-lo.
  2. **Criação de Sessão:** O token é armazenado em `sessionStorage` e `localStorage` sob a chave `cursos_token`.
  3. **Remoção da URL:** `urlParams.delete('token')` remove o parâmetro e `window.history.replaceState({}, document.title, novaUrl)` substitui a barra de endereços do navegador imediatamente.
  4. **Sem logs:** Nenhuma chamada a `console.log`, `console.info` ou `console.error` emite o valor do token.
  5. **Sem links com token:** Todos os links de navegação interna e downloads utilizam rotas relativas limpas sem repassar o token na query string.
  6. **Não persistência na URL:** Toda navegação subsequente de abas ou recarregamento consome o token da sessão protegida no cliente.

---

## 5. CONCLUSÃO DA REVISÃO

Todos os 17 itens foram auditados, com 15 itens validados como `OK` e 2 itens `Ajustados nesta revisão` conforme as ordens literais do operador. Os arquivos `docs/fase1/stream.js` e `docs/fase1/NOVO_PAINEL/painel-mentor.html` encontram-se prontos e consolidados para a etapa de verificação de integridade e homologação.
