import React, { useState } from 'react';
import { useAuth } from '../utils/AuthProvider.jsx';
import { Outlet } from 'react-router-dom';
import EmpSideBar from '../Components/EmpDasboard/EmpSideBar.jsx';
import Navbar from '../Components/DashBoard/navBar.jsx';

function EmployeeDashboard() {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <EmpSideBar
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Navbar at top */}
        <Navbar />
        
        {/* Page content */}
        <Outlet />
      </div>
    </div>
  );
}

export default EmployeeDashboard;