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
import { Api } from '.';

const BASE_URL = API_BASE_URL || 'https://staging-api.shoorah.io/';

const GetApi = (tag = '', isHeader = false) => {
  return axios
    .get(BASE_URL + 'company/v1' + tag, {
      headers: isHeader
        ? {
            Authorization: getJWTToken(),
            deviceToken: getLocalStorageItem('deviceToken'),
            deviceType: 3
          }
        : {}
    })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

const PostApi = (tag = '', reqBody, isHeader = false, flag = false) => {
  let flagCheck = flag
    ? 'multipart/form-data; boundary=----WebKitFormBoundaryueI4YvrqiXxUgVGA'
    : 'application/json';

  return axios
    .post(BASE_URL + 'company/v1' + tag, reqBody, {
      headers: isHeader
        ? {
            'Content-Type': flagCheck,
            accept: 'application/json',
            deviceToken: getLocalStorageItem('deviceToken'),
            deviceType: 3,
            Authorization: getJWTToken()
          }
        : {}
    })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

const PostApiBlob = (tag = '', reqBody) => {
  return axios
    .post(BASE_URL + 'company/v1' + tag, reqBody, {
      headers: {
        deviceType: 3,
        Authorization: getJWTToken()
      },
      responseType: 'blob'
    })
    .then((res) => {
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = reqBody.graphName; // Specify the filename
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

const DeleteApi = (tag = '', isHeader = false) => {
  return axios
    .delete(BASE_URL + 'company/v1' + tag, {
      headers: isHeader
        ? {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: getJWTToken(),
            deviceToken: getDeviceToken()
          }
        : {}
    })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
};

const PutApi = (tag = '', reqBody, isHeader) => {
  const headers = {
    accept: 'application/json',
    Authorization: getJWTToken()
  };
  return axios
    .put(BASE_URL + 'company/v1' + tag, reqBody !== null && reqBody, {
      headers: isHeader ? headers : {}
    })
    .then((data) => {
      return data;
    })
    .catch(async (e) => {
      ErrorHandler(e);
    });
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
      `${BASE_URL}company/v1/refresh-token`,
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

export const CompanyApi = {
  addCompanyUser: (data) => PostApi('/addUser', data, true),
  deleteUser: (id) => DeleteApi(`/delete-user?id=${id}`, true),
  getComanyUser: (id) => GetApi(`/company-user/${id}`, true),
  updateCompanyUser: (id, data) => PutApi(`/user-update/${id}`, data, true),
  getCompanyUser: (page, perPage, searchKey) =>
    GetApi(`/users?page=${page}&perPage=${perPage}&searchKey=${searchKey}`, true),
  importMultiUser: (file) => PostApi('/addmultyUser', file, true, true),
  getPersonalMoodsGraphData: (
    startDate,
    endDate,
    department,
    minAge,
    maxAge,
    country,
    ethnicity,
    gender,
    dataType,
    companyId
  ) =>
    GetApi(
      `/dashboard/personal-moods?startDate=${startDate}&endDate=${endDate}&department=${department}&minAge=${minAge}&maxAge=${maxAge}&country=${country}&ethnicity=${ethnicity}&gender=${gender}&dataType=${dataType}${
        companyId ? '&company_id=' + companyId : ''
      }`,
      true
    ),
  getFilterData: (companyId) =>
    GetApi(`/filter-user-data${companyId ? '?company_id=' + companyId : ''}`, true),
  getProfessionalMoodsGraphData: (
    startDate,
    endDate,
    department,
    minAge,
    maxAge,
    country,
    ethnicity,
    gender,
    dataType,
    companyId
  ) =>
    GetApi(
      `/dashboard/professional-moods?startDate=${startDate}&endDate=${endDate}&department=${department}&minAge=${minAge}&maxAge=${maxAge}&country=${country}&ethnicity=${ethnicity}&gender=${gender}&dataType=${dataType}${
        companyId ? '&company_id=' + companyId : ''
      }`,
      true
    ),
  getOverallScore: (
    startDate,
    endDate,
    department,
    minAge,
    maxAge,
    country,
    ethnicity,
    gender,
    emotionType,
    companyId,
    theraphyData
  ) =>
    GetApi(
      `/dashboard/mood/overall-score?startDate=${startDate}&endDate=${endDate}&department=${department}&minAge=${minAge}&maxAge=${maxAge}&country=${country}&ethnicity=${ethnicity}&gender=${gender}&moodType=${emotionType}&theraphyData=${theraphyData}${
        companyId ? '&company_id=' + companyId : ''
      }`,
      true
    ),
  addSolutionData: (body) => PostApiBlob('/add-solution', body, true),
  getUnreadNotificationCount: () => GetApi('/unread-notification', true),
  getSolutionByFilters: (
    startDate,
    endDate,
    minAge,
    maxAge,
    department,
    location,
    gender,
    dataType,
    emotionType,
    ethnicity,
    graphName
  ) =>
    GetApi(
      `/get-solution?startDate=${startDate}&endDate=${endDate}&minAge=${minAge}&maxAge=${maxAge}&department=${department}&location=${location}&gender=${gender}&dataType=${dataType}&emotionType=${emotionType}&ethnicity=${ethnicity}&graphName=${graphName}`,
      true
    ),
  getAllSolutions: (pageNumber, pageSize, searchKey) =>
    GetApi(
      `/get-allsolution?pageNumber=${pageNumber}&pageSize=${pageSize} ${
        searchKey ? `&searchKey=${searchKey}` : ''
      }`,
      true
    ),
  addReport: (body) => PostApi('/add-report', body, true),
  getAllReports: (page, perPage, searchKey) =>
    GetApi(`/get-allreports?page=${page}&perPage=${perPage}&searchKey=${searchKey}`, true),
  getSingleReport: (id) => GetApi(`/get-report?id=${id}`, true),
  getB2BbadgesStatsByGender: (id, startDate, endDate, badges) =>
    GetApi(
      `/getB2BbadgesStatsByGender?companyId=${id}&startDate=${startDate}&endDate=${endDate}&badges=${badges}`,
      true
    ),
  getBadgesStats: (id, startDate, endDate, badges, gender) =>
    GetApi(
      `/getBadgesStats?companyId=${id}&startDate=${startDate}&endDate=${endDate}&badgeType=${badges}&gender=${gender}`,
      true
    ),

  getTotalBadges: (id, startDate, endDate) => GetApi(`/getTotalBadges?companyId=${id}`, true),

  getShuruTheraphyData: (
    startDate,
    endDate,
    companyId,
    minAge,
    maxAge,
    department,
    location,
    gender,
    dataType,
    emotionType,
    ethnicity,
    graphName
  ) =>
    GetApi(
      `/shuru-theraphy-graph?startDate=${startDate}&endDate=${endDate}&companyId=${companyId}&minAge=${minAge}&maxAge=${maxAge}&department=${department}&location=${location}&gender=${gender}&dataType=${dataType}&emotionType=${emotionType}&ethnicity=${ethnicity}&graphName=${graphName}`
    ),

  // getSecondCompanyGraphData: (id, startDate, endDate) =>
  //   PostApi(`/match?company_id=${id}`, {}, true),

  getSecondCompanyGraphData: (id, startDate, endDate) => {
    return axios
      .post(
        `https://suru-therapy.shoorah.io/match?company_id=${id}${
          startDate || endDate ? `&startDate=${startDate}&endDate=${endDate}` : ''
        }`,
        {},
        {
          headers: true
            ? {
                'Content-Type': 'application/json',
                accept: 'application/json',
                deviceToken: getLocalStorageItem('deviceToken'),
                deviceType: 3,
                Authorization: getJWTToken()
              }
            : {}
        }
      )
      .then((data) => {
        return data;
      })
      .catch(async (e) => {
        ErrorHandler(e);
      });
  },

  // new b2b dashboard apis

  getB2BAdminList: (companyId) => GetApi(`/getB2BAdminList`, true),

  addB2BMood: (body) => PostApi('/addB2BMood', body, true),

  getActiveUsersAndTime: (id) => GetApi(`/getActiveUsersAndTime?companyId=${id}`, true),

  getRecentJoinedEmployees: (id) => GetApi(`/getRecentJoinedEmployees?companyId=${id}`, true),

  getEmployeeActivity: (id) => GetApi(`/getEmployeeActivity?companyId=${id}`, true),

  getTrendingContent: (id) => GetApi(`/getTrendingContent?companyId=${id}`, true),

  getJournalContentUsage: (
    startDate,
    endDate,
    department,
    minAge,
    maxAge,
    country,
    ethnicity,
    gender,
    emotionType,
    companyId
  ) =>
    GetApi(
      `/getJournalContentUsage?companyId=${companyId}&type=${1}&&startDate=${startDate}&endDate=${endDate}&department=${department}&minAge=${minAge}&maxAge=${maxAge}&country=${country}&ethnicity=${ethnicity}&gender=${gender}&moodType=${emotionType}${
        companyId ? '&company_id=' + companyId : ''
      }`,
      true
    ),

  getB2BAdminMood: (id) => GetApi(`/getB2BAdminMood`, true),
  getB2BUsers: (id) => GetApi(`/getB2BUsers`, true),

  sendPraiseToUsers: (body) => PostApi('/sendPraiseToUsers', body, true),

  getSolutionTextFromOpenAi: (body) =>
    axios
      .post(BASE_URL + 'api/v1/openai', body, {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          deviceToken: getLocalStorageItem('deviceToken'),
          deviceType: 3,
          Authorization: getJWTToken()
        }
      })
      .then((data) => {
        return data;
      })
      .catch(async (e) => {
        ErrorHandler(e);
      }),

  getReport: (body) => PostApiBlob('/add-report', body, true),

  getSosData: (body) => PostApi('/sos-clicks', body, true),

  getSosReport: (body) => PostApiBlob('/sos-report', body, true),

  //push notifications
  getAllNotifications: (type, page, perPage, searchKey) =>
    GetApi(
      `/notification?page=${page}&perPage=${perPage}&searchKey=${searchKey}&notificationListType=${type}`,
      true
    ),
  addPushNotification: (reqBody) => PostApi('/notification', reqBody, true),
  deleteNotification: (notificationId, deleteType) =>
    DeleteApi(`/notification?deleteType=${deleteType}&notificationId=${notificationId}`, true),

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

  getUserEmailList: (url, page, perPage, searchKey) =>
    GetApi(`/${url}?page=${page}&perPage=${perPage}&searchKey=${searchKey}`, true),

  getBeforeSleepData: (
    startDate,
    endDate,
    department,
    minAge,
    maxAge,
    country,
    ethnicity,
    gender,
    dataType,
    companyId
  ) =>
    GetApi(
      `/get-before-sleep-data?startDate=${startDate}&endDate=${endDate}&department=${department}&minAge=${minAge}&maxAge=${maxAge}&country=${country}&ethnicity=${ethnicity}&gender=${gender}&dataType=${dataType}${
        companyId ? '&company_id=' + companyId : ''
      }`,
      true
    ),
  getAfterSleepData: (
    startDate,
    endDate,
    department,
    minAge,
    maxAge,
    country,
    ethnicity,
    gender,
    dataType,
    companyId
  ) =>
    GetApi(
      `/get-after-sleep-data?startDate=${startDate}&endDate=${endDate}&department=${department}&minAge=${minAge}&maxAge=${maxAge}&country=${country}&ethnicity=${ethnicity}&gender=${gender}&dataType=${dataType}${
        companyId ? '&company_id=' + companyId : ''
      }`,
      true
    ),

  addSleepReport: (body) => PostApiBlob('/add-sleep-report', body, true),
  addBreathworkReport: (body) => PostApiBlob('/add-breathwork-report', body, true),

  getCompanyStatus: (id) => GetApi(`/get-company-status?id=${id}`, true),

  getCompanyEmotionData: (timeRange) => {
    GetApi(`/get-user-emotions${timeRange}`, true);
  },

  getPaymentIntend: (reqBody) => PostApi(`/create-session`, reqBody, true),
  getPaymentSeatIntend: (reqBody) => PostApi('/create-seat-session', reqBody, true),
  getBreathworkInsights: (
    startDate,
    endDate,
    department,
    minAge,
    maxAge,
    country,
    ethnicity,
    gender,
    emotionType,
    companyId
  ) =>
    GetApi(
      `/breathwork-company-insights?companyId=${companyId}&type=${1}&&startDate=${startDate}&endDate=${endDate}&department=${department}&minAge=${minAge}&maxAge=${maxAge}&country=${country}&ethnicity=${ethnicity}&gender=${gender}&moodType=${emotionType}${
        companyId ? '&company_id=' + companyId : ''
      }`,
      true
    ),
  getClientToken: (reqBody) => PostApi(`/get-client-token`, reqBody, true),
  getUserActivityStats: (startDate, endDate) =>
    GetApi(`/B2B-users-and-usage?startDate=${startDate}&endDate=${endDate}`, true),

  resetAutoRenew: (reqBody) => PostApi('/reset-auto-renew', reqBody, true),
  addEditPulseSurveyB2b: (reqBody) => PostApi('/add-edit-b2b-survey', reqBody, true),
  addEditPulseSurveyCategoryB2b: (reqBody) => PostApi('/add-edit-b2b-categories', reqBody, true),
  getPulseSurveyCategoriesB2b: () => GetApi(`/get-b2b-categories`, true),
  getPulseSurveysB2b: (page, perPage, isDraft, isTemplate, surveyStatus, searchKey) =>
    GetApi(
      `/get-b2b-surveys?page=${page}&perPage=${perPage}&isDraft=${isDraft}&isTemplate=${isTemplate}&surveyStatus=${surveyStatus}&searchKey=${searchKey}`,
      true
    ),
  getPulseSurveyByIdB2b: (surveyId) => GetApi(`/get-b2b-survey-by-id?surveyId=${surveyId} `, true),
  deletePulseSurveyB2b: (id) => DeleteApi(`/delete-b2b-survey?surveyId=${id}`, true),
  getContentApprovalListB2b: (page, perPage, searchKey, filterQuery, sortBy, sortOrder, id) =>
    GetApi(
      `/b2b-content-approval?id=${
        id ? id : ''
      }&page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  subAdminIsDraftB2b: (page, perPage, isDraft, isTemplate, surveyStatus, searchKey) =>
    GetApi(
      `/get-b2b-surveys?page=${page}&perPage=${perPage}&isDraft=${true}&isTemplate=${isTemplate}&surveyStatus=${surveyStatus}&searchKey=${searchKey}`,
      true
    ),
  getTemplates: () => GetApi(`/b2b-templates-survey`, true),

  getAllUsersEmotions: (queryString) => GetApi(`/get-user-emotions${queryString}`, true),
  getUserEmotion: (queryString) => GetApi(`/get-b2b-user-emotions${queryString}`, true),
  submitApprovalB2b: (reqBody) => {
    return PostApi('/b2b-survey-approval', reqBody, true);
  }
};
