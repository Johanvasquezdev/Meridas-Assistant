'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronDown, ChevronUp } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  audioBlob?: Blob;
  audioUrl?: string;
  summaryText?: string;
  isLoading?: boolean;
}

export function AudioPlayer({ audioBlob, audioUrl, summaryText, isLoading: externalLoading }: AudioPlayerProps) {
  const { 
    isPlaying, 
    isLoading: internalLoading, 
    progress, 
    currentTime, 
    duration, 
    play, 
    pause, 
    resume, 
    seek 
  } = useAudioPlayer();

  const [showText, setShowText] = useState(false);
  const isLoading = externalLoading || internalLoading;
  const [hasInitialized, setHasInitialized] = useState(false);
  const lastSourceRef = React.useRef<Blob | string | null>(null);

  const startPlayback = React.useCallback(async () => {
    const currentSource = audioBlob || audioUrl;
    if (!currentSource) return;

    try {
      lastSourceRef.current = currentSource;
      await play(currentSource);
      setHasInitialized(true);
    } catch (err) {
      console.error('Audio playback failed or was blocked:', err);
    }
  }, [audioBlob, audioUrl, play]);

  useEffect(() => {
    const currentSource = audioBlob || audioUrl;
    if (currentSource && currentSource !== lastSourceRef.current && !hasInitialized) {
      startPlayback();
    }
  }, [audioBlob, audioUrl, hasInitialized, startPlayback]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, x / rect.width));
    seek(fraction);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-md font-sans">
      <div className="flex items-center gap-3 w-full bg-[#1C1B20] border border-[#2A2832] rounded-[10px] p-2.5 shadow-sm">
        <button
          type="button"
          onClick={isPlaying ? pause : resume}
          className="flex size-7 items-center justify-center rounded-[6px] bg-[#9E1B32] text-[#F7F3EA] hover:bg-[#BA243F] transition-colors border border-[#C9A227]/30 shrink-0"
          title={isPlaying ? "Pause Audio" : "Play Audio"}
        >
          {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" className="ml-0.5" />}
        </button>

        <div 
          role="button"
          tabIndex={0}
          aria-label="Seek audio"
          className="relative flex-1 h-1.5 bg-[#151417] rounded-full overflow-hidden cursor-pointer group outline-none"
          onClick={handleProgressBarClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
            }
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent animate-shimmer" />
          )}
          <div 
            className="absolute top-0 left-0 h-full bg-[#C9A227] rounded-full transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="font-sans text-[11px] text-[#8C8A94] min-w-[70px] text-right font-medium">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {summaryText && (
        <div className="flex flex-col gap-1 font-sans">
          <button
            type="button"
            onClick={() => setShowText(!showText)}
            className="flex items-center gap-1 font-sans text-xs text-[#8C8A94] hover:text-[#F7F3EA] transition-colors w-fit font-medium"
          >
            {showText ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showText ? 'Hide transcript' : 'Show transcript'}
          </button>
          
          {showText && (
            <div className="bg-[#1C1B20]/60 border-l-2 border-[#C9A227] rounded-r-[8px] p-3 font-sans text-xs text-[#F7F3EA]/90 leading-relaxed">
              {summaryText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
