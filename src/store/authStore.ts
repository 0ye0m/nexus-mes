import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'production_manager' | 'quality_inspector';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          set({ isLoading: false });

          if (data.success && data.user) {
            set({ user: data.user, isAuthenticated: true });
            return { success: true, message: 'Login successful' };
          }

          return { success: false, message: data.message || 'Login failed' };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, message: 'Network error. Please try again.' };
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      hasRole: (roles: UserRole[]) => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'ev-auth-storage',
    }
  )
);
