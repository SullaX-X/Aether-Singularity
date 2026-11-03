import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IAU_CANDIDATES, CelestialBodyCandidate } from '../data/atlasData';
import { CheckCircle2, XCircle, HelpCircle, X, BookOpen, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotographicArchive } from './PhotographicArchive';

interface Chapter2PlanetSieveProps {
  redNightMode: boolean;
  onOpenGlossary: (termId?: string) => void;
}

export const Chapter2PlanetSieve: React.FC<Chapter2PlanetSieveProps> = ({
  redNightMode,
  onOpenGlossary,
}) => {
  const [selectedId, setSelectedId] = useState<CelestialBodyCandidate['id']>('pluto');
  const [showPlutoDramaModal, setShowPlutoDramaModal] = useState(false);
  const [showRuleDetails, setShowRuleDetails] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const candidateScrollRef = useRef<HTMLDivElement | null>(null);
  const selectedBody = IAU_CANDIDATES.find((b) => b.id === selectedId) || IAU_CANDIDATES[4];

  const scrollCandidates = (dir: 'left' | 'right') => {
    if (candidateScrollRef.current) {
      candidateScrollRef.current.scrollBy({
        left: dir === 'left' ? -160 : 160,
        behavior: 'smooth',
      });
    }
  };

  const redModeRef = useRef(redNightMode);
  redModeRef.current = redNightMode;
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let angle = 0;

    const debris = Array.from({ length: 70 }, (_, i) => ({
      angle: (i / 70) * Math.PI * 2 + (i % 7) * 0.13,
      radiusOffset: ((i * 19) % 40) - 20,
      size: 1.2 + (i % 3) * 0.7,
      speed: 0.3 + (i % 5) * 0.08,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      angle += 0.008;
      const isRed = redModeRef.current;
      const id = selectedIdRef.current;

      const gold = isRed ? '#FF2E2E' : '#D4A373';
      const cyan = isRed ? '#FF6666' : '#4CC9F0';
      const orange = isRed ? '#FF1F1F' : '#FF5400';
      const muted = isRed ? 'rgba(255, 46, 46, 0.25)' : 'rgba(212, 163, 115, 0.25)';

      const cx = w / 2;
      const cy = h / 2;
      const orbitR = Math.min(w, h) * 0.35;

      ctx.save();
      ctx.strokeStyle = muted;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (id === 'pluto' || id === 'ceres' || id === 'asteroid') {
        ctx.save();
        debris.forEach((p) => {
          const a = p.angle + angle * p.speed;
          const r = orbitR + p.radiusOffset;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
          ctx.fillStyle =
            id === 'pluto'
              ? isRed
                ? 'rgba(255,80,80,0.55)'
                : 'rgba(76, 201, 240, 0.5)'
              : muted;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      ctx.save();
      if (id === 'ganymede') {
        ctx.fillStyle = gold;
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = gold;
        ctx.fillText('Юпитер', cx - 22, cy + 36);
      } else {
        ctx.fillStyle = gold;
        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = gold;
        ctx.fillText('Солнце', cx - 22, cy + 26);
      }
      ctx.restore();

      const bx = cx + Math.cos(angle * 1.4) * orbitR;
      const by = cy + Math.sin(angle * 1.4) * orbitR;

      ctx.save();
      if (id === 'asteroid') {
        ctx.translate(bx, by);
        ctx.rotate(angle * 3);
        ctx.fillStyle = '#A0A0A0';
        ctx.strokeStyle = gold;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-12, -6);
        ctx.lineTo(-4, -11);
        ctx.lineTo(9, -8);
        ctx.lineTo(14, 2);
        ctx.lineTo(6, 10);
        ctx.lineTo(-7, 9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        const bodyRadius =
          id === 'earth' ? 11 : id === 'ganymede' ? 9 : id === 'pluto' ? 8 : 7;
        ctx.fillStyle = id === 'earth' ? cyan : id === 'pluto' ? orange : gold;
        ctx.beginPath();
        ctx.arc(bx, by, bodyRadius, 0, Math.PI * 2);
        ctx.fill();

        if (id === 'pluto') {
          const cxCharon = bx + Math.cos(angle * 6) * 18;
          const cyCharon = by + Math.sin(angle * 6) * 18;
          ctx.strokeStyle = muted;
          ctx.beginPath();
          ctx.arc(bx, by, 18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = gold;
          ctx.beginPath();
          ctx.arc(cxCharon, cyCharon, 3.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      id="chapter-2"
      className="w-full bg-black py-10 sm:py-16 px-4 sm:px-8 border-b border-[var(--border-subtle)]"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Clean Section Header with Scroll Micro-Animation */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2"
        >
          <div className="font-mono-tech text-xs text-[var(--accent-primary)]">
            ГЛАВА 2 · ПЛАНЕТАРНЫЙ ФИЛЬТР (МАС 2006)
          </div>
          <h2
            className="font-display text-2xl sm:text-4xl font-semibold text-[var(--text-parchment)]"
            style={{ textWrap: 'balance' }}
          >
            Что такое планета и почему «уволили» Плутон?
          </h2>
          <p className="font-body text-base sm:text-lg text-[var(--text-muted)]">
            Нажмите на любое небесное тело ниже, чтобы проверить его по трём строгим правилам Международного астрономического союза.
          </p>
        </motion.div>

        {/* Photographic Archive Showcase (Earth, Ganymede, Ceres, Pluto as in User Mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <PhotographicArchive
            redNightMode={redNightMode}
            onOpenPlutoDrama={() => setShowPlutoDramaModal(true)}
          />
        </motion.div>

        {/* Step 1: CIRCULAR Candidate Selectors (Круги с видимой плавной прокруткой и стрелками) */}
        <div className="relative flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollCandidates('left')}
            className="w-8 h-10 rounded-xl bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer z-10"
            title="Прокрутить список влево"
            aria-label="Влево"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <motion.div
            ref={candidateScrollRef}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 flex items-center justify-start gap-3 sm:gap-4 custom-scrollbar-x py-2 px-1"
          >
            {IAU_CANDIDATES.map((candidate, idx) => {
              const isSelected = candidate.id === selectedId;
              const passedCount =
                (candidate.criteria.orbitsSun ? 1 : 0) +
                (candidate.criteria.hydrostaticEquilibrium ? 1 : 0) +
                (candidate.criteria.clearedNeighborhood ? 1 : 0);

              return (
                <motion.button
                  key={candidate.id}
                  type="button"
                  onClick={() => setSelectedId(candidate.id)}
                  whileTap={{ scale: 0.92 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex flex-col items-center gap-1.5 group shrink-0 focus:outline-none cursor-pointer"
                >
                  {/* Round Circle Button */}
                  <div
                    className={`w-13 h-13 sm:w-15 sm:h-15 rounded-full flex flex-col items-center justify-center transition-all duration-200 border-2 active:scale-90 ${
                      isSelected
                        ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-[0_0_16px_rgba(212,163,115,0.6)] font-bold animate-pulseGlow'
                        : 'bg-[#101016] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/60 hover:text-[var(--text-parchment)]'
                    }`}
                  >
                    <span className="font-mono-tech text-xs sm:text-sm leading-tight text-center px-1 truncate max-w-full">
                      {candidate.name.split(' ')[0]}
                    </span>
                    <span
                      className={`text-[9px] font-mono-tech mt-0.5 px-1.5 py-0.2 rounded-full ${
                        passedCount === 3
                          ? isSelected ? 'bg-black text-[#4CC9F0]' : 'bg-[#4CC9F0]/20 text-[#4CC9F0]'
                          : isSelected ? 'bg-black text-[#FF5400]' : 'bg-[#FF5400]/20 text-[#FF5400]'
                      }`}
                    >
                      {passedCount}/3
                    </span>
                  </div>

                  {/* Subtitle label */}
                  <span
                    className={`font-mono-tech text-[10px] sm:text-[11px] whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'text-[var(--accent-primary)] font-semibold'
                        : 'text-[var(--text-muted)] group-hover:text-[var(--text-parchment)]'
                    }`}
                  >
                    {candidate.diameterKm.replace('Диаметр: ', '')}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          <button
            type="button"
            onClick={() => scrollCandidates('right')}
            className="w-8 h-10 rounded-xl bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer z-10"
            title="Прокрутить список вправо"
            aria-label="Вправо"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Step 2: Unified Inspection Card with Scroll Micro-Animation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#06060A] border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* Left: Visual Simulation + Verdict */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-black border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-inner space-y-0">
              {/* Clean Non-Overlapping Header */}
              <div className="px-3.5 py-2 border-b border-[var(--border-subtle)]/60 flex items-center justify-between font-mono-tech text-xs">
                <span className="font-bold text-[var(--accent-primary)]">{selectedBody.name}</span>
                <span className="text-[var(--text-muted)]">{selectedBody.diameterKm}</span>
              </div>

              {/* Clean Unobstructed Canvas */}
              <div className="w-full h-56 sm:h-64 relative bg-black">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full block"
                  aria-label={`Симуляция орбиты: ${selectedBody.name}`}
                />
              </div>

              {/* Debris note cleanly docked at bottom */}
              {(selectedBody.id === 'pluto' || selectedBody.id === 'ceres') && (
                <div className="px-3 py-1.5 border-t border-[var(--border-subtle)]/60 font-mono-tech text-[10px] text-[var(--accent-secondary)] bg-[#07070B] text-center">
                  Точки на орбите — тысячи нерасчищенных ледяных соседей
                </div>
              )}
            </div>

            {/* Verdict Box */}
            <div className="p-4 rounded-2xl bg-black border border-[var(--border-subtle)] space-y-2.5">
              <div className="font-mono-tech text-xs text-[var(--text-muted)]">
                ВЕРДИКТ АСТРОНОМОВ МАС:
              </div>
              <h3
                className={`font-display text-2xl font-semibold ${
                  selectedBody.id === 'pluto'
                    ? 'text-[var(--accent-tertiary)]'
                    : selectedBody.verdictClass === 'planet'
                    ? 'text-[var(--accent-secondary)]'
                    : 'text-[var(--accent-primary)]'
                }`}
              >
                {selectedBody.verdictTitle}
              </h3>
              <p className="font-body text-sm sm:text-base text-[var(--text-parchment)] leading-relaxed">
                {selectedBody.verdictSummary}
              </p>

              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setShowPlutoDramaModal(true)}
                  className="min-h-[42px] px-3.5 py-2 rounded-xl bg-[var(--accent-tertiary)] text-black font-mono-tech text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
                >
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Драма Плутона (2005 г.)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenGlossary('dwarf-planet')}
                  className="min-h-[42px] px-3 py-2 rounded-xl border border-[var(--border-subtle)] font-mono-tech text-xs text-[var(--text-parchment)] flex items-center justify-center gap-1.5 hover:border-[var(--accent-primary)] active:scale-95 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Словарь</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: 3 Rules Minimalist Checklist with Staggered Entrance */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="font-mono-tech text-xs text-[var(--accent-primary)]">
                ПРОВЕРКА 3 ПРАВИЛ (ТРЕБУЮТСЯ ВСЕ 3):
              </div>
              <button
                type="button"
                onClick={() => setShowRuleDetails(!showRuleDetails)}
                className="font-mono-tech text-[11px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#0C0C12] border border-[var(--border-subtle)]"
              >
                <span>{showRuleDetails ? 'Скрыть текст' : 'Инфо'}</span>
                {showRuleDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Criterion 1 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="p-3 sm:p-3.5 rounded-xl bg-black border border-[var(--border-subtle)] space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-tech text-xs sm:text-sm font-semibold text-[var(--text-parchment)]">
                  1. Вращается вокруг Солнца?
                </span>
                <span
                  className={`font-mono-tech text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                    selectedBody.criteria.orbitsSun
                      ? 'bg-[#4CC9F0]/20 text-[var(--accent-secondary)]'
                      : 'bg-[#FF5400]/20 text-[var(--accent-tertiary)]'
                  }`}
                >
                  {selectedBody.criteria.orbitsSun ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ДА</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>НЕТ</span>
                    </>
                  )}
                </span>
              </div>
              {showRuleDetails && (
                <p className="font-body text-xs sm:text-sm text-[var(--text-muted)] leading-snug pt-1">
                  {selectedBody.criteriaNotes.orbitsSun}
                </p>
              )}
            </motion.div>

            {/* Criterion 2 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="p-3 sm:p-3.5 rounded-xl bg-black border border-[var(--border-subtle)] space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-tech text-xs sm:text-sm font-semibold text-[var(--text-parchment)]">
                  2. Круглая форма (шар)?
                </span>
                <span
                  className={`font-mono-tech text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                    selectedBody.criteria.hydrostaticEquilibrium
                      ? 'bg-[#4CC9F0]/20 text-[var(--accent-secondary)]'
                      : 'bg-[#FF5400]/20 text-[var(--accent-tertiary)]'
                  }`}
                >
                  {selectedBody.criteria.hydrostaticEquilibrium ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ДА</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>НЕТ</span>
                    </>
                  )}
                </span>
              </div>
              {showRuleDetails && (
                <p className="font-body text-xs sm:text-sm text-[var(--text-muted)] leading-snug pt-1">
                  {selectedBody.criteriaNotes.hydrostaticEquilibrium}
                </p>
              )}
            </motion.div>

            {/* Criterion 3 */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="p-3 sm:p-3.5 rounded-xl bg-black border border-[var(--border-subtle)] space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-tech text-xs sm:text-sm font-semibold text-[var(--text-parchment)]">
                  3. Расчистил свою орбиту от соседей?
                </span>
                <span
                  className={`font-mono-tech text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                    selectedBody.criteria.clearedNeighborhood
                      ? 'bg-[#4CC9F0]/20 text-[var(--accent-secondary)]'
                      : 'bg-[#FF5400]/20 text-[var(--accent-tertiary)]'
                  }`}
                >
                  {selectedBody.criteria.clearedNeighborhood ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ДА</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>НЕТ</span>
                    </>
                  )}
                </span>
              </div>
              <AnimatePresence initial={false}>
                {showRuleDetails && (
                  <motion.p
                    initial={{ opacity: 0, height: 0, filter: 'blur(2px)' }}
                    animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
                    exit={{ opacity: 0, height: 0, filter: 'blur(2px)' }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="font-body text-xs sm:text-sm text-[var(--text-muted)] leading-snug pt-1 overflow-hidden"
                  >
                    {selectedBody.criteriaNotes.clearedNeighborhood}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Historical Note Modal: "В чем драма? Открытие Эриды в 2005 году" с мягкой анимацией */}
      <AnimatePresence>
        {showPlutoDramaModal && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pluto-drama-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70"
              onClick={() => setShowPlutoDramaModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.94 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative z-10 w-full max-w-xl bg-[#08080D] border-t sm:border border-[var(--accent-primary)] rounded-t-3xl sm:rounded-2xl p-6 space-y-4 max-h-[88vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <h3
                  id="pluto-drama-title"
                  className="font-display text-2xl font-semibold text-[var(--text-parchment)]"
                >
                  Почему Плутон перестали считать 9-й планетой?
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPlutoDramaModal(false)}
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-parchment)] transition-colors cursor-pointer"
                  aria-label="Закрыть"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 font-body text-base sm:text-lg text-[var(--text-parchment)] leading-relaxed">
                <p>
                  В 2005 году астрономы открыли за Нептуном ледяной объект{' '}
                  <strong className="text-[var(--accent-primary)]">Эриду</strong>, который оказался на 27% тяжелее Плутона!
                </p>
                <p className="text-[var(--text-muted)]">
                  Возник выбор: либо признать планетами ещё десятки ледяных шаров Пояса Койпера, либо ввести правило <strong className="text-[var(--text-parchment)]">расчистки орбиты</strong>.
                </p>
                <p>
                  Земля в 1,7 миллиона раз тяжелее всего камня и пыли на своей дорожке. А Плутон весит лишь <strong>7%</strong> от массы ледяных тел вокруг него. Поэтому в 2006 году Плутон и Эриду перевели в почётный класс —{' '}
                  <strong className="text-[var(--accent-tertiary)]">Карликовые планеты</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPlutoDramaModal(false)}
                className="min-h-[46px] w-full rounded-xl bg-[var(--accent-primary)] text-black font-mono-tech text-xs font-semibold cursor-pointer active:scale-95 transition-all"
              >
                Понятно, закрыть
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
