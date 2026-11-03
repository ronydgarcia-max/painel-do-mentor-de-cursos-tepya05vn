#!/usr/bin/env bash
# ==============================================================================
# ESPELHO DOS ARTEFATOS DA FASE 1 PARA CAMINHO PÚBLICO (public/docs/...)
# ==============================================================================
# Projeto: Plataforma Cursos (Cursos-API / Painel do Mentor)
# Arquivo: docs/operacoes/espelhar-fase1-workspace.sh
# Onde rodar: NO WORKSPACE GoSkip (não é para a VPS). O operador executa uma vez
#             para atualizar o espelho público que o app da prévia passa a servir.
#
# O QUE FAZ: copia os artefatos oficiais da Fase 1 para public/docs/... com
#            cp --preserve (bytes exatos, logo mesmo SHA-256 do manifesto) e
#            reconfere cada cópia contra o manifesto SHA-256 embutido abaixo.
#
# O QUE NÃO FAZ: nada de repositório remoto, nada de commit/push automático (o
#            commit do espelho é feito pelo operador, como qualquer arquivo do
#            workspace), nada na VPS, zero segredos.
# ==============================================================================

set -euo pipefail

# Manifesto de integridade (devem bater com docs/fase1/VERIFICACAO_ARTEFATOS.md
# e com src/lib/manifestHelper.ts do app).
read -r -d '' MANIFESTO_SHA256 <<'EOF_SHA' || true
2be71f49646bde330ec0c822ff611be9e173e44c2057d23f381c81ef94e1e07b  docs/fase1/stream.js
3d9501a300d8b4e7a3ec11cc0a66d548f7663e6e87f2e1a47321e06fa536f0e4  docs/fase1/NOVO_PAINEL/painel-mentor.html
168e37dc0bd59a16f272a8c3d8e578ba33cd7c768991fa9a7ffccbe5b9bc5d11  docs/fase1/INTEGRACAO_FASE1.md
e9b2513de5553e1e40eb617b7b15a6b5a3e1438fa5a48483f3e27150a294f4a3  docs/fase1/PROPOSTA_PROVAS.md
3312c1404c0429fec033bd2f27ddc54aa5017e2978931dc150c95029a502f664  docs/fase1/REVISAO_FASE1.md
38a6ec1552a46e1074e50d536cf0ba7493eef250bc44618e7751c8a14ec7a59a  docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md
e927c9c054238e55eefea2b27429bb7b05cdcd5d1ec5ce1e6e0261c470196253  docs/operacoes/testar-fase1-vps.sh
c93f06b9968452309ec95ba8d133038a8e1e7bd66ff852b86a8ff39fa1cf8743  docs/operacoes/aplicar-fase1-vps.sh
EOF_SHA

log_ok()   { echo -e "\033[1;32m[OK]\033[0m $1"; }
log_erro() { echo -e "\033[1;31m[ERRO]\033[0m $1" >&2; }

log_ok "Espelhando artefatos da Fase 1 em public/docs/ (bytes exatos)..."

while IFS= read -r linha; do
  [ -z "$linha" ] && continue
  hash_esperado=$(echo "$linha" | awk '{print $1}')
  caminho_rel=$(echo "$linha" | awk '{print $2}')
  if [ ! -f "$caminho_rel" ]; then
    log_erro "Artefato de origem ausente no workspace: $caminho_rel"
    exit 1
  fi
  mkdir -p "$(dirname "public/$caminho_rel")"
  cp --preserve=mode,timestamps "$caminho_rel" "public/$caminho_rel"
  hash_copiado=$(sha256sum "public/$caminho_rel" | awk '{print $1}')
  if [ "$hash_copiado" != "$hash_esperado" ]; then
    log_erro "FALHA DE INTEGRIDADE no espelho: $caminho_rel"
    log_erro "  Esperado: $hash_esperado"
    log_erro "  Obtido:   $hash_copiado"
    exit 1
  fi
  log_ok "Espelhado e conferido: public/$caminho_rel (SHA-256 OK)"
done <<EOF_SHA
$MANIFESTO_SHA256
EOF_SHA

# O instalador e o VERIFICACAO_ARTEFATOS.md também são espelhados, mas sem hash
# fixo de verificação: ambos mudam a cada revisão documental (o VERIFICACAO registra
# os hashes; o instalador embute os hashes que confere). Os valores reais são
# calculados e impressos abaixo para o operador registrar no manifesto do app
# (src/lib/manifestHelper.ts) e no VERIFICACAO_ARTEFATOS.md — nunca inventados.
if [ -f "docs/operacoes/instalar-fase1.sh" ]; then
  mkdir -p "public/docs/operacoes"
  cp --preserve=mode,timestamps "docs/operacoes/instalar-fase1.sh" "public/docs/operacoes/instalar-fase1.sh"
  log_ok "Espelhado: public/docs/operacoes/instalar-fase1.sh"
fi
if [ -f "docs/fase1/VERIFICACAO_ARTEFATOS.md" ]; then
  mkdir -p "public/docs/fase1"
  cp --preserve=mode,timestamps "docs/fase1/VERIFICACAO_ARTEFATOS.md" "public/docs/fase1/VERIFICACAO_ARTEFATOS.md"
  log_ok "Espelhado: public/docs/fase1/VERIFICACAO_ARTEFATOS.md"
fi
for f in docs/operacoes/instalar-fase1.sh docs/fase1/VERIFICACAO_ARTEFATOS.md; do
  if [ -f "$f" ]; then
    log_ok "SHA-256 de $f (registrar no manifesto do app): $(sha256sum "$f" | awk '{print $1}')"
  fi
done

log_ok "Espelho concluído. Os artefatos ficam disponíveis na URL pública da prévia em:"
log_ok "  <origem>/docs/fase1/... , <origem>/docs/operacoes/instalar-fase1.sh"
log_ok "  e <origem>/docs/fase1/VERIFICACAO_ARTEFATOS.md"
log_ok "Lembre-se de comitar o espelho (public/docs/...) para que a prévia publique as URLs."
