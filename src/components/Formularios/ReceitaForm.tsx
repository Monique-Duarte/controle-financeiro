import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonToggle,
  IonGrid
} from '@ionic/react';

import { ReceitaTipo } from '../../types/tipos';
import { addReceita, updateReceita } from '../../services/receita-service';

interface ReceitaFormProps {
  userId: string;
  onSalvar: (receita: Omit<ReceitaTipo, 'id'>) => void;
  receita?: ReceitaTipo;
  onCancel?: () => void;
}

const ReceitaForm: React.FC<ReceitaFormProps> = ({ userId, onSalvar, receita, onCancel }) => {
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [fixo, setfixo] = useState(false);

  useEffect(() => {
    if (receita) {
      setData(receita.data);
      setDescricao(receita.descricao);
      setValor(receita.valor.toString().replace('.', ','));
      setfixo(receita.fixo);
    } else {
      const hoje = new Date().toISOString().split('T')[0];
      setData(hoje);
      setDescricao('');
      setValor('');
      setfixo(false);
    }
  }, [receita]);

  const handleSubmit = async () => {
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (!descricao.trim() || isNaN(valorNumerico) || valorNumerico <= 0) return;

    const descricaoCapitalizada = descricao.trim().charAt(0).toUpperCase() + descricao.trim().slice(1);

    const receitaParaSalvar: Omit<ReceitaTipo, 'id'> = {
      data,
      descricao: descricaoCapitalizada,
      valor: valorNumerico,
      fixo,
    };

    try {
      if (receita?.id) {
        await updateReceita(userId, receita.id, receitaParaSalvar);
      } else {
        await addReceita(userId, receitaParaSalvar);
      }
      onSalvar(receitaParaSalvar);
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
    }
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
        <IonToggle checked={fixo} onIonChange={e => setfixo(e.detail.checked)} />
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