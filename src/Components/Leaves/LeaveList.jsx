import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaSearch, FaPlus, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../utils/AuthProvider';

const LeaveList = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [leaves, setLeaves] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // const {empID} = useParams()
  // const id = user.role === 'admin' ? user._id : empID
  const {id} = useParams()

  const fetchLeaves = async () => { 
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5699/api/leaves/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(res)
      if (res.data.success) {
        setLeaves(res.data.leave);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to fetch leaves';
      console.error('Fetch leaves error:', error);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);


  if(!leaves){
    return <div>Loading</div>
  }

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredLeaves = leaves.filter(leave =>
    leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leave.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leave.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Leaves</h1>
              <p className="text-gray-600">View and manage employee leave requests</p>
            </div>
            {user.role ==="employee" && (
            <Link
              to="/employee-dashboard/leaves/add-leaves"
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              <FaPlus className="text-sm" />
              Add New Leave
            </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by leave type, reason, or status..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading leaves...</p>
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <FaFileAlt className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No leaves found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Try adjusting your search terms' : 'Start by adding a new leave request'}
              </p>
              {!searchQuery && (
                <Link
                  to="/employee-dashboard/add-leave"
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <FaPlus className="text-sm" />
                  Add New Leave
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">S.No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeaves.map((leave, index) => (
                    <tr key={leave._id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div >
                            {/* <FaFileAlt className="text-teal-600 text-sm" /> */}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{leave.leaveType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                         
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">
                              {new Date(leave.startDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-gray-500">
                              to {new Date(leave.endDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate" title={leave.reason}>
                          {leave.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(leave.status)}`}>
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {!isLoading && filteredLeaves.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {filteredLeaves.length} of {leaves.length} leave{leaves.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveList;