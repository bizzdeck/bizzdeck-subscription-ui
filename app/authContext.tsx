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

export interface User {
  id: number;
  name: string;
  phoneNumber: string;
  restaurants: Restaurant[];
  token: string;
}

export interface Restaurant {
  id: number|string;
  name: string;
  location: string;
  fssaiExpiryDate: string | null;
  fssaiAboutToExpire: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = Boolean(user);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
