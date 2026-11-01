# POLÍTICA DE SEGURANÇA E SANITIZAÇÃO DE SECRETS (CURSOS-API)

**Documento:** `docs/operacoes/SEGURANCA_SECRETS.md`  
**Escopo:** Diretrizes de segurança da informação, sanitização de relatórios, tratamento de credenciais e procedimentos de rotação para a infraestrutura do projeto Cursos API (Conexão Batista).

---

## 1. REGRA PERMANENTE DE SEGURANÇA

> **REGRA GERAL:**  
> **NUNCA** incluir senhas, tokens de API, chaves privadas, segredos JWT, cookies, cabeçalhos `Authorization` reais ou strings de conexão com credenciais em relatórios, arquivos de documentação, commits do Git ou protótipos deste projeto.
>
> Em qualquer documentação técnica ou inventário de infraestrutura, é expressamente mandatório registrar **apenas o nome da variável de ambiente**, o serviço onde é utilizada, sua finalidade técnica e, se necessário, um exemplo sintético e fictício.

---

## 2. POLÍTICA DE SANITIZAÇÃO E FORMATO PADRÃO

Quando uma credencial for referenciada em documentos operacionais ou quando for detectada menção prévia em histórico de relatórios:

1. **Substituição Obrigatória:** Qualquer valor de credencial real deve ser substituído pelo marcador canônico:
   ```text
   [TOKEN_REMOVIDO_E_ROTACIONADO]
   ```
2. **Classificação e Tratamento de Tokens Rotacionados:** Chaves e tokens rotacionados devem ser taxativamente identificados como:
   ```text
   STATUS: ROTACIONADO PELO OPERADOR (CHAVE ANTIGA REVOGADA)
   MARCADOR: [TOKEN_REMOVIDO_E_ROTACIONADO]
   ```
3. **Proibição de Reprodução:** É estritamente proibido reproduzir, colar ou derivar o valor real da credencial em qualquer arquivo, mesmo que parcialmente mascarado (ex: não utilizar `ey...`, `sec_...`). O novo valor NUNCA deve aparecer em relatórios, commits, arquivos, screenshots ou mensagens.

---

## 3. CONFIRMAÇÃO DA ROTAÇÃO EXECUTADA PELO OPERADOR DA VPS

### Incidente Resolvido: Token de Deploy / Chave API do EasyPanel

- **Diagnóstico:** Em comunicação e relatório técnico preliminar anterior, foi identificado o vazamento de um token de webhook de deploy / API do EasyPanel.
- **Ação Executada no Workspace:**
  - O valor foi completamente removido de todos os arquivos do GoSkip.
  - O marcador `[TOKEN_REMOVIDO_E_ROTACIONADO]` foi inserido no lugar.
- **Ação Concluída pelo Operador da VPS:**
  - O **OPERADOR DA VPS** revogou no painel administrativo do EasyPanel a chave API antiga exposta.
  - O operador gerou uma **NOVA CHAVE** no painel da VPS.
  - O novo segredo é mantido exclusivamente na VPS / EasyPanel e **NUNCA DEVE APARECER** neste workspace.
  - O marcador `[TOKEN_REMOVIDO_E_ROTACIONADO]` é mantido em todos os documentos.
  - **Status:** **CONCLUÍDO E ENCERRADO**.

---

## 4. INVENTÁRIO DE VARIÁVEIS DE AMBIENTE SANITIZADAS

A tabela a seguir consolida as variáveis de ambiente conhecidas nos 4 serviços do EasyPanel, com conformidade estrita de sanitização:

| Variável de Ambiente       | Serviço EasyPanel       | Finalidade Técnica                         | Exemplo Seguro / Fictício                              |
| -------------------------- | ----------------------- | ------------------------------------------ | ------------------------------------------------------ |
| `EASYPANEL_DEPLOY_TOKEN`   | EasyPanel Webhook       | Gatilho HTTP para rebuild do serviço       | `[TOKEN_REMOVIDO_E_ROTACIONADO]`                       |
| `JWT_SECRET`               | Cursos-API              | Assinatura e validação de tokens JWT       | `<NOME_DA_VARIAVEL_NO_EASYPANEL>`                      |
| `MENTOR_JWT_SECRET`        | Cursos-API / SSO        | Validação de tokens de login SSO do mentor | `<NOME_DA_VARIAVEL_NO_EASYPANEL>`                      |
| `CURSOS_API_BRIDGE_SECRET` | Cursos-API              | Proteção da rota `/auth/bridge-login`      | `<NOME_DA_VARIAVEL_NO_EASYPANEL>`                      |
| `POSTGRES_USER`            | PostgreSQL / Cursos-API | Usuário do banco de dados relacional       | `cursos_user`                                          |
| `POSTGRES_PASSWORD`        | PostgreSQL / Cursos-API | Senha do banco de dados relacional         | `<CONFIGURADO_NO_EASYPANEL>`                           |
| `POSTGRES_DB`              | PostgreSQL / Cursos-API | Nome da base de dados principal            | `cursos_db`                                            |
| `DATABASE_URL`             | Cursos-API              | String de conexão com o PostgreSQL         | `postgresql://cursos_user:***@postgres:5432/cursos_db` |
| `REDIS_PASSWORD`           | Redis / Cursos-API      | Senha de autenticação no servidor Redis    | `<CONFIGURADO_NO_EASYPANEL>`                           |
| `REDIS_URL`                | Cursos-API              | String de conexão com o Redis              | `redis://:***@redis:6379`                              |
| `CLOUDINARY_CLOUD_NAME`    | Cursos-API              | Identificador da conta Cloudinary          | `exemplo-cloud`                                        |
| `CLOUDINARY_API_KEY`       | Cursos-API              | Chave pública da API Cloudinary            | `123456789012345`                                      |
| `CLOUDINARY_API_SECRET`    | Cursos-API              | Chave secreta da API Cloudinary            | `<CONFIGURADO_NO_EASYPANEL>`                           |
| `MS_GRAPH_TENANT_ID`       | Cursos-API              | Tenant ID do Azure / Microsoft Graph       | `00000000-0000-0000-0000-000000000000`                 |
| `MS_GRAPH_CLIENT_ID`       | Cursos-API              | Client ID do Azure para OneDrive           | `00000000-0000-0000-0000-000000000000`                 |
| `MS_GRAPH_CLIENT_SECRET`   | Cursos-API              | Client Secret do Azure para OneDrive       | `<CONFIGURADO_NO_EASYPANEL>`                           |
| `GROQ_API_KEY`             | Cursos-API              | Chave da API Groq para moderação por IA    | `<CONFIGURADO_NO_EASYPANEL>`                           |
| `PORT`                     | Cursos-API              | Porta interna do servidor Express          | `3333`                                                 |
| `LOCAL_VIDEO_DIR`          | Cursos-API              | Caminho do volume de vídeos no container   | `/app/videos`                                          |
| `POCKETBASE_URL`           | PocketBase              | URL interna de conexão com o PocketBase    | `http://pocketbase:8090`                               |

---

## 5. PROCEDIMENTO DE AUDITORIA PRÉ-COMMIT

Antes de qualquer commit, deve ser executada varredura por expressões regulares nos arquivos alterados para certificar que nenhum padrão de chave ou credencial está presente:

```bash
grep -rnE "(password|secret|token|bearer|key)\s*[:=]\s*['\"][a-zA-Z0-9_\-\.]{8,}['\"]" docs/ src/
```

Se qualquer correspondência com credencial real for encontrada, o commit deve ser imediatamente abortado e o arquivo sanitizado.
