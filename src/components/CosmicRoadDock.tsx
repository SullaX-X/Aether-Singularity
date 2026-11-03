import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Compass, Orbit, Disc, Navigation, CircleDot, Check } from 'lucide-react';

export interface CosmicStation {
  id: string;
  number: string;
  title: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  colorRed: string;
  glow: string;
}

export const COSMIC_STATIONS: CosmicStation[] = [
  {
    id: 'hero',
    number: '0',
    title: 'Эфир и Сферы',
    shortLabel: 'Эфир',
    icon: Compass,
    color: '#D4A373', // Celestial Gold
    colorRed: '#FF3B30',
    glow: 'rgba(212, 163, 115, 0.85)',
  },
  {
    id: 'chapter-1',
    number: '1',
    title: 'Битва Геометрий',
    shortLabel: 'Орбиты',
    icon: Orbit,
    color: '#FF5400', // Mars Coral / Kepler Bronze
    colorRed: '#FF5252',
    glow: 'rgba(255, 84, 0, 0.85)',
  },
  {
    id: 'chapter-2',
    number: '2',
    title: 'Сито планет',
    shortLabel: 'Плутон',
    icon: Disc,
    color: '#38BDF8', // Kuiper Ice Cyan
    colorRed: '#FF6E85',
    glow: 'rgba(56, 189, 248, 0.85)',
  },
  {
    id: 'chapter-3',
    number: '3',
    title: 'Млечный Путь',
    shortLabel: 'Галактика',
    icon: Navigation,
    color: '#A78BFA', // Galactic Violet
    colorRed: '#E040FB',
    glow: 'rgba(167, 139, 250, 0.85)',
  },
  {
    id: 'chapter-4',
    number: '4',
    title: 'Горизонт событий',
    shortLabel: 'Дыра',
    icon: CircleDot,
    color: '#F59E0B', // Accretion Flare Gold
    colorRed: '#FF1744',
    glow: 'rgba(245, 158, 11, 0.85)',
  },
];

interface CosmicRoadDockProps {
  onOpenGlossary: (termId?: string) => void;
  redNightMode: boolean;
  onOpenChapterWindow?: (index: number) => void;
  isWindowMode?: boolean;
  activeWindowChapterIndex?: number | null;
  onToggleWindowMode?: () => void;
}

export const CosmicRoadDock: React.FC<CosmicRoadDockProps> = ({
  onOpenGlossary,
  redNightMode,
  onOpenChapterWindow,
  isWindowMode = false,
  activeWindowChapterIndex,
  onToggleWindowMode,
}) => {
  const [activeStationId, setActiveStationId] = useState<string>('hero');
  const [scrollProgress, setScrollProgress] = useState<number>(0); // 0.0 to 4.0 continuous index
  const isClickNavigatingRef = useRef<boolean>(false);
  const clickTimerRef = useRef<number | null>(null);

  // Synchronize with activeWindowChapterIndex in window mode, or continuous chapter-by-chapter scroll in stream mode
  useEffect(() => {
    if (isWindowMode && activeWindowChapterIndex !== undefined && activeWindowChapterIndex !== null) {
      setScrollProgress(activeWindowChapterIndex);
      const st = COSMIC_STATIONS[activeWindowChapterIndex];
      if (st) setActiveStationId(st.id);
      return;
    }

    let ticking = false;

    const updateProgress = () => {
      if (isClickNavigatingRef.current) {
        ticking = false;
        return;
      }

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      // Bottom of page check (Chapter 4 Black Hole)
      if (scrollY + windowHeight >= scrollHeight - 60) {
        setScrollProgress(COSMIC_STATIONS.length - 1);
        setActiveStationId(COSMIC_STATIONS[COSMIC_STATIONS.length - 1].id);
        ticking = false;
        return;
      }

      // Top of page check (Hero Armillary)
      if (scrollY <= 25) {
        setScrollProgress(0);
        setActiveStationId(COSMIC_STATIONS[0].id);
        ticking = false;
        return;
      }

      // Collect TRUE absolute document coordinates of each chapter (getBoundingClientRect + scrollY)
      // This completely avoids incorrect offsets caused by relative parent containers
      const positions: number[] = COSMIC_STATIONS.map((station) => {
        const el = document.getElementById(station.id);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.top + scrollY;
      });

      // User reading focus zone: 35% down from top of viewport
      const focusY = scrollY + windowHeight * 0.35;

      let computedProgress = 0;

      if (focusY <= positions[0]) {
        computedProgress = 0;
      } else if (focusY >= positions[positions.length - 1]) {
        computedProgress = positions.length - 1;
      } else {
        // Linearly interpolate strictly within the current chapter interval
        for (let i = 0; i < positions.length - 1; i++) {
          const start = positions[i];
          const end = positions[i + 1];
          if (focusY >= start && focusY < end) {
            const span = end - start;
            const ratio = span > 0 ? (focusY - start) / span : 0;
            computedProgress = i + ratio;
            break;
          }
        }
      }

      setScrollProgress(computedProgress);

      const closestIndex = Math.min(
        COSMIC_STATIONS.length - 1,
        Math.max(0, Math.round(computedProgress))
      );
      if (COSMIC_STATIONS[closestIndex]) {
        setActiveStationId(COSMIC_STATIONS[closestIndex].id);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (clickTimerRef.current) {
        window.clearTimeout(clickTimerRef.current);
      }
    };
  }, [isWindowMode, activeWindowChapterIndex]);

  const scrollToStation = (id: string, index: number) => {
    if (isWindowMode && onOpenChapterWindow) {
      onOpenChapterWindow(index);
      return;
    }

    // Lock continuous scroll briefly to give immediate tactile feedback upon click
    isClickNavigatingRef.current = true;
    setScrollProgress(index);
    setActiveStationId(id);

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
    }
    clickTimerRef.current = window.setTimeout(() => {
      isClickNavigatingRef.current = false;
    }, 850);
  };

  // Percentage of journey completed between station 0 and station 4
  const progressRatio = Math.max(
    0,
    Math.min(1, scrollProgress / (COSMIC_STATIONS.length - 1))
  );
  const progressPercent = progressRatio * 100;

  return (
    <nav
      aria-label="Космическая дорожка путешествия"
      className="fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-6 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-2 pointer-events-none"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl mx-auto pointer-events-auto bg-[#07070B]/95 backdrop-blur-md border border-[var(--border-subtle)] rounded-2xl sm:rounded-full p-2 sm:px-4 shadow-[0_8px_32px_rgba(0,0,0,0.85)] flex items-center justify-between gap-2"
      >
        {/* The Cosmic Road (Дорожка) with Waypoint Circles */}
        <div className="relative flex-1 flex items-center justify-between">
          {/* LAYER 0: Background Connecting Track Line (Strictly in background, passes BEHIND opaque circles) */}
          <div className="absolute left-[18px] sm:left-[20px] right-[18px] sm:right-[20px] top-[18px] sm:top-[20px] -translate-y-1/2 h-[3px] bg-[#141420] rounded-full overflow-hidden pointer-events-none z-0">
            {/* Active Colored Progress Fill Line */}
            <div
              className="h-full rounded-full transition-[width] duration-200 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: redNightMode
                  ? 'linear-gradient(90deg, #FF3B30 0%, #FF5252 25%, #FF6E85 50%, #E040FB 75%, #FF1744 100%)'
                  : 'linear-gradient(90deg, #D4A373 0%, #FF5400 25%, #38BDF8 50%, #A78BFA 75%, #F59E0B 100%)',
                boxShadow: redNightMode
                  ? '0 0 10px rgba(255, 59, 48, 0.7)'
                  : '0 0 10px rgba(212, 163, 115, 0.7)',
              }}
            />
          </div>

          {/* LAYER 10: Station Buttons (Elevated strictly above the line with 100% SOLID opaque backgrounds) */}
          {COSMIC_STATIONS.map((station, index) => {
            // A station is reached strictly when scroll progress arrives at or passes its checkpoint
            const isReached = isWindowMode
              ? index <= (activeWindowChapterIndex ?? 0)
              : scrollProgress >= index - 0.15;

            // A station is currently active if we are focused on this specific chapter
            const isCurrentActive = isWindowMode
              ? index === (activeWindowChapterIndex ?? 0)
              : Math.round(scrollProgress) === index;

            const stationColor = redNightMode ? station.colorRed : station.color;
            const stationGlow = redNightMode ? 'rgba(255, 46, 46, 0.85)' : station.glow;
            const Icon = station.icon;

            return (
              <motion.button
                key={station.id}
                type="button"
                onClick={() => scrollToStation(station.id, index)}
                whileTap={{ scale: 0.90 }}
                className="relative z-10 flex flex-col items-center group focus:outline-none py-1 cursor-pointer"
                aria-label={`Перейти к главе: ${station.title}`}
                title={`${station.number} · ${station.title} ${
                  isCurrentActive ? '(Текущая)' : isReached ? '(Пройдено)' : '(Ещё не открыто)'
                }`}
              >
                {/* 100% SOLID OPAQUE Circular Badge: physically occludes the line behind it so it NEVER cuts through the icon! */}
                <div
                  style={{
                    backgroundColor: isCurrentActive
                      ? stationColor
                      : isReached
                      ? '#12121E' // 100% Solid Opaque Dark Glass Base
                      : '#090910', // 100% Solid Opaque Dark Void Base (Hides the line completely!)
                    borderColor: isCurrentActive
                      ? '#FFFFFF'
                      : isReached
                      ? stationColor
                      : '#232332',
                    boxShadow: isCurrentActive
                      ? `0 0 16px ${stationGlow}, 0 0 4px #FFFFFF`
                      : isReached
                      ? `0 0 10px ${stationColor}50`
                      : 'none',
                    transform: isCurrentActive ? 'scale(1.12)' : isReached ? 'scale(1.0)' : 'scale(0.92)',
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 relative z-10"
                >
                  <Icon
                    style={{
                      color: isCurrentActive ? '#000000' : isReached ? stationColor : '#484858',
                    }}
                    className="w-4 h-4 transition-colors duration-300"
                  />

                  {/* Micro checkmark for passed chapters */}
                  {isReached && !isCurrentActive && (
                    <span
                      style={{ backgroundColor: stationColor }}
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full flex items-center justify-center text-black shadow-sm"
                    >
                      <Check className="w-2 h-2 text-black stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Minimalist Station Label */}
                <span
                  style={{
                    color: isCurrentActive
                      ? stationColor
                      : isReached
                      ? '#E2E8F0'
                      : '#4A4A5A',
                  }}
                  className={`hidden sm:block font-mono-tech text-[10px] mt-1.5 transition-colors duration-300 leading-none whitespace-nowrap ${
                    isCurrentActive ? 'font-bold' : isReached ? 'font-medium' : 'font-normal'
                  }`}
                >
                  {station.shortLabel}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="w-[1px] h-7 bg-[#252535] mx-1 shrink-0" />

        {/* Window Mode Toggle Button */}
        {onToggleWindowMode && (
          <motion.button
            type="button"
            onClick={onToggleWindowMode}
            whileTap={{ scale: 0.94 }}
            className={`min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-full border font-mono-tech text-[11px] font-semibold flex items-center gap-1.5 active:scale-95 transition-all shrink-0 ${
              isWindowMode
                ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)]'
                : 'bg-[#14141F] text-[var(--text-parchment)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
            }`}
            title="Переключить в отдельное окно главы"
            aria-label="Режим окна главы"
          >
            <span>{isWindowMode ? 'Лента' : 'Окно'}</span>
          </motion.button>
        )}

        {/* Quick Glossary Circle/Pill Button in Thumb Zone */}
        <motion.button
          type="button"
          onClick={() => onOpenGlossary()}
          whileTap={{ scale: 0.94 }}
          className="min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-full bg-[#14141F] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-parchment)] font-mono-tech text-[11px] font-semibold flex items-center gap-1.5 active:scale-95 transition-all shrink-0"
          aria-label="Открыть словарь терминов"
        >
          <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span className="hidden xs:inline">Словарь</span>
        </motion.button>
      </motion.div>
    </nav>
  );
};
