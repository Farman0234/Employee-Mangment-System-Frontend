import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const DepartmentButtons = ({ depid, onDepartmentDelete }) => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this department?");
        if (!confirm) return;

        setIsDeleting(true);
        
        try {
            const response = await axios.delete(
                `https://employee-mangment-system-backend.vercel.app/api/department/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                }
            );

            if (response.data.success) {
                
                toast.success('Department deleted successfully');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to delete department';
            toast.error(errorMessage);
            console.error('Delete error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleView = () => {
        navigate(`/admin-dashboard/departments/view/${depid}`);
    };

    const handleEdit = () => {
        navigate(`/admin-dashboard/departments/${depid}`);
    };

    return (
        <div className="flex gap-2">
            <button 
                onClick={handleView}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
                View
            </button>
            
            <button 
                onClick={handleEdit}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
                Edit
            </button>
            
            <button 
                onClick={() => handleDelete(depid)}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    );
};