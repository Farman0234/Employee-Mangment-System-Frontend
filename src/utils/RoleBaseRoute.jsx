import React from 'react'
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';

const RoleBaseRoute = ({ children, requireRole }) => {

  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />

  if (!requireRole.includes(user.role)) {

    return <Navigate to="/unauthrized" />;
  }


  return user ? children : <Navigate to="/login"  />;

}

export default RoleBaseRoute;