import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../utils/AuthProvider'
import axios from 'axios'
import toast from 'react-hot-toast'
import Navbar from '../DashBoard/navBar'

const Setting = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [setting, setSetting] = useState({
        userID: user._id,
        oldPassword: "",
        newPassword: "",
        confirmedPassword: ""
    })

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setSetting({ ...setting, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate password length
        if (setting.newPassword.length < 6) {
            setError("Password must be at least 6 characters long")
            return
        }

        // Check if passwords match
        if (setting.newPassword !== setting.confirmedPassword) {
            setError("Passwords do not match")
            return
        }

        setError(null)
        setLoading(true)

        try {
            const response = await axios.put("https://employee-mangment-system-backend.vercel.app/api/setting/change-password",
                setting, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            }
            )

            if (response.data.success) {
                toast.success('Password changed successfully')
                // Clear form
                setSetting({
                    userID: user._id,
                    oldPassword: "",
                    newPassword: "",
                    confirmedPassword: ""
                })
                toast.success('Password Change Sucessfully');
                // Navigate based on role
                setTimeout(() => {
                    if (res.data.user.role === "admin") {
                        navigate("/admin-dashboard");
                    } else {
                        navigate("/employee-dashboard");
                    }
                }, 500);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message
            console.log(errorMessage)
            setError(errorMessage)
            toast.error('Failed to change password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-teal-50">
            {user.role === "admin" && (
                <Navbar />
            )}
            <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Change Password
                </h2>

                {error && (
                    <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="oldPassword"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Old Password
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            type="password"
                            name="oldPassword"
                            id="oldPassword"
                            placeholder="Enter Old Password"
                            value={setting.oldPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="newPassword"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            New Password
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            placeholder="Enter New Password"
                            value={setting.newPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="confirmedPassword"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Confirm Password
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            type="password"
                            name="confirmedPassword"
                            id="confirmedPassword"
                            placeholder="Enter Confirmed Password"
                            value={setting.confirmedPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                            }`}
                    >
                        {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Setting