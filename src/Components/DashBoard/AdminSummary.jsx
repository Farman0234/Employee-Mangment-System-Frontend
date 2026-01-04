import React, { useEffect, useState } from 'react'
import SummaryCard from './SummaryCard'
import { FaBuilding, FaCheckCircle, FaFileAlt, FaHourglassHalf, FaMoneyBillWave, FaTimesCircle, FaUsers } from 'react-icons/fa'
import Navbar from './navBar'
import { Link } from 'react-router-dom'
import axios from 'axios'

const AdminSummary = () => {

    const [summary, setSummary] = useState(null)

    useEffect(() => {

        const fetchSummary = async () => {
            try {
                const summary = await axios('http://localhost:5699/api/dashboard/summary', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                console.log(summary)
                setSummary(summary.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchSummary();
    },
        [])


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PKR'
        }).format(amount);
    };
    if (!summary) {
        return <div>Loading......</div>
    }
    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50'>
            {/* Navbar */}
            <Navbar />
            <div className='p-9 '>
                {/* Welcome Section */}
                <div className='bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-teal-500'>
                    <div className='flex items-center justify-between flex-wrap gap-4'>
                        <div>
                            <h3 className='text-3xl font-bold text-gray-800 mb-2'>
                                Dashboard Overview
                            </h3>
                            <p className='text-gray-600'>Welcome back! Here's what's happening today.</p>
                        </div>
                        <div className='text-right'>
                            <p className='text-sm text-gray-500'>Last updated</p>
                            <p className='text-lg font-semibold text-teal-600'>
                                {new Date().toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Main Statistics */}
                <div className='mb-10'>
                    <h4 className='text-lg font-semibold text-gray-700 mb-4 flex items-center'>
                        <span className='w-1 h-6 bg-teal-500 rounded-full mr-3'></span>
                        Organization Statistics
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <SummaryCard
                            icon={<FaUsers />}
                            text="Total Employees"
                            number={summary.totalEmployee}
                            color='bg-teal-600'
                        />
                        <SummaryCard
                            icon={<FaBuilding />}
                            text="Total Departments"
                            number={summary.totalDepartment}
                            color='bg-blue-600'
                        />
                        <SummaryCard
                            icon={<FaMoneyBillWave />}
                            text="Monthly Payroll"
                            number={formatCurrency(summary.totalSalary)}
                            color='bg-purple-600'
                        />
                    </div>
                </div>

                {/* Leave Management Section */}
                <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8'>
                    <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-200'>
                        <div>
                            <h4 className='text-2xl font-bold text-gray-800 flex items-center'>
                                <span className='w-2 h-8 bg-teal-500 rounded-full mr-3'></span>
                                Leave Management
                            </h4>
                            <p className='text-gray-600 ml-5 mt-1'>Track and manage employee leave requests</p>
                        </div>
                        <Link to='/admin-dashboard/leaves' className='hidden md:block px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-md'>
                            View All
                        </Link>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                        <SummaryCard
                            icon={<FaFileAlt />}
                            text="Leave Requests"
                            number={summary.leaveSummary.appliedFor.length}
                            color='bg-indigo-600'
                            subtitle="Total requests"
                        />
                        <SummaryCard
                            icon={<FaCheckCircle />}
                            text="Approved"
                            number={summary.leaveSummary.approved}
                            color='bg-green-600'
                            subtitle="Approved requests"
                        />
                        <SummaryCard
                            icon={<FaHourglassHalf />}
                            text="Pending"
                            number={summary.leaveSummary.pending}
                            color='bg-amber-600'
                            subtitle="Awaiting review"
                        />
                        <SummaryCard
                            icon={<FaTimesCircle />}
                            text="Rejected"
                            number={summary.leaveSummary.rejected}
                            color='bg-rose-600'
                            subtitle="Rejected requests"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSummary