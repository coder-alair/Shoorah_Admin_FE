import Breadcrumb from '../../component/common/Breadcrumb';
import PropTypes from 'prop-types';
import ProfilePic from '../../assets/images/dummy-avatar.png';
import Loader from '../../component/common/Loader';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Api } from '../../api';
import { PERFORMANCE_CONTENT_TYPE, USER_FEELS } from '../../utils/constants';
import {
  errorToast,
  getGender,
  getLocalStorageItem,
  isSuperAdmin,
  successToast
} from '../../utils/helper';
import { Helmet } from 'react-helmet';

import emptyImage from '../../assets/images/emptyData.png';
import googleIcon from '../../assets/images/google.png';
import fbIcon from '../../assets/images/fb.png';
import appleIcon from '../../assets/images/apple.png';
import mailIcon from '../../assets/images/mail.png';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import BadgeList from './BadgeListData';
import Badges from './Badges';
import LazyLoadImageProp from '../../component/common/LazyLoadImage';
import { ReactComponent as NoDataFoundImg } from '../../assets/images/no-data-found.svg';
import SelectMenu from '../../component/common/SelectMenu';
import { useNavigate } from 'react-router-dom';
import GraphContainer from './graph';
import Userwellbeing from './userwellbeing';
import EditUserValidation from '../../validation/EditUserValidation';
import EmotionsStatistics from '../../component/Statistics/Emotions';

const PerformanceData = ({ contentType, userId }) => {
  const [loader, setLoader] = useState(false);
  const [moodData, setMoodData] = useState([]);
  const [badgeData, setBadgeData] = useState([]);
  const [badgeList, setBadgeList] = useState(null);
  const [badgeLoader, setBadgeLoader] = useState(false);
  const [selectedBadge, setSelectedbadge] = useState(null);

  useEffect(() => {
    const apiCall = (contentType) => {
      setLoader(true);
      setBadgeData([]);
      setMoodData([]);
      setBadgeList(null);
      setSelectedbadge(null);
      let ApiFlag =
        contentType === 6
          ? Api.getBadgeCount(userId)
          : Api.getPerformanceData(userId, contentType, 1, 10);
      ApiFlag.then((response) => {
        if (response?.data?.meta?.code === 1) {
          setLoader(false);
          if (contentType === 6) {
            const newArray = [...response.data.data];
            newArray.sort((a, b) => a.badgeType - b.badgeType);
            newArray.map((item) => {
              return item;
            });
            setBadgeData(newArray);
          } else {
            setMoodData(response?.data?.data);
          }
        } else if (response?.code === 401) {
          setLoader(false);
          errorToast(response?.message);
        } else if (response?.data?.meta?.code === 0) {
          setMoodData([]);
          setBadgeData([]);
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      });
    };

    apiCall(contentType);
  }, [contentType, userId]);

  const handleBadgeList = (badgeType) => {
    setSelectedbadge(badgeType);
    setBadgeLoader(true);
    Api.getBadgeList(userId, badgeType).then((response) => {
      if (response?.data?.meta?.code === 1) {
        let responseData = response.data.data;
        let tempArray = [];
        Object.keys(responseData).forEach(function (key) {
          tempArray.push({ key: key, value: responseData[key] });
        });
        setBadgeList(tempArray);
        setBadgeLoader(false);
      } else if (response?.code === 401) {
        errorToast(response?.message);
        setBadgeLoader(false);
      } else if (response?.data?.meta?.code === 0) {
        errorToast(response?.data?.meta?.message);
        setBadgeLoader(false);
      }
    });
  };

  return (
    <>
      {loader || badgeLoader ? <Loader /> : null}

      <Badges
        badgeData={badgeData}
        selectedBadge={selectedBadge}
        handleBadgeList={(item) => handleBadgeList(item)}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3 mt-4">
        {moodData?.length > 0 &&
          moodData.map((item, index) => (
            <div
              key={index}
              className="relative flex items-center space-x-3 rounded-lg border dark:bg-shoorah-darkBgTabColor dark:text-white bg-white px-4 py-5"
            >
              {!item.notesId ? (
                <>
                  {item?.imageUrl ? (
                    <div className="self-start">
                      <LazyLoadImageProp imageSrc={item?.imageUrl ? item.imageUrl : ProfilePic} />
                    </div>
                  ) : (
                    <div className="bg-black flex justify-center items-center h-10 w-10 rounded-full">
                      <span className="text-white capitalize">{item?.title[0]?.charAt(0)}</span>
                      <span className="text-white capitalize">{item?.title[1]?.charAt(0)}</span>
                    </div>
                  )}
                </>
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex justify-between">
                  <div>
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium dark:text-white text-gray-900 capitalize">
                      {item?.title ? item.title : 'No title found'}
                    </p>
                    <p className="truncate text-sm text-gray-500 capitalize">
                      {item?.description ? item.description : 'No description found'}
                    </p>
                  </div>
                  <div>
                    {item?.isCompleted?.toString() && (
                      <p
                        className={`truncate rounded-3xl px-2 py-1 text-center text-sm ml-auto mt-2 text-gray-500 ${
                          item?.isCompleted
                            ? 'bg-green-100 w-[100px] text-green-500'
                            : 'bg-gray-200 w-[120px] text-gray-400'
                        }`}
                      >
                        {item?.isCompleted ? 'Completed' : 'Not completed'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {moodData?.length === 0 && contentType !== 6 ? (
        <div className="m-5 text-center w-full">
          <div className="flex justify-center w-full">
            <img loading='lazy' src={emptyImage} alt="" className="w-[280px] h-auto" />
          </div>
          <p className="text-center mt-4"> No data</p>
        </div>
      ) : null}

      {badgeData?.length === 0 && contentType === 6 ? (
        <div className="m-5 text-center w-full">
          <div className="flex justify-center w-full">
            <img loading='lazy' src={emptyImage} alt="" className="w-[280px] h-auto" />
          </div>
          <p className="text-center mt-4"> No data</p>
        </div>
      ) : null}

      {badgeList ? <BadgeList badgeList={badgeList} /> : <></>}

      {contentType === 6 && badgeData?.length !== 0 && !badgeList ? (
        <div className="m-5 text-center w-full">
          <p className="text-left mt-4">
            <span className="font-bold">Note: </span>Select badge to see badge data
          </p>
        </div>
      ) : null}
    </>
  );
};

PerformanceData.propTypes = {
  contentType: PropTypes.any,
  userId: PropTypes.any
};

function ViewEditUser() {
  const imageRef = useRef(null);
  const location = useLocation();
  const [companyList, setCompanyList] = useState([]);
  const [positive, setPositive] = useState('motivated');
  const [negative, setNegative] = useState('demotivated');
  const isSuperAdminUser = isSuperAdmin();

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const { pathname } = useLocation();
  const [pages, setPages] = useState([
    {
      name: 'Users',
      href: `${!isSuperAdminUser ? `/${userData?.slug}/users` : '/users'}`,
      current: false
    },
    { name: 'Edit User Details', href: pathname, current: true, nonClickable: true }
  ]);

  const [editMode, setEditMode] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState(1);
  const [selectedTab, setSelectedTab] = useState(1);

  const [userTab, setUserTab] = useState(1);
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({
    id: '',
    email: '',
    name: '',
    dob: 1,
    status: 0,
    loginPlatform: 0,
    type: '',
    accountType: location?.state?.accountType,
    company: location?.state?.company_id?._id,
    addedBy: null
  });
  const [gender, setGender] = useState([]);
  const [companyLoader, setCompanyLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [graphMoodArray, setGraphMoodArray] = useState([]);

  const [selectedProfessionalTab, setSelectedProfessionalTab] = useState(1);
  const [graphProfessionalMoodArray, setGraphProfessionalMoodArray] = useState([]);
  const [selectedProfessionalMood, setSelectedProfessionalMood] = useState('');
  const [professionalGraphData, setProfessionalGraphData] = useState([]);
  const [professionalPositive, setProfessionalPositive] = useState('verySatisfied');
  const [professionalNegative, setProfessionalNegative] = useState('dissatisfied');

  const [selectedBeforeSleepTab, setSelectedBeforeSleepTab] = useState(1);
  const [graphBeforeSleepArray, setGraphBeforeSleepArray] = useState([]);
  const [selectedBeforeSleep, setSelectedBeforeSleep] = useState('');
  const [beforeGraphData, setBeforeGraphData] = useState([]);
  const [beforePositive, setBeforePositive] = useState('calm');
  const [beforeNegative, setBeforeNegative] = useState('anxious');

  const [selectedAfterSleepTab, setSelectedAfterSleepTab] = useState(1);
  const [graphAfterSleepArray, setGraphAfterSleepArray] = useState([]);
  const [selectedAfterSleep, setSelectedAfterSleep] = useState('');
  const [afterGraphData, setAfterGraphData] = useState([]);
  const [afterPositive, setAfterPositive] = useState('sleepSoundly');
  const [afterNegative, setAfterNegative] = useState('tossingTurning');

  const [selectedMood, setSelectedMood] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  const [days, setDays] = useState(1);
  const [trialBox, setTrialBox] = useState(false);

  const navigate = useNavigate();

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleChartDetails = useCallback(
    (action) => {
      if (!editMode) {
        setSelectedTab(action);
        setGraphMoodArray([]);
        Api.getUserFeels(
          location?.state?.id ? location?.state?.id : location?.state?._id,
          action ? action : 1
        ).then((response) => {
          if (response?.data?.meta?.code === 1) {
            const sortedMoodData = Object.entries(response?.data?.meta?.sequence)
              .sort((a, b) => b[1] > a[1])
              .map((el) => el[0]);

            //SELECT MOOD DROP-DOWN ARRAY
            const graphDropDownArray = [];
            for (let i = 0; i < sortedMoodData.length - 1; i += 2) {
              const first = sortedMoodData[i];
              const second = sortedMoodData[i + 1];
              graphDropDownArray.push({
                name: `${first} - ${second}`,
                value: [first, second]
              });
            }
            setGraphMoodArray(graphDropDownArray);

            if (!selectedMood) {
              setSelectedMood(graphDropDownArray[0]);
            }

            setGraphData(response.data.data);
            setLoader(false);
          } else if (response?.code === 401) {
            setLoader(false);
            errorToast(response?.message);
          } else if (response?.data?.meta?.code === 0) {
            setGraphData([]);
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        });
      }
    },
    [editMode, location?.state?.id, location?.state?._id, selectedMood]
  );
  useEffect(() => {
    handleChartDetails(1);
  }, [selectedMood, handleChartDetails]);

  const handleProfessionalChartDetails = useCallback(
    (action) => {
      if (!editMode) {
        setSelectedProfessionalTab(action);
        setGraphProfessionalMoodArray([]);

        Api.getUserProfessonalFeels(
          location?.state?.id ? location?.state?.id : location?.state?._id,
          action ? action : 1
        ).then((response) => {
          if (response?.data?.meta?.code === 1) {
            const sortedMoodData = Object.entries(response?.data?.meta?.sequence)
              .sort((a, b) => b[1] > a[1])
              .map((el) => el[0]);

            //SELECT MOOD DROP-DOWN ARRAY
            const graphDropDownArray = [];
            for (let i = 0; i < sortedMoodData.length - 1; i += 2) {
              const first = sortedMoodData[i];
              const second = sortedMoodData[i + 1];
              graphDropDownArray.push({
                name: `${first} - ${second}`,
                value: [first, second]
              });
            }
            setGraphProfessionalMoodArray(graphDropDownArray);

            if (!selectedProfessionalMood) {
              setSelectedProfessionalMood(graphDropDownArray[0]);
            }

            setProfessionalGraphData(response.data.data);
            setLoader(false);
          } else if (response?.code === 401) {
            setLoader(false);
            errorToast(response?.message);
          } else if (response?.data?.meta?.code === 0) {
            setProfessionalGraphData([]);
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        });
      }
    },
    [editMode, location?.state?.id, location?.state?._id, selectedProfessionalMood]
  );
  useEffect(() => {
    handleProfessionalChartDetails(1);
  }, [selectedProfessionalMood, handleProfessionalChartDetails]);

  const handleBeforeChartDetails = useCallback(
    (action) => {
      if (!editMode) {
        setSelectedBeforeSleepTab(action);
        setGraphBeforeSleepArray([]);

        Api.getUserBeforeSleepFeels(
          location?.state?.id ? location?.state?.id : location?.state?._id,
          action ? action : 1
        ).then((response) => {
          if (response?.data?.meta?.code === 1) {
            const sortedMoodData = Object.entries(response?.data?.meta?.sequence)
              .sort((a, b) => b[1] > a[1])
              .map((el) => el[0]);

            //SELECT MOOD DROP-DOWN ARRAY
            const graphDropDownArray = [];
            for (let i = 0; i < sortedMoodData.length - 1; i += 2) {
              const first = sortedMoodData[i];
              const second = sortedMoodData[i + 1];
              graphDropDownArray.push({
                name: `${first} - ${second}`,
                value: [first, second]
              });
            }
            setGraphBeforeSleepArray(graphDropDownArray);

            if (!selectedBeforeSleep) {
              setSelectedBeforeSleep(graphDropDownArray[0]);
            }

            setBeforeGraphData(response.data.data);
            setLoader(false);
          } else if (response?.code === 401) {
            setLoader(false);
            errorToast(response?.message);
          } else if (response?.data?.meta?.code === 0) {
            setBeforeGraphData([]);
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        });
      }
    },
    [editMode, location?.state?.id, location?.state?._id, selectedBeforeSleep]
  );

  useEffect(() => {
    handleBeforeChartDetails(1);
  }, [selectedBeforeSleep, handleBeforeChartDetails]);

  const handleAfterChartDetails = useCallback(
    (action) => {
      if (!editMode) {
        setSelectedAfterSleepTab(action);
        setGraphAfterSleepArray([]);

        Api.getUserAfterSleepFeels(
          location?.state?.id ? location?.state?.id : location?.state?._id,
          action ? action : 1
        ).then((response) => {
          if (response?.data?.meta?.code === 1) {
            const sortedMoodData = Object.entries(response?.data?.meta?.sequence)
              .sort((a, b) => b[1] > a[1])
              .map((el) => el[0]);

            //SELECT MOOD DROP-DOWN ARRAY
            const graphDropDownArray = [];
            for (let i = 0; i < sortedMoodData.length - 1; i += 2) {
              const first = sortedMoodData[i];
              const second = sortedMoodData[i + 1];
              graphDropDownArray.push({
                name: `${first} - ${second}`,
                value: [first, second]
              });
            }
            setGraphAfterSleepArray(graphDropDownArray);

            if (!selectedAfterSleep) {
              setSelectedAfterSleep(graphDropDownArray[0]);
            }

            setAfterGraphData(response.data.data);
            setLoader(false);
          } else if (response?.code === 401) {
            setLoader(false);
            errorToast(response?.message);
          } else if (response?.data?.meta?.code === 0) {
            setAfterGraphData([]);
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        });
      }
    },
    [editMode, location?.state?.id, location?.state?._id, selectedAfterSleep]
  );
  useEffect(() => {
    handleAfterChartDetails(1);
  }, [selectedAfterSleep, handleAfterChartDetails]);

  useEffect(() => {
    if (location?.state?.action === 'view') {
      setPages([
        {
          name: 'Users',
          href: `${!isSuperAdminUser ? `/${userData?.slug}/users` : '/users'}`,
          current: true
        },
        { name: 'View User Details', href: pathname, current: true, nonClickable: false }
      ]);
    }
    Api.getUserDetail(location?.state?.id ? location?.state?.id : location?.state?._id).then(
      (response) => {
        // setLoader(false);
        setPreview(response?.data?.data.userProfile);
        setForm({
          email: response.data.data.userEmail,
          name: response.data.data.userName,
          status: response.data.data.accountStatus,
          dob: response.data.data.dob,
          id: response.data.data?.id || response.data.data?._id,
          loginPlatform: response.data.data.loginPlatform,
          type: response.data.data.accountType,
          company: location?.state?.company_id?._id,
          accountType: location?.state?.accountType,
          addedBy: response.data.data.user_added_by
        });
        setUserDetails(response.data.data);
        setGender(response.data.data.gender);
      }
    );
  }, [location?.state, isSuperAdminUser, userData?.slug, pathname]);

  useEffect(() => {
    if (pathname === '/users/edit') {
      setEditMode(true);
    }
  }, [pathname]);

  const getCompanyList = () => {
    setCompanyLoader(true);
    Api.getCompanyList('company_name', 1)
      .then((res) => {
        if (res.data?.meta?.code === 1) {
          res?.data?.data?.unshift({ company_name: 'B2C User', _id: '' });
          setCompanyList(res.data?.data);
          setCompanyLoader(false);
        } else {
          setCompanyLoader(false);
        }
      })
      .catch(() => {
        setCompanyLoader(false);
      });
  };

  const handleSubmit = () => {
    let payload = {
      ...form,
      id: location?.state?.id
    };
    setLoader(true);
    let { errors, isValid } = EditUserValidation(payload);

    if (isValid) {
      Api.AddUser(payload).then((response) => {
        if (response?.data?.meta?.code === 1) {
          successToast(response?.data?.meta?.message);
          navigate(-1);
          setLoader(false);
        } else if (response?.code === 401) {
          setLoader(false);
          errorToast(response?.message);
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      });
    } else {
      errorToast(errors.name);
      setLoader(false);
    }
  };

  const handleCancelSubs = () => {
    let payload = {
      id: userDetails.id
    };
    Api.cancelSubscriptionUser(payload)
      .then(() => {
        successToast('User subscription renewal status updated successfully');
        setEditMode(false);
        Api.getUserDetail(location?.state.id ? location?.state.id : location?.state._id).then(
          (response) => {
            setLoader(false);
            setUserDetails(response.data.data);
          }
        );
        // navigate(-1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTrialDays = () => {
    let payload = {
      id: userDetails.id,
      days: days
    };
    Api.addTrialDays(payload)
      .then((res) => {
        if (res.data.meta.code === 1) {
          successToast('Trial added to user account successfully!');
          setEditMode(false);
          Api.getUserDetail(location?.state.id ? location?.state.id : location?.state._id).then(
            (response) => {
              setLoader(false);
              setUserDetails(response.data.data);
              setTrialBox(false);
            }
          );
        } else {
          errorToast(res.data.meta.message);
          setTrialBox(false);
        }
        // navigate(-1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSendPassword = () => {
    let payload = {
      id: userDetails.id || userDetails._id
    };
    Api.resentCredUsers(payload)
      .then((res) => {
        if (res.data.meta.code === 1) {
          successToast('Email Sent Successfully!');
          setEditMode(false);
        } else {
          errorToast('Something went wrong!');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCompanyList();
  }, []);

  const classNames = (...classes) => {
    return classes?.filter(Boolean).join(' ');
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        {editMode ? (
          <title>Edit User | Shoorah Admin</title>
        ) : (
          <title>View User | Shoorah Admin</title>
        )}
      </Helmet>
      {companyLoader && <Loader />}
      {loader && <Loader />}
      <Breadcrumb pageList={pages} />
      {trialBox && (
        <div className="fixed inset-0 w-screen z-40 h-screen bg-black/25 flex justify-center items-center">
          <div className="bg-white dark:bg-shoorah-darkBgColor dark:border-none dark:text-white w-[95vw]  lg:w-[40vw]  border pt-0 border-[#F1F2F4] rounded-2xl overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-shoorah-primary to-shoorah-secondary py-2 px-4 text-white flex items-center justify-between">
              <h4 className="font-semibold text-base">Add Trial Days </h4>

              <span
                onClick={() => {
                  setTrialBox(false);
                  setDays(1);
                }}
                className="font-semibold text-lg cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </span>
            </div>

            <div>
              <div className="text-sm text-gray-500 dark:text-white"> </div>

              <div className="flex justify-center mt-3">
                <div className="self-center">
                  <button
                    type="button"
                    className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                    onClick={() => {
                      if (days > 1) {
                        setDays(days - 1);
                      }
                    }}
                  >
                    {' '}
                    -
                  </button>
                </div>
                <div className="flex justify-center items-center mx-4 dark:bg-shoorah-darkBgColor dark:text-white bg-white rounded-3xl w-[80px] h-[37px] text-shoorah-secondary">
                  <p className="m-0">{days}</p>
                </div>
                <div className="self-center">
                  <button
                    type="button"
                    className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                    onClick={() => {
                      if (days >= 1) {
                        setDays(days + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-center my-4">
                <button
                  onClick={handleTrialDays}
                  className="border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary rounded-3xl py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 px-3">
        {isSuperAdminUser && (
          <nav className="flex md:flex-row flex-col md:text-left text-center" aria-label="Tabs">
            {[
              { name: 'user profile', value: 1 },
              { name: 'user data', value: 2 },
              { name: 'user wellbeing', value: 3 }
            ].map((tab) => (
              <div
                key={tab.name}
                onClick={() => setUserTab(tab.value)}
                className={classNames(
                  userTab === tab.value
                    ? 'border-shoorah-secondary dark:bg-shoorah-darkBgTabColor dark:text-white bg-indigo-100 text-shoorah-secondary'
                    : 'border-transparent bg-indigo-50 dark:bg-shoorah-darkBgColor dark:text-white text-indigo-400 hover:text-shoorah-secondary hover:border-gray-300',
                  'whitespace-nowrap cursor-pointer py-2 px-6  dark:border-shoorah-darkBgColor border-b-2 font-medium text-sm mb-3 uppercase'
                )}
              >
                <div className="px-4">{tab.name}</div>
              </div>
            ))}
          </nav>
        )}
        {loader ? (
          <Loader />
        ) : (
          <div className="mx-3">
            {form.id ? (
              <div className="px-5 py-6 rounded-t-[10px] dark:bg-shoorah-darkBgTabColor dark:text-white bg-white gap-4">
                {userTab === 1 ? (
                  <>
                    <div
                      className={`grid grid-cols-1 gap-8 ${
                        isSuperAdminUser ? 'xl:grid-cols-2' : 'xl:grid-cols-5'
                      }`}
                    >
                      {/* Profile Section */}
                      <div
                        className={`flex col-span-1 flex-col xs:flex-col md:flex-row xl:flex-col ${
                          isSuperAdminUser ? 'xl:col-span-1' : 'xl:col-span-2'
                        } gap-8`}
                      >
                        <div className="lg:mr-6 lg:mb-0 mb-4">
                          <input
                            className="hidden"
                            ref={imageRef}
                            type="file"
                            accept=".jpg, .jpeg, .png"
                          />
                          <div className="flex flex-col justify-center items-center gap-4">
                            <div className="relative m-auto w-[150px] rounded-[50%]">
                              <LazyLoadImageProp
                                imageSrc={preview ? preview : ProfilePic}
                                className={
                                  'border border-gray-300 dark:border-shoorah-darkBgColor w-[150px] h-[150px] rounded-[50%] m-auto'
                                }
                              />
                              <div className="flex justify-center mt-4">
                                <p
                                  className={`${
                                    form.type === 0
                                      ? 'bg-slate-100 text-green-700'
                                      : form.type === 1
                                      ? 'bg-orange-100 text-orange-700'
                                      : form.type === 2
                                      ? 'bg-green-100 text-green-700'
                                      : form.type === 3
                                      ? 'bg-red-100 text-red-700'
                                      : ''
                                  } rounded-full px-3 py-[3px] text-md leading-5 capitalize font-semibold tracking-normal`}
                                >
                                  {form.type === 0
                                    ? 'Trial'
                                    : form.type === 1
                                    ? 'Free'
                                    : form.type === 2
                                    ? 'Paid'
                                    : form.type === 3
                                    ? 'Expired'
                                    : '━━'}
                                </p>
                              </div>
                            </div>
                            {editMode && isSuperAdmin() && (
                              <div className="ml-3 mx-auto w-full">
                                {userDetails?.autoRenew && userDetails?.purchaseDeviceFrom === 3 && (
                                  <button
                                    onClick={handleCancelSubs}
                                    className="border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary rounded-3xl py-2 sm:py-3 px-10 text-lg font-medium text-white shadow-sm hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2"
                                  >
                                    cancel renewal
                                  </button>
                                )}
                              </div>
                            )}
                            {!editMode && (
                              <button
                                onClick={handleSendPassword}
                                className="w-full rounded-3xl dark:border-white dark:text-white hover:bg-shoorah-primary hover:text-white mx-5 border border-shoorah-primary bg-gradient-to-r py-2 sm:py-3 px-10 text-sm font-medium shadow-sm focus:outline-none  text-shoorah-primary "
                              >
                                Resend Credientials
                              </button>
                            )}
                            {!editMode && isSuperAdmin() && (
                              <button
                                onClick={() => setTrialBox(true)}
                                className="rounded-3xl w-full dark:border-white dark:text-white hover:bg-shoorah-primary hover:text-white mx-5 border border-shoorah-primary bg-gradient-to-r py-2 sm:py-3 px-10 text-sm font-medium shadow-sm focus:outline-none  text-shoorah-primary "
                              >
                                Add Trial Days
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-3 m-auto lg:m-0 w-full">
                          <div className="dark:bg-shoorah-darkBgTabColor dark:text-white bg-white shadow">
                            <div className="border-t relative border-gray-200 px-4 py-5 sm:p-0">
                              {!editMode && isSuperAdmin() && (
                                <span
                                  onClick={() => setEditMode(!editMode)}
                                  className="absolute right-[10px] top-[0.5rem] opacity-[0.6] cursor-pointer"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    className="bi bi-pencil h-[14px] w-[14px] lg:w-[24px] lg:h-[24px]"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                  </svg>
                                </span>
                              )}

                              <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:grid sm:grid-cols-3 w-full sm:gap-4 sm:py-5 sm:px-6 items-center">
                                  <dt className="text-base font-medium text-gray-500">Full name</dt>
                                  {editMode ? (
                                    <div className="flex flex-col gap-1 w-full md:w-fit pr-4  bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                                      <input
                                        placeholder="Enter full name"
                                        name="name"
                                        onChange={handleAddUserChange}
                                        defaultValue={form.name}
                                        className="px-3 py-2 bg-transparent P22Mackinac placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none outline-none rounded-md h-10 "
                                      />
                                    </div>
                                  ) : (
                                    <dd className="mt-1 text-base dark:text-white text-gray-900 sm:col-span-2 sm:mt-0 capitalize">
                                      {form.name}
                                    </dd>
                                  )}
                                </div>

                                {editMode ? (
                                  <div className="py-4 sm:grid sm:grid-cols-3 w-full sm:gap-4 sm:py-5 sm:px-6 items-center">
                                    <label
                                      htmlFor="company"
                                      className="text-base font-medium text-gray-500"
                                    >
                                      Company
                                    </label>
                                    <div className="max-w-[30rem] pr-4 overflow-hidden bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                                      <select
                                        className=" px-3 py-2 bg-transparent P22Mackinac placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none outline-none rounded-md h-10 w-30rem capitalize"
                                        onChange={handleAddUserChange}
                                        value={form?.company}
                                        id="company"
                                        name="company"
                                      >
                                        <option value={''} disabled>
                                          Company
                                        </option>
                                        {companyList?.map((e) => (
                                          <option key={e._id} value={e._id}>
                                            {e?.company_name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="py-4 sm:grid sm:grid-cols-3 w-full sm:gap-4 sm:py-5 sm:px-6 items-center">
                                    <label
                                      htmlFor="company"
                                      className="text-base font-medium text-gray-500"
                                    >
                                      Company
                                    </label>
                                    <div className="w-auto pr-4 bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                                      <select
                                        className="w-auto px-3 py-2 bg-transparent placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none outline-none rounded-md h-10  capitalize"
                                        disabled
                                        value={form?.company}
                                        id="company"
                                        name="company"
                                      >
                                        <option value={''} disabled>
                                          Company
                                        </option>
                                        {companyList?.map((e) => (
                                          <option key={e._id} value={e._id}>
                                            {e?.company_name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                )}

                                {editMode && (
                                  <div className="py-4 sm:grid sm:grid-cols-3 w-full sm:gap-4 sm:py-5 sm:px-6 items-center">
                                    <label
                                      className="text-base font-medium text-gray-500"
                                      htmlFor="accountType"
                                    >
                                      Account Type
                                    </label>
                                    <div className="flex">
                                      <input
                                        type="radio"
                                        onChange={handleAddUserChange}
                                        name="accountType"
                                        defaultChecked={form?.accountType === 2 ? true : false}
                                        value="2"
                                        id="free"
                                        className="P22Mackinac outline-none"
                                      />
                                      <label
                                        htmlFor="free"
                                        className=" w-full capitalize outline-none text-base sm:text-md  placeholder-gray-400 P22Mackinac px-3 py-2  text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none border-[#F1F2F4] rounded-[3rem] h-10 px-4 capitalize"
                                      >
                                        Free
                                      </label>
                                      <input
                                        type="radio"
                                        onChange={handleAddUserChange}
                                        defaultChecked={form?.accountType === 1 ? true : false}
                                        name="accountType"
                                        value="1"
                                        id="paid"
                                      />
                                      <label
                                        htmlFor="paid"
                                        className=" w-full capitalize outline-none text-base sm:text-md  placeholder-gray-400 P22Mackinac px-3 py-2  text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none border-[#F1F2F4] rounded-[3rem] h-10 px-4 capitalize"
                                      >
                                        Basic
                                      </label>
                                    </div>
                                  </div>
                                )}

                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 items-center">
                                  <dt className="text-base font-medium text-gray-500">
                                    Email / Mobile
                                  </dt>
                                  <dd className="mt-1 text-base dark:text-white text-gray-900 sm:col-span-2 sm:mt-0 lowercase">
                                    {form.email}
                                  </dd>
                                </div>
                                {gender?.length > 0 ? (
                                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 items-center">
                                    <dt className="text-base font-medium text-gray-500">Gender</dt>
                                    <dd className="mt-1 text-base dark:text-white text-gray-900 sm:col-span-2 sm:mt-0">
                                      <div className="flex">
                                        {gender?.map((value, key) => (
                                          <div key={key} className="mr-3">
                                            {value === 0 ? (
                                              'Not Preferred'
                                            ) : (
                                              <>
                                                <img
                                                  loading='lazy'
                                                  id={value}
                                                  className="w-[24px] dark:invert"
                                                  src={getGender(value, true)}
                                                  alt="gender"
                                                />
                                                <ReactTooltip
                                                  anchorId={value}
                                                  place="left"
                                                  content={getGender(value)}
                                                  className="bg-shoorah-secondary"
                                                />
                                              </>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </dd>
                                  </div>
                                ) : null}
                                {form?.dob ? (
                                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 items-center">
                                    <dt className="text-base font-medium text-gray-500">
                                      Date of birth
                                    </dt>
                                    <dd className="mt-1 text-base dark:text-white text-gray-900 sm:col-span-2 sm:mt-0">
                                      {form.dob}
                                    </dd>
                                  </div>
                                ) : null}

                                {!editMode && (
                                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 items-center">
                                    <dt className="text-base font-medium text-gray-500 mb-3 lg:mb-0">
                                      Status
                                    </dt>
                                    <dd className="mt-1 text-base dark:text-white text-gray-900 sm:col-span-2 sm:mt-0">
                                      <div
                                        className={`${
                                          form.status
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        } inline rounded-full px-3 py-[8px] text-md leading-5 capitalize font-semibold tracking-normal`}
                                      >
                                        {form.status ? 'Active' : 'Inactive'}
                                      </div>
                                    </dd>
                                  </div>
                                )}

                                {!editMode && (
                                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 items-center">
                                    <dt className="text-base font-medium text-gray-500">
                                      Login Platform
                                    </dt>
                                    <dd className="mt-1 text-sm dark:text-white text-gray-900 sm:col-span-2 sm:mt-0">
                                      <img
                                        loading='lazy'
                                        src={
                                          form.loginPlatform === 0 ||
                                          !form.loginPlatform ||
                                          form.loginPlatform === null
                                            ? mailIcon
                                            : form.loginPlatform === 1
                                            ? appleIcon
                                            : form.loginPlatform === 2
                                            ? googleIcon
                                            : fbIcon
                                        }
                                        alt=""
                                        className="h-8 w-8 dark:invert"
                                        id="loginPlatform"
                                      />
                                      <ReactTooltip
                                        anchorId="loginPlatform"
                                        place="right"
                                        className="bg-shoorah-secondary"
                                      >
                                        {form.loginPlatform === 0 ||
                                        !form.loginPlatform ||
                                        form.loginPlatform === null
                                          ? 'Shoorah'
                                          : form.loginPlatform === 1
                                          ? 'Apple'
                                          : form.loginPlatform === 2
                                          ? 'Google'
                                          : 'Facebook'}
                                      </ReactTooltip>
                                    </dd>
                                  </div>
                                )}
                                {form.addedBy && (
                                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6 items-center">
                                    <dt className="text-base font-medium text-gray-500">
                                      Added By :
                                    </dt>
                                    <dd className="mt-1 text-sm dark:text-white text-gray-900 sm:col-span-2 sm:mt-0">
                                      Super Admin
                                    </dd>
                                  </div>
                                )}
                              </dl>
                            </div>
                          </div>
                          <div className="text-right flex md:justify-end  mt-12">
                            {editMode && (
                              <>
                                <button
                                  className="rounded-3xl mx-2 md:mx-5 border border-shoorah-primary bg-gradient-to-r py-2 sm:py-3 px-10 text-sm font-medium shadow-sm focus:outline-none  text-shoorah-primary "
                                  onClick={() => setEditMode(false)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className={`border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary rounded-3xl py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2`}
                                  onClick={() => handleSubmit()}
                                >
                                  Save
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Emotions Statistics */}
                      <EmotionsStatistics
                        userId={location?.state?.id ? location?.state?.id : location?.state?._id}
                        className={`col-span-1 ${
                          isSuperAdminUser ? 'xl:col-span-1' : 'xl:col-span-3'
                        }`}
                      />
                    </div>

                    {/* Personal Moods Chart */}
                    {isSuperAdmin() && (
                      <div className="dark:bg-inherit bg-white rounded-b-[10px] w-full mt-10">
                        <div className="sm:flex justify-between">
                          <div className="text-xl dark:text-white text-gray-700 self-center">
                            <p>User Feels - Personal Moods</p>
                          </div>
                          <div className="sm:mt-0 mt-3">
                            <div className=" dark:border-shoorah-darkBgColor border-b border-gray-200">
                              <nav className="-mb-px grid grid-cols-4 lg:flex" aria-label="Tabs">
                                {USER_FEELS.map((tab) => (
                                  <div
                                    key={tab.name}
                                    onClick={() => handleChartDetails(tab.value)}
                                    className={classNames(
                                      selectedTab === tab.value
                                        ? 'border-shoorah-secondary bg-indigo-100 text-shoorah-secondary'
                                        : 'border-transparent bg-indigo-50 text-indigo-400 hover:text-shoorah-secondary hover:border-gray-300',
                                      'whitespace-nowrap cursor-pointer py-2 px-6  dark:border-shoorah-darkBgColor border-b-2 font-medium text-sm'
                                    )}
                                  >
                                    {tab.name}
                                  </div>
                                ))}
                              </nav>
                            </div>
                          </div>
                        </div>
                        <div className="sm:flex justify-between m-2">
                          <div className="sm:mt-0 mt-3 w-full lg:w-[450px] flex items-center mr-3">
                            <SelectMenu
                              menuList={graphMoodArray}
                              defaultSelected={selectedMood}
                              label="Select Mood:"
                              isRequired={false}
                              setSelectedMenu={(data) => {
                                setSelectedMood(data);
                                setNegative(data.value[0]);
                                setPositive(data.value[1]);
                              }}
                              customClassFlag={1}
                            />
                          </div>
                        </div>
                        <div className="h-[350px] mt-5">
                          {graphData?.length > 0 ? (
                            // <ResponsiveLine
                            // data={graphData}
                            // margin={{
                            //   top: 20,
                            //   right: 20,
                            //   bottom: 100,
                            //   left: 40,
                            // }}
                            // xScale={{ type: "point" }}
                            // theme={{
                            //   fontSize: 12,
                            // }}
                            // yScale={{
                            //   type: "linear",
                            //   min: "0",
                            //   max: "5",
                            //   stacked: false,
                            //   reverse: false,
                            // }}
                            // yFormat=" >-.2f"
                            // axisTop={null}
                            // axisRight={null}
                            // axisBottom={{
                            //   orient: "bottom",
                            //   tickSize: 5,
                            //   tickPadding: 5,
                            //   tickRotation: 0,
                            //   legend: "",
                            //   legendOffset: 36,
                            //   legendPosition: "middle",
                            // }}
                            // axisLeft={{
                            //   orient: "left",
                            //   tickValues: [0, 1, 2, 3, 4, 5],
                            //   tickSize: 5,
                            //   tickPadding: 5,
                            //   tickRotation: 0,
                            //   legend: "",
                            //   legendOffset: -40,
                            //   legendPosition: "middle",
                            // }}
                            // lineWidth={2}
                            // pointSize={9}
                            // pointColor={{ theme: "background" }}
                            // pointBorderWidth={1}
                            // pointBorderColor={{
                            //   from: "serieColor",
                            //   modifiers: [],
                            // }}
                            // pointLabelYOffset={-12}
                            // enableSlices="x"
                            // useMesh={true}
                            // legends={[
                            //   {
                            //     anchor: "bottom",
                            //     direction: "row",
                            //     justify: false,
                            //     translateX: 23,
                            //     translateY: 83,
                            //     itemWidth: 85,
                            //     itemHeight: 22,
                            //     itemsSpacing: 12,
                            //     symbolSize: 12,
                            //     symbolShape: "square",
                            //     itemDirection: "left-to-right",
                            //     itemTextColor: "#777",
                            //     effects: [
                            //       {
                            //         on: "hover",
                            //         style: {
                            //           itemBackground: "rgba(0, 0, 0, .03)",
                            //           itemOpacity: 1,
                            //         },
                            //       },
                            //     ],
                            //   },
                            // ]}
                            // animate={false}
                            // COMMENTED FOR IN FUTURE USE
                            // motionConfig={{
                            //   mass: 115,
                            //   tension: 98,
                            //   friction: 103,
                            //   clamp: false,
                            //   precision: 0.01,
                            //   velocity: 0,
                            // }}
                            // />

                            <GraphContainer data={graphData} twoKey={negative} oneKey={positive} />
                          ) : (
                            <div className="m-5 text-center w-full">
                              <div className="flex justify-center w-full">
                                <img loading='lazy' src={emptyImage} alt="" className="w-[280px] h-auto" />
                              </div>
                              <p className="text-center mt-4"> No data</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Professonal Moods Chart */}
                    {isSuperAdmin() && (
                      <div className="dark:bg-inherit bg-white rounded-b-[10px] w-full mt-10">
                        <div className="sm:flex  justify-between">
                          <div className="text-xl dark:text-white text-gray-700 self-center">
                            <p>User Feels - Professional Moods</p>
                          </div>
                          <div className="sm:mt-0 mt-3">
                            <div className=" dark:border-shoorah-darkBgColor border-b border-gray-200">
                              <nav className="-mb-px grid grid-cols-4 lg:flex" aria-label="Tabs">
                                {USER_FEELS.map((tab) => (
                                  <div
                                    key={tab.name}
                                    onClick={() => handleProfessionalChartDetails(tab.value)}
                                    className={classNames(
                                      selectedProfessionalTab === tab.value
                                        ? 'border-shoorah-secondary bg-indigo-100 text-shoorah-secondary'
                                        : 'border-transparent bg-indigo-50 text-indigo-400 hover:text-shoorah-secondary hover:border-gray-300',
                                      'whitespace-nowrap cursor-pointer py-2 px-6  dark:border-shoorah-darkBgColor border-b-2 font-medium text-sm'
                                    )}
                                  >
                                    {tab.name}
                                  </div>
                                ))}
                              </nav>
                            </div>
                          </div>
                        </div>
                        <div className="sm:flex  justify-between m-2">
                          <div className="sm:mt-0 mt-3 w-full lg:w-[450px] flex items-center mr-3">
                            <SelectMenu
                              menuList={graphProfessionalMoodArray}
                              defaultSelected={selectedProfessionalMood}
                              label="Select Professional Mood:"
                              isRequired={false}
                              setSelectedMenu={(data) => {
                                setSelectedProfessionalMood(data);
                                setProfessionalNegative(data.value[0]);
                                setProfessionalPositive(data.value[1]);
                              }}
                              customClassFlag={1}
                              column={1}
                            />
                          </div>
                        </div>
                        <div className="h-[350px] mt-5">
                          {professionalGraphData?.length > 0 ? (
                            <GraphContainer
                              data={professionalGraphData}
                              twoKey={professionalNegative}
                              oneKey={professionalPositive}
                            />
                          ) : (
                            <div className="m-5 text-center w-full">
                              <div className="flex justify-center w-full">
                                <img loading='lazy' src={emptyImage} alt="" className="w-[280px] h-auto" />
                              </div>
                              <p className="text-center mt-4"> No data</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Before Sleep Chart */}
                    {isSuperAdmin() && (
                      <div className="dark:bg-inherit bg-white rounded-b-[10px] w-full mt-10">
                        <div className="sm:flex  justify-between">
                          <div className="text-xl dark:text-white text-gray-700 self-center">
                            <p>User Feels - Before Sleep Logs</p>
                          </div>
                          <div className="sm:mt-0 mt-3">
                            <div className=" dark:border-shoorah-darkBgColor border-b border-gray-200">
                              <nav className="-mb-px grid grid-cols-4 lg:flex" aria-label="Tabs">
                                {USER_FEELS.map((tab) => (
                                  <div
                                    key={tab.name}
                                    onClick={() => handleBeforeChartDetails(tab.value)}
                                    className={classNames(
                                      selectedBeforeSleepTab === tab.value
                                        ? 'border-shoorah-secondary bg-indigo-100 text-shoorah-secondary'
                                        : 'border-transparent bg-indigo-50 text-indigo-400 hover:text-shoorah-secondary hover:border-gray-300',
                                      'whitespace-nowrap cursor-pointer py-2 px-6  dark:border-shoorah-darkBgColor border-b-2 font-medium text-sm'
                                    )}
                                  >
                                    {tab.name}
                                  </div>
                                ))}
                              </nav>
                            </div>
                          </div>
                        </div>
                        <div className="sm:flex  justify-between m-2">
                          <div className="sm:mt-0 mt-3 w-full lg:w-[450px] flex items-center mr-3">
                            <SelectMenu
                              menuList={graphBeforeSleepArray}
                              defaultSelected={selectedBeforeSleep}
                              label="Select Before Sleep:"
                              isRequired={false}
                              setSelectedMenu={(data) => {
                                setSelectedBeforeSleep(data);
                                setBeforeNegative(data.value[0]);
                                setBeforePositive(data.value[1]);
                              }}
                              customClassFlag={1}
                              column={1}
                            />
                          </div>
                        </div>
                        <div className="h-[350px] mt-5">
                          {beforeGraphData?.length > 0 ? (
                            <GraphContainer
                              data={beforeGraphData}
                              twoKey={beforeNegative}
                              oneKey={beforePositive}
                            />
                          ) : (
                            <div className="m-5 text-center w-full">
                              <div className="flex justify-center w-full">
                                <img loading='lazy' src={emptyImage} alt="" className="w-[280px] h-auto" />
                              </div>
                              <p className="text-center mt-4"> No data</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* After Sleep Chart */}
                    {isSuperAdmin() && (
                      <div className="dark:bg-inherit bg-white rounded-b-[10px] w-full mt-10">
                        <div className="sm:flex  justify-between">
                          <div className="text-xl dark:text-white text-gray-700 self-center">
                            <p>User Feels - During Sleep Logs</p>
                          </div>
                          <div className="sm:mt-0 mt-3">
                            <div className=" dark:border-shoorah-darkBgColor border-b border-gray-200">
                              <nav className="-mb-px grid grid-cols-4 lg:flex" aria-label="Tabs">
                                {USER_FEELS.map((tab) => (
                                  <div
                                    key={tab.name}
                                    onClick={() => handleAfterChartDetails(tab.value)}
                                    className={classNames(
                                      selectedAfterSleepTab === tab.value
                                        ? 'border-shoorah-secondary bg-indigo-100 text-shoorah-secondary'
                                        : 'border-transparent bg-indigo-50 text-indigo-400 hover:text-shoorah-secondary hover:border-gray-300',
                                      'whitespace-nowrap cursor-pointer py-2 px-6  dark:border-shoorah-darkBgColor border-b-2 font-medium text-sm'
                                    )}
                                  >
                                    {tab.name}
                                  </div>
                                ))}
                              </nav>
                            </div>
                          </div>
                        </div>
                        <div className="sm:flex  justify-between m-2">
                          <div className="sm:mt-0 mt-3 w-full lg:w-[450px] flex items-center mr-3">
                            <SelectMenu
                              menuList={graphAfterSleepArray}
                              defaultSelected={selectedAfterSleep}
                              label="Select During Sleep:"
                              isRequired={false}
                              setSelectedMenu={(data) => {
                                setSelectedAfterSleep(data);
                                setAfterNegative(data.value[0]);
                                setAfterPositive(data.value[1]);
                              }}
                              customClassFlag={1}
                              column={1}
                            />
                          </div>
                        </div>
                        <div className="h-[350px] mt-5">
                          {afterGraphData?.length > 0 ? (
                            <GraphContainer
                              data={afterGraphData}
                              twoKey={afterNegative}
                              oneKey={afterPositive}
                            />
                          ) : (
                            <div className="m-5 text-center w-full">
                              <div className="flex justify-center w-full">
                                <img loading='lazy' src={emptyImage} alt="" className="w-[280px] h-auto" />
                              </div>
                              <p className="text-center mt-4"> No data</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : userTab === 2 ? (
                  <>
                    <div className="dark:bg-shoorah-darkBgTabColor dark:text-white bg-white rounded-b-[10px]">
                      <div className="mt-3 overflow-auto">
                        <div className=" dark:border-shoorah-darkBgColor border-b border-gray-200 w-full">
                          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {PERFORMANCE_CONTENT_TYPE.map((tab) => (
                              <div
                                key={tab.name}
                                onClick={() => setSelectedContentType(tab.value)}
                                className={classNames(
                                  selectedContentType === tab.value
                                    ? 'border-shoorah-secondary dark:text-white text-shoorah-secondary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                  'whitespace-nowrap cursor-pointer py-2 px-1 dark:border-shoorah-darkBgColor border-b-2 font-medium text-sm'
                                )}
                              >
                                {tab.name}
                              </div>
                            ))}
                          </nav>
                        </div>
                      </div>
                      <div>
                        <PerformanceData
                          contentType={selectedContentType}
                          userId={location?.state?.id || location?.state._id}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <Userwellbeing
                    userId={location?.state?.id ? location?.state?.id : location?.state?._id}
                  />
                )}
              </div>
            ) : (
              <div className="py-[20px] bg-white border-t border-[#EAEAEA] w-full">
                <NoDataFoundImg
                  className={`m-auto text-indigo-50 border border-shoorah-blue rounded-lg`}
                />
                <p className="text-center text-shoorah-gray4 text-sm mt-3">No results</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

ViewEditUser.propTypes = {
  location: PropTypes.any,
  match: PropTypes.any
};

export default ViewEditUser;
