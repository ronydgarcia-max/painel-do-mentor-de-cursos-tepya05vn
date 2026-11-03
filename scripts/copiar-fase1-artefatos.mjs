/**
 * scripts/copiar-fase1-artefatos.mjs
 *
 * Copia os artefatos oficiais da Fase 1 (docs/fase1/* e docs/operacoes/*) para
 * public/fase1/... preservando os BYTES EXATOS (copyFileSync), para que fiquem
 * baixáveis por caminho público direto na URL da prévia (dev e build do Vite
 * servem public/ na raiz) e o SHA-256 de cada arquivo continue idêntico ao
 * manifesto (docs/fase1/VERIFICACAO_ARTEFATOS.md e src/lib/manifestHelper.ts).
 *
 * Roda automaticamente antes do `vite build` (ver package.json: "build").
 * Nada aqui toca em repositório remoto, commit ou push — é só um espelho local
 * de leitura para download pelo operador.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// [origem no workspace, destino público relativo a public/fase1]
const ARTEFATOS = [
  ['docs/fase1/stream.js', 'docs/fase1/stream.js'],
  ['docs/fase1/NOVO_PAINEL/painel-mentor.html', 'docs/fase1/NOVO_PAINEL/painel-mentor.html'],
  ['docs/fase1/INTEGRACAO_FASE1.md', 'docs/fase1/INTEGRACAO_FASE1.md'],
  ['docs/fase1/PROPOSTA_PROVAS.md', 'docs/fase1/PROPOSTA_PROVAS.md'],
  ['docs/fase1/REVISAO_FASE1.md', 'docs/fase1/REVISAO_FASE1.md'],
  ['docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md', 'docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md'],
  ['docs/fase1/VERIFICACAO_ARTEFATOS.md', 'docs/fase1/VERIFICACAO_ARTEFATOS.md'],
  ['docs/operacoes/testar-fase1-vps.sh', 'docs/operacoes/testar-fase1-vps.sh'],
  ['docs/operacoes/aplicar-fase1-vps.sh', 'docs/operacoes/aplicar-fase1-vps.sh'],
  ['docs/operacoes/instalar-fase1.sh', 'docs/operacoes/instalar-fase1.sh'],
]

let falhas = 0
for (const [origem, destino] of ARTEFATOS) {
  const absolutoOrigem = path.resolve(raiz, origem)
  if (!absolutoOrigem.startsWith(raiz + path.sep) || !fs.existsSync(absolutoOrigem)) {
    console.warn(`[fase1-artefatos] AVISO: artefato ausente, não copiado: ${origem}`)
    falhas++
    continue
  }
  const absolutoDestino = path.join(raiz, 'public', 'fase1', destino)
  fs.mkdirSync(path.dirname(absolutoDestino), { recursive: true })
  fs.copyFileSync(absolutoOrigem, absolutoDestino)
}

if (falhas > 0) {
  console.warn(`[fase1-artefatos] ${falhas} artefato(s) não copiado(s).`)
} else {
  console.log(
    `[fase1-artefatos] ${ARTEFATOS.length} artefatos copiados para public/fase1/ (bytes exatos).`,
  )
}
