import { DIVERGENCIAS_NOMES } from './divergenciasNomes'

export const HASHES_DOCUMENTO = {
  painel: 'c22421379ecbeaf19cc30e9d56286fa6c5471a2a4669fcf7fd10b3ef773d1000',
  integracao: 'e1bd171b9c788647ba3f86b772bd2c6428795e1eb2fe4e8c199042b3bfb084cc',
  proposta: 'c223c2182fc60f64c632832877bc9ea0b571161d763cc08e5e6e8bf834661005',
  revisao: '95d36e84d436ec037b51b7f94bb1a196fc9fe4cf8fa3b7a149a463c7849e75eb',
  teste: '489d81d227b686e58b15d2a71d7a31b6727c62f2de938a16aa475e533c393bc6',
  aplicar: '8c16d56df825cc2dc1e60f7e4be7aa0aa7c981989ea1c2ef36e814fd5be1bfa6',
  instalar: '23efd625aa6de9e01768686f0f5b11eb080a845ea0f71fc0f074d3dc6fdeca29',
}

export function encontrarDivergencias(): string[] {
  const lista: string[] = []
  for (const [k, v] of Object.entries(HASHES_DOCUMENTO)) {
    if (DIVERGENCIAS_NOMES[k] !== v) {
      lista.push(k)
    }
  }
  return lista
}
