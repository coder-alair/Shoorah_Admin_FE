import { lazy } from 'react';
import CBadges from '../container/B2B/CompanyAdmin/Badges/CBadges';
import NewCDashboard from '../container/B2B/CompanyAdmin/Dashboard/NewCDashboard';
import AppIssues from '../container/APPIssues/AppIssues';
// import CSurveys from '../container/B2B/CompanyAdmin/Surveys/CSurveys';
import BTBAddNotification from '../container/PushNotification/BTBAddNotification';
import ViewNotification from '../container/ViewNotification';
import PartnerDashboard from '../container/Partnership/Dashboard/dashboard';
import IntroduceList from '../container/Partnership/IntroduceCompany/IntroCompany';
import IntroAddCompany from '../container/Partnership/IntroduceCompany/addCompany';
import EditIntroduce from '../container/B2B/B2BAdmin/Partnership/PartnerIntroduced/editIntroduce';
import PartnerEarning from '../container/Partnership/Earning/earning';
import Integrations from '../container/B2B/CompanyAdmin/Integrations/Integrations';
import ViewPartnerNotification from '../container/Partnership/Notification/Notification';
import PartnerLegals from '../container/Partnership/Legals/legals';
import Breathwork from '../container/ContentManagement/Breathwork/Breathwork';
import AddEditBreathwork from '../container/ContentManagement/Breathwork/AddEditBreathwork';
import MySpecialistProfile from '../container/Peap/mySpecialistProfile/mySpecialistProfile';
import PeapProfile from '../container/Peap-Dashboard/Peap-Profile/peapProfile';
import Specialist from '../container/Peap/adminPeapTabs/Specialist';
import Peapclient from '../container/Peap-Dashboard/peap-clients/Peapclient';
import NotFound from '../container/404NotFound';
import PulseSurveyDashboard from '../container/PulseSurvey';
import AddEditPulseSurvey from '../container/PulseSurvey/addSurvey/addSurvey';
import PreviewPulseSurveys from '../container/PulseSurvey/preview/preivewPulseSurvey';
import PulseSurvey from '../container/PulseSurvey/pulseSurveyList';
import AppFeedbacks from '../container/AppFeedbacks/AppFeedbacks';
import ViewSurveyApproval from '../container/ContentApproval/ViewSurveyApproval';
import UnderMaintenance from '../container/userMaintenance';
// import AddPOD from '../container/PodExperts/AddPOD';
const AddPOD = lazy(() => import('../container/PodExperts/AddPOD'));
const Login = lazy(() => import('../container/Login'));
const ForgotPassword = lazy(() => import('../container/ForgotPassword'));
const ResetPassword = lazy(() => import('../container/ResetPassword'));
const ChangePassword = lazy(() => import('../container/ChangePassword'));
const Dashboard = lazy(() => import('../container/Dashboard'));
const PodExperts = lazy(() => import('../container/PodExperts/PodExpertLists'));
const Notification = lazy(() => import('../container/Notification'));
const SubAdmin = lazy(() => import('../container/SubAdmin/SubAdmin'));
const AddEditSubAdmin = lazy(() => import('../container/SubAdmin/AddEditSubAdmin'));
const Users = lazy(() => import('../container/Users/Users'));
const ViewEditUser = lazy(() => import('../container/Users/ViewEditUser'));
const Focus = lazy(() => import('../container/ContentManagement/Focus/Focus'));
const FocusView = lazy(() => import('../container/ContentManagement/Focus/AddEditFocus'));
const AddEditFocus = lazy(() => import('../container/ContentManagement/Focus/AddEditFocus'));
const Meditation = lazy(() => import('../container/ContentManagement/Meditations/Meditations'));
const AddEditMeditation = lazy(() =>
  import('../container/ContentManagement/Meditations/AddEditMeditation')
);
const PushNotification = lazy(() => import('../container/PushNotification/PushNotification'));
const AddPushNotification = lazy(() => import('../container/PushNotification/AddNotification'));
const ContentApproval = lazy(() => import('../container/ContentApproval/ContentApproval'));
const ViewContentApproval = lazy(() => import('../container/ContentApproval/ViewContentApproval'));
const CMS = lazy(() => import('../container/CMS/CMS'));
const AddEditCMS = lazy(() => import('../container/CMS/AddEditCMS'));
const Earning = lazy(() => import('../container/Earning/Earning'));
const Affirmation = lazy(() => import('../container/ContentManagement/Affirmation/Affirmation'));
const AddEditAffirmation = lazy(() =>
  import('../container/ContentManagement/Affirmation/AddEditAffirmation')
);
const Gratitude = lazy(() => import('../container/ContentManagement/Gratitude/Gratitude'));
const AddEditGratitude = lazy(() =>
  import('../container/ContentManagement/Gratitude/AddEditGratitude')
);
const Rituals = lazy(() => import('../container/ContentManagement/Rituals/Rituals'));
const AddEditRituals = lazy(() => import('../container/ContentManagement/Rituals/AddEditRituals'));
const BedTimeStories = lazy(() =>
  import('../container/ContentManagement/BedTimeStories/BedTimeStories')
);
const Sounds = lazy(() => import('../container/ContentManagement/Sounds/Sounds'));
const AddEditSounds = lazy(() => import('../container/ContentManagement/Sounds/AddEditSounds'));

const Config = lazy(() => import('../container/Config/Config'));

const TopPicks = lazy(() => import('../container/ContentManagement/TopPicks/TopPicks'));
const AddEditTopPicks = lazy(() =>
  import('../container/ContentManagement/TopPicks/AddEditTopPicks')
);

const Manifestation = lazy(() =>
  import('../container/ContentManagement/Manifestation/Manifestation')
);
const AddEditManifestation = lazy(() =>
  import('../container/ContentManagement/Manifestation/AddEditManifestation')
);
// const Draft = lazy(() => import('../container/Draft/Draft'));
// const ViewDraft = lazy(() => import('../container/Draft/ViewDraft'));
const ShoorahPods = lazy(() => import('../container/ContentManagement/ShoorahPods/ShoorahPods'));
const AddEditShoorhPods = lazy(() =>
  import('../container/ContentManagement/ShoorahPods/AddEditShoorahPods')
);
const B2BDashboard = lazy(() => import('../container/B2B/B2BAdmin/B2BDashboard/BTBDashboard'));
const B2BCompanylist = lazy(() => import('../container/B2B/B2BAdmin/CompanyList/Companylist'));
const AddCompany = lazy(() => import('../container/B2B/B2BAdmin/CompanyList/AddCompany'));
const B2BEarning = lazy(() => import('../container/B2B/B2BAdmin/Earnings/BTBEarning'));
const ViewCompany = lazy(() => import('../container/B2B/B2BAdmin/CompanyList/ViewCompany'));
const MyCompany = lazy(() => import('../container/B2B/CompanyAdmin/MyCompany/MyCompany'));
const CompanyUser = lazy(() => import('../container/B2B/CompanyAdmin/CUsers/CUser'));
const CompanyReport = lazy(() => import('../container/B2B/CompanyAdmin/Reports/CReports'));
const CompanySolution = lazy(() => import('../container/B2B/CompanyAdmin/Solution/CSolution'));
const AddUser = lazy(() => import('../container/B2B/CompanyAdmin/CUsers/AddUser'));

const PartnerList = lazy(() => import('../container/B2B/B2BAdmin/Partnership/Partners/partner'));

const PartnerIntroduced = lazy(() =>
  import('../container/B2B/B2BAdmin/Partnership/PartnerIntroduced/partnerIntroduced')
);

const PartnerAdd = lazy(() => import('../container/B2B/B2BAdmin/Partnership/Partners/addPartner'));

const MyAccount = lazy(() => import('../container/Partnership/Account/myaccount'));

// Survey imports
const AddEditSurvey = lazy(() => import('../container/Survey/AddEditSurvey'));
const PreviewSurvey = lazy(() => import('../container/Survey/PreviewSurvey'));
const MySurvey = lazy(() => import('../container/Survey/MySurvey'));
const SurveyDashboard = lazy(() => import('../container/Survey/SurveyDashboard'));
const SurveyStatistics = lazy(() => import('../container/Survey/SurveyStatistics'));

// Vision imports
const VisionIdeas = lazy(() => import('../container/ContentManagement/VisionIdeas/VisionIdeas'));
const AddEditVisionIdeas = lazy(() =>
  import('../container/ContentManagement/VisionIdeas/AddEditVisionIdeas')
);

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
    path: '/podExperts',
    exact: true,
    name: 'Pod Experts',
    component: PodExperts,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/podExperts/addPodExperts',
    exact: true,
    name: 'Add Pod Experts',
    component: AddPOD,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/podExperts/editPodExperts/:id',
    exact: true,
    name: 'Edit Pod Experts',
    component: AddPOD,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/dashboard',
    exact: true,
    name: 'Dashboard',
    component: Dashboard,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/notifications',
    exact: true,
    name: 'Notification',
    // component: Notification,
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
    path: '/sub-admins/add-edit',
    exact: true,
    name: 'AddEditSubAdmin',
    component: AddEditSubAdmin,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/users',
    exact: true,
    name: 'Users',
    component: Users,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
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
    path: '/content-management/focus',
    exact: true,
    name: 'Focus',
    component: Focus,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/focus/view',
    exact: true,
    name: 'Focus-view',
    component: FocusView,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/focus/add-edit',
    exact: true,
    name: 'AddEditFocus',
    component: AddEditFocus,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/meditation',
    exact: true,
    name: 'Meditation',
    component: Meditation,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/meditation/add-edit',
    exact: true,
    name: 'AddEditMeditation',
    component: AddEditMeditation,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/meditation/view',
    exact: true,
    name: 'ViewAffirmation',
    component: AddEditMeditation,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/breathwork',
    exact: true,
    name: 'Breathwork',
    component: Breathwork,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/breathwork/add-edit',
    exact: true,
    name: 'AddEditBreathwork',
    component: AddEditBreathwork,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/breathwork/view',
    exact: true,
    name: 'ViewBreathwork',
    component: AddEditBreathwork,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/affirmation',
    exact: true,
    name: 'Affirmation',
    component: Affirmation,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/affirmation/add-edit',
    exact: true,
    name: 'AddEditAffirmation',
    component: AddEditAffirmation,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/affirmation/view',
    exact: true,
    name: 'AddEditAffirmation',
    component: AddEditAffirmation,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/gratitude',
    exact: true,
    name: 'Gratitude',
    component: Gratitude,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/gratitude/add-edit',
    exact: true,
    name: 'AddEditGratitude',
    component: AddEditGratitude,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/rituals',
    exact: true,
    name: 'Rituals',
    component: Rituals,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/rituals/view',
    exact: true,
    name: 'ViewRituals',
    component: AddEditRituals,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/rituals/add-edit',
    exact: true,
    name: 'AddEditRituals',
    component: AddEditRituals,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/bedtime-stories',
    exact: true,
    name: 'BedTimeStories',
    component: BedTimeStories,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/sounds',
    exact: true,
    name: 'Sounds',
    component: Sounds,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/sounds/view',
    exact: true,
    name: 'ViewSound',
    component: AddEditSounds,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/sounds/add-edit',
    exact: true,
    name: 'Sounds',
    component: AddEditSounds,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/top-picks',
    exact: true,
    name: 'TopPicks',
    component: TopPicks,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/top-picks/add-edit',
    exact: true,
    name: 'TopPicks',
    component: AddEditTopPicks,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/manifestation',
    exact: true,
    name: 'Manifestation',
    component: Manifestation,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/manifestation/add-edit',
    exact: true,
    name: 'AddEditManifestation',
    component: AddEditManifestation,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/push-notification',
    exact: true,
    name: 'PushNotification',
    component: PushNotification,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/push-notification/add',
    exact: true,
    name: 'AddPushNotification',
    component: AddPushNotification,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-approval',
    exact: true,
    name: 'ContentApproval',
    component: ContentApproval,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/content-approval/view',
    exact: true,
    name: 'view-content-approval',
    component: ViewContentApproval,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/view-survey/:surveyId',
    exact: true,
    name: 'view-view-survey',
    component: ViewSurveyApproval,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/cms',
    exact: true,
    name: 'cms',
    component: CMS,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/cms/edit-view',
    exact: true,
    name: 'AddEditCMS',
    component: AddEditCMS,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/earning',
    exact: true,
    name: 'Earning',
    component: Earning,
    private: true,
    onlyCompanyAdmin: false
  },
  {
    path: '/config',
    exact: true,
    name: 'config',
    component: Config,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  // {
  //   path: '/draft',
  //   exact: true,
  //   name: 'draft',
  //   component: Draft,
  //   private: true,
  // onlyCompanyAdmin:false,
  //   onlyAdmin: false,
  // },
  // {
  //   path: '/draft/view',
  //   exact: true,
  //   name: 'ViewDraft',
  //   component: ViewDraft,
  //   private: true,
  // onlyCompanyAdmin:false,
  //   onlyAdmin: false,
  // },
  {
    path: '/content-management/shoorah-pods',
    exact: true,
    name: 'ShoorahPods',
    component: ShoorahPods,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/shoorah-pods/view',
    exact: true,
    name: 'ViewShoorahPods',
    component: AddEditShoorhPods,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/app-issues',
    exact: true,
    name: 'appIssues',
    component: AppIssues,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/app-feedbacks',
    exact: true,
    name: 'appFeedbacks',
    component: AppFeedbacks,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/content-management/shoorah-pods/add-edit',
    exact: true,
    name: 'AddEditShoorahPods',
    component: AddEditShoorhPods,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/partners',
    exact: true,
    name: 'Partner-list',
    component: PartnerList,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
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
    path: '/B2B-dashboard',
    exact: true,
    name: 'B2BDashboard',
    component: B2BDashboard,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/B2B-company-list',
    exact: true,
    name: 'B2BCompanylist',
    component: B2BCompanylist,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/B2B-earning',
    exact: true,
    name: 'B2BEarning',
    component: B2BEarning,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/B2B-company-list/addCompany',
    exact: true,
    name: 'AddCompany',
    component: AddCompany,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/B2B-company-list/viewCompany',
    exact: true,
    name: 'ViewCompany',
    component: ViewCompany,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/partner-dashboard',
    exact: true,
    name: 'PartnerDashboard',
    // TODO: Switch
    // component: CompanyDashboard,
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
    // TODO: Switch
    // component: CompanyDashboard,
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
    // TODO: Switch
    // component: CompanyDashboard,
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
    // TODO: Switch
    // component: CompanyDashboard,
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
    // TODO: Switch
    // component: CompanyDashboard,
    component: PartnerLegals,
    private: true,
    onlyCompanyAdmin: false,
    onlyPartner: true,
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
    path: '/:slug/edituser',
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
  // Survey Routes Starts From Here
  {
    path: '/surveys/my-survey',
    exact: false,
    name: 'MySurvey',
    component: MySurvey,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
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
    path: '/surveys',
    exact: true,
    name: 'Survey Dashboard',
    component: SurveyDashboard,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
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
    path: '/surveys/summary/:surveyId',
    exact: false,
    name: 'Survey Summary',
    component: SurveyStatistics,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
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
    path: '/surveys/add-edit',
    exact: false,
    name: 'Survey Add Edit',
    component: AddEditSurvey,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
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
    path: '/surveys/preview',
    exact: false,
    name: 'Survey Preview',
    component: PreviewSurvey,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
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
  // Survey Routes Ends
  // Vision Ideas
  {
    path: '/content-management/vision-ideas',
    exact: true,
    name: 'VisionIdeas',
    component: VisionIdeas,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/vision-ideas/view',
    exact: true,
    name: 'ViewVisionIdeas',
    component: AddEditVisionIdeas,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/content-management/vision-ideas/add-edit',
    exact: true,
    name: 'AddEditVisionIdeas',
    component: AddEditVisionIdeas,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/peap-management',
    exact: true,
    name: 'specialistList',
    component: Specialist,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/peap-management/profile',
    exact: true,
    name: 'peap-profile',
    component: PeapProfile,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/pulse-survey',
    exact: true,
    name: 'pulse survey',

    component: UnderMaintenance,
    // component: PulseSurveyDashboard,

    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/survey',
    exact: true,
    name: 'survey',
    component: SurveyStatistics,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/pulse-survey/add-edit-survey',
    exact: true,
    name: 'addEditSurvey',
    component: AddEditPulseSurvey,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  },
  {
    path: '/preview/pulse-surveys',
    exact: false,
    name: 'Pulse Survey Preview',
    component: PreviewPulseSurveys,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '/survey-list',
    exact: false,
    name: 'MySurveyList',
    component: PulseSurvey,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: true
  },
  {
    path: '*',
    exact: true,
    name: 'not-found',
    component: NotFound,
    private: true,
    onlyCompanyAdmin: false,
    onlyAdmin: false
  }
];
export default routes;
