import React, { useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PieChartContainer = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const negative = [
    { name: 'Gratitude', value: 10 },
    { name: 'Affirmation', value: 20 },
    { name: 'Goals', value: 15 },
    { name: 'Cleanse', value: 19 },
    { name: 'Notes', value: 5 }
  ];
  const positive = [
    { name: 'Gratitude', value: 5 },
    { name: 'Affirmation', value: 7 },
    { name: 'Goals', value: 12 },
    { name: 'Cleanse', value: 0 },
    { name: 'Notes', value: 21 }
  ];

  return (
    <div className=" h-[20rem] w-full ">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={500}>
          <Tooltip />
          <Pie data={positive} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#B6C0F3" />
          <Pie
            data={negative}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            fill="#313b6b"
            label
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartContainer;
