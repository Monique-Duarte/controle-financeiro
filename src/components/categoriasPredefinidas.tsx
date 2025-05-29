import {
  FaHome,
  FaHeartbeat,
  FaShoppingCart,
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
  '#df5d83', '#042940', '#836bd1', '#f59e0b', '#ef4444', '#3b82f6', '#00058F',
  '#14b8a6', '#6B0504', '#0ea5e9', '#BA6EA2', '#6b7280'
];

export const categoriasPredefinidas: CategoriaUI[] = [
  { id: 'Casa', nome: 'Casa', cor: coresCategorias[0], icone: <FaHome /> },
  { id: 'Saúde', nome: 'Saúde', cor: coresCategorias[1], icone: <FaHeartbeat /> },
  { id: 'Compras', nome: 'Compras', cor: coresCategorias[2], icone: <FaShoppingCart /> },
  { id: 'Transporte', nome: 'Transporte', cor: coresCategorias[3], icone: <FaBus /> },
  { id: 'Alimentação', nome: 'Alimentação', cor: coresCategorias[4], icone: <FaUtensils /> },
  { id: 'Mercado', nome: 'Mercado', cor: coresCategorias[5], icone: <FaShoppingBasket /> },
  { id: 'Pet', nome: 'Pet', cor: coresCategorias[6], icone: <FaDog /> },
  { id: 'Telefone', nome: 'Telefone', cor: coresCategorias[7], icone: <FaPhone /> },
  { id: 'Viagem', nome: 'Viagem', cor: coresCategorias[8], icone: <FaPlane /> },
  { id: 'Presente', nome: 'Presente', cor: coresCategorias[9], icone: <FaGift /> },
  { id: 'Confraternização', nome: 'Confraternização', cor: coresCategorias[10], icone: <FaGlassCheers /> },
  { id: 'Outros', nome: 'Outros', cor: coresCategorias[11], icone: <FaEllipsisH /> },
];

// 🔁 Objeto para acesso rápido por nome
export const categoriasPorNome: Record<string, CategoriaUI> = categoriasPredefinidas.reduce(
  (acc, cat) => {
    acc[cat.nome] = cat;
    return acc;
  },
  {} as Record<string, CategoriaUI>
);
