import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavigationBar } from './NavigationBar';
import { BrandIntroSection } from './BrandIntroSection';
import { CategoryMoodBoardSection } from './CategoryMoodBoardSection';
import { HeroSection } from './HeroSection';
import { MaterialStorySection } from './MaterialStorySection';
import { DetailStorySection } from './DetailStorySection';
import { TechnicalSection } from './TechnicalSection';
import { ShowcaseSection } from './ShowcaseSection';
import { VisualLabSection } from './VisualLabSection';
import { UploadPreviewPage } from './UploadPreviewPage';
import { OrderPortalPage } from './OrderPortalPage';
import { ProductScene } from './ProductScene';
import { RelatedProductsSection } from './RelatedProductsSection';
import { CartDrawer } from './CartDrawer';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProductCatalog } from './ProductCatalogContext';
import { createBrickBackdropDataUrl, preloadImageAsset } from '../utils/textureGenerator';
import {
  defaultEntryCategoryId,
  entryCategoryDecks,
  type EntryCategoryId,
  type EntryCategoryItem,
} from '../data/mockData';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_STAGE_BACKDROP_PRESENTATION = {
  objectPosition: '50% 50%',
  scale: 1.018,
  opacity: 0.72,
  blur: 2.6,
  brightness: 0.78,
  saturate: 1,
  contrast: 1.06,
};

interface StageBackdropLayer {
  url: string;
  presentation: typeof DEFAULT_STAGE_BACKDROP_PRESENTATION;
}

interface MainLayoutProps {
  pathname: string;
  navigate: (path: string) => void;
}

export function MainLayout({ pathname, navigate }: MainLayoutProps) {
  const isCustomizeRoute = pathname === '/customize';
  const isUploadPreviewRoute = pathname === '/upload-preview';
  const isOrderPortalRoute = pathname === '/order-portal';
  const isStandaloneRoute = isCustomizeRoute || isUploadPreviewRoute || isOrderPortalRoute;
  const { activeProduct, isCartOpen, setActiveProductId } = useProductCatalog();
  const [entryCategoryId, setEntryCategoryId] = useState<EntryCategoryId>(defaultEntryCategoryId);
  const [selectedEntryItemIds, setSelectedEntryItemIds] = useState<Record<EntryCategoryId, string>>(() => {
    return entryCategoryDecks.reduce((accumulator, category) => {
      accumulator[category.id] = category.columns[0]?.items[0]?.id ?? '';
      return accumulator;
    }, {} as Record<EntryCategoryId, string>);
  });
  const [stageBackdropBase, setStageBackdropBase] = useState<StageBackdropLayer | null>(null);
  const [stageBackdropTransition, setStageBackdropTransition] = useState<StageBackdropLayer | null>(null);
  const stageBackdropBaseRef = useRef<HTMLDivElement>(null);
  const stageBackdropTransitionRef = useRef<HTMLDivElement>(null);
  const committedBackdropRef = useRef<StageBackdropLayer | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const isCartOpenRef = useRef(isCartOpen);
  const entryCategorySwitchTimeoutRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
  const activeEntryCategory = useMemo(() => {
    return entryCategoryDecks.find((category) => category.id === entryCategoryId) ?? entryCategoryDecks[0];
  }, [entryCategoryId]);
  const selectedEntryItemId = selectedEntryItemIds[activeEntryCategory.id];
  const getSelectedEntryItem = useCallback((categoryId: EntryCategoryId) => {
    const category = entryCategoryDecks.find((deck) => deck.id === categoryId);
    if (!category) return null;

    const selectedItemId = selectedEntryItemIds[categoryId];
    const selectedItem = category.columns.flatMap((column) => column.items).find((item) => item.id === selectedItemId);

    return selectedItem ?? category.columns[0]?.items[0] ?? null;
  }, [selectedEntryItemIds]);
  const finishBackdrop = useMemo<StageBackdropLayer | null>(() => {
    if (isStandaloneRoute) return null;

    return {
      url: activeProduct.finishAssets.backdropImage || createBrickBackdropDataUrl(activeProduct.scenePalette),
      presentation: {
        ...DEFAULT_STAGE_BACKDROP_PRESENTATION,
        ...activeProduct.finishAssets.backdropPresentation,
      },
    };
  }, [activeProduct, isStandaloneRoute]);

  const baseBackdropImageStyle = useMemo(() => {
    if (!stageBackdropBase) return undefined;

    const { presentation } = stageBackdropBase;
    return {
      objectPosition: presentation.objectPosition,
      transform: `scale(${presentation.scale})`,
      opacity: presentation.opacity,
      filter: `blur(${presentation.blur}px) saturate(${presentation.saturate}) brightness(${presentation.brightness}) contrast(${presentation.contrast})`,
    };
  }, [stageBackdropBase]);

  const transitionBackdropImageStyle = useMemo(() => {
    if (!stageBackdropTransition) return undefined;

    const { presentation } = stageBackdropTransition;
    return {
      objectPosition: presentation.objectPosition,
      transform: `scale(${presentation.scale})`,
      opacity: presentation.opacity,
      filter: `blur(${presentation.blur}px) saturate(${presentation.saturate}) brightness(${presentation.brightness}) contrast(${presentation.contrast})`,
    };
  }, [stageBackdropTransition]);

  const handleReturnToHero = useCallback(() => {
    if (isStandaloneRoute) {
      navigate('/');
      return;
    }

    const heroSection = document.getElementById('brand-intro') ?? document.getElementById('hero');
    const lenis = lenisRef.current;

    if (heroSection && lenis) {
      lenis.scrollTo(heroSection, {
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        force: true,
        lock: true,
      });
      return;
    }

    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    navigate('/#hero');
  }, [isStandaloneRoute, navigate]);

  const activateEntryCategory = useCallback((categoryId: EntryCategoryId) => {
    if (entryCategorySwitchTimeoutRef.current) {
      globalThis.clearTimeout(entryCategorySwitchTimeoutRef.current);
      entryCategorySwitchTimeoutRef.current = null;
    }

    setEntryCategoryId(categoryId);

    const selectedItem = getSelectedEntryItem(categoryId);
    if (selectedItem?.linkedProductId) {
      entryCategorySwitchTimeoutRef.current = globalThis.setTimeout(() => {
        setActiveProductId(selectedItem.linkedProductId);
        entryCategorySwitchTimeoutRef.current = null;
      }, 140);
    }
  }, [getSelectedEntryItem, setActiveProductId]);

  const handleSelectEntryCategory = useCallback((categoryId: EntryCategoryId) => {
    activateEntryCategory(categoryId);
  }, [activateEntryCategory]);

  const handleCycleEntryCategory = useCallback((direction: 1 | -1) => {
    const currentIndex = entryCategoryDecks.findIndex((category) => category.id === entryCategoryId);
    const nextIndex = (currentIndex + direction + entryCategoryDecks.length) % entryCategoryDecks.length;
    const nextCategory = entryCategoryDecks[nextIndex];

    if (!nextCategory) return;
    activateEntryCategory(nextCategory.id);
  }, [activateEntryCategory, entryCategoryId]);

  const handleSelectEntryItem = useCallback(
    (item: EntryCategoryItem) => {
      setSelectedEntryItemIds((current) => ({
        ...current,
        [entryCategoryId]: item.id,
      }));

      if (item.linkedProductId) {
        setActiveProductId(item.linkedProductId);
      }
    },
    [entryCategoryId, setActiveProductId]
  );

  useEffect(() => {
    const matchingCategory = entryCategoryDecks.find((category) => {
      return category.columns.flatMap((column) => column.items).some((item) => item.linkedProductId === activeProduct.id);
    });

    if (!matchingCategory) return;

    const matchingItem = matchingCategory.columns
      .flatMap((column) => column.items)
      .find((item) => item.linkedProductId === activeProduct.id);

    if (!matchingItem) return;

    setEntryCategoryId((currentCategoryId) => (
      currentCategoryId === matchingCategory.id ? currentCategoryId : matchingCategory.id
    ));

    setSelectedEntryItemIds((current) => (
      current[matchingCategory.id] === matchingItem.id
        ? current
        : { ...current, [matchingCategory.id]: matchingItem.id }
    ));
  }, [activeProduct.id]);

  useEffect(() => {
    return () => {
      if (entryCategorySwitchTimeoutRef.current) {
        globalThis.clearTimeout(entryCategorySwitchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isStandaloneRoute || !finishBackdrop) {
      committedBackdropRef.current = null;
      setStageBackdropBase(null);
      setStageBackdropTransition(null);
      return;
    }

    if (!committedBackdropRef.current) {
      committedBackdropRef.current = finishBackdrop;
      setStageBackdropBase(finishBackdrop);
      setStageBackdropTransition(null);
      return;
    }

    if (finishBackdrop.url === committedBackdropRef.current.url) {
      committedBackdropRef.current = finishBackdrop;
      setStageBackdropBase(finishBackdrop);
      setStageBackdropTransition(null);
      return;
    }

    let isCancelled = false;

    preloadImageAsset(finishBackdrop.url)
      .catch(() => null)
      .then(() => {
        if (isCancelled) return;
        setStageBackdropTransition(finishBackdrop);
      });

    return () => {
      isCancelled = true;
    };
  }, [finishBackdrop, isStandaloneRoute]);

  useEffect(() => {
    if (
      isStandaloneRoute ||
      !stageBackdropBaseRef.current ||
      !stageBackdropTransitionRef.current
    ) {
      return;
    }

    const baseNode = stageBackdropBaseRef.current;
    const transitionNode = stageBackdropTransitionRef.current;

    gsap.killTweensOf([baseNode, transitionNode]);

    if (!stageBackdropTransition) {
      gsap.set(baseNode, { opacity: 1 });
      gsap.set(transitionNode, { opacity: 0 });
      return;
    }

    gsap.set(baseNode, { opacity: 1 });
    gsap.set(transitionNode, { opacity: 0 });

    const transitionTimeline = gsap.timeline({
      onComplete: () => {
        committedBackdropRef.current = stageBackdropTransition;
        setStageBackdropBase(stageBackdropTransition);
        setStageBackdropTransition(null);
      },
    });

    transitionTimeline
      .to(
        baseNode,
        {
          opacity: 0.14,
          duration: 0.24,
          ease: 'power1.inOut',
        },
        0
      )
      .to(
        transitionNode,
        {
          opacity: 1,
          duration: 0.52,
          ease: 'power2.out',
        },
        0.06
      )
      .to(
        baseNode,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.out',
        },
        0.22
      );

    return () => {
      transitionTimeline.kill();
    };
  }, [isStandaloneRoute, stageBackdropTransition]);

  useEffect(() => {
    isCartOpenRef.current = isCartOpen;

    if (!lenisRef.current) return;

    if (isCartOpen) {
      lenisRef.current.stop();
      return;
    }

    lenisRef.current.start();
  }, [isCartOpen]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    let sectionLockTimeout: number | null = null;
    let isSectionTransitioning = false;

    if (isCartOpenRef.current) {
      lenis.stop();
    }

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };

    const onRefresh = () => {
      lenis.resize();
    };

    const getHomepageSections = () =>
      Array.from(document.querySelectorAll<HTMLElement>('#homepage-slides > section'));

    const clearSectionLock = () => {
      isSectionTransitioning = false;
      if (sectionLockTimeout !== null) {
        window.clearTimeout(sectionLockTimeout);
        sectionLockTimeout = null;
      }
    };

    const getClosestSectionIndex = (sections: HTMLElement[]) => {
      const viewportCenter = window.innerHeight * 0.5;

      return sections.reduce((closestIndex, section, index) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height * 0.5 - viewportCenter);
        const currentClosestDistance = Math.abs(
          sections[closestIndex].getBoundingClientRect().top +
            sections[closestIndex].getBoundingClientRect().height * 0.5 -
            viewportCenter
        );

        return distance < currentClosestDistance ? index : closestIndex;
      }, 0);
    };

    const scrollToSection = (index: number) => {
      const sections = getHomepageSections();
      const target = sections[index];

      if (!target) return;

      isSectionTransitioning = true;
      sectionLockTimeout = window.setTimeout(clearSectionLock, 1050);

      lenis.scrollTo(target, {
        duration: 0.95,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        force: true,
        lock: true,
        onComplete: clearSectionLock,
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (isStandaloneRoute || !desktopQuery.matches || isCartOpenRef.current) return;
      if (Math.abs(event.deltaY) < 18 || event.ctrlKey || event.metaKey) return;

      const sections = getHomepageSections();
      if (!sections.length) return;

      if (isSectionTransitioning) {
        event.preventDefault();
        return;
      }

      const currentIndex = getClosestSectionIndex(sections);
      const targetIndex =
        event.deltaY > 0
          ? Math.min(currentIndex + 1, sections.length - 1)
          : Math.max(currentIndex - 1, 0);

      if (targetIndex === currentIndex) return;

      event.preventDefault();
      scrollToSection(targetIndex);
    };

    lenis.on('scroll', onLenisScroll);
    ScrollTrigger.addEventListener('refresh', onRefresh);
    window.addEventListener('wheel', onWheel, { passive: false });

    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', onLenisScroll);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      window.removeEventListener('wheel', onWheel);
      clearSectionLock();
      lenis.destroy();
      if (lenisRef.current === lenis) {
        lenisRef.current = null;
      }
    };
  }, [pathname, isStandaloneRoute]);

  useEffect(() => {
    if (isStandaloneRoute) return;

    const heroWord = document.querySelector<HTMLElement>('#hero [data-hero-word]');
    const heroItems = gsap.utils.toArray<HTMLElement>('#hero [data-hero-motion]');
    if (!heroWord && !heroItems.length) return;

    const motionMap: Record<string, { x: number; y: number }> = {
      left: { x: -44, y: 0 },
      right: { x: 44, y: 0 },
      up: { x: 0, y: 30 },
      down: { x: 0, y: -30 },
    };

    const heroTimeline = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      },
    });

    if (heroWord) {
      heroTimeline.fromTo(
        heroWord,
        {
          autoAlpha: 0.12,
          y: 28,
          scale: 0.955,
          filter: 'blur(10px)',
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.78,
        },
        0
      );
    }

    heroItems.forEach((item, index) => {
      const key = item.dataset.heroMotion ?? 'up';
      const entry = motionMap[key] ?? motionMap.up;

      heroTimeline.fromTo(
        item,
        {
          autoAlpha: 0,
          x: entry.x,
          y: entry.y,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.62,
          clearProps: 'transform',
        },
        0.1 + index * 0.08
      );
    });

    return () => {
      heroTimeline.kill();
    };
  }, [activeProduct.id, isStandaloneRoute]);

  useEffect(() => {
    if (isStandaloneRoute) return;

    const motionMap: Record<string, { x: number; y: number }> = {
      left: { x: -56, y: 0 },
      right: { x: 56, y: 0 },
      up: { x: 0, y: 42 },
      down: { x: 0, y: -42 },
    };

    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('#homepage-slides > section[data-section]');

      sections.forEach((section) => {
        const items = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('[data-motion]'));
        if (!items.length) return;

        items.forEach((item) => {
          const key = item.dataset.motion ?? 'up';
          const entry = motionMap[key] ?? motionMap.up;
          gsap.set(item, { autoAlpha: 0, x: entry.x, y: entry.y });
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            end: 'bottom 28%',
            scrub: 0.55,
          },
        });

        items.forEach((item, index) => {
          const key = item.dataset.motion ?? 'up';
          const entry = motionMap[key] ?? motionMap.up;
          const exitX = entry.x === 0 ? 0 : -entry.x * 0.36;
          const exitY = entry.y === 0 ? 0 : -entry.y * 0.36;

          timeline
            .to(
              item,
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.18,
                ease: 'none',
              },
              0.08 + index * 0.06
            )
            .to(
              item,
              {
                autoAlpha: 0,
                x: exitX,
                y: exitY,
                duration: 0.16,
                ease: 'none',
              },
              0.7 + index * 0.04
            );
        });
      });
    }, document.getElementById('homepage-slides') ?? undefined);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      context.revert();
    };
  }, [isStandaloneRoute]);

  return (
    <div
      id="main-container"
      className={`min-h-screen font-sans text-white selection:bg-[#22c55e] selection:text-white ${
        isStandaloneRoute
          ? 'bg-[#0a0a0a]'
          : 'bg-[#090909]'
      }`}
    >
      {!isStandaloneRoute && (
        <div className="homepage-backdrop">
          <div ref={stageBackdropBaseRef} className="homepage-backdrop-layer">
            {stageBackdropBase && (
              <img
                className="homepage-backdrop-image"
                src={stageBackdropBase.url}
                alt=""
                aria-hidden="true"
                decoding="async"
                loading="eager"
                style={baseBackdropImageStyle}
              />
            )}
          </div>
          <div ref={stageBackdropTransitionRef} className="homepage-backdrop-layer homepage-backdrop-layer--transition">
            {stageBackdropTransition && (
              <img
                className="homepage-backdrop-image"
                src={stageBackdropTransition.url}
                alt=""
                aria-hidden="true"
                decoding="async"
                loading="eager"
                style={transitionBackdropImageStyle}
              />
            )}
          </div>
          <div className="homepage-backdrop-vignette" />
        </div>
      )}
      {!isStandaloneRoute && (
        <div className="homepage-stage">
          <div className="homepage-stage-vignette" />
        </div>
      )}
      {!isUploadPreviewRoute && (
        <ProductScene
          isCustomizeRoute={isCustomizeRoute}
          introObjectMode={activeEntryCategory.objectMode}
        />
      )}
      <CartDrawer />
      
      {isCustomizeRoute ? (
        <main className="relative z-10">
          <NavigationBar pathname={pathname} navigate={navigate} />
          <VisualLabSection navigate={navigate} />
        </main>
      ) : isUploadPreviewRoute ? (
        <div className="relative z-10">
          <NavigationBar pathname={pathname} navigate={navigate} />
          <UploadPreviewPage navigate={navigate} />
        </div>
      ) : isOrderPortalRoute ? (
        <div className="relative z-10">
          <NavigationBar pathname={pathname} navigate={navigate} />
          <OrderPortalPage navigate={navigate} />
        </div>
      ) : (
        <main id="homepage-slides" className="relative">
          <BrandIntroSection
            pathname={pathname}
            navigate={navigate}
            activeCategory={activeEntryCategory}
            categories={entryCategoryDecks}
            onPreviousCategory={() => handleCycleEntryCategory(-1)}
            onNextCategory={() => handleCycleEntryCategory(1)}
            onSelectCategory={handleSelectEntryCategory}
          />
          <CategoryMoodBoardSection
            activeCategory={activeEntryCategory}
            selectedItemId={selectedEntryItemId}
            onSelectItem={handleSelectEntryItem}
            activeProduct={activeProduct}
            navigate={navigate}
          />
          <HeroSection />
          <MaterialStorySection />
          <DetailStorySection />
          <TechnicalSection />
          <ShowcaseSection onReturnToTop={handleReturnToHero} />
          <RelatedProductsSection onUploadPreviewClick={() => navigate('/upload-preview')} />
        </main>
      )}
    </div>
  );
}
