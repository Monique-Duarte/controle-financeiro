import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonButton,
  IonContent, IonList, IonItem, IonLabel, IonToast,
  IonIcon, IonAlert, IonLoading
} from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import ReceitaForm from '../components/Formularios/ReceitaForm';
import { ReceitaTipo } from '../types/tipos';
import '../styles/btn.css';
import '../App.css';
import { getReceitasRealtime, deleteReceita, addReceita, updateReceita } from '../services/receita-service';

const ReceitaPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [receitas, setReceitas] = useState<ReceitaTipo[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [receitaEditando, setReceitaEditando] = useState<ReceitaTipo | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);
  const [alertaExcluirId, setAlertaExcluirId] = useState<string | null>(null);
  const [carregandoDados, setCarregandoDados] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);

      if (user) {
        setCarregandoDados(true);
        const unsubscribeReceitas = getReceitasRealtime(user.uid, (data) => {
          const receitasMapeadas: ReceitaTipo[] = data.map(r => ({
            id: r.id,
            data: r.data,
            descricao: r.descricao,
            valor: r.valor,
            fixo: r.fixo || false
          }));
          const receitasOrdenadas = receitasMapeadas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
          setReceitas(receitasOrdenadas);
          setCarregandoDados(false);
        });

        return () => unsubscribeReceitas();
      } else {
        setReceitas([]);
        setCarregandoDados(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);


  const salvarReceita = async (novaReceita: Omit<ReceitaTipo, 'id'>) => {
    if (!currentUser) {
      setToastMsg('Você precisa estar logado para salvar receitas.');
      return;
    }
    setCarregandoDados(true);
    try {
      if (receitaEditando?.id) {
        await updateReceita(currentUser.uid, receitaEditando.id, novaReceita);
        setToastMsg('Receita atualizada!');
      } else {
        await addReceita(currentUser.uid, novaReceita);
        setToastMsg('Receita adicionada!');
      }
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      setToastMsg('Erro ao salvar receita');
    } finally {
      setCarregandoDados(false);
      setMostrarFormulario(false);
      setReceitaEditando(null);
      setItemExpandido(null);
    }
  };

  const editarReceita = (r: ReceitaTipo) => {
    setReceitaEditando(r);
    setMostrarFormulario(true);
  };

  const pedirConfirmacaoExcluir = (id?: string) => {
    if (!id) return;
    setAlertaExcluirId(id);
  };

  const removerReceita = async (id?: string) => {
    if (!currentUser) {
      setToastMsg('Você precisa estar logado para excluir receitas.');
      return;
    }
    if (!id) return;
    setCarregandoDados(true);
    try {
      await deleteReceita(currentUser.uid, id);
      setToastMsg('Receita excluída!');
    } catch (err) {
      console.error('Erro ao excluir:', err);
      setToastMsg('Erro ao excluir receita.');
    } finally {
      setCarregandoDados(false);
      if (itemExpandido === id) setItemExpandido(null);
      setAlertaExcluirId(null);
    }
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
        <IonLoading isOpen={loadingAuth || carregandoDados} message={'Carregando receitas...'} duration={0} spinner="crescent" />

        {mostrarFormulario && currentUser && (
          <ReceitaForm
            userId={currentUser.uid}
            onSalvar={salvarReceita}
            receita={receitaEditando || undefined}
            onCancel={() => {
              setMostrarFormulario(false);
              setReceitaEditando(null);
            }}
          />
        )}

        {!currentUser ? (
          <IonItem>
            <IonLabel color="medium" className="ion-text-center">
              <p>Por favor, faça login para ver suas receitas.</p>
            </IonLabel>
          </IonItem>
        ) : receitas.length === 0 && !carregandoDados ? (
          <IonItem>
            <IonLabel color="medium" className="ion-text-center">
              <p>Nenhuma receita cadastrada.</p>
              <p>Clique em "Nova Receita" para registrar sua primeira receita!</p>
            </IonLabel>
          </IonItem>
        ) : (
          <IonList>
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
                      <div className="linha">fixo: {r.fixo ? 'Sim' : 'Não'}</div>
                    </div>
                  )}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

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