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
  IonToggle,
  IonText,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';

type ReceitaTipo = {
  data: string;
  fonte: string;
  valor: string;
  fixa: boolean;
};

const Receita: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [data, setData] = useState('');
  const [fonte, setFonte] = useState('');
  const [valor, setValor] = useState('');
  const [fixo, setFixo] = useState(false);
  const [receitas, setReceitas] = useState<ReceitaTipo[]>([]);

  const adicionarReceita = () => {
    if (data && fonte && valor) {
      const novaReceita: ReceitaTipo = { data, fonte, valor, fixa: fixo };
      setReceitas([...receitas, novaReceita]);
      setData('');
      setFonte('');
      setValor('');
      setFixo(false);
      setMostrarFormulario(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Receita</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          Lançar nova Receita
        </IonButton>

        {mostrarFormulario && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Nova Receita</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Data</IonLabel>
                <IonDatetime
                  presentation="date"
                  value={data}
                  onIonChange={(e) => setData(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Fonte</IonLabel>
                <IonInput
                  value={fonte}
                  placeholder="Ex: Salário, Freelance, Extra"
                  onIonInput={(e) => setFonte(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Valor</IonLabel>
                <IonInput
                  type="number"
                  value={valor}
                  placeholder="Ex: 2500"
                  onIonInput={(e) => setValor(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel>Receita Fixa?</IonLabel>
                <IonToggle checked={fixo} onIonChange={e => setFixo(e.detail.checked)} />
              </IonItem>

              <IonButton expand="block" onClick={adicionarReceita} className="ion-margin-top">
                Adicionar Receita
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Receitas Lançadas</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {receitas.length === 0 ? (
              <IonText color="medium">Nenhuma receita lançada.</IonText>
            ) : (
              <IonGrid>
                <IonRow>
                  <IonCol><strong>Data</strong></IonCol>
                  <IonCol><strong>Fonte</strong></IonCol>
                  <IonCol><strong>Valor</strong></IonCol>
                </IonRow>
                {receitas.map((r, i) => (
                  <IonRow key={i}>
                    <IonCol>{new Date(r.data).toLocaleDateString()}</IonCol>
                    <IonCol>{r.fonte}</IonCol>
                    <IonCol>R$ {parseFloat(r.valor).toFixed(2)}</IonCol>
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

export default Receita;
