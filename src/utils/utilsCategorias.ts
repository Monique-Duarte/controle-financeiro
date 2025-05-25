import { categoriasPredefinidas } from '../components/categoriasPredefinidas';
import { Categoria } from '../types/tipos';

export function getCategoriaPorId(id: string): Categoria | undefined {
  const categoria = categoriasPredefinidas.find(cat => cat.id === id);
  if (!categoria) return undefined;

  // Retorna só os dados puros, sem o ReactNode icone
  const { icone, ...categoriaSemIcone } = categoria;
  return categoriaSemIcone;
}
