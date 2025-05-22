import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButtons,
  IonMenuButton
} from '@ionic/react';

import ChartResumo from '../../components/ChartResumo';
import ChartCategorias from '../../components/ChartCategorias';
import Categorias from '../../components/Categorias';

import { categoriasPredefinidas } from '../../components/categories';

const Home: React.FC = () => {
  const [valoresPorCategoria, setValoresPorCategoria] = useState<Record<string, number[]>>({});

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>

          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Resumo Financeiro</IonCardTitle>
                </IonCardHeader>
                <ChartResumo />
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Gastos por Categoria</IonCardTitle>
                </IonCardHeader>
                <ChartCategorias
                  categorias={categoriasPredefinidas}
                  valoresPorCategoria={valoresPorCategoria}
                />
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Lançar Gastos</IonCardTitle>
                </IonCardHeader>
                <Categorias
                  categorias={categoriasPredefinidas}
                  valoresPorCategoriaInicial={valoresPorCategoria}
                  onValoresChange={setValoresPorCategoria}
                  modoEdicao={true}
                />
              </IonCard>
            </IonCol>
          </IonRow>

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
