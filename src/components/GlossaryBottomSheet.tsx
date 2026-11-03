import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GLOSSARY_TERMS, GlossaryCategory, GlossaryTerm } from '../data/atlasData';
import {
  Search,
  X,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ChevronsUpDown,
  Compass,
  Orbit,
  Disc,
  ArrowUpRight,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface GlossaryBottomSheetProps {
  isOpen: boolean;
  initialTermId?: string;
  onClose: () => void;
  onSelectChapterWindow?: (index: number) => void;
}

const CATEGORIES: Array<{ id: GlossaryCategory; label: string; icon: string }> = [
  { id: 'all', label: 'Все', icon: '✨' },
  { id: 'etymology', label: 'Этимология', icon: '🏛️' },
  { id: 'mechanics', label: 'Орбиты и планеты', icon: '🪐' },
  { id: 'galaxies', label: 'Галактики и звёзды', icon: '🌌' },
  { id: 'relativity', label: 'Чёрные дыры и ОТО', icon: '🌀' },
];

export const GlossaryBottomSheet: React.FC<GlossaryBottomSheetProps> = ({
  isOpen,
  initialTermId,
  onClose,
  onSelectChapterWindow,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory>('all');
  const [highlightedId, setHighlightedId] = useState<string | undefined>(initialTermId);
  const [expandedTermIds, setExpandedTermIds] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollCategories = (dir: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: dir === 'left' ? -160 : 160,
        behavior: 'smooth',
      });
    }
  };

  // Auto-expand and scroll to term when opened with initialTermId
  useEffect(() => {
    if (isOpen && initialTermId) {
      setHighlightedId(initialTermId);
      setActiveCategory('all');
      setSearchQuery('');
      setExpandedTermIds((prev) => new Set([...prev, initialTermId]));

      window.setTimeout(() => {
        const el = document.getElementById(`glossary-term-${initialTermId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 160);
    }
  }, [isOpen, initialTermId]);

  const filteredTerms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((term) => {
      if (activeCategory !== 'all' && term.category !== activeCategory) {
        return false;
      }
      if (!q) return true;
      return (
        term.title.toLowerCase().includes(q) ||
        term.definition.toLowerCase().includes(q) ||
        (term.etymology && term.etymology.toLowerCase().includes(q)) ||
        (term.historicalSense && term.historicalSense.toLowerCase().includes(q)) ||
        term.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: GLOSSARY_TERMS.length };
    CATEGORIES.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = GLOSSARY_TERMS.filter((t) => t.category === cat.id).length;
      }
    });
    return counts;
  }, []);

  const toggleTerm = (termId: string) => {
    setExpandedTermIds((prev) => {
      const next = new Set(prev);
      if (next.has(termId)) {
        next.delete(termId);
      } else {
        next.add(termId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedTermIds(new Set(filteredTerms.map((t) => t.id)));
  };

  const handleCollapseAll = () => {
    setExpandedTermIds(new Set());
  };

  const handleJumpToChapter = (term: GlossaryTerm) => {
    onClose();
    if (term.chapterIndex !== undefined && onSelectChapterWindow) {
      onSelectChapterWindow(term.chapterIndex);
    } else {
      const target = document.querySelector(term.chapterLink);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'etymology':
        return '🏛️';
      case 'mechanics':
        return '🪐';
      case 'galaxies':
        return '🌌';
      case 'relativity':
        return '🌀';
      default:
        return '✨';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="glossary-sheet-title"
        >
          {/* Backdrop Click Dismiss */}
          <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

          {/* Bottom Sheet Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.8 }}
            className="relative z-10 w-full max-w-4xl bg-[#07070D] border-t border-x border-[var(--border-subtle)] rounded-t-3xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden shadow-[0_-20px_60px_rgba(0,0,0,0.95)]"
          >
            {/* Sticky Header: Drag Handle, Title & Action */}
            <div className="px-3.5 sm:px-6 pt-2.5 pb-3 border-b border-[var(--border-subtle)] bg-[#0A0A14] space-y-2.5 shrink-0">
              {/* Drag Pill */}
              <div className="w-12 h-1.5 bg-[var(--accent-primary)]/40 rounded-full mx-auto" />

              {/* Titlebar Row */}
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-primary)] shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2
                        id="glossary-sheet-title"
                        className="font-display text-base sm:text-xl font-bold text-[var(--text-parchment)] truncate"
                      >
                        Словарь понятий
                      </h2>
                      <span className="font-mono-tech text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 shrink-0 font-semibold">
                        {GLOSSARY_TERMS.length} терминов
                      </span>
                    </div>
                    <p className="font-mono-tech text-[10px] text-[var(--text-muted)] truncate hidden xs:block">
                      Нажмите на любой термин, чтобы раскрыть подробную карточку
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[38px] min-w-[38px] sm:min-h-[42px] sm:min-w-[42px] rounded-xl border border-[var(--border-subtle)] bg-[#12121E] hover:border-[var(--accent-primary)]/50 flex items-center justify-center text-[var(--text-parchment)] active:scale-95 transition-all cursor-pointer shrink-0"
                  aria-label="Закрыть словарь"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 sm:text-inherit" />
                </button>
              </div>

              {/* Search Bar & Clear Button */}
              <div className="relative">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по терминам (планета, эпицикл, сингулярность, эфир)..."
                  className="w-full min-h-[40px] pl-10 pr-9 py-2 rounded-xl bg-[#06060B] border border-[var(--border-subtle)] font-mono-tech text-xs sm:text-sm text-[var(--text-parchment)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300"
                    title="Очистить поиск"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills (Mobile-friendly horizontal scroll with visible track and arrow buttons) */}
              <div className="relative flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCategories('left')}
                  className="w-7 h-8 rounded-lg bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer"
                  title="Прокрутить категории влево"
                  aria-label="Влево"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div
                  ref={categoryScrollRef}
                  className="flex-1 flex items-center gap-1.5 custom-scrollbar-x py-1 px-0.5"
                >
                  {CATEGORIES.map((cat) => {
                    const active = activeCategory === cat.id;
                    const count = categoryCounts[cat.id] || 0;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`min-h-[32px] px-2.5 py-1 rounded-xl font-mono-tech text-[11px] sm:text-xs transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                          active
                            ? 'bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] font-bold shadow-sm'
                            : 'bg-[#0E0E18] text-[var(--text-muted)] hover:text-[var(--text-parchment)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                            active ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => scrollCategories('right')}
                  className="w-7 h-8 rounded-lg bg-[#12121E] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white flex items-center justify-center shrink-0 active:scale-90 transition-all cursor-pointer"
                  title="Прокрутить категории вправо"
                  aria-label="Вправо"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Utility Sub-Bar: Result Count & Expand/Collapse All */}
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-[var(--text-muted)] pt-0.5">
                <span>
                  Найдено:{' '}
                  <strong className="text-[var(--accent-primary)]">{filteredTerms.length}</strong>
                  {filteredTerms.length !== GLOSSARY_TERMS.length && (
                    <span className="text-zinc-500"> из {GLOSSARY_TERMS.length}</span>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  {expandedTermIds.size < filteredTerms.length ? (
                    <button
                      type="button"
                      onClick={handleExpandAll}
                      className="text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronsUpDown className="w-3 h-3" />
                      <span>Раскрыть все ({filteredTerms.length})</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCollapseAll}
                      className="text-zinc-400 hover:text-[var(--text-parchment)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronDown className="w-3 h-3" />
                      <span>Свернуть все</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Terms Content List (Expandable Cards Dossier) */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3.5 space-y-2.5">
              {filteredTerms.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-[var(--border-subtle)] flex items-center justify-center mx-auto text-2xl">
                    🔭
                  </div>
                  <p className="font-display text-base font-semibold text-[var(--text-parchment)]">
                    Термин не найден
                  </p>
                  <p className="font-mono-tech text-xs text-[var(--text-muted)] max-w-xs mx-auto">
                    Попробуйте изменить запрос или переключить категорию
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-black font-mono-tech text-xs font-semibold active:scale-95 transition-transform cursor-pointer shadow-md"
                  >
                    Показать все термины ({GLOSSARY_TERMS.length})
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredTerms.map((term) => {
                    const isExpanded = expandedTermIds.has(term.id);
                    const isHighlighted = highlightedId === term.id;
                    const catIcon = getCategoryIcon(term.category);

                    return (
                      <article
                        key={term.id}
                        id={`glossary-term-${term.id}`}
                        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                          isHighlighted
                            ? 'bg-[#120F08] border-[var(--accent-primary)] shadow-[0_0_20px_rgba(212,163,115,0.25)]'
                            : isExpanded
                            ? 'bg-[#0A0A13] border-[var(--accent-primary)]/50 shadow-lg'
                            : 'bg-[#090910] hover:bg-[#0D0D18] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40'
                        }`}
                      >
                        {/* Interactive Clickable Header Row: Click to Expand / Collapse */}
                        <div
                          onClick={() => toggleTerm(term.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleTerm(term.id);
                            }
                          }}
                          className="w-full text-left p-3 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                          aria-expanded={isExpanded}
                          aria-controls={`glossary-desc-${term.id}`}
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                            {/* Category Icon Badge */}
                            <div
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 text-base sm:text-lg border ${
                                isExpanded
                                  ? 'bg-[var(--accent-primary)]/20 border-[var(--accent-primary)]/60 text-[var(--accent-primary)]'
                                  : 'bg-[#12121E] border-[var(--border-subtle)]'
                              }`}
                            >
                              <span>{catIcon}</span>
                            </div>

                            {/* Title & Preview Subtitle */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-display text-sm sm:text-base font-bold text-[var(--text-parchment)] leading-tight">
                                  {term.title}
                                </h3>
                                <span className="font-mono-tech text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-[var(--border-subtle)] text-[var(--text-muted)]">
                                  {term.categoryLabel}
                                </span>
                              </div>

                              {/* Preview text when collapsed */}
                              {!isExpanded && (
                                <p className="font-body text-xs text-[var(--text-muted)] truncate max-w-[240px] xs:max-w-sm sm:max-w-lg mt-0.5">
                                  {term.definition}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right Action: Expand Chevron & Status Pill */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="hidden sm:inline-block font-mono-tech text-[10px] text-[var(--text-muted)] px-2 py-0.5 rounded-lg bg-black/40 border border-[var(--border-subtle)]">
                              {isExpanded ? 'Свернуть' : 'Подробнее'}
                            </span>
                            <div
                              className={`w-7 h-7 rounded-lg border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] transition-transform duration-200 ${
                                isExpanded
                                  ? 'rotate-180 bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border-[var(--accent-primary)]/40'
                                  : 'bg-[#12121E]'
                              }`}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Expandable Rich Dossier Card */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              id={`glossary-desc-${term.id}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden border-t border-[var(--border-subtle)]/70 bg-[#06060B]"
                            >
                              <div className="p-3.5 sm:p-5 space-y-3.5">
                                {/* 1. Etymology / Linguistic Root */}
                                {term.etymology && (
                                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#12100A] border-l-2 border-[var(--accent-primary)] border-t border-r border-b border-[var(--border-subtle)] space-y-1">
                                    <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[var(--accent-primary)] font-bold flex items-center gap-1.5">
                                      <span>🏛️</span>
                                      <span>Этимология и происхождение названия</span>
                                    </div>
                                    <p className="font-body text-xs sm:text-sm italic text-[var(--accent-primary)] leading-relaxed">
                                      {term.etymology}
                                    </p>
                                  </div>
                                )}

                                {/* 2. Main Definition / Simple Explanation */}
                                <div className="space-y-1.5">
                                  <div className="font-mono-tech text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                                    <span>💡</span>
                                    <span>Что это такое простыми словами</span>
                                  </div>
                                  <p className="font-body text-sm sm:text-base text-[var(--text-parchment)] leading-relaxed">
                                    {term.definition}
                                  </p>
                                </div>

                                {/* 3. Historical View / Ancient Sense */}
                                {term.historicalSense && (
                                  <div className="p-3 rounded-xl bg-[#0B0B14] border border-[var(--border-subtle)] space-y-1">
                                    <div className="font-mono-tech text-[10px] uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                                      <span>📜</span>
                                      <span>В истории астрономии</span>
                                    </div>
                                    <p className="font-body text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                                      {term.historicalSense}
                                    </p>
                                  </div>
                                )}

                                {/* 4. Formula or Key Physical Metric */}
                                {term.formulaOrMetric && (
                                  <div className="p-3 rounded-xl bg-[#090D18] border border-cyan-800/40 space-y-1">
                                    <div className="font-mono-tech text-[10px] uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                                      <span>📐</span>
                                      <span>Формула / Математический закон</span>
                                    </div>
                                    <div className="font-mono-tech text-xs sm:text-sm text-cyan-200 font-bold bg-black/60 px-3 py-1.5 rounded-lg border border-cyan-500/20 inline-block">
                                      {term.formulaOrMetric}
                                    </div>
                                  </div>
                                )}

                                {/* 5. Footer Actions: Jump to Chapter & Collapse Card */}
                                <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => handleJumpToChapter(term)}
                                    className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-[var(--accent-primary)]/15 hover:bg-[var(--accent-primary)]/25 text-[var(--accent-primary)] border border-[var(--accent-primary)]/40 font-mono-tech text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer font-semibold"
                                  >
                                    <span>🔭</span>
                                    <span>Смотреть в главе</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => toggleTerm(term.id)}
                                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-parchment)] font-mono-tech text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                                    <span>Свернуть карточку</span>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
