import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useParticipants } from '../context/ParticipantContext';
import { VULNERABLE_GROUPS, KENYAN_COUNTIES } from '../utils/constants';

export const DataManagement: React.FC = () => {
  const { participants, updateParticipant, deleteParticipant } = useParticipants();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [filterCounty, setFilterCounty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = !searchTerm || 
      `${participant.firstName} ${participant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.phoneNumber.includes(searchTerm);
    
    const matchesGroup = !filterGroup || participant.vulnerableGroup === filterGroup;
    const matchesCounty = !filterCounty || participant.county === filterCounty;
    const matchesStatus = !filterStatus || participant.verificationStatus === filterStatus;

    return matchesSearch && matchesGroup && matchesCounty && matchesStatus;
  });

  const updateVerificationStatus = (id: string, status: 'verified' | 'rejected' | 'pending') => {
    const participant = participants.find(p => p.id === id);
    if (participant) {
      updateParticipant({ ...participant, verificationStatus: status });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'verified':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
        <p className="text-gray-600">Manage participant data and verification status</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search participants..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vulnerable Group</label>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Groups</option>
              {VULNERABLE_GROUPS.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
            <select
              value={filterCounty}
              onChange={(e) => setFilterCounty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Counties</option>
              {KENYAN_COUNTIES.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterGroup('');
                setFilterCounty('');
                setFilterStatus('');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vulnerable Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParticipants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{participant.email}</div>
                      <div className="text-sm text-gray-500">{participant.phoneNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {participant.vulnerableGroup}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {participant.county}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {participant.monthlyIncome ? `KSh ${participant.monthlyIncome.toLocaleString()}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(participant.verificationStatus)}>
                      {participant.verificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedParticipant(participant)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateVerificationStatus(participant.id, 'verified')}
                        className="text-green-600 hover:text-green-900"
                        title="Verify"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateVerificationStatus(participant.id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteParticipant(participant.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredParticipants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No participants found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Participant Details Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Participant Details</h2>
                <button
                  onClick={() => setSelectedParticipant(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {selectedParticipant.firstName} {selectedParticipant.lastName}</div>
                    <div><strong>Email:</strong> {selectedParticipant.email}</div>
                    <div><strong>Phone:</strong> {selectedParticipant.phoneNumber}</div>
                    <div><strong>ID Number:</strong> {selectedParticipant.idNumber}</div>
                    <div><strong>Date of Birth:</strong> {selectedParticipant.dateOfBirth}</div>
                    <div><strong>Gender:</strong> {selectedParticipant.gender}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Location & Demographics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>County:</strong> {selectedParticipant.county}</div>
                    <div><strong>Sub-County:</strong> {selectedParticipant.subCounty}</div>
                    <div><strong>Vulnerable Group:</strong> {selectedParticipant.vulnerableGroup}</div>
                    <div><strong>Monthly Income:</strong> KSh {selectedParticipant.monthlyIncome?.toLocaleString() || 'N/A'}</div>
                    <div><strong>Children:</strong> {selectedParticipant.numberOfChildren || 0}</div>
                    <div><strong>Employment:</strong> {selectedParticipant.employmentStatus}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Has Disability:</strong> {selectedParticipant.hasDisability ? 'Yes' : 'No'}</div>
                    <div><strong>Internet Access:</strong> {selectedParticipant.hasInternetAccess ? 'Yes' : 'No'}</div>
                    <div><strong>Smartphone:</strong> {selectedParticipant.hasSmartphone ? 'Yes' : 'No'}</div>
                    <div><strong>Primary Language:</strong> {selectedParticipant.primaryLanguage}</div>
                  </div>
                </div>

                {selectedParticipant.documents && selectedParticipant.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Documents</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedParticipant.documents.map((doc: string, index: number) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedParticipant.additionalNotes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                    <p className="text-sm text-gray-600">{selectedParticipant.additionalNotes}</p>
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