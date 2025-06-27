import GraficoCategorias from './Graficos/GraficoCategorias';
import { useDespesaStore } from '../hook/useDespesaStore';
import { IonContent, IonLoading, IonText } from '@ionic/react';

const CategoriasContainer: React.FC = () => {
  const { despesas, loading, error } = useDespesaStore();

  if (loading) {
    return (
      <IonContent className="ion-padding ion-text-center">
        <IonLoading isOpen={loading} message={'Carregando categorias...'} spinner="crescent" />
      </IonContent>
    );
  }

  if (error) {
    return (
      <IonContent className="ion-padding ion-text-center">
        <IonText color="danger">
          <p>Erro ao carregar categorias: {error}</p>
        </IonText>
      </IonContent>
    );
  }

  return <GraficoCategorias despesas={despesas} />;
};

export default CategoriasContainer;