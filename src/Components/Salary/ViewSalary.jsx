import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaDollarSign, FaCalendarAlt, FaMoneyBillWave, FaSearch } from "react-icons/fa";

const ViewSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();
  console.log("Route employee ID:", id);
  const fetchSalaries = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5699/api/salary/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success) {
        setSalaries(res.data.salary);
        setFilteredSalaries(res.data.salary);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to fetch salaries';
      console.error('Fetch salaries error:', error);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [id]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = salaries.filter((salary) =>
      salary.employeeId.employeeId.toLowerCase().includes(query)
    );
    setFilteredSalaries(filtered);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading salary records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-800">
          Salary History
        </h2>
        <p className="text-center text-gray-600">
          {salaries.length} {salaries.length === 1 ? 'record' : 'records'} found
        </p>
      </div>

      {/* Search Box */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Employee ID..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Salary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSalaries.length > 0 ? (
          filteredSalaries.map((salary) => (
            <div
              key={salary._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-t-4 border-teal-500"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Employee ID</p>
                  <h3 className="text-lg font-bold text-gray-800">
                    {salary.employeeId.employeeId}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium mb-1">Period</p>
                  <span className="text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                    {salary.month}
                  </span>
                </div>
              </div>

              {/* Salary Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="flex items-center text-gray-700 text-sm font-medium">
                    <FaDollarSign className="mr-2 text-teal-500" /> Basic Salary
                  </span>
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(salary.basicSalary)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <span className="flex items-center text-gray-700 text-sm font-medium">
                    <FaMoneyBillWave className="mr-2 text-green-500" /> Allowances
                  </span>
                  <span className="font-semibold text-green-700">
                    +{formatCurrency(salary.Allowance || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span className="flex items-center text-gray-700 text-sm font-medium">
                    <FaMoneyBillWave className="mr-2 text-red-500" /> Deductions
                  </span>
                  <span className="font-semibold text-red-700">
                    -{formatCurrency(salary.Deductation || 0)}
                  </span>
                </div>

                {/* Net Salary - Highlighted */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg mt-4">
                  <span className="flex items-center text-white text-sm font-bold">
                    <FaDollarSign className="mr-2" /> Net Salary
                  </span>
                  <span className="font-bold text-white text-lg">
                    {formatCurrency(salary.netSalary)}
                  </span>
                </div>

                {/* Pay Date */}
                <p className="flex items-center justify-center text-gray-500 text-sm pt-2">
                  <FaCalendarAlt className="mr-2" />
                  Paid on {new Date(salary.payDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="text-gray-400 mb-4">
              <FaMoneyBillWave size={64} />
            </div>
            <p className="text-gray-600 font-medium text-lg mb-2">
              {searchQuery ? 'No matching records found' : 'No salary records available'}
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery && 'Try adjusting your search query'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSalary;