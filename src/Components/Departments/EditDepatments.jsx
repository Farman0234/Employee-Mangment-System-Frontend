import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaBuilding, FaFileAlt, FaArrowLeft, FaSave } from 'react-icons/fa';
import Navbar from '../DashBoard/navBar';

const EditDepartments = () => {
    const { id } = useParams();
    const [department, setDepartment] = useState({ dep_name: '', description: '' });
    const [depLoading, setDepLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartment({ ...department, [name]: value });
    }

    useEffect(() => {
        const fetchDepartments = async () => {
            setDepLoading(true);
            try {
                const response = await axios.get(`https://employee-mangment-backend.vercel.app/api/department/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.data.success) {
                    setDepartment(response.data.dep);
                }
            } catch (error) {
                console.log(error.response?.data?.error || error.message);
                toast.error('Failed to load department');
            } finally {
                setDepLoading(false);
            }
        };

        fetchDepartments();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`https://employee-mangment-backend.vercel.app/api/department/${id}`, department, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            });
            if (response.data.success) {
                toast.success('Department updated successfully');
                setTimeout(() => {
                    navigate('/admin-dashboard/departments');
                }, 1200);
            }
        } catch (error) {
            console.log(error.response?.data?.error || error.message);
            toast.error(error.response?.data?.error || 'Failed to update department');
        } finally {
            setLoading(false);
        }
    }

    if (depLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading department...</p>
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
                <div className='max-w-4xl mx-auto mb-6'>
                    <button 
                        onClick={() => navigate('/admin-dashboard/departments')}
                        className='flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4'
                    >
                        <FaArrowLeft />
                        <span className='font-medium'>Back to Departments</span>
                    </button>
                    
                    <div className='bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500'>
                        <h2 className='text-3xl font-bold text-gray-800 mb-2 flex items-center'>
                            <FaBuilding className='mr-3 text-blue-600' />
                            Edit Department
                        </h2>
                        <p className='text-gray-600'>Update department information and details</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8'>
                    <form onSubmit={handleSubmit}>
                        <div className='space-y-6'>
                            <div>
                                <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                                    <span className='w-1.5 h-6 bg-blue-500 rounded-full mr-3'></span>
                                    Department Information
                                </h3>
                            </div>

                            {/* Department Name */}
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                    <FaBuilding className='inline mr-2 text-blue-600' />
                                    Department Name
                                </label>
                                <input 
                                    type="text" 
                                    name="dep_name" 
                                    placeholder='e.g. Human Resources, IT, Marketing'
                                    required
                                    value={department.dep_name}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                    onChange={handleChange} 
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                    <FaFileAlt className='inline mr-2 text-blue-600' />
                                    Description
                                </label>
                                <textarea 
                                    name="description" 
                                    placeholder='Enter department description...'
                                    required
                                    value={department.description}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none'
                                    rows="6" 
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row gap-4 justify-end pt-6 mt-6 border-t border-gray-200'>
                            <button 
                                type="button"
                                onClick={() => navigate('/admin-dashboard/departments')}
                                className='px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
                            >
                                Cancel
                            </button>
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

export default EditDepartments