import { useState, useEffect, useCallback } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = useCallback(async (element?: HTMLElement) => {
    try {
      const targetElement = element || document.documentElement;
      await targetElement.requestFullscreen();
      return true;
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      return false;
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
      return false;
    }
  }, []);

  const toggleFullscreen = useCallback(
    async (element?: HTMLElement) => {
      if (isFullscreen) {
        return await exitFullscreen();
      } else {
        return await enterFullscreen(element);
      }
    },
    [isFullscreen, enterFullscreen, exitFullscreen]
  );

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
};
