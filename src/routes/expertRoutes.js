import { lazy } from 'react';
import PeapProfile from '../container/Peap-Dashboard/Peap-Profile/peapProfile';
import ViewNotification from '../container/ViewNotification';
import ChangePassword from '../container/ChangePassword';
import Peapclient from '../container/Peap-Dashboard/peap-clients/Peapclient';
import ExpertDashboard from '../container/Peap-Dashboard/peap-dashboard/expertDashboard';
import NotFound from '../container/404NotFound';
import ExpertMainDashboard from '../container/Peap-Dashboard/peap-dashboard/expertMainDashboard';
import ExpertMess from '../container/Peap-Dashboard/peap-dashboard/expertMess';

const routes = [
  {
    path: '/expert-dashboard',
    exact: true,
    name: 'Dashboard',
    component: ExpertDashboard,
    private: false
  },
  {
    path: '/change-password',
    exact: true,
    name: 'ChangePassword',
    component: ChangePassword,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/expert-me',
    exact: true,
    name: 'Expert-Me',
    component: PeapProfile,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/notifications',
    exact: true,
    name: 'Notification',
    component: ViewNotification,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/expert-clients/my-client',
    exact: true,
    name: 'my-clients',
    component: Peapclient,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/peap/ExpertApp',
    exact: true,
    name: 'expertapp',
    component: ExpertMainDashboard,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '*',
    exact: true,
    name: 'not-found',
    component: NotFound,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/Expertmess',
    exact: true,
    name: 'expertmess',
    component: ExpertMess,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  }
];

export default routes;
