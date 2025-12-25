import React, { useEffect, ReactNode } from "react";
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

// AuthProvider is now primarily a logical wrapper for initialization
// and compatibility with the existing App structure.
export function AuthProvider({ children }: { children: ReactNode }) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

export function useAuth(): AuthContextType {
  const { user, setUser, setToken, logout, token } = useAuthStore();
  
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
        role: apiUser.role as UserRole,
        avatar: apiUser.avatar || "",
      };
      setToken(token);
      setUser(authUser);
    },
  });

  const login = async (phone: string, password: string) => {
    await loginMutation.mutateAsync({ phone, password });
  };

  // With Zustand persist, state is hydrated synchronously from localStorage by default.
  // So we don't need an initial loading state like in the useState version.
  // isLoading here reflects the login mutation status.
  
  return {
    user,
    login,
    logout,
    isLoading: loginMutation.isPending,
    isAuthenticated: !!user && !!token,
  };
}
