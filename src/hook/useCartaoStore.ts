import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';

import {
  getCartoesRealtime,
  addCartao,
  updateCartao,
  deleteCartao
} from '../services/cartao-service';
import { Cartao } from '../types/tipos';


interface CartaoZustandState {
  cartoes: Cartao[];
  loading: boolean;
  error: string | null;
  setCartoes: (cartoes: Cartao[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

import { create } from 'zustand';

const internalCartaoStore = create<CartaoZustandState>((set) => ({
  cartoes: [],
  loading: true,
  error: null,
  setCartoes: (cartoes) => set({ cartoes }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export const useCartaoStore = () => {
  const { cartoes, loading, error, setCartoes, setLoading, setError } = internalCartaoStore();
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
      unsubscribeRealtime = getCartoesRealtime(currentUser.uid, (data) => {
        setCartoes(data);
        setLoading(false);
      });
    } else {
      setCartoes([]);
      setLoading(false);
    }

    return () => {
      if (unsubscribeRealtime) {
        unsubscribeRealtime();
      }
    };
  }, [currentUser, setCartoes, setLoading, setError]);

  const handleAddCartao = useCallback(async (dados: Omit<Cartao, 'id'>) => {
    if (!currentUser) {
      setError('Usuário não autenticado para adicionar cartão.');
      return;
    }
    setLoading(true);
    try {
      await addCartao(currentUser.uid, dados);
      setError(null);
    } catch (err: any) {
      setError(`Erro ao adicionar cartão: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, setLoading, setError]);

  const handleUpdateCartao = useCallback(async (dados: Cartao) => {
    if (!currentUser) {
      setError('Usuário não autenticado para atualizar cartão.');
      return;
    }
    if (!dados.id) {
      setError('ID do cartão é necessário para atualização.');
      return;
    }
    setLoading(true);
    try {
      await updateCartao(currentUser.uid, dados.id, dados);
      setError(null);
    } catch (err: any) {
      setError(`Erro ao atualizar cartão: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, setLoading, setError]);

  const handleRemoveCartao = useCallback(async (id: string) => {
    if (!currentUser) {
      setError('Usuário não autenticado para remover cartão.');
      return;
    }
    setLoading(true);
    try {
      await deleteCartao(currentUser.uid, id);
      setError(null);
    } catch (err: any) {
      setError(`Erro ao remover cartão: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, setLoading, setError]);

  return {
    cartoes,
    loading,
    error,
    adicionarCartao: handleAddCartao,
    atualizarCartao: handleUpdateCartao,
    removerCartao: handleRemoveCartao,
  };
};