import { HASHES_REAIS_ESTAVEIS } from './hashesReaisEstaveis'

export function obterHashPorNome(n: string): string {
  return (HASHES_REAIS_ESTAVEIS as Record<string, string>)[n] ?? ''
}
