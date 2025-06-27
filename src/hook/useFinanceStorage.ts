import { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';

import { getDespesasRealtime } from '../services/despesa-service';
import { getReceitasRealtime } from '../services/receita-service';

import { DespesaTipo, ReceitaTipo, CategoriaUI } from '../types/tipos';
import { categoriasPredefinidas } from '../components/categoriasPredefinidas';

interface FinanceHookState {
  totalReceitasMensal: number;
  totalDespesasMensal: number;
  allReceitas: ReceitaTipo[];
  allDespesas: DespesaTipo[];
  loading: boolean;
  error: string | null;
}

export const useFinanceStorage = (): FinanceHookState => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allReceitas, setAllReceitas] = useState<ReceitaTipo[]>([]);
  const [allDespesas, setAllDespesas] = useState<DespesaTipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribeReceitas: (() => void) | undefined;
    let unsubscribeDespesas: (() => void) | undefined;

    if (currentUser) {
      setLoading(true);
      setError(null);

      unsubscribeReceitas = getReceitasRealtime(currentUser.uid, (data) => {
        const receitasMapeadas: ReceitaTipo[] = data.map(r => ({
          id: r.id,
          data: r.data,
          descricao: r.descricao,
          valor: r.valor,
          fixo: r.fixo || false
        }));
        setAllReceitas(receitasMapeadas);
      });

      unsubscribeDespesas = getDespesasRealtime(currentUser.uid, (data) => {
        const despesasComCategoriasCompletas: DespesaTipo[] = data.map(d => {
          const categoriaFirestoreDoFirebase = d.categoria;

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
        });
        setAllDespesas(despesasComCategoriasCompletas);
      });

      setLoading(false);

    } else {
      setAllReceitas([]);
      setAllDespesas([]);
      setLoading(false);
    }

    return () => {
      if (unsubscribeReceitas) {
        unsubscribeReceitas();
      }
      if (unsubscribeDespesas) {
        unsubscribeDespesas();
      }
    };
  }, [currentUser, setLoading, setError]);

  const { totalReceitasMensal, totalDespesasMensal } = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const filteredReceitas = allReceitas.filter(r => {
      const date = new Date(r.data);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const filteredDespesas = allDespesas.filter(d => {
      const date = new Date(d.data);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalR = filteredReceitas.reduce((acc, r) => acc + r.valor, 0);
    const totalD = filteredDespesas.reduce((acc, d) => acc + d.valor, 0);

    return { totalReceitasMensal: totalR, totalDespesasMensal: totalD };
  }, [allReceitas, allDespesas]);

  return {
    totalReceitasMensal,
    totalDespesasMensal,
    allReceitas,
    allDespesas,
    loading,
    error,
  };
};
