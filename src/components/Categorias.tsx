import React, { useState } from 'react';
import CategoriaItem from './CategoriaItem';
import { categoriasPredefinidas, Categoria } from './categories';
import './Categorias.css';

interface CategoriasProps {
  categorias?: Categoria[];
  valoresPorCategoriaInicial?: Record<string, number[]>;
  onValoresChange?: (valores: Record<string, number[]>) => void;
  modoEdicao?: boolean;
}

const Categorias: React.FC<CategoriasProps> = ({
  categorias = categoriasPredefinidas,
  valoresPorCategoriaInicial = {},
  onValoresChange,
  modoEdicao = true,
}) => {
  const [valoresPorCategoria, setValoresPorCategoria] = useState<Record<string, number[]>>(valoresPorCategoriaInicial);

  const adicionarValor = (categoriaId: string, valor: number) => {
    setValoresPorCategoria(prev => {
      const novosValores = prev[categoriaId] ? [...prev[categoriaId], valor] : [valor];
      const atualizados = { ...prev, [categoriaId]: novosValores };
      onValoresChange && onValoresChange(atualizados);
      return atualizados;
    });
  };

  return (
    <div className="categorias-container">
      {categorias.map(cat => (
        <CategoriaItem
          key={cat.id}
          categoria={cat}
          valores={valoresPorCategoria[cat.id] || []}
          onAdicionarValor={modoEdicao ? (valor) => adicionarValor(cat.id, valor) : undefined}
          modoEdicao={modoEdicao}
        />
      ))}
    </div>
  );
};

export default Categorias;
