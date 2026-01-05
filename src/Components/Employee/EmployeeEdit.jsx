import React, { useEffect, useState } from 'react'
import { fetchDepartments } from '../../utils/EmployeHelper';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaRing, FaBriefcase, FaBuilding, FaDollarSign, FaUserTag, FaArrowLeft, FaSave } from 'react-icons/fa';
import Navbar from '../DashBoard/navBar';

const EmployeeEdit = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [employee, setEmployees] = useState({
        name: "",
        materialStatus: "",
        designation: "",
        salary: 0,
        department: "",
        role: ""
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    const { id } = useParams()

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const res = await fetchDepartments()
                setDepartments(res);
            }
            catch (error) {
                console.log("Error fetching departments:", error.message);
            }
        }
        getDepartments();
    }, [])

    useEffect(() => {
        const fetchEmployee = async () => {
            setFetchLoading(true);
            try {
                const response = await axios.get(`https://employee-mangment-backend.vercel.app/api/employee/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json"
                        }
                    });

                if (response.data.success) {
                    console.log(response.data)
                    const employee = response.data.employee
                    setEmployees((prev) => ({
                        ...prev, 
                        name: employee.userID.name, 
                        materialStatus: employee.materialStatus,
                        designation: employee.designation,
                        salary: employee.salary,
                        department: employee.department._id,
                        role: employee.userID.role
                    }));
                }
            } catch (error) {
                console.log(error.response?.data?.error || error.message);
                toast.error('Failed to load employee data');
            } finally {
                setFetchLoading(false);
            }
        };
        fetchEmployee();
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`http://localhost:5699/api/employee/${id}`, employee, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.data.success) {
                console.log(response.data)
                toast.success('Employee updated successfully');
                setTimeout(() => {
                    navigate('/admin-dashboard/employee');
                }, 1200);
            }
        } catch (error) {
            console.log(error.response?.data?.error || error.message);
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployees((prevData) => ({ ...prevData, [name]: value }));
    }

    if (fetchLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50'>
                <Navbar />
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading employee data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50'>
            <Navbar />
            <div className='p-6'>
                {/* Header Section */}
                <div className='max-w-5xl mx-auto mb-6'>
                    <button 
                        onClick={() => navigate('/admin-dashboard/employee')}
                        className='flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors mb-4'
                    >
                        <FaArrowLeft />
                        <span className='font-medium'>Back to Employees</span>
                    </button>
                    
                    <div className='bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500'>
                        <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                            Edit Employee
                        </h2>
                        <p className='text-gray-600'>Update employee information and details</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className='max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8'>
                    <form onSubmit={handleSubmit}>
                        {/* Personal Information */}
                        <div className='mb-8'>
                            <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                                <span className='w-1.5 h-6 bg-teal-500 rounded-full mr-3'></span>
                                Personal Information
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Name */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaUser className='inline mr-2 text-teal-600' />
                                        Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder='Enter full name' 
                                        required
                                        name='name'
                                        value={employee.name}
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition'
                                    />
                                </div>

                                {/* Marital Status */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaRing className='inline mr-2 text-teal-600' />
                                        Marital Status
                                    </label>
                                    <select 
                                        required
                                        onChange={handleChange}
                                        value={employee.materialStatus}
                                        name='materialStatus'
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition'
                                    >
                                        <option value="">Select Status</option>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="divorced">Divorced</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Employment Information */}
                        <div className='mb-8'>
                            <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                                <span className='w-1.5 h-6 bg-blue-500 rounded-full mr-3'></span>
                                Employment Details
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Designation */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaBriefcase className='inline mr-2 text-blue-600' />
                                        Designation
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder='e.g. Senior Developer' 
                                        required
                                        onChange={handleChange}
                                        value={employee.designation}
                                        name='designation'
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                    />
                                </div>

                                {/* Salary */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaDollarSign className='inline mr-2 text-blue-600' />
                                        Salary
                                    </label>
                                    <input 
                                        type="number" 
                                        placeholder='Enter salary amount' 
                                        required 
                                        name='salary'
                                        onChange={handleChange}
                                        value={employee.salary}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaUserTag className='inline mr-2 text-blue-600' />
                                        Role
                                    </label>
                                    <select 
                                        required
                                        name='role'
                                        onChange={handleChange}
                                        value={employee.role}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                    >
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="employee">Employee</option>
                                    </select>
                                </div>

                                {/* Department */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaBuilding className='inline mr-2 text-blue-600' />
                                        Department
                                    </label>
                                    <select 
                                        required
                                        name='department'
                                        value={employee.department}
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                    >
                                        <option value="">Select Department</option>
                                        {Array.isArray(departments) && departments.map((department) => (
                                            <option key={department._id} value={department._id}>
                                                {department.dep_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200'>
                            <Link 
                                to="/admin-dashboard/employee"
                                className='px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center'
                            >
                                Cancel
                            </Link>
                            <button 
                                type="submit"
                                disabled={loading}
                                className='px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EmployeeEdit;