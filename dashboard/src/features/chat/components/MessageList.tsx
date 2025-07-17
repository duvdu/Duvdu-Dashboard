import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MediaPreview } from "@/components/ui/media-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { format, isToday, isYesterday } from "date-fns";
import {
  ArchiveIcon,
  FileCodeIcon,
  FileIcon,
  FileImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  MusicIcon,
  PauseIcon,
  PlayIcon,
  Presentation,
  VideoIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type Message } from "../types/chat.types";
import { getOtherUser } from "../utils";

interface AudioPlayerProps {
  src: string;
  className?: string;
}

function AudioPlayer({ src, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      setProgress(progressPercent);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * audio.duration;

    audio.currentTime = newTime;
  };

  return (
    <div className={cn("audio-player-chat", className)}>
      <audio ref={audioRef} preload="auto">
        <source src={src} type="audio/wav" />
        <source src={src} type="audio/mpeg" />
        <source src={src} type="audio/mp3" />
        Your browser does not support the audio tag.
      </audio>

      <div className="flex items-center gap-2 bg-background/20 backdrop-blur-sm rounded-lg border border-border/50 p-2">
        <div className="buttons rounded-full">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-background/30"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4 ml-0.5" />
            )}
          </Button>
        </div>

        <div className="controls-chat flex-1">
          <div
            className="progress-bars-chat bg-background/30 rounded-full h-1 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="progress-chat bg-primary rounded-full h-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onDeleteMessage?: (messageId: string) => void;
  onUpdateMessage?: (messageId: string, content: string) => void;
  onReplyToMessage?: (message: Message) => void;
  className?: string;
}

export function MessageList({
  messages,
  currentUserId,
  // onDeleteMessage,
  onUpdateMessage,
  // onReplyToMessage,
  className,
}: MessageListProps) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date);
    if (isToday(messageDate)) {
      return format(messageDate, "HH:mm");
    }
    if (isYesterday(messageDate)) {
      return `Yesterday ${format(messageDate, "HH:mm")}`;
    }
    return format(messageDate, "MMM dd, HH:mm");
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith("image/")) return FileImageIcon;
    if (mimetype.startsWith("video/")) return VideoIcon;
    if (mimetype.startsWith("audio/")) return MusicIcon;
    if (mimetype === "application/pdf") return FileTextIcon;
    if (mimetype.includes("spreadsheet") || mimetype.includes("excel"))
      return FileSpreadsheetIcon;
    if (mimetype.includes("presentation") || mimetype.includes("powerpoint"))
      return Presentation;
    if (
      mimetype.includes("zip") ||
      mimetype.includes("rar") ||
      mimetype.includes("tar")
    )
      return ArchiveIcon;
    if (
      mimetype.includes("javascript") ||
      mimetype.includes("typescript") ||
      mimetype.includes("json") ||
      mimetype.includes("xml")
    )
      return FileCodeIcon;
    return FileIcon;
  };

  const getFileTypeColor = (mimetype: string) => {
    if (mimetype.startsWith("image/")) return "text-blue-500";
    if (mimetype.startsWith("video/")) return "text-purple-500";
    if (mimetype.startsWith("audio/")) return "text-green-500";
    if (mimetype === "application/pdf") return "text-red-500";
    if (mimetype.includes("spreadsheet") || mimetype.includes("excel"))
      return "text-emerald-500";
    if (mimetype.includes("presentation") || mimetype.includes("powerpoint"))
      return "text-orange-500";
    if (
      mimetype.includes("zip") ||
      mimetype.includes("rar") ||
      mimetype.includes("tar")
    )
      return "text-yellow-500";
    if (
      mimetype.includes("javascript") ||
      mimetype.includes("typescript") ||
      mimetype.includes("json") ||
      mimetype.includes("xml")
    )
      return "text-indigo-500";
    return "text-gray-500";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const isCurrentUser = (senderId: string) => senderId === currentUserId;

  // const handleStartEdit = (message: Message) => {
  //   setEditingMessageId(message._id);
  //   setEditContent(message.content);
  // };

  const handleSaveEdit = (messageId: string) => {
    if (editContent.trim() !== "") {
      onUpdateMessage?.(messageId, editContent);
    }
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  const renderMessage = (message: Message) => {
    const isOwn = isCurrentUser(message.sender._id);
    const isEditing = editingMessageId === message._id;

    return (
      <div
        key={message._id}
        className={cn(
          "flex gap-2 mb-4",
          isOwn ? "justify-end" : "justify-start"
        )}
      >
        {!isOwn && (
          <MediaPreview
            src={message.sender.profileImage}
            alt={message.sender.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        )}

        <div className={cn("max-w-[70%]", isOwn ? "items-end" : "items-start")}>
          {/* Sender info for non-own messages */}
          {!isOwn && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{message.sender.name}</span>
              <span className="text-xs text-muted-foreground">
                @{message.sender.username}
              </span>
            </div>
          )}

          {/* Message bubble */}
          <div
            className={cn(
              "rounded-lg px-3 py-2 max-w-full break-words",
              isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
              isEditing && "ring-2 ring-blue-500"
            )}
          >
            {/* Message content */}
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-transparent border-none resize-none focus:outline-none"
                  autoFocus
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSaveEdit(message._id)}
                    className="h-6 px-2 text-xs"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="h-6 px-2 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {message.content && (
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                )}

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3">
                    <div className="grid grid-cols-2 gap-2 max-w-md">
                      {message.attachments.map((attachment) => (
                        <div key={attachment._id} className="group">
                          {attachment.mimetype.startsWith("image/") ||
                          attachment.mimetype.startsWith("video/") ? (
                            <MediaPreview
                              src={attachment.url}
                              alt={attachment.originalName}
                              className="w-full h-32 object-cover rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                              preview
                            />
                          ) : attachment.mimetype.startsWith("audio/") ? (
                            <AudioPlayer
                              src={attachment.url}
                              className="w-full"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-32 bg-background/20 backdrop-blur-sm rounded-lg border border-border/50 p-3">
                              <div
                                className={cn(
                                  "p-2 rounded-lg bg-background/30 mb-2",
                                  getFileTypeColor(attachment.mimetype)
                                )}
                              >
                                {(() => {
                                  const IconComponent = getFileIcon(
                                    attachment.mimetype
                                  );
                                  return <IconComponent className="h-8 w-8" />;
                                })()}
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-medium truncate w-full mb-1">
                                  {attachment.originalName}
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    {formatFileSize(attachment.size)}
                                  </span>
                                  <span className="text-xs px-1.5 py-0.5 bg-background/50 rounded text-muted-foreground">
                                    {attachment.mimetype
                                      .split("/")[1]
                                      ?.toUpperCase() || "FILE"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Media */}
                {message.media && message.media.length > 0 && (
                  <div className="mt-3">
                    <div className="grid grid-cols-2 gap-2 max-w-md">
                      {message.media.map((media) => (
                        <div key={media._id} className="group">
                          {media.type.startsWith("image/") ||
                          media.type.startsWith("video/") ? (
                            <MediaPreview
                              src={media.url}
                              alt="Media"
                              className="w-full h-32 object-cover rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                              preview
                            />
                          ) : media.type.startsWith("audio/") ? (
                            <AudioPlayer src={media.url} className="w-full" />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-32 bg-background/20 backdrop-blur-sm rounded-lg border border-border/50 p-3">
                              <div
                                className={cn(
                                  "p-2 rounded-lg bg-background/30 mb-2",
                                  getFileTypeColor(media.type)
                                )}
                              >
                                {(() => {
                                  const IconComponent = getFileIcon(media.type);
                                  return <IconComponent className="h-8 w-8" />;
                                })()}
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-medium mb-1">
                                  Media file
                                </div>
                                <div className="flex items-center justify-center">
                                  <span className="text-xs px-1.5 py-0.5 bg-background/50 rounded text-muted-foreground">
                                    {media.type.split("/")[1]?.toUpperCase() ||
                                      "MEDIA"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.reactions.map((reaction) => (
                      <Badge
                        key={reaction._id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {reaction.type}
                      </Badge>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Message metadata */}
          <div
            className={cn(
              "flex items-center gap-2 mt-1 text-xs text-muted-foreground",
              isOwn ? "justify-end" : "justify-start"
            )}
          >
            <span>{formatMessageDate(message.createdAt)}</span>
            {message.updated && <span className="opacity-60">(edited)</span>}
            {message.watchers &&
              message.watchers.some(
                (watcher) =>
                  watcher.user === getOtherUser(currentUserId, message)._id &&
                  !watcher.watched
              ) &&
              isOwn && (
                <Badge variant="outline" className="text-xs">
                  Unread
                </Badge>
              )}

            {/* Message actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontalIcon className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <ProtectedComponent
                  permissionKey={PERMISSION_KEYS.MESSAGES.SEND}
                >
                  <DropdownMenuItem onClick={() => onReplyToMessage?.(message)}>
                    <ReplyIcon className="h-3 w-3 mr-2" />
                    Reply
                  </DropdownMenuItem>
                </ProtectedComponent> */}

                {/* {isOwn && (
                  <ProtectedComponent
                    permissionKey={PERMISSION_KEYS.MESSAGES.SEND}
                  >
                    <DropdownMenuItem onClick={() => handleStartEdit(message)}>
                      <EditIcon className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </ProtectedComponent>
                )} */}

                {/* {isOwn && (
                  <ProtectedComponent
                    permissionKey={PERMISSION_KEYS.MESSAGES.DELETE}
                  >
                    <DropdownMenuItem
                      onClick={() => onDeleteMessage?.(message._id)}
                      className="text-destructive"
                    >
                      <TrashIcon className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </ProtectedComponent>
                )} */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isOwn && (
          <MediaPreview
            src={message.sender.profileImage}
            alt={message.sender.name}
            className="w-8 h-8 rounded-full bg-background object-cover flex-shrink-0"
          />
        )}
      </div>
    );
  };

  return (
    <ScrollArea className={cn("flex-1 px-4", className)}>
      <div className="space-y-4 py-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map(renderMessage)
        )}
      </div>
    </ScrollArea>
  );
}
