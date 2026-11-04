import { sha256String } from './sha256Pure'
import painelDocsRaw from '../../docs/fase1/NOVO_PAINEL/painel-mentor.html?raw'
import integracaoDocsRaw from '../../docs/fase1/INTEGRACAO_FASE1.md?raw'
import propostaDocsRaw from '../../docs/fase1/PROPOSTA_PROVAS.md?raw'
import revisaoDocsRaw from '../../docs/fase1/REVISAO_FASE1.md?raw'
import testeDocsRaw from '../../docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md?raw'
import aplicarScriptDocsRaw from '../../docs/operacoes/aplicar-fase1-vps.sh?raw'
import instalarScriptDocsRaw from '../../docs/operacoes/instalar-fase1.sh?raw'

// Verificações dos hashes com valores de VERIFICACAO_ARTEFATOS.md
export const CONFERENCIA_VERIFICACAO_ARTEFATOS = {
  painel:
    sha256String(painelDocsRaw) ===
    'c22421379ecbeaf19cc30e9d56286fa6c5471a2a4669fcf7fd10b3ef773d1000',
  integracao:
    sha256String(integracaoDocsRaw) ===
    'e1bd171b9c788647ba3f86b772bd2c6428795e1eb2fe4e8c199042b3bfb084cc',
  proposta:
    sha256String(propostaDocsRaw) ===
    'c223c2182fc60f64c632832877bc9ea0b571161d763cc08e5e6e8bf834661005',
  revisao:
    sha256String(revisaoDocsRaw) ===
    '95d36e84d436ec037b51b7f94bb1a196fc9fe4cf8fa3b7a149a463c7849e75eb',
  teste:
    sha256String(testeDocsRaw) ===
    '489d81d227b686e58b15d2a71d7a31b6727c62f2de938a16aa475e533c393bc6',
  aplicar:
    sha256String(aplicarScriptDocsRaw) ===
    '8c16d56df825cc2dc1e60f7e4be7aa0aa7c981989ea1c2ef36e814fd5be1bfa6',
  instalar:
    sha256String(instalarScriptDocsRaw) ===
    '23efd625aa6de9e01768686f0f5b11eb080a845ea0f71fc0f074d3dc6fdeca29',
}
