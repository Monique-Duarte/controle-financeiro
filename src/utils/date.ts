export function parseBRDateToISO(dataBR: string): string {
  const [dia, mes, ano] = dataBR.split('/');
  if (!dia || !mes || !ano) return '';
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

export function extrairMesAnoDeDataBR(dataBR: string): string {
  const [dia, mes, ano] = dataBR.split('/');
  if (!mes || !ano) return '';
  return `${ano}-${mes.padStart(2, '0')}`;
}

export function dataHojeBR(): string {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
