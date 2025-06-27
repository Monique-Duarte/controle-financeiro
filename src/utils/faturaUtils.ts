import { DespesaTipo, Cartao } from '../types/tipos';
import { parseISO, isWithinInterval } from 'date-fns';

function estaDentroDoCicloDeFatura(
  dataDespesaStr: string,
  dataReferenciaStr: string,
  config: Cartao
): boolean {
  const dataDespesa = parseISO(dataDespesaStr);
  const dataReferencia = parseISO(dataReferenciaStr);
  const ano = dataReferencia.getFullYear();
  const mes = dataReferencia.getMonth();
  const inicio = new Date(ano, mes - 1, config.fechamentoFatura + 1);
  const fim = new Date(ano, mes, config.fechamentoFatura);

  return isWithinInterval(dataDespesa, { start: inicio, end: fim });
}

export function filtrarDespesasPorCartoes(
  despesas: DespesaTipo[],
  configuracoes: Cartao[],
  dataAtual: string
): {
  despesasPorCartao: Record<string, DespesaTipo[]>;
  totalFaturasMes: number;
} {
  const despesasPorCartao: Record<string, DespesaTipo[]> = {};
  let totalFaturasMes = 0;

  despesas.forEach((despesa) => {
    if (despesa.tipoPagamento !== 'credito' || !despesa.cartao) return;

    const config = configuracoes.find((c) => c.nomeCartao === despesa.cartao);
    if (!config) return;

    if (estaDentroDoCicloDeFatura(despesa.data, dataAtual, config)) {
      if (!despesasPorCartao[config.nomeCartao]) despesasPorCartao[config.nomeCartao] = [];
      despesasPorCartao[config.nomeCartao].push(despesa);
      totalFaturasMes += despesa.valor;
    }
  });

  return {
    despesasPorCartao,
    totalFaturasMes,
  };
}

export const filtrarDespesasFatura = (
  despesas: DespesaTipo[],
  cartaoId: string,
  fechamento: number,
  dataReferencia: string 
): DespesaTipo[] => {
  const dataRef = new Date(dataReferencia);
  const ano = dataRef.getFullYear();
  const mes = dataRef.getMonth();

  const inicio =
    fechamento >= 28
      ? new Date(ano, mes, fechamento)
      : new Date(ano, mes - 1, fechamento + 1);
  const fim = new Date(ano, mes, fechamento); 

  return despesas.filter((despesa) => {
    if (despesa.tipoPagamento !== 'credito') return false;
    if (despesa.cartao !== cartaoId) return false;

    const dataDespesa = new Date(despesa.data);
    return dataDespesa >= inicio && dataDespesa <= fim;
  });
};

export function somarValoresPorCategoria(despesas: DespesaTipo[]): Record<string, number> {
  return despesas.reduce((acc, despesa) => {
    const id = despesa.categoria.id || 'Desconhecida';
    const valor = Number(despesa.valor) || 0;
    acc[id] = (acc[id] || 0) + valor;
    return acc;
  }, {} as Record<string, number>);
}

export function agruparValoresPorCategoria(despesas: DespesaTipo[]): Record<string, number[]> {
  const agrupado: Record<string, number[]> = {};

  despesas.forEach(despesa => {
    const nomeCategoria = despesa.categoria?.nome;
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