import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

// Mock user for development - set to null to disable auto-login
const MOCK_USER: User | null = {
  id: "dev-user-123",
  email: "dev@seepass.local",
  name: "Dev User",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: MOCK_USER,
      isAuthenticated: MOCK_USER !== null,

      signIn: async (email: string, _password: string) => {
        // Mock authentication - accept any credentials
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        const user: User = {
          id: crypto.randomUUID(),
          email,
          name: email.split("@")[0],
        };

        set({ user, isAuthenticated: true });
        return true;
      },

      signUp: async (name: string, email: string, _password: string) => {
        // Mock sign up - accept any credentials
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        const user: User = {
          id: crypto.randomUUID(),
          email,
          name,
        };

        set({ user, isAuthenticated: true });
        return true;
      },

      signOut: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "seepass-auth",
    }
  )
);
