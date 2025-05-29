import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from '@ionic/react';
import { addDoc, doc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { categoriasPredefinidas } from '../../components/categoriasPredefinidas';
import { DespesaTipo, ConfiguracaoFatura } from '../../types/tipos';
import { useFinanceStore } from '../../store/useFinanceStore';

interface Props {
  despesaEditando: DespesaTipo | null;
  onSalvo: () => void;
}

const despesasRef = collection(doc(db, 'financas', 'global'), 'despesas');

const DespesasForm: React.FC<Props> = ({ despesaEditando, onSalvo }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [parcelas, setParcelas] = useState(1);
  const [fixa, setFixa] = useState(false);
  const [categoria, setCategoria] = useState(categoriasPredefinidas[0].id);

  const [tipoPagamento, setTipoPagamento] = useState<'debito' | 'credito'>('debito');
  const [cartao, setCartao] = useState('');

  const { configuracoesFatura } = useFinanceStore();

  useEffect(() => {
    if (despesaEditando) {
      setDescricao(despesaEditando.descricao);
      setValor(String(despesaEditando.valor));
      setData(despesaEditando.data);
      setParcelas(despesaEditando.parcelas);
      setFixa(despesaEditando.fixa);
      setCategoria(despesaEditando.categoria.id);
      setTipoPagamento(despesaEditando.tipoPagamento || 'debito');
      setCartao(despesaEditando.cartao || '');
    } else {
      setDescricao('');
      setValor('');
      setData(new Date().toISOString().split('T')[0]);
      setParcelas(1);
      setFixa(false);
      setCategoria(categoriasPredefinidas[0].id);
      setTipoPagamento('debito');
      setCartao('');
    }
  }, [despesaEditando]);

  const limparValor = (valorBruto: string): number => {
    if (!valorBruto) return 0;
    const valorLimpo = valorBruto.replace(/\./g, '').replace(',', '.');
    const numero = parseFloat(valorLimpo);
    return isNaN(numero) ? 0 : numero;
  };

  const salvarDespesa = async () => {
    const valorConvertido = limparValor(valor);
    if (!descricao.trim() || valorConvertido <= 0) return;

    const descricaoCapitalizada = descricao.trim().charAt(0).toUpperCase() + descricao.trim().slice(1);

    const dados = {
      descricao: descricaoCapitalizada,
      valor: valorConvertido,
      data,
      parcelas,
      fixa,
      categoria,
      tipoPagamento,
      ...(tipoPagamento === 'credito' && cartao ? { cartao } : {}),
    };

    try {
      if (despesaEditando?.id) {
        await updateDoc(doc(despesasRef, despesaEditando.id), dados);
      } else {
        await addDoc(despesasRef, dados);
      }
      onSalvo();
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <IonItem>
        <IonLabel position="stacked">Descrição</IonLabel>
        <IonInput
          value={descricao}
          onIonChange={(e) => {
            const val = e.detail.value || '';
            const valCapitalized = val.charAt(0).toUpperCase() + val.slice(1);
            setDescricao(valCapitalized);
          }}
          required
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Valor (R$)</IonLabel>
        <IonInput
          type="text"
          inputMode="decimal"
          value={valor}
          onIonChange={(e) => setValor(e.detail.value || '')}
          required
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Data</IonLabel>
        <IonInput
          type="date"
          value={data}
          onIonChange={(e) => setData(e.detail.value || '')}
          required
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Categoria</IonLabel>
        <IonSelect value={categoria} onIonChange={(e) => setCategoria(e.detail.value)}>
          {categoriasPredefinidas.map((cat) => (
            <IonSelectOption key={cat.id} value={cat.id}>
              {cat.nome}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Parcelas</IonLabel>
        <IonInput
          type="number"
          value={parcelas}
          onIonChange={(e) => setParcelas(parseInt(e.detail.value || '1', 10))}
        />
      </IonItem>

      <IonItem>
        <IonLabel>Fixa?</IonLabel>
        <IonToggle checked={fixa} onIonChange={(e) => setFixa(e.detail.checked)} />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Tipo de Pagamento</IonLabel>
        <IonSelect
          value={tipoPagamento}
          onIonChange={(e) => {
            const valor = e.detail.value;
            setTipoPagamento(valor);
            if (valor === 'debito') setCartao('');
          }}
        >
          <IonSelectOption value="debito">Débito</IonSelectOption>
          <IonSelectOption value="credito">Crédito</IonSelectOption>
        </IonSelect>
      </IonItem>

      {tipoPagamento === 'credito' && (
        <IonItem>
          <IonLabel position="stacked">Cartão</IonLabel>
          <IonSelect
            value={cartao}
            onIonChange={(e) => setCartao(e.detail.value)}
            placeholder="Nenhum cartão"
          >
            <IonSelectOption value="">Nenhum cartão</IonSelectOption>
            {configuracoesFatura.map((c: ConfiguracaoFatura) => (
              <IonSelectOption key={c.id} value={c.nomeCartao}>
                {c.nomeCartao}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      )}

      <IonButton expand="block" onClick={salvarDespesa} className="ion-margin-top">
        {despesaEditando ? 'Salvar Alterações' : 'Lançar Despesa'}
      </IonButton>
    </form>
  );
};

export default DespesasForm;