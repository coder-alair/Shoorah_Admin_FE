import { dateFormat } from '../../../../utils/helper';

export const positiveBarOption = {
  series: [
    {
      data: [40, 43, 44, 47, 54, 58, 69, 10, 90]
    }
  ],
  option: {
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: true
      }
    },
    colors: ['#888BEB'],
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      },
      formatter: function (val, opt) {
        return val + '%';
      }
    },
    xaxis: {
      categories: [
        'I love this job',
        'I get on well with my manager',
        'I love my colleagues',
        'I enjoy the tasks I’m given',
        'I feel fulfilled by my work',
        'I never plan to leave this job',
        'There’s so much opportunity for development',
        'My workplace cares about me',
        'I always try my best at work',
        'I get paid fairly for what I do'
      ],
      labels: {
        formatter: function (val) {
          return Math.abs(Math.round(val)) + ' %';
        }
      }
    },
    yaxis: {
      labels: {
        show: true,
        trim: false,
        maxWidth: 540
      }
    }
  }
};

export const negativeBarOption = {
  series: [
    {
      data: [-10, -13, -94, -37, -74, -68, -99, -25, -20]
    }
  ],
  option: {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: true
      }
    },
    colors: ['#F88379'],
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    xaxis: {
      categories: [
        'I hate this job',
        'I can’t stand my manager ',
        'I don’t like my colleagues ',
        'I hate the tasks I’m given ',
        'I am bored at work ',
        'I want a new job',
        'There’s no opportunity for development ',
        'My workplace doesn’t care about me',
        'I do as little as possible at work',
        'I don’t get paid enough '
      ],
      labels: {
        formatter: function (val) {
          return Math.abs(Math.round(val)) + '%';
        }
      }
    },
    yaxis: {
      labels: {
        show: true,
        trim: false,
        maxWidth: 540
      }
    }
  }
};

export const allBarOptions = {
  series: [
    {
      name: 'Positive',
      data: [40, 43, 44, 47, 54, 58, 69, 10, 90]
    },
    {
      name: 'Negative',
      data: [-10, -13, -94, -37, -74, -68, -99, -25, -20]
    }
  ],
  option: {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
      }
    },
    colors: ['#888BEB', '#B6C0F3'],
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
        fontSize: '12px',
        colors: ['#fff']
      },
      labels: {
        formatter: function (val) {
          return Math.abs(Math.round(val)) + ' %';
        }
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
    tooltip: {
      shared: false
    },
    xaxis: {
      categories: [
        'I love this job',
        'I get on well with my manager',
        'I love my colleagues',
        'I enjoy the tasks I’m given',
        'I feel fulfilled by my work',
        'I never plan to leave this job',
        'There’s so much opportunity for development',
        'My workplace cares about me',
        'I always try my best at work',
        'I get paid fairly for what I do'
      ],
      labels: {
        formatter: function (val) {
          return Math.abs(Math.round(val)) + ' %';
        }
      }
    },
    yaxis: {
      labels: {
        show: true,
        trim: false,
        maxWidth: 540
      }
    }
  }
};

export const redialProfestionalSelect = [
  { name: 'Job Satisafaction', value: 'job_satisfaction' },
  { name: 'Working Enviroment', value: 'working_enviroment' },
  { name: 'Work Load', value: 'work_load' },
  { name: 'Line Manager Relationship', value: 'line_manager_relationship' },
  { name: 'Working Hours', value: 'working_hours' },
  { name: 'Mental Health Support', value: 'mental_health_support' },
  { name: 'Company Culture', value: 'company_culture' },
  { name: 'Feeling Supported', value: 'feeling_supported' },
  { name: 'Having Tools For A Job', value: 'having_tools_for_job' },
  { name: 'Ongoing Training', value: 'ongoing_training' }
];
export const redialPersonalSelect = [
  'Motivation',
  'Positiveness',
  'Happy',
  'Strong',
  'Control',
  'Energy',
  'Calmness',
  'Relax',
  'Balance'
];

export const barGraphOption = (label, data) => {
  const dummyColumnData = {
    series: [
      {
        name: 'Overall Company Percentage',
        data: data
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top' // top, center, bottom
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + '%';
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#3A47AB']
        }
      },
      colors: ['#3A47AB'],
      xaxis: {
        categories: label,
        position: 'top',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true
        }
      },
      yaxis: {
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        },
        labels: {
          show: true,
          formatter: function (val) {
            return val + '%';
          }
        },
        min: 0,
        max: 100
      }
    }
  };
  return dummyColumnData;
};

export const optionFirstGraph = (labels, data, type) => {
  const lineGraphOption = {
    chart: {
      height: 400,
      type: 'line',
      toolbar: {
        show: false,
        offsetY: -25
      }
    },
    colors: [
      '#77B6EA',
      '#545454',
      '#FF9B82',
      '#176B87',
      '#94A684',
      '#FF6969',
      '#F94C10',
      '#F8DE22',
      '#65451F',
      '#1A5D1A',
      '#4F709C'
    ],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    markers: {
      size: 0
    },
    xaxis: {
      categories: labels,
      type: 'date',
      tickAmount: labels?.length > 12 ? 12 : undefined,
      labels: {
        format: 'dd-mm',
        formatter: function (value) {
          return `${dateFormat(value)}`; // The formatter function overrides format property
        }
      }
    },
    yaxis: {
      title: {
        text: 'Percentage'
      },
      min: type === 'All' ? -100 : type === 'Positive' ? 0 : type === 'Negative' ? -100 : -100,
      max: type === 'All' ? 100 : type === 'Positive' ? 100 : type === 'Negative' ? 0 : 100,
      labels: {
        show: true,
        formatter: function (val) {
          return val + '%';
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    tooltip: {
      shared: true,
      y: {
        formatter: function (val, opt) {
          return (
            Math.floor(val) +
            '%    Users: (' +
            data[opt.seriesIndex]?.usersVoted?.[opt.dataPointIndex] +
            ')'
          );
        }
      }
    }
  };
  return lineGraphOption;
};

export const radialGraphOption = (label) => {
  const redialOptions = {
    chart: {
      height: 390,
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px'
          },
          value: {
            fontSize: '16px'
          },
          total: {
            show: false,
            label: 'Total'
          }
        }
      }
    },
    colors: ['#4A56DB', '#888BEB', '#B6C0F3'],
    labels: label,
    stroke: {
      lineCap: 'round'
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      formatter: function (seriesName, opts) {
        return seriesName + '  ' + opts.w.globals.series[opts.seriesIndex];
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false
          }
        }
      }
    ]
  };
  return redialOptions;
};
