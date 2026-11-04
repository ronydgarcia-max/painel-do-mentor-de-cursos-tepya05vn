import { HASHES_REAIS_ESTAVEIS } from './hashesReaisEstaveis'

export const PRIMEIROS_4_CHARS = Object.fromEntries(
  Object.entries(HASHES_REAIS_ESTAVEIS).map(([k, v]) => [k, v.slice(0, 4)]),
)
