import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonToggle,
  IonGrid
} from '@ionic/react';

import { ReceitaTipo } from '../../types/tipos';

interface ReceitaFormProps {
  onSalvar: (receita: Omit<ReceitaTipo, 'id'>) => void;
  receita?: ReceitaTipo;
  onCancel?: () => void;
}

const ReceitaForm: React.FC<ReceitaFormProps> = ({ onSalvar, receita, onCancel }) => {
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [fixa, setFixa] = useState(false);

  useEffect(() => {
    if (receita) {
      setData(receita.data);
      setDescricao(receita.descricao);
      setValor(receita.valor.toString().replace('.', ','));
      setFixa(receita.fixa);
    } else {
      const hoje = new Date().toISOString().split('T')[0];
      setData(hoje);
    }
  }, [receita]);

  const handleSubmit = () => {
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (!descricao.trim() || isNaN(valorNumerico) || valorNumerico <= 0) return;

    // Capitaliza a primeira letra ao salvar
    const descricaoCapitalizada = descricao.trim().charAt(0).toUpperCase() + descricao.trim().slice(1);

    onSalvar({
      data,
      descricao: descricaoCapitalizada,
      valor: valorNumerico,
      fixa,
    });
  };

  const isFormValido =
    descricao.trim() !== '' &&
    valor.trim() !== '' &&
    !isNaN(parseFloat(valor.replace(',', '.'))) &&
    parseFloat(valor.replace(',', '.')) > 0;

  return (
    <IonGrid className="ion-padding">
      <IonItem>
        <IonLabel position="stacked">Data</IonLabel>
        <IonInput
          type="date"
          value={data}
          onIonChange={e => setData(e.detail.value!)}
          required
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Descrição</IonLabel>
        <IonInput
          value={descricao}
          onIonChange={e => {
            const val = e.detail.value || '';
            // Capitaliza a primeira letra enquanto digita
            const valCapitalized = val.charAt(0).toUpperCase() + val.slice(1);
            setDescricao(valCapitalized);
          }}
          required
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Valor (R$)</IonLabel>
        <IonInput
          type="text"
          inputMode="decimal"
          value={valor}
          onIonChange={e => setValor(e.detail.value!)}
          required
          placeholder="Ex: 100,50"
        />
      </IonItem>
      <IonItem lines="none">
        <IonLabel>Fixo?</IonLabel>
        <IonToggle checked={fixa} onIonChange={e => setFixa(e.detail.checked)} />
      </IonItem>

      <IonButton
        expand="block"
        onClick={handleSubmit}
        className="ion-margin-top"
        disabled={!isFormValido}
      >
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