import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { ClipboardIcon } from '@heroicons/react/24/outline';

import PropTypes from 'prop-types';

function DashboardSurveyChart1({ data }) {
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
    <></>
    // <div className="rounded-3xl p-4 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
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
    //       <button className="inline-flex items-center justify-center rounded-md mr-2 border border-transparent bg-gradient-to-r  px-2 py-1 text-xs font-medium text-white  hover:shoorah-primary focus:outline-none sm:w-auto">
    //         <svg
    //           viewBox="0 0 18 7"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //           className="w-7 h-7 fill-shoorah-sidebarBackground stroke-shoorah-sidebarBackground dark:stroke-white dark:fill-white cursor-pointer "
    //         >
    //           <path d="M16.001 3.58326H16.501V4.08326V5.83297C16.501 5.87895 16.5383 5.91622 16.5843 5.91622C16.6303 5.91622 16.6675 5.87893 16.6675 5.83301V3.50005C16.6675 3.45407 16.6302 3.4168 16.5843 3.4168H7.78319H7.36061L7.29018 3.00013C7.07744 1.74147 6.09133 0.755343 4.83262 0.542571C3.19925 0.266472 1.65133 1.36677 1.37527 3.00013C1.0992 4.6335 2.1995 6.18142 3.83285 6.45749L3.83286 6.45749C5.46622 6.73359 7.01412 5.6333 7.29022 3.99993L7.36065 3.58326H7.78322H13.0848H13.5848V4.08326V5.83297C13.5848 5.87895 13.6221 5.91622 13.6681 5.91622C13.714 5.91622 13.7513 5.87895 13.7513 5.83297V4.08326V3.58326H14.2513H16.001ZM1.50334 3.50005C1.50334 1.93544 2.77169 0.667089 4.33629 0.667089C5.9009 0.667089 7.16925 1.93544 7.16925 3.50005C7.16925 5.06465 5.9009 6.33301 4.33629 6.33301C2.77169 6.33301 1.50334 5.06465 1.50334 3.50005Z" />
    //         </svg>
    //       </button>
    //       <button className="inline-flex items-center justify-center rounded-md mr-2 border border-transparent bg-gradient-to-r  px-2 py-1 text-xs font-medium text-white  hover:shoorah-primary focus:outline-none sm:w-auto ">
    //         <ClipboardIcon className="w-7 h-7 inline text-shoorah-sidebarBackground dark:text-white" />
    //       </button>
    //     </div>
    //   </div>
    //   <Chart type="bar" series={options.series} options={options} width={'100%'} height={400} />
    // </div>
  );
}

DashboardSurveyChart1.prototype = {
  data: PropTypes.object
};

export default DashboardSurveyChart1;
