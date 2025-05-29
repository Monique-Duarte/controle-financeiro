import { create } from 'zustand';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { CartaoConfiguracao } from '../types/tipos';

interface FaturaState {
  configuracoesFatura: CartaoConfiguracao[];
  carregando: boolean;
  erro?: string;

  iniciarEscutaConfiguracoes: () => () => void;
  salvarConfiguracoesFatura: (config: CartaoConfiguracao[]) => Promise<void>;
  setConfiguracoesFaturaLocal: (config: CartaoConfiguracao[]) => void;
}

const usuarioId = 'usuario-demo'; // Ajuste para usuário real

export const useFaturaStore = create<FaturaState>((set) => ({
  configuracoesFatura: [],
  carregando: false,
  erro: undefined,

  iniciarEscutaConfiguracoes: () => {
    set({ carregando: true, erro: undefined });

    const configRef = doc(db, 'userSettings', usuarioId);

    const unsubscribe = onSnapshot(
      configRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const configuracoes: CartaoConfiguracao[] = Array.isArray(data.configuracoesFatura)
            ? data.configuracoesFatura
            : [];
          set({ configuracoesFatura: configuracoes, carregando: false });
        } else {
          set({ configuracoesFatura: [], carregando: false });
        }
      },
      (error) => {
        set({ erro: error.message, carregando: false });
        console.error('Erro ao escutar configurações de fatura:', error);
      }
    );

    return unsubscribe;
  },

  salvarConfiguracoesFatura: async (config) => {
    set({ carregando: true, erro: undefined });
    try {
      const configRef = doc(db, 'userSettings', usuarioId);
      await setDoc(configRef, { configuracoesFatura: config }, { merge: true });
      set({ configuracoesFatura: config, carregando: false });
    } catch (error: any) {
      set({ erro: error.message, carregando: false });
      console.error('Erro ao salvar configurações de fatura:', error);
      throw error;
    }
  },

  setConfiguracoesFaturaLocal: (config) => set({ configuracoesFatura: config }),
}));
