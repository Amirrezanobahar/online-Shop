import React, { createContext, useContext, useState, useEffect } from 'react';
import { GetUserRole } from '../panel/GetUserRole ';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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

  const login = (token, role) => {
    localStorage.setItem('token', token);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};