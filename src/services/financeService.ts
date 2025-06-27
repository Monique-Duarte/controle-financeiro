import {
  getDocsByTipo,
  addDocByTipo,
  updateDocByTipo,
  deleteDocByTipo
} from './crud-service';

export interface Receita {
  id?: string;
  descricao: string;
  data: string; // ou Date
  valor: number;
  fixo?: boolean;
}

export interface Despesa {
  id?: string;
  categoria: string;
  valor: number;
  data: string;
  observacao?: string;
  parcela?: number;
  fixo?: boolean;
  cartao?: string;
}

// CRUD específico para receitas
export const getReceitas = () => getDocsByTipo<Receita>('receitas');
export const addReceita = (data: Omit<Receita, 'id'>) => addDocByTipo<Receita>('receitas', data);
export const updateReceita = (id: string, data: Omit<Receita, 'id'>) =>
  updateDocByTipo('receitas', id, data);
export const deleteReceita = (id: string) => deleteDocByTipo('receitas', id);

// CRUD específico para despesas
export const getDespesas = () => getDocsByTipo<Despesa>('despesas');
export const addDespesa = (data: Omit<Despesa, 'id'>) => addDocByTipo<Despesa>('despesas', data);
export const updateDespesa = (id: string, data: Omit<Despesa, 'id'>) =>
  updateDocByTipo('despesas', id, data);
export const deleteDespesa = (id: string) => deleteDocByTipo('despesas', id);
