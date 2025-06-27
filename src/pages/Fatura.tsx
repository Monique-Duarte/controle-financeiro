import React, { useState } from 'react';
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
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonLoading,
} from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import '../styles/Fatura.css';

import { useFinanceStorage } from '../hook/useFinanceStorage';
import { useExportador } from '../hook/useExportador';
import { useParcelasMensais } from '../hook/useParcelasMensais';
import { FaturaExportada } from '../types/tipos';
import type { DespesaTipo } from '../types/tipos';


const FaturaPage: React.FC = () => {
  const { allDespesas, loading, error } = useFinanceStorage();

  const [mesAnoSelecionado, setMesAnoSelecionado] = useState<string>(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
  });

  const [linhaAberta, setLinhaAberta] = useState<number | null>(null);
  const despesasFiltradas = useParcelasMensais(
    allDespesas.filter((d: DespesaTipo) => d.tipoPagamento === 'credito'),
    mesAnoSelecionado
  );

  const total = despesasFiltradas.reduce((acc, d) => {
    const valorParcela = d.parcelas > 1 ? d.valor / d.parcelas : d.valor;
    return acc + valorParcela;
  }, 0);

  const dadosParaExportar: FaturaExportada[] = despesasFiltradas.map((d) => {
    const nome = d.cartao || 'Não Cadastrado';
    const data = new Date(d.dataParcela).toLocaleDateString('pt-BR');
    const parcela =
      d.parcelas > 1 ? `${d.numeroParcela}/${d.parcelas}` : '-';
    const valor = `R$ ${(
      d.parcelas > 1 ? d.valor / d.parcelas : d.valor
    ).toFixed(2)}`;
    const descricao = d.descricao || d.categoria?.nome || '';
    return { nome, data, parcela, valor, descricao };
  });

  const { exportarPDF, exportarExcel } = useExportador(
    dadosParaExportar,
    `fatura-${mesAnoSelecionado}`
  );

  if (loading) {
    return (
      <IonContent className="ion-padding ion-text-center">
        <IonLoading isOpen={loading} message={'Carregando fatura...'} spinner="crescent" />
      </IonContent>
    );
  }

  if (error) {
    return (
      <IonContent className="ion-padding ion-text-center">
        <IonText color="danger">
          <p>Erro ao carregar fatura: {error}</p>
        </IonText>
      </IonContent>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Fatura</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem lines="none" className="ion-margin-bottom">
          <IonLabel position="stacked">Filtrar por mês:</IonLabel>
          <IonInput
            type="month"
            value={mesAnoSelecionado}
            onIonChange={(e) => {
              if (e.detail.value) {
                setMesAnoSelecionado(e.detail.value);
              }
            }}
          />
        </IonItem>

        <IonRow className="ion-justify-content-start ion-margin-top">
          <IonCol size="auto">
            <IonButton fill="outline" size="small" onClick={exportarPDF}>
              <IonIcon icon={downloadOutline} slot="start" />
              PDF
            </IonButton>
          </IonCol>
          <IonCol size="auto">
            <IonButton fill="outline" size="small" onClick={exportarExcel}>
              <IonIcon icon={downloadOutline} slot="start" />
              Excel
            </IonButton>
          </IonCol>
        </IonRow>

        <IonItem lines="none" className="ion-margin-bottom">
          <IonLabel>Total de Despesas:</IonLabel>
          <IonText className="total-fatura">
            R$ {total.toFixed(2)}
          </IonText>
        </IonItem>

        <IonGrid className="fatura-grid">
          <IonRow className="fatura-header-row ion-text-center">
            <IonCol>Cartão</IonCol>
            <IonCol>Data</IonCol>
            <IonCol>Parcela</IonCol>
            <IonCol>Valor</IonCol>
          </IonRow>

          {despesasFiltradas.length === 0 ? (
            <IonRow>
              <IonCol size="12" className="ion-text-center ion-padding">
                Nenhuma despesa de cartão de crédito encontrada para o mês selecionado.
              </IonCol>
            </IonRow>
          ) : (
            despesasFiltradas.map((d, index) => {
              const nome = d.cartao || 'Não Informado';
              const dataFormatada = new Date(d.dataParcela).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
              });

              const textoParcela =
                d.parcelas > 1 ? `${d.numeroParcela}/${d.parcelas}` : '-';

              const valorParcela =
                d.parcelas > 1 ? d.valor / d.parcelas : d.valor;

              return (
                <React.Fragment key={index}>
                  <IonRow
                    className="fatura-item-row ion-text-center clicavel"
                    onClick={() =>
                      setLinhaAberta(linhaAberta === index ? null : index)
                    }
                  >
                    <IonCol>{nome}</IonCol>
                    <IonCol>{dataFormatada}</IonCol>
                    <IonCol>{textoParcela}</IonCol>
                    <IonCol>R$ {valorParcela.toFixed(2)}</IonCol>
                  </IonRow>
                  {linhaAberta === index && d.descricao && (
                    <IonRow className="observacao-row">
                      <IonCol size="12">
                        <div className="observacao-texto">{d.descricao}</div>
                      </IonCol>
                    </IonRow>
                  )}
                </React.Fragment>
              );
            })
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default FaturaPage;