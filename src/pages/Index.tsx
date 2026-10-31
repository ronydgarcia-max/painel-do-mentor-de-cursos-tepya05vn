import React, { useState } from 'react'
import {
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Video,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  ShieldAlert,
  Search,
  ExternalLink,
  ChevronRight,
  Upload,
  Sparkles,
  Server,
  FileCheck,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Index() {
  const [activeTab, setActiveTab] = useState('resumo')
  const [selectedVideoSource, setSelectedVideoSource] = useState<
    'vps' | 'youtube' | 'onedrive' | 'cloudinary'
  >('vps')

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
