import React, { useState, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonButton,
  IonContent, IonList, IonItem, IonLabel, IonIcon, IonToast
} from '@ionic/react';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';
import {
  doc, addDoc, updateDoc, deleteDoc, getDocs
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { receitasRef } from '../../services/firebaseRefs';
import ReceitaForm, { ReceitaTipo } from './ReceitaForm';

const ReceitaPage: React.FC = () => {
  const [receitas, setReceitas] = useState<ReceitaTipo[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [receitaEditando, setReceitaEditando] = useState<ReceitaTipo | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);

  useEffect(() => {
    const carregarReceitas = async () => {
      const snapshot = await getDocs(receitasRef);
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<ReceitaTipo, 'id'>)
      }));
      setReceitas(lista);
    };
    carregarReceitas();
  }, []);

  const salvarReceita = async (novaReceita: Omit<ReceitaTipo, 'id'>) => {
    try {
      if (receitaEditando?.id) {
        const docRef = doc(db, 'financas', 'global', 'receitas', receitaEditando.id);
        await updateDoc(docRef, novaReceita);
        setReceitas(prev =>
          prev.map(r => (r.id === receitaEditando.id ? { id: receitaEditando.id, ...novaReceita } : r))
        );
        setToastMsg('Receita atualizada!');
      } else {
        const docRef = await addDoc(receitasRef, novaReceita);
        setReceitas(prev => [{ id: docRef.id, ...novaReceita }, ...prev]);
        setToastMsg('Receita adicionada!');
      }
    } catch {
      setToastMsg('Erro ao salvar receita');
    } finally {
      setMostrarFormulario(false);
      setReceitaEditando(null);
    }
  };

  const editarReceita = (r: ReceitaTipo) => {
    setReceitaEditando(r);
    setMostrarFormulario(true);
  };

  const removerReceita = async (id?: string) => {
    if (!id) return;
    await deleteDoc(doc(db, 'financas', 'global', 'receitas', id));
    setReceitas(prev => prev.filter(r => r.id !== id));
    setToastMsg('Receita excluída!');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Receitas</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                if (!mostrarFormulario) setReceitaEditando(null);
                setMostrarFormulario(!mostrarFormulario);
              }}
            >
              {mostrarFormulario ? 'Fechar' : 'Adicionar'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {mostrarFormulario && (
          <ReceitaForm
            onSalvar={salvarReceita}
            receita={receitaEditando || undefined}
            onCancel={() => setMostrarFormulario(false)}
          />
        )}

        <IonList>
          {receitas.length === 0 && (
            <div className="ion-padding ion-text-center">Nenhuma receita cadastrada.</div>
          )}

          {receitas.map(r => (
            <IonItem key={r.id} button onClick={() => setItemExpandido(itemExpandido === r.id ? null : r.id)}>
              <IonLabel className="ion-text-wrap">
                <strong>{r.descricao}</strong><br />
                {new Date(r.data).toLocaleDateString('pt-BR')}<br />
                {r.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                {itemExpandido === r.id && (
                  <div style={{ marginTop: 8 }}>
                    <div>Fixa: {r.fixa ? 'Sim' : 'Não'}</div>
                    <IonButton fill="outline" size="small" onClick={e => { e.stopPropagation(); editarReceita(r); }}>
                      Editar
                    </IonButton>
                    <IonButton fill="outline" color="danger" size="small" onClick={e => { e.stopPropagation(); removerReceita(r.id); }}>
                      Excluir
                    </IonButton>
                  </div>
                )}
              </IonLabel>
              <IonIcon icon={itemExpandido === r.id ? chevronUpOutline : chevronDownOutline} slot="end" />
            </IonItem>
          ))}
        </IonList>

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2000} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
};

export default ReceitaPage;