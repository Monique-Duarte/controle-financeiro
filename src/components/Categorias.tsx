import React, { useState } from 'react';
import CategoriaItem from './CategoriaItem';
import { categoriasPredefinidas, Categoria } from './categoriasPredefinidas';
import './Categorias.css';
import { adicionarDespesa } from '../firebaseFunctions';

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

  // Ajuste para salvar a despesa no Firestore com data como objeto Date
  const adicionarValor = async (categoriaId: string, valor: number) => {
    const dataAtual = new Date(); // data como objeto Date (não string)

    try {
      // Salvar despesa no Firestore
      await adicionarDespesa({
        categoria: categoriaId,
        valor,
        data: dataAtual,
        observacao: '', // você pode adicionar campos adicionais ou passar como parâmetro
        parcela: 1,
        fixo: false,
      });

      // Atualizar estado local para refletir a mudança na UI
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
