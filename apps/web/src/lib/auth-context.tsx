"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, getStoredToken, setStoredToken, type User } from "./api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username?: string,
    name?: string
  ) => Promise<void>;
  loginOAuth: (payload: {
    provider: "google" | "github" | "apple" | "linkedin";
    providerAccountId: string;
    email: string;
    name?: string;
    avatar?: string;
  }) => Promise<void>;
  loginTelegram: (payload: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setStoredToken(null);
        setUser(null);
      }
    } catch {
      setStoredToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const token = getStoredToken();

    if (!token) {
      Promise.resolve().then(() => {
        if (!ignore) {
          setLoading(false);
        }
      });
      return () => {
        ignore = true;
      };
    }

    api.auth
      .getMe()
      .then((res) => {
        if (!ignore) {
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            setStoredToken(null);
            setUser(null);
          }
        }
      })
      .catch(() => {
        if (!ignore) {
          setStoredToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await api.auth.login({ identifier, password });
    if (res.data?.token) {
      setStoredToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (
    email: string,
    password: string,
    username?: string,
    name?: string
  ) => {
    const res = await api.auth.register({ email, password, username, name });
    if (res.data?.token) {
      setStoredToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const loginOAuth = async (payload: {
    provider: "google" | "github" | "apple" | "linkedin";
    providerAccountId: string;
    email: string;
    name?: string;
    avatar?: string;
  }) => {
    const res = await api.auth.oauthLogin(payload);
    if (res.data?.token) {
      setStoredToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const loginTelegram = async (payload: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  }) => {
    const res = await api.auth.telegramLogin(payload);
    if (res.data?.token) {
      setStoredToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setStoredToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginOAuth,
        loginTelegram,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
