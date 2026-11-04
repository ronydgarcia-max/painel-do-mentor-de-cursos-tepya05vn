import { LISTA_HASHES_REAIS } from './tabelaHashesReais'

// Tabela de hashes calculados
export const MAPA_HASHES: Record<string, string> = {}
for (const item of LISTA_HASHES_REAIS) {
  MAPA_HASHES[item.id] = item.hashPublic
}
