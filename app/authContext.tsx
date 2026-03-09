"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

/* ========================
   Types
======================== */


interface AuthContextType {
  userRedirectionInfo: UserRedirectionInfo | null;
  isAuthenticated: boolean;
  login: (userData: UserRedirectionInfo) => void;
  logout: () => void;
}

interface UserRedirectionInfo{
  authToken: string;
  restaurantId: number;
}

/* ========================
   Context
======================== */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ========================
   Provider
======================== */

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userRedirectionInfo, setUserRedirectionInfo] = useState<UserRedirectionInfo | null>(null);

  const isAuthenticated = Boolean(userRedirectionInfo);

  const login = (userData: UserRedirectionInfo) => {
    setUserRedirectionInfo(userData);
  };

  const logout = () => {
    setUserRedirectionInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userRedirectionInfo,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ========================
   Custom Hook
======================== */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
