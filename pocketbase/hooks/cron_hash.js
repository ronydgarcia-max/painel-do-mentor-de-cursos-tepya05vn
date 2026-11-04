cronAdd('hash_calc_job', '* * * * *', () => {
  try {
    const content = $os.readFile('docs/operacoes/testar-fase1-vps.sh')
    console.log('HASH_RESULT_RAW: ' + $security.sha256(content))
  } catch (err) {
    console.log('HASH_ERROR: ' + err.message)
  }
})
