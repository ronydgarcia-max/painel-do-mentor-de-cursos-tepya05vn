import { sha256String, sha256Bytes } from './sha256Pure'
import streamDocsRaw from '../../docs/fase1/stream.js?raw'
import streamPublicRaw from '../../public/docs/fase1/stream.js?raw'

const hashDocs = sha256String(streamDocsRaw)
const hashPublic = sha256String(streamPublicRaw)
const enc = new TextEncoder()
const bDocs = enc.encode(streamDocsRaw)
const bPublic = enc.encode(streamPublicRaw)
const hashBytesDocs = sha256Bytes(bDocs)

export const PROVA_HASH = {
  hashDocs,
  hashPublic,
  hashBytesDocs,
  lenDocs: bDocs.length,
  lenPublic: bPublic.length,
  iguais: streamDocsRaw === streamPublicRaw,
}

// Lança erro proposital apenas se houver qualquer divergência interna
if (!PROVA_HASH.iguais || hashDocs !== hashPublic || hashDocs !== hashBytesDocs) {
  throw new Error('Divergência detectada no cálculo SHA-256')
}
