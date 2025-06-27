import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonButton,
  IonContent, IonList, IonItem, IonLabel, IonIcon, IonToast, IonLoading
} from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import { useConfirmacao } from '../hook/useConfirmacao';
import AlertaConfirmacao from '../components/AlertaConfirmacao';
import ConfiguracaoCartaoForm from '../components/Formularios/ConfigCartaoForm';
import { useCartaoStore } from '../hook/useCartaoStore';
import { Cartao } from '../types/tipos';
import '../styles/btn.css';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';

const CartaoPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const { cartoes, loading, error, adicionarCartao, atualizarCartao, removerCartao } = useCartaoStore();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cartaoEditando, setCartaoEditando] = useState<Cartao | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);

  const { isOpen, titulo, mensagem, setIsOpen, confirmar, solicitarConfirmacao } = useConfirmacao();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribeAuth();
  }, []);

  const salvarCartao = async (dados: Omit<Cartao, 'id'>) => {
    if (!currentUser) {
      setToastMsg('Você precisa estar logado para salvar cartões.');
      return;
    }
    try {
      if (cartaoEditando?.id) {
        await atualizarCartao({ id: cartaoEditando.id, ...dados });
        setToastMsg('Cartão atualizado!');
      } else {
        await adicionarCartao(dados);
        setToastMsg('Cartão adicionado!');
      }
    } catch (e: any) {
      setToastMsg(`Erro ao salvar cartão: ${e.message}`);
      console.error(e);
    } finally {
      setMostrarFormulario(false);
      setCartaoEditando(null);
      setItemExpandido(null);
    }
  };

  const editarCartao = (c: Cartao) => {
    setCartaoEditando(c);
    setMostrarFormulario(true);
  };

  const remover = async (id: string) => {
    if (!currentUser) {
      setToastMsg('Você precisa estar logado para remover cartões.');
      return;
    }
    try {
      await removerCartao(id);
      setToastMsg('Cartão removido!');
    } catch (e: any) {
      setToastMsg(`Erro ao remover cartão: ${e.message}`);
      console.error(e);
    } finally {
      if (itemExpandido === id) setItemExpandido(null);
    }
  };

  useEffect(() => {
    if (error) {
      setToastMsg(error);
    }
  }, [error]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Cartões</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                if (!currentUser) {
                  setToastMsg('Faça login para adicionar cartões.');
                  return;
                }
                if (!mostrarFormulario) setCartaoEditando(null);
                setMostrarFormulario(!mostrarFormulario);
              }}
            >
              {mostrarFormulario ? 'Fechar' : 'Adicionar Cartão'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={loadingAuth || loading} message={'Carregando cartões...'} duration={0} spinner="crescent" />

        {mostrarFormulario && currentUser && (
          <ConfiguracaoCartaoForm
            userId={currentUser.uid}
            onSalvar={salvarCartao}
            cartao={cartaoEditando || undefined}
            onCancel={() => {
              setMostrarFormulario(false);
              setCartaoEditando(null);
            }}
          />
        )}

        {!currentUser ? (
          <IonItem>
            <IonLabel color="medium" className="ion-text-center">
              <p>Por favor, faça login para ver seus cartões.</p>
            </IonLabel>
          </IonItem>
        ) : cartoes.length === 0 && !loading ? (
          <IonItem>
            <IonLabel color="medium" className="ion-text-center">
              <p>Nenhum cartão cadastrado.</p>
              <p>Clique em "Adicionar Cartão" para registrar seu primeiro!</p>
            </IonLabel>
          </IonItem>
        ) : (
          <IonList>
            {cartoes.map(c => (
              <IonItem
                key={c.id}
                button
                onClick={() => setItemExpandido(itemExpandido === c.id ? null : c.id)}
              >
                <IonLabel className="receita-label">
                  <div className="linha"><strong>{c.nomeCartao}</strong></div>
                  <div className="linha linha-infos">
                    <div>
                      Fechamento: Dia {c.fechamentoFatura}<br />
                      Pagamento: Dia {c.pagamentoFatura}
                    </div>
                    <div className="acoes">
                      <IonIcon className='icone-edit'
                        icon={createOutline}
                        onClick={e => {
                          e.stopPropagation();
                          editarCartao(c);
                        }}
                      />
                      <IonIcon className='icone-delete'
                        icon={trashOutline}
                        onClick={e => {
                          e.stopPropagation();
                          solicitarConfirmacao({
                            mensagem: 'Deseja excluir este cartão?',
                            titulo: 'Confirmar Exclusão',
                            onConfirmar: () => remover(c.id)
                          });
                        }}
                      />
                    </div>
                  </div>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}

        <AlertaConfirmacao
          isOpen={isOpen}
          titulo={titulo}
          mensagem={mensagem}
          onCancelar={() => setIsOpen(false)}
          onConfirmar={confirmar}
        />

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

export default CartaoPage;