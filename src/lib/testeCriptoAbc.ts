import { sha256String } from './sha256Pure'

export function testarStringConhecida() {
  // Test vector: 'abc'
  // SHA-256('abc') = ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
  return sha256String('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
}
