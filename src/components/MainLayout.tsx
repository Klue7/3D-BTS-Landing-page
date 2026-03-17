import React, { useEffect } from 'react';
import { NavigationBar } from './NavigationBar';
import { HeroSection } from './HeroSection';
import { MaterialStorySection } from './MaterialStorySection';
import { TechnicalSection } from './TechnicalSection';
import { ShowcaseSection } from './ShowcaseSection';
import { VisualLabSection } from './VisualLabSection';
import { ProductScene } from './ProductScene';
import { RelatedProductsSection } from './RelatedProductsSection';
import Lenis from '@studio-freight/lenis';

interface MainLayoutProps {
  pathname: string;
  navigate: (path: string) => void;
}

export function MainLayout({ pathname, navigate }: MainLayoutProps) {
  const isCustomizeRoute = pathname === '/customize';

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
    <div id="main-container" className="bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-[#22c55e] selection:text-white">
      <NavigationBar pathname={pathname} navigate={navigate} />
      <ProductScene isCustomizeRoute={isCustomizeRoute} />
      
      {isCustomizeRoute ? (
        <main className="relative z-10">
          <VisualLabSection navigate={navigate} />
        </main>
      ) : (
        <main className="relative">
          <HeroSection />
          <MaterialStorySection />
          <TechnicalSection />
          <ShowcaseSection />
          <RelatedProductsSection onCustomizeClick={() => navigate('/customize')} />
        </main>
      )}
    </div>
  );
}
