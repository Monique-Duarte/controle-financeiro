import React from 'react';
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

import Categorias from '../../components/Categorias';

import { categoriasPredefinidas } from '../../components/categoriasPredefinidas';
import ResumoContainer from '../../components/ChartResumo/ResumoContainer';
import CategoriasContainer from '../../components/ChartCategorias/CategoriasContainer';

const Home: React.FC = () => {
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

          {/* GRÁFICOS */}
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Resumo Financeiro</IonCardTitle>
                </IonCardHeader>
                <ResumoContainer />
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Gastos por Categoria</IonCardTitle>
                </IonCardHeader>
                <CategoriasContainer />
              </IonCard>
            </IonCol>
          </IonRow>

          {/* CATEGORIAS DE GASTOS */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Lançar Gastos</IonCardTitle>
                </IonCardHeader>
                <Categorias
                  categorias={categoriasPredefinidas}
                  valoresPorCategoriaInicial={{}} // valor inicial vazio, pois não usamos mais aqui
                  onValoresChange={() => {}} // função vazia por enquanto
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