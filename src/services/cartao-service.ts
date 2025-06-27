import {
  getDocsByTipo,
  addDocByTipo,
  updateDocByTipo,
  deleteDocByTipo,
  getDocsByTipoRealtime
} from './crud-service';

import { Cartao } from '../types/tipos';

export const getCartoes = (userId: string) => getDocsByTipo<Cartao>(userId, 'cartoes');

export const getCartoesRealtime = (userId: string, callback: (data: Cartao[]) => void) =>
  getDocsByTipoRealtime<Cartao>(userId, 'cartoes', callback);

export const addCartao = (userId: string, data: Omit<Cartao, 'id'>) => addDocByTipo<Cartao>(userId, 'cartoes', data);

export const updateCartao = (userId: string, id: string, data: Partial<Omit<Cartao, 'id'>>) =>
  updateDocByTipo(userId, 'cartoes', id, data);

export const deleteCartao = (userId: string, id: string) =>
  deleteDocByTipo(userId, 'cartoes', id);
