import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Eye, Sparkles } from 'lucide-react';

interface MilkyWayPerspectiveProps {
  redNightMode?: boolean;
}

type PerspectiveMode = 'top' | 'inside';

export const MilkyWayPerspective: React.FC<MilkyWayPerspectiveProps> = ({
  redNightMode,
}) => {
  const [mode, setMode] = useState<PerspectiveMode>('top');

  return (
    <div className="bg-[#05060A] border border-[var(--border-subtle)] rounded-2xl p-3.5 sm:p-5 shadow-2xl space-y-3.5 sm:space-y-4">
      {/* Top Header: Title and Perspective Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div className="font-mono-tech text-xs sm:text-sm text-[var(--text-parchment)] tracking-wide flex items-center gap-2">
          <span>Ракурс диска:</span>
        </div>

        {/* Toggle Buttons [ Сверху ] [ Изнутри ] */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setMode('top')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-lg font-mono-tech text-xs sm:text-sm transition-all cursor-pointer active:scale-95 ${
              mode === 'top'
                ? 'bg-[#E9D8A6] text-black font-semibold shadow-[0_0_12px_rgba(233,216,166,0.35)]'
                : 'bg-[#0E0F18] text-[var(--text-muted)] hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            Сверху
          </button>
          <button
            type="button"
            onClick={() => setMode('inside')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-lg font-mono-tech text-xs sm:text-sm transition-all cursor-pointer active:scale-95 ${
              mode === 'inside'
                ? 'bg-[#E9D8A6] text-black font-semibold shadow-[0_0_12px_rgba(233,216,166,0.35)]'
                : 'bg-[#0E0F18] text-[var(--text-muted)] hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            Изнутри
          </button>
        </div>
      </div>

      {/* Main Photographic Perspective Viewport */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[440px] rounded-xl bg-black border border-white/10 overflow-hidden flex items-center justify-center select-none shadow-inner">
        <AnimatePresence mode="wait">
          {mode === 'top' ? (
            /* MODE 1: СВЕРХУ (Face-on photographic galaxy disk with reticles and Sun callout) */
            <motion.div
              key="view-top"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
            >
              {/* Face-on Milky Way SVG Asset */}
              <img
                src="./assets/milky_way_face_on.svg"
                alt="Млечный Путь: вид сверху"
                className="w-full h-full object-contain pointer-events-none"
                loading="eager"
              />

              {/* Overlaid Coordinate Reticles & Callouts */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 420 320"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Center of Galaxy crosshair and radius ring */}
                <g transform="translate(202, 160)">
                  {/* Concentric Dashed Galactic Radius Circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r="82"
                    fill="none"
                    stroke="rgba(212, 163, 115, 0.3)"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />
                  {/* Crosshairs */}
                  <line
                    x1="-100"
                    y1="0"
                    x2="100"
                    y2="0"
                    stroke="rgba(212, 163, 115, 0.2)"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="0"
                    y1="-100"
                    x2="0"
                    y2="100"
                    stroke="rgba(212, 163, 115, 0.2)"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />

                  {/* Sun Position Marker (R = 8.2 kpc on right) */}
                  <g transform="translate(36, -2)">
                    {/* Reticle Circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r="12"
                      fill="none"
                      stroke="#E9D8A6"
                      strokeWidth="1.5"
                    />
                    {/* Inner Sun Dot */}
                    <circle cx="0" cy="0" r="3" fill="#E9D8A6" />

                    {/* Leader Callout Line */}
                    <polyline
                      points="8,8 18,34 32,34"
                      fill="none"
                      stroke="#E9D8A6"
                      strokeWidth="1.4"
                    />
                  </g>
                </g>
              </svg>

              {/* Text Label: "Мы здесь" positioned neatly by the callout */}
              <div
                className="absolute pointer-events-none font-serif text-lg sm:text-2xl text-[#E9D8A6] font-normal tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                style={{ top: '64%', left: '57%' }}
              >
                Мы здесь
              </div>

              {/* Bottom-Left Metric: R☉ / 8,2 КПК */}
              <div className="absolute bottom-2.5 left-3 sm:bottom-4 sm:left-5 font-mono-tech text-xs sm:text-sm text-[var(--text-parchment)] tracking-wider pointer-events-none drop-shadow-md">
                R☉ / 8,2 КПК
              </div>

              {/* Bottom-Right Metric: D / ≈100 000 СВ. ЛЕТ */}
              <div className="absolute bottom-2.5 right-3 sm:bottom-4 sm:right-5 font-mono-tech text-xs sm:text-sm text-[var(--text-parchment)] tracking-wider pointer-events-none drop-shadow-md">
                D / ≈100 000 СВ. ЛЕТ
              </div>
            </motion.div>
          ) : (
            /* MODE 2: ИЗНУТРИ (Edge-on inside panorama looking along the galactic disk) */
            <motion.div
              key="view-inside"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
            >
              {/* Edge-on Milky Way from the Sun SVG Asset */}
              <img
                src="./assets/milky_way_from_sun.svg"
                alt="Млечный Путь: вид изнутри вдоль диска"
                className="w-full h-full object-cover pointer-events-none"
                loading="eager"
              />

              {/* Dashed Galactic Equator Plane Line (b = 0°) */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-b border-dashed border-white/25 pointer-events-none w-full" />

              {/* Top-Left Coordinate: l / 000° */}
              <div className="absolute top-2.5 left-3 sm:top-4 sm:left-5 font-mono-tech text-xs sm:text-sm text-[var(--text-parchment)] tracking-wider pointer-events-none drop-shadow-md">
                l / 000°
              </div>

              {/* Bottom-Right Coordinate: b / +00° */}
              <div className="absolute bottom-4 right-3 sm:bottom-5 sm:right-5 font-mono-tech text-xs sm:text-sm text-[var(--text-parchment)] tracking-wider pointer-events-none drop-shadow-md">
                b / +00°
              </div>

              {/* Prominent Aesthetic Statement at Bottom-Left: "Мы смотрим вдоль диска." */}
              <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-6 max-w-[80%] pointer-events-none">
                <h3 className="font-serif text-xl sm:text-3xl text-[#E9D8A6] font-normal leading-tight tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  Мы смотрим вдоль диска.
                </h3>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
