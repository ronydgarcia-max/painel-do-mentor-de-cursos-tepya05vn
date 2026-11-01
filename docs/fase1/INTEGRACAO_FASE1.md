# GUIA DE INTEGRAÇÃO DA FASE 1 NA VPS — CURSOS-API

**Documento:** `docs/fase1/INTEGRACAO_FASE1.md`  
**Repositório Oficial:** `github.com/ronydgarcia-max/cursos-api`  
**Branch de Trabalho Autorizada:** `correcao-fluxo-cursos`  
**Commit Base Estável:** `47aa7b1`  
**Serviço no EasyPanel:** `Cursos-API`  
**Ponto de Restauração / Backup Confirmado:** `/root/backups/cursos/20261031_195147`  
**Regra Mandatória de Segurança:** ZERO senhas, tokens, chaves ou credenciais em texto puro. Marcador oficial: `[TOKEN_REMOVIDO_E_ROTACIONADO]`.

---

## 1. AVISOS MANDATÓRIOS E ISOLAMENTO DO WORKSPACE

1. **O GoSkip não tem acesso à VPS nem ao GitHub:** Todo o procedimento descrito abaixo é **100% manual e executado exclusivamente pelo operador humano**.
2. **Branch `main` protegida:** Não utilize a branch `main`. Todo o commit e push deve ser direcionado exclusivamente para a branch `correcao-fluxo-cursos`.
3. **Commits do workspace segregados:** Commits gerados neste workspace de prévia são puramente documentais e não devem ser enviados ao GitHub.
4. **Backup prévio confirmado:** O snapshot `/root/backups/cursos/20261031_195147` possui SHA-256 e Redis RDB validados; o rollback NUNCA depende de arquivos dentro do container.
5. **Ordem de deploy vinculada:** Os dois arquivos centrais (`painel-mentor.html` e `stream.js`) **devem ser aplicados e deployados JUNTOS**, para que o novo player no painel consiga reproduzir os vídeos locais sem erro 403.

---

## 2. ARQUIVOS ENTREGUES NO WORKSPACE PRONTOS PARA CÓPIA

| Arquivo no Workspace                        | Destino no Repositório Real (`/root/cursos-api`) | Papel Técnico                                                                                    |
| :------------------------------------------ | :----------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| `docs/fase1/stream.js`                      | `src/routes/stream.js`                           | Substituto com consulta dinâmica, trava de path traversal, auth mentor/admin e fallback aula 27  |
| `docs/fase1/NOVO_PAINEL/painel-mentor.html` | `src/static/painel-mentor.html`                  | Novo painel estático completo em arquivo único com o layout do mock, responsivo e sem build step |
| `docs/fase1/PROPOSTA_PROVAS.md`             | `docs/fase1/PROPOSTA_PROVAS.md`                  | Documentação técnica dos 4 achados de `provas.js` (sem aplicar no código)                        |
| `docs/fase1/INTEGRACAO_FASE1.md`            | `docs/fase1/INTEGRACAO_FASE1.md`                 | Este guia operacional passo a passo                                                              |

---

## 3. PASSO A PASSO DA APLICAÇÃO NA VPS

### Passo 1: Acessar a VPS e navegar até o repositório

```bash
ssh root@<IP_DA_VPS>
cd /root/cursos-api
```

### Passo 2: Garantir que está na branch correta sobre a base `47aa7b1`

```bash
# Verificar status atual
git status

# Garantir checkout da branch homologada
git checkout correcao-fluxo-cursos

# Confirmar que a base é 47aa7b1
git log -1 --oneline
# Deve exibir commit base 47aa7b1
```

### Passo 3: Criar cópias de segurança locais antes de sobrescrever

```bash
cp src/routes/stream.js src/routes/stream.js.bak.fase1
cp src/static/painel-mentor.html src/static/painel-mentor.html.bak.fase1
```

### Passo 4: Aplicar os arquivos entregues

Copiar os arquivos gerados no workspace para os caminhos correspondentes:

- Copiar o conteúdo de `docs/fase1/stream.js` para `/root/cursos-api/src/routes/stream.js`.
- Copiar o conteúdo de `docs/fase1/NOVO_PAINEL/painel-mentor.html` para `/root/cursos-api/src/static/painel-mentor.html`.

### Passo 5: Testar sintaxe Node.js localmente na VPS

```bash
node -c src/routes/stream.js
# Deve retornar silenciosamente sem erros de sintaxe (Exit code 0)
```

### Passo 6: Criar commit semântico e rastreável

```bash
git add src/routes/stream.js src/static/painel-mentor.html
git commit -m "feat(mentor): implementa novo painel estatico e streaming dinamico seguro (Fase 1)"
```

### Passo 7: Enviar para o GitHub na branch autorizada

```bash
git push origin correcao-fluxo-cursos
# NUNCA fazer push para a branch main
```

### Passo 8: Rebuild do serviço Cursos-API no EasyPanel

1. Acessar o EasyPanel no navegador (`https://<EASYPANEL_HOST>`).
2. Abrir o projeto `cursos-api`.
3. Selecionar o serviço `Cursos-API`.
4. Clicar no botão **Rebuild / Redeploy** utilizando a branch `correcao-fluxo-cursos`.

### Passo 9: Acompanhar logs e executar Health Check

```bash
# Acompanhar logs do container no host
docker logs -f --tail 100 $(docker ps --format '{{.Names}}' | grep -i 'cursos-api' | head -n 1)

# Health check local
curl -I http://127.0.0.1:3333/
# Deve responder sem erro 502/503
```

---

## 4. CHECKLIST DOS 8 TESTES PLANEJADOS DA FASE 1

O operador deve executar e validar os 8 testes abaixo antes de declarar a homologação concluída:

### Teste 1: Autenticação e Extração de Token

- **Ação:** Acessar o novo painel via navegador em `https://<DOMINIO>/painel?token=<JWT_MENTOR>` e verificar se o badge superior exibe "Mentor Ativo" e lista os cursos reais.
- **Critério:** Token extraído com sucesso, persistido em localStorage e query string sanitizada da barra de endereços.

### Teste 2: Isolamento de Mentor

- **Ação:** Tentar requisitar `/mentor/cursos/<CURSO_DE_OUTRO_MENTOR>/etapas` usando o token do mentor.
- **Critério:** Retorno HTTP `403 Forbidden` ou `404 Not Found`. Nenhum dado de outro mentor é exposto.

### Teste 3: Upload de Vídeo VPS (Volume Persistente)

- **Ação:** Na aba "Gestão de Aulas & Upload VPS" do novo painel, selecionar um arquivo MP4 de teste e disparar o envio.
- **Critério:** Arquivo gravado em `/srv/cursos/videos/{curso_id}/` no host (correspondente a `/app/videos/{curso_id}/` no container). Resposta 200 com JSON contendo `video_path`.

### Teste 4: Streaming Local Dinâmico com HTTP Range (Aula Diferente da 27)

- **Ação:** Requisição com Range bytes para uma aula recém-cadastrada com vídeo local:
  ```bash
  curl -I -H "Range: bytes=0-1048576" -H "Authorization: Bearer <TOKEN>" http://127.0.0.1:3333/stream/<NOVA_AULA_ID>
  ```
- **Critério:** Retorno HTTP `206 Partial Content`, cabeçalho `Content-Range: bytes 0-1048576/...` e `Content-Type: video/mp4`.

### Teste 5: Streaming pelo Mentor Proprietário (Sem Erro 403)

- **Ação:** O mentor acessa o novo player e reproduz sua própria aula sem estar matriculado nela como aluno.
- **Critério:** Vídeo reproduz imediatamente no player. A query SQL `UNION SELECT 1 FROM cursos WHERE id = $2 AND mentor_id = $1` libera o acesso sem 403.

### Teste 6: Proteção Contra Path Traversal

- **Ação:** Teste de injeção direta de caminho relativo malicioso:
  ```bash
  # Simulação interna ou teste com video_path contendo ../../
  ```
- **Critério:** Rejeição imediata com HTTP `400 Bad Request` ou `403 Forbidden` e log de segurança emitido no console: `[STREAM SECURITY VIOLATION]`.

### Teste 7: Moderação Groq AI

- **Ação:** Acionar submissão de curso em rascunho para moderação (`POST /mentor/cursos/:id/enviar-analise`).
- **Critério:** Análise estruturada retornada com `ia_score` e transição segura para `em_analise` ou `aprovado`.

### Teste 8: Bloqueio de Publicação em Curso Não Aprovado

- **Ação:** Tentar publicar curso em status `rascunho` via `PUT /mentor/cursos/:id/publicar`.
- **Critério:** Retorno HTTP `400 Bad Request` informando que apenas cursos com status `aprovado` podem ser publicados.

---

## 5. PLANO DE ROLLBACK RÁPIDO (EM CASO DE ANOMALIA)

Se qualquer um dos 8 testes falhar ou houver instabilidade no serviço Cursos-API:

### A. Reversão Rápida de Código via Git (Menos de 3 minutos)

```bash
cd /root/cursos-api
git checkout 47aa7b1
git clean -fd
```

No EasyPanel, disparar novo **Rebuild** do serviço `Cursos-API`.

### B. Restauração Completa de Emergência (Se Houver Corrupção de Dados ou Mídia)

Conforme documentado em `docs/operacoes/PLANO_ROLLBACK.md`, utilizar o snapshot confirmado pelo operador em `/root/backups/cursos/20261031_195147`:

```bash
# Executar restauração manual guiada
cd /root
./docs/operacoes/restaurar-cursos-vps.sh /root/backups/cursos/20261031_195147
```

**Lembrete:** O rollback não depende de arquivos dentro do container atual, pois todos os dumps e backups residem no host em `/root/backups/cursos/20261031_195147`.

---

## 6. ITENS FORA DO ESCOPO DESTA FATIA

Para manter a integridade operacional e o foco na estabilidade do player e do streaming, os seguintes itens ficam explicitamente fora desta fatia da Fase 1:

1. **Alteração em `src/routes/provas.js`:** Mantida apenas como proposta técnica em `docs/fase1/PROPOSTA_PROVAS.md`. Nenhuma linha do arquivo real é alterada.
2. **Reexecução de migrations:** Nenhuma migration do PostgreSQL deve ser executada (`migration.sql` já foi aplicado na Fase 0).
3. **Edição de Dockerfile ou alteração de imagens:** O runtime Node v20.20.2 já está ativo no container; ajustes estéticos de Dockerfile ficam para rodada específica de infraestrutura.
