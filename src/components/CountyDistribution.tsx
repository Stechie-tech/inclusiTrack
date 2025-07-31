import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CountyDistributionProps {
  data: Record<string, number>;
}

export const CountyDistribution: React.FC<CountyDistributionProps> = ({ data }) => {
  const chartData = Object.entries(data)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8) // Show top 8 counties
    .map(([name, value]) => ({
      name,
      value
    }));

  // Group remaining counties as "Others"
  const totalOthers = Object.entries(data)
    .sort(([,a], [,b]) => b - a)
    .slice(8)
    .reduce((sum, [,value]) => sum + value, 0);

  if (totalOthers > 0) {
    chartData.push({ name: 'Others', value: totalOthers });
  }

  const COLORS = [
    '#2563EB', '#0891B2', '#059669', '#DC2626', 
    '#CA8A04', '#7C3AED', '#DB2777', '#EA580C', '#6B7280'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value, percent }) => 
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, 'Participants']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};