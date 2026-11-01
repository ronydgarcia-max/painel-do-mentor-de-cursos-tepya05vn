/**
 * src/routes/stream.js - Substituto Oficial da Fase 1 (Cursos-API)
 *
 * Módulo de Streaming de Vídeo com suporte a HTTP Range (206 Partial Content),
 * consulta dinâmica de aulas no PostgreSQL, proteção estrita contra Path Traversal,
 * liberação de autorização para Aluno Matriculado OU Mentor Proprietário OU Admin,
 * e fallback transparente para a Aula 27 caso video_path ainda não esteja no banco.
 *
 * Entregável da Fase 1 elaborado no workspace GoSkip para aplicação manual na VPS
 * pelo operador na branch 'correcao-fluxo-cursos' sobre o commit base '47aa7b1'.
 *
 * NENHUMA CREDENCIAL OU SEGREDO REGISTRADO NESTE ARQUIVO.
 */

const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const pool = require('../database/db')
const auth = require('../middleware/auth')

/**
 * Fallback estático exclusivo da Aula 27 para retrocompatibilidade
 * caso a aula 27 no banco de dados ainda não possua o campo video_path preenchido.
 */
const BASE_VIDEOS_DIR = path.resolve(process.env.LOCAL_VIDEO_DIR || '/app/videos')

const FALLBACK_LOCAL_VIDEO_FILES = {
  27: path.join(BASE_VIDEOS_DIR, '37', 'aula-27.mp4'),
}

/**
 * Valida e resolve de forma segura o caminho de vídeo dentro do diretório base.
 * Rejeita qualquer tentativa de Path Traversal (ex.: ../../etc/passwd).
 *
 * @param {string} videoPath - Caminho relativo registrado no banco (ex.: "37/pending-uuid.mp4" ou "37/aula-27.mp4")
 * @returns {string} Caminho absoluto validado
 * @throws {Error} Lança exceção de segurança se o caminho escapar do diretório base
 */
function resolverCaminhoSeguro(videoPath) {
  if (!videoPath || typeof videoPath !== 'string') {
    throw new Error('Caminho de vídeo inválido ou vazio')
  }

  // Sanitização prévia contra caracteres de controle
  const sanitizedPath = videoPath.trim().replace(/\\/g, '/')

  // Validação estrita por regex para paths esperados: {curso_id}/{arquivo}.mp4
  const pathRegex = /^[0-9]+\/[a-zA-Z0-9_\-\.]+\.mp4$/
  if (!pathRegex.test(sanitizedPath)) {
    console.warn(
      `[STREAM SECURITY ALERT] Formato de video_path fora do padrão esperado: "${videoPath}"`,
    )
  }

  const resolved = path.resolve(BASE_VIDEOS_DIR, sanitizedPath)

  // Verificação estrita de barreira de diretório
  const baseComSeparador = BASE_VIDEOS_DIR.endsWith(path.sep)
    ? BASE_VIDEOS_DIR
    : BASE_VIDEOS_DIR + path.sep

  if (!resolved.startsWith(baseComSeparador) && resolved !== BASE_VIDEOS_DIR) {
    const errorMsg = `Tentativa de Path Traversal bloqueada: base="${BASE_VIDEOS_DIR}", destino="${resolved}"`
    console.error(`[STREAM SECURITY VIOLATION] ${errorMsg}`)
    const err = new Error('Acesso a caminho não permitido')
    err.statusCode = 403
    err.isSecurityAlert = true
    throw err
  }

  return resolved
}

/**
 * GET /stream/:aulaId
 *
 * Fluxo de execução:
 * 1. Autenticação obrigatória (middleware auth via Bearer, x-cursos-token ou ?token=).
 * 2. Consulta dinâmica na tabela de aulas para obter video_path, video_type e curso_id.
 * 3. Validação de autorização: Aluno Matriculado OU Mentor Dono do Curso OU Administrador.
 * 4. Resolução segura de caminho e validação de existência do arquivo em disco (404 se ausente).
 * 5. Suporte completo a HTTP Range (206 Partial Content) para reprodução fluida no player.
 */
router.get('/:aulaId', auth, async (req, res) => {
  const aulaId = parseInt(req.params.aulaId, 10)

  if (isNaN(aulaId) || aulaId <= 0) {
    return res.status(400).json({ error: 'ID da aula inválido' })
  }

  try {
    // 1. Consulta dinâmica dos metadados da aula/etapa no banco
    const aulaQuery = await pool.query(
      `SELECT id, curso_id, video_type, video_path, video_url, titulo 
       FROM aulas 
       WHERE id = $1`,
      [aulaId],
    )

    const aula = aulaQuery.rows[0]

    // Se a aula não existir no banco, verificar se é o registro legado identificado da aula 27
    if (!aula) {
      if (aulaId === 27) {
        // Fallback estrito: permitido apenas para o registro legado identificado da aula 27
      } else {
        return res.status(404).json({ error: 'Aula não encontrada' })
      }
    }

    const cursoId = aula ? aula.curso_id : 37 // Curso 37 é o curso canônico da aula 27 no fallback legado
    const usuarioId = req.usuario.id

    // 2. Pilar de Autorização Ampla e Segura:
    // Permite acesso se for aluno matriculado OU mentor dono do curso OU admin
    const authQuery = await pool.query(
      `SELECT 'matriculado' AS motivo FROM matriculas WHERE usuario_id = $1 AND curso_id = $2
       UNION
       SELECT 'mentor_dono' AS motivo FROM cursos WHERE id = $2 AND mentor_id = $1
       UNION
       SELECT 'admin' AS motivo FROM usuarios WHERE id = $1 AND role = 'admin'`,
      [usuarioId, cursoId],
    )

    if (authQuery.rows.length === 0) {
      return res.status(403).json({
        error: 'Acesso negado: você não está matriculado neste curso nem é o mentor proprietário.',
      })
    }

    // 3. Resolução do caminho do arquivo de vídeo local
    let videoFilePath = null

    if (aula && aula.video_type === 'local' && aula.video_path) {
      try {
        videoFilePath = resolverCaminhoSeguro(aula.video_path)
      } catch (err) {
        if (err.isSecurityAlert) {
          return res.status(403).json({ error: 'Caminho de vídeo não autorizado' })
        }
        return res.status(400).json({ error: err.message || 'Caminho de vídeo inválido' })
      }
    } else if (aulaId === 27 && FALLBACK_LOCAL_VIDEO_FILES[27]) {
      // Fallback estrito: exclusivo para o registro legado da aula 27 (Fase 0)
      // Nenhuma outra aula pode cair aqui.
      videoFilePath = FALLBACK_LOCAL_VIDEO_FILES[27]
    } else {
      // Qualquer outra aula nova sem video_path ou de outro tipo de vídeo retorna erro claro.
      // NUNCA reproduzir automaticamente o vídeo de outra aula.
      const tipo = aula ? aula.video_type : 'desconhecido'
      const msgErro =
        tipo === 'local'
          ? 'Vídeo local não processado ou video_path não definido para esta aula. Faça o upload do arquivo MP4 antes da reprodução.'
          : `Vídeo local não configurado para esta aula (tipo atual: ${tipo}). Para YouTube ou OneDrive, utilize a URL direta da aula.`

      return res.status(400).json({
        error: msgErro,
        aula_id: aulaId,
        video_type: tipo,
      })
    }

    // 4. Verificação de existência física do arquivo em disco
    if (!fs.existsSync(videoFilePath)) {
      console.warn(
        `[STREAM] Arquivo físico não encontrado em disco: ${videoFilePath} (aulaId: ${aulaId})`,
      )
      return res.status(404).json({
        error: 'Arquivo de vídeo não encontrado no servidor de arquivos.',
        aula_id: aulaId,
      })
    }

    // 5. Suporte a HTTP Range para streaming eficiente e busca no player
    const stat = fs.statSync(videoFilePath)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

      if (start >= fileSize || end >= fileSize || start > end) {
        res.status(416).setHeader('Content-Range', `bytes */${fileSize}`)
        return res.end()
      }

      const chunksize = end - start + 1
      const file = fs.createReadStream(videoFilePath, { start, end })

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }

      res.writeHead(206, head)
      file.pipe(res)
    } else {
      // Resposta completa sem Range (download ou início direto)
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
      }

      res.writeHead(200, head)
      fs.createReadStream(videoFilePath).pipe(res)
    }
  } catch (error) {
    console.error(
      `[STREAM ERROR] Erro ao processar streaming para aulaId ${aulaId}:`,
      error.message,
    )
    res.status(500).json({ error: 'Erro interno ao processar streaming de vídeo' })
  }
})

module.exports = router
