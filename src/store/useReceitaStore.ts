import { create } from 'zustand';
import { onSnapshot } from 'firebase/firestore';
import { getCollectionRef } from '../services/crud-service';
import { Receita } from '../types/tipos';

interface ReceitaStore {
  receitas: Receita[];
  valoresTotais: number;

  iniciarEscutaReceitas: () => () => void;
}

export const useReceitaStore = create<ReceitaStore>((set) => ({
  receitas: [],
  valoresTotais: 0,

  iniciarEscutaReceitas: () => {
    const receitasRef = getCollectionRef('receitas');

    const unsubscribe = onSnapshot(receitasRef, (snapshot) => {
      const receitas: Receita[] = [];
      let total = 0;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Receita;
        const valor = Number(data.valor) || 0;
        receitas.push({ ...data, id: docSnap.id });
        total += valor;
      });

      set({
        receitas,
        valoresTotais: total,
      });
    });

    return unsubscribe;
  },
}));
