import { LISTA_HASHES_REAIS } from './tabelaHashesReais'

// Este teste estático simula exatamente o passo 1 do testar-fase1-vps.sh:
// Compara os arquivos candidatos contra os hashes oficiais
export function simularChecagemEstaticaVps(hashesEsperados: Record<string, string>) {
  const erros: string[] = []
  for (const item of LISTA_HASHES_REAIS) {
    const esperado = hashesEsperados[item.caminho]
    if (esperado && esperado !== item.hashPublic) {
      erros.push(`Divergência em ${item.caminho}: esperado=${esperado}, obtido=${item.hashPublic}`)
    }
  }
  return {
    sucesso: erros.length === 0,
    erros,
  }
}
