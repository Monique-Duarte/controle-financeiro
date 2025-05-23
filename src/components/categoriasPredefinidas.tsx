import {
  FaHome,
  FaHeartbeat,
  FaBus,
  FaUtensils,
  FaShoppingBasket,
  FaDog,
  FaPhone,
  FaPlane,
  FaGift,
  FaGlassCheers,
  FaEllipsisH,
} from 'react-icons/fa';

import { CategoriaUI } from '../types/tipos';

const coresCategorias = [
  '#000D0A', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#00058F',
  '#14b8a6', '#6B0504', '#0ea5e9', '#BA6EA2', '#6b7280'
];

export const categoriasPredefinidas: CategoriaUI[] = [
  { id: 'Casa', nome: 'Casa', cor: coresCategorias[0], icone: <FaHome /> },
  { id: 'Saúde', nome: 'Saúde', cor: coresCategorias[1], icone: <FaHeartbeat /> },
  { id: 'Transporte', nome: 'Transporte', cor: coresCategorias[2], icone: <FaBus /> },
  { id: 'Alimentação', nome: 'Alimentação', cor: coresCategorias[3], icone: <FaUtensils /> },
  { id: 'Mercado', nome: 'Mercado', cor: coresCategorias[4], icone: <FaShoppingBasket /> },
  { id: 'Pet', nome: 'Pet', cor: coresCategorias[5], icone: <FaDog /> },
  { id: 'Telefone', nome: 'Telefone', cor: coresCategorias[6], icone: <FaPhone /> },
  { id: 'Viagem', nome: 'Viagem', cor: coresCategorias[7], icone: <FaPlane /> },
  { id: 'Presente', nome: 'Presente', cor: coresCategorias[8], icone: <FaGift /> },
  { id: 'Confraternização', nome: 'Confraternização', cor: coresCategorias[9], icone: <FaGlassCheers /> },
  { id: 'Outros', nome: 'Outros', cor: coresCategorias[10], icone: <FaEllipsisH /> },
];