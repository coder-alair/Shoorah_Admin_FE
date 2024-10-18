import React from 'react';
import PropTypes from 'prop-types';
import { RadialBarChart, RadialBar } from 'recharts';

const DashboardSection1 = ({ dashboardData }) => {
  const data = [
    {
      name: 'Trial account',
      x: dashboardData.totalTrialAccount,
      fill: '#AA336A'
    },
    {
      name: 'Expired account',
      x: dashboardData.totalDeletedAccount,
      fill: '#4F46E5'
    },
    {
      name: 'Basic Plan',
      x: dashboardData.totalBasicPlansAccounts,
      fill: '#EC4E20'
    },
    { name: 'Paid account', x: dashboardData.totalPaidAccount, fill: 'teal' },
    {
      name: 'Free Subscription Account',
      x: dashboardData.totalPaidAccount,
      fill: '#B19470'
    }
  ];

  return (
    <div className="flex flex-col lg:flex-col dark:text-white xl:flex-row lg:flex-col gap-3">
      <div className="border text-sm lg:text-base border-gray-300 rounded-3xl p-4 bg-white flex flex-col dark:bg-shoorah-darkBgTabColor dark:border-none w-full lg:w-full xl:w-3/5">
        <div className="text-black dark:text-white text-lg lg:text-xl font-medium p-2">
          User details
        </div>
        <div className="flex justify-between  flex-grow gap-y-4 flex-col">
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className="h-[85px] flex justify-between flex-col border border-gray-300 rounded-xl p-4 dark:bg-shoorah-darkBgColor dark:border-none bg-blue-800 text-white">
              <div>B2C</div>
              <div className="text-white text-lg lg:text-2xl font-medium">
                {dashboardData.totalActiveUser ? dashboardData.totalActiveUser : 0}
              </div>
            </div>
            <div className="h-[85px] flex justify-between flex-col border border-gray-300 rounded-xl p-4 dark:bg-shoorah-darkBgColor dark:border-none bg-blue-800 text-white">
              <div>B2B</div>
              <div className="text-white text-lg lg:text-2xl font-medium">
                {dashboardData.totalActiveB2CUser ? dashboardData.totalActiveB2CUser : 0}
              </div>
            </div>
            <div className="h-[85px] flex justify-between flex-col border border-gray-300 rounded-xl p-4 dark:bg-shoorah-darkBgColor dark:border-none bg-shoorah-ggg">
              <div className="text-gray-400 dark:text-white">Inactive users</div>
              <div className="text-black dark:text-white text-lg lg:text-2xl font-medium">
                {dashboardData.totalInactiveUser ? dashboardData.totalInactiveUser : 0}
              </div>
            </div>
            <div className="h-[85px] flex justify-between flex-col border border-gray-300 rounded-xl p-4 dark:bg-shoorah-darkBgColor dark:border-none bg-shoorah-ggg">
              <div className="text-gray-400 dark:text-white">Deleted</div>
              <div className="text-black dark:text-white text-lg lg:text-2xl font-medium">
                {dashboardData.totalDeletedAccount ? dashboardData.totalDeletedAccount : 0}
              </div>
            </div>
          </div>
          {/* temp */}
          <>
            <div className="w-full flex justify-center items-center">
              <div className=" text-sm lg:text-xl flex">
                <span className=" text-lg lg:text-3xl mr-3">
                  {dashboardData.totalUser ? dashboardData.totalUser : 0}
                </span>
                <div className="border-l border-gray-200"></div>
                <div className="ml-3 flex items-center">Total users</div>
              </div>
            </div>

            <div>
              <div className="w-full rounded-xl   text-black dark:text-white">
                <div className="flex mb-4 items-center font-semibold">Subscription count</div>
                <div className=" grid gap-4 grid-cols-1 lg:grid-cols-4 mt-1">
                  <div className="h-[85px] flex justify-between flex-col border border-gray-300 rounded-xl p-4 dark:bg-shoorah-darkBgColor dark:border-none bg-blue-800 text-white">
                    <div>One month</div>
                    <span className="ml-3 lg:text-2xl font-medium">
                      {dashboardData.monthlySubscribedCount
                        ? dashboardData.monthlySubscribedCount
                        : 0}
                    </span>
                  </div>

                  <div className="h-[85px] flex justify-between flex-col border border-gray-300 rounded-xl p-4 dark:bg-shoorah-darkBgColor dark:border-none bg-blue-800 text-white">
                    <div className="flex  items-center font-medium">Six month</div>

                    <span className="ml-3 lg:text-2xl font-medium">
                      {dashboardData.sixMonthsSubscribedCount
                        ? dashboardData.sixMonthsSubscribedCount
                        : 0}
                    </span>
                  </div>

                  <div className="h-[85px] flex justify-between flex-col border border-gray-300 rounded-xl p-4 dark:bg-shoorah-darkBgColor dark:border-none bg-blue-800 text-white">
                    <div className="flex  items-center font-medium">Annual</div>

                    <span className="ml-3 lg:text-2xl font-medium">
                      {dashboardData.annualSubscribedCount
                        ? dashboardData.annualSubscribedCount
                        : 0}
                    </span>
                  </div>

                  <div className="h-[85px] flex justify-between flex-col border border-gray-300 rounded-xl p-4 dark:bg-shoorah-darkBgColor dark:border-none bg-blue-800 text-white">
                    <div className="flex  items-center font-medium">Lifetime</div>
                    <span className="ml-3 lg:text-2xl font-medium">
                      {dashboardData.lifetimeSubscribedCount
                        ? dashboardData.lifetimeSubscribedCount
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>

          <div className="hidden flex-col lg:flex-row gap-4 lg:text-base text-sm items-center justify-between mt-3">
            <div>
              <div className=" text-sm lg:text-xl flex">
                <span className=" text-lg lg:text-3xl mr-3">
                  {dashboardData.totalUser ? dashboardData.totalUser : 0}
                </span>
                <div className="border-l border-gray-200"></div>
                <div className="ml-3 flex items-center">Total users</div>
              </div>
            </div>
            <div>
              <div className="w-full border border-gray-300 rounded-xl p-4 dark:bg-shoorah-darkBgColor dark:border-none bg-[#b6c0f3] text-black dark:text-white">
                <div className="flex  items-center font-medium">Subscription count</div>
                <div className="flex mt-1">
                  <div className="text-sm flex">
                    <div>
                      One month:
                      <span className="ml-3 font-bold">
                        {dashboardData.monthlySubscribedCount
                          ? dashboardData.monthlySubscribedCount
                          : 0}
                      </span>
                    </div>
                  </div>

                  <div className="border-l border-black ml-3"></div>
                  <div className="ml-3 text-sm flex mr-3">
                    <div>
                      Six month:
                      <span className="ml-3 font-bold">
                        {dashboardData.sixMonthsSubscribedCount
                          ? dashboardData.sixMonthsSubscribedCount
                          : 0}
                      </span>
                    </div>
                  </div>

                  <div className="border-l border-black"></div>
                  <div className="ml-3 text-sm flex">
                    <div>
                      Annual:
                      <span className="ml-3 font-bold">
                        {dashboardData.annualSubscribedCount
                          ? dashboardData.annualSubscribedCount
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-gray-300 rounded-3xl p-4 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none w-full xl:w-2/5 lg:w-full lg:w-full">
        <div className="text-black dark:text-white text-lg lg:text-xl font-medium p-2">
          Account details
        </div>
        <div className="mt-4 relative h-auto gap-8 justify-center items-center flex flex-col lg:flex-row xl:flex-row lg:flex-row">
          <div className="flex justify-center items-center mb-4 lg:mb-0">
            <RadialBarChart
              width={180}
              height={180}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="15%"
              outerRadius="120%"
              barSize={10}
            >
              <RadialBar minAngle={15} dataKey="x" clockWise background />
            </RadialBarChart>
          </div>
          <span className="inline-grid grid-cols-1 2xl:grid-cols-2  lg:text-base text-sm gap-4 dashboard_sec2_custom">
            <span>
              <div className="webkit_in">
                <span className="w-2 h-2 inline-block mr-4 rounded-full bg-shoorah-cus_pink"></span>
                <div>
                  <div className="text-gray-400">Trial Account</div>
                  <div className=" text-base lg:text-xl font-medium">
                    {dashboardData.totalTrialAccount ? dashboardData.totalTrialAccount : 0}
                  </div>
                </div>
              </div>
            </span>
            <span>
              <div className="webkit_in">
                <span className="w-2 h-2 inline-block mr-4 rounded-full bg-shoorah-indigo"></span>
                <div>
                  <div className="text-gray-400">Deleted Account</div>
                  <div className=" text-base lg:text-xl font-medium">
                    {dashboardData.totalDeletedAccount ? dashboardData.totalDeletedAccount : 0}
                  </div>
                </div>
              </div>
            </span>
            <span>
              <div className="webkit_in">
                <span className="w-2 h-2 inline-block mr-4 rounded-full bg-shoorah-teal"></span>
                <div>
                  <div className="text-gray-400">Paid Account</div>
                  <div className=" text-base lg:text-xl font-medium">
                    {dashboardData.totalPaidAccount ? dashboardData.totalPaidAccount : 0}
                  </div>
                </div>
              </div>
            </span>
            <span>
              <div className="webkit_in">
                <span className="w-2 h-2 inline-block mr-4 rounded-full bg-shoorah-orange"></span>
                <div>
                  <div className="text-gray-400">Basic Plan</div>
                  <div className=" text-base lg:text-xl font-medium">
                    {dashboardData.totalBasicPlansAccounts
                      ? dashboardData.totalBasicPlansAccounts
                      : 0}
                  </div>
                </div>
              </div>
            </span>

            <span>
              <div className="webkit_in">
                <span className="w-2 h-2 inline-block mr-4 rounded-full bg-[#B19470]"></span>
                <div>
                  <div className="text-gray-400">Free Account</div>
                  <div className=" text-base lg:text-xl font-medium">
                    {dashboardData.totalNoTrialAccount ? dashboardData.totalNoTrialAccount : 0}
                  </div>
                </div>
              </div>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

DashboardSection1.propTypes = {
  dashboardData: PropTypes.any,
  series: PropTypes.any
};

export default DashboardSection1;
