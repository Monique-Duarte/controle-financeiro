import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ChartCategorias from '../GrafcoCategorias/GraficoCategorias';
import { DespesaFirestore } from '../../types/tipos';

const CategoriasContainer: React.FC = () => {
  const [despesas, setDespesas] = useState<DespesaFirestore[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDespesas = async () => {
      try {
        const colRef = collection(db, 'financas', 'global', 'despesas'); 
        const snapshot = await getDocs(colRef);
        const dados = snapshot.docs.map(doc => {
          const data = doc.data() as DespesaFirestore;
          // Aqui você pode ajustar data.valor para garantir que seja string formatada, ou outro ajuste
          return data;
        });
        setDespesas(dados);
      } catch (erro) {
        console.error('Erro ao buscar despesas:', erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarDespesas();
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (!despesas.length) return <p>Nenhuma despesa registrada.</p>;

  return <ChartCategorias despesas={despesas} />;
};

export default CategoriasContainer;
