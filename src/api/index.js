import axios from 'axios';
import {
  cleanLocalStorage,
  errorToast,
  getDeviceToken,
  getJWTToken,
  getLocalStorageItem,
  setLocalStorageItem
} from '../utils/helper';
import { API_BASE_URL } from '../core/env.configs';

const BASE_URL = API_BASE_URL || 'https://staging-api.shoorah.io/';

const GetApi = async (tag = '', isHeader = false) => {
  try {
    const data = await axios.get(BASE_URL + 'admin/v1' + tag, {
      headers: isHeader
        ? {
            Authorization: getJWTToken()
          }
        : {}
    });
    return data;
  } catch (e) {
    ErrorHandler(e);
  }
};

const PostApi = async (tag = '', reqBody, isHeader = false, flag = false) => {
  let flagCheck = flag
    ? 'multipart/form-data; boundary=----WebKitFormBoundaryueI4YvrqiXxUgVGA'
    : 'application/json';

  try {
    const data = await axios.post(BASE_URL + 'admin/v1' + tag, reqBody, {
      headers: isHeader
        ? {
            'Content-Type': flagCheck,
            accept: 'application/json',
            deviceToken: getLocalStorageItem('deviceToken'),
            deviceType: 3,
            Authorization: getJWTToken()
          }
        : {}
    });
    return data;
  } catch (e) {
    ErrorHandler(e);
  }
};

const DeleteApi = async (tag = '', isHeader = false) => {
  try {
    const data = await axios.delete(BASE_URL + 'admin/v1' + tag, {
      headers: isHeader
        ? {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: getJWTToken(),
            deviceToken: getDeviceToken()
          }
        : {}
    });
    return data;
  } catch (e) {
    ErrorHandler(e);
  }
};

const PutApi = async (tag = '', reqBody, isHeader, isJSON = false) => {
  const contentType = {
    'Content-Type': 'application/json'
  };
  const headers = {
    accept: 'application/json',
    Authorization: getJWTToken(),
    ...(isJSON ? contentType : {})
  };
  try {
    const data = await axios.put(BASE_URL + 'admin/v1' + tag, reqBody !== null && reqBody, {
      headers: isHeader ? headers : {}
    });
    return data;
  } catch (e) {
    ErrorHandler(e);
  }
};

const ErrorHandler = async (e) => {
  if (e.response?.data?.message) {
    if (e.response?.data?.code === 498) {
      RefreshToken();
    } else if (e.response?.data?.code === 401) {
      errorToast(e.response?.data?.message);
      cleanLocalStorage();
      window.location.href = '/login';
    } else {
      errorToast(e.response?.data?.message);
    }
  } else if (e.response?.data) {
    if (e.response?.data?.meta?.code === 498) {
      RefreshToken();
    } else if (e.response?.data?.code === 401) {
      errorToast(e.response?.data?.message);
      cleanLocalStorage();
      window.location.href = '/login';
    } else {
      errorToast(e.response?.data?.meta?.message);
    }
  } else {
    errorToast('Something went wrong');
  }
};

const RefreshToken = async () => {
  await axios
    .post(
      `${BASE_URL}/refresh-token`,
      {},
      { headers: { 'refresh-token': getLocalStorageItem('refreshToken') } }
    )
    .then(async (response) => {
      if (response.data.meta.code === 1) {
        setLocalStorageItem('token', response.data.meta.token);
        window.location.reload();
      }
    })
    .catch(async (error) => {
      if (error.response.data.code === 401) {
        await Api.logoutUser();
        cleanLocalStorage();
        window.location.href = '/login';
      } else {
        cleanLocalStorage();
        window.location.href = '/login';
      }
    });
};

const DownloadApi = async (tag = '', fileName = 'SosReport') => {
  try {
    const res = await axios.get(BASE_URL + 'admin/v1' + tag, {
      headers: {
        deviceType: 3,
        Authorization: getJWTToken()
      },
      responseType: 'blob'
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url_2 = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url_2;
    a.download = `${fileName}.pdf`; // Specify the filename
    a.click();
    window.URL.revokeObjectURL(url_2);
  } catch (err) {}
};

const PostApiBlob = async (tag = '', reqBody) => {
  try {
    const res = await axios.post(BASE_URL + 'admin/v1' + tag, reqBody, {
      headers: {
        deviceType: 3,
        Authorization: getJWTToken()
      },
      responseType: 'blob'
    });
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url_2 = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url_2;
    a.download = reqBody.graphName; // Specify the filename
    a.click();
    window.URL.revokeObjectURL(url_2);
  } catch (e) {
    ErrorHandler(e);
  }
};

export const Api = {
  //LRF FLOW APIs
  login: (reqBody) => PostApi('/login', reqBody),
  forgotPassword: (reqBody) => PostApi('/forgot-password', reqBody),
  resetPassword: (reqBody) => PostApi('/reset-password', reqBody),
  adminVerifyOtp: (reqBody) => PostApi('/verify-otp', reqBody),
  changePassword: (reqBody) => PostApi('/change-password', reqBody, true),
  adminList: () => GetApi('/admin-list', true),

  //Dashboard
  getDashboardData: () => GetApi(`/content-count`, true),

  //Sub Admin Menu APIs
  getAdmins: (page, perPage, searchKey, filterQuery, sortBy, sortOrder, id) =>
    GetApi(
      `/admins?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  addEditAdmin: (reqBody) => PostApi('/admins', reqBody, true),
  deleteAdmin: (userId) => DeleteApi(`/admins?userId=${userId}`, true),

  //User APIs
  getUsers: (page, perPage, searchKey, filterQuery, sortBy, sortOrder, company) =>
    GetApi(
      `/users?page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}${
        company ? '&company=' + company : ''
      }`,
      true
    ),
  updateUserDetail: (reqBody) => PutApi('/users', reqBody, true),
  getUserDetail: (id) => GetApi(`/users/${id}`, true),

  getUserFeels: (id, reportType) =>
    GetApi(`/users-mood?userId=${id}&reportType=${reportType}`, true),
  getUserProfessonalFeels: (id, reportType) =>
    GetApi(`/user-professonal-report?userId=${id}&reportType=${reportType}`, true),
  getUserBeforeSleepFeels: (id, reportType) =>
    GetApi(`/user-before-sleep-report?userId=${id}&reportType=${reportType}`, true),
  getUserAfterSleepFeels: (id, reportType) =>
    GetApi(`/user-after-sleep-report?userId=${id}&reportType=${reportType}`, true),
  getPerformanceData: (id, contentType, page, perPage) =>
    GetApi(
      `/performance-data?userId=${id}&contentType=${contentType}&page=${page}&perPage=${perPage}`,
      true
    ),

  getBadgeCount: (id) => GetApi(`/badge-count?userId=${id}`, true),

  getBadgeList: (id, badgeType) => GetApi(`/badge?userId=${id}&badgeType=${badgeType}`, true),

  //pay to partner api
  addPartnerPayment: (data) =>
    PostApi('/edit-introduce?type=update-payment-info', data, true, true),

  //push notifications
  getAllNotifications: (type, page, perPage, searchKey) =>
    GetApi(
      `/notification?page=${page}&perPage=${perPage}&searchKey=${searchKey}&notificationListType=${type}`,
      true
    ),
  addPushNotification: (reqBody) => PostApi('/notification', reqBody, true),
  getUnreadNotificationCount: () => GetApi('/unread-notification', true),
  deleteNotification: (notificationId, deleteType) =>
    DeleteApi(`/notification?deleteType=${deleteType}&notificationId=${notificationId}`, true),
  getUserEmailList: (url, page, perPage, searchKey) =>
    GetApi(`/${url}?page=${page}&perPage=${perPage}&searchKey=${searchKey}`, true),

  addEditDeviceToken: () => PostApi('/device-token', {}, true),

  //Content Management
  //Focus
  getFocusList: (page, perPage, searchKey, filterQuery, sortBy, sortOrder, id) =>
    GetApi(
      `/focus?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),

  getDraftFocusList: () => GetApi(`/draft-focus`, true),
  getFocusNamesList: (type) => GetApi(`/focus/${type}`, true),
  getFocusById: (id) => GetApi(`/focus/view/${id}`, true),
  addEditFocus: (reqBody) => PostApi('/focus', reqBody, true),
  addEditDraftFocus: (reqBody) => PostApi('/draft-focus', reqBody, true),
  deleteFocus: (focusId) => DeleteApi(`/focus?focusId=${focusId}`, true),

  //Meditations
  getMeditationsList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/meditation?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getExpertMeditationsList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/meditation?expertId=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),

  getDraftMeditationsList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/draft-meditation?&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getMeditationById: (id) => GetApi(`/meditation/${id}`, true),
  addMeditation: (reqBody) => PostApi('/meditation', reqBody, true),
  addDraftMeditation: (reqBody) => PostApi('/draft-meditation', reqBody, true),
  deleteMeditation: (meditationId) => DeleteApi(`/meditation?meditationId=${meditationId}`, true),

  //Affirmation
  getAffirmationList: (page, perPage, searchKey, filterQuery, sortBy, sortOrder, id) =>
    GetApi(
      `/affirmation?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),

  getDraftAffirmationList: () => GetApi(`/draft-affirmation`, true),
  getAffirmationById: (id) => GetApi(`/affirmation/${id}`, true),
  addEditAffirmation: (reqBody) => PostApi('/affirmation', reqBody, true),
  addEditDraftAffirmation: (reqBody) => PostApi('/draft-affirmation', reqBody, true),
  addEditAffirmationCSV: (reqBody, flag) => PostApi('/affirmation-csv', reqBody, true, flag),

  deleteAffirmation: (affirmationId) =>
    DeleteApi(`/affirmation?affirmationId=${affirmationId}`, true),

  //Gratitude
  getGratitudeList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/gratitude?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  addGratitude: (reqBody) => PostApi('/gratitude', reqBody, true),
  deleteGratitude: (gratitudeId) => DeleteApi(`/gratitude?gratitudeId=${gratitudeId}`, true),

  //Ritual
  getRitualList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/ritual?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),

  getDraftRitualList: () => GetApi(`/draft-ritual`, true),
  getRitualById: (id) => GetApi(`/ritual/${id}`, true),
  addRitual: (reqBody) => PostApi('/ritual', reqBody, true),
  addDraftRitual: (reqBody) => PostApi('/draft-ritual', reqBody, true),
  deleteRitual: (ritualId) => DeleteApi(`/ritual?ritualId=${ritualId}`, true),

  //BedTime Stories
  getBedTimeStoriesList: (page, perPage, searchKey) =>
    GetApi(`/story?page=${page}&perPage=${perPage}&searchKey=${searchKey}`, true),
  deleteBedTimeStory: (storyId) => DeleteApi(`/story?storyId=${storyId}`, true),

  //Earnings
  getEarnings: (page, perPage, searchKey, sortBy, sortOrder) =>
    GetApi(
      `/earnings?page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),

  //Sounds
  getSoundsList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/sound?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getExpertSoundsList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/sound?expertId=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getDraftSoundsList: () => GetApi(`/draft-sound`, true),
  getSoundById: (id) => GetApi(`/sound/${id}`, true),
  addSound: (reqBody) => PostApi('/sound', reqBody, true),
  addDraftSound: (reqBody) => PostApi('/draft-sound', reqBody, true),
  deleteSound: (soundId) => DeleteApi(`/sound?soundId=${soundId}`, true),

  //Top Picks
  getTopPicksList: (page, perPage, searchKey, id) =>
    GetApi(
      `/top-picks?id=${id ? id : ''}&page=${page}&perPage=${perPage}&searchKey=${searchKey}`,
      true
    ),
  addTopPick: (reqBody) => PostApi('/top-picks', reqBody, true),
  deleteTopPick: (pickId) => DeleteApi(`/top-picks?pickId=${pickId}`, true),

  //Manifestation
  getManifestationList: (page, perPage, searchKey) =>
    GetApi(`/manifestation?page=${page}&perPage=${perPage}&searchKey=${searchKey}`, true),
  deleteManifestation: (manifestationId) =>
    DeleteApi(`/manifestation?manifestationId=${manifestationId}`, true),

  //content approval
  getContentApprovalList: (page, perPage, searchKey, filterQuery, sortBy, sortOrder, id) =>
    GetApi(
      `/content-approval?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getContentApprovalView: (type, id) => GetApi(`/content-approval/${type}/${id}`, true),
  updateApproval: (reqBody) => PutApi('/content-approval', reqBody, true),

  //CMS
  getCMSList: (page, perPage, searchKey) =>
    GetApi(`/cms?page=${page}&perPage=${perPage}&searchKey=${searchKey}`, true),
  addEditCMS: (reqBody) => PostApi('/cms', reqBody, true),
  deleteCMS: (cmsId) => DeleteApi(`/cms?cmsId=${cmsId}`, true),

  //config
  getConfigList: () => GetApi('/config', true),
  updateConfig: (reqBody) => PostApi('/config', reqBody, true),

  //drafts
  getDraftsList: (page, perPage, searchKey, filterQuery, sortBy, sortOrder) =>
    GetApi(
      `/my-drafts?page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),

  // bulk action api
  postBulkAction: (reqBody) => PostApi('/content-status', reqBody, true),

  // bulk user action api
  postUserBulkAction: (reqBody) => PostApi('/user-status', reqBody, true),
  //content type
  getAllContentType: (contentTypeId) =>
    GetApi(`/content-type?contentType=${contentTypeId}`, {}, true),

  // config tutorial
  createTutorial: (reqBody) => PostApi('/tutorial-video', reqBody, true),

  // logout
  logoutUser: () => DeleteApi(`/device-token`, {}, true),
  adminAccess: () => GetApi(`/admin-access`, {}, true),
  getTutorialByType: (id) => GetApi(`/tutorial-video?contentType=${id}`, {}, true),

  // Shoorah Pods
  getShoorahPodsList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/shoorah-pods?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getExpertShoorahPodsList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/shoorah-pods?expertId=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),

  getDraftShoorahPodsList: () => GetApi(`/draft-shoorah-pods`, true),
  getShoorahPodsById: (id) => GetApi(`/shoorah-pods/${id}`, true),
  addShoorahPods: (reqBody) => PostApi('/shoorah-pods', reqBody, true),
  addDraftShoorahPods: (reqBody) => PostApi('/draft-shoorah-pods', reqBody, true),
  deleteShoorahPods: (podId) => DeleteApi(`/shoorah-pods?podId=${podId}`, true),
  getSOSClick: (dateRange) => PostApi('/sos-count', dateRange, true),
  addCompany: (companyData) => PostApi('/company/addCompany', companyData, true),
  getAllCompanies: (page, perPage, searchKey, sortBy, sortOrder) =>
    GetApi(
      `/company/company-list?page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  editCompany: (data, id) => PutApi(`/company/update/${id}`, data, true),
  getCompanyData: (id) => GetApi(`/company/${id}`, true),
  getEarningCount: () => GetApi('/company/contents/count', true),
  getTransactionData: (page, perPage, searchKey) =>
    GetApi(`/earning/companyEarnings?page=${page}&perPage=${perPage}&searchKey=${searchKey}`, true),
  getCompanyList: (sortBy, sortOrder) =>
    GetApi(`/company/company-list?page=1&perPage=0&sortBy=${sortBy}&sortOrder=${sortOrder}`, true),
  getOverallCompanyGraph: (id, year, type) =>
    GetApi(
      `/company/moods/analytics?${
        type ? `type=${type?.toLowerCase()}` : `company_id=${id}`
      }&year=${year}`,
      true
    ),

  // option api
  getCategoriesById: (id) => GetApi(`/getCategoriesByContentId/${id}`, true),

  // add on api
  AddUser: (reqBody) => PostApi('/add-user', reqBody, true),

  getPodExperts: (reqBody) =>
    GetApi(
      `/pod-expert-profile?page=${reqBody?.page}&limit=${reqBody?.limit}&search=${reqBody?.search}`,
      true
    ),
  addPodExperts: (reqBody) => PostApi('/pod-expert-profile', reqBody, true, true),
  updatePodExperts: (reqBody) => PutApi('/pod-expert-profile', reqBody, true),
  getPodExpertById: (id) => GetApi(`/pod-expert-profile?id=${id}`, true),
  getPodExpertsName: (id) => GetApi(`/pod-expert-name-list`, true),

  downloadSosGraphPdf: (startDate, endDate, reportType) =>
    DownloadApi(
      `/downloadSosClickReport?${
        reportType === 3
          ? `reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`
          : `reportType=${reportType}`
      }`
    ),

  getB2BviaGraphData: () => GetApi(`/getB2BviaGraph`, true),
  getB2bMoodData: () => GetApi(`/getB2BAdminMoodCounts`, true),

  getB2BEarningsGraphData: (id) => GetApi(`/getB2BEarningsGraph?companyId=${id}`, true),

  getUserPlansData: (type) => GetApi(`/getUserPlansData?type=${type}`, true),
  getGoogleAnalyticsData: (startDate, endDate, reportType) =>
    GetApi(
      `/googleAnalyticsData?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`,
      true
    ),

  getShuruUsageData: (startDate, endDate) =>
    GetApi(`/getShuruUsageTime?${`&startDate=${startDate}&endDate=${endDate}`}`, true),
  getAppIssues: (page, perPage) => GetApi(`/getAppIssues?page=${page}&perPage=${perPage}`, true),
  updateAppIssues: (reqBody) => PostApi(`/updateAppIssue`, reqBody, true),
  downloadAppIssue: (id) => GetApi(`/app-issue/${id}`, true),

  addEditPartner: (reqBody) => PostApi(`/add-partner`, reqBody, true),
  deletePartner: (userId) => DeleteApi(`/partners?userId=${userId}`, true),
  getPartners: (page, perPage, searchKey, filterQuery, sortBy, sortOrder, id) =>
    GetApi(
      `/partners?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getIntroduceCompanies: (page, perPage, searchKey, filterQuery, sortBy) =>
    GetApi(
      `/introduce-companies?page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}`,
      true
    ),
  // Surveys and ideas api starts from here
  getAllSurvey: (page, perPage, surveyName, draft, createdBy, createdOn) =>
    GetApi(
      `/survey?page=${page}&perPage=${perPage}&surveyName=${surveyName}&draft=${draft}&createdBy=${createdBy}&createdOn=${createdOn}`,
      true
    ),
  getAllCategory: () => GetApi('/category', true),
  addCategory: (reqBody) => PostApi('/category', reqBody, true),
  deleteSurvey: (surveyId) => DeleteApi(`/survey-delete?id=${surveyId}`, true),
  getSurveySummary: (surveyId) => GetApi(`/summary/${surveyId}`),
  getSurveyInsight: (surveyId) => GetApi(`/insights/${surveyId}`),
  uploadImage: (reqBody) => PostApi('/survey/upload', reqBody, true, true),
  getSurveyDashboardData: (type) => GetApi(`/dashboard?survey_count_type=${type}`, true),
  getSurveyTemplateList: (type) =>
    GetApi(`/survey-template${type ? '?template_type=' + type : ''}`, true),
  getSurveyInsights: (type) =>
    GetApi('/survey-template?result_type=insight' + (type ? `&template_type=${type}` : ''), true),
  getReport: (fileName = 'Question Summary') =>
    DownloadApi(`/survey/report?fromDate=2024-01-02&toDate=2024-02-04`, fileName),
  addSurvey: (reqBody) => PostApi('/survey', reqBody, true),
  updateSurvey: (surveyId, reqBody) => PutApi(`/survey/${surveyId}`, reqBody, true, true),
  getSurvey: (id) => GetApi(`/survey/${id}`, true),
  getCompanySurveyDashboardData: () => GetApi('/company-dashboard', true),
  getB2BSurveyDashboardData: () => GetApi('/dashboard', true),

  editIntroCompany: (reqBody) => PostApi(`/edit-introduce`, reqBody, true),
  getJobsPercent: (reqBody) => PostApi(`/get-jobs-percent`, reqBody, true),
  importUsers: (file) => PostApi(`/import-users`, file, true, true),
  b2bAdminList: (page, perPage, searchKey, filterQuery, sortBy, sortOrder, id, companyId) =>
    GetApi(
      `/b2b-admin-list?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}&companyId=${companyId}`,
      true
    ),

  deleteB2BAdmin: (id, company) => DeleteApi(`/delete-admin?id=${id}&company=${company}`, true),

  downloadB2BReport: (reqBody) => PostApi(`/b2b-overall-report`, reqBody, true),
  cancelSubscriptionUser: (reqBody) => PostApi(`/cancel-subscription`, reqBody, true),
  resentCredUsers: (reqBody) => PostApi(`/resend-creds`, reqBody, true),
  addTrialDays: (reqBody) => PostApi(`/add-user-trial`, reqBody, true),

  // vision ideas
  getDraftVisionIdeasList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/draft-idea?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),

  getVisionIdeasList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/idea?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  deleteVisionIdea: (visionId) => DeleteApi(`/idea-delete?ideaId=${visionId}`, true),
  addDraftVisionIdeas: (reqBody) => PostApi('/draft-idea', reqBody, true),
  addVisionIdeas: (reqBody) => PostApi('/idea', reqBody, true),
  getVisionIdeasById: (id) => GetApi(`/idea/${id}`, true),
  // Surveys and ideas api ends from here

  rippleUsage: (startDate, endDate, timeConstant) =>
    GetApi(
      `/ripple-usage?startDate=${startDate}&endDate=${endDate}&timeConstant=${timeConstant}`,
      true
    ),
  rippleReport: (startDate, endDate, timeConstant) =>
    DownloadApi(
      `/ripple-report?startDate=${startDate}&endDate=${endDate}&timeConstant=${timeConstant}`,
      `Ripple-report`
    ),

  getSleepLogPercent: () => GetApi(`/get-before-sleep`, true),
  getAfterSleepLogPercent: () => GetApi(`/get-after-sleep`, true),

  //Breathwork
  getBreathworkList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/breathwork?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getExpertBreathworkList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/breathwork?expertId=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getDraftBreathworksList: (page, perPage, searchKey, sortBy, sortOrder, id) =>
    GetApi(
      `/draft-breathwork?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getBreathworkById: (id) => GetApi(`/breathwork/${id}`, true),
  addBreathwork: (reqBody) => PostApi('/breathwork', reqBody, true),
  addDraftbreathwork: (reqBody) => PostApi('/draft-breathwork', reqBody, true),
  deleteBreathwork: (breathworkId) => DeleteApi(`/breathwork?breathworkId=${breathworkId}`, true),

  getBreathworkInsights: () => GetApi(`/breathwork-insights`, true),
  addSolutionData: (body) => PostApiBlob('/breathwork-solution', body, true),
  addBreathworkReportData: (body) => PostApiBlob('/add-breathwork-report', body, true),
  getSrtDatawithUrl: (url) => GetApi(`/srt-convert-text?url=${url}`, true),
  getUserActivityStats: (startDate, endDate) =>
    GetApi(`/count-users-and-usage?startDate=${startDate}&endDate=${endDate}`, true),
  updateSrtData: (reqBody) => PostApi(`/update-srt`, reqBody, true),

  getUserWellJournalData: (reportType, userId) =>
    GetApi(`/user-wellbeing-journal-data?reportType=${reportType}&userId=${userId}`, true),
  getUserWellShuruData: (reportType, userId) =>
    GetApi(`/user-wellbeing-shuru-data?reportType=${reportType}&userId=${userId}`, true),
  getUserWellPersonalData: (reportType, userId) =>
    GetApi(`/user-wellbeing-personal-data?reportType=${reportType}&userId=${userId}`, true),
  getUserWellProfessionalData: (reportType, userId) =>
    GetApi(`/user-wellbeing-professional-data?reportType=${reportType}&userId=${userId}`, true),

  getOverallWellJournalData: (reportType) =>
    GetApi(`/overall-wellbeing-journal-data?reportType=${reportType}`, true),
  getOverallWellShuruData: (reportType) =>
    GetApi(`/overall-wellbeing-shuru-data?reportType=${reportType}`, true),
  getOverallWellPersonalData: (reportType) =>
    GetApi(`/overall-wellbeing-personal-data?reportType=${reportType}`, true),
  getOverallWellProfessionalData: (reportType) =>
    GetApi(`/overall-wellbeing-professional-data?reportType=${reportType}`, true),
  getOverallWellReport: (reqBody) => PostApiBlob(`/overall-wellbeing-report`, reqBody, true),
  getSpecialistData: (page, perPage, userId,searchKey) =>
    GetApi(`/get-experts?page=${page}&perPage=${perPage}&id=${userId}&searchKey=${encodeURIComponent(searchKey)}`, true),
  postSpecialistData: (reqBody) => PostApi('/add-expert', reqBody, true),

  addEditPulseSurvey: (reqBody) => PostApi('/add-edit-survey', reqBody, true),
  addEditPulseSurveyCategory: (reqBody) => PostApi('/add-edit-categories', reqBody, true),
  getPulseSurveyCategories: () => GetApi(`/get-categories`, true),
  getPulseSurveys: (page, perPage, isDraft, isTemplate, surveyStatus, searchKey) =>
    GetApi(
      `/get-surveys?page=${page}&perPage=${perPage}&isDraft=${isDraft}&isTemplate=${isTemplate}&surveyStatus=${surveyStatus}&searchKey=${searchKey}`,
      true
    ),
  getPulseSurveyById: (surveyId) => GetApi(`/get-survey-by-id?surveyId=${surveyId} `, true),
  deletePulseSurvey: (id) => DeleteApi(`/delete-survey?surveyId=${id}`, true),
  subAdminIsDraft: (page, perPage, isDraft, isTemplate, surveyStatus, searchKey) =>
    GetApi(
      `/get-surveys?page=${page}&perPage=${perPage}&isDraft=${true}&isTemplate=${isTemplate}&surveyStatus=${surveyStatus}&searchKey=${searchKey}`,
      true
    ),
  getTemplates: () => GetApi('/get-templates', true),

  getAllUsersEmotions: (queryString) => GetApi(`/get-user-emotions${queryString}`, true),
  getUserEmotion: (queryString) => GetApi(`/get-emotions${queryString}`, true),

  getFeedbacksList: (page, perPage, searchKey, filters, sortBy, sortOrder) => {
    const isSortingByContentName = sortBy === 'display_name';
    return GetApi(
      `/get-user-feeds?page=${page}&perPage=${perPage}&searchKey=${searchKey}${filters}${
        isSortingByContentName
          ? `&sortBy=${sortBy}&sortOrder=${sortOrder}`
          : `&sortByFeedbackType=${sortBy}&sortOrderFeedback=${sortOrder}`
      }`,
      true
    );
  },

  submitApproval: (reqBody) => {
    return PostApi('/survey-approval', reqBody, true);
  },



  //Peap API's

  inviteToInterview: (reqBody) => PostApi('/expert-profile-action', reqBody, true),
  approvePeap: (reqBody) => PostApi('/inviteToInterview', reqBody, true),
  declinePeap: (reqBody) => PostApi('/inviteToInterview', reqBody, true),
  getPeapExpertList: (page, perPage) => {
    return GetApi(`/get-expert-status-list?page=${page}&perPage=${perPage}`, true);
  },

  // getAccountInfo: (expertId) => GetApi(`/get-expert-account-info?expertId=${expertId}`, true),

  getAccountInfo: (expertId) => GetApi(`/get-expert-account-info?expertId=${expertId}`, true),


};
