import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserInfo = {
  username: string;
  token: string;
};

type AuthContextType = {
  user: UserInfo | null;
  token: string | null;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  authState: {
    user: string | null;
    token: string | null;
    loading: boolean;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  const login = (userInfo: UserInfo) => setUser(userInfo);
  const logout = () => setUser(null);

  const authState = {
    user: user?.username || null,
    token: user?.token || null,
    loading: false, // TODO: AsyncStorage in future
  };

  return (
    <AuthContext.Provider value={{ user, token: user?.token || null, login, logout, authState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
