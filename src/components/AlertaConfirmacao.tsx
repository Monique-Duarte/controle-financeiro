import { IonAlert } from '@ionic/react';

interface Props {
  isOpen: boolean;
  titulo: string;
  mensagem: string;
  onCancelar: () => void;
  onConfirmar: () => void;
}

const AlertaConfirmacao: React.FC<Props> = ({
  isOpen,
  titulo,
  mensagem,
  onCancelar,
  onConfirmar,
}) => {
  return (
    <IonAlert
      isOpen={isOpen}
      header={titulo}
      message={mensagem}
      buttons={[
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: onCancelar,
        },
        {
          text: 'Confirmar',
          role: 'destructive',
          handler: onConfirmar,
        },
      ]}
      onDidDismiss={onCancelar}
    />
  );
};

export default AlertaConfirmacao;