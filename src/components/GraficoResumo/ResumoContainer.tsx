import React, { useEffect } from 'react';
import { useFinanceStore } from '../../stores/financeStore';
import GraficoResumo from './GraficoResumo';

const ResumoContainer: React.FC = () => {
  const receitas = useFinanceStore(state => state.receitas);
  const valoresPorCategoria = useFinanceStore(state => state.valoresPorCategoria);
  const iniciarEscuta = useFinanceStore(state => state.iniciarEscuta);

  useEffect(() => {
    iniciarEscuta();
  }, [iniciarEscuta]);

  return (
    <GraficoResumo receitas={receitas} valoresPorCategoria={valoresPorCategoria} />
  );
};

export default ResumoContainer;
