import { DespesaTipo } from '../types/tipos';

export function somarValoresPorCategoria(despesas: DespesaTipo[]): Record<string, number> {
  return despesas.reduce((acc, despesa) => {
    const id =
      typeof despesa.categoria === 'string'
        ? despesa.categoria
        : despesa.categoria?.id || 'Desconhecida';

    const valor = Number(despesa.valor) || 0;
    acc[id] = (acc[id] || 0) + valor;
    return acc;
  }, {} as Record<string, number>);
}
