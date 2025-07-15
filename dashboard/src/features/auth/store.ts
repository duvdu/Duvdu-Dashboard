import { create } from "zustand";

interface User {
  // Define user fields as needed, e.g.:
  _id: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
