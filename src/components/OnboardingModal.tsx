import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Sparkles,
  Orbit,
  Music,
  ChevronRight,
  ChevronLeft,
  Check,
  Layers,
  X,
  Sliders,
  Move3d,
  HandMetal,
  Volume2,
  Eye,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  redNightMode?: boolean;
}

interface StepItem {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  visualType: 'sphere' | 'window' | 'touch' | 'audio';
}

const STEPS: StepItem[] = [
  {
    badge: 'ЭТАП 01 / 04',
    title: 'Где вы находитесь?',
    subtitle: 'Атлас эволюции космической мысли',
    description:
      'Добро пожаловать в «Эфир и Сингулярность» — научно-просветительский атлас, воссоздающий 2500 лет развития астрономии: от хрустальных сфер Аристотеля и эпициклов Птолемея до горизонта событий чёрных дыр.',
    icon: Compass,
    tags: ['2500 лет науки', 'Астрофизика', 'Интерактивный атлас'],
    visualType: 'sphere',
  },
  {
    badge: 'ЭТАП 02 / 04',
    title: 'Автономные Окна Глав',
    subtitle: 'Фокусированный минимализм для экранов',
    description:
      'Каждая глава оформлена в отдельное окно со своими координатами эпохи, сжатыми иконками и лаконичными синонимами. Вся информация сохранена в компактных раскрывающихся карточках, не закрывая 3D-графику.',
    icon: Layers,
    tags: ['Оконный режим', 'Без визуального шума', 'Быстрые вкладки'],
    visualType: 'window',
  },
  {
    badge: 'ЭТАП 03 / 04',
    title: '3D и Сенсорные Жесты',
    subtitle: 'Вращение, приближение и симуляции',
    description:
      'На мобильных и планшетах взаимодействуйте напрямую: вращайте 3D-модели одним пальцем, зумируйте жестом pinch-to-zoom 100 000 звёзд нашей галактики и меняйте наклоны аккреционного диска.',
    icon: Orbit,
    tags: ['Pinch-to-zoom', 'Сенсорные жесты', 'WebGL 60 FPS'],
    visualType: 'touch',
  },
  {
    badge: 'ЭТАП 04 / 04',
    title: 'Музыка и Ночной Режим',
    subtitle: 'Полное погружение в космос',
    description:
      'В правом верхнем углу закреплён динамический плеер: включайте и выключайте саундтрек 100,000 Stars (Sam Hulick) в один тап из любой точки сайта. А для наблюдений в темноте включите красный спектр.',
    icon: Music,
    tags: ['Динамический плеер', '100 000 Stars OST', 'Красный свет'],
    visualType: 'audio',
  },
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 30 },
      opacity: { duration: 0.28 },
      scale: { duration: 0.28 },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    scale: 0.97,
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 30 },
      opacity: { duration: 0.22 },
      scale: { duration: 0.22 },
    },
  }),
};

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  redNightMode = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      setDirection(1);
      setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSelectStep = (idx: number) => {
    setDirection(idx > currentStep ? 1 : -1);
    setCurrentStep(idx);
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('aether_onboarding_seen', 'true');
    } catch {
      // Ignore private storage error
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Вводный путеводитель по атласу"
        >
          {/* Backdrop click to dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleComplete}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-lg bg-[#070710]/95 border border-[var(--border-subtle)] rounded-2xl sm:rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden max-h-[92vh] z-10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Cosmic Radial Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-28 bg-[var(--accent-primary)]/15 blur-3xl pointer-events-none rounded-full" />

            {/* Top Header Bar */}
            <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-[var(--border-subtle)] flex items-center justify-between relative z-10 shrink-0">
              <div className="flex items-center gap-2">
                <motion.div
                  key={`badge-icon-${currentStep}`}
                  initial={{ rotate: -20, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-7 h-7 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-primary)] shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.div>
                <span className="font-mono-tech text-[11px] sm:text-xs text-[var(--accent-primary)] tracking-wider font-semibold">
                  {step.badge}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleComplete}
                  className="font-mono-tech text-[11px] text-[var(--text-muted)] hover:text-[var(--text-parchment)] px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors hidden sm:inline"
                >
                  Пропустить
                </button>
                <button
                  type="button"
                  onClick={handleComplete}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-parchment)] hover:bg-white/10 active:scale-95 transition-all"
                  title="Закрыть обучение"
                  aria-label="Закрыть обучение"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Step Body with Swipe Gesture on Mobile */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1 relative z-10">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, { offset, velocity }) => {
                    const swipeConfidenceThreshold = 10000;
                    const swipePower = Math.abs(offset.x) * velocity.x;

                    if (swipePower < -swipeConfidenceThreshold || offset.x < -50) {
                      handleNext();
                    } else if (swipePower > swipeConfidenceThreshold || offset.x > 50) {
                      handlePrev();
                    }
                  }}
                  className="space-y-4 touch-pan-y"
                >
                  {/* Step Visual Interactive Illustration Banner */}
                  <div className="w-full h-32 sm:h-36 rounded-2xl bg-[#0B0B16] border border-[var(--border-subtle)] relative overflow-hidden flex items-center justify-center shadow-inner">
                    {/* Visual 1: Rotating Celestial Spheres */}
                    {step.visualType === 'sphere' && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                          className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-dashed border-[var(--accent-primary)]/40"
                        />
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                          className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[var(--accent-secondary)]/50"
                        />
                        <div className="relative z-10 w-10 h-10 rounded-full bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)] flex items-center justify-center text-[var(--accent-primary)] shadow-[0_0_20px_rgba(212,163,115,0.6)]">
                          <Compass className="w-5 h-5 animate-pulse" />
                        </div>
                        {/* Orbiting celestial dots */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                          className="absolute w-28 h-28 flex items-start justify-center"
                        >
                          <div className="w-2 h-2 rounded-full bg-[var(--text-parchment)] shadow-[0_0_8px_#FFF]" />
                        </motion.div>
                      </div>
                    )}

                    {/* Visual 2: Window Mode Preview */}
                    {step.visualType === 'window' && (
                      <div className="w-full max-w-xs p-3 space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-[#202030]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                          </div>
                          <span className="font-mono-tech text-[9px] text-[var(--accent-primary)]">
                            ОКНО ГЛАВЫ 01
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="p-1.5 rounded-lg bg-[#141424] border border-[var(--border-subtle)] text-center font-mono-tech text-[9px] text-[var(--text-parchment)]"
                          >
                            🪐 Марс
                          </motion.div>
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, delay: 0.2, repeat: Infinity }}
                            className="p-1.5 rounded-lg bg-[#141424] border border-[var(--border-subtle)] text-center font-mono-tech text-[9px] text-[var(--accent-primary)]"
                          >
                            📐 e=0.093
                          </motion.div>
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, delay: 0.4, repeat: Infinity }}
                            className="p-1.5 rounded-lg bg-[#141424] border border-[var(--border-subtle)] text-center font-mono-tech text-[9px] text-[var(--text-muted)]"
                          >
                            ⏱ 687d
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* Visual 3: Touch & Pinch-to-zoom gestures */}
                    {step.visualType === 'touch' && (
                      <div className="relative flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute w-24 h-24 rounded-full border-2 border-[var(--accent-secondary)]"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.12, 1] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                          className="w-14 h-14 rounded-2xl bg-[#141426] border border-[var(--accent-secondary)]/60 flex items-center justify-center text-[var(--accent-secondary)] shadow-lg"
                        >
                          <Move3d className="w-6 h-6 animate-pulse" />
                        </motion.div>
                        <div className="absolute -bottom-6 font-mono-tech text-[10px] text-[var(--text-muted)]">
                          Вращение & Zoom
                        </div>
                      </div>
                    )}

                    {/* Visual 4: Audio Equalizer & Red Mode */}
                    {step.visualType === 'audio' && (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="flex items-end gap-1.5 h-10 px-4 py-2 rounded-xl bg-black/70 border border-[var(--border-subtle)]">
                          <motion.span
                            animate={{ height: ['40%', '100%', '30%', '80%'] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1.5 bg-[var(--accent-primary)] rounded-full"
                          />
                          <motion.span
                            animate={{ height: ['80%', '30%', '95%', '50%'] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1.5 bg-[var(--accent-primary)] rounded-full"
                          />
                          <motion.span
                            animate={{ height: ['30%', '85%', '40%', '100%'] }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1.5 bg-[var(--accent-primary)] rounded-full"
                          />
                          <motion.span
                            animate={{ height: ['90%', '40%', '80%', '30%'] }}
                            transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1.5 bg-[var(--accent-primary)] rounded-full"
                          />
                          <motion.span
                            animate={{ height: ['50%', '90%', '35%', '70%'] }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1.5 bg-[var(--accent-primary)] rounded-full"
                          />
                        </div>
                        <span className="font-mono-tech text-[10px] text-[var(--accent-primary)] flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          100,000 Stars (Sam Hulick)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Step Text Info */}
                  <div className="space-y-1">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-parchment)] tracking-tight">
                      {step.title}
                    </h2>
                    <p className="font-mono-tech text-xs text-[var(--accent-primary)]">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {step.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-[#0E0E1B] border border-[var(--border-subtle)] font-mono-tech text-[10px] text-[var(--text-parchment)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Mobile Swipe Hint */}
                  <div className="pt-1 text-center sm:hidden">
                    <span className="font-mono-tech text-[10px] text-[var(--text-muted)] opacity-70">
                      ← Смахните влево или вправо →
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Actions and Responsive Indicators */}
            <div className="px-4 sm:px-6 py-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3 relative z-10 shrink-0 bg-[#080812]">
              {/* Stepper Dots */}
              <div className="flex items-center gap-1.5">
                {STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectStep(idx)}
                    aria-label={`Перейти к шагу ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? 'w-7 bg-[var(--accent-primary)] shadow-[0_0_8px_rgba(212,163,115,0.7)]'
                        : 'w-2 bg-[#252538] hover:bg-[var(--text-muted)]'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="min-h-[42px] px-3 sm:px-3.5 rounded-xl border border-[var(--border-subtle)] font-mono-tech text-xs text-[var(--text-muted)] hover:text-[var(--text-parchment)] hover:border-[var(--accent-primary)]/40 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Назад</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="min-h-[42px] px-4 sm:px-5 rounded-xl bg-[var(--accent-primary)] text-black font-mono-tech text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_16px_rgba(212,163,115,0.35)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  <span>{isLast ? 'Начать исследование' : 'Далее'}</span>
                  {isLast ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
