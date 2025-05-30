import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonButton,
  IonContent, IonList, IonItem, IonLabel, IonIcon, IonToast
} from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import { useConfirmacao } from '../hook/useConfirmacao';
import AlertaConfirmacao from '../components/AlertaConfirmacao';
import ConfiguracaoCartaoForm from '../components/Formularios/ConfigCartaoForm';
import { useCartaoStore }  from '../hook/useCartaoStore';
import { Cartao } from '../types/tipos';
import '../styles/btn.css';

const CartaoPage: React.FC = () => {
  const { cartoes, carregarCartoes, adicionarCartao, atualizarCartao, removerCartao } = useCartaoStore();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cartaoEditando, setCartaoEditando] = useState<Cartao | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);

  const { isOpen, titulo, mensagem, setIsOpen, confirmar, solicitarConfirmacao } = useConfirmacao();

  useEffect(() => {
    carregarCartoes();
  }, []);

  const salvarCartao = async (dados: Omit<Cartao, 'id'>) => {
    if (cartaoEditando?.id) {
      await atualizarCartao({ id: cartaoEditando.id, ...dados });
      setToastMsg('Cartão atualizado!');
    } else {
      await adicionarCartao(dados);
      setToastMsg('Cartão adicionado!');
    }

    setMostrarFormulario(false);
    setCartaoEditando(null);
    setItemExpandido(null);
  };

  const editarCartao = (c: Cartao) => {
    setCartaoEditando(c);
    setMostrarFormulario(true);
  };

  const remover = async (id: string) => {
    await removerCartao(id);
    setToastMsg('Cartão removido!');
    if (itemExpandido === id) setItemExpandido(null);
  };

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
        {mostrarFormulario && (
          <ConfiguracaoCartaoForm
            onSalvar={salvarCartao}
            cartao={cartaoEditando || undefined}
            onCancel={() => {
              setMostrarFormulario(false);
              setCartaoEditando(null);
            }}
          />
        )}

        <IonList>
          {cartoes.length === 0 && (
            <div className="ion-padding ion-text-center">Nenhum cartão cadastrado.</div>
          )}
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