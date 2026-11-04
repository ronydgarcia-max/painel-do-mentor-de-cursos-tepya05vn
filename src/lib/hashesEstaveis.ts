import { sha256String } from './sha256Pure'
import streamDocsRaw from '../../docs/fase1/stream.js?raw'
import painelDocsRaw from '../../docs/fase1/NOVO_PAINEL/painel-mentor.html?raw'
import integracaoDocsRaw from '../../docs/fase1/INTEGRACAO_FASE1.md?raw'
import propostaDocsRaw from '../../docs/fase1/PROPOSTA_PROVAS.md?raw'
import revisaoDocsRaw from '../../docs/fase1/REVISAO_FASE1.md?raw'
import testeDocsRaw from '../../docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md?raw'
import aplicarScriptDocsRaw from '../../docs/operacoes/aplicar-fase1-vps.sh?raw'
import instalarScriptDocsRaw from '../../docs/operacoes/instalar-fase1.sh?raw'

export const HASHES_ESTAVEIS = {
  stream: sha256String(streamDocsRaw),
  painel: sha256String(painelDocsRaw),
  integracao: sha256String(integracaoDocsRaw),
  proposta: sha256String(propostaDocsRaw),
  revisao: sha256String(revisaoDocsRaw),
  teste: sha256String(testeDocsRaw),
  aplicarScript: sha256String(aplicarScriptDocsRaw),
  instalarScript: sha256String(instalarScriptDocsRaw),
}
