import React, { useEffect, useState } from 'react';
import LineChartContainer from '../../component/Graph/LineChart';
import { USER_FEELS } from '../../utils/constants';
import { errorToast } from '../../utils/helper';
import { Api } from '../../api';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Userwellbeing = ({ userId }) => {
  const [loader, setLoader] = useState(true);
  const [selectedTab, setSelectedTab] = useState(1);
  const [positive, setPositive] = useState(true);

  const [journalPData, setJournalPData] = useState([
    {
      name: 'Page A',
      affirmation: 4,
      gratitude: 2,
      goals: 2,
      cleanse: 1,
      notes: 6,
      duration: '1 month',
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page B',
      affirmation: 9,
      gratitude: 6,
      goals: 0,
      cleanse: 3,
      duration: '2 month',
      notes: 2,
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page C',
      affirmation: 1,
      gratitude: 3,
      goals: 2,
      cleanse: 1,
      duration: '3 month',
      notes: 2,
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page D',
      affirmation: 7,
      gratitude: 5,
      goals: 1,
      cleanse: 6,
      duration: '4 month',
      notes: 0,
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page E',
      affirmation: 4,
      gratitude: 2,
      goals: 2,
      cleanse: 1,
      duration: '5 month',
      notes: 6,
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page F',
      affirmation: 10,
      gratitude: 9,
      goals: 4,
      cleanse: 6,
      duration: '6 month',
      notes: 3,
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page G',
      affirmation: 7,
      gratitude: 3,
      goals: 6,
      cleanse: 1,
      notes: 3,
      duration: '7 month',
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    }
  ]);
  const [journalNData, setJournalNData] = useState([
    {
      name: 'Page A',
      affirmation: 4,
      gratitude: 2,
      goals: 2,
      cleanse: 1,
      notes: 6,
      duration: '1 month',
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page B',
      affirmation: 9,
      gratitude: 6,
      goals: 0,
      cleanse: 3,
      duration: '2 month',
      notes: 2,
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page C',
      affirmation: 1,
      gratitude: 3,
      goals: 2,
      cleanse: 1,
      duration: '3 month',
      notes: 2,
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page D',
      affirmation: 7,
      gratitude: 5,
      goals: 1,
      cleanse: 6,
      duration: '4 month',
      notes: 0,
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page E',
      affirmation: 4,
      gratitude: 2,
      goals: 2,
      cleanse: 1,
      duration: '5 month',
      notes: 6,
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page F',
      affirmation: 10,
      gratitude: 9,
      goals: 4,
      cleanse: 6,
      duration: '6 month',
      notes: 3,
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    },
    {
      name: 'Page G',
      affirmation: 7,
      gratitude: 3,
      goals: 6,
      cleanse: 1,
      notes: 3,
      duration: '7 month',
      keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
    }
  ]);
  const [shuruData, setShuruData] = useState([
    {
      name: 'Page A',
      positive: 10,
      negative: 5,
      duration: '1 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page B',
      positive: 4,
      negative: 7,
      duration: '2 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page C',
      positive: 2,
      negative: 3,
      duration: '3 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page D',
      positive: 6,
      negative: 9,
      duration: '4 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page E',
      positive: 11,
      negative: 5,
      duration: '5 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page F',
      positive: 6,
      negative: 3,
      duration: '6 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page G',
      positive: 3,
      negative: 5,
      duration: '7 month',
      keys: ['positive', 'negative']
    }
  ]);

  const [personalEmotionData, setPersonalEmotionData] = useState([
    {
      name: 'Page A',
      positive: 10,
      negative: 5,
      duration: '1 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page B',
      positive: 4,
      negative: 7,
      duration: '2 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page C',
      positive: 2,
      negative: 3,
      duration: '3 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page D',
      positive: 6,
      negative: 9,
      duration: '4 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page E',
      positive: 11,
      negative: 5,
      duration: '5 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page F',
      positive: 6,
      negative: 3,
      duration: '6 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page G',
      positive: 3,
      negative: 5,
      duration: '7 month',
      keys: ['positive', 'negative']
    }
  ]);
  const [professionalEmotionData, setProfessionalEmotionData] = useState([
    {
      name: 'Page A',
      positive: 10,
      negative: 5,
      duration: '1 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page B',
      positive: 4,
      negative: 7,
      duration: '2 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page C',
      positive: 2,
      negative: 3,
      duration: '3 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page D',
      positive: 6,
      negative: 9,
      duration: '4 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page E',
      positive: 11,
      negative: 5,
      duration: '5 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page F',
      positive: 6,
      negative: 3,
      duration: '6 month',
      keys: ['positive', 'negative']
    },
    {
      name: 'Page G',
      positive: 3,
      negative: 5,
      duration: '7 month',
      keys: ['positive', 'negative']
    }
  ]);

  const [journalData, setJournalData] = useState(journalPData);
  const [journalReportData, setJournalReportData] = useState(null);

  const handleChartDetails = (action) => {
    setSelectedTab(action);
    getJournalData(action);
    getShuruData(action);
    getPersonalData(action);
    getProfessionalData(action);
  };

  const getJournalData = (action) => {
    Api.getUserWellJournalData(action, userId).then((response) => {
      if (response?.data?.meta?.code === 1) {
        let data = response.data.data;
        setJournalReportData(data);
        let positiveData = [];
        let negativeData = [];

        data.map((value) => {
          let objP = {
            name: 'Journal ' + value.interval,
            affirmation: value.affirmationsPositive,
            gratitude: value.gratitudePositive,
            goals: value.goalsPositive,
            cleanse: value.cleansePositive,
            notes: value.notesPositive,
            duration: value.interval,
            keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
          };
          let objN = {
            name: 'Journal ' + value.interval,
            affirmation: value.affirmationsNegative,
            gratitude: value.gratitudeNegative,
            goals: value.goalsNegative,
            cleanse: value.cleanseNegative,
            notes: value.notesNegative,
            duration: value.interval,
            keys: ['affirmation', 'gratitude', 'goals', 'cleanse', 'notes']
          };
          positiveData.push(objP);
          negativeData.push(objN);
        });
        setJournalPData(positiveData);
        setJournalNData(negativeData);
        setJournalData(positiveData);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setJournalPData([]);
        setJournalNData([]);
        setJournalData([]);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  const getShuruData = (action) => {
    Api.getUserWellShuruData(action, userId).then((response) => {
      if (response?.data?.meta?.code === 1) {
        let data = response.data.data;
        let result = [];
        data.map((value) => {
          let obj = {
            name: 'Shuru' + value.interval,
            positive: value.positive,
            negative: value.negative,
            duration: value.interval,
            keys: ['positive', 'negative']
          };

          result.push(obj);
        });
        setShuruData(result);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setShuruData([]);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  const getPersonalData = (action) => {
    Api.getUserWellPersonalData(action, userId).then((response) => {
      if (response?.data?.meta?.code === 1) {
        let data = response.data.data;
        let result = [];
        data.map((value) => {
          let obj = {
            name: 'Personal' + value.interval,
            positive: value.positive,
            negative: value.negative,
            duration: value.interval,
            keys: ['positive', 'negative']
          };

          result.push(obj);
        });
        setPersonalEmotionData(result);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setPersonalEmotionData([]);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  const getProfessionalData = (action) => {
    Api.getUserWellProfessionalData(action, userId).then((response) => {
      if (response?.data?.meta?.code === 1) {
        let data = response.data.data;
        let result = [];
        data.map((value) => {
          let obj = {
            name: 'Professional' + value.interval,
            positive: value.positive,
            negative: value.negative,
            duration: value.interval,
            keys: ['positive', 'negative']
          };

          result.push(obj);
        });
        setProfessionalEmotionData(result);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setProfessionalEmotionData([]);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  useEffect(() => {
    handleChartDetails(1);
  }, []);

  useEffect(() => {
    if (positive) {
      setJournalData(journalPData);
    } else {
      setJournalData(journalNData);
    }
  }, [positive, selectedTab]);

  const downLoadOverallwellReport = async (data) => {
    setLoader(true);
    await Api.getOverallWellReport({
      graphName: 'Overall Well Being  Report',
      shuruData,
      journalData: journalReportData,
      personalEmotionData,
      professionalEmotionData,
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

  return (
    <div>
      <div className="dark:bg-shoorah-darkBgTabColor dark:text-white bg-white rounded-[10px]">
        <p className="text-sm mb-[2rem] text-center font-[400] text-gray-400">
          This is wellbeing section where you will see the user wellbeing statistics. You can see
          user growth statistics how shoorah helped them for build them positive mindset and
          prevented negative thoughts.
          {/* <span className='text-[#3a47ab]'>info@shoorah.io</span> */}
        </p>

        {/* <div className="w-full flex justify-center items-center ">
                    <div className="rounded-3xl text-white flex gap-3 justify-between py-5 w-[8rem] items-center px-5 bg-[#888beb]">

                        <div className="rounded-3xl flex justify-center items-center bg-[#888beb]">
                            logo
                        </div>
                        <div className="rounded-3xl flex justify-center items-center  bg-[#888beb]">
                            70%
                        </div>
                    </div>

                </div> */}

        <div className="mt-3 flex flex-col  overflow-auto">
          <div className="sm:mt-0 md:px-8 mt-3">
            <div className="flex justify-between relative dark:border-shoorah-darkBgColor border-gray-200">
              <nav className="-mb-px grid grid-cols-4 lg:flex" aria-label="Tabs">
                {USER_FEELS.map((tab) => (
                  <div
                    key={tab.name}
                    onClick={() => handleChartDetails(tab.value)}
                    className={classNames(
                      selectedTab === tab.value
                        ? 'border-shoorah-secondary bg-indigo-100 text-shoorah-secondary'
                        : 'border-transparent bg-indigo-50 text-indigo-400 hover:text-shoorah-secondary hover:border-gray-300',
                      'whitespace-nowrap text-center cursor-pointer py-2 md:px-6 px-1  dark:border-shoorah-darkBgColor font-medium text-sm'
                    )}
                  >
                    {tab.name}
                  </div>
                ))}
              </nav>
              <button
                className="top-[1rem] right-[1rem] mx-1 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-3 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                onClick={downLoadOverallwellReport}
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
            </div>
          </div>

          <div className=" dark:border-shoorah-darkBgColor my-[2rem] border-gray-200 w-full">
            <p className="text-center text-2xl ">Journal wellbeing</p>
            <div className="flex mt-3 font-semibold gap-4 p-1 text-sm text-white  bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white">
              <button
                className={
                  'min-w-[80px] flex items-center justify-center ' +
                  (positive ? 'bg-[#313b6b]' : 'bg-[#B6C0F3]')
                }
                onClick={() => setPositive(true)}
              >
                Positive
              </button>
              <button
                className={
                  'min-w-[80px] flex items-center justify-center ' +
                  (positive ? 'bg-[#B6C0F3]' : 'bg-[#313b6b]')
                }
                onClick={() => setPositive(false)}
              >
                Negative
              </button>
            </div>
            <LineChartContainer data={journalData} />
          </div>
          <div className=" dark:border-shoorah-darkBgColor my-[2rem] border-gray-200 w-full">
            <p className="text-center text-2xl ">Shuru wellbeing</p>
            <LineChartContainer data={shuruData} />
          </div>
          <div className=" dark:border-shoorah-darkBgColor my-[2rem] border-gray-200 w-full">
            <p className="text-center text-2xl ">Personal Emotions wellbeing</p>
            <LineChartContainer data={personalEmotionData} />
          </div>
          <div className=" dark:border-shoorah-darkBgColor my-[2rem] border-gray-200 w-full">
            <p className="text-center text-2xl ">Professional Emotions wellbeing</p>
            <LineChartContainer data={professionalEmotionData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userwellbeing;
