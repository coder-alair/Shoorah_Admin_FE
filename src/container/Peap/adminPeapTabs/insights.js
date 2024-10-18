import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend
} from 'recharts';
import { ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import upcircle from '../../../assets/images/upcircle.svg';
import twOverwrites from '../../../utils/tailwind-overwrites.json';

import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { RadialBarChart, RadialBar } from 'recharts';
//this is added
import { Helmet } from 'react-helmet';
import { ResponsiveContainer } from 'recharts';
import { JOB_ROLES_CATEGORY, TIME_SPAN_OPTIONS } from '../../../utils/constants';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border bg-white p-4 shadow-lg dark:border-shoorah-buttonColor dark:bg-shoorah-darkBgColor dark:text-shoorah-offWhite">
        {payload?.[0]?.payload?.name}: {payload?.[0]?.payload?.value}
      </div>
    );
  }

  return null;
};

const chartColors = twOverwrites.colors.shoorah.charts;

const Insights = () => {
  const dataarea = [
    { name: '', value: 200 },
    { name: '', value: 133 },
    { name: '', value: 250 },
    { name: '', value: 176 },
    { name: '', value: 300 },
    { name: '', value: 420 },
    { name: '', value: 356 },
    { name: '', value: 180 }
  ];

  const dataline = [
    { label: 'Director', value: 36, color: 'bg-blue-500' },
    { label: 'Senior Manager', value: 24, color: 'bg-yellow-400' },
    { label: 'Manager', value: 31, color: 'bg-orange-400' },
    { label: 'Associate', value: 39, color: 'bg-green-400' },
    { label: 'Staff', value: 53, color: 'bg-pink-500' },
    { label: 'Producer', value: 32, color: 'bg-teal-400' }
  ];

  const [activePayingUserData, setActivePayingUserData] = useState([
    { name: 'Therapy', value: 10, fill: chartColors[700] },
    { name: 'Psychology', value: 12, fill: chartColors[500] },
    { name: 'Counselling', value: 18, fill: chartColors[50] }
  ]);

  const [activeGenderData, setActiveGenderData] = useState([
    { name: 'Male', value: 10, fill: chartColors[700] },
    { name: 'Female', value: 8, fill: chartColors[500] },
    { name: 'Other', value: 13, fill: chartColors[50] }
  ]);

  const [ageData, setAgeData] = useState([
    { name: '18-24', value: 10, fill: chartColors[700] },
    { name: '25-34', value: 8, fill: chartColors[500] },
    { name: '35-44', value: 13, fill: chartColors[50] },
    { name: '45+', value: 13, fill: chartColors[50] }
  ]);

  // const ageData = {
  //   labels: ['18-24', '25-34', '35-44', '45+'],
  //   datasets: [
  //     {
  //       data: [20, 40, 25, 15],
  //       backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6', '#a78bfa']
  //     }
  //   ]
  // };

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Monday 23 june 2024',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        backgroundColor: '#B6C0F3',
        borderColor: '#B6C0F3'
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false // Hide grid lines on the x-axis
        }
      },
      y: {
        grid: {
          display: false // Hide grid lines on the y-axis
        }
      }
    },
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        enabled: true
      }
    }
  };

  const genderData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        data: [50, 40, 10],
        backgroundColor: ['#3b82f6', '#6366f1', '#8b5cf6']
      }
    ]
  };

  const realTimeSessionsData = {
    labels: Array.from({ length: 24 }, (_, i) => i),
    datasets: [
      {
        label: 'Real-time Sessions',
        data: [
          100, 200, 150, 300, 250, 200, 300, 400, 350, 300, 400, 500, 450, 400, 500, 600, 550, 500,
          600, 700, 650, 600, 700, 800
        ],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true
      }
    ]
  };

  return (
    <div className="h-full mt-6 max-w-[100%]">
      <div className="grid grid-cols-3 gap-8">
        {/* Column 1 */}
        <div className="col-span-2 gap-8 flex flex-col">
          {/* Profile & Widgets */}
          <div className="grid grid-cols-3 gap-8">
            {/* Profile */}
            <div className="col-span-1 gap-0 h-auto rounded-[2rem] bg-white text-center">
              <div className="h-1/2 w-full">
                <img
                  loading='lazy'
                  src={
                    'https://cdn.pixabay.com/photo/2024/03/25/18/35/ai-generated-8655320_640.png'
                  }
                  alt="Dr. Esther Cooper"
                  className="flex rounded-tl-[2rem] rounded-tr-[2rem]"
                />
              </div>
              <div className="flex h-1/2 flex-col gap-8">
                <div className="flex flex-col gap-0">
                  <h2 className="flex items-end justify-center pt-2 text-center text-xl font-bold leading-none">
                    Dr. Esther Cooper
                  </h2>
                  <p className="text-sm leading-none tracking-tighter text-gray-800">Therapist</p>
                </div>
                <p className="mt-0 flex flex-col items-center gap-5 text-gray-500">
                  Sessions Booked this month
                  <button className="rounded-[5rem] bg-shoorah-secondary pb-2 pl-9 pr-9 pt-2 text-3xl text-white">
                    125
                  </button>
                </p>
                <button className="mb-7 text-sm leading-tight tracking-tighter text-gray-400 underline">
                  Send a Thank You Message
                </button>
              </div>
            </div>
            {/* Profile-Widgets */}
            <div className="col-span-2 gap-8 flex flex-col">
              <div className="grid grid-cols-2 gap-8">
                {/* Total members supported */}
                <div className="col-span-1">
                  <div className="rounded-3xl p-7 bg-white dark:bg-shoorah-darkBgTabColor">
                    <p className="h-1/3 w-full text-left text-lg font-medium leading-6 text-shoorah-darkBgTabColor dark:text-shoorah-offWhite xl:h-1/2 xl:w-1/6">
                      Total Members Supported
                    </p>
                    <h2 className="dark:text-shoorah-secondary-500 w-full text-wrap break-all pt-0 text-6xl font-semibold text-shoorah-secondary dark:text-shoorah-lightBlue1 xl:w-full">
                      15,567
                    </h2>
                  </div>
                </div>
                {/* sessions and work related cases */}
                <div className="col-span-1 flex flex-col gap-8">
                  {/* Total Sessions*/}
                  <div className="overflow-hidden rounded-3xl bg-white text-center dark:bg-shoorah-darkBgTabColor">
                    <div className="flex h-2/3 items-center justify-center p-7">
                      <h2 className="text-4xl font-semibold leading-tight text-shoorah-darkBgTabColor dark:text-shoorah-offWhite">
                        3,546
                      </h2>
                    </div>
                    <div className="flex h-1/3 w-full items-center justify-center bg-shoorah-secondary px-4 py-2 text-center">
                      <p className="text-md m-auto leading-none text-white">Total Session</p>
                    </div>
                  </div>
                  {/* Work related cases */}
                  <div className="overflow-hidden rounded-3xl bg-white text-center dark:bg-shoorah-darkBgTabColor">
                    <div className="flex h-2/3 items-center justify-center p-7">
                      <h2 className="text-4xl font-semibold leading-tight text-shoorah-darkBgTabColor dark:text-shoorah-offWhite">
                        546
                      </h2>
                    </div>
                    <div className="flex h-1/3 w-full items-center justify-center bg-shoorah-secondary px-4 py-2 text-center">
                      <p className="text-md leading-none text-white">Work Related Cases</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* WellPoints Used */}
              <div className="col-span-1 rounded-3xl bg-white">
                <div className="flex flex-col gap-8 rounded-3xl bg-white p-7 pb-6 pt-4">
                  <h3 className="h-1/2 text-left text-lg font-medium leading-6 text-shoorah-darkBgTabColor dark:text-shoorah-offWhite">
                    WellPoints Used
                    <button className="rounded-xl bg-gray-200 px-10 py-1 text-sm text-white">
                      Month
                    </button>
                  </h3>
                  <p className="text-wrap pt-1 leading-tight text-gray-400">
                    1.01.2025 - Present Date
                  </p>
                  <div className="flex flex-row justify-between gap-5">
                    <div className="mb-5 flex items-center gap-10 align-middle">
                      <h2 className="text-[2.75rem] font-normal text-[#4a56db]">45,000</h2>
                      <img className="w-[2rem]" loading='lazy' src={upcircle} alt="upcircle icon" />

                      <div className="flex items-center justify-center overflow-hidden truncate text-wrap">
                        <p className="flex items-center truncate text-wrap pt-1 leading-none tracking-tighter text-gray-900">
                          30% Increase compared to last month
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session booked by job grades*/}
          <div className="grid w-full grid-cols-1 rounded-3xl bg-white">
            <div className="flex items-center justify-between">
              <h2 className="mb-5 ml-5 mt-5 text-xl font-semibold">Session Booked By Job Grade</h2>
            </div>
            <div className="ml-10 mr-0 mt-10 grid grid-cols-1 gap-x-4 gap-y-10 sm:ml-10 sm:mr-10 sm:w-auto sm:grid-cols-2 sm:gap-x-20">
              {dataline.map((item, index) => (
                <div key={index} className="flex h-16 w-[80%] flex-col items-center">
                  <div className="flex w-full justify-between">
                    <span className="w-30 text-gray-300">{item.label}</span>
                    <span className="text-gray-800">{item.value}</span>
                  </div>
                  <div className="mt-5 flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-2 w-full ${item.color}`}
                      style={{ width: `${(item.value / 50) * 50}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sale & New customer widget */}
          <div className="grid grid-cols-2 gap-8">
            {/* Sale Increase */}
            <div className="col-span-1 rounded-3xl bg-white p-5">
              <p className="text-wrap leading-tight text-gray-400">Session:</p>
              <h3 className="text-lg font-semibold">Sale Increase</h3>
              <p>£1,500</p>
              <p className="text-green-500">15.01%</p>
            </div>
            {/* Session */}
            <div className="col-span-1 rounded-3xl bg-white p-5">
              <p className="text-wrap leading-tight text-gray-400">Session:</p>
              <h3 className="text-lg font-semibold">New Customer</h3>
              <p>125</p>
              <p className="text-green-500">21.01%</p>
            </div>
          </div>

          {/* Real-Time Sessions */}
          <div className="rounded-3xl bg-white">
            {/* max-w-[30rem] */}
            <div className="w-1/2 pb-5 pl-5 pt-5">
              <p className="flex justify-between text-gray-400">
                Session
                <p className="align-center flex text-3xl text-gray-800">
                  <div className="mr-6 h-[25px] w-[25px] rounded-full bg-gray-600"></div>
                  125
                </p>
              </p>
              <p className="flex justify-between text-black">
                Real-Times Session
                <p className="flex items-center text-green-500">
                  <div className="mr-5 h-[15px] w-[15px] rounded-full bg-gray-600"></div>
                  21.01%
                </p>
              </p>
            </div>

            <div className="flex w-full flex-col">
              <div className="dotted w-full border-b"></div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dataarea} margin={{ top: 5, right: -1, left: -1, bottom: 1 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4a56db" />
                      <stop offset="100%" stopColor="#fcfcfc" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="gray" horizontal={false} />
                  <XAxis dataKey="name" hide={true} />
                  <YAxis hide={true} domain={[0, 'dataMax + 100']} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#4a56db"
                    fill="url(#areaGradient)"
                    fillOpacity={0.2}
                    strokeWidth={4}
                  />
                  <ReferenceLine
                    y={Math.max(...dataarea.map((item) => item.value))}
                    label={{
                      value: 574,
                      position: 'insideTop',
                      fill: 'white',
                      fontWeight: 'bold',
                      fontSize: 12,
                      offset: 10
                    }}
                    stroke="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="col-span-1 flex flex-col gap-8">
          {/* Most popular session type */}
          <div className="card col-span-4 grid grid-cols-1 justify-center rounded-3xl bg-white p-7 dark:bg-shoorah-darkBgTabColor sm:mt-0">
            <div className="flex w-full items-start justify-between text-left text-lg font-medium leading-6 text-shoorah-darkBgTabColor dark:text-shoorah-offWhite">
              <span>Most Popular Session</span>
              <select
                className="block h-8 w-20 rounded-md border border-gray-300 bg-gray-50 px-1 text-sm text-gray-900 dark:border-shoorah-buttonColor dark:bg-shoorah-darkBgColor dark:text-shoorah-lightBlue1 dark:placeholder-shoorah-charcoal"
                // value={graphParam.companyName}
                id="most_popular_sessions"
                name="most_popular_sessions"
                onChange={(e) => {
                  console.log(`You selected ${e.target.value} for most popular session type`);
                }}
              >
                {TIME_SPAN_OPTIONS.map(({ name, value }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={activePayingUserData}
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="120%"
                  barSize={24}
                  startAngle={90}
                  endAngle={450}
                >
                  <RadialBar
                    minAngle={90}
                    dataKey="value"
                    background
                    cornerRadius={12}
                    clockWise={true}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex w-full justify-center">
              <span className="mt-7 flex w-full flex-row flex-wrap justify-center gap-x-9 overflow-hidden lg:gap-y-6">
                {activePayingUserData.map(({ name, x, fill }) => (
                  <span key={name} className="flex items-center gap-1 overflow-hidden">
                    <span
                      className={`h-4 w-4 rounded-md`}
                      style={{ backgroundColor: `${fill}` }}
                    ></span>
                    <div className="ml-0 mr-0 flex flex-row gap-3 overflow-hidden">
                      <div className="truncate">
                        <div className="truncate text-gray-400">{name}</div>
                      </div>
                    </div>
                  </span>
                ))}
              </span>
            </div>
          </div>
          {/* Age Widget */}
          <div className="card col-span-4 grid grid-cols-1 justify-center rounded-3xl bg-white p-7 dark:bg-shoorah-darkBgTabColor sm:mt-0">
            <div className="flex w-full items-start justify-between text-left text-lg font-medium leading-6 text-shoorah-darkBgTabColor dark:text-shoorah-offWhite">
              <span>Age</span>
              <select
                className="block h-8 w-20 rounded-md border border-gray-300 bg-gray-50 px-1 text-sm text-gray-900 dark:border-shoorah-buttonColor dark:bg-shoorah-darkBgColor dark:text-shoorah-lightBlue1 dark:placeholder-shoorah-charcoal"
                // value={graphParam.companyName}
                id="most_popular_sessions"
                name="most_popular_sessions"
                onChange={(e) => {
                  console.log(`You selected ${e.target.value} for most popular session type`);
                }}
              >
                {TIME_SPAN_OPTIONS.map(({ name, value }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="m-5 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="120%"
                  barSize={24}
                  startAngle={90}
                  endAngle={450}
                >
                  <RadialBar
                    minAngle={90}
                    dataKey="value"
                    background
                    cornerRadius={12}
                    clockWise={true}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex w-full justify-center">
              <span className="mt-7 flex w-full flex-row flex-wrap justify-center gap-x-9 overflow-hidden lg:gap-y-6">
                {ageData.map(({ name, x, fill }) => (
                  <span key={name} className="flex items-center gap-1 overflow-hidden">
                    <span
                      className={`h-4 w-4 rounded-md`}
                      style={{ backgroundColor: `${fill}` }}
                    ></span>
                    <div className="ml-0 mr-0 flex flex-row gap-3 overflow-hidden">
                      <div className="truncate">
                        <div className="truncate text-gray-400">{name}</div>
                      </div>
                    </div>
                  </span>
                ))}
              </span>
            </div>
          </div>
          {/* Gender Widget */}
          <div className="card col-span-4 grid grid-cols-1 justify-center rounded-3xl bg-white p-7 dark:bg-shoorah-darkBgTabColor sm:mt-0">
            <div className="flex w-full items-start justify-between text-left text-lg font-medium leading-6 text-shoorah-darkBgTabColor dark:text-shoorah-offWhite">
              <span>Gender</span>
              <select
                className="block h-8 w-20 rounded-md border border-gray-300 bg-gray-50 px-1 text-sm text-gray-900 dark:border-shoorah-buttonColor dark:bg-shoorah-darkBgColor dark:text-shoorah-lightBlue1 dark:placeholder-shoorah-charcoal"
                // value={graphParam.companyName}
                id="most_popular_sessions"
                name="most_popular_sessions"
                onChange={(e) => {
                  console.log(`You selected ${e.target.value} for most popular session type`);
                }}
              >
                {TIME_SPAN_OPTIONS.map(({ name, value }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="m-5 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={activeGenderData}
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="120%"
                  barSize={24}
                  startAngle={90}
                  endAngle={450}
                >
                  <RadialBar
                    minAngle={90}
                    dataKey="value"
                    background
                    cornerRadius={12}
                    clockWise={true}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex w-full justify-center">
              <span className="mt-7 flex w-full flex-row flex-wrap justify-center gap-x-9 overflow-hidden lg:gap-y-6">
                {activeGenderData.map(({ name, x, fill }) => (
                  <span key={name} className="flex items-center gap-1 overflow-hidden">
                    <span
                      className={`h-4 w-4 rounded-md`}
                      style={{ backgroundColor: `${fill}` }}
                    ></span>
                    <div className="ml-0 mr-0 flex flex-row gap-3 overflow-hidden">
                      <div className="truncate">
                        <div className="truncate text-gray-400">{name}</div>
                      </div>
                    </div>
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
