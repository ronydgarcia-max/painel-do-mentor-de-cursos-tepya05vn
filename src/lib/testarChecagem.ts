import { sha256String } from './sha256Pure'
import testarDocsRaw from '../../docs/operacoes/testar-fase1-vps.sh?raw'
import testarPublicRaw from '../../public/docs/operacoes/testar-fase1-vps.sh?raw'

const hDocs = sha256String(testarDocsRaw)
const hPublic = sha256String(testarPublicRaw)

const testarIs92d4: true = (hDocs === '92d48bc9207c6f394f42436d3e190135489983520719ec95d4f440eee4d97078') ? true : (`DOCS_ERR_${hDocs}` as never)
const publicIs92d4: true = (hPublic === '92d48bc9207c6f394f42436d3e190135489983520719ec95d4f440eee4d97078') ? true : (`PUBLIC_ERR_${hPublic}` as never)

export const CHECAGEM_TESTAR = { testarIs92d4, publicIs92d4 }
