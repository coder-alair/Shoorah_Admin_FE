import { lazy } from 'react';
import PartnerAssets from '../container/Partnership/brandassets/partnerAssets';
const ViewNotification = lazy(() => import('../container/ViewNotification'));
const PartnerDashboard = lazy(() => import('../container/Partnership/Dashboard/dashboard'));
const IntroduceList = lazy(() => import('../container/Partnership/IntroduceCompany/IntroCompany'));
const IntroAddCompany = lazy(() => import('../container/Partnership/IntroduceCompany/addCompany'));
const EditIntroduce = lazy(() =>
  import('../container/B2B/B2BAdmin/Partnership/PartnerIntroduced/editIntroduce')
);
const PartnerEarning = lazy(() => import('../container/Partnership/Earning/earning'));
const NotFound = lazy(() => import('../container/404NotFound'));
const ViewPartnerNotification = lazy(() =>
  import('../container/Partnership/Notification/Notification')
);
const PartnerLegals = lazy(() => import('../container/Partnership/Legals/legals'));
const Login = lazy(() => import('../container/Login'));
const ForgotPassword = lazy(() => import('../container/ForgotPassword'));
const ResetPassword = lazy(() => import('../container/ResetPassword'));
const ChangePassword = lazy(() => import('../container/ChangePassword'));
const SubAdmin = lazy(() => import('../container/SubAdmin/SubAdmin'));

const PartnerIntroduced = lazy(() =>
  import('../container/B2B/B2BAdmin/Partnership/PartnerIntroduced/partnerIntroduced')
);

const PartnerAdd = lazy(() => import('../container/B2B/B2BAdmin/Partnership/Partners/addPartner'));

const MyAccount = lazy(() => import('../container/Partnership/Account/myaccount'));

const routes = [
  {
    path: '/login',
    exact: true,
    name: 'Login',
    component: Login,
    private: false
  },
  {
    path: '/forgot-password',
    exact: true,
    name: 'ForgotPassword',
    component: ForgotPassword,
    private: false
  },
  {
    path: '/reset-password',
    exact: true,
    name: 'ResetPassword',
    component: ResetPassword,
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
    path: '/notifications',
    exact: true,
    name: 'Notification',
    component: ViewNotification,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/sub-admins',
    exact: true,
    name: 'SubAdmin',
    component: SubAdmin,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/partner-introduced',
    exact: true,
    name: 'Partners-company-introduced',
    component: PartnerIntroduced,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/partners-introduce/edit-introduce',
    exact: true,
    name: 'Edit-company-introduced',
    component: EditIntroduce,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/partners/add-partner',
    exact: true,
    name: 'Partners-add-partner',
    component: PartnerAdd,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/partner-earning',
    exact: true,
    name: 'Partner Earning',
    component: PartnerEarning,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/partner-notification',
    exact: true,
    name: 'Partner Notifications',
    component: ViewPartnerNotification,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/partner-dashboard',
    exact: true,
    name: 'PartnerDashboard',
    component: PartnerDashboard,
    private: true,
    onlyCompanyAdmin: false,
    onlyPartner: true,
    onlyAdmin: false
  },
  {
    path: '/partner-account',
    exact: true,
    name: 'PartnerAccount',
    component: MyAccount,
    private: true,
    onlyCompanyAdmin: false,
    onlyPartner: true,
    onlyAdmin: false
  },
  {
    path: '/introduce',
    exact: true,
    name: 'IntroduceCompany',
    component: IntroduceList,
    private: true,
    onlyCompanyAdmin: false,
    onlyPartner: true,
    onlyAdmin: false
  },
  {
    path: '/introduce/add-company',
    exact: true,
    name: 'IntroduceAddCompany',
    component: IntroAddCompany,
    private: true,
    onlyCompanyAdmin: false,
    onlyPartner: true,
    onlyAdmin: false
  },
  {
    path: '/partner-legals',
    exact: true,
    name: 'Legals',
    component: PartnerLegals,
    private: true,
    onlyCompanyAdmin: false,
    onlyPartner: true,
    onlyAdmin: false
  },
  {
    path: '/partner-assets',
    exact: true,
    name: 'Assets',
    component: PartnerAssets,
    private: true,
    onlyCompanyAdmin: false,
    onlyPartner: true,
    onlyAdmin: false
  },
  {
    path: '*',
    exact: true,
    name: 'NotFound',
    component: NotFound,
    private: false
  }
];

export default routes;
