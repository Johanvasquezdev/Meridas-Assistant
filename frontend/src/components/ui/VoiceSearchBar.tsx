'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { VoiceMicButton } from './VoiceMicButton';
import { voiceSearch } from '@/lib/voice-api';

interface VoiceSearchBarProps {
  onResults: (query: string, results: any[]) => void;
}

export function VoiceSearchBar({ onResults }: VoiceSearchBarProps) {
  const { state, lastBlob, error, start, stop, secondsRemaining } = useVoiceInput();
  const { getToken } = useAuth();

  useEffect(() => {
    async function performSearch() {
      if (state === 'done' && lastBlob) {
        try {
          const token = await getToken();
          if (!token) return;
          
          const { query, results } = await voiceSearch(lastBlob, token);
          onResults(query, results);
        } catch (err) {
          console.error('Voice search failed', err);
        }
      }
    }
    performSearch();
  }, [state, lastBlob, getToken, onResults]);

  const getStatusText = () => {
    switch (state) {
      case 'idle': return 'Search knowledge base by voice...';
      case 'recording': return 'Listening...';
      case 'transcribing': return 'Searching verified documents...';
      case 'error': return error || 'Voice search failed';
      default: return '';
    }
  };

  return (
    <div 
      className="flex items-center gap-3.5 w-full bg-[#1C1B20] border border-[#2A2832] rounded-[10px] p-3 transition-all duration-200"
    >
      <VoiceMicButton 
        state={state} 
        onStart={start} 
        onStop={stop} 
        secondsRemaining={secondsRemaining}
        size={36}
      />
      
      <div className={`font-sans text-xs flex-1 ${state === 'error' ? 'text-red-400' : 'text-[#8C8A94]'}`}>
        {getStatusText()}
      </div>
    </div>
  );
}
