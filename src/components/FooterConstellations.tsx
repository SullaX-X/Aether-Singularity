import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, BookOpen, Compass } from 'lucide-react';

interface FooterConstellationsProps {
  onOpenGlossary: (termId?: string) => void;
}

interface ConstellationInfo {
  id: string;
  name: string;
  chapterHref: string;
  chapterButtonLabel: string;
  description: string;
  stars: Array<{ x: number; y: number; r: number; label?: string }>;
  lines: Array<[number, number]>;
}

const CONSTELLATIONS: ConstellationInfo[] = [
  {
    id: 'sagittarius',
    name: 'Стрелец',
    chapterHref: '#chapter-4',
    chapterButtonLabel: 'К главе 4 (Чёрная дыра)',
    description:
      'Именно в направлении созвездия Стрельца, на расстоянии 26 000 световых лет, скрывается центр нашей галактики и сверхмассивная чёрная дыра Стрелец A*.',
    stars: [
      { x: 60, y: 130, r: 3.5, label: 'Каус Австралис' },
      { x: 95, y: 95, r: 3.0 },
      { x: 120, y: 65, r: 2.8, label: 'Каус Бореалис' },
      { x: 165, y: 92, r: 3.2, label: 'Нунки' },
      { x: 150, y: 135, r: 2.8 },
      { x: 52, y: 82, r: 4.5, label: 'Центр Галактики' },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
      [1, 4],
    ],
  },
  {
    id: 'orion',
    name: 'Орион',
    chapterHref: '#chapter-3',
    chapterButtonLabel: 'К главе 3 (Млечный Путь)',
    description:
      'Солнечная система находится в спиральном Рукаве Ориона. На зимнем небе Орион легко узнать по трём ярким звёздам Пояса Ориона.',
    stars: [
      { x: 75, y: 45, r: 4.2, label: 'Бетельгейзе' },
      { x: 145, y: 52, r: 3.2, label: 'Беллатрикс' },
      { x: 98, y: 98, r: 2.8 },
      { x: 112, y: 95, r: 2.8, label: 'Пояс Ориона' },
      { x: 126, y: 92, r: 2.8 },
      { x: 82, y: 148, r: 3.0 },
      { x: 152, y: 142, r: 4.2, label: 'Ригель' },
    ],
    lines: [
      [0, 2],
      [1, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
      [0, 1],
      [5, 6],
    ],
  },
  {
    id: 'gemini',
    name: 'Близнецы',
    chapterHref: '#chapter-2',
    chapterButtonLabel: 'К главе 2 (Драма Плутона)',
    description:
      'Через Близнецы проходит видимый путь планет по небу, где Марс рисует свои петли. Здесь же в 1930 году Клайд Томбо открыл Плутон.',
    stars: [
      { x: 70, y: 45, r: 3.8, label: 'Кастор' },
      { x: 135, y: 55, r: 4.0, label: 'Поллукс' },
      { x: 82, y: 95, r: 2.6 },
      { x: 125, y: 105, r: 3.2, label: 'Точка открытия Плутона' },
      { x: 90, y: 145, r: 3.2, label: 'Альхена' },
      { x: 140, y: 150, r: 2.6 },
    ],
    lines: [
      [0, 1],
      [0, 2],
      [2, 4],
      [1, 3],
      [3, 5],
    ],
  },
];

export const FooterConstellations: React.FC<FooterConstellationsProps> = ({
  onOpenGlossary,
}) => {
  const [activeConstellation, setActiveConstellation] = useState<string>('sagittarius');
  const current =
    CONSTELLATIONS.find((c) => c.id === activeConstellation) || CONSTELLATIONS[0];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black py-10 sm:py-16 px-4 sm:px-8 pb-32 sm:pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Interactive Constellation Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#06060A] border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-6 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-mono-tech text-xs text-[var(--accent-primary)] flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>КАРТА СОЗВЕЗДИЙ</span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-[var(--text-parchment)] mt-0.5">
                Куда смотреть на куполе планетария
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-black border border-[var(--border-subtle)] rounded-xl">
              {CONSTELLATIONS.map((c) => {
                const active = c.id === activeConstellation;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveConstellation(c.id)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-lg font-mono-tech text-xs transition-all whitespace-nowrap active:scale-95 ${
                      active
                        ? 'bg-[var(--accent-primary)] text-black font-semibold shadow-[0_0_12px_rgba(212,163,115,0.5)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-parchment)]'
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 bg-black border border-[var(--border-subtle)] rounded-xl p-4 flex items-center justify-center">
              <svg
                viewBox="0 0 240 190"
                className="w-full max-w-[320px] h-auto"
                role="img"
                aria-label={`Схема созвездия ${current.name}`}
              >
                <circle
                  cx="120"
                  cy="95"
                  r="82"
                  fill="none"
                  stroke="rgba(212, 163, 115, 0.14)"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                />

                {current.lines.map(([fromIdx, toIdx], idx) => {
                  const s1 = current.stars[fromIdx];
                  const s2 = current.stars[toIdx];
                  return (
                    <line
                      key={idx}
                      x1={s1.x}
                      y1={s1.y}
                      x2={s2.x}
                      y2={s2.y}
                      stroke="var(--accent-primary)"
                      strokeWidth="1.2"
                      strokeOpacity="0.65"
                    />
                  );
                })}

                {current.stars.map((star, idx) => (
                  <g key={idx}>
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={star.r}
                      fill={
                        idx === current.stars.length - 1
                          ? 'var(--accent-secondary)'
                          : 'var(--text-parchment)'
                      }
                    />
                    {star.label && (
                      <text
                        x={star.x + 6}
                        y={star.y + 3}
                        fill="var(--text-muted)"
                        fontSize="8"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {star.label}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-display text-2xl font-semibold text-[var(--text-parchment)]">
                Созвездие {current.name}
              </h3>

              <p className="font-body text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
                {current.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href={current.chapterHref}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-black font-mono-tech text-xs font-semibold flex items-center justify-center"
                >
                  {current.chapterButtonLabel}
                </a>
                <button
                  type="button"
                  onClick={() => onOpenGlossary()}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] font-mono-tech text-xs text-[var(--text-parchment)] flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Открыть словарь</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Chapter Repeat Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-2.5"
        >
          <div className="font-mono-tech text-xs text-[var(--text-muted)]">
            БЫСТРЫЙ ПЕРЕХОД ПО ГЛАВАМ:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { href: '#chapter-1', step: 'Глава 1', title: 'Орбиты и петли Марса' },
              { href: '#chapter-2', step: 'Глава 2', title: 'Правила планет и Плутон' },
              { href: '#chapter-3', step: 'Глава 3', title: 'Масштаб и Млечный Путь' },
              { href: '#chapter-4', step: 'Глава 4', title: 'Чёрная дыра и время' },
            ].map((nav) => (
              <a
                key={nav.href}
                href={nav.href}
                className="p-3.5 rounded-xl bg-[#06060A] border border-[var(--border-subtle)] flex flex-col justify-between gap-1 hover:border-[var(--accent-primary)]/60 active:scale-95 transition-all"
              >
                <span className="font-mono-tech text-xs text-[var(--accent-primary)]">
                  {nav.step}
                </span>
                <span className="font-display text-sm sm:text-base font-medium text-[var(--text-parchment)]">
                  {nav.title}
                </span>
              </a>
            ))}
          </div>
        </motion.div>

        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4 font-mono-tech text-xs text-[var(--text-muted)]">
          <span>Эфир и Сингулярность · Путеводитель планетария</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="min-h-[40px] px-3.5 py-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-parchment)] flex items-center gap-1.5 hover:border-[var(--accent-primary)] active:scale-95 transition-all"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Наверх</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
