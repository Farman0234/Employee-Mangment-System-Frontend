import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaFileAlt, FaArrowLeft, FaPlus } from 'react-icons/fa';
import Navbar from '../DashBoard/navBar';

const AddDepartments = () => {
    const [departments, setDepartments] = useState({ dep_name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartments({ ...departments, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:5699/api/department/add", departments, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            });
            if (response.data.success) {
                toast.success('Department added successfully');
                setTimeout(() => {
                    navigate('/admin-dashboard/departments');
                }, 1200);
            }
        } catch (error) {
            console.log(error.response?.data?.error || error.message);
            toast.error(error.response?.data?.error || 'Failed to add department');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50'>
            <Navbar />
            <div className='p-6'>
                {/* Header Section */}
                <div className='max-w-4xl mx-auto mb-6'>
                    <button 
                        onClick={() => navigate('/admin-dashboard/departments')}
                        className='flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors mb-4'
                    >
                        <FaArrowLeft />
                        <span className='font-medium'>Back to Departments</span>
                    </button>
                    
                    <div className='bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500'>
                        <h2 className='text-3xl font-bold text-gray-800 mb-2 flex items-center'>
                            <FaBuilding className='mr-3 text-teal-600' />
                            Add New Department
                        </h2>
                        <p className='text-gray-600'>Create a new department and add it to your organization</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8'>
                    <form onSubmit={handleSubmit}>
                        {/* Department Information */}
                        <div className='space-y-6'>
                            <div>
                                <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                                    <span className='w-1.5 h-6 bg-teal-500 rounded-full mr-3'></span>
                                    Department Information
                                </h3>
                            </div>

                            {/* Department Name */}
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                    <FaBuilding className='inline mr-2 text-teal-600' />
                                    Department Name
                                </label>
                                <input 
                                    type="text" 
                                    name="dep_name" 
                                    placeholder='e.g. Human Resources, IT, Marketing'
                                    required
                                    value={departments.dep_name}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition'
                                    onChange={handleChange} 
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                    <FaFileAlt className='inline mr-2 text-teal-600' />
                                    Description
                                </label>
                                <textarea 
                                    name="description" 
                                    placeholder='Enter department description, roles, and responsibilities...'
                                    required
                                    value={departments.description}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none'
                                    rows="6" 
                                    onChange={handleChange}
                                ></textarea>
                                <p className='text-xs text-gray-500 mt-1'>Provide a detailed description of the department's purpose and functions</p>
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
                                className='px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPlus />
                                        <span>Add Department</span>
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

export default AddDepartments;  