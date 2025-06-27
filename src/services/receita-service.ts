import {
  getDocsByTipo,
  addDocByTipo,
  updateDocByTipo,
  deleteDocByTipo,
  getDocsByTipoRealtime
} from './crud-service';
import { Receita } from '../types/tipos';

export const getReceitas = (userId: string) => getDocsByTipo<Receita>(userId, 'receitas');
export const getReceitasRealtime = (userId: string, callback: (data: Receita[]) => void) =>
  getDocsByTipoRealtime<Receita>(userId, 'receitas', callback);
export const addReceita = (userId: string, data: Omit<Receita, 'id'>) => addDocByTipo<Receita>(userId, 'receitas', data);
export const updateReceita = (userId: string, id: string, data: Partial<Omit<Receita, 'id'>>) =>
  updateDocByTipo(userId, 'receitas', id, data);
export const deleteReceita = (userId: string, id: string) => deleteDocByTipo(userId, 'receitas', id);