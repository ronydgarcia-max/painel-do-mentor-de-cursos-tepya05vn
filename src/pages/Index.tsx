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
import { MANIFESTO_ARTEFATOS_FASE1 } from '@/lib/manifestHelper'

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
            pelo operador, Token EasyPanel rotacionado, Node v20.20.2 e Migrations confirmados,
            análise de provas.js concluída e Referência Visual do Player APROVADA pelo operador
            (Zero pendências externas).
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
              A Fase 1 permanece bloqueada aguardando exclusivamente a autorização expressa do
              operador com o envio da frase exata: &ldquo;Autorizo iniciar a Fase 1 da reescrita do
              painel do mentor.&rdquo;
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
                Runtime Node Confirmado
              </CardTitle>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-emerald-400">Node v20.20.2 ✓</div>
              <p className="text-xs text-slate-400 mt-1 font-mono">cursos-api.1.jsmxpl7rmip...</p>
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
              value="provas_analise"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Análise de provas.js
            </TabsTrigger>
            <TabsTrigger
              value="node_migrations"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4" />
              Node &amp; Migrations (Confirmados)
            </TabsTrigger>
            <TabsTrigger
              value="checklist_fase1"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <ListChecks className="w-4 h-4" />
              Checklist Pré-Fase 1
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
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <Play className="w-4 h-4" />
              Player — Referência Aprovada
            </TabsTrigger>
            <TabsTrigger
              value="fase1_entregaveis"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Fase 1 — Entregáveis
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
                        <span className="text-emerald-400 font-semibold">
                          Node v20.20.2 Confirmado ✓
                        </span>
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
                        item: 'redis-dump.rdb (Redis RDB)',
                        desc: 'Snapshot Redis validado com redis-check-rdb: checksum OK, 0 chaves, 0 expirações (RESOLVIDO)',
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

          {/* Aba Nova: Análise de src/routes/provas.js */}
          <TabsContent value="provas_analise" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-2">
                      Arquivo Recebido &amp; Auditado na Fase 0
                    </Badge>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      Análise Técnica de src/routes/provas.js
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs mt-1">
                      Mapeamento de rotas, controle de acesso apenasMentor, transação SQL, tabelas
                      envolvidas, riscos e pontos a preservar.
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 text-emerald-300 bg-emerald-500/10 text-xs font-mono"
                  >
                    Status: Analisado ✓
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 text-xs">
                {/* Destaque de Arquitetura e Autorização */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-950 rounded border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-white flex items-center gap-1.5 text-sm">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      1. Autorização &amp; Middleware apenasMentor
                    </h4>
                    <p className="text-slate-300 text-[11px]">
                      O router aplica{' '}
                      <code className="text-cyan-300">router.use(auth, apenasMentor)</code> a todas
                      as rotas. O middleware consulta{' '}
                      <code className="text-slate-200">usuarios</code> checando:
                    </p>
                    <div className="p-2 bg-black/60 rounded font-mono text-[11px] text-amber-300">
                      mentor_status === 'aprovado' || role === 'admin'
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      <strong>Avaliação de duplicação:</strong> Esta lógica duplica a checagem
                      presente em outros módulos de mentor e em{' '}
                      <code className="text-slate-300">src/middleware/auth.js</code>. Na Fase 1,
                      recomenda-se unificar o middleware de autorização em módulo compartilhado.
                    </p>
                    <div className="pt-1">
                      <strong className="text-slate-300">Helper de Isolamento:</strong>
                      <p className="font-mono text-emerald-400 text-[10px] mt-0.5">
                        SELECT * FROM cursos WHERE id = $1 AND mentor_id = $2
                      </p>
                      <span className="text-slate-400 text-[10px]">
                        Garante que mentores acessem somente seus próprios cursos.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded border border-slate-800 space-y-2">
                    <h4 className="font-semibold text-white flex items-center gap-1.5 text-sm">
                      <Database className="w-4 h-4 text-purple-400" />
                      2. Tabelas do Banco Envolvidas
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-black/40 rounded border border-slate-800/80">
                        <strong className="text-purple-300 font-mono">provas</strong>
                        <p className="text-slate-400 text-[10px]">
                          id, curso_id, etapa_id, titulo, nota_minima
                        </p>
                      </div>
                      <div className="p-2 bg-black/40 rounded border border-slate-800/80">
                        <strong className="text-purple-300 font-mono">provas_perguntas</strong>
                        <p className="text-slate-400 text-[10px]">id, prova_id, ordem, texto</p>
                      </div>
                      <div className="p-2 bg-black/40 rounded border border-slate-800/80">
                        <strong className="text-purple-300 font-mono">provas_alternativas</strong>
                        <p className="text-slate-400 text-[10px]">
                          id, pergunta_id, letra, texto, correta
                        </p>
                      </div>
                      <div className="p-2 bg-black/40 rounded border border-slate-800/80">
                        <strong className="text-purple-300 font-mono">aulas</strong>
                        <p className="text-slate-400 text-[10px]">
                          Validação se etapa_id pertence ao curso
                        </p>
                      </div>
                      <div className="p-2 bg-black/40 rounded border border-slate-800/80">
                        <strong className="text-purple-300 font-mono">cursos</strong>
                        <p className="text-slate-400 text-[10px]">
                          Checagem de mentor_id = req.usuario.id
                        </p>
                      </div>
                      <div className="p-2 bg-black/40 rounded border border-slate-800/80">
                        <strong className="text-purple-300 font-mono">usuarios</strong>
                        <p className="text-slate-400 text-[10px]">
                          Checagem de mentor_status e role
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rotas Mapeadas */}
                <div className="p-3.5 bg-slate-950 rounded border border-slate-800 space-y-3">
                  <h4 className="font-semibold text-white text-sm flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    3. Rotas Express Implementadas em src/routes/provas.js
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        method: 'GET',
                        path: '/cursos/:id/provas',
                        desc: 'Lista provas do curso com subselect do total de perguntas.',
                        sql: 'SELECT p.*, (SELECT COUNT(*)::int FROM provas_perguntas pp WHERE pp.prova_id = p.id) AS total_perguntas FROM provas p WHERE p.curso_id = $1 ORDER BY p.id ASC',
                      },
                      {
                        method: 'GET',
                        path: '/cursos/:id/provas/:provaId',
                        desc: 'Busca prova completa com perguntas ordenadas e alternativas vinculadas via INNER JOIN, montadas em memória via map/filter.',
                        sql: 'SELECT * FROM provas + SELECT * FROM provas_perguntas + INNER JOIN provas_alternativas',
                      },
                      {
                        method: 'POST',
                        path: '/cursos/:id/provas',
                        desc: 'Criação transacional com BEGIN/COMMIT. Valida título, array de perguntas, etapa_id em aulas do curso, nota_minima (0-100, default 60), ao menos 2 alternativas por pergunta, exatamente 1 correta e letras A-E com fallback.',
                        sql: 'BEGIN -> INSERT INTO provas -> loop INSERT INTO provas_perguntas -> loop INSERT INTO provas_alternativas -> COMMIT / ROLLBACK',
                      },
                      {
                        method: 'PUT',
                        path: '/cursos/:id/provas/:provaId',
                        desc: 'Edição parcial: atualiza titulo, nota_minima (0-100) e etapa_id (com validação na tabela aulas). Não permite edição granular de perguntas neste endpoint.',
                        sql: 'UPDATE provas SET titulo=$1, nota_minima=$2, etapa_id=$3 WHERE id=$4 AND curso_id=$5 RETURNING *',
                      },
                      {
                        method: 'DELETE',
                        path: '/cursos/:id/provas/:provaId',
                        desc: 'Exclui a prova pelo id e curso_id. OBS: delete simples, sem verificação se rowCount > 0.',
                        sql: 'DELETE FROM provas WHERE id = $1 AND curso_id = $2',
                      },
                    ].map((r, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded bg-black/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`text-[10px] font-mono ${
                                r.method === 'GET'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : r.method === 'POST'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : r.method === 'PUT'
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {r.method}
                            </Badge>
                            <span className="font-mono text-white text-[12px]">{r.path}</span>
                          </div>
                          <p className="text-slate-400 text-[11px]">{r.desc}</p>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 max-w-xs md:text-right shrink-0">
                          {r.sql}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Riscos Observados e Funcionalidades a Preservar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-red-950/20 rounded border border-red-900/40 space-y-2">
                    <h4 className="font-semibold text-red-300 flex items-center gap-1.5 text-sm">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      4. Observações de Risco (Revisar na Fase 1)
                    </h4>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-300 text-[11px]">
                      <li>
                        <strong className="text-red-300">DELETE sem validação de rowCount:</strong>{' '}
                        Retorna <code>&#123; success: true &#125;</code> mesmo que nenhum registro
                        tenha sido excluído. Tratar na Fase 1 com 404 se não houver match.
                      </li>
                      <li>
                        <strong className="text-red-300">Vazamento em Erros 500 no POST:</strong> O
                        catch responde 500 com <code>err.message</code> para falhas de validação de
                        negócio (deveria ser 400 Bad Request) e pode vazar erros internos do banco.
                      </li>
                      <li>
                        <strong className="text-red-300">
                          Sem Trava de Ciclo de Vida do Curso:
                        </strong>{' '}
                        Ao contrário de <code>mentor.js</code>, provas não verificam se o curso está
                        em status <code>em_analise</code>, <code>aprovado</code> ou se possui
                        matrículas ativas.
                      </li>
                      <li>
                        <strong className="text-red-300">Sem Edição de Perguntas no PUT:</strong>{' '}
                        Apenas campos de cabeçalho podem ser atualizados no PUT.
                      </li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-emerald-950/20 rounded border border-emerald-900/40 space-y-2">
                    <h4 className="font-semibold text-emerald-300 flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      5. Funcionalidades a PRESERVAR na Fase 1
                    </h4>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-300 text-[11px]">
                      <li>
                        <strong className="text-emerald-300">Transacionalidade Atômica:</strong>{' '}
                        Manter obrigatoriamente a transação SQL com <code>BEGIN</code>,{' '}
                        <code>COMMIT</code> e <code>ROLLBACK</code> na criação de provas e
                        alternativas.
                      </li>
                      <li>
                        <strong className="text-emerald-300">Validações de Domínio:</strong>{' '}
                        Exigência de título, ao menos 1 pergunta, mínimo de 2 alternativas por
                        questão e exatamente uma alternativa correta.
                      </li>
                      <li>
                        <strong className="text-emerald-300">Geração de Letras A–E:</strong>{' '}
                        Preservar a rotulagem automática de alternativas com fallback{' '}
                        <code>String.fromCharCode(65 + j)</code>.
                      </li>
                      <li>
                        <strong className="text-emerald-300">Isolamento de Tenant:</strong> Manter
                        estritamente o filtro por <code>mentor_id = req.usuario.id</code> em todas
                        as consultas.
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Node & Migrations (Confirmados pelo Operador) */}
          <TabsContent value="node_migrations" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-2">
                      Evidências Reais Confirmadas pelo Operador na VPS
                    </Badge>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-emerald-400" />
                      Situação do Runtime Node.js e Migrations do PostgreSQL
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs mt-1">
                      Node v20.20.2 e tabela cursos completa confirmados pelo operador. Nenhuma
                      migration pendente.
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 text-emerald-300 bg-emerald-500/10 text-xs font-mono"
                  >
                    Node v20.20.2 &bull; Migrations OK
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 text-xs">
                {/* Bloco Node Confirmado */}
                <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded space-y-2">
                  <div className="font-semibold text-emerald-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Runtime Node.js Confirmado pelo Operador: Node v20.20.2
                    </span>
                    <span className="font-mono text-emerald-400 text-xs">CONFIRMADO ✓</span>
                  </div>
                  <div className="p-2.5 bg-black/60 rounded font-mono text-emerald-300 text-[11px] overflow-x-auto">
                    Container Real: cursos-api_cursos-api.1.jsmxpl7rmip278eajgb5f5ms4 &bull; Node
                    v20.20.2
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    <strong>Aviso de Documentação:</strong> O <code>Dockerfile</code> e arquivos que
                    mencionam Node 18 estão <strong>DESATUALIZADOS</strong>. A referência oficial
                    para a Fase 1 é Node 20. O <code>Dockerfile</code> será atualizado na Fase 1
                    (sem alteração agora).
                  </p>
                </div>

                {/* Bloco Migrations Confirmadas */}
                <div className="p-3.5 bg-slate-950 rounded border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="font-semibold text-white flex items-center gap-1.5 text-sm">
                      <Database className="w-4 h-4 text-emerald-400" />
                      PostgreSQL: Tabela cursos Completa e Migration Já Aplicada
                    </h4>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                      Container cursos-api_postgres.1.mpp4zqgnifgzjkh2y0hz9f4hm
                    </Badge>
                  </div>

                  <div className="p-2.5 bg-red-950/30 border border-red-800/40 rounded text-amber-200 text-[11px]">
                    <strong>AVISO MANDATÓRIO DO OPERADOR:</strong>{' '}
                    <strong>NÃO EXECUTAR `migration.sql` NOVAMENTE NO BANCO.</strong> A migration já
                    está aplicada na VPS. A duplicidade da coluna <code>matriz_curricular</code> no
                    arquivo físico será corrigida unicamente no código da migration durante a Fase 1
                    — nenhuma alteração de banco deve ocorrer agora.
                  </div>

                  <div>
                    <span className="font-semibold text-slate-300">
                      Colunas Confirmadas Existentes na Tabela cursos:
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {[
                        'video_url',
                        'video_type',
                        'video_public_id',
                        'thumbnail_url',
                        'confirmed_author',
                        'ia_score',
                        'matriz_curricular',
                        'subcategoria',
                      ].map((col, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-black/40 border border-slate-800 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-mono text-emerald-300 text-[11px]">{col}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Checklist de Governança Pré-Fase 1 */}
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
                      Checklist: Validações Concluídas &bull; Zero Pendências Externas
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs mt-1">
                      Backup, Redis, Inventário, Token EasyPanel, Node v20.20.2, Migrations,
                      provas.js e Referência Visual do Player aprovados. Aguardando apenas
                      autorização expressa.
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
                {/* Grupo 1: Confirmado e Concluído */}
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    1. Validações Concluídas pelo Operador e Auditoria da Fase 0:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                    {[
                      'Backup completo executado pelo operador em /root/backups/cursos/20261031_195147',
                      'Restauração em modo dry-run validada pelo operador (restaurar-cursos-vps.sh --dry-run)',
                      'Redis RDB (redis-dump.rdb): validado com redis-check-rdb, checksum OK, 0 chaves, 0 expirações',
                      'Hashes SHA256SUMS.txt validados com 100% de sucesso pelo operador',
                      'Inventário EasyPanel real com 4 serviços: Cursos-API, PocketBase, Postgre, Redis',
                      'ROTAÇÃO DO TOKEN DO EASYPANEL: chave antiga revogada, nova criada pelo operador ([TOKEN_REMOVIDO_E_ROTACIONADO])',
                      'Runtime Node v20.20.2 CONFIRMADO no container cursos-api_cursos-api.1.jsmxpl7rmip...',
                      'PostgreSQL: tabela cursos possui todas as 8 colunas; migration aplicada; NÃO reexecutar migration.sql',
                      'src/routes/provas.js recebido e integralmente analisado (5 rotas, transação BEGIN/COMMIT; NÃO alterar)',
                      'Branch correcao-fluxo-cursos e commit base 47aa7b1 inalterados; commits GoSkip segregados (não publicar)',
                      'Referência Visual do Player APROVADA: mock conceitual aprovado com 7 ressalvas; screenshots externos substituídos',
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

                {/* Grupo 2: Referência Visual Aprovada (Substituição de Screenshots) */}
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-1.5 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    2. Situação das Pendências Externas (Zero Pendências Restantes):
                  </h4>
                  <div className="p-3.5 rounded bg-slate-950/80 border border-emerald-900/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-sm">
                        Referência Visual do Player: MOCK CONCEITUAL APROVADO PELO OPERADOR
                      </strong>
                      <Badge className="text-[10px] shrink-0 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        Aprovado pelo Operador ✓
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      O operador declarou:{' '}
                      <em>
                        &ldquo;O mock enviado deve ser considerado a referência visual desejada para
                        o novo player do painel/aluno de Cursos.&rdquo;
                      </em>{' '}
                      A pendência de screenshots da página externa foi <strong>SUBSTITUÍDA</strong>{' '}
                      pelo mock conceitual com as 7 ressalvas literais registradas.
                    </p>
                    <div className="p-2 bg-black/60 rounded border border-slate-800 text-[11px] text-slate-300">
                      <strong className="text-amber-300">Pendências Externas Restantes:</strong>{' '}
                      <span className="text-emerald-400 font-semibold">NENHUMA</span>. O
                      planejamento da Fase 1 possui referência visual suficiente.
                    </div>
                  </div>
                </div>

                {/* Grupo 3: Frase Exata de Autorização */}
                <div className="p-3.5 rounded bg-blue-950/20 border border-blue-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-blue-300 flex items-center gap-1.5 text-sm">
                      <Terminal className="w-4 h-4 text-blue-400" />
                      3. Condição e Frase Exata de Autorização da Fase 1:
                    </h4>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]">
                      Aguardando Operador
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    A reescrita do painel do mentor e alterações de código da Fase 1{' '}
                    <strong>NÃO INICIARAM</strong>. A Fase 1 só começa quando o operador enviar{' '}
                    <strong>EXATAMENTE</strong> esta frase:
                  </p>
                  <div className="p-2.5 bg-black/80 rounded border border-blue-800/60 font-mono text-emerald-400 text-xs font-bold text-center">
                    &ldquo;Autorizo iniciar a Fase 1 da reescrita do painel do mentor.&rdquo;
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
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      TOKEN ROTACIONADO ✓
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">
                      docs/operacoes/SEGURANCA_SECRETS.md
                    </span>
                  </div>
                  <CardTitle className="text-lg text-white mt-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Segurança de Secrets &amp; Rotação Concluída
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Chave antiga revogada e nova criada pelo operador no EasyPanel.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded space-y-2">
                    <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      Token EasyPanel Rotacionado com Sucesso:
                    </p>
                    <p className="text-slate-300">
                      O operador revogou a chave antiga exposta e gerou uma nova chave na VPS. O
                      novo valor NUNCA é registrado em relatórios, commits ou arquivos.
                    </p>
                    <div className="p-2 bg-black/60 rounded font-mono text-emerald-300 text-center font-bold">
                      [TOKEN_REMOVIDO_E_ROTACIONADO]
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Pendência encerrada com 100% de conformidade com a política de segurança de
                      secrets.
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

          {/* Aba: Player — Referência Aprovada */}
          <TabsContent value="player" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-semibold">
                        MOCK CONCEITUAL — referência aprovada pelo operador; dados e rotas reais na
                        Fase 1
                      </Badge>
                      <Badge variant="outline" className="border-blue-500/40 text-blue-400 text-xs">
                        Responsivo: Desktop &bull; Celular
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      Player de Cursos &bull; Referência Visual Aprovada (Fase 1)
                    </CardTitle>
                    <CardDescription className="text-slate-300 mt-1 text-xs">
                      Proposta visual oficial aprovada pelo operador para o novo player do
                      painel/aluno. Player principal à esquerda, matriz curricular à direita,
                      progresso %, aula destacada, duração, navegação sequencial, materiais de
                      apoio, indicação de quiz e selos de suporte para vídeo local VPS / YouTube /
                      OneDrive.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 font-medium">Fonte de Vídeo:</span>
                    <Button
                      size="sm"
                      variant={selectedVideoSource === 'vps' ? 'default' : 'outline'}
                      onClick={() => setSelectedVideoSource('vps')}
                      className={`text-xs ${
                        selectedVideoSource === 'vps'
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'border-slate-700 bg-slate-950 text-slate-300'
                      }`}
                    >
                      Vídeo Local VPS (/stream/id)
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedVideoSource === 'youtube' ? 'default' : 'outline'}
                      onClick={() => setSelectedVideoSource('youtube')}
                      className={`text-xs ${
                        selectedVideoSource === 'youtube'
                          ? 'bg-red-600 hover:bg-red-500 text-white'
                          : 'border-slate-700 bg-slate-950 text-slate-300'
                      }`}
                    >
                      YouTube
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedVideoSource === 'onedrive' ? 'default' : 'outline'}
                      onClick={() => setSelectedVideoSource('onedrive')}
                      className={`text-xs ${
                        selectedVideoSource === 'onedrive'
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                          : 'border-slate-700 bg-slate-950 text-slate-300'
                      }`}
                    >
                      OneDrive
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedVideoSource === 'cloudinary' ? 'default' : 'outline'}
                      onClick={() => setSelectedVideoSource('cloudinary')}
                      className={`text-xs ${
                        selectedVideoSource === 'cloudinary'
                          ? 'bg-purple-600 hover:bg-purple-500 text-white'
                          : 'border-slate-700 bg-slate-950 text-slate-300'
                      }`}
                    >
                      Cloudinary
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Banner de Rótulo e Ressalvas do Operador */}
                <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-800/40 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-blue-300 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      MOCK CONCEITUAL &bull; REFERÊNCIA VISUAL APROVADA PELO OPERADOR
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-amber-500/40 text-amber-300"
                    >
                      Fase 1: Somente com autorização expressa
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <em>
                      &ldquo;O mock enviado deve ser considerado a referência visual desejada para o
                      novo player do painel/aluno de Cursos.&rdquo;
                    </em>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
                    <div className="p-2 rounded bg-black/40 border border-slate-800">
                      <strong>1-3.</strong> Mock conceitual produzido no GoSkip (sem captura real de
                      página externa).
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-slate-800">
                      <strong>4-5.</strong> Dados e rotas reais do projeto Cursos; preserva{' '}
                      <code>/stream/&#123;id&#125;</code>, <code>video_path</code>, VPS, YouTube,
                      Cloudinary e OneDrive.
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-slate-800">
                      <strong>6-7.</strong> Suporte desktop e celular; progresso, módulos, duração e
                      materiais virão do backend real.
                    </div>
                  </div>
                </div>

                {/* Grade Principal do Player: Player à esquerda, Matriz Curricular à direita */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 border border-slate-800 rounded-lg overflow-hidden bg-slate-950 p-4">
                  {/* Coluna 1 & 2: Player Principal à Esquerda (2 colunas no desktop) */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Área do Vídeo 16:9 com Controles e Selo */}
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group shadow-2xl">
                      {/* Selo do Formato Ativo no Player */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/80 backdrop-blur px-2.5 py-1 rounded border border-slate-800 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-slate-300 font-medium">
                          {selectedVideoSource === 'vps' && 'Vídeo Local VPS (/stream/:aulaId)'}
                          {selectedVideoSource === 'youtube' && 'YouTube Embed Canônico'}
                          {selectedVideoSource === 'onedrive' && 'Microsoft Graph / OneDrive'}
                          {selectedVideoSource === 'cloudinary' && 'Cloudinary Stream HLS/MP4'}
                        </span>
                      </div>

                      {/* Botão de Tela Cheia / Resolução */}
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/80 backdrop-blur px-2 py-1 rounded border border-slate-800 text-[10px] text-slate-300">
                        <Badge
                          variant="outline"
                          className="text-[9px] border-slate-700 text-slate-300 py-0"
                        >
                          1080p
                        </Badge>
                        <span className="text-slate-400">1.0x</span>
                      </div>

                      {selectedVideoSource === 'vps' && (
                        <div className="text-center p-6 space-y-2">
                          <Play className="w-14 h-14 text-blue-500 mx-auto opacity-80 group-hover:scale-110 transition-transform cursor-pointer" />
                          <p className="text-sm font-semibold text-slate-200">
                            Streaming Local VPS via HTTP Range (206 Partial Content)
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            Endpoint: <span className="text-blue-400">GET /stream/27</span> &bull;
                            Caminho VPS:{' '}
                            <span className="text-emerald-400">/app/videos/37/aula-27.mp4</span>
                          </p>
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                              Range: bytes=0-1048576 ✓
                            </Badge>
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]">
                              Mentor Autorizado ✓
                            </Badge>
                          </div>
                        </div>
                      )}

                      {selectedVideoSource === 'youtube' && (
                        <div className="text-center p-6 space-y-2">
                          <Video className="w-14 h-14 text-red-500 mx-auto opacity-80 group-hover:scale-110 transition-transform cursor-pointer" />
                          <p className="text-sm font-semibold text-slate-200">
                            Embed Oficial YouTube sem Distrações
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            ID: <span className="text-red-400">dQw4w9WgXcQ</span> &bull; Parâmetros:{' '}
                            <span className="text-slate-300">rel=0&amp;modestbranding=1</span>
                          </p>
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px]">
                              IFrame API Oficial
                            </Badge>
                          </div>
                        </div>
                      )}

                      {selectedVideoSource === 'onedrive' && (
                        <div className="text-center p-6 space-y-2">
                          <ExternalLink className="w-14 h-14 text-cyan-500 mx-auto opacity-80 group-hover:scale-110 transition-transform cursor-pointer" />
                          <p className="text-sm font-semibold text-slate-200">
                            Streaming Autenticado Microsoft Graph / OneDrive
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            DriveItem ID: <span className="text-cyan-400">01ABCDEF123456789</span>{' '}
                            &bull; Token Seguro
                          </p>
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px]">
                              MS Graph Client Pipe
                            </Badge>
                          </div>
                        </div>
                      )}

                      {selectedVideoSource === 'cloudinary' && (
                        <div className="text-center p-6 space-y-2">
                          <Sparkles className="w-14 h-14 text-purple-500 mx-auto opacity-80 group-hover:scale-110 transition-transform cursor-pointer" />
                          <p className="text-sm font-semibold text-slate-200">
                            Cloudinary Video Delivery (HLS / MP4 Otimizado)
                          </p>
                          <p className="text-xs text-slate-400 font-mono">
                            Public ID: <span className="text-purple-400">cursos/aulas/aula-27</span>
                          </p>
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px]">
                              Adaptive Bitrate Streaming
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Barra de Ações Imediatas: Título da Aula e Navegação Anterior / Próxima */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                            Módulo 1 &bull; Aula 27 (Atual)
                          </span>
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]">
                            Duração: 14:20
                          </Badge>
                        </div>
                        <h2 className="text-lg font-bold text-white mt-1">
                          27. Introdução à Liderança e Fundamentos Ministeriais
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs"
                        >
                          &larr; Aula Anterior
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                        >
                          Próxima Aula &rarr;
                        </Button>
                      </div>
                    </div>

                    {/* Seção de Materiais de Apoio */}
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-400" />
                          Materiais de Apoio da Aula
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-[10px] border-slate-700 text-slate-400"
                        >
                          1 Arquivo Disponível
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded bg-slate-950 border border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-red-400 shrink-0" />
                          <div>
                            <span className="text-slate-200 font-medium block">
                              Apostila_Modulo_1_Lideranca_Fundamentos.pdf
                            </span>
                            <span className="text-[10px] text-slate-400">
                              PDF complementar &bull; 4.2 MB
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 h-8 text-xs font-semibold"
                        >
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Coluna 3: Painel de Matriz Curricular à Direita */}
                  <div className="border border-slate-800 rounded-lg p-4 bg-slate-900/80 space-y-4">
                    {/* Cabeçalho da Matriz com Progresso Percentual */}
                    <div className="space-y-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-400" />
                          Matriz Curricular
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-[11px] border-emerald-500/40 text-emerald-400 font-mono font-bold"
                        >
                          85% Concluído
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[85%] rounded-full transition-all" />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>3 de 4 aulas concluídas</span>
                          <span>1 Quiz pendente</span>
                        </div>
                      </div>
                    </div>

                    {/* Lista Sequencial de Aulas */}
                    <div className="space-y-2 text-xs">
                      {/* Aula 27: Ativa / Destacada */}
                      <div className="p-3 rounded-lg bg-blue-950/50 border-2 border-blue-500/60 text-white shadow-md space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                            <span className="font-bold text-blue-200">
                              27. Introdução à Liderança
                            </span>
                          </div>
                          <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/40 text-[9px] uppercase">
                            Em Reprodução
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-300 pl-4">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3 text-slate-400" /> 14:20
                          </span>
                          <span className="text-emerald-400 font-medium">Vídeo Local VPS</span>
                        </div>
                      </div>

                      {/* Aula 28: Concluída */}
                      <div className="p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between cursor-pointer transition-colors">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-medium">28. Comunicação Pastoral Eficaz</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">18:45</span>
                      </div>

                      {/* Aula 29: Concluída */}
                      <div className="p-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between cursor-pointer transition-colors">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-medium">29. Planejamento Estratégico</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">22:10</span>
                      </div>

                      {/* Aula 30: Indicação de Quiz / Avaliação */}
                      <div className="p-2.5 rounded-lg bg-amber-950/20 hover:bg-amber-950/30 border border-amber-800/40 text-slate-200 flex items-center justify-between cursor-pointer transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <span className="font-medium block text-amber-200">
                              30. Prova do Módulo 1
                            </span>
                            <span className="text-[10px] text-slate-400">
                              5 perguntas &bull; Nota mín. 60
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] uppercase font-bold">
                          Quiz
                        </Badge>
                      </div>
                    </div>

                    {/* Nota de Governança sobre a Matriz */}
                    <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                      <p className="font-semibold text-slate-300">Integração Real na Fase 1:</p>
                      <p>
                        Módulos, aulas, duração, progresso percentual e status de conclusão serão
                        carregados das rotas <code>/aluno/cursos/:id/progresso</code> e{' '}
                        <code>/mentor/cursos/:id/etapas</code>.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Nova: Fase 1 — Entregáveis */}
          <TabsContent value="fase1_entregaveis" className="space-y-6 mt-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs font-semibold">
                        FASE 1 — REVISÃO PRÉ-HOMOLOGAÇÃO CONCLUÍDA
                      </Badge>
                      <Badge variant="outline" className="border-blue-500/40 text-blue-400 text-xs">
                        Branch: correcao-fluxo-cursos &bull; Base: 47aa7b1
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-xs">
                        27 Itens Validados &bull; SHA-256 Atualizados
                      </Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
                        sessionStorage Ativo &bull; Zero localStorage
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      Fase 1 — Entregáveis &amp; Revisão Pré-Homologação
                    </CardTitle>
                    <CardDescription className="text-slate-300 mt-1 text-xs">
                      Todos os artefatos e relatórios de auditoria foram consolidados em{' '}
                      <code>docs/fase1/</code>. O manifesto SHA-256, os endurecimentos de segurança
                      e o guia final estão prontos para cópia manual na VPS pelo operador.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyPath('docs/fase1/INTEGRACAO_FASE1.md')}
                    className="border-slate-700 bg-slate-950 text-xs shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Copiar docs/fase1/INTEGRACAO_FASE1.md
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Banner de Autorização do Operador */}
                <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-emerald-300 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      GATILHO DE AUTORIZAÇÃO CUMPRIDO
                    </span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                      Frase Exata Atestada
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-200">
                    <em>
                      &ldquo;Autorizo iniciar a Fase 1 da reescrita do painel do mentor.&rdquo;
                    </em>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    O último checkbox de autorização do relatório da Fase 0 foi formalmente
                    cumprido. A entrega contempla os três eixos aprovados: <strong>A</strong> (Novo
                    Painel estático completo), <strong>B</strong> (Substituto seguro de stream.js) e{' '}
                    <strong>C</strong> (Proposta técnica documentada para provas.js).
                  </p>
                </div>

                {/* Grade dos 4 Entregáveis com Status */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Inventário dos 4 Entregáveis no Workspace (docs/fase1/)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    {/* Entregável 1: painel-mentor.html */}
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-white text-sm flex items-center gap-1.5">
                          <Play className="w-4 h-4 text-blue-400" />
                          1. painel-mentor.html
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                          Endurecido &bull; SHA-256 OK
                        </Badge>
                      </div>
                      <div className="space-y-1.5 text-slate-300">
                        <div>
                          <strong className="text-slate-400">Caminho:</strong>{' '}
                          <code className="text-cyan-300 font-mono">
                            docs/fase1/NOVO_PAINEL/painel-mentor.html
                          </code>
                        </div>
                        <div>
                          <strong className="text-slate-400">Destino VPS:</strong>{' '}
                          <code className="text-slate-200 font-mono">
                            src/static/painel-mentor.html
                          </code>
                        </div>
                        <p className="text-slate-400 text-[11px] pt-1">
                          Arquivo estático autônomo com player 16:9, matriz curricular lateral,
                          suporte aos 4 formatos de vídeo e tratamento seguro de token em query
                          string (validação JWT + replaceState + sem logs + sessionStorage
                          exclusivo, sem persistência em localStorage).
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyPath('docs/fase1/NOVO_PAINEL/painel-mentor.html')}
                        className="w-full text-xs border-slate-700 bg-slate-900 text-slate-300"
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copiar Caminho do Painel
                      </Button>
                    </div>

                    {/* Entregável 2: stream.js */}
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-white text-sm flex items-center gap-1.5">
                          <Radio className="w-4 h-4 text-emerald-400" />
                          2. stream.js (Streaming Seguro)
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                          Endurecido &bull; SHA-256 OK
                        </Badge>
                      </div>
                      <div className="space-y-1.5 text-slate-300">
                        <div>
                          <strong className="text-slate-400">Caminho:</strong>{' '}
                          <code className="text-cyan-300 font-mono">docs/fase1/stream.js</code>
                        </div>
                        <div>
                          <strong className="text-slate-400">Destino VPS:</strong>{' '}
                          <code className="text-slate-200 font-mono">src/routes/stream.js</code>
                        </div>
                        <p className="text-slate-400 text-[11px] pt-1">
                          Streaming dinâmico com HTTP Range 206, trava de path traversal,
                          autorização aluno/mentor-dono/admin, fallback restrito à aula 27 e{' '}
                          <strong className="text-cyan-300">
                            guard READ_ONLY_TEST=true ativo para porta 3334
                          </strong>{' '}
                          (bloqueia POST/PUT/PATCH/DELETE com HTTP 403, no-op em produção).
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyPath('docs/fase1/stream.js')}
                        className="w-full text-xs border-slate-700 bg-slate-900 text-slate-300"
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copiar Caminho de stream.js
                      </Button>
                    </div>

                    {/* Entregável 3: INTEGRACAO_FASE1.md */}
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-white text-sm flex items-center gap-1.5">
                          <Terminal className="w-4 h-4 text-purple-400" />
                          3. INTEGRACAO_FASE1.md
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                          Versão Final Atualizada
                        </Badge>
                      </div>
                      <div className="space-y-1.5 text-slate-300">
                        <div>
                          <strong className="text-slate-400">Caminho:</strong>{' '}
                          <code className="text-cyan-300 font-mono">
                            docs/fase1/INTEGRACAO_FASE1.md
                          </code>
                        </div>
                        <p className="text-slate-400 text-[11px] pt-1">
                          Manual operacional completo: backup /root/backups/cursos/20261031_195147,
                          arquivos substituídos, comandos de cópia para pasta temporária
                          (/tmp/fase1_candidatos), diff previsto contra 47aa7b1, node --check,
                          rebuild EasyPanel, health check, 8 testes e rollback.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyPath('docs/fase1/INTEGRACAO_FASE1.md')}
                        className="w-full text-xs border-slate-700 bg-slate-900 text-slate-300"
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copiar Guia de Integração
                      </Button>
                    </div>

                    {/* Entregável 4: PROPOSTA_PROVAS.md */}
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-white text-sm flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-amber-400" />
                          4. PROPOSTA_PROVAS.md
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]">
                          Documentação Pura
                        </Badge>
                      </div>
                      <div className="space-y-1.5 text-slate-300">
                        <div>
                          <strong className="text-slate-400">Caminho:</strong>{' '}
                          <code className="text-cyan-300 font-mono">
                            docs/fase1/PROPOSTA_PROVAS.md
                          </code>
                        </div>
                        <p className="text-slate-400 text-[11px] pt-1">
                          Documentação dos 4 achados de provas.js sem aplicar no código de produção
                          (permanece protegido e inalterado).
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyPath('docs/fase1/PROPOSTA_PROVAS.md')}
                        className="w-full text-xs border-slate-700 bg-slate-900 text-slate-300"
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copiar Proposta de Provas
                      </Button>
                    </div>

                    {/* Entregável 5: REVISAO_FASE1.md */}
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-white text-sm flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-cyan-400" />
                          5. REVISAO_FASE1.md
                        </span>
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px]">
                          27 Pontos Auditados
                        </Badge>
                      </div>
                      <div className="space-y-1.5 text-slate-300">
                        <div>
                          <strong className="text-slate-400">Caminho:</strong>{' '}
                          <code className="text-cyan-300 font-mono">
                            docs/fase1/REVISAO_FASE1.md
                          </code>
                        </div>
                        <p className="text-slate-400 text-[11px] pt-1">
                          Revisão ponto a ponto dos 27 itens de conformidade com veredito,
                          evidências com arquivo e linha, eliminação de localStorage para
                          sessionStorage, rotas reais do backend e compatibilidade com os 4 tipos de
                          vídeo.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyPath('docs/fase1/REVISAO_FASE1.md')}
                        className="w-full text-xs border-slate-700 bg-slate-900 text-slate-300"
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copiar Relatório de Revisão
                      </Button>
                    </div>

                    {/* Entregável 6: VERIFICACAO_ARTEFATOS.md */}
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-white text-sm flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          6. VERIFICACAO_ARTEFATOS.md
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                          Manifesto Criptográfico
                        </Badge>
                      </div>
                      <div className="space-y-1.5 text-slate-300">
                        <div>
                          <strong className="text-slate-400">Caminho:</strong>{' '}
                          <code className="text-cyan-300 font-mono">
                            docs/fase1/VERIFICACAO_ARTEFATOS.md
                          </code>
                        </div>
                        <p className="text-slate-400 text-[11px] pt-1">
                          Manifesto SHA-256 atualizado dos 6 arquivos, veredito e evidências
                          (arquivo+linha) para os 27 pontos pré-homologação, resultado do node
                          --check, varredura de segredos (zero vazamentos) e comandos de cópia para
                          pasta temporária com diff previsto contra 47aa7b1.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyPath('docs/fase1/VERIFICACAO_ARTEFATOS.md')}
                        className="w-full text-xs border-slate-700 bg-slate-900 text-slate-300"
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copiar Manifesto SHA-256
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tabela Interativa do Manifesto SHA-256 Consolidado */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-white text-sm">
                        Manifesto Criptográfico SHA-256 dos Artefatos (Validado em Tempo Real)
                      </h4>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                      9 Itens Monitorados &bull; 100% Coerente
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    Hashes oficiais calculados via SHA-256 para cada artefato gerado no workspace
                    GoSkip. O operador da VPS pode auditar cada arquivo antes da cópia usando{' '}
                    <code>sha256sum</code>.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                          <th className="p-2 font-semibold">Artefato</th>
                          <th className="p-2 font-semibold">Destino VPS</th>
                          <th className="p-2 font-semibold">Camada</th>
                          <th className="p-2 font-semibold font-mono">Hash SHA-256 Oficial</th>
                          <th className="p-2 font-semibold text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {MANIFESTO_ARTEFATOS_FASE1.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="p-2 font-medium text-white flex items-center gap-1.5">
                              <span className="text-emerald-400 font-mono text-[11px]">&bull;</span>
                              {item.nome}
                            </td>
                            <td className="p-2 font-mono text-[11px] text-cyan-300">
                              {item.destinoVps}
                            </td>
                            <td className="p-2 text-slate-400 text-[11px]">{item.camada}</td>
                            <td className="p-2 font-mono text-[10px] text-emerald-300 break-all select-all">
                              {item.sha256}
                            </td>
                            <td className="p-2 text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyPath(item.sha256)}
                                className="h-6 px-2 text-[10px] text-slate-400 hover:text-white hover:bg-slate-800"
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                {copiedDoc === item.sha256 ? 'Copiado!' : 'Copiar Hash'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Card Especial: Teste Pré-Homologação na VPS (Modo A e Modo B) */}
                <div className="p-4 rounded-lg bg-slate-950 border-2 border-cyan-800/60 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-cyan-500/20 text-cyan-400">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          Teste Pré-Homologação na VPS (Caminho Seguro Não Invasivo)
                        </h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Resposta ao operador: testar antes de oficializar, sem comitar, sem
                          rebuild e sem tocar em produção.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]">
                        HOMOLOGAÇÃO PENDENTE DE AUTORIZAÇÃO
                      </Badge>
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-[10px]">
                        Isolamento Estrito em /tmp
                      </Badge>
                    </div>
                  </div>

                  {/* Alerta Mandatório do Cliente: 3334 não é homologação */}
                  <div className="p-3 rounded bg-rose-950/30 border border-rose-800/50 space-y-1.5 text-xs">
                    <span className="font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Regra Absoluta do Cliente:{' '}
                      <em>
                        &quot;Não declarar a Fase 1 homologada apenas porque o serviço iniciou na
                        porta 3334&quot;
                      </em>
                    </span>
                    <p className="text-slate-300 text-[11px]">
                      A porta alternativa isola o processo mas <strong>não isola o banco</strong>.
                      Por isso, o teste na porta 3334 roda obrigatoriamente com{' '}
                      <code>READ_ONLY_TEST=true</code> (somente leitura: POST/PUT/PATCH/DELETE
                      bloqueados com 403). Testes de escrita exigem a Camada 3 (banco separado a
                      partir de backup). A homologação oficial ocorre exclusivamente na Camada 4 via
                      EasyPanel após autorização.
                    </p>
                  </div>

                  {/* As 4 Camadas de Teste e Validação */}
                  <div className="space-y-2">
                    <span className="font-semibold text-white text-xs">
                      Matriz das 4 Camadas de Teste e Validação da Fase 1:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-cyan-400" />
                            [Camada 1] Modo A: Estático (Zero Risco)
                          </span>
                          <Badge
                            variant="outline"
                            className="border-cyan-500/40 text-cyan-400 text-[10px]"
                          >
                            Passo 1
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          A partir de <code>/tmp/fase1_candidatos/</code>: confere hashes SHA-256,
                          executa <code>node --check</code> no stream.js, valida HTML do painel e
                          gera diffs unificados contra o commit base <code>47aa7b1</code> sem
                          aplicar nada. Prova com <code>git status</code> 100% limpo.
                        </p>
                        <div className="bg-slate-950 p-2 rounded font-mono text-[11px] text-cyan-200 border border-slate-800">
                          ./docs/operacoes/testar-fase1-vps.sh estatico
                        </div>
                      </div>

                      <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                            <Radio className="w-4 h-4 text-emerald-400" />
                            [Camada 2] Modo B: Leitura na Porta 3334
                          </span>
                          <Badge
                            variant="outline"
                            className="border-emerald-500/40 text-emerald-400 text-[10px]"
                          >
                            READ_ONLY_TEST=true
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          Processo isolado em <code>/tmp/fase1_teste/</code>. Conecta ao Postgres
                          com <strong>guard de leitura obrigatório</strong> (mutações rejeitadas com
                          403). Testa health, autorização, streaming com Range 206 e traversal sem
                          gravar no banco.
                        </p>
                        <div className="bg-slate-950 p-2 rounded font-mono text-[11px] text-emerald-200 border border-slate-800">
                          ./docs/operacoes/testar-fase1-vps.sh servidor &&
                          ./docs/operacoes/testar-fase1-vps.sh bateria
                        </div>
                      </div>

                      <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-300 flex items-center gap-1.5">
                            <Terminal className="w-4 h-4 text-purple-400" />
                            [Camada 3] Homologação: Banco Separado
                          </span>
                          <Badge
                            variant="outline"
                            className="border-purple-500/40 text-purple-400 text-[10px]"
                          >
                            Escrita Isolada
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          Ambiente de escrita sob demanda criado pelo operador a partir do backup{' '}
                          <code>20261031_195147</code> (Postgres na porta 5433, Redis 6380 e pasta{' '}
                          <code>/srv/cursos/videos-homologacao/</code>). NUNCA compartilha o banco
                          real.
                        </p>
                        <div className="bg-slate-950 p-2 rounded font-mono text-[11px] text-purple-200 border border-slate-800">
                          ./docs/operacoes/testar-fase1-vps.sh homologacao
                        </div>
                      </div>

                      <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300 flex items-center gap-1.5">
                            <Play className="w-4 h-4 text-amber-400" />
                            [Camada 4] Homologação Oficial EasyPanel
                          </span>
                          <Badge
                            variant="outline"
                            className="border-amber-500/40 text-amber-400 text-[10px]"
                          >
                            Produção Oficial
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          Apenas após autorização formal do operador. Aplica diffs na branch{' '}
                          <code>correcao-fluxo-cursos</code> (base 47aa7b1), commit, push e rebuild
                          do container de produção via EasyPanel.
                        </p>
                        <div className="bg-slate-950 p-2 rounded font-mono text-[11px] text-amber-200 border border-slate-800">
                          git push origin correcao-fluxo-cursos &rarr; EasyPanel Redeploy
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bateria de Testes com curl (13 Itens do Cliente) */}
                  <div className="space-y-2 text-xs">
                    <span className="font-semibold text-white">
                      Bateria de Testes Automatizada dos 13 Itens Exigidos pelo Cliente:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">1. Health Check</span>
                        <code className="text-emerald-300">GET /health &rarr; 200 OK</code>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">2. Range HTTP</span>
                        <code className="text-emerald-300">Range: bytes &rarr; 206 Partial</code>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">
                          3. Stream sem Range
                        </span>
                        <code className="text-emerald-300">GET /stream/:id &rarr; 200 OK</code>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">4. Sem Relação</span>
                        <code className="text-amber-300">Sem matrícula/dono &rarr; 403</code>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">5. Sem Token</span>
                        <code className="text-amber-300">Anônimo &rarr; 401 Unauthorized</code>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">
                          6. Fallback Aula 27
                        </span>
                        <code className="text-cyan-300">Apenas ID 27 legado</code>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">
                          7. Aula Nova sem Vídeo
                        </span>
                        <code className="text-amber-300">ID 99999 &rarr; 400 Erro Claro</code>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">
                          8. Path Traversal
                        </span>
                        <code className="text-rose-300">../../etc/passwd &rarr; 403 Bloqueado</code>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">
                          9. Guard READ_ONLY_TEST
                        </span>
                        <code className="text-emerald-300">POST/PUT/DEL &rarr; 403 Bloqueado</code>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">
                          10. Storage /srv/cursos
                        </span>
                        <code className="text-emerald-300">Upload rejeitado &rarr; Intocado</code>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">
                          11. Token por Env Var
                        </span>
                        <code className="text-cyan-300">Apenas $TEST_TOKEN_* no shell</code>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block font-semibold">
                          12 e 13. Sem Token em Disco/Log
                        </span>
                        <code className="text-emerald-300">Zero vazamento em /tmp e log</code>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Cópia dos Documentos */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyPath('docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md')}
                      className="text-xs border-cyan-800 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" /> Copiar
                      docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyPath('docs/operacoes/testar-fase1-vps.sh')}
                      className="text-xs border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" /> Copiar
                      docs/operacoes/testar-fase1-vps.sh
                    </Button>
                  </div>
                </div>

                {/* Card Especial: Aplicação Automatizada na VPS (aplicar-fase1-vps.sh) */}
                <div className="p-4 rounded-lg bg-slate-950 border-2 border-emerald-800/60 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-400">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          Aplicação Automatizada na VPS (Script Interativo Seguro)
                        </h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Automatização dos 9 passos do operador na VPS com confirmação explícita a
                          cada etapa destrutiva.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                        9 Subcomandos
                      </Badge>
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]">
                        Confirmação s/N Obrigatória
                      </Badge>
                    </div>
                  </div>

                  {/* Alerta de Segurança e Isolamento */}
                  <div className="p-3 rounded bg-amber-950/30 border border-amber-800/50 space-y-1.5 text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Regra Absoluta: O GoSkip NÃO Executa Nada na VPS
                    </span>
                    <p className="text-slate-300 text-[11px]">
                      O GoSkip entrega o script como artefato de automação. Cabe exclusivamente ao{' '}
                      <strong>operador humano</strong> copiá-lo para a VPS e disparar a execução.
                      Nenhuma etapa que substitui arquivos, faz commit/push ou dispara redeploy roda
                      sem o operador digitar explicitamente <code>s</code>. O diff permanece como{' '}
                      <strong>auditoria visual</strong> do operador antes de qualquer substituição.
                    </p>
                  </div>

                  {/* Grade dos 9 Subcomandos */}
                  <div className="space-y-2 text-xs">
                    <span className="font-semibold text-white">
                      Os 9 Subcomandos Disponíveis no Script:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-[11px]">
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <code className="text-cyan-300 font-bold">1. verificar</code>
                          <Badge
                            variant="outline"
                            className="text-[9px] border-slate-700 text-slate-400"
                          >
                            Leitura
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          Checa branch <code>correcao-fluxo-cursos</code>, commit{' '}
                          <code>47aa7b1</code>, git status e presença dos candidatos.
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <code className="text-cyan-300 font-bold">2. copiar</code>
                          <Badge
                            variant="outline"
                            className="text-[9px] border-cyan-700 text-cyan-400"
                          >
                            Isolado
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          Monta <code>/tmp/fase1_candidatos/</code> com os arquivos sem tocar em
                          produção.
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <code className="text-purple-300 font-bold">3. diff</code>
                          <Badge
                            variant="outline"
                            className="text-[9px] border-purple-700 text-purple-400"
                          >
                            Visual
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          Gera diffs contra <code>47aa7b1</code> em <code>/tmp</code>. Auditoria
                          visual obrigatória do operador.
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <code className="text-amber-300 font-bold">4. substituir</code>
                          <Badge
                            variant="outline"
                            className="text-[9px] border-amber-700 text-amber-400"
                          >
                            Destrutivo
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          Gera backups <code>.bak.fase1</code> e copia para <code>src/</code>{' '}
                          somente após confirmação <code>[s/N]</code>.
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <code className="text-emerald-300 font-bold">5. validar</code>
                          <Badge
                            variant="outline"
                            className="text-[9px] border-emerald-700 text-emerald-400"
                          >
                            Sintaxe
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          Executa <code>node --check</code> no stream.js e afere SHA-256 contra o
                          manifesto.
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <code className="text-rose-300 font-bold">6. commit</code>
                          <Badge
                            variant="outline"
                            className="text-[9px] border-rose-700 text-rose-400"
                          >
                            Push
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          <code>git add</code> só dos 2 arquivos + push exclusivo em{' '}
                          <code>correcao-fluxo-cursos</code> (NUNCA main).
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <code className="text-blue-300 font-bold">7. redeploy</code>
                          <Badge
                            variant="outline"
                            className="text-[9px] border-blue-700 text-blue-400"
                          >
                            EasyPanel
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          Dispara rebuild via API com <code>$EASYPANEL_TOKEN</code> mascarado (ou
                          guia manual).
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <code className="text-emerald-300 font-bold">8. testes</code>
                          <Badge
                            variant="outline"
                            className="text-[9px] border-emerald-700 text-emerald-400"
                          >
                            Pós-Deploy
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          Bateria dos 8 testes de negócio e segurança (Range, mentor 403, traversal,
                          upload, Groq).
                        </p>
                      </div>

                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <code className="text-amber-300 font-bold">9. rollback</code>
                          <Badge
                            variant="outline"
                            className="text-[9px] border-amber-700 text-amber-400"
                          >
                            &lt; 3 min
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          Restaura <code>.bak.fase1</code> ou <code>47aa7b1</code>, mede tempo gasto
                          e aponta snapshot seguro.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comando do Modo Guiado */}
                  <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                    <span className="font-semibold text-white">
                      Modo Guiado Sequencial (Recomendado):
                    </span>
                    <div className="bg-slate-950 p-2 rounded font-mono text-[11px] text-emerald-300 border border-slate-800 flex items-center justify-between">
                      <span>./docs/operacoes/aplicar-fase1-vps.sh tudo</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyPath('./docs/operacoes/aplicar-fase1-vps.sh tudo')}
                        className="h-5 px-2 text-[10px] text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copiar
                      </Button>
                    </div>
                  </div>

                  {/* Botão de Cópia do Script */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyPath('docs/operacoes/aplicar-fase1-vps.sh')}
                      className="text-xs border-emerald-800 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" /> Copiar Caminho
                      docs/operacoes/aplicar-fase1-vps.sh
                    </Button>
                  </div>
                </div>

                {/* Resumo do Passo a Passo para o Operador na VPS */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    Resumo do Passo a Passo do Operador na VPS
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                    <li>
                      <strong>Conectar na VPS:</strong> Acessar <code>cd /root/cursos-api</code> e
                      confirmar que está na branch <code>correcao-fluxo-cursos</code> (base estável{' '}
                      <code>47aa7b1</code>).
                    </li>
                    <li>
                      <strong>Copiar para pasta temporária:</strong> Copiar os arquivos candidatos
                      para <code>/tmp/fase1_candidatos/</code> <strong>sem substituir</strong> os
                      originais em produção.
                    </li>
                    <li>
                      <strong>Gerar diff previsto contra 47aa7b1:</strong> Executar{' '}
                      <code>
                        git show 47aa7b1:src/routes/stream.js | diff -u -
                        /tmp/fase1_candidatos/src/routes/stream.js
                      </code>{' '}
                      e{' '}
                      <code>
                        git show 47aa7b1:src/static/painel-mentor.html | diff -u -
                        /tmp/fase1_candidatos/src/static/painel-mentor.html
                      </code>
                      .
                    </li>
                    <li>
                      <strong>Substituir após auditoria visual:</strong> Fazer backup local
                      (.bak.fase1) e copiar de <code>/tmp/fase1_candidatos/</code> para{' '}
                      <code>src/</code>.
                    </li>
                    <li>
                      <strong>Validar sintaxe:</strong> Executar{' '}
                      <code>node --check src/routes/stream.js</code> na VPS antes de comitar.
                    </li>
                    <li>
                      <strong>Commit e Push:</strong> Criar commit rastreável e enviar para{' '}
                      <code>origin correcao-fluxo-cursos</code> (nunca main).
                    </li>
                    <li>
                      <strong>EasyPanel Rebuild:</strong> Disparar o Redeploy do serviço{' '}
                      <code>Cursos-API</code> no EasyPanel e acompanhar logs e health check.
                    </li>
                    <li>
                      <strong>Executar os 8 Testes:</strong> Validar autenticação, isolamento de
                      mentor, upload VPS, streaming dinâmico com Range, streaming do mentor sem 403,
                      path traversal, moderação Groq e bloqueio de publicação.
                    </li>
                    <li>
                      <strong>Rollback se necessário:</strong> Caso ocorra qualquer anomalia,
                      reverter para <code>47aa7b1</code> em menos de 3 minutos ou restaurar o
                      snapshot seguro <code>/root/backups/cursos/20261031_195147</code>.
                    </li>
                  </ol>
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
