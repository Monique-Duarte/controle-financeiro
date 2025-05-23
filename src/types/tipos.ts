import React from 'react';

export interface CategoriaFirestore {
  id: string;
  nome: string;
  cor: string;
}

export interface DespesaFirestore {
  data: string;
  descricao: string;
  valor: string;
  parcelas: number;
  fixa: boolean;
  categoria: CategoriaFirestore;
}

export interface ReceitaFirestore {
  valor: string;
  descricao: string;
}

export interface CategoriaUI extends CategoriaFirestore {
  icone: React.ReactNode;
}

// NOVO tipo UI para usar na interface (com valor number e categoria com ícone)
export interface DespesaTipo {
  id?: string;
  data: string;
  descricao: string;
  valor: number;
  parcelas: number;
  fixa: boolean;
  categoria: CategoriaUI;
}
