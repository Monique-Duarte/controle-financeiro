import React, { useEffect, useState } from 'react';
import { Cartao } from '../../types/tipos';
import '../../styles/Fatura.css';
import '../../styles/btn.css';

interface Props {
  onSalvar: (cartao: Omit<Cartao, 'id'>) => void;
  cartao?: Cartao;
  onCancel: () => void;
}

const ConfiguracaoCartaoForm: React.FC<Props> = ({ onSalvar, cartao, onCancel }) => {
  const [nomeCartao, setNomeCartao] = useState('');
  const [fechamentoFatura, setFechamentoFatura] = useState<number | undefined>(undefined);
  const [pagamentoFatura, setPagamentoFatura] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (cartao) {
      setNomeCartao(cartao.nomeCartao);
      setFechamentoFatura(cartao.fechamentoFatura);
      setPagamentoFatura(cartao.pagamentoFatura);
    }
  }, [cartao]);

  const handleSubmit = () => {
    if (!nomeCartao || !fechamentoFatura || !pagamentoFatura) return;
    onSalvar({ nomeCartao, fechamentoFatura, pagamentoFatura });
  };

  return (
    <div className="config-cartao-container ion-padding">
      <div className="input-group">
        <label className="label-stacked">Nome do Cartão</label>
        <input
          type="text"
          className="input-text"
          value={nomeCartao}
          onChange={(e) => setNomeCartao(e.target.value)}
          placeholder="Ex: Nubank, Visa, etc."
        />
      </div>

      <div className="grid-row">
        <div className="grid-col">
          <label className="label-stacked">Dia de Fechamento</label>
          <input
            type="number"
            className="input-text"
            value={fechamentoFatura}
            onChange={(e) => setFechamentoFatura(Number(e.target.value))}
            min={1}
            max={31}
            placeholder="Ex: 25"
          />
        </div>
        <div className="grid-col">
          <label className="label-stacked">Dia de Pagamento</label>
          <input
            type="number"
            className="input-text"
            value={pagamentoFatura}
            onChange={(e) => setPagamentoFatura(Number(e.target.value))}
            min={1}
            max={31}
            placeholder="Ex: 5"
          />
        </div>
      </div>

      <div className="botoes-acoes">
        <button className="botao-acao btn-salvar" onClick={handleSubmit}>✓ SALVAR</button>
        <button className="botao-acao btn-cancelar" onClick={onCancel}>✖ CANCELAR</button>
      </div>
    </div>
  );
};

export default ConfiguracaoCartaoForm;
