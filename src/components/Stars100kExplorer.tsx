import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Sparkles, X, Compass, Info, Flame, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export interface StarCatalogItem {
  id: string;
  name: string;
  bayer: string;
  spectralClass: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
  spectralFull: string;
  temperatureK: number;
  distanceLy: number;
  colorHex: string;
  radiusSolar: number;
  luminositySolar: number;
  constellation: string;
  description: string;
  x: number;
  y: number;
  z: number;
  screenRadius: number;
}

export const FAMOUS_STARS: StarCatalogItem[] = [
  {
    id: 'sol',
    name: 'Солнце (Sol)',
    bayer: 'Солнечная система',
    spectralClass: 'G',
    spectralFull: 'G2V',
    temperatureK: 5778,
    distanceLy: 0.0,
    colorHex: '#FFE484',
    radiusSolar: 1.0,
    luminositySolar: 1.0,
    constellation: '—',
    description: 'Жёлтый карлик главной последовательности, гравитационный якорь Земли и всей нашей планетной системы.',
    x: 0,
    y: 0,
    z: 0,
    screenRadius: 6,
  },
  {
    id: 'alpha-centauri',
    name: 'Альфа Центавра (Ригиль)',
    bayer: 'α Centauri',
    spectralClass: 'G',
    spectralFull: 'G2V + K1V',
    temperatureK: 5790,
    distanceLy: 4.37,
    colorHex: '#FFE8A3',
    radiusSolar: 1.22,
    luminositySolar: 1.52,
    constellation: 'Кентавр',
    description: 'Ближайшая к нам звёздная система из трёх звёзд (включая тусклый красный карлик Проксима Центавра, 4.24 св. г.).',
    x: -0.15,
    y: 0.08,
    z: 0.12,
    screenRadius: 4.5,
  },
  {
    id: 'sirius',
    name: 'Сириус (Каникула)',
    bayer: 'α Canis Majoris',
    spectralClass: 'A',
    spectralFull: 'A1V',
    temperatureK: 9940,
    distanceLy: 8.6,
    colorHex: '#CFEAFF',
    radiusSolar: 1.71,
    luminositySolar: 25.4,
    constellation: 'Большой Пёс',
    description: 'Ярчайшая звезда ночного неба Земли. Имеет компаньона «Щенок» (Сириус B) — первый открытый белый карлик.',
    x: 0.22,
    y: -0.14,
    z: 0.18,
    screenRadius: 5.5,
  },
  {
    id: 'procyon',
    name: 'Процион',
    bayer: 'α Canis Minoris',
    spectralClass: 'F',
    spectralFull: 'F5IV-V',
    temperatureK: 6530,
    distanceLy: 11.46,
    colorHex: '#FFF5D6',
    radiusSolar: 2.05,
    luminositySolar: 6.93,
    constellation: 'Малый Пёс',
    description: 'Желтовато-белый субгигант, вершина астеризма Зимний Треугольник.',
    x: 0.32,
    y: 0.05,
    z: 0.26,
    screenRadius: 4.2,
  },
  {
    id: 'vega',
    name: 'Вега',
    bayer: 'α Lyrae',
    spectralClass: 'A',
    spectralFull: 'A0V',
    temperatureK: 9602,
    distanceLy: 25.04,
    colorHex: '#D4E9FF',
    radiusSolar: 2.36,
    luminositySolar: 40.1,
    constellation: 'Лира',
    description: 'Фотометрический нулевой эталон видимой звёздной величины (0 mag). Первая сфотографированная звезда (1850 г.).',
    x: -0.42,
    y: 0.48,
    z: -0.22,
    screenRadius: 5.0,
  },
  {
    id: 'arcturus',
    name: 'Арктур',
    bayer: 'α Boötis',
    spectralClass: 'K',
    spectralFull: 'K1.5III',
    temperatureK: 4286,
    distanceLy: 36.7,
    colorHex: '#FFB86C',
    radiusSolar: 25.4,
    luminositySolar: 170.0,
    constellation: 'Волопас',
    description: 'Оранжевый гигант колоссальной светимости, четвёртая по яркости звезда земного неба.',
    x: 0.65,
    y: 0.52,
    z: -0.38,
    screenRadius: 5.2,
  },
  {
    id: 'aldebaran',
    name: 'Альдебаран',
    bayer: 'α Tauri',
    spectralClass: 'K',
    spectralFull: 'K5III',
    temperatureK: 3900,
    distanceLy: 65.3,
    colorHex: '#FFA05E',
    radiusSolar: 44.2,
    luminositySolar: 518.0,
    constellation: 'Телец',
    description: '«Глаз Тельца» — красный/оранжевый гигант на луче зрения рассеянного скопления Гиады.',
    x: -0.72,
    y: -0.44,
    z: 0.55,
    screenRadius: 4.8,
  },
  {
    id: 'polaris',
    name: 'Полярная звезда',
    bayer: 'α Ursae Minoris',
    spectralClass: 'F',
    spectralFull: 'F7Ib',
    temperatureK: 6015,
    distanceLy: 433.0,
    colorHex: '#FFF0C4',
    radiusSolar: 37.5,
    luminositySolar: 1260.0,
    constellation: 'Малая Медведица',
    description: 'Главный навигационный ориентир Северного полюса мира, пульсирующая классическая цефеида.',
    x: 0.12,
    y: 1.15,
    z: -0.85,
    screenRadius: 4.6,
  },
  {
    id: 'betelgeuse',
    name: 'Бетельгейзе',
    bayer: 'α Orionis',
    spectralClass: 'M',
    spectralFull: 'M1-M2Ia-ab',
    temperatureK: 3500,
    distanceLy: 642.0,
    colorHex: '#FF5C38',
    radiusSolar: 764.0,
    luminositySolar: 100000.0,
    constellation: 'Орион',
    description: 'Красный пульсирующий сверхгигант. Если поместить его в центр Солнечной системы, он поглотит орбиту Юпитера!',
    x: -0.95,
    y: -0.35,
    z: 1.12,
    screenRadius: 6.2,
  },
  {
    id: 'rigel',
    name: 'Ригель',
    bayer: 'β Orionis',
    spectralClass: 'B',
    spectralFull: 'B8Ia',
    temperatureK: 12100,
    distanceLy: 863.0,
    colorHex: '#A2D2FF',
    radiusSolar: 78.9,
    luminositySolar: 120000.0,
    constellation: 'Орион',
    description: 'Ослепительный бело-голубой сверхгигант, ярчайшая звезда созвездия Ориона.',
    x: -1.22,
    y: -0.82,
    z: 0.94,
    screenRadius: 5.8,
  },
  {
    id: 'naos',
    name: 'Наос (Дзэта Кормы)',
    bayer: 'ζ Puppis',
    spectralClass: 'O',
    spectralFull: 'O4If(n)p',
    temperatureK: 42000,
    distanceLy: 1080.0,
    colorHex: '#64B5F6',
    radiusSolar: 20.0,
    luminositySolar: 813000.0,
    constellation: 'Корма',
    description: 'Один из самых горячих и массивных голубых гипергигантов, видимых невооружённым глазом. Температура более 40 000 K!',
    x: 0.88,
    y: -1.25,
    z: 1.45,
    screenRadius: 5.4,
  },
  {
    id: 'deneb',
    name: 'Денеб',
    bayer: 'α Cygni',
    spectralClass: 'A',
    spectralFull: 'A2Ia',
    temperatureK: 8525,
    distanceLy: 2615.0,
    colorHex: '#E2F0FF',
    radiusSolar: 203.0,
    luminositySolar: 196000.0,
    constellation: 'Лебедь',
    description: 'Белый сверхгигант колоссальной мощности на хвосте Лебедя, вершина Летнего Треугольника.',
    x: -1.45,
    y: 1.62,
    z: -1.35,
    screenRadius: 5.6,
  },
];

export const SPECTRAL_CLASSES = [
  { class: 'ALL', label: 'Все звёзды', tempRange: '2 400 – 42 000 K', color: '#FFFFFF' },
  { class: 'O', label: 'Класс O', tempRange: '> 30 000 K', color: '#64B5F6' },
  { class: 'B', label: 'Класс B', tempRange: '10 000 – 30 000 K', color: '#A2D2FF' },
  { class: 'A', label: 'Класс A', tempRange: '7 500 – 10 000 K', color: '#CFEAFF' },
  { class: 'F', label: 'Класс F', tempRange: '6 000 – 7 500 K', color: '#FFF5D6' },
  { class: 'G', label: 'Класс G (Солнце)', tempRange: '5 200 – 6 000 K', color: '#FFE8A3' },
  { class: 'K', label: 'Класс K', tempRange: '3 700 – 5 200 K', color: '#FFA05E' },
  { class: 'M', label: 'Класс M', tempRange: '2 400 – 3 700 K', color: '#FF5C38' },
] as const;

interface Stars100kExplorerProps {
  redNightMode: boolean;
  onOpenGlossary: (termId?: string) => void;
}

export const Stars100kExplorer: React.FC<Stars100kExplorerProps> = ({
  redNightMode,
  onOpenGlossary,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [selectedStar, setSelectedStar] = useState<StarCatalogItem | null>(null);
  const [spectralFilter, setSpectralFilter] = useState<string>('ALL');
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);

  const starsScrollRef = useRef<HTMLDivElement | null>(null);
  const classesScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollStars = (dir: 'left' | 'right') => {
    if (starsScrollRef.current) {
      starsScrollRef.current.scrollBy({
        left: dir === 'left' ? -180 : 180,
        behavior: 'smooth',
      });
    }
  };

  const scrollClasses = (dir: 'left' | 'right') => {
    if (classesScrollRef.current) {
      classesScrollRef.current.scrollBy({
        left: dir === 'left' ? -140 : 140,
        behavior: 'smooth',
      });
    }
  };

  // Drag & rotation references
  const cameraRef = useRef({
    pitch: 0.45,
    yaw: 0.35,
    targetPitch: 0.45,
    targetYaw: 0.35,
    zoom: 1.2,
    targetZoom: 1.2,
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  const tourTimeRef = useRef<number>(0);
  const spectralFilterRef = useRef(spectralFilter);
  spectralFilterRef.current = spectralFilter;

  const handleSelectStar = (star: StarCatalogItem | null) => {
    setSelectedStar(star);
    if (star) {
      setIsPlayingTour(false);
      // Orient camera towards selected star smoothly
      const r = Math.hypot(star.x, star.z);
      const targetPitch = Math.atan2(star.y, r);
      const targetYaw = Math.atan2(star.x, star.z);
      cameraRef.current.targetPitch = Math.max(-1.1, Math.min(1.1, targetPitch * 0.7));
      cameraRef.current.targetYaw = targetYaw;
      cameraRef.current.targetZoom = 1.45;
      setZoomLevel(1.45);
    }
  };

  const handleNextStar = () => {
    if (!selectedStar) {
      handleSelectStar(FAMOUS_STARS[0]);
      return;
    }
    const idx = FAMOUS_STARS.findIndex((s) => s.id === selectedStar.id);
    const nextIdx = (idx + 1) % FAMOUS_STARS.length;
    handleSelectStar(FAMOUS_STARS[nextIdx]);
  };

  const handlePrevStar = () => {
    if (!selectedStar) {
      handleSelectStar(FAMOUS_STARS[0]);
      return;
    }
    const idx = FAMOUS_STARS.findIndex((s) => s.id === selectedStar.id);
    const prevIdx = (idx - 1 + FAMOUS_STARS.length) % FAMOUS_STARS.length;
    handleSelectStar(FAMOUS_STARS[prevIdx]);
  };

  // Real Soundtrack Audio Playback: Sam Hulick - In a Strange Land
  const toggleSoundtrack = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      try {
        audio.volume = isMuted ? 0 : volume;
        await audio.play();
        setIsAudioPlaying(true);
      } catch (err) {
        console.warn('Audio play request:', err);
        // Fallback to MP3 if OGA had an issue
        if (!audio.src.endsWith('.mp3')) {
          audio.src = './audio/100000_stars.mp3';
          try {
            await audio.play();
            setIsAudioPlaying(true);
          } catch (e) {
            console.warn('Fallback play failed:', e);
          }
        }
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.muted = nextMuted;
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  // 3D Canvas WebGL & Procedural Particle Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate 1200 3D procedural stars in spherical volume
    const proceduralStars: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      brightness: number;
      color: string;
      spectralClass: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
    }> = [];

    const spectralDistribution: Array<{ class: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M'; color: string; weight: number }> = [
      { class: 'M', color: '#FF6B4A', weight: 0.72 },
      { class: 'K', color: '#FFA05E', weight: 0.14 },
      { class: 'G', color: '#FFE8A3', weight: 0.08 },
      { class: 'F', color: '#FFF5D6', weight: 0.04 },
      { class: 'A', color: '#CFEAFF', weight: 0.015 },
      { class: 'B', color: '#A2D2FF', weight: 0.004 },
      { class: 'O', color: '#64B5F6', weight: 0.001 },
    ];

    for (let i = 0; i < 1400; i++) {
      // Exponential distribution around center
      const r = Math.pow(Math.random(), 0.5) * 2.8 + 0.15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.42; // Flattish disk
      const z = r * Math.cos(phi);

      // Select spectral class based on weight
      const rand = Math.random();
      let cumulative = 0;
      let chosen = spectralDistribution[0];
      for (const item of spectralDistribution) {
        cumulative += item.weight;
        if (rand <= cumulative) {
          chosen = item;
          break;
        }
      }

      proceduralStars.push({
        x,
        y,
        z,
        size: Math.random() * 1.6 + 0.4,
        brightness: Math.random() * 0.7 + 0.3,
        color: chosen.color,
        spectralClass: chosen.class,
      });
    }

    let animId = 0;

    const onPointerDown = (e: PointerEvent) => {
      cameraRef.current.isDragging = true;
      cameraRef.current.lastX = e.clientX;
      cameraRef.current.lastY = e.clientY;
      setIsPlayingTour(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!cameraRef.current.isDragging) return;
      const dx = e.clientX - cameraRef.current.lastX;
      const dy = e.clientY - cameraRef.current.lastY;
      cameraRef.current.lastX = e.clientX;
      cameraRef.current.lastY = e.clientY;

      cameraRef.current.targetYaw += dx * 0.006;
      cameraRef.current.targetPitch = Math.max(-1.4, Math.min(1.4, cameraRef.current.targetPitch + dy * 0.006));
    };

    const onPointerUp = () => {
      cameraRef.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * -0.0015;
      cameraRef.current.targetZoom = Math.max(0.5, Math.min(3.2, cameraRef.current.targetZoom + zoomDelta));
      setZoomLevel(cameraRef.current.targetZoom);
    };

    let initialPinchDist = 0;
    let initialPinchZoom = 1;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        initialPinchZoom = cameraRef.current.targetZoom;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDist > 0) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const scale = dist / initialPinchDist;
        cameraRef.current.targetZoom = Math.max(0.5, Math.min(3.5, initialPinchZoom * scale));
        setZoomLevel(cameraRef.current.targetZoom);
      }
    };

    const onTouchEnd = () => {
      initialPinchDist = 0;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check click against FAMOUS_STARS 2D projected screen positions
      let closestStar: StarCatalogItem | null = null;
      let minDistance = 24; // 24px tap radius

      for (const star of FAMOUS_STARS) {
        // Project star to screen
        const cam = cameraRef.current;
        const cosY = Math.cos(cam.yaw);
        const sinY = Math.sin(cam.yaw);
        const cosP = Math.cos(cam.pitch);
        const sinP = Math.sin(cam.pitch);

        const x1 = star.x * cosY - star.z * sinY;
        const z1 = star.x * sinY + star.z * cosY;
        const y2 = star.y * cosP - z1 * sinP;
        const z2 = star.y * sinP + z1 * cosP;

        const distanceCamera = z2 + 3.2;
        if (distanceCamera > 0.2) {
          const fov = (rect.width * 0.85 * cam.zoom) / distanceCamera;
          const sx = rect.width / 2 + x1 * fov;
          const sy = rect.height / 2 - y2 * fov;

          const dist = Math.hypot(clickX - sx, clickY - sy);
          if (dist < minDistance) {
            minDistance = dist;
            closestStar = star;
          }
        }
      }

      if (closestStar) {
        handleSelectStar(closestStar);
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 20) {
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      ro = new ResizeObserver(() => {
        resize();
      });
      ro.observe(canvas.parentElement);
    }

    const render = () => {
      const cam = cameraRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (
        rect.width > 20 &&
        (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr))
      ) {
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      }
      const w = Math.max(10, canvas.width / dpr);
      const h = Math.max(10, canvas.height / dpr);

      // Handle Cinematic Tour Mode animation
      if (isPlayingTour) {
        tourTimeRef.current += 0.006;
        cam.targetYaw = tourTimeRef.current * 0.45;
        cam.targetPitch = Math.sin(tourTimeRef.current * 0.3) * 0.35 + 0.25;
        cam.targetZoom = 1.1 + Math.sin(tourTimeRef.current * 0.25) * 0.45;
      }

      // Smooth interpolation
      cam.yaw += (cam.targetYaw - cam.yaw) * 0.08;
      cam.pitch += (cam.targetPitch - cam.pitch) * 0.08;
      cam.zoom += (cam.targetZoom - cam.zoom) * 0.08;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep space black backdrop
      ctx.fillStyle = '#020204';
      ctx.fillRect(0, 0, w, h);

      // Faint interstellar background glow
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h) * 0.75);
      bgGrad.addColorStop(0, 'rgba(16, 24, 48, 0.35)');
      bgGrad.addColorStop(0.5, 'rgba(10, 14, 28, 0.18)');
      bgGrad.addColorStop(1, 'rgba(2, 2, 4, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Coordinate axes / Galactic plane grid ring
      ctx.save();
      ctx.strokeStyle = 'rgba(76, 201, 240, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let r = 0.5; r <= 2.2; r += 0.6) {
        // Project horizontal rings
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
          const rx = r * Math.cos(a);
          const rz = r * Math.sin(a);
          const ry = 0;

          const cosY = Math.cos(cam.yaw);
          const sinY = Math.sin(cam.yaw);
          const cosP = Math.cos(cam.pitch);
          const sinP = Math.sin(cam.pitch);

          const x1 = rx * cosY - rz * sinY;
          const z1 = rx * sinY + rz * cosY;
          const y2 = ry * cosP - z1 * sinP;
          const z2 = ry * sinP + z1 * cosP;

          const distCam = z2 + 3.2;
          if (distCam > 0.2) {
            const fov = (w * 0.85 * cam.zoom) / distCam;
            const sx = w / 2 + x1 * fov;
            const sy = h / 2 - y2 * fov;
            if (a === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
        }
      }
      ctx.stroke();
      ctx.restore();

      const activeFilter = spectralFilterRef.current;

      // 1. Draw Procedural Stars
      for (let i = 0; i < proceduralStars.length; i++) {
        const star = proceduralStars[i];
        if (activeFilter !== 'ALL' && star.spectralClass !== activeFilter) {
          continue;
        }

        const cosY = Math.cos(cam.yaw);
        const sinY = Math.sin(cam.yaw);
        const cosP = Math.cos(cam.pitch);
        const sinP = Math.sin(cam.pitch);

        const x1 = star.x * cosY - star.z * sinY;
        const z1 = star.x * sinY + star.z * cosY;
        const y2 = star.y * cosP - z1 * sinP;
        const z2 = star.y * sinP + z1 * cosP;

        const distanceCamera = z2 + 3.2;
        if (distanceCamera <= 0.15) continue;

        const fov = (w * 0.85 * cam.zoom) / distanceCamera;
        const sx = w / 2 + x1 * fov;
        const sy = h / 2 - y2 * fov;

        if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;

        const alpha = Math.min(1.0, star.brightness / (distanceCamera * 0.85));
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.6, star.size * (1.2 / distanceCamera)), 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Distance Lines from Sol (Origin) to Famous Stars
      ctx.save();
      for (const star of FAMOUS_STARS) {
        if (star.id === 'sol') continue;
        if (activeFilter !== 'ALL' && star.spectralClass !== activeFilter) continue;

        const cosY = Math.cos(cam.yaw);
        const sinY = Math.sin(cam.yaw);
        const cosP = Math.cos(cam.pitch);
        const sinP = Math.sin(cam.pitch);

        // Project Sol
        const solDistCam = 3.2;
        const solFov = (w * 0.85 * cam.zoom) / solDistCam;
        const solSx = w / 2;
        const solSy = h / 2;

        // Project Star
        const x1 = star.x * cosY - star.z * sinY;
        const z1 = star.x * sinY + star.z * cosY;
        const y2 = star.y * cosP - z1 * sinP;
        const z2 = star.y * sinP + z1 * cosP;
        const starDistCam = z2 + 3.2;

        if (starDistCam > 0.2) {
          const starFov = (w * 0.85 * cam.zoom) / starDistCam;
          const starSx = w / 2 + x1 * starFov;
          const starSy = h / 2 - y2 * starFov;

          ctx.strokeStyle = star.colorHex;
          ctx.globalAlpha = 0.18;
          ctx.setLineDash([3, 4]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(solSx, solSy);
          ctx.lineTo(starSx, starSy);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      ctx.restore();

      // 3. Draw Notable Famous Stars with Diffraction Spikes & Labels
      for (const star of FAMOUS_STARS) {
        if (activeFilter !== 'ALL' && star.spectralClass !== activeFilter) continue;

        const cosY = Math.cos(cam.yaw);
        const sinY = Math.sin(cam.yaw);
        const cosP = Math.cos(cam.pitch);
        const sinP = Math.sin(cam.pitch);

        const x1 = star.x * cosY - star.z * sinY;
        const z1 = star.x * sinY + star.z * cosY;
        const y2 = star.y * cosP - z1 * sinP;
        const z2 = star.y * sinP + z1 * cosP;

        const distanceCamera = z2 + 3.2;
        if (distanceCamera <= 0.2) continue;

        const fov = (w * 0.85 * cam.zoom) / distanceCamera;
        const sx = w / 2 + x1 * fov;
        const sy = h / 2 - y2 * fov;

        const isSelected = selectedStar?.id === star.id;

        // Glow halo
        const haloRadius = (isSelected ? 26 : 14) * (1.2 / distanceCamera);
        const haloGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, haloRadius);
        haloGrad.addColorStop(0, star.colorHex);
        haloGrad.addColorStop(0.3, star.colorHex + '66');
        haloGrad.addColorStop(1, star.colorHex + '00');
        ctx.fillStyle = haloGrad;
        ctx.globalAlpha = isSelected ? 0.95 : 0.65;
        ctx.beginPath();
        ctx.arc(sx, sy, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // 4-point diffraction spike
        ctx.strokeStyle = star.colorHex;
        ctx.globalAlpha = isSelected ? 0.85 : 0.45;
        ctx.lineWidth = isSelected ? 1.5 : 1;
        const spikeLen = (isSelected ? 22 : 12) * (1.2 / distanceCamera);
        ctx.beginPath();
        ctx.moveTo(sx - spikeLen, sy);
        ctx.lineTo(sx + spikeLen, sy);
        ctx.moveTo(sx, sy - spikeLen);
        ctx.lineTo(sx, sy + spikeLen);
        ctx.stroke();

        // Solid Star Core
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(2, star.screenRadius * (1.1 / distanceCamera)), 0, Math.PI * 2);
        ctx.fill();

        // Selection Target Ring
        if (isSelected) {
          ctx.strokeStyle = '#FFE8A3';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.9;
          ctx.beginPath();
          ctx.arc(sx, sy, haloRadius + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Text Label
        ctx.font = '600 11px JetBrains Mono, monospace';
        ctx.fillStyle = isSelected ? '#FFFFFF' : '#E8EDF5';
        ctx.globalAlpha = isSelected ? 1.0 : 0.85;
        ctx.textAlign = 'left';
        ctx.fillText(star.name, sx + haloRadius + 4, sy + 3);

        // Distance subtext
        ctx.font = '400 9px JetBrains Mono, monospace';
        ctx.fillStyle = star.colorHex;
        ctx.globalAlpha = 0.75;
        ctx.fillText(
          star.id === 'sol' ? '0 св. лет' : `${star.distanceLy} св. л.`,
          sx + haloRadius + 4,
          sy + 15
        );
      }

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
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [isPlayingTour]);

  return (
    <div className="w-full space-y-4">
      {/* Hidden HTML5 Audio Element for Sam Hulick's 100,000 Stars Soundtrack */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
        onError={() => {
          // If .oga fails on this browser, fallback to .mp3
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

      {/* Soundtrack Player & Exploration Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#08080E] border border-[var(--border-subtle)] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        {/* Left: Track Information & Live Equalizer */}
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={toggleSoundtrack}
            whileTap={{ scale: 0.94 }}
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border-2 transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-[0_0_16px_rgba(212,163,115,0.7)] animate-pulseGlow'
                : 'bg-[#12121A] text-[var(--text-parchment)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
            }`}
            aria-label={isAudioPlaying ? 'Остановить музыку' : 'Включить саундтрек 100 000 Stars'}
          >
            {isAudioPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </motion.button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs sm:text-sm font-semibold text-[var(--text-parchment)] truncate">
                Sam Hulick — In a Strange Land
              </span>
              {/* Equalizer animation bars */}
              {isAudioPlaying && (
                <div className="flex items-end gap-0.5 h-3.5 shrink-0" aria-label="Воспроизведение">
                  <span className="w-1 bg-[#4CC9F0] rounded-full animate-bounce h-3" style={{ animationDuration: '0.6s' }} />
                  <span className="w-1 bg-[var(--accent-primary)] rounded-full animate-bounce h-2" style={{ animationDuration: '0.4s', animationDelay: '0.1s' }} />
                  <span className="w-1 bg-[#FFD166] rounded-full animate-bounce h-3.5" style={{ animationDuration: '0.7s', animationDelay: '0.2s' }} />
                  <span className="w-1 bg-[#4CC9F0] rounded-full animate-bounce h-2.5" style={{ animationDuration: '0.5s', animationDelay: '0.15s' }} />
                </div>
              )}
            </div>
            <p className="font-mono-tech text-[10px] sm:text-[11px] text-[var(--accent-secondary)] truncate">
              Официальный саундтрек проекта Chrome Experiments «100 000 Stars»
            </p>
          </div>
        </div>

        {/* Right: Audio Controls & Tour Mode Button */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--border-subtle)]">
          {/* Volume / Mute Control */}
          <div className="flex items-center gap-2 bg-[#0C0C14] px-2.5 py-1 rounded-xl border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={toggleMute}
              className="text-[var(--text-muted)] hover:text-[var(--text-parchment)] transition-colors p-1"
              aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#4CC9F0]" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-[var(--accent-primary)] cursor-pointer h-1.5"
              aria-label="Громкость музыки"
            />
          </div>

          {/* Tour Mode Button */}
          <button
            type="button"
            onClick={() => setIsPlayingTour(!isPlayingTour)}
            className={`min-h-[38px] px-3.5 rounded-xl font-mono-tech text-xs flex items-center gap-1.5 transition-all border font-medium ${
              isPlayingTour
                ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-[0_0_14px_rgba(212,163,115,0.6)]'
                : 'bg-[#12121A] text-[var(--text-parchment)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/60'
            }`}
          >
            {isPlayingTour ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="whitespace-nowrap">{isPlayingTour ? 'Остановить тур' : 'Кинотур'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Stellar Viewport with Interactive HUD */}
      <div className="relative w-full aspect-square max-h-[360px] sm:max-h-[500px] rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[#020204] shadow-2xl">
        <canvas
          ref={canvasRef}
          style={{ touchAction: 'none' }}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
          aria-label="3D звездное скопление 100 000 звёзд"
        />

        {/* Top-Right Quick Helper (Mobile-friendly compact badge) */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 font-mono-tech text-[10px] text-[var(--text-muted)] shadow-md">
          <Eye className="w-3 h-3 text-[var(--accent-primary)]" />
          <span>Вращайте пальцем · Нажмите на звезду</span>
        </div>

        {/* Bottom HUD: Selected Star or Exploration hint */}
        {selectedStar ? (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#090912]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] font-mono-tech text-xs flex items-center justify-between shadow-xl z-10">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: selectedStar.colorHex }}
              />
              <span className="font-display font-semibold text-[var(--text-parchment)] truncate">
                {selectedStar.name}
              </span>
              <span className="text-[10px] text-[var(--accent-secondary)] truncate hidden xs:inline">
                ({selectedStar.spectralFull} ·{' '}
                {selectedStar.distanceLy === 0 ? 'Солнце' : `${selectedStar.distanceLy} св. л.`})
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleSelectStar(null)}
              className="text-[10px] text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer shrink-0 pl-2"
              title="Снять фокус со звезды"
            >
              <span>Сбросить ✕</span>
            </button>
          </div>
        ) : (
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 font-mono-tech text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" />
            <span>Нажмите на любую звезду для досье</span>
          </div>
        )}
      </div>

      {/* Quick Select Stars Carousel (Яркие звёзды для быстрого перехода) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono-tech px-1">
          <span className="text-[var(--text-muted)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>ЯРКИЕ ЗВЁЗДЫ ДЛЯ БЫСТРОГО НАВЕДЕНИЯ:</span>
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">
            {FAMOUS_STARS.length} звёзд
          </span>
        </div>

        <div className="relative flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollStars('left')}
            className="w-7 h-8 rounded-lg bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer z-10"
            title="Прокрутить звёзды влево"
            aria-label="Влево"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div
            ref={starsScrollRef}
            className="flex-1 flex items-center gap-1.5 custom-scrollbar-x py-1 px-0.5"
          >
            {FAMOUS_STARS.map((star) => {
              const isSel = selectedStar?.id === star.id;
              return (
                <button
                  key={star.id}
                  type="button"
                  onClick={() => handleSelectStar(isSel ? null : star)}
                  className={`min-h-[34px] px-2.5 sm:px-3 rounded-xl font-mono-tech text-xs whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 border cursor-pointer active:scale-95 ${
                    isSel
                      ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] font-bold shadow-md animate-pulseGlow'
                      : 'bg-[#0E0E18] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-parchment)] hover:border-[var(--accent-primary)]/50'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: star.colorHex }}
                  />
                  <span>{star.name.split(' (')[0]}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollStars('right')}
            className="w-7 h-8 rounded-lg bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer z-10"
            title="Прокрутить звёзды вправо"
            aria-label="Вправо"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dedicated Star Dossier Card with Explicit "Свернуть описание (смотреть 3D дальше)" button */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div
            initial={{ opacity: 0, y: 14, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 rounded-2xl bg-[#090912] border border-[var(--accent-primary)]/40 shadow-2xl space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-md animate-pulse"
                    style={{ backgroundColor: selectedStar.colorHex }}
                  />
                  <div>
                    <h4 className="font-display text-base sm:text-lg font-bold text-[var(--text-parchment)] truncate">
                      {selectedStar.name}
                    </h4>
                    <span className="font-mono-tech text-[10px] text-[var(--text-muted)] block">
                      {selectedStar.bayer}{' '}
                      {selectedStar.constellation !== '—' &&
                        `· Созвездие ${selectedStar.constellation}`}
                    </span>
                  </div>
                </div>

                {/* Unmissable Action Buttons */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#12121E] p-0.5 rounded-xl border border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={handlePrevStar}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                      title="Предыдущая звезда"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStar}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                      title="Следующая звезда"
                    >
                      →
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectStar(null)}
                    className="min-h-[34px] px-3 py-1.5 rounded-xl bg-[var(--accent-primary)] text-black font-mono-tech text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md hover:opacity-90"
                    title="Закрыть описание и продолжить свободное исследование 3D-карты"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Свернуть описание (смотреть 3D)</span>
                  </button>
                </div>
              </div>

              {/* Data Grid: Temperature, Spectral Class, Distance, Luminosity */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono-tech text-xs bg-black/60 p-2.5 sm:p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-[9px] text-[var(--text-muted)] block uppercase">Спектр</span>
                  <span
                    className="font-bold text-xs sm:text-sm"
                    style={{ color: selectedStar.colorHex }}
                  >
                    {selectedStar.spectralFull}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-muted)] block uppercase">
                    Температура
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-[var(--text-parchment)]">
                    {selectedStar.temperatureK.toLocaleString()} K
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-muted)] block uppercase">
                    Дистанция
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-[#4CC9F0]">
                    {selectedStar.distanceLy === 0
                      ? '0 (Солнце)'
                      : `${selectedStar.distanceLy} св. л.`}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[var(--text-muted)] block uppercase">
                    Радиус / Светимость
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-[#FFD166]">
                    {selectedStar.radiusSolar} R☉ /{' '}
                    {selectedStar.luminositySolar > 1000
                      ? `${(selectedStar.luminositySolar / 1000).toFixed(1)}k`
                      : selectedStar.luminositySolar}{' '}
                    L☉
                  </span>
                </div>
              </div>

              <p className="font-body text-xs sm:text-sm text-[var(--text-parchment)]/90 leading-relaxed">
                {selectedStar.description}
              </p>

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onOpenGlossary('spectral')}
                  className="py-1 px-2.5 rounded-lg bg-[#141420] hover:bg-[#1A1A2A] text-[var(--accent-primary)] font-mono-tech text-[10px] flex items-center gap-1 border border-white/5 transition-colors cursor-pointer"
                >
                  <Info className="w-3 h-3" />
                  <span>О спектральных классах в глоссарии ↗</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectStar(null)}
                  className="font-mono-tech text-[10px] text-[var(--text-muted)] hover:text-[var(--text-parchment)] underline cursor-pointer"
                >
                  Закрыть карточку ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Harvard Spectral Classification O-B-A-F-G-K-M Color Ramp Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#08080E] border border-[var(--border-subtle)] space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono-tech">
          <div className="flex items-center gap-1.5 text-[var(--text-parchment)] font-medium">
            <Flame className="w-3.5 h-3.5 text-[#FF5C38]" />
            <span>ШКАЛА КЛАССОВ (O B A F G K M):</span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">
            Фильтр скопления
          </span>
        </div>

        {/* Visual Temperature Gradient Strip */}
        <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#64B5F6] via-[#CFEAFF] via-[#FFE8A3] via-[#FFA05E] to-[#FF5C38] shadow-sm opacity-85" />

        {/* Class Filter Badges (Horizontal scroll with touch pads and visible scrollbar) */}
        <div className="relative flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollClasses('left')}
            className="w-7 h-8 rounded-lg bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer z-10"
            title="Прокрутить шкалу влево"
            aria-label="Влево"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div
            ref={classesScrollRef}
            className="flex-1 flex items-center gap-1.5 custom-scrollbar-x py-1 px-0.5"
          >
            {SPECTRAL_CLASSES.map((sc) => {
              const isActive = spectralFilter === sc.class;
              return (
                <button
                  key={sc.class}
                  type="button"
                  onClick={() => setSpectralFilter(sc.class)}
                  className={`min-h-[36px] px-2.5 sm:px-3 rounded-xl font-mono-tech text-xs whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 border cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] font-semibold shadow-md'
                      : 'bg-[#101018] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-parchment)] hover:border-white/20'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: sc.color }}
                  />
                  <span>{sc.label}</span>
                  <span className="text-[9px] opacity-60 hidden md:inline">({sc.tempRange})</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollClasses('right')}
            className="w-7 h-8 rounded-lg bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer z-10"
            title="Прокрутить шкалу вправо"
            aria-label="Вправо"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
