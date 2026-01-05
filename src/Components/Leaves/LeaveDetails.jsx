import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaEdit, FaIdCard, FaCalendar, FaVenusMars, FaBuilding, FaRing, FaEnvelope, FaBriefcase, FaDollarSign } from 'react-icons/fa'
import Navbar from '../DashBoard/navBar'
import toast from 'react-hot-toast';

const LeaveDetails = () => {
    const { id } = useParams();
    const [leave, setLeave] = useState(null);
   
    const [empLoading, setEmpLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeave = async () => {
            setEmpLoading(true);
            try {
                const response = await axios.get(`https://employee-mangment-backend.vercel.app/api/leaves/detail/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json"
                        }
                    });

                if (response.data.success) {
                    console.log(response.data)
                    setLeave(response.data.leaves);
                }
            } catch (error) {
                console.log(error.response?.data?.error || error.message);
            } finally {
                setEmpLoading(false);
            }
        };

        fetchLeave();
    }, [id]);

    const changeStatus = async (id, status) => {
        try {
            const response = await axios.put(
                `https://employee-mangment-backend.vercel.app/api/leaves/${id}`,
                { status: status }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log(response);
            if (response.data.success) {
                toast.success(response.data.leaves.status);
                setTimeout(() => {
                    navigate('/admin-dashboard/leaves');
                }, 1200);
            }
        } catch (error) {
            console.log(error.response?.data?.error || error.message);
        } finally {
            setEmpLoading(false);
        }
    }





    if (empLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading leave details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!leave) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                        <p className="text-gray-600 text-lg mb-4">Leave request not found</p>
                        <Link to="/admin-dashboard/leaves" className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">
                            Back to List
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const days = Math.max(
        1,
        Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1
    );

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
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50'>
            <Navbar />
            <div className="py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/admin-dashboard/leaves')}
                        className='flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors mb-6'
                    >
                        <FaArrowLeft />
                        <span className='font-medium'>Back to leaves</span>
                    </button>

                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Cover Section */}
                        <div className="relative h-32 bg-gradient-to-r from-teal-500 to-teal-600">
                            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                                <div className="relative">
                                    <img
                                        src={
                                            leave.employeeId.userID?.profileImage
                                                ? `http://localhost:5699/uploads/${leave.employeeId.userID.profileImage}`
                                                : "/avatar.png"
                                        }
                                        alt="Employee"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                                    />
                                    <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-white ${leave?.status === 'approved' ? 'bg-green-500' :
                                        leave?.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}></div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="pt-20 pb-6 px-6 text-center">
                            <h3 className="text-3xl font-bold text-gray-800">
                                {leave.employeeId.userID.name || "N/A"}
                            </h3>
                            <p className="text-gray-500 mt-1 flex items-center justify-center">
                                <FaBriefcase className="mr-2" />
                                {leave?.employeeId?.designation || "No Designation"}
                            </p>
                            <p className="text-teal-600 font-medium mt-1 flex items-center justify-center">
                                <FaBuilding className="mr-2" />
                                {leave?.employeeId?.department?.dep_name || "No Department"}
                            </p>
                            <div className="mt-4">
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(leave?.status)}`}>
                                    Status: {leave?.status?.charAt(0).toUpperCase() + leave?.status?.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="px-6 pb-8">
                            {/* Leave Information */}
                            <div className="mb-8">
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-1.5 h-6 bg-teal-500 rounded-full mr-3"></span>
                                    Leave Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Employee ID */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaIdCard className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-blue-600 uppercase">Employee ID</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {leave?.employeeId?.employeeId || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Leave Type */}
                                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-pink-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaBriefcase className="text-pink-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-pink-600 uppercase">Leave Type</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {leave?.leaveType || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-indigo-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaCalendar className="text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-indigo-600 uppercase">Duration</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {days} {days === 1 ? 'Day' : 'Days'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Start Date */}
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaCalendar className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-green-600 uppercase">Start Date</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {leave?.startDate
                                                        ? new Date(leave.startDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* End Date */}
                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaCalendar className="text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-amber-600 uppercase">End Date</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {leave?.endDate
                                                        ? new Date(leave.endDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            {leave?.reason && (
                                <div className="mb-8">
                                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                                        Reason
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <p className="text-gray-700 leading-relaxed">
                                            {leave.reason}
                                        </p>
                                    </div>
                                </div>
                            )}


                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 pb-8 flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-200 pt-6">
                            {leave?.status?.toLowerCase() === 'pending' && (
                                <>
                                    <button
                                        onClick={() => changeStatus(leave._id, "Approved")}
                                        className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                                    >

                                        <span>Approve</span>
                                    </button>
                                    <button
                                        onClick={() => changeStatus(leave._id, "Rejected")}
                                        className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                                    >

                                        <span>Reject</span>
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => navigate('/admin-dashboard/leaves')}
                                className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg text-center"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeaveDetails