import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonLabel,
  IonItem,
  IonDatetime,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';

import './Despesas.css';
import { categoriasPredefinidas, Categoria } from '../../components/categoriasPredefinidas';

type DespesaTipo = {
  data: string;
  descricao: string;
  valor: string;
  parcelas: number;
  fixa: boolean;
  categoria: Categoria;
};

const Despesa: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [parcelas, setParcelas] = useState(1);
  const [fixa, setFixa] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | undefined>(undefined);
  const [despesas, setDespesas] = useState<DespesaTipo[]>([]);
  const [itemExpandido, setItemExpandido] = useState<number | null>(null);

  const adicionarDespesa = () => {
    if (data && descricao && valor && parcelas > 0 && categoriaSelecionada) {
      const novaDespesa: DespesaTipo = {
        data,
        descricao,
        valor,
        parcelas,
        fixa,
        categoria: categoriaSelecionada,
      };
      setDespesas([...despesas, novaDespesa]);

      // Resetar campos
      setData('');
      setDescricao('');
      setValor('');
      setParcelas(1);
      setFixa(false);
      setCategoriaSelecionada(undefined);
      setMostrarFormulario(false);
    }
  };

  const formatarDataAbreviada = (dataISO: string) => {
    if (!dataISO) return '';
    const d = new Date(dataISO);
    return d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
  };

  const toggleExpandir = (index: number) => {
    setItemExpandido(itemExpandido === index ? null : index);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Desperas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          Lançar nova Despesa
        </IonButton>

        {mostrarFormulario && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Nova Despesa</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Data</IonLabel>
                <IonDatetime
                  presentation="date"
                  value={data}
                  onIonChange={(e) => setData(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Tipo</IonLabel>
                <IonSelect
                  placeholder="Selecione uma categoria"
                  value={categoriaSelecionada?.id}
                  onIonChange={(e) => {
                    const cat = categoriasPredefinidas.find(c => c.id === e.detail.value);
                    setCategoriaSelecionada(cat);
                  }}
                >
                  {categoriasPredefinidas.map((cat) => (
                    <IonSelectOption key={cat.id} value={cat.id}>
                      {cat.nome}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Observação</IonLabel>
                <IonInput
                  value={descricao}
                  placeholder="Ex: Conta de luz, Uber, Compra no mercado"
                  onIonInput={(e) => setDescricao(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Valor</IonLabel>
                <IonInput
                  type="number"
                  value={valor}
                  placeholder="Ex: 1500"
                  onIonInput={(e) => setValor(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Parcelas</IonLabel>
                <IonInput
                  type="number"
                  min={1}
                  value={parcelas.toString()}
                  onIonInput={(e) => {
                    const val = parseInt(e.detail.value!, 10);
                    if (!isNaN(val) && val > 0) setParcelas(val);
                  }}
                />
              </IonItem>

              <IonItem lines="none">
                <IonLabel>Despesa Fixa?</IonLabel>
                <IonCheckbox
                  checked={fixa}
                  onIonChange={(e) => setFixa(e.detail.checked)}
                  slot="end"
                />
              </IonItem>

              <IonButton expand="block" onClick={adicionarDespesa} className="ion-margin-top">
                Adicionar Despesa
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Despesas Lançadas</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {despesas.length === 0 ? (
              <IonText color="medium">Nenhuma despesa lançada.</IonText>
            ) : (
              <>
                {despesas.map((d, i) => (
                  <IonCard key={i} onClick={() => toggleExpandir(i)} style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                    <IonGrid className='tabela-despesas'>
                      <IonRow className='tabela-linha'>
                        <IonCol size="3"><strong>Data</strong></IonCol>
                        <IonCol size="2"><strong>Tipo</strong></IonCol>
                        <IonCol size="3"><strong>Parcela</strong></IonCol>
                        <IonCol size="4"><strong>Valor</strong></IonCol>
                      </IonRow>
                      <IonRow className='tabela-linha'>
                        <IonCol size="3">{formatarDataAbreviada(d.data)}</IonCol>
                        <IonCol size="2">{d.categoria.icone}</IonCol>
                        <IonCol size="2">{d.parcelas}</IonCol>
                        <IonCol className='tabela-valor' size="5">R$ {(parseFloat(d.valor) / d.parcelas).toFixed(2)}</IonCol>
                      </IonRow>
                      {itemExpandido === i && (
                        <IonRow>
                          <IonCol size="12" style={{ paddingLeft: '0.5rem', paddingTop: '0.5rem', fontStyle: 'italic', color: '#666' }}>
                            {d.descricao ? `Observação: ${d.descricao}` : <em>Sem observação</em>}
                          </IonCol>
                        </IonRow>
                      )}
                    </IonGrid>
                  </IonCard>
                ))}
              </>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Despesa;
