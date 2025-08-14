import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PaperclipIcon, SendIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { sendMessage } from "../api/chat.api";
import {
  sendMessageSchema,
  type SendMessageForm,
} from "../schemas/chat.schema";
import type { Message } from "../types/chat.types";
import { useChatStore } from "../store";

interface SendMessageFormProps {
  receiverId: string;
  onMessageSent?: () => void;
  placeholder?: string;
  disabled?: boolean;
  replyTo?: string;
  previousMessages?: Message[];
  setMessages?: (messages: Message[]) => void;
}

export function SendMessageForm({
  receiverId,
  onMessageSent,
  placeholder = "Type a message...",
  disabled = false,
  replyTo,
}: SendMessageFormProps) {
  const [attachments, setAttachments] = useState<File[]>([]);
  const { addMessage, messages } = useChatStore();
  console.log(messages, "messages");

  const form = useForm<SendMessageForm>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: "",
      receiver: receiverId,
      attachments: undefined,
      replyTo: replyTo,
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (newMessage) => {
      form.reset();
      setAttachments([]);
      console.log(newMessage, "newMessage", messages);
      addMessage(newMessage);
      onMessageSent?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send message");
    },
  });

  const handleSubmit = (data: SendMessageForm) => {
    if (!data.content.trim() && attachments.length === 0) {
      return;
    }

    sendMessageMutation.mutate({
      content: data.content,
      receiver: receiverId,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      const isValidType =
        file.type.startsWith("image/") ||
        file.type.startsWith("video/") ||
        file.type.startsWith("audio/");

      if (!isValidSize) {
        toast.error(`File ${file.name} is too large (max 10MB)`);
        return false;
      }

      if (!isValidType) {
        toast.error(`File ${file.name} is not a supported type`);
        return false;
      }

      return true;
    });

    setAttachments((prev) => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="relative">
                <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded text-sm">
                  <PaperclipIcon className="h-4 w-4" />
                  <span className="truncate max-w-32">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeAttachment(index)}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Input */}
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={placeholder}
                    className="resize-none min-h-[40px] max-h-32"
                    disabled={disabled || sendMessageMutation.isPending}
                    onKeyDown={handleKeyDown}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            {/* Attachment Button */}
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={disabled || sendMessageMutation.isPending}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0"
                disabled={disabled || sendMessageMutation.isPending}
              >
                <PaperclipIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              size="sm"
              className="w-10 h-10 p-0"
              disabled={
                disabled ||
                sendMessageMutation.isPending ||
                (!form.watch("content")?.trim() && attachments.length === 0)
              }
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
