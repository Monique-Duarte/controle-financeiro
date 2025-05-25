import React, { useState, useEffect } from 'react';
import {
  IonButton, IonCol, IonDatetime, IonDatetimeButton, IonInput,
  IonItem, IonLabel, IonModal, IonRow, IonToggle, IonGrid
} from '@ionic/react';

interface ReceitaFormProps {
  onSalvar: (receita: Omit<ReceitaTipo, 'id'>) => void;
  receita?: ReceitaTipo;
  onCancel?: () => void;
}

export interface ReceitaTipo {
  id?: string;
  data: string;
  descricao: string;
  valor: number;
  fixa: boolean;
}

const ReceitaForm: React.FC<ReceitaFormProps> = ({ onSalvar, receita, onCancel }) => {
  const [data, setData] = useState(() => new Date().toISOString());
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number>(0);
  const [fixa, setFixa] = useState(false);

  useEffect(() => {
    if (receita) {
      setData(new Date(receita.data).toISOString());
      setDescricao(receita.descricao);
      setValor(receita.valor);
      setFixa(receita.fixa);
    }
  }, [receita]);

  const handleSubmit = () => {
    if (!descricao || valor <= 0) return;
    onSalvar({
      data: data.substring(0, 10),
      descricao,
      valor,
      fixa
    });
  };

  return (
    <IonGrid className="ion-padding">
      <IonRow>
        <IonCol size="6">
          <IonLabel htmlFor="dataReceita">Data:</IonLabel>
          <IonDatetimeButton datetime="dataReceita" />
          <IonModal keepContentsMounted>
            <IonDatetime
              id="dataReceita"
              presentation="date"
              value={data}
              onIonChange={e => setData(e.detail.value!)}
              locale="pt-BR"
            />
          </IonModal>
        </IonCol>
        <IonCol size="6">
          <IonItem>
            <IonLabel>Fixa?</IonLabel>
            <IonToggle checked={fixa} onIonChange={e => setFixa(e.detail.checked)} />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12">
          <IonInput
            label="Descrição"
            labelPlacement="floating"
            value={descricao}
            onIonChange={e => setDescricao(e.detail.value!)}
            fill="outline"
            aria-label="Descrição da receita"
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12">
          <IonInput
            label="Valor (R$)"
            type="number"
            labelPlacement="floating"
            value={valor}
            onIonChange={e => setValor(Number(e.detail.value))}
            fill="outline"
            min={0}
            step="0.01"
            aria-label="Valor da receita"
          />
        </IonCol>
      </IonRow>
      <IonButton expand="block" onClick={handleSubmit} className="ion-margin-top">
        {receita ? 'Salvar Alterações' : 'Adicionar Receita'}
      </IonButton>
      {onCancel && (
        <IonButton expand="block" fill="clear" onClick={onCancel} color="medium">
          Cancelar
        </IonButton>
      )}
    </IonGrid>
  );
};

export default ReceitaForm;