import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  login,
  register,
  getResetQuestion,
  verifyAnswer,
  resetPassword
} from '@/services/api/auth';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetQuestionRequest,
  VerifyAnswerRequest,
  ResetPasswordRequest,
} from '@/services/types';
import { getToken, setToken as persistToken } from '@/services/utils/tokenService';


interface AuthContextType {
  token: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<boolean>;
  getSecurityQuestion: (data: ResetQuestionRequest) => Promise<string>;
  verifySecurityAnswer: (data: VerifyAnswerRequest) => Promise<string | null>;
  resetPassword: (data: ResetPasswordRequest) => Promise<string>;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await getToken();
        if (storedToken) setToken(storedToken);
      } catch (error) {
        console.error('Error loading token:', error);
      } finally {
        setLoading(false);
      }
    };
    if (loading) initializeAuth();
  }, [loading]);

  const loginHandler = async (data: LoginRequest) => {
    try {
      const { accessToken } = await login(data);
      await persistToken(accessToken);
      setToken(accessToken);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logoutHandler = async () => {
    await persistToken(null);
    setToken(null);
  };

  const registerHandler = async (data: RegisterRequest) => {
    try {
      const response = await register(data);
      const accessToken = response.accessToken;
      await persistToken(accessToken);
      setToken(accessToken);
      return true;
    } catch (error) {
      return false;
    }
  };

  const getSecurityQuestionHandler = async (data: ResetQuestionRequest) => {
    const response = await getResetQuestion(data);
    return response.securityQuestion;
  };

  const verifySecurityAnswerHandler = async (data: VerifyAnswerRequest) => {
    const response = await verifyAnswer(data);
    return response.token ?? null;
  };

  const resetPasswordHandler = async (data: ResetPasswordRequest) => {
    const response = await resetPassword(data);
    return response.message;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
        login: loginHandler,
        logout: logoutHandler,
        register: registerHandler,
        getSecurityQuestion: getSecurityQuestionHandler,
        verifySecurityAnswer: verifySecurityAnswerHandler,
        resetPassword: resetPasswordHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
