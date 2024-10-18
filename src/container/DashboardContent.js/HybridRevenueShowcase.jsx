import React from 'react';
import PropTypes from 'prop-types';
import { IsLastIndex } from '../../utils/helper';

const HybridRevenueShowcase = ({ data }) => {
  return (
    <div>
      <div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:grid-cols-4">
          {data.length > 0
            ? data.map((value, key) => (
                <div
                  key={key}
                  className={`lg:h-[110px] lg:h-[135px] sm:h-[140px] dark:bg-shoorah-darkBgColor dark:border-none flex justify-between flex-col border border-gray-300 rounded-3xl p-4 text-black text-l font-medium ${'bg-shoorah-ggg'}`}
                >
                  <div className={`text-l dark:text-white ${'text-gray-400'}`}>{value.name}</div>
                  <div className=" w-full dark:text-white flex gap-x-4">
                    <div className={` text-4xl`}>{value.status ? value.status : 0}</div>
                    {value?.subValue && (
                      <span className={` text-4xl`}>
                        {Math.random() * 10 > 5 ? (
                          <span className="text-green-400 text-base">
                            +{(Math.random() * 5).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-red-500 text-base">
                            -{(Math.random() * 2).toFixed(2)}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

HybridRevenueShowcase.propTypes = {
  data: PropTypes.any
};

export default HybridRevenueShowcase;
