import React, { useEffect, useState } from 'react';
import { fetchDepartments, fetchEmployees } from '../../utils/EmployeHelper';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaUser, FaDollarSign, FaCalendar, FaArrowLeft, FaPlus, FaMoneyBillWave } from 'react-icons/fa';
import Navbar from '../DashBoard/navBar';

const AddSalary = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [employeesData, setEmployeesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [employee, setEmployee] = useState({
        employeeId: '',
        basicSalary: '',
        Allowance: '',
        Deductation: '',
        payDate: '',
        month: ''
    });

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const res = await fetchDepartments();
                setDepartments(res);
            } catch (error) {
                console.log("Error fetching departments:", error.message);
            }
        };
        getDepartments();
    }, []);

    const handleDepartment = async (e) => {
        try {
            const emps = await fetchEmployees(e.target.value);
            setEmployeesData(emps);
        } catch (error) {
            console.log("Error fetching employees:", error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "employeeId") {
            const emp = employeesData.find(emp => emp._id === value);
            setEmployee(prev => ({
                ...prev,
                employeeId: emp._id,
                employeeName: emp.userID.name
            }));
        } else {
            setEmployee(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `http://localhost:5699/api/salary/add`,
                employee,
                {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                }
            );
            if (res.data.success) {
                toast.success("Salary Added Successfully");
                setTimeout(() => navigate('/admin-dashboard/salary/add'), 1200);
            }
        } catch (error) {
            console.log(error.response?.data?.error || error.message);
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50'>
            <Navbar />
            <div className='p-6'>
                {/* Header Section */}
                <div className='max-w-5xl mx-auto mb-6'>
                    <button 
                        onClick={() => navigate('/admin-dashboard')}
                        className='flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors mb-4'
                    >
                        <FaArrowLeft />
                        <span className='font-medium'>Back to Dashboard</span>
                    </button>
                    
                    <div className='bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500'>
                        <h2 className='text-3xl font-bold text-gray-800 mb-2 flex items-center'>
                            <FaMoneyBillWave className='mr-3 text-green-600' />
                            Add Salary Record
                        </h2>
                        <p className='text-gray-600'>Process and record employee salary payments</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className='max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8'>
                    <form onSubmit={handleSubmit}>
                        {/* Employee Selection */}
                        <div className='mb-8'>
                            <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                                <span className='w-1.5 h-6 bg-green-500 rounded-full mr-3'></span>
                                Employee Selection
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Department */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaBuilding className='inline mr-2 text-green-600' />
                                        Department
                                    </label>
                                    <select
                                        required
                                        name='department'
                                        onChange={handleDepartment}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition'
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dep => (
                                            <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Employee */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaUser className='inline mr-2 text-green-600' />
                                        Employee Name
                                    </label>
                                    <select
                                        required
                                        name='employeeId'
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition'
                                    >
                                        <option value="">Select Employee</option>
                                        {employeesData.map(emp => (
                                            <option key={emp._id} value={emp._id}>
                                                {emp.employeeId} - {emp.userID.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Salary Details */}
                        <div className='mb-8'>
                            <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                                <span className='w-1.5 h-6 bg-blue-500 rounded-full mr-3'></span>
                                Salary Breakdown
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                {/* Basic Salary */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaDollarSign className='inline mr-2 text-blue-600' />
                                        Basic Salary
                                    </label>
                                    <input
                                        type="number"
                                        name='basicSalary'
                                        placeholder='0.00'
                                        required
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                                    />
                                </div>

                                {/* Allowances */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaDollarSign className='inline mr-2 text-green-600' />
                                        Allowances
                                    </label>
                                    <input
                                        type="number"
                                        name='Allowance'
                                        placeholder='0.00'
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition'
                                    />
                                </div>

                                {/* Deduction */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaDollarSign className='inline mr-2 text-red-600' />
                                        Deductions
                                    </label>
                                    <input
                                        type="number"
                                        name='Deductation'
                                        placeholder='0.00'
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className='mb-8'>
                            <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                                <span className='w-1.5 h-6 bg-purple-500 rounded-full mr-3'></span>
                                Payment Details
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Salary Month */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaCalendar className='inline mr-2 text-purple-600' />
                                        Salary Month
                                    </label>
                                    <input
                                        type="month"
                                        name="month"
                                        required
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition'
                                    />
                                </div>

                                {/* Pay Date */}
                                <div>
                                    <label className='block text-sm font-semibold text-gray-700 mb-2'>
                                        <FaCalendar className='inline mr-2 text-purple-600' />
                                        Payment Date
                                    </label>
                                    <input
                                        type="date"
                                        name='payDate'
                                        required
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200'>
                            <button 
                                type="button"
                                onClick={() => navigate('/admin-dashboard')}
                                className='px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className='px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPlus />
                                        <span>Add Salary</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSalary;