import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link, useNavigate } from 'react-router-dom';
import { getLocalStorageItem, isSuperAdmin } from '../utils/helper';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
const ExpertSidebar = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const name = userData?.name?.split(' ');

  return (
    <>
      <div
        onClick={() => {
          navigate(`/expert-dashboard`);
        }}
        className="relative lg:hidden"
      >
        {companyData?.company_logo ? (
          <img
            loading='lazy'
            src={companyData.company_logo}
            className="w-10 h-10 object-cover rounded-full bg-blue-300"
          />
        ) : (
          <div className="self-center dark:bg-shoorah-darkBgColor bg-black flex justify-center items-center w-10 h-10  rounded-full">
            <span className="text-white">{name && name[0]?.charAt(0)}</span>
            <span className="text-white">{name && name[1]?.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="h-full relative z-40 hide-scrollbar overflow-y-scroll hidden lg:flex flex-col gap-y-4  items-center  ">
        {/* first box */}
        <div className="w-full bg-white dark:bg-shoorah-darkBgTabColor  p-4 flex flex-col justify-center items-center rounded-xl">
          <div className=" mt-4 flex flex-col gap-1 items-center relative">
            <div className="absolute right-0 top-0 bg-shoorah-sidebarBackground text-white p-1 aspect-square dark:bg-white/25 rounded-full cursor-pointer">
              <div
                // onClick={() => {
                //   navigate(`/partner-account`);
                // }}
                className="relative"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4  right-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                  />
                </svg>
              </div>
            </div>

            {companyData?.company_logo && !companyData.company_logo.includes('null') ? (
              <img
                loading='lazy'
                src={companyData.company_logo}
                className="w-20 aspect-square object-cover rounded-full bg-blue-300"
              />
            ) : (
              <div className="self-center dark:bg-shoorah-darkBgColor bg-black flex justify-center items-center w-20 aspect-square rounded-full">
                <span className="text-white">{name && name[0]?.charAt(0)}</span>
                <span className="text-white">{name && name[1]?.charAt(0)}</span>
              </div>
            )}

            {/* <img
            src={userData.profile}
            className="w-20 aspect-square rounded-full bg-blue-300"
          /> */}
            <div className="text-base flex justify-center gap-x-1 items-center text-shoorah-newDashboardBlue2 dark:text-white ">
              <span> {userData?.name}</span>
              <Menu className="relative" as="div">
                <Menu.Button className="w-full flex items-center justify-center text-sm font-medium text-gray-700 focus:outline-none">
                  <ChevronDownIcon className=" w-4 dark:text-white/80 text-shoorah-customGray" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute shadow-lg bottom-0 left-full -translate-x-full translate-y-full z-10 mt-2  origin-top-right rounded-md dark:bg-shoorah-darkBgColor bg-white ring-1 ring-shoorah-primary ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={!isSuperAdmin() ? `/change-password` : '/change-password'}
                            className={classNames(
                              active
                                ? 'bg-gray-100 dark:text-white text-shoorah-sidebarBackground'
                                : ' dark:text-white text-gray-700',
                              'block px-4 py-2 whitespace-nowrap text-sm hover:bg-inherit'
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
            <div className="flex leading-none text-shoorah-gray3 gap-1 text-sm justify-center items-center text-center flex-col">
              <h6 className="capitalize">{userData?.companyName}</h6>
              <h6>{userData?.userType === 6 && 'Shoorah Expert'}</h6>
            </div>
          </div>

          {/* hr */}
          <div className="w-full h-[1px] my-6 bg-shoorah-gray1 "></div>

          {/* about shoorah */}
          <div className="w-full flex gap-2 flex-col justify-center  ">
            <h4 className="text-sm font-medium capitalize text-shoorah-newDashboardBlue2 dark:text-white ">
              About Peap
            </h4>
            <p className="text-shoorah-gray2 text-xs">
              Delivering Comprehensive Mental Wellness Solutions for a Healthier Life.
            </p>
          </div>

          <div className="w-full mt-2 flex gap-2 flex-col justify-center  ">
            <h4 className="text-sm font-medium capitalize text-shoorah-newDashboardBlue2 dark:text-white ">
              Message Shoorah ( icon )
            </h4>
            <p className="text-shoorah-gray2 text-xs">
              If you have any issues or concerns, please don't hesitate to contact us directly.
            </p>

            <div className="px-2 my-3 w-full mx-auto relative">
              <button className="px-3 w-full py-2 rounded-[3rem] bg-[#e5eaf9] text-[#000]">
                View Message
              </button>
              <p className="rounded-full absolute -top-2 right-2 border border-4 border-white flex justify-center items-center w-8 h-8  text-xs bg-[#B6C0F3] text-[#fff]">
                2
              </p>
            </div>
          </div>

          <div className="w-full flex gap-2 mt-[1rem] flex-col justify-center  ">
            <h4 className="text-sm font-medium capitalize text-shoorah-newDashboardBlue2 dark:text-white ">
              Set Session Price
            </h4>
            <p className="text-shoorah-gray2 text-xs">
              Ensure your 30-minute session is fair and reasonable, as all prices are subject to
              approval.
            </p>
            <h4 className="text-sm font-medium capitalize text-shoorah-newDashboardBlue2 dark:text-white ">
              Current Price : £19.95
            </h4>
          </div>
        </div>

        {/* second box */}
        <div className="w-full p-4 bg-white dark:bg-shoorah-darkBgTabColor  flex flex-col justify-center items-center rounded-xl">
          <div className="w-[80%]  justify-center gap-y-4  flex flex-col">
            <div className=" flex flex-col">
              <h2 className="text-sm font-medium text-shoorah-newDashboardBlue2 dark:text-white ">
                How’re you feeling, {userData?.name}?
              </h2>
              <p className="text-shoorah-gray2 mt-2 text-xs">
                Take a moment to reflect. Regular check-ins can lower your stress & boost your mood!
              </p>
            </div>
            <div className="flex gap-2 text-2xl">
              <span
                //    onClick={() => handleFeeling(1)}
                className="cursor-pointer"
              >
                😃
              </span>
              <span
                //   onClick={() => handleFeeling(2)}
                className="cursor-pointer"
              >
                😒
              </span>
              <span
                //   onClick={() => handleFeeling(3)}
                className="cursor-pointer"
              >
                😡
              </span>
              <span
                //   onClick={() => handleFeeling(4)}
                className="cursor-pointer"
              >
                😆
              </span>
            </div>
            <p className="text-shoorah-gray2 text-[0.5rem]">*Your reflections are private</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertSidebar;
