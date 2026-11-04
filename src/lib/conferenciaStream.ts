import { HASHES_ESTAVEIS } from './hashesEstaveis'

export const HASH_STREAM_ESPERADO =
  '6caf954f02dc65623d6eaeb3e73866dec3147bd0d94e8d2e5c027cc291802fd2'

export function streamEIgual(): boolean {
  return HASHES_ESTAVEIS.stream === HASH_STREAM_ESPERADO
}
