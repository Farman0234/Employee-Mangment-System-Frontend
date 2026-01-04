import React, { useState } from 'react';
import { useAuth } from '../utils/AuthProvider.jsx';
import AdminsideBar from '../Components/DashBoard/AdminsideBar.jsx';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/DashBoard/navBar.jsx';

function AdminDashboard() {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      
      <AdminsideBar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
     
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
      
        <Outlet />
      </div>
    </div>
    
  );
}

export default AdminDashboard;