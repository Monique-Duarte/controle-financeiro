import { create } from 'zustand';
import { query, orderBy, getDocs } from 'firebase/firestore';
import { getCollectionRef } from '../services/crud-service'; // caminho ajustado conforme seu projeto

export interface Cartao {
  id: string;
  nomeCartao: string;
  fechamentoFatura: number; 
  pagamentoFatura: number;  
}

interface CartaoStoreState {
  cartoes: Cartao[];
  carregarCartoes: () => Promise<void>;
}

export const useCartaoStore = create<CartaoStoreState>((set) => ({
  cartoes: [],

  carregarCartoes: async () => {
    try {
      const ref = getCollectionRef('cartoes'); // usa a função que já acessa financas/global/cartoes
      const q = query(ref, orderBy('nomeCartao'));

      const snapshot = await getDocs(q);

      const cartoes: Cartao[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nomeCartao: data.nomeCartao ?? '',
          fechamentoFatura: data.fechamentoFatura ?? 1,
          pagamentoFatura: data.pagamentoFatura ?? 1,
        };
      });

      set({ cartoes });
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
      set({ cartoes: [] }); // limpa para evitar estado travado
    }
  },
}));
