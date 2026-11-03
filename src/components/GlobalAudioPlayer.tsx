import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Play, Pause, Music, Sparkles } from 'lucide-react';

interface GlobalAudioPlayerProps {
  redNightMode?: boolean;
}

export const GlobalAudioPlayer: React.FC<GlobalAudioPlayerProps> = ({ redNightMode = false }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [showVolumePopup, setShowVolumePopup] = useState<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        audio.volume = isMuted ? 0 : volume;
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Audio playback error, trying MP3 fallback:', err);
        if (!audio.src.endsWith('.mp3')) {
          audio.src = './audio/100000_stars.mp3';
          try {
            await audio.play();
            setIsPlaying(true);
          } catch (e) {
            console.error('All audio fallbacks failed:', e);
          }
        }
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (playerContainerRef.current && !playerContainerRef.current.contains(e.target as Node)) {
        setShowVolumePopup(false);
      }
    };

    if (showVolumePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVolumePopup]);

  return (
    <div ref={playerContainerRef} className="relative inline-flex items-center">
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          if (audioRef.current && !audioRef.current.src.endsWith('.mp3')) {
            audioRef.current.src = './audio/100000_stars.mp3';
            audioRef.current.play().catch(() => {});
          }
        }}
      >
        <source src="./audio/100000_stars.oga" type="audio/ogg; codecs=vorbis" />
        <source src="./audio/100000_stars.ogg" type="audio/ogg" />
        <source src="./audio/100000_stars.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Dynamic Sound Capsule */}
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-[#0A0A12]/90 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/60 shadow-lg backdrop-blur-md transition-all">
        {/* Instant Toggle Button */}
        <motion.button
          type="button"
          onClick={togglePlay}
          whileTap={{ scale: 0.9 }}
          className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isPlaying
              ? 'bg-[var(--accent-primary)] text-black shadow-[0_0_12px_rgba(212,163,115,0.7)]'
              : 'bg-[#14141E] text-[var(--text-parchment)] hover:text-[var(--accent-primary)]'
          }`}
          title={isPlaying ? 'Остановить музыку (100 000 Stars)' : 'Включить музыку (100 000 Stars)'}
          aria-label={isPlaying ? 'Пауза' : 'Воспроизведение'}
        >
          {isPlaying ? (
            <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          ) : (
            <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ml-0.5" />
          )}
        </motion.button>

        {/* Dynamic Equalizer Bars */}
        <button
          type="button"
          onClick={() => setShowVolumePopup((prev) => !prev)}
          className="flex items-center gap-1 sm:gap-1.5 px-1 sm:px-2 py-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          title="Настройки громкости"
        >
          {isPlaying ? (
            <div className="flex items-end gap-[2px] h-3 sm:h-4 w-3.5 sm:w-5">
              <span className="w-0.5 sm:w-1 bg-[var(--accent-primary)] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
              <span className="w-0.5 sm:w-1 bg-[var(--accent-primary)] rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.15s] h-2/3" />
              <span className="w-0.5 sm:w-1 bg-[var(--accent-primary)] rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.3s] h-4/5" />
            </div>
          ) : (
            <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--text-muted)]" />
          )}

          <span className="hidden md:inline font-mono-tech text-[10px] text-[var(--text-muted)] hover:text-[var(--text-parchment)] whitespace-nowrap">
            {isPlaying ? '100,000 Stars' : 'Музыка'}
          </span>
        </button>

        {/* Fast Mute Quick-Button on xs+ screens */}
        <button
          type="button"
          onClick={toggleMute}
          className="hidden xs:flex w-6 h-6 sm:w-7 sm:h-7 rounded-full items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-parchment)] hover:bg-white/5 transition-colors"
          title={isMuted ? 'Включить звук' : 'Заглушить звук'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
          ) : (
            <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          )}
        </button>
      </div>

      {/* Volume / Controls Popover with Soft Spring Motion */}
      <AnimatePresence>
        {showVolumePopup && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.94, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, scale: 0.94, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 26, mass: 0.7 }}
            className="absolute right-0 top-full mt-2 z-50 w-64 p-3.5 rounded-2xl bg-[#090912]/95 border border-[var(--accent-primary)]/40 shadow-2xl backdrop-blur-xl space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono-tech text-[10px] text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Саундтрек
              </span>
              <span className="font-mono-tech text-[10px] text-[var(--text-muted)]">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            <div>
              <div className="font-display text-sm font-semibold text-[var(--text-parchment)]">
                Sam Hulick — 100,000 Stars
              </div>
              <div className="font-mono-tech text-[10px] text-[var(--text-muted)]">
                Официальный космический эмбиент
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={toggleMute}
                className="text-[var(--text-muted)] hover:text-[var(--text-parchment)]"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-full accent-[var(--accent-primary)] cursor-pointer h-1.5 bg-[#1F1F2E] rounded-lg"
              />
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="font-mono-tech text-[9px] text-[var(--text-muted)]">
                {isPlaying ? 'Играет сейчас' : 'На паузе'}
              </span>
              <button
                type="button"
                onClick={() => setShowVolumePopup(false)}
                className="font-mono-tech text-[10px] text-[var(--accent-primary)] hover:underline"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
