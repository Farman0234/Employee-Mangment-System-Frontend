import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../utils/AuthProvider';
import { FaCalendarAlt, FaFileAlt, FaPaperPlane } from 'react-icons/fa';

const AddLeaves = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [leaveData, setLeaveData] = useState({
    leaveType: 'sick',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [leaveBalance, setLeaveBalance] = useState({
    sick: 10,
    casual: 10,
    annual: 10,
    unpaid: 0
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData(prev => ({ ...prev, [name]: value }));
  };

  // Calculate leave days
  const calculateDays = () => {
    if (leaveData.startDate && leaveData.endDate) {
      const start = new Date(leaveData.startDate);
      const end = new Date(leaveData.endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  // Submit leave request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(leaveData.endDate) < new Date(leaveData.startDate)) {
      toast.error('End date cannot be before start date');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://employee-mangment-backend.vercel.app/api/leaves/add',
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(response.data);
      if (response.data.success) {
        toast.success('Leave request submitted successfully');
        // Update leave balance from backend if provided
        if (response.data.leaveBalance) {
          setLeaveBalance(response.data.leaveBalance);
        }
        setTimeout(() => navigate('/employee-dashboard'), 1200);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit leave');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic color mapping
  const colors = {
    sick: { bg: 'bg-green-50', text: 'text-green-600' },
    casual: { bg: 'bg-purple-50', text: 'text-purple-600' },
    annual: { bg: 'bg-blue-50', text: 'text-blue-600' },
    unpaid: { bg: 'bg-orange-50', text: 'text-orange-600' }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Request Leave</h2>
          <p className="text-gray-600">Submit a new leave application</p>
        </div>

        {/* Leave Balance */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Leave Balance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(leaveBalance || {}).map(([type, value]) => (
              <div key={type} className={`text-center p-3 rounded-lg ${colors[type]?.bg || 'bg-gray-100'}`}>
                <p className={`text-2xl font-bold ${colors[type]?.text || 'text-gray-600'}`}>{value}</p>
                <p className="text-sm text-gray-600">{type.charAt(0).toUpperCase() + type.slice(1)} Leave</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FaFileAlt className="mr-2 text-teal-600" /> Leave Type
              </label>
              <select
                name="leaveType"
                value={leaveData.leaveType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              >
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="annual">Annual Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendarAlt className="mr-2 text-teal-600" /> Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={leaveData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendarAlt className="mr-2 text-teal-600" /> End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={leaveData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>
            </div>

            {/* Duration */}
            {leaveData.startDate && leaveData.endDate && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <p className="text-teal-800 font-semibold">
                  Total Duration: <span className="text-teal-600">{calculateDays()} day(s)</span>
                </p>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FaFileAlt className="mr-2 text-teal-600" /> Reason for Leave
              </label>
              <textarea
                name="reason"
                value={leaveData.reason}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Please provide a detailed reason for your leave..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : <><FaPaperPlane /> Submit Request</>}
              </button>
              <button
                type="button"
                onClick={() => navigate('/employee-dashboard/leaves')}
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLeaves;
