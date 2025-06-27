import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaturaExportada } from '../types/tipos';

export function useExportador(dados: FaturaExportada[], nomeArquivo: string) {
  const exportarPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [['Nome', 'Data', 'Parcela', 'Valor', 'Descrição']],
      body: dados.map(item => [
        item.nome,
        item.data,
        item.parcela,
        item.valor,
        item.descricao || '',
      ]),
    });

    doc.save(`${nomeArquivo}.pdf`);
  };

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fatura');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `${nomeArquivo}.xlsx`);
  };

  return { exportarPDF, exportarExcel };
}
