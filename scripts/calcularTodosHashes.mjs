import fs from 'node:fs'
import crypto from 'node:crypto'

const arquivos = [
  'docs/fase1/stream.js',
  'public/docs/fase1/stream.js',
  'docs/fase1/NOVO_PAINEL/painel-mentor.html',
  'public/docs/fase1/NOVO_PAINEL/painel-mentor.html',
  'docs/fase1/INTEGRACAO_FASE1.md',
  'public/docs/fase1/INTEGRACAO_FASE1.md',
  'docs/fase1/PROPOSTA_PROVAS.md',
  'public/docs/fase1/PROPOSTA_PROVAS.md',
  'docs/fase1/REVISAO_FASE1.md',
  'public/docs/fase1/REVISAO_FASE1.md',
  'docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md',
  'public/docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md',
  'docs/operacoes/testar-fase1-vps.sh',
  'public/docs/operacoes/testar-fase1-vps.sh',
  'docs/operacoes/aplicar-fase1-vps.sh',
  'public/docs/operacoes/aplicar-fase1-vps.sh',
  'docs/operacoes/instalar-fase1.sh',
  'public/docs/operacoes/instalar-fase1.sh',
  'docs/fase1/VERIFICACAO_ARTEFATOS.md',
  'public/docs/fase1/VERIFICACAO_ARTEFATOS.md'
]

const resultados = {}
for (const arq of arquivos) {
  if (fs.existsSync(arq)) {
    const bytes = fs.readFileSync(arq)
    const hash = crypto.createHash('sha256').update(bytes).digest('hex')
    resultados[arq] = { hash, size: bytes.length }
  } else {
    resultados[arq] = { error: 'NOT_FOUND' }
  }
}

fs.writeFileSync('scripts/resultados-hashes.json', JSON.stringify(resultados, null, 2))
console.log('Resultados salvos em scripts/resultados-hashes.json')
