import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import ChartResumo from './ChartResumo';
import { Categoria } from '../categoriasPredefinidas';

type DespesaTipo = {
  data: string;
  descricao: string;
  valor: string;
  parcelas: number;
  fixa: boolean;
  categoria: Categoria;
};

type ReceitaTipo = {
  valor: string;
};

const ResumoContainer: React.FC = () => {
  const [receitas, setReceitas] = useState<number[]>([]);
  const [valoresPorCategoria, setValoresPorCategoria] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Buscar Receitas do Firebase
        const receitasSnap = await getDocs(collection(db, 'receitas'));
        const receitasList: number[] = receitasSnap.docs.map(doc => {
          const data = doc.data() as ReceitaTipo;
          return parseFloat(data.valor);
        });
        setReceitas(receitasList);

        // Buscar Despesas do Firebase
        const despesasSnap = await getDocs(collection(db, 'despesas'));
        const categoriasMap: Record<string, number[]> = {};

        despesasSnap.docs.forEach(doc => {
          const data = doc.data() as DespesaTipo;
          const valorTotal = parseFloat(data.valor);
          const valorPorParcela = valorTotal / data.parcelas;

          const categoriaNome = data.categoria?.nome || 'Outros';
          if (!categoriasMap[categoriaNome]) {
            categoriasMap[categoriaNome] = [];
          }
          categoriasMap[categoriaNome].push(valorPorParcela);
        });

        setValoresPorCategoria(categoriasMap);
      } catch (error) {
        console.error('Erro ao carregar dados do Firestore:', error);
      }
    };

    carregarDados();
  }, []);

  return (
    <ChartResumo
      receitas={receitas}
      valoresPorCategoria={valoresPorCategoria}
    />
  );
};

export default ResumoContainer;