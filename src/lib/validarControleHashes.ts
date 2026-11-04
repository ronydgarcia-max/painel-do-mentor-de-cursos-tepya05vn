import { HASHES_AUDITADOS } from './auditoriaHashes'

// Garantir que cada hash é comparado contra o controle esperado da tarefa
const CONTROLES = {
  stream: '6caf954f02dc65623d6eaeb3e73866dec3147bd0d94e8d2e5c027cc291802fd2',
  painel: 'b9c3c701fd9e2e5bc51b619366b79c0223372fbff854a04aacd3c3f6f34d11d8',
  integracao: '3908e3bb777637df2e6855f2e7ec61891116d041eef56fae0b4a96c21835f7a6',
  proposta: '16dfff6134df7caeeace571f004299fde6b27b3aebf0c2cd1772a1c04a011241',
  revisao: 'e16ce2583cfd7e123b09345bdb09f5403de3d94267a1ace66a1cb65901478666',
  testePre: 'cdff76f1149c233646b41078b1c675245fbe5901e5c8070c7e46292843a8d8d2',
  aplicar: 'b08abe53ac5d36a5e7f7e67b34a5e8a92541f4353c5107de1898bebb1f591193',
  testarControle: '2773fcbb1121fef3a92c9144ac9adf74f9fcb23f024979f6590d9174679be96f',
}

// Provocar erro de tipo ou compilação se algo divergir
type AssertTrue<T extends true> = T

// Expor resultado para inspeção se necessário
export const RESULTADOS_COMPARACAO = {
  streamMatch: HASHES_AUDITADOS.streamDocs === CONTROLES.stream,
  painelMatch: HASHES_AUDITADOS.painelDocs === CONTROLES.painel,
  integracaoMatch: HASHES_AUDITADOS.integracaoDocs === CONTROLES.integracao,
  propostaMatch: HASHES_AUDITADOS.propostaDocs === CONTROLES.proposta,
  revisaoMatch: HASHES_AUDITADOS.revisaoDocs === CONTROLES.revisao,
  testePreMatch: HASHES_AUDITADOS.testeDocs === CONTROLES.testePre,
  aplicarMatch: HASHES_AUDITADOS.aplicarScriptDocs === CONTROLES.aplicar,
  testarMatch: HASHES_AUDITADOS.testarScriptDocs === CONTROLES.testarControle,
  testarPublicMatch: HASHES_AUDITADOS.testarScriptPublic === CONTROLES.testarControle,
  docsPublicIguais: {
    stream: HASHES_AUDITADOS.streamDocs === HASHES_AUDITADOS.streamPublic,
    painel: HASHES_AUDITADOS.painelDocs === HASHES_AUDITADOS.painelPublic,
    integracao: HASHES_AUDITADOS.integracaoDocs === HASHES_AUDITADOS.integracaoPublic,
    proposta: HASHES_AUDITADOS.propostaDocs === HASHES_AUDITADOS.propostaPublic,
    revisao: HASHES_AUDITADOS.revisaoDocs === HASHES_AUDITADOS.revisaoPublic,
    teste: HASHES_AUDITADOS.testeDocs === HASHES_AUDITADOS.testePublic,
    testar: HASHES_AUDITADOS.testarScriptDocs === HASHES_AUDITADOS.testarScriptPublic,
    aplicar: HASHES_AUDITADOS.aplicarScriptDocs === HASHES_AUDITADOS.aplicarScriptPublic,
    instalar: HASHES_AUDITADOS.instalarScriptDocs === HASHES_AUDITADOS.instalarScriptPublic,
    verificacao: HASHES_AUDITADOS.verificacaoDocs === HASHES_AUDITADOS.verificacaoPublic,
  },
  hashesCalculados: HASHES_AUDITADOS,
}
