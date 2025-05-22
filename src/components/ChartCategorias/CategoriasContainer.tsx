// src/components/CategoriasContainer.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // ajuste o caminho conforme necessário
import ChartCategorias from './ChartCategorias';

interface Despesa {
  valor: number;
  categoriaId: string;
}

const CategoriasContainer: React.FC = () => {
  const [valoresPorCategoria, setValoresPorCategoria] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const fetchDespesas = async () => {
      const despesasSnapshot = await getDocs(collection(db, 'despesas'));
      const despesasData: Despesa[] = despesasSnapshot.docs.map((doc) => doc.data() as Despesa);

      const agrupado: Record<string, number[]> = {};
      despesasData.forEach(({ valor, categoriaId }) => {
        if (!agrupado[categoriaId]) {
          agrupado[categoriaId] = [];
        }
        agrupado[categoriaId].push(valor);
      });

      setValoresPorCategoria(agrupado);
    };

    fetchDespesas();
  }, []);

  return <ChartCategorias valoresPorCategoria={valoresPorCategoria} />;
};

export default CategoriasContainer;
