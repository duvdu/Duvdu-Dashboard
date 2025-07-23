import axios from "@/lib/axios";

export async function updateDefaults(data: { profile: File; cover: File }) {
  const formData = new FormData();
  formData.append("profile", data.profile);
  formData.append("cover", data.cover);
  const response = await axios.put("/api/users/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}
