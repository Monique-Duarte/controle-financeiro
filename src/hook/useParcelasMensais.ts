// src/hook/useParcelasMensais.ts

import { DespesaTipo } from '../types/tipos';

interface ParcelaVirtual extends DespesaTipo {
  dataParcela: string;
  numeroParcela: number;
}

export function useParcelasMensais(despesas: DespesaTipo[], mesAnoSelecionado: string): ParcelaVirtual[] {
  const parcelas: ParcelaVirtual[] = [];

  despesas.forEach((d) => {
    const dataInicial = new Date(d.data);
    const totalParcelas = d.parcelas || 1;

    for (let i = 0; i < totalParcelas; i++) {
      const dataParcela = new Date(dataInicial);
      dataParcela.setMonth(dataParcela.getMonth() + i);

      const mes = String(dataParcela.getMonth() + 1).padStart(2, '0');
      const ano = dataParcela.getFullYear();
      const mesAnoParcela = `${ano}-${mes}`;

      if (mesAnoParcela === mesAnoSelecionado) {
        parcelas.push({
          ...d,
          dataParcela: dataParcela.toISOString(),
          numeroParcela: i + 1,
        });
      }
    }
  });

  return parcelas;
}