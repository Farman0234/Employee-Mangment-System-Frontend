import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmployeeButtons } from "../../utils/EmployeHelper";
import { FaSearch, FaUserPlus, FaUsers, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Navbar from "../DashBoard/navBar";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 8;

  // Pagination calculation
  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5699/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          const data = res.data.employes.map((emp, index) => ({
            _id: emp._id,
            srno: index + 1,
            empID: emp.employeeId,
            name: emp.userID?.name || "N/A",
            department: emp.department?.dep_name || "N/A",
            dob: new Date(emp.dateofbirth).toLocaleDateString(),
            profileImage: emp.userID?.profileImage,
          }));

          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Search filter
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setCurrentPage(1); // Reset to first page on search

    const filtered = employees.filter(
      (emp) =>
        emp.empID.toLowerCase().includes(value) ||
        emp.name.toLowerCase().includes(value) ||
        emp.department.toLowerCase().includes(value)
    );
    setFilteredEmployees(filtered);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50">
      <Navbar />
      <div className="p-6">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                  <FaUsers className="mr-3 text-teal-600" />
                  Employee Management
                </h2>
                <p className="text-gray-600">
                  Manage and organize your workforce efficiently
                </p>
              </div>
              <div className="bg-teal-50 px-6 py-3 rounded-lg border border-teal-200">
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-teal-600">
                  {filteredEmployees.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, name or department..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>

              {/* Add Button */}
              <Link
                to="/admin-dashboard/add-employee"
                className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
              >
                <FaUserPlus />
                <span>Add New Employee</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600 font-medium">
                    Loading employees...
                  </p>
                </div>
              </div>
            ) : currentEmployees.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Sr No
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Employee ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Profile
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Date of Birth
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentEmployees.map((emp, index) => (
                        <tr
                          key={emp._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {indexOfFirst + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full">
                              {emp.empID}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={
                                  emp.profileImage
                                    ? `http://localhost:5699/uploads/${emp.profileImage}`
                                    : "/avatar.png"
                                }
                                alt="profile"
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {emp.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                              {emp.department}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {emp.dob}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <EmployeeButtons empid={emp._id} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-semibold text-gray-900">
                          {indexOfFirst + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-gray-900">
                          {Math.min(indexOfLast, filteredEmployees.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-900">
                          {filteredEmployees.length}
                        </span>{" "}
                        employees
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <FaChevronLeft />
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                          const page = i + 1;
                          // Show first, last, current, and adjacent pages
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={i}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 border rounded-lg font-medium transition ${
                                  currentPage === page
                                    ? "bg-teal-600 text-white border-teal-600 shadow-md"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span key={i} className="px-2 text-gray-500">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <FaUsers className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No employees found
                </h3>
                <p className="text-gray-500 mb-6">
                  {search
                    ? "Try adjusting your search criteria"
                    : "Get started by adding your first employee"}
                </p>
                <Link
                  to="/admin-dashboard/add-employee"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
                >
                  <FaUserPlus />
                  <span>Add New Employee</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;