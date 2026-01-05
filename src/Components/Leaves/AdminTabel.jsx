import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../DashBoard/navBar'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { LeaveButton } from '../../utils/LeaveHelper'

const AdminTabel = () => {
    const [leaves, setLeaves] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [searchQuery, setSearchQuery] = useState('') // Add search query state

    const fetchLeaves = async () => {
        try {
            setLoading(true)
            const res = await axios.get("https://employee-mangment-backend.vercel.app/api/leaves", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log(res)
            if (res.data.success && res.data.leavs) {
                const data = res.data.leavs.map((leave, index) => ({
                    _id: leave._id,
                    srno: index + 1,
                    empID: leave.employeeId?.employeeId || leave.employeeId || "N/A",
                    name: leave.employeeId.userID?.name || "N/A",
                    leaveType: leave.leaveType || "N/A",
                    department: leave.employeeId?.department?.dep_name || "N/A",
                    startDate: leave.startDate,
                    endDate: leave.endDate,
                    days: Math.max(
                        1,
                        Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1
                    ),
                    status: leave.status || "N/A",
                }));

                setLeaves(data)
            }
        } catch (err) {
            console.log(err.message);
            setLeaves([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeaves()
    }, [])

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    // Filter leaves based on status AND search query
    const filteredLeaves = Array.isArray(leaves)
        ? leaves.filter(leave => {
            // Status filter
            const statusMatch = filterStatus === 'all' || leave.status?.toLowerCase() === filterStatus;
            
            // Search filter - check multiple fields
            const searchLower = searchQuery.toLowerCase().trim();
            const searchMatch = searchQuery === '' || 
                leave.empID?.toString().toLowerCase().includes(searchLower) ||
                leave.name?.toLowerCase().includes(searchLower) ||
                leave.leaveType?.toLowerCase().includes(searchLower) ||
                leave.department?.toLowerCase().includes(searchLower) ||
                leave.status?.toLowerCase().includes(searchLower);
            
            return statusMatch && searchMatch;
        })
        : [];

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50'>
            <Navbar />
            <div className="max-w-7xl mx-auto p-6">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Leaves</h1>
                            <p className="text-gray-600">View and manage employee leave requests</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('pending')}
                                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm ${filterStatus === 'pending'
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setFilterStatus('approved')}
                                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm ${filterStatus === 'approved'
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => setFilterStatus('rejected')}
                                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm ${filterStatus === 'rejected'
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Rejected
                            </button>
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm ${filterStatus === 'all'
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by employee ID, name, leave type, department, or status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                        />
                    </div>
                    {searchQuery && (
                        <div className="mt-2 text-sm text-gray-600">
                            Found {filteredLeaves.length} result{filteredLeaves.length !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">S.No</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Leave Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                            Loading leave requests...
                                        </td>
                                    </tr>
                                ) : filteredLeaves.length > 0 ? (
                                    filteredLeaves.map((leave, index) => (
                                        <tr key={leave._id || index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{leave.empID}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{leave.name}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{leave.leaveType}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">{leave.department}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">
                                                    <div className="text-gray-900 font-medium">
                                                        {leave.days} {leave.days === 1 ? 'day' : 'days'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(leave.status)}`}>
                                                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <LeaveButton empid={leave._id} className="text-teal-600 hover:text-teal-800 font-medium text-sm">
                                                    View Details
                                                </LeaveButton>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                            {searchQuery ? `No leave requests found matching "${searchQuery}"` : 'No leave requests found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminTabel