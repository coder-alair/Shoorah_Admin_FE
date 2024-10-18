import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const GraphContainer = ({ data, oneKey, twoKey }) => {
  return (
    <div className=" h-[20rem] w-full ">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
          key={oneKey}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="interval" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={`${oneKey}`} stroke="#10ae00" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey={`${twoKey}`} stroke="#d20000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphContainer;
