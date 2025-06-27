import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  getDespesasRealtime,
  addDespesa,
  updateDespesa,
  deleteDespesa
} from '../services/despesa-service';

import { DespesaTipo, CategoriaUI, DespesaFirestoreToSave } from '../types/tipos';
import { categoriasPredefinidas } from '../components/categoriasPredefinidas';

interface InternalDespesaStoreState {
  despesas: DespesaTipo[];
  valoresPorCategoria: Record<string, number[]>;
  loading: boolean;
  error: string | null;
  setDespesas: (despesas: DespesaTipo[]) => void;
  setValoresPorCategoria: (valores: Record<string, number[]>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

import { create } from 'zustand';

const internalDespesaStore = create<InternalDespesaStoreState>((set) => ({
  despesas: [],
  valoresPorCategoria: {},
  loading: true,
  error: null,
  setDespesas: (despesas) => set({ despesas }),
  setValoresPorCategoria: (valores) => set({ valoresPorCategoria: valores }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));


export const useDespesaStore = () => {
  const { despesas, valoresPorCategoria, loading, error, setDespesas, setValoresPorCategoria, setLoading, setError } = internalDespesaStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, [setLoading]);

  useEffect(() => {
    let unsubscribeRealtime: (() => void) | undefined;

    if (currentUser) {
      setLoading(true);
      setError(null);
      unsubscribeRealtime = getDespesasRealtime(currentUser.uid, (data) => {
        const despesasComCategoriasCompletas: DespesaTipo[] = data.map(d => {
          const categoriaFirestoreDoFirebase = d.categoria as any;

          const categoriaCompletaComIcone: CategoriaUI = categoriasPredefinidas.find(
            c => c.id === categoriaFirestoreDoFirebase?.id
          ) || categoriasPredefinidas[0];

          return {
            ...d,
            categoria: categoriaCompletaComIcone,
            descricao: d.descricao || '',
            parcelas: d.parcelas || 1,
            fixo: d.fixo || false,
            tipoPagamento: d.tipoPagamento || 'debito',
            cartao: d.cartao || undefined,
            parcelaAtual: d.parcelaAtual || undefined,
          } as DespesaTipo;
        }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        const agrupado: Record<string, number[]> = {};
        despesasComCategoriasCompletas.forEach((despesa) => {
          const categoriaId = despesa.categoria?.id || 'Desconhecida';
          const valor = Number(despesa.valor) || 0;

          if (!agrupado[categoriaId]) agrupado[categoriaId] = [];
          agrupado[categoriaId].push(valor);
        });

        setDespesas(despesasComCategoriasCompletas);
        setValoresPorCategoria(agrupado);
        setLoading(false);
      });
    } else {
      setDespesas([]);
      setValoresPorCategoria({});
      setLoading(false);
    }

    return () => {
      if (unsubscribeRealtime) {
        unsubscribeRealtime();
      }
    };
  }, [currentUser, setDespesas, setValoresPorCategoria, setLoading, setError]);

  const handleAddDespesa = useCallback(async (data: Omit<DespesaTipo, 'id'>) => {
    if (!currentUser) {
      setError('Usuário não autenticado para adicionar despesa.');
      return;
    }
    setLoading(true);
    try {
      const { icone: _icone, ...categoriaParaFirestore } = data.categoria;
      const despesaParaSalvar: DespesaFirestoreToSave = {
        ...data,
        categoria: categoriaParaFirestore,
      };
      await addDespesa(currentUser.uid, despesaParaSalvar);
      setError(null);
    } catch (err: any) {
      setError(`Erro ao adicionar despesa: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, setLoading, setError]);

  const handleUpdateDespesa = useCallback(async (id: string, data: Partial<Omit<DespesaTipo, 'id'>>) => {
    if (!currentUser) {
      setError('Usuário não autenticado para atualizar despesa.');
      return;
    }
    setLoading(true);
    try {
      const dataParaSalvar: Partial<DespesaFirestoreToSave> = { ...data };
      if (data.categoria) {
        const { icone: _icone, ...categoriaParaFirestore } = data.categoria as CategoriaUI;
        dataParaSalvar.categoria = categoriaParaFirestore;
      }

      await updateDespesa(currentUser.uid, id, dataParaSalvar);
      setError(null);
    } catch (err: any) {
      setError(`Erro ao atualizar despesa: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, setLoading, setError]);

  const handleDeleteDespesa = useCallback(async (id: string) => {
    if (!currentUser) {
      setError('Usuário não autenticado para deletar despesa.');
      return;
    }
    setLoading(true);
    try {
      await deleteDespesa(currentUser.uid, id);
      setError(null);
    } catch (err: any) {
      setError(`Erro ao deletar despesa: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, setLoading, setError]);


  return {
    despesas,
    valoresPorCategoria,
    loading,
    error,
    adicionarDespesa: handleAddDespesa,
    atualizarDespesa: handleUpdateDespesa,
    removerDespesa: handleDeleteDespesa,
  };
};