import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  cleanLocalStorage,
  errorToast,
  getLocalStorageItem,
  getDeviceToken,
  isSuperAdmin
} from '../utils/helper';
import { BellIcon } from '@heroicons/react/24/outline';
import { isSupported } from 'firebase/messaging';
import { onMessageListener, requestForToken } from '../firebase';
import { Api } from '../api';
import NotificationPopup from '../component/common/NotificationPopup';
import LazyLoadImageProp from '../component/common/LazyLoadImage';
import { useContext } from 'react';
import { SidebarContext } from '../context/SidebarContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Header({ unreadNotiCount, location }) {
  const { isShow, setShow } = useContext(SidebarContext);
  const [showPopup, setShowPopup] = useState(false);
  const [notificationData, setNotificationData] = useState({});
  const [notificationCounts, setNotificationCounts] = useState(0);
  const param = useParams();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  isSupported()?.then(async (res) => {
    if (res) {
      const response = await requestForToken();
      if (response) {
        onMessageListener()
        .then((data) => {
          setNotificationData({
            title: data?.notification?.title,
            body: data?.notification?.body
          });
          setShowPopup(true);
        })
        .catch((err) => errorToast(err));
      }

     
    }
  });
  const handleLogout = async () => {
    if (getDeviceToken()) await Api.logoutUser();
    cleanLocalStorage();
    navigate('/login');
  };

  const getUnreadNotificationCount = async () => {
    Api.getUnreadNotificationCount()
      .then((res) => {
        setNotificationCounts(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUnreadNotificationCount();
  }, []);

  const name = userData?.name?.split(' ');
  const navigate = useNavigate();
  return (
    <>
      <div
        className={`px-4 h-[88px] py-2 border-b dark:border-none dark:bg-shoorah-darkBgTabColor bg-white flex items-center justify-between fixed left-0 right-0 top-0 ${isShow ? 'z-40' : 'z-40'
          } lg:z-40`}
      >
        <div className="flex items-center justify-between mb-0">
          {!isShow && (
            <Bars3Icon
              className="w-[25px] text-shoorah-customGray dark:text-white self-center mr-3 cursor-pointer"
              onClick={() => setShow(!isShow)}
            />
          )}
        </div>
        {/* {userData?.userType === 3 && <div className={''}>{userData?.name}</div>} */}
        <div className="flex h-[88px]">
          <div className="self-center border-r border-[#ECECEC] px-7 mx-7">
            <div
              onClick={() => {
                !isSuperAdmin()
                  ? navigate(`/${userData.slug}/notifications`)
                  : navigate('/notifications');
              }}
              className="w-[50px] h-[50px] shadow-2xl flex justify-center p-2 relative rounded-[50%] border border-[#EAEAEA] text-shoorah-customGray cursor-pointer self-center"
            >
              <BellIcon className="w-[25px] dark:text-white text-[#2A2F3B]" />
              {notificationCounts > 0 && (
                <div className="absolute -right-[5px] shadow-2xl -top-[8px] rounded-[50%] bg-gradient-to-r text-white text-[12px] flex justify-center align-middle text-center from-shoorah-primary to-shoorah-secondary bg-red-500 h-[25px] w-[25px]">
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
                <div className="flex h-[88px] relative">
                  {userData?.profile ? (
                    <LazyLoadImageProp
                      src={userData.profile}
                      className="w-[50px] h-[50px] self-center rounded-full border border-[#EAEAEA]"
                    />
                  ) : (
                    <div className="self-center bg-black flex justify-center items-center w-[50px] h-[50px] rounded-full">
                      <span className="text-white">{name && name[0]?.charAt(0)}</span>
                      <span className="text-white">{name && name[1]?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="text-start self-center ml-3 hidden lg:block">
                    <p className="text-[#0B0F18] dark:text-white text-[18px] m-0">
                      {userData?.name}
                    </p>
                    <span className="text-shoorah-customGray dark:text-white font-light">
                      {userData?.userType === 0
                        ? 'Super Admin'
                        : userData?.userType === 1
                          ? 'Sub Admin'
                          : userData?.userType === 3
                            ? 'Company Admin'
                            : ''}
                    </span>
                  </div>
                  <ChevronDownIcon className="ml-3 w-[25px] text-shoorah-customGray" />
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
              <Menu.Items className="absolute shadow-lg right-[20px] top-[90px] z-10 mt-2 w-56 origin-top-right rounded-md dark:bg-shoorah-darkBgTabColor bg-white ring-1 ring-shoorah-primary ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={
                          !isSuperAdmin() ? `/${userData.slug}/change-password` : '/change-password'
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

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={classNames(
                          active
                            ? 'bg-gray-100 dark:text-white text-gray-900'
                            : 'text-gray-700 dark:text-white',
                          'block w-full px-4 py-2 text-left text-sm hover:bg-inherit'
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      {showPopup ? <NotificationPopup notificationData={notificationData} /> : ''}
    </>
  );
}

Header.propTypes = {
  unreadNotiCount: PropTypes.any,
  location: PropTypes.any
};

export default Header;
