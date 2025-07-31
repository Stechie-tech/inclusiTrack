import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VulnerableGroupChartProps {
  data: Record<string, number>;
}

export const VulnerableGroupChart: React.FC<VulnerableGroupChartProps> = ({ data }) => {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      fullName: name,
      value
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Vulnerable Groups Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name, props) => [value, 'Participants']}
            labelFormatter={(label) => {
              const item = chartData.find(d => d.name === label);
              return item ? item.fullName : label;
            }}
          />
          <Bar dataKey="value" fill="#2563EB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};