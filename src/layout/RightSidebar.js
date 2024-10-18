import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Link, useNavigate } from 'react-router-dom';
import { errorToast, getLocalStorageItem, isSuperAdmin, successToast } from '../utils/helper';
import { CompanyApi } from '../api/companyApi';
import { Api } from '../api';
import moment from 'moment';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
const RightSidebar = () => {
  const navigate = useNavigate();

  const [adminList, setAdminList] = useState([]);
  const [companyData, setCompanyData] = useState({});
  const [subsData, setSubsData] = useState(null);

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const name = userData?.name?.split(' ');

  // apis

  const gestAdminList = () => {
    CompanyApi.getB2BAdminList()
      .then((res) => {
        if (res?.data?.meta.code === 1) {
          setAdminList(res?.data?.data);
        } else {
          return errorToast('Something went wrong');
        }
      })
      .catch((err) => {
        return errorToast(err);
      });
  };

  const getCompanyPlanData = () => {
    CompanyApi.getCompanyStatus(userData.companyId)
      .then((res) => {
        if (res?.data?.meta.code === 1) {
          setSubsData(res?.data?.data);
        } else {
          return errorToast('Something went wrong');
        }
      })
      .catch((err) => {
        return errorToast(err);
      });
  };

  // fetch pre required data
  useEffect(() => {
    gestAdminList();
    getCompanyPlanData();
  }, []);

  useEffect(() => {
    Api.getCompanyData(userData?.companyId)
      .then((res) => {
        if (res.data?.meta?.code === 1) {
          const company = res.data?.data;
          setCompanyData({
            company_logo: company.company_logo,
            company_name: company.company_name,
            company_email: company.company_email,
            company_address: company.company_address,
            contact_person: company.contact_person,
            contact_number: company.contact_number,
            no_of_seat_bought: company.no_of_seat_bought,
            seat_price: company.seat_price,
            seat_active: company.seat_active,
            contract_progress: company.contract_progress,
            b2b_interest_via: company.b2b_interest_via,
            terms_agreed: company.terms_agreed,
            contract_sent: company.contract_sent,
            contract_signed: company.contract_signed,
            invoice_raised: company.invoice_raised,
            payment_complete: company.payment_complete,
            restrict_company: company.restrict_company,
            previousSeat: company.no_of_seat_bought,
            company_type: company.company_type,
            activeUsersCount: company.activeUsersCount,
            inactiveUsersCount: company.inactiveUsersCount
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleFeeling = (id) => {
    CompanyApi.addB2BMood({
      moodType: id
    })
      .then(() => successToast('Your mood recorded successfully'))
      .catch(() => errorToast('Something went wrong'));
  };

  return (
    <>
      <div
        onClick={() => {
          navigate(`/${userData?.slug}/myCompany`);
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
                onClick={() => {
                  navigate(`/${userData?.slug}/myCompany`);
                }}
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
                  <Menu.Items className="absolute shadow-lg bottom-0 left-[3rem] -translate-x-full translate-y-full z-10 mt-2  rounded-md dark:bg-shoorah-darkBgColor bg-white ring-1 ring-shoorah-primary ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={
                              !isSuperAdmin()
                                ? `/${userData.slug}/change-password`
                                : '/change-password'
                            }
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
              <h6>{userData?.userType === 3 ? 'Admin' : 'Sub Admin'}</h6>
            </div>
          </div>

          <div className="w-full h-[1px] my-6 bg-shoorah-gray1 "></div>

          {/* about company plan */}
          <div className="w-full flex gap-2 flex-col justify-center  ">
            <h4 className="text-sm font-medium capitalize text-shoorah-newDashboardBlue2 dark:text-white ">
              {userData?.companyName} Subscription
            </h4>
            <p className="text-shoorah-gray2 text-xs">
              {subsData && subsData?.account === 'Trial'
                ? `You have Trial plan activated.`
                : subsData?.account === 'Subscribed'
                ? `You are subscribed to shoorah business.`
                : subsData?.account === 'Expired'
                ? `You have Expired plan`
                : `No Subscription found. Please buy shoorah business plans to use features.`}
            </p>
          </div>

          {/* hr */}
          <div className="w-full h-[1px] my-6 bg-shoorah-gray1 "></div>

          {/* about shoorah */}
          <div className="w-full flex gap-2 flex-col justify-center  ">
            <h4 className="text-sm font-medium capitalize text-shoorah-newDashboardBlue2 dark:text-white ">
              About {userData?.companyName}
            </h4>
            <p className="text-shoorah-gray2 text-xs">
              Building a mentally healthy workforce for a brighter future of work.
            </p>
            {/* other admins */}
            <div className="mt-4 flex flex-col gap-y-4 justify-center">
              <h4 className="text-sm font-medium text-shoorah-newDashboardBlue2 dark:text-white ">
                Other Admin Members
              </h4>
              {adminList?.length > 0 ? (
                <div className="flex flex-col w-full gap-y-3 overflow-y-auto custom-scrollbar max-h-[30vh] ">
                  {adminList.map((admin, index) => {
                    return (
                      <div key={index} className="flex items-center gap-3 w-full ">
                        {admin?.userProfile && !admin?.userProfile.includes('null') ? (
                          <img
                            loading='lazy'
                            src={admin?.userProfile}
                            className="h-12 aspect-square rounded-full object-cover bg-shoorah-blue"
                          />
                        ) : (
                          <div className="h-12 flex items-center justify-center aspect-square rounded-full bg-black text-white capitalize">
                            {admin?.name?.charAt(0)}
                          </div>
                        )}
                        <div className="flex flex-col justify-center ">
                          <h6 className="text-sm font-medium text-shoorah-newDashboardBlue2 dark:text-white ">
                            {admin?.name}
                          </h6>
                          <p className="text-shoorah-gray2 text-xs">{admin?.companyName}</p>
                          <p className="text-shoorah-gray2 text-xs">
                            Last Login:{' '}
                            {admin?.lastLogin
                              ? moment(admin?.lastLogin).format('DD MMM YY')
                              : 'Not active'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-shoorah-gray2 text-xs">
                  You are the only Admin member presently.
                </div>
              )}
            </div>
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
              <span onClick={() => handleFeeling(1)} className="cursor-pointer">
                😃
              </span>
              <span onClick={() => handleFeeling(2)} className="cursor-pointer">
                😒
              </span>
              <span onClick={() => handleFeeling(3)} className="cursor-pointer">
                😡
              </span>
              <span onClick={() => handleFeeling(4)} className="cursor-pointer">
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

export default RightSidebar;
