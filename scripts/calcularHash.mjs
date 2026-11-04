import fs from 'node:fs'
import crypto from 'node:crypto'

const caminhoDocs = 'docs/operacoes/testar-fase1-vps.sh'
const caminhoPublic = 'public/docs/operacoes/testar-fase1-vps.sh'

const bytesDocs = fs.readFileSync(caminhoDocs)
const bytesPublic = fs.readFileSync(caminhoPublic)

const hashDocs = crypto.createHash('sha256').update(bytesDocs).digest('hex')
const hashPublic = crypto.createHash('sha256').update(bytesPublic).digest('hex')

console.log('SHA256 docs/operacoes/testar-fase1-vps.sh:  ', hashDocs)
console.log('SHA256 public/operacoes/testar-fase1-vps.sh:', hashPublic)
console.log('Tamanho em bytes (docs):  ', bytesDocs.length)
console.log('Tamanho em bytes (public):', bytesPublic.length)
console.log('Byte-idênticos:', bytesDocs.equals(bytesPublic))

if (hashDocs !== '2773fcbb1121fef3a92c9144ac9adf74f9fcb23f024979f6590d9174679be96f') {
  throw new Error(`DIVERGENCIA docs: ${hashDocs}`)
}
if (hashPublic !== '2773fcbb1121fef3a92c9144ac9adf74f9fcb23f024979f6590d9174679be96f') {
  throw new Error(`DIVERGENCIA public: ${hashPublic}`)
}
