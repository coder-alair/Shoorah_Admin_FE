import { lazy } from 'react';
import CBadges from '../container/B2B/CompanyAdmin/Badges/CBadges';
import NewCDashboard from '../container/B2B/CompanyAdmin/Dashboard/NewCDashboard';

import BTBAddNotification from '../container/PushNotification/BTBAddNotification';
import ViewNotification from '../container/ViewNotification';
import Integrations from '../container/B2B/CompanyAdmin/Integrations/Integrations';
import NotFound from '../container/404NotFound';
import PulseSurveyDashboard from '../container/PulseSurvey';
import AddEditPulseSurvey from '../container/PulseSurvey/addSurvey/addSurvey';
import PreviewPulseSurveys from '../container/PulseSurvey/preview/preivewPulseSurvey';
import PulseSurvey from '../container/PulseSurvey/pulseSurveyList';
import ContentApproval from '../container/ContentApproval/ContentApproval';
import ViewContentApproval from '../container/ContentApproval/ViewContentApproval';
import ViewSurveyApproval from '../container/ContentApproval/ViewSurveyApproval';
import UnderMaintenance from '../container/userMaintenance';

const Login = lazy(() => import('../container/Login'));
const ForgotPassword = lazy(() => import('../container/ForgotPassword'));
const ResetPassword = lazy(() => import('../container/ResetPassword'));
const ChangePassword = lazy(() => import('../container/ChangePassword'));
const Notification = lazy(() => import('../container/Notification'));
const SubAdmin = lazy(() => import('../container/SubAdmin/SubAdmin'));
const AddEditSubAdmin = lazy(() => import('../container/SubAdmin/AddEditSubAdmin'));
const ViewEditUser = lazy(() => import('../container/Users/ViewEditUser'));

const MyCompany = lazy(() => import('../container/B2B/CompanyAdmin/MyCompany/MyCompany'));
const CompanyUser = lazy(() => import('../container/B2B/CompanyAdmin/CUsers/CUser'));
const CompanyReport = lazy(() => import('../container/B2B/CompanyAdmin/Reports/CReports'));
const CompanySolution = lazy(() => import('../container/B2B/CompanyAdmin/Solution/CSolution'));
const AddUser = lazy(() => import('../container/B2B/CompanyAdmin/CUsers/AddUser'));
// Survey Routes Starts
const AddEditSurvey = lazy(() => import('../container/Survey/AddEditSurvey'));
const PreviewSurvey = lazy(() => import('../container/Survey/PreviewSurvey'));
const MySurvey = lazy(() => import('../container/Survey/MySurvey'));
const SurveyDashboard = lazy(() => import('../container/Survey/SurveyDashboard'));
const SurveyStatistics = lazy(() => import('../container/Survey/SurveyStatistics'));
// Survey Routes Ends

const routes = [
  {
    path: '/login',
    exact: true,
    name: 'Login',
    component: Login,
    private: false
  },
  {
    path: '/',
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
    path: '/users/edit',
    exact: true,
    name: 'ViewEditUser',
    component: ViewEditUser,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/dashboard',
    exact: true,
    name: 'CompanyDashboard',
    // TODO: Switch
    // component: CompanyDashboard,
    component: NewCDashboard,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/myCompany',
    exact: true,
    name: 'MyCompany',
    component: MyCompany,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/notification',
    exact: true,
    name: 'CompanyNotification',
    component: Notification,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },

  {
    path: '/:slug/notification/add',
    exact: true,
    name: 'BTBAddPushNotification',
    component: BTBAddNotification,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/:slug/report',
    exact: true,
    name: 'CompanyReport',
    component: CompanyReport,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/badges',
    exact: true,
    name: 'CompanyReport',
    component: CBadges,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/integrations',
    exact: true,
    name: 'Integrations',
    component: Integrations,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/integrations',
    exact: true,
    name: 'Integrations',
    component: Integrations,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/solution',
    exact: true,
    name: 'CompanySolution',
    component: CompanySolution,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/users',
    exact: true,
    name: 'CompanyUser',
    component: CompanyUser,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/adduser',
    exact: true,
    name: 'AddUser',
    component: AddUser,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/users/edituser',
    exact: true,
    name: 'AddUser',
    component: AddUser,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/notifications',
    exact: true,
    name: 'Notification',
    component: Notification,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },

  {
    path: '/:slug/notifications/view',
    exact: true,
    name: 'Notification',
    component: ViewNotification,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/change-password',
    exact: true,
    name: 'ChangePassword',
    component: ChangePassword,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },

  {
    path: '/:slug/sub-admins',
    exact: true,
    name: 'SubAdmin',
    component: SubAdmin,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/sub-admins/add-edit',
    exact: true,
    name: 'AddEditSubAdmin',
    component: AddEditSubAdmin,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '*',
    exact: true,
    name: 'NotFound',
    component: NotFound,
    private: false
  },
  {
    path: '/users/view',
    exact: true,
    name: 'ViewEditUser',
    component: ViewEditUser,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  // Survey Routes Starts
  {
    path: '/:slug/surveys/my-survey',
    exact: false,
    name: 'MySurvey',
    component: MySurvey,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/surveys',
    exact: true,
    name: 'Survey Dashboard',
    component: SurveyDashboard,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/surveys/summary/:surveyId',
    exact: false,
    name: 'Survey Summary',
    component: SurveyStatistics,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/surveys/add-edit',
    exact: true,
    name: 'Survey Add Edit',
    component: AddEditSurvey,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/surveys/preview',
    exact: false,
    name: 'Survey Preview',
    component: PreviewSurvey,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/pulse-survey',
    exact: true,
    name: 'pulse survey',
    component: UnderMaintenance,
    //component: PulseSurveyDashboard,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/:slug/pulse-survey/add-edit-survey',
    exact: true,
    name: 'addEditSurvey',
    component: AddEditPulseSurvey,
    private: true,
    onlyCompanyAdmin: true,
    onlyAdmin: false
  },
  {
    path: '/:slug/preview/pulse-surveys',
    exact: false,
    name: 'Pulse Survey Preview',
    component: PreviewPulseSurveys,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/:slug/survey-list',
    exact: false,
    name: 'MySurveyList',
    component: PulseSurvey,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/:slug/content-approval',
    exact: true,
    name: 'ContentApproval',
    component: ContentApproval,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/:slug/content-approval/view',
    exact: true,
    name: 'view-content-approval',
    component: ViewContentApproval,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/:slug/view-survey/:surveyId',
    exact: true,
    name: 'view-view-survey',
    component: ViewSurveyApproval,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  }
  // Survey Routes Ends
];
export default routes;
