import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
  IonLoading 
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

import Menu from './components/Menu';
import Home from './pages/Home';
import ReceitaPage from './pages/Receita';
import Despesa from './pages/Despesa';
import Fatura from './pages/Fatura';
import CartaoPage from './pages/Cartoes';
import LoginPage from './pages/LoginPage';
import ResumoContainer from './components/containerResumo';
import CategoriasContainer from './components/containerCategorias';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (loadingAuth) {
    return (
      <IonApp>
        <IonLoading isOpen={true} message={'Verificando autenticação...'} duration={0} spinner="crescent" />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          {isAuthenticated && <Menu />}

          <IonRouterOutlet id="main">
            {/* Rota para a página de login */}
            <Route path="/login" component={LoginPage} exact={true} />
            {isAuthenticated ? (
              <>
                <Route exact path="/" render={() => <Redirect to="/home" />} />
                <Route path="/home" component={Home} exact={true} />
                <Route path="/receitas" component={ReceitaPage} exact={true} />
                <Route path="/despesas" component={Despesa} exact={true} />
                <Route path="/fatura" component={Fatura} exact={true} />
                <Route path="/cartoes" component={CartaoPage} exact={true} />
                <Route path="/resumo" component={ResumoContainer} exact={true} />
                <Route path="/categorias" component={CategoriasContainer} exact={true} />
                <Route path="*">
                  <Redirect to="/home" />
                </Route>
              </>
            ) : (
              <Route path="*">
                <Redirect to="/login" />
              </Route>
            )}
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;