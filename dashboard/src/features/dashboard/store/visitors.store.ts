import { create } from "zustand";

interface VisitorsState {
  onlineVisitors: number;
  loggedInVisitors: number;
  setOnlineVisitors: (count: number) => void;
  setLoggedInVisitors: (count: number) => void;
}

export const useVisitorsStore = create<VisitorsState>((set) => ({
  onlineVisitors: 0,
  loggedInVisitors: 0,
  setOnlineVisitors: (count: number) => set({ onlineVisitors: count }),
  setLoggedInVisitors: (count: number) => set({ loggedInVisitors: count }),
}));
