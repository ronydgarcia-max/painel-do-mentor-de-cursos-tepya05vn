import { sha256String } from './sha256Pure'
import painelDocsRaw from '../../docs/fase1/NOVO_PAINEL/painel-mentor.html?raw'
import integracaoDocsRaw from '../../docs/fase1/INTEGRACAO_FASE1.md?raw'
import propostaDocsRaw from '../../docs/fase1/PROPOSTA_PROVAS.md?raw'
import revisaoDocsRaw from '../../docs/fase1/REVISAO_FASE1.md?raw'
import testeDocsRaw from '../../docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md?raw'
import aplicarScriptDocsRaw from '../../docs/operacoes/aplicar-fase1-vps.sh?raw'
import instalarScriptDocsRaw from '../../docs/operacoes/instalar-fase1.sh?raw'

// Mapeamento dos primeiros 12 caracteres hex
export const PREFIXOS_12 = {
  painel: sha256String(painelDocsRaw).slice(0, 12),
  integracao: sha256String(integracaoDocsRaw).slice(0, 12),
  proposta: sha256String(propostaDocsRaw).slice(0, 12),
  revisao: sha256String(revisaoDocsRaw).slice(0, 12),
  teste: sha256String(testeDocsRaw).slice(0, 12),
  aplicar: sha256String(aplicarScriptDocsRaw).slice(0, 12),
  instalar: sha256String(instalarScriptDocsRaw).slice(0, 12),
}
