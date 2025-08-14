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
import {
  PaperclipIcon,
  SendIcon,
  XIcon,
  MicIcon,
  SquareIcon,
  TrashIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
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

type RecordingState = "idle" | "recording" | "paused" | "recorded";

export function SendMessageForm({
  receiverId,
  onMessageSent,
  placeholder = "Type a message...",
  disabled = false,
  replyTo,
}: SendMessageFormProps) {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { addMessage } = useChatStore();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      resetRecording();
      addMessage(newMessage);
      onMessageSent?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send message");
    },
  });

  const resetRecording = useCallback(() => {
    setRecordingState("idle");
    setRecordingTime(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    audioChunksRef.current = [];

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordingState("recorded");

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecordingState("recording");

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Unable to access microphone. Please check permissions.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioUrl, isPlaying]);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (data: SendMessageForm) => {
    if (!data.content.trim() && attachments.length === 0 && !audioBlob) {
      return;
    }

    // Prepare attachments array including audio blob
    const allAttachments: File[] = [...attachments];

    if (audioBlob) {
      const audioFile = new File([audioBlob], "audio-message.webm", {
        type: "audio/webm",
      });
      allAttachments.push(audioFile);
    }

    sendMessageMutation.mutate({
      content: data.content || "",
      receiver: receiverId,
      attachments: allAttachments.length > 0 ? allAttachments : undefined,
      messageType: audioBlob ? "audio" : undefined,
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

  const handleMicButtonClick = () => {
    if (recordingState === "idle") {
      startRecording();
    } else if (recordingState === "recording") {
      stopRecording();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Audio Recording Preview */}
        {recordingState === "recorded" && audioUrl && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
              className="h-8 w-8 p-0"
            >
              {isPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </Button>

            <div className="flex-1">
              <div className="text-sm font-medium">Audio Message</div>
              <div className="text-xs text-muted-foreground">
                {formatTime(recordingTime)}
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetRecording}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Recording Indicator */}
        {recordingState === "recording" && (
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Recording...
              </span>
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              {formatTime(recordingTime)}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={stopRecording}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <SquareIcon className="h-4 w-4" />
            </Button>
          </div>
        )}

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
                    disabled={
                      disabled ||
                      sendMessageMutation.isPending ||
                      recordingState === "recording"
                    }
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
                disabled={
                  disabled ||
                  sendMessageMutation.isPending ||
                  recordingState === "recording"
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0"
                disabled={
                  disabled ||
                  sendMessageMutation.isPending ||
                  recordingState === "recording"
                }
              >
                <PaperclipIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Mic/Send Button */}
            {recordingState === "idle" &&
            !form.watch("content")?.trim() &&
            attachments.length === 0 ? (
              <Button
                type="button"
                size="sm"
                className="w-10 h-10 p-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                disabled={disabled || sendMessageMutation.isPending}
                onClick={handleMicButtonClick}
              >
                <MicIcon className="h-4 w-4" />
              </Button>
            ) : recordingState === "recording" ? (
              <Button
                type="button"
                size="sm"
                className="w-10 h-10 p-0 bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                disabled={disabled || sendMessageMutation.isPending}
                onClick={handleMicButtonClick}
              >
                <MicIcon className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="sm"
                className="w-10 h-10 p-0"
                disabled={
                  disabled ||
                  sendMessageMutation.isPending ||
                  (!form.watch("content")?.trim() &&
                    attachments.length === 0 &&
                    !audioBlob)
                }
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Hidden audio element for playback */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={handleAudioEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </form>
    </Form>
  );
}
