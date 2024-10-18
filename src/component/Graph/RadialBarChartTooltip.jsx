import React from 'react';

const RadialBarChartTooltip = ({ active, payload, valueKey }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border bg-white p-4 shadow-lg dark:border-shoorah-buttonColor dark:bg-shoorah-darkBgColor dark:text-shoorah-offWhite">
        {payload?.[0]?.payload?.name}: {payload?.[0]?.payload?.[valueKey]}
      </div>
    );
  }

  return null;
};

export default RadialBarChartTooltip;
