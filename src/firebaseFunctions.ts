import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // caminho para sua config do firebase

interface Despesa {
  categoria: string;
  valor: number;
  data: Date;
  observacao?: string;
  parcela?: number;
  fixo?: boolean;
}

export async function adicionarDespesa(despesa: Despesa) {
  const despesasRef = collection(db, 'despesas');
  return await addDoc(despesasRef, despesa);
}
