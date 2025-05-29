import { DespesaTipo } from '../types/tipos';

export const filtrarDespesasFatura = (
  despesas: DespesaTipo[],
  cartaoId: string,
  fechamento: number,
  dataReferencia: string // formato ISO: yyyy-mm-dd
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
