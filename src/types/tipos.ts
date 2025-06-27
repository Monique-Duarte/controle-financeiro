import React from 'react';

export interface Receita {
  id?: string;
  descricao: string;
  data: string;
  valor: number;
  fixo?: boolean;
}

export interface Despesa {
  id?: string;
  categoria: CategoriaFirestore;
  valor: number;
  data: string;
  descricao: string;
  parcelas?: number;
  fixo?: boolean;
  cartao?: string;
  tipoPagamento?: 'debito' | 'credito';
  parcelaAtual?: number;
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
  fixo: boolean;
  categoria: CategoriaFirestore;
  tipoPagamento?: 'debito' | 'credito';
  observacao?: string;
  cartao?: string;
  parcelaAtual?: number;
}


export interface ReceitaFirestore {
  valor: string;
  descricao: string;
  data: string;
  fixo: boolean;
}

export interface CategoriaUI extends CategoriaFirestore {
  icone: React.ReactNode;
}

export interface DespesaTipo {
  id?: string;
  data: string;
  descricao: string;
  valor: number;
  parcelas: number;
  fixo: boolean;
  categoria: CategoriaUI;
  tipoPagamento: 'debito' | 'credito';
  cartao?: string;
  parcelaAtual?: number;
}

export type DespesaFirestoreToSave = Omit<DespesaTipo, 'id' | 'categoria'> & {
  categoria: CategoriaFirestore;
};

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

export interface Cartao {
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
  fixo: boolean;
}

export type FaturaExportada = {
  nome: string;
  data: string;
  parcela: string;
  valor: string;
  descricao?: string;
};