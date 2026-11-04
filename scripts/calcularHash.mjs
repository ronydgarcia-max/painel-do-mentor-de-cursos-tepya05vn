import fs from 'node:fs'
import crypto from 'node:crypto'

const caminho = 'docs/operacoes/testar-fase1-vps.sh'
const conteudo = fs.readFileSync(caminho)
const hash = crypto.createHash('sha256').update(conteudo).digest('hex')
console.log('SHA256 testar-fase1-vps.sh:', hash)
console.log('Tamanho em bytes:', conteudo.length)
