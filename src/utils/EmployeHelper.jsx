import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// API Base URL - centralize for easy updates
const API_BASE_URL = "http://localhost:5699/api";

// Helper to get auth headers
const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`
});

// Fetch all departments
export const fetchDepartments = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/department`, {
            headers: getAuthHeaders()
        });

        if (response.data.success) {
            return response.data.department;
        }
        return [];
    } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        console.error('Fetch departments error:', errorMsg);
        toast.error('Failed to fetch departments');
        return [];
    }
};

// Fetch employees by department
export const fetchEmployees = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/employee/department/${id}`, {
            headers: getAuthHeaders()
        });

        if (response.data.success) {
            return response.data.employee;
        }
        return [];
    } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        console.error('Fetch employees error:', errorMsg);
        toast.error('Failed to fetch employees');
        return [];
    }
};

// Employee Action Buttons Component
export const EmployeeButtons = ({ empid, onEmployeeDelete }) => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this employee?");
        if (!confirm) return;

        setIsDeleting(true);

        try {
            const response = await axios.delete(`${API_BASE_URL}/employee/${id}`, {
                headers: getAuthHeaders()
            });

            if (response.data.success) {
                onEmployeeDelete(id);
                toast.success('Employee deleted successfully');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message || 'Failed to delete employee';
            toast.error(errorMsg);
            console.error('Delete error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => navigate(`/admin-dashboard/employee/${empid}`)}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
                View
            </button>

            <button
                onClick={() => navigate(`/admin-dashboard/employee/edit/${empid}`)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
                Edit
            </button>

            <button
                onClick={() => navigate(`/admin-dashboard/employee/salary/${empid}`)}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
                Salary
            </button>

            <button
                onClick={() => navigate(`/admin-dashboard/employee/leaves/${empid}`)}
                className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
                Leaves
            </button>
            <button
                onClick={() => navigate(`/admin-dashboard/employee/leaves/block/${empid}`)}
                className="px-3 py-1.5 bg-red-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            > 
                Block
            </button>

        </div>
    );
};