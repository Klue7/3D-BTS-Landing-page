import React, { useEffect } from 'react';
import { NavigationBar } from './NavigationBar';
import { HeroSection } from './HeroSection';
import { MaterialStorySection } from './MaterialStorySection';
import { DeliveryProcessSection } from './DeliveryProcessSection';
import { TechnicalSection } from './TechnicalSection';
import { ShowcaseSection } from './ShowcaseSection';
import { VisualLabSection } from './VisualLabSection';
import { PremiumShowcaseSection } from './PremiumShowcaseSection';
import { TopSellersSection } from './TopSellersSection';
import { Footer } from './Footer';
import { ProductScene } from './ProductScene';
import { CatalogSection } from './CatalogSection';
import { ProductJourneySection } from './ProductJourneySection';
import { QuoteWizard } from './QuoteWizard';
import Lenis from '@studio-freight/lenis';
import { useVisualLab } from './VisualLabContext';

export function MainLayout() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div id="main-container" className="bg-[#050505] text-white min-h-screen font-sans selection:bg-[#22c55e] selection:text-white">
      <NavigationBar />
      <ProductScene />
      <QuoteWizard />
      
      <main className="relative">
        <HeroSection />
        <CatalogSection />
        <ProductJourneySection />
        <MaterialStorySection />
        <DeliveryProcessSection />
        <TechnicalSection />
        <ShowcaseSection />
        <PremiumShowcaseSection />
        <TopSellersSection />
        <Footer />
      </main>
    </div>
  );
}
