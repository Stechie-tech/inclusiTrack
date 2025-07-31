import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  MapPin, 
  TrendingUp,
  Eye,
  CheckCircle,
  Clock,
  Building2,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Beneficiary, DataEntryOfficer } from '../../types';
import { StatsCard } from '../StatsCard';
import { ParticipantForm } from '../ParticipantForm';

export const OfficerDashboard: React.FC = () => {
  const { currentUser, users, businesses, getBeneficiariesByOfficer, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  const officer = currentUser as DataEntryOfficer;
  const myBeneficiaries = getBeneficiariesByOfficer(officer.id);
  const verifiedBeneficiaries = myBeneficiaries.filter(b => b.status === 'approved');
  const pendingBeneficiaries = myBeneficiaries.filter(b => b.status === 'pending');

  const myCountyStats = myBeneficiaries.reduce((acc, beneficiary) => {
    const county = beneficiary.county || 'Unknown';
    acc[county] = (acc[county] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const vulnerableGroupStats = myBeneficiaries.reduce((acc, beneficiary) => {
    const group = beneficiary.vulnerableGroup || 'Unknown';
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const myBusinesses = businesses.filter(b => 
    myBeneficiaries.some(beneficiary => beneficiary.id === b.beneficiaryId)
  );

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Entry Officer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {officer.firstName}! Manage your beneficiary registrations and track progress.</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="mb-8">

      {/* Navigation Tabs */}
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'beneficiaries', label: 'My Beneficiaries' },
            { id: 'register', label: 'Register New' },
            { id: 'businesses', label: 'Businesses' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Registrations"
              value={myBeneficiaries.length.toString()}
              icon={Users}
              color="purple"
              change="All time"
            />
            <StatsCard
              title="Verified Beneficiaries"
              value={verifiedBeneficiaries.length.toString()}
              icon={CheckCircle}
              color="green"
              change={`${Math.round((verifiedBeneficiaries.length / myBeneficiaries.length) * 100)}% verified`}
            />
            <StatsCard
              title="Pending Approval"
              value={pendingBeneficiaries.length.toString()}
              icon={Clock}
              color="yellow"
              change="Awaiting admin review"
            />
            <StatsCard
              title="Businesses Started"
              value={myBusinesses.length.toString()}
              icon={Building2}
              color="purple"
              change={`${myBusinesses.filter(b => b.status === 'active').length} active`}
            />
          </div>

          {/* Assigned Counties */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Assigned Counties</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {officer.assignedCounties.map((county) => (
                <div key={county} className="bg-purple-50 rounded-lg p-4 text-center">
                  <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">{county}</p>
                  <p className="text-sm text-gray-600">{myCountyStats[county] || 0} registered</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
            <div className="space-y-4">
              {myBeneficiaries.slice(0, 5).map((beneficiary) => (
                <div key={beneficiary.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{beneficiary.firstName} {beneficiary.lastName}</p>
                      <p className="text-sm text-gray-500">{beneficiary.vulnerableGroup} • {beneficiary.county}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={getStatusBadge(beneficiary.status)}>
                      {beneficiary.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Beneficiaries Tab */}
      {activeTab === 'beneficiaries' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">My Registered Beneficiaries</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beneficiary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vulnerable Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    County
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myBeneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {beneficiary.firstName} {beneficiary.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{beneficiary.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {beneficiary.vulnerableGroup}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {beneficiary.county}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(beneficiary.status)}>
                        {beneficiary.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(beneficiary.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedBeneficiary(beneficiary)}
                        className="text-purple-600 hover:text-purple-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register New Tab */}
      {activeTab === 'register' && (
        <div>
          <ParticipantForm />
        </div>
      )}

      {/* Businesses Tab */}
      {activeTab === 'businesses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {myBusinesses.filter(b => b.status === 'active').length}
              </div>
              <p className="text-sm text-gray-600">Active Businesses</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {myBusinesses.filter(b => b.status === 'planning').length}
              </div>
              <p className="text-sm text-gray-600">In Planning</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                KSh {myBusinesses.reduce((sum, b) => sum + b.fundingAmount, 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Total Funding</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {myBusinesses.reduce((sum, b) => sum + b.employees, 0)}
              </div>
              <p className="text-sm text-gray-600">Jobs Created</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Businesses from My Beneficiaries</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funding
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myBusinesses.map((business) => {
                    const owner = myBeneficiaries.find(b => b.id === business.beneficiaryId);
                    return (
                      <tr key={business.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{business.name}</div>
                            <div className="text-sm text-gray-500">{business.type}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          KSh {business.fundingAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            business.status === 'active' ? 'bg-green-100 text-green-800' :
                            business.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                            business.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {business.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {business.employees}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Beneficiary Details Modal */}
      {selectedBeneficiary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Beneficiary Details</h2>
                <button
                  onClick={() => setSelectedBeneficiary(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {selectedBeneficiary.firstName} {selectedBeneficiary.lastName}</div>
                    <div><strong>Email:</strong> {selectedBeneficiary.email}</div>
                    <div><strong>Phone:</strong> {selectedBeneficiary.phoneNumber}</div>
                    <div><strong>ID Number:</strong> {selectedBeneficiary.idNumber}</div>
                    <div><strong>Date of Birth:</strong> {selectedBeneficiary.dateOfBirth}</div>
                    <div><strong>Gender:</strong> {selectedBeneficiary.gender}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Vulnerability Assessment</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>County:</strong> {selectedBeneficiary.county}</div>
                    <div><strong>Vulnerable Group:</strong> {selectedBeneficiary.vulnerableGroup}</div>
                    <div><strong>Monthly Income:</strong> KSh {selectedBeneficiary.monthlyIncome?.toLocaleString()}</div>
                    <div><strong>Children:</strong> {selectedBeneficiary.numberOfChildren}</div>
                    <div><strong>Employment:</strong> {selectedBeneficiary.employmentStatus}</div>
                    <div><strong>Education:</strong> {selectedBeneficiary.educationLevel}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Has Disability:</strong> {selectedBeneficiary.hasDisability ? 'Yes' : 'No'}</div>
                    <div><strong>Internet Access:</strong> {selectedBeneficiary.hasInternetAccess ? 'Yes' : 'No'}</div>
                    <div><strong>Smartphone:</strong> {selectedBeneficiary.hasSmartphone ? 'Yes' : 'No'}</div>
                    <div><strong>Primary Language:</strong> {selectedBeneficiary.primaryLanguage}</div>
                  </div>
                </div>

                {selectedBeneficiary.documents && selectedBeneficiary.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Documents</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedBeneficiary.documents.map((doc: string, index: number) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};