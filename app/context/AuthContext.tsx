"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

export type UserProfile = {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  avatar_url?: string | null;
};

type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;

    const savedUser = localStorage.getItem("auth_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("auth_token") || localStorage.getItem("token");
  });

  const login = (newToken: string, newUser: UserProfile) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");

    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};