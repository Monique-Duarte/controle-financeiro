import React, { useState } from 'react';
import CategoriaItem from './CategoriaItem';
import { categoriasPredefinidas } from './categoriasPredefinidas';
import '../App.css';
import { adicionarDespesa } from '../services/firebaseFunctions';
import { getCategoriaPorId } from '../utils/utilsCategorias';
import { CategoriaUI } from '../types/tipos';

interface CategoriasProps {
  categorias?: CategoriaUI[];
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

  const adicionarValor = async (categoriaId: string, valor: number) => {
    const categoria = getCategoriaPorId(categoriaId);
    if (!categoria) {
      alert('Categoria inválida');
      return;
    }

    try {
      await adicionarDespesa({
        categoria,          
        valor: valor.toString(),
        data: new Date(),
        observacao: '',
        parcela: 1,
        fixo: false,
      });

      setValoresPorCategoria(prev => {
        const novosValores = prev[categoriaId] ? [...prev[categoriaId], valor] : [valor];
        const atualizados = { ...prev, [categoriaId]: novosValores };
        if (onValoresChange) onValoresChange(atualizados);
        return atualizados;
      });
    } catch (error) {
      alert('Erro ao lançar despesa. Verifique sua conexão.');
      console.error('Erro ao salvar despesa:', error);
    }
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
