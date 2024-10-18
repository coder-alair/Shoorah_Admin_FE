import React, { Fragment, useRef, useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import openIcon from '../../assets/images/Open.svg';
import completeIcon from '../../assets/images/Complete.svg';
import deliveredIcon from '../../assets/images/Delivered.svg';
import incompleteIcon from '../../assets/images/InComplete.svg';

import DataFilter from './DataFilter';
import { DateRangePicker } from 'react-date-range';
import { Transition } from '@headlessui/react';
import { useOutsideClick } from '../../utils/helper';
import { SURVEY_CONSTANT } from '../../core/web.constants';

function DashboardSurveyStatistics({ data, setInsightType, isUserSuperOrSubAdmin }) {
  const [showCalandar, setShowCalandar] = useState(false);
  const [surveyDateRange, setsurveyDateRange] = useState({
    startDate: new Date(new Date().getTime() - 24 * 3600000),
    endDate: new Date()
  });
  const wrapperRef = useRef();

  useOutsideClick(wrapperRef, () => {
    if (showCalandar) {
      setShowCalandar(false);
    }
  });

  const handleSelectRange = (e) => {
    let start = new Date(e?.selection?.startDate);
    start.setHours(new Date().getHours());
    start.setMinutes(new Date().getMinutes());
    start.setSeconds(new Date().getSeconds());
    let end = new Date(e?.selection?.endDate);
    end.setHours(new Date().getHours());
    end.setMinutes(new Date().getMinutes());
    end.setSeconds(new Date().getSeconds());
    setsurveyDateRange({
      startDate: start,
      endDate: end
    });
  };

  return (
    <div className="border mt-5 border-gray-300 rounded-3xl p-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white">
      <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-center">
        <div className="grow">
          <h1 className="font-semibold text-xl dark:text-white">
            {SURVEY_CONSTANT.SURVEY_STATS_HEADER}
          </h1>
        </div>
        <div className="flex relative  gap-4 items-center">
          {isUserSuperOrSubAdmin && (
            <>
              <div className="grow" />
              <div>
                <DataFilter onChange={setInsightType} />
              </div>
            </>
          )}

          <button
            onClick={() => setShowCalandar(!showCalandar)}
            className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
          >
            <CalendarIcon className="text-white w-[18px] h-[20px] inline" />
          </button>
          <Transition
            show={showCalandar}
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="absolute top-[1.5rem] right-[-4rem] lg:top-[-9rem] z-[10] mt-2 mx-auto lg:right-[3.8rem]  rounded-md bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              ref={wrapperRef}
            >
              <DateRangePicker
                ranges={[
                  {
                    startDate: surveyDateRange?.startDate ? surveyDateRange?.startDate : new Date(),
                    endDate: surveyDateRange?.endDate ? surveyDateRange?.endDate : new Date(),
                    key: 'selection'
                  }
                ]}
                onChange={handleSelectRange}
                maxDate={new Date()}
              />
            </div>
          </Transition>
        </div>
      </div>
      <div className="mt-8 gap-8 grid md:grid-cols-3 sm:grid-cols-2 text-center flex-wrap">
        <div className="bg-white rounded-3xl dark:bg-shoorah-darkBgTabColor">
          <img src={completeIcon} loading='lazy' className="h-20 w-20 p-3 m-auto" />
          <div className="p-3">
            <h1 className="font-extrabold text-2xl text-shoorah-primary dark:text-white">
              Total: {data?.complete || 0}
            </h1>
            <p className="text-sm text-shoorah-gray4 dark:text-white">Completed</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl dark:bg-shoorah-darkBgTabColor">
          <img src={incompleteIcon} loading='lazy' className="h-20 w-20 p-3 m-auto" />
          <div className="p-3">
            <h1 className="font-extrabold text-2xl text-shoorah-darkRed dark:text-white ">
              Total: {data?.incomplete || 0}
            </h1>
            <p className="text-sm text-shoorah-gray4 dark:text-white">Incomplete</p>
          </div>
        </div>
        {/* <div className='bg-white rounded-3xl dark:bg-shoorah-darkBgTabColor'>
          <img src={deliveredIcon} className='h-20 w-20 p-3 m-auto' />
          <div className='p-3'>
            <h1 className='font-extrabold text-2xl text-teal-400 dark:text-white'>Total: 0</h1>
            <p className='text-sm text-shoorah-gray4 dark:text-white'>Delivered</p>
          </div>
        </div> */}
        <div className="bg-white rounded-3xl dark:bg-shoorah-darkBgTabColor">
          <img src={openIcon} loading='lazy' className="h-20 w-20 p-3 dark:text-white m-auto" />
          <div className="p-3">
            <h1 className="font-extrabold text-2xl text-shoorah-green dark:text-white">
              Total: {data?.open || 0}
            </h1>
            <p className="text-sm text-shoorah-gray4 dark:text-white">Currently Open</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSurveyStatistics;
