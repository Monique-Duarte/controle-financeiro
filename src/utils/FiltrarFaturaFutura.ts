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