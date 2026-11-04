// Utilitário para cálculo de SHA-256 e comparação de artefatos
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

export interface ParHashArtefato {
  id: string
  nome: string
  caminhoDocs: string
  caminhoPublic: string
  hashDocs: string
  hashPublic: string
  conteudoIdentico: boolean
}

export const ARTEFATOS_CALCULADOS_BUILD: ParHashArtefato[] = [
  {
    id: 'stream',
    nome: 'stream.js',
    caminhoDocs: 'docs/fase1/stream.js',
    caminhoPublic: 'public/docs/fase1/stream.js',
    hashDocs: sha256String(streamDocsRaw),
    hashPublic: sha256String(streamPublicRaw),
    conteudoIdentico: streamDocsRaw === streamPublicRaw,
  },
  {
    id: 'painel',
    nome: 'painel-mentor.html',
    caminhoDocs: 'docs/fase1/NOVO_PAINEL/painel-mentor.html',
    caminhoPublic: 'public/docs/fase1/NOVO_PAINEL/painel-mentor.html',
    hashDocs: sha256String(painelDocsRaw),
    hashPublic: sha256String(painelPublicRaw),
    conteudoIdentico: painelDocsRaw === painelPublicRaw,
  },
  {
    id: 'integracao',
    nome: 'INTEGRACAO_FASE1.md',
    caminhoDocs: 'docs/fase1/INTEGRACAO_FASE1.md',
    caminhoPublic: 'public/docs/fase1/INTEGRACAO_FASE1.md',
    hashDocs: sha256String(integracaoDocsRaw),
    hashPublic: sha256String(integracaoPublicRaw),
    conteudoIdentico: integracaoDocsRaw === integracaoPublicRaw,
  },
  {
    id: 'proposta',
    nome: 'PROPOSTA_PROVAS.md',
    caminhoDocs: 'docs/fase1/PROPOSTA_PROVAS.md',
    caminhoPublic: 'public/docs/fase1/PROPOSTA_PROVAS.md',
    hashDocs: sha256String(propostaDocsRaw),
    hashPublic: sha256String(propostaPublicRaw),
    conteudoIdentico: propostaDocsRaw === propostaPublicRaw,
  },
  {
    id: 'revisao',
    nome: 'REVISAO_FASE1.md',
    caminhoDocs: 'docs/fase1/REVISAO_FASE1.md',
    caminhoPublic: 'public/docs/fase1/REVISAO_FASE1.md',
    hashDocs: sha256String(revisaoDocsRaw),
    hashPublic: sha256String(revisaoPublicRaw),
    conteudoIdentico: revisaoDocsRaw === revisaoPublicRaw,
  },
  {
    id: 'teste',
    nome: 'TESTE_PRE_HOMOLOGACAO_VPS.md',
    caminhoDocs: 'docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md',
    caminhoPublic: 'public/docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md',
    hashDocs: sha256String(testeDocsRaw),
    hashPublic: sha256String(testePublicRaw),
    conteudoIdentico: testeDocsRaw === testePublicRaw,
  },
  {
    id: 'testarScript',
    nome: 'testar-fase1-vps.sh',
    caminhoDocs: 'docs/operacoes/testar-fase1-vps.sh',
    caminhoPublic: 'public/docs/operacoes/testar-fase1-vps.sh',
    hashDocs: sha256String(testarScriptDocsRaw),
    hashPublic: sha256String(testarScriptPublicRaw),
    conteudoIdentico: testarScriptDocsRaw === testarScriptPublicRaw,
  },
  {
    id: 'aplicarScript',
    nome: 'aplicar-fase1-vps.sh',
    caminhoDocs: 'docs/operacoes/aplicar-fase1-vps.sh',
    caminhoPublic: 'public/docs/operacoes/aplicar-fase1-vps.sh',
    hashDocs: sha256String(aplicarScriptDocsRaw),
    hashPublic: sha256String(aplicarScriptPublicRaw),
    conteudoIdentico: aplicarScriptDocsRaw === aplicarScriptPublicRaw,
  },
  {
    id: 'instalarScript',
    nome: 'instalar-fase1.sh',
    caminhoDocs: 'docs/operacoes/instalar-fase1.sh',
    caminhoPublic: 'public/docs/operacoes/instalar-fase1.sh',
    hashDocs: sha256String(instalarScriptDocsRaw),
    hashPublic: sha256String(instalarScriptPublicRaw),
    conteudoIdentico: instalarScriptDocsRaw === instalarScriptPublicRaw,
  },
  {
    id: 'verificacao',
    nome: 'VERIFICACAO_ARTEFATOS.md',
    caminhoDocs: 'docs/fase1/VERIFICACAO_ARTEFATOS.md',
    caminhoPublic: 'public/docs/fase1/VERIFICACAO_ARTEFATOS.md',
    hashDocs: sha256String(verificacaoDocsRaw),
    hashPublic: sha256String(verificacaoPublicRaw),
    conteudoIdentico: verificacaoDocsRaw === verificacaoPublicRaw,
  },
]
