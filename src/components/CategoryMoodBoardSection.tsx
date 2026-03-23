import React, { useEffect, useMemo, useState } from 'react';
import type { EntryCategoryDeck, EntryCategoryItem, ProductVariant } from '../data/mockData';
import { SelectionBoardMiniTile } from './SelectionBoardMiniTile';
import { SectionProductDetailPanel } from './SectionProductDetailPanel';

interface CategoryMoodBoardSectionProps {
  activeCategory: EntryCategoryDeck;
  selectedItemId: string;
  onSelectItem: (item: EntryCategoryItem) => void;
  activeProduct: ProductVariant;
  navigate: (path: string) => void;
}

export function CategoryMoodBoardSection({
  activeCategory,
  selectedItemId,
  onSelectItem,
  activeProduct,
  navigate,
}: CategoryMoodBoardSectionProps) {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const isDetailOpen = expandedItemId !== null;
  const sectionMinHeight = isDetailOpen
    ? 'min-h-[40rem] md:min-h-[41rem] lg:min-h-[41rem]'
    : 'min-h-[42rem] md:min-h-[43rem] lg:min-h-[42rem]';

  useEffect(() => {
    if (!expandedItemId) return;

    const hasExpandedItem = activeCategory.columns
      .flatMap((column) => column.items)
      .some((item) => item.id === expandedItemId);

    if (!hasExpandedItem) {
      setExpandedItemId(null);
    }
  }, [activeCategory, expandedItemId]);

  const handleItemSelect = (item: EntryCategoryItem) => {
    onSelectItem(item);

    if (item.linkedProductId) {
      setExpandedItemId(item.id);
    }
  };

  const footerCopy = useMemo(() => {
    if (activeCategory.id === 'clay-bricks') {
      return 'Select a clay brick to open the product view, gallery, quantity, and order draft handoff.';
    }

    return 'Select a cladding finish to open the product view, gallery, quantity, and order draft handoff.';
  }, [activeCategory.id]);

  return (
    <section
      id="entry-layout"
      data-section="moodboard"
      className="slide-shell story-section pointer-events-none"
    >
      <div className="slide-frame overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0))]" />

        <div
          data-motion="up"
          className={`relative z-20 mx-auto flex flex-col items-center text-center transition-all duration-500 ${
            isDetailOpen ? 'max-w-[28rem]' : 'max-w-[38rem]'
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e] md:text-xs">
            {activeCategory.sectionEyebrow}
          </p>
          <h2
            className={`mt-5 font-['Anton'] uppercase leading-[0.92] tracking-[0.06em] text-white transition-all duration-500 ${
              isDetailOpen
                ? 'text-[clamp(0.92rem,1.45vw,1.22rem)] leading-[0.98] tracking-[0.035em]'
                : 'text-[clamp(2.2rem,5vw,4rem)]'
            }`}
          >
            {activeCategory.sectionTitle}
          </h2>
          <div
            className={`h-px bg-white/10 transition-all duration-500 ${
              isDetailOpen ? 'mt-3 w-[min(66vw,700px)]' : 'mt-5 w-[min(76vw,860px)]'
            }`}
          />
        </div>

        <div className={`relative z-20 mx-auto w-full max-w-[76rem] ${sectionMinHeight} ${isDetailOpen ? 'mt-2 md:mt-3' : 'mt-12'}`}>
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              isDetailOpen
                ? 'pointer-events-none translate-y-[-0.35rem] opacity-0 blur-[4px]'
                : 'pointer-events-auto translate-y-0 opacity-100 blur-0'
            }`}
          >
            <div
              data-motion="up"
              className={`mx-auto grid w-full gap-8 ${
                activeCategory.columns.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
              }`}
            >
              {activeCategory.columns.map((column, columnIndex) => (
                <div
                  key={column.id}
                  className={`px-5 py-2 md:px-7 ${
                    columnIndex > 0 ? 'md:border-l md:border-white/8' : ''
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[1.35rem] font-semibold tracking-tight text-white md:text-[1.55rem]">
                      {column.label}
                    </h3>
                    <span className="text-[9px] uppercase tracking-[0.26em] text-white/34">{column.accent}</span>
                  </div>
                  <div className="mt-4 h-px w-full bg-white/10" />

                  <div className="mt-6 space-y-1">
                    {column.items.map((item) => {
                      const isActive = selectedItemId === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleItemSelect(item)}
                          className={`pointer-events-auto flex w-full items-center gap-5 rounded-[1.3rem] px-2 py-4 text-left transition-all duration-300 ${
                            isActive
                              ? 'bg-[#22c55e]/[0.05] shadow-[0_10px_30px_rgba(0,0,0,0.14)]'
                              : 'hover:bg-white/[0.03]'
                          }`}
                        >
                          <div
                            className={`relative h-[6.2rem] w-[12.4rem] shrink-0 overflow-hidden rounded-[1.15rem] ${
                              isActive ? 'bg-[#22c55e]/[0.03]' : 'bg-white/[0.015]'
                            }`}
                          >
                            <SelectionBoardMiniTile
                              faceImage={item.objectMode === 'brick' ? undefined : item.image}
                              palette={item.scenePalette}
                              objectMode={item.objectMode ?? (activeCategory.objectMode === 'brick' ? 'brick' : 'tile')}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.08))]" />
                          </div>

                          <div className="min-w-0 flex-1 border-b border-white/8 pb-4">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-[1.02rem] font-semibold text-white md:text-[1.08rem]">
                                {item.name}
                              </p>
                              {item.live && <span className="h-2 w-2 shrink-0 rounded-full bg-[#22c55e]" />}
                            </div>
                            <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-white/40">
                              {item.live ? 'Open product detail' : 'Range preview'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div data-motion="up" className="mx-auto mt-10 flex w-full max-w-[72rem] items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/34">
                {footerCopy}
              </p>
              <div className="hidden h-px w-[22%] bg-white/10 md:block" />
            </div>
          </div>

          <div
            className={`absolute inset-x-0 top-0 flex items-start justify-center pb-14 md:pb-16 transition-all duration-500 ${
              isDetailOpen
                ? 'pointer-events-auto translate-y-0 opacity-100 blur-0'
                : 'pointer-events-none translate-y-5 opacity-0 blur-[8px]'
            }`}
          >
            {isDetailOpen ? (
              <SectionProductDetailPanel
                product={activeProduct}
                onBack={() => setExpandedItemId(null)}
                navigate={navigate}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
