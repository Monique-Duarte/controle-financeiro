import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';

import Menu from './components/Menu';
import Home from './pages/Home/Home';
import ReceitaPage from './pages/Receitas/Receita';
import Despesa from './pages/Despesa/Despesa';


/* Ionic Core & Optional CSS */
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

/* Dark mode (sistema) */
import '@ionic/react/css/palettes/dark.system.css';

/* Variáveis de tema */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">

          <Menu />

          <IonRouterOutlet id="main">
            <Route path="/" exact component={Home}/>
            <Route path="/Receita" exact component={ReceitaPage} />
            <Route path="/Despesa" exact component={Despesa} />
            {/* Se quiser outras rotas, só adicionar aqui */}
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;