import { DespesaTipo } from '../pages/Despesa/Despesa';

export function agruparValoresPorCategoria(despesas: DespesaTipo[]): Record<string, number[]> {
  const agrupado: Record<string, number[]> = {};

  despesas.forEach(despesa => {
    const idCategoria = despesa.categoria?.id;
    const valor = parseFloat(despesa.valor);

    if (idCategoria && !isNaN(valor)) {
      if (!agrupado[idCategoria]) {
        agrupado[idCategoria] = [];
      }
      agrupado[idCategoria].push(valor);
    }
  });

  return agrupado;
}
