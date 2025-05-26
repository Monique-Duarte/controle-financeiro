import { create } from 'zustand';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../services/firebase';
import { DespesaFirestore, DespesaTipo } from '../types/tipos';
import { categoriasPredefinidas } from '../components/categoriasPredefinidas';

interface FinanceState {
  receitas: number[];
  valoresPorCategoria: Record<string, number[]>;
  despesas: DespesaTipo[];
  iniciarEscuta: () => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  receitas: [],
  valoresPorCategoria: {},
  despesas: [],
  iniciarEscuta: () => {
    const receitasRef = collection(db, 'financas', 'global', 'receitas');
    const despesasRef = collection(db, 'financas', 'global', 'despesas');

    onSnapshot(receitasRef, (snapshot) => {
      const receitaValores = snapshot.docs.map(doc => Number(doc.data().valor) || 0);
      set({ receitas: receitaValores });
    });

    onSnapshot(despesasRef, (snapshot) => {
      const agrupado: Record<string, number[]> = {};
      const despesasFirestore: DespesaFirestore[] = [];

      snapshot.docs.forEach(doc => {
        const data = doc.data() as DespesaFirestore;

        // Agrupar valores por categoria (para o estado valoresPorCategoria)
        const categoriaId = data.categoria?.id || 'Desconhecida';
        const valor = Number(data.valor) || 0;
        if (!agrupado[categoriaId]) agrupado[categoriaId] = [];
        agrupado[categoriaId].push(valor);

        despesasFirestore.push(data);
      });

      // Mapear despesasFirestore para despesasUI (com categoria com ícone e valor number)
      const despesasUI: DespesaTipo[] = despesasFirestore.map(despesa => {
        const categoriaComIcone = categoriasPredefinidas.find(cat => cat.id === despesa.categoria.id);
        return {
          ...despesa,
          valor: Number(despesa.valor),
          categoria: categoriaComIcone ?? { ...despesa.categoria, icone: null },
        };
      });

      set({
        valoresPorCategoria: agrupado,
        despesas: despesasUI,
      });
    });
  },
}));
