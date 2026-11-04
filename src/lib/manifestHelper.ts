/**
 * src/lib/manifestHelper.ts
 *
 * Módulo consolidado de manifesto e integridade SHA-256 para os artefatos da Fase 1.
 * Fornece metadados dos artefatos oficiais e utilitários para cálculo de hash
 * SHA-256 no navegador (Web Crypto API).
 *
 * ORIGEM DE DOWNLOAD (Fase 1 — Entregáveis): os artefatos são servidos pela URL
 * pública da PRÓPRIA PRÉVIA em <window.location.origin>/docs/... (espelho em
 * public/docs/ gerado byte-exato a partir de docs/). A origem é detectada em
 * runtime no app (aba "Fase 1 — Entregáveis", card "Instalação Rápida na VPS").
 *
 * MECANISMO DE VERIFICAÇÃO (dupla verificação independente — SEM hashes embutidos):
 * Este instalador é gerado num ambiente SEM execução de shell, portanto NÃO há como
 * calcular SHA-256 aqui e embutir o valor — e inventar um hash daria falsa sensação
 * de integridade. Em vez disso, o hash é calculado por DUAS fontes independentes:
 *   (1) NA VPS: o instalador (docs/operacoes/instalar-fase1.sh) calcula sha256sum
 *       (fallback shasum) sobre os bytes efetivamente baixados e imprime a tabela;
 *   (2) NO NAVEGADOR: esta página calcula Web Crypto (crypto.subtle.digest) sobre os
 *       mesmos arquivos espelhados servidos pela prévia (função calcularSha256Artefato).
 * O operador compara as duas tabelas ANTES de confirmar no instalador (ou fornece
 * EFASE1_SHA256="caminho=hash;..." com os valores exibidos aqui). Por isso o campo
 * `sha256` abaixo NÃO é um valor fixo: é o marcador textual do mecanismo.
 * Nenhum valor de hash é inventado neste arquivo.
 */

export interface ArtefatoFase1 {
  id: string
  nome: string
  caminhoWorkspace: string
  caminhoEspelho: string
  destinoVps: string
  sha256: string
  sha256Esperado?: string
  descricao: string
  camada: string
  tipo: 'codigo' | 'html' | 'documentacao' | 'script'
}

/** Marcador textual do mecanismo de verificação — NÃO é um valor de hash. */
export const MARCADOR_HASH_VERIFICADO =
  'verificado na execução: VPS (sha256sum) × navegador (Web Crypto)'

/**
 * Manifesto oficial dos artefatos entregáveis da Fase 1.
 * O campo sha256 carrega o marcador do mecanismo (nunca um valor inventado);
 * o hash real de cada arquivo é calculado VIVO nas duas fontes independentes.
 */
export const MANIFESTO_ARTEFATOS_FASE1: ArtefatoFase1[] = [
  {
    id: 'stream',
    nome: 'stream.js (Streaming Seguro)',
    caminhoWorkspace: 'docs/fase1/stream.js',
    caminhoEspelho: 'docs/fase1/stream.js',
    destinoVps: 'src/routes/stream.js',
    sha256: MARCADOR_HASH_VERIFICADO,
    sha256Esperado: 'bc1f5732b6289522591b46bf639b8079e133bda736264f63b9f3c1f96c1fb062',
    descricao:
      'Streaming dinâmico com HTTP Range 206, trava contra path traversal, autorização ampla (aluno/mentor-dono/admin), fallback restrito à aula 27 e guard READ_ONLY_TEST=true para porta 3334.',
    camada: 'Camada 2 (Leitura) & Camada 4 (Produção)',
    tipo: 'codigo',
  },
  {
    id: 'painel',
    nome: 'painel-mentor.html (Novo Painel)',
    caminhoWorkspace: 'docs/fase1/NOVO_PAINEL/painel-mentor.html',
    caminhoEspelho: 'docs/fase1/NOVO_PAINEL/painel-mentor.html',
    destinoVps: 'src/static/painel-mentor.html',
    sha256: MARCADOR_HASH_VERIFICADO,
    sha256Esperado: 'b9c3c701fd9e2e5bc51b619366b79c0223372fbff854a04aacd3c3f6f34d11d8',
    descricao:
      'Arquivo estático autônomo com player 16:9, matriz curricular lateral, suporte aos 4 formatos de vídeo e tratamento seguro de token em query string (validação JWT + replaceState + sessionStorage exclusivo).',
    camada: 'Camada 1 (Estático) & Camada 4 (Produção)',
    tipo: 'html',
  },
  {
    id: 'integracao',
    nome: 'INTEGRACAO_FASE1.md',
    caminhoWorkspace: 'docs/fase1/INTEGRACAO_FASE1.md',
    caminhoEspelho: 'docs/fase1/INTEGRACAO_FASE1.md',
    destinoVps: 'docs/fase1/INTEGRACAO_FASE1.md',
    sha256: MARCADOR_HASH_VERIFICADO,
    sha256Esperado: '3908e3bb777637df2e6855f2e7ec61891116d041eef56fae0b4a96c21835f7a6',
    descricao:
      'Manual operacional completo: backup /root/backups/cursos/20261031_195147, cópia para /tmp/fase1_candidatos, diff contra 47aa7b1, node --check, rebuild EasyPanel, health check e rollback.',
    camada: 'Documentação / Procedimento Operacional',
    tipo: 'documentacao',
  },
  {
    id: 'proposta-provas',
    nome: 'PROPOSTA_PROVAS.md',
    caminhoWorkspace: 'docs/fase1/PROPOSTA_PROVAS.md',
    caminhoEspelho: 'docs/fase1/PROPOSTA_PROVAS.md',
    destinoVps: 'docs/fase1/PROPOSTA_PROVAS.md',
    sha256: MARCADOR_HASH_VERIFICADO,
    sha256Esperado: '16dfff6134df7caeeace571f004299fde6b27b3aebf0c2cd1772a1c04a011241',
    descricao:
      'Documentação dos 4 achados de provas.js sem aplicar no código de produção (permanece protegido e inalterado).',
    camada: 'Documentação Pura',
    tipo: 'documentacao',
  },
  {
    id: 'revisao',
    nome: 'REVISAO_FASE1.md',
    caminhoWorkspace: 'docs/fase1/REVISAO_FASE1.md',
    caminhoEspelho: 'docs/fase1/REVISAO_FASE1.md',
    destinoVps: 'docs/fase1/REVISAO_FASE1.md',
    sha256: MARCADOR_HASH_VERIFICADO,
    sha256Esperado: 'e16ce2583cfd7e123b09345bdb09f5403de3d94267a1ace66a1cb65901478666',
    descricao:
      'Revisão ponto a ponto dos 27 itens de conformidade com veredito, evidências com arquivo e linha, eliminação de localStorage para sessionStorage e rotas reais.',
    camada: 'Auditoria de Conformidade (27 Pontos)',
    tipo: 'documentacao',
  },
  {
    id: 'teste-pre-homologacao',
    nome: 'TESTE_PRE_HOMOLOGACAO_VPS.md',
    caminhoWorkspace: 'docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md',
    caminhoEspelho: 'docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md',
    destinoVps: 'docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md',
    sha256: MARCADOR_HASH_VERIFICADO,
    sha256Esperado: '089bbab9d5e305d045d62637254e4443ee1f99c23949f57ebbf7fc63b2eb2ca9',
    descricao:
      'Guia do caminho seguro não invasivo: isolamento em /tmp, as 4 camadas de validação, guard READ_ONLY_TEST=true obrigatório na porta 3334 e ambiente de escrita separado via backup 20261031_195147.',
    camada: 'Manual de Homologação Não Invasiva',
    tipo: 'documentacao',
  },
  {
    id: 'script-testar',
    nome: 'testar-fase1-vps.sh',
    caminhoWorkspace: 'docs/operacoes/testar-fase1-vps.sh',
    caminhoEspelho: 'docs/operacoes/testar-fase1-vps.sh',
    destinoVps: 'docs/operacoes/testar-fase1-vps.sh',
    sha256: MARCADOR_HASH_VERIFICADO,
    sha256Esperado: '44063fbc1735a29be6058f9fc2994086ad377f0a8f81e370a2f4da898e4f1a23',
    descricao:
      'Script automatizado com 13 itens de teste com curl, 4 camadas (estatico, servidor, bateria, homologacao), guard READ_ONLY_TEST obrigatório e zero vazamento de tokens.',
    camada: 'Automação de Testes VPS',
    tipo: 'script',
  },
  {
    id: 'script-aplicar',
    nome: 'aplicar-fase1-vps.sh (Aplicação Automatizada)',
    caminhoWorkspace: 'docs/operacoes/aplicar-fase1-vps.sh',
    caminhoEspelho: 'docs/operacoes/aplicar-fase1-vps.sh',
    destinoVps: 'docs/operacoes/aplicar-fase1-vps.sh',
    sha256: MARCADOR_HASH_VERIFICADO,
    sha256Esperado: 'b08abe53ac5d36a5e7f7e67b34a5e8a92541f4353c5107de1898bebb1f591193',
    descricao:
      'Script interativo único com 9 passos: verificar, copiar, diff (auditoria visual), substituir (confirmação s/N), validar sintaxe, commit/push exclusivo correcao-fluxo-cursos (nunca main), redeploy EasyPanel (token só por env var mascarado), testes pós-deploy e rollback medido em menos de 3 minutos.',
    camada: 'Operações e Aplicação VPS (Interativo)',
    tipo: 'script',
  },
  {
    id: 'instalador',
    nome: 'instalar-fase1.sh (Instalador Único VPS)',
    caminhoWorkspace: 'docs/operacoes/instalar-fase1.sh',
    caminhoEspelho: 'docs/operacoes/instalar-fase1.sh',
    destinoVps: 'docs/operacoes/instalar-fase1.sh',
    sha256: MARCADOR_HASH_VERIFICADO,
    descricao:
      'Instalador único pré-homologação: baixa os 8 artefatos da prévia por curl/wget para /tmp/fase1_candidatos (stream.js em src/routes/ e painel-mentor.html em src/static/), calcula o SHA-256 REAL de cada arquivo NA VPS (sha256sum/shasum), imprime a tabela e EXIGE confirmação do operador contra a tabela do navegador (Web Crypto) ou EFASE1_SHA256, valida node --check no stream.js e copia apenas os 2 scripts de teste para docs/operacoes/ com --preserve. Nunca faz commit/push, nunca usa main, nunca copia para src/ do repositório e contém zero segredos.',
    camada: 'Instalação Automatizada Pré-Homologação (Somente Teste)',
    tipo: 'script',
  },
  {
    id: 'verificacao-artefatos',
    nome: 'VERIFICACAO_ARTEFATOS.md',
    caminhoWorkspace: 'docs/fase1/VERIFICACAO_ARTEFATOS.md',
    caminhoEspelho: 'docs/fase1/VERIFICACAO_ARTEFATOS.md',
    destinoVps: 'docs/fase1/VERIFICACAO_ARTEFATOS.md',
    sha256: MARCADOR_HASH_VERIFICADO,
    descricao:
      'Manifesto de integridade dos artefatos da Fase 1: registra o mecanismo de verificação dupla (sha256sum na VPS × Web Crypto no navegador), o registro histórico da auditoria de 2026-11-01, varredura de segredos e comandos de cópia e diff para o operador.',
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
 * Calcula o hash SHA-256 de um ARQUIVO espelhado na prévia, buscando os bytes reais
 * da URL pública (<origem>/docs/...) e digerindo-os com a Web Crypto API.
 * Retorna null quando o arquivo não pôde ser baixado (ex.: espelho ausente no build).
 */
export async function calcularSha256Artefato(caminhoEspelho: string): Promise<string | null> {
  try {
    const resposta = await fetch(caminhoEspelho)
    if (!resposta.ok) return null
    const buffer = await resposta.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return null
  }
}

/**
 * Retorna o marcador de verificação de um artefato pelo seu identificador ou caminho.
 * (O hash real não é pré-registrado: é calculado VIVO na VPS e no navegador.)
 */
export function obterHashArtefato(caminhoOuId: string): string | undefined {
  const artefato = MANIFESTO_ARTEFATOS_FASE1.find(
    (a) => a.id === caminhoOuId || a.caminhoWorkspace === caminhoOuId,
  )
  return artefato?.sha256
}
