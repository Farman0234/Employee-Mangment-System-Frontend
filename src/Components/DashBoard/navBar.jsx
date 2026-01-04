import React, { useState } from 'react'
import { useAuth } from '../../utils/AuthProvider';
import { FaBell, FaEnvelope, FaUserCircle, FaChevronDown, FaSignOutAlt, FaCog, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
 
  return (
    <div className='sticky top-0 z-50 flex items-center justify-between h-16 bg-white shadow-md px-6 border-b border-gray-200'>
      {/* Left Section - Welcome Message */}
      <div className='flex items-center space-x-4'>
        <div className='hidden md:block'>
          <h2 className='text-xl font-bold text-gray-800'>
            Welcome back, <span className='text-teal-600'>{user?.name}</span>
          </h2>
          <p className='text-xs text-gray-500'>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className='md:hidden'>
          <h2 className='text-lg font-bold text-gray-800'>
            Hi, <span className='text-teal-600'>{user?.name}</span>
          </h2>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className='flex items-center space-x-4'>
        {/* User Profile Dropdown */}
        <div className='relative'>
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
            className='flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200'
          >
            <div className='w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-md'>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className='hidden md:block text-left'>
              <p className='text-sm font-semibold text-gray-800'>{user?.name}</p>
              <p className='text-xs text-gray-500'>{user?.role || 'Administrator'}</p>
            </div>
            <FaChevronDown className={`hidden md:block text-gray-400 text-sm transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50'>
              <div className='px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600'>
                <p className='text-white font-semibold'>{user?.name}</p>
                <p className='text-teal-100 text-xs'>{user?.email || 'admin@company.com'}</p>
              </div>
              <div className='border-t border-gray-200 py-2'>
                <button
                  onClick={logout}
                  className='w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-3 transition font-medium'
                >
                  <FaSignOutAlt className='text-red-600' />
                  <span className='text-sm'>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar