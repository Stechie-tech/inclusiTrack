import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useParticipants } from '../context/ParticipantContext';
import { TrendingUp, Users, MapPin, Briefcase } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { participants } = useParticipants();

  // Vulnerable group distribution
  const groupData = participants.reduce((acc, participant) => {
    const group = participant.vulnerableGroup;
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(groupData).map(([name, value]) => ({
    name,
    value,
    percentage: Math.round((value / participants.length) * 100)
  }));

  // County distribution
  const countyData = participants.reduce((acc, participant) => {
    const county = participant.county;
    acc[county] = (acc[county] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCounties = Object.entries(countyData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  // Income analysis
  const incomeRanges = {
    '0-10K': 0,
    '10K-25K': 0,
    '25K-50K': 0,
    '50K-100K': 0,
    '100K+': 0
  };

  participants.forEach(participant => {
    const income = participant.monthlyIncome || 0;
    if (income === 0) return;
    if (income < 10000) incomeRanges['0-10K']++;
    else if (income < 25000) incomeRanges['10K-25K']++;
    else if (income < 50000) incomeRanges['25K-50K']++;
    else if (income < 100000) incomeRanges['50K-100K']++;
    else incomeRanges['100K+']++;
  });

  const incomeData = Object.entries(incomeRanges).map(([range, count]) => ({
    range,
    count
  }));

  // Demographics
  const genderData = participants.reduce((acc, participant) => {
    const gender = participant.gender || 'Not specified';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genderChartData = Object.entries(genderData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Accessibility stats
  const accessibilityStats = {
    hasDisability: participants.filter(p => p.hasDisability).length,
    hasInternet: participants.filter(p => p.hasInternetAccess).length,
    hasSmartphone: participants.filter(p => p.hasSmartphone).length,
  };

  const COLORS = ['#2563EB', '#0891B2', '#059669', '#DC2626', '#CA8A04', '#7C3AED', '#DB2777'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Comprehensive analysis of vulnerable group data for strategic planning</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Income</p>
              <p className="text-2xl font-bold text-gray-900">
                KSh {Math.round(participants.reduce((sum, p) => sum + (p.monthlyIncome || 0), 0) / (participants.length || 1)).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Counties Covered</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(countyData).length}</p>
            </div>
            <MapPin className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vulnerable Groups</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(groupData).length}</p>
            </div>
            <Briefcase className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Vulnerable Groups Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vulnerable Groups Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Counties */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Counties</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCounties}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {genderChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accessibility Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility & Digital Inclusion</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {accessibilityStats.hasDisability}
            </div>
            <p className="text-sm text-gray-600">Participants with Disabilities</p>
            <p className="text-xs text-gray-500">
              {Math.round((accessibilityStats.hasDisability / participants.length) * 100)}% of total
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {accessibilityStats.hasInternet}
            </div>
            <p className="text-sm text-gray-600">Have Internet Access</p>
            <p className="text-xs text-gray-500">
              {Math.round((accessibilityStats.hasInternet / participants.length) * 100)}% of total
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {accessibilityStats.hasSmartphone}
            </div>
            <p className="text-sm text-gray-600">Own Smartphones</p>
            <p className="text-xs text-gray-500">
              {Math.round((accessibilityStats.hasSmartphone / participants.length) * 100)}% of total
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Strategic Insights & Recommendations</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>Primary Focus Groups:</strong> {Object.entries(groupData).sort(([,a], [,b]) => b - a).slice(0, 3).map(([group]) => group).join(', ')} represent the largest vulnerable populations requiring targeted interventions.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>Geographic Priority:</strong> {topCounties.slice(0, 3).map(county => county.name).join(', ')} show highest participation rates and should be prioritized for program expansion.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>Digital Divide:</strong> {Math.round(((participants.length - accessibilityStats.hasInternet) / participants.length) * 100)}% lack internet access, indicating need for offline-first program delivery methods.
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>
              <strong>Income Support:</strong> Majority of participants fall in low-income brackets, suggesting microfinance and skills development programs would have high impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};