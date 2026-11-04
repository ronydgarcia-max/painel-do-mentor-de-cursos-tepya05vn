import { LISTA_HASHES_REAIS } from './tabelaHashesReais'

export function obterHashRealPorId(id: string): string {
  const item = LISTA_HASHES_REAIS.find((i) => i.id === id)
  if (!item) {
    throw new Error(`Artefato não encontrado: ${id}`)
  }
  return item.hashPublic
}

export function obterTabelaHashesReaisFormatada(): string {
  return LISTA_HASHES_REAIS.map((i) => `${i.hashPublic}  ${i.caminho}`).join('\n')
}
