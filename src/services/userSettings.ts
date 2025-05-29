import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ConfiguracaoFatura } from '../types/tipos';

// Valores padrão para quando não existe configuração salva
export const configuracaoPadraoFatura: ConfiguracaoFatura = {
  fechamentoFatura: 25,
  pagamentoFatura: 5,
};

/**
 * Salva as configurações de fatura do usuário.
 * @param usuarioId ID do usuário
 * @param config Configuração a salvar
 */
export async function salvarConfiguracaoFatura(usuarioId: string, config: ConfiguracaoFatura) {
  const ref = doc(db, 'userSettings', usuarioId);
  await setDoc(ref, config, { merge: true });
}

/**
 * Busca as configurações de fatura do usuário.
 * @param usuarioId ID do usuário
 * @returns Configuração salva ou padrão
 */
export async function buscarConfiguracaoFatura(usuarioId: string): Promise<ConfiguracaoFatura> {
  const ref = doc(db, 'userSettings', usuarioId);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const dados = snap.data();
    return {
      fechamentoFatura: dados.fechamentoFatura ?? configuracaoPadraoFatura.fechamentoFatura,
      pagamentoFatura: dados.pagamentoFatura ?? configuracaoPadraoFatura.pagamentoFatura,
    };
  } else {
    return configuracaoPadraoFatura;
  }
}
