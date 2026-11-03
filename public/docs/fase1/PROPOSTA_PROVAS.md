# PROPOSTA TÉCNICA DOCUMENTADA: REVISÃO DE `src/routes/provas.js`

**Documento:** `docs/fase1/PROPOSTA_PROVAS.md`  
**Escopo:** Proposta técnica não aplicada baseada na análise exaustiva de `src/routes/provas.js` (Seção Especial 8 de `docs/RELATORIO_FASE_0_MENTOR.md`).  
**Status da Proposta:** **DOCUMENTAÇÃO PURA — NENHUM ARQUIVO SUBSTITUTO GERADO**.  
**Regra Mandatória de Governança:**

> ⚠️ **A APLICAÇÃO DESTAS SUGESTÕES EXIGE CONFIRMAÇÃO EXPRESSA E SEPARADA DO OPERADOR DA VPS.**  
> O arquivo de produção `/root/cursos-api/src/routes/provas.js` permanece **INTEGRALMENTE INALTERADO E PROTEGIDO**. Não substitua o arquivo no repositório de produção sem autorização prévia específica.

---

## CONTEXTO E OBJETIVO

Na Fase 0 do projeto Cursos-API, o operador forneceu o código oficial de `src/routes/provas.js` para auditoria estática e mapeamento de riscos. A análise constatou que o módulo implementa com excelência:

1. Isolamento estrito de mentoria via helper `obterCursoDoMentor(cursoId, mentorId)`.
2. Transacionalidade atômica com `BEGIN`, `COMMIT` e `ROLLBACK` via `pool.connect()` no cadastro de provas.
3. Validação de domínio consistente (mínimo de 1 pergunta, no mínimo 2 alternativas por pergunta, e obrigatoriedade de exatamente uma alternativa correta).
4. Mapeamento de letras sequenciais automáticas (`A`, `B`, `C`, `D`, `E` com fallback dinâmico via `String.fromCharCode(65 + j)`).

Entretanto, foram identificados **4 achados de risco e consistência** que merecem atenção em rodada posterior. Abaixo detalham-se os 4 pontos, as causas-raiz e as propostas de refatoração para validação futura pelo operador.

---

## ACHADO 1: DELEÇÃO SEM VERIFICAÇÃO DE LINHAS AFETADAS (DELETE QUE RETORNA SUCESSO SEM EXCLUIR)

### Diagnóstico

No endpoint de exclusão de prova (`DELETE /cursos/:id/provas/:provaId`), o código atual executa:

```js
// Trecho atual em src/routes/provas.js (linhas ~240-250)
await pool.query('DELETE FROM provas WHERE id = $1 AND curso_id = $2', [
  req.params.provaId,
  req.params.id,
])
res.json({ success: true })
```

Se o `provaId` não existir no banco de dados, ou se a prova pertencer a outro curso, o PostgreSQL executa a query com sucesso e reporta `rowCount === 0`. Como o retorno da query não é inspecionado, o endpoint responde com status `200 OK` e `{ success: true }`, gerando falso positivo no cliente e mascarando inconsistências de exclusão.

### Proposta de Correção

Inspecionar explicitamente `result.rowCount`. Se for zero, responder com `HTTP 404 Not Found`.

```js
// Proposta sugerida para DELETE /cursos/:id/provas/:provaId
router.delete('/cursos/:id/provas/:provaId', auth, apenasMentor, async (req, res) => {
  try {
    const curso = await obterCursoDoMentor(req.params.id, req.usuario.id)
    if (!curso) {
      return res.status(404).json({ error: 'Curso não encontrado ou não pertence ao mentor' })
    }

    const result = await pool.query('DELETE FROM provas WHERE id = $1 AND curso_id = $2', [
      req.params.provaId,
      req.params.id,
    ])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Prova não encontrada para este curso' })
    }

    return res.json({ success: true, message: 'Prova excluída com sucesso' })
  } catch (error) {
    console.error('[PROVAS DELETE ERROR]', error)
    return res.status(500).json({ error: 'Erro ao excluir avaliação' })
  }
})
```

---

## ACHADO 2: ERROS DE VALIDAÇÃO RETORNANDO HTTP 500 COM VAZAMENTO DE MENSAGEM INTERNA

### Diagnóstico

No bloco `catch` do endpoint de criação de prova (`POST /cursos/:id/provas`), o tratamento genérico de erros responde:

```js
// Trecho atual em src/routes/provas.js
} catch (err) {
  if (client) await client.query('ROLLBACK')
  console.error('Erro ao criar prova:', err)
  res.status(500).json({ error: err.message || 'Erro ao criar prova' })
}
```

Isso gera dois efeitos indesejados:

1. Erros de validação disparados internamente durante o loop com `throw new Error('Cada pergunta precisa de pelo menos 2 alternativas...')` respondem ao cliente com status `HTTP 500 Internal Server Error` em vez de `HTTP 400 Bad Request`.
2. Em caso de falha de conexão, erro de sintaxe SQL ou violação de integridade do PostgreSQL, a mensagem nativa da engine (ex: detalhes de constraint, nomes de colunas ou pilha de chamadas) é vazada diretamente no JSON de resposta.

### Proposta de Correção

Diferenciar erros operacionais/validação de erros inesperados de infraestrutura:

```js
class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
    this.statusCode = 400
  }
}

// Dentro do loop de validação:
if (!Array.isArray(p.alternativas) || p.alternativas.length < 2) {
  throw new ValidationError(`A pergunta #${pIdx + 1} precisa de pelo menos 2 alternativas`)
}

// No bloco catch:
} catch (err) {
  if (client) await client.query('ROLLBACK')
  console.error('[PROVAS POST ERROR]', err)

  if (err instanceof ValidationError || err.statusCode === 400) {
    return res.status(400).json({ error: err.message })
  }

  // Mascara erros internos de banco para não vazar schema do PostgreSQL
  return res.status(500).json({ error: 'Erro interno ao processar cadastro da avaliação' })
}
```

---

## ACHADO 3: AUSÊNCIA DE TRAVA DE CICLO DE VIDA DO CURSO E MATRÍCULAS ATIVAS

### Diagnóstico

No arquivo `src/routes/mentor.js`, operações estruturais de cursos possuem travas estritas: cursos com status `em_analise`, `aprovado` ou que já possuem alunos matriculados (`SELECT COUNT(*) FROM matriculas WHERE curso_id = $1`) têm regras que impedem alteração para evitar quebrar o progresso dos alunos.

No entanto, em `src/routes/provas.js`, **não há verificação do status do curso nem de matrículas ativas**. Um mentor poderia:

- Excluir ou alterar provas de um curso já publicado;
- Apagar avaliações que alunos já responderam ou estão respondendo no frontend do aluno;
- Deixar registros órfãos na tabela de respostas de alunos.

### Proposta de Correção

Adicionar checagem de ciclo de vida antes de mutações (`POST`, `PUT`, `DELETE`):

```js
// Helper sugerido para validação de ciclo de vida
async function validarMutacaoPermitida(cursoId) {
  const checkQuery = await pool.query(
    `SELECT c.status, 
            (SELECT COUNT(*)::int FROM matriculas m WHERE m.curso_id = c.id) AS total_matriculas,
            (SELECT COUNT(*)::int FROM avaliacoes_respostas ar 
             JOIN provas p ON p.id = ar.prova_id 
             WHERE p.curso_id = c.id) AS total_respostas
     FROM cursos c 
     WHERE c.id = $1`,
    [cursoId],
  )

  const dados = checkQuery.rows[0]
  if (!dados) return { permitido: false, erro: 'Curso não encontrado' }

  if (dados.status === 'em_analise') {
    return { permitido: false, erro: 'Não é possível alterar avaliações de curso em moderação' }
  }

  if (dados.total_respostas > 0) {
    return {
      permitido: false,
      erro: 'Não é possível alterar ou excluir provas que já possuem respostas submetidas por alunos',
    }
  }

  return { permitido: true }
}
```

---

## ACHADO 4: ATUALIZAÇÃO PARCIAL DE PERGUNTAS E ALTERNATIVAS (PUT)

### Diagnóstico

O endpoint atual `PUT /cursos/:id/provas/:provaId` permite atualizar apenas:

- `titulo`
- `nota_minima` (0 a 100)
- `etapa_id` (se pertencer ao curso)

Não existe no backend um mecanismo para editar o texto de uma pergunta, adicionar uma nova alternativa ou alterar a alternativa correta sem que o mentor precise apagar a prova inteira e recriá-la do zero.

### Proposta de Correção

Existem duas abordagens possíveis para homologação do operador:

1. **Abordagem A (Substituição Atômica em Transação):**  
   Permitir que o `PUT /cursos/:id/provas/:provaId` receba opcionalmente o array `perguntas`. Se presente, deleta as alternativas e perguntas anteriores e reinsere as novas dentro da mesma transação `BEGIN`/`COMMIT`.
2. **Abordagem B (Sub-rotas Granulares de Questões):**  
   Implementar endpoints específicos como:
   - `PUT /cursos/:id/provas/:provaId/perguntas/:perguntaId`
   - `PUT /cursos/:id/provas/:provaId/perguntas/:perguntaId/alternativas/:altId`

A **Abordagem A** é a mais compatível com o frontend em formulário único do painel do mentor, exigindo menor complexidade de chamadas de rede.

---

## CONCLUSÃO E DIRETRIZ DE APLICAÇÃO

| Achado                            | Gravidade | Impacto no Negócio                                   | Situação na Fase 1                 |
| :-------------------------------- | :-------- | :--------------------------------------------------- | :--------------------------------- |
| 1. DELETE sem checar `rowCount`   | Média     | Falso positivo de sucesso em exclusão                | Proposta documentada (sem aplicar) |
| 2. Erros de validação HTTP 500    | Média     | Má classificação de erro e vazamento de mensagens    | Proposta documentada (sem aplicar) |
| 3. Ausência de trava de ciclo     | Alta      | Mentor pode quebrar prova em curso com alunos        | Proposta documentada (sem aplicar) |
| 4. Ausência de edição de questões | Baixa/UX  | Mentor precisa recriar prova para corrigir digitação | Proposta documentada (sem aplicar) |

> **Lembrete Operacional:** A aplicação de qualquer uma destas melhorias em `src/routes/provas.js` **NÃO FAZ PARTE DA FASE 1 ATUAL** e aguardará confirmação expressa do operador em rodada específica de backend.
