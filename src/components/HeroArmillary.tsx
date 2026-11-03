import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Eye, Compass, ArrowDown, Download, WifiOff, Touchpad } from 'lucide-react';

interface HeroArmillaryProps {
  redNightMode: boolean;
  onToggleRedMode: () => void;
  onOpenGlossary: (termId?: string) => void;
  isInstallable: boolean;
  isIOS: boolean;
  onInstallPWA: () => void;
  isOnline: boolean;
}

export const HeroArmillary: React.FC<HeroArmillaryProps> = ({
  redNightMode,
  onToggleRedMode,
  onOpenGlossary,
  isInstallable,
  isIOS,
  onInstallPWA,
  isOnline,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const redModeRef = useRef(redNightMode);
  redModeRef.current = redNightMode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let rotation = 0;
    let userYaw = 0;
    let targetYaw = 0;
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
      targetYaw += dx * 0.008;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const project = (
      x: number,
      y: number,
      z: number,
      cx: number,
      cy: number,
      tiltX: number,
      yawY: number
    ) => {
      const cosY = Math.cos(yawY);
      const sinY = Math.sin(yawY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const perspective = 600 / (600 + z2 * 0.45);
      return {
        px: cx + x1 * perspective,
        py: cy + y2 * perspective,
      };
    };

    const drawRing3D = (
      radius: number,
      rxRot: number,
      ryRot: number,
      rzRot: number,
      cx: number,
      cy: number,
      globalTilt: number,
      globalYaw: number,
      strokeColor: string,
      lineWidth: number,
      dashed = false
    ) => {
      const steps = 80;
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      if (dashed) {
        ctx.setLineDash([4, 6]);
      }
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        let x = Math.cos(theta) * radius;
        let y = Math.sin(theta) * radius;
        let z = 0;

        const cX = Math.cos(rxRot),
          sX = Math.sin(rxRot);
        const y1 = y * cX - z * sX;
        const z1 = y * sX + z * cX;
        y = y1;
        z = z1;

        const cY = Math.cos(ryRot),
          sY = Math.sin(ryRot);
        const x2 = x * cY - z * sY;
        const z2 = x * sY + z * cY;
        x = x2;
        z = z2;

        const cZ = Math.cos(rzRot),
          sZ = Math.sin(rzRot);
        const x3 = x * cZ - y * sZ;
        const y3 = x * sZ + y * cZ;
        x = x3;
        y = y3;

        const { px, py } = project(x, y, z, cx, cy, globalTilt, globalYaw);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      rotation += 0.0045;
      userYaw += (targetYaw - userYaw) * 0.08;

      const isRed = redModeRef.current;
      const goldMain = isRed ? '#FF2E2E' : '#D4A373';
      const goldSoft = isRed ? 'rgba(255, 46, 46, 0.35)' : 'rgba(212, 163, 115, 0.35)';
      const goldFaint = isRed ? 'rgba(255, 46, 46, 0.16)' : 'rgba(212, 163, 115, 0.16)';
      const cyanAccent = isRed ? '#B32424' : '#4CC9F0';
      const orangeCore = isRed ? '#FF5555' : '#FF5400';

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.39;
      const axialTilt = 0.41;

      ctx.save();
      ctx.strokeStyle = goldFaint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const totalYaw = rotation + userYaw;

      drawRing3D(R, 0, 0, 0, cx, cy, 0.35, totalYaw * 0.5, goldMain, 1.6);
      drawRing3D(R * 0.94, 0, Math.PI / 2, 0, cx, cy, 0.35, totalYaw * 0.5, goldSoft, 1.1);
      drawRing3D(R * 0.88, Math.PI / 2, 0, 0, cx, cy, 0.35, totalYaw, goldMain, 1.2);
      drawRing3D(R * 0.91, Math.PI / 2 + axialTilt, 0, 0, cx, cy, 0.35, totalYaw * 1.2, cyanAccent, 1.5);
      drawRing3D(R * 0.48, Math.PI / 3, rotation * 0.7, 0, cx, cy, 0.35, totalYaw, goldSoft, 1.0, true);

      const northPole = project(0, -R * 1.05, 0, cx, cy, 0.35, totalYaw);
      const southPole = project(0, R * 1.05, 0, cx, cy, 0.35, totalYaw);
      ctx.save();
      ctx.strokeStyle = goldSoft;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(northPole.px, northPole.py);
      ctx.lineTo(southPole.px, southPole.py);
      ctx.stroke();
      ctx.restore();

      const pTheta = rotation * 2.4;
      const px3d = Math.cos(pTheta) * R * 0.91;
      const py3d = Math.sin(pTheta) * R * 0.91 * Math.cos(Math.PI / 2 + axialTilt);
      const pz3d = Math.sin(pTheta) * R * 0.91 * Math.sin(Math.PI / 2 + axialTilt);
      const planetProj = project(px3d, py3d, pz3d, cx, cy, 0.35, totalYaw * 1.2);

      ctx.save();
      ctx.fillStyle = cyanAccent;
      ctx.beginPath();
      ctx.arc(planetProj.px, planetProj.py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = orangeCore;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = goldMain;
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const scrollToChapter1 = () => {
    const el = document.getElementById('chapter-1');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative w-full bg-black px-4 sm:px-8 pt-4 pb-10 sm:py-12 border-b border-[var(--border-subtle)]"
    >
      <div className="max-w-5xl w-full mx-auto space-y-6">
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-xs font-mono-tech text-[var(--accent-primary)]"
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>Работает без интернета (автономный режим)</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Interactive Armillary Sphere first on mobile for immediate visual impact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2"
          >
            <div className="relative w-full max-w-[260px] sm:max-w-[340px] aspect-square flex items-center justify-center">
              <canvas
                ref={canvasRef}
                style={{ touchAction: 'pan-y' }}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                aria-label="Интерактивная армиллярная сфера"
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-1 flex items-center gap-1.5 font-mono-tech text-xs text-[var(--text-muted)]"
            >
              <Touchpad className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Проведите пальцем по сфере для вращения</span>
            </motion.div>
          </motion.div>

          {/* Text & Clear Controls */}
          <div className="lg:col-span-7 flex flex-col items-start text-left order-2 lg:order-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-mono-tech text-[10px] sm:text-xs text-[var(--accent-primary)] tracking-[0.16em] uppercase flex flex-wrap items-center gap-x-2 gap-y-0.5"
            >
              <span>Интерактивный</span>
              <span>путеводитель</span>
              <span>планетария</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-[var(--text-parchment)] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Эфир и Сингулярность
            </motion.h1>

            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="font-display italic text-lg sm:text-2xl text-[var(--accent-primary)] leading-snug"
            >
              «От иллюзии покоя в центре хрустальных сфер — к абсолютной тьме гравитационного коллапса».
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="font-body text-base sm:text-lg text-[var(--text-muted)] leading-relaxed"
            >
              Наглядный гид из 4 глав: вы сами покрутите орбиты планет, проверите Плутон по правилам{' '}
              <button
                type="button"
                onClick={() => onOpenGlossary('planet')}
                className="text-[var(--text-parchment)] underline decoration-[var(--accent-primary)] underline-offset-4 hover:text-[var(--accent-primary)] transition-colors inline cursor-pointer"
              >
                современной астрономии
              </button>
              , заглянете внутрь диска Млечного Пути и приблизитесь к горизонту событий чёрной дыры.
            </motion.p>

            {/* Primary Mobile Thumb-Zone Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <button
                type="button"
                onClick={scrollToChapter1}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-[var(--accent-primary)] text-black font-mono-tech text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] hover:opacity-90 transition-all whitespace-nowrap shadow-[0_0_20px_rgba(212,163,115,0.3)]"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>Начать путешествие</span>
                <ArrowDown className="w-4 h-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={onToggleRedMode}
                aria-pressed={redNightMode}
                className={`min-h-[48px] px-5 py-3 rounded-xl border font-mono-tech text-xs sm:text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all whitespace-nowrap ${
                  redNightMode
                    ? 'bg-[#2A0404] border-[#FF2E2E] text-[#FF4D4D]'
                    : 'bg-[#0C0C12] border-[var(--border-subtle)] text-[var(--text-parchment)] hover:border-[var(--accent-primary)]/50'
                }`}
              >
                <Eye className="w-4 h-4 shrink-0 text-[#FF3B30]" />
                <span>
                  {redNightMode ? 'Красный режим зала: ВКЛ' : 'Режим планетария (Красный свет)'}
                </span>
              </button>
            </motion.div>

            {(isInstallable || isIOS) && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                type="button"
                onClick={onInstallPWA}
                className="min-h-[44px] w-full sm:w-auto px-4 py-2 rounded-lg border border-[var(--border-subtle)] text-xs font-mono-tech text-[var(--text-muted)] hover:text-[var(--text-parchment)] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Скачать для работы без интернета</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
