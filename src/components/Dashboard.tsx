import React from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useParticipants } from '../context/ParticipantContext';
import { StatsCard } from './StatsCard';
import { VulnerableGroupChart } from './VulnerableGroupChart';
import { CountyDistribution } from './CountyDistribution';

export const Dashboard: React.FC = () => {
  const { participants } = useParticipants();

  const totalParticipants = participants.length;
  const verifiedParticipants = participants.filter(p => p.verificationStatus === 'verified').length;
  const pendingVerification = participants.filter(p => p.verificationStatus === 'pending').length;
  const averageIncome = participants.reduce((sum, p) => sum + (p.monthlyIncome || 0), 0) / (participants.length || 1);

  const vulnerableGroupCounts = participants.reduce((acc, participant) => {
    const group = participant.vulnerableGroup;
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countyDistribution = participants.reduce((acc, participant) => {
    const county = participant.county;
    acc[county] = (acc[county] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cultural Inclusion Dashboard</h1>
        <p className="text-gray-600">Monitor and analyze vulnerable group data for strategic decision-making</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Participants"
          value={totalParticipants.toLocaleString()}
          icon={Users}
          color="blue"
          change="+12% from last month"
        />
        <StatsCard
          title="Verified Participants"
          value={verifiedParticipants.toLocaleString()}
          icon={CheckCircle}
          color="green"
          change={`${Math.round((verifiedParticipants / totalParticipants) * 100)}% verified`}
        />
        <StatsCard
          title="Pending Verification"
          value={pendingVerification.toLocaleString()}
          icon={AlertCircle}
          color="yellow"
          change="Requires attention"
        />
        <StatsCard
          title="Average Income"
          value={`KSh ${Math.round(averageIncome).toLocaleString()}`}
          icon={DollarSign}
          color="purple"
          change="Monthly income"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <VulnerableGroupChart data={vulnerableGroupCounts} />
        <CountyDistribution data={countyDistribution} />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {participants.slice(0, 5).map((participant, index) => (
            <div key={participant.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{participant.firstName} {participant.lastName}</p>
                  <p className="text-sm text-gray-500">{participant.vulnerableGroup} • {participant.county}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  participant.verificationStatus === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : participant.verificationStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {participant.verificationStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};