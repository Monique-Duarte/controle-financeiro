import React from 'react';

export const dadosCategorias = [
  { name: 'Casa', value: 500 },
  { name: 'Saúde', value: 200 },
  { name: 'Transporte', value: 300 },
  { name: 'Alimentação', value: 450 },
  { name: 'Mercado', value: 600 },
  { name: 'Pet', value: 150 },
  { name: 'Telefone', value: 100 },
  { name: 'Viagem', value: 350 },
  { name: 'Presente', value: 120 },
  { name: 'Confraternização', value: 180 },
  { name: 'Outros', value: 250 }
];

// Componente que exibe a lista de categorias (opcional)
export const ListaCategorias: React.FC = () => {
  return (
    <ul>
      {dadosCategorias.map(cat => (
        <li key={cat.name}>{cat.name} — Valor padrão: R$ {cat.value}</li>
      ))}
    </ul>
  );
};
