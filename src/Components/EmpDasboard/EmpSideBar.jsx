import React from "react";
import { NavLink } from "react-router-dom";
import { FaCalendar, FaCog, FaMoneyBillWave, FaTachometerAlt, FaUsers, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuth } from "../../utils/AuthProvider";

const EmpSideBar = ({ isCollapsed, setIsCollapsed }) => {
  const { user } = useAuth();

  const menuItems = [
    { path: "/employee-dashboard", icon: FaTachometerAlt, label: "Dashboard", end: true },
    { path: `/employee-dashboard/profile/${user?._id}`, icon: FaUsers, label: "Profile", end: true },
    { path: `/employee-dashboard/leaves/${user?._id}`, icon: FaCalendar, label: "Leaves", end: false },
    { path: `/employee-dashboard/salary/${user._id}`, icon: FaMoneyBillWave, label: "Salary", end: false },
    { path: "/employee-dashboard/settings", icon: FaCog, label: "Settings", end: false },
  ];

  return (
    <div className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-screen fixed left-0 top-0 bottom-0 transition-all duration-300 shadow-2xl z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className='bg-gradient-to-r from-teal-600 to-teal-500 h-16 flex items-center justify-center relative shadow-lg'>
        {!isCollapsed && (
          <h3 className='text-2xl font-bold tracking-wider'>
            <span className='text-white'>Employee</span>
            <span className='text-teal-200 ml-1'>MS</span>
          </h3>
        )}
        {isCollapsed && (
          <h3 className='text-2xl font-bold text-white'>
            EMS
          </h3>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='absolute -right-3 top-1/2 -translate-y-1/2 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110 z-50'
        >
          {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className='px-3 mt-6 space-y-1'>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} py-3 px-4 rounded-lg transition-all duration-200 group relative ${isActive
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg shadow-teal-500/50 scale-105'
                  : 'hover:bg-gray-700/50 hover:translate-x-1'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`${isCollapsed ? 'text-xl' : 'text-lg'} ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-teal-400'} transition-colors`} />
                  {!isCollapsed && (
                    <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'} transition-colors`}>
                      {item.label}
                    </span>
                  )}

                  {/* Active Indicator */}
                  {isActive && !isCollapsed && (
                    <span className='absolute right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse'></span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className='absolute left-full ml-6 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50'>
                      {item.label}
                      <div className='absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900'></div>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer - User Section */}
      {!isCollapsed && user && (
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700'>
          <div className='flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors cursor-pointer'>
            <div className='w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg'>
              {user.name ? user.name.charAt(0).toUpperCase() : 'E'}
            </div>
            <div className='flex-1'>
              <p className='text-sm font-semibold text-white'>{user.name || 'Employee'}</p>
              <p className='text-xs text-gray-400'>{user.role || 'Employee'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpSideBar;