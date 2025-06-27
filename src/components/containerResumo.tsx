import React from 'react';
import { useFinanceStorage } from '../hook/useFinanceStorage';
import GraficoResumo from './Graficos/GraficoResumo';
import { IonContent, IonLoading, IonText } from '@ionic/react';

const ResumoContainer: React.FC = () => {
  const { totalReceitasMensal, totalDespesasMensal, loading, error } = useFinanceStorage();

  if (loading) {
    return (
      <IonContent className="ion-padding ion-text-center">
        <IonLoading isOpen={loading} message={'Carregando resumo financeiro...'} spinner="crescent" />
      </IonContent>
    );
  }

  if (error) {
    return (
      <IonContent className="ion-padding ion-text-center">
        <IonText color="danger">
          <p>Erro ao carregar dados: {error}</p>
        </IonText>
      </IonContent>
    );
  }

  return (
    <GraficoResumo
      totalReceitasMensal={totalReceitasMensal}
      totalDespesasMensal={totalDespesasMensal}
    />
  );
};

export default ResumoContainer;
