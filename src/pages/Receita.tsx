import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonButton,
  IonContent, IonList, IonItem, IonLabel, IonToast,
  IonIcon, IonAlert
} from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import { doc, addDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { getCollectionRef } from '../services/crud-service';
import ReceitaForm from '../components/Formularios/ReceitaForm';
import { ReceitaTipo } from '../types/tipos';
import '../styles/btn.css';
import '../App.css';

const ReceitaPage: React.FC = () => {
  const [receitas, setReceitas] = useState<ReceitaTipo[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [receitaEditando, setReceitaEditando] = useState<ReceitaTipo | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);

  // Estado para controlar qual receita está pedindo confirmação para exclusão
  const [alertaExcluirId, setAlertaExcluirId] = useState<string | null>(null);

  const receitasRef = getCollectionRef('receitas');

  const carregarReceitas = async () => {
    try {
      const snapshot = await getDocs(receitasRef);
      const lista = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          descricao: data.descricao,
          data: data.data,
          valor: Number(data.valor) || 0,
          fixa: data.fixa || false,
        } as ReceitaTipo;
      });
      setReceitas(lista);
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
      setToastMsg('Erro ao carregar receitas');
    }
  };

  useEffect(() => {
    carregarReceitas();
  }, []);

  const salvarReceita = async (novaReceita: Omit<ReceitaTipo, 'id'>) => {
    if (!novaReceita.descricao || !novaReceita.valor) {
      setToastMsg('Descrição e valor são obrigatórios.');
      return;
    }

    const receitaCorrigida = {
      ...novaReceita,
      valor: Number(novaReceita.valor) || 0,
    };

    try {
      if (receitaEditando?.id) {
        const docRef = doc(receitasRef, receitaEditando.id);
        await updateDoc(docRef, receitaCorrigida);
        setToastMsg('Receita atualizada!');
      } else {
        await addDoc(receitasRef, receitaCorrigida);
        setToastMsg('Receita adicionada!');
      }
      await carregarReceitas();
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      setToastMsg('Erro ao salvar receita');
    } finally {
      setMostrarFormulario(false);
      setReceitaEditando(null);
      setItemExpandido(null);
    }
  };

  const editarReceita = (r: ReceitaTipo) => {
    setReceitaEditando(r);
    setMostrarFormulario(true);
  };

  // Agora só marca para excluir, abre alerta
  const pedirConfirmacaoExcluir = (id?: string) => {
    if (!id) return;
    setAlertaExcluirId(id);
  };

  // Executa a exclusão confirmada
  const removerReceita = async (id?: string) => {
    if (!id) return;
    try {
      await deleteDoc(doc(receitasRef, id));
      await carregarReceitas();
      setToastMsg('Receita excluída!');
    } catch (err) {
      console.error('Erro ao excluir:', err);
      setToastMsg('Erro ao excluir receita.');
    }
    if (itemExpandido === id) setItemExpandido(null);
    setAlertaExcluirId(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className='titulo'>Receitas</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                if (!mostrarFormulario) setReceitaEditando(null);
                setMostrarFormulario(!mostrarFormulario);
              }}
            >
              {mostrarFormulario ? 'Fechar' : 'Nova Receita'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {mostrarFormulario && (
          <ReceitaForm
            onSalvar={salvarReceita}
            receita={receitaEditando || undefined}
            onCancel={() => {
              setMostrarFormulario(false);
              setReceitaEditando(null);
            }}
          />
        )}

        <IonList>
          {receitas.length === 0 && (
            <div className="ion-padding ion-text-center">Nenhuma receita cadastrada.</div>
          )}
          {receitas.map(r => (
            <IonItem
              key={r.id}
              button
              onClick={() => setItemExpandido(itemExpandido === r.id ? null : r.id)}
            >
              <IonLabel className="receita-label">
                <div className="linha"><strong>{r.descricao}</strong></div>
                <div className="linha linha-infos">
                  <div>
                    {new Date(r.data).toLocaleDateString('pt-BR')}<br />
                    {r.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <div className="acoes">
                    <IonIcon
                      icon={createOutline}
                      className="icone-edit"
                      onClick={e => {
                        e.stopPropagation();
                        editarReceita(r);
                      }}
                    />
                    <IonIcon
                      icon={trashOutline}
                      className="icone-delete"
                      onClick={e => {
                        e.stopPropagation();
                        pedirConfirmacaoExcluir(r.id);
                      }}
                    />
                  </div>
                </div>
                {itemExpandido === r.id && (
                  <div className="receita-detalhes">
                    <div className="linha">Fixa: {r.fixa ? 'Sim' : 'Não'}</div>
                  </div>
                )}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={2000}
          onDidDismiss={() => setToastMsg('')}
        />

        <IonAlert
          isOpen={alertaExcluirId !== null}
          header="Confirmar exclusão"
          message="Tem certeza que deseja excluir esta receita?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => setAlertaExcluirId(null),
            },
            {
              text: 'Excluir',
              role: 'destructive',
              handler: () => removerReceita(alertaExcluirId!),
            },
          ]}
          onDidDismiss={() => setAlertaExcluirId(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ReceitaPage;