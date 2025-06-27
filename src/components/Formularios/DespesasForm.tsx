import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle
} from '@ionic/react';
import { categoriasPredefinidas } from '../../components/categoriasPredefinidas';
import { DespesaTipo, CategoriaUI, DespesaFirestoreToSave } from '../../types/tipos';
import { useCartaoStore } from '../../hook/useCartaoStore';
import { addDespesa, updateDespesa } from '../../services/despesa-service';

interface Props {
  userId: string;
  despesaEditando: DespesaTipo | null;
  onSalvo: () => void;
}

const DespesasForm: React.FC<Props> = ({ userId, despesaEditando, onSalvo }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [parcelas, setParcelas] = useState(1);
  const [fixo, setfixo] = useState(false);
  const [categoriaId, setCategoriaId] = useState(categoriasPredefinidas[0].id);
  const [tipoPagamento, setTipoPagamento] = useState<'debito' | 'credito'>('debito');
  const [cartao, setCartao] = useState('');

  const { cartoes, carregarCartoes } = useCartaoStore();

  useEffect(() => {
    carregarCartoes();
  }, []);

  useEffect(() => {
    if (despesaEditando) {
      setDescricao(despesaEditando.descricao);
      setValor(String(despesaEditando.valor));
      setData(despesaEditando.data);
      setParcelas(despesaEditando.parcelas);
      setfixo(despesaEditando.fixo);
      setCategoriaId(despesaEditando.categoria.id);
      setTipoPagamento(despesaEditando.tipoPagamento || 'debito');
      setCartao(despesaEditando.cartao || '');
    } else {
      setDescricao('');
      setValor('');
      setData(new Date().toISOString().split('T')[0]);
      setParcelas(1);
      setfixo(false);
      setCategoriaId(categoriasPredefinidas[0].id);
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

    const categoriaSelecionada: CategoriaUI | undefined = categoriasPredefinidas.find(
      (c) => c.id === categoriaId
    );
    if (!categoriaSelecionada) return;

    const { icone: _icone, ...categoriaParaFirestore } = categoriaSelecionada;

    const dados: DespesaFirestoreToSave = {
      descricao: descricao.trim(),
      valor: valorConvertido,
      data,
      parcelas,
      fixo,
      categoria: categoriaParaFirestore,
      tipoPagamento,
      ...(tipoPagamento === 'credito' && cartao ? { cartao } : {}),
      parcelaAtual: despesaEditando?.parcelaAtual || 1,
    };

    try {
      if (despesaEditando?.id) {
        await updateDespesa(userId, despesaEditando.id, dados);
      } else {
        await addDespesa(userId, dados);
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
          onIonChange={(e) => setDescricao(e.detail.value || '')}
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
        <IonSelect value={categoriaId} onIonChange={(e) => setCategoriaId(e.detail.value)}>
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
          min={1}
        />
      </IonItem>

      <IonItem>
        <IonLabel>fixo?</IonLabel>
        <IonToggle checked={fixo} onIonChange={(e) => setfixo(e.detail.checked)} />
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
            placeholder="Escolha um cartão"
          >
            <IonSelectOption value="">Nenhum cartão</IonSelectOption>
            {cartoes.map((c) => (
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