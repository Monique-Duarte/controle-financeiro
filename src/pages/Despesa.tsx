import React, { useEffect, useState } from 'react';
import {
  IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage,
  IonTitle, IonToast, IonIcon, IonToolbar, IonMenuButton, IonAlert, IonLoading
} from '@ionic/react';
import { chevronDownOutline, chevronUpOutline, createOutline, trashOutline } from 'ionicons/icons';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { categoriasPredefinidas } from '../components/categoriasPredefinidas';
import { DespesaTipo, CategoriaUI } from '../types/tipos';
import DespesasForm from '../components/Formularios/DespesasForm';
import '../styles/btn.css';
import '../App.css';
import { getDespesasRealtime, deleteDespesa } from '../services/despesa-service';

const DespesasPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [despesas, setDespesas] = useState<DespesaTipo[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [itemExpandido, setItemExpandido] = useState<number | null>(null);
  const [despesaEditando, setDespesaEditando] = useState<DespesaTipo | null>(null);
  const [alertaExcluirId, setAlertaExcluirId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);

      if (user) {
        setCarregandoDados(true);
        const unsubscribeDespesas = getDespesasRealtime(user.uid, (data) => {
          const despesasComCategoriasCompletas: DespesaTipo[] = data.map(d => {
            const categoriaFirestoreDoFirebase = d.categoria as any;

            const categoriaCompletaComIcone: CategoriaUI = categoriasPredefinidas.find(
              c => c.id === categoriaFirestoreDoFirebase?.id
            ) || categoriasPredefinidas[0];

            return {
              ...d,
              categoria: categoriaCompletaComIcone,
              descricao: d.descricao || '',
              parcelas: d.parcelas || 1,
              fixo: d.fixo || false,
              tipoPagamento: d.tipoPagamento || 'debito',
            } as DespesaTipo;
          }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

          setDespesas(despesasComCategoriasCompletas);
          setCarregandoDados(false);
        });

        return () => unsubscribeDespesas();
      } else {
        setDespesas([]);
        setCarregandoDados(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const removerDespesa = async (id: string) => {
    if (!currentUser) {
      setToastMsg('Você precisa estar logado para excluir despesas.');
      return;
    }
    setCarregandoDados(true);
    try {
      await deleteDespesa(currentUser.uid, id);
      setToastMsg('Despesa excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
      setToastMsg('Erro ao excluir despesa.');
    } finally {
      setCarregandoDados(false);
      if (itemExpandido !== null && despesas[itemExpandido]?.id === id) {
        setItemExpandido(null);
      }
      setAlertaExcluirId(null);
    }
  };

  const handleDespesaSalva = () => {
    setMostrarFormulario(false);
    setDespesaEditando(null);
    setToastMsg('Despesa salva com sucesso!');
  };

  return (
    <IonPage id="main">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className='titulo'>Despesas</IonTitle>
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
        <IonLoading isOpen={loadingAuth || carregandoDados} message={'Carregando despesas...'} duration={0} spinner="crescent" />

        {mostrarFormulario && currentUser && (
          <DespesasForm
            userId={currentUser.uid}
            despesaEditando={despesaEditando}
            onSalvo={handleDespesaSalva}
          />
        )}

        {!currentUser ? (
          <IonItem>
            <IonLabel color="medium" className="ion-text-center">
              <p>Por favor, faça login para ver suas despesas.</p>
            </IonLabel>
          </IonItem>
        ) : despesas.length === 0 && !carregandoDados ? (
          <IonItem>
            <IonLabel color="medium" className="ion-text-center">
              <p>Nenhuma despesa encontrada.</p>
              <p>Clique em "Adicionar" para registrar sua primeira despesa!</p>
            </IonLabel>
          </IonItem>
        ) : (
          <IonList>
            {despesas.map((item, index) => (
              <IonItem
                key={item.id}
                button
                onClick={() => setItemExpandido(itemExpandido === index ? null : index)}
                detail={false}
                className="despesa-item"
              >
                <IonLabel className="despesa-label">
                  <div className="linha"><strong>{item.descricao}</strong></div>
                  <div className="linha linha-infos">
                    <div>
                      {new Date(item.data).toLocaleDateString('pt-BR')} - R$ {item.valor.toFixed(2)}
                      <div className="despesa-categoria">
                        {item.categoria.icone}
                        <span className='span-icon'>{item.categoria.nome}</span>
                      </div>
                    </div>

                    <div className="acoes">
                      <IonIcon
                        icon={createOutline}
                        className="icone-edit"
                        onClick={e => {
                          e.stopPropagation();
                          setDespesaEditando(item);
                          setMostrarFormulario(true);
                        }}
                      />
                      <IonIcon
                        icon={trashOutline}
                        className="icone-delete"
                        onClick={e => {
                          e.stopPropagation();
                          if (item.id) setAlertaExcluirId(item.id);
                        }}
                      />
                    </div>
                  </div>

                  {itemExpandido === index && (
                    <div className="despesa-detalhes">
                      <div className="linha">
                        <strong>Cartão:</strong> {item.cartao && item.cartao.trim() !== '' ? item.cartao : 'Nenhum cartão selecionado'}
                      </div>
                      <div className="linha"><strong>Parcelas:</strong> {item.parcelas}</div>
                      <div className="linha"><strong>fixo:</strong> {item.fixo ? 'Sim' : 'Não'}</div>
                    </div>
                  )}

                </IonLabel>
                <IonIcon
                  slot="end"
                  icon={itemExpandido === index ? chevronUpOutline : chevronDownOutline}
                />
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
          message="Tem certeza que deseja excluir esta despesa?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => setAlertaExcluirId(null),
            },
            {
              text: 'Excluir',
              role: 'destructive',
              handler: () => removerDespesa(alertaExcluirId!)
            },
          ]}
          onDidDismiss={() => setAlertaExcluirId(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default DespesasPage;