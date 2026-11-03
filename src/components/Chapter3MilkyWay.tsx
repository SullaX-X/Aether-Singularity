import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import {
  Eye,
  Compass,
  BookOpen,
  Disc,
  Navigation,
  Orbit,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Layers,
  Plus,
  Minus,
  RotateCcw,
  ZoomIn,
} from 'lucide-react';
import { Stars100kExplorer } from './Stars100kExplorer';
import { MilkyWayPerspective } from './MilkyWayPerspective';

interface Chapter3MilkyWayProps {
  redNightMode: boolean;
  onOpenGlossary: (termId?: string) => void;
}

interface ScaleMilestone {
  exponent: number;
  label: string;
  subLabel: string;
  title: string;
  humanComparison: string;
  description: string;
}

const SCALE_MILESTONES: ScaleMilestone[] = [
  {
    exponent: 0,
    label: '10⁰',
    subLabel: '1 метр',
    title: 'Масштаб человека: 1 метр (10⁰ м)',
    humanComparison: 'Свет пролетает за 3 наносекунды',
    description:
      'Привычный нам масштаб: рост человека, размер телескопа и кресло в зале планетария.',
  },
  {
    exponent: 7,
    label: '10⁷',
    subLabel: 'Земля',
    title: 'Планета Земля: 12 742 км (10⁷ м)',
    humanComparison: 'В 10 миллионов раз больше человека',
    description:
      'Каменный шар, который античные учёные ошибочно считали центром всей Вселенной.',
  },
  {
    exponent: 13,
    label: '10¹³',
    subLabel: 'Солнце',
    title: 'Солнечная система: 10¹³ м',
    humanComparison: 'Свет от Солнца до Плутона летит 5,5 часов',
    description:
      'Солнце, восемь планет и ледяной Пояс Койпера на окраине нашей планетной системы.',
  },
  {
    exponent: 16,
    label: '10¹⁶',
    subLabel: 'Звёзды',
    title: 'Путь до ближайшей звезды: 10¹⁶ м',
    humanComparison: 'Свет летит 4,2 года (Проксима Центавра)',
    description:
      'Колоссальная пустота между Солнцем и соседними звёздами нашего рукава Ориона.',
  },
  {
    exponent: 21,
    label: '10²¹',
    subLabel: 'Галактика',
    title: 'Галактика Млечный Путь: 10²¹ м',
    humanComparison: 'Свет летит от края до края 100 000 лет!',
    description:
      'Спиральная галактика с перемычкой из 200–400 миллиардов звёзд, вращающихся вокруг сверхмассивной чёрной дыры.',
  },
];

export type GalaxyCameraView = 'top' | 'tilt' | 'edge' | 'sun';

interface ViewOption {
  id: GalaxyCameraView;
  title: string;
  subtitle: string;
  description: string;
  targetPos: [number, number, number];
  targetLook: [number, number, number];
}

const VIEW_OPTIONS: ViewOption[] = [
  {
    id: 'top',
    title: 'Вид сверху',
    subtitle: '90° Спираль',
    description:
      'Величественная спираль с перемычкой: золотистый бар в центре, 4 логарифмических рукава из молодых голубых звёзд и пылевые волокна по теории волн плотности Лина — Шу.',
    targetPos: [0, 7.8, 0.05],
    targetLook: [0, 0, 0],
  },
  {
    id: 'tilt',
    title: 'Наклон 45°',
    subtitle: 'Объём диска',
    description:
      'Перспективный объёмный вид: выпуклое золотистое ядро возвышается над плоским спиральным диском с фиолетовым гало скрытой тёмной материи.',
    targetPos: [0, 4.6, 5.8],
    targetLook: [0, 0, 0],
  },
  {
    id: 'edge',
    title: 'С ребра',
    subtitle: '0° С Земли',
    description:
      'Взгляд с ребра: Млечный Путь предстаёт тонкой светящейся полосой на ночном небе, рассечённой тёмной полосой межзвёздной пыли и окружённой сферическим гало.',
    targetPos: [0, 0.28, 7.2],
    targetLook: [0, 0, 0],
  },
  {
    id: 'sun',
    title: 'Где мы',
    subtitle: 'Наше Солнце',
    description:
      'Приближение к рукаву Ориона: наше Солнце расположено на 8.2 кпк (26 000 св. лет) от центра, совершая галактический оборот со скоростью 220 км/с.',
    targetPos: [1.3, 1.8, 2.8],
    targetLook: [0.98, 0.03, 0.25],
  },
];

export const Chapter3MilkyWay: React.FC<Chapter3MilkyWayProps> = ({
  redNightMode,
  onOpenGlossary,
}) => {
  const [scaleExp, setScaleExp] = useState<number>(21);
  const [galaxyView, setGalaxyView] = useState<GalaxyCameraView>('tilt');
  const [showMilkyWayDetails, setShowMilkyWayDetails] = useState<boolean>(false);
  const [chapterMode, setChapterMode] = useState<'stars100k' | 'galaxy'>('galaxy');

  // Controls for Galaxy Simulation
  const [densityWavePhase, setDensityWavePhase] = useState<number>(0.0);
  const [showDarkMatter, setShowDarkMatter] = useState<boolean>(true);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scaleScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollScale = (dir: 'left' | 'right') => {
    if (scaleScrollRef.current) {
      scaleScrollRef.current.scrollBy({
        left: dir === 'left' ? -160 : 160,
        behavior: 'smooth',
      });
    }
  };

  // References that ensure uninterrupted 60 FPS animation & smooth transitions
  const galaxyGroupRef = useRef<THREE.Group | null>(null);
  const haloPointsRef = useRef<THREE.Points | null>(null);
  const starPointsRef = useRef<THREE.Points | null>(null);
  const sunMeshRef = useRef<THREE.Mesh | null>(null);

  const baseTargetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 4.6, 5.8));
  const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 4.6, 5.8));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const targetZoomRef = useRef<number>(1.0);
  const currentZoomRef = useRef<number>(1.0);
  const [zoomPercent, setZoomPercent] = useState<number>(100);

  const densityWavePhaseRef = useRef<number>(densityWavePhase);
  densityWavePhaseRef.current = densityWavePhase;

  const showDarkMatterRef = useRef<boolean>(showDarkMatter);
  showDarkMatterRef.current = showDarkMatter;

  const redModeRef = useRef<boolean>(redNightMode);
  redModeRef.current = redNightMode;

  const galaxyRotationRef = useRef<number>(0);
  const userYawRef = useRef<number>(0);
  const userPitchRef = useRef<number>(0);

  const modeRef = useRef(chapterMode);
  modeRef.current = chapterMode;

  const handleSwitchMode = (mode: 'stars100k' | 'galaxy') => {
    setChapterMode(mode);
    modeRef.current = mode;
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 40);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);
  };

  const handleZoomIn = () => {
    targetZoomRef.current = Math.max(0.35, targetZoomRef.current - 0.22);
    setZoomPercent(Math.round((1 / targetZoomRef.current) * 100));
  };

  const handleZoomOut = () => {
    targetZoomRef.current = Math.min(2.8, targetZoomRef.current + 0.22);
    setZoomPercent(Math.round((1 / targetZoomRef.current) * 100));
  };

  const handleResetZoomAndAngle = () => {
    userYawRef.current = 0;
    userPitchRef.current = 0;
    targetZoomRef.current = 1.0;
    setZoomPercent(100);
    const opt = VIEW_OPTIONS.find((v) => v.id === galaxyView) || VIEW_OPTIONS[0];
    baseTargetCameraPosRef.current.set(opt.targetPos[0], opt.targetPos[1], opt.targetPos[2]);
    targetLookAtRef.current.set(opt.targetLook[0], opt.targetLook[1], opt.targetLook[2]);
  };

  const handleSelectView = (viewId: GalaxyCameraView) => {
    setGalaxyView(viewId);
    const opt = VIEW_OPTIONS.find((v) => v.id === viewId) || VIEW_OPTIONS[0];

    // Reset user manual drag when a preset view is chosen
    userYawRef.current = 0;
    userPitchRef.current = 0;

    baseTargetCameraPosRef.current.set(opt.targetPos[0], opt.targetPos[1], opt.targetPos[2]);
    targetLookAtRef.current.set(opt.targetLook[0], opt.targetLook[1], opt.targetLook[2]);
    targetZoomRef.current = 1.0;
    setZoomPercent(100);
  };

  // 1. THREE.JS 80,000+ ЧАСТИЦ СПИРАЛЬНОЙ ГАЛАКТИКИ (ИНИЦИАЛИЗАЦИЯ 1 РАЗ БЕЗ ПЕРЕЗАГРУЗОК)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    camera.position.set(0, 4.6, 5.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);
    galaxyGroupRef.current = galaxyGroup;

    // ГЕНЕРАЦИЯ 80 000 ЗВЁЗД ПО КИНЕМАТИКЕ ЛИНА — ШУ
    const starCount = 80000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const isNight = redModeRef.current;
    const colorCore = new THREE.Color(isNight ? 0xff2e2e : 0xf3e5ab);
    const colorArm = new THREE.Color(isNight ? 0xff6666 : 0x00f5d4);
    const colorDust = new THREE.Color(isNight ? 0x661111 : 0x7209b7);

    const armCount = 4;
    const pitchAngle = 0.22; // Угол закручивания логарифмической спирали

    for (let i = 0; i < starCount; i++) {
      const armIdx = i % armCount;
      const isBulge = i < starCount * 0.22; // 22% звезд в ядре/балдже

      let radius = 0;
      let angle = 0;
      let y = 0;

      if (isBulge) {
        // Центральный бар и балдж (трехосный эллипсоид)
        radius = Math.pow(Math.random(), 1.5) * 0.92;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        angle = theta;
        y = radius * Math.cos(phi) * 0.45;
        radius = radius * Math.sin(phi);
      } else {
        // Логарифмические рукава по кинематике Лина — Шу
        const rNorm = Math.pow(Math.random(), 0.65);
        radius = 0.5 + rNorm * 3.25;

        const baseArmAngle = (armIdx * Math.PI * 2) / armCount;
        const spiralWinding = (1 / Math.tan(pitchAngle)) * Math.log(radius / 0.5);
        const dispersion = (Math.random() - 0.5) * 0.38 * (1 + radius * 0.18);

        angle = baseArmAngle + spiralWinding + dispersion;
        y = (Math.random() - 0.5) * 0.18 * Math.exp(-radius * 0.42);
      }

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      starPositions[i * 3] = x;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;

      let starCol: THREE.Color;
      if (isBulge) {
        starCol = colorCore.clone().lerp(new THREE.Color(0xd4af37), Math.random() * 0.5);
      } else if (Math.random() > 0.38) {
        starCol = colorArm.clone().lerp(new THREE.Color(0xffffff), Math.random() * 0.4);
      } else {
        starCol = colorDust.clone().lerp(colorArm, Math.random() * 0.3);
      }

      starColors[i * 3] = starCol.r;
      starColors[i * 3 + 1] = starCol.g;
      starColors[i * 3 + 2] = starCol.b;
    }

    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeom, starMat);
    galaxyGroup.add(starPoints);
    starPointsRef.current = starPoints;

    // 2. ГАЛО ТЕМНОЙ МАТЕРИИ (12 000 ЧАСТИЦ)
    const haloCount = 12000;
    const haloPositions = new Float32Array(haloCount * 3);
    const haloColors = new Float32Array(haloCount * 3);
    const haloColor = new THREE.Color(isNight ? 0x991111 : 0x7209b7);

    for (let i = 0; i < haloCount; i++) {
      const hr = 1.0 + Math.pow(Math.random(), 0.72) * 4.9;
      const hTheta = Math.random() * Math.PI * 2;
      const hPhi = Math.acos(Math.random() * 2 - 1);

      haloPositions[i * 3] = hr * Math.sin(hPhi) * Math.cos(hTheta);
      haloPositions[i * 3 + 1] = hr * Math.cos(hPhi) * 0.72;
      haloPositions[i * 3 + 2] = hr * Math.sin(hPhi) * Math.sin(hTheta);

      haloColors[i * 3] = haloColor.r;
      haloColors[i * 3 + 1] = haloColor.g;
      haloColors[i * 3 + 2] = haloColor.b;
    }

    const haloGeom = new THREE.BufferGeometry();
    haloGeom.setAttribute('position', new THREE.BufferAttribute(haloPositions, 3));
    haloGeom.setAttribute('color', new THREE.BufferAttribute(haloColors, 3));

    const haloMat = new THREE.PointsMaterial({
      size: 0.046,
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const haloPoints = new THREE.Points(haloGeom, haloMat);
    scene.add(haloPoints);
    haloPointsRef.current = haloPoints;

    // 3. МАРКЕР СОЛНЦА НА 8.2 КПК (РУКАВ ОРИОНА)
    const sunGeom = new THREE.SphereGeometry(0.065, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: isNight ? 0xff2e2e : 0xffd166 });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);

    const ringGeom = new THREE.RingGeometry(0.12, 0.15, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isNight ? 0xff2e2e : 0xd4af37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    sunMesh.add(ringMesh);

    const sunRadius = (8.2 / 30) * 3.6;
    const sunAngle = 1.35;
    sunMesh.position.set(Math.cos(sunAngle) * sunRadius, 0.03, Math.sin(sunAngle) * sunRadius);
    galaxyGroup.add(sunMesh);
    sunMeshRef.current = sunMesh;

    // Вектор скорости Солнца (220 км/с)
    const sunVelGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-Math.sin(sunAngle) * 0.45, 0, Math.cos(sunAngle) * 0.45),
    ]);
    const sunVelLine = new THREE.Line(
      sunVelGeom,
      new THREE.LineBasicMaterial({ color: isNight ? 0xff6666 : 0x00f5d4, linewidth: 2 })
    );
    sunMesh.add(sunVelLine);

    // ИНТЕРАКТИВНОЕ ВРАЩЕНИЕ И ЗУМ ПАЛЬЦАМИ (PINCH-TO-ZOOM + 1-FINGER ROTATE + DOUBLE TAP)
    const activePointers = new Map<number, { x: number; y: number }>();
    let prevPinchDist = 0;
    let lastTapTime = 0;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size === 1) {
        lastX = e.clientX;
        lastY = e.clientY;

        // Быстрый дабл-тап пальцем для мгновенного приближения к ядру / Солнцу
        const now = performance.now();
        if (now - lastTapTime < 320) {
          if (targetZoomRef.current > 0.8) {
            targetZoomRef.current = 0.45;
          } else {
            targetZoomRef.current = 1.0;
          }
          setZoomPercent(Math.round((1 / targetZoomRef.current) * 100));
          lastTapTime = 0;
        } else {
          lastTapTime = now;
        }
      } else if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        prevPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!activePointers.has(e.pointerId)) return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size >= 2) {
        // Щипок двумя пальцами для плавного зума на смартфонах
        const pts = Array.from(activePointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (prevPinchDist > 0) {
          const ratio = dist / prevPinchDist;
          if (ratio > 0.2 && ratio < 5) {
            const nextZoom = targetZoomRef.current / Math.pow(ratio, 1.4);
            targetZoomRef.current = THREE.MathUtils.clamp(nextZoom, 0.35, 2.8);
            setZoomPercent(Math.round((1 / targetZoomRef.current) * 100));
          }
        }
        prevPinchDist = dist;
      } else if (activePointers.size === 1) {
        // Вращение одним пальцем
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;

        userYawRef.current += dx * 0.008;
        userPitchRef.current = Math.max(-0.7, Math.min(0.7, userPitchRef.current + dy * 0.006));
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) {
        prevPinchDist = 0;
      }
      if (activePointers.size === 1) {
        const remaining = Array.from(activePointers.values())[0];
        lastX = remaining.x;
        lastY = remaining.y;
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.0016;
      targetZoomRef.current = THREE.MathUtils.clamp(targetZoomRef.current + zoomDelta, 0.35, 2.8);
      setZoomPercent(Math.round((1 / targetZoomRef.current) * 100));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // НЕПРЕРЫВНЫЙ АНИМАЦИОННЫЙ ЦИКЛ БЕЗ СБРОСОВ
    let animId = 0;
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      // Плавное накопление угла вращения: НИКОГДА НЕ СБРАСЫВАЕТСЯ ПРИ КЛИКАХ
      galaxyRotationRef.current += delta * 0.09;
      galaxyGroup.rotation.y = galaxyRotationRef.current + densityWavePhaseRef.current + userYawRef.current;
      galaxyGroup.rotation.x = userPitchRef.current;

      if (haloPointsRef.current) {
        haloPointsRef.current.rotation.y = galaxyRotationRef.current * 0.025;
        haloPointsRef.current.visible = showDarkMatterRef.current;
      }

      // ПЛАВНАЯ ИНТЕРПОЛЯЦИЯ ЗУМА И КАМЕРЫ (LERP) БЕЗ ПЕРЕЗАПУСКОВ
      currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * 0.08;

      const look = currentLookAtRef.current;
      look.lerp(targetLookAtRef.current, 0.045);

      const basePos = baseTargetCameraPosRef.current;
      const targetLook = targetLookAtRef.current;
      const camRay = new THREE.Vector3().subVectors(basePos, targetLook);
      const scaledTargetPos = new THREE.Vector3().copy(targetLook).addScaledVector(camRay, currentZoomRef.current);

      camera.position.lerp(scaledTargetPos, 0.045);
      camera.lookAt(look);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      domElement.removeEventListener('wheel', onWheel);
      renderer.dispose();
      starGeom.dispose();
      starMat.dispose();
      haloGeom.dispose();
      haloMat.dispose();
      sunGeom.dispose();
      sunMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      sunVelGeom.dispose();
    };
  }, []);

  // 2. ГРАФИК КРИВОЙ ВРАЩЕНИЯ ВЕРЫ РУБИН (2D Canvas с субпиксельным сглаживанием)
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;

    ctx.fillStyle = '#06060B';
    ctx.fillRect(0, 0, w, h);

    const isNight = redNightMode;
    const goldColor = isNight ? '#FF2E2E' : '#D4AF37';
    const cyanColor = isNight ? '#FF6666' : '#00F5D4';
    const mutedColor = isNight ? '#882222' : '#71788E';

    const originX = 42;
    const originY = h - 22;
    const plotW = w - originX - 16;
    const plotH = originY - 18;

    // Сетка и оси координат
    ctx.strokeStyle = '#181A26';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(originX, 10);
    ctx.lineTo(originX, originY);
    ctx.lineTo(w - 10, originY);
    ctx.stroke();

    ctx.font = '500 10px monospace';
    ctx.fillStyle = mutedColor;
    ctx.fillText('0', originX - 8, originY + 14);
    ctx.fillText('15 kpc', originX + plotW * 0.5 - 16, originY + 14);
    ctx.fillText('30 kpc', originX + plotW - 24, originY + 14);

    ctx.save();
    ctx.translate(14, originY - plotH * 0.5 + 14);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('v (км/с)', 0, 0);
    ctx.restore();

    // 1. Кеплеровская кривая (без Тёмной Материи: v ~ 1/sqrt(r))
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let px = 0; px <= plotW; px += 2) {
      const r = (px / plotW) * 30 + 0.5;
      const vKep = (r < 4 ? r * 55 : (4 * 55) / Math.sqrt(r / 4)) / 250;
      const py = originY - Math.min(plotH, vKep * plotH);
      if (px === 0) ctx.moveTo(originX + px, py);
      else ctx.lineTo(originX + px, py);
    }
    ctx.stroke();

    // 2. Наблюдаемая кривая Веры Рубин (с учётом гало тёмной материи)
    if (showDarkMatter) {
      ctx.strokeStyle = cyanColor;
      ctx.lineWidth = 2.0;
      ctx.setLineDash([]);
      ctx.beginPath();
      for (let px = 0; px <= plotW; px += 2) {
        const r = (px / plotW) * 30 + 0.5;
        const vObs = (220 * (1 - Math.exp(-r / 2.5))) / 250;
        const py = originY - Math.min(plotH, vObs * plotH);
        if (px === 0) ctx.moveTo(originX + px, py);
        else ctx.lineTo(originX + px, py);
      }
      ctx.stroke();
    }

    // Маркер Солнца на 8.2 кпк
    const sunPlotX = originX + (8.2 / 30) * plotW;
    ctx.strokeStyle = '#FFFFFF';
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(sunPlotX, 10);
    ctx.lineTo(sunPlotX, originY);
    ctx.stroke();

    ctx.fillStyle = '#FFD166';
    ctx.beginPath();
    ctx.arc(sunPlotX, originY - (220 / 250) * plotH, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = cyanColor;
    ctx.font = '600 10px monospace';
    ctx.fillText('Солнце: 8.2 кпк (220 км/с)', sunPlotX - 35, 14);
  }, [showDarkMatter, redNightMode]);

  const activeMilestone = SCALE_MILESTONES.reduce((prev, curr) =>
    Math.abs(curr.exponent - scaleExp) < Math.abs(prev.exponent - scaleExp) ? curr : prev
  );

  const activeViewOption =
    VIEW_OPTIONS.find((v) => v.id === galaxyView) || VIEW_OPTIONS[0];

  return (
    <section
      id="chapter-3"
      className="w-full bg-black py-10 sm:py-16 px-4 sm:px-8 border-b border-[var(--border-subtle)]"
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
            ГЛАВА 3 · МАСШТАБ И МЛЕЧНЫЙ ПУТЬ
          </div>
          <h2
            className="font-display text-2xl sm:text-4xl font-semibold text-[var(--text-parchment)]"
            style={{ textWrap: 'balance' }}
          >
            Архитектура масштаба: где наше место в галактике?
          </h2>
        </motion.div>

        {/* Mode Switcher: 100,000 Stars (Chrome Experiments) vs Milky Way Spiral */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Mode 1 Button: 100 000 Stars */}
            <button
              type="button"
              onClick={() => handleSwitchMode('stars100k')}
              className={`p-2.5 sm:p-3 rounded-2xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
                chapterMode === 'stars100k'
                  ? 'bg-[#12121C] border-[var(--accent-primary)] shadow-[0_0_18px_rgba(212,163,115,0.4)]'
                  : 'bg-[#08080E] border-[var(--border-subtle)] hover:border-white/20'
              }`}
            >
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                  chapterMode === 'stars100k'
                    ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-[0_0_14px_rgba(212,163,115,0.8)] animate-pulseGlow'
                    : 'bg-[#12121A] text-[var(--text-muted)] border-[var(--border-subtle)]'
                }`}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono-tech text-xs sm:text-sm font-semibold truncate ${
                      chapterMode === 'stars100k'
                        ? 'text-[var(--text-parchment)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    100 000 Звёзд
                  </span>
                  {chapterMode === 'stars100k' && (
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shrink-0 animate-ping" />
                  )}
                </div>
                <p className="font-mono-tech text-[10px] sm:text-[11px] text-[var(--accent-secondary)] truncate">
                  3D-скопление · Музыка Sam Hulick
                </p>
              </div>
            </button>

            {/* Mode 2 Button: Milky Way Spiral (Three.js 80,000 Particles) */}
            <button
              type="button"
              onClick={() => handleSwitchMode('galaxy')}
              className={`p-2.5 sm:p-3 rounded-2xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
                chapterMode === 'galaxy'
                  ? 'bg-[#12121C] border-[var(--accent-primary)] shadow-[0_0_18px_rgba(212,163,115,0.4)]'
                  : 'bg-[#08080E] border-[var(--border-subtle)] hover:border-white/20'
              }`}
            >
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                  chapterMode === 'galaxy'
                    ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-[0_0_14px_rgba(212,163,115,0.8)] animate-pulseGlow'
                    : 'bg-[#12121A] text-[var(--text-muted)] border-[var(--border-subtle)]'
                }`}
              >
                <Disc className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono-tech text-xs sm:text-sm font-semibold truncate ${
                      chapterMode === 'galaxy'
                        ? 'text-[var(--text-parchment)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    Спираль Млечного Пути
                  </span>
                  {chapterMode === 'galaxy' && (
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shrink-0 animate-ping" />
                  )}
                </div>
                <p className="font-mono-tech text-[10px] sm:text-[11px] text-[var(--accent-secondary)] truncate">
                  80k звёзд · Волны Лина — Шу · Гало
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Mode 1 Viewport */}
        <div style={{ display: chapterMode === 'stars100k' ? 'block' : 'none' }}>
          <Stars100kExplorer redNightMode={redNightMode} onOpenGlossary={onOpenGlossary} />
        </div>

        {/* Mode 2 Viewport: Upgraded Three.js 80,000 Particle Milky Way Simulation */}
        <div style={{ display: chapterMode === 'galaxy' ? 'block' : 'none' }} className="space-y-6">
          {/* Photographic Disk Perspective Showcase (Face-on & Edge-on Panorama SVGs) */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
          >
            <MilkyWayPerspective redNightMode={redNightMode} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#06060A] border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-6 space-y-5"
          >
            {/* Top: Integrated Circular Scale Dial */}
            <div className="space-y-2.5 pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center justify-between text-xs font-mono-tech">
                <span className="text-[var(--text-muted)]">МАСШТАБ ВСЕЛЕННОЙ:</span>
                <span className="text-[var(--accent-secondary)] font-medium">
                  {activeMilestone.humanComparison}
                </span>
              </div>

              <div className="relative flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollScale('left')}
                  className="w-7 h-9 rounded-xl bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer z-10"
                  title="Прокрутить шкалу масштаба влево"
                  aria-label="Влево"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <motion.div
                  ref={scaleScrollRef}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="flex-1 flex items-center justify-start gap-3 sm:gap-4 custom-scrollbar-x py-1 px-1"
                >
                  {SCALE_MILESTONES.map((ms, idx) => {
                    const isSelected = activeMilestone.exponent === ms.exponent;
                    return (
                      <motion.button
                        key={ms.exponent}
                        type="button"
                        onClick={() => setScaleExp(ms.exponent)}
                        whileTap={{ scale: 0.92 }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.04 }}
                        className="flex flex-col items-center gap-1 group shrink-0 focus:outline-none cursor-pointer"
                      >
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center transition-all duration-200 border-2 active:scale-90 ${
                            isSelected
                              ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-[0_0_16px_rgba(212,163,115,0.6)] font-bold animate-pulseGlow'
                              : 'bg-[#101016] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/60 hover:text-[var(--text-parchment)]'
                          }`}
                        >
                          <span className="font-mono-tech text-xs sm:text-sm leading-none">
                            {ms.label}
                          </span>
                        </div>
                        <span
                          className={`font-mono-tech text-[10px] sm:text-[11px] whitespace-nowrap transition-colors ${
                            isSelected
                              ? 'text-[var(--accent-primary)] font-semibold'
                              : 'text-[var(--text-muted)] group-hover:text-[var(--text-parchment)]'
                          }`}
                        >
                          {ms.subLabel}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>

                <button
                  type="button"
                  onClick={() => scrollScale('right')}
                  className="w-7 h-9 rounded-xl bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer z-10"
                  title="Прокрутить шкалу масштаба вправо"
                  aria-label="Вправо"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3D Three.js Galaxy Viewport with Smooth Camera Lerp & Continuous Rotation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-7 flex flex-col items-center space-y-4">
                <div className="relative w-full aspect-square max-h-[380px] sm:max-h-[440px] flex items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-black shadow-2xl">
                  {/* Three.js Canvas Container (touchAction: none for smooth pinch-to-zoom & drag) */}
                  <div
                    ref={mountRef}
                    style={{ touchAction: 'none' }}
                    className="w-full h-full cursor-grab active:cursor-grabbing block"
                    aria-label="3D-модель галактики Млечный Путь"
                  />

                  {/* Permanent Top-Left Docked Sun Telemetry Badge */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 pointer-events-none flex flex-col gap-0.5 bg-black/85 backdrop-blur-md border border-[var(--border-subtle)] px-2.5 py-1.5 rounded-xl shadow-lg z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFD166] animate-ping shrink-0" />
                      <span className="font-mono-tech text-[10px] sm:text-[11px] text-[#FFD166] font-semibold whitespace-nowrap">
                        РУКАВ ОРИОНА · СОЛНЕЧНАЯ СИСТЕМА
                      </span>
                    </div>
                    <span className="font-mono-tech text-[9px] sm:text-[10px] text-[var(--accent-secondary)]">
                      R☉ = 8,2 кпк (26 000 св. л.) · v = 220 км/с
                    </span>
                  </div>

                  {/* Top-Right Double-Tap Focus Hint */}
                  <div className="absolute top-2.5 right-2.5 pointer-events-none hidden sm:flex items-center gap-1 bg-black/75 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10 font-mono-tech text-[10px] text-[var(--text-muted)] z-10">
                    <span>2 тапа — фокус</span>
                  </div>

                  {/* Bottom-Left Gesture Hint for Mobile */}
                  <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 pointer-events-none flex items-center gap-1.5 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10 font-mono-tech text-[9px] sm:text-[10px] text-[var(--text-muted)] z-10">
                    <span>🔍 Щипок — зум · 1 палец — обзор</span>
                  </div>

                  {/* Floating Glass Zoom HUD (Приближение +, Отдаление -, Сброс ⟲) */}
                  <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center gap-1 bg-[#090912]/90 backdrop-blur-md border border-[var(--border-subtle)] p-1 rounded-xl shadow-2xl z-10">
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      className="w-8 h-8 rounded-lg bg-[#141422] hover:bg-[#1E1E30] text-[var(--text-parchment)] flex items-center justify-center font-bold active:scale-90 transition-all cursor-pointer border border-white/10"
                      title="Приблизить (+)"
                      aria-label="Приблизить"
                    >
                      <Plus className="w-4 h-4 text-[var(--accent-primary)]" />
                    </button>

                    <div className="px-1.5 py-0.5 font-mono-tech text-[10px] sm:text-[11px] text-[var(--accent-secondary)] font-semibold select-none min-w-[38px] text-center">
                      {zoomPercent}%
                    </div>

                    <button
                      type="button"
                      onClick={handleZoomOut}
                      className="w-8 h-8 rounded-lg bg-[#141422] hover:bg-[#1E1E30] text-[var(--text-parchment)] flex items-center justify-center font-bold active:scale-90 transition-all cursor-pointer border border-white/10"
                      title="Отдалить (-)"
                      aria-label="Отдалить"
                    >
                      <Minus className="w-4 h-4 text-[var(--accent-primary)]" />
                    </button>

                    <button
                      type="button"
                      onClick={handleResetZoomAndAngle}
                      className="w-8 h-8 rounded-lg bg-[#141422] hover:bg-[#1E1E30] text-[var(--text-muted)] hover:text-white flex items-center justify-center active:scale-90 transition-all cursor-pointer border border-white/10 ml-0.5"
                      title="Сбросить зум и угол"
                      aria-label="Сброс масштаба"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4 Circular View Angle Buttons (Плавный переход БЕЗ сброса вращения!) */}
                <div className="w-full flex flex-col items-center gap-1.5">
                  <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-sm justify-items-center">
                    {VIEW_OPTIONS.map((opt) => {
                      const isCurrent = galaxyView === opt.id;
                      return (
                        <motion.button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectView(opt.id)}
                          whileTap={{ scale: 0.92 }}
                          className="flex flex-col items-center gap-1 group focus:outline-none cursor-pointer"
                          aria-label={`Переключить ракурс: ${opt.title}`}
                        >
                          <div
                            className={`w-13 h-13 sm:w-15 sm:h-15 rounded-full flex flex-col items-center justify-center transition-all duration-200 border-2 active:scale-90 ${
                              isCurrent
                                ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-[0_0_18px_rgba(212,163,115,0.7)] scale-105 animate-pulseGlow'
                                : 'bg-[#101016] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/70 hover:text-[var(--text-parchment)]'
                            }`}
                          >
                            {opt.id === 'top' && (
                              <Compass
                                className={`w-5 h-5 ${isCurrent ? 'text-black' : 'text-[#4CC9F0]'}`}
                              />
                            )}
                            {opt.id === 'tilt' && (
                              <Orbit
                                className={`w-5 h-5 ${isCurrent ? 'text-black' : 'text-[var(--accent-primary)]'}`}
                              />
                            )}
                            {opt.id === 'edge' && (
                              <Eye
                                className={`w-5 h-5 ${isCurrent ? 'text-black' : 'text-[#FF5400]'}`}
                              />
                            )}
                            {opt.id === 'sun' && (
                              <Navigation
                                className={`w-5 h-5 ${isCurrent ? 'text-black' : 'text-[#FFD166]'}`}
                              />
                            )}
                          </div>

                          <span
                            className={`font-mono-tech text-[10px] sm:text-[11px] font-medium leading-tight ${
                              isCurrent
                                ? 'text-[var(--accent-primary)] font-semibold'
                                : 'text-[var(--text-muted)]'
                            }`}
                          >
                            {opt.title}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Side: Rotation Curve & Science Context */}
              <div className="lg:col-span-5 space-y-4">
                {/* Vera Rubin Rotation Curve Canvas */}
                <div className="p-3.5 sm:p-4 rounded-2xl border border-[var(--border-subtle)] bg-[#07070D] space-y-2.5">
                  <div className="flex items-center justify-between font-mono-tech text-xs">
                    <span className="text-[var(--text-parchment)] font-semibold">
                      Кривая вращения: Кеплер vs Наблюдения
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono-tech text-[10px]">
                    <span className="text-[var(--accent-primary)]">-- Кеплер (без DM)</span>
                    <span className="text-[var(--accent-secondary)] font-bold">
                      — Наблюдаемая (с гало)
                    </span>
                  </div>

                  <div className="w-full h-[110px] rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-black">
                    <canvas ref={graphCanvasRef} className="w-full h-full block" />
                  </div>

                  {/* Controls: Dark Matter Halo Toggle & Lin-Shu Phase Slider */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1 font-mono-tech text-xs">
                    <button
                      type="button"
                      onClick={() => setShowDarkMatter((prev) => !prev)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        showDarkMatter
                          ? 'border-[var(--accent-secondary)] text-[var(--accent-secondary)] bg-[var(--accent-secondary)]/15 shadow-[0_0_12px_rgba(76,201,240,0.3)]'
                          : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-parchment)]'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Гало Тёмной Материи: {showDarkMatter ? 'ВКЛ' : 'ВЫКЛ'}</span>
                    </button>

                    <div className="flex items-center justify-between sm:justify-end gap-2 text-[var(--text-muted)] text-[11px]">
                      <span>Волна Лина-Шу:</span>
                      <input
                        type="range"
                        min={0}
                        max={Math.PI * 2}
                        step={0.1}
                        value={densityWavePhase}
                        onChange={(e) => setDensityWavePhase(parseFloat(e.target.value))}
                        className="planetarium-slider w-20 sm:w-24 cursor-pointer"
                        aria-label="Фаза волн плотности Лина — Шу"
                      />
                    </div>
                  </div>
                </div>

                {/* Perspective View Description Card */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-4 sm:p-5 rounded-2xl bg-black border border-[var(--border-subtle)] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]" />
                      <h3 className="font-display text-base sm:text-lg font-semibold text-[var(--accent-primary)]">
                        {activeViewOption.title}: {activeViewOption.subtitle}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMilkyWayDetails(!showMilkyWayDetails)}
                      className="font-mono-tech text-[11px] text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0C0C12] border border-[var(--border-subtle)] cursor-pointer"
                    >
                      <span>{showMilkyWayDetails ? 'Скрыть' : 'Инфо'}</span>
                      {showMilkyWayDetails ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="font-body text-xs sm:text-sm text-[var(--text-parchment)] leading-relaxed">
                    {activeViewOption.description}
                  </p>

                  <AnimatePresence initial={false}>
                    {showMilkyWayDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, filter: 'blur(3px)' }}
                        animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
                        exit={{ opacity: 0, height: 0, filter: 'blur(3px)' }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="font-mono-tech text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)] space-y-2 overflow-hidden"
                      >
                        <div className="text-[var(--text-parchment)] flex items-start gap-1.5">
                          <span className="text-[#FFD166]">✦</span>
                          <span>
                            <strong>Кинематика Лина — Шу:</strong> звёзды не привязаны к рукавам
                            навсегда; спиральные рукава — это движущиеся волны сгущения плотности,
                            сквозь которые пролетают звёзды.
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#4CC9F0]">✦</span>
                          <span>
                            <strong>Открытие Веры Рубин:</strong> скорость вращения внешних звёзд не
                            падает по закону Кеплера (v ∝ 1/√r), оставаясь плоской (~220
                            км/с), что доказывает наличие колоссального гало невидимой Тёмной
                            Материи.
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[#FF5400]">✦</span>
                          <span>
                            <strong>Стрелец A*:</strong> в самом центре балджа вращается
                            сверхмассивная чёрная дыра массой ~4,3 миллиона масс Солнца.
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Glossary Deep-Dive Button */}
                <motion.button
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  type="button"
                  onClick={() => onOpenGlossary('galaxy')}
                  className="min-h-[44px] w-full px-4 py-2.5 rounded-xl bg-black border border-[var(--border-subtle)] font-mono-tech text-xs text-[var(--text-parchment)] flex items-center justify-center gap-2 hover:border-[var(--accent-primary)] active:scale-95 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Открыть статью «Млечный Путь и спирали» в глоссарии</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
