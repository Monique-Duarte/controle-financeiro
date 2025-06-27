import { categoriasPredefinidas } from '../components/categoriasPredefinidas';
import { CategoriaFirestore } from '../types/tipos'; 

export function getCategoriaPorId(id: string): CategoriaFirestore | undefined {
  const categoria = categoriasPredefinidas.find(cat => cat.id === id);
  if (!categoria) return undefined;

  const { icone: _icone, ...categoriaSemIcone } = categoria;
  return categoriaSemIcone;
}