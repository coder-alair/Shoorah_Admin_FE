import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Api } from '../../api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import moment from 'moment';
import { getPathForSurvey } from '../../utils/helper';
import Table from '../../component/common/Table';
ChartJS.register(...registerables);

const tabList = ['Question Summaries', 'Insights & Data Trends', 'Individual Response'];

const columns = [
  {
    title: 'STATUS',
    // parent: 'element',
    key: 'status',
    sortable: false,
    type: 'status',
    align: 'center'
  },
  {
    title: 'LAST MODIFIED',
    key: 'lastModified',
    type: 'text',
    align: 'center'
  },
  {
    title: 'TIME SPENT',
    key: 'timeSpent',
    type: 'text',
    align: 'center'
  },
  {
    title: 'COLLECTOR',
    key: 'collector',
    type: 'text',
    align: 'center'
  },
  {
    title: 'IP ADDRESS',
    key: 'ipaddress',
    type: 'text',
    align: 'center'
  },
  {
    title: 'ANSWER',
    key: 'clients',
    type: 'text',
    align: 'right'
  }
];

const SurveyStatistics = () => {
  const sampleData = [
    {
      question_id: 1,
      question: "How often do you communicate with your colleagues and supervisors while working remotly?",
      AnswredCount: 1,
      skip: 0,
      options_details: [
        {
          options_id: 1,
          options: "Daily",
          optionsWithPercentage: 100,
          user_count: 80
        },
        {
          options_id: 2,
          options: "Several times a day",
          optionsWithPercentage: 100,
          user_count: 90
        },
        {
          options_id: 3,
          options: "Once a week",
          optionsWithPercentage: 100,
          user_count: 100
        },
        {
          options_id: 4,
          options: "Rarely",
          optionsWithPercentage: 100,
          user_count: 70
        },
        {
          options_id: 5,
          options: "Almost never",
          optionsWithPercentage: 100,
          user_count: 80
        },
        {
          options_id: 5,
          options: "Other",
          optionsWithPercentage: 100,
          user_count: 90
        }
      ]
    },
    {
      question_id: 2,
      question: "How often do you codinate with your colleagues and supervisors while working remotly?",
      AnswredCount: 1,
      skip: 0,
      options_details: [
        {
          options_id: 1,
          options: "Daily",
          optionsWithPercentage: 100,
          user_count: 70
        },
        {
          options_id: 2,
          options: "Several times a day",
          optionsWithPercentage: 100,
          user_count: 90
        },
        {
          options_id: 3,
          options: "Once a week",
          optionsWithPercentage: 100,
          user_count: 50
        },
        {
          options_id: 4,
          options: "Rarely",
          optionsWithPercentage: 100,
          user_count: 60
        },
        {
          options_id: 5,
          options: "Almost never",
          optionsWithPercentage: 100,
          user_count: 40
        },
        {
          options_id: 5,
          options: "Other",
          optionsWithPercentage: 100,
          user_count: 57
        }
      ]
    },
  ];

  const insight = {
    surveyTitle: 'Sample Survey',
      finalTotalSubmittions: 120,
      overallCompletionRate: 85,
      firstSurveyDate: '03/11/2023',
      recentSurveyDate: '03/11/2023',
      fromDateAndtoDate: '8am 11/03/2023 to 8pm 11/03/2023',
      surveyResults: [
        { hour: '08', count: 15 },
        { hour: '10', count: 10 },
        { hour: '2', count: 25 },
        { hour: '4', count: 18 },
        { hour: '6', count: 14 },
        { hour: '8', count: 30 }
      ]
  };


  const navigate = useNavigate();
  const [summary, setSummary] = useState();
  // const [insight, setInsight] = useState({});
  const { search } = useLocation();
  const pageName = new URLSearchParams(search).get('tab');
  console.log('pageName', pageName, pageName !== 'insights')
  // const currentTab = pageName !== 'insights' ? tabList[0] : tabList[1];
  const currentTab = pageName === 'response' ? tabList[2] : pageName === 'insights' ? tabList[1] : tabList[0];
  const surveyId = useParams().surveyId;
  // useEffect(() => {
  //   if (pageName === 'insights') {
  //     Api.getSurveyInsight(surveyId).then((res) => setInsight(res?.data?.data));
  //   } else {
  //     Api.getSurveySummary(surveyId).then((res) => setSummary(res?.data));
  //   }
  // }, [surveyId, pageName]);

  const handleSaveReport = () => {
    Api.getReport();
  };
  return (
    <div className="px-3">
      <div className="mb-8 mt-6">
        <h2 className="text-2xl font-semibold dark:text-white capitalize">
          {insight?.surveyTitle || summary?.data?.[0]?.surveyTitle}
        </h2>
      </div>

      <div className="border-gray-200">
        <nav
          aria-label="Tabs"
          className=" w-full flex justify-around -mb-px 0 md:inline-flex gap-8 sm:block bg-white drop-shadow-xl p-4 px-8 rounded-2xl dark:bg-shoorah-darkBgTabColor"
        >
          {tabList.map((tab, index) => (
            <div
              key={'tab-' + tab}
              onClick={() =>
                navigate(
                  getPathForSurvey(
                    index === 0
                      ? `/surveys/summary/${surveyId}?tab=summaries`
                      : index === 1
                      ? `/surveys/summary/${surveyId}?tab=insights`
                      : `/surveys/summary/${surveyId}?tab=response`
                  )
                )
              }
              className={[
                tab === currentTab
                  ? 'md:border-shoorah-secondary text-shoorah-secondary border-transparent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-white',
                'text-center text-xl uppercase cursor-pointer py-2 px-1 border-b-2 font-semibold '
              ].join(' ')}
            >
              {tab}
            </div>
          ))}
        </nav>
      </div>

      <div className="md:flex mt-8 justify-between items-start">
        <div>
          <div className="font-semibold uppercase dark:text-white">Respondents 1 of 1</div>
          <div className="mt-2 dark:text-white">Page 1</div>
        </div>
        <div className="pt-4 md:pt-0 inline-flex gap-5">
          {/* <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8"
              color="#4A56DB"
              onClick={handleSaveReport}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
              />
            </svg>
          </div> */}
          <div className="inline-flex gap-4 justify-between bg-shoorah-secondary p-2 px-4  rounded-full">
            <button className="text-white xl:text-base" onClick={handleSaveReport}>
              Save As
            </button>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6  text-shoorah-offWhite"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {currentTab === tabList[0] ? (
        sampleData?.map((item, index) => {
          return (
            <div
              key={item?.question_id}
              className="mt-8 bg-white drop-shadow-xl overflow-hidden dark:bg-shoorah-darkBgTabColor"
              style={{ borderRadius: 24 }}
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold dark:text-white ">
                  Q{index + 1}:<span className=" first-letter:capitalize"> {item?.question}</span>
                </h2>
                <p className="mt-5  dark:text-white">
                  Answered: {item?.AnswredCount} Skipped: {item?.skip}
                </p>
              </div>

              <div className="md:p-24 p-8 flex justify-center" style={{ minHeight: 500 }}>
                {GetDynamicChart(item?.options_details)}
              </div>

              <div className="grid grid-cols-2 gap-1 text-white font-semibold">
                <div className="uppercase px-8 bg-shoorah-secondary p-2">Answer Choices</div>
                <div className="grid grid-cols-2 px-8 bg-shoorah-secondary p-2 opacity-60">
                  <div>RESPONSES</div>
                  <div className="text-right ">USER TOTAL</div>
                </div>
              </div>

              <div className="my-6">
                {item?.options_details?.map((option) => (
                  <div
                    key={option?.options_id}
                    className="grid mb-4 grid-cols-2 gap-1 font-semibold text-xl dark:text-white"
                  >
                    <div className="px-8">{option?.options}</div>
                    <div className="grid grid-cols-2 px-8 ">
                      <div>{option?.optionsWithPercentage}%</div>
                      <div className="text-right">{option?.user_count}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex px-8 p-2 justify-between text-white font-semibold bg-shoorah-secondary">
                <div className="uppercase">Total</div>
                <div>
                  <div>
                    {item?.options_details?.reduce(
                      (total, option) => total + (option?.user_count || 0),
                      0
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) :
      currentTab === tabList[1] ? (
        <InsightSection data={insight} />
      ) : (
        <ResponseSection data={insight} />
      )}
    </div>
  );
};

function GetDynamicChart(chartData) {

  function getGradient(ctx, x0 = 0, y0 = 100, x1 = 0, y1 = 600) {
    x0 = parseInt(x0);
    y0 = parseInt(y0);
    x1 = parseInt(x1);
    y1 = parseInt(y1);

    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    gradient.addColorStop(0, '#4553ce');
    gradient.addColorStop(1, '#fff');
    return gradient;
  }

  const data = {
    labels: chartData.map((item) => item?.options),
    datasets: [
      {
        type: 'bar',
        borderWidth: 0,
        borderSkipped: false,
        data: chartData.map((item) => item?.user_count),
        backgroundColor: function ({ chart }) {
          const { ctx, chartArea } = chart;
          if (!chartArea) return;

          const { top, bottom } = chartArea;
          return getGradient(ctx, 0, top, 0, bottom);
        },
        borderRadius: Number.MAX_VALUE
      }
    ]
  };

  const drawShape = {
    id: 'drawShape',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const height = chart.scales.x.bottom;

      chart.getDatasetMeta(0).data.map((dataset) => {
        const { x, width, base } = dataset;
        const radius = width / 2;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = '#4553ce';
        ctx.arc(x, height - (height - base + radius), radius, 0, 50 * Math.PI);
        ctx.fill();
        ctx.closePath();
      });
    }
  };

  const config = {
    data,
    options: {
      barThickness: 50,
      scales: {
        y: {
          beginAtZero: true,
          border: {
            display: false
          },
          ticks: {
            color: '#4553ce',
            font: {
              size: 16
            },
            callback: function (label) {
              return label + '%  ';
            }
          },
          grid: {
            lineWidth: 0,
            tickWidth: 4,
            tickLength: 16,
            tickColor: '#4553ce'
          }
        },
        x: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 18
            },
            callback: function (_, i) {
              let label = chartData[i].options;
              if (/\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          border: {
            display: false
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          displayTitle: false,
          displayColors: false,
          backgroundColor: '#4553ce',
          bodyColor: 'white',
          yAlign: 'bottom',
          padding: 10,
          bodyFont: {
            size: 18
          },
          caretSize: 10,
          callbacks: {
            title: function () {
              return '';
            },
            label: function ({ formattedValue }) {
              return formattedValue + ' Responses';
            }
          }
        }
      }
    },
    plugins: [drawShape]
  };

  return <Chart data={config.data} options={config.options} plugins={config.plugins} />;
}

GetDynamicChart.prototype = {
  chartData: PropTypes.array
};

function GetDynamicChart1(chartData) {
  const data = {
    labels: chartData?.map(({ hour }) => {
      return moment(new Date().setHours(Number(hour))).format('h A');
    }),
    datasets: [
      {
        type: 'bar',
        borderWidth: 0,
        borderSkipped: false,
        backgroundColor: '#b6c0f3',
        borderRadius: {
          topLeft: Number.MAX_VALUE,
          topRight: Number.MAX_VALUE,
          bottomLeft: 0,
          bottomRight: 0
        },
        hoverBackgroundColor: 'rgb(74, 86, 219)',
        data: chartData?.map(({ count }) => count)
      }
    ]
  };

  const config = {
    data,
    type: 'bar',
    options: {
      datasets: {
        bar: {
          maxBarThickness: 50
        }
      },
      scales: {
        y: {
          border: {
            display: false
          },
          ticks: {
            display: false
          }
        },
        x: {
          ticks: {
            font: {
              size: 14
            }
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          displayTitle: false,
          displayColors: false,
          backgroundColor: '#4553ce',
          bodyColor: 'white',
          yAlign: 'bottom',
          padding: 10,
          bodyFont: {
            size: 14
          },
          caretSize: 8,
          callbacks: {
            title: function () {
              return '';
            },
            label: function ({ formattedValue }) {
              return formattedValue + ' Responses';
            }
          }
        }
      }
    }
  };

  return (
    <Chart
      key="insight-chart"
      data={config.data}
      options={config.options}
      plugins={config.plugins}
    />
  );
}
export default SurveyStatistics;

export const InsightSection = (insight) => {
  return (
    <div className="mt-8 rounded-3xl shadow-xl bg-white dark:bg-shoorah-darkBgTabColor dark:text-white">
      <div className="p-5 ">
        <h1 className="font-bold text-xl">Insights</h1>
        <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 text-center m-3 gap-8">
          <div className="bg-shoorah-secondary p-5 text-white rounded-2xl m-3">
            <h1 className="uppercase">Total Responses</h1>
            <h1 className="uppercase text-6xl">{insight?.data?.finalTotalSubmittions}</h1>
          </div>
          <div className="bg-shoorah-secondary p-5 text-white rounded-2xl m-3">
            <h1 className="uppercase">Completion rate</h1>
            <h1 className="uppercase text-6xl">{insight?.data?.overallCompletionRate}%</h1>
          </div>
          <div className="bg-shoorah-secondary p-5 text-white rounded-2xl m-3">
            <h1 className="uppercase">Typical Time Spent</h1>
            <h1 className="text-6xl">5s</h1>
          </div>
          <div className="bg-shoorah-secondary p-5 text-white rounded-2xl m-3">
            <h1 className="uppercase">Most-Skipped Questions</h1>
            <h1 className="text-md">None of the questions were skipped</h1>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="xl:flex md:flex md:flex-wrap">
          <div className="xl:basis-1/4 lg:basis-1/4 md:basis-1">
            <h1 className="w-min font-bold text-xl">Trends</h1>
            <div className="bg-shoorah-secondary p-5 text-white rounded-2xl m-3">
              <h1 className="">Responses (by hour)</h1>
              <br />
              <h1 className="text-md">
                First: {dayjs(insight?.data?.firstSurveyDate).format('DD/MM/YYYY')};
              </h1>
              <h1 className="text-md">
                Most Recent: {dayjs(insight?.data?.recentSurveyDate).format('DD/MM/YYYY')}
              </h1>
            </div>
          </div>
          <div className=" px-8 pb-8 mx-4 mb-4 xl:basis-2/3 lg:basis-1 md:basis-1">
            <h1 className="font-semibold text-2xl text-center ">
              {insight?.data?.fromDateAndtoDate}
            </h1>
            <div className="p-8 flex justify-center bg-white shadow-xl rounded-2xl ">
              {GetDynamicChart1(insight?.data?.surveyResults)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResponseSection = (insight) => {
  const testData = [
    {
      status: 'Complete',
      lastModified: '2023-11-03 22:29',
      timeSpent: '00:01',
      collector: 'Web Link 1\n(Weblink)',
      ipaddress: '51.186.196.148',
      anwser: 'Daily'
    },
    {
      status: 'Complete',
      lastModified: '2023-11-03 22:29',
      timeSpent: '00:01',
      collector: 'Web Link 2\n(Weblink)',
      ipaddress: '51.186.196.148',
      anwser: 'Daily'
    },
    {
      status: 'Complete',
      lastModified: '2023-11-03 22:29',
      timeSpent: '00:01',
      collector: 'Web Link 3\n(Weblink)',
      ipaddress: '51.186.196.148',
      anwser: 'Daily'
    },
    {
      status: 'Complete',
      lastModified: '2023-11-03 22:29',
      timeSpent: '00:01',
      collector: 'Web Link 4\n(Weblink)',
      ipaddress: '51.186.196.148',
      anwser: 'Daily'
    }
  ];
  return (
    // <div className="mt-8 rounded-3xl shadow-xl bg-white dark:bg-shoorah-darkBgTabColor dark:text-white">
    <div className="mt-4">
      <Table
        columns={columns}
        data={testData}
        name={'test_table'}
        // bottomBorder={totalCount > selectedPerPage?.value}
        // refreshTable={() =>
        //   handlePagination(currentPage, selectedPerPage?.value, '')
        // }
        // loader={loader}
      />
    </div>

    // </div>
  );
};
