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
  GitBranch,
  ShieldCheck,
  KeyRound,
  Database,
  Radio,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Index() {
  const [activeTab, setActiveTab] = useState('commits_seguranca')
  const [selectedDoc, setSelectedDoc] = useState<
    | 'backup'
    | 'restore'
    | 'rollback'
    | 'inventario'
    | 'checklist'
    | 'fluxo_deploy'
    | 'seguranca_secrets'
  >('checklist')
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
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">
              Fase 0: Preparação Segura Pré-Fase 1
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
              github.com/ronydgarcia-max/cursos-api (correcao-fluxo-cursos)
            </Badge>
            <Badge
              variant="outline"
              className="border-purple-500/50 text-purple-400 bg-purple-500/10"
            >
              Commit Base: 47aa7b1
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            Painel do Mentor de Cursos &bull; Auditoria Pré-Fase 1
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Governança rigorosa, classificação de commits, sanitização de credenciais, fluxo
            GitHub/EasyPanel em 14 etapas e plano de streaming dinâmico.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopyPath('docs/RELATORIO_FASE_0_MENTOR.md')}
            className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs"
          >
            <FileText className="w-3.5 h-3.5 mr-1 text-blue-400" />
            {copiedDoc === 'docs/RELATORIO_FASE_0_MENTOR.md'
              ? 'Caminho Copiado!'
              : 'Copiar Caminho Relatório'}
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Banner de Status Regulatório e Governança */}
        <Alert className="border-amber-500/40 bg-amber-950/20 text-amber-200">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />
          <AlertTitle className="font-semibold text-amber-300">
            Regra Mandatória de Segurança: Nenhuma alteração de código ou deploy em produção
            realizado
          </AlertTitle>
          <AlertDescription className="text-amber-200/90 text-sm mt-1 space-y-1">
            <p>
              O GoSkip <strong>NÃO TEM ACESSO À VPS</strong>. A homologação, o backup e o deploy em
              produção são manuais pelo operador. Arquivos de produção (<code>mentor.js</code>,{' '}
              <code>etapas.js</code>, <code>painel-mentor.html</code>, <code>stream.js</code>,
              banco, migrations, etc.) permanecem estritamente intactos.
            </p>
            <p className="text-xs text-amber-300/80 font-mono">
              A Fase 1 só começará após autorização expressa do operador e confirmação de backup na
              VPS.
            </p>
          </AlertDescription>
        </Alert>

        {/* Dashboard de Métricas e Status de Governança */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Commits do Workspace
              </CardTitle>
              <GitBranch className="w-4 h-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white font-mono">34df2d6 &bull; ecf1cc0</div>
              <p className="text-xs text-emerald-400 mt-1">
                100% isolados na prévia GoSkip (fora da VPS)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Segurança &amp; Token
              </CardTitle>
              <KeyRound className="w-4 h-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-amber-400 flex items-center gap-1.5">
                EXPOSTO - ROTACIONAR
              </div>
              <p className="text-xs text-slate-400 mt-1">[TOKEN_REMOVIDO_E_ROTACIONADO]</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Fluxo de Deploy GitHub
              </CardTitle>
              <Terminal className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white">14 Etapas</div>
              <p className="text-xs text-blue-400 mt-1">correcao-fluxo-cursos (main protegida)</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Streaming da Aula 27
              </CardTitle>
              <Radio className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white">Plano Dinâmico</div>
              <p className="text-xs text-purple-400 mt-1">
                Ler video_path em /app/videos (sem código)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Abas Principais de Análise */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 w-full flex flex-wrap justify-start h-auto gap-1">
            <TabsTrigger
              value="commits_seguranca"
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <GitBranch className="w-4 h-4" />
              Situação dos Commits &amp; Segurança
            </TabsTrigger>
            <TabsTrigger
              value="checklist_fase1"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <ListChecks className="w-4 h-4" />
              Checklist Pré-Fase 1
            </TabsTrigger>
            <TabsTrigger
              value="deploy_14etapas"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <Terminal className="w-4 h-4" />
              Fluxo Deploy (14 Etapas)
            </TabsTrigger>
            <TabsTrigger
              value="streaming_plano"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <Radio className="w-4 h-4" />
              Plano do Streaming
            </TabsTrigger>
            <TabsTrigger
              value="versoes_migrations"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <Database className="w-4 h-4" />
              Versões &amp; Migrations
            </TabsTrigger>
            <TabsTrigger
              value="operacoes"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white flex items-center gap-1.5"
            >
              <FolderGit2 className="w-4 h-4" />
              Scripts VPS (Backup/Rollback)
            </TabsTrigger>
            <TabsTrigger
              value="player"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white flex items-center gap-1.5"
            >
              <Play className="w-4 h-4" />
              Mock do Player (Adapta)
            </TabsTrigger>
          </TabsList>

          {/* Aba 1: Situação dos Commits e Segurança */}
          <TabsContent value="commits_seguranca" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Situação dos Commits do Workspace */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      Auditoria de Commits
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">Workspace GoSkip</span>
                  </div>
                  <CardTitle className="text-lg text-white mt-2 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-cyan-400" />
                    Situação dos Commits do Workspace (34df2d6 e ecf1cc0)
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Resposta estruturada aos 7 pontos levantados pelo operador da VPS:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">1. Onde foram criados:</strong>
                        <p className="text-slate-400">
                          Criados estritamente dentro do workspace de prévia do GoSkip.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">
                          2. Não pertencem ao repositório real:
                        </strong>
                        <p className="text-slate-400">
                          Não pertencem ao repositório <code>cursos-api</code>.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">3. Não estão na branch de trabalho:</strong>
                        <p className="text-slate-400">
                          Não pertencem à branch <code>correcao-fluxo-cursos</code>.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">4. Não foram enviados ao GitHub:</strong>
                        <p className="text-slate-400">Nenhum push foi executado para o GitHub.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">5. Não alteram produção:</strong>
                        <p className="text-slate-400">
                          Zero impacto no ambiente ou serviços da VPS.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">6. Conteúdo exclusivo:</strong>
                        <p className="text-slate-400">
                          Contêm apenas documentação e o protótipo de visualização (
                          <code>docs/RELATORIO_FASE_0_MENTOR.md</code> e{' '}
                          <code>src/pages/Index.tsx</code>).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">7. Destino e isolamento:</strong>
                        <p className="text-slate-400">
                          Mantidos no workspace apenas como material de referência.{' '}
                          <strong>NÃO serão publicados na VPS.</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-200">
                    <strong>Conclusão:</strong> Commits de relatório/protótipo ficam 100% separados
                    de produção e não serão misturados à branch de trabalho sem autorização
                    expressa.
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Segurança dos Relatórios & Token EasyPanel */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="destructive"
                      className="bg-red-500/20 text-red-400 border-red-500/30"
                    >
                      EXPOSTO - ROTACIONAR
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">
                      docs/operacoes/SEGURANCA_SECRETS.md
                    </span>
                  </div>
                  <CardTitle className="text-lg text-white mt-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    Segurança dos Relatórios &amp; Política de Secrets
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Sanitização ativa, mascaramento e solicitação de rotação de credenciais:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 bg-red-950/20 border border-red-800/40 rounded space-y-2">
                    <p className="font-semibold text-red-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      Alerta de Rotação Obrigatória no EasyPanel:
                    </p>
                    <p className="text-slate-300">
                      O relatório anterior continha um token de deploy do EasyPanel. O valor real
                      foi completamente removido e substituído por:
                    </p>
                    <div className="p-2 bg-black/60 rounded font-mono text-amber-300 text-center font-bold">
                      [TOKEN_REMOVIDO_E_ROTACIONADO]
                    </div>
                    <p className="text-slate-400">
                      O valor real <strong>não é reproduzido em nenhum arquivo</strong> deste
                      workspace e deve ser rotacionado manualmente pelo operador no painel do
                      EasyPanel.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-white">Política de Sanitização Aplicada:</h4>
                    <p className="text-slate-400">
                      Senhas, chaves de API, cookies, headers Authorization, chaves privadas,
                      strings de conexão e valores de secrets foram sanitizados em todos os
                      documentos. Mantidos apenas:{' '}
                      <strong>
                        nome da variável, serviço onde é usada, finalidade e exemplo fictício
                      </strong>
                      .
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-300 font-semibold">
                      Exemplos de Secrets Mascarados:
                    </span>
                    <p className="text-slate-400 font-mono text-[11px]">
                      JWT_SECRET &bull; MENTOR_JWT_SECRET &bull; CURSOS_API_BRIDGE_SECRET &bull;
                      POSTGRES_PASSWORD &bull; REDIS_PASSWORD &bull; CLOUDINARY_API_SECRET &bull;
                      MS_GRAPH_CLIENT_SECRET &bull; GROQ_API_KEY
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba 2: Checklist Pré-Fase 1 */}
          <TabsContent value="checklist_fase1" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <ListChecks className="w-5 h-5 text-emerald-400" />
                      Checklist de Entrega Pré-Fase 1 (Status por Item)
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs mt-1">
                      Distinção rigorosa entre itens prontos no workspace e pendências que dependem
                      do operador / envio externo.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyPath('docs/operacoes/CHECKLIST_PRE_FASE1.md')}
                    className="border-slate-700 bg-slate-950 text-xs shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Copiar Caminho do Checklist
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-xs">
                {/* Grupo 1: Pronto no Workspace */}
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    1. Pronto e Auditado no Workspace GoSkip:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                    {[
                      'Branch de trabalho correcao-fluxo-cursos e commit base 47aa7b1 definidos',
                      'Commits 34df2d6 e ecf1cc0 classificados como internos e isolados',
                      'Script de backup com 13 itens entregue (docs/operacoes/backup-cursos-vps.sh)',
                      'Script de restauração com --dry-run entregue (restaurar-cursos-vps.sh)',
                      'Plano de rollback em 8 etapas e homologações (PLANO_ROLLBACK.md)',
                      'Template de inventário EasyPanel entregue (INVENTARIO_EASYPANEL.md)',
                      'Fluxo de deploy GitHub/EasyPanel em 14 etapas documentado',
                      'Política de segurança de secrets e mascaramento formalizada',
                      'Token exposto marcado como [TOKEN_REMOVIDO_E_ROTACIONADO]',
                      'Plano de correção do streaming dinâmico especificado sem alterar stream.js',
                      'Delimitação estrita de arquivos intocados na Fase 0',
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-slate-950/80 border border-slate-800 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grupo 2: Pendente do Operador */}
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    2. Pendente do Operador da VPS (Execução / Confirmação):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                    {[
                      'Executar backup-cursos-vps.sh na VPS e validar manifesto SHA-256',
                      'Executar restaurar-cursos-vps.sh em modo --dry-run para teste',
                      'Preencher INVENTARIO_EASYPANEL.md com dados reais dos 4 serviços',
                      'ROTAÇÃO OBRIGATÓRIA DO TOKEN DO EASYPANEL no painel de webhooks',
                      'Confirmar versão do Node.js no container (Node 18 vs Node 20)',
                      'Verificar se o migration.sql da raiz já foi executado no PostgreSQL',
                      'Confirmar permissões de gravação no volume /srv/cursos/videos/',
                      'Sanitizar DOCUMENTACAO.md no repositório da VPS',
                      'Confirmar que nenhum commit foi mesclado sem homologação',
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-slate-950/80 border border-amber-900/30 flex items-start gap-2"
                      >
                        <Badge
                          variant="outline"
                          className="text-[10px] border-amber-500/40 text-amber-300 shrink-0"
                        >
                          Pendente VPS
                        </Badge>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grupo 3: Aguardando Envio do Operador */}
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4" />
                    3. Aguardando Envio Separado pelo Operador:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                    <div className="p-3 rounded bg-slate-950/80 border border-cyan-900/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white font-mono">src/routes/provas.js</strong>
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px]">
                          Aguardando Envio
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Arquivo será enviado separadamente pelo operador.{' '}
                        <strong>Não disponível nesta rodada</strong>: rotas e lógica de provas não
                        foram analisadas nem inventadas.
                      </p>
                    </div>

                    <div className="p-3 rounded bg-slate-950/80 border border-cyan-900/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-white font-mono">
                          Screenshots do Player Adapta
                        </strong>
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px]">
                          Aguardando Envio
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Capturas da área restrita de alunos serão enviadas pelo operador. Análise
                        atual é baseada na descrição e mock conceitual, pois a página real exige
                        login.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba 3: Fluxo de Deploy GitHub em 14 Etapas */}
          <TabsContent value="deploy_14etapas" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-2">
                      Procedimento Operacional
                    </Badge>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-blue-400" />
                      Fluxo de Deploy GitHub &bull; As 14 Etapas Exatas
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs mt-1">
                      Mapeamento sequencial de ponta a ponta: do workspace ao EasyPanel e
                      homologação final na VPS.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyPath('docs/operacoes/FLUXO_DEPLOY_GITHUB.md')}
                    className="border-slate-700 bg-slate-950 text-xs shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Copiar docs/operacoes/FLUXO_DEPLOY_GITHUB.md
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      step: 1,
                      title: '1. Alteração local pelo GoSkip',
                      desc: 'Edição cirúrgica no workspace respeitando contratos de API (somente após autorização da Fase 1).',
                    },
                    {
                      step: 2,
                      title: '2. Testes locais',
                      desc: 'Verificação estática, typecheck, lint e validação de ausência de credenciais em texto puro.',
                    },
                    {
                      step: 3,
                      title: '3. Build',
                      desc: 'Execução de npm run build sem erros de compilação ou empacotamento.',
                    },
                    {
                      step: 4,
                      title: '4. Commit',
                      desc: 'Criação de commit semântico rastreável e documentação do hash gerado.',
                    },
                    {
                      step: 5,
                      title: '5. Push para correcao-fluxo-cursos',
                      desc: 'Envio exclusivo para a branch autorizada. AVISO: branch main não será usada sem autorização.',
                    },
                    {
                      step: 6,
                      title: '6. EasyPanel reconstrói o serviço Cursos-API',
                      desc: 'Operador aciona Rebuild/Redeploy no dashboard do EasyPanel para o serviço Cursos-API.',
                    },
                    {
                      step: 7,
                      title: '7. Logs do deploy',
                      desc: 'Operador acompanha logs de inicialização, checando pool do Postgres, Redis e Express na porta 3333.',
                    },
                    {
                      step: 8,
                      title: '8. Health check',
                      desc: 'Validação via curl no endpoint raiz ou de saúde (sem erro 502/503).',
                    },
                    {
                      step: 9,
                      title: '9. Teste da API',
                      desc: 'Checagem de retorno 401/403 em /mentor/dashboard sem token (middleware ativo).',
                    },
                    {
                      step: 10,
                      title: '10. Teste do mentor',
                      desc: 'Requisição GET /mentor/cursos com token válido retornando 200 OK e lista de cursos.',
                    },
                    {
                      step: 11,
                      title: '11. Teste do aluno',
                      desc: 'Acesso e listagem de cursos no frontend do aluno sem quebra de contrato.',
                    },
                    {
                      step: 12,
                      title: '12. Teste do upload',
                      desc: 'Upload de MP4 via /mentor/cursos/upload-video-vps gravando em /app/videos/{curso_id}/.',
                    },
                    {
                      step: 13,
                      title: '13. Teste do streaming',
                      desc: 'Requisição GET /stream/:aulaId com Range bytes retornando 206 Partial Content e buffer contínuo.',
                    },
                    {
                      step: 14,
                      title: '14. Confirmação ou rollback',
                      desc: 'Se todos os testes passarem, homologação concluída; se falhar, aciona PLANO_ROLLBACK.md para o commit 47aa7b1.',
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-bold text-xs shrink-0 mt-0.5">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="text-slate-400 text-[11px] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded bg-blue-950/30 border border-blue-800/40 text-blue-200">
                  <strong>Avisos em Destaque:</strong> Branch <code>main</code> protegida e não
                  utilizada sem autorização; commits do workspace não são publicados
                  automaticamente; deploy, logs e homologação são 100% manuais pelo operador na VPS.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba 4: Plano do Streaming (Documentação) */}
          <TabsContent value="streaming_plano" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Apenas Documentação &bull; Sem Implementar Nesta Rodada
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">
                    src/routes/stream.js (Intocado)
                  </span>
                </div>
                <CardTitle className="text-lg text-white mt-2 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-purple-400" />
                  Plano de Correção do Streaming Dinâmico
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Especificação aprovada para substituição do mapa estático e liberação do mentor na
                  Fase 1:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-3 bg-red-950/20 border border-red-800/30 rounded space-y-1">
                  <span className="font-semibold text-red-300">
                    Problema Atual (Mapa Fixo da Aula 27):
                  </span>
                  <p className="text-slate-300">
                    A rota <code>GET /stream/:aulaId</code> usa{' '}
                    <code>LOCAL_VIDEO_FILES = {'{ 27: ... }'}</code>. Qualquer outra aula com{' '}
                    <code>video_type = 'local'</code> falha com erro 400. Além disso, o mentor
                    proprietário do curso recebe erro 403 por não estar matriculado como aluno.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
                    <strong className="text-emerald-400">1. Consulta Dinâmica:</strong>
                    <p className="text-slate-400">
                      Ler <code>video_path</code> e <code>video_type</code> da tabela{' '}
                      <code>aulas</code> no PostgreSQL.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
                    <strong className="text-emerald-400">2. Proteção Path Traversal:</strong>
                    <p className="text-slate-400">
                      Resolver com <code>path.resolve('/app/videos', aula.video_path)</code> e
                      validar que o caminho resultante permanece dentro de <code>/app/videos/</code>
                      .
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
                    <strong className="text-emerald-400">3. Validação de Arquivo:</strong>
                    <p className="text-slate-400">
                      Checar existência física em disco (<code>fs.existsSync</code>) e retornar HTTP
                      404 seguro caso não encontrado.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
                    <strong className="text-emerald-400">4. Fallback Temporário:</strong>
                    <p className="text-slate-400">
                      Manter mapa fixo da aula 27 como fallback exclusivo caso{' '}
                      <code>video_path</code> esteja nulo no banco.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
                    <strong className="text-emerald-400">5. Liberação do Mentor:</strong>
                    <p className="text-slate-400">
                      Permitir acesso ao streaming para aluno matriculado OU mentor dono do curso (
                      <code>cursos.mentor_id = req.usuario.id</code>) OU admin.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
                    <strong className="text-emerald-400">6. Limpeza de Vídeo Órfão:</strong>
                    <p className="text-slate-400">
                      Deletar arquivo antigo de vídeo quando o mentor substituir o{' '}
                      <code>video_path</code> de uma aula.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-purple-950/40 border border-purple-800/40 text-purple-200">
                  <strong>Status na Rodada Atual:</strong> Apenas documentado.{' '}
                  <strong>NÃO IMPLEMENTADO</strong> nesta rodada (stream.js preservado intacto).
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba 5: Versões e Migrations */}
          <TabsContent value="versoes_migrations" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-400" />
                  Estado de Versões e Migrations (O que Falta Confirmar na VPS)
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Mapeamento minucioso de dependências e discrepâncias detectadas:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="p-2 font-medium">Componente</th>
                        <th className="p-2 font-medium">No Workspace</th>
                        <th className="p-2 font-medium">Conflito / Suspeita</th>
                        <th className="p-2 font-medium">Confirmação Pendente na VPS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      <tr>
                        <td className="p-2 font-semibold text-white">Node.js Runtime</td>
                        <td className="p-2 font-mono text-blue-300">Dockerfile: node:20-alpine</td>
                        <td className="p-2 text-amber-300">DOCUMENTACAO.md diz Node 18</td>
                        <td className="p-2 text-slate-400">
                          Operador deve rodar <code>node -v</code> no container da VPS
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold text-white">Scripts de Migration</td>
                        <td className="p-2 font-mono text-blue-300">
                          src/database/migrations/*.js
                        </td>
                        <td className="p-2 text-amber-300">migration.sql existe na raiz</td>
                        <td className="p-2 text-slate-400">
                          runMigrations só lê pasta src; migration.sql da raiz NÃO roda automático.
                          Confirmar se ALTER TABLE já foi rodado.
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold text-white">Novas Migrations na Fase 1</td>
                        <td className="p-2 text-emerald-400">Regra de Minimização</td>
                        <td className="p-2 text-slate-400">Sem criação desnecessária</td>
                        <td className="p-2 text-slate-400">
                          Se houver DDL, rollback será documentado e testado antes do merge
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-400">
                  <strong className="text-amber-300">
                    Arquivos Protegidos que NÃO Serão Alterados na Fase 1:
                  </strong>
                  <p className="mt-1 font-mono text-[11px] text-slate-300">
                    mentor.js &bull; etapas.js &bull; painel-mentor.html &bull; stream.js &bull;
                    banco &bull; migrations &bull; autenticação &bull; EasyPanel &bull; Dockerfile
                    &bull; deploy &bull; frontend do aluno &bull; rotas públicas
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Qualquer alteração futura dependerá de autorização expressa e análise prévia de
                    provas.js.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba 6: Scripts de Operações (Backup e Rollback) */}
          <TabsContent value="operacoes" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Menu Lateral de Documentos Operacionais */}
              <Card className="bg-slate-900 border-slate-800 lg:col-span-1 h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-emerald-400" />
                    Documentos da VPS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 p-3 text-xs">
                  <button
                    onClick={() => setSelectedDoc('backup')}
                    className={`w-full text-left p-2 rounded border transition-colors ${
                      selectedDoc === 'backup'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      backup-cursos-vps.sh
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedDoc('restore')}
                    className={`w-full text-left p-2 rounded border transition-colors ${
                      selectedDoc === 'restore'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                      restaurar-cursos-vps.sh
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedDoc('rollback')}
                    className={`w-full text-left p-2 rounded border transition-colors ${
                      selectedDoc === 'rollback'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      PLANO_ROLLBACK.md
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedDoc('inventario')}
                    className={`w-full text-left p-2 rounded border transition-colors ${
                      selectedDoc === 'inventario'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-purple-400" />
                      INVENTARIO_EASYPANEL.md
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedDoc('fluxo_deploy')}
                    className={`w-full text-left p-2 rounded border transition-colors ${
                      selectedDoc === 'fluxo_deploy'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-blue-400" />
                      FLUXO_DEPLOY_GITHUB.md
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedDoc('seguranca_secrets')}
                    className={`w-full text-left p-2 rounded border transition-colors ${
                      selectedDoc === 'seguranca_secrets'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      SEGURANCA_SECRETS.md
                    </div>
                  </button>
                </CardContent>
              </Card>

              {/* Exibição do Documento Operacional Selecionado */}
              <div className="lg:col-span-3 space-y-4">
                {selectedDoc === 'backup' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-1">
                            Script Idempotente
                          </Badge>
                          <CardTitle className="text-base text-white font-mono">
                            docs/operacoes/backup-cursos-vps.sh
                          </CardTitle>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPath('docs/operacoes/backup-cursos-vps.sh')}
                          className="border-slate-700 bg-slate-950 text-xs"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          Copiar Caminho
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs space-y-3">
                      <p className="text-slate-300">
                        Cria snapshot completo em{' '}
                        <code>/srv/backups/cursos/&lt;timestamp&gt;/</code> contendo 13 itens:
                        bundle git, tag, dump Postgres (-Fc), PocketBase pb_data, vídeos, inspects
                        de volumes, redes e EasyPanel, Redis BGSAVE e manifesto com checksums
                        SHA-256.
                      </p>
                      <pre className="p-2.5 bg-black/60 rounded text-slate-200 font-mono text-[11px] overflow-x-auto">
                        {`chmod +x docs/operacoes/backup-cursos-vps.sh\n./docs/operacoes/backup-cursos-vps.sh`}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'restore' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-1">
                            Restauração com Dry-Run
                          </Badge>
                          <CardTitle className="text-base text-white font-mono">
                            docs/operacoes/restaurar-cursos-vps.sh
                          </CardTitle>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPath('docs/operacoes/restaurar-cursos-vps.sh')}
                          className="border-slate-700 bg-slate-950 text-xs"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          Copiar Caminho
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs space-y-3">
                      <p className="text-slate-300">
                        Restauração interativa com confirmação e suporte ao modo{' '}
                        <code>--dry-run</code> para validação prévia de SHA-256 e manifesto:
                      </p>
                      <pre className="p-2.5 bg-black/60 rounded text-slate-200 font-mono text-[11px] overflow-x-auto">
                        {`./docs/operacoes/restaurar-cursos-vps.sh /srv/backups/cursos/<timestamp> --dry-run`}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'rollback' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-1">
                            Plano de Contingência
                          </Badge>
                          <CardTitle className="text-base text-white font-mono">
                            docs/operacoes/PLANO_ROLLBACK.md
                          </CardTitle>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPath('docs/operacoes/PLANO_ROLLBACK.md')}
                          className="border-slate-700 bg-slate-950 text-xs"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          Copiar Caminho
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs space-y-3">
                      <p className="text-slate-300">
                        8 etapas sequenciais de reversão para o commit estável <code>
                          47aa7b1
                        </code>{' '}
                        e 8 testes de homologação final do operador.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'inventario' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-1">
                            Template dos 4 Serviços
                          </Badge>
                          <CardTitle className="text-base text-white font-mono">
                            docs/operacoes/INVENTARIO_EASYPANEL.md
                          </CardTitle>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPath('docs/operacoes/INVENTARIO_EASYPANEL.md')}
                          className="border-slate-700 bg-slate-950 text-xs"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          Copiar Caminho
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs space-y-3">
                      <p className="text-slate-300">
                        Mapeamento para preenchimento na VPS: Cursos-API (3333), PostgreSQL (5432),
                        PocketBase (8090) e Redis (6379), sem senhas em texto puro.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'fluxo_deploy' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-1">
                            14 Etapas
                          </Badge>
                          <CardTitle className="text-base text-white font-mono">
                            docs/operacoes/FLUXO_DEPLOY_GITHUB.md
                          </CardTitle>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPath('docs/operacoes/FLUXO_DEPLOY_GITHUB.md')}
                          className="border-slate-700 bg-slate-950 text-xs"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          Copiar Caminho
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs space-y-3">
                      <p className="text-slate-300">
                        Manual das 14 etapas de entrega: alteração local, testes, build, commit,
                        push para <code>correcao-fluxo-cursos</code>, rebuild EasyPanel, logs,
                        healthcheck, testes de API, mentor, aluno, upload e stream, e
                        confirmação/rollback.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'seguranca_secrets' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-1">
                            Política de Sanitização
                          </Badge>
                          <CardTitle className="text-base text-white font-mono">
                            docs/operacoes/SEGURANCA_SECRETS.md
                          </CardTitle>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPath('docs/operacoes/SEGURANCA_SECRETS.md')}
                          className="border-slate-700 bg-slate-950 text-xs"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          Copiar Caminho
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs space-y-3">
                      <p className="text-slate-300">
                        Regra permanente de jamais incluir senhas em relatórios/repositório,
                        registro da solicitação de rotação do token EasyPanel e tabela de variáveis
                        de ambiente conhecidas.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Aba 7: Mock do Player (Adapta) */}
          <TabsContent value="player" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      Mock do Player Interativo (Inspirado na Referência Adapta)
                    </CardTitle>
                    <CardDescription className="text-slate-400 mt-1 text-xs">
                      Declaração de Limitação: Mock conceitual baseado em descrição funcional. Os
                      screenshots reais do player de referência serão enviados separadamente pelo
                      operador.
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 border border-slate-800 rounded-lg overflow-hidden bg-slate-950 p-4">
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

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[85%]" />
                    </div>

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
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-6 text-center text-xs text-slate-500">
        Plataforma Cursos API &bull; Repositório: github.com/ronydgarcia-max/cursos-api &bull;
        Branch: correcao-fluxo-cursos &bull; Commit Base: 47aa7b1 &bull; VPS 69.62.124.240
      </footer>
    </div>
  )
}
