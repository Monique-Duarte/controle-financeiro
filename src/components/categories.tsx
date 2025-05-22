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

export interface Categoria {
  id: string;
  nome: string;
  cor: string;
  icone: React.ReactNode;
}

const coresCategorias = [
  '#000D0A', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#00058F',
  '#14b8a6', '#6B0504', '#0ea5e9', '#BA6EA2', '#6b7280'
];

export const categoriasPredefinidas: Categoria[] = [
  { id: 'casa', nome: 'Casa', cor: coresCategorias[0], icone: <FaHome /> },
  { id: 'saude', nome: 'Saúde', cor: coresCategorias[1], icone: <FaHeartbeat /> },
  { id: 'transporte', nome: 'Transporte', cor: coresCategorias[2], icone: <FaBus /> },
  { id: 'alimentacao', nome: 'Alimentação', cor: coresCategorias[3], icone: <FaUtensils /> },
  { id: 'mercado', nome: 'Mercado', cor: coresCategorias[4], icone: <FaShoppingBasket /> },
  { id: 'pet', nome: 'Pet', cor: coresCategorias[5], icone: <FaDog /> },
  { id: 'telefone', nome: 'Telefone', cor: coresCategorias[6], icone: <FaPhone /> },
  { id: 'viagem', nome: 'Viagem', cor: coresCategorias[7], icone: <FaPlane /> },
  { id: 'presente', nome: 'Presente', cor: coresCategorias[8], icone: <FaGift /> },
  { id: 'confraternizacao', nome: 'Confraternização', cor: coresCategorias[9], icone: <FaGlassCheers /> },
  { id: 'outros', nome: 'Outros', cor: coresCategorias[10], icone: <FaEllipsisH /> },
];
