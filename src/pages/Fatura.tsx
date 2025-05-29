import React, { useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonItem,
  IonLabel,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';

import '../styles/Fatura.css';
import { useFinanceStore } from '../store/useFinanceStore';

// 👇 Função para calcular qual parcela estamos
function calcularParcelaAtual(dataInicial: string, totalParcelas: number): string {
  const dataInicio = new Date(dataInicial);
  const hoje = new Date();

  const anoDiff = hoje.getFullYear() - dataInicio.getFullYear();
  const mesDiff = hoje.getMonth() - dataInicio.getMonth();
  const mesesPassados = anoDiff * 12 + mesDiff;

  const parcelaAtual = Math.min(mesesPassados + 1, totalParcelas);
  return `${parcelaAtual}/${totalParcelas}`;
}

const FaturaPage: React.FC = () => {
  const { despesas, iniciarEscuta } = useFinanceStore();

  useEffect(() => {
    const unsubscribe = iniciarEscuta();
    return () => unsubscribe();
  }, []);

  const total = despesas.reduce((acc, d) => acc + d.valor, 0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Fatura (Todas Despesas)</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem lines="none" className="ion-margin-bottom">
          <IonLabel>Total de Despesas:</IonLabel>
          <IonText className="total-fatura">
            R$ {total.toFixed(2)}
          </IonText>
        </IonItem>

        <IonGrid className="fatura-grid">
          <IonRow className="fatura-header-row ion-text-center">
            <IonCol>Nome</IonCol>
            <IonCol>Data</IonCol>
            <IonCol>Parcela</IonCol>
            <IonCol>Valor</IonCol>
          </IonRow>

          {despesas.map((d, index) => {
            const nome = d.cartao || d.categoria.nome;
            const dataFormatada = new Date(d.data).toLocaleDateString('pt-BR');

            const textoParcela =
              d.parcelas > 1
                ? calcularParcelaAtual(d.data, d.parcelas)
                : '-';

            const valorParcela =
              d.parcelas > 1 ? d.valor / d.parcelas : d.valor;

            return (
              <IonRow key={index} className="fatura-item-row ion-text-center">
                <IonCol>{nome}</IonCol>
                <IonCol>{dataFormatada}</IonCol>
                <IonCol>{textoParcela}</IonCol>
                <IonCol>R$ {valorParcela.toFixed(2)}</IonCol>
              </IonRow>
            );
          })}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default FaturaPage;
