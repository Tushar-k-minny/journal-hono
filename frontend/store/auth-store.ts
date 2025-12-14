import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user, token) => {
        apiClient.setToken(token);
        set({ user, token, isAuthenticated: true });
      },
      updateUser: (user) => {
        set({ user });
      },
      logout: () => {
        apiClient.setToken(null);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "journal-auth",
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token);
        }
      },
    }
  )
);
