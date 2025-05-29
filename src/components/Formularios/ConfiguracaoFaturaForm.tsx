import React, { useState, useEffect } from 'react';
import { useFaturaStore } from '../../store/useFaturaStore';
import '../../styles/Fatura.css';
import '../../styles/btn.css';
import { CartaoConfiguracao } from '../../types/tipos';

interface CartaoConfigLocal {
  id: string;
  nomeCartao: string;
  fechamentoFatura: number | null;
  pagamentoFatura: number | null;
  editando: boolean;
}

export const ConfiguracaoFaturaForm: React.FC = () => {
  const configuracoesFatura = useFaturaStore((state) => state.configuracoesFatura);
  const salvarConfiguracoesFatura = useFaturaStore((state) => state.salvarConfiguracoesFatura);

  const [cartoes, setCartoes] = useState<CartaoConfigLocal[]>([]);

  // Sincroniza o estado local com o global quando a store atualizar
  useEffect(() => {
    const inic = configuracoesFatura.map(c => ({ ...c, editando: false }));
    setCartoes(inic);
  }, [configuracoesFatura]);

  const adicionarCartao = () => {
    setCartoes(c => [
      ...c,
      { id: crypto.randomUUID(), nomeCartao: '', fechamentoFatura: null, pagamentoFatura: null, editando: true },
    ]);
  };

  const atualizarCartao = (id: string, campo: keyof Omit<CartaoConfigLocal, 'id' | 'editando'>, valor: any) => {
    setCartoes(cartoesAtuais =>
      cartoesAtuais.map(c =>
        c.id === id ? { ...c, [campo]: valor } : c
      )
    );
  };

  const editarCartao = (id: string) => {
    setCartoes(cartoesAtuais =>
      cartoesAtuais.map(c =>
        c.id === id ? { ...c, editando: true } : c
      )
    );
  };

  const cancelarEdicao = (id: string) => {
    setCartoes(cartoesAtuais => {
      const cartao = cartoesAtuais.find(c => c.id === id);
      if (!cartao) return cartoesAtuais;
      if (
        cartao.nomeCartao.trim() === '' &&
        (cartao.fechamentoFatura === null || cartao.pagamentoFatura === null)
      ) {
        return cartoesAtuais.filter(c => c.id !== id);
      }
      return cartoesAtuais.map(c => c.id === id ? { ...c, editando: false } : c);
    });
  };

  const salvarEdicao = async (id: string) => {
    const cartao = cartoes.find(c => c.id === id);
    if (!cartao) return;

    if (!cartao.nomeCartao.trim()) {
      alert('Informe o nome do cartão');
      return;
    }
    if (
      cartao.fechamentoFatura === null ||
      cartao.fechamentoFatura < 1 || cartao.fechamentoFatura > 31
    ) {
      alert('Informe um dia válido para fechamento da fatura (1-31)');
      return;
    }
    if (
      cartao.pagamentoFatura === null ||
      cartao.pagamentoFatura < 1 || cartao.pagamentoFatura > 31
    ) {
      alert('Informe um dia válido para pagamento da fatura (1-31)');
      return;
    }

    setCartoes(cartoesAtuais =>
      cartoesAtuais.map(c => c.id === id ? { ...c, editando: false } : c)
    );

    try {
      // Cria nova lista para salvar no Firestore, sem o campo "editando"
      const novaLista: CartaoConfiguracao[] = cartoes.map(({ id, nomeCartao, fechamentoFatura, pagamentoFatura }) => ({
        id,
        nomeCartao: nomeCartao.trim(),
        fechamentoFatura: fechamentoFatura!,
        pagamentoFatura: pagamentoFatura!,
      }));
      await salvarConfiguracoesFatura(novaLista);
    } catch (err) {
      alert('Erro ao salvar configuração. Tente novamente.');
      console.error(err);
    }
  };

  const removerCartao = async (id: string) => {
    const confirm = window.confirm('Deseja realmente remover este cartão?');
    if (!confirm) return;

    const novaLista: CartaoConfiguracao[] = cartoes
      .filter(c => c.id !== id)
      .map(({ id, nomeCartao, fechamentoFatura, pagamentoFatura }) => ({
        id,
        nomeCartao,
        fechamentoFatura: fechamentoFatura!,
        pagamentoFatura: pagamentoFatura!,
      }));
    
    setCartoes(cartoes => cartoes.filter(c => c.id !== id));

    try {
      await salvarConfiguracoesFatura(novaLista);
    } catch (err) {
      alert('Erro ao salvar após remoção.');
      console.error(err);
    }
  };

  return (
    <div className="config-fatura-container">
      {cartoes.map((cartao) => (
        <div key={cartao.id} className="cartao-item">
          {cartao.editando ? (
            <>
              <div className="input-group">
                <label className="label-stacked">Nome do Cartão</label>
                <input
                  type="text"
                  className="input-text"
                  value={cartao.nomeCartao}
                  onChange={e => atualizarCartao(cartao.id, 'nomeCartao', e.target.value)}
                  placeholder="Visa, Mastercard..."
                />
              </div>

              <div className="grid-row">
                <div className="grid-col">
                  <label className="label-stacked">Dia fechamento da fatura</label>
                  <input
                    type="number"
                    className="input-text"
                    min={1}
                    max={31}
                    value={cartao.fechamentoFatura ?? ''}
                    onChange={e => atualizarCartao(cartao.id, 'fechamentoFatura', Number(e.target.value))}
                    placeholder="Ex: 25"
                  />
                </div>
                <div className="grid-col">
                  <label className="label-stacked">Dia pagamento da fatura</label>
                  <input
                    type="number"
                    className="input-text"
                    min={1}
                    max={31}
                    value={cartao.pagamentoFatura ?? ''}
                    onChange={e => atualizarCartao(cartao.id, 'pagamentoFatura', Number(e.target.value))}
                    placeholder="Ex: 5"
                  />
                </div>
              </div>

              <div className="botoes-acoes">
                <button className="botao-acao btn-salvar" onClick={() => salvarEdicao(cartao.id)}>✓ SALVAR</button>
                <button className="botao-acao btn-cancelar" onClick={() => cancelarEdicao(cartao.id)}>✖ CANCELAR</button>
              </div>

              <hr className="divisor" />
            </>
          ) : (
            <>
              <div className="cartao-info">
                <h2>{cartao.nomeCartao}</h2>
                <p>Fechamento: {cartao.fechamentoFatura} | Pagamento: {cartao.pagamentoFatura}</p>
              </div>

              <div className="botoes-acoes">
                <button className="botao-acao btn-editar" onClick={() => editarCartao(cartao.id)}>✎ EDITAR</button>
                <button className="botao-acao btn-remover" onClick={() => removerCartao(cartao.id)}>✖ REMOVER</button>
              </div>

              <hr className="divisor" />
            </>
          )}
        </div>
      ))}

      <button className="btn-adicionar" onClick={adicionarCartao}> ADICIONAR CARTÃO</button>
    </div>
  );
};
