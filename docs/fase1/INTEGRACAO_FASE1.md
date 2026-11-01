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

### Passo 3: Criar cópias de segurança locais antes de sobrescrever

```bash
cp src/routes/stream.js src/routes/stream.js.bak.fase1
cp src/static/painel-mentor.html src/static/painel-mentor.html.bak.fase1
```

### Passo 4: Transferir e copiar os novos arquivos

Copiar o conteúdo dos artefatos do workspace para as respectivas pastas no repositório real:

- `docs/fase1/stream.js` ➔ `/root/cursos-api/src/routes/stream.js`
- `docs/fase1/NOVO_PAINEL/painel-mentor.html` ➔ `/root/cursos-api/src/static/painel-mentor.html`
- Manter uma pasta `docs/fase1/` no repositório com os relatórios de auditoria para fins de rastreabilidade.

---

## 5. VALIDAÇÃO SINTÁTICA LOCAL NA VPS

Antes de commitar ou acionar rebuild, valide a sintaxe do arquivo JavaScript substituído:

```bash
# Validação sintática do arquivo Node.js
node -c src/routes/stream.js
# Saída esperada: Silenciosa (Exit code 0). Qualquer erro de sintaxe interrompe o processo aqui.

# Validação do checksum SHA-256 (opcional, para conferir integridade da transferência)
sha256sum src/routes/stream.js src/static/painel-mentor.html
```

---

## 6. COMMIT, PUSH E REBUILD DO CURSOS-API NO EASYPANEL

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

## 7. HEALTH CHECK E TESTES FUNCIONAIS

### 7.1. Health Check Imediato

```bash
# Verificar logs do container ativo
docker logs -f --tail 50 $(docker ps --format '{{.Names}}' | grep -i 'cursos-api' | head -n 1)

# Health check local via loopback
curl -I http://127.0.0.1:3333/
# Deve retornar HTTP 200/302 sem erros 502/503
```

### 7.2. Bateria de Testes Funcionais Obrigatórios

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

## 8. PLANO DE ROLLBACK RÁPIDO

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

## 9. CRITÉRIO DE APROVAÇÃO FINAL

A homologação da Fase 1 será considerada formalmente **APROVADA** quando, e somente quando:

1. O serviço `Cursos-API` estiver respondendo com status 200 no health check;
2. Todos os 8 testes funcionais acima descritos passarem com sucesso;
3. O novo painel estático carregar o layout 16:9 + matriz curricular em desktop e celular;
4. Nenhum log de erro não tratado (500) for observado no container do `Cursos-API`;
5. O operador registrar formalmente a aprovação para encerramento da Fase 1.
