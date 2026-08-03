import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  setSession: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setSession: (user, token) => {
        setAuthCookies(token, user.role);
        set({ user, token });
      },
      logout: () => {
        clearAuthCookies();
        set({ user: null, token: null });
      },
    }),
    { name: "rentnest-auth" }
  )
);
