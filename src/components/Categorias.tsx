import React, { useState } from 'react';
import CategoriaItem from './CategoriaItem';
import { categoriasPredefinidas } from './categoriasPredefinidas';
import '../App.css';
import { useDespesaStore } from '../hook/useDespesaStore';
import { getCategoriaPorId } from '../utils/utilsCategorias';
import { CategoriaUI } from '../types/tipos';
import { IonToast } from '@ionic/react';

interface CategoriasProps {
  categorias?: CategoriaUI[];
  modoEdicao?: boolean;
}

const Categorias: React.FC<CategoriasProps> = ({
  categorias = categoriasPredefinidas,
  modoEdicao = true,
}) => {
  const { adicionarDespesa, valoresPorCategoria, error } = useDespesaStore();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  React.useEffect(() => {
    if (error) {
      setToastMessage(error);
      setShowToast(true);
    }
  }, [error]);

  const adicionarValor = async (categoriaId: string, valor: number) => {
    const categoria = getCategoriaPorId(categoriaId);
    if (!categoria) {
      setToastMessage('Categoria inválida.');
      setShowToast(true);
      return;
    }

    if (valor <= 0) {
      setToastMessage('O valor deve ser maior que zero.');
      setShowToast(true);
      return;
    }

    try {
      const novaDespesa = {
        categoria: categoria,
        valor: valor,
        data: new Date().toISOString().split('T')[0],
        descricao: `Lançamento rápido em ${categoria.nome}`,
        parcelas: 1,
        fixo: false,
        tipoPagamento: 'debito' as 'debito' | 'credito',
      };

      await adicionarDespesa(novaDespesa);
      setToastMessage('Despesa lançada com sucesso!');
      setShowToast(true);

    } catch (error) {
      setToastMessage('Erro ao lançar despesa. Verifique sua conexão.');
      setShowToast(true);
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
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        color="dark"
      />
    </div>
  );
};

export default Categorias;