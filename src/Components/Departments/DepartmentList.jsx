import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DepartmentButtons } from "../../utils/depList";
import { FaSearch, FaPlus, FaBuilding, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Navbar from "../DashBoard/navBar";

function DepartmentList() {
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const departmentsPerPage = 8;

    // Pagination logic
    const indexOfLast = currentPage * departmentsPerPage;
    const indexOfFirst = indexOfLast - departmentsPerPage;
    const currentDepartments = filteredDepartments.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredDepartments.length / departmentsPerPage);

    useEffect(() => {
        const fetchDepartments = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    "https://employee-mangment-backend.vercel.app/api/department",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (res.data.success) {
                    const data = res.data.department.map((dep, index) => ({
                        _id: dep._id,
                        srno: index + 1,
                        dep_name: dep.dep_name,
                        description: dep.description,
                    }));

                    setDepartments(data);
                    setFilteredDepartments(data);
                }
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    // Delete handler
    const onDepartmentDelete = (id) => {
        const updated = departments.filter((dep) => dep._id !== id);
        setDepartments(updated);
        setFilteredDepartments(updated);
    };

    // Search filter
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = departments.filter((dep) =>
            dep.dep_name.toLowerCase().includes(value) ||
            dep.description.toLowerCase().includes(value)
        );

        setFilteredDepartments(filtered);
        setCurrentPage(1);
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
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                                    <FaBuilding className="mr-3 text-blue-600" />
                                    Department Management
                                </h2>
                                <p className="text-gray-600">
                                    Organize and manage all departments in your organization
                                </p>
                            </div>
                            <div className="bg-blue-50 px-6 py-3 rounded-lg border border-blue-200">
                                <p className="text-sm text-gray-600">Total Departments</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {filteredDepartments.length}
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
                                    placeholder="Search by name or description..."
                                    value={search}
                                    onChange={handleSearch}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Add Button */}
                            <Link
                                to="/admin-dashboard/add-departments"
                                className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                <FaPlus />
                                <span>Add New Department</span>
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
                                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                                    <p className="mt-4 text-gray-600 font-medium">
                                        Loading departments...
                                    </p>
                                </div>
                            </div>
                        ) : currentDepartments.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Sr No
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Department Name
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Description
                                                </th>
                                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentDepartments.map((dep, index) => (
                                                <tr
                                                    key={dep._id}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {indexOfFirst + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                                <FaBuilding className="text-white" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-semibold text-gray-900">
                                                                    {dep.dep_name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600 max-w-md truncate">
                                                            {dep.description}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <DepartmentButtons
                                                            depid={dep._id}
                                                            onDepatmentDelete={onDepartmentDelete}
                                                        />
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
                                                    {Math.min(indexOfLast, filteredDepartments.length)}
                                                </span>{" "}
                                                of{" "}
                                                <span className="font-semibold text-gray-900">
                                                    {filteredDepartments.length}
                                                </span>{" "}
                                                departments
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
                                                                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
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
                                <FaBuilding className="mx-auto text-6xl text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    No departments found
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {search
                                        ? "Try adjusting your search criteria"
                                        : "Get started by adding your first department"}
                                </p>
                                <Link
                                    to="/admin-dashboard/add-departments"
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                                >
                                    <FaPlus />
                                    <span>Add New Department</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepartmentList;