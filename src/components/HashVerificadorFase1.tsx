/**
 * src/components/HashVerificadorFase1.tsx
 *
 * Verificação de integridade INDEPENDENTE no navegador (fonte 2 de 2):
 * para cada artefato espelhado em public/docs/ (mesma origem da prévia), busca os
 * bytes reais via fetch e calcula o SHA-256 com a Web Crypto API
 * (crypto.subtle.digest('SHA-256', ...)), exibindo o hash em hex.
 *
 * POR QUE EXISTE: o instalador (docs/operacoes/instalar-fase1.sh) é gerado num
 * ambiente SEM execução de shell — não pode embutir hashes. Ele calcula o SHA-256
 * NA VPS (sha256sum) sobre os bytes baixados e o operador compara com ESTA tabela,
 * calculada de forma independente no navegador, antes de confirmar (ou informa
 * EFASE1_SHA256="caminho=hash;..." com os valores daqui). Nenhum hash é inventado
 * aqui: todo valor exibido é calculado VIVO sobre os bytes servidos pela prévia.
 */

import { useState } from 'react'
import { RefreshCw, Copy, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MANIFESTO_ARTEFATOS_FASE1, calcularSha256Artefato } from '@/lib/manifestHelper'

type EstadoHash = 'pendente' | 'calculando' | 'ok' | 'indisponivel'

interface LinhaHash {
  id: string
  caminhoEspelho: string
  estado: EstadoHash
  hash: string | null
}

const ESTADO_INICIAL: LinhaHash[] = MANIFESTO_ARTEFATOS_FASE1.map((item) => ({
  id: item.id,
  caminhoEspelho: item.caminhoEspelho,
  estado: 'pendente' as EstadoHash,
  hash: null,
}))

export function HashVerificadorFase1({ origemArtefatos }: { origemArtefatos: string }) {
  const [linhas, setLinhas] = useState<LinhaHash[]>(ESTADO_INICIAL)
  const [calculando, setCalculando] = useState(false)
  const [jaCalculou, setJaCalculou] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const calcularTodos = async () => {
    setCalculando(true)
    setLinhas((atuais) => atuais.map((l) => ({ ...l, estado: 'calculando', hash: null })))
    const resultados = await Promise.all(
      ESTADO_INICIAL.map(async (item) => {
        const hash = await calcularSha256Artefato(`${origemArtefatos}/${item.caminhoEspelho}`)
        return {
          ...item,
          estado: (hash ? 'ok' : 'indisponivel') as EstadoHash,
          hash,
        }
      }),
    )
    setLinhas(resultados)
    setCalculando(false)
    setJaCalculou(true)
  }

  const montarTabela = () => {
    const cabecalho = '# SHA-256 calculado no navegador (Web Crypto) — prévia'
    const corpo = linhas
      .map((l) => {
        const hash = l.estado === 'ok' && l.hash ? l.hash : 'NAO_DISPONIVEL'
        return `${hash}  ${l.caminhoEspelho}`
      })
      .join('\n')
    return `${cabecalho}\n${corpo}`
  }

  const copiarTabela = () => {
    navigator.clipboard.writeText(montarTabela())
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const quantidadeOk = linhas.filter((l) => l.estado === 'ok').length
  const totalEfmirror = linhas.length

  return (
    <div className="p-3 rounded bg-slate-900 border border-blue-900/50 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="font-semibold text-white text-xs flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          SHA-256 calculado no navegador (verificação independente — fonte 2 de 2)
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={calcularTodos}
            disabled={calculando}
            className="text-[11px] border-emerald-800 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40"
          >
            {calculando ? (
              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
            )}
            {calculando ? 'Calculando...' : 'Recalcular hashes'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={copiarTabela}
            disabled={!jaCalculou}
            className="text-[11px] border-slate-700 bg-slate-950/60 text-slate-300 hover:bg-slate-800"
          >
            <Copy className="w-3.5 h-3.5 mr-1" />
            {copiado ? 'Tabela Copiada!' : 'Copiar Tabela'}
          </Button>
        </div>
      </div>

      {/* Aviso textual claro sobre o papel desta tabela */}
      <div className="p-2 rounded bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200 space-y-1">
        <span className="flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
          <span>
            <strong>Estes hashes são calculados no navegador como VERIFICAÇÃO INDEPENDENTE</strong>{' '}
            (Web Crypto sobre os bytes servidos por {origemArtefatos}). O instalador na VPS calcula
            o SHA-256 de novo com <code>sha256sum</code> sobre os bytes baixados e
            <strong> só prossegue após você comparar as duas tabelas e confirmar com 's'</strong>{' '}
            (ou após conferir a variável <code>EFASE1_SHA256</code> com os valores daqui).
          </span>
        </span>
      </div>

      {/* Tabela arquivo → hash calculado */}
      <div className="bg-slate-950 rounded border border-slate-800 font-mono text-[10px] overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="px-2 py-1.5 font-semibold">Arquivo espelhado</th>
              <th className="px-2 py-1.5 font-semibold">SHA-256 (hex, calculado no navegador)</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.id} className="border-b border-slate-900 last:border-0">
                <td className="px-2 py-1.5 text-slate-300 break-all">{linha.caminhoEspelho}</td>
                <td className="px-2 py-1.5 break-all">
                  {linha.estado === 'ok' && linha.hash ? (
                    <span className="text-emerald-300">{linha.hash}</span>
                  ) : linha.estado === 'calculando' ? (
                    <span className="text-blue-300 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> calculando...
                    </span>
                  ) : linha.estado === 'indisponivel' ? (
                    <span className="text-amber-400">
                      indisponível (espelho ausente nesta origem)
                    </span>
                  ) : (
                    <span className="text-slate-500">— clique em "Recalcular hashes" —</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {jaCalculou && !calculando && (
        <p className="text-[10px] text-slate-400">
          {quantidadeOk}/{totalEfmirror} artefatos calculados com sucesso. Copie a tabela e compare
          com a saída do instalador na VPS (<code>sha256sum</code>) antes de confirmar.
        </p>
      )}
    </div>
  )
}
