import React from 'react';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../utils/AuthProvider';

const EmpSummary = () => {
    const { user } = useAuth();

    // Get current time for dynamic greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="rounded-xl m-6 p-5 flex items-center bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white rounded-full translate-y-1/2"></div>
            </div>

            {/* Avatar */}
            <div className="relative z-10 p-4 bg-white text-teal-700 rounded-full text-4xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">

                <FaUser />

            </div>

            {/* Text Content */}
            <div className="ml-5 relative z-10 flex-1">
                <p className="text-sm font-medium opacity-90 tracking-wide">
                    {getGreeting()},
                </p>
                <p className="text-2xl font-bold mt-0.5 tracking-tight">
                    {user?.name || 'Employee'}
                </p>
                {user?.department && (
                    <p className="text-xs opacity-80 mt-1 font-medium">
                        {user.department}
                    </p>
                )}
            </div>

            {/* Optional: Badge or status indicator */}
            {user?.status && (
                <div className="relative z-10 hidden sm:flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs font-medium">Active</span>
                </div>
            )}
        </div>
    );
};

export default EmpSummary;