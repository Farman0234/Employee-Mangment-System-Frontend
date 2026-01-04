import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import AdminDashboardd from './Pages/AdminDashboardd'
import EmployeeDashboard from './Pages/EmployeeDashboard'
import PrivateRoutes from './utils/PrivateRoutes'
import RoleBaseRoute from './utils/RoleBaseRoute'
import AdminSummary from './Components/DashBoard/AdminSummary'
import DepartmentList from './Components/Departments/DepartmentList'
import AddDepartments from './Components/Departments/AddDepartments'
import EditDepatments from './Components/Departments/EditDepatments'
import { Toaster } from 'react-hot-toast';
import List from './Components/Employee/List'
import Add from './Components/Employee/Add'
import View from './Components/Employee/View'
import EmployeeEdit from './Components/Employee/EmployeeEdit'
import AddSalary from './Components/Salary/AddSalary'
import ViewSalary from './Components/Salary/ViewSalary'
import EmpSummary from './Components/EmpDasboard/EmpSummary'
import EmpProfile from './Components/EmpDasboard/EmpProfile'
import LeaveList from './Components/Leaves/LeaveList'
import AddLeave from './Components/Leaves/AddLeaves'
import Setting from './Components/EmpDasboard/Setting'
import AdminTabel from './Components/Leaves/AdminTabel'
import LeaveDetails from './Components/Leaves/LeaveDetails'
function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path='/' element={<Navigate to="/admin-dashboard" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin-dashboard' element={
          <PrivateRoutes>
            <RoleBaseRoute requireRole={['admin']} >
              <AdminDashboardd />
            </RoleBaseRoute>
          </PrivateRoutes>
        } >
          <Route index element={<AdminSummary />} ></Route>
          <Route path='/admin-dashboard/departments' element={<DepartmentList />} ></Route>
          <Route path='/admin-dashboard/add-departments' element={<AddDepartments />} ></Route>
          <Route path='/admin-dashboard/departments/:id' element={<EditDepatments />} ></Route>
          <Route path='/admin-dashboard/employee' element={< List />} ></Route>
          <Route path='/admin-dashboard/add-employee' element={<Add />} ></Route>
          <Route path='/admin-dashboard/employee/:id' element={<View />} ></Route>
          <Route path='/admin-dashboard/employee/edit/:id' element={<EmployeeEdit />} ></Route>
          <Route path='/admin-dashboard/salary/add' element={< AddSalary />} ></Route>
          <Route path='/admin-dashboard/employee/salary/:id' element={< ViewSalary />} ></Route>
          <Route path='/admin-dashboard/leaves' element={< AdminTabel />} ></Route>
          <Route path='/admin-dashboard/leaves/:id' element={< LeaveDetails />} ></Route>
          <Route path='/admin-dashboard/employee/leaves/:id' element={< LeaveList />} ></Route>
          <Route path='/admin-dashboard/settings' element={< Setting />} ></Route>
        </Route>
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoute requireRole={['admin', 'employee']}>
                <EmployeeDashboard />
              </RoleBaseRoute>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmpSummary />} ></Route>
          <Route path='/employee-dashboard/profile/:id' element={<View />} ></Route>
          <Route path='/employee-dashboard/leaves/:id' element={<LeaveList />} ></Route>
          <Route path='/employee-dashboard/leaves/add-leaves' element={<AddLeave />} ></Route>
          <Route path='/employee-dashboard/salary/:id' element={<ViewSalary />} ></Route>
          <Route path='/employee-dashboard/settings' element={<Setting />} ></Route>
        </Route>
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      </Routes>
    </>
  )
}

export default App