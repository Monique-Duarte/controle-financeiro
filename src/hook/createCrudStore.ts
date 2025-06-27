import { StateCreator } from 'zustand';
import { BaseDoc, TipoDoc, getDocsByTipo, addDocByTipo, updateDocByTipo, deleteDocByTipo, getDocsByTipoRealtime } from '../services/crud-service';

export interface CrudStore<T extends BaseDoc> {
  dados: T[];
  loading: boolean;
  error: string | null;
  carregar: (userId: string) => Promise<void>;
  adicionar: (userId: string, data: Omit<T, 'id'>) => Promise<T>;
  atualizar: (userId: string, id: string, data: Partial<Omit<T, 'id'>>) => Promise<void>;
  excluir: (userId: string, id: string) => Promise<void>;
  iniciarEscutaRealtime: (userId: string) => () => void;
}

export function createCrudSlice<T extends BaseDoc>(tipo: TipoDoc): StateCreator<CrudStore<T>> {
  return (set, get) => ({
    dados: [],
    loading: false,
    error: null,

    carregar: async (userId: string) => {
      set({ loading: true, error: null });
      try {
        const itens = await getDocsByTipo<T>(userId, tipo);
        set({ dados: itens, loading: false });
      } catch (e: any) {
        set({ error: `Erro ao carregar ${tipo}: ${e.message}`, loading: false });
        console.error(`Erro ao carregar ${tipo}:`, e);
      }
    },

    iniciarEscutaRealtime: (userId: string) => {
      set({ loading: true, error: null });
      const unsubscribe = getDocsByTipoRealtime<T>(userId, tipo, (data) => {
        set({ dados: data, loading: false, error: null });
      });
      return unsubscribe;
    },

    adicionar: async (userId: string, data: Omit<T, 'id'>) => {
      set({ loading: true, error: null });
      try {
        const novo = await addDocByTipo<T>(userId, tipo, data);
        set({ loading: false });
        return novo;
      } catch (e: any) {
        set({ error: `Erro ao adicionar ${tipo}: ${e.message}`, loading: false });
        console.error(`Erro ao adicionar ${tipo}:`, e);
        throw e;
      }
    },

    atualizar: async (userId: string, id: string, data: Partial<Omit<T, 'id'>>) => {
      set({ loading: true, error: null });
      try {
        await updateDocByTipo<T>(userId, tipo, id, data);
        set({ loading: false });
      } catch (e: any) {
        set({ error: `Erro ao atualizar ${tipo}: ${e.message}`, loading: false });
        console.error(`Erro ao atualizar ${tipo}:`, e);
        throw e;
      }
    },

    excluir: async (userId: string, id: string) => {
      set({ loading: true, error: null });
      try {
        await deleteDocByTipo(userId, tipo, id);
        set({ loading: false });
      } catch (e: any) {
        set({ error: `Erro ao excluir ${tipo}: ${e.message}`, loading: false });
        console.error(`Erro ao excluir ${tipo}:`, e);
        throw e;
      }
    },
  });
}