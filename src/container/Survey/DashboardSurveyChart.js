import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { CalendarIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

function DashboardSurveyChart({ data }) {
  const [status, setStatus] = useState('All');
  const customSeries = [
    ['Positive', 'All'].includes(status) && {
      name: 'Positive',
      data: data?.map((item) => item?.totalpositive)
    },
    ['Negative', 'All'].includes(status) && {
      name: 'Negative',
      data: data?.map((item) => item?.totalnegative * -1)
    }
  ].filter((item) => item);

  const options = {
    series: customSeries,
    chart: {
      type: 'bar',
      height: 440,
      stacked: true,
      toolbar: {
        show: false
      }
    },
    colors: ['rgba(153, 156, 238, 1)', 'rgba(153, 156, 238, 0.5)'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%'
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '14px',
        colors: ['#fff']
      }
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },

    grid: {
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    yaxis: {
      min: -8,
      max: 8,
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },

    tooltip: {
      shared: false,
      x: {
        formatter: function (val) {
          return val;
        }
      },
      y: {
        formatter: function (val) {
          return val + '%';
        }
      }
    },
    title: {
      display: false
    },
    xaxis: {
      categories: [data?.map((item) => item?.question)],
      labels: {
        formatter: function (val) {
          return Math.round(val) + '%';
        }
      }
    }
  };

  const activeClass = 'min-h-[30px] bg-[#9a9dee] rounded-sm text-center text-white';

  return (
    // <div className="border border-gray-300 rounded-3xl p-4 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
    //   <h4 class="text-black mb-3 lg:hidden md:hidden sm:block text-center dark:text-white text-lg md:text-xl font-medium w-full">
    //     Shuru Therapy &amp; Journal Keywords
    //   </h4>
    //   <div className="flex items-center">
    //     <div>
    //       <div className="flex font-semibold gap-4 p-1 text-sm border text-gray-300 border-gray-300 rounded-sm bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white">
    //         <button
    //           className={
    //             'min-w-[80px] flex items-center justify-center ' +
    //             (status === 'All' ? activeClass : '')
    //           }
    //           onClick={() => setStatus('All')}
    //         >
    //           All
    //         </button>
    //         <button
    //           className={
    //             'min-w-[80px] flex items-center justify-center ' +
    //             (status === 'Positive' ? activeClass : '')
    //           }
    //           onClick={() => setStatus('Positive')}
    //         >
    //           Positive
    //         </button>
    //         <button
    //           className={
    //             'min-w-[80px] flex items-center justify-center ' +
    //             (status === 'Negative' ? activeClass : '')
    //           }
    //           onClick={() => setStatus('Negative')}
    //         >
    //           Negative
    //         </button>
    //       </div>
    //     </div>
    //     <div className="grow text-center flex items-center justify-center">
    //       {window.innerWidth > 768 && (
    //         <h4 class="text-black text-center dark:text-white text-lg md:text-xl font-medium w-full">
    //           Shuru Therapy &amp; Journal Keywords
    //         </h4>
    //       )}
    //     </div>
    //     {/* <div className='grow text-center font-semibold'>Shuru Therapy &amp; Journal Keywords</div> */}
    //     <div className="flex gap-2">
    //       <button className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto">
    //         <CalendarIcon className="text-white w-[18px] h-[20px] inline" />
    //       </button>
    //       <button className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto">
    //         <CalendarIcon className="text-white w-[18px] h-[20px] inline" />
    //       </button>
    //     </div>
    //   </div>
    //   <Chart type="bar" series={options.series} options={options} width={'100%'} height={400} />
    // </div>
    <></>
  );
}

DashboardSurveyChart.prototype = {
  data: PropTypes.object
};

export default DashboardSurveyChart;
