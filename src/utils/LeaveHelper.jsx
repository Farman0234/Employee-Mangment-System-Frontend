import { useNavigate } from "react-router-dom";

export const LeaveButton = ({ empid }) => {
    const navigate = useNavigate();

    const handleView = (id) => {
        navigate(`/admin-dashboard/leaves/${empid}`)
    }



    return (


        <button
            onClick={() => handleView(empid)}
            className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        >
            Leaves
        </button>

    )
};