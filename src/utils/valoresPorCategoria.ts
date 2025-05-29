import { DespesaTipo } from "../types/tipos";

export function agruparValoresPorCategoria(despesas: DespesaTipo[]): Record<string, number[]> {
  const agrupado: Record<string, number[]> = {};

  despesas.forEach(despesa => {
    const nomeCategoria = despesa.categoria?.nome; // usa nome ao invés de id
    const valor = Number(despesa.valor);

    if (nomeCategoria && !isNaN(valor)) {
      if (!agrupado[nomeCategoria]) {
        agrupado[nomeCategoria] = [];
      }
      agrupado[nomeCategoria].push(valor);
    }
  });

  return agrupado;
}
