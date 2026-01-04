import React from 'react'

const SummaryCard = ({ icon, text, number, color, trend, trendUp, subtitle }) => {
    return (
        <div className="rounded-xl flex bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
            {/* Icon Section */}
            <div className={`${color} text-white flex justify-center items-center px-6 text-4xl`}> 
                {icon}
            </div>
            
            {/* Content Section */}
            <div className="flex-1 px-5 py-4">
                <p className="text-sm font-medium text-gray-600 mb-1">{text}</p>
                <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-gray-800">{number}</p>
                    {trend && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {trendUp ? '↑' : '↓'} {trend}
                        </span>
                    )}
                </div>
                {subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    )
}

export default SummaryCard