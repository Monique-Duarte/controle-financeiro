import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonLabel,
  IonItem,
  IonDatetime,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonCheckbox,
} from '@ionic/react';



type DespesaTipo = {
  data: string;
  descricao: string;
  valor: string;
  parcelas: number;
  fixa: boolean; // ✅ Novo campo
};

const Despesa: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [parcelas, setParcelas] = useState(1);
  const [fixa, setFixa] = useState(false); // ✅ Novo estado
  const [despesas, setDespesas] = useState<DespesaTipo[]>([]);

  const adicionarDespesa = () => {
    if (data && descricao && valor && parcelas > 0) {
      const novaDespesa: DespesaTipo = { data, descricao, valor, parcelas, fixa };
      setDespesas([...despesas, novaDespesa]);

      // Resetar campos
      setData('');
      setDescricao('');
      setValor('');
      setParcelas(1);
      setFixa(false);
      setMostrarFormulario(false);
    }
  };

  const formatarDataAbreviada = (dataISO: string) => {
    if (!dataISO) return '';
    const d = new Date(dataISO);
    return d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Despesas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          Lançar nova Despesa
        </IonButton>

        {mostrarFormulario && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Nova Despesa</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Data</IonLabel>
                <IonDatetime
                  presentation="date"
                  value={data}
                  onIonChange={e => setData(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Descrição</IonLabel>
                <IonInput
                  value={descricao}
                  placeholder="Ex: Aluguel, Supermercado, Transporte"
                  onIonInput={e => setDescricao(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Valor</IonLabel>
                <IonInput
                  type="number"
                  value={valor}
                  placeholder="Ex: 1500"
                  onIonInput={e => setValor(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Parcelas</IonLabel>
                <IonInput
                  type="number"
                  min={1}
                  value={parcelas.toString()}
                  onIonInput={e => {
                    const val = parseInt(e.detail.value!, 10);
                    if (!isNaN(val) && val > 0) setParcelas(val);
                  }}
                />
              </IonItem>

              <IonItem lines="none">
                <IonLabel>Despesa Fixa?</IonLabel>
                <IonCheckbox
                  checked={fixa}
                  onIonChange={e => setFixa(e.detail.checked)}
                  slot="end"
                />
              </IonItem>

              <IonButton expand="block" onClick={adicionarDespesa} className="ion-margin-top">
                Adicionar Despesa
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Despesas Lançadas</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {despesas.length === 0 ? (
              <IonText color="medium">Nenhuma despesa lançada.</IonText>
            ) : (
              <IonGrid>
                <IonRow>
                  <IonCol size="auto"><strong>Data</strong></IonCol>
                  <IonCol><strong>Descrição</strong></IonCol>
                  <IonCol size="auto"><strong>Parcelas</strong></IonCol>
                  <IonCol size="auto"><strong>Valor</strong></IonCol>
                </IonRow>
                {despesas.map((d, i) => (
                  <IonRow key={i}>
                    <IonCol size="auto">{formatarDataAbreviada(d.data)}</IonCol>
                    <IonCol>{d.descricao}</IonCol>
                    <IonCol>{d.parcelas}</IonCol>
                    <IonCol size="auto">R$ {(parseFloat(d.valor) / d.parcelas).toFixed(2)}</IonCol>
                  </IonRow>
                ))}
              </IonGrid>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Despesa;
