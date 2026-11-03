import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  X,
  HelpCircle,
  Eye,
  Layers,
  Compass,
  Sparkles,
  ChevronDown,
  ScrollText,
} from 'lucide-react';
import { HeroArmillary } from './components/HeroArmillary';
import { Chapter1Geometries } from './components/Chapter1Geometries';
import { Chapter2PlanetSieve } from './components/Chapter2PlanetSieve';
import { Chapter3MilkyWay } from './components/Chapter3MilkyWay';
import { Chapter4BlackHole } from './components/Chapter4BlackHole';
import { GlossaryBottomSheet } from './components/GlossaryBottomSheet';
import { FooterConstellations } from './components/FooterConstellations';
import { CosmicRoadDock } from './components/CosmicRoadDock';
import { GlobalAudioPlayer } from './components/GlobalAudioPlayer';
import { OnboardingModal } from './components/OnboardingModal';
import { ChapterWindowView, CHAPTER_WINDOWS_DATA } from './components/ChapterWindowView';
import { usePWAInstall, useOnlineStatus } from './hooks/usePWA';

export default function App() {
  const [redNightMode, setRedNightMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aether_red_night_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('aether_onboarding_seen');
    } catch {
      return false;
    }
  });

  const [windowChapterIndex, setWindowChapterIndex] = useState<number | null>(null);
  const [windowMenuOpen, setWindowMenuOpen] = useState<boolean>(false);
  const windowMenuRef = useRef<HTMLDivElement | null>(null);

  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false);
  const [glossaryTermId, setGlossaryTermId] = useState<string | undefined>(undefined);
  const [showIOSInstallModal, setShowIOSInstallModal] = useState<boolean>(false);

  const { isInstallable, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (redNightMode) {
      document.documentElement.setAttribute('data-red-mode', 'true');
    } else {
      document.documentElement.removeAttribute('data-red-mode');
    }
    try {
      localStorage.setItem('aether_red_night_mode', String(redNightMode));
    } catch {
      // Ignore storage errors in private mode
    }
  }, [redNightMode]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (windowMenuRef.current && !windowMenuRef.current.contains(e.target as Node)) {
        setWindowMenuOpen(false);
      }
    };
    if (windowMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [windowMenuOpen]);

  const handleOpenGlossary = (termId?: string) => {
    setGlossaryTermId(termId);
    setGlossaryOpen(true);
  };

  const handleInstallAction = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSInstallModal(true);
    }
  };

  const openChapterWindow = (index: number) => {
    setWindowChapterIndex(index);
    setWindowMenuOpen(false);
  };

  const closeChapterWindow = () => {
    setWindowChapterIndex(null);
    setWindowMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-[var(--text-parchment)] flex flex-col selection:bg-[var(--accent-primary)]/30">
      {/* Sticky Header: Multi-Zone Dynamic Nav Bar (Adapted for Mobile & Desktop) */}
      <header className="sticky top-0 z-40 h-14 sm:h-16 bg-black/95 backdrop-blur-md border-b border-[var(--border-subtle)] px-2.5 sm:px-6 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Zone 1: Brand Title & View Mode Selector */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <a
            href="#hero"
            onClick={(e) => {
              if (windowChapterIndex !== null) {
                e.preventDefault();
                setWindowChapterIndex(0);
              }
            }}
            className="font-display text-sm xs:text-base sm:text-lg font-bold tracking-tight text-[var(--text-parchment)] hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1.5"
            title="Эфир и Сингулярность — Астрономический атлас"
          >
            <Compass className="w-4 h-4 text-[var(--accent-primary)] shrink-0 hidden xs:block" />
            <span>
              Эфир<span className="hidden sm:inline"> и Сингулярность</span>
            </span>
          </a>

          {/* Integrated View Mode Switcher + Chapter Dropdown Trigger */}
          <div ref={windowMenuRef} className="relative">
            <div className="flex items-center p-0.5 rounded-xl bg-[#0C0C16] border border-[var(--border-subtle)] text-[11px] font-mono-tech shadow-inner">
              <button
                type="button"
                onClick={closeChapterWindow}
                className={`px-2 py-1 sm:px-2.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  windowChapterIndex === null
                    ? 'bg-[var(--accent-primary)] text-black font-semibold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-parchment)]'
                }`}
                title="Режим сплошной ленты со скроллом"
              >
                <ScrollText className="w-3 h-3" />
                <span className="hidden xs:inline">Лента</span>
              </button>

              <button
                type="button"
                onClick={() => setWindowMenuOpen((prev) => !prev)}
                className={`px-2 py-1 sm:px-2.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  windowChapterIndex !== null
                    ? 'bg-[var(--accent-primary)] text-black font-semibold shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-parchment)]'
                }`}
                title="Открыть меню выбора отдельного окна главы"
              >
                <Layers className="w-3 h-3" />
                <span>
                  {windowChapterIndex !== null
                    ? `Гл. ${CHAPTER_WINDOWS_DATA[windowChapterIndex].number}`
                    : 'Окна'}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    windowMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Soft Animated Chapter Window Selector Dropdown Menu */}
            <AnimatePresence>
              {windowMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, scale: 0.95, filter: 'blur(4px)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.7 }}
                  className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 p-2.5 rounded-2xl bg-[#0A0A14]/98 border border-[var(--accent-primary)]/40 shadow-2xl backdrop-blur-xl space-y-1.5"
                  role="menu"
                  aria-label="Выбор окна главы"
                >
                  <div className="px-2 py-1 flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5">
                    <span className="font-mono-tech text-[10px] text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1 font-semibold">
                      <Sparkles className="w-3 h-3" />
                      Выбор окна главы
                    </span>
                    <span className="font-mono-tech text-[10px] text-[var(--text-muted)]">
                      5 глав
                    </span>
                  </div>

                  <div className="space-y-1 pt-1 max-h-[60vh] overflow-y-auto pr-0.5">
                    {CHAPTER_WINDOWS_DATA.map((ch) => {
                      const isActive = windowChapterIndex === ch.index;
                      const ChIcon = ch.icon;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => openChapterWindow(ch.index)}
                          className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between gap-2.5 group cursor-pointer ${
                            isActive
                              ? 'bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)] text-[var(--text-parchment)]'
                              : 'hover:bg-white/5 border border-transparent text-[var(--text-muted)] hover:text-[var(--text-parchment)]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                                isActive
                                  ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-sm'
                                  : 'bg-[#12121E] text-[var(--accent-primary)] border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)]/50'
                              }`}
                            >
                              <ChIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-display text-xs font-semibold text-[var(--text-parchment)] truncate flex items-center gap-1.5">
                                <span className="font-mono-tech text-[10px] text-[var(--accent-primary)]">
                                  {ch.number}
                                </span>
                                <span>{ch.shortLabel}</span>
                              </div>
                              <div className="font-mono-tech text-[9px] text-[var(--text-muted)] truncate">
                                {ch.era}
                              </div>
                            </div>
                          </div>

                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shrink-0 shadow-[0_0_8px_var(--accent-primary)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Return to scroll stream button */}
                  <div className="pt-1.5 border-t border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={closeChapterWindow}
                      className="w-full py-1.5 px-2 rounded-lg bg-[#12121E] hover:bg-[#181828] text-[var(--text-muted)] hover:text-[var(--text-parchment)] font-mono-tech text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ScrollText className="w-3 h-3 text-[var(--accent-primary)]" />
                      <span>Вернуться к сплошной ленте</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Zone 2: 4 Chapter Links (Desktop Stream Mode) */}
        <nav
          aria-label="Главы атласа"
          className="hidden xl:flex items-center gap-4 font-mono-tech text-xs text-[var(--text-muted)]"
        >
          {CHAPTER_WINDOWS_DATA.slice(1).map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                if (windowChapterIndex !== null) {
                  setWindowChapterIndex(ch.index);
                } else {
                  const el = document.getElementById(ch.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hover:text-[var(--text-parchment)] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
            >
              {ch.shortLabel}
            </button>
          ))}
        </nav>

        {/* Zone 3: Dynamic Audio Pill, Help Guide, Red Mode, and Glossary (All Mobile Adapted) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Dynamic Floating Soundtrack Controller (Instant On/Off Anywhere) */}
          <GlobalAudioPlayer redNightMode={redNightMode} />

          {/* Onboarding Guide / About Button */}
          <button
            type="button"
            onClick={() => setOnboardingOpen(true)}
            className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full bg-[#12121C] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/60 text-[var(--text-muted)] hover:text-[var(--text-parchment)] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Интерактивный путеводитель (Обучение)"
            aria-label="Гид по сайту"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Red Night Mode Toggle */}
          <button
            type="button"
            onClick={() => setRedNightMode((prev) => !prev)}
            aria-pressed={redNightMode}
            className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              redNightMode
                ? 'bg-[#2E0505] border-[#FF2E2E] text-[#FF4D4D] shadow-[0_0_10px_rgba(255,46,46,0.5)]'
                : 'bg-[#12121C] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[#FF4D4D]'
            }`}
            title={redNightMode ? 'Отключить красный режим' : 'Включить красный режим наблюдений'}
            aria-label="Ночной режим"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF3B30]" />
          </button>

          {/* Glossary Trigger (Compact Icon on Mobile, Full on Sm+) */}
          <button
            type="button"
            onClick={() => handleOpenGlossary()}
            className="w-7 h-7 xs:w-8 xs:h-8 sm:w-auto min-h-[28px] xs:min-h-[32px] sm:min-h-[38px] p-0 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl bg-[var(--accent-primary)] text-black font-mono-tech text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 hover:opacity-90 transition-all whitespace-nowrap shadow-sm cursor-pointer shrink-0"
            title="Астрономический глоссарий терминов"
            aria-label="Словарь терминов"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Словарь</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 sm:pb-32">

        {/* Hero Section */}
        <HeroArmillary
          redNightMode={redNightMode}
          onToggleRedMode={() => setRedNightMode((prev) => !prev)}
          onOpenGlossary={handleOpenGlossary}
          isInstallable={isInstallable}
          isIOS={isIOS}
          onInstallPWA={handleInstallAction}
          isOnline={isOnline}
        />

        {/* Chapter 1: Orbits & Mars Epicycles */}
        <div className="relative">
          <div className="max-w-5xl mx-auto px-4 pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => openChapterWindow(1)}
              className="text-xs font-mono-tech text-[var(--accent-primary)] hover:underline flex items-center gap-1.5 bg-[#0C0C16] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Открыть в отдельном окне</span>
            </button>
          </div>
          <Chapter1Geometries
            redNightMode={redNightMode}
            onOpenGlossary={handleOpenGlossary}
          />
        </div>

        {/* Chapter 2: Planet Sieve & Pluto */}
        <div className="relative">
          <div className="max-w-5xl mx-auto px-4 pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => openChapterWindow(2)}
              className="text-xs font-mono-tech text-[var(--accent-primary)] hover:underline flex items-center gap-1.5 bg-[#0C0C16] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Открыть в отдельном окне</span>
            </button>
          </div>
          <Chapter2PlanetSieve
            redNightMode={redNightMode}
            onOpenGlossary={handleOpenGlossary}
          />
        </div>

        {/* Chapter 3: Milky Way & 100 000 Stars */}
        <div className="relative">
          <div className="max-w-5xl mx-auto px-4 pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => openChapterWindow(3)}
              className="text-xs font-mono-tech text-[var(--accent-primary)] hover:underline flex items-center gap-1.5 bg-[#0C0C16] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Открыть в отдельном окне</span>
            </button>
          </div>
          <Chapter3MilkyWay
            redNightMode={redNightMode}
            onOpenGlossary={handleOpenGlossary}
          />
        </div>

        {/* Chapter 4: Black Hole & Event Horizon */}
        <div className="relative">
          <div className="max-w-5xl mx-auto px-4 pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => openChapterWindow(4)}
              className="text-xs font-mono-tech text-[var(--accent-primary)] hover:underline flex items-center gap-1.5 bg-[#0C0C16] border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Открыть в отдельном окне</span>
            </button>
          </div>
          <Chapter4BlackHole
            redNightMode={redNightMode}
            onOpenGlossary={handleOpenGlossary}
          />
        </div>
      </main>

      {/* Footer: Constellation Map & Navigation */}
      <FooterConstellations onOpenGlossary={handleOpenGlossary} />

      {/* Mobile-First Cosmic Road Dock (Дорожка путешествия сквозь века) */}
      <CosmicRoadDock
        onOpenGlossary={handleOpenGlossary}
        redNightMode={redNightMode}
        onOpenChapterWindow={openChapterWindow}
        isWindowMode={windowChapterIndex !== null}
        activeWindowChapterIndex={windowChapterIndex}
        onToggleWindowMode={() => {
          if (windowChapterIndex !== null) {
            closeChapterWindow();
          } else {
            openChapterWindow(1);
          }
        }}
      />

      {/* Focused Chapter Window View (Отдельное окно для каждой главы) с мягкой анимацией */}
      <AnimatePresence>
        {windowChapterIndex !== null && (
          <ChapterWindowView
            activeChapterIndex={windowChapterIndex}
            onSelectChapter={(idx) => setWindowChapterIndex(idx)}
            onCloseWindow={closeChapterWindow}
            redNightMode={redNightMode}
            onOpenGlossary={handleOpenGlossary}
          />
        )}
      </AnimatePresence>

      {/* Initial / On-Demand Cosmic Onboarding Guide Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        redNightMode={redNightMode}
      />

      {/* Interactive Glossary Bottom Sheet */}
      <GlossaryBottomSheet
        isOpen={glossaryOpen}
        initialTermId={glossaryTermId}
        onClose={() => setGlossaryOpen(false)}
        onSelectChapterWindow={openChapterWindow}
      />

      {/* iOS Safari Home Screen Installation Guide Modal с мягкой анимацией */}
      <AnimatePresence>
        {showIOSInstallModal && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70"
              onClick={() => setShowIOSInstallModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative z-10 w-full max-w-sm bg-[#09090E] border border-[var(--accent-primary)] rounded-2xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-[var(--text-parchment)]">
                  Установка на iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSInstallModal(false)}
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-parchment)] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="font-body text-base text-[var(--text-muted)] leading-relaxed">
                1. Нажмите кнопку <strong className="text-[var(--text-parchment)]">«Поделиться»</strong> в нижней панели Safari.
                <br />
                2. Выберите пункт <strong className="text-[var(--text-parchment)]">«На экран Домой»</strong> для работы без интернета.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSInstallModal(false)}
                className="min-h-[44px] w-full rounded-lg bg-[var(--accent-primary)] text-black font-mono-tech text-xs font-semibold cursor-pointer active:scale-95 transition-all"
              >
                Понятно
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
