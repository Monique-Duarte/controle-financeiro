import { create } from 'zustand';
import { onSnapshot } from 'firebase/firestore';
import { getCollectionRef } from '../services/crud-service';
import { categoriasPredefinidas } from '../components/categoriasPredefinidas';
import { DespesaFirestore, DespesaTipo } from '../types/tipos';

interface DespesaStore {
  despesas: DespesaTipo[];
  valoresPorCategoria: Record<string, number[]>;

  iniciarEscutaDespesas: () => () => void;
}

export const useDespesaStore = create<DespesaStore>((set) => ({
  despesas: [],
  valoresPorCategoria: {},

  iniciarEscutaDespesas: () => {
    const despesasRef = getCollectionRef('despesas');

    const unsubscribe = onSnapshot(despesasRef, (snapshot) => {
      const agrupado: Record<string, number[]> = {};
      const despesasFirestore: DespesaFirestore[] = [];

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data() as DespesaFirestore;
        const categoriaId = data.categoria?.id || 'Desconhecida';
        const valor = Number(data.valor) || 0;

        if (!agrupado[categoriaId]) agrupado[categoriaId] = [];
        agrupado[categoriaId].push(valor);
        despesasFirestore.push(data);
      });

      const despesasUI: DespesaTipo[] = despesasFirestore.map((despesa) => {
        const categoriaComIcone = categoriasPredefinidas.find(cat => cat.id === despesa.categoria.id);
        return {
          ...despesa,
          valor: Number(despesa.valor),
          categoria: categoriaComIcone ?? { ...despesa.categoria, icone: null },
          tipoPagamento:
            despesa.tipoPagamento === 'credito' || despesa.tipoPagamento === 'debito'
              ? despesa.tipoPagamento
              : 'debito',
        };
      });

      set({
        despesas: despesasUI,
        valoresPorCategoria: agrupado,
      });
    });

    return unsubscribe;
  }
}));
