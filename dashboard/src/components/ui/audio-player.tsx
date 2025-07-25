import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PauseIcon, PlayIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export interface AudioPlayerProps {
  src: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, className }) => {
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
};
