import React, { useState } from 'react'
import {
  BookOpen,
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
  Terminal,
  RotateCcw,
  ListChecks,
  Copy,
  FolderGit2,
  GitBranch,
  ShieldCheck,
  KeyRound,
  Database,
  Radio,
  Archive,
  Cpu,
  Clock,
  HardDrive,
  Network,
  Info,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Index() {
  const [activeTab, setActiveTab] = useState('inventario_real')
  const [selectedDoc, setSelectedDoc] = useState<
    | 'backup'
    | 'restore'
    | 'rollback'
    | 'inventario'
    | 'checklist'
    | 'fluxo_deploy'
    | 'seguranca_secrets'
  >('inventario')
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
              Fase 0 (Continuação &bull; NÃO é a Fase 1)
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
              github.com/ronydgarcia-max/cursos-api (correcao-fluxo-cursos)
            </Badge>
            <Badge
              variant="outline"
              className="border-purple-500/50 text-purple-400 bg-purple-500/10"
            >
              Commit Estável: 47aa7b1
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            Painel do Mentor de Cursos &bull; Auditoria Pré-Fase 1
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Governança rigorosa: Inventário EasyPanel da VPS incorporado, Backup e Dry-Run atestados
            pelo operador, diagnóstico do runtime e checklist das 6 pendências.
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
            Aviso de Governança: Workspace GoSkip é estritamente painel de documentação/prévia
          </AlertTitle>
          <AlertDescription className="text-amber-200/90 text-sm mt-1 space-y-1">
            <p>
              O GoSkip <strong>NÃO TEM ACESSO À VPS</strong>. Nada de produção é alterado aqui. O
              backup, o teste dry-run e o inventário foram executados na VPS diretamente pelo{' '}
              <strong>OPERADOR</strong>.
            </p>
            <p className="text-xs text-amber-300/80 font-mono">
              A Fase 1 permanece bloqueada aguardando as 6 pendências restantes e a autorização
              formal.
            </p>
          </AlertDescription>
        </Alert>

        {/* Dashboard de Métricas e Status de Governança */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Inventário EasyPanel (VPS)
              </CardTitle>
              <Server className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white font-mono">4 Serviços Ativos</div>
              <p className="text-xs text-purple-400 mt-1">
                Postgre 17 &bull; API &bull; Redis 7 &bull; PocketBase
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Backup do Operador
              </CardTitle>
              <Archive className="w-4 h-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5">
                Confirmado ✓
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                /root/backups/cursos/20261031_195147
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Diagnóstico Node Runtime
              </CardTitle>
              <Cpu className="w-4 h-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-amber-400">NÃO Confirmado</div>
              <p className="text-xs text-slate-400 mt-1">Erro OCI: node not found in $PATH</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Commits GoSkip Internos
              </CardTitle>
              <GitBranch className="w-4 h-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white font-mono">
                34df2d6 &bull; ecf1cc0 &bull; 505e672
              </div>
              <p className="text-xs text-cyan-400 mt-1">
                Apenas documentação interna GoSkip (não publicar)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Abas Principais de Análise */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800 p-1 w-full flex flex-wrap justify-start h-auto gap-1">
            <TabsTrigger
              value="inventario_real"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <Server className="w-4 h-4" />
              Inventário EasyPanel (Real)
            </TabsTrigger>
            <TabsTrigger
              value="backup_operador"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <Archive className="w-4 h-4" />
              Backup Confirmado (Operador)
            </TabsTrigger>
            <TabsTrigger
              value="node_migrations"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4" />
              Node &amp; Migrations (Diagnóstico)
            </TabsTrigger>
            <TabsTrigger
              value="checklist_fase1"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <ListChecks className="w-4 h-4" />
              Checklist das 6 Pendências
            </TabsTrigger>
            <TabsTrigger
              value="commits_seguranca"
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <GitBranch className="w-4 h-4" />
              Commits GoSkip &amp; Secrets
            </TabsTrigger>
            <TabsTrigger
              value="deploy_14etapas"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white flex items-center gap-1.5"
            >
              <Terminal className="w-4 h-4" />
              Fluxo Deploy (14 Etapas)
            </TabsTrigger>
            <TabsTrigger
              value="streaming_plano"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white flex items-center gap-1.5"
            >
              <Radio className="w-4 h-4" />
              Streaming Dinâmico
            </TabsTrigger>
            <TabsTrigger
              value="operacoes"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white flex items-center gap-1.5"
            >
              <FolderGit2 className="w-4 h-4" />
              Documentos VPS
            </TabsTrigger>
            <TabsTrigger
              value="player"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-white flex items-center gap-1.5"
            >
              <Play className="w-4 h-4" />
              Mock Player (Adapta)
            </TabsTrigger>
          </TabsList>

          {/* Aba: Inventário EasyPanel Real */}
          <TabsContent value="inventario_real" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-2">
                      Fonte Real: /root/INVENTARIO_EASYPANEL.md (Host srv845644)
                    </Badge>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Server className="w-5 h-5 text-purple-400" />
                      Inventário dos 4 Serviços do Projeto Cursos no EasyPanel
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs mt-1">
                      Mapeamento preciso de imagens, portas, volumes montados e variáveis (somente
                      nomes registrados, zero secrets).
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyPath('docs/operacoes/INVENTARIO_EASYPANEL.md')}
                    className="border-slate-700 bg-slate-950 text-xs shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Copiar docs/operacoes/INVENTARIO_EASYPANEL.md
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card Serviço: Cursos-API */}
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="font-bold text-white text-sm flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-blue-400" />
                        1. Cursos-API (Backend)
                      </span>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]">
                        5+ Réplicas Ativas
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-slate-300">
                      <div>
                        <strong className="text-slate-400">Imagem:</strong>{' '}
                        <span className="font-mono text-cyan-300">
                          easypanel/cursos-api/cursos-api:latest
                        </span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Portas:</strong>{' '}
                        <span className="font-mono text-slate-200">3333/tcp</span> (sem publicação
                        pública direta; tráfego mediado por Traefik 3.6.7)
                      </div>
                      <div>
                        <strong className="text-slate-400">Volumes de Vídeo Confirmados:</strong>
                        <div className="p-2 bg-black/40 rounded mt-1 font-mono text-[11px] text-emerald-300">
                          Host: /srv/cursos/videos/ &rarr; Container: /app/videos/
                        </div>
                      </div>
                      <div>
                        <strong className="text-slate-400">Redes:</strong>{' '}
                        <span className="font-mono text-slate-200">easypanel</span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Situação Node:</strong>{' '}
                        <span className="text-amber-400 font-semibold">NÃO confirmado</span> (erro
                        OCI ao tentar rodar node)
                      </div>
                    </div>
                  </div>

                  {/* Card Serviço: PostgreSQL */}
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="font-bold text-white text-sm flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-emerald-400" />
                        2. PostgreSQL (Banco Relacional)
                      </span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                        Postgres 17
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-slate-300">
                      <div>
                        <strong className="text-slate-400">Imagem:</strong>{' '}
                        <span className="font-mono text-cyan-300">postgres:17</span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Portas:</strong>{' '}
                        <span className="font-mono text-slate-200">5432/tcp</span> (restrita à rede
                        Docker; sem porta externa exposta)
                      </div>
                      <div>
                        <strong className="text-slate-400">Volume Persistente:</strong>
                        <div className="p-2 bg-black/40 rounded mt-1 font-mono text-[11px] text-slate-200">
                          /etc/easypanel/projects/cursos-api/postgres/data &rarr;
                          /var/lib/postgresql/data
                        </div>
                      </div>
                      <div>
                        <strong className="text-slate-400">Redes:</strong>{' '}
                        <span className="font-mono text-slate-200">
                          easypanel, easypanel-cursos-api
                        </span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Variáveis (Nomes apenas):</strong>
                        <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                          PGDATA, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, GOSU_VERSION, LANG,
                          PATH, PG_MAJOR, PG_VERSION
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Serviço: Redis */}
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="font-bold text-white text-sm flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-red-400" />
                        3. Redis (Cache &amp; Rate-Limit)
                      </span>
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px]">
                        Redis 7
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-slate-300">
                      <div>
                        <strong className="text-slate-400">Imagem:</strong>{' '}
                        <span className="font-mono text-cyan-300">redis:7</span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Portas:</strong>{' '}
                        <span className="font-mono text-slate-200">6379/tcp</span> (sem publicação
                        pública)
                      </div>
                      <div>
                        <strong className="text-slate-400">Volume Persistente:</strong>
                        <div className="p-2 bg-black/40 rounded mt-1 font-mono text-[11px] text-slate-200">
                          /etc/easypanel/projects/cursos-api/redis/data &rarr; /data
                        </div>
                      </div>
                      <div>
                        <strong className="text-slate-400">Redes:</strong>{' '}
                        <span className="font-mono text-slate-200">
                          easypanel, easypanel-cursos-api
                        </span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Variáveis (Nomes apenas):</strong>
                        <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                          REDIS_PASSWORD, PATH, REDIS_VERSION
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Serviço: PocketBase */}
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="font-bold text-white text-sm flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-purple-400" />
                        4. PocketBase (SSO / Auth)
                      </span>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px]">
                        PocketBase Latest
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-slate-300">
                      <div>
                        <strong className="text-slate-400">Imagem:</strong>{' '}
                        <span className="font-mono text-cyan-300">
                          ghcr.io/muchobien/pocketbase:latest
                        </span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Portas:</strong>{' '}
                        <span className="text-slate-400">
                          Sem porta externa publicada visível (acesso interno EasyPanel)
                        </span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Container:</strong>{' '}
                        <span className="font-mono text-slate-200">
                          cursos-api_pocketbase.1.kohju1jfjbvrbafqt44xbe0qu
                        </span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Redes:</strong>{' '}
                        <span className="font-mono text-slate-200">easypanel</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bloco: Outros Serviços no Host */}
                <div className="p-3 bg-slate-950/60 rounded border border-slate-800 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Network className="w-4 h-4 text-slate-400" />
                    Infraestrutura de Borda e Outros Serviços no Host (Fora do Escopo Direto de
                    Cursos):
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Traefik 3.6.7</strong> (portas 80 e 443 para SSL e roteamento público)
                    &bull; <strong>EasyPanel Core</strong> (porta 3000) &bull; Serviços devocional e
                    admin-conexao permanecem segregados e intocados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Backup Confirmado (Operador) */}
          <TabsContent value="backup_operador" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-2">
                      Ação Realizada pelo OPERADOR DA VPS
                    </Badge>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Archive className="w-5 h-5 text-emerald-400" />
                      Backup Completo e Dry-Run Validados na VPS
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs mt-1">
                      Atestado formalmente pelo operador em 2026-10-31 19:51:47 -03. O GoSkip não
                      executou ações de produção.
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-300 bg-emerald-500/10 text-xs font-mono"
                  >
                    SHA-256 Checksum: OK ✓
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 text-sm">
                      Diretório do Snapshot na VPS:
                    </span>
                    <span className="font-mono text-emerald-400">2026-10-31 19:51:47 -03</span>
                  </div>
                  <div className="p-2 bg-black/60 rounded font-mono text-emerald-300 text-sm">
                    /root/backups/cursos/20261031_195147
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-white">
                    Conteúdo do Snapshot Confirmado pelo Operador:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                    {[
                      {
                        item: 'cursos-api.bundle',
                        desc: 'Bundle Git completo com histórico e tags',
                      },
                      {
                        item: 'cursos-api-source.tar.gz',
                        desc: 'Código-fonte versionado e configurações',
                      },
                      {
                        item: 'cursos-videos.tar.gz',
                        desc: 'Arquivos de vídeo de /srv/cursos/videos/',
                      },
                      { item: 'postgres.sql', desc: 'Dump estrutural e de dados do PostgreSQL 17' },
                      {
                        item: 'Volumes PocketBase',
                        desc: 'Dados e configurações do serviço de autenticação',
                      },
                      {
                        item: 'Configurações estruturais',
                        desc: 'Configurações estruturais de PostgreSQL e Redis',
                      },
                      {
                        item: 'Manifesto Git',
                        desc: 'Metadados operacionais e commit de referência',
                      },
                      {
                        item: 'SHA256SUMS.txt',
                        desc: 'Hashes SHA-256 validados com 100% de integridade',
                      },
                    ].map((entry, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white font-mono">{entry.item}</strong>
                          <p className="text-slate-400 text-[11px]">{entry.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-blue-950/30 border border-blue-800/40 text-blue-200 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    Validação em Modo Dry-Run Executada com Sucesso:
                  </div>
                  <p className="text-[11px] text-slate-300">
                    O script <code>restaurar-cursos-vps.sh --dry-run</code> foi executado pelo
                    operador contra o diretório gerado, atestando a integridade dos checksums sem
                    alterar nenhuma tabela ou arquivo de produção.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Node & Migrations (Diagnóstico) */}
          <TabsContent value="node_migrations" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-2">
                      Diagnóstico Obrigatório Pré-Fase 1
                    </Badge>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-amber-400" />
                      Situação do Runtime Node.js e Migrations do PostgreSQL
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs mt-1">
                      Registro explícito do erro OCI obtido e plano de resolução pelo operador.
                    </CardDescription>
                  </div>
                  <Badge
                    variant="destructive"
                    className="bg-red-500/20 text-red-300 border-red-500/30 text-xs font-mono"
                  >
                    Node: NÃO Confirmado
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 text-xs">
                {/* Bloco Node OCI */}
                <div className="p-3 bg-red-950/20 border border-red-800/40 rounded space-y-2">
                  <div className="font-semibold text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Evidência do Erro OCI no Container Cursos-API:
                  </div>
                  <pre className="p-2.5 bg-black/60 rounded font-mono text-red-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                    OCI runtime exec failed: exec failed: unable to start container process: exec:
                    "node": executable file not found in $PATH
                  </pre>
                  <p className="text-slate-300 text-[11px]">
                    <strong>Conclusão Técnica:</strong> A versão real do Node em produção continua{' '}
                    <strong>NÃO confirmada</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-white flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-400" />
                      Hipóteses Técnicas a Validar na VPS:
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                      <li>
                        <strong className="text-slate-300">Runtime Alternativo:</strong> A imagem do
                        EasyPanel pode utilizar Bun ou Deno em vez de Node clássico.
                      </li>
                      <li>
                        <strong className="text-slate-300">Instância Consultada:</strong> Como há 5+
                        containers com IDs gerados pelo Swarm/EasyPanel, o comando pode ter sido
                        executado contra réplica inativa ou proxy.
                      </li>
                      <li>
                        <strong className="text-slate-300">Caminho $PATH:</strong> O executável pode
                        estar em caminho não padrão (ex.: NVM ou /usr/local/bin).
                      </li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-white flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      Comandos Sugeridos para o Operador:
                    </h4>
                    <p className="text-slate-400 text-[11px]">
                      Executar no container Cursos-API ativo na VPS:
                    </p>
                    <pre className="p-2 bg-black/60 rounded font-mono text-[11px] text-emerald-300 overflow-x-auto">
                      {`docker exec <container> sh -c "which node || which bun || which deno; cat /etc/os-release"`}
                    </pre>
                    <p className="text-slate-400 text-[11px]">
                      E verificar o Dockerfile real do projeto:
                    </p>
                    <pre className="p-2 bg-black/60 rounded font-mono text-[11px] text-cyan-300 overflow-x-auto">
                      {`cat /root/cursos-api/Dockerfile`}
                    </pre>
                  </div>
                </div>

                {/* Bloco Migrations */}
                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-white flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-amber-400" />
                    Situação das Migrations do PostgreSQL (Postgres 17):
                  </h4>
                  <p className="text-slate-300 text-[11px]">
                    O runner <code>src/database/migrate.js</code> executa apenas os arquivos
                    contidos em <code>src/database/migrations/*.js</code>. O arquivo{' '}
                    <code>migration.sql</code> presente na raiz do projeto{' '}
                    <strong>NÃO é executado automaticamente</strong>.
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Ação do Operador:</strong> Confirmar se as instruções SQL da raiz já
                    foram aplicadas manualmente no banco antes do início da Fase 1.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Checklist das 6 Pendências */}
          <TabsContent value="checklist_fase1" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-2">
                      Governança Pré-Fase 1
                    </Badge>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <ListChecks className="w-5 h-5 text-blue-400" />
                      Checklist: O que Foi Confirmado vs. As 6 Pendências Restantes
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs mt-1">
                      Separação transparente entre validações concluídas pelo operador e
                      bloqueadores da Fase 1.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyPath('docs/operacoes/CHECKLIST_PRE_FASE1.md')}
                    className="border-slate-700 bg-slate-950 text-xs shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Copiar docs/operacoes/CHECKLIST_PRE_FASE1.md
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-xs">
                {/* Grupo 1: Confirmado pelo Operador */}
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    1. Confirmado e Concluído pelo Operador na VPS:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                    {[
                      'Backup completo executado em /root/backups/cursos/20261031_195147',
                      'Hashes SHA256SUMS.txt validados com 100% de sucesso',
                      'Restauração em modo --dry-run validada sem erros',
                      'Inventário EasyPanel gerado no host srv845644 e incorporado',
                      'Caminhos de vídeo confirmados: /srv/cursos/videos/ -> /app/videos/',
                      'Nenhuma alteração feita na produção durante a Fase 0',
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

                {/* Grupo 2: As 6 Pendências Restantes */}
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-1.5 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    2. As 6 Pendências Restantes Pré-Fase 1 (Bloqueadoras da Fase 1):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                    {[
                      {
                        title: '1. Rotação do Token EasyPanel',
                        desc: 'Rotacionar no painel EasyPanel o token de webhook exposto anteriormente.',
                        badge: 'Pendente Operador',
                      },
                      {
                        title: '2. Análise de src/routes/provas.js',
                        desc: 'Operador enviará o arquivo real de provas para análise da lógica de avaliação.',
                        badge: 'Aguardando Envio',
                      },
                      {
                        title: '3. Screenshots Desktop e Celular do Player',
                        desc: 'Capturas de tela da área de membros de referência (Adapta) a serem enviadas.',
                        badge: 'Aguardando Envio',
                      },
                      {
                        title: '4. Confirmação da Versão Real do Node',
                        desc: 'Esclarecer falha OCI rodando diagnóstico de runtime (Node vs Bun vs Deno).',
                        badge: 'Pendente Diagnóstico',
                      },
                      {
                        title: '5. Confirmação sobre Migrations PostgreSQL',
                        desc: 'Validar se comandos de migration.sql da raiz já foram rodados no Postgres 17.',
                        badge: 'Pendente Confirmação',
                      },
                      {
                        title: '6. Avaliação sobre Backup dos Dados do Redis',
                        desc: 'Avaliar se dados em cache do Redis precisam de snapshot ou se são voláteis.',
                        badge: 'Pendente Avaliação',
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded bg-slate-950/80 border border-amber-900/40 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-white">{item.title}</strong>
                          <Badge
                            variant="outline"
                            className="text-[10px] border-amber-500/40 text-amber-300 shrink-0"
                          >
                            {item.badge}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-[11px]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Commits GoSkip & Secrets */}
          <TabsContent value="commits_seguranca" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card Commits Internos */}
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
                    Commits do Workspace GoSkip (34df2d6, ecf1cc0, 505e672)
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Classificação estrita dos commits gerados no workspace de documentação:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Isolamento no Workspace:</strong>
                        <p className="text-slate-400">
                          Os commits <code>34df2d6</code>, <code>ecf1cc0</code> e{' '}
                          <code>505e672</code> foram criados exclusivamente dentro do workspace
                          efêmero de documentação do GoSkip.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Não estão no repositório real:</strong>
                        <p className="text-slate-400">
                          Não foram enviados (sem push) e não pertencem ao repositório oficial{' '}
                          <code>cursos-api</code>.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Zero impacto em produção:</strong>
                        <p className="text-slate-400">
                          Nenhum arquivo de produção da VPS foi alterado.{' '}
                          <strong>NÃO devem ser publicados na VPS.</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Segurança de Secrets */}
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
                    Sanitização ativa: zero senhas ou tokens em texto puro nos relatórios.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 bg-red-950/20 border border-red-800/40 rounded space-y-2">
                    <p className="font-semibold text-red-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      Token EasyPanel Exposto:
                    </p>
                    <p className="text-slate-300">
                      O valor real foi substituído pelo marcador de segurança:
                    </p>
                    <div className="p-2 bg-black/60 rounded font-mono text-amber-300 text-center font-bold">
                      [TOKEN_REMOVIDO_E_ROTACIONADO]
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      A rotação manual no EasyPanel continua listada como pendência mandatória do
                      operador pré-Fase 1.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba: Fluxo de Deploy GitHub em 14 Etapas */}
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
                      title: '6. EasyPanel reconstrói Cursos-API',
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Streaming Dinâmico */}
          <TabsContent value="streaming_plano" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Apenas Documentação &bull; Sem Alterar Código Nesta Rodada
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">
                    src/routes/stream.js (Intocado)
                  </span>
                </div>
                <CardTitle className="text-lg text-white mt-2 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-purple-400" />
                  Plano de Correção do Streaming Dinâmico (Fase 1)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-3 bg-red-950/20 border border-red-800/30 rounded space-y-1">
                  <span className="font-semibold text-red-300">Problema Atual:</span>
                  <p className="text-slate-300">
                    A rota <code>GET /stream/:aulaId</code> usa mapa fixo para a aula 27 (
                    <code>LOCAL_VIDEO_FILES</code>). As demais aulas locais falham com erro 400.
                    Além disso, o mentor proprietário recebe 403 por não estar matriculado.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                    <strong className="text-emerald-400">1. Consulta Dinâmica:</strong>
                    <p className="text-slate-400">
                      Ler <code>video_path</code> da tabela <code>aulas</code> no PostgreSQL.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                    <strong className="text-emerald-400">2. Proteção Path Traversal:</strong>
                    <p className="text-slate-400">
                      Validar que o caminho permanece contido em <code>/app/videos/</code>.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                    <strong className="text-emerald-400">3. Liberação do Mentor:</strong>
                    <p className="text-slate-400">
                      Permitir acesso para aluno matriculado OU mentor proprietário (
                      <code>mentor_id = req.usuario.id</code>) OU admin.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                    <strong className="text-emerald-400">4. Fallback Temporário:</strong>
                    <p className="text-slate-400">
                      Manter mapa fixo da aula 27 como fallback exclusivo se <code>video_path</code>{' '}
                      estiver nulo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Documentos VPS */}
          <TabsContent value="operacoes" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-900 border-slate-800 lg:col-span-1 h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-emerald-400" />
                    Documentos da VPS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 p-3 text-xs">
                  {[
                    {
                      id: 'inventario',
                      label: 'INVENTARIO_EASYPANEL.md',
                      icon: Server,
                      color: 'text-purple-400',
                    },
                    {
                      id: 'backup',
                      label: 'backup-cursos-vps.sh',
                      icon: Terminal,
                      color: 'text-emerald-400',
                    },
                    {
                      id: 'restore',
                      label: 'restaurar-cursos-vps.sh',
                      icon: RotateCcw,
                      color: 'text-blue-400',
                    },
                    {
                      id: 'rollback',
                      label: 'PLANO_ROLLBACK.md',
                      icon: FileText,
                      color: 'text-amber-400',
                    },
                    {
                      id: 'fluxo_deploy',
                      label: 'FLUXO_DEPLOY_GITHUB.md',
                      icon: Terminal,
                      color: 'text-blue-400',
                    },
                    {
                      id: 'seguranca_secrets',
                      label: 'SEGURANCA_SECRETS.md',
                      icon: ShieldCheck,
                      color: 'text-amber-400',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedDoc(item.id as typeof selectedDoc)}
                      className={`w-full text-left p-2 rounded border transition-colors ${
                        selectedDoc === item.id
                          ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 font-medium'
                          : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-mono flex items-center gap-1.5 text-[11px]">
                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                        {item.label}
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <div className="lg:col-span-3 space-y-4">
                {selectedDoc === 'inventario' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-1">
                            Dados Reais do Host srv845644
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
                    <CardContent className="pt-4 text-xs space-y-2">
                      <p className="text-slate-300">
                        Preenchido com base no arquivo real da VPS. Mapeia os 4 serviços:
                      </p>
                      <ul className="list-disc pl-4 text-slate-400 space-y-1">
                        <li>
                          <strong>PostgreSQL 17:</strong> volume em
                          /etc/easypanel/projects/cursos-api/postgres/data &rarr;
                          /var/lib/postgresql/data
                        </li>
                        <li>
                          <strong>Cursos-API:</strong> porta 3333/tcp interna, 5+ réplicas, volume
                          de vídeos em /srv/cursos/videos/
                        </li>
                        <li>
                          <strong>Redis 7:</strong> volume em
                          /etc/easypanel/projects/cursos-api/redis/data &rarr; /data
                        </li>
                        <li>
                          <strong>PocketBase:</strong> ghcr.io/muchobien/pocketbase:latest
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'backup' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base text-white font-mono">
                          docs/operacoes/backup-cursos-vps.sh
                        </CardTitle>
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
                    <CardContent className="pt-4 text-xs space-y-2">
                      <p className="text-slate-300">
                        Snapshot concluído pelo operador em{' '}
                        <code>/root/backups/cursos/20261031_195147</code> com manifesto e SHA-256.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'restore' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <CardTitle className="text-base text-white font-mono">
                        docs/operacoes/restaurar-cursos-vps.sh
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs space-y-2">
                      <p className="text-slate-300">
                        Script de restauração guiada com modo <code>--dry-run</code> testado com
                        sucesso pelo operador.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'rollback' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <CardTitle className="text-base text-white font-mono">
                        docs/operacoes/PLANO_ROLLBACK.md
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs space-y-2">
                      <p className="text-slate-300">
                        Plano de contingência em 8 etapas para restauração para o commit estável{' '}
                        <code>47aa7b1</code>.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'fluxo_deploy' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <CardTitle className="text-base text-white font-mono">
                        docs/operacoes/FLUXO_DEPLOY_GITHUB.md
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs space-y-2">
                      <p className="text-slate-300">
                        14 etapas de entrega: do workspace ao EasyPanel e homologação na VPS.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {selectedDoc === 'seguranca_secrets' && (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800 pb-4">
                      <CardTitle className="text-base text-white font-mono">
                        docs/operacoes/SEGURANCA_SECRETS.md
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs space-y-2">
                      <p className="text-slate-300">
                        Política rigorosa: zero senhas ou tokens em relatórios e solicitação de
                        rotação.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Aba: Mock Player (Adapta) */}
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
        Branch: correcao-fluxo-cursos &bull; Commit Base Estável: 47aa7b1 &bull; Host: srv845644
      </footer>
    </div>
  )
}
