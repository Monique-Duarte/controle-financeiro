import { create } from 'zustand';
import { onSnapshot, doc, setDoc } from 'firebase/firestore';
import { DespesaFirestore, DespesaTipo, Cartao } from '../types/tipos';
import { categoriasPredefinidas } from '../components/categoriasPredefinidas';
import { db } from '../services/firebase';
import { getCollectionRef } from '../services/crud-service';

interface FinanceState {
  receitas: number[];
  valoresPorCategoria: Record<string, number[]>;
  despesas: DespesaTipo[];
  cartoes: Cartao[];  // <-- renomeado aqui

  iniciarEscuta: () => () => void;
  salvarCartoes: (config: Cartao[]) => Promise<void>;  // renomeado função também para manter padrão
  setCartoesLocal: (config: Cartao[]) => void;
}

const usuarioId = 'usuario-demo';

export const useFinanceStore = create<FinanceState>((set) => ({
  receitas: [],
  valoresPorCategoria: {},
  despesas: [],
  cartoes: [],  // renomeado aqui

  iniciarEscuta: () => {
    const receitasRef = getCollectionRef('receitas');
    const despesasRef = getCollectionRef('despesas');

    const unsubscribeReceitas = onSnapshot(receitasRef, (snapshot) => {
      const receitaValores = snapshot.docs.map(docSnap => Number(docSnap.data().valor) || 0);
      set({ receitas: receitaValores });
    });

    const unsubscribeDespesas = onSnapshot(despesasRef, (snapshot) => {
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

      const despesasUI: DespesaTipo[] = despesasFirestore.map(despesa => {
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
        valoresPorCategoria: agrupado,
        despesas: despesasUI,
      });
    });

    // Configuração de fatura (cartoes)
    const configRef = doc(db, 'userSettings', usuarioId);
    const unsubscribeConfig = onSnapshot(configRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const cartoes: Cartao[] = Array.isArray(data.cartoes) ? data.cartoes : [];
        set({ cartoes });
      } else {
        set({ cartoes: [] });
      }
    });

    return () => {
      unsubscribeReceitas();
      unsubscribeDespesas();
      unsubscribeConfig();
    };
  },

  salvarCartoes: async (config) => {
    try {
      const configRef = doc(db, 'userSettings', usuarioId);
      await setDoc(configRef, { cartoes: config }, { merge: true });
      set({ cartoes: config });
    } catch (error) {
      console.error('Erro ao salvar cartões:', error);
      throw error;
    }
  },

  setCartoesLocal: (config) => set({ cartoes: config }),
}));
