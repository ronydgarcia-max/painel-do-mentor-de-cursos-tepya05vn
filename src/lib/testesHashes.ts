import { LISTA_HASHES_REAIS } from './tabelaHashesReais'

export function verificarHashReal(id: string, prefixoEsperado: string): boolean {
  const item = LISTA_HASHES_REAIS.find((i) => i.id === id)
  if (!item) return false
  return item.hashPublic.startsWith(prefixoEsperado)
}

export const TESTES_PRE_CONDICAO = {
  streamE6caf: verificarHashReal('stream', '6caf954f'),
  streamIdentico: LISTA_HASHES_REAIS.find((i) => i.id === 'stream')?.iguais,
}
