import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, currentUser } from '@/lib/mockData';

interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(currentUser);

  const login = (role: UserRole) => {
    if (role === 'admin') {
      setUser({
        id: 'admin1',
        role: 'admin',
        name: 'Admin User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      });
    } else {
      setUser(currentUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      setUser({
        id: 'admin1',
        role: 'admin',
        name: 'Admin User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      });
    } else {
      setUser(currentUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
