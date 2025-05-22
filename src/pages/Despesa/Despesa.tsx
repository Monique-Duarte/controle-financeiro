import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
  IonInput,
  IonDatetimeButton,
  IonModal,
  IonText,
  IonIcon,
} from '@ionic/react';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { categoriasPredefinidas } from '../../components/categoriasPredefinidas';
import { db } from '../../firebase';

const despesasRef = collection(db, 'despesas');

export interface DespesaTipo {
  id?: string;
  data: string;
  descricao: string;
  valor: string;
  parcelas: number;
  fixa: boolean;
  categoria: {
    id: string;
    nome: string;
    cor: string;
    icone: string;
  };
}

const DespesasPage: React.FC = () => {
  const [despesas, setDespesas] = useState<DespesaTipo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [parcelas, setParcelas] = useState(1);
  const [fixa, setFixa] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<any>();
  const [itemExpandido, setItemExpandido] = useState<number | null>(null);
  const [despesaEditando, setDespesaEditando] = useState<DespesaTipo | null>(null);

  const carregarDespesas = async () => {
    setCarregando(true);
    try {
      const q = query(despesasRef, orderBy('data', 'desc'));
      const snapshot = await getDocs(q);
      const lista: DespesaTipo[] = snapshot.docs.map(doc => {
        const dados = doc.data();
        return {
          id: doc.id,
          data: dados.data,
          descricao: dados.descricao,
          valor: dados.valor,
          parcelas: dados.parcelas,
          fixa: dados.fixa,
          categoria: categoriasPredefinidas.find(c => c.id === dados.categoria) || categoriasPredefinidas[0],
        };
      });
      setDespesas(lista);
    } catch (error) {
      console.error("Erro ao carregar despesas:", error);
      setToastMsg("Erro ao carregar despesas.");
    }
    setCarregando(false);
  };

  const salvarDespesa = async () => {
    const valorNumero = parseFloat(valor.replace(',', '.'));
    if (!data || !categoriaSelecionada || !descricao || isNaN(valorNumero) || parcelas <= 0) {
      setToastMsg('Preencha todos os campos corretamente.');
      return;
    }

    const dados = {
      data: new Date(data).toISOString().substring(0, 10),
      descricao,
      valor: valorNumero.toFixed(2),
      parcelas,
      fixa,
      categoria: categoriaSelecionada.id,
    };

    try {
      if (despesaEditando) {
        await updateDoc(doc(despesasRef, despesaEditando.id!), dados);
        setToastMsg('Despesa atualizada!');
      } else {
        await addDoc(despesasRef, dados);
        setToastMsg('Despesa adicionada!');
      }
      carregarDespesas();
      setData('');
      setDescricao('');
      setValor('');
      setParcelas(1);
      setFixa(false);
      setCategoriaSelecionada(undefined);
      setMostrarFormulario(false);
      setDespesaEditando(null);
    } catch (error) {
      console.error(error);
      setToastMsg('Erro ao salvar despesa.');
    }
  };

  const removerDespesa = async (id: string) => {
    try {
      await deleteDoc(doc(despesasRef, id));
      setToastMsg('Despesa excluída com sucesso!');
      carregarDespesas();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      setToastMsg('Erro ao excluir despesa.');
    }
  };

  useEffect(() => {
    carregarDespesas();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Despesas</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => {
              setMostrarFormulario(!mostrarFormulario);
              if (!mostrarFormulario) setDespesaEditando(null);
            }}>
              {mostrarFormulario ? 'Fechar' : 'Lançar Nova'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {mostrarFormulario && (
          <div className="ion-padding">
            <IonItem>
              <IonLabel>Data</IonLabel>
              <IonDatetimeButton datetime="dataDespesa" />
              <IonModal keepContentsMounted>
                <IonDatetime id="dataDespesa" value={data} onIonChange={e => setData(e.detail.value!)}></IonDatetime>
              </IonModal>
            </IonItem>
            <IonInput label="Descrição" value={descricao} onIonChange={e => setDescricao(e.detail.value!)} />
            <IonInput label="Valor" type="number" value={valor} onIonChange={e => setValor(e.detail.value!)} />
            <IonInput label="Parcelas" type="number" value={parcelas} onIonChange={e => setParcelas(parseInt(e.detail.value!))} />
            <IonItem>
              <IonLabel>Fixa?</IonLabel>
              <IonToggle checked={fixa} onIonChange={e => setFixa(e.detail.checked)} />
            </IonItem>
            <IonList>
              {categoriasPredefinidas.map((c) => (
                <IonItem key={c.id} button onClick={() => setCategoriaSelecionada(c)} color={categoriaSelecionada?.id === c.id ? 'light' : ''}>
                  <IonLabel>{c.nome}</IonLabel>
                </IonItem>
              ))}
            </IonList>
            <IonButton expand="block" onClick={salvarDespesa} className="ion-margin-top">
              {despesaEditando ? 'Salvar Alterações' : 'Adicionar Despesa'}
            </IonButton>
          </div>
        )}

        <IonList>
          {despesas.map((d, i) => (
            <IonItem key={d.id} button onClick={() => setItemExpandido(itemExpandido === i ? null : i)}>
              <IonLabel>
                <IonText color="medium">{d.data}</IonText><br />
                <strong>{d.descricao}</strong> - R$ {d.valor}
              </IonLabel>
              <IonIcon icon={itemExpandido === i ? chevronUpOutline : chevronDownOutline} slot="end" />
              {itemExpandido === i && (
                <div className="ion-padding">
                  <p>Categoria: {d.categoria.nome}</p>
                  <p>Parcelas: {d.parcelas}</p>
                  <p>Fixa: {d.fixa ? 'Sim' : 'Não'}</p>
                  <IonButton color="medium" size="small" onClick={(e) => {
                    e.stopPropagation();
                    setDespesaEditando(d);
                    setMostrarFormulario(true);
                    setData(d.data);
                    setDescricao(d.descricao);
                    setValor(d.valor);
                    setParcelas(d.parcelas);
                    setFixa(d.fixa);
                    setCategoriaSelecionada(d.categoria);
                  }}>Editar</IonButton>
                  <IonButton color="danger" size="small" onClick={(e) => {
                    e.stopPropagation();
                    removerDespesa(d.id!);
                  }}>Excluir</IonButton>
                </div>
              )}
            </IonItem>
          ))}
        </IonList>

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2500} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
};

export default DespesasPage;