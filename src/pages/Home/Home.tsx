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

import ChartResumo from '../../components/ChartResumo/ChartResumo';
import ChartCategorias from '../../components/ChartCategorias/ChartCategorias';
import Categorias from '../../components/Categorias';

import { categoriasPredefinidas } from '../../components/categoriasPredefinidas';

const Home: React.FC = () => {
  const [valoresPorCategoria, setValoresPorCategoria] = useState<Record<string, number[]>>({});
  const receitaFixa = 4000;

  // Soma de todas as despesas lançadas por categoria
  const totalDespesas = Object.values(valoresPorCategoria)
    .flat()
    .reduce((acc, valor) => acc + valor, 0);

  const saldo = receitaFixa - totalDespesas;

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
                <ChartResumo
                  receita={receitaFixa}
                  despesas={totalDespesas}
                  saldo={saldo}
                />
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

          {/* CATEGORIAS DE GASTOS */}
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
