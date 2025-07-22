import { create } from "zustand";

export type NotificationUser = {
  _id: string;
  username: string;
  profileImage: string;
  name: string;
};

export type Notification = {
  _id: string;
  sourceUser: NotificationUser;
  targetUser: NotificationUser;
  target: string;
  type: string | null;
  watched: boolean;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationsPagination = {
  currentPage: number;
  resultCount: number;
  totalPages: number;
};

export type NotificationsState = {
  notifications: Notification[];
  unreadCount: number;
  pagination: NotificationsPagination | null;
  setNotifications: (
    notifications: Notification[],
    pagination: NotificationsPagination
  ) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  incrementUnread: () => void;
  resetUnread: () => void;
};

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  pagination: null,
  setNotifications: (notifications, pagination) =>
    set({ notifications, pagination }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, watched: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  resetUnread: () => set({ unreadCount: 0 }),
}));
