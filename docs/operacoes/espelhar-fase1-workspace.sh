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
bc1f5732b6289522591b46bf639b8079e133bda736264f63b9f3c1f96c1fb062  docs/fase1/stream.js
b9c3c701fd9e2e5bc51b619366b79c0223372fbff854a04aacd3c3f6f34d11d8  docs/fase1/NOVO_PAINEL/painel-mentor.html
3908e3bb777637df2e6855f2e7ec61891116d041eef56fae0b4a96c21835f7a6  docs/fase1/INTEGRACAO_FASE1.md
16dfff6134df7caeeace571f004299fde6b27b3aebf0c2cd1772a1c04a011241  docs/fase1/PROPOSTA_PROVAS.md
e16ce2583cfd7e123b09345bdb09f5403de3d94267a1ace66a1cb65901478666  docs/fase1/REVISAO_FASE1.md
089bbab9d5e305d045d62637254e4443ee1f99c23949f57ebbf7fc63b2eb2ca9  docs/fase1/TESTE_PRE_HOMOLOGACAO_VPS.md
44063fbc1735a29be6058f9fc2994086ad377f0a8f81e370a2f4da898e4f1a23  docs/operacoes/testar-fase1-vps.sh
b08abe53ac5d36a5e7f7e67b34a5e8a92541f4353c5107de1898bebb1f591193  docs/operacoes/aplicar-fase1-vps.sh
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
