import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import GraficoCategorias from '../GraficoCategorias/GraficoCategorias';
import { DespesaFirestore } from '../../types/tipos';

const CategoriasContainer: React.FC = () => {
  const [despesas, setDespesas] = useState<DespesaFirestore[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const colRef = collection(db, 'financas', 'global', 'despesas');

    // onSnapshot escuta atualizações em tempo real
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const dados = snapshot.docs.map(doc => doc.data() as DespesaFirestore);
      setDespesas(dados);
      setCarregando(false);
    }, (erro) => {
      console.error('Erro ao buscar despesas:', erro);
      setCarregando(false);
    });

    // Limpa o listener quando o componente desmonta
    return () => unsubscribe();
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (!despesas.length) return <p>Nenhuma despesa registrada.</p>;

  return <GraficoCategorias despesas={despesas} />;
};

export default CategoriasContainer;