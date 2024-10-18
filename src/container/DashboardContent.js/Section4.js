import React, { Fragment, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { RadialBarChart, RadialBar } from 'recharts';
import {
  convertCodeToPlatform,
  convertCodeToType,
  convertCodeToUserType,
  convertToIndianDate,
  errorToast,
  getGender,
  jsonToCsv,
  useOutsideClick
} from '../../utils/helper';
import { Popover, Transition } from '@headlessui/react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { DateRangePicker } from 'react-date-range';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Api } from '../../api';
import { useEffect } from 'react';
import moment from 'moment/moment';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { JOB_ROLES_CATEGORY, TIME_LIST, USER_FEELS } from '../../utils/constants';
import { CompanyApi } from '../../api/companyApi';
import BoxGraph from './BoxGraph';
import Overallwellbeing from './wellbeing';
import Loader from '../../component/common/Loader';
import { addDays } from 'date-fns';
import EmotionsStatistics from '../../component/Statistics/Emotions';

function DashboardSection4({ sosData, dateRange, setDateRange, downloadSosReport, setLoader }) {
  const data = [
    { name: 'Total User', x: sosData.uniqueSosPhoneUsers, fill: '#186F65' },
    { name: 'SOS Count', x: sosData.sosClicks, fill: '#B5CB99' },
    { name: 'Call Count', x: sosData.sosPhone, fill: '#B2533E' }
  ];
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [shuruUsageDateFilter, setshuruUsageDateFilter] = useState(false);
  const [rippleUsageDateFilter, setRippleUsageDateFilter] = useState(false);
  const [userActivityDateFilter, setUserActivityDateFilter] = useState(false);
  const [showRevenueDateCalendar, setShowRevenueDateCalendar] = useState(false);
  const [subscribeDetailsData, setSubscribeDetailsData] = useState([]);
  const [trialUsers, setTrialUsers] = useState([600, 280]);
  const [activePayingUserData, setActivePayingUserData] = useState([
    { name: 'Total', x: 10, fill: '#B6C0F3' },
    { name: '1 Month', x: 12, fill: '#6167e8' },
    { name: '6 Month', x: 20, fill: '#4a56db' },
    { name: '1 Year', x: 50, fill: '#313b6b' }
  ]);

  const [userActivityDateRange, setUserActivityDateRange] = useState({
    startDate: new Date(new Date().getTime() - 24 * 3600000),
    endDate: new Date()
  });

  const [shuruUsageDateRange, setShuruUsageDateRange] = useState({
    startDate: new Date(new Date().getTime() - 24 * 3600000),
    endDate: new Date()
  });

  const [rippleUsageDateRange, setRippleUsageDateRange] = useState({
    startDate: new Date(new Date().getTime() - 24 * 3600000),
    endDate: new Date()
  });
  const [rippleUsageData, setRippleUsageData] = useState({
    totalMoods: 10,
    totalHourSpent: 5,
    totalActivatedUsers: 6,
    totalInactivatedUsers: 3
  });

  const [timeConstant, setTimeConstant] = useState({
    name: TIME_LIST[TIME_LIST.length - 1].name,
    value: TIME_LIST[TIME_LIST.length - 1].value
  });

  const [shuruUsageData, setShuruUsageData] = useState(0);
  const [beforeSleepData, setBeforeSleepData] = useState({
    positive: 10,
    negative: 20
  });

  const [afterSleepData, setAfterSleepData] = useState({
    positive: 10,
    negative: 20
  });

  const [breathworkInsights, setBreathworkInsights] = useState({
    sessions: 0,
    duration: 0
  });

  const [contentUsageData, setContentUsageData] = useState({
    notPrefer: 100,
    maleCounts: 70,
    femaleCounts: 80,
    nonBinaryCounts: 40,
    intersexCounts: 40,
    transgenderCounts: 40,
    userData: null
  });

  const [userActivityUsageData, setUserActivityUsageData] = useState([
    {
      name: 'Day',
      users: 5,
      duration: 10
    },
    {
      name: 'Weekly',
      users: 5
    },
    {
      name: 'Monthly',
      users: 5,
      duration: 10
    },
    {
      name: 'Yearly',
      users: 5,
      duration: 10
    },
    {
      name: 'Custom',
      users: 5,
      duration: 10
    }
  ]);

  const [jobFilter, setJobFilter] = useState({
    name: 'jobs',
    value: JOB_ROLES_CATEGORY[0].value
  });

  const RadialDummydata = [
    { name: 'Not Prefer', x: 10, fill: '#3C0753' },
    { name: 'Male', x: 8, fill: '#FFB000' },
    { name: 'Female', x: 6, fill: '#79AC78' },
    { name: 'Non Binary', x: 6, fill: '#31304D' },
    { name: 'Intersex', x: 6, fill: '#FFAD84' },
    { name: 'Transgender', x: 6, fill: '#F28585' }
  ];

  const wrapperRef = useRef(null);
  const shuruWrapperRef = useRef(null);
  const rippleWrapperRef = useRef(null);
  const activityWrapperRef = useRef(null);
  const emotionWrapperRef = useRef(null);

  const optionArray = (flag) => {
    let chartOptions = {
      chart: {
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            }
          },
          dataLabels: {
            enabled: false
          }
        }
      ],
      colors:
        flag === 1
          ? ['#D97F56', '#ECC09E']
          : flag === 2
          ? ['#67A14A', '#C2EC97']
          : flag === 3
          ? ['#F05289', '#FF9BCB']
          : flag === 4
          ? ['#21BDAD', '#6BE0BD']
          : flag === 5
          ? ['#F7E895', '#FFE873']
          : ['#ffffff', '#ffffff'],
      labels: flag === 1 ? ['Subscribed', 'Unsubscribed'] : ['Playing Now', 'Playing Past'],
      toolTip: {
        style: {
          fontSize: '20px'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '88',
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                color: '#808080'
              },
              value: {
                show: true,
                color: '#000000'
                // formatter: function () {
                //   let checkInsideData =
                //     flag === 1
                //       ? insideData.meditationIn
                //       : flag === 2
                //       ? insideData.soundIn
                //       : flag === 3
                //       ? insideData.ritualIn
                //       : flag === 4
                //       ? insideData.affirmationIn
                //       : flag === 5
                //       ? insideData.podIn
                //       : 0;
                //   const sum = checkInsideData.reduce(
                //     (partialSum, a) => partialSum + a,
                //     0
                //   );
                //   return sum;
                // },
              }
            }
          }
        }
      }
    };
    return chartOptions;
  };
  const handleSelectRange = (e) => {
    let start = new Date(e?.selection?.startDate);
    start.setHours(new Date().getHours());
    start.setMinutes(new Date().getMinutes());
    start.setSeconds(new Date().getSeconds());
    let end = new Date(e?.selection?.endDate);
    end.setHours(new Date().getHours());
    end.setMinutes(new Date().getMinutes());
    end.setSeconds(new Date().getSeconds());
    const date = {
      startDate: start,
      endDate: end
    };
    setDateRange(date);
  };

  const handleSelectShuruRange = (e) => {
    let start = new Date(e?.selection?.startDate);
    start.setHours(new Date().getHours());
    start.setMinutes(new Date().getMinutes());
    start.setSeconds(new Date().getSeconds());
    let end = new Date(e?.selection?.endDate);
    end.setHours(new Date().getHours());
    end.setMinutes(new Date().getMinutes());
    end.setSeconds(new Date().getSeconds());
    const date = {
      startDate: start,
      endDate: end
    };
    setShuruUsageDateRange(date);
  };

  const handleSelectRippleRange = (e) => {
    let start = new Date(e?.selection?.startDate);
    start.setHours(new Date().getHours());
    start.setMinutes(new Date().getMinutes());
    start.setSeconds(new Date().getSeconds());
    let end = new Date(e?.selection?.endDate);
    end.setHours(new Date().getHours());
    end.setMinutes(new Date().getMinutes());
    end.setSeconds(new Date().getSeconds());
    const date = {
      startDate: start,
      endDate: end
    };
    setRippleUsageDateRange(date);
  };

  const handleSelectActivityRange = (e) => {
    let start = new Date(e?.selection?.startDate);
    start.setHours(new Date().getHours());
    start.setMinutes(new Date().getMinutes());
    start.setSeconds(new Date().getSeconds());
    let end = new Date(e?.selection?.endDate);
    end.setHours(new Date().getHours());
    end.setMinutes(new Date().getMinutes());
    end.setSeconds(new Date().getSeconds());
    const date = {
      startDate: start,
      endDate: end
    };
    setUserActivityDateRange(date);
  };

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) {
      setShowFilterModal(false);
    }
    if (showRevenueDateCalendar) {
      setShowRevenueDateCalendar(false);
    }

    if (shuruUsageDateFilter) {
      setshuruUsageDateFilter(false);
    }

    if (rippleUsageDateFilter) {
      setRippleUsageDateFilter(false);
    }

    if (userActivityDateFilter) {
      setUserActivityDateFilter(false);
    }
  });

  useOutsideClick(shuruWrapperRef, () => {
    if (shuruUsageDateFilter) {
      setshuruUsageDateFilter(false);
    }
  });

  useOutsideClick(activityWrapperRef, () => {
    if (userActivityDateFilter) {
      setUserActivityDateFilter(false);
    }
  });

  useOutsideClick(rippleWrapperRef, () => {
    if (rippleUsageDateFilter) {
      setRippleUsageDateFilter(false);
    }
  });

  const getBeforeSleepPercentages = () => {
    Api.getSleepLogPercent()
      .then((res) => {
        const data = res?.data?.data;
        setBeforeSleepData({
          ...beforeSleepData,
          negative: data.negative,
          positive: data.positive
        });
      })
      .catch((err) => {});
  };

  const getAfterSleepPercentages = () => {
    Api.getAfterSleepLogPercent()
      .then((res) => {
        const data = res?.data?.data;
        setAfterSleepData({
          ...beforeSleepData,
          negative: data.negative,
          positive: data.positive
        });
      })
      .catch((err) => {});
  };

  const getBreathworkInsights = () => {
    Api.getBreathworkInsights()
      .then((res) => {
        const data = res?.data?.data;
        setBreathworkInsights({
          ...breathworkInsights,
          sessions: data.sessions,
          duration: data.duration
        });
      })
      .catch((err) => {});
  };

  const getUserPlansData = () => {
    setLoader(true);
    Api.getUserPlansData(1)
      .then((res) => {
        const data = res?.data?.data;
        setSubscribeDetailsData([data.subscribed, data.unsubscribed]);
      })
      .catch((err) => {});

    Api.getUserPlansData(2)
      .then((res) => {
        const data = res?.data?.data;
        setLoader(false);

        setActivePayingUserData([
          {
            name: 'Lifetime',
            x: data?.lifetimeSubscriptionsCount,
            fill: '#B6C0F3'
          },
          {
            name: '1 Month',
            x: data?.monthlySubscriptionsCount,
            fill: '#6167e8'
          },
          {
            name: '6 Month',
            x: data?.sixMonthsSubscriptionsCount,
            fill: '#4a56db'
          },
          {
            name: '1 Year',
            x: data?.annuallySubscriptionsCount,
            fill: '#313b6b'
          }
        ]);

        setTrialUsers([res?.data.data.underTrialUsers, res?.data.data.freePlanUsers]);
      })
      .catch((err) => {});

    setLoader(false);
  };

  const getJobsData = () => {
    let payload = {
      jobs: jobFilter.value
    };
    Api.getJobsPercent(payload).then((res) => {
      if (res.data.meta.code === 1) {
        setContentUsageData({
          ...contentUsageData,
          notPrefer: res.data.data.notPrefer,
          maleCounts: res.data.data.maleCounts,
          femaleCounts: res.data.data.femaleCounts,
          nonBinaryCounts: res.data.data.nonBinaryCounts,
          intersexCounts: res.data.data.intersexCounts,
          transgenderCounts: res.data.data.transgenderCounts,
          userData: res.data.data.userData
        });
      }
    });
  };

  const downloadCsvFile = (data, filename) => {
    if (!data || data.length === 0) {
      console.error('JSON array is empty.');
      return;
    }

    data.map((i) => {
      i.createdAt = convertToIndianDate(i?.createdAt);
      i.accountType = convertCodeToType(i?.accountType);
      i.loginPlatform = convertCodeToPlatform(i?.loginPlatform);
      i.gender = getGender(i?.gender);
      i.userType = convertCodeToUserType(i?.userType);
    });

    const csvContent = jsonToCsv(data);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename || 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const addSolution = (solutionText, graphName) => {
  //   let startDate = new Date();
  //   startDate = startDate.setHours(0, 0, 0, 0);
  //   let endDate = new Date(startDate);
  //   endDate = endDate.setHours(23, 59, 59, 0);
  //   const solution = {
  //     endDate: endDate,
  //     startDate: startDate,
  //     solutionData: solutionText,
  //     graphName
  //   };
  //   setLoader(true);
  //   Api.addSolutionData(solution)
  //     .then((res) => {
  //       setLoader(false);
  //     })
  //     .catch((err) => {
  //       setLoader(false);
  //     });
  // };

  // const downLoadSolutions = async (data) => {
  //   setLoader(true);
  //   await CompanyApi.getSolutionTextFromOpenAi({
  //     oldSolution: '',
  //     solutionType: 4,
  //     breathwork: breathworkInsights,
  //     graphName: "Breathwork Insights"
  //   })
  //     .then((res) => {
  //       addSolution(res?.data?.data, "Breathwork Insights");
  //     })
  //     .catch((err) => { });

  //   setLoader(false);
  // };

  const addBreathworkReport = (solutionText, graphName) => {
    let startDate = new Date();
    startDate = startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(startDate);
    endDate = endDate.setHours(23, 59, 59, 0);
    const solution = {
      endDate: endDate,
      startDate: startDate,
      reportData: breathworkInsights,
      graphName
    };
    setLoader(true);
    Api.addBreathworkReportData(solution)
      .then((res) => {
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  useEffect(() => {
    Api.getShuruUsageData(
      moment(shuruUsageDateRange.startDate).format('YYYY-MM-DD'),
      moment(shuruUsageDateRange.endDate).format('YYYY-MM-DD')
    ).then((res) => {
      if (res?.data?.meta?.code === 1) {
        setShuruUsageData(res?.data?.data?.totalShuruUsageTimeInHours);
      }
    });
  }, [shuruUsageDateRange]);

  useEffect(() => {
    Api.getUserActivityStats(
      moment(userActivityDateRange.startDate).format('YYYY-MM-DD'),
      moment(userActivityDateRange.endDate).format('YYYY-MM-DD')
    ).then((res) => {
      if (res?.data?.meta?.code === 1) {
        setUserActivityUsageData(res?.data?.data);
      }
    });
  }, [userActivityDateRange]);

  useEffect(() => {
    Api.rippleUsage(
      moment(rippleUsageDateRange.startDate).format('YYYY-MM-DD'),
      moment(rippleUsageDateRange.endDate).format('YYYY-MM-DD'),
      timeConstant.value
    ).then((res) => {
      if (res?.data?.meta?.code === 1) {
        setRippleUsageData({
          ...rippleUsageData,
          totalMoods: res.data.data.totalMoodCounts,
          totalHourSpent: res.data.data.totalRippleUsageTimeInHours,
          totalActivatedUsers: res.data.data.activatedUsers,
          totalInactivatedUsers: res.data.data.notActivatedUsers
        });
      }
    });
  }, [rippleUsageDateRange, timeConstant.value]);

  useEffect(() => {
    getUserPlansData();
    getBeforeSleepPercentages();
    getAfterSleepPercentages();
    getBreathworkInsights();
  }, []);

  useEffect(() => {
    getJobsData();
  }, [jobFilter]);

  const downloadRippleReport = () => {
    Api.rippleReport(
      moment(rippleUsageDateRange.startDate).format('YYYY-MM-DD'),
      moment(rippleUsageDateRange.endDate).format('YYYY-MM-DD'),
      timeConstant.value
    );
  };

  return (
    <div className="w-full">
      <div className="mt-6 grid grid-cols-1 gap-4 gap-x-4 lg:grid-cols-4">
        <div className="rounded-3xl border border-gray-300 bg-white p-4 dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white lg:col-span-2">
          <div className="flex h-auto items-center justify-between">
            <div className="p-2 text-lg font-medium text-black dark:text-white lg:text-xl">
              SOS details
            </div>
            <div className="relative flex items-center gap-x-2">
              <Transition
                show={showFilterModal}
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 z-[2] mt-2 origin-top-right -translate-x-[80%] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white lg:right-16 lg:-translate-x-0">
                  <div ref={wrapperRef}>
                    <DateRangePicker
                      ranges={[
                        {
                          startDate: dateRange?.startDate ? dateRange?.startDate : new Date(),
                          endDate: dateRange?.endDate ? dateRange?.endDate : new Date(),
                          key: 'selection'
                        }
                      ]}
                      onChange={handleSelectRange}
                      maxDate={new Date()}
                    />
                  </div>
                </div>
              </Transition>
              <button
                className="hover:shoorah-primary relative inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm focus:outline-none sm:w-auto"
                onClick={() => setShowFilterModal((state) => !state)}
              >
                <CalendarIcon className="inline h-[20px] w-[18px] text-white" />
              </button>

              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={` ${
                        open ? '' : 'text-opacity-90'
                      } itesubscribedms-center hover:shoorah-primary inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm focus:outline-none sm:w-auto`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z"
                          fill="#E5EAF9"
                        />
                      </svg>
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute left-3/4 z-10 mt-3 w-screen max-w-[15rem] -translate-x-1/2 transform rounded-md border bg-white dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white">
                        <p
                          onClick={() => downloadSosReport(1)}
                          className="cursor-pointer rounded-md px-1 py-2 hover:bg-gray-300"
                        >
                          30 days
                        </p>
                        <p
                          onClick={() => downloadSosReport(2)}
                          className="cursor-pointer rounded-md px-1 py-2 hover:bg-gray-300"
                        >
                          90 days
                        </p>
                        <p
                          onClick={() => downloadSosReport(3)}
                          className="cursor-pointer rounded-md px-1 py-2 hover:bg-gray-300"
                        >
                          Custom
                        </p>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </div>
          </div>
          <div className="relative mt-4 flex h-auto flex-col items-center justify-center lg:flex-row xl:flex-row">
            <div className="mr-6 flex items-center justify-center">
              <RadialBarChart
                // width={180}
                // height={180}
                width={300}
                height={300}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="35%"
                outerRadius="120%"
                barSize={10}
                className="hidden lg:block"
              >
                <RadialBar minAngle={15} dataKey="x" clockWise background />
              </RadialBarChart>

              <RadialBarChart
                // width={180}
                // height={180}
                width={200}
                height={200}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="35%"
                outerRadius="120%"
                barSize={10}
                className="lg:hidden"
              >
                <RadialBar minAngle={15} dataKey="x" clockWise background />
              </RadialBarChart>
            </div>
            <span className="dashboard_sec2_custom grid grid-cols-1 items-center justify-center gap-x-6 text-sm lg:gap-x-12 lg:gap-y-6 lg:text-base">
              <span>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#186F65]"></span>
                  <div>
                    <div className="text-gray-400">Total User</div>
                  </div>{' '}
                  <div className="text-lg font-medium lg:text-xl">
                    {sosData.uniqueSosPhoneUsers ? sosData.uniqueSosPhoneUsers : 0}
                  </div>
                </div>
              </span>
              <span>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#B5CB99]"></span>
                  <div>
                    <div className="text-gray-400">SOS Count</div>
                  </div>{' '}
                  <div className="text-lg font-medium lg:text-xl">
                    {sosData.sosClicks ? sosData.sosClicks : 0}
                  </div>
                </div>
              </span>
              <span>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#B2533E]"></span>
                  <div>
                    <div className="text-gray-400">Call Count</div>
                  </div>{' '}
                  <div className="text-lg font-medium lg:text-xl">
                    {sosData.sosPhone ? sosData.sosPhone : 0}
                  </div>
                </div>
              </span>
            </span>
          </div>
        </div>
        <div className="w-full rounded-3xl border border-gray-300 bg-white p-4 dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white">
          <div>
            <div className="text-lg font-medium text-black dark:text-white lg:text-xl">
              Subscribe Details
            </div>
            <div className="mt-3 flex justify-center lg:scale-75">
              <Chart
                options={optionArray(1)}
                series={subscribeDetailsData}
                type="donut"
                width={300}
                height={300}
              />
            </div>
            <div className="mt-4 flex flex-col items-center justify-center gap-x-6 text-sm lg:text-base">
              <div className="webkit_in">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#D97F56]"></span>
                <div className="flex items-center justify-center">
                  <div className="mr-2 text-gray-400">Subscribed: </div>
                  <div className="text-lg lg:text-xl">{subscribeDetailsData[0]}</div>
                </div>
              </div>
              <div className="webkit_in">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#ECC09E]"></span>
                <div className="flex items-center justify-center">
                  <div className="mr-2 text-gray-400">Unsubscribed: </div>
                  <div className="text-lg lg:text-xl">{subscribeDetailsData[1]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full rounded-3xl border border-gray-300 bg-white p-4 dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white">
          <div className="w-full">
            <div className="text-base font-medium text-black dark:text-white lg:text-xl">
              Trial v/s Free Users
            </div>
            <div className="mt-3 flex justify-center lg:scale-75">
              <Chart
                options={optionArray(2)}
                series={trialUsers}
                type="donut"
                width={300}
                height={300}
              />
            </div>
            <div className="mt-4 flex w-full flex-row items-center justify-center gap-x-6 text-sm lg:flex-col lg:text-base">
              <div className="flex items-center">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#67A14A]"></span>
                <div className="flex items-center justify-center">
                  <div className="mr-2 text-gray-400">Trial users: </div>
                  <div className="text-lg lg:text-xl">{trialUsers[0]}</div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#C2EC97]"></span>
                <div className="flex items-center justify-center">
                  <div className="mr-2 text-gray-400">Free plan users: </div>
                  <div className="text-lg lg:text-xl">{trialUsers[1]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active paying users and retention */}
      <div className="mb-5 mt-6 grid grid-cols-1 gap-4 gap-x-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-300 bg-white p-4 dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white">
          {false && (
            <Transition
              show={showFilterModal}
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className="absolute z-[2] mx-auto mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white sm:right-[2rem] lg:left-0 lg:right-[2rem]"
                ref={wrapperRef}
              >
                <DateRangePicker
                  ranges={[
                    {
                      startDate: dateRange?.startDate ? dateRange?.startDate : new Date(),
                      endDate: dateRange?.endDate ? dateRange?.endDate : new Date(),
                      key: 'selection'
                    }
                  ]}
                  onChange={handleSelectRange}
                  maxDate={new Date()}
                />
              </div>
            </Transition>
          )}
          <div className="flex items-center justify-between">
            <div className="p-2 text-lg font-medium text-black dark:text-white lg:text-xl">
              Active Subscription Plans
            </div>
            {/* <button
              className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
              //   onClick={() => setShowFilterModal((state) => !state)}
            >
              <CalendarIcon className="text-white w-[18px] h-[20px] inline" />
            </button> */}
          </div>
          <div className="relative flex h-auto flex-col items-center justify-center gap-x-8 lg:mt-4 lg:flex-row xl:flex-row">
            <div className="flex scale-75 items-center justify-center lg:scale-100">
              <RadialBarChart
                width={280}
                height={280}
                data={activePayingUserData}
                cx="50%"
                cy="50%"
                innerRadius="35%"
                outerRadius="120%"
                barSize={10}
              >
                <RadialBar minAngle={15} dataKey="x" clockWise background />
              </RadialBarChart>
            </div>
            <span className="dashboard_sec2_custom grid grid-cols-1 items-center justify-center gap-x-12 text-sm lg:gap-y-6 lg:text-base">
              {activePayingUserData.map(({ name, x, fill }) => (
                <span key={name}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full`}
                      style={{ backgroundColor: `${fill}` }}
                    ></span>
                    <div>
                      <div className="text-gray-400">{name}</div>
                    </div>
                    <div className="text-lg font-medium lg:text-xl">{x}</div>
                  </div>
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className="w-full">
          <div className="relative h-full rounded-3xl border border-gray-300 bg-white p-4 dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white">
            <div className="mb-4 flex w-full items-center justify-between p-2 text-lg font-medium text-black dark:text-white lg:text-xl">
              <h4> {'Shuru Usage'}</h4>

              <button
                className="hover:shoorah-primary inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm focus:outline-none sm:w-auto"
                onClick={() => {
                  setshuruUsageDateFilter((state) => !state);
                }}
              >
                <CalendarIcon className="inline h-[20px] w-[18px] text-white" />
              </button>

              <Transition
                show={shuruUsageDateFilter}
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className="absolute right-[1rem] top-[1.5rem] z-[10] mx-auto mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white lg:right-[3.8rem] lg:top-[1.8rem]"
                  ref={shuruWrapperRef}
                >
                  <DateRangePicker
                    ranges={[
                      {
                        startDate: shuruUsageDateRange?.startDate
                          ? shuruUsageDateRange?.startDate
                          : new Date(),
                        endDate: shuruUsageDateRange?.endDate
                          ? shuruUsageDateRange?.endDate
                          : new Date(),
                        key: 'selection'
                      }
                    ]}
                    onChange={handleSelectShuruRange}
                    maxDate={new Date()}
                  />
                </div>
              </Transition>
            </div>
            <div className="flex h-full flex-col items-center gap-[3rem]">
              <div className="mt-[2rem] flex w-full items-end justify-center text-6xl font-semibold lg:text-8xl">
                <p>{shuruUsageData}</p>
                <span className="mb-2 text-lg lg:text-2xl"> {' hrs'}</span>
              </div>
              <div className="flex w-full justify-center text-sm text-gray-400 lg:text-base">
                {moment(shuruUsageDateRange.startDate).format('MMM Do YY')} {' to '}
                {moment(shuruUsageDateRange.endDate).format('MMM Do YY')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-shoorah-newDashboardBlue mb-5 grid grid-cols-1 gap-6 dark:text-white lg:grid-cols-2">
        {/* graph */}
        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white p-6 dark:border-none dark:bg-shoorah-darkBgTabColor">
          <div className="flex w-full items-center justify-between gap-x-4">
            <h4 className="relative flex w-full flex-col whitespace-nowrap text-lg font-medium">
              Job Roles %
              <span className="w-[100%] text-xs text-gray-400">
                Understanding of your users's percentage <br />
                of job roles on app.
              </span>
              <div className="mt-3 w-full flex-col items-center justify-start text-lg font-medium text-black dark:text-white lg:flex-row">
                <select
                  className="h-8 rounded-md border px-1 text-[#666666] dark:border-none dark:bg-shoorah-darkBgColor dark:text-white lg:w-auto"
                  // value={graphParam.companyName}
                  id="jobs"
                  name="jobs"
                  onChange={(e) => {
                    let jobs = JOB_ROLES_CATEGORY.find((i) => i.name === e.target.value);
                    setJobFilter({
                      ...jobFilter,
                      value: jobs.value,
                      name: e.target.name
                    });
                  }}
                >
                  {JOB_ROLES_CATEGORY.map(({ name, value }) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="hover:shoorah-primary absolute right-[-1.5rem] top-0 mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm focus:outline-none sm:w-auto"
                onClick={() => downloadCsvFile(contentUsageData.userData, 'jobs_users.csv')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-save inline h-[20px] w-[18px] rotate-180 text-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
                  <title>Export Earnings</title>
                </svg>
              </button>
            </h4>
          </div>
          <div className="relative flex flex-col items-center justify-between gap-4">
            <div className="flex items-center justify-center">
              <ReactApexChart
                series={[
                  contentUsageData.notPrefer,
                  contentUsageData.maleCounts,
                  contentUsageData.femaleCounts,
                  contentUsageData.nonBinaryCounts,
                  contentUsageData.intersexCounts,
                  contentUsageData.transgenderCounts
                ]}
                options={{
                  colors: ['#3C0753', '#FFB000', '#79AC78', '#31304D', '#FFAD84', '#F28585'],
                  labels: ['Not Prefer', 'Male', 'Female', 'Non Binary', 'Intersex', 'Transgender'],
                  chart: {
                    height: 350,
                    width: 350,
                    type: 'radialBar'
                  },
                  plotOptions: {
                    radialBar: {
                      hollow: {
                        size: '50%',
                        color: '#fff'
                      },
                      track: {
                        background: '#808080',
                        opacity: 0.2,
                        strokeWidth: '90%'
                      },

                      dataLabels: {
                        name: {
                          show: true,
                          fontSize: '18px',
                          fontFamily: 'Work Sans, sans-serif'
                        },
                        value: {
                          show: true,
                          fontSize: '16px',
                          formatter: function (w) {
                            return w + ' %';
                          }
                        }
                      }
                    }
                  },

                  stroke: {
                    lineCap: 'round',
                    curve: 'smooth'
                  }
                }}
                type="radialBar"
                height={350}
                width={350}
              />
            </div>
            <div className="mx-auto grid w-full grid-cols-2 items-center justify-center gap-4 text-sm md:grid-cols-3">
              <div className="flex items-center justify-start gap-3">
                <span className={`inline-block h-4 w-4 rounded bg-[#3C0753]`}></span>
                <div className="text-gray-400"> {RadialDummydata[0].name}</div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <span className={`inline-block h-4 w-4 rounded bg-[#FFB000]`}></span>
                <div className="text-gray-400"> {RadialDummydata[1].name}</div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <span className={`inline-block h-4 w-4 rounded bg-[#79AC78]`}></span>
                <div className="text-gray-400"> {RadialDummydata[2].name}</div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <span className={`inline-block h-4 w-4 rounded bg-[#31304D]`}></span>
                <div className="text-gray-400"> {RadialDummydata[3].name}</div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <span className={`inline-block h-4 w-4 rounded bg-[#FFAD84]`}></span>
                <div className="text-gray-400"> {RadialDummydata[4].name}</div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <span className={`inline-block h-4 w-4 rounded bg-[#F28585]`}></span>
                <div className="text-gray-400"> {RadialDummydata[5].name}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white p-6 dark:border-none dark:bg-shoorah-darkBgTabColor">
          <div className="relative flex w-full items-center justify-between gap-x-4">
            <h4 className="relative flex w-full flex-col whitespace-nowrap text-lg font-medium">
              Ripple Statistics
              <span className="w-[100%] text-xs text-gray-400">
                Understanding of your ripple users's stats <br />
                on webapp.
              </span>
              <div className="mt-3 flex w-full items-center justify-start gap-[2rem] text-lg font-medium text-black dark:text-white lg:flex-row">
                <select
                  className="h-8 rounded-md border px-1 text-[#666666] dark:border-none dark:bg-shoorah-darkBgColor dark:text-white lg:w-auto"
                  defaultValue={timeConstant.name}
                  id="timeConstant"
                  name="timeConstant"
                  onChange={(e) => {
                    let time = TIME_LIST.find((i) => i.name === e.target.value);
                    setTimeConstant({
                      ...timeConstant,
                      value: time.value,
                      name: e.target.name
                    });
                  }}
                >
                  {TIME_LIST.map(({ name, value }) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <button
                  className="hover:shoorah-primary flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm focus:outline-none sm:w-auto"
                  onClick={() => {
                    setRippleUsageDateFilter(true);
                  }}
                >
                  <CalendarIcon className="inline h-[20px] w-[18px] text-white" />
                </button>
              </div>
            </h4>

            <button
              className="hover:shoorah-primary absolute right-[-1.5rem] top-0 mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none sm:w-auto"
              onClick={downloadRippleReport}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-save inline h-[16px] w-[16px] rotate-180 text-white"
                viewBox="0 0 16 16"
              >
                <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
                <title>Download Report</title>
              </svg>
            </button>
            <Transition
              show={rippleUsageDateFilter}
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                // className="absolute  z-[2] mt-2 lg:right-16 top-16 lg:-translate-x-0 -translate-x-[80%]  origin-top-right rounded-md bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                className="absolute right-[-1rem] top-[2.5rem] z-[10] mx-auto mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white lg:right-[3.8rem] lg:top-[1.8rem]"
              >
                <div ref={rippleWrapperRef}>
                  <DateRangePicker
                    ranges={[
                      {
                        startDate: rippleUsageDateRange?.startDate
                          ? rippleUsageDateRange?.startDate
                          : new Date(),
                        endDate: rippleUsageDateRange?.endDate
                          ? rippleUsageDateRange?.endDate
                          : new Date(),
                        key: 'selection'
                      }
                    ]}
                    onChange={handleSelectRippleRange}
                    maxDate={new Date()}
                  />
                </div>
              </div>
            </Transition>
          </div>
          <div className="relative flex flex-col items-center justify-between gap-4">
            <div className="flex items-center justify-center">
              <ReactApexChart
                series={[
                  rippleUsageData.totalMoods,
                  rippleUsageData.totalHourSpent,
                  rippleUsageData.totalActivatedUsers,
                  rippleUsageData.totalInactivatedUsers
                ]}
                options={{
                  colors: ['#3C0753', '#FFB000', '#79AC78', '#31304D', '#FFAD84', '#F28585'],
                  labels: [
                    'Moods Selections',
                    'Hours Spent',
                    'Activated Users',
                    'Non Activated Users',
                    'Transgender'
                  ],
                  chart: {
                    height: 350,
                    width: 350,
                    type: 'radialBar'
                  },
                  plotOptions: {
                    radialBar: {
                      hollow: {
                        size: '50%',
                        color: '#fff'
                      },
                      track: {
                        background: '#808080',
                        opacity: 0.2,
                        strokeWidth: '90%'
                      },

                      dataLabels: {
                        name: {
                          show: true,
                          fontSize: '18px',
                          fontFamily: 'Work Sans, sans-serif'
                        },
                        value: {
                          show: true,
                          fontSize: '16px',
                          formatter: function (w) {
                            return w;
                          }
                        }
                      }
                    }
                  },

                  stroke: {
                    lineCap: 'round',
                    curve: 'smooth'
                  }
                }}
                type="radialBar"
                height={350}
                width={350}
              />
            </div>
            <div className="flex w-full justify-center text-sm text-gray-400 lg:text-base">
              {moment(rippleUsageDateRange.startDate).format('MMM Do YY')} {' to '}
              {moment(rippleUsageDateRange.endDate).format('MMM Do YY')}
            </div>
            <div className="mx-auto grid w-full grid-cols-2 items-center justify-center gap-4 text-sm md:grid-cols-3">
              <div className="flex items-center justify-start gap-3">
                <span className={`inline-block h-4 w-4 rounded bg-[#3C0753]`}></span>
                <div className="text-gray-400"> Total Moods</div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <span className={`inline-block h-4 w-4 rounded bg-[#FFB000]`}></span>
                <div className="text-gray-400"> Total Hours Spent</div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <span className={`inline-block h-4 w-4 rounded bg-[#79AC78]`}></span>
                <div className="text-gray-400">Total Activated Users</div>
              </div>

              <div className="flex items-center justify-start gap-3">
                <span className={`inline-block h-4 w-4 rounded bg-[#31304D]`}></span>
                <div className="text-gray-400"> Total Non Activated Users</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="relative h-full rounded-3xl border border-gray-300 bg-white p-4 dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white">
            <div className="mb-4 flex w-full items-center justify-between p-2 text-lg font-medium text-black dark:text-white lg:text-xl">
              <h4> {'Before Sleep Logs'}</h4>
            </div>
            <div className="flex h-[10rem] flex-col items-center gap-[2rem] sm:h-[8rem] sm:flex-row">
              <div className="flex w-full items-end justify-center gap-3 text-2xl font-semibold lg:text-4xl">
                <span className="text-lg lg:text-xl"> {'Positive : '}</span>
                <p className="text-[green]"> {beforeSleepData.positive}</p>
                <span className="text-lg lg:text-2xl"> {' %'}</span>
              </div>
              <div className="flex w-full items-end justify-center gap-3 text-2xl font-semibold lg:text-4xl">
                <span className="text-lg lg:text-xl"> {'Negative : '}</span>
                <p className="text-[red]">{beforeSleepData.negative}</p>
                <span className="text-lg lg:text-2xl"> {' %'}</span>
              </div>
              {/* <div className=" text-sm lg:text-base flex w-full justify-center text-gray-400">
                {moment(shuruUsageDateRange.startDate).format('MMM Do YY')} {' to '}
                {moment(shuruUsageDateRange.endDate).format('MMM Do YY')}
              </div> */}
            </div>

            <div className="mb-4 flex w-full items-center justify-between p-2 text-lg font-medium text-black dark:text-white lg:text-xl">
              <h4> {'During Sleep Logs'}</h4>
            </div>
            <div className="flex h-[10rem] flex-col items-center gap-[2rem] sm:h-[8rem] sm:flex-row">
              <div className="flex w-full items-end justify-center gap-3 text-2xl font-semibold lg:text-4xl">
                <span className="text-lg lg:text-xl"> {'Positive : '}</span>
                <p className="text-[green]"> {afterSleepData.positive}</p>
                <span className="text-lg lg:text-2xl"> {' %'}</span>
              </div>
              <div className="flex w-full items-end justify-center gap-3 text-2xl font-semibold lg:text-4xl">
                <span className="text-lg lg:text-xl"> {'Negative : '}</span>
                <p className="text-[red]">{afterSleepData.negative}</p>
                <span className="text-lg lg:text-2xl"> {' %'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="relative h-full rounded-3xl border border-gray-300 bg-white p-4 dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white">
            <div className="mb-4 flex w-full items-center justify-between p-2 text-lg font-medium text-black dark:text-white lg:text-xl">
              <h4> {'Total Breathwork Sessions'}</h4>
              <button
                className="hover:shoorah-primary absolute right-[1rem] top-[1rem] mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-3 py-2 text-sm font-medium text-white shadow-sm focus:outline-none sm:w-auto"
                onClick={addBreathworkReport}
              >
                <svg
                  className="h-5 w-5 fill-shoorah-sidebarBackground dark:fill-white"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="#fff"
                    strokeWidth="1"
                    d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex h-[10rem] flex-col items-center justify-center gap-[0.5rem] sm:h-[8rem] sm:flex-row">
              <div className="flex w-full items-center justify-center gap-3 text-2xl font-semibold lg:text-4xl">
                <p className="text-[#3a47ab]"> {breathworkInsights.sessions}</p>
              </div>
            </div>

            <div className="flex w-full items-center justify-between p-2 text-lg font-medium text-black dark:text-white lg:text-xl">
              <h4> {'Total time spent on sessions'}</h4>
            </div>
            <div className="flex h-[10rem] flex-col items-center justify-center gap-[0.5rem] sm:h-[8rem] sm:flex-row">
              <div className="flex w-full items-center justify-center gap-3 text-2xl font-semibold lg:text-4xl">
                <p className="text-[#3a47ab]">
                  {' '}
                  {breathworkInsights.duration} <span className="text-[1rem]">mins</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <EmotionsStatistics />
      </div>
      <Overallwellbeing />
      <BoxGraph
        sectionThreeArray={userActivityUsageData}
        setUserActivityDateFilter={setUserActivityDateFilter}
        handleSelectActivityRange={handleSelectActivityRange}
        userActivityDateRange={userActivityDateRange}
        setUserActivityDateRange={setUserActivityDateRange}
        activityWrapperRef={activityWrapperRef}
        userActivityDateFilter={userActivityDateFilter}
      />
    </div>
  );
}

DashboardSection4.propTypes = {
  sosData: PropTypes.any,
  dateRange: PropTypes.any,
  setDateRange: PropTypes.any,
  downloadSosReport: PropTypes.func,
  setLoader: PropTypes.func
};

export default DashboardSection4;
