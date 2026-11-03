import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ArrowUpRight } from 'lucide-react';

interface PhotographicArchiveProps {
  redNightMode?: boolean;
  onOpenPlutoDrama?: () => void;
}

type ArchiveTarget = 'earth' | 'ganymede' | 'ceres' | 'pluto';

interface CelestialArchiveData {
  id: ArchiveTarget;
  name: string;
  diameterKm: string;
  orbitLabel: string;
  orbitColor: string;
  hasDebrisRing: boolean;
  debrisType?: 'kuiper' | 'asteroid';
  imageSrc?: string;
  renderType: 'svg_asset' | 'procedural_globe';
}

const ARCHIVE_TARGETS: CelestialArchiveData[] = [
  {
    id: 'earth',
    name: 'Земля',
    diameterKm: '12 742',
    orbitLabel: '1,00 А.Е.',
    orbitColor: 'text-[var(--text-muted)]',
    hasDebrisRing: false,
    imageSrc: './assets/earth_globe.svg',
    renderType: 'svg_asset',
  },
  {
    id: 'ganymede',
    name: 'Ганимед',
    diameterKm: '5 268',
    orbitLabel: 'ЮПИТЕР · 5,20 А.Е.',
    orbitColor: 'text-[var(--text-muted)]',
    hasDebrisRing: false,
    imageSrc: './assets/Ganymede.svg',
    renderType: 'svg_asset',
  },
  {
    id: 'ceres',
    name: 'Церера',
    diameterKm: '939',
    orbitLabel: 'ГЛАВНЫЙ ПОЯС · 2,77 А.Е.',
    orbitColor: 'text-[var(--text-muted)]',
    hasDebrisRing: true,
    debrisType: 'asteroid',
    imageSrc: './assets/Ceres.svg',
    renderType: 'svg_asset',
  },
  {
    id: 'pluto',
    name: 'Плутон',
    diameterKm: '2 377',
    orbitLabel: 'ПОЯС КОЙПЕРА',
    orbitColor: 'text-[#F4A261]',
    hasDebrisRing: true,
    debrisType: 'kuiper',
    imageSrc: './assets/pluto_globe.svg',
    renderType: 'svg_asset',
  },
];

// Фиксированные реалистичные координаты осколков пояса для стабильного рендеринга
const DEBRIS_PARTICLES = [
  { angle: 0.12, rOffset: -6, size: 2.3, opacity: 0.75, color: '#E9D8A6' },
  { angle: 0.38, rOffset: 7, size: 1.7, opacity: 0.55, color: '#A0A0B0' },
  { angle: 0.65, rOffset: -3, size: 2.6, opacity: 0.85, color: '#E9D8A6' },
  { angle: 0.92, rOffset: 5, size: 1.9, opacity: 0.65, color: '#D4A373' },
  { angle: 1.15, rOffset: -8, size: 1.5, opacity: 0.45, color: '#A0A0B0' },
  { angle: 1.45, rOffset: 4, size: 2.8, opacity: 0.9, color: '#E9D8A6' },
  { angle: 1.78, rOffset: -5, size: 2.1, opacity: 0.75, color: '#E9D8A6' },
  { angle: 2.05, rOffset: 6, size: 1.8, opacity: 0.55, color: '#A0A0B0' },
  { angle: 2.32, rOffset: -4, size: 2.5, opacity: 0.8, color: '#E9D8A6' },
  { angle: 2.62, rOffset: 8, size: 1.6, opacity: 0.5, color: '#D4A373' },
  { angle: 2.91, rOffset: -7, size: 2.7, opacity: 0.85, color: '#E9D8A6' },
  { angle: 3.21, rOffset: 5, size: 2.0, opacity: 0.7, color: '#E9D8A6' },
  { angle: 3.48, rOffset: -3, size: 2.2, opacity: 0.75, color: '#D4A373' },
  { angle: 3.76, rOffset: 7, size: 1.6, opacity: 0.55, color: '#A0A0B0' },
  { angle: 4.05, rOffset: -6, size: 2.7, opacity: 0.85, color: '#E9D8A6' },
  { angle: 4.35, rOffset: 4, size: 1.9, opacity: 0.65, color: '#E9D8A6' },
  { angle: 4.65, rOffset: -5, size: 2.4, opacity: 0.8, color: '#E9D8A6' },
  { angle: 4.98, rOffset: 8, size: 1.7, opacity: 0.55, color: '#D4A373' },
  { angle: 5.25, rOffset: -4, size: 2.6, opacity: 0.85, color: '#E9D8A6' },
  { angle: 5.52, rOffset: 6, size: 2.1, opacity: 0.7, color: '#E9D8A6' },
  { angle: 5.82, rOffset: -7, size: 1.8, opacity: 0.6, color: '#A0A0B0' },
  { angle: 6.10, rOffset: 5, size: 2.5, opacity: 0.8, color: '#E9D8A6' },
];

export const PhotographicArchive: React.FC<PhotographicArchiveProps> = ({
  onOpenPlutoDrama,
}) => {
  const [activeId, setActiveId] = useState<ArchiveTarget>('pluto');

  const activeTarget =
    ARCHIVE_TARGETS.find((t) => t.id === activeId) || ARCHIVE_TARGETS[3];

  return (
    <div className="bg-[#05060A] border border-[var(--border-subtle)] rounded-2xl p-3.5 sm:p-5 shadow-2xl space-y-3.5 sm:space-y-4">
      {/* Top Header: Title and Target Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div className="font-mono-tech text-xs sm:text-sm text-[var(--text-parchment)] tracking-wide">
          Фотографический архив:
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {ARCHIVE_TARGETS.map((target) => {
            const isActive = target.id === activeId;
            return (
              <button
                key={target.id}
                type="button"
                onClick={() => setActiveId(target.id)}
                className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg font-mono-tech text-xs sm:text-sm transition-all cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-[#E9D8A6] text-black font-semibold shadow-[0_0_12px_rgba(233,216,166,0.35)]'
                    : 'bg-[#0E0F18] text-[var(--text-muted)] hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {target.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Photographic Display Frame */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center select-none">
        {/* Subtle background space radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,24,38,0.35)_0%,rgba(0,0,0,0.98)_72%)] pointer-events-none" />

        {/* Top-Left Metric: D / KM */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 font-mono-tech flex flex-col pointer-events-none">
          <span className="text-[11px] sm:text-xs text-[var(--text-muted)] tracking-wider">
            D / KM
          </span>
          <span className="text-lg sm:text-2xl font-bold text-[#E9D8A6] tracking-tight mt-0.5">
            {activeTarget.diameterKm}
          </span>
        </div>

        {/* Bottom-Right Metric: Orbit Distance / Belt */}
        <div
          className={`absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 font-mono-tech text-[10px] sm:text-xs tracking-wider uppercase pointer-events-none ${activeTarget.orbitColor}`}
        >
          {activeTarget.orbitLabel}
        </div>

        {/* Celestial Body Center Stage with Orbit and Debris */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTarget.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Background SVG Layer: Diagonal Axis Line (for Earth/Ganymede) + Back Half of Orbit */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 460 300"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Diagonal reference trajectory line for Earth and Ganymede (as in reference screenshots) */}
              {!activeTarget.hasDebrisRing && (
                <line
                  x1="125"
                  y1="262"
                  x2="335"
                  y2="38"
                  stroke="rgba(212, 163, 115, 0.32)"
                  strokeWidth="1.2"
                  strokeDasharray="4 5"
                />
              )}

              {/* Horizontal Elliptical Orbit Track (Back Half) */}
              <g transform="translate(230, 150)">
                <path
                  d="M -162 0 A 162 50 0 0 1 162 0"
                  fill="none"
                  stroke="rgba(212, 163, 115, 0.28)"
                  strokeWidth="1.15"
                  strokeDasharray="4 5"
                />

                {/* Kuiper or Asteroid Belt Debris in back arc */}
                {activeTarget.hasDebrisRing &&
                  DEBRIS_PARTICLES.slice(0, 11).map((p, idx) => {
                    const angle = Math.PI + (idx / 11) * Math.PI;
                    const rx = 162 + p.rOffset * 1.4;
                    const ry = 50 + p.rOffset * 0.6;
                    const px = Math.cos(angle) * rx;
                    const py = Math.sin(angle) * ry;
                    return (
                      <circle
                        key={`back-${idx}`}
                        cx={px}
                        cy={py}
                        r={p.size * 0.78}
                        fill={p.color}
                        opacity={p.opacity * 0.6}
                      />
                    );
                  })}
              </g>
            </svg>

            {/* Central Photographic Globe Object */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">
                <img
                  src={activeTarget.imageSrc}
                  alt={activeTarget.name}
                  className="w-full h-full object-contain block drop-shadow-[0_0_25px_rgba(0,0,0,0.95)]"
                  loading="eager"
                />
                {/* Occator Crater bright facula marker on Ceres (matching reference screenshot) */}
                {activeTarget.id === 'ceres' && (
                  <div
                    className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#E9D8A6] shadow-[0_0_10px_#E9D8A6] pointer-events-none"
                    style={{ left: '52.5%', top: '48.5%', transform: 'translate(-50%, -50%)' }}
                  />
                )}
              </div>
            </div>

            {/* Foreground Orbit Arc and Debris Layer (Passes in front of planet) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-15"
              viewBox="0 0 460 300"
              preserveAspectRatio="xMidYMid meet"
            >
              <g transform="translate(230, 150)">
                {/* Front half of orbit */}
                <path
                  d="M 162 0 A 162 50 0 0 1 -162 0"
                  fill="none"
                  stroke="rgba(212, 163, 115, 0.42)"
                  strokeWidth="1.25"
                  strokeDasharray="4 5"
                />

                {/* Kuiper or Asteroid Belt Debris in front arc */}
                {activeTarget.hasDebrisRing &&
                  DEBRIS_PARTICLES.slice(11).map((p, idx) => {
                    const angle = (idx / 11) * Math.PI;
                    const rx = 162 + p.rOffset * 1.4;
                    const ry = 50 + p.rOffset * 0.6;
                    const px = Math.cos(angle) * rx;
                    const py = Math.sin(angle) * ry;
                    return (
                      <circle
                        key={`front-${idx}`}
                        cx={px}
                        cy={py}
                        r={p.size}
                        fill={p.color}
                        opacity={p.opacity}
                      />
                    );
                  })}
              </g>
            </svg>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prominent Action Button: Story of Eris Discovery & 2006 Drama */}
      <button
        type="button"
        onClick={onOpenPlutoDrama}
        className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#090B14] hover:bg-[#0E1220] border border-[#2DD4BF]/40 hover:border-[#2DD4BF] text-[#2DD4BF] font-mono-tech text-xs sm:text-sm font-medium flex items-center justify-between gap-2 active:scale-98 transition-all cursor-pointer shadow-sm group"
      >
        <span className="flex items-center gap-2 truncate">
          <HelpCircle className="w-4 h-4 shrink-0 text-[#2DD4BF] group-hover:scale-110 transition-transform" />
          <span className="truncate">История открытия Эриды и драма 2006 года</span>
        </span>
        <ArrowUpRight className="w-4 h-4 shrink-0 text-[#2DD4BF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
};
