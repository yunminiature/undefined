import { useCallback, useEffect, useRef, useState } from 'react';

import { AudioManager } from './AudioManager';
import { AudioConfig, SoundType } from './types';

export function useAudio() {
  const audioManagerRef = useRef<AudioManager | null>(null);
  const [config, setConfig] = useState<AudioConfig>({
    volume: 0.5,
    enabled: true,
  });

  useEffect(() => {
    audioManagerRef.current = new AudioManager();

    const handleUserInteraction = async () => {
      if (audioManagerRef.current) {
        await audioManagerRef.current.resume();
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (audioManagerRef.current) {
      audioManagerRef.current.setConfig(config);
    }
  }, [config]);

  const playSound = useCallback((soundType: SoundType, options?: { value?: number }) => {
    if (audioManagerRef.current) {
      audioManagerRef.current.playSound(soundType, options);
    }
  }, []);

  const toggleEnabled = useCallback(() => {
    setConfig((prev) => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  return {
    playSound,
    config,
    toggleEnabled,
  };
}
