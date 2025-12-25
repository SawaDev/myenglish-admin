import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserRole } from '@/lib/mockData';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loginTimestamp: number | null;
  setUser: (user: AuthUser) => void;
  setToken: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loginTimestamp: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, loginTimestamp: new Date().getTime() }),
      logout: () => {
        set({ user: null, token: null, loginTimestamp: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
      },
      checkAuth: () => {
        const { token, loginTimestamp } = get();
        if (token && loginTimestamp) {
          const now = new Date().getTime();
          const oneDay = 24 * 60 * 60 * 1000;
          if (now - loginTimestamp > oneDay) {
            get().logout();
          }
        } else if (!token) {
           // ensure state is clear if no token
           if (get().user) get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // We handle specific items in logout, but persist middleware will sync state to 'auth-storage' key in LS.
      // The previous implementation used individual keys ('token', 'user').
      // Zustand persist usually uses one JSON object.
      // If we want to maintain compatibility or specific keys, we might need custom storage or just rely on the new 'auth-storage' key.
      // The user prompt said "use localstorage to save token". Zustand persist does this.
    }
  )
);

