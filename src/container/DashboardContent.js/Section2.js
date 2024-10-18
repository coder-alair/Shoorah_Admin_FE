import React, { Fragment, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import { DateRangePicker } from 'react-date-range';
import { Transition } from '@headlessui/react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { useOutsideClick } from '../../utils/helper';

const DashboardSection2 = ({ insideData, sectionTwoArray }) => {
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
            // legend: {
            //   position: "bottom",
            // },
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
      labels: ['Active', 'Inactive'],
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
                color: '#000000',
                formatter: function () {
                  let checkInsideData =
                    flag === 1
                      ? insideData.meditationIn
                      : flag === 2
                      ? insideData.soundIn
                      : flag === 3
                      ? insideData.ritualIn
                      : flag === 4
                      ? insideData.affirmationIn
                      : flag === 5
                      ? insideData.podIn
                      : 0;
                  const sum =
                    checkInsideData && checkInsideData.reduce((partialSum, a) => partialSum + a, 0);
                  return sum;
                }
              }
            }
          }
        }
      }
    };
    return chartOptions;
  };

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {sectionTwoArray.length > 0
        ? sectionTwoArray.map((value, key) => (
            <div
              className="rounded-3xl border border-gray-300 bg-white p-4 dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"
              key={key}
            >
              <div>
                <div className="text-lg font-medium text-black dark:text-white lg:text-xl">
                  {value.name}
                </div>
                <div className="mt-3 flex justify-center">
                  <Chart options={optionArray(value.flag)} series={value.data} type="donut" />
                </div>
                <div className="mt-4 flex w-full flex-col items-center justify-center">
                  <div className="webkit_in">
                    <span
                      style={{ backgroundColor: value.activeBgColor }}
                      className="mr-2 inline-block h-2 w-2 rounded-full bg-shoorah-teal"
                    ></span>
                    <div className="flex items-center justify-center text-sm lg:text-base">
                      <div className="mr-2 text-gray-400">Active: </div>
                      <div className="text-lg lg:text-xl">
                        {value.activeInactiveData.active ? value.activeInactiveData.active : 0}
                      </div>
                    </div>
                  </div>
                  <div className="webkit_in">
                    <span
                      style={{ backgroundColor: value.inActiveBgColor }}
                      className="mr-2 inline-block h-2 w-2 rounded-full bg-shoorah-teal"
                    ></span>
                    <div className="flex items-center justify-center">
                      <div className="mr-2 text-sm text-gray-400 lg:text-base">Inactive: </div>
                      <div className="text-lg lg:text-xl">
                        {value?.activeInactiveData?.inactive
                          ? value?.activeInactiveData.inactive
                          : 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

DashboardSection2.propTypes = {
  insideData: PropTypes.any,
  sectionTwoArray: PropTypes.any,
  sosOptions: PropTypes.any,
  dateRange: PropTypes.any,
  setDateRange: PropTypes.any
};

export default DashboardSection2;
