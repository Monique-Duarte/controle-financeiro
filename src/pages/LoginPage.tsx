import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLoading,
  IonToast,
} from '@ionic/react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { useHistory } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const history = useHistory();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setToastMessage('Usuário registrado com sucesso! Faça login.');
      setShowToast(true);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setToastMessage('Este e-mail já está em uso.');
      } else if (error.code === 'auth/weak-password') {
        setToastMessage('Senha muito fraca (mínimo 6 caracteres).');
      } else {
        setToastMessage(`Erro ao registrar: ${error.message}`);
      }
      setShowToast(true);
      console.error('Erro ao registrar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setToastMessage('Login realizado com sucesso!');
      setShowToast(true);
      setEmail('');
      setPassword('');
      history.replace('/home');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setToastMessage('E-mail ou senha incorretos.');
      } else {
        setToastMessage(`Erro ao fazer login: ${error.message}`);
      }
      setShowToast(true);
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setToastMessage('Login com Google realizado com sucesso!');
      setShowToast(true);
      history.replace('/home');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        setToastMessage('Login com Google cancelado.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setToastMessage('Requisição de pop-up cancelada.');
      } else {
        setToastMessage(`Erro ao fazer login com Google: ${error.message}`);
      }
      setShowToast(true);
      console.error('Erro ao fazer login com Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login / Registro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding ion-text-center">
        <IonLoading isOpen={loading} message={'Aguarde...'} duration={0} spinner="crescent" />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="dark"
        />

        <IonCard className="ion-margin-top">
          <IonCardHeader>
            <IonCardTitle>Autenticação</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                  placeholder="seuemail@exemplo.com"
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Senha</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                  placeholder="Mínimo 6 caracteres"
                />
              </IonItem>
            </IonList>
            <IonButton expand="block" onClick={handleLogin} className="ion-margin-top">
              Entrar
            </IonButton>
            <IonButton expand="block" onClick={handleRegister} fill="outline" className="ion-margin-top">
              Criar Conta
            </IonButton>
            <IonButton expand="block" onClick={handleGoogleLogin} color="danger" className="ion-margin-top">
              Entrar com Google
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;