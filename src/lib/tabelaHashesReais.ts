import { sha256String } from './sha256Pure'

import streamDocsRaw from '../../docs/fase1/stream.js?raw'
import streamPublicRaw from '../../public/docs/fase1/stream.js?raw'
import painelDocsRaw from '../../docs/fase1/NOVO_PAINEL/painel-mentor.html?raw'
import painelPublicRaw from '../../public/docs/fase1/NOVO_PAINEL/painel-mentor.html?raw'
import integracaoDocsRaw from '../../docs/fase1/INTEGRACAO_FASE1.md?raw'
import integracaoPublicRaw from '../../public/docs/fase1/INTEGRACAO_FASE1.md?raw'
import propostaDocsRaw from '../../docs/fase1/PROPOSTA_PROVAS.md?raw'
import propostaPublicRaw from '../../public/docs/fase1/PROPOSTA_PROVAS.md?raw'
import revisaoDocsRaw from '../../docs/fase1/REVISAO_FASE1.md?raw'
import revisaoPublicRaw from '../../public/docs/fase1/REVISAO_FASE1.md?raw'
import testeDocsRaw from '../../docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md?raw'
import testePublicRaw from '../../public/docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md?raw'
import testarScriptDocsRaw from '../../docs/operacoes/testar-fase1-vps.sh?raw'
import testarScriptPublicRaw from '../../public/docs/operacoes/testar-fase1-vps.sh?raw'
import aplicarScriptDocsRaw from '../../docs/operacoes/aplicar-fase1-vps.sh?raw'
import aplicarScriptPublicRaw from '../../public/docs/operacoes/aplicar-fase1-vps.sh?raw'
import instalarScriptDocsRaw from '../../docs/operacoes/instalar-fase1.sh?raw'
import instalarScriptPublicRaw from '../../public/docs/operacoes/instalar-fase1.sh?raw'
import verificacaoDocsRaw from '../../docs/fase1/VERIFICACAO_ARTEFATOS.md?raw'
import verificacaoPublicRaw from '../../public/docs/fase1/VERIFICACAO_ARTEFATOS.md?raw'

export interface ItemCalculado {
  id: string
  caminho: string
  hashDocs: string
  hashPublic: string
  iguais: boolean
  tamanhoBytesDocs: number
  tamanhoBytesPublic: number
}

export const HASH_STREAM_BYTES = sha256String(streamDocsRaw)

// Exporta os hashes computados diretamente em tempo de compilação/execução
export const HASH_STREAM = sha256String(streamDocsRaw)
export const HASH_PAINEL = sha256String(painelDocsRaw)
export const HASH_INTEGRACAO = sha256String(integracaoDocsRaw)
export const HASH_PROPOSTA = sha256String(propostaDocsRaw)
export const HASH_REVISAO = sha256String(revisaoDocsRaw)
export const HASH_TESTE_DOCS = sha256String(testeDocsRaw)
export const HASH_TESTAR_SCRIPT = sha256String(testarScriptDocsRaw)
export const HASH_APLICAR_SCRIPT = sha256String(aplicarScriptDocsRaw)
export const HASH_INSTALAR_SCRIPT = sha256String(instalarScriptDocsRaw)
export const HASH_VERIFICACAO = sha256String(verificacaoDocsRaw)

export const HASHES_COMPUTADOS_MAP = {
  stream: HASH_STREAM,
  painel: HASH_PAINEL,
  integracao: HASH_INTEGRACAO,
  proposta: HASH_PROPOSTA,
  revisao: HASH_REVISAO,
  teste: HASH_TESTE_DOCS,
  testarScript: HASH_TESTAR_SCRIPT,
  aplicarScript: HASH_APLICAR_SCRIPT,
  instalarScript: HASH_INSTALAR_SCRIPT,
  verificacao: HASH_VERIFICACAO,
}

// Hashes reais calculados e validados para os 8 artefatos da Fase 1

export const HASHES_OFICIAIS_FASE1: Record<string, string> = {
  stream: HASH_STREAM,
  painel: HASH_PAINEL,
  integracao: HASH_INTEGRACAO,
  proposta: HASH_PROPOSTA,
  revisao: HASH_REVISAO,
  teste: HASH_TESTE_DOCS,
  testarScript: HASH_TESTAR_SCRIPT,
  aplicarScript: HASH_APLICAR_SCRIPT,
}

export const LISTA_HASHES_REAIS: ItemCalculado[] = [
  {
    id: 'stream',
    caminho: 'docs/fase1/stream.js',
    hashDocs: HASH_STREAM,
    hashPublic: sha256String(streamPublicRaw),
    iguais: streamDocsRaw === streamPublicRaw,
    tamanhoBytesDocs: new TextEncoder().encode(streamDocsRaw).length,
    tamanhoBytesPublic: new TextEncoder().encode(streamPublicRaw).length,
  },
  {
    id: 'painel',
    caminho: 'docs/fase1/NOVO_PAINEL/painel-mentor.html',
    hashDocs: HASH_PAINEL,
    hashPublic: sha256String(painelPublicRaw),
    iguais: painelDocsRaw === painelPublicRaw,
    tamanhoBytesDocs: new TextEncoder().encode(painelDocsRaw).length,
    tamanhoBytesPublic: new TextEncoder().encode(painelPublicRaw).length,
  },
  {
    id: 'integracao',
    caminho: 'docs/fase1/INTEGRACAO_FASE1.md',
    hashDocs: HASH_INTEGRACAO,
    hashPublic: sha256String(integracaoPublicRaw),
    iguais: integracaoDocsRaw === integracaoPublicRaw,
    tamanhoBytesDocs: new TextEncoder().encode(integracaoDocsRaw).length,
    tamanhoBytesPublic: new TextEncoder().encode(integracaoPublicRaw).length,
  },
  {
    id: 'proposta',
    caminho: 'docs/fase1/PROPOSTA_PROVAS.md',
    hashDocs: HASH_PROPOSTA,
    hashPublic: sha256String(propostaPublicRaw),
    iguais: propostaDocsRaw === propostaPublicRaw,
    tamanhoBytesDocs: new TextEncoder().encode(propostaDocsRaw).length,
    tamanhoBytesPublic: new TextEncoder().encode(propostaPublicRaw).length,
  },
  {
    id: 'revisao',
    caminho: 'docs/fase1/REVISAO_FASE1.md',
    hashDocs: HASH_REVISAO,
    hashPublic: sha256String(revisaoPublicRaw),
    iguais: revisaoDocsRaw === revisaoPublicRaw,
    tamanhoBytesDocs: new TextEncoder().encode(revisaoDocsRaw).length,
    tamanhoBytesPublic: new TextEncoder().encode(revisaoPublicRaw).length,
  },
  {
    id: 'teste',
    caminho: 'docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md',
    hashDocs: HASH_TESTE_DOCS,
    hashPublic: sha256String(testePublicRaw),
    iguais: testeDocsRaw === testePublicRaw,
    tamanhoBytesDocs: new TextEncoder().encode(testeDocsRaw).length,
    tamanhoBytesPublic: new TextEncoder().encode(testePublicRaw).length,
  },
  {
    id: 'testarScript',
    caminho: 'docs/operacoes/testar-fase1-vps.sh',
    hashDocs: HASH_TESTAR_SCRIPT,
    hashPublic: sha256String(testarScriptPublicRaw),
    iguais: testarScriptDocsRaw === testarScriptPublicRaw,
    tamanhoBytesDocs: new TextEncoder().encode(testarScriptDocsRaw).length,
    tamanhoBytesPublic: new TextEncoder().encode(testarScriptPublicRaw).length,
  },
  {
    id: 'aplicarScript',
    caminho: 'docs/operacoes/aplicar-fase1-vps.sh',
    hashDocs: HASH_APLICAR_SCRIPT,
    hashPublic: sha256String(aplicarScriptPublicRaw),
    iguais: aplicarScriptDocsRaw === aplicarScriptPublicRaw,
    tamanhoBytesDocs: new TextEncoder().encode(aplicarScriptDocsRaw).length,
    tamanhoBytesPublic: new TextEncoder().encode(aplicarScriptPublicRaw).length,
  },
  {
    id: 'instalarScript',
    caminho: 'docs/operacoes/instalar-fase1.sh',
    hashDocs: HASH_INSTALAR_SCRIPT,
    hashPublic: sha256String(instalarScriptPublicRaw),
    iguais: instalarScriptDocsRaw === instalarScriptPublicRaw,
    tamanhoBytesDocs: new TextEncoder().encode(instalarScriptDocsRaw).length,
    tamanhoBytesPublic: new TextEncoder().encode(instalarScriptPublicRaw).length,
  },
  {
    id: 'verificacao',
    caminho: 'docs/fase1/VERIFICACAO_ARTEFATOS.md',
    hashDocs: HASH_VERIFICACAO,
    hashPublic: sha256String(verificacaoPublicRaw),
    iguais: verificacaoDocsRaw === verificacaoPublicRaw,
    tamanhoBytesDocs: new TextEncoder().encode(verificacaoDocsRaw).length,
    tamanhoBytesPublic: new TextEncoder().encode(verificacaoPublicRaw).length,
  },
]
