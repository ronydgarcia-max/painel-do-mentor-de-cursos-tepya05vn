import { sha256String } from './sha256Pure';
import testarRaw from '../../docs/operacoes/testar-fase1-vps.sh?raw';
import testePreRaw from '../../docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md?raw';

export const HASH_TESTAR = sha256String(testarRaw);
export const HASH_TESTE_PRE = sha256String(testePreRaw);

// Prova de compilação
if (HASH_TESTAR.length !== 64 || HASH_TESTE_PRE.length !== 64) {
  throw new Error('Hash length invalid');
}
