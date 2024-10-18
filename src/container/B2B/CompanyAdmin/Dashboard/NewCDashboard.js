import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AGERANGE, DATECREITERIA, GENDER, USER_FEELS } from '../../../../utils/constants';
import { DateRangePicker } from 'react-date-range';
import {
  convertLargeTextToPDF,
  currentDateWithFormat,
  downloadOWBMHReportToCSV,
  downloadOWBMHReportToPDF,
  downloadSingleRadialReportToCSV,
  downloadSingleRadialReportToPDF,
  errorToast,
  getJWTToken,
  getLocalStorageItem,
  isSuperAdmin,
  minusDayOnDate,
  minusMonthOnDate,
  useOutsideClick
} from '../../../../utils/helper';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Popover, Transition } from '@headlessui/react';
import {
  allBarOptions,
  negativeBarOption,
  optionFirstGraph,
  positiveBarOption,
  radialGraphOption,
  redialPersonalSelect,
  redialProfestionalSelect
} from './dummy';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import { CompanyApi } from '../../../../api/companyApi';
import Loader from '../../../../component/common/Loader';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { isSupported } from 'firebase/messaging';
import { RadialBarChart, RadialBar } from 'recharts';
import { Tooltip as ReactTooltip } from 'react-tooltip';

// images import
import happyImg from '../../../../assets/images/happy.svg';
import neutralImg from '../../../../assets/images/neutral.svg';
import sadImg from '../../../../assets/images/sad.svg';
import trendDownImg from '../../../../assets/images/trendDown.svg';
import trendUpImg from '../../../../assets/images/trendUp.svg';
import surveyCompleteImg from '../../../../assets/images/survey-complete.svg';
import surveyIncompleteImg from '../../../../assets/images/survey-incomplete.svg';
import surveyDeliveredImg from '../../../../assets/images/survey-delivered.svg';
import surveyOpenImg from '../../../../assets/images/survey-open.svg';
import notificationImg from '../../../../assets/images/notification2.svg';
import filterImg from '../../../../assets/images/filter.svg';
import { SidebarContext } from '../../../../context/SidebarContext';
import moment from 'moment/moment';
import EmployeePraiseModal from './EmployeePraiseModal';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../../../api';

import DashboardSurveyChart1 from '../../../Survey/CompanyDashboardSurveyChart';
import DashboardSurveyStatistics from '../../../Survey/DashboardSurveyStatistics';
import BoxGraph from '../../../DashboardContent.js/BoxGraph';
import { API_BASE_URL } from '../../../../core/env.configs';
import EmotionsStatistics from '../../../../component/Statistics/Emotions';
import { requestForToken } from '../../../../firebase';

function NewCDashboard(props) {
  const location = useLocation();
  const [surveyData, setSurveyData] = useState(null);
  // Access the state from location object
  const { state } = location;
  const [subsData, setSubsData] = useState(null);
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
  const [userActivityDateFilter, setUserActivityDateFilter] = useState(false);
  const [dateCalender, setDateCalander] = useState(false);

  const { isDarkModeEnabled } = useContext(SidebarContext);
  const navigate = useNavigate();

  const getSurveyData = () => {
    Api.getCompanySurveyDashboardData()
      .then((res) => res.data)
      .then((response) => {
        setSurveyData(response?.data?.[0] || null);
      });
  };

  const userData = state?._id
    ? state
    : getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const token = getLocalStorageItem('token');
  const wrapperRef = useRef(null);
  const sleepBoxRef = useRef(null);
  const filterModalRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [sleepReportBox, setSleepReportBox] = useState(false);

  const [parameters, setParameters] = useState({
    dateCriteria: '1',
    location: '',
    department: '',
    age: '',
    gender: '',
    startDate: new Date(),
    endDate: new Date(),
    dataType: 3,
    ethinicity: ''
  });
  const [model, setModel] = useState({
    datePickerVisible: false,
    dateChanged: false,
    dateButtonVisible: false
  });
  const [graphDataType, setGraphDataType] = useState({
    firstGrapgh: 'All',
    secondGrapgh: 'All',
    thirdGrapgh: 'Personal'
  });
  const [firstGraph, setFirstGraph] = useState(null);
  const [firstGraphAlternate, setFirstGraphAlternate] = useState({
    data: [],
    option: {}
  });
  const [secondGraph, setSecondGraph] = useState({
    All: allBarOptions,
    positive: {
      ...positiveBarOption,
      series: [
        {
          data: [
            17, 42, 89, 5, 37, 21, 68, 93, 12, 74, 30, 51, 63, 48, 9, 84, 28, 56, 3, 45, 72, 6, 91,
            19, 36
          ]
        }
      ],
      option: {
        xaxis: {
          categories: [
            'I love this job',
            'I get on well with my manager',
            'I love my colleagues',
            "I enjoy the tasks I'm given",
            'I feel fulfilled by my work',
            'I never plan to leave this job',
            "There's so much opportunity for development",
            'My workplace cares about me',
            'I always try my best at work',
            'I get paid fairly for what I do',
            'There are opportunities for me to earn more',
            'I love my working environment',
            'I love how I spend my time at work',
            'I feel valued at work',
            'I have clarity over my role',
            'Morale in my workplace is high',
            'I get lots of extra perks with my job',
            'My workload is achievable and realistic',
            'I am not under much pressure at work',
            'My manager is well organised and clear',
            'My manager respects my time',
            "I'm always given notice of new projects",
            "There's lots of flexibility in my working hours",
            'My manager is a great communicator',
            'My workplace supports my mental health'
          ],

          tooltip: {
            enabled: false
          },
          labels: {
            style: {
              // colors: isDarkModeEnabled ? "#fff" : "#ff0000",
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              // colors: isDarkModeEnabled ? "#fff" : "#ff0000",
            }
          }
        }
      }
    },
    negative: {
      ...negativeBarOption,
      series: [
        {
          data: [
            -17, -42, -89, -5, -37, -21, -68, -93, -12, -74, -30, -51, -63, -48, -9, -84, -28, -56,
            -3, -45, -72, -6, -91, -19, -36
          ]
        }
      ],
      option: {
        xaxis: {
          categories: [
            'I hate this job',
            "I can't stand my manager",
            "I don't like my colleagues",
            "I hate the tasks I'm given",
            'I am bored at work',
            'I want a new job',
            "There's no opportunity for development",
            "My workplace doesn't care about me",
            'I do as little as possible at work',
            "I don't get paid enough",
            'My earning opportunities are limited',
            'I hate my working environment',
            "I feel like I'm wasting my time at work",
            'Nobody values what I do at work',
            'My role is very unclear',
            'Morale in my workplace is very low',
            'There are no perks to my job',
            'My workload is unrealistic and not achievable',
            'I am under too much pressure at work',
            'My manager is disorganised and chaotic',
            'My manager has no respect for my time',
            'New projects are landed on me at short notice',
            'My manager is terrible at communication',
            "There's no flexibility in my working hours",
            "My mental health isn't supported at all"
          ],
          labels: {
            style: {
              // colors: isDarkModeEnabled ? "#fff" : "#000",
            }
          }
        },

        yaxis: {
          labels: {
            style: {
              // colors: isDarkModeEnabled ? "#fff" : "#000",
            }
          }
        }
      }
    }
  });

  const [secondGraphDataRaw, setSecondGraphDataRaw] = useState({});

  const [therapyPercentileData, setTherapyPercentileData] = useState({});

  const [secondGraphAlternate, setSecondGraphAlternate] = useState(allBarOptions);
  const [thirdGraph, setThirdGraph] = useState({ data: [], option: {} });
  const [thirdGraphAlternate, setThirdGraphAlternate] = useState({
    data: [],
    option: {}
  });
  const [radialMood, setRadialMood] = useState(redialPersonalSelect[0].toLowerCase());
  const [radialMoodAlternate, setRadialMoodAlternate] = useState(
    redialProfestionalSelect[0]?.value.toLowerCase()
  );
  const [filterData, setFilterData] = useState({
    countries: [],
    departments: [],
    ethnicities: []
  });
  const [overallMood, setOverallMood] = useState('');
  const [moodPercentage, setMoodPercentage] = useState(null);
  const [firstGraphMoodsAverage, setFirstGraphMoodsAverage] = useState({
    positive: '',
    negative: ''
  });
  const [secondGraphMoodsAverage, setSecondGraphMoodsAverage] = useState({
    positive: '',
    negative: ''
  });
  const [thirdGraphMoodsAverage, setThirdGraphMoodsAverage] = useState({
    positive: '',
    negative: ''
  });

  const [thirdGraphMoodsAverageAlternate, setThirdGraphMoodsAverageAlternate] = useState({
    positive: '',
    negative: ''
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // new states

  const [activeUsersAndTimeData, setActiveUsersAndTimeData] = useState({
    activeUserPercentage: 100,
    highestCountInterval: 0,
    users: 0
  });

  const [breathworkInsights, setBreathworkInsights] = useState({
    sessions: 0,
    duration: 0
  });

  const [recentJoinedEmployData, setRecentJoinedEmployData] = useState([]);

  const [emplyeeActivityData, setEmplyeeActivityData] = useState({
    monthUsers: 0,
    monthUsersChangePercentage: 0,
    todayUsers: 0,
    todayUsersChangePercentage: 0,
    yearUsers: 0,
    yearUsersChangePercentage: 0
  });

  const [notificationCounts, setNotificationCounts] = useState(0);

  const [trendingContentData, setTrendingContentData] = useState([]);
  const [contentUsageData, setContentUsageData] = useState({
    journalCounts: 70,
    restoreCounts: 80,
    shuruCounts: 100,
    podsCounts: 40
  });

  const [isPraiseEmployModalOpen, setIsPraiseEmployModalOpen] = useState(false);

  const [moodChosen, setMoodChosen] = useState({
    isprofessionalMoodPositive: true,
    isPersonalMoodPositive: true
  });

  const [sleepChosen, setsleepChosen] = useState({
    isBeforeSleepPositive: true,
    isAfterSleepPositive: true
  });

  const [personalMoodData, setPersonalMoodData] = useState(null);
  const [professionalMoodData, setProfessionalMoodData] = useState(null);

  const [beforeSleepData, setBeforeSleepData] = useState(null);
  const [afterSleepData, setAfterSleepData] = useState(null);

  const [userActivityDateRange, setUserActivityDateRange] = useState({
    startDate: new Date(new Date().getTime() - 24 * 3600000),
    endDate: new Date()
  });

  const activityWrapperRef = useRef(null);

  const [overallMoodData, setOverallMoodData] = useState({
    positiveScore: 0,
    negativeScore: 0,
    overallMoodPercentage: '0',
    overallMood: 'Neutral'
  });

  const [mostUsedFeatureDateFilter, setMostUsedFeatureDateFilter] = useState(1);
  const [theraphyData, setTheraphyData] = useState(null);
  const [theraphyUserCount, setTheraphyUserCount] = useState(null);

  const [sosData, setSosData] = useState({
    sosClicks: 0,
    sosPhone: 0,
    uniqueSosPhoneUsers: 0
  });

  let dateCategory = '';

  useEffect(() => {
    const apicall = () => {
      isSupported()?.then(async (res) => {
        if (res) {
          const response = await requestForToken();
          if (response) {
            await Api.addEditDeviceToken();
          }
        }
      });
    };

    apicall();
  }, []);

  const getDate = () => {
    const obj = { startDate: '', endDate: '', minAge: '', maxAge: '' };
    const date = new Date();
    if (parameters.dateCriteria == '1') {
      obj.startDate = currentDateWithFormat(minusDayOnDate(date, 7));
      obj.endDate = currentDateWithFormat(date);
      dateCategory = 'weekly';
    }
    if (parameters.dateCriteria == '2') {
      obj.startDate = currentDateWithFormat(minusDayOnDate(date, 30));
      obj.endDate = currentDateWithFormat(date);
      dateCategory = 'monthly';
    }
    if (parameters.dateCriteria == '3') {
      obj.startDate = currentDateWithFormat(minusMonthOnDate(date, 12));
      obj.endDate = currentDateWithFormat(date);
      dateCategory = 'yearly';
    }
    // if (parameters.dateCriteria == '4' && parameters.endDate == '') return
    if (parameters.dateCriteria == '4') {
      obj.startDate = currentDateWithFormat(parameters?.startDate);
      obj.endDate = currentDateWithFormat(parameters?.endDate);
      dateCategory = 'custom';
    }
    if (parameters.age !== '') {
      const data = AGERANGE.filter((e) => e.value == parameters.age);
      obj.minAge = data[0].content.min;
      obj.maxAge = data[0].content.max;
    }
    return obj;
  };

  const RadialDummydata = [
    { name: 'Journal', x: 10, fill: '#4A56DB' },
    { name: 'Shuru', x: 8, fill: '#8FD460' },
    { name: 'Restore', x: 6, fill: '#F076A0' },
    { name: 'Pods', x: 6, fill: '#7BD3EA' }
  ];

  const sosDummydata = [
    { name: 'Total User', x: 10, fill: '#4A56DB' },
    { name: 'SOS Count', x: 8, fill: '#8FD460' },
    { name: 'Call Count', x: 6, fill: '#F076A0' }
  ];

  const getFirstGraphData = (dataType) => {
    const obj = { ...getDate() };

    CompanyApi.getPersonalMoodsGraphData(
      obj.startDate,
      obj.endDate,
      parameters.department,
      obj.minAge,
      obj.maxAge,
      parameters.location,
      parameters.ethinicity,
      parameters.gender,
      dataType.toLowerCase(),
      props.companyId
    )
      .then((res) => {
        setPersonalMoodData(res?.data?.data);
      })
      .catch((err) => {});

    CompanyApi.getProfessionalMoodsGraphData(
      obj.startDate,
      obj.endDate,
      parameters.department,
      obj.minAge,
      obj.maxAge,
      parameters.location,
      parameters.ethinicity,
      parameters.gender,
      dataType.toLowerCase(),
      props.companyId
    )
      .then((res) => {
        setProfessionalMoodData(res?.data?.data);
      })
      .catch((err) => {});
  };

  const getSecondGraphData = () => {
    const obj = { ...getDate() };
    CompanyApi.getShuruTheraphyData(
      obj.startDate,
      obj.endDate,
      userData.companyId || props.companyId,
      obj.minAge,
      obj.maxAge,
      parameters.department,
      parameters.location,
      parameters.gender,
      parameters.dataType,
      null,
      parameters.ethinicity,
      'Shuru Theraphy'
    ).then((res) => {
      setSecondGraphDataRaw(res.data.data);
      setTheraphyUserCount(res.data?.data?.totalUsers);
      setTheraphyData(JSON.stringify(res.data.data));

      let theraphyPositiveData = res?.data.data.positiveCounts?.series[0]?.data;
      let theraphyNegativeData = res?.data.data.negativeCounts?.series[0]?.data;
      let positiveCount = theraphyPositiveData.reduce((sum, count) => sum + count, 0);
      let negativeCount = theraphyNegativeData.reduce((sum, count) => sum + count, 0);
      let totalCount = positiveCount + negativeCount;

      let percentagePositive = parseFloat((positiveCount / totalCount) * 100).toFixed(2);
      let percentageNegative = parseFloat((negativeCount / totalCount) * 100).toFixed(2);

      setTherapyPercentileData({
        positive: percentagePositive,
        negative: percentageNegative
      });

      setSecondGraph({
        ...secondGraph,
        positive: {
          ...positiveBarOption,
          series: [
            {
              data: res?.data.data.positive.series[0]?.data
            }
          ],

          option: {
            colors: ['#6000DA'],
            dataLabels: {
              formatter: function (val, opt) {
                return Math.abs(Math.round(val)) + ' %';
              },
              enabled: true
            },
            stroke: {
              width: 0
            },
            xaxis: {
              min: 0,
              max: 100,
              categories: res?.data.data.positive?.categories,
              labels: {
                formatter: function (val) {
                  return Math.abs(Math.round(val)) + ' %';
                }
              }
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val + ' %';
                }
              },
              enabled: true
            }
          }
        },
        negative: {
          ...negativeBarOption,
          series: [
            {
              data: res?.data.data.negative.series[0]?.data
            }
          ],
          option: {
            colors: ['#4902AA'],
            dataLabels: {
              formatter: function (val, opt) {
                return Math.abs(Math.round(val)) + ' %';
              },
              enabled: true
            },
            stroke: {
              width: 0
            },

            xaxis: {
              min: 0,
              max: 100,
              categories: res?.data.data.negative?.categories,
              labels: {
                formatter: function (val) {
                  return Math.abs(Math.round(val)) + ' %';
                }
              }
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val + ' %';
                }
              },
              enabled: true
            }
          }
        }
      });
    });

    changeGraphOption('positive', 'secondGrapgh');
  };

  const getFilterData = () => {
    setLoader(true);
    CompanyApi.getFilterData(state?._id ? state._id : userData.companyId)
      .then((res) => {
        setLoader(false);
        setFilterData(res.data);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const getOverAllScore = () => {
    const obj = { ...getDate() };
    CompanyApi.getOverallScore(
      obj.startDate,
      obj.endDate,
      parameters.department,
      obj.minAge,
      obj.maxAge,
      parameters.location,
      parameters.ethinicity,
      parameters.gender,
      parameters.dataType == '' ? null : parameters.dataType == 'personal' ? 1 : 2,
      props.companyId || userData.companyId,
      theraphyData
    )
      .then((res) => {
        setOverallMoodData(res?.data?.data);
        // let mood = parseInt(res.data.overallMoodPercentage);
        // setMoodPercentage(mood);
        // if (mood < -50) {
        //   setOverallMood("Very Poor");
        // } else if (mood < -1 && mood > -50) {
        //   setOverallMood("Poor");
        // } else if (mood == 0) {
        //   setOverallMood("Average");
        // } else if (mood < 1 && mood > 50) {
        //   setOverallMood("Good");
        // } else if (mood < 50) {
        //   setOverallMood("Very Good");
        // }
        // setOverallMood(res.data.overallMood);
        // setFirstGraphMoodsAverage({
        //   positive: res.data.positiveScore,
        //   negative: res.data.negativeScore,
        // });
      })
      .catch((err) => {});
  };

  const getCompanyPlanData = () => {
    CompanyApi.getCompanyStatus(userData.companyId)
      .then((res) => {
        if (res?.data?.meta.code == 1) {
          setSubsData(res?.data?.data);
        } else {
          return errorToast('Something went wrong');
        }
      })
      .catch((err) => {
        return errorToast(err);
      });
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

  useEffect(() => {
    if (userData.userType == 3 || userData.userType == 4) {
      getCompanyPlanData();
    }
  }, []);

  useOutsideClick(wrapperRef, () => {
    if (dateCalender) {
      setDateCalander(false);
    }
  });

  useOutsideClick(filterModalRef, () => {
    if (isFilterOpen) setIsFilterOpen(false);
  });

  useOutsideClick(sleepBoxRef, () => {
    if (sleepReportBox) setSleepReportBox(false);
  });

  const getSleepLogsGraphData = (dataType) => {
    const obj = { ...getDate() };

    CompanyApi.getBeforeSleepData(
      obj.startDate,
      obj.endDate,
      parameters.department,
      obj.minAge,
      obj.maxAge,
      parameters.location,
      parameters.ethinicity,
      parameters.gender,
      dataType?.toLowerCase() || 0,
      props.companyId
    )
      .then((res) => {
        setBeforeSleepData(res?.data?.data);
      })
      .catch((err) => {});

    CompanyApi.getAfterSleepData(
      obj.startDate,
      obj.endDate,
      parameters.department,
      obj.minAge,
      obj.maxAge,
      parameters.location,
      parameters.ethinicity,
      parameters.gender,
      dataType?.toLowerCase() || 0,
      props.companyId
    )
      .then((res) => {
        setAfterSleepData(res?.data?.data);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getFilterData();
    getSurveyData();
    // getOverAllScore();
    getSecondGraphData();
    getFirstGraphData(graphDataType.firstGrapgh);
    // getThirdGraphData(radialMood);
    getSleepLogsGraphData();
    changeGraphOption('positive', 'secondGrapgh');
  }, [parameters]);

  useEffect(() => {
    getOverAllScore();
  }, [theraphyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == 'dateCriteria' && value == '4') {
      setParameters({ ...parameters, [name]: value });
      setModel({ ...model, dateButtonVisible: true });
    } else if (name == 'dataType') {
      if (value == 'professional') {
        // setRadialMood(redialProfestionalSelect[0].value.toLowerCase());
        setParameters({ ...parameters, [name]: value });
      } else if (value == 'personal') {
        setRadialMood(redialPersonalSelect[0].toLowerCase());
        setParameters({ ...parameters, [name]: value });
      } else {
        setParameters({ ...parameters, [name]: value });
      }
    } else {
      setParameters({ ...parameters, [name]: value });
      setModel({ ...model, dateButtonVisible: false });
    }
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
    setParameters({
      ...parameters,
      startDate: start,
      endDate: end,
      datePickerVisible: false,
      dateChanged: true
    });
  };

  const changeGraphOption = (type, name) => {
    if (name == 'firstGrapgh') {
      getFirstGraphData(type);
    }
    // else if (name == "secondGrapgh") {
    //   if (type == "All") {
    //     setSecondGraph(allBarOptions);
    //   } else if (type == "Positive") {
    //     setSecondGraph(positiveBarOption);
    //   } else if (type == "Negative") {
    //     setSecondGraph(negativeBarOption);
    //   }
    // }
    setGraphDataType({ ...graphDataType, [name]: type });
  };

  const getSolutionData = (avgPositive, avgNegative, graphName) => {
    setLoader(true);
    const obj = { ...getDate() };
    CompanyApi.getSolutionByFilters(
      obj.startDate,
      obj.endDate,
      obj.minAge,
      obj.maxAge,
      parameters.department,
      parameters.location,
      parameters.gender,
      graphDataType.firstGrapgh,
      parameters.dataType,
      parameters.ethinicity,
      graphName
    ).then((res) => {
      if (res) {
        setLoader(false);
        solutionData(avgPositive, avgNegative, '', parameters.dataType, graphName);
      } else {
        setLoader(false);
        solutionData(avgPositive, avgNegative, '', parameters.dataType, graphName);
      }
    });
  };

  const solutionData = (avgPositive, avgNegative, oldSolution, type, graphName) => {
    let total = Math.abs(avgPositive) + Math.abs(avgNegative);
    const obj = { ...getDate() };
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        deviceType: 1,
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        avgPositive: (Math.abs(avgPositive) / total) * 100,
        avgNegative: (Math.abs(avgNegative) / total) * 100,
        oldSolution: oldSolution ? oldSolution : '',
        businessType: userData.companyType ? userData.companyType : '',
        filters: {
          department: userData.companyType ? userData.companyType : '',
          type: type
        }
      })
    };
    if (obj.minAge && obj.maxAge) requestOptions.filters.age = obj.minAge + '-' + obj.maxAge;
    setLoader(true);
    fetch(`${API_BASE_URL}api/v1/openai`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setLoader(false);
        // convertLargeTextToPDF(`${graphName}\n\n${data?.data}`, "solution.pdf");
        addSolution(
          (Math.abs(avgPositive) / total) * 100,
          (Math.abs(avgNegative) / total) * 100,
          data?.data,
          graphName
        );
      })
      .catch((error) => {
        setLoader(false);
        errorToast('Something went wrong !');
      });
  };

  const addSolution = (solutionText, graphName, avgPositive, avgNegative) => {
    const obj = { ...getDate() };

    const solution = {
      department: userData.companyType,
      endDate: obj.endDate,
      startDate: obj.startDate,
      graphName: graphName,
      solutionData: solutionText
    };
    setLoader(true);
    CompanyApi.addSolutionData(solution)
      .then((res) => {
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const downloadDocReport = async (mood, label, graphName, type, moodName, isnewModeOfPdf) => {
    setLoader(true);
    const obj = { ...getDate() };
    const data = {
      moodData: mood,
      label: label,
      graphName: graphName,
      startDate: obj.startDate,
      endDate: obj.endDate,
      minAge: obj.minAge,
      maxAge: obj.maxAge,
      department: parameters.department,
      location: parameters.location,
      gender: parameters.gender,
      dataType: graphDataType.firstGrapgh,
      emotionType: parameters.dataType,
      ethnicity: parameters.ethinicity
    };
    if (type == 'CSV') {
      if (graphName == 'Overall Well-being & Mental Health') {
        downloadOWBMHReportToCSV({ series: mood, label: label }, 'OWB&MH.csv');
        data.graphType = 1;
      }
      if (graphName == 'Single Mood Graph') {
        downloadSingleRadialReportToCSV(
          { series: mood, label: label },
          'SingleMoodGraph.csv',
          moodName
        );
        data.graphType = 3;
        data.moodName = moodName;
      }
    }
    if (type == 'PDF') {
      if (graphName == 'Overall Well-being & Mental Health') {
        downloadOWBMHReportToPDF({ series: mood, label: label }, 'OWB&MH.pdf');
        data.graphType = 1;
      }
      if (graphName == 'Single Mood Graph') {
        // downloadSingleRadialReportToPDF(
        //   { series: mood, label: label },
        //   "SingleMoodGraph.pdf",
        //   moodName
        // );
        data.graphType = 3;
        data.moodName = moodName;
      }
    }

    const url = `${API_BASE_URL}company/v1/add-report`;
    // CompanyApi.addReport(data)
    await axios
      .post(url, data, {
        headers: {
          deviceType: 3,
          Authorization: getJWTToken()
        },
        responseType: 'blob'
      })
      .then((res) => {
        if (isnewModeOfPdf) {
          const blob = new Blob([res.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = `${data?.moodName}.pdf`; // Specify the filename
          a.click();
          window.URL.revokeObjectURL(url);
        }
      })
      .catch((err) => {});
    setLoader(false);
  };

  // new apis

  const getActiveUsersAndTime = () => {
    //

    CompanyApi.getActiveUsersAndTime(props?.companyId ? props?.companyId : userData?.companyId)
      .then((res) => {
        if (res?.data?.meta?.code == 1) {
          setActiveUsersAndTimeData(res?.data?.data);
        } else {
          errorToast('Something went wrong');
        }
      })
      .catch((err) => errorToast('Something went wrong'));
  };

  const getRecentJoinedEmployees = () => {
    CompanyApi.getRecentJoinedEmployees(props?.companyId ? props?.companyId : userData?.companyId)
      .then((res) => {
        if (res?.data?.meta?.code == 1) {
          setRecentJoinedEmployData(res?.data?.data?.employees);
        } else {
          errorToast('Something went wrong');
        }
      })
      .catch((err) => errorToast('Something went wrong'));
  };

  const getEmployeeActivity = () => {
    CompanyApi.getEmployeeActivity(props?.companyId ? props?.companyId : userData?.companyId)
      .then((res) => {
        if (res?.data?.meta?.code == 1) {
          setEmplyeeActivityData(res?.data?.data);
        } else {
          errorToast('Something went wrong');
        }
      })
      .catch((err) => errorToast('Something went wrong'));
  };

  const getTrendingContent = () => {
    CompanyApi.getTrendingContent(props?.companyId ? props?.companyId : userData?.companyId)
      .then((res) => {
        if (res?.data?.meta?.code == 1) {
          setTrendingContentData(res?.data?.data);
        } else {
          errorToast('Something went wrong');
        }
      })
      .catch((err) => errorToast('Something went wrong'));
  };

  const getJournalContentUsage = () => {
    const obj = { ...getDate() };

    CompanyApi.getJournalContentUsage(
      obj.startDate,
      obj.endDate,
      parameters.department,
      obj.minAge,
      obj.maxAge,
      parameters.location,
      parameters.ethinicity,
      parameters.gender,
      parameters.dataType == '' ? null : parameters.dataType == 'personal' ? 1 : 2,
      props.companyId || userData.companyId
    )
      .then((res) => {
        if (res?.data?.meta?.code == 1) {
          setContentUsageData(res?.data?.data);
        } else {
          errorToast('Something went wrong');
        }
      })
      .catch((err) => errorToast('Something went wrong'));
  };

  const getB2BAdminMood = () => {
    CompanyApi.getB2BAdminMood()
      .then((res) => {
        if (res?.data?.meta?.code == 1) {
          // setContentUsageData(res?.data?.data);
        } else {
          errorToast('Something went wrong');
        }
      })
      .catch((err) => errorToast('Something went wrong'));
  };

  const getSosData = () => {
    const obj = { ...getDate() };

    CompanyApi.getSosData({
      startDate: obj.startDate,
      endDate: obj.endDate,
      department: parameters.department,
      minAge: obj.minAge,
      maxAge: obj.maxAge,
      country: parameters.location,
      ethnicity: parameters.ethinicity,
      gender: parameters.gender,
      emotionType: parameters.dataType == '' ? null : parameters.dataType == 'personal' ? 1 : 2,
      companyId: props.companyId || userData.companyId
    })
      .then((res) => {
        if (res?.data?.meta?.code == 1 || res?.data?.meta?.code == 0) {
          setSosData(res?.data?.data);
        } else {
          errorToast('Something went wrong');
        }
      })
      .catch((err) => errorToast('Something went wrong'));
  };

  const getSosReport = async () => {
    const obj = { ...getDate() };
    setLoader(true);
    await CompanyApi.getSosReport({
      startDate: obj.startDate,
      endDate: obj.endDate,
      department: parameters.department,
      minAge: obj.minAge,
      maxAge: obj.maxAge,
      country: parameters.location,
      ethnicity: parameters.ethinicity,
      gender: parameters.gender,
      emotionType: parameters.dataType == '' ? null : parameters.dataType == 'personal' ? 1 : 2,
      companyId: props.companyId || userData.companyId,
      graphName: 'Sos report'
    });
    setLoader(false);
  };

  const getBreathworkInsights = () => {
    const obj = { ...getDate() };
    CompanyApi.getBreathworkInsights(
      obj.startDate,
      obj.endDate,
      parameters.department,
      obj.minAge,
      obj.maxAge,
      parameters.location,
      parameters.ethinicity,
      parameters.gender,
      1,
      props.companyId
    )
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

  // setting up data

  useOutsideClick(activityWrapperRef, () => {
    if (userActivityDateFilter) {
      setUserActivityDateFilter(false);
    }
  });

  useEffect(() => {
    getActiveUsersAndTime();
    getRecentJoinedEmployees();
    getEmployeeActivity();
    getTrendingContent();
    getJournalContentUsage();
    getSosData();
    getBreathworkInsights();
    // getB2BAdminMood();
  }, [mostUsedFeatureDateFilter, parameters]);

  const emojis = {
    motivated: '😊',
    content: '😃',
    happy: '😁',
    iCanManage: '👍',
    iAmInControl: '🚀',
    energised: '💪',
    calm: '😌',
    relaxed: '😎',
    balanced: '⚖️',
    great: '🌟',
    verySatisfied: '😊',
    positive: '😃',
    comfortable: '😁',
    supportive: '🤗',
    manageable: '👌',
    excellent: '🌟',
    inclusive: '🌈',
    highlySupported: '🙌',
    wellEquipped: '🔧',
    comprehensive: '📚',
    demotivated: '😞',
    low: '😕',
    sad: '😢',
    needSupport: '😟',
    helpless: '😰',
    tired: '😫',
    angry: '😡',
    anxious: '😟',
    stressed: '😣',
    notGood: '👎',
    dissatisfied: '😕',
    unpleasant: '😖',
    overwhelming: '😩',
    poor: '💔',
    unmanageable: '🙅',
    lacking: '👎',
    negative: '👎',
    unsupported: '😞',
    insufficient: '🤷‍♂️',
    inadequate: '❌',
    quiet: '🤫',
    warm: '🔥',
    peaceful: '🕊️',
    settled: '🏠',
    atEase: '🤗',
    inControl: '🧖‍♂️',
    noisy: '😰',
    cold: '🧊',
    agitated: '😪',
    uneasy: '😩',
    worried: '😟',
    overwhelmed: '😮‍💨',
    sleepSoundly: '😴',
    deepSleep: '🥱',
    lightSleep: '😔',
    tossingTurning: '😵',
    lovelyDream: '😌',
    nightmare: '😵‍💫',
    still: '😐',
    cool: '😎',
    stayingPut: '😖',
    silent: '😶',
    rested: '😍',
    noMidnightSnacks: '😜',
    restless: '🥴',
    sweaty: '😢',
    sleepwalking: '🥺',
    snoring: '😴',
    needMoreSleep: '😟',
    nocturnalEating: '😑'
  };

  // new handlers

  const downLoadSolutions = async (data) => {
    setLoader(true);
    await CompanyApi.getSolutionTextFromOpenAi({
      avgPositive: data?.avgPositive,
      avgNegative: data?.avgNegative,
      oldSolution: '',
      businessType: userData.companyType,
      filters: {
        department: parameters.department,
        country: parameters.location,
        ethnicity: parameters.ethinicity,
        gender: GENDER[GENDER.findIndex((data) => data?.value == parameters.gender)]?.name,
        age: parameters.age
      },
      breathwork: breathworkInsights,
      solutionType: data?.solutionType
    })
      .then((res) => {
        addSolution(res?.data?.data, data?.graphName);
      })
      .catch((err) => {});

    setLoader(false);
  };

  const downLoadBreathworkReport = async (data) => {
    setLoader(true);
    await CompanyApi.addBreathworkReport({
      department: parameters.department,
      graphName: 'Breathwork Report',
      reportData: breathworkInsights,
      startDate: new Date()
    })
      .then((res) => {
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });

    setLoader(false);
  };

  const downLoadReport = async (name = 'Personal Report', isOverall = false) => {
    const obj = { ...getDate() };
    setLoader(true);
    await CompanyApi.getReport({
      graphName: name,
      startDate: obj.startDate,
      endDate: obj.endDate,
      department: parameters.department,
      moodType: isOverall ? 3 : parseInt(parameters.dataType),
      personalData: personalMoodData,
      professionalData: professionalMoodData,
      theraphyData: theraphyData
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });

    setLoader(false);
  };

  const downLoadTherapyReport = async (name = 'Therapy Report', isOverall = false) => {
    const obj = { ...getDate() };
    setLoader(true);
    await CompanyApi.getReport({
      graphName: name,
      startDate: obj.startDate,
      endDate: obj.endDate,
      department: parameters.department,
      moodType: isOverall ? 3 : parseInt(parameters.dataType),
      personalData: personalMoodData,
      professionalData: professionalMoodData,
      theraphy: true,
      theraphyData: secondGraphDataRaw
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });

    setLoader(false);
  };

  const getUnreadNotificationCount = async () => {
    CompanyApi.getUnreadNotificationCount()
      .then((res) => {
        setNotificationCounts(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downLoadSleepReport = async (name = 'Before Sleep Report', moodType) => {
    const obj = { ...getDate() };
    setLoader(true);
    await CompanyApi.addSleepReport({
      graphName: name,
      startDate: obj.startDate,
      endDate: obj.endDate,
      department: parameters.department,
      moodType: moodType,
      beforeSleepData: beforeSleepData,
      afterSleepData: afterSleepData
    })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });

    setLoader(false);
  };

  const getUserActivityStats = async () => {
    CompanyApi.getUserActivityStats(
      moment(userActivityDateRange.startDate).format('YYYY-MM-DD'),
      moment(userActivityDateRange.endDate).format('YYYY-MM-DD')
    ).then((res) => {
      if (res?.data?.meta?.code == 1) {
        setUserActivityUsageData(res?.data?.data);
      }
    });
  };

  useEffect(() => {
    getUserActivityStats();
  }, [userActivityDateRange]);

  useEffect(() => {
    if (window.location.pathname != '/login' && (userData.userType == 3 || userData.userType == 4))
      getUnreadNotificationCount();
  }, [window.location.pathname]);

  return (
    <div>
      {loader ? <Loader /> : null}
      <div className="w-full px-3 overflow-hidden h-full">
        {/* centre grid */}
        <div className="col-span-3 relative h-full flex flex-col gap-y-4 hide-scrollbar overflow-y-auto ">
          {/* Filter box */}
          <div className="w-full flex items-center justify-end gap-x-2">
            <ReactTooltip id="global-features-filter" />
            <div
              data-tooltip-id="global-features-filter"
              data-tooltip-content="Global Filters"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
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
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
            </div>

            <ReactTooltip id="notification-tip" />
            <div
              data-tooltip-id="notification-tip"
              data-tooltip-content="Notifications"
              onClick={() => {
                !isSuperAdmin()
                  ? navigate(`/${userData.slug}/notifications/view`)
                  : navigate('/notifications');
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
          {/* filters */}
          <Transition
            show={isFilterOpen}
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              ref={filterModalRef}
              className="grid fixed w-full md:w-[60%] z-20 shadow-md  bg-white dark:bg-shoorah-darkBgTabColor  right-1/2 translate-x-1/2 top-12 p-4 rounded-2xl gap-4 lg:grid-cols-4 sm:grid-cols-2"
            >
              <div className="flex  items-center gap-2 justify-between">
                <select
                  className={`border text-[#666666] dark:text-white bg-white dark:bg-shoorah-darkBgColor appearance-none dark:border-none  rounded-md ${
                    parameters.dateCriteria == '4' ? 'w-4/5' : 'w-full'
                  } h-10 px-2`}
                  value={parameters.dateCriteria}
                  onChange={handleChange}
                  id="dateCriteria"
                  name="dateCriteria"
                >
                  <option value={''} disabled>
                    Select Date Criteria
                  </option>
                  {DATECREITERIA.map((e, i) => (
                    <option key={i} value={e.value}>
                      {e.name}
                    </option>
                  ))}
                </select>
                {model.dateButtonVisible && (
                  <button
                    className={`inline-flex items-center justify-center rounded-3xl border dark:bg-shoorah-darkBgColor dark:border-none text-black ${
                      parameters.dateCriteria == '4' ? 'lg:w-1/5' : ''
                    } px-2 py-1 text-xs font-medium shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto`}
                    onClick={() => {
                      // setModel({
                      //   ...model,
                      //   datePickerVisible: !model.datePickerVisible
                      // });
                      setDateCalander(!dateCalender);
                    }}
                  >
                    <CalendarIcon className="w-[18px] h-[20px] dark:text-white inline" />
                  </button>
                )}
              </div>
              <Transition
                show={dateCalender}
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className="absolute lg:right-[2rem] sm:right-[2rem] z-[2] mt-2 mx-auto lg:left-0 origin-top-right rounded-md bg-white dark:bg-shoorah-darkBgTabColor  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-fit"
                  ref={wrapperRef}
                >
                  <DateRangePicker
                    ranges={[
                      {
                        startDate: parameters?.startDate ? parameters?.startDate : new Date(),
                        endDate: parameters?.endDate ? parameters?.endDate : new Date(),
                        key: 'selection'
                      }
                    ]}
                    onChange={handleSelectRange}
                    maxDate={new Date()}
                  />
                </div>
              </Transition>
              <select
                className="border text-[#666666] dark:text-white bg-white dark:bg-shoorah-darkBgColor  dark:border-none appearance-none rounded-md h-10 px-2"
                value={parameters.location}
                onChange={handleChange}
                id="location"
                name="location"
              >
                <option value={''}>All Locations</option>
                {filterData?.countries.map((e, i) => (
                  <option key={i} value={e.toLowerCase()}>
                    {e}
                  </option>
                ))}
              </select>
              <select
                className="border text-[#666666] dark:text-white dark:border-none bg-white dark:bg-shoorah-darkBgColor  appearance-none rounded-md h-10 px-2"
                value={parameters.department}
                onChange={handleChange}
                id="department"
                name="department"
              >
                <option value={''}>All Department</option>
                {filterData?.departments.map((e, i) => (
                  <option key={i} value={e.toLowerCase()}>
                    {e}
                  </option>
                ))}
              </select>
              <select
                className="border text-[#666666] dark:text-white dark:border-none bg-white dark:bg-shoorah-darkBgColor  appearance-none rounded-md h-10 px-2"
                value={parameters.dataType}
                onChange={handleChange}
                id="dataType"
                name="dataType"
              >
                <option value={3}>All Emotions</option>
                <option value={1}>Personal Emotions</option>
                <option value={2}>Professional Emotions</option>
              </select>
              <select
                className="border text-[#666666] dark:text-white dark:border-none bg-white dark:bg-shoorah-darkBgColor  appearance-none rounded-md h-10 px-2"
                value={parameters.age}
                onChange={handleChange}
                id="age"
                name="age"
              >
                <option value={''}>All Ages</option>
                {AGERANGE.map((e, i) => (
                  <option key={i} value={e.value}>
                    {e.name}
                  </option>
                ))}
              </select>
              <select
                className="border text-[#666666] dark:text-white dark:border-none bg-white dark:bg-shoorah-darkBgColor  appearance-none rounded-md h-10 px-2"
                value={parameters.ethinicity}
                onChange={handleChange}
                id="ethinicity"
                name="ethinicity"
              >
                <option value={''}>All Ethinicities</option>
                {filterData?.ethnicities.map((e, i) => (
                  <option key={i} value={e.toLowerCase()}>
                    {e}
                  </option>
                ))}
              </select>
              <select
                className="border text-[#666666] dark:text-white dark:border-none bg-white dark:bg-shoorah-darkBgColor  appearance-none rounded-md h-10 px-2"
                value={parameters.gender}
                onChange={handleChange}
                id="gender"
                name="gender"
              >
                <option value={''}>All Genders</option>
                {GENDER.map((e, i) => (
                  <option key={i} value={e.value}>
                    {e.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="border text-white dark:text-white dark:border-none bg-shoorah-secondary dark:bg-shoorah-darkBgColor  appearance-none rounded-md h-10 px-2"
              >
                Done
              </button>
            </div>
          </Transition>

          {/* greetings box */}
          <div className="flex flex-col gap-2">
            <h1 className="text-shoorah-newDashboardBlue dark:text-white text-xl lg:text-3xl font-medium ">
              Happy {moment().format('dddd')}, let’s make today count!
            </h1>
            <span className="text-shoorah-newDashboardBlue dark:text-white text-base font-normal">
              Welcome to your Admin Dashboard
            </span>
          </div>

          {/* active user box */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* box 1 */}
            <div className="w-full bg-shoorah-secondary p-4 flex justify-center gap-x-2 items-center rounded-2xl text-white">
              <div className="flex flex-col justify-center items-center">
                <p className="text-base font-medium">Total Active Users</p>
                <h4 className="text-3xl font-semibold">{activeUsersAndTimeData.users}</h4>
              </div>
              {activeUsersAndTimeData.users ? (
                <div className=" relative">
                  <h1 className="text-white text-sm lg:text-base font-semibold absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                    {activeUsersAndTimeData.activeUserPercentage + '%'}
                  </h1>
                  <ReactApexChart
                    series={[activeUsersAndTimeData.activeUserPercentage]}
                    options={{
                      colors: ['#fff'],
                      chart: {
                        height: 150,
                        width: 150,
                        type: 'radialBar'
                      },
                      plotOptions: {
                        radialBar: {
                          hollow: {
                            size: '50%',
                            color: '#fff'
                          },
                          track: {
                            background: '#fff',
                            opacity: 0.5,
                            strokeWidth: '90%'
                          },

                          dataLabels: {
                            name: {
                              show: false,
                              fontSize: '22px'
                            },
                            value: {
                              show: false,
                              fontSize: '16px'
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
                    // height={150}
                    width={150}
                  />
                </div>
              ) : null}
            </div>
            {/* box 2 */}
            <div className="w-full bg-shoorah-primary p-4 flex justify-center gap-x-2 items-center rounded-2xl text-white">
              <div className="flex flex-col justify-center items-center">
                <p className="text-base font-medium">Peak Usage Time</p>
                {activeUsersAndTimeData.highestCountInterval ? (
                  <h4>
                    <span className="text-3xl font-semibold">
                      {activeUsersAndTimeData?.highestCountInterval?.startDate?.split(':')[0]}
                    </span>
                    {activeUsersAndTimeData?.highestCountInterval?.startDate
                      ?.split(' ')?.[1]
                      .toLowerCase()}
                    <span className="text-3xl">-</span>{' '}
                    <span className="text-3xl font-semibold">
                      {activeUsersAndTimeData?.highestCountInterval?.endDate?.split(':')[0]}
                    </span>
                    {activeUsersAndTimeData?.highestCountInterval?.endDate
                      ?.split(' ')?.[1]
                      .toLowerCase()}
                  </h4>
                ) : (
                  <div className="h-full w-full flex justify-center items-center">
                    No Data Found
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="dark:text-white text-center mt-3">
            {subsData && subsData?.account == 'Trial'
              ? `Your Account is on trial plan.`
              : subsData?.account == 'Expired'
              ? `Your plan is expired. connect with sales team to continue.`
              : null}
          </div>

          {/* overall score box */}
          <div>
            <div className="bg-gradient-to-r relative bg-white dark:bg-shoorah-darkBgTabColor   dark:text-white  rounded-2xl py-3 my-5 text-center font-medium	">
              {/* desktop */}
              <p className=" hidden lg:flex justify-center items-center text-shoorah-newDashboardBlue dark:text-white">
                Your Overall Score : {/* {overallMoodData.overallMood.toUpperCase() + */}
                {(overallMoodData?.overallMoodPercentage > 60
                  ? 'HAPPY'
                  : overallMoodData?.overallMoodPercentage > 30
                  ? 'NEUTRAL'
                  : true
                  ? 'SAD'
                  : '') + ` (${overallMoodData?.overallMoodPercentage}%)`}
                &nbsp;
                {
                  <span>
                    {overallMoodData?.overallMoodPercentage > 60 ? (
                      <img className="w-8 h-8" loading='lazy' src={happyImg} alt="happy" />
                    ) : overallMoodData?.overallMoodPercentage > 30 ? (
                      <img className="w-8 h-8" loading='lazy' src={neutralImg} alt="average" />
                    ) : true ? (
                      <img className="w-8 h-8" loading='lazy' src={sadImg} alt="sad" />
                    ) : (
                      ''
                    )}
                  </span>
                }
              </p>

              {/* mobile */}
              <p className="flex lg:hidden flex-col gap-y-2 justify-center items-center text-shoorah-newDashboardBlue dark:text-white">
                <span className="text-xl">Overall Score</span>

                <span>
                  {overallMoodData?.overallMoodPercentage > 60 ? (
                    <img className="w-8 h-8" loading='lazy' src={happyImg} alt="happy" />
                  ) : overallMoodData?.overallMoodPercentage > 30 ? (
                    <img className="w-8 h-8" loading='lazy' src={neutralImg} alt="average" />
                  ) : true ? (
                    <img className="w-8 h-8" loading='lazy' src={sadImg} alt="sad" />
                  ) : (
                    ''
                  )}
                </span>
                <span>
                  {/* {overallMoodData.overallMood.toUpperCase() +
                    ` (${overallMoodData.overallMoodPercentage}%)`} */}

                  {(overallMoodData?.overallMoodPercentage > 60
                    ? 'HAPPY'
                    : overallMoodData?.overallMoodPercentage > 30
                    ? 'NEUTRAL'
                    : true
                    ? 'SAD'
                    : '') + ` (${overallMoodData?.overallMoodPercentage}%)`}
                </span>
              </p>
              <div className=" absolute right-2 top-6 lg:top-1/2 -translate-y-1/2 flex items-center gap-x-4 ">
                <ReactTooltip id="overall-download-solution" />

                <svg
                  data-tooltip-id="overall-download-solution"
                  data-tooltip-content="Download Overall Solution Report"
                  onClick={() => {
                    downLoadSolutions({
                      avgPositive: overallMoodData?.positiveScore,
                      avgNegative: overallMoodData?.negativeScore,
                      solutionType: 1,
                      graphName: 'Overall Solution'
                    });
                  }}
                  viewBox="0 0 18 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 fill-shoorah-sidebarBackground stroke-shoorah-sidebarBackground dark:stroke-white dark:fill-white cursor-pointer "
                >
                  <path d="M16.001 3.58326H16.501V4.08326V5.83297C16.501 5.87895 16.5383 5.91622 16.5843 5.91622C16.6303 5.91622 16.6675 5.87893 16.6675 5.83301V3.50005C16.6675 3.45407 16.6302 3.4168 16.5843 3.4168H7.78319H7.36061L7.29018 3.00013C7.07744 1.74147 6.09133 0.755343 4.83262 0.542571C3.19925 0.266472 1.65133 1.36677 1.37527 3.00013C1.0992 4.6335 2.1995 6.18142 3.83285 6.45749L3.83286 6.45749C5.46622 6.73359 7.01412 5.6333 7.29022 3.99993L7.36065 3.58326H7.78322H13.0848H13.5848V4.08326V5.83297C13.5848 5.87895 13.6221 5.91622 13.6681 5.91622C13.714 5.91622 13.7513 5.87895 13.7513 5.83297V4.08326V3.58326H14.2513H16.001ZM1.50334 3.50005C1.50334 1.93544 2.77169 0.667089 4.33629 0.667089C5.9009 0.667089 7.16925 1.93544 7.16925 3.50005C7.16925 5.06465 5.9009 6.33301 4.33629 6.33301C2.77169 6.33301 1.50334 5.06465 1.50334 3.50005Z" />
                </svg>

                <ReactTooltip id="overall-download-report" />
                <svg
                  data-tooltip-id="overall-download-report"
                  data-tooltip-content="Download Overall Report"
                  className="w-5 h-5 fill-shoorah-sidebarBackground cursor-pointer dark:fill-white"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    downLoadReport('Overall Report', true);
                  }}
                >
                  <path d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z" />
                </svg>
                <Popover className="relative hidden">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={`
                ${open ? '' : 'text-opacity-90'}
                inline-flex items-center justify-center rounded-md border border-transparent px-2 py-1 text-xs font-medium text-white hover:shoorah-primary focus:outline-none sm:w-auto`}
                      >
                        <svg
                          className="w-5 h-5 fill-shoorah-sidebarBackground dark:fill-white"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z" />
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
                        <Popover.Panel className="bg-white dark:bg-shoorah-darkBgTabColor  rounded-md border absolute left-0 z-10 mt-3 w-screen max-w-[8.4rem] font-normal -translate-x-full -translate-y-4 text-base transform">
                          <p
                            className="px-1 py-2 hidden hover:bg-gray-300 rounded-md cursor-pointer"
                            // todo: APi integration
                            onClick={() =>
                              downloadDocReport(
                                firstGraph.data,
                                firstGraph.label,
                                'Overall Well-being & Mental Health',
                                'CSV'
                              )
                            }
                          >
                            Download CSV
                          </p>
                          <p
                            className="px-1 py-2 hover:bg-gray-300 rounded-md cursor-pointer"
                            // onClick={async () => {
                            //   // todo: APi integration

                            //   if (parameters.dataType == "") {
                            //     await downloadDocReport(
                            //       firstGraph.data,
                            //       firstGraph.label,
                            //       "Overall Well-being & Mental Health",
                            //       "PDF"
                            //     );
                            //     await downloadDocReport(
                            //       firstGraphAlternate.data,
                            //       firstGraphAlternate.label,
                            //       "Overall Well-being & Mental Health",
                            //       "PDF"
                            //     );
                            //     return;
                            //   }
                            //   downloadDocReport(
                            //     firstGraph.data,
                            //     firstGraph.label,
                            //     "Overall Well-being & Mental Health",
                            //     "PDF"
                            //   );
                            // }}

                            onClick={() => {
                              downLoadReport('Overall Report');
                            }}
                          >
                            Download PDF
                          </p>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              </div>
            </div>
          </div>

          {/* employee's data box */}
          <div className=" w-full grid gap-4 text-shoorah-newDashboardBlue dark:text-white grid-cols-1 lg:grid-cols-2">
            {/* box 1 */}
            <div className="bg-white dark:bg-shoorah-darkBgTabColor flex flex-col  rounded-2xl px-6 p-4">
              <h6 className="text-lg font-medium">Recently Joined Employees</h6>
              <div className="mt-4 overflow-y-auto h-[30vh] custom-scrollbar flex flex-grow flex-col">
                {recentJoinedEmployData.map((employ, index) => (
                  <div
                    key={index}
                    className={` ${
                      index % 2 ? 'bg-[#F6F8FD] dark:bg-shoorah-primary/80' : ''
                    } grid gap-x-2 grid-cols-3 p-2 px-4 rounded-lg`}
                  >
                    <div className=" flex flex-col justify-center">
                      <h6 className="text-base font-medium">{employ?.name}</h6>
                      <span className="text-[0.5rem]">{employ?.email}</span>
                    </div>

                    <div className="flex justify-center items-center">
                      <div
                        className={` px-2 lg:px-6 py-1 lg:py-2  text-xs rounded-md text-center ${
                          employ?.isEmailVerified
                            ? 'text-green-700 bg-green-300/30 dark:bg-green-200/100'
                            : 'bg-shoorah-primary text-white'
                        }`}
                      >
                        {employ?.isEmailVerified ? 'Verified' : 'Pending'}
                      </div>
                    </div>

                    <div className="text-xs font-medium text-right flex items-center justify-end">
                      {moment(new Date(employ?.createdAt)).format('DD MMM YYYY')}
                    </div>
                  </div>
                ))}

                {/* TODO: DELETE */}
                {/* {recentJoinedEmployData.map((employ, index) => (
                  <div
                    key={index}
                    className={` ${
                      !(index % 2)
                        ? "bg-[#F6F8FD] dark:bg-shoorah-primary/80"
                        : ""
                    } grid gap-x-2 grid-cols-3 p-2 px-4 rounded-lg`}
                  >
                    <div className=" flex flex-col justify-center">
                      <h6 className="text-base font-medium">{employ?.name}</h6>
                      <span className="text-[0.5rem]">{employ?.email}</span>
                    </div>

                    <div className="flex justify-center items-center">
                      <div
                        className={`px-6 py-2  text-xs rounded-md text-center ${
                          employ?.isEmailVerified
                            ? "text-green-700 bg-green-300/30 dark:bg-green-200/100"
                            : "bg-shoorah-primary text-white"
                        }`}
                      >
                        {employ?.isEmailVerified ? "Verified" : "Pending"}
                      </div>
                    </div>

                    <div className="text-xs font-medium text-right flex items-center justify-end">
                      {moment(new Date(employ?.createdAt)).format(
                        "DD MMM YYYY"
                      )}
                    </div>
                  </div>
                ))} */}
              </div>
            </div>

            {/* box 2 */}
            <div className="grid grid-rows-2 gap-y-4 text-shoorah-newDashboardBlue dark:text-white">
              {/* row 1 */}
              <div className="bg-white dark:bg-shoorah-darkBgTabColor flex flex-col  rounded-2xl px-6 p-4">
                <h6 className="text-lg font-medium">Employee Activity</h6>
                <div className="grid mt-2 grid-cols-3 flex-grow">
                  <div className="text-shoorah-newDashboardBlue2 dark:text-white flex flex-col justify-center items-center gap-y-1">
                    <p className="text-xs">
                      <span className="lg:hidden">{'Active (today)'}</span>{' '}
                      <span className="lg:block hidden">Active today</span>
                    </p>
                    <h6 className="text-3xl">{emplyeeActivityData.todayUsers}</h6>
                    <div className="w-8 h-8">
                      <img
                        loading='lazy'
                        src={
                          emplyeeActivityData.todayUsersChangePercentage >= 0
                            ? trendUpImg
                            : trendDownImg
                        }
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="text-shoorah-newDashboardBlue2 dark:text-white flex flex-col justify-center items-center gap-y-1">
                    <p className="text-xs">
                      {' '}
                      <span className="lg:hidden">{'Active (month)'}</span>{' '}
                      <span className="lg:block hidden">Active this month</span>
                    </p>
                    <h6 className="text-3xl">{emplyeeActivityData.monthUsers}</h6>
                    <div className="w-8 h-8">
                      <img
                        loading='lazy'
                        src={
                          emplyeeActivityData.monthUsersChangePercentage >= 0
                            ? trendUpImg
                            : trendDownImg
                        }
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="text-shoorah-newDashboardBlue2 dark:text-white flex flex-col justify-center items-center gap-y-1">
                    <p className="text-xs">
                      {' '}
                      <span className="lg:hidden">{'Active (year)'}</span>{' '}
                      <span className="lg:block hidden">Active this year</span>
                    </p>
                    <h6 className="text-3xl">{emplyeeActivityData.yearUsers}</h6>
                    <div className="w-8 h-8">
                      <img
                        loading='lazy'
                        src={
                          emplyeeActivityData.yearUsersChangePercentage >= 0
                            ? trendUpImg
                            : trendDownImg
                        }
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* row 2 */}
              <div className="bg-white dark:bg-shoorah-darkBgTabColor flex flex-col  rounded-2xl px-6 p-4">
                <h6 className="text-lg flex items-center gap-x-1 font-medium">
                  Top 5 Most Listened{' '}
                  <span className="text-xs text-shoorah-newDashboardBlue2 dark:text-white">
                    {'(Current Month)'}
                  </span>
                </h6>
                <div className="grid mt-2 grid-cols-5  flex-grow gap-y-2 gap-x-2 text-shoorah-newDashboardBlue2 dark:text-white">
                  {trendingContentData?.length ? (
                    trendingContentData.map((data, index) => (
                      <div className="relative w-full h-full group">
                        <p className="w-[10vw] h-auto opacity-0 group-hover:opacity-100 absolute right-0 translate-x-[80%] bottom-1/2 z-30 bg-gray-800 p-1 rounded-md rounded-bl-none text-white text-xs">
                          {data?.contentName}
                        </p>
                        <div
                          key={index}
                          className="flex flex-col w-full h-full relative  overflow-hidden justify-center items-center gap-y-1"
                        >
                          {data?.image ? (
                            <img
                              loading='lazy'
                              src={data.image}
                              className="w-14 h-14 rounded-lg bg-shoorah-primary"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-shoorah-primary"></div>
                          )}
                          <p className="text-xs max-w-full text-center whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                            {data?.contentName.length > 10
                              ? data?.contentName?.substring(0, 10) + '...'
                              : data?.contentName}
                          </p>
                          <div className="text-lg font-medium">
                            {Math.round(data?.totalHours)}
                            <span className="text-xs">min</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full col-span-5 w-full flex justify-center items-center">
                      No Data Found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <BoxGraph
            sectionThreeArray={userActivityUsageData}
            setUserActivityDateFilter={setUserActivityDateFilter}
            handleSelectActivityRange={handleSelectActivityRange}
            userActivityDateRange={userActivityDateRange}
            setUserActivityDateRange={setUserActivityDateRange}
            activityWrapperRef={activityWrapperRef}
            userActivityDateFilter={userActivityDateFilter}
          />

          {/* moods and emotion tracking box */}
          <div className="bg-white dark:bg-shoorah-darkBgTabColor flex flex-col gap-y-12 rounded-2xl text-shoorah-newDashboardBlue dark:text-white px-6 p-4">
            {/* box 1 */}
            <div className="flex flex-col gap-y-2 lg:flex-row gap-x-4 items-center">
              <h4 className="text-2xl font-medium whitespace-nowrap">Moods & Emotion Tracking</h4>
              <div className="flex gap-x-4  w-full justify-between ">
                <span className="text-xs">
                  Unlock a deeper understanding of your team's emotion with our advanced mood
                  tracking tool.
                </span>

                <div className="flex items-center gap-x-4">
                  <ReactTooltip id="overall-mood-solution" />
                  <svg
                    data-tooltip-id="overall-mood-solution"
                    data-tooltip-content="Download Moods & Emotion Solution Report"
                    onClick={() => {
                      downLoadSolutions({
                        avgPositive:
                          professionalMoodData.moodsPercentPositive == 0
                            ? personalMoodData.moodsPercentPositive
                            : (personalMoodData.moodsPercentPositive +
                                professionalMoodData.moodsPercentPositive) /
                              2,
                        avgNegative:
                          professionalMoodData.moodsPercentNegative == 0
                            ? personalMoodData.moodsPercentNegative
                            : (personalMoodData.moodsPercentNegative +
                                professionalMoodData.moodsPercentNegative) /
                              2,
                        solutionType: 2,
                        graphName: 'Moods & Emotion Solution'
                      });
                    }}
                    viewBox="0 0 18 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 flex-shrink-0 fill-shoorah-sidebarBackground stroke-shoorah-sidebarBackground dark:stroke-white dark:fill-white cursor-pointer "
                  >
                    <path d="M16.001 3.58326H16.501V4.08326V5.83297C16.501 5.87895 16.5383 5.91622 16.5843 5.91622C16.6303 5.91622 16.6675 5.87893 16.6675 5.83301V3.50005C16.6675 3.45407 16.6302 3.4168 16.5843 3.4168H7.78319H7.36061L7.29018 3.00013C7.07744 1.74147 6.09133 0.755343 4.83262 0.542571C3.19925 0.266472 1.65133 1.36677 1.37527 3.00013C1.0992 4.6335 2.1995 6.18142 3.83285 6.45749L3.83286 6.45749C5.46622 6.73359 7.01412 5.6333 7.29022 3.99993L7.36065 3.58326H7.78322H13.0848H13.5848V4.08326V5.83297C13.5848 5.87895 13.6221 5.91622 13.6681 5.91622C13.714 5.91622 13.7513 5.87895 13.7513 5.83297V4.08326V3.58326H14.2513H16.001ZM1.50334 3.50005C1.50334 1.93544 2.77169 0.667089 4.33629 0.667089C5.9009 0.667089 7.16925 1.93544 7.16925 3.50005C7.16925 5.06465 5.9009 6.33301 4.33629 6.33301C2.77169 6.33301 1.50334 5.06465 1.50334 3.50005Z" />
                  </svg>

                  <ReactTooltip id="overall-mood-report" />
                  <svg
                    data-tooltip-id="overall-mood-report"
                    data-tooltip-content="Download Mood & Emotion Report"
                    className="w-5 h-5 fill-shoorah-sidebarBackground cursor-pointer dark:fill-white"
                    viewBox="0 0 14 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                      downLoadReport(
                        parameters.dataType == '1'
                          ? 'Personal Report'
                          : parameters.dataType == '2'
                          ? 'Professional Report'
                          : 'Overall Report'
                      );
                    }}
                  >
                    <path d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* personal mood box */}
            <div className=" w-full flex flex-col justify-center items-center ">
              <div className=" w-full flex justify-between items-center">
                <div>
                  <h4 className=" text-base lg:text-lg font-medium whitespace-nowrap">
                    Personal Moods
                  </h4>
                  <p className="text-xs">
                    {parameters.dateCriteria !== '4'
                      ? DATECREITERIA[
                          DATECREITERIA?.findIndex((data) => parameters.dateCriteria == data.value)
                        ]?.name
                      : `Month to date (${moment(parameters?.startDate).format(
                          'Do MMMM'
                        )} - ${moment(parameters?.endDate).format('Do MMMM')})`}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-x-2">
                  <p
                    onClick={() => {
                      setMoodChosen((mood) => {
                        return {
                          ...mood,
                          isPersonalMoodPositive: true
                        };
                      });
                    }}
                    className={`${
                      moodChosen.isPersonalMoodPositive ? 'text-white bg-shoorah-primary' : ''
                    }  px-2 lg:text-base text-xs lg:px-8 cursor-pointer py-1 rounded-full transition-all `}
                  >
                    Positive
                  </p>
                  <p
                    onClick={() => {
                      setMoodChosen((mood) => {
                        return {
                          ...mood,
                          isPersonalMoodPositive: false
                        };
                      });
                    }}
                    className={`${
                      !moodChosen.isPersonalMoodPositive ? 'text-white bg-shoorah-primary' : ''
                    } px-2 lg:px-8 lg:text-base text-xs cursor-pointer py-1 rounded-full transition-all  `}
                  >
                    Negative
                  </p>
                </div>
              </div>

              <div className=" my-4 w-full text-shoorah-newDashboardBlue dark:text-white">
                <div className="flex flex-col">
                  <h1 className=" text-3xl lg:text-6xl flex items-center gap-x-4 font-medium">
                    {moodChosen.isPersonalMoodPositive
                      ? personalMoodData?.moodsPercentPositive
                      : personalMoodData?.moodsPercentNegative}
                    %
                    <span className=" text-xs lg:text-base">
                      {moodChosen.isPersonalMoodPositive ? 'positive' : 'negative'} of{' '}
                      {personalMoodData?.totalMoodsCount} moods collected from{' '}
                      {moodChosen.isPersonalMoodPositive
                        ? personalMoodData?.userCounts
                        : personalMoodData?.userCounts}{' '}
                      users.
                    </span>
                  </h1>
                  {moodChosen.isPersonalMoodPositive ? (
                    <span
                      className={` ${
                        personalMoodData?.percentageIncrement?.moodIncreased
                          ? 'text-green-600 dark:text-white '
                          : ' text-red-500 dark:text-white'
                      } text-xs mt-2 `}
                    >
                      {(personalMoodData?.percentageIncrement?.moodIncreased ? '+' : '-') +
                        personalMoodData?.percentageIncrement?.moodPercent +
                        '%'}
                    </span>
                  ) : (
                    <span
                      className={` ${
                        personalMoodData?.percentageIncrement?.moodNegativeIncreased
                          ? ' text-red-500 dark:text-white'
                          : 'text-green-600 dark:text-white '
                      } text-xs mt-2 `}
                    >
                      {(personalMoodData?.percentageIncrement?.moodNegativeIncreased ? '+' : '-') +
                        personalMoodData?.percentageIncrement?.moodPercent +
                        '%'}
                    </span>
                  )}
                </div>
              </div>

              {/* graph box */}
              <div className="w-full h-full  flex gap-x-2  custom-scrollbar pb-4 overflow-x-auto">
                {personalMoodData?.[
                  moodChosen.isPersonalMoodPositive
                    ? 'averagePositiveMoodsPercentage'
                    : 'averageNegativeMoodsPercentage'
                ]?.map((value, index) => {
                  return (
                    <div key={index} className="text-white w-[40vw] lg:w-[15vw] flex-shrink-0">
                      {/* heading */}
                      <div className="bg-[#313B6B] rounded-t-3xl p-2 capitalize text-center font-normal ">
                        {value.label}
                      </div>
                      <div
                        className={`bg-gradient-to-b pb-4  px-4 text-center from-[#929CEB] to-shoorah-secondary `}
                      >
                        <p className="py-8 text-xl  ">{emojis[value.name]}</p>
                        <p className="font-medium">{value.value + '%'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* professional mood box */}
            <div className=" w-full  flex mb-8 flex-col justify-center items-center ">
              <div className=" w-full flex justify-between items-center">
                <div>
                  <h4 className=" text-base lg:text-lg font-medium whitespace-nowrap">
                    Professional Moods
                  </h4>
                  <p className="text-xs">
                    {parameters.dateCriteria !== '4'
                      ? DATECREITERIA[
                          DATECREITERIA?.findIndex((data) => parameters.dateCriteria == data.value)
                        ]?.name
                      : `Month to date (${moment(parameters?.startDate).format(
                          'Do MMMM'
                        )} - ${moment(parameters?.endDate).format('Do MMMM')})`}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-x-2">
                  <p
                    onClick={() => {
                      setMoodChosen((mood) => {
                        return {
                          ...mood,
                          isprofessionalMoodPositive: true
                        };
                      });
                    }}
                    className={`${
                      moodChosen.isprofessionalMoodPositive ? 'text-white bg-shoorah-primary' : ''
                    }  px-2 lg:text-base text-xs lg:px-8 cursor-pointer py-1 rounded-full transition-all `}
                  >
                    Positive
                  </p>
                  <p
                    onClick={() => {
                      setMoodChosen((mood) => {
                        return {
                          ...mood,
                          isprofessionalMoodPositive: false
                        };
                      });
                    }}
                    className={`${
                      !moodChosen.isprofessionalMoodPositive ? 'text-white bg-shoorah-primary' : ''
                    }  px-2 lg:text-base text-xs lg:px-8 cursor-pointer py-1 rounded-full transition-all `}
                  >
                    Negative
                  </p>
                </div>
              </div>

              <div className=" text-shoorah-newDashboardBlue my-4 w-full dark:text-white">
                <div className="flex flex-col">
                  <h1 className="text-3xl lg:text-6xl flex items-center gap-x-4 font-medium">
                    {moodChosen.isprofessionalMoodPositive
                      ? professionalMoodData?.moodsPercentPositive
                      : professionalMoodData?.moodsPercentNegative}
                    %
                    <span className=" text-xs lg:text-base">
                      {moodChosen.isprofessionalMoodPositive ? 'positive' : 'negative'} of{' '}
                      {professionalMoodData?.totalMoodsCount} moods collected from{' '}
                      {moodChosen.isprofessionalMoodPositive
                        ? professionalMoodData?.userCounts
                        : professionalMoodData?.userCounts}{' '}
                      users.
                    </span>
                  </h1>
                  {moodChosen.isprofessionalMoodPositive ? (
                    <span
                      className={` ${
                        professionalMoodData?.percentageIncrement?.moodIncreased
                          ? 'text-green-600 dark:text-white '
                          : ' text-red-500 dark:text-white'
                      } text-xs mt-2 `}
                    >
                      {(professionalMoodData?.percentageIncrement?.moodIncreased ? '+' : '-') +
                        (professionalMoodData?.percentageIncrement?.moodPercent
                          ? professionalMoodData?.percentageIncrement?.moodPercent
                          : 0) +
                        '%'}
                    </span>
                  ) : (
                    <span
                      className={` ${
                        professionalMoodData?.percentageIncrement?.moodNegativeIncreased
                          ? ' text-red-500 dark:text-white'
                          : 'text-green-600 dark:text-white '
                      } text-xs mt-2 `}
                    >
                      {(professionalMoodData?.percentageIncrement?.moodNegativeIncreased
                        ? '+'
                        : '-') +
                        (professionalMoodData?.percentageIncrement?.moodPercentNegative
                          ? professionalMoodData?.percentageIncrement?.moodPercentNegative
                          : 0) +
                        '%'}
                    </span>
                  )}
                </div>
              </div>
              {/* graph box */}
              <div className="w-full h-full  flex gap-x-2 custom-scrollbar pb-4 overflow-x-auto">
                {professionalMoodData?.[
                  moodChosen.isprofessionalMoodPositive
                    ? 'averagePositiveMoodsPercentage'
                    : 'averageNegativeMoodsPercentage'
                ]?.map((value, index) => {
                  return (
                    <div key={index} className="text-white w-[40vw] lg:w-[15vw] flex-shrink-0">
                      {/* heading */}
                      <div className="bg-[#313B6B] rounded-t-3xl capitalize p-2 text-center font-normal ">
                        {value.label}
                      </div>
                      <div
                        className={`bg-gradient-to-b h-full flex flex-col justify-around pb-4  px-4 text-center from-[#929CEB] to-shoorah-secondary `}
                      >
                        <p className="text-sm mt-3">{value.title}</p>
                        <p className="py-3 text-xl">{emojis[value.name]}</p>
                        <p className="font-medium">{value.value + '%'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* sleep and after sleep tracking box */}
          <div className="bg-white dark:bg-shoorah-darkBgTabColor flex flex-col gap-y-12 rounded-2xl text-shoorah-newDashboardBlue dark:text-white px-6 p-4">
            {/* box 1 */}
            <div className="flex flex-col gap-y-2 lg:flex-row gap-x-4 items-center">
              <h4 className="text-2xl font-medium whitespace-nowrap">Sleep Logs Tracking</h4>
              <div className="flex gap-x-4  w-full justify-between ">
                <span className="text-xs">
                  Unlock a deeper understanding of your team's sleeps with our advanced sleep
                  tracking tool.
                </span>

                <div className="flex relative items-center gap-x-4">
                  <ReactTooltip id="overall-sleep-solution" />
                  <svg
                    data-tooltip-id="overall-sleep-solution"
                    data-tooltip-content="Download Sleep Solution Report"
                    onClick={() => {
                      downLoadSolutions({
                        avgPositive:
                          afterSleepData.moodsPercentPositive == 0
                            ? beforeSleepData.moodsPercentPositive
                            : (beforeSleepData.moodsPercentPositive +
                                afterSleepData.moodsPercentPositive) /
                              2,
                        avgNegative:
                          afterSleepData.moodsPercentNegative == 0
                            ? beforeSleepData.moodsPercentNegative
                            : (beforeSleepData.moodsPercentNegative +
                                afterSleepData.moodsPercentNegative) /
                              2,
                        solutionType: 2,
                        graphName: 'Sleep logs Solution'
                      });
                    }}
                    viewBox="0 0 18 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 flex-shrink-0 fill-shoorah-sidebarBackground stroke-shoorah-sidebarBackground dark:stroke-white dark:fill-white cursor-pointer "
                  >
                    <path d="M16.001 3.58326H16.501V4.08326V5.83297C16.501 5.87895 16.5383 5.91622 16.5843 5.91622C16.6303 5.91622 16.6675 5.87893 16.6675 5.83301V3.50005C16.6675 3.45407 16.6302 3.4168 16.5843 3.4168H7.78319H7.36061L7.29018 3.00013C7.07744 1.74147 6.09133 0.755343 4.83262 0.542571C3.19925 0.266472 1.65133 1.36677 1.37527 3.00013C1.0992 4.6335 2.1995 6.18142 3.83285 6.45749L3.83286 6.45749C5.46622 6.73359 7.01412 5.6333 7.29022 3.99993L7.36065 3.58326H7.78322H13.0848H13.5848V4.08326V5.83297C13.5848 5.87895 13.6221 5.91622 13.6681 5.91622C13.714 5.91622 13.7513 5.87895 13.7513 5.83297V4.08326V3.58326H14.2513H16.001ZM1.50334 3.50005C1.50334 1.93544 2.77169 0.667089 4.33629 0.667089C5.9009 0.667089 7.16925 1.93544 7.16925 3.50005C7.16925 5.06465 5.9009 6.33301 4.33629 6.33301C2.77169 6.33301 1.50334 5.06465 1.50334 3.50005Z" />
                  </svg>

                  {/* <ReactTooltip id="overall-sleep-report" /> */}
                  <svg
                    data-tooltip-id="overall-sleep-report"
                    data-tooltip-content="Download Sleep Report"
                    className="w-5 h-5 fill-shoorah-sidebarBackground cursor-pointer dark:fill-white"
                    viewBox="0 0 14 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                      setSleepReportBox(!sleepReportBox);
                    }}
                  >
                    <path d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z" />
                  </svg>

                  <Transition
                    show={sleepReportBox}
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div
                      className="absolute py-2 px-2 !w-[12rem] right-[1rem] sm:right-[4rem] top-[1rem] z-[2] mt-2 mx-auto  origin-top-right rounded-md bg-white dark:bg-shoorah-darkBgTabColor  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none "
                      ref={sleepBoxRef}
                    >
                      <div className="flex w-full flex-col gap-3">
                        <div
                          className="w-full cursor-pointer"
                          onClick={() => {
                            downLoadSleepReport('Before Sleep Report', 1);
                          }}
                        >
                          Before Sleep Report
                        </div>
                        <div
                          className="w-full"
                          onClick={() => {
                            downLoadSleepReport('After Sleep Report', 2);
                          }}
                        >
                          After Sleep Report
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            {/* before sleep log box */}
            <div className=" w-full flex flex-col justify-center items-center ">
              <div className=" w-full flex justify-between items-center">
                <div>
                  <h4 className=" text-base lg:text-lg font-medium whitespace-nowrap">
                    Before Sleep Logs
                  </h4>
                  <p className="text-xs">
                    {parameters.dateCriteria !== '4'
                      ? DATECREITERIA[
                          DATECREITERIA?.findIndex((data) => parameters.dateCriteria == data.value)
                        ]?.name
                      : `Month to date (${moment(parameters?.startDate).format(
                          'Do MMMM'
                        )} - ${moment(parameters?.endDate).format('Do MMMM')})`}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-x-2">
                  <p
                    onClick={() => {
                      setsleepChosen((mood) => {
                        return {
                          ...mood,
                          isBeforeSleepPositive: true
                        };
                      });
                    }}
                    className={`${
                      sleepChosen.isBeforeSleepPositive ? 'text-white bg-shoorah-primary' : ''
                    }  px-2 lg:text-base text-xs lg:px-8 cursor-pointer py-1 rounded-full transition-all `}
                  >
                    Positive
                  </p>
                  <p
                    onClick={() => {
                      setsleepChosen((mood) => {
                        return {
                          ...mood,
                          isBeforeSleepPositive: false
                        };
                      });
                    }}
                    className={`${
                      !sleepChosen.isBeforeSleepPositive ? 'text-white bg-shoorah-primary' : ''
                    } px-2 lg:px-8 lg:text-base text-xs cursor-pointer py-1 rounded-full transition-all  `}
                  >
                    Negative
                  </p>
                </div>
              </div>

              <div className=" my-4 w-full text-shoorah-newDashboardBlue dark:text-white">
                <div className="flex flex-col">
                  <h1 className=" text-3xl lg:text-6xl flex items-center gap-x-4 font-medium">
                    {sleepChosen.isBeforeSleepPositive
                      ? beforeSleepData?.moodsPercentPositive
                      : beforeSleepData?.moodsPercentNegative}
                    %
                    <span className=" text-xs lg:text-base">
                      {sleepChosen.isBeforeSleepPositive ? 'positive' : 'negative'} of{' '}
                      {beforeSleepData?.totalMoodsCount} logs collected from{' '}
                      {sleepChosen.isBeforeSleepPositive
                        ? beforeSleepData?.userCounts
                        : beforeSleepData?.userCounts}{' '}
                      users.
                    </span>
                  </h1>
                  {sleepChosen.isBeforeSleepPositive ? (
                    <span
                      className={` ${
                        beforeSleepData?.percentageIncrement?.moodIncreased
                          ? 'text-green-600 dark:text-white '
                          : ' text-red-500 dark:text-white'
                      } text-xs mt-2 `}
                    >
                      {(beforeSleepData?.percentageIncrement?.moodIncreased ? '+' : '-') +
                        beforeSleepData?.percentageIncrement?.moodPercent +
                        '%'}
                    </span>
                  ) : (
                    <span
                      className={` ${
                        beforeSleepData?.percentageIncrement?.moodNegativeIncreased
                          ? ' text-red-500 dark:text-white'
                          : 'text-green-600 dark:text-white '
                      } text-xs mt-2 `}
                    >
                      {(beforeSleepData?.percentageIncrement?.moodNegativeIncreased ? '+' : '-') +
                        beforeSleepData?.percentageIncrement?.moodPercent +
                        '%'}
                    </span>
                  )}
                </div>
              </div>

              {/* graph box */}
              <div className="w-full h-full  flex gap-x-2  custom-scrollbar pb-4 overflow-x-auto">
                {beforeSleepData?.[
                  sleepChosen.isBeforeSleepPositive
                    ? 'averagePositiveMoodsPercentage'
                    : 'averageNegativeMoodsPercentage'
                ]?.map((value, index) => {
                  return (
                    <div key={index} className="text-white w-[40vw] lg:w-[15vw] flex-shrink-0">
                      {/* heading */}
                      <div className="bg-[#313B6B] rounded-t-3xl p-2 capitalize text-center font-normal ">
                        {value.label}
                      </div>
                      <div
                        className={`bg-gradient-to-b pb-4  px-4 text-center from-[#929CEB] to-shoorah-secondary `}
                      >
                        <p className="py-8 text-xl  ">{emojis[value.name]}</p>
                        <p className="font-medium">{value.value + '%'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* professional mood box */}
            <div className=" w-full  flex mb-8 flex-col justify-center items-center ">
              <div className=" w-full flex justify-between items-center">
                <div>
                  <h4 className=" text-base lg:text-lg font-medium whitespace-nowrap">
                    During Sleep Logs
                  </h4>
                  <p className="text-xs">
                    {parameters.dateCriteria !== '4'
                      ? DATECREITERIA[
                          DATECREITERIA?.findIndex((data) => parameters.dateCriteria == data.value)
                        ]?.name
                      : `Month to date (${moment(parameters?.startDate).format(
                          'Do MMMM'
                        )} - ${moment(parameters?.endDate).format('Do MMMM')})`}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-x-2">
                  <p
                    onClick={() => {
                      setsleepChosen((mood) => {
                        return {
                          ...mood,
                          isAfterSleepPositive: true
                        };
                      });
                    }}
                    className={`${
                      sleepChosen.isAfterSleepPositive ? 'text-white bg-shoorah-primary' : ''
                    }  px-2 lg:text-base text-xs lg:px-8 cursor-pointer py-1 rounded-full transition-all `}
                  >
                    Positive
                  </p>
                  <p
                    onClick={() => {
                      setsleepChosen((mood) => {
                        return {
                          ...mood,
                          isAfterSleepPositive: false
                        };
                      });
                    }}
                    className={`${
                      !sleepChosen.isAfterSleepPositive ? 'text-white bg-shoorah-primary' : ''
                    }  px-2 lg:text-base text-xs lg:px-8 cursor-pointer py-1 rounded-full transition-all `}
                  >
                    Negative
                  </p>
                </div>
              </div>

              <div className=" text-shoorah-newDashboardBlue my-4 w-full dark:text-white">
                <div className="flex flex-col">
                  <h1 className="text-3xl lg:text-6xl flex items-center gap-x-4 font-medium">
                    {sleepChosen.isAfterSleepPositive
                      ? afterSleepData?.moodsPercentPositive
                      : afterSleepData?.moodsPercentNegative}
                    %
                    <span className=" text-xs lg:text-base">
                      {sleepChosen.isAfterSleepPositive ? 'positive' : 'negative'} of{' '}
                      {afterSleepData?.totalMoodsCount} logs collected from{' '}
                      {sleepChosen.isAfterSleepPositive
                        ? afterSleepData?.userCounts
                        : afterSleepData?.userCounts}{' '}
                      users.
                    </span>
                  </h1>
                  {sleepChosen.isAfterSleepPositive ? (
                    <span
                      className={` ${
                        afterSleepData?.percentageIncrement?.moodIncreased
                          ? 'text-green-600 dark:text-white '
                          : ' text-red-500 dark:text-white'
                      } text-xs mt-2 `}
                    >
                      {(afterSleepData?.percentageIncrement?.moodIncreased ? '+' : '-') +
                        (afterSleepData?.percentageIncrement?.moodPercent
                          ? afterSleepData?.percentageIncrement?.moodPercent
                          : 0) +
                        '%'}
                    </span>
                  ) : (
                    <span
                      className={` ${
                        afterSleepData?.percentageIncrement?.moodNegativeIncreased
                          ? ' text-red-500 dark:text-white'
                          : 'text-green-600 dark:text-white '
                      } text-xs mt-2 `}
                    >
                      {(afterSleepData?.percentageIncrement?.moodNegativeIncreased ? '+' : '-') +
                        (afterSleepData?.percentageIncrement?.moodPercentNegative
                          ? afterSleepData?.percentageIncrement?.moodPercentNegative
                          : 0) +
                        '%'}
                    </span>
                  )}
                </div>
              </div>
              {/* graph box */}
              <div className="w-full h-full  flex gap-x-2 custom-scrollbar pb-4 overflow-x-auto">
                {afterSleepData?.[
                  sleepChosen.isAfterSleepPositive
                    ? 'averagePositiveMoodsPercentage'
                    : 'averageNegativeMoodsPercentage'
                ]?.map((value, index) => {
                  return (
                    <div key={index} className="text-white w-[40vw] lg:w-[15vw] flex-shrink-0">
                      {/* heading */}
                      <div className="bg-[#313B6B] rounded-t-3xl capitalize p-2 text-center font-normal ">
                        {value.label}
                      </div>
                      <div
                        className={`bg-gradient-to-b h-full flex flex-col justify-around pb-4  px-4 text-center from-[#929CEB] to-shoorah-secondary `}
                      >
                        <p className="text-sm mt-3">{value.title}</p>
                        <p className="py-3 text-xl">{emojis[value.name]}</p>
                        <p className="font-medium">{value.value + '%'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* most used feature box */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-shoorah-newDashboardBlue dark:text-white">
            {/* graph */}
            <div className=" bg-white dark:bg-shoorah-darkBgTabColor flex flex-col rounded-2xl  p-6 ">
              <div className="flex items-center justify-between gap-x-4">
                <h4 className="text-lg flex flex-col font-medium whitespace-nowrap">
                  Most Used Features
                  <span className="text-xs text-gray-400 w-[50%]">
                    Understanding of your team's percentage <br />
                    features usage on app.
                  </span>
                </h4>

                <div className="flex items-center justify-between">
                  <ReactTooltip id="features-filter" />
                  <div
                    data-tooltip-id="features-filter"
                    data-tooltip-content="Filters"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className=" p-2 px-3 bg-white dark:bg-shoorah-darkBgTabColor  rounded-2xl cursor-pointer"
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
                        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className=" flex-grow relative justify-between items-center flex gap-4 flex-col">
                <div className="flex justify-center items-center ">
                  <ReactApexChart
                    series={[
                      contentUsageData.journalCounts,
                      contentUsageData.shuruCounts,
                      contentUsageData.restoreCounts,
                      contentUsageData.podsCounts
                    ]}
                    options={{
                      colors: ['#4A56DB', '#8FD460', '#F076A0', '#7BD3EA'],
                      labels: ['Journal', 'Shuru', 'Restore', 'Pods'],
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
                <span className="grid grid-cols-2 lg:grid-cols-4 gap-x-4  w-full justify-evenly gap-y-6  ">
                  <span>
                    <div className="flex  justify-center gap-x-1 text-sm items-center">
                      <span className="w-4 h-4 inline-block  rounded bg-[#4A56DB]"></span>
                      <div>
                        <div className="text-gray-400"> {RadialDummydata[0].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {RadialDummydata[0].x}
                      </div> */}
                    </div>
                  </span>
                  <span>
                    <div className="flex items-center  justify-center gap-x-1 text-sm">
                      <span className="w-4 h-4 inline-block  rounded bg-[#8FD460]"></span>
                      <div>
                        <div className="text-gray-400">{RadialDummydata[1].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {RadialDummydata[1].x}
                      </div> */}
                    </div>
                  </span>
                  <span>
                    <div className="flex  justify-center gap-x-1 text-sm items-center">
                      <span className="w-4 h-4 inline-block  rounded bg-[#F076A0]"></span>
                      <div>
                        <div className="text-gray-400">{RadialDummydata[2].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {RadialDummydata[2].x}
                      </div> */}
                    </div>
                  </span>

                  <span>
                    <div className="flex  justify-center gap-x-1 text-sm items-center">
                      <span className="w-4 h-4 inline-block  rounded bg-[#7BD3EA]"></span>
                      <div>
                        <div className="text-gray-400">{RadialDummydata[3].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {RadialDummydata[2].x}
                      </div> */}
                    </div>
                  </span>
                </span>
              </div>
            </div>

            {/* sos data */}
            <div className=" bg-white dark:bg-shoorah-darkBgTabColor flex flex-col  rounded-2xl   p-6 ">
              <div className="flex items-center justify-between gap-x-4">
                <h4 className="text-lg flex flex-col font-medium whitespace-nowrap">
                  User SOS Data
                  <span className="text-xs text-gray-400 w-[50%]">
                    Understanding of your team's SOS attempts.
                  </span>
                </h4>

                <div className="flex items-center ">
                  <ReactTooltip id="sos-filter" />
                  <div
                    data-tooltip-id="sos-filter"
                    data-tooltip-content="Filters"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className=" p-2 px-3 bg-white dark:bg-shoorah-darkBgTabColor  rounded-2xl cursor-pointer"
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
                        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                      />
                    </svg>
                  </div>

                  <ReactTooltip id="sos-download-report" />
                  <svg
                    data-tooltip-id="sos-download-report"
                    data-tooltip-content="Download Sos Report"
                    className="w-5 h-5 fill-shoorah-sidebarBackground cursor-pointer dark:fill-white"
                    viewBox="0 0 14 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                      getSosReport();
                    }}
                  >
                    <path d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z" />
                  </svg>
                </div>
              </div>
              <div className="  flex-grow  relative justify-between items-center flex gap-4 flex-col">
                <div className="flex justify-center items-center ">
                  <ReactApexChart
                    series={[sosData?.uniqueSosPhoneUsers, sosData?.sosClicks, sosData?.sosPhone]}
                    options={{
                      colors: ['#4A56DB', '#8FD460', '#F076A0'],
                      labels: ['Total User', 'SOS Count', 'Call Count'],
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
                              fontFamily: 'Work Sans'
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
                <span className=" grid grid-cols-1 lg:grid-cols-3 gap-x-4  w-full justify-evenly gap-y-6  ">
                  <span>
                    <div className="flex  justify-center gap-x-1 text-sm items-center">
                      <span className="w-4 h-4 inline-block  rounded bg-[#4A56DB]"></span>
                      <div>
                        <div className="text-gray-400"> {sosDummydata[0].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {sosDummydata[0].x}
                      </div> */}
                    </div>
                  </span>
                  <span>
                    <div className="flex items-center  justify-center gap-x-1 text-sm">
                      <span className="w-4 h-4 inline-block  rounded bg-[#8FD460]"></span>
                      <div>
                        <div className="text-gray-400">{sosDummydata[1].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {sosDummydata[1].x}
                      </div> */}
                    </div>
                  </span>
                  <span>
                    <div className="flex  justify-center gap-x-1 text-sm items-center">
                      <span className="w-4 h-4 inline-block  rounded bg-[#F076A0]"></span>
                      <div>
                        <div className="text-gray-400">{sosDummydata[2].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {sosDummydata[2].x}
                      </div> */}
                    </div>
                  </span>
                </span>
              </div>
            </div>

            {/* emotion graph */}
            <EmotionsStatistics />
          </div>

          <div className=" grid col-span-12 lg:col-span-7 grid-rows-1 gap-4 text-shoorah-sidebarBackground dark:text-white">
            {/* box 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 text-shoorah-newDashboardBlue dark:text-white">
              <div className="flex flex-col gap-y-2 bg-white rounded-3xl p-6 pb-10">
                <h4 className="text-lg font-medium">Send praise to your employees</h4>
                <span className="text-sm text-shoorah-gray3">
                  Express appreciation for those who have exceeded expectations!
                  <br />
                  *Employees will receive an anonymous notification within the app.
                </span>
                <div>
                  <button
                    onClick={() => {
                      setIsPraiseEmployModalOpen(true);
                    }}
                    className="text-sm bg-shoorah-secondary px-2 py-1 rounded-md text-white font-medium cursor-pointer"
                  >
                    {'Select Employee(s)'}
                  </button>
                </div>
              </div>

              <div className="flex relative flex-col gap-y-2 bg-white rounded-3xl p-6 pb-10">
                <h4 className="text-lg font-medium">Breathwork insights</h4>
                <span className="text-sm text-shoorah-gray3">
                  This will tell you total breathwork sessions attended and duration played by
                  users.
                </span>

                <button
                  className="absolute top-[1rem] right-[4.5rem] mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-3 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={downLoadBreathworkReport}
                >
                  <svg
                    className="w-5 h-5 fill-shoorah-sidebarBackground dark:fill-white"
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

                <button
                  className="absolute top-[1rem] right-[1rem] mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-3 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={() => {
                    downLoadSolutions({
                      solutionType: 4,
                      graphName: 'Breathwork Solution',
                      breathwork: breathworkInsights
                    });
                  }}
                >
                  <svg
                    viewBox="0 0 18 7"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 fill-shoorah-sidebarBackground stroke-shoorah-sidebarBackground dark:stroke-white dark:fill-white cursor-pointer "
                  >
                    <path
                      stroke="#fff"
                      d="M16.001 3.58326H16.501V4.08326V5.83297C16.501 5.87895 16.5383 5.91622 16.5843 5.91622C16.6303 5.91622 16.6675 5.87893 16.6675 5.83301V3.50005C16.6675 3.45407 16.6302 3.4168 16.5843 3.4168H7.78319H7.36061L7.29018 3.00013C7.07744 1.74147 6.09133 0.755343 4.83262 0.542571C3.19925 0.266472 1.65133 1.36677 1.37527 3.00013C1.0992 4.6335 2.1995 6.18142 3.83285 6.45749L3.83286 6.45749C5.46622 6.73359 7.01412 5.6333 7.29022 3.99993L7.36065 3.58326H7.78322H13.0848H13.5848V4.08326V5.83297C13.5848 5.87895 13.6221 5.91622 13.6681 5.91622C13.714 5.91622 13.7513 5.87895 13.7513 5.83297V4.08326V3.58326H14.2513H16.001ZM1.50334 3.50005C1.50334 1.93544 2.77169 0.667089 4.33629 0.667089C5.9009 0.667089 7.16925 1.93544 7.16925 3.50005C7.16925 5.06465 5.9009 6.33301 4.33629 6.33301C2.77169 6.33301 1.50334 5.06465 1.50334 3.50005Z"
                    />
                  </svg>
                </button>

                <div className="text-sm text-gray-800 flex justify-between mt-2">
                  <p>Total Sessions: {breathworkInsights.sessions}</p>
                  <p className="pr-3">Total Time spent: {breathworkInsights.duration} min</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-shoorah-newDashboardBlue hidden grid-cols-2 gap-x-6 dark:text-white">
            {/* sos data */}
            <div className=" bg-white dark:bg-shoorah-darkBgTabColor  rounded-2xl   p-6 ">
              <div className="flex items-center  justify-between gap-x-4">
                <h4 className="text-lg font-medium whitespace-nowrap">User SOS Data</h4>

                <svg
                  className="w-5 h-5 fill-shoorah-sidebarBackground cursor-pointer dark:fill-white"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    getSosReport();
                  }}
                >
                  <path d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z" />
                </svg>
              </div>
              <div className="  relative justify-center items-center flex gap-4 flex-col">
                <div className="flex justify-center items-center ">
                  <ReactApexChart
                    series={[
                      contentUsageData.journalCounts,
                      contentUsageData.shuruCounts,
                      contentUsageData.restoreCounts
                    ]}
                    options={{
                      colors: ['#4A56DB', '#8FD460', '#F076A0'],
                      labels: ['Total User', 'SOS Count', 'Call Count'],
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
                              show: false,
                              fontSize: '22px'
                            },
                            value: {
                              show: false,
                              fontSize: '16px'
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
                <span className=" grid grid-cols-3 gap-x-4  w-full justify-evenly gap-y-6  ">
                  <span>
                    <div className="flex  justify-center gap-x-1 text-sm items-center">
                      <span className="w-4 h-4 inline-block  rounded bg-[#4A56DB]"></span>
                      <div>
                        <div className="text-gray-400"> {sosDummydata[0].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {sosDummydata[0].x}
                      </div> */}
                    </div>
                  </span>
                  <span>
                    <div className="flex items-center  justify-center gap-x-1 text-sm">
                      <span className="w-4 h-4 inline-block  rounded bg-[#8FD460]"></span>
                      <div>
                        <div className="text-gray-400">{sosDummydata[1].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {sosDummydata[1].x}
                      </div> */}
                    </div>
                  </span>
                  <span>
                    <div className="flex  justify-center gap-x-1 text-sm items-center">
                      <span className="w-4 h-4 inline-block  rounded bg-[#F076A0]"></span>
                      <div>
                        <div className="text-gray-400">{sosDummydata[2].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {sosDummydata[2].x}
                      </div> */}
                    </div>
                  </span>
                </span>
              </div>
            </div>

            <div className=" bg-white dark:bg-shoorah-darkBgTabColor  rounded-2xl   p-6 ">
              <div className="flex items-center justify-between gap-x-4">
                <h4 className="text-lg font-medium whitespace-nowrap">Journal Data</h4>

                <div className="flex items-center justify-between">
                  {/* <select
                    className={`border text-[#666666] dark:text-white bg-white dark:bg-shoorah-darkBgColor text-sm dark:border-none  rounded-md ${
                      parameters.dateCriteria == "4" ? "w-4/5" : "w-full"
                    } py-2 px-2`}
                    value={parameters.dateCriteria}
                    onChange={handleChange}
                    id="dateCriteria"
                    name="dateCriteria"
                  >
                    <option value={""} disabled>
                      Select Date Criteria
                    </option>
                    {DATECREITERIA.map((e, i) => (
                      <option key={i} value={e.value}>
                        {e.name}
                      </option>
                    ))}
                  </select> */}

                  {/* <select
                    className={`border text-[#666666] dark:text-white bg-white dark:bg-shoorah-darkBgColor text-sm dark:border-none  rounded-md ${
                      parameters.dateCriteria == "4" ? "w-4/5" : "w-full"
                    } py-2 px-2`}
                    value={mostUsedFeatureDateFilter}
                    onChange={(e) => {
                      setMostUsedFeatureDateFilter(e.target.value);
                    }}
                    id="dateCriteria"
                    name="dateCriteria"
                  >
                    <option value={""} disabled>
                      Select Date Criteria
                    </option>
                    <option value={1}>Today</option>
                    <option value={2}>Weekly</option>
                    <option value={3}>Monthly</option>
                    <option value={4}>Yearly</option>
                  </select> */}

                  {model.dateButtonVisible && (
                    <button
                      className={`inline-flex items-center justify-center rounded-3xl  text-black ${
                        parameters.dateCriteria == '4' ? '' : ''
                      } px-2 py-1 text-xs font-medium shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto`}
                      onClick={() =>
                        setModel({
                          ...model,
                          datePickerVisible: !model.datePickerVisible
                        })
                      }
                    >
                      <CalendarIcon className="w-[18px] dark:text-white text-shoorah-sidebarBackground h-[20px] inline" />
                    </button>
                  )}
                </div>
                {model.datePickerVisible && (
                  <Transition
                    show={model.datePickerVisible}
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div
                      className="absolute lg:right-[2rem] sm:right-[2rem] z-[2] mt-2 mx-auto lg:left-0 origin-top-right rounded-md bg-white dark:bg-shoorah-darkBgTabColor  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-fit"
                      ref={wrapperRef}
                    >
                      <DateRangePicker
                        ranges={[
                          {
                            startDate: parameters?.startDate ? parameters?.startDate : new Date(),
                            endDate: parameters?.endDate ? parameters?.endDate : new Date(),
                            key: 'selection'
                          }
                        ]}
                        onChange={handleSelectRange}
                        maxDate={new Date()}
                      />
                    </div>
                  </Transition>
                )}
              </div>
              <div className="  relative justify-center items-center flex gap-4 flex-col">
                <div className="flex justify-center items-center ">
                  <ReactApexChart
                    series={[
                      contentUsageData.journalCounts,
                      contentUsageData.shuruCounts,
                      contentUsageData.restoreCounts
                    ]}
                    options={{
                      colors: ['#4A56DB', '#8FD460', '#F076A0'],
                      labels: ['Total User', 'SOS Count', 'Call Count'],
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
                              show: false,
                              fontSize: '22px'
                            },
                            value: {
                              show: false,
                              fontSize: '16px'
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
                <span className=" hidden grid-cols-3 gap-x-4  w-full justify-evenly gap-y-6  ">
                  <span>
                    <div className="flex  justify-center gap-x-1 text-sm items-center">
                      <span className="w-4 h-4 inline-block  rounded bg-[#4A56DB]"></span>
                      <div>
                        <div className="text-gray-400"> {RadialDummydata[0].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {RadialDummydata[0].x}
                      </div> */}
                    </div>
                  </span>
                  <span>
                    <div className="flex items-center  justify-center gap-x-1 text-sm">
                      <span className="w-4 h-4 inline-block  rounded bg-[#8FD460]"></span>
                      <div>
                        <div className="text-gray-400">{RadialDummydata[1].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {RadialDummydata[1].x}
                      </div> */}
                    </div>
                  </span>
                  <span>
                    <div className="flex  justify-center gap-x-1 text-sm items-center">
                      <span className="w-4 h-4 inline-block  rounded bg-[#F076A0]"></span>
                      <div>
                        <div className="text-gray-400">{RadialDummydata[2].name}</div>
                      </div>{' '}
                      {/* <div className="text-xl font-medium">
                        {RadialDummydata[2].x}
                      </div> */}
                    </div>
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* shuru therapy graph box */}
          <div>
            <div className="bg-white dark:bg-shoorah-darkBgTabColor dark:text-white my-5 rounded-2xl py-4">
              <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center py-2 px-6">
                <div className=" lg:block relative hidden p-1 rounded">
                  <button
                    className={`rounded px-5 py-1 ${
                      graphDataType.secondGrapgh == 'positive'
                        ? 'text-white bg-shoorah-primary'
                        : ''
                    } px-2 lg:text-base text-xs lg:px-8 cursor-pointer py-1 rounded-full transition-all`}
                    onClick={() => changeGraphOption('positive', 'secondGrapgh')}
                  >
                    Positive
                  </button>
                  <button
                    className={` rounded px-5 py-1 ${
                      graphDataType.secondGrapgh == 'negative'
                        ? 'text-white bg-shoorah-primary'
                        : ''
                    } px-2 lg:text-base text-xs lg:px-8 cursor-pointer py-1 rounded-full transition-all`}
                    onClick={() => changeGraphOption('negative', 'secondGrapgh')}
                  >
                    Negative
                  </button>
                  <span className="absolute top-[3.5rem] text-[14px] left-1">
                    Data collected from {theraphyUserCount || 0} users
                  </span>
                </div>
                <div>
                  <p className="font-medium text-lg lg:text-xl">Shuru Therapy & Journal Keywords</p>
                </div>
                <div className="lg:block hidden">
                  {!props.companyId && (
                    <div className=" flex items-center">
                      <ReactTooltip id="therapy-filter" />
                      <div
                        data-tooltip-id="therapy-filter"
                        data-tooltip-content="Filters"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className=" p-2 px-3 bg-white dark:bg-shoorah-darkBgTabColor  rounded-2xl cursor-pointer"
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
                            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                          />
                        </svg>
                      </div>

                      <ReactTooltip id="shuru-therapy-solution" />
                      <button
                        data-tooltip-id="shuru-therapy-solution"
                        data-tooltip-content="Download Shuru Therapy & Journal Keywords Solution Report"
                        className="inline-flex items-center justify-center rounded-md mr-2 border border-transparent bg-gradient-to-r  px-2 py-1 text-xs font-medium text-white  hover:shoorah-primary focus:outline-none sm:w-auto"
                        onClick={() => {
                          downLoadSolutions({
                            avgPositive: therapyPercentileData?.positive,
                            avgNegative: therapyPercentileData?.negative,
                            solutionType: 3,
                            graphName: 'Shuru Therapy Solution'
                          });
                        }}
                      >
                        <svg
                          viewBox="0 0 18 7"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 fill-shoorah-sidebarBackground stroke-shoorah-sidebarBackground dark:stroke-white dark:fill-white cursor-pointer "
                        >
                          <path d="M16.001 3.58326H16.501V4.08326V5.83297C16.501 5.87895 16.5383 5.91622 16.5843 5.91622C16.6303 5.91622 16.6675 5.87893 16.6675 5.83301V3.50005C16.6675 3.45407 16.6302 3.4168 16.5843 3.4168H7.78319H7.36061L7.29018 3.00013C7.07744 1.74147 6.09133 0.755343 4.83262 0.542571C3.19925 0.266472 1.65133 1.36677 1.37527 3.00013C1.0992 4.6335 2.1995 6.18142 3.83285 6.45749L3.83286 6.45749C5.46622 6.73359 7.01412 5.6333 7.29022 3.99993L7.36065 3.58326H7.78322H13.0848H13.5848V4.08326V5.83297C13.5848 5.87895 13.6221 5.91622 13.6681 5.91622C13.714 5.91622 13.7513 5.87895 13.7513 5.83297V4.08326V3.58326H14.2513H16.001ZM1.50334 3.50005C1.50334 1.93544 2.77169 0.667089 4.33629 0.667089C5.9009 0.667089 7.16925 1.93544 7.16925 3.50005C7.16925 5.06465 5.9009 6.33301 4.33629 6.33301C2.77169 6.33301 1.50334 5.06465 1.50334 3.50005Z" />
                        </svg>
                      </button>

                      <ReactTooltip id="shuru-therapy-report" />
                      <div
                        data-tooltip-id="shuru-therapy-report"
                        data-tooltip-content="Download Shuru Therapy & Journal Keywords Report"
                        className="inline-flex items-center cursor-pointer justify-center rounded-md border border-transparent bg-gradient-to-r  px-2 py-1 text-xs font-medium text-white  hover:shoorah-primary focus:outline-none sm:w-auto"
                        onClick={() => {
                          downLoadTherapyReport();
                        }}
                      >
                        <svg
                          className="w-5 h-5 fill-shoorah-sidebarBackground dark:fill-white"
                          viewBox="0 0 14 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:hidden w-full flex items-center justify-between">
                  <div className=" relative p-1 rounded">
                    <button
                      className={`rounded px-5 py-1 ${
                        graphDataType.secondGrapgh == 'positive'
                          ? 'text-white bg-shoorah-primary'
                          : ''
                      } px-2 lg:text-base text-xs lg:px-8 cursor-pointer py-1 rounded-full transition-all`}
                      onClick={() => changeGraphOption('positive', 'secondGrapgh')}
                    >
                      Positive
                    </button>
                    <button
                      className={` rounded px-5 py-1 ${
                        graphDataType.secondGrapgh == 'negative'
                          ? 'text-white bg-shoorah-primary'
                          : ''
                      } px-2 lg:text-base text-xs lg:px-8 cursor-pointer py-1 rounded-full transition-all`}
                      onClick={() => changeGraphOption('negative', 'secondGrapgh')}
                    >
                      Negative
                    </button>
                    <span className="absolute top-[2.5rem] text-[12px] left-0">
                      Data collected from {theraphyUserCount || 0} users
                    </span>
                  </div>

                  <div className="">
                    {!props.companyId && (
                      <div>
                        <button
                          className="inline-flex items-center justify-center rounded-md mr-2 border border-transparent bg-gradient-to-r  px-2 py-1 text-xs font-medium text-white  hover:shoorah-primary focus:outline-none sm:w-auto"
                          onClick={() => {
                            downLoadSolutions({
                              avgPositive: therapyPercentileData?.positive,
                              avgNegative: therapyPercentileData?.negative,
                              solutionType: 3,
                              graphName: 'Shuru Therapy Solution'
                            });
                          }}
                        >
                          <svg
                            viewBox="0 0 18 7"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 fill-shoorah-sidebarBackground stroke-shoorah-sidebarBackground dark:stroke-white dark:fill-white cursor-pointer "
                          >
                            <path d="M16.001 3.58326H16.501V4.08326V5.83297C16.501 5.87895 16.5383 5.91622 16.5843 5.91622C16.6303 5.91622 16.6675 5.87893 16.6675 5.83301V3.50005C16.6675 3.45407 16.6302 3.4168 16.5843 3.4168H7.78319H7.36061L7.29018 3.00013C7.07744 1.74147 6.09133 0.755343 4.83262 0.542571C3.19925 0.266472 1.65133 1.36677 1.37527 3.00013C1.0992 4.6335 2.1995 6.18142 3.83285 6.45749L3.83286 6.45749C5.46622 6.73359 7.01412 5.6333 7.29022 3.99993L7.36065 3.58326H7.78322H13.0848H13.5848V4.08326V5.83297C13.5848 5.87895 13.6221 5.91622 13.6681 5.91622C13.714 5.91622 13.7513 5.87895 13.7513 5.83297V4.08326V3.58326H14.2513H16.001ZM1.50334 3.50005C1.50334 1.93544 2.77169 0.667089 4.33629 0.667089C5.9009 0.667089 7.16925 1.93544 7.16925 3.50005C7.16925 5.06465 5.9009 6.33301 4.33629 6.33301C2.77169 6.33301 1.50334 5.06465 1.50334 3.50005Z" />
                          </svg>
                        </button>
                        <div
                          className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r  px-2 py-1 text-xs font-medium text-white  hover:shoorah-primary focus:outline-none sm:w-auto"
                          onClick={() => downLoadTherapyReport()}
                        >
                          <svg
                            className="w-5 h-5 fill-shoorah-sidebarBackground dark:fill-white"
                            viewBox="0 0 14 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="my-5">
                <div className="lg:px-10  min-h-screen custom-scrollbar">
                  <Chart
                    // options={secondGraph.option}
                    // series={secondGraph.series}
                    options={secondGraph?.[graphDataType?.secondGrapgh]?.option}
                    series={secondGraph?.[graphDataType?.secondGrapgh]?.series}
                    type="bar"
                    width={'100%'}
                    height={'100%'}
                  />
                </div>
              </div>
            </div>
          </div>
          {surveyData && (
            <>
              <div>
                {/* <DashboardSurveyChart1 data={surveyData?.graphData?.slice(0, 10)} />  */}
                <DashboardSurveyStatistics data={surveyData} />
              </div>
            </>
          )}
        </div>

        <EmployeePraiseModal
          open={isPraiseEmployModalOpen}
          setOpen={setIsPraiseEmployModalOpen}
          department={filterData.departments}
          companyId={state?._id ? state._id : userData.companyId}
        />
      </div>
    </div>
  );
}

export default NewCDashboard;
