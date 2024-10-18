import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

import { CalendarIcon } from '@heroicons/react/24/outline';
import { RadialBarChart, RadialBar } from 'recharts';
import { donutChartOption, donutDataOption } from '../../B2B/b2bService';
import { PartnerApi } from '../../../api/partnerApi';
import Loader from '../../../component/common/Loader';

function PartnerCount({ companyComparsion = false }) {
  const [loader, setLoader] = useState(false);
  const [companyData, setCompanyData] = useState([]);

  const getCompanyCount = () => {
    setLoader(true);
    PartnerApi.getPartnerContentCounts()
      .then((res) => {
        setLoader(false);
        const data = res.data?.data;
        if (res.data?.meta.code === 1) {
          let arr = [
            donutDataOption(
              1,
              [data?.activeCompanies, data?.inactiveCompanies],
              ['#3A47AB', '#c6caeb'],
              'All Companies'
            ),
            donutDataOption(
              2,
              [data?.negotiationActive, data?.negotiationInactive],
              ['#F05289', '#f9b9cf'],
              'Companies in negotiation'
            ),
            donutDataOption(
              3,
              [data?.signedActive, data?.signedInactive],
              ['#71c837', '#d4efc3'],
              'Company signed'
            ),
            donutDataOption(
              4,
              [data?.activeCompaniesUsers, data?.inactiveCompaniesUsers],
              ['#731c3f', '#f0c1d4'],
              'B2B users'
            ),
            donutDataOption(
              5,
              [data?.totalactiveSeats, data?.totalinactiveSeats],
              ['#d5b810', '#faf0b8'],
              'Total seats under contract'
            )
          ];
          // if(companyComparsion){
          //     arr.push()
          // }
          setCompanyData(arr);
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getCompanyCount();
  }, []);

  return (
    <div className="flex flex-col">
      {loader ? <Loader /> : null}
      <div className="mt-4 p-4 grid gap-4 xl:grid-cols-5 lg:grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 dark:bg-shoorah-darkBgTabColor dark:text-white dark:border-none bg-white rounded-lg">
        {companyData.map((value, key) => (
          <div
            className="border border-gray-300 rounded-lg p-4 bg-white dark:bg-shoorah-darkBgColor dark:text-white dark:border-none flex flex-col justify-between"
            key={key}
          >
            <div className="text-black dark:text-white text-sm font-medium text-center">
              {value.name}
            </div>
            <div className="mt-3">
              <Chart
                options={donutChartOption(
                  value.flag,
                  value.data,
                  value.activeBgColor,
                  value.inActiveBgColor
                )}
                series={value.data}
                type="donut"
              />
            </div>
            <div className="mt-4 flex lg:flex-col  justify-center items-center flex-row">
              <div className="webkit_in mr-4">
                <span
                  style={{ backgroundColor: value.activeBgColor }}
                  className="w-2 h-2 inline-block mr-2 rounded-full bg-shoorah-teal"
                ></span>
                <div className="justify-center flex items-center">
                  <div className="text-gray-400 mr-2">Active: </div>
                  <div className="text-sm">
                    {value.activeInactiveData.active ? value.activeInactiveData.active : 0}
                  </div>
                </div>
              </div>
              <div className="webkit_in">
                <span
                  style={{ backgroundColor: value.inActiveBgColor }}
                  className="w-2 h-2 inline-block mr-2 rounded-full bg-shoorah-teal"
                ></span>
                <div className="justify-center flex items-center">
                  <div className="text-gray-400 mr-2">Inactive: </div>
                  <div className="text-sm">
                    {value?.activeInactiveData?.inactive ? value?.activeInactiveData.inactive : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnerCount;
