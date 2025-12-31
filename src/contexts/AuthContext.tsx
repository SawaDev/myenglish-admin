import React, { useEffect, ReactNode, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore, AuthUser } from "@/stores/authStore";
import api from "@/lib/axios";
import { UserRole } from "@/lib/mockData";

interface LoginResponse {
  token: string;
  user: {
    id: number | string;
    full_name: string;
    role: string;
    avatar?: string;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

export function useAuth(): AuthContextType {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const logout = useAuthStore((state) => state.logout);

  const normalizeUserRole = (role: string): UserRole => {
    const normalized = (role || "").trim().toLowerCase();
    if (normalized === "admin") return "Admin";
    if (normalized === "teacher") return "Teacher";
    // Fallback to Teacher for unknown roles to avoid redirect loops.
    // Consider handling this explicitly (e.g. logout + toast) if your API can return more roles.
    return "Teacher";
  };
  
  const loginMutation = useMutation({
    mutationFn: async ({ phone, password }: { phone: string; password: string }) => {
      const response = await api.post<LoginResponse>('/auth/login', { phone, password });
      return response.data;
    },
    onSuccess: (data) => {
      const { token, user: apiUser } = data;
      const authUser: AuthUser = {
        id: apiUser.id.toString(),
        name: apiUser.full_name,
        role: normalizeUserRole(apiUser.role),
        avatar: apiUser.avatar || "",
      };
      setToken(token);
      setUser(authUser);
    },
  });

  const login = async (phone: string, password: string) => {
    await loginMutation.mutateAsync({ phone, password });
  };

  return useMemo(() => ({
    user,
    login,
    logout,
    isLoading: loginMutation.isPending,
    isAuthenticated: !!user && !!token,
  }), [user, token, logout, loginMutation.isPending]);
}
