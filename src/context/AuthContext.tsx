import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

interface User {
  name: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      // If token exists, fetch user data
      getUserData(token);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<{ token: string }>(`${API_URL}/users/login`, { email, password });
      const { token } = response.data;
      await SecureStore.setItemAsync('token', token);
      getUserData(token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const signup = async (userData: User) => {
    try {
      const response = await axios.post<{ token: string }>(`${API_URL}/users/signup`, userData);
      const { token } = response.data;
      await SecureStore.setItemAsync('token', token);
      getUserData(token);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserData = async (token: string) => {
    try {
      const response = await axios.get<User>(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const authContextValue: AuthContextType = {
    user,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
