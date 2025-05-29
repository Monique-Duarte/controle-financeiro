/**  * Converte uma data em formato brasileiro (dd/MM/yyyy) para ISO (yyyy-MM-dd)  */
export function parseBRDateToISO(dataBR: string): string {
  const [dia, mes, ano] = dataBR.split('/');
  if (!dia || !mes || !ano) return '';
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

/**  * Extrai o mês no formato yyyy-MM a partir de uma data BR */
export function extrairMesAnoDeDataBR(dataBR: string): string {
  const [dia, mes, ano] = dataBR.split('/');
  if (!mes || !ano) return '';
  return `${ano}-${mes.padStart(2, '0')}`;
}

/** * Retorna a data de hoje em formato BR (dd/MM/yyyy)  */
export function dataHojeBR(): string {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
