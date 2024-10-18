import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getLocalStorageItem, isSuperAdmin } from '../../utils/helper';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Api } from '../../api';
import { Fragment, useEffect, useState } from 'react';
const Breadcrumb = ({ pageList }) => {
  const location = useLocation();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const userType = userData?.userType;
  const name = userData?.name?.split(' ');
  const [notificationCounts, setNotificationCounts] = useState(0);
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
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  return (
    <nav className=" flex px-3 mt-3 border-b border-gray-200 pb-4" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link
              to={`${
                userData && (userData.userType === 3 || userData.userType === 4)
                  ? '/' + (userData.slug || '') + '/dashboard'
                  : userData && userData.userType === 5
                  ? '/partner-dashboard'
                  : '/dashboard'
              }`}
              className={`
                ${
                  location?.pathname === '/dashboard' ||
                  location?.pathname === '/' + (userData?.slug || '') + '/dashboard'
                    ? 'cursor-default'
                    : 'hover:text-gray-500 dark:hover:text-white'
                }
                text-gray-400 dark:text-white`}
            >
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pageList?.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 dark:text-white text-gray-400"
                aria-hidden="true"
              />
              {page.nonClickable ? (
                <p className="text-shoorah-primary dark:text-white cursor-default ml-4 text-sm font-medium">
                  {page.name}
                </p>
              ) : (
                <Link
                  to={page.href}
                  className={`${
                    page.href === location?.pathname
                      ? 'text-shoorah-primary dark:text-white cursor-default'
                      : 'text-gray-500 cursor-pointer dark:text-white hover:text-gray-700'
                  } ml-4 text-sm font-medium `}
                  aria-current={page.current ? 'page' : undefined}
                >
                  {page.name}
                </Link>
              )}
            </div>
          </li>
        ))}
        <li>
          {' '}
          {(userType === 0 || userType === 1) && (
            <div className="  fixed bg-shoorah-primary  py-3   flex justify-center items-center right-8 top-0 rounded-b-xl">
              <div className="flex ">
                <div className="self-center px-4 lg:px-7 ">
                  <div
                    onClick={() => {
                      userType === 3 || userType === 4
                        ? (window.location.href = `/${userData.slug}/notifications`)
                        : (window.location.href = '/notifications');
                    }}
                    className="w-8 aspect-square p-1 shadow-2xl flex justify-center  relative rounded-[50%] border border-[#EAEAEA] text-shoorah-customGray cursor-pointer self-center"
                  >
                    <BellIcon className="relative w-full dark:text-white text-white" />
                    {notificationCounts > 0 && (
                      <div className="absolute -right-[15px] shadow-2xl -top-[10px] rounded-[50%] text-white text-[12px] flex justify-center align-middle text-center bg-[red] h-[25px] w-[25px]">
                        <p className="self-center">
                          {notificationCounts > 99 ? '99+' : notificationCounts}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <Menu as="div">
                  <div className="flex">
                    <Menu.Button className="w-full justify-center text-sm font-medium text-gray-700 focus:outline-none">
                      <div className="flex relative">
                        {/* {userData?.profile ? (
                              // {false ? (
                                <LazyLoadImageProp
                                  src={userData.profile}
                                  className="w-[50px] h-[50px] self-center rounded-full border border-[#EAEAEA]"
                                />
                              ) : ( */}
                        <div className="self-center bg-black flex justify-center items-center w-9 aspect-square p-1 rounded-full">
                          <span className="text-white">{name && name[0]?.charAt(0)}</span>
                          <span className="text-white">{name && name[1]?.charAt(0)}</span>
                        </div>
                        {/* )} */}
                        <div className="text-start self-center ml-3 hidden lg:block">
                          <p className="text-white dark:text-white text-[18px] m-0">
                            {userData?.name}
                          </p>
                          <span className="text-white dark:text-white font-light">
                            {userData?.userType === 0
                              ? 'Super Admin'
                              : userData?.userType === 1
                              ? 'Sub Admin'
                              : userData?.userType === 3
                              ? 'Company Admin'
                              : userData?.userType === 4
                              ? 'Company Sub Admin'
                              : userData?.userType === 5
                              ? 'Partner'
                              : ''}
                          </span>
                        </div>
                        <ChevronDownIcon className="lg:ml-3 w-[25px] text-white" />
                      </div>
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute shadow-lg right-0 z-10 mt-2 w-56 origin-top-right rounded-md dark:bg-shoorah-darkBgTabColor bg-white ring-1 ring-shoorah-primary ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={
                                userType === 3 || userType === 4
                                  ? `/${userData.slug}/change-password`
                                  : '/change-password'
                              }
                              className={classNames(
                                active
                                  ? 'bg-gray-100 dark:text-white text-gray-900'
                                  : ' dark:text-white text-gray-700',
                                'block px-4 py-2 text-sm hover:bg-inherit'
                              )}
                            >
                              Change Password
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          )}
        </li>
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  pageList: PropTypes.any
};

export default Breadcrumb;
