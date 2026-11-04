import { LISTA_HASHES_REAIS } from './tabelaHashesReais'

// Inspeciona os primeiros 8 caracteres de cada hash real
export const RESUMO_PREFIXOS = Object.fromEntries(
  LISTA_HASHES_REAIS.map((item) => [item.id, item.hashPublic.slice(0, 8)]),
)
