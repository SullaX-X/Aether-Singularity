import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
  BookOpen,
  Compass,
  Orbit,
  Disc,
  Navigation,
  CircleDot,
  Sparkles,
  Info,
  Calendar,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { Chapter1Geometries } from './Chapter1Geometries';
import { Chapter2PlanetSieve } from './Chapter2PlanetSieve';
import { Chapter3MilkyWay } from './Chapter3MilkyWay';
import { Chapter4BlackHole } from './Chapter4BlackHole';
import { HeroArmillary } from './HeroArmillary';

export interface ChapterWindowMeta {
  index: number;
  id: string;
  number: string;
  title: string;
  shortLabel: string;
  era: string;
  coordinates: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  badges: Array<{ icon: string; label: string; value: string }>;
  tabs: {
    essence: { title: string; paragraphs: string[] };
    history: { title: string; quotes: Array<{ author: string; year: string; text: string }> };
    physics: { title: string; points: Array<{ title: string; detail: string }> };
    glossaryTerms: Array<{ id: string; name: string }>;
  };
}

export const CHAPTER_WINDOWS_DATA: ChapterWindowMeta[] = [
  {
    index: 0,
    id: 'hero',
    number: '00',
    title: 'Эфир и Хрустальные Сферы',
    shortLabel: 'Эфир',
    era: '350 г. до н.э. — 150 г. н.э.',
    coordinates: '37°58′N 23°43′E · Афины / Александрия',
    icon: Compass,
    tagline: 'Первичный взгляд: неподвижный центр мира и небесный квинтэссенция-эфир',
    badges: [
      { icon: '🏛', label: 'Античность', value: 'Аристотель & Птолемей' },
      { icon: '✨', label: 'Элемент', value: 'Пятый элемент (Квинтэссенция)' },
      { icon: '🌐', label: 'Сферы', value: 'Хрустальные вложенные круги' },
      { icon: '🧭', label: 'Принцип', value: 'Идеальное круговое движение' },
    ],
    tabs: {
      essence: {
        title: 'Суть античной космологии',
        paragraphs: [
          'В античной философии подлунный мир (Земля) считался изменчивым и бренным, состоящим из четырёх стихий: земли, воды, воздуха и огня.',
          'Надлунный же мир небесных светил признавался вечным и нетленным, наполненным пятой тончайшей стихией — светоносным Эфиром.',
          'Небесные тела не могли летать в пустоте: считалось, что они впаяны в концентрические хрустальные сферы, вращаемые Перводвигателем.',
        ],
      },
      history: {
        title: 'Исторические свидетельства',
        quotes: [
          {
            author: 'Аристотель',
            year: '350 г. до н.э.',
            text: '«Небесное тело по своей природе должно двигаться по кругу, ибо круговое движение совершенно и не имеет ни начала, ни конца.»',
          },
          {
            author: 'Клавдий Птолемей',
            year: '150 г. н.э.',
            text: '«Земля по сравнению со сферой неподвижных звёзд имеет величину точки и покоится в самом центре небес.»',
          },
        ],
      },
      physics: {
        title: 'Структура системы мира',
        points: [
          { title: 'Геоцентризм', detail: 'Неподвижная сферическая Земля в точке геометрического центра Вселенной.' },
          { title: 'Арматура сфер', detail: 'Семь концентрических небес для Луны, Меркурия, Венеры, Солнца, Марса, Юпитера и Сатурна.' },
          { title: 'Сфера неподвижных звёзд', detail: 'Внешняя граница сотворённого космоса, за которой пребывает Эфир.' },
        ],
      },
      glossaryTerms: [
        { id: 'astronomy', name: 'Астрономия' },
        { id: 'aether', name: 'Эфир и квинтэссенция' },
        { id: 'armillary', name: 'Армиллярная сфера' },
        { id: 'geocentrism', name: 'Геоцентризм' },
      ],
    },
  },
  {
    index: 1,
    id: 'chapter-1',
    number: '01',
    title: 'Битва Геометрий: Петли Марса',
    shortLabel: 'Орбиты',
    era: '150 г. н.э. — 1609 г. н.э.',
    coordinates: '50°05′N 14°25′E · Прага, Иоганн Кеплер',
    icon: Orbit,
    tagline: 'Как попятное движение Марса разрушило догму совершенных кругов',
    badges: [
      { icon: '🪐', label: 'Объект', value: 'Марс (e = 0.0934)' },
      { icon: '⏱', label: 'Период', value: '686.98 земных суток' },
      { icon: '📐', label: 'Разрешение', value: 'Эпициклы ➔ Эллипсы' },
      { icon: '⚖', label: 'Закон Кеплера', value: 'T² ∝ a³ (Гармония мира)' },
    ],
    tabs: {
      essence: {
        title: 'Загадка попятного движения',
        paragraphs: [
          'Каждые два года Марс замедляет свой обычный бег на восток, останавливается и начинает двигаться назад (попятно), вычерчивая на фоне созвездий характерную петлю.',
          'Птолемей ввёл эпициклы: малое колесо катится по большому деференту. Это спасало круговую геометрию, но требовало искусственных поправок (эквантов).',
          'Коперник доказал: петля — оптическая иллюзия! Быстрая внутренняя Земля обгоняет медленный Марс по соседней дорожке.',
          'Кеплер на основе сверхточных данных Тихо Браге открыл истину: орбиты — это не круги, а эллипсы с Солнцем в фокусе.',
        ],
      },
      history: {
        title: 'Хроника геометрий',
        quotes: [
          {
            author: 'Николай Коперник',
            year: '1543 г.',
            text: '«В центре всех светил восседает Солнце. Кто мог бы поместить этот светильник в прекраснейшем храме на лучшее место?»',
          },
          {
            author: 'Иоганн Кеплер',
            year: '1609 г.',
            text: '«Если бы я верил, что мы можем пренебречь этими восемью угловыми минутами у Тихо Браге, я бы заделал трещину. Но раз так — эти восемь минут открыли путь к полному преобразованию всей астрономии.»',
          },
        ],
      },
      physics: {
        title: 'Законы движения планет',
        points: [
          { title: 'I Закон Кеплера', detail: 'Орбита каждой планеты есть эллипс, в одном из фокусов которого находится Солнце.' },
          { title: 'II Закон (Закон площадей)', detail: 'Радиус-вектор планеты за равные промежутки времени описывает равные площади.' },
          { title: 'III Закон Кеплера', detail: 'Квадраты периодов обращения планет относятся как кубы больших полуосей орбит: T₁²/T₂² = a₁³/a₂³.' },
        ],
      },
      glossaryTerms: [
        { id: 'epicycle', name: 'Эпицикл' },
        { id: 'deferent', name: 'Деферент' },
        { id: 'heliocentrism', name: 'Гелиоцентризм' },
        { id: 'kepler-laws', name: 'Законы Кеплера' },
      ],
    },
  },
  {
    index: 2,
    id: 'chapter-2',
    number: '02',
    title: 'Сито Планет: Драма Плутона',
    shortLabel: 'Плутон',
    era: '1930 — 2006 г.',
    coordinates: '50°05′N 14°25′E · XXVI Ассамблея МАС, Прага',
    icon: Disc,
    tagline: 'Как открытие Эриды и пояса Койпера переписало само слово «Планета»',
    badges: [
      { icon: '❄', label: 'Плутон', value: 'Карликовая планета (МАС 2006)' },
      { icon: '📏', label: 'Диаметр', value: '2376 км (меньше Луны)' },
      { icon: '🧊', label: 'Пояс Койпера', value: '100 000+ ледяных тел' },
      { icon: '❌', label: 'Сито МАС', value: 'Не расчистил орбиту' },
    ],
    tabs: {
      essence: {
        title: 'Почему Плутон перестал быть девятой планетой',
        paragraphs: [
          'После открытия Плутона Клайдом Томбо в 1930 году его посчитали полноправной планетой. Но в 1990-х годах за Нептуном открыли Пояс Койпера — рой из десятков тысяч ледяных миров.',
          'Когда в 2005 году Майкл Браун открыл Эриду — объект такой же массы, как Плутон, астрономы встали перед выбором: либо признать планетами ещё 50 карликов, либо сформулировать строгое научное сито.',
          'В 2006 году Международный астрономический союз (МАС) принял 3 строгих критерия: обращение вокруг Солнца, гидростатическое равновесие (круглая форма) и динамическое доминирование (расчистка окрестностей орбиты).',
          'Плутон весит лишь долю процента от общей массы окружающих его тел пояса Койпера и пересекает орбиту Нептуна, поэтому был классифицирован как карликовая планета.',
        ],
      },
      history: {
        title: 'Исторический резонанс',
        quotes: [
          {
            author: 'Резолюция МАС 5A',
            year: '24 августа 2006 г.',
            text: '«Планета — это небесное тело, которое: (a) обращается вокруг Солнца, (b) имеет достаточную массу для гидростатического равновесия, (c) расчистило окрестности своей орбиты.»',
          },
          {
            author: 'Майкл Браун',
            year: '2010 г.',
            text: '«Плутон прекрасен не потому, что он девятая планета в учебнике, а потому, что он открыл нам двери в грандиозный ледяной пояс Койпера.»',
          },
        ],
      },
      physics: {
        title: 'Три строгих фильтра планеты',
        points: [
          { title: 'Критерий 1: Звезда', detail: 'Тело должно обращаться исключительно вокруг Солнца, а не вокруг другой планеты.' },
          { title: 'Критерий 2: Гидростатика', detail: 'Собственная гравитация превосходит сопротивление твёрдого вещества, формируя сферу.' },
          { title: 'Критерий 3: Доминирование', detail: 'Параметр Штерна-Левисона Λ ≫ 1. Тело должно гравитационно рассеять или поглотить всех соседей.' },
        ],
      },
      glossaryTerms: [
        { id: 'planet', name: 'Планета' },
        { id: 'hydrostatic-equilibrium', name: 'Гидростатическое равновесие' },
        { id: 'clearing-neighborhood', name: 'Расчистка орбиты' },
      ],
    },
  },
  {
    index: 3,
    id: 'chapter-3',
    number: '03',
    title: 'Млечный Путь: 100 000 Звёзд',
    shortLabel: 'Галактика',
    era: '1920 г. — настоящее время',
    coordinates: '38°53′N 77°01′W · Смитсоновский институт, Великий спор',
    icon: Navigation,
    tagline: 'От островка Солнца до колоссального спирального диска из 400 миллиардов звёзд',
    badges: [
      { icon: '🌌', label: 'Тип', value: 'Спиральная с перемычкой (SBbc)' },
      { icon: '📏', label: 'Диаметр', value: '100 000 световых лет' },
      { icon: '⭐', label: 'Звёзд', value: '100–400 миллиардов' },
      { icon: '📍', label: 'Позиция', value: 'Рукав Ориона (26 000 св. л. до центра)' },
    ],
    tabs: {
      essence: {
        title: 'Осознание масштаба Галактики',
        paragraphs: [
          'Ещё в начале XX века многие учёные полагали, что Млечный Путь — это и есть вся Вселенная, а туманности — просто облака газа внутри него.',
          'В 1920 году на «Великом споре» Харлоу Шепли и Хибер Кёртис столкнулись по вопросу масштаба: Шепли доказывал колоссальность Млечного Пути, а Кёртис утверждал, что спиральные туманности — это далёкие самостоятельные галактики («островные вселенные»).',
          'В 1924 году Эдвин Хаббл обнаружил переменные звёзды (цефеиды) в туманности Андромеды и доказал: она удалена на миллионы световых лет, открыв безграничную внегалактическую Вселенную.',
          'В нашей модели воспроизведена трёхмерная карта 100 000 ближайших звёзд и спиральных рукавов Млечного Пути.',
        ],
      },
      history: {
        title: 'Великий Спор 1920 года',
        quotes: [
          {
            author: 'Харлоу Шепли',
            year: '1920 г.',
            text: '«Солнце не находится в центре Млечного Пути. Шаровые скопления очерчивают истинный колоссальный размер нашей звёздной системы диаметром 300 000 световых лет.»',
          },
          {
            author: 'Эдвин Хаббл',
            year: '1924 г.',
            text: '«Спиральная туманность Андромеды — это независимый звёздный остров, лежащий далеко за пределами Млечного Пути.»',
          },
        ],
      },
      physics: {
        title: 'Анатомия Млечного Пути',
        points: [
          { title: 'Звёздный диск', detail: 'Толщина диска около 1000 световых лет, диаметр — свыше 100 000 световых лет.' },
          { title: 'Спиральные рукава', detail: 'Волны плотности: рукава Персея, Стрельца, Щита-Центавра и рукав Ориона, где находится Солнце.' },
          { title: 'Орбитальная скорость', detail: 'Солнечная система мчится со скоростью 220 км/с, совершая галактический год за 230 млн лет.' },
        ],
      },
      glossaryTerms: [
        { id: 'galaxy', name: 'Галактика' },
        { id: 'dark-matter', name: 'Тёмная материя' },
        { id: 'density-wave', name: 'Волны плотности Лина — Шу' },
      ],
    },
  },
  {
    index: 4,
    id: 'chapter-4',
    number: '04',
    title: 'Горизонт Событий: Чёрная Дыра',
    shortLabel: 'Сингулярность',
    era: '1915 г. — Наблюдения Телескопа EHT',
    coordinates: 'Центр Галактики · Стрелец A* (26 000 св. лет)',
    icon: CircleDot,
    tagline: 'Гравитационное линзирование, замедление времени и свет на краю бездны',
    badges: [
      { icon: '⚫', label: 'Стрелец A*', value: '4.3 млн масс Солнца' },
      { icon: '📏', label: 'Радиус rₛ', value: '12.7 млн км (2GM/c²)' },
      { icon: '⏳', label: 'Дилатация', value: 'dt = dt₀ / √(1 - rₛ/r)' },
      { icon: '🌀', label: 'Аккреция', value: 'Релятивистский эффект Доплера' },
    ],
    tabs: {
      essence: {
        title: 'Физика гравитационного горизонта',
        paragraphs: [
          'В 1915 году Альберт Эйнштейн сформулировал общую теорию относительности, согласно которой масса искривляет пространство и время.',
          'Карл Шварцшильд нашёл точное решение уравнений для невращающейся массы: если сжать массу в критический радиус rₛ = 2GM/c², скорость убегания превысит скорость света.',
          'В 2019 и 2022 годах Телескоп горизонта событий (EHT) впервые сфотографировал тень чёрных дыр M87* и Стрелец A* в центре нашей галактики.',
          'Вы наблюдаете симуляцию на WebGL: свет от задней стороны горячего газового диска огибает дыру сверху и снизу из-за искривления пространства-времени, а набегающая сторона выглядит ярче из-за релятивистского эффекта Доплера.',
        ],
      },
      history: {
        title: 'От гипотезы к фотографии',
        quotes: [
          {
            author: 'Карл Шварцшильд',
            year: '1916 г.',
            text: '«Как видите, война отнеслась ко мне достаточно благосклонно, позволив мне среди тяжёлой стрельбы прогуляться в царстве ваших идей.»',
          },
          {
            author: 'Коллаборация EHT',
            year: '2022 г.',
            text: '«Мы впервые увидели лицо гиганта в сердце нашей собственной галактики — Стрелец A*. Общая теория относительности безупречно прошла проверку в сильнейшем гравитационном поле.»',
          },
        ],
      },
      physics: {
        title: 'Релятивистские эффекты',
        points: [
          { title: 'Радиус Шварцшильда', detail: 'Граница сферы, из-под которой ничто, даже свет, не может вырваться наружу: rₛ = 2GM/c².' },
          { title: 'Гравитационное замедление', detail: 'Для удалённого наблюдателя часы падающего объекта бесконечно замедляются при подходе к rₛ.' },
          { title: 'Фотонная сфера (1.5 rₛ)', detail: 'Критическая орбита, на которой фотоны света могут двигаться по кругу вокруг чёрной дыры.' },
        ],
      },
      glossaryTerms: [
        { id: 'black-hole', name: 'Чёрная дыра' },
        { id: 'event-horizon', name: 'Горизонт событий' },
        { id: 'schwarzschild-radius', name: 'Радиус Шварцшильда' },
        { id: 'ergosphere', name: 'Эргосфера' },
        { id: 'singularity', name: 'Сингулярность' },
        { id: 'gravitational-lensing', name: 'Гравитационная линза' },
      ],
    },
  },
];

interface ChapterWindowViewProps {
  activeChapterIndex: number;
  onSelectChapter: (index: number) => void;
  onCloseWindow: () => void;
  redNightMode: boolean;
  onOpenGlossary: (termId?: string) => void;
}

export const ChapterWindowView: React.FC<ChapterWindowViewProps> = ({
  activeChapterIndex,
  onSelectChapter,
  onCloseWindow,
  redNightMode,
  onOpenGlossary,
}) => {
  const [activeTab, setActiveTab] = useState<'essence' | 'history' | 'physics' | 'glossary'>('essence');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const chapterScrollRef = useRef<HTMLDivElement | null>(null);
  const activeChapterBtnRef = useRef<HTMLButtonElement | null>(null);

  const chapter = CHAPTER_WINDOWS_DATA[activeChapterIndex] || CHAPTER_WINDOWS_DATA[1];
  const Icon = chapter.icon;

  useEffect(() => {
    if (!chapterMenuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setChapterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [chapterMenuOpen]);

  // Auto-center the active chapter tab in the horizontal scroll bar
  useEffect(() => {
    if (activeChapterBtnRef.current) {
      activeChapterBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeChapterIndex]);

  const scrollChapters = (direction: 'left' | 'right') => {
    if (chapterScrollRef.current) {
      const offset = direction === 'left' ? -150 : 150;
      chapterScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    const nextIdx = (activeChapterIndex - 1 + CHAPTER_WINDOWS_DATA.length) % CHAPTER_WINDOWS_DATA.length;
    onSelectChapter(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeChapterIndex + 1) % CHAPTER_WINDOWS_DATA.length;
    onSelectChapter(nextIdx);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col p-2 sm:p-4 overflow-hidden">
      {/* OS-Style Window Container */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-6xl mx-auto bg-[#07070D] border border-[var(--border-subtle)] rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.95)] ${
          isFullscreen ? 'h-full' : 'h-full max-h-[96vh]'
        }`}
      >
        {/* Window Top Titlebar / Modern Mobile-First Chrome */}
        <div className="h-12 sm:h-14 bg-[#0A0A14] border-b border-[var(--border-subtle)] px-2.5 sm:px-5 flex items-center justify-between gap-2 shrink-0 relative">
          {/* Left: Window Traffic Lights & Interactive Chapter Selector */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0" ref={dropdownRef}>
            {/* Window Traffic Lights */}
            <div className="flex items-center gap-1.5 pr-1.5 sm:pr-2 border-r border-[#1F1F2F]">
              <button
                type="button"
                onClick={onCloseWindow}
                className="w-3.5 h-3.5 rounded-full bg-red-500/90 hover:bg-red-400 active:scale-90 transition-all flex items-center justify-center group"
                title="Закрыть окно и вернуться к ленте"
                aria-label="Закрыть окно"
              >
                <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors hidden sm:block"
                title="Полноэкранный режим"
                aria-label="Полный экран"
              />
              <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 hidden sm:block" />
            </div>

            {/* Interactive Chapter Selector Button (Opens soft dropdown) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setChapterMenuOpen((prev) => !prev)}
                className={`min-h-[34px] px-2 sm:px-2.5 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border ${
                  chapterMenuOpen
                    ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-[var(--accent-primary)] shadow-sm'
                    : 'bg-[#12121E] border-[var(--border-subtle)] text-[var(--text-parchment)] hover:border-[var(--accent-primary)]/40'
                }`}
                title="Выбрать главу"
                aria-haspopup="true"
                aria-expanded={chapterMenuOpen}
              >
                <span className="font-mono-tech text-[10px] sm:text-xs text-[var(--accent-primary)] font-bold px-1.5 py-0.5 rounded bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 shrink-0">
                  ОКНО {chapter.number}
                </span>
                <span className="font-display text-xs sm:text-sm font-semibold text-[var(--text-parchment)] truncate max-w-[110px] xs:max-w-[150px] sm:max-w-[200px]">
                  {chapter.shortLabel}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[var(--accent-primary)] transition-transform duration-200 shrink-0 ${
                    chapterMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Soft Animated Chapter Switcher Dropdown */}
              <AnimatePresence>
                {chapterMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, scale: 0.95, filter: 'blur(4px)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28, mass: 0.7 }}
                    className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 p-2.5 rounded-2xl bg-[#0A0A14]/98 border border-[var(--accent-primary)]/40 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl space-y-1.5"
                    role="menu"
                    aria-label="Выбор главы окна"
                  >
                    <div className="px-2 py-1 flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5">
                      <span className="font-mono-tech text-[10px] text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1 font-semibold">
                        <Sparkles className="w-3 h-3" />
                        Перейти к окну главы
                      </span>
                      <span className="font-mono-tech text-[10px] text-[var(--text-muted)]">
                        5 глав
                      </span>
                    </div>

                    <div className="space-y-1 pt-1 max-h-[60vh] overflow-y-auto pr-0.5 custom-scrollbar-y">
                      {CHAPTER_WINDOWS_DATA.map((ch) => {
                        const isActive = ch.index === activeChapterIndex;
                        const ChIcon = ch.icon;
                        return (
                          <button
                            key={ch.id}
                            type="button"
                            onClick={() => {
                              onSelectChapter(ch.index);
                              setChapterMenuOpen(false);
                            }}
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
                                  <span>{ch.title}</span>
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

                    <div className="pt-1.5 border-t border-[var(--border-subtle)]">
                      <button
                        type="button"
                        onClick={() => {
                          setChapterMenuOpen(false);
                          onCloseWindow();
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-[#12121E] hover:bg-[#181828] text-[var(--text-muted)] hover:text-[var(--text-parchment)] font-mono-tech text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3 text-red-400" />
                        <span>Закрыть окно (вернуться к ленте)</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Full Chapter Title */}
            <span className="hidden md:inline font-display text-xs lg:text-sm font-semibold text-[var(--text-parchment)] truncate max-w-[220px] lg:max-w-none opacity-80">
              {chapter.title}
            </span>
          </div>

          {/* Right: Actions (Nav, Fullscreen, Close) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-parchment)] active:scale-95 transition-all"
              title="Предыдущее окно"
              aria-label="Предыдущая глава"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-parchment)] active:scale-95 transition-all"
              title="Следующее окно"
              aria-label="Следующая глава"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={onCloseWindow}
              className="min-h-[30px] sm:min-h-[32px] px-2 sm:px-2.5 py-1 rounded-lg bg-[#151522] border border-[var(--border-subtle)] text-[var(--text-parchment)] hover:border-[var(--accent-primary)]/50 font-mono-tech text-xs flex items-center gap-1 active:scale-95 transition-all"
              title="Вернуться к ленте"
            >
              <X className="w-3.5 h-3.5 text-red-400 sm:text-inherit" />
              <span className="hidden xs:inline">Лента</span>
            </button>
          </div>
        </div>

        {/* Chapters Horizontal Scroll Carousel Bar (Mobile-friendly, touch-scrollable with visible custom-scrollbar and flanking arrow buttons) */}
        <div className="bg-[#080812] border-b border-[var(--border-subtle)] px-2 sm:px-4 py-1.5 flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 text-[var(--accent-primary)] font-mono-tech text-[10px] sm:text-xs font-semibold shrink-0 pl-1 pr-1.5 border-r border-[#1C1C2A]">
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Главы:</span>
          </div>

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollChapters('left')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-parchment)] active:scale-95 flex items-center justify-center shrink-0 transition-colors"
            title="Прокрутить главы влево"
            aria-label="Прокрутить главы влево"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Scrollable Container with custom-scrollbar-x */}
          <div
            ref={chapterScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar-x py-1 px-1 scroll-smooth flex-1 min-w-0"
          >
            {CHAPTER_WINDOWS_DATA.map((ch) => {
              const isActive = ch.index === activeChapterIndex;
              const ChIcon = ch.icon;
              return (
                <button
                  key={ch.id}
                  ref={isActive ? activeChapterBtnRef : undefined}
                  type="button"
                  onClick={() => onSelectChapter(ch.index)}
                  className={`min-h-[32px] sm:min-h-[34px] px-2.5 sm:px-3 py-1 rounded-xl font-mono-tech text-[11px] sm:text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] font-semibold shadow-[0_0_12px_rgba(212,163,115,0.45)]'
                      : 'bg-[#10101C] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-parchment)] hover:border-[var(--accent-primary)]/40'
                  }`}
                >
                  <ChIcon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[var(--accent-primary)]'}`} />
                  <span>{ch.number} · {ch.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollChapters('right')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-parchment)] active:scale-95 flex items-center justify-center shrink-0 transition-colors"
            title="Прокрутить главы вправо"
            aria-label="Прокрутить главы вправо"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Ultra-Slim Historic Coordinates Sub-Header Bar (Compact single line without taking up vertical stage) */}
        <div className="px-3 sm:px-5 py-1 bg-[#06060E] border-b border-[var(--border-subtle)]/60 flex items-center justify-between text-[10px] sm:text-xs font-mono-tech text-[var(--text-muted)] shrink-0">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <span className="text-[var(--accent-primary)] shrink-0">📍</span>
            <span className="text-[var(--text-parchment)] font-medium truncate max-w-[180px] xs:max-w-[260px] sm:max-w-none">
              {chapter.coordinates}
            </span>
            <span className="text-zinc-600 shrink-0">·</span>
            <span className="text-zinc-400 shrink-0 truncate">{chapter.era}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider">3D Режим активен</span>
          </div>
        </div>

        {/* Main Split Window Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Top Interactive Canvas Stage */}
          <div className="relative w-full bg-black/60 min-h-[320px] sm:min-h-[440px] flex flex-col shrink-0 border-b border-[var(--border-subtle)]">
            {activeChapterIndex === 0 && (
              <HeroArmillary
                redNightMode={redNightMode}
                onToggleRedMode={() => {}}
                onOpenGlossary={onOpenGlossary}
                isInstallable={false}
                isIOS={false}
                onInstallPWA={() => {}}
                isOnline={true}
              />
            )}

            {activeChapterIndex === 1 && (
              <Chapter1Geometries
                redNightMode={redNightMode}
                onOpenGlossary={onOpenGlossary}
              />
            )}

            {activeChapterIndex === 2 && (
              <Chapter2PlanetSieve
                redNightMode={redNightMode}
                onOpenGlossary={onOpenGlossary}
              />
            )}

            {activeChapterIndex === 3 && (
              <Chapter3MilkyWay
                redNightMode={redNightMode}
                onOpenGlossary={onOpenGlossary}
              />
            )}

            {activeChapterIndex === 4 && (
              <Chapter4BlackHole
                redNightMode={redNightMode}
                onOpenGlossary={onOpenGlossary}
              />
            )}
          </div>

          {/* Bottom Grouped Information Bar (Synonyms, Metrics, and Grouped Drawers) */}
          <div className="p-4 sm:p-6 bg-[#06060B] space-y-5">
            {/* Minimalist Summary Badges with Icons (Mobile-First Ergonomics) */}
            <div className="space-y-1.5">
              <div className="font-mono-tech text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                Ключевые показатели эпохи
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {chapter.badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#0B0B14] border border-[var(--border-subtle)] flex items-center gap-2.5 hover:border-[var(--accent-primary)]/40 transition-colors"
                  >
                    <span className="text-lg shrink-0">{badge.icon}</span>
                    <div className="min-w-0">
                      <div className="font-mono-tech text-[10px] text-[var(--text-muted)] truncate">
                        {badge.label}
                      </div>
                      <div className="font-display text-xs sm:text-sm font-semibold text-[var(--text-parchment)] truncate">
                        {badge.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

              {/* Content Tabs (Grouped Information without Deleting Data) */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 p-1 bg-[#0A0A14] border border-[var(--border-subtle)] rounded-xl overflow-x-auto custom-scrollbar-x">
                {[
                  { id: 'essence', label: '💡 Суть идеи' },
                  { id: 'history', label: '📜 Хроника и цитаты' },
                  { id: 'physics', label: '📐 Физика и формулы' },
                  { id: 'glossary', label: '📖 Термины' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-lg font-mono-tech text-xs transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[var(--accent-primary)] text-black font-semibold shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-parchment)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Tab 1: Essence */}
                {activeTab === 'essence' && (
                  <motion.div
                    key="tab-essence"
                    initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="p-4 rounded-xl bg-[#090912] border border-[var(--border-subtle)] space-y-3"
                  >
                    <h4 className="font-display text-base font-semibold text-[var(--text-parchment)]">
                      {chapter.tabs.essence.title}
                    </h4>
                    <div className="space-y-2 font-body text-sm text-[var(--text-muted)] leading-relaxed">
                      {chapter.tabs.essence.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tab 2: History & Quotes */}
                {activeTab === 'history' && (
                  <motion.div
                    key="tab-history"
                    initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-3"
                  >
                    <h4 className="font-display text-base font-semibold text-[var(--text-parchment)]">
                      {chapter.tabs.history.title}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {chapter.tabs.history.quotes.map((q, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-[#090912] border-l-2 border-[var(--accent-primary)] border-t border-r border-b border-[var(--border-subtle)] space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs font-mono-tech">
                            <span className="text-[var(--accent-primary)] font-semibold">{q.author}</span>
                            <span className="text-[var(--text-muted)]">{q.year}</span>
                          </div>
                          <p className="font-body text-sm italic text-[var(--text-parchment)] leading-relaxed">
                            {q.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tab 3: Physics & Mathematics */}
                {activeTab === 'physics' && (
                  <motion.div
                    key="tab-physics"
                    initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-3"
                  >
                    <h4 className="font-display text-base font-semibold text-[var(--text-parchment)]">
                      {chapter.tabs.physics.title}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {chapter.tabs.physics.points.map((pt, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl bg-[#090912] border border-[var(--border-subtle)] space-y-1.5"
                        >
                          <div className="font-display text-sm font-semibold text-[var(--accent-primary)]">
                            {pt.title}
                          </div>
                          <p className="font-body text-xs text-[var(--text-muted)] leading-relaxed">
                            {pt.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tab 4: Glossary */}
                {activeTab === 'glossary' && (
                  <motion.div
                    key="tab-glossary"
                    initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="p-4 rounded-xl bg-[#090912] border border-[var(--border-subtle)] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-base font-semibold text-[var(--text-parchment)]">
                        Термины и понятия этой главы
                      </h4>
                      <button
                        type="button"
                        onClick={() => onOpenGlossary()}
                        className="text-xs font-mono-tech text-[var(--accent-primary)] hover:underline flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Полный словарь</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {chapter.tabs.glossaryTerms.map((term) => (
                        <button
                          key={term.id}
                          type="button"
                          onClick={() => onOpenGlossary(term.id)}
                          className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[#12121E] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] text-xs font-mono-tech text-[var(--text-parchment)] flex items-center gap-1.5 transition-colors active:scale-95"
                        >
                          <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" />
                          <span>{term.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Window Bottom Status Bar */}
        <div className="h-10 bg-[#0A0A14] border-t border-[var(--border-subtle)] px-3 sm:px-5 flex items-center justify-between text-[11px] font-mono-tech text-[var(--text-muted)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">WebGL & Canvas синхронизированы</span>
            <span className="sm:hidden">60 FPS</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="hover:text-[var(--text-parchment)] flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Назад</span>
            </button>
            <span className="text-zinc-600">•</span>
            <button
              type="button"
              onClick={handleNext}
              className="hover:text-[var(--text-parchment)] flex items-center gap-1"
            >
              <span>Вперёд</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
