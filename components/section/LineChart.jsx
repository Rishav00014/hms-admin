'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { year: '2015', value: 0 },
  { year: '2016', value: 75 },
  { year: '2017', value: 50 },
  { year: '2018', value: 50 },
  { year: '2019', value: 100 },
];

const CustomLineChart = () => {
  return (
    <div className='h-80'>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#20c997" strokeWidth={2} dot={{ fill: '#20c997', r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
