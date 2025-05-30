import { useState, useCallback } from 'react';

interface ConfirmacaoProps {
  mensagem?: string;
  titulo?: string;
  onConfirmar: () => void;
}

export function useConfirmacao() {
  const [isOpen, setIsOpen] = useState(false);
  const [mensagem, setMensagem] = useState('Tem certeza?');
  const [titulo, setTitulo] = useState('Confirmação');
  const [callback, setCallback] = useState<() => void>(() => {});

  const solicitarConfirmacao = useCallback((props: ConfirmacaoProps) => {
    setMensagem(props.mensagem || 'Tem certeza?');
    setTitulo(props.titulo || 'Confirmação');
    setCallback(() => props.onConfirmar);
    setIsOpen(true);
  }, []);

  const confirmar = () => {
    callback();
    setIsOpen(false);
  };

  return {
    isOpen,
    titulo,
    mensagem,
    setIsOpen,
    confirmar,
    solicitarConfirmacao,
  };
}
