import { create } from "zustand";

interface VisitorsState {
  onlineVisitors: number;
  setOnlineVisitors: (count: number) => void;
}

export const useVisitorsStore = create<VisitorsState>((set) => ({
  onlineVisitors: 0,
  setOnlineVisitors: (count: number) => set({ onlineVisitors: count }),
}));
