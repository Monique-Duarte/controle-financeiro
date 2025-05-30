import React, { useEffect, useState } from 'react';
import {
  IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage,
  IonTitle, IonToast, IonIcon, IonToolbar, IonMenuButton, IonAlert
} from '@ionic/react';
import {
  chevronDownOutline, chevronUpOutline, createOutline, trashOutline
} from 'ionicons/icons';
import { query, orderBy, getDocs } from 'firebase/firestore';
import { categoriasPredefinidas } from '../components/categoriasPredefinidas';
import { DespesaTipo } from '../types/tipos';
import DespesasForm from '../components/Formularios/DespesasForm';
import '../styles/btn.css';
import '../App.css';
import { deleteDespesa } from '../services/financeService';
import { getCollectionRef } from '../services/crud-service';

const DespesasPage: React.FC = () => {
  const [despesas, setDespesas] = useState<DespesaTipo[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [itemExpandido, setItemExpandido] = useState<number | null>(null);
  const [despesaEditando, setDespesaEditando] = useState<DespesaTipo | null>(null);
  const [alertaExcluirId, setAlertaExcluirId] = useState<string | null>(null);

  const carregarDespesas = async () => {
    setCarregando(true);
    try {
      const q = query(getCollectionRef('despesas'), orderBy('data', 'desc'));
      const snapshot = await getDocs(q);
      const lista: DespesaTipo[] = snapshot.docs.map(docSnap => {
        const dados = docSnap.data();

        const categoriaSalva = dados.categoria;
        const categoriaCompleta = categoriasPredefinidas.find(
          c => c.id === categoriaSalva?.id
        ) || categoriasPredefinidas[0];

        return {
          id: docSnap.id,
          data: dados.data,
          descricao: dados.descricao,
          valor: Number(dados.valor) || 0,
          parcelas: dados.parcelas,
          fixa: dados.fixa,
          categoria: categoriaCompleta,
          tipoPagamento: dados.tipoPagamento || 'crédito',
          cartao: dados.cartao || '',
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
      await deleteDespesa(id);
      await carregarDespesas();
      setToastMsg('Despesa excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
      setToastMsg('Erro ao excluir despesa.');
    }
    if (itemExpandido !== null && despesas[itemExpandido]?.id === id) {
      setItemExpandido(null);
    }
    setAlertaExcluirId(null);
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
                    <div className="linha"><strong>Fixa:</strong> {item.fixa ? 'Sim' : 'Não'}</div>
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