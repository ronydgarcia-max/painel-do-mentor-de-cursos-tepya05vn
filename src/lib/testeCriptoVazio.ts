import { sha256String } from './sha256Pure'

export function testarSha256Conhecido() {
  const hashVazio = sha256String('')
  const hashEsperadoVazio = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  return hashVazio === hashEsperadoVazio
}
