import React, { useEffect, useState } from 'react';
import { getLocalStorageItem } from '../../../utils/helper';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
// import Loader from '../../../component/common/Loader';
import PartnerCount from '../Earning/partnerCount';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { PartnerApi } from '../../../api/partnerApi';

function PartnerDashboard(props) {
  //const location = useLocation();
  // const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [notificationCounts, setNotificationCounts] = useState(0);

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const getUnreadNotificationCount = async () => {
    PartnerApi.getUnreadNotificationCount()
      .then((res) => {
        setNotificationCounts(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (window.location.pathname !== '/login' && userData.userType === 5)
      getUnreadNotificationCount();
  }, [userData.userType]);

  return (
    <div>
      {/* {loader ? <Loader /> : null} */}
      <div className="w-full px-3 overflow-hidden h-full">
        <div className="w-full flex items-center justify-end mr-[1rem]">
          <ReactTooltip id="notification-tip" />
          <div
            data-tooltip-id="notification-tip"
            onClick={() => {
              navigate('/partner-notification');
            }}
            className="relative p-2 px-3 bg-white dark:bg-shoorah-darkBgTabColor  rounded-2xl cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              data-slot="icon"
              className="w-6 h-6 stroke-shoorah-sidebarBackground dark:stroke-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
            {notificationCounts > 0 && (
              <div className="absolute right-[4px] shadow-2xl -top-0 rounded-[50%] text-white text-[12px] flex justify-center align-middle text-center bg-[red] h-[20px] w-[20px]">
                <p className="self-center">
                  {notificationCounts > 99 ? '99+' : notificationCounts}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* centre grid */}
        <div className="col-span-3 relative h-full flex flex-col gap-y-4 hide-scrollbar overflow-y-auto ">
          {/* greetings box */}
          <div className="flex flex-col gap-2">
            <h1 className="text-shoorah-newDashboardBlue dark:text-white text-xl lg:text-3xl font-medium ">
              Happy {moment().format('dddd')}, let’s make today count!
            </h1>
            <span className="text-shoorah-newDashboardBlue dark:text-white text-base font-normal">
              Welcome to your Partner Dashboard
            </span>
          </div>

          <PartnerCount />
        </div>
      </div>
    </div>
  );
}

export default PartnerDashboard;
