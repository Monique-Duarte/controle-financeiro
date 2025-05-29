import {
  getDocsByTipo,
  addDocByTipo,
  updateDocByTipo,
  deleteDocByTipo
} from './crud-service';

import { Receita } from '../types/tipos';

export const getReceitas = () => getDocsByTipo<Receita>('receitas');
export const addReceita = (data: Omit<Receita, 'id'>) => addDocByTipo<Receita>('receitas', data);
export const updateReceita = (id: string, data: Partial<Omit<Receita, 'id'>>) =>
  updateDocByTipo('receitas', id, data);
export const deleteReceita = (id: string) => deleteDocByTipo('receitas', id);
