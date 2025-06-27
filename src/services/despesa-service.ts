import {
  getDocsByTipo,
  addDocByTipo,
  updateDocByTipo,
  deleteDocByTipo,
  getDocsByTipoRealtime
} from './crud-service';
import { Despesa } from '../types/tipos';

export const getDespesas = (userId: string) => getDocsByTipo<Despesa>(userId, 'despesas');
export const getDespesasRealtime = (userId: string, callback: (data: Despesa[]) => void) =>
  getDocsByTipoRealtime<Despesa>(userId, 'despesas', callback);
export const addDespesa = (userId: string, data: Omit<Despesa, 'id'>) => addDocByTipo<Despesa>(userId, 'despesas', data);

export const updateDespesa = (userId: string, id: string, data: Partial<Omit<Despesa, 'id'>>) =>
  updateDocByTipo(userId, 'despesas', id, data);

// **CORREÇÃO AQUI:** A ordem dos argumentos foi ajustada para deleteDocByTipo
export const deleteDespesa = (userId: string, id: string) =>
  deleteDocByTipo(userId, 'despesas', id);