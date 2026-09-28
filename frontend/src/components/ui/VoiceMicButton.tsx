'use client';

import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { VoiceState } from '@/hooks/useVoiceInput';
import { cn } from '@/lib/utils';

interface VoiceMicButtonProps {
  state: VoiceState;
  onStart: () => void;
  onStop: () => void;
  secondsRemaining?: number;
  size?: number;
  disabled?: boolean;
}

export function VoiceMicButton({ 
  state, 
  onStart, 
  onStop, 
  secondsRemaining, 
  size = 44,
  disabled = false
}: VoiceMicButtonProps) {
  const isIdle = state === 'idle';
  const isRequesting = state === 'requesting';
  const isRecording = state === 'recording';
  const isTranscribing = state === 'transcribing';
  const isError = state === 'error';

  return (
    <div className="relative inline-flex flex-col items-center">
      {isRecording && secondsRemaining !== undefined && secondsRemaining <= 15 && (
        <div className="absolute -top-6 font-sans text-[11px] font-semibold text-[#C9A227] animate-pulse">
          0:{secondsRemaining.toString().padStart(2, '0')}
        </div>
      )}
      
      <button
        type="button"
        onClick={isRecording ? onStop : onStart}
        disabled={disabled || isRequesting || isTranscribing}
        title={
          isRecording
            ? 'Stop Recording'
            : isTranscribing
            ? 'Transcribing Audio...'
            : 'Ask with Voice'
        }
        className={cn(
          "relative flex items-center justify-center rounded-[10px] border transition-all duration-200 active:scale-95 group",
          isRecording &&
            "border-[#9E1B32] bg-[#9E1B32]/20 text-[#F7F3EA] shadow-lg shadow-[#9E1B32]/30",
          (isRequesting || isTranscribing) &&
            "border-[#C9A227]/40 bg-[#1C1B20] text-[#C9A227]",
          isError &&
            "border-red-500/40 bg-red-500/10 text-red-400",
          isIdle &&
            "border-[#2A2832] bg-[#1C1B20] text-[#8C8A94] hover:border-[#C9A227]/50 hover:text-[#F7F3EA] hover:bg-[#222027]",
          disabled && "opacity-40 cursor-not-allowed"
        )}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
        }}
      >
        {isRecording && (
          <span className="absolute inset-0 rounded-[10px] border border-[#9E1B32] animate-ping opacity-40 pointer-events-none" />
        )}

        {isRequesting || isTranscribing ? (
          <Loader2 
            size={Math.round(size * 0.45)} 
            className="animate-spin text-[#C9A227]" 
          />
        ) : isError ? (
          <MicOff size={Math.round(size * 0.45)} className="text-red-400" />
        ) : (
          <Mic 
            size={Math.round(size * 0.45)} 
            className={cn(
              "transition-colors",
              isRecording ? "text-[#F7F3EA]" : "text-[#8C8A94] group-hover:text-[#F7F3EA]"
            )} 
          />
        )}
      </button>
    </div>
  );
}
