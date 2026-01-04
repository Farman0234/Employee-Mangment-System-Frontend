import React, { useEffect, useState } from 'react'
import { fetchDepartments } from '../../utils/EmployeHelper';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCalendar, FaVenusMars, FaRing, FaBriefcase, FaBuilding, FaDollarSign, FaLock, FaUserTag, FaImage, FaArrowLeft } from 'react-icons/fa';
import Navbar from '../DashBoard/navBar';

const Add = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [formsData, setFormsData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const res = await fetchDepartments()
                setDepartments(res);
            }
            catch (error) {
                console.log("Error fetching departments:", error);
            }
        }
        getDepartments();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formDataObj = new FormData()

        Object.keys(formsData).forEach((key) => {
            formDataObj.append(key, formsData[key])
        })
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("https://employee-mangment-system-backend.vercel.app/api/employee/add", formDataObj, {
                headers: { Authorization: `Bearer ${token}` },
                "Content-Type": "multipart/form-data"
            });
            if (response.data.success) {
                console.log(response.data)
                toast.success('Employee added successfully');
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
        const { name, value, files } = e.target;
        if (name === 'profileImage') {
            setFormsData((prevData) => ({ ...prevData, [name]: files[0] }));
            // Image preview
            if (files[0]) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(files[0]);
            }
        } else {
            setFormsData((prevData) => ({ ...prevData, [name]: value }));
        }
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

                    <div className='bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500'>
                        <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                            Add New Employee
                        </h2>
                        <p className='text-gray-600'>Fill in the details below to add a new employee to the system</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className='max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8'>
                    <form onSubmit={handleSubmit}>
                        {/* Image Upload Section */}
                        <div className='mb-8 text-center'>
                            <div className='flex justify-center mb-4'>
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className='w-32 h-32 rounded-full object-cover border-4 border-teal-500 shadow-lg'
                                    />
                                ) : (
                                    <div className='w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-gray-300'>
                                        <FaImage className='text-4xl text-gray-400' />
                                    </div>
                                )}
                            </div>
                            <label className='cursor-pointer inline-block'>
                                <span className='px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium shadow-md inline-flex items-center space-x-2'>
                                    <FaImage />
                                    <span>Upload Profile Image</span>
                                </span>
                                <input
                                    type="file"
                                    onChange={handleChange}
                                    name="profileImage"
                                    accept='image/*'
                                    className='hidden'
                                    required
                                />
                            </label>
                            <p className='text-xs text-gray-500 mt-2'>PNG, JPG up to 5MB</p>
                        </div>

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
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition'
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaEnvelope className='inline mr-2 text-teal-600' />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder='employee@company.com'
                                        required
                                        onChange={handleChange}
                                        name='email'
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition'
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaCalendar className='inline mr-2 text-teal-600' />
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        onChange={handleChange}
                                        name='dateofbirth'
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition'
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaVenusMars className='inline mr-2 text-teal-600' />
                                        Gender
                                    </label>
                                    <select
                                        required
                                        name='gender'
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition'
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
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
                                        name='materialStatus'
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition'
                                    >
                                        <option value="">Select Status</option>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="divorced">Divorced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaCalendar className='inline mr-2 text-teal-600' />
                                        Joining Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        onChange={handleChange}
                                        name='joiningDate'
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition'
                                    />
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
                                        name='designation'
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                    />
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
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                    >
                                        <option value="">Select Department</option>
                                        {Array.isArray(departments) && departments.map((department) => (
                                            <option key={department._id} value={department._id}>{department.dep_name}</option>
                                        ))}
                                    </select>
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
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                    >
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="employee">Employee</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Account Security */}
                        <div className='mb-8'>
                            <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                                <span className='w-1.5 h-6 bg-purple-500 rounded-full mr-3'></span>
                                Account Security
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Password */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaLock className='inline mr-2 text-purple-600' />
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder='Create strong password'
                                        required
                                        name='password'
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition'
                                    />
                                    <p className='text-xs text-gray-500 mt-1'>Minimum 8 characters recommended</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200'>
                            <button
                                type="button"
                                onClick={() => navigate('/admin-dashboard/employee')}
                                className='px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className='px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loading ? (
                                    <span className='flex items-center space-x-2'>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Adding...</span>
                                    </span>
                                ) : (
                                    'Add Employee'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Add