import { db } from './firebase';
import { doc, collection } from 'firebase/firestore';

export const despesasRef = collection(doc(db, 'financas', 'global'), 'despesas');
export const receitasRef = collection(doc(db, 'financas', 'global'), 'receitas');
