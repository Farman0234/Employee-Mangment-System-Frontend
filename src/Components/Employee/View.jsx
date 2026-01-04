import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaEdit, FaIdCard, FaCalendar, FaVenusMars, FaBuilding, FaRing, FaEnvelope, FaBriefcase, FaDollarSign } from 'react-icons/fa'
import { useAuth } from '../../utils/AuthProvider';


const View = () => {
    const { id } = useParams();
    const {user} = useAuth()
    const [employee, setEmployees] = useState(null);
    const [empLoading, setEmpLoaading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            setEmpLoaading(true);
            try {
                const response = await axios.get(`https://employee-mangment-system-backend.vercel.app/api/employee/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json"
                        }
                    });

                if (response.data.success) {
                    console.log(response.data)
                    setEmployees(response.data.employee);
                }
            } catch (error) {
                console.log(error.response?.data?.error || error.message);
            } finally {
                setEmpLoaading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    if (empLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50">
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading employee details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50">

                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                        <p className="text-gray-600 text-lg mb-4">Employee not found</p>
                        <Link to="/admin-dashboard/employee" className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">
                            Back to List
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50">

            <div className="py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/admin-dashboard/employee')}
                        className='flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors mb-6'
                    >
                        <FaArrowLeft />
                        <span className='font-medium'>Back to Employees</span>
                    </button>

                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Cover Section */}
                        <div className="relative h-32 bg-gradient-to-r from-teal-500 to-teal-600">
                            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                                <div className="relative">
                                    <img
                                        src={
                                            employee?.userID?.profileImage
                                                ? `http://localhost:5699/uploads/${employee.userID.profileImage}`
                                                : "/avatar.png"
                                        }
                                        alt="Employee"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                                    />
                                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="pt-20 pb-6 px-6 text-center">
                            <h3 className="text-3xl font-bold text-gray-800">
                                {employee?.userID?.name || "N/A"}
                            </h3>
                            <p className="text-gray-500 mt-1 flex items-center justify-center">
                                <FaBriefcase className="mr-2" />
                                {employee?.designation || "No Designation"}
                            </p>
                            <p className="text-teal-600 font-medium mt-1 flex items-center justify-center">
                                <FaBuilding className="mr-2" />
                                {employee?.department?.dep_name || "No Department"}
                            </p>
                        </div>

                        {/* Details Section */}
                        <div className="px-6 pb-8">
                            {/* Personal Information */}
                            <div className="mb-8">
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-1.5 h-6 bg-teal-500 rounded-full mr-3"></span>
                                    Personal Information
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
                                                    {employee?.employeeId || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaEnvelope className="text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-purple-600 uppercase">Email</p>
                                                <p className="text-sm font-bold text-gray-800 truncate">
                                                    {employee?.userID?.email || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-pink-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaCalendar className="text-pink-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-pink-600 uppercase">Date of Birth</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {employee?.dateofbirth
                                                        ? new Date(employee.dateofbirth).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })
                                                        : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-indigo-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaVenusMars className="text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-indigo-600 uppercase">Gender</p>
                                                <p className="text-lg font-bold text-gray-800 capitalize">
                                                    {employee?.gender || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Marital Status */}
                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaRing className="text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-amber-600 uppercase">Marital Status</p>
                                                <p className="text-lg font-bold text-gray-800 capitalize">
                                                    {employee?.materialStatus || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-pink-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaCalendar className="text-pink-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-pink-600 uppercase">joiningDate</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {employee?.joiningDate
                                                        ? new Date(employee.joiningDate).toLocaleDateString('en-US', {
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

                            {/* Employment Information */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                                    Employment Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Designation */}
                                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-teal-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaBriefcase className="text-teal-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-teal-600 uppercase">Designation</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {employee?.designation || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Salary */}
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center mr-3">
                                                <FaDollarSign className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-green-600 uppercase">Salary</p>
                                                <p className="text-lg font-bold text-gray-800">
                                                    {employee?.salary?.toLocaleString() || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                         {user.role ==="admin" && (
                        <div className="px-6 pb-8 flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-200 pt-6">
                            <Link
                                to={`/admin-dashboard/employee/edit/${id}`}
                                className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                <FaEdit />
                                <span>Edit Profile</span>
                            </Link>
                            <Link
                                to="/admin-dashboard/employee"
                                className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg text-center"
                            >
                                Back to List
                            </Link>
                        </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default View