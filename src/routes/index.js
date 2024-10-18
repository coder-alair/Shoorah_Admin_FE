// import { BellIcon } from '@heroicons/react/24/outline';
// import { ChevronDownIcon } from '@heroicons/react/20/solid';
// import LazyLoadImageProp from '../component/common/LazyLoadImage';
import { motion, AnimatePresence } from 'framer-motion';
import React, { lazy, memo, Suspense, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import allRoutes from '../routes/RouteFile';
import b2bRoutes from './adminRoutes';
import partnerRoutes from './partnerRoutes';
import expertRoutes from './expertRoutes';

import Loader from '../component/common/Loader';
import PropTypes from 'prop-types';
import Sidebar from '../layout/Sidebar';
import useWindowDimensions, { cleanLocalStorage, getLocalStorageItem } from '../utils/helper';
import { SidebarContext } from '../context/SidebarContext';
import RightSidebar from '../layout/RightSidebar';

import { useState } from 'react';
import PartnerSidebar from '../layout/PartnerSidebar';
import { Api } from '../api';
import ExpertSidebar from '../layout/expertSidebar';
// const NotFound = lazy(() => import('../container/404NotFound'));
const Login = lazy(() => import('../container/Login'));

const LoadSideBar = () => {
  const location = useLocation();
  return (
    <>
      {!['/login', '/reset-password', '/forgot-password']?.includes(location?.pathname) && (
        <Sidebar />
      )}
    </>
  );
};

const RoutesList = memo(() => {
  const { width } = useWindowDimensions();
  const { setShow } = useContext(SidebarContext);

  useEffect(() => {
    if (width < 1024) {
      setShow(false);
    }
  }, [width]);

  return (
    <Router>
      <ConditionalRoute />
    </Router>
  );
});

export const ConditionalRoute = () => {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState(0);

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const name = userData?.name?.split(' ');
  const userType = userData?.userType;
  const [RoutesFile, setRoutesFile] = useState([]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const getUnreadNotificationCount = () => {
    Api.getUnreadNotificationCount()
      .then((res) => {
        setNotificationCounts(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (
      window.location.pathname !== '/login' &&
      (userData?.userType === 0 || userData?.userType === 1)
    )
      getUnreadNotificationCount();
  }, [window.location.pathname]);

  useEffect(() => {
    if (window.location.pathname !== '/login')
      if (userData?.userType === 0 || userData?.userType === 1) {
        setRoutesFile(allRoutes);
      } else if (userData?.userType === 3 || userData?.userType === 4) {
        setRoutesFile(b2bRoutes);
      } else if (userData?.userType === 5) {
        setRoutesFile(partnerRoutes);
      } else if (userData?.userType === 6) {
        setRoutesFile(expertRoutes);
      } else {
        setRoutesFile(allRoutes);
      }

    if (userData?.userType === 2) {
      cleanLocalStorage();
      window.location.href = '/login';
    }
  }, [window.location.pathname]);

  return (
    <>
      {!['/login', '/reset-password', '/forgot-password']?.includes(location?.pathname) ? (
        <>
          <div className="h-screen lg:p-4 grid grid-cols-6 overflow-hidden ">
            <motion.div
              initial={{
                x: -100,
                opacity: 0
              }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  duration: 0.5
                }
              }}
              className="lg:col-span-1 pointer-events-none h-[90%] lg:h-[95vh] lg:relative fixed z-50  "
            >
              <div
                onClick={() => {
                  setIsDrawerOpen(true);
                }}
                className="fixed pointer-events-auto w-10 h-10 p-1 dark:bg-shoorah-darkBgTabColor bg-white rounded-full shadow-md left-4 top-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className=" w-full h-full dark:text-white text-shoorah-sidebarBackground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </div>
              <div
                className={`h-full   ${
                  isDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 '
                } transition-transform relative pointer-events-auto `}
              >
                <LoadSideBar />

                {isDrawerOpen && (
                  <div
                    onClick={() => {
                      setIsDrawerOpen(false);
                    }}
                    className="absolute w-8 h-8 p-1 bg-white shadow-md dark:bg-shoorah-darkBgTabColor dark:text-white rounded-full -right-10 top-6"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-full h-full"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
            <AnimatePresence exitBeforeEnter={true}>
              <motion.div
                key={location?.pathname}
                initial={{
                  y: 100,
                  opacity: 0
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5
                  }
                }}
                className={`${
                  userType === 0 || userType === 1
                    ? 'lg:col-span-5 col-span-6'
                    : 'lg:col-span-4 col-span-6'
                } hide-scrollbar pb-8 lg:pt-0 pt-14 h-full lg:h-screen overflow-y-auto`}
              >
                <Suspense fallback={<Loader />}>
                  <Routes>
                    {RoutesFile.map((itm, key) =>
                      itm.private ? (
                        <Route
                          key={key}
                          exact={itm.exact}
                          path={itm.path}
                          name={itm.name}
                          Component={itm.component}
                        />
                      ) : (
                        <Route
                          key={key}
                          exact={itm.exact}
                          path={itm.path}
                          name={itm.name}
                          Component={itm.component}
                        />
                      )
                    )}
                    <Route exact path="/login" element={<Login />}>
                      {/* <Navigate to="/login" component={Login} /> */}
                    </Route>
                    <Route exact path="/" element={<Navigate to="/login" />}>
                      {/* <Navigate to="/login" component={Login} /> */}
                    </Route>
                    {/* <Route component={NotFound} /> */}
                  </Routes>
                </Suspense>

                {/* super admin custom header */}
              </motion.div>
            </AnimatePresence>

            {(userType === 3 || userType === 4) && (
              <motion.div
                initial={{
                  x: 100,
                  opacity: 0
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5
                  }
                }}
                className="col-span-1 lg:block absolute lg:relative right-4 top-5 lg:right-auto lg:top-auto  lg:h-[95vh]"
              >
                <RightSidebar />
              </motion.div>
            )}

            {userType === 5 && (
              <motion.div
                initial={{
                  x: 100,
                  opacity: 0
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5
                  }
                }}
                className="col-span-1 lg:block absolute lg:relative right-4 top-5 lg:right-auto lg:top-auto  lg:h-[95vh]"
              >
                <PartnerSidebar />
              </motion.div>
            )}

            {userType === 6 && (
              <motion.div
                initial={{
                  x: 100,
                  opacity: 0
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5
                  }
                }}
                className="col-span-1 lg:block absolute lg:relative right-4 top-5 lg:right-auto lg:top-auto  lg:h-[95vh]"
              >
                <ExpertSidebar />
              </motion.div>
            )}
          </div>
        </>
      ) : (
        <>
          <LoadSideBar />
          <Suspense fallback={<Loader />}>
            <Routes>
              {RoutesFile.map((itm, key) =>
                itm.private ? (
                  <Route
                    key={key}
                    exact={itm.exact}
                    path={itm.path}
                    name={itm.name}
                    Component={itm.component}
                  />
                ) : (
                  <Route
                    key={key}
                    exact={itm.exact}
                    path={itm.path}
                    name={itm.name}
                    Component={itm.component}
                  />
                )
              )}
              <Route exact path="/login" element={<Login />}></Route>
              <Route exact path="/" element={<Navigate to="/login" />}></Route>
            </Routes>
          </Suspense>{' '}
        </>
      )}
    </>
  );
};

RoutesList.propTypes = {
  isShow: PropTypes.any,
  setShow: PropTypes.any
};

export default RoutesList;
