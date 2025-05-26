import { categoriasPredefinidas } from '../components/categoriasPredefinidas';
import { DespesaFirestore, DespesaTipo } from '../types/tipos';

export function converterDespesasParaUI(despesasFirestore: DespesaFirestore[]): DespesaTipo[] {
  return despesasFirestore.map(despesa => {
    const categoriaComIcone = categoriasPredefinidas.find(cat => cat.id === despesa.categoria.id);

    return {
      ...despesa,
      valor: Number(despesa.valor),
      categoria: categoriaComIcone ?? {
        ...despesa.categoria,
        icone: null,
      },
    };
  });
}
