import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as React from "react";
import { VideoPlayer } from "./video-player";
import { AudioPlayer } from "./audio-player";
import { PlayIcon } from "lucide-react";

export interface MediaPreviewProps extends React.ComponentProps<typeof Avatar> {
  src: string;
  alt?: string;
  fallback?: React.ReactNode;
  preview?: boolean;
  imageClassName?: string;
  videoClassName?: string;
  posterSrc?: string;
  trigger?: React.ReactNode;
}

const getMediaType = (src: string): "image" | "video" | "audio" | "unknown" => {
  if (!src) return "unknown";

  const videoExtensions = [
    ".mp4",
    ".webm",
    ".ogg",
    ".mov",
    ".avi",
    ".wmv",
    ".flv",
    ".mkv",
  ];
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
  ];
  const audioExtensions = [".mp3", ".wav", ".ogg", ".aac", ".flac", ".m4a"];

  const lowercaseSrc = src.toLowerCase();

  if (videoExtensions.some((ext) => lowercaseSrc.includes(ext))) {
    return "video";
  }

  if (imageExtensions.some((ext) => lowercaseSrc.includes(ext))) {
    return "image";
  }

  if (audioExtensions.some((ext) => lowercaseSrc.includes(ext))) {
    return "audio";
  }

  return "unknown";
};

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  src,
  alt,
  fallback,
  preview = false,
  className,
  imageClassName = "object-cover aspect-square",
  videoClassName,
  posterSrc,
  trigger,
  ...avatarProps
}) => {
  const [open, setOpen] = React.useState(false);
  const [mediaError, setMediaError] = React.useState(false);
  const mediaType = getMediaType(src);

  const renderThumbnail = () => {
    if (mediaType === "video") {
      return (
        <div className="relative overflow-hidden w-full aspect-square ">
          <video
            src={mediaError ? undefined : src}
            poster={posterSrc}
            className={`object-cover ${imageClassName || ""}`}
            style={{ width: "100%", height: "100%" }}
            muted
            onError={() => setMediaError(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[6px] border-l-black border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5" />
            </div>
          </div>
        </div>
      );
    }
    if (mediaType === "audio") {
      return (
        <div className="flex items-center justify-center aspect-square  h-full bg-muted group transition-all rounded-lg cursor-pointer hover:bg-primary/10 relative">
          <span className="font-medium text-base text-muted-foreground truncate max-w-[120px]">
            {alt || src.split("/").pop()}
          </span>
          <span className="ml-2 bg-primary text-primary-foreground rounded-full p-1 shadow group-hover:scale-110 transition-transform">
            <PlayIcon className="w-5 h-5" />
          </span>
        </div>
      );
    }
    return (
      <AvatarImage
        src={mediaError ? undefined : src}
        alt={alt}
        className={imageClassName}
        onError={() => setMediaError(true)}
      />
    );
  };

  const avatar = (
    <Avatar className={className} {...avatarProps}>
      {renderThumbnail()}
      {mediaType !== "video" && mediaType !== "audio" && (
        <AvatarFallback>{fallback || (alt ? alt[0] : "?")}</AvatarFallback>
      )}
    </Avatar>
  );

  if (!preview || !src) return avatar;

  const renderPreviewContent = () => {
    if (mediaType === "video") {
      return (
        <VideoPlayer
          src={src}
          className={`  rounded-lg   ${videoClassName || ""}`}
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline={true}
        />
      );
    }
    if (mediaType === "audio") {
      return (
        <div className="flex flex-col items-center justify-center w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-semibold text-lg text-primary truncate max-w-[200px]">
              {alt || src.split("/").pop()}
            </span>
          </div>
          <AudioPlayer src={src} className="w-full min-w-md max-w-md" />
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          "max-w-full max-h-[70vh] rounded-lg  object-cover",
          imageClassName
        )}
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn("cursor-pointer relative group transition-all")}
      >
        {trigger || avatar}
      </DialogTrigger>
      <DialogContent className="flex flex-col w-fit min-w-0   items-center justify-center border-none max-w-md max-h-[98vh] overflow-y-auto p-0">
        {/* <DialogTitle className="text-lg font-black justify-start pt-4">
          Preview {mediaType === "video" ? "Video" : "Image"}
        </DialogTitle>
        <Separator className="w-full" /> */}
        <div className=" bg-transparent border-none w-fit">
          {renderPreviewContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
