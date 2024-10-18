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

const GetApi = (tag = '', isHeader = false) => {
  return axios
    .get(BASE_URL + 'partner/v1' + tag, {
      headers: isHeader
        ? {
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

const PostApi = (tag = '', reqBody, isHeader = false, flag = false) => {
  let flagCheck = flag
    ? 'multipart/form-data; boundary=----WebKitFormBoundaryueI4YvrqiXxUgVGA'
    : 'application/json';

  return axios
    .post(BASE_URL + 'partner/v1' + tag, reqBody, {
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

const DeleteApi = (tag = '', isHeader = false) => {
  return axios
    .delete(BASE_URL + 'partner/v1' + tag, {
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
    .put(BASE_URL + 'partner/v1' + tag, reqBody !== null && reqBody, {
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
        cleanLocalStorage();
        window.location.href = '/login';
      } else {
        cleanLocalStorage();
        window.location.href = '/login';
      }
    });
};

export const PartnerApi = {
  getProfile: () => GetApi(`/partner-profile`, true),
  updateProfile: (reqBody) => PutApi(`/partner-profile`, reqBody, true),
  addIntroduceCompany: (reqBody) => PostApi(`/add-introduce`, reqBody, true),
  getIntroduceCompanies: (page, perPage, searchKey, filterQuery, sortBy, sortOrder) =>
    GetApi(
      `/introduce-companies?page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getPartnerContentCounts: () => GetApi(`/partner-content-counts`, true),
  getEarnings: (page, perPage, searchKey) =>
    GetApi(`/partner-earnings?page=${page}&perPage=${perPage}&searchKey=${searchKey}`, true),
  getMyIntroduceCompanies: (page, perPage, searchKey, filterQuery, sortBy, sortOrder) =>
    GetApi(
      `/my-introduced-companies?page=${page}&perPage=${perPage}&searchKey=${searchKey}${filterQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      true
    ),
  getRevenueData: (id) => GetApi(`/get-revenue-data?companyId=${id}`, true),
  getUnreadNotificationCount: () => GetApi('/unread-notification', true),
  //push notifications
  getAllNotifications: (type, page, perPage, searchKey) =>
    GetApi(
      `/notification?page=${page}&perPage=${perPage}&searchKey=${searchKey}&notificationListType=${type}`,
      true
    ),
  addPushNotification: (reqBody) => PostApi('/notification', reqBody, true),
  deleteNotification: (notificationId, deleteType) =>
    DeleteApi(`/notification?deleteType=${deleteType}&notificationId=${notificationId}`, true),

  getCms: (cmsAlias) => GetApi(`/get-cms?cmsAlias=${cmsAlias}`, true)
};
