import { sha256String } from './sha256Pure'
import streamDocsRaw from '../../docs/fase1/stream.js?raw'
import painelDocsRaw from '../../docs/fase1/NOVO_PAINEL/painel-mentor.html?raw'
import integracaoDocsRaw from '../../docs/fase1/INTEGRACAO_FASE1.md?raw'
import propostaDocsRaw from '../../docs/fase1/PROPOSTA_PROVAS.md?raw'
import revisaoDocsRaw from '../../docs/fase1/REVISAO_FASE1.md?raw'
import testeDocsRaw from '../../docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md?raw'
import testarScriptDocsRaw from '../../docs/operacoes/testar-fase1-vps.sh?raw'
import aplicarScriptDocsRaw from '../../docs/operacoes/aplicar-fase1-vps.sh?raw'

const hStream = sha256String(streamDocsRaw)
const hPainel = sha256String(painelDocsRaw)
const hIntegracao = sha256String(integracaoDocsRaw)
const hProposta = sha256String(propostaDocsRaw)
const hRevisao = sha256String(revisaoDocsRaw)
const hTeste = sha256String(testeDocsRaw)
const hTestarScript = sha256String(testarScriptDocsRaw)
const hAplicarScript = sha256String(aplicarScriptDocsRaw)

const streamIs6caf: true =
  hStream === '6caf954f02dc65623d6eaeb3e73866dec3147bd0d94e8d2e5c027cc291802fd2'
    ? true
    : (`STREAM_ERR_${hStream}` as never)
const painelIsB9c3: true =
  hPainel === 'b9c3c701fd9e2e5bc51b619366b79c0223372fbff854a04aacd3c3f6f34d11d8'
    ? true
    : (`PAINEL_ERR_${hPainel}` as never)
const integracaoIs3908: true =
  hIntegracao === '3908e3bb777637df2e6855f2e7ec61891116d041eef56fae0b4a96c21835f7a6'
    ? true
    : (`INTEGRACAO_ERR_${hIntegracao}` as never)
const propostaIs16df: true =
  hProposta === '16dfff6134df7caeeace571f004299fde6b27b3aebf0c2cd1772a1c04a011241'
    ? true
    : (`PROPOSTA_ERR_${hProposta}` as never)
const revisaoIsE16c: true =
  hRevisao === 'e16ce2583cfd7e123b09345bdb09f5403de3d94267a1ace66a1cb65901478666'
    ? true
    : (`REVISAO_ERR_${hRevisao}` as never)
const testeIs6539: true =
  hTeste === '653969c14ae98552de58ed388b3eee788e8bba78e0e6109b6e13acb8ccc5a354'
    ? true
    : (`TESTE_ERR_${hTeste}` as never)
const testarScriptIs92d4: true =
  hTestarScript === '92d48bc9207c6f394f42436d3e190135489983520719ec95d4f440eee4d97078'
    ? true
    : (`TESTAR_ERR_${hTestarScript}` as never)
const aplicarScriptIsB08a: true =
  hAplicarScript === 'b08abe53ac5d36a5e7f7e67b34a5e8a92541f4353c5107de1898bebb1f591193'
    ? true
    : (`APLICAR_ERR_${hAplicarScript}` as never)

export const CHECAGEM_CONFIRMADA = {
  streamIs6caf,
  painelIsB9c3,
  integracaoIs3908,
  propostaIs16df,
  revisaoIsE16c,
  testeIs6539,
  testarScriptIs92d4,
  aplicarScriptIsB08a,
}
