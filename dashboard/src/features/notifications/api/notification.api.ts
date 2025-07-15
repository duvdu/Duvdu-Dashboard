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
