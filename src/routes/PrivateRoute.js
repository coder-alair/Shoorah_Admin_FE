import React, { useEffect } from 'react';
import { Route, useNavigate, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { cleanLocalStorage, getDeviceToken, getLocalStorageItem } from '../utils/helper';
import { Api } from '../api';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const navigate = useNavigate();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!getLocalStorageItem('token')) {
        if (getDeviceToken()) await Api.logoutUser();
        cleanLocalStorage();
        navigate('/login', { replace: true });
      }
    };

    checkAuthentication();
  }, [navigate]);

  const isAccessible = (path) => {
    const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
    const isAdminURLList = [
      '/sub-admins',
      '/sub-admins/add-edit',
      '/content-approval',
      '/content-approval/view',
      '/view-survey/:surveyId'
    ];
    const isEarningList = ['/earning'];
    const isDraft = ['/draft', '/draft/view'];
    if (isAdminURLList.includes(path)) {
      if (userData.userType === 1) {
        return true;
      }
    } else if (isDraft.includes(path)) {
      if (userData.userType === 0) {
        return true;
      }
    } else if (isEarningList.includes(path)) {
      if (!userData?.moduleAccess?.earning_module_access) {
        return true;
      }
    } else if (userData.userType === 3 || userData.userType === 4) {
      return false;
    } else {
      return false;
    }
  };

  const pathAccess = (path) => {
    if (path.includes(':slug')) {
      if (
        userData.userType === 3 ||
        userData.userType === 4 ||
        rest?.computedMatch?.params?.slug.toLowerCase() === userData?.slug.toLowerCase()
      ) {
        return true;
      }
      navigate('/login', { replace: true });
      cleanLocalStorage();
      return true;
    } else {
      if (path === '/users/view' && (userData.userType === 3 || userData.userType === 4)) {
        return true;
      }
      return false;
    }
  };

  return (
    <Route
      {...rest}
      element={(props) =>
        getLocalStorageItem('token') ? (
          pathAccess(rest?.path) ? (
            userData.userType === 3 || userData.userType === 4 ? (
              <Component {...props} />
            ) : (
              // <Navigate to="/login" /
              <Component {...props} />
            )
          ) : isAccessible(rest?.path) ? (
            // <Navigate to="/dashboard" />
            <Component {...props} />
          ) : (
            <Component {...props} />
          )
        ) : (
          // <Navigate to="/login" />
          <Component {...props} />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.object,
  rest: PropTypes.object
};

export default PrivateRoute;
