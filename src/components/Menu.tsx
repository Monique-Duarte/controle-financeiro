import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import './Menu.css';

import { useLocation } from 'react-router-dom';
import { 
  archiveOutline, 
  archiveSharp, 
  barChartOutline, 
  barChartSharp, 
  bookmarkOutline, cardOutline, cardSharp, 
  cashOutline, 
  cashSharp, 
  createOutline, 
  createSharp, 
  statsChartOutline, 
  statsChartSharp, 
  warningOutline, 
  warningSharp 
} from 'ionicons/icons';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Dashboard',
    url: '/',
    iosIcon: barChartOutline,
    mdIcon: barChartSharp
  },
  {
    title: 'Receita',
    url: '/Receita',
    iosIcon: cashOutline,
    mdIcon: cashSharp
  },
  {
    title: 'Despesas',
    url: '/Despesa',
    iosIcon: createOutline,
    mdIcon: createSharp
  },
  {
    title: 'Faturas',
    url: '/Faturas',
    iosIcon: archiveOutline,
    mdIcon: archiveSharp
  },
  {
    title: 'Cartões de crédito',
    url: '/Cartoes',
    iosIcon: cardOutline,
    mdIcon: cardSharp
  },
  {
    title: 'Investimentos',
    url: '/Investimentos',
    iosIcon: statsChartOutline,
    mdIcon: statsChartSharp
  },
  {
    title: 'Reserva de emergência',
    url: '/Reserva',
    iosIcon: warningOutline,
    mdIcon: warningSharp
  }
];

const labels = ['Casa', 'Saúde', 'Transporte', 'Alimentação', 'Mercado', 'Pet', 'Telefone', 'Viagem', 'Presente', 'Confraternização', 'Outros'];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>MENU</IonListHeader>
          <IonNote>Controle financeiro</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Categoria</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon aria-hidden="true" slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
