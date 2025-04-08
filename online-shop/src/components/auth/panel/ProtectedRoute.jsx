import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { GetUserRole } from './GetUserRole ';

const ProtectedRoute = ({ requiredRole, children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await GetUserRole();
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (isLoading) {
    // نمایش اسپینر یا placeholder در حین لودینگ
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!userRole) {
    // اگر کاربر لاگین نکرده باشد
    return <Navigate to="/login" replace />;
  }

  if (userRole !== requiredRole) {
    // اگر نقش کاربر مجاز نباشد
    return <Navigate to="/" replace />;
  }

  // اگر همه چیز درست باشد
  return children;
};

export default ProtectedRoute;