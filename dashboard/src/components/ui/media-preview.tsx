import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Separator } from "./separator";
import { VideoPlayer } from "./video-player";

export interface MediaPreviewProps extends React.ComponentProps<typeof Avatar> {
  src: string;
  alt?: string;
  fallback?: React.ReactNode;
  preview?: boolean;
  imageClassName?: string;
  videoClassName?: string;
  posterSrc?: string;
}

const getMediaType = (src: string): "image" | "video" | "unknown" => {
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

  const lowercaseSrc = src.toLowerCase();

  if (videoExtensions.some((ext) => lowercaseSrc.includes(ext))) {
    return "video";
  }

  if (imageExtensions.some((ext) => lowercaseSrc.includes(ext))) {
    return "image";
  }

  return "unknown";
};

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  src,
  alt,
  fallback,
  preview = false,
  className,
  imageClassName,
  videoClassName,
  posterSrc,
  ...avatarProps
}) => {
  const [open, setOpen] = React.useState(false);
  const [mediaError, setMediaError] = React.useState(false);
  const mediaType = getMediaType(src);

  const renderThumbnail = () => {
    if (mediaType === "video") {
      return (
        <div className="relative overflow-hidden w-full ">
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
      {mediaType !== "video" && (
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
          className={`  rounded-lg border ${videoClassName || ""}`}
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline={true}
        />
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          "max-w-full max-h-[70vh] rounded-lg border object-cover",
          imageClassName
        )}
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer relative">
        {avatar}
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center max-w-md max-h-[98vh] overflow-y-auto p-0">
        <DialogTitle className="text-lg font-black justify-start pt-4">
          Preview {mediaType === "video" ? "Video" : "Image"}
        </DialogTitle>
        <Separator className="w-full" />
        <div className="p-4 w-full">{renderPreviewContent()}</div>
      </DialogContent>
    </Dialog>
  );
};
