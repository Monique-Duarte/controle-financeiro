import {
  getDocsByTipo,
  addDocByTipo,
  updateDocByTipo,
  deleteDocByTipo
} from './crud-service';
import { Despesa } from '../types/tipos';

export const getDespesas = () => getDocsByTipo<Despesa>('despesas');
export const addDespesa = (data: Omit<Despesa, 'id'>) => addDocByTipo<Despesa>('despesas', data);
export const updateDespesa = (id: string, data: Partial<Omit<Despesa, 'id'>>) =>
  updateDocByTipo('despesas', id, data);
export const deleteDespesa = (id: string) => deleteDocByTipo('despesas', id);
