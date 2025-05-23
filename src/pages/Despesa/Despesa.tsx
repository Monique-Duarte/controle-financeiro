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
  IonIcon,
  IonToolbar,
  IonMenuButton,
} from '@ionic/react';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { categoriasPredefinidas } from '../../components/categoriasPredefinidas';
import { db } from '../../services/firebase';
import { DespesaTipo } from '../../types/tipos';
import DespesasForm from './DespesasForm';

const despesasRef = collection(db, 'financas', 'global', 'despesas');

const DespesasPage: React.FC = () => {
  const [despesas, setDespesas] = useState<DespesaTipo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [itemExpandido, setItemExpandido] = useState<number | null>(null);
  const [despesaEditando, setDespesaEditando] = useState<DespesaTipo | null>(null);

  const carregarDespesas = async () => {
    setCarregando(true);
    try {
      const q = query(despesasRef, orderBy('data', 'desc'));
      const snapshot = await getDocs(q);
      const lista: DespesaTipo[] = snapshot.docs.map(docSnap => {
        const dados = docSnap.data();
        return {
          id: docSnap.id,
          data: dados.data,
          descricao: dados.descricao,
          valor: Number(dados.valor) || 0,
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

  const removerDespesa = async (id: string) => {
    try {
      const docRef = doc(db, 'financas', 'global', 'despesas', id);
      await deleteDoc(docRef);
      await carregarDespesas();
      setToastMsg('Despesa excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
      setToastMsg('Erro ao excluir despesa.');
    }
  };

  useEffect(() => {
    carregarDespesas();
  }, []);

  return (
    <IonPage id="main">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Despesas</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => {
              setMostrarFormulario(!mostrarFormulario);
              if (!mostrarFormulario) {
                setDespesaEditando(null);
              }
            }}>
              {mostrarFormulario ? 'Fechar' : 'Adicionar'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {mostrarFormulario && (
          <DespesasForm
            despesaEditando={despesaEditando}
            onSalvo={() => {
              carregarDespesas();
              setMostrarFormulario(false);
              setDespesaEditando(null);
            }}
          />
        )}

        <IonList>
          {despesas.map((item, index) => (
            <IonItem
              key={item.id}
              button
              onClick={() => setItemExpandido(itemExpandido === index ? null : index)}
              detail={false}
            >
              <IonLabel>
                <h3>{item.descricao}</h3>
                <p>{new Date(item.data).toLocaleDateString('pt-BR')} - R$ {item.valor.toFixed(2)}</p>
                <p>{item.categoria.nome}</p>
                {itemExpandido === index && (
                  <>
                    <p>Parcelas: {item.parcelas}</p>
                    <p>Fixa: {item.fixa ? 'Sim' : 'Não'}</p>
                    <IonButtons>
                      <IonButton onClick={e => {
                        e.stopPropagation();
                        setDespesaEditando(item);
                        setMostrarFormulario(true);
                      }}>
                        Editar
                      </IonButton>
                      <IonButton color="danger" onClick={e => {
                        e.stopPropagation();
                        if (item.id) removerDespesa(item.id);
                      }}>
                        Excluir
                      </IonButton>
                    </IonButtons>
                  </>
                )}
              </IonLabel>
              <IonIcon
                slot="end"
                icon={itemExpandido === index ? chevronUpOutline : chevronDownOutline}
              />
            </IonItem>
          ))}
        </IonList>

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={2000}
          onDidDismiss={() => setToastMsg('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default DespesasPage;