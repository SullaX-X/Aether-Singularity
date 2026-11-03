import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, BookOpen, ChevronDown, ChevronUp, Orbit, Sparkles } from 'lucide-react';

export type CosmologyModel = 'ptolemy' | 'copernicus' | 'tycho';

interface Chapter1GeometriesProps {
  redNightMode: boolean;
  onOpenGlossary: (termId?: string) => void;
}

interface ModelMeta {
  id: CosmologyModel;
  shortTab: string;
  badgeNum: string;
  glyph: string;
  paradigm: string;
  era: string;
  centerBody: string;
  fullTitle: string;
  simpleSummary: string;
  whatToWatch: string;
}

const MODELS: Record<CosmologyModel, ModelMeta> = {
  ptolemy: {
    id: 'ptolemy',
    shortTab: 'Птолемей',
    badgeNum: 'I',
    glyph: '⊕',
    paradigm: 'Геоцентризм',
    era: '150 г.',
    centerBody: 'Земля в центре',
    fullTitle: 'Птолемей: «Колёса внутри колёс»',
    simpleSummary:
      'Земля неподвижна в центре. Петля Марса объясняется малым колесом (эпициклом), катящимся по большому кругу.',
    whatToWatch:
      'Следите за Марсом: вращаясь по малому кругу, он чертит загадочную петлю на небе.',
  },
  copernicus: {
    id: 'copernicus',
    shortTab: 'Коперник',
    badgeNum: 'II',
    glyph: '☉',
    paradigm: 'Гелиоцентризм',
    era: '1543 г.',
    centerBody: 'Солнце в центре',
    fullTitle: 'Коперник: Солнце в центре',
    simpleSummary:
      'В центре — Солнце! Земля обгоняет медленный Марс по внутренней траектории, создавая оптическую иллюзию петли.',
    whatToWatch:
      'Никаких лишних колёс! Петля возникает сама в момент обгона более быстрой Землёй.',
  },
  tycho: {
    id: 'tycho',
    shortTab: 'Тихо Браге',
    badgeNum: 'III',
    glyph: '⚯',
    paradigm: 'Гео-гелио',
    era: '1588 г.',
    centerBody: 'Компромисс',
    fullTitle: 'Тихо Браге: Компромисс систем',
    simpleSummary:
      'Земля в центре, вокруг неё летит Солнце, а все планеты вращаются вокруг летящего Солнца.',
    whatToWatch:
      'Орбита Марса движется вместе с Солнцем, в точности повторяя математику Коперника.',
  },
};

export const Chapter1Geometries: React.FC<Chapter1GeometriesProps> = ({
  redNightMode,
  onOpenGlossary,
}) => {
  const [activeModel, setActiveModel] = useState<CosmologyModel>('ptolemy');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [showDetails, setShowDetails] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeModelRef = useRef<CosmologyModel>(activeModel);
  activeModelRef.current = activeModel;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;

  const redModeRef = useRef(redNightMode);
  redModeRef.current = redNightMode;

  const trailRef = useRef<Array<{ x: number; y: number }>>([]);
  const timeRef = useRef<number>(0);

  const playTactileClick = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Ignore if audio is restricted
    }
  };

  const handleSelectModel = (model: CosmologyModel) => {
    if (activeModel === model) return;
    playTactileClick();
    setActiveModel(model);
    trailRef.current = [];
  };

  const handleResetTrail = () => {
    playTactileClick();
    trailRef.current = [];
    timeRef.current = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let isDragging = false;
    let lastX = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      timeRef.current += dx * 0.015;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.44;

      const isRed = redModeRef.current;
      const gold = isRed ? '#FF2E2E' : '#D4A373';
      const goldMuted = isRed ? 'rgba(255, 46, 46, 0.28)' : 'rgba(212, 163, 115, 0.28)';
      const cyanEarth = isRed ? '#FF6666' : '#4CC9F0';
      const marsRed = isRed ? '#FF1A1A' : '#FF5400';
      const parchment = isRed ? '#FF4D4D' : '#E9D8A6';

      const model = activeModelRef.current;

      if (isPlayingRef.current && !isDragging) {
        timeRef.current += 0.014 * speedRef.current;
      }
      const t = timeRef.current;

      const omegaMars = 1.0;
      const omegaEarth = 1.8808;

      // Outer ring of stars
      ctx.save();
      ctx.strokeStyle = isRed ? 'rgba(255,46,46,0.2)' : 'rgba(212,163,115,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 24; i++) {
        const ang = (i / 24) * Math.PI * 2;
        const sx = cx + Math.cos(ang) * maxR;
        const sy = cy + Math.sin(ang) * maxR;
        ctx.fillStyle = i % 2 === 0 ? gold : goldMuted;
        ctx.beginPath();
        ctx.arc(sx, sy, i % 2 === 0 ? 1.8 : 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      const rEarthHelio = maxR * 0.37;
      const rMarsHelio = maxR * 0.62;

      const defX = cx + Math.cos(t * omegaMars) * rMarsHelio;
      const defY = cy + Math.sin(t * omegaMars) * rMarsHelio;
      const ptolemyMarsX = defX + Math.cos(t * omegaEarth) * rEarthHelio;
      const ptolemyMarsY = defY + Math.sin(t * omegaEarth) * rEarthHelio;

      const copEarthX = cx + Math.cos(t * omegaEarth) * rEarthHelio;
      const copEarthY = cy + Math.sin(t * omegaEarth) * rEarthHelio;
      const copMarsX = cx + Math.cos(t * omegaMars) * rMarsHelio;
      const copMarsY = cy + Math.sin(t * omegaMars) * rMarsHelio;

      const tychoSunX = cx + Math.cos(t * omegaEarth) * (maxR * 0.33);
      const tychoSunY = cy + Math.sin(t * omegaEarth) * (maxR * 0.33);
      const tychoMarsX = tychoSunX + Math.cos(t * omegaMars) * (maxR * 0.54);
      const tychoMarsY = tychoSunY + Math.sin(t * omegaMars) * (maxR * 0.54);
      const tychoVenusX = tychoSunX + Math.cos(t * 2.9) * (maxR * 0.21);
      const tychoVenusY = tychoSunY + Math.sin(t * 2.9) * (maxR * 0.21);

      let earthX = cx;
      let earthY = cy;
      let sunX = cx;
      let sunY = cy;
      let marsX = ptolemyMarsX;
      let marsY = ptolemyMarsY;

      if (model === 'ptolemy') {
        earthX = cx;
        earthY = cy;
        sunX = cx + Math.cos(t * omegaEarth + 1.1) * (maxR * 0.25);
        sunY = cy + Math.sin(t * omegaEarth + 1.1) * (maxR * 0.25);
        marsX = ptolemyMarsX;
        marsY = ptolemyMarsY;

        ctx.save();
        // Deferent
        ctx.strokeStyle = goldMuted;
        ctx.lineWidth = 1.3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(cx, cy, rMarsHelio, 0, Math.PI * 2);
        ctx.stroke();

        // Epicycle
        ctx.strokeStyle = gold;
        ctx.setLineDash([]);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(defX, defY, rEarthHelio, 0, Math.PI * 2);
        ctx.stroke();

        // Radius arm
        ctx.strokeStyle = goldMuted;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(defX, defY);
        ctx.lineTo(marsX, marsY);
        ctx.stroke();

        ctx.fillStyle = gold;
        ctx.beginPath();
        ctx.arc(defX, defY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (model === 'copernicus') {
        sunX = cx;
        sunY = cy;
        earthX = copEarthX;
        earthY = copEarthY;
        marsX = copMarsX;
        marsY = copMarsY;

        ctx.save();
        ctx.strokeStyle = isRed ? 'rgba(255,80,80,0.35)' : 'rgba(76, 201, 240, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, rEarthHelio, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = isRed ? 'rgba(255,46,46,0.35)' : 'rgba(255, 84, 0, 0.35)';
        ctx.beginPath();
        ctx.arc(cx, cy, rMarsHelio, 0, Math.PI * 2);
        ctx.stroke();

        // Line of sight from Earth through Mars to outer star sphere
        const vx = marsX - earthX;
        const vy = marsY - earthY;
        const vLen = Math.hypot(vx, vy) || 1;
        const ux = vx / vLen;
        const uy = vy / vLen;

        const ex = earthX - cx;
        const ey = earthY - cy;
        const b = 2 * (ex * ux + ey * uy);
        const c = ex * ex + ey * ey - maxR * maxR;
        const disc = Math.max(0, b * b - 4 * c);
        const rayT = (-b + Math.sqrt(disc)) / 2;
        const projX = earthX + ux * rayT;
        const projY = earthY + uy * rayT;

        ctx.strokeStyle = parchment;
        ctx.lineWidth = 1.3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(earthX, earthY);
        ctx.lineTo(projX, projY);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.fillStyle = marsRed;
        ctx.beginPath();
        ctx.arc(projX, projY, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = parchment;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      } else if (model === 'tycho') {
        earthX = cx;
        earthY = cy;
        sunX = tychoSunX;
        sunY = tychoSunY;
        marsX = tychoMarsX;
        marsY = tychoMarsY;

        ctx.save();
        // Sun orbit around Earth
        ctx.strokeStyle = gold;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * 0.33, 0, Math.PI * 2);
        ctx.stroke();

        // Venus & Mars orbits centered on moving Sun
        ctx.strokeStyle = goldMuted;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(sunX, sunY, maxR * 0.21, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = isRed ? 'rgba(255,46,46,0.45)' : 'rgba(255, 84, 0, 0.45)';
        ctx.beginPath();
        ctx.arc(sunX, sunY, maxR * 0.54, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = gold;
        ctx.beginPath();
        ctx.arc(tychoVenusX, tychoVenusY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Record glowing Mars trail
      const trail = trailRef.current;
      trail.push({ x: marsX, y: marsY });
      if (trail.length > 250) {
        trail.shift();
      }

      if (trail.length > 2) {
        ctx.save();
        for (let i = 1; i < trail.length; i++) {
          const alpha = (i / trail.length) * 0.85;
          ctx.strokeStyle = isRed
            ? `rgba(255, 46, 46, ${alpha})`
            : `rgba(255, 84, 0, ${alpha})`;
          ctx.lineWidth = 1.4 + (i / trail.length) * 1.8;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw Sun
      ctx.save();
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, 16);
      sunGrad.addColorStop(0, isRed ? '#FF6666' : '#FFF3B0');
      sunGrad.addColorStop(0.5, gold);
      sunGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = gold;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Earth
      ctx.save();
      ctx.fillStyle = cyanEarth;
      ctx.beginPath();
      ctx.arc(earthX, earthY, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Draw Mars
      ctx.save();
      ctx.fillStyle = marsRed;
      ctx.beginPath();
      ctx.arc(marsX, marsY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = parchment;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      // Clear text labels on bodies
      ctx.save();
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillStyle = cyanEarth;
      ctx.fillText('Земля', earthX + 9, earthY - 6);
      ctx.fillStyle = gold;
      ctx.fillText('Солнце', sunX + 9, sunY + 13);
      ctx.fillStyle = marsRed;
      ctx.fillText('Марс', marsX + 9, marsY - 6);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const currentMeta = MODELS[activeModel];

  return (
    <section
      id="chapter-1"
      className="w-full bg-black py-10 sm:py-16 px-4 sm:px-8 border-b border-[var(--border-subtle)]"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Clean Mobile Header with Scroll Micro-Animation */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2"
        >
          <div className="font-mono-tech text-xs text-[var(--accent-primary)]">
            ГЛАВА 1 · ТРИ СИСТЕМЫ МИРА
          </div>
          <h2
            className="font-display text-2xl sm:text-4xl font-semibold text-[var(--text-parchment)]"
            style={{ textWrap: 'balance' }}
          >
            Почему Марс рисует петли на небе?
          </h2>
          <p className="font-body text-base sm:text-lg text-[var(--text-muted)]">
            Переключайте три вкладки под моделью, чтобы увидеть, как Птолемей, Коперник и Тихо Браге объясняли одно и то же загадочное движение Марса.
          </p>
        </motion.div>

        {/* Unified Mobile Card: Canvas + 3 Tabs + Clear Explanation right below */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#06060A] border border-[var(--border-subtle)] rounded-2xl p-3 sm:p-6 space-y-4 sm:space-y-5"
        >
          {/* Responsive Visual Legend & Planetary Controls (Fully Mobile-Adapted) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
            {/* Celestial Body Telemetry Chips */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono-tech text-[11px] sm:text-xs">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0C1420]/80 border border-[var(--accent-secondary)]/25 text-[var(--accent-secondary)] whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] shadow-[0_0_6px_var(--accent-secondary)] shrink-0" />
                <span>Земля</span>
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#1A150A]/80 border border-[var(--accent-primary)]/25 text-[var(--accent-primary)] whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_6px_var(--accent-primary)] shrink-0" />
                <span>Солнце</span>
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#220B06]/80 border border-[var(--accent-tertiary)]/25 text-[var(--accent-tertiary)] whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-tertiary)] shadow-[0_0_6px_var(--accent-tertiary)] animate-pulse shrink-0" />
                <span>Марс</span>
                <span className="opacity-60 text-[9px] hidden sm:inline">(петля)</span>
              </span>
            </div>

            {/* Compact Simulation Controls */}
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  setIsPlaying((p) => !p);
                }}
                className={`min-h-[34px] px-2.5 sm:px-3 py-1 rounded-lg border font-mono-tech text-[11px] sm:text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
                  isPlaying
                    ? 'border-[var(--border-subtle)] bg-[#0C0C14] hover:bg-[#161622] text-[var(--text-parchment)]'
                    : 'border-[var(--accent-primary)]/60 bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] animate-pulse'
                }`}
                title={isPlaying ? 'Приостановить симуляцию' : 'Запустить движение'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                )}
                <span>{isPlaying ? 'Пауза' : 'Пуск'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetTrail}
                className="min-h-[34px] px-2.5 sm:px-3 py-1 rounded-lg border border-[var(--border-subtle)] bg-[#0C0C14] hover:bg-[#161622] font-mono-tech text-[11px] sm:text-xs text-[var(--text-muted)] hover:text-[var(--text-parchment)] flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                title="Очистить нарисованную траекторию Марса"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Сброс</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Interactive Canvas */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative w-full aspect-square max-h-[340px] sm:max-h-[400px] flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  style={{ touchAction: 'pan-y' }}
                  className="w-full h-full cursor-grab active:cursor-grabbing block"
                  aria-label="Симуляция орбит Земли, Солнца и Марса"
                />
              </div>

              {/* Subtitle Drag scrubber hint */}
              <div className="flex items-center justify-center gap-1.5 mt-1 font-mono-tech text-[11px] text-[var(--text-muted)] opacity-70">
                <span>👆 Проведите по холсту для перемотки орбит</span>
              </div>

              {/* Premium Astrolabe-Grade Segmented Model Selector */}
              <div className="w-full mt-3 space-y-2">
                <div className="flex items-center justify-between px-1 font-mono-tech text-[11px]">
                  <span className="flex items-center gap-1.5 text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                    <Orbit className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    Модель мира:
                  </span>
                  <span className="text-[var(--accent-primary)] font-semibold flex items-center gap-1 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] inline-block animate-pulse" />
                    {currentMeta.centerBody}
                  </span>
                </div>

                <div
                  role="tablist"
                  aria-label="Выбор модели мира"
                  className="relative w-full grid grid-cols-3 gap-1.5 p-1.5 bg-[#090912]/95 backdrop-blur-md border border-[var(--border-subtle)] rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_8px_24px_rgba(0,0,0,0.5)]"
                >
                  {(['ptolemy', 'copernicus', 'tycho'] as CosmologyModel[]).map((id) => {
                    const active = activeModel === id;
                    const m = MODELS[id];
                    return (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => handleSelectModel(id)}
                        className="relative min-h-[54px] sm:min-h-[60px] p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-center cursor-pointer select-none group touch-manipulation outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-primary)]"
                      >
                        {/* Smooth Gliding Floating Indicator (Framer Motion spring) */}
                        {active && (
                          <motion.div
                            layoutId="activeTheoryIndicator"
                            className={`absolute inset-0 rounded-xl ${
                              redNightMode
                                ? 'bg-gradient-to-b from-[#FF5E5E] to-[#C91A1A] shadow-[0_2px_16px_rgba(255,46,46,0.5),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-[#FF7E7E]/60'
                                : 'bg-gradient-to-b from-[#F5E8C4] via-[#EBD9A4] to-[#D4A373] shadow-[0_2px_18px_rgba(212,163,115,0.4),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-[#FFF0C7]/70'
                            }`}
                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                          />
                        )}

                        {/* High-contrast content layer */}
                        <div className="relative z-10 flex flex-col items-center justify-center w-full px-1">
                          <div className="flex items-center justify-center gap-1.5 w-full">
                            {/* Medallion Badge */}
                            <span
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold font-mono-tech shrink-0 transition-all ${
                                active
                                  ? redNightMode
                                    ? 'bg-[#250303] text-[#FFA8A8] shadow-sm'
                                    : 'bg-[#181109] text-[#F5E8C4] shadow-sm'
                                  : 'bg-[#14141F] text-[var(--accent-primary)]/80 border border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)]/50'
                              }`}
                            >
                              {m.badgeNum}
                            </span>

                            {/* Name */}
                            <span
                              className={`text-xs sm:text-sm font-display tracking-tight transition-colors truncate ${
                                active
                                  ? redNightMode
                                    ? 'text-[#1B0202] font-bold'
                                    : 'text-[#181109] font-bold'
                                  : 'text-[var(--text-muted)] group-hover:text-[var(--text-parchment)] font-medium'
                              }`}
                            >
                              {m.shortTab}
                            </span>
                          </div>

                          {/* Paradigm & Era Sub-label */}
                          <div
                            className={`flex items-center gap-1 mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] font-mono-tech tracking-wider uppercase transition-colors ${
                              active
                                ? redNightMode
                                  ? 'text-[#3B0505] font-semibold'
                                  : 'text-[#3E2914] font-semibold'
                                : 'text-[var(--text-muted)] opacity-60 group-hover:opacity-90'
                            }`}
                          >
                            <span>{m.paradigm}</span>
                            <span className="opacity-40 hidden xs:inline">·</span>
                            <span className="opacity-75 hidden xs:inline">{m.era}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Minimalist Summary & Collapsible Details (Минимализм по тексту) */}
            <div className="lg:col-span-5 space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-4 sm:p-5 rounded-2xl bg-black border border-[var(--border-subtle)] space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[var(--accent-primary)]">
                      <span className="px-2 py-0.5 rounded-full bg-[#14141F] border border-[var(--border-subtle)]">
                        {currentMeta.paradigm}
                      </span>
                      <span>{currentMeta.era}</span>
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-[var(--accent-primary)]">
                      {currentMeta.fullTitle}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                    className="font-mono-tech text-[11px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center gap-1 shrink-0 px-2 py-1 rounded-lg bg-[#0C0C12] border border-[var(--border-subtle)] cursor-pointer"
                  >
                    <span>{showDetails ? 'Скрыть' : 'Инфо'}</span>
                    {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Minimalist 1-sentence punchy summary on main screen */}
                <p className="font-body text-sm sm:text-base text-[var(--text-parchment)] leading-relaxed">
                  {currentMeta.simpleSummary}
                </p>

                {/* Collapsible Deep Dive (Мягкое открытие и закрытие) */}
                <AnimatePresence initial={false}>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, filter: 'blur(3px)' }}
                      animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
                      exit={{ opacity: 0, height: 0, filter: 'blur(3px)' }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="pt-2.5 mt-2 border-t border-[var(--border-subtle)] space-y-2 overflow-hidden"
                    >
                      <div className="font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                        <strong className="text-[var(--text-parchment)]">На что смотреть:</strong>{' '}
                        {currentMeta.whatToWatch}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {[
                          { id: 'epicycle', label: 'Эпицикл' },
                          { id: 'deferent', label: 'Деферент' },
                          { id: 'retrograde', label: 'Попятная петля' },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => onOpenGlossary(item.id)}
                            className="min-h-[32px] px-2.5 py-1 rounded-full border border-[var(--border-subtle)] bg-[#0C0C12] font-mono-tech text-[10px] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors active:scale-95 cursor-pointer"
                          >
                            {item.label} ↗
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Minimalist Speed Slider */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="p-3 rounded-xl bg-black border border-[var(--border-subtle)] flex items-center justify-between gap-3"
              >
                <span className="font-mono-tech text-xs text-[var(--text-muted)] whitespace-nowrap">
                  Скорость: <strong className="text-[var(--text-parchment)]">{speedMultiplier.toFixed(1)}×</strong>
                </span>
                <input
                  id="orbital-speed-slider"
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.2"
                  value={speedMultiplier}
                  onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                  aria-label="Скорость симуляции орбит"
                  className="planetarium-slider w-32 sm:w-44"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
