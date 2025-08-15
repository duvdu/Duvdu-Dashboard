import api from "@/lib/axios";

export async function sendNotification({
  users,
  title,
  message,
}: {
  users: string[];
  title: string;
  message: string;
}) {
  const { data } = await api.post("/api/notification/users", {
    users,
    title,
    message,
  });
  return data;
}

export async function sendNotificationToAllUsers({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  const { data } = await api.post("/api/notification", {
    title,
    message,
  });
  return data;
}

export async function getNotifications({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) {
  const { data } = await api.get("/api/notification/crm", {
    params: { page, pageSize },
  });
  return data;
}
