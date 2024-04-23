import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type AuthProps = {
  token: string | null;
  initialized: boolean;
  onRegister: (userData: User) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<void>;
};

type User = {
  name: string;
  email: string;
  password: string;
  phone: number;
  gender: string;
  birthday: string;
  address: string;
};

const AuthContext = createContext<Partial<AuthProps>>({});

export function useAuth(): AuthProps {
  return useContext(AuthContext) as AuthProps;
}

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync('user-token');
      if (storedToken) {
        setToken(storedToken);
      }
      setInitialized(true);
    };
    loadToken();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, { email, password });
      const newToken = response?.data?.token;
      setToken(newToken);
      await SecureStore.setItemAsync('user-token', newToken);
      return response;
    } catch (error: any) {
      return { error: true, msg: error?.response?.data.message };
    }
  };

  const handleRegister = async (userData: User) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      const newToken = response?.data?.token;
      if (!newToken) {
        throw new Error('Token not found in response');
      }
      setToken(newToken);
      await SecureStore.setItemAsync('user-token', newToken);
      return response;
    } catch (error: any) {
      console.error('Registration failed:', error);
      return { error: true, msg: error.message };
    }
  };

  const handleLogout = async () => {
    setToken(null);
    await SecureStore.deleteItemAsync('user-token');
  };

  const value = {
    initialized,
    onLogin: handleLogin,
    onRegister: handleRegister,
    onLogout: handleLogout,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
