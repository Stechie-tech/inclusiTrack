import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Building2, 
  MapPin, 
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  UserPlus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { Beneficiary, DataEntryOfficer, Business } from '../../types';
import { StatsCard } from '../StatsCard';
import { ParticipantForm } from '../ParticipantForm';

export const AdminDashboard: React.FC = () => {
  const { users, businesses, approveUser, rejectUser, logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);

  const beneficiaries = users.filter(u => u.role === 'beneficiary') as Beneficiary[];
  const officers = users.filter(u => u.role === 'data_entry_officer') as DataEntryOfficer[];
  const pendingUsers = users.filter(u => u.status === 'pending');
  const approvedUsers = users.filter(u => u.status === 'approved');

  const countyStats = beneficiaries.reduce((acc, beneficiary) => {
    const county = beneficiary.county || 'Unknown';
    acc[county] = (acc[county] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const vulnerableGroupStats = beneficiaries.reduce((acc, beneficiary) => {
    const group = beneficiary.vulnerableGroup || 'Unknown';
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const businessStats = businesses.reduce((acc, business) => {
    acc[business.status] = (acc[business.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Prepare chart data
  const countyChartData = Object.entries(countyStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));

  const vulnerableGroupChartData = Object.entries(vulnerableGroupStats)
    .map(([name, value]) => ({ name, value }));

  const COLORS = ['#7C3AED', '#A855F7', '#C084FC', '#DDD6FE', '#EDE9FE', '#F3E8FF', '#8B5CF6'];

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview and management of the InclusiTrack platform</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Add User Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Data Officer or Beneficiary</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'User Management' },
            { id: 'officers', label: 'Data Entry Officers' },
            { id: 'businesses', label: 'Businesses' },
            { id: 'analytics', label: 'Analytics' }
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
              title="Total Users"
              value={users.length.toString()}
              icon={Users}
              color="purple"
              change={`${pendingUsers.length} pending approval`}
            />
            <StatsCard
              title="Approved Users"
              value={approvedUsers.length.toString()}
              icon={UserCheck}
              color="green"
              change={`${Math.round((approvedUsers.length / users.length) * 100)}% approval rate`}
            />
            <StatsCard
              title="Data Entry Officers"
              value={officers.length.toString()}
              icon={Users}
              color="blue"
              change={`${officers.reduce((sum, o) => sum + o.registeredBeneficiaries, 0)} registrations`}
            />
            <StatsCard
              title="Active Businesses"
              value={businesses.filter(b => b.status === 'active').length.toString()}
              icon={Building2}
              color="yellow"
              change={`${businesses.length} total businesses`}
            />
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Registrations</h3>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500">{user.role} • {user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={getStatusBadge(user.status)}>
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
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
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(user.status)}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveUser(user.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => rejectUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Data Entry Officers Tab */}
      {activeTab === 'officers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {officers.map((officer) => (
              <div key={officer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {officer.firstName} {officer.lastName}
                  </h3>
                  <span className={getStatusBadge(officer.status)}>
                    {officer.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Employee ID:</strong> {officer.employeeId}</p>
                  <p><strong>Email:</strong> {officer.email}</p>
                  <p><strong>Phone:</strong> {officer.phoneNumber}</p>
                  <p><strong>Registrations:</strong> {officer.registeredBeneficiaries}</p>
                  <div>
                    <strong>Assigned Counties:</strong>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {officer.assignedCounties.map((county) => (
                        <span key={county} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {county}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Businesses Tab */}
      {activeTab === 'businesses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{businessStats.active || 0}</div>
              <p className="text-sm text-gray-600">Active Businesses</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">{businessStats.planning || 0}</div>
              <p className="text-sm text-gray-600">In Planning</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{businessStats.completed || 0}</div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">{businessStats.failed || 0}</div>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Businesses</h3>
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
                      County
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Funding
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {businesses.map((business) => {
                    const owner = beneficiaries.find(b => b.id === business.beneficiaryId);
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
                          {business.county}
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* County Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Counties by Beneficiaries</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countyChartData}>
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
                  <Bar dataKey="value" fill="#7C3AED" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Vulnerable Groups */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vulnerable Groups Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vulnerableGroupChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vulnerableGroupChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</div>
                    <div><strong>Email:</strong> {selectedUser.email}</div>
                    <div><strong>Phone:</strong> {selectedUser.phoneNumber}</div>
                    <div><strong>Role:</strong> {selectedUser.role}</div>
                    <div><strong>Status:</strong> {selectedUser.status}</div>
                    <div><strong>County:</strong> {selectedUser.county}</div>
                  </div>
                </div>

                {selectedUser.role === 'beneficiary' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Beneficiary Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>ID Number:</strong> {selectedUser.idNumber}</div>
                      <div><strong>Date of Birth:</strong> {selectedUser.dateOfBirth}</div>
                      <div><strong>Gender:</strong> {selectedUser.gender}</div>
                      <div><strong>Vulnerable Group:</strong> {selectedUser.vulnerableGroup}</div>
                      <div><strong>Monthly Income:</strong> KSh {selectedUser.monthlyIncome?.toLocaleString()}</div>
                      <div><strong>Children:</strong> {selectedUser.numberOfChildren}</div>
                    </div>
                  </div>
                )}

                {selectedUser.role === 'data_entry_officer' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Officer Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Employee ID:</strong> {selectedUser.employeeId}</div>
                      <div><strong>Registrations:</strong> {selectedUser.registeredBeneficiaries}</div>
                    </div>
                    <div className="mt-4">
                      <strong>Assigned Counties:</strong>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedUser.assignedCounties?.map((county: string) => (
                          <span key={county} className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                            {county}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <ParticipantForm onSuccess={() => setShowAddForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};