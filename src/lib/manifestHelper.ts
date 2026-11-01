/**
 * src/lib/manifestHelper.ts
 *
 * Módulo consolidado de manifesto e integridade SHA-256 para os artefatos da Fase 1.
 * Fornece metadados dos 6 artefatos oficiais, hashes esperados, verificação
 * e utilitários para cálculo de hash SHA-256 de strings no navegador (Web Crypto API).
 */

export interface ArtefatoFase1 {
  id: string
  nome: string
  caminhoWorkspace: string
  destinoVps: string
  sha256: string
  descricao: string
  camada: string
  tipo: 'codigo' | 'html' | 'documentacao' | 'script'
}

/**
 * Manifesto oficial criptográfico dos 6 artefatos entregáveis da Fase 1.
 * Hashes calculados via sha256sum sobre os arquivos finais no workspace.
 */
export const MANIFESTO_ARTEFATOS_FASE1: ArtefatoFase1[] = [
  {
    id: 'stream',
    nome: 'stream.js (Streaming Seguro)',
    caminhoWorkspace: 'docs/fase1/stream.js',
    destinoVps: 'src/routes/stream.js',
    sha256: '2be71f49646bde330ec0c822ff611be9e173e44c2057d23f381c81ef94e1e07b',
    descricao:
      'Streaming dinâmico com HTTP Range 206, trava contra path traversal, autorização ampla (aluno/mentor-dono/admin), fallback restrito à aula 27 e guard READ_ONLY_TEST=true para porta 3334.',
    camada: 'Camada 2 (Leitura) & Camada 4 (Produção)',
    tipo: 'codigo',
  },
  {
    id: 'painel',
    nome: 'painel-mentor.html (Novo Painel)',
    caminhoWorkspace: 'docs/fase1/NOVO_PAINEL/painel-mentor.html',
    destinoVps: 'src/static/painel-mentor.html',
    sha256: '3d9501a300d8b4e7a3ec11cc0a66d548f7663e6e87f2e1a47321e06fa536f0e4',
    descricao:
      'Arquivo estático autônomo com player 16:9, matriz curricular lateral, suporte aos 4 formatos de vídeo e tratamento seguro de token em query string (validação JWT + replaceState + sessionStorage exclusivo).',
    camada: 'Camada 1 (Estático) & Camada 4 (Produção)',
    tipo: 'html',
  },
  {
    id: 'integracao',
    nome: 'INTEGRACAO_FASE1.md',
    caminhoWorkspace: 'docs/fase1/INTEGRACAO_FASE1.md',
    destinoVps: 'docs/fase1/INTEGRACAO_FASE1.md',
    sha256: '168e37dc0bd59a16f272a8c3d8e578ba33cd7c768991fa9a7ffccbe5b9bc5d11',
    descricao:
      'Manual operacional completo: backup /root/backups/cursos/20261031_195147, cópia para /tmp/fase1_candidatos, diff contra 47aa7b1, node --check, rebuild EasyPanel, health check e rollback.',
    camada: 'Documentação / Procedimento Operacional',
    tipo: 'documentacao',
  },
  {
    id: 'proposta-provas',
    nome: 'PROPOSTA_PROVAS.md',
    caminhoWorkspace: 'docs/fase1/PROPOSTA_PROVAS.md',
    destinoVps: 'docs/fase1/PROPOSTA_PROVAS.md',
    sha256: 'e9b2513de5553e1e40eb617b7b15a6b5a3e1438fa5a48483f3e27150a294f4a3',
    descricao:
      'Documentação dos 4 achados de provas.js sem aplicar no código de produção (permanece protegido e inalterado).',
    camada: 'Documentação Pura',
    tipo: 'documentacao',
  },
  {
    id: 'revisao',
    nome: 'REVISAO_FASE1.md',
    caminhoWorkspace: 'docs/fase1/REVISAO_FASE1.md',
    destinoVps: 'docs/fase1/REVISAO_FASE1.md',
    sha256: '3312c1404c0429fec033bd2f27ddc54aa5017e2978931dc150c95029a502f664',
    descricao:
      'Revisão ponto a ponto dos 27 itens de conformidade com veredito, evidências com arquivo e linha, eliminação de localStorage para sessionStorage e rotas reais.',
    camada: 'Auditoria de Conformidade (27 Pontos)',
    tipo: 'documentacao',
  },
  {
    id: 'teste-pre-homologacao',
    nome: 'TESTE_PRE_HOMOLOGACAO_VPS.md',
    caminhoWorkspace: 'docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md',
    destinoVps: 'docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md',
    sha256: '38a6ec1552a46e1074e50d536cf0ba7493eef250bc44618e7751c8a14ec7a59a',
    descricao:
      'Guia do caminho seguro não invasivo: isolamento em /tmp, as 4 camadas de validação, guard READ_ONLY_TEST=true obrigatório na porta 3334 e ambiente de escrita separado via backup 20261031_195147.',
    camada: 'Manual de Homologação Não Invasiva',
    tipo: 'documentacao',
  },
  {
    id: 'script-testar',
    nome: 'testar-fase1-vps.sh',
    caminhoWorkspace: 'docs/operacoes/testar-fase1-vps.sh',
    destinoVps: 'docs/operacoes/testar-fase1-vps.sh',
    sha256: 'e927c9c054238e55eefea2b27429bb7b05cdcd5d1ec5ce1e6e0261c470196253',
    descricao:
      'Script automatizado com 13 itens de teste com curl, 4 camadas (estatico, servidor, bateria, homologacao), guard READ_ONLY_TEST obrigatório e zero vazamento de tokens.',
    camada: 'Automação de Testes VPS',
    tipo: 'script',
  },
  {
    id: 'verificacao-artefatos',
    nome: 'VERIFICACAO_ARTEFATOS.md',
    caminhoWorkspace: 'docs/fase1/VERIFICACAO_ARTEFATOS.md',
    destinoVps: 'docs/fase1/VERIFICACAO_ARTEFATOS.md',
    sha256: '25eb92ff917f692066d8b68aafe8f4a3de0724f33b1e77f0aeb5a2f5fdece3e9',
    descricao:
      'Manifesto criptográfico oficial dos artefatos da Fase 1, relatório de conformidade dos 27 itens, varredura de segredos e comandos de cópia e diff para o operador.',
    camada: 'Manifesto Criptográfico & Auditoria',
    tipo: 'documentacao',
  },
]

/**
 * Calcula o hash SHA-256 de uma string utilizando a Web Crypto API nativa do navegador.
 * Seguro para uso client-side no browser.
 */
export async function calcularSha256Texto(texto: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(texto)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Retorna o hash SHA-256 esperado de um artefato pelo seu identificador ou caminho.
 */
export function obterHashArtefato(caminhoOuId: string): string | undefined {
  const artefato = MANIFESTO_ARTEFATOS_FASE1.find(
    (a) => a.id === caminhoOuId || a.caminhoWorkspace === caminhoOuId,
  )
  return artefato?.sha256
}
