import React from 'react';

export interface Receita {
  id?: string;
  descricao: string;
  data: string; // ou Date
  valor: number;
  fixa?: boolean;
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

export interface CategoriaFirestore {
  id: string;
  nome: string;
  cor: string;
}

export interface DespesaFirestore {
  data: string;
  descricao: string;
  valor: number;
  parcelas: number;
  fixa: boolean;
  categoria: CategoriaFirestore;
  tipoPagamento?: 'debito' | 'credito'; 
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
  tipoPagamento: 'debito' | 'credito'; 
  cartao?: string; 
    parcelaAtual?: number;
}

// src/types/configuracaoFatura.ts

export interface ConfiguracaoFatura {
  fechamentoFatura: number;  
  pagamentoFatura: number;   
  id: string;
  nomeCartao: string;
}

export interface FinanceState {
  configuracoesFatura: ConfiguracaoFatura[];
  iniciarEscutaFatura: () => void;
  salvarConfiguracoesFatura: (config: ConfiguracaoFatura[]) => Promise<void>;
}

export interface CartaoConfiguracao {
  id: string;
  nomeCartao: string;
  fechamentoFatura: number;
  pagamentoFatura: number;
}

export interface ReceitaTipo {
  id?: string;
  data: string;
  descricao: string;
  valor: number;
  fixa: boolean;
}