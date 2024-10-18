import React, { useEffect, useState } from 'react';
import { errorToast, getJWTToken } from '../../../utils/helper';
import { Api } from '../../../api';
import Chart from 'react-apexcharts';
import Loader from '../../../component/common/Loader';
import { donutDataOption } from '../b2bService';
import { donutChartOption } from '../b2bService';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { RadialBarChart, RadialBar } from 'recharts';
import axios from 'axios';
import { API_BASE_URL } from '../../../core/env.configs';

function CompanyCount({ companyComparsion = false, heading, show }) {
  const [loader, setLoader] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [secondGraph, setSecondGraph] = useState(
    donutDataOption(6, [0, 0], ['#26918F', '#E5EAF9'], 'Monthly new client Vs last months')
  );

  const [B2bInterestDetailData, setB2bInterestDetailnData] = useState([
    { name: 'Total', x: 100, fill: '#186F65' },
    { name: 'Website', x: 80, fill: '#B5CB99' },
    { name: 'Sales Team', x: 60, fill: '#B2533E' },
    { name: 'Paid Advertisement', x: 20, fill: '#21BDAD' }
  ]);

  const [B2bMoodDetailData, setB2bMoodDetailnData] = useState([
    { name: 'Happy', x: 100, fill: '#186F65' },
    { name: 'Sad', x: 80, fill: '#B5CB99' },
    { name: 'Angry', x: 60, fill: '#B2533E' },
    { name: 'Neutral', x: 20, fill: '#21BDAD' }
  ]);

  const [b2bData, setB2bData] = useState(null);
  const [b2bMoodData, setB2bMoodData] = useState(null);

  const [companyDataReport, setcompanyDataReport] = useState(null);

  const getCompanyCount = () => {
    setLoader(true);
    Api.getEarningCount()
      .then((res) => {
        setLoader(false);
        setcompanyDataReport(res.data?.data);
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
              'Seat for all companies'
            )
          ];
          // if(companyComparsion){
          //     arr.push()
          // }
          setCompanyData(arr);
          setSecondGraph(
            donutDataOption(
              6,
              [data.newContractsThisMonthCount || 0, data.contractsLastMonthCount || 0],
              ['#26918f', '#c3efee'],
              'Monthly new client Vs last months'
            )
          );
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const getB2bInterestData = () => {
    Api.getB2BviaGraphData()
      .then((res) => {
        setB2bData(res?.data?.data);
        setB2bInterestDetailnData([
          {
            name: 'Total',
            x: res?.data?.data?.totalCompanies,
            fill: '#186F65'
          },
          {
            name: 'Website',
            x: res?.data?.data?.totalViaWebsite,
            fill: '#B5CB99'
          },
          {
            name: 'Sales Team',
            x: res?.data?.data?.totalViaSales,
            fill: '#B2533E'
          },
          {
            name: 'Paid Advertisement',
            x: res?.data?.data?.totalViaPaidAds,
            fill: '#21BDAD'
          },
          {
            name: 'Google',
            x: res?.data?.data?.totalViaGoogle,
            fill: '#888BEB'
          },
          {
            name: 'Facebook',
            x: res?.data?.data?.totalViaFacebook,
            fill: '#3A47AB'
          },
          {
            name: 'LinkedIn',
            x: res?.data?.data?.totalViaLinkedin,
            fill: '#3A47BB'
          }
        ]);
      })
      .catch((err) => {});
  };

  const getB2bMoodData = () => {
    Api.getB2bMoodData()
      .then((res) => {
        setB2bMoodData(res?.data?.data);
        setB2bMoodDetailnData([
          {
            name: 'Happy',
            x: res?.data?.data?.happy,
            fill: '#186F65'
          },
          {
            name: 'Sad',
            x: res?.data?.data?.sad,
            fill: '#B5CB99'
          },
          {
            name: 'Angry',
            x: res?.data?.data?.angry,
            fill: '#B2533E'
          },
          {
            name: 'Neutral',
            x: res?.data?.data?.neutral,
            fill: '#21BDAD'
          }
        ]);
      })
      .catch((err) => {});
  };

  const handleClick = async () => {
    let payload = {
      companyData: companyDataReport,
      b2bData: b2bData,
      b2bMoodData: b2bMoodData
    };

    const url = `${API_BASE_URL}admin/v1/b2b-overall-report`;
    axios
      .post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          deviceType: 3,
          Authorization: getJWTToken()
        },
        responseType: 'blob'
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `B2BOverallReport.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {});

    setLoader(false);
  };

  useEffect(() => {
    getCompanyCount();
    getB2bInterestData();
    getB2bMoodData();
  }, []);

  return (
    <div className="flex flex-col">
      {loader ? <Loader /> : null}
      <h3 className="text-xl dark:text-white">{heading}</h3>
      {show && (
        <button
          onClick={handleClick}
          title="Download Overall Report"
          className="my-3 appearance-none outline-none bg-shoorah-primary dark:bg-white dark:text-shoorah-primary py-1 w-[10rem] rounded-2xl font-bold text-white text-md"
        >
          Download Report
        </button>
      )}

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
      {companyComparsion && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 ">
          <div className="border border-gray-300 rounded-lg p-4 bg-white dark:bg-shoorah-darkBgTabColor dark:text-white dark:border-none flex justify-center items-center">
            <div className=" bg-white dark:bg-shoorah-darkBgTabColor dark:text-white dark:border-none flex flex-col justify-between w-fit">
              <div className="text-black dark:text-white text-sm font-medium text-center">
                {secondGraph.name}
              </div>
              <div className="mt-3">
                <Chart
                  options={donutChartOption(
                    secondGraph.flag,
                    secondGraph.data,
                    secondGraph.activeBgColor,
                    secondGraph.inActiveBgColor
                  )}
                  series={secondGraph.data}
                  type="donut"
                />
              </div>
              <div className="mt-4 flex flex-row justify-between">
                <div className="webkit_in mr-4">
                  <span
                    style={{ backgroundColor: secondGraph.activeBgColor }}
                    className="w-2 h-2 inline-block mr-2 rounded-full bg-shoorah-teal"
                  ></span>
                  <div className="justify-center flex items-center">
                    <div className="text-gray-400 mr-2">New Client: </div>
                    <div className="text-sm">
                      {secondGraph.activeInactiveData.active
                        ? secondGraph.activeInactiveData.active
                        : 0}{' '}
                      %
                    </div>
                  </div>
                </div>
                <div className="webkit_in">
                  <span
                    style={{ backgroundColor: secondGraph.inActiveBgColor }}
                    className="w-2 h-2 inline-block mr-2 rounded-full bg-shoorah-teal"
                  ></span>
                  <div className="justify-center flex items-center">
                    <div className="text-gray-400 mr-2">Last Client: </div>
                    <div className="text-sm">
                      {secondGraph?.activeInactiveData?.inactive
                        ? secondGraph?.activeInactiveData.inactive
                        : 0}{' '}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* moods graph data */}

          <div className="border border-gray-300 rounded-lg p-4 bg-white dark:bg-shoorah-darkBgTabColor dark:text-white dark:border-none flex flex-col justify-between ">
            {' '}
            <div className="flex justify-between items-center">
              <div className="text-black dark:text-white text-sm font-medium text-center">
                B2B Admin Mood Details
              </div>
              {/* <button
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                //   onClick={() => setShowFilterModal((state) => !state)}
              >
                <CalendarIcon className="text-white w-[18px] h-[20px] inline" />
              </button> */}
            </div>
            <div className="mt-4 relative h-auto justify-center items-center gap-8 flex flex-col lg:flex-row xl:flex-row lg:flex-row">
              <div className="flex justify-center items-center ">
                <RadialBarChart
                  width={300}
                  height={300}
                  data={B2bMoodDetailData}
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="110%"
                  barSize={10}
                >
                  <RadialBar minAngle={15} dataKey="x" clockWise background />
                </RadialBarChart>
              </div>
              <span className="grid grid-cols-2 lg:grid-cols-1 gap-x-6 lg:gap-2 dashboard_sec2_custom">
                {B2bMoodDetailData.map(({ name, x, fill }) => (
                  <span key={name}>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          background: fill
                        }}
                        className={`w-2 h-2 inline-block  rounded-full `}
                      ></span>
                      <div>
                        <div className="text-gray-400">{name}</div>
                      </div>{' '}
                      <div className="text-xl font-medium">{x}</div>
                    </div>
                  </span>
                ))}
              </span>
            </div>
          </div>
          {/* B2B Interest Details */}

          <div className="border border-gray-300 rounded-lg p-4 bg-white dark:bg-shoorah-darkBgTabColor dark:text-white dark:border-none flex flex-col justify-between lg:col-span-2">
            {' '}
            <div className="flex justify-between items-center">
              <div className="text-black dark:text-white text-sm font-medium text-center">
                B2B Interest Details
              </div>
              {/* <button
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                //   onClick={() => setShowFilterModal((state) => !state)}
              >
                <CalendarIcon className="text-white w-[18px] h-[20px] inline" />
              </button> */}
            </div>
            <div className="mt-4 relative h-auto justify-center items-center flex gap-8 flex-col lg:flex-row xl:flex-row lg:flex-row">
              <div className="flex justify-center items-center lg:mb-0 mb-4">
                <RadialBarChart
                  width={300}
                  height={300}
                  data={B2bInterestDetailData}
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="110%"
                  barSize={10}
                >
                  <RadialBar minAngle={15} dataKey="x" clockWise background />
                </RadialBarChart>
              </div>
              <span className=" grid grid-cols-2 gap-2 dashboard_sec2_custom">
                {B2bInterestDetailData.map(({ name, x, fill }) => (
                  <span key={name}>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          background: fill
                        }}
                        className={`w-2 h-2 inline-block  rounded-full `}
                      ></span>
                      <div>
                        <div className="text-gray-400">{name}</div>
                      </div>{' '}
                      <div className="text-xl font-medium">{x}</div>
                    </div>
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyCount;
