import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  tenantId: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  theme: string;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTheme: (theme: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      theme: 'lightretail', // Corrected this line
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        set({ user, accessToken, refreshToken });
      },
      setTheme: (theme) => set({ theme }),
      logout: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
