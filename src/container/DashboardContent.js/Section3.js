import React from 'react';
import PropTypes from 'prop-types';
import { IsLastIndex } from '../../utils/helper';

const DashboardSection3 = ({ sectionThreeArray, title }) => {
  return (
    <div>
      <div className="border border-gray-300 rounded-3xl p-4 mt-6 dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white bg-white">
        <div className="text-black dark:text-white text-lg lg:text-xl font-medium p-2 mb-4">
          {title || 'Focus details'}
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
                    className={`lg:text-base text-sm ${
                      IsLastIndex(key, sectionThreeArray.length) ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {value.name}
                  </div>
                  <div
                    className={`${
                      IsLastIndex(key, sectionThreeArray.length) ? 'text-white' : ''
                    } text-lg lg:text-xl`}
                  >
                    {value.status ? value.status : 0}
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

DashboardSection3.propTypes = {
  sectionThreeArray: PropTypes.any
};

export default DashboardSection3;
