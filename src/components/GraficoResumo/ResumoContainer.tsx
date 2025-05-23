import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import ChartResumo from './GraficoResumo';

const ResumoContainer: React.FC = () => {
  const [receitas, setReceitas] = useState<number[]>([]);
  const [valoresPorCategoria, setValoresPorCategoria] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Substitua 'usuarioId' pela lógica real do usuário autenticado
        const receitaSnapshot = await getDocs(collection(db, 'financas', 'global', 'receitas'));
        const receitaValores = receitaSnapshot.docs.map(doc => Number(doc.data().valor) || 0);
        setReceitas(receitaValores);

        const despesaSnapshot = await getDocs(collection(db, 'financas', 'global', 'despesas'));
        const despesas = despesaSnapshot.docs.map(doc => doc.data());

        const agrupado: Record<string, number[]> = {};
        despesas.forEach(d => {
          const categoriaId = d.categoria?.id || 'Desconhecida';
          const valor = Number(d.valor) || 0;
          if (!agrupado[categoriaId]) agrupado[categoriaId] = [];
          agrupado[categoriaId].push(valor);
        });

        setValoresPorCategoria(agrupado);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  return (
    <ChartResumo receitas={receitas} valoresPorCategoria={valoresPorCategoria} />
  );
};

export default ResumoContainer;