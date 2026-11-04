import { LISTA_HASHES_REAIS } from './tabelaHashesReais'

console.log('--- HASHES REAIS CALCULADOS EM BUILD ---')
for (const item of LISTA_HASHES_REAIS) {
  console.log(`${item.id}: docs=${item.hashDocs} public=${item.hashPublic} iguais=${item.iguais}`)
}
export const DADOS_BUILD_HASHES = LISTA_HASHES_REAIS
