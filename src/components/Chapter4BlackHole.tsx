import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, BookOpen, RotateCcw, ChevronDown, ChevronUp, Disc, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface Chapter4BlackHoleProps {
  redNightMode: boolean;
  onOpenGlossary: (termId?: string) => void;
}

interface DistancePreset {
  r: number;
  label: string;
  sub: string;
  tag: string;
}

const DISTANCE_PRESETS: DistancePreset[] = [
  { r: 9.5, label: '10 Rₛ', sub: 'Далеко', tag: 'Безопасная зона' },
  { r: 5.0, label: '5 Rₛ', sub: 'Сближение', tag: 'Заметный релятивизм' },
  { r: 3.0, label: '3 Rₛ', sub: 'Линза', tag: 'Гравитационная линза' },
  { r: 1.5, label: '1.5 Rₛ', sub: 'Орбита света', tag: 'Фотонная сфера' },
  { r: 1.02, label: '1 Rₛ', sub: 'Горизонт', tag: 'Сингулярность' },
];

export const Chapter4BlackHole: React.FC<Chapter4BlackHoleProps> = ({
  redNightMode,
  onOpenGlossary,
}) => {
  const [distanceRs, setDistanceRs] = useState<number>(3.0);
  const [tiltDeg, setTiltDeg] = useState<number>(18);
  const [showTakeaways, setShowTakeaways] = useState<boolean>(false);

  const [observerSeconds, setObserverSeconds] = useState<number>(0);
  const [travelerSeconds, setTravelerSeconds] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const presetScrollRef = useRef<HTMLDivElement | null>(null);
  const distRef = useRef(distanceRs);
  distRef.current = distanceRs;
  const tiltRef = useRef(tiltDeg);
  tiltRef.current = tiltDeg;
  const redModeRef = useRef(redNightMode);
  redModeRef.current = redNightMode;

  const scrollPresets = (direction: 'left' | 'right') => {
    if (presetScrollRef.current) {
      const offset = direction === 'left' ? -120 : 120;
      presetScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const timeRate = Math.sqrt(Math.max(0.0004, 1 - 1 / Math.max(1.0005, distanceRs)));

  useEffect(() => {
    let last = performance.now();
    const interval = window.setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      const r = Math.max(1.001, distRef.current);
      const lorentz = r <= 1.02 ? 0.002 : Math.sqrt(Math.max(0, 1 - 1 / r));
      setObserverSeconds((prev) => prev + dt);
      setTravelerSeconds((prev) => prev + dt * lorentz);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });

    let animId = 0;
    let isDragging = false;
    let lastY = 0;
    let lastX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastY = e.clientY;
      lastX = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dy = e.clientY - lastY;
      lastY = e.clientY;
      setTiltDeg((prev) => Math.max(4, Math.min(48, prev + dy * 0.2)));
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    if (!gl) {
      return () => {
        canvas.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };
    }

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Ultra-photorealistic Kerr/Schwarzschild Black Hole with Einstein Gravitational Lensing & Doppler Beaming
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_distanceRs;
      uniform float u_tilt;
      uniform float u_redMode;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        v += 0.500 * noise(p); p *= 2.02;
        v += 0.250 * noise(p); p *= 2.03;
        v += 0.125 * noise(p); p *= 2.01;
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

        // Smooth cinematic zoom based on distance (keeps black hole centered and prominent)
        float zoom = mix(0.55, 1.85, (10.0 - u_distanceRs) / 9.0);
        vec2 p = uv / zoom;

        float r = length(p);
        float rs = 0.22; // Schwarzschild shadow radius in local coords

        // 1. Einstein Gravitational Lensing background distortion
        vec2 lensedUV = p * (1.0 - (rs * rs * 1.55) / max(r * r, 0.008));
        float starVal = pow(hash(floor(lensedUV * 120.0)), 28.0) * 1.6;
        vec3 bgStars = vec3(starVal * 0.95);

        float tiltRad = radians(u_tilt);
        float sinT = sin(tiltRad);

        // 2. Accretion Disk Coordinates & Gravitational Warp with Differential Relativistic Keplerian Rotation
        // Flat equatorial disk coordinates
        float diskY = p.y / max(sinT, 0.065);
        float rDisk = length(vec2(p.x, diskY));
        // Keplerian differential rotation: inner gas orbits much faster than outer gas
        float diskKeplerSpeed = 2.2 + 0.95 / max(pow(rDisk, 0.8), 0.12);
        float angleDisk = atan(diskY, p.x) + u_time * diskKeplerSpeed;

        // Dynamic swirling plasma turbulence with spiral filaments
        float plasmaTurb1 = fbm(vec2(rDisk * 12.0 - u_time * 0.4, angleDisk * 2.6));
        float plasmaTurb2 = fbm(vec2(rDisk * 24.0, angleDisk * 5.2 - u_time * 0.8));
        float plasmaGlow = 0.60 + 0.50 * plasmaTurb1 + 0.35 * plasmaTurb2;

        // Equatorial disk mask: extends from ISCO (Innermost Stable Circular Orbit ~1.5 Rs) out to ~5 Rs
        float diskInner = rs * 1.25;
        float diskOuter = rs * 4.6;
        float maskEquatorial = smoothstep(diskInner, diskInner * 1.2, rDisk) * smoothstep(diskOuter, diskOuter * 0.45, rDisk);

        // 3. Iconic Lensed Einstein Arches with Rapid Orbital Swirl (Верхняя и нижняя световые арки Эйнштейна)
        float theta = atan(p.y, p.x);
        float archOrbitSpeed = 2.5 + 0.80 / max(pow(r, 0.75), 0.14);
        float archAngle = theta + u_time * archOrbitSpeed;
        float archTurb = fbm(vec2(r * 18.0 - u_time * 0.6, archAngle * 3.4));
        float archGlow = 0.75 + 0.65 * archTurb;

        // Light from back side of disk deflected above the event horizon into a blazing arch
        float maskUpperArch = smoothstep(rs * 0.98, rs * 1.25, r) * smoothstep(rs * 2.35, rs * 1.15, r) * smoothstep(0.55, 0.0, abs(r - rs * 1.25) * 2.8) * archGlow;

        // Lower secondary arch curving underneath
        float maskLowerArch = smoothstep(rs * 0.98, rs * 1.18, r) * smoothstep(rs * 1.95, rs * 1.12, r) * smoothstep(0.42, 0.0, abs(r - rs * 1.15) * 3.5) * archGlow;

        // Combine disk components
        float diskFrontMask = (p.y < 0.0) ? 1.0 : 0.85; // Front disk sweeps unobstructed
        float totalDiskIntensity = (maskEquatorial * plasmaGlow * diskFrontMask + (maskUpperArch + maskLowerArch * 0.7) * 1.55);

        // 4. Relativistic Doppler Beaming (approaching side is boosted in brightness & temperature)
        // Gas rotating counter-clockwise: left side (p.x < 0) moves toward observer at ~0.5c!
        float doppler = clamp(1.0 - p.x * 1.55, 0.35, 2.35);
        totalDiskIntensity *= doppler;

        // 5. Dynamic, Fast-Rotating Photon Sphere Ring (Круговое движение кольца с плазменными вспышками и закруткой фотонов)
        float ringOrbitSpeed = 3.6 + 1.2 / max(r * 1.5, 0.12);
        float ringVortexAngle = theta + u_time * ringOrbitSpeed;
        float ringTurb1 = fbm(vec2(r * 28.0, ringVortexAngle * 4.2));
        float ringTurb2 = fbm(vec2(r * 56.0 - u_time * 1.2, ringVortexAngle * 8.0));
        float ringDynamicKnots = pow(noise(vec2(ringVortexAngle * 6.0, r * 42.0 + u_time * 1.1)), 2.2) * 2.5;

        float photonDist = abs(r - rs * 1.05);
        float photonCore = exp(-photonDist * 92.0);
        float photonGlow = exp(-photonDist * 32.0) * 0.85;
        float photonRingMotion = (photonCore * 2.6 + photonGlow) * (1.2 + 0.8 * ringTurb1 + 0.6 * ringTurb2 + ringDynamicKnots);
        totalDiskIntensity += photonRingMotion;

        // Relativistic frame-dragging ergosphere glow (Spacetime vortex)
        float ergoGlow = exp(-abs(r - rs * 1.25) * 18.0) * (0.45 + 0.55 * ringTurb1);
        totalDiskIntensity += ergoGlow;

        // 6. Absolute Event Horizon Shadow (Pure Black Void)
        float horizonMask = smoothstep(rs * 0.97, rs * 1.025, r);
        totalDiskIntensity *= horizonMask;

        // 7. Relativistic Color Evolution (Far: Golden-amber/Cyan; Near Horizon: Gravitational Redshift)
        float proximity = clamp((10.0 - u_distanceRs) / 9.0, 0.0, 1.0);

        vec3 colorHot = vec3(1.0, 0.92, 0.72);      // Brilliant radiant starlight
        vec3 colorAmber = vec3(1.0, 0.68, 0.28);    // Warm fiery plasma
        vec3 colorDopplerCyan = vec3(0.35, 0.88, 1.0); // Boosted blue starlight
        vec3 colorRedshift = vec3(1.0, 0.20, 0.04); // Relativistic redshifted crimson
        vec3 colorDeepInfrared = vec3(0.45, 0.04, 0.01); // Heavily redshifted edge

        // Base tint with Doppler temperature gradient
        vec3 baseColor = mix(colorAmber, colorHot, clamp(-p.x * 0.8, 0.0, 1.0));
        baseColor = mix(baseColor, colorDopplerCyan, clamp(-p.x * 1.1 - 0.2, 0.0, 1.0) * 0.45);

        // Apply gravitational redshift as observer falls closer
        baseColor = mix(baseColor, colorRedshift, pow(proximity, 1.25));
        baseColor = mix(baseColor, colorDeepInfrared, pow(proximity, 2.8) * 0.75);

        if (u_redMode > 0.5) {
          baseColor = vec3(1.0, 0.18, 0.15) * (1.0 - proximity * 0.35);
          bgStars *= vec3(1.0, 0.2, 0.2);
        }

        // Soft outer gravitational glow
        float outerGlow = exp(-r * 2.8) * 0.35 * (1.0 - proximity * 0.4);

        vec3 col = bgStars * horizonMask + baseColor * (totalDiskIntensity + outerGlow);

        // Tone mapping & gamma
        col = col / (1.0 + col * 0.85);
        col = pow(col, vec3(0.92));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compileShader = (type: number, source: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const distLoc = gl.getUniformLocation(program, 'u_distanceRs');
    const tiltLoc = gl.getUniformLocation(program, 'u_tilt');
    const redLoc = gl.getUniformLocation(program, 'u_redMode');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const startTime = performance.now();
    const render = () => {
      const elapsed = (performance.now() - startTime) * 0.001;
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform1f(distLoc, distRef.current);
      gl.uniform1f(tiltLoc, tiltRef.current);
      gl.uniform1f(redLoc, redModeRef.current ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
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

  const liveStatusText =
    distanceRs <= 1.05
      ? 'Вы на Горизонте событий (1 Rₛ)! Для удалённого наблюдателя ваше время полностью застыло (замедление 99,8%). Любой свет сместился в невидимый инфракрасный диапазон.'
      : distanceRs <= 2.0
      ? 'Фотонная сфера (1,5 Rₛ): свет летает по круговой орбите вокруг чёрной дыры. Если посмотреть вбок, можно увидеть затылок собственного космического корабля!'
      : distanceRs <= 4.0
      ? 'Гравитационное линзирование (3 Rₛ): задняя половина аккреционного диска изогнута над чёрной дырой в светящуюся огненную арку. Время течёт на 42% медленнее Земли.'
      : 'Безопасное расстояние: гравитационные часы показывают почти земной темп. Диск сверкает золотым светом с ярким кольцом фотонной сферы.';

  const activePreset =
    DISTANCE_PRESETS.reduce((prev, curr) =>
      Math.abs(curr.r - distanceRs) < Math.abs(prev.r - distanceRs) ? curr : prev
    );

  return (
    <section
      id="chapter-4"
      className="w-full bg-black py-10 sm:py-16 px-4 sm:px-8 border-b border-[var(--border-subtle)] pb-28 sm:pb-24"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Scroll Micro-Animation */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2"
        >
          <div className="font-mono-tech text-xs text-[var(--accent-primary)]">
            ГЛАВА 4 · ГОРИЗОНТ СОБЫТИЙ И СИНГУЛЯРНОСТЬ
          </div>
          <h2
            className="font-display text-2xl sm:text-4xl font-semibold text-[var(--text-parchment)]"
            style={{ textWrap: 'balance' }}
          >
            Там, где застывает время: чёрная дыра Стрелец A*
          </h2>
          <p className="font-body text-sm sm:text-base text-[var(--text-muted)]">
            Сверхмассивная чёрная дыра в центре нашей галактики. Нажимайте на круги дистанции для приближения.
          </p>
        </motion.div>

        {/* Main Black Hole Interactive Card (Clean & Focused on Visuals) */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#06060A] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Top Bar Above Canvas: Dual Clocks Comparison (Clean Grid on Mobile) */}
          <div className="p-3 sm:px-6 bg-black border-b border-[var(--border-subtle)] grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2.5 sm:gap-3 font-mono-tech text-xs">
            <div className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold col-span-2 sm:col-span-1">
              <Clock className="w-4 h-4 shrink-0 animate-pulse" />
              <span>ТЕМП ВРЕМЕНИ: {(timeRate * 100).toFixed(0)}%</span>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
              <div>
                <span className="text-[var(--text-muted)]">На Земле: </span>
                <span className="text-xs sm:text-sm font-semibold text-[var(--accent-secondary)] tabular-nums">
                  {observerSeconds.toFixed(1)} с
                </span>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">У дыры: </span>
                <span className="text-xs sm:text-sm font-semibold text-[var(--accent-tertiary)] tabular-nums">
                  {travelerSeconds.toFixed(1)} с
                </span>
              </div>
            </div>
          </div>

          {/* Clean 100% Unobstructed WebGL Black Hole Canvas */}
          <div className="relative w-full h-[320px] sm:h-[440px] bg-black">
            <canvas
              ref={canvasRef}
              style={{ touchAction: 'pan-y' }}
              className="w-full h-full block cursor-ns-resize"
              aria-label="Симуляция чёрной дыры Стрелец A*"
            />
          </div>

          {/* Bottom Thumb-Zone: CIRCULAR DISTANCE MILESTONES */}
          <div className="p-4 sm:p-6 bg-[#07070C] border-t border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono-tech text-xs sm:text-sm text-[var(--text-parchment)]">
                Дистанция: <strong className="text-[var(--accent-primary)]">{distanceRs.toFixed(1)} Rₛ</strong>
                <span className="text-[var(--text-muted)] ml-1.5 hidden xs:inline">· {activePreset.tag}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setObserverSeconds(0);
                  setTravelerSeconds(0);
                  setDistanceRs(3.0);
                  setTiltDeg(18);
                }}
                className="min-h-[36px] px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-black font-mono-tech text-xs text-[var(--text-muted)] hover:text-[var(--text-parchment)] flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Сброс</span>
              </button>
            </div>

            {/* CIRCULAR Distance Buttons (Круги вместо ползунков — идеальное касание пальцем с прокруткой и стрелками!) */}
            <div className="relative flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => scrollPresets('left')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/70 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-parchment)] active:scale-95 flex items-center justify-center shrink-0 transition-colors"
                title="Прокрутить дистанции влево"
                aria-label="Прокрутить дистанции влево"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <div
                ref={presetScrollRef}
                className="flex items-center justify-between sm:justify-center gap-2.5 sm:gap-5 py-2 overflow-x-auto custom-scrollbar-x px-1 flex-1 min-w-0 scroll-smooth"
              >
                {DISTANCE_PRESETS.map((preset, idx) => {
                  const isSelected = Math.abs(preset.r - distanceRs) < 0.6;
                  return (
                    <motion.button
                      key={preset.label}
                      type="button"
                      onClick={() => setDistanceRs(preset.r)}
                      whileTap={{ scale: 0.92 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="flex flex-col items-center gap-1.5 group shrink-0 focus:outline-none"
                      aria-label={`Выбрать дистанцию ${preset.label}`}
                    >
                      {/* Round Circle Button */}
                      <div
                        className={`w-13 h-13 sm:w-15 sm:h-15 rounded-full flex flex-col items-center justify-center transition-all duration-200 border-2 active:scale-90 ${
                          isSelected
                            ? preset.r <= 1.2
                              ? 'bg-[var(--accent-tertiary)] text-black border-[var(--accent-tertiary)] shadow-[0_0_20px_rgba(255,84,0,0.8)] scale-105 font-bold animate-pulseRedshift'
                              : 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-[0_0_20px_rgba(212,163,115,0.8)] scale-105 font-bold animate-pulseGlow'
                            : 'bg-[#101016] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/60 hover:text-[var(--text-parchment)]'
                        }`}
                      >
                        <span className="font-mono-tech text-xs sm:text-sm leading-tight">
                          {preset.label}
                        </span>
                      </div>
                      <span
                        className={`font-mono-tech text-[10px] sm:text-[11px] whitespace-nowrap transition-colors ${
                          isSelected
                            ? 'text-[var(--accent-primary)] font-semibold'
                            : 'text-[var(--text-muted)] group-hover:text-[var(--text-parchment)]'
                        }`}
                      >
                        {preset.sub}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollPresets('right')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/70 border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-parchment)] active:scale-95 flex items-center justify-center shrink-0 transition-colors"
                title="Прокрутить дистанции вправо"
                aria-label="Прокрутить дистанции вправо"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Optional Slider for Desktop Only (Скрыт на телефонах per user request!) */}
            <div className="hidden sm:block pt-1">
              <input
                type="range"
                min={1.01}
                max={10.0}
                step={0.05}
                value={distanceRs}
                onChange={(e) => setDistanceRs(parseFloat(e.target.value))}
                aria-label="Ползунок приближения к горизонту событий (десктоп)"
                className="planetarium-slider w-full"
              />
            </div>

            {/* Live What's Happening Callout (Punchy 1-2 sentences) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-3.5 sm:p-4 rounded-2xl bg-black border border-[var(--border-subtle)] font-body text-sm sm:text-base text-[var(--text-parchment)] leading-relaxed"
            >
              {liveStatusText}
            </motion.div>
          </div>
        </motion.div>

        {/* Minimalist Collapsible Science Deep Dive (Минимализм по тексту) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#06060A] border border-[var(--border-subtle)] space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="font-mono-tech text-xs text-[var(--accent-primary)] flex items-center gap-1.5">
              <Disc className="w-3.5 h-3.5" />
              <span>ФИЗИКА И ЗАКОНЫ ЭЙНШТЕЙНА</span>
            </div>
            <button
              type="button"
              onClick={() => setShowTakeaways(!showTakeaways)}
              className="font-mono-tech text-[11px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black border border-[var(--border-subtle)] active:scale-95 transition-all"
            >
              <span>{showTakeaways ? 'Скрыть физику' : 'Узнать подробности'}</span>
              {showTakeaways ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Collapsible 3 Takeaway Cards (Мягкое открытие и закрытие) */}
          <AnimatePresence initial={false}>
            {showTakeaways && (
              <motion.div
                initial={{ opacity: 0, height: 0, filter: 'blur(3px)' }}
                animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
                exit={{ opacity: 0, height: 0, filter: 'blur(3px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-[var(--border-subtle)] overflow-hidden"
              >
                <div className="p-3.5 rounded-xl bg-black border border-[var(--border-subtle)] space-y-1.5">
                  <h4 className="font-display text-base font-semibold text-[var(--accent-primary)]">
                    1. Гравитационная линза
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    Свет от дальней стороны диска огибает дыру сверху и снизу, создавая характерное искривлённое верхнее кольцо.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black border border-[var(--border-subtle)] space-y-1.5">
                  <h4 className="font-display text-base font-semibold text-[var(--accent-tertiary)]">
                    2. Гравитационное красное смещение
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    У самого горизонта фотоны тратят энергию на вырыв из гравитационного колодца и смещаются в глубокий бордово-красный спектр.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black border border-[var(--border-subtle)] space-y-1.5 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="font-display text-base font-semibold text-[var(--accent-secondary)]">
                      3. Радиус Шварцшильда (Rₛ)
                    </h4>
                    <p className="font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                      Для Земли Rₛ = 9 миллиметров, для Солнца = 3 километра. За этой чертой скорость убегания превышает скорость света.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenGlossary('schwarzschild-radius')}
                    className="pt-2 text-left font-mono-tech text-xs text-[var(--accent-primary)] flex items-center gap-1.5 hover:underline cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Статья в словаре ↗</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
