import { sha256String } from './sha256Pure'
import painelDocsRaw from '../../docs/fase1/NOVO_PAINEL/painel-mentor.html?raw'
import integracaoDocsRaw from '../../docs/fase1/INTEGRACAO_FASE1.md?raw'
import propostaDocsRaw from '../../docs/fase1/PROPOSTA_PROVAS.md?raw'
import revisaoDocsRaw from '../../docs/fase1/REVISAO_FASE1.md?raw'
import testeDocsRaw from '../../docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md?raw'
import aplicarScriptDocsRaw from '../../docs/operacoes/aplicar-fase1-vps.sh?raw'
import instalarScriptDocsRaw from '../../docs/operacoes/instalar-fase1.sh?raw'

// Inspeciona os hashes
export function verificarHash(nome: string, valorEsperado: string): boolean {
  switch (nome) {
    case 'painel': return sha256String(painelDocsRaw) === valorEsperado
    case 'integracao': return sha256String(integracaoDocsRaw) === valorEsperado
    case 'proposta': return sha256String(propostaDocsRaw) === valorEsperado
    case 'revisao': return sha256String(revisaoDocsRaw) === valorEsperado
    case 'teste': return sha256String(testeDocsRaw) === valorEsperado
    case 'aplicar': return sha256String(aplicarScriptDocsRaw) === valorEsperado
    case 'instalar': return sha256String(instalarScriptDocsRaw) === valorEsperado
    default: return false
  }
}
