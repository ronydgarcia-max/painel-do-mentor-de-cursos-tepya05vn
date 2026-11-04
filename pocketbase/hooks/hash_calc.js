routerAdd('GET', '/backend/hash-testar', (e) => {
  const content = $os.readFile('docs/operacoes/testar-fase1-vps.sh')
  const hash = $security.sha256(content)
  return e.json(200, { hash: hash, length: content.length })
})
