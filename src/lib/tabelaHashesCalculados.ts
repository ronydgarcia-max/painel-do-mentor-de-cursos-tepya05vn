import { sha256String } from './sha256Pure'
import painelDocsRaw from '../../docs/fase1/NOVO_PAINEL/painel-mentor.html?raw'
import integracaoDocsRaw from '../../docs/fase1/INTEGRACAO_FASE1.md?raw'
import propostaDocsRaw from '../../docs/fase1/PROPOSTA_PROVAS.md?raw'
import revisaoDocsRaw from '../../docs/fase1/REVISAO_FASE1.md?raw'
import testeDocsRaw from '../../docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md?raw'
import aplicarScriptDocsRaw from '../../docs/operacoes/aplicar-fase1-vps.sh?raw'
import instalarScriptDocsRaw from '../../docs/operacoes/instalar-fase1.sh?raw'

// Tabela de hashes calculados deterministicamente
export const HASH_DETERMINISTICO_PAINEL = sha256String(painelDocsRaw)
export const HASH_DETERMINISTICO_INTEGRACAO = sha256String(integracaoDocsRaw)
export const HASH_DETERMINISTICO_PROPOSTA = sha256String(propostaDocsRaw)
export const HASH_DETERMINISTICO_REVISAO = sha256String(revisaoDocsRaw)
export const HASH_DETERMINISTICO_TESTE = sha256String(testeDocsRaw)
export const HASH_DETERMINISTICO_APLICAR = sha256String(aplicarScriptDocsRaw)
export const HASH_DETERMINISTICO_INSTALAR = sha256String(instalarScriptDocsRaw)
