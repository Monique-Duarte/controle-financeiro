import React, { useState } from 'react';
import { Categoria } from './categoriasPredefinidas';

interface CategoriaItemProps {
  categoria: Categoria;
  valores: number[];
  onAdicionarValor?: (valor: number) => void;
  modoEdicao?: boolean;
}

const CategoriaItem: React.FC<CategoriaItemProps> = ({
  categoria,
  valores,
  onAdicionarValor,
  modoEdicao = true,
}) => {
  const [inputValor, setInputValor] = useState('');

  const total = valores.reduce((acc, val) => acc + val, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    if (/^\d*\.?\d*$/.test(valor) || valor === '') {
      setInputValor(valor);
    }
  };

  const adicionarValor = () => {
    const valorNum = parseFloat(inputValor.replace(',', '.'));
    if (!isNaN(valorNum) && valorNum > 0) {
      onAdicionarValor && onAdicionarValor(valorNum);
      setInputValor('');
    }
  };

  return (
    <div className="categoria-item" style={{ borderColor: categoria.cor }}>
      <div className="categoria-header" style={{ color: categoria.cor }}>
        <span className="categoria-icone">{categoria.icone}</span>
        <span className="categoria-nome">{categoria.nome}</span>
      </div>

      <div className="categoria-valor-total">
        Total: R$ {total.toFixed(2)}
      </div>

      {modoEdicao && (
        <div className="categoria-input-group">
          <input
            type="text"
            placeholder="Adicionar valor"
            value={inputValor}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                adicionarValor();
              }
            }}
          />
          <button onClick={adicionarValor}>Adicionar</button>
        </div>
      )}
    </div>
  );
};

export default CategoriaItem;
