import { DespesaTipo, CartaoConfiguracao } from '../types/tipos';
import { parseISO, isWithinInterval } from 'date-fns';

/**
 * Verifica se a data da despesa está dentro do ciclo da fatura com base na configuração do cartão.
 */
function estaDentroDoCicloDeFatura(
  dataDespesaStr: string,
  dataReferenciaStr: string,
  config: CartaoConfiguracao
): boolean {
  const dataDespesa = parseISO(dataDespesaStr);
  const dataReferencia = parseISO(dataReferenciaStr);

  const ano = dataReferencia.getFullYear();
  const mes = dataReferencia.getMonth();

  const inicio = new Date(ano, mes - 1, config.fechamentoFatura + 1);
  const fim = new Date(ano, mes, config.fechamentoFatura);

  return isWithinInterval(dataDespesa, { start: inicio, end: fim });
}

/**
 * Agrupa as despesas por cartão e calcula o total de todas as faturas do mês atual.
 */
export function filtrarDespesasPorCartoes(
  despesas: DespesaTipo[],
  configuracoes: CartaoConfiguracao[],
  dataAtual: string
): {
  despesasPorCartao: Record<string, DespesaTipo[]>;
  totalFaturasMes: number;
} {
  const despesasPorCartao: Record<string, DespesaTipo[]> = {};
  let totalFaturasMes = 0;

  despesas.forEach((despesa) => {
    if (despesa.tipoPagamento !== 'credito' || !despesa.cartao) return;

    const config = configuracoes.find((c) => c.id === despesa.cartao);
    if (!config) return;

    if (estaDentroDoCicloDeFatura(despesa.data, dataAtual, config)) {
      if (!despesasPorCartao[config.id]) despesasPorCartao[config.id] = [];
      despesasPorCartao[config.id].push(despesa);
      totalFaturasMes += despesa.valor;
    }
  });

  return {
    despesasPorCartao,
    totalFaturasMes,
  };
}