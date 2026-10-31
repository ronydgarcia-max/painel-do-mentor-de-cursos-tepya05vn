import React, { useState } from 'react'
import {
  BookOpen,
  Users,
  Clock,
  Video,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  ShieldAlert,
  ExternalLink,
  Sparkles,
  Server,
  FileCheck,
  Download,
  Terminal,
  RotateCcw,
  ListChecks,
  Check,
  Copy,
  FolderGit2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Index() {
  const [activeTab, setActiveTab] = useState('operacoes')
  const [selectedDoc, setSelectedDoc] = useState<
    'backup' | 'restore' | 'rollback' | 'inventario' | 'checklist'
  >('backup')
  const [copiedDoc, setCopiedDoc] = useState<string | null>(null)
  const [selectedVideoSource, setSelectedVideoSource] = useState<
    'vps' | 'youtube' | 'onedrive' | 'cloudinary'
  >('vps')

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path)
    setCopiedDoc(path)
    setTimeout(() => setCopiedDoc(null), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">
              Fase 0 Concluída &bull; Aguardando Autorização
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
              Cursos API VPS 69.62.124.240
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            Painel de Revisão e Auditoria Técnica do Mentor
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Inspeção estrutural, auditoria de segurança, relatório técnico da Fase 0 e especificação
            do novo player interativo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a href="/docs/RELATORIO_FASE_0_MENTOR.md" target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200"
            >
              <FileText className="w-4 h-4 mr-2" />
              Ver Relatório Completo (.md)
            </Button>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Banner de Status Regulatório */}
        <Alert className="border-amber-500/40 bg-amber-950/20 text-amber-200">
          <ShieldAlert className="h-5 w-5 text-amber-400" />
          <AlertTitle className="font-semibold text-amber-300">
            Atenção: Nenhuma alteração de código ou deploy em produção executada sem autorização
          </AlertTitle>
          <AlertDescription className="text-amber-200/90 text-sm mt-1">
            Conforme as regras do projeto, o GoSkip não tem acesso à VPS (`69.62.124.240`). A
            análise completa da Fase 0 está concluída, os contratos das rotas foram mapeados e o
            plano de reescrita foi estabelecido abaixo.
          </AlertDescription>
        </Alert>

        {/* Dashboard de Métricas Auditadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total de Arquivos Mapeados
              </CardTitle>
              <FileCheck className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24</div>
              <p className="text-xs text-slate-500 mt-1">Rotas, modelos, middlewares e assets</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Rotas do Mentor Auditadas
              </CardTitle>
              <Layers className="w-4 h-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">16</div>
              <p className="text-xs text-slate-500 mt-1">Cursos, etapas, provas e streaming</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Problemas Críticos Identificados
              </CardTitle>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">3</div>
              <p className="text-xs text-slate-500 mt-1">
                Hardcoded Aula 27, Stream 403 e Path Traversal
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Armazenamento VPS
              </CardTitle>
              <Server className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1 GB</div>
              <p className="text-xs text-slate-500 mt-1">Limite MP4 /app/videos/{'{curso_id}'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Abas Principais de Análise */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 w-full flex flex-wrap justify-start h-auto gap-1">
            <TabsTrigger
              value="operacoes"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <Terminal className="w-4 h-4" />
              Operações VPS: Backup &amp; Rollback
            </TabsTrigger>
            <TabsTrigger
              value="resumo"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Visão Geral &amp; Arquitetura
            </TabsTrigger>
            <TabsTrigger
              value="problemas"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Falhas e Correções Críticas
            </TabsTrigger>
            <TabsTrigger
              value="player"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Novo Player Interativo (Adapta)
            </TabsTrigger>
            <TabsTrigger
              value="plano"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Plano da Fase 1 (Reescrita)
            </TabsTrigger>
          </TabsList>

          {/* Aba Operações: Backup & Rollback (Fase 0) */}
          <TabsContent value="operacoes" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Menu de Arquivos Operacionais */}
              <Card className="bg-slate-900 border-slate-800 lg:col-span-1 h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-emerald-400" />
                    Artefatos Operacionais
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Arquivos para o operador copiar e executar na VPS:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 p-3">
                  <button
                    onClick={() => setSelectedDoc('backup')}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                      selectedDoc === 'backup'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      backup-cursos-vps.sh
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      13 itens de backup e integridade
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedDoc('restore')}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                      selectedDoc === 'restore'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      restaurar-cursos-vps.sh
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Restauração guiada e --dry-run
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedDoc('rollback')}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                      selectedDoc === 'rollback'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      PLANO_ROLLBACK.md
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">8 etapas + 8 homologações</p>
                  </button>

                  <button
                    onClick={() => setSelectedDoc('inventario')}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                      selectedDoc === 'inventario'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      INVENTARIO_EASYPANEL.md
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Mapeamento dos 4 serviços</p>
                  </button>

                  <button
                    onClick={() => setSelectedDoc('checklist')}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors border ${
                      selectedDoc === 'checklist'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <ListChecks className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      CHECKLIST_PRE_FASE1.md
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Condições para autorização</p>
                  </button>
                </CardContent>
              </Card>

              {/* Detalhe do Artefato Selecionado */}
              <div className="lg:col-span-3 space-y-4">
                {selectedDoc === 'backup' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-2">
                            Script Bash Idempotente
                          </Badge>
                          <CardTitle className="text-lg text-white font-mono flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-emerald-400" />
                            docs/operacoes/backup-cursos-vps.sh
                          </CardTitle>
                          <CardDescription className="text-slate-400 text-xs mt-1">
                            Cria snapshot integral em{' '}
                            <code className="text-emerald-300">
                              /srv/backups/cursos/&lt;timestamp&gt;/
                            </code>{' '}
                            no Host VPS
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPath('docs/operacoes/backup-cursos-vps.sh')}
                          className="border-slate-700 bg-slate-950 text-xs shrink-0"
                        >
                          {copiedDoc === 'docs/operacoes/backup-cursos-vps.sh' ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                              Caminho Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              Copiar Caminho
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 text-xs">
                      <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                        <p className="font-semibold text-emerald-400">
                          Instrução de Execução na VPS (como root):
                        </p>
                        <pre className="p-2.5 bg-black/60 rounded text-slate-200 font-mono text-[11px] overflow-x-auto">
                          {`chmod +x docs/operacoes/backup-cursos-vps.sh
./docs/operacoes/backup-cursos-vps.sh`}
                        </pre>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">
                          13 Itens Automatizados no Backup:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            '1. Bundle Git (git bundle create --all) + Working Tree tar.gz',
                            '2. Hash estável e Git Tag (backup/pre-fase1-<timestamp>)',
                            '3. Dump completo PostgreSQL (-Fc via docker exec)',
                            '4. Schema-only e migrações (src/database/migrations/)',
                            '5. Snapshot PocketBase (pb_data via docker cp/volume)',
                            '6. Tar dos vídeos (/srv/cursos/videos/ com --warning=no-file-changed)',
                            '7. Metadados de volumes Docker (docker volume inspect)',
                            '8. Configurações EasyPanel (portas, volumes, networks em JSON)',
                            '9. Envs com SEGREDOS MASCARADOS (***REDACTED***)',
                            '10. Mapeamento de redes Docker (docker network inspect)',
                            '11. Snapshot do Redis (BGSAVE + dump.rdb)',
                            '12. Manifesto completo (backup-manifest.txt com SHA-256)',
                            '13. Teste de integridade automático (git bundle verify, pg_restore --list)',
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-300 flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'restore' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-2">
                            Restauração Guiada Interativa
                          </Badge>
                          <CardTitle className="text-lg text-white font-mono flex items-center gap-2">
                            <RotateCcw className="w-5 h-5 text-blue-400" />
                            docs/operacoes/restaurar-cursos-vps.sh
                          </CardTitle>
                          <CardDescription className="text-slate-400 text-xs mt-1">
                            Restauração controlada passo a passo com suporte a validação segura{' '}
                            <code className="text-blue-300">--dry-run</code>
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPath('docs/operacoes/restaurar-cursos-vps.sh')}
                          className="border-slate-700 bg-slate-950 text-xs shrink-0"
                        >
                          {copiedDoc === 'docs/operacoes/restaurar-cursos-vps.sh' ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                              Caminho Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              Copiar Caminho
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 text-xs">
                      <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                        <p className="font-semibold text-blue-400">
                          1. Simulação Prévia (Sem alterações no sistema):
                        </p>
                        <pre className="p-2.5 bg-black/60 rounded text-slate-200 font-mono text-[11px] overflow-x-auto">
                          {`./docs/operacoes/restaurar-cursos-vps.sh /srv/backups/cursos/<timestamp> --dry-run`}
                        </pre>
                        <p className="font-semibold text-emerald-400 mt-2">
                          2. Restauração Efetiva (com confirmação passo a passo):
                        </p>
                        <pre className="p-2.5 bg-black/60 rounded text-slate-200 font-mono text-[11px] overflow-x-auto">
                          {`./docs/operacoes/restaurar-cursos-vps.sh /srv/backups/cursos/<timestamp>`}
                        </pre>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">Etapas Executadas pelo Script:</h4>
                        <div className="space-y-1.5">
                          <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-300">
                            <strong>1. Validação de Checksums:</strong> Executa{' '}
                            <code className="text-blue-300">sha256sum -c</code> contra o manifesto
                            antes de qualquer intervenção.
                          </div>
                          <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-300">
                            <strong>2. Restauração Git:</strong> Checkout da tag anotada ou commit
                            estável gravado em <code className="text-blue-300">git-state.env</code>.
                          </div>
                          <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-300">
                            <strong>3. Restauração PostgreSQL:</strong> Executa{' '}
                            <code className="text-blue-300">pg_restore --clean --if-exists</code>{' '}
                            sem conflitos de schema.
                          </div>
                          <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-300">
                            <strong>4. Restauração PocketBase &amp; Vídeos:</strong> Descompacta os
                            tarballs nos diretórios persistentes do host.
                          </div>
                          <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-300">
                            <strong>5. Reinicialização Ordenada:</strong> Reinicia Redis,
                            PostgreSQL, PocketBase e Cursos-API na ordem segura.
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'rollback' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-2">
                            Procedimento de Contingência
                          </Badge>
                          <CardTitle className="text-lg text-white font-mono flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-400" />
                            docs/operacoes/PLANO_ROLLBACK.md
                          </CardTitle>
                          <CardDescription className="text-slate-400 text-xs mt-1">
                            Premissa mandatória: artefatos residem em{' '}
                            <code className="text-amber-300">/srv/backups/</code> no Host (fora do
                            container)
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPath('docs/operacoes/PLANO_ROLLBACK.md')}
                          className="border-slate-700 bg-slate-950 text-xs shrink-0"
                        >
                          {copiedDoc === 'docs/operacoes/PLANO_ROLLBACK.md' ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                              Caminho Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              Copiar Caminho
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 text-xs">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-amber-300">
                          As 8 Etapas na Ordem Exata:
                        </h4>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-300 bg-slate-950 p-3 rounded border border-slate-800">
                          <li>
                            <strong className="text-white">Restaurar o commit anterior:</strong>{' '}
                            Checkout da tag Git ou commit base 47aa7b1.
                          </li>
                          <li>
                            <strong className="text-white">Restaurar o banco:</strong> pg_restore
                            --clean do postgres-full.dump caso haja migration incompatível.
                          </li>
                          <li>
                            <strong className="text-white">Restaurar os vídeos:</strong>{' '}
                            Descompactação do tarball em /srv/cursos/videos/.
                          </li>
                          <li>
                            <strong className="text-white">
                              Recriar os serviços no EasyPanel:
                            </strong>{' '}
                            Reinicialização ou redeploy limpo dos containers.
                          </li>
                          <li>
                            <strong className="text-white">Validar a API:</strong> Checagem de
                            status 200 no endpoint raiz e 401/403 com token no mentor.
                          </li>
                          <li>
                            <strong className="text-white">Validar o player:</strong> HTTP 206
                            Partial Content com Range bytes no /stream/27.
                          </li>
                          <li>
                            <strong className="text-white">Validar o login do mentor:</strong>{' '}
                            Obtenção de token e listagem de cursos no painel.
                          </li>
                          <li>
                            <strong className="text-white">Validar o acesso do aluno:</strong>{' '}
                            Reprodução da aula e gravação de progresso em progresso_aulas.
                          </li>
                        </ol>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">
                          Os 8 Itens de Homologação Final (Exclusivos do Operador):
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                          {[
                            '1. Login do Mentor via credenciais / SSO',
                            '2. Listagem e status dos Cursos',
                            '3. Matriz Curricular e Etapas',
                            '4. Upload de Vídeo MP4 na VPS',
                            '5. Substituição de Mídia na Etapa',
                            '6. Streaming com Buffer Contínuo',
                            '7. Player e Materiais de Apoio (PDF)',
                            '8. Aula 27 e Acesso dos Alunos Matriculados',
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="p-2 rounded bg-slate-950/60 border border-slate-800 flex items-center gap-2"
                            >
                              <Badge
                                variant="outline"
                                className="text-[10px] border-amber-500/40 text-amber-300"
                              >
                                Pendente
                              </Badge>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'inventario' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-2">
                            Template Operacional
                          </Badge>
                          <CardTitle className="text-lg text-white font-mono flex items-center gap-2">
                            <Server className="w-5 h-5 text-purple-400" />
                            docs/operacoes/INVENTARIO_EASYPANEL.md
                          </CardTitle>
                          <CardDescription className="text-slate-400 text-xs mt-1">
                            Mapeamento dos 4 serviços: Cursos-API, PostgreSQL, PocketBase e Redis
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPath('docs/operacoes/INVENTARIO_EASYPANEL.md')}
                          className="border-slate-700 bg-slate-950 text-xs shrink-0"
                        >
                          {copiedDoc === 'docs/operacoes/INVENTARIO_EASYPANEL.md' ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                              Caminho Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              Copiar Caminho
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 text-xs text-slate-300">
                      <p>
                        O inventário contém os comandos{' '}
                        <code className="text-purple-300">docker inspect</code> para o operador
                        preencher cada campo sem registrar segredos, apenas os nomes das variáveis.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-950 rounded border border-slate-800">
                          <h5 className="font-semibold text-white mb-1">Cursos-API (Porta 3333)</h5>
                          <p className="text-slate-400 text-[11px]">
                            Backend Express. Depende de Postgres, Redis e PocketBase. Monta
                            /srv/cursos/videos/ em /app/videos/.
                          </p>
                        </div>
                        <div className="p-3 bg-slate-950 rounded border border-slate-800">
                          <h5 className="font-semibold text-white mb-1">PostgreSQL (Porta 5432)</h5>
                          <p className="text-slate-400 text-[11px]">
                            Banco relacional com usuários, cursos, aulas, etapas, matrículas,
                            progresso e avaliações.
                          </p>
                        </div>
                        <div className="p-3 bg-slate-950 rounded border border-slate-800">
                          <h5 className="font-semibold text-white mb-1">PocketBase (Porta 8090)</h5>
                          <p className="text-slate-400 text-[11px]">
                            Serviço de identidade/SSO persistido em pb_data.
                          </p>
                        </div>
                        <div className="p-3 bg-slate-950 rounded border border-slate-800">
                          <h5 className="font-semibold text-white mb-1">Redis (Porta 6379)</h5>
                          <p className="text-slate-400 text-[11px]">
                            Cache temporário e rate limit do login/bridge-proxy. Volátil em caso de
                            perda.
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
                        <strong className="text-purple-300">
                          Integrações Externas Registradas:
                        </strong>{' '}
                        Cloudinary (imagens/vídeos), Groq AI (moderação) e Microsoft Graph
                        (OneDrive).
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'checklist' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-2">
                            Governança Operacional
                          </Badge>
                          <CardTitle className="text-lg text-white font-mono flex items-center gap-2">
                            <ListChecks className="w-5 h-5 text-cyan-400" />
                            docs/operacoes/CHECKLIST_PRE_FASE1.md
                          </CardTitle>
                          <CardDescription className="text-slate-400 text-xs mt-1">
                            Separação rigorosa entre itens já atendidos e pendências do operador
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPath('docs/operacoes/CHECKLIST_PRE_FASE1.md')}
                          className="border-slate-700 bg-slate-950 text-xs shrink-0"
                        >
                          {copiedDoc === 'docs/operacoes/CHECKLIST_PRE_FASE1.md' ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                              Caminho Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              Copiar Caminho
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 text-xs">
                      <div>
                        <h4 className="font-semibold text-emerald-400 mb-2">
                          Já Confirmados e Auditados no Workspace:
                        </h4>
                        <ul className="space-y-1.5 text-slate-300 bg-slate-950 p-3 rounded border border-slate-800">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                              Branch correcao-fluxo-cursos e commit base 47aa7b1 confirmados
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                              Commit 34df2d6 isolado na prévia (não está na branch nem na VPS)
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                              Material completo de backup e rollback entregue em docs/operacoes/
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                              Segredos ausentes de qualquer arquivo de código ou documentação
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-amber-400 mb-2">
                          Pendências Obrigatórias a Devolver pelo Operador:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                          {[
                            '1. Execução do backup na VPS e validação do manifesto',
                            '2. Teste de restauração em modo --dry-run',
                            '3. Inventário EasyPanel preenchido com dados reais',
                            '4. Envio do arquivo provas.js',
                            '5. Screenshots da referência visual Adapta',
                            '6. Confirmação da versão do Node.js no container',
                            '7. Verificação do migration.sql da raiz',
                            '8. Confirmação do volume de vídeos /srv/cursos/videos/',
                            '9. ROTAÇÃO DO TOKEN DO EASYPANEL no painel',
                            '10. Sanitização do DOCUMENTACAO.md no commit',
                            '11. Confirmação de que nenhum commit foi publicado',
                          ].map((pend, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded bg-slate-950/80 border border-slate-800 flex items-start gap-2"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{pend}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Aba 1: Resumo & Arquitetura */}
          <TabsContent value="resumo" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-400" />
                    Rotas e Contratos Preservados
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Rotas existentes no backend Express que continuam ativas sem quebra de contrato.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="font-mono text-emerald-400">GET /mentor/dashboard</span>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                      Estatísticas
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="font-mono text-emerald-400">GET /mentor/cursos</span>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                      Cursos do Mentor
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="font-mono text-emerald-400">POST /mentor/cursos</span>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                      Criação (Rascunho)
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="font-mono text-emerald-400">
                      POST /mentor/cursos/upload-video-vps
                    </span>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                      Upload MP4 VPS
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="font-mono text-emerald-400">GET /stream/:aulaId</span>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                      HTTP Range Streaming
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                    <span className="font-mono text-emerald-400">
                      PUT /mentor/cursos/:id/publicar
                    </span>
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                      Publicação
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    Regras de Autenticação e Permissão
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Auditoria de autorização estrita baseada nos modelos de dados reais.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-300">
                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <p className="font-semibold text-white mb-1">Autorização Estrita:</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      O middleware <code className="text-amber-300">apenasMentor</code> valida no
                      banco que <code className="text-amber-300">mentor_status = 'aprovado'</code>{' '}
                      ou <code className="text-amber-300">role = 'admin'</code>. Mentores com status
                      pendente, suspenso ou reprovado são rejeitados com status 403.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <p className="font-semibold text-white mb-1">Isolamento Multi-tenant:</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Toda query de manipulação de curso valida{' '}
                      <code className="text-blue-300">WHERE id = $1 AND mentor_id = $2</code>,
                      impedindo acesso cruzado entre mentores distintos.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <p className="font-semibold text-white mb-1">
                      Trava de Integridade Curricular:
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Cursos com <code className="text-blue-300">total_matriculas &gt; 0</code> ou
                      com status <code className="text-blue-300">em_analise</code> têm edição
                      estrutural bloqueada para proteger o histórico dos alunos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba 2: Falhas e Correções Críticas */}
          <TabsContent value="problemas" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-slate-900 border-amber-900/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="destructive"
                      className="bg-red-500/20 text-red-400 border-red-500/30"
                    >
                      Crítico &bull; Rota /stream/:aulaId
                    </Badge>
                    <span className="text-xs font-mono text-slate-500">src/routes/stream.js</span>
                  </div>
                  <CardTitle className="text-white text-base mt-2">
                    1. Mapeamento Hardcoded Estático da Aula 27
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-300">
                  <p>
                    <strong>Causa:</strong> O arquivo define{' '}
                    <code className="text-red-300">
                      LOCAL_VIDEO_FILES = {'{ 27: "/app/videos/37/aula-27.mp4" }'}
                    </code>{' '}
                    de forma estática. Outras aulas locais não reproduzem e caem em 400 ou 404
                    porque o código não consulta o campo dinâmico{' '}
                    <code className="text-emerald-300">video_path</code> da tabela{' '}
                    <code className="text-emerald-300">aulas</code>.
                  </p>
                  <p>
                    <strong>Correção Recomendada:</strong> Consultar{' '}
                    <code className="text-blue-300">aulas.video_path</code> e{' '}
                    <code className="text-blue-300">aulas.video_type</code>. Se{' '}
                    <code className="text-blue-300">video_type === 'local'</code>, transmitir o
                    arquivo diretamente com suporte ao cabeçalho{' '}
                    <code className="text-blue-300">Range: bytes=start-end</code>, mantendo fallback
                    de retrocompatibilidade para o ID 27.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-amber-900/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="destructive"
                      className="bg-red-500/20 text-red-400 border-red-500/30"
                    >
                      Crítico &bull; Permissão de Pré-visualização
                    </Badge>
                    <span className="text-xs font-mono text-slate-500">
                      src/routes/stream.js:183
                    </span>
                  </div>
                  <CardTitle className="text-white text-base mt-2">
                    2. Bloqueio 403 do Mentor no Streaming da Própria Aula
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-300">
                  <p>
                    <strong>Causa:</strong> A rota exige que o usuário esteja registrado na tabela{' '}
                    <code className="text-red-300">matriculas</code> do curso. O mentor responsável
                    pelo curso é impedido de testar e pré-visualizar suas aulas no painel antes da
                    publicação.
                  </p>
                  <p>
                    <strong>Correção Recomendada:</strong> Estender a query de validação para
                    permitir se o usuário for aluno matriculado OU mentor proprietário (
                    <code className="text-emerald-300">cursos.mentor_id = req.usuario.id</code>) OU
                    administrador.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-amber-500/20 text-amber-400 border-amber-500/30"
                    >
                      Importante &bull; Sanitização de Caminhos
                    </Badge>
                    <span className="text-xs font-mono text-slate-500">
                      src/routes/etapas.js:294
                    </span>
                  </div>
                  <CardTitle className="text-white text-base mt-2">
                    3. Risco de Path Traversal na Remoção de Vídeo Local
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-300">
                  <p>
                    <strong>Causa:</strong> Ao excluir uma etapa, o arquivo em disco é deletado
                    usando{' '}
                    <code className="text-amber-300">
                      path.resolve(localRoot, etapa.video_path)
                    </code>
                    . Falta validação de padrão regex estrito no{' '}
                    <code className="text-amber-300">video_path</code>.
                  </p>
                  <p>
                    <strong>Correção Recomendada:</strong> Aplicar validação estrita com regex
                    garantindo que o caminho coincida com{' '}
                    <code className="text-emerald-300">/^[0-9]+\/[a-zA-Z0-9_\-\.]+\.mp4$/</code>{' '}
                    antes de qualquer chamada a{' '}
                    <code className="text-emerald-300">fs.unlinkSync</code>.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba 3: Novo Player Interativo (Referência Adapta) */}
          <TabsContent value="player" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      Especificação do Novo Player (Referência: Adapta Alunos)
                    </CardTitle>
                    <CardDescription className="text-slate-400 mt-1">
                      Inspirado em{' '}
                      <code className="text-blue-400">
                        alunos.adapta.org/area/conteudo/aula/7869245
                      </code>
                      , adaptado às regras de vídeo da Conexão Batista.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selectedVideoSource === 'vps' ? 'default' : 'outline'}
                      onClick={() => setSelectedVideoSource('vps')}
                      className="text-xs"
                    >
                      Vídeo Local VPS
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedVideoSource === 'youtube' ? 'default' : 'outline'}
                      onClick={() => setSelectedVideoSource('youtube')}
                      className="text-xs"
                    >
                      YouTube
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedVideoSource === 'onedrive' ? 'default' : 'outline'}
                      onClick={() => setSelectedVideoSource('onedrive')}
                      className="text-xs"
                    >
                      OneDrive
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mock Visual do Player + Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 border border-slate-800 rounded-lg overflow-hidden bg-slate-950 p-4">
                  {/* Coluna da Esquerda / Centro: Player */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group shadow-2xl">
                      {selectedVideoSource === 'vps' && (
                        <div className="text-center p-6 space-y-2">
                          <Play className="w-12 h-12 text-blue-500 mx-auto opacity-80 group-hover:scale-110 transition-transform" />
                          <p className="text-sm font-semibold text-slate-200">
                            Reprodução de Vídeo Local (VPS /stream/27)
                          </p>
                          <p className="text-xs text-slate-400">
                            Protocolo HTTP Range (206 Partial Content) &bull; Arquivo:{' '}
                            <span className="font-mono text-emerald-400">37/aula-27.mp4</span>
                          </p>
                        </div>
                      )}

                      {selectedVideoSource === 'youtube' && (
                        <div className="text-center p-6 space-y-2">
                          <Video className="w-12 h-12 text-red-500 mx-auto opacity-80" />
                          <p className="text-sm font-semibold text-slate-200">
                            Embed Oficial YouTube
                          </p>
                          <p className="text-xs text-slate-400">
                            Suporte a ID e URL canônica com player limpo
                          </p>
                        </div>
                      )}

                      {selectedVideoSource === 'onedrive' && (
                        <div className="text-center p-6 space-y-2">
                          <ExternalLink className="w-12 h-12 text-cyan-500 mx-auto opacity-80" />
                          <p className="text-sm font-semibold text-slate-200">
                            Streaming Microsoft Graph / OneDrive
                          </p>
                          <p className="text-xs text-slate-400">
                            Pipe de stream autenticado via Graph Client
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          Módulo 1 &bull; Aula 27
                        </span>
                        <h2 className="text-lg font-bold text-white mt-1">
                          Introdução à Liderança e Fundamentos
                        </h2>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700 bg-slate-900 text-xs"
                        >
                          Anterior
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs">
                          Próxima Aula
                        </Button>
                      </div>
                    </div>

                    {/* Materiais Complementares da Aula */}
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                      <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-400" />
                        Materiais de Apoio (PDF Complementar)
                      </h4>
                      <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 text-xs">
                        <span className="text-slate-300 font-medium">
                          Apostila_Modulo_1_Lideranca.pdf (4.2 MB)
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300 h-7 text-xs"
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Coluna da Direita: Sidebar da Matriz Curricular (Adapta Style) */}
                  <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" />
                        Matriz Curricular
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-emerald-500/40 text-emerald-400"
                      >
                        85% Concluído
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[85%]" />
                    </div>

                    {/* Lista de Aulas */}
                    <div className="space-y-1.5 text-xs">
                      <div className="p-2.5 rounded bg-blue-950/40 border border-blue-500/30 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-medium">27. Introdução à Liderança</span>
                        </div>
                        <span className="text-[10px] text-blue-300 font-mono">14:20</span>
                      </div>

                      <div className="p-2.5 rounded bg-slate-950/50 hover:bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>28. Comunicação Pastoral Eficaz</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">18:45</span>
                      </div>

                      <div className="p-2.5 rounded bg-slate-950/50 hover:bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>29. Planejamento Estratégico</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">22:10</span>
                      </div>

                      <div className="p-2.5 rounded bg-slate-950/50 hover:bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>30. Avaliação e Prova do Módulo</span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-medium">Quiz</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba 4: Plano da Fase 1 */}
          <TabsContent value="plano" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Cronograma da Fase 1: Reescrita Controlada
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Etapas sequenciais de implementação prontas para execução imediata após a
                  autorização do mantenedor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      step: '1. Estrutura do Painel',
                      desc: 'Reescrita do frontend para React + Tailwind + TypeScript com layout responsivo e tabs organizadas.',
                    },
                    {
                      step: '2. Autenticação Unificada',
                      desc: 'Integração transparente com JWT no localStorage, suporte a SSO e headers x-cursos-token.',
                    },
                    {
                      step: '3. Gestão de Cursos',
                      desc: 'Formulário completo com campos canônicos (categoria, subcategoria, carga horária, vitrine e moderação Groq).',
                    },
                    {
                      step: '4. Editor de Matriz Curricular',
                      desc: 'CRUD de etapas com reordenação, seleção de tipo de mídia (Local VPS, YouTube, OneDrive, Cloudinary).',
                    },
                    {
                      step: '5. Upload de Vídeos Locais (VPS)',
                      desc: 'Integração com endpoint `/mentor/cursos/upload-video-vps` respeitando o limite de 1GB e feedback de progresso.',
                    },
                    {
                      step: '6. Streaming Dinâmico no Backend',
                      desc: 'Ajuste no `src/routes/stream.js` para ler `aulas.video_path` e permitir pré-visualização para o mentor.',
                    },
                    {
                      step: '7. Novo Player Interativo',
                      desc: 'Player com layout estilo Adapta (sidebar de aulas, navegação de etapas, controles e materiais PDF).',
                    },
                    {
                      step: '8. Validações e Testes Locais',
                      desc: 'Execução de testes locais simulados para as 30 condições especificadas no briefing.',
                    },
                    {
                      step: '9. Build, Commit e Instruções de Deploy',
                      desc: 'Geração de build limpo, registro de commit com hash e manual passo a passo para deploy na VPS.',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.step}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-6 text-center text-xs text-slate-500">
        Plataforma Cursos API &bull; Conexão Batista &bull; Revisão Técnica GoSkip &bull; VPS
        69.62.124.240
      </footer>
    </div>
  )
}
