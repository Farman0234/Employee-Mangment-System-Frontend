import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyuser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await axios.get("https://employee-mangment-backend.vercel.app/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log(res.data.user._id)
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyuser();
  }, []);

  const login = (user) => {
    setUser(user)
  };

  const logout = () => {
    setUser(null);
    toast.success("logout Succesfully");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  if (res.data.user.isBlocked) {
    toast.error("Your account is blocked. Contact admin.");
    return setUser(null);
  }
  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
