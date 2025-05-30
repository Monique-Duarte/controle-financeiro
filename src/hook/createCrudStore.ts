import { StateCreator } from 'zustand';
import { BaseDoc, TipoDoc, getDocsByTipo, addDocByTipo, updateDocByTipo, deleteDocByTipo } from '../services/crud-service';

export interface CrudStore<T extends BaseDoc> {
  dados: T[];
  carregar: () => Promise<void>;
  adicionar: (data: Omit<T, 'id'>) => Promise<void>;
  atualizar: (id: string, data: Partial<Omit<T, 'id'>>) => Promise<void>;
  excluir: (id: string) => Promise<void>;
}

export function createCrudSlice<T extends BaseDoc>(tipo: TipoDoc): StateCreator<CrudStore<T>> {
  return (set) => ({
    dados: [],
    carregar: async () => {
      const itens = await getDocsByTipo<T>(tipo);
      set({ dados: itens });
    },
    adicionar: async (data) => {
      const novo = await addDocByTipo<T>(tipo, data);
      set((state) => ({ dados: [...state.dados, novo] }));
    },
    atualizar: async (id, data) => {
      await updateDocByTipo<T>(tipo, id, data);
      set((state) => ({
        dados: state.dados.map((d) => (d.id === id ? { ...d, ...data } : d)),
      }));
    },
    excluir: async (id) => {
      await deleteDocByTipo(tipo, id);
      set((state) => ({
        dados: state.dados.filter((d) => d.id !== id),
      }));
    },
  });
}
