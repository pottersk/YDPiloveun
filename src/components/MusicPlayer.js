'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); 
  const [currentTrack, setCurrentTrack] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('currentTrackIndex') || '0');
    }
    return 0;
  });
  const audioRef = useRef(null);
  
  const playlist = useMemo(() => [
    '/music/lofi-1.mp3',
  ], []);

  const canAutoplay = useMemo(() => hasInteracted, [hasInteracted]);

  useEffect(() => {
    let hasUserInteracted = false;

    const startPlayback = async () => {
      if (hasUserInteracted || !audioRef.current) return;
      
      hasUserInteracted = true;
      setHasInteracted(true);
      setIsPlaying(true);
      
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          localStorage.setItem('musicIsPlaying', 'true');
        }
      } catch (error) {
        console.log("Autoplay prevented:", error);
        setIsPlaying(false);
        hasUserInteracted = false;
      }
    };

    const handleInteraction = () => {
      startPlayback();
    };

    const events = ['click', 'touchstart', 'scroll', 'keydown', 'mousemove'];
    
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    
    if (isPlaying) {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Playback error:", error);
          setIsPlaying(false);
        });
      }
    }

    localStorage.setItem('currentTrackIndex', currentTrack.toString());
    
  }, [currentTrack, isPlaying]); 

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInteracted) return;

    if (isPlaying) {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Play error:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }

  }, [isPlaying, hasInteracted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNextTrack = useCallback(() => {
    setCurrentTrack((current) => (current + 1) % playlist.length);
    setIsPlaying(true);
  }, [playlist.length]);

  const onEnded = useCallback(() => {
    playNextTrack();
  }, [playNextTrack]);

  const getButtonClass = (isPrimary = false) => {
    if (isPrimary) {
      return 'w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-900 transition-colors';
    }
    return 'w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors';
  };

  const getIconClass = (isLarge = false) => {
    return isLarge ? 'h-5 w-5' : 'h-4 w-4';
  };

  const renderPlayPauseIcon = () => {
    if (isPlaying) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={getIconClass(true)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className={getIconClass(true)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const renderEqualizer = () => {
    if (!isPlaying) return null;
    
    return (
      <div className="flex gap-1 ml-2">
        <span className="w-1 h-4 bg-slate-800 rounded-full animate-pulse"></span>
        <span className="w-1 h-4 bg-slate-800 rounded-full animate-pulse delay-75"></span>
        <span className="w-1 h-4 bg-slate-800 rounded-full animate-pulse delay-150"></span>
      </div>
    );
  };

  const showNextButton = useMemo(() => playlist.length > 1, [playlist.length]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center gap-2">
          
          <button
            onClick={togglePlay}
            className={getButtonClass(true)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {renderPlayPauseIcon()}
          </button>
          
          {showNextButton && (
            <button
              onClick={playNextTrack}
              className={getButtonClass(false)}
              aria-label="Next track"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={getIconClass(false)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {renderEqualizer()}
        </div>
      </div>
      
      <audio
        ref={audioRef}
        src={playlist[currentTrack]}
        onEnded={onEnded}
        preload="auto"
      />
    </div>
  );
};

export default MusicPlayer;