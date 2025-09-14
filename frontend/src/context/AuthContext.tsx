'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getRolesFromToken } from '../api';

interface AuthContextType {
  isAuthenticated: boolean;
  roles: string[];
  login: (userData: any) => void; // Modified to accept userData
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
  userId: string | null; // Added userId
  userRoles: string[]; // Added userRoles
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null); // Added userId state
  const [userRoles, setUserRoles] = useState<string[]>([]); // Added userRoles state

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const storedUserId = localStorage.getItem('userId');
    const storedUserRoles = localStorage.getItem('userRoles');

    if (token && storedUserId && storedUserRoles) {
      setIsAuthenticated(true);
      setRoles(getRolesFromToken());
      setUserId(storedUserId);
      setUserRoles(JSON.parse(storedUserRoles));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: any) => { // Modified to accept userData
    localStorage.setItem('jwtToken', userData.token);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userRoles', JSON.stringify(userData.roles));

    setIsAuthenticated(true);
    setRoles(userData.roles || []);
    setUserId(userData.id);
    setUserRoles(userData.roles || []);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRoles');
    setIsAuthenticated(false);
    setRoles([]);
    setUserId(null);
    setUserRoles([]);
  };

  const isAdmin = roles.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ isAuthenticated, roles, login, logout, isAdmin, isLoading, userId, userRoles }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log("useAuth context: ", context);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
