import { Helmet } from 'react-helmet';
import { useEffect } from 'react';
import { Api } from '../api';
import { isSupported } from 'firebase/messaging';
import { requestForToken } from '../firebase';
import { useState } from 'react';
import { ValueToPercentage, errorToast, getLocalStorageItem, getUserType } from '../utils/helper';
import Loader from '../component/common/Loader';
import DashboardSection3 from './DashboardContent.js/Section3';
import DashboardSection2 from './DashboardContent.js/Section2';
import DashboardSection1 from './DashboardContent.js/Section1';
import Breadcrumb from '../component/common/Breadcrumb';
import DashboardSection4 from './DashboardContent.js/Section4';
import { useNavigate } from 'react-router-dom';
import DashboardSurveyChart from './Survey/DashboardSurveyChart';
import DashboardSurveyStatistics from './Survey/DashboardSurveyStatistics';

const max = 100;
// const pages = [{ name: "Dashboard", href: "/dashboard", current: true }];

function Dashboard() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [series, setSeries] = useState([0, 0, 0, 0]);
  const [insideData, setInsideData] = useState({});
  const [sectionTwoArray, setSectionTwoArray] = useState([]);
  const [sectionThreeArray, setSectionThreeArray] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getTime() - 24 * 3600000),
    endDate: new Date()
  });
  const [sosOptions, setSosOptions] = useState({
    sosClicks: 0,
    sosPhone: 0,
    uniqueSosPhoneUsers: 0
  });

  const [pages, setPages] = useState();

  const [surveyData, setSurveyData] = useState(null);
  const [insightType, setInsightType] = useState('All');
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const userType = getUserType(userData?.userType);
  const isUserSuperOrSubAdmin = userType === 'Super Admin' || userType === 'Sub Admin';

  useEffect(() => {
    if (userData.userType) {
      let page = [
        {
          name: 'Dashboard',
          href: userData?.slug ? `/${userData?.slug}/dashboard` : '/dashboard',
          current: true
        }
      ];

      setPages(page);
      navigate(userData?.slug ? `/${userData?.slug}/dashboard` : '/dashboard');
    }
  }, []);

  useEffect(() => {
    const apicall = async () => {
      try {
        const res = await isSupported();
        if (res) {
          try {
            const response = await requestForToken();
            if (response) { await Api.addEditDeviceToken(); }

          } catch (tokenError) {
            console.error('Error requesting token or adding device token:', tokenError);
          }
        }
        getDashboardData();
        getSOSCount();
      } catch (error) {
        console.error('Error in apicall:', error);
      }

    };

    apicall();
  }, []);

  useEffect(() => {
    getSOSCount();
  }, [dateRange]);

  useEffect(() => {
    getSurveyData(insightType);
  }, [insightType]);

  const getSOSCount = () => {
    Api.getSOSClick(dateRange)
      .then((res) => {
        if (res.data) {
          let data = res.data;
          setSosOptions({
            sosClicks: data.sosClicks,
            sosPhone: data.sosPhone,
            uniqueSosPhoneUsers: data.uniqueSosPhoneUsers
          });
        }
      })
      .catch((err) => { });
  };
  const getDashboardData = () => {
    setLoader(true);
    Api.getDashboardData().then((response) => {
      if (response?.data?.meta?.code === 1) {
        setDashboardData(response?.data?.data);
        let res = response?.data?.data;
        setSeries(
          ValueToPercentage(res.totalTrialAccount, max),
          ValueToPercentage(res.totalExpiredAccount, max),
          ValueToPercentage(res.totalPaidAccount, max),
          ValueToPercentage(res.totalNoTrialAccount, max)
        );
        setInsideData(
          {
            meditationIn: [res.totalActiveMeditation, res.totalInactiveMeditation]
          },
          { soundIn: [res.totalActiveSound, res.totalInactiveSound] },
          { ritualIn: [res.totalActiveRitual, res.totalInactiveRitual] },
          {
            affirmationIn: [res.totalActiveAffirmation, res.totalInactiveAffirmation]
          },
          { podIn: [res.totalActivePod, res.totalInactivePod] }
        );

        // STATIC ARRAY DASHBOARD SECTION TWO
        setSectionTwoArray([
          {
            flag: 1,
            data: [res.totalActiveMeditation, res.totalInactiveMeditation],
            activeBgColor: '#D97F56',
            inActiveBgColor: '#ECC09E',
            name: 'Meditation',
            activeInactiveData: {
              active: res.totalActiveMeditation,
              inactive: res.totalInactiveMeditation
            }
          },
          {
            flag: 2,
            data: [res.totalActiveSound, res.totalInactiveSound],
            activeBgColor: '#67A14A',
            inActiveBgColor: '#C2EC97',
            name: 'Sound',
            activeInactiveData: {
              active: res.totalActiveSound,
              inactive: res.totalInactiveSound
            }
          },
          {
            flag: 3,
            data: [res.totalActiveRitual, res.totalInactiveRitual],
            activeBgColor: '#F05289',
            inActiveBgColor: '#FF9BCB',
            name: 'Ritual',
            activeInactiveData: {
              active: res.totalActiveRitual,
              inactive: res.totalInactiveRitual
            }
          },
          {
            flag: 4,
            data: [res.totalActiveAffirmation, res.totalInactiveAffirmation],
            activeBgColor: '#21BDAD',
            inActiveBgColor: '#6BE0BD',
            name: 'Affirmation',
            activeInactiveData: {
              active: res.totalActiveAffirmation,
              inactive: res.totalInactiveAffirmation
            }
          },
          {
            flag: 5,
            data: [res.totalActivePod, res.totalInactivePod],
            activeBgColor: '#F7E895',
            inActiveBgColor: '#FFE873',
            name: 'Pod',
            activeInactiveData: {
              active: res.totalActivePod,
              inactive: res.totalInactivePod
            }
          }
        ]);

        // STATIC ARRAY DASHBOARD SECTION THREE
        setSectionThreeArray([
          {
            name: 'Active Main Focus',
            status: res.totalActiveMainFocus
          },
          {
            name: 'Inactive Main Focus',
            status: res.totalInactiveMainFocus
          },
          {
            name: 'Active Affirmation Focus',
            status: res.totalActiveAffirmationFocus
          },
          {
            name: 'Inactive Affirmation Focus',
            status: res.totalInactiveAffirmationFocus
          },
          {
            name: 'Total Focus',
            status: res.totalFocus
          }
        ]);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setDashboardData({});
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  const downloadSosReport = (reportType) => {
    Api.downloadSosGraphPdf(dateRange.startDate, dateRange.endDate, reportType);
  };

  const getSurveyData = (insightType) => {
    Api.getSurveyDashboardData(insightType)
      .then((res) => res?.data)
      .then((response) => {
        setSurveyData(response?.data[0] || {});
      });
  };

  return (
    <div className="relative">
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Dashboard | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3 rounded-[10px]">
        <DashboardSection1 dashboardData={dashboardData} series={series} op />
        {sectionTwoArray.length > 0 ? (
          <DashboardSection2 insideData={insideData} sectionTwoArray={sectionTwoArray} />
        ) : null}
        {sectionThreeArray.length > 0 ? (
          <DashboardSection3 sectionThreeArray={sectionThreeArray} />
        ) : null}
        <DashboardSection4
          setLoader={setLoader}
          sosData={sosOptions}
          dateRange={dateRange}
          setDateRange={setDateRange}
          downloadSosReport={downloadSosReport}
        />
        <div className="mt-5">
          <DashboardSurveyChart data={surveyData?.graphData?.slice(0, 10) || []} />
          <DashboardSurveyStatistics
            data={surveyData || {}}
            setInsightType={setInsightType}
            isUserSuperOrSubAdmin={isUserSuperOrSubAdmin}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
