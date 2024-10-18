import { DATE_FORMATS, TIME_SPAN_OPTIONS } from '../../utils/constants';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import { CompanyApi } from '../../api/companyApi';
import { Api } from '../../api';
import { errorToast, isSuperAndSubAdmin, useOutsideClick } from '../../utils/helper';
import { RadialBar, RadialBarChart, Tooltip } from 'recharts';
import RadialBarChartTooltip from '../Graph/RadialBarChartTooltip';
import Loader from '../common/Loader';

const emotionDefaultData = [
  { name: 'Depressed', fill: '#AA336A', responseKey: 'totalDepressedCount', count: 0 },
  { name: 'Overjoyed', fill: '#4F46E5', responseKey: 'totalOverjoyedCount', count: 0 },
  { name: 'Sad', fill: '#EC4E20', responseKey: 'totalSadCount', count: 0 },
  { name: 'Happy', fill: 'teal', responseKey: 'totalHappyCount', count: 0 },
  { name: 'Neutral', fill: '#B19470', responseKey: 'totalNeutralCount', count: 0 }
];
const classNames = (...classes) => {
  return classes?.filter(Boolean).join(' ');
};

const EmotionsStatistics = ({ userId, ...props }) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [graphLoader, setGraphLoader] = useState(false);
  const [emotionData, setEmotionData] = useState(emotionDefaultData);
  const [emotionDateFilter, setEmotionDateFilter] = useState(false);
  const [emotionDateRange, setEmotionDateRange] = useState([
    {
      startDate: moment().startOf('day').toDate(),
      endDate: moment().endOf('day').toDate(),
      key: 'selection'
    }
  ]);

  useEffect(() => {
    getEmotionGraphData();
  }, []);

  const emotionWrapperRef = useRef(null);

  useOutsideClick(emotionWrapperRef, () => {
    if (emotionDateFilter) {
      setEmotionDateFilter(false);
    }
  });

  const getEmotionGraphData = (
    startDate = moment(emotionDateRange[0]?.startDate)?.format(DATE_FORMATS.DATE_QUERY),
    endDate = moment(emotionDateRange[0]?.endDate)?.format(DATE_FORMATS.DATE_QUERY)
  ) => {
    setGraphLoader(true);
    const queryString = `?reportFromDate=${startDate}&reportToDate=${endDate}${
      userId ? `&userId=${userId}` : ''
    }`;
    const effectiveAPI = isSuperAndSubAdmin() ? Api : CompanyApi;
    const effectiveMethod = userId ? effectiveAPI.getUserEmotion : effectiveAPI.getAllUsersEmotions;
    effectiveMethod(queryString)
      .then((res) => {
        if (res?.data?.meta.code === 1) {
          setEmotionData(
            emotionData?.map((emotion) => ({
              ...emotion,
              count: +res.data?.data?.[emotion.responseKey] || 0
            }))
          );
        } else {
          return errorToast('Something went wrong');
        }
      })
      .catch((err) => {
        return errorToast(err);
      })
      .finally(() => setGraphLoader(false));
  };

  const onChangeEmotionTimeRange = (tabValue) => {
    setSelectedTab(tabValue);

    const startDate = moment()
      .subtract(tabValue === 1 ? 0 : tabValue === 2 ? 7 : tabValue === 3 ? 30 : 365, 'days')
      .startOf('day');

    const endDate = moment().endOf('day');

    setEmotionDateRange([
      {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        key: 'selection'
      }
    ]);
    getEmotionGraphData(
      startDate.format(DATE_FORMATS.DATE_QUERY),
      endDate.format(DATE_FORMATS.DATE_QUERY)
    );
  };

  return (
    <div
      {...props}
      className={`flex w-full h-fit flex-col rounded-2xl border border-gray-300 bg-white p-6 dark:border-none dark:bg-shoorah-darkBgTabColor ${props?.className}`}
    >
      <h4 className="relative flex w-full flex-col whitespace-nowrap text-lg font-medium">
        Emotions Statistics
        <span className="w-[100%] text-xs text-gray-400">
          Understanding of your users's emotions on webapp.
        </span>
      </h4>

      <div className="flex mt-4 justify-between relative dark:border-shoorah-darkBgColor border-gray-200">
        <nav className="lg:flex -mb-px grid grid-cols-4" aria-label="Tabs">
          {TIME_SPAN_OPTIONS.map((tab) => (
            <div
              key={tab.name}
              onClick={(e) => onChangeEmotionTimeRange(tab.value)}
              className={classNames(
                selectedTab === tab.value
                  ? 'border-shoorah-secondary bg-indigo-100 text-shoorah-secondary'
                  : 'border-transparent bg-indigo-50 text-indigo-400 hover:text-shoorah-secondary hover:border-gray-300',
                ' text-center cursor-pointer py-2 md:px-6 px-1  dark:border-shoorah-darkBgColor font-medium text-sm dark:bg-shoorah-darkBgColor'
              )}
            >
              {tab.name}
            </div>
          ))}
        </nav>
        <button
          className="hover:shoorah-primary flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm focus:outline-none sm:w-auto"
          onClick={() => {
            setEmotionDateFilter((prev) => !prev);
          }}
        >
          <CalendarIcon className="inline h-[20px] w-[18px] text-white" />
        </button>
        <Transition
          show={emotionDateFilter}
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="absolute right-[1rem] top-[1.5rem] z-20 mx-auto mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white lg:right-[2rem] lg:-top-[1rem]"
            ref={emotionWrapperRef}
          >
            <DateRangePicker
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              ranges={emotionDateRange}
              onChange={(item) => {
                setSelectedTab(0);
                setEmotionDateRange([item.selection]);
                getEmotionGraphData(
                  moment(item.selection.startDate).format(DATE_FORMATS.DATE_QUERY),
                  moment(item.selection.endDate).format(DATE_FORMATS.DATE_QUERY)
                );
              }}
              direction="horizontal"
            />
          </div>
        </Transition>
      </div>
      <div className="flex w-full justify-start text-sm text-gray-400 lg:text-base mt-4">
        {moment(emotionDateRange?.[0]?.startDate).format('MMM Do YY')} {' to '}
        {moment(emotionDateRange?.[0]?.endDate).format('MMM Do YY')}
      </div>

      <div className="relative flex flex-col items-center justify-between gap-4">
        <div className="mt-4 relative h-auto gap-8 justify-between items-center grid grid-cols-2">
          {graphLoader ? (
            <span
              className={
                'absolute bg-white dark:bg-shoorah-darkBgTabColor dark:text-white w-full h-full flex items-center justify-center z-10'
              }
            >
              <Loader compact />
            </span>
          ) : null}
          <div className="flex grow w-full h-full justify-center items-center mb-4 lg:mb-0">
            <RadialBarChart
              data={emotionData}
              cx="50%"
              cy="50%"
              innerRadius="10%"
              outerRadius="100%"
              barSize={20}
              width={300}
              height={300}
            >
              <RadialBar dataKey="count" cornerRadius={12} clockWise background />
              <Tooltip content={<RadialBarChartTooltip valueKey={'count'} />} />
            </RadialBarChart>
          </div>
          <span className="inline-grid grid-cols-1 2xl:grid-cols-2  lg:text-base text-sm gap-4 dashboard_sec2_custom">
            {emotionData?.map((emotion) => (
              <span key={emotion.responseKey}>
                <div className="webkit_in">
                  <span
                    className={`w-4 h-4 inline-block mr-2 mt-1 rounded-md`}
                    style={{ background: emotion.fill }}
                  />
                  <div className="flex flex-col">
                    <div className="text-gray-400">{emotion.name}</div>
                    <div className="text-base lg:text-xl font-medium">{emotion.count || 0}</div>
                  </div>
                </div>
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmotionsStatistics;
