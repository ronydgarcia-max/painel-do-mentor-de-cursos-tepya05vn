import { HASHES_AUDITADOS } from './auditoriaHashes'

// Teste em tempo de compilação TS para CADA artefato:
type IsSame<A, B> = A extends B ? (B extends A ? true : false) : false

type CheckStream = IsSame<typeof HASHES_AUDITADOS.streamDocs, '6caf954f02dc65623d6eaeb3e73866dec3147bd0d94e8d2e5c027cc291802fd2'>
type CheckPainel = IsSame<typeof HASHES_AUDITADOS.painelDocs, 'b9c3c701fd9e2e5bc51b619366b79c0223372fbff854a04aacd3c3f6f34d11d8'>
type CheckIntegracao = IsSame<typeof HASHES_AUDITADOS.integracaoDocs, '3908e3bb777637df2e6855f2e7ec61891116d041eef56fae0b4a96c21835f7a6'>
type CheckProposta = IsSame<typeof HASHES_AUDITADOS.propostaDocs, '16dfff6134df7caeeace571f004299fde6b27b3aebf0c2cd1772a1c04a011241'>
type CheckRevisao = IsSame<typeof HASHES_AUDITADOS.revisaoDocs, 'e16ce2583cfd7e123b09345bdb09f5403de3d94267a1ace66a1cb65901478666'>
type CheckTestePre = IsSame<typeof HASHES_AUDITADOS.testeDocs, 'cdff76f1149c233646b41078b1c675245fbe5901e5c8070c7e46292843a8d8d2'>
type CheckAplicar = IsSame<typeof HASHES_AUDITADOS.aplicarScriptDocs, 'b08abe53ac5d36a5e7f7e67b34a5e8a92541f4353c5107de1898bebb1f591193'>
type CheckTestar = IsSame<typeof HASHES_AUDITADOS.testarScriptDocs, '2773fcbb1121fef3a92c9144ac9adf74f9fcb23f024979f6590d9174679be96f'>
type CheckTestarPublic = IsSame<typeof HASHES_AUDITADOS.testarScriptPublic, '2773fcbb1121fef3a92c9144ac9adf74f9fcb23f024979f6590d9174679be96f'>
type CheckTestePrePublic = IsSame<typeof HASHES_AUDITADOS.testePublic, 'cdff76f1149c233646b41078b1c675245fbe5901e5c8070c7e46292843a8d8d2'>

export const V_STREAM: CheckStream = true
export const V_PAINEL: CheckPainel = true
export const V_INTEGRACAO: CheckIntegracao = true
export const V_PROPOSTA: CheckProposta = true
export const V_REVISAO: CheckRevisao = true
export const V_TESTE_PRE: CheckTestePre = true
export const V_APLICAR: CheckAplicar = true
export const V_TESTAR: CheckTestar = true
export const V_TESTAR_PUB: CheckTestarPublic = true
export const V_TESTE_PUB: CheckTestePrePublic = true
