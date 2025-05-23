import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from '@ionic/react';
import { addDoc, doc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { categoriasPredefinidas } from '../../components/categoriasPredefinidas';
import { DespesaTipo } from '../../types/tipos';

interface Props {
  despesaEditando: DespesaTipo | null;
  onSalvo: () => void;
}

const despesasRef = collection(doc(db, 'financas', 'global'), 'despesas');

const DespesasForm: React.FC<Props> = ({ despesaEditando, onSalvo }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [parcelas, setParcelas] = useState(1);
  const [fixa, setFixa] = useState(false);
  const [categoria, setCategoria] = useState(categoriasPredefinidas[0].id);

  useEffect(() => {
    if (despesaEditando) {
      setDescricao(despesaEditando.descricao);
      setValor(String(despesaEditando.valor));
      setData(despesaEditando.data);
      setParcelas(despesaEditando.parcelas);
      setFixa(despesaEditando.fixa);
      setCategoria(despesaEditando.categoria.id);
    } else {
      setDescricao('');
      setValor('');
      setData(new Date().toISOString().split('T')[0]);
      setParcelas(1);
      setFixa(false);
      setCategoria(categoriasPredefinidas[0].id);
    }
  }, [despesaEditando]);

  const salvarDespesa = async () => {
    const dados = {
      descricao,
      valor: parseFloat(valor),
      data,
      parcelas,
      fixa,
      categoria,
    };

    try {
      if (despesaEditando?.id) {
        await updateDoc(doc(despesasRef, despesaEditando.id), dados);
      } else {
        await addDoc(despesasRef, dados);
      }
      onSalvo();
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <IonItem>
        <IonLabel position="stacked">Descrição</IonLabel>
        <IonInput value={descricao} onIonChange={(e) => setDescricao(e.detail.value!)} required />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Valor (R$)</IonLabel>
        <IonInput
          type="number"
          inputmode="decimal"
          value={valor}
          onIonChange={(e) => setValor(e.detail.value!)}
          required
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Data</IonLabel>
        <IonInput
          type="date"
          value={data}
          onIonChange={(e) => setData(e.detail.value!)}
          required
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Categoria</IonLabel>
        <IonSelect value={categoria} onIonChange={(e) => setCategoria(e.detail.value)}>
          {categoriasPredefinidas.map((cat) => (
            <IonSelectOption key={cat.id} value={cat.id}>
              {cat.nome}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Parcelas</IonLabel>
        <IonInput
          type="number"
          value={parcelas}
          onIonChange={(e) => setParcelas(parseInt(e.detail.value!, 10))}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Fixa?</IonLabel>
        <IonToggle checked={fixa} onIonChange={(e) => setFixa(e.detail.checked)} />
      </IonItem>
      <IonButton expand="block" onClick={salvarDespesa} className="ion-margin-top">
        {despesaEditando ? 'Salvar Alterações' : 'Lançar Despesa'}
      </IonButton>
    </form>
  );
};

export default DespesasForm;
