import { create } from 'zustand';
import { onSnapshot, doc, setDoc } from 'firebase/firestore';
import { DespesaFirestore, DespesaTipo, CartaoConfiguracao } from '../types/tipos';
import { categoriasPredefinidas } from '../components/categoriasPredefinidas';
import { db } from '../services/firebase';
import { getCollectionRef } from '../services/crud-service';

interface FinanceState {
  receitas: number[];
  valoresPorCategoria: Record<string, number[]>;
  despesas: DespesaTipo[];
  configuracoesFatura: CartaoConfiguracao[];

  iniciarEscuta: () => () => void;
  salvarConfiguracoesFatura: (config: CartaoConfiguracao[]) => Promise<void>;
  setConfiguracoesFaturaLocal: (config: CartaoConfiguracao[]) => void;
}

const usuarioId = 'usuario-demo';

export const useFinanceStore = create<FinanceState>((set) => ({
  receitas: [],
  valoresPorCategoria: {},
  despesas: [],
  configuracoesFatura: [],

  iniciarEscuta: () => {
    // 🔁 Referências corretas com base na estrutura /financas/global/{tipo}
    const receitasRef = getCollectionRef('receitas');
    const despesasRef = getCollectionRef('despesas');

    const unsubscribeReceitas = onSnapshot(receitasRef, (snapshot) => {
      const receitaValores = snapshot.docs.map(docSnap => Number(docSnap.data().valor) || 0);
      console.log('Receitas capturadas:', receitaValores);
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

      console.log('Despesas processadas:', despesasUI);

      set({
        valoresPorCategoria: agrupado,
        despesas: despesasUI,
      });
    });

    // Configuração de fatura
    const configRef = doc(db, 'userSettings', usuarioId);
    const unsubscribeConfig = onSnapshot(configRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const configuracoes: CartaoConfiguracao[] = Array.isArray(data.configuracoesFatura)
          ? data.configuracoesFatura
          : [];
        set({ configuracoesFatura: configuracoes });
      } else {
        set({ configuracoesFatura: [] });
      }
    });

    return () => {
      unsubscribeReceitas();
      unsubscribeDespesas();
      unsubscribeConfig();
    };
  },

  salvarConfiguracoesFatura: async (config) => {
    try {
      const configRef = doc(db, 'userSettings', usuarioId);
      await setDoc(configRef, { configuracoesFatura: config }, { merge: true });
      set({ configuracoesFatura: config });
    } catch (error) {
      console.error('Erro ao salvar configurações de fatura:', error);
      throw error;
    }
  },

  setConfiguracoesFaturaLocal: (config) => set({ configuracoesFatura: config }),
}));