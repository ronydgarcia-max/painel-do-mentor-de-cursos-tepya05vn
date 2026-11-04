import { sha256String } from './sha256Pure'

import streamDocsRaw from '../../docs/fase1/stream.js?raw'
import streamPublicRaw from '../../public/docs/fase1/stream.js?raw'
import painelDocsRaw from '../../docs/fase1/NOVO_PAINEL/painel-mentor.html?raw'
import painelPublicRaw from '../../public/docs/fase1/NOVO_PAINEL/painel-mentor.html?raw'
import integracaoDocsRaw from '../../docs/fase1/INTEGRACAO_FASE1.md?raw'
import integracaoPublicRaw from '../../public/docs/fase1/INTEGRACAO_FASE1.md?raw'
import propostaDocsRaw from '../../docs/fase1/PROPOSTA_PROVAS.md?raw'
import propostaPublicRaw from '../../public/docs/fase1/PROPOSTA_PROVAS.md?raw'
import revisaoDocsRaw from '../../docs/fase1/REVISAO_FASE1.md?raw'
import revisaoPublicRaw from '../../public/docs/fase1/REVISAO_FASE1.md?raw'
import testeDocsRaw from '../../docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md?raw'
import testePublicRaw from '../../public/docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md?raw'
import testarScriptDocsRaw from '../../docs/operacoes/testar-fase1-vps.sh?raw'
import testarScriptPublicRaw from '../../public/docs/operacoes/testar-fase1-vps.sh?raw'
import aplicarScriptDocsRaw from '../../docs/operacoes/aplicar-fase1-vps.sh?raw'
import aplicarScriptPublicRaw from '../../public/docs/operacoes/aplicar-fase1-vps.sh?raw'
import instalarScriptDocsRaw from '../../docs/operacoes/instalar-fase1.sh?raw'
import instalarScriptPublicRaw from '../../public/docs/operacoes/instalar-fase1.sh?raw'
import verificacaoDocsRaw from '../../docs/fase1/VERIFICACAO_ARTEFATOS.md?raw'
import verificacaoPublicRaw from '../../public/docs/fase1/VERIFICACAO_ARTEFATOS.md?raw'

export const HASHES_CALCULADOS_DETERMINISTICOS = {
  streamDocs: sha256String(streamDocsRaw),
  streamPublic: sha256String(streamPublicRaw),
  painelDocs: sha256String(painelDocsRaw),
  painelPublic: sha256String(painelPublicRaw),
  integracaoDocs: sha256String(integracaoDocsRaw),
  integracaoPublic: sha256String(integracaoPublicRaw),
  propostaDocs: sha256String(propostaDocsRaw),
  propostaPublic: sha256String(propostaPublicRaw),
  revisaoDocs: sha256String(revisaoDocsRaw),
  revisaoPublic: sha256String(revisaoPublicRaw),
  testeDocs: sha256String(testeDocsRaw),
  testePublic: sha256String(testePublicRaw),
  testarScriptDocs: sha256String(testarScriptDocsRaw),
  testarScriptPublic: sha256String(testarScriptPublicRaw),
  aplicarScriptDocs: sha256String(aplicarScriptDocsRaw),
  aplicarScriptPublic: sha256String(aplicarScriptPublicRaw),
  instalarScriptDocs: sha256String(instalarScriptDocsRaw),
  instalarScriptPublic: sha256String(instalarScriptPublicRaw),
  verificacaoDocs: sha256String(verificacaoDocsRaw),
  verificacaoPublic: sha256String(verificacaoPublicRaw),
}
