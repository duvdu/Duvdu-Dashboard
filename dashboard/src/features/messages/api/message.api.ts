import axios from "@/lib/axios";

export interface SendMessagePayload {
  content: string;
  receiver: string;
  attachments?: FileList | File[];
}

export async function sendMessage({ content, receiver, attachments }: SendMessagePayload) {
  const formData = new FormData();
  formData.append("content", content);
  formData.append("receiver", receiver);
  if (attachments) {
    if (attachments instanceof FileList) {
      Array.from(attachments).forEach((file) => formData.append("attachments", file));
    } else if (Array.isArray(attachments)) {
      attachments.forEach((file) => formData.append("attachments", file));
    }
  }
  const response = await axios.post("/api/message", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
} 