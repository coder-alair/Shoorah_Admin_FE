export const donutDataOption = (flag, data, color, name) => {
  return {
    flag: flag,
    data: data,
    activeBgColor: color[0],
    inActiveBgColor: color[1],
    name: name,
    activeInactiveData: {
      active: data[0],
      inactive: data[1]
    }
  };
};

export const donutChartOption = (flag, data, activeBgColor, inActiveBgColor) => {
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
            width: 300
          }
        }
      }
    ],
    colors: [activeBgColor, inActiveBgColor],
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
              size: '12px',
              formatter: function () {
                let checkInsideData = data;
                const sum = checkInsideData.reduce((partialSum, a) => partialSum + a, 0);
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
