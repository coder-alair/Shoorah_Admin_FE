import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { IsLastIndex } from '../../utils/helper';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { DateRangePicker } from 'react-date-range';
import { Transition } from '@headlessui/react';

const BoxGraph = ({
  sectionThreeArray,
  title,
  setUserActivityDateFilter,
  activityWrapperRef,
  userActivityDateRange,
  setUserActivityDateRange,
  handleSelectActivityRange,
  userActivityDateFilter
}) => {
  return (
    <div>
      <div className="border relative border-gray-300 rounded-3xl p-4 mt-6 dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white bg-white">
        <div className="  text-black dark:text-white text-lg lg:text-xl font-medium p-2 mb-4">
          {title || 'User Activity Details'}
          <br />
          <span className="text-xs text-gray-400">
            This stats boxes will show you the user activity status like login counts and app usage.
          </span>
        </div>
        <div className="grid gap-4 ssm:grid-cols-3 lg:grid-cols-5 lg:grid-cols-5">
          {sectionThreeArray.length > 0
            ? sectionThreeArray.map((value, key) => (
                <div
                  key={key}
                  className={`lg:h-[110px] lg:h-[135px]  flex justify-between dark:bg-shoorah-darkBgColor dark:border-none flex-col border border-gray-300 rounded-3xl p-4 text-black dark:text-white text-l font-medium ${
                    IsLastIndex(key, sectionThreeArray.length) ? 'bg-slate-900 ' : 'bg-shoorah-ggg'
                  }`}
                >
                  <div
                    className={`lg:text-base relative text-sm ${
                      IsLastIndex(key, sectionThreeArray.length) ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {IsLastIndex(key, sectionThreeArray.length) && (
                      <button
                        className="flex absolute right-0  items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                        onClick={() => {
                          setUserActivityDateFilter(true);
                        }}
                      >
                        <CalendarIcon className="text-white w-[18px] h-[20px] inline" />
                      </button>
                    )}
                    {value.name}
                    {IsLastIndex(key, sectionThreeArray.length) && (
                      <Transition
                        show={userActivityDateFilter}
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
                          className="absolute top-[1.5rem] right-[-1rem] lg:top-[1rem] z-[10] mt-2 mx-auto lg:right-[1.8rem]  rounded-md bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          <div ref={activityWrapperRef}>
                            <DateRangePicker
                              ranges={[
                                {
                                  startDate: userActivityDateRange?.startDate
                                    ? userActivityDateRange?.startDate
                                    : new Date(),
                                  endDate: userActivityDateRange?.endDate
                                    ? userActivityDateRange?.endDate
                                    : new Date(),
                                  key: 'selection'
                                }
                              ]}
                              onChange={handleSelectActivityRange}
                              maxDate={new Date()}
                            />
                          </div>
                        </div>
                      </Transition>
                    )}
                  </div>
                  <div
                    className={`${
                      IsLastIndex(key, sectionThreeArray.length) ? 'text-white' : ''
                    } text-sm lg:text-md`}
                  >
                    Users : {value.users ? value.users : 0}
                  </div>
                  <div
                    className={`${
                      IsLastIndex(key, sectionThreeArray.length) ? 'text-white' : ''
                    } text-sm lg:text-md`}
                  >
                    Time Spent : {value.duration ? value.duration : 0} mins
                  </div>
                  <div
                    className={`${
                      IsLastIndex(key, sectionThreeArray.length) ? 'text-white' : ''
                    } text-sm lg:text-md`}
                  >
                    Hours Spent : {value.duration ? Math.round(value.duration / 60) : 0} hr
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

BoxGraph.propTypes = {
  sectionThreeArray: PropTypes.any
};

export default BoxGraph;
