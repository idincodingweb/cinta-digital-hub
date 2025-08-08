import React, { useEffect, useRef, useState } from 'react';
import { Music, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackgroundMusicProps {
  musicChoice: number;
}

const BackgroundMusic = ({ musicChoice }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const getMusicUrl = (choice: number) => {
    // Using free music from online sources
    switch (choice) {
      case 1: // Piano Romantis
        return 'https://www.soundjay.com/misc/sounds/piano-moment.mp3';
      case 2: // Gitar Akustik
        return 'https://www.soundjay.com/misc/sounds/acoustic-guitar.mp3';
      case 3: // Instrumental
        return 'https://www.soundjay.com/misc/sounds/relaxing-music.mp3';
      default:
        return '';
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const musicUrl = getMusicUrl(musicChoice);
    if (musicUrl) {
      audio.src = musicUrl;
      audio.loop = true;
      audio.volume = 0.3;
    }

    return () => {
      audio.pause();
    };
  }, [musicChoice]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasInteracted(true);

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  };

  // Auto-play after user interaction
  useEffect(() => {
    if (hasInteracted && !isPlaying) {
      const audio = audioRef.current;
      if (audio) {
        audio.play().catch(() => {
          // Silently fail if auto-play is blocked
        });
      }
    }
  }, [hasInteracted]);

  const musicUrl = getMusicUrl(musicChoice);
  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} preload="auto" />
      
      {/* Music Control Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={togglePlay}
          size="lg"
          className="rounded-full w-14 h-14 bg-primary/20 backdrop-blur-sm border border-primary/30 hover:bg-primary/30 shadow-soft"
        >
          {isPlaying ? (
            <Volume2 className="w-6 h-6 text-primary" />
          ) : (
            <VolumeX className="w-6 h-6 text-primary" />
          )}
        </Button>
      </div>

      {/* Music Info Tooltip */}
      {!hasInteracted && (
        <div className="fixed bottom-20 right-6 z-40 bg-primary/10 backdrop-blur-sm rounded-lg p-3 text-sm text-primary animate-bounce">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span>Klik untuk musik</span>
          </div>
        </div>
      )}
    </>
  );
};

export default BackgroundMusic;