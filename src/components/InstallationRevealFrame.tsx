import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeftRight } from 'lucide-react';
import { useProductCatalog } from './ProductCatalogContext';
import { createBrickWallDataUrl, createImageCropDataUrl, createRoomCompositeDataUrl } from '../utils/textureGenerator';

const livingRoomBaseImage = new URL('../public/wallpaper-for-walls-plastered-wall-142-w1000.jpg', import.meta.url).href;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function InstallationRevealFrame() {
  const { activeProduct, products } = useProductCatalog();
  const frameRef = useRef<HTMLDivElement>(null);
  const sweepStateRef = useRef({ value: 0.54 });
  const isDraggingRef = useRef(false);
  const [dividerRatio, setDividerRatio] = useState(sweepStateRef.current.value);
  const [beforeRevealSrc, setBeforeRevealSrc] = useState('');
  const [afterRevealSrc, setAfterRevealSrc] = useState('');

  const decorPresentation = activeProduct.finishAssets.decorRevealPresentation;
  const dividerPercent = dividerRatio * 100;
  const frameAspect = decorPresentation?.frameAspect ?? 2.32;

  const updateDividerRatio = useCallback((nextValue: number) => {
    const clampedValue = clamp(nextValue, 0.08, 0.92);
    sweepStateRef.current.value = clampedValue;
    setDividerRatio(clampedValue);
  }, []);

  const dividerFromClientX = useCallback((clientX: number) => {
    if (!frameRef.current) return sweepStateRef.current.value;

    const bounds = frameRef.current.getBoundingClientRect();
    return clamp((clientX - bounds.left) / bounds.width, 0.08, 0.92);
  }, []);

  const buildInstalledRevealSrc = useCallback(
    async (product: (typeof products)[number], framePixelWidth: number, framePixelHeight: number) => {
      const productPresentation = product.finishAssets.decorRevealPresentation;

      if (productPresentation?.compositeWallFromFace && product.finishAssets.faceImage) {
        const wallBounds = productPresentation.wallBounds ?? {
          x: 0.18,
          y: 0.04,
          width: 0.68,
          height: 0.52,
        };
        const wallWidth = Math.max(840, Math.round(framePixelWidth * wallBounds.width));
        const wallHeight = Math.max(360, Math.round(framePixelHeight * wallBounds.height));
        const wallDataUrl = await createBrickWallDataUrl(product.scenePalette, product.finishAssets.faceImage, {
          width: wallWidth,
          height: wallHeight,
          courses: productPresentation.wallCourses ?? 10,
          quality: 0.9,
        });

        return createRoomCompositeDataUrl(livingRoomBaseImage, wallDataUrl, {
          width: framePixelWidth,
          height: framePixelHeight,
          roomCrop: productPresentation.beforeCrop,
          wallBounds,
          quality: 0.9,
        });
      }

      const installedRoomImage = productPresentation?.installedRoomImage ?? product.finishAssets.backdropImage;

      return createImageCropDataUrl(installedRoomImage, productPresentation?.afterCrop, {
        width: framePixelWidth,
        height: framePixelHeight,
      });
    },
    []
  );

  const handleDragStart = useCallback((clientX: number) => {
    gsap.killTweensOf(sweepStateRef.current);
    isDraggingRef.current = true;
    document.body.style.userSelect = 'none';
    updateDividerRatio(dividerFromClientX(clientX));
  }, [dividerFromClientX, updateDividerRatio]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current) return;
      updateDividerRatio(dividerFromClientX(event.clientX));
    };

    const endDrag = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      document.body.style.userSelect = '';
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      document.body.style.userSelect = '';
    };
  }, [dividerFromClientX, updateDividerRatio]);

  useEffect(() => {
    const sweepTarget = sweepStateRef.current;
    const revealTimeline = gsap.timeline();

    gsap.killTweensOf(sweepTarget);
    updateDividerRatio(0.78);

    revealTimeline
      .to(sweepTarget, {
        value: 0.34,
        duration: 1.05,
        ease: 'power3.out',
        onUpdate: () => updateDividerRatio(sweepTarget.value),
      })
      .to(sweepTarget, {
        value: 0.54,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => updateDividerRatio(sweepTarget.value),
      });

    return () => {
      revealTimeline.kill();
      gsap.killTweensOf(sweepTarget);
    };
  }, [activeProduct.id, updateDividerRatio]);

  useEffect(() => {
    const framePixelWidth = 1800;
    const framePixelHeight = Math.round(framePixelWidth / frameAspect);
    const warmupTimeout = window.setTimeout(() => {
      const referenceBeforeCrop =
        products[0]?.finishAssets.decorRevealPresentation?.beforeCrop ?? decorPresentation?.beforeCrop;

      void createImageCropDataUrl(livingRoomBaseImage, referenceBeforeCrop, {
        width: framePixelWidth,
        height: framePixelHeight,
      });

      products.forEach((product) => {
        void buildInstalledRevealSrc(product, framePixelWidth, framePixelHeight);
      });
    }, 180);

    return () => {
      window.clearTimeout(warmupTimeout);
    };
  }, [products, frameAspect, decorPresentation?.beforeCrop, buildInstalledRevealSrc]);

  useEffect(() => {
    let cancelled = false;
    const framePixelWidth = 1800;
    const framePixelHeight = Math.round(framePixelWidth / frameAspect);

    setBeforeRevealSrc('');
    setAfterRevealSrc('');

    Promise.all([
      createImageCropDataUrl(livingRoomBaseImage, decorPresentation?.beforeCrop, {
        width: framePixelWidth,
        height: framePixelHeight,
      }),
      buildInstalledRevealSrc(activeProduct, framePixelWidth, framePixelHeight),
    ]).then(([beforeSrc, afterSrc]) => {
      if (cancelled) return;
      if (beforeSrc) setBeforeRevealSrc(beforeSrc);
      if (afterSrc) setAfterRevealSrc(afterSrc);
    });

    return () => {
      cancelled = true;
    };
  }, [
    activeProduct.id,
    decorPresentation,
    frameAspect,
    buildInstalledRevealSrc,
  ]);

  const installedSurfaceStyle = useMemo(() => {
    const brightness = clamp(decorPresentation?.brightness ?? 0.98, 0.72, 1.06);
    const saturate = clamp(decorPresentation?.saturate ?? 1, 0.86, 1.16);
    const contrast = clamp(decorPresentation?.contrast ?? 1, 0.92, 1.16);
    const scale = Math.max(1, decorPresentation?.scale ?? 1);

    return {
      filter: `brightness(${brightness}) saturate(${saturate}) contrast(${contrast})`,
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
    };
  }, [decorPresentation]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    updateDividerRatio(dividerRatio + (event.key === 'ArrowRight' ? 0.05 : -0.05));
  };

  return (
    <div className="pointer-events-auto w-full max-w-[41.5rem]">
      <div
        ref={frameRef}
        className="group relative w-full cursor-ew-resize overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#060606] shadow-[0_22px_60px_rgba(0,0,0,0.34)]"
        style={{ aspectRatio: String(frameAspect), touchAction: 'none' }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture?.(event.pointerId);
          handleDragStart(event.clientX);
        }}
        onPointerMove={(event) => {
          if (!isDraggingRef.current) return;
          updateDividerRatio(dividerFromClientX(event.clientX));
        }}
        onPointerUp={() => {
          isDraggingRef.current = false;
          document.body.style.userSelect = '';
        }}
        onPointerCancel={() => {
          isDraggingRef.current = false;
          document.body.style.userSelect = '';
        }}
      >
        <img
          src={beforeRevealSrc || livingRoomBaseImage}
          alt="Living room wall preview"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.82] saturate-[0.82]"
          draggable={false}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${dividerPercent}% )` }}
        >
          {afterRevealSrc ? (
            <img
              src={afterRevealSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              style={installedSurfaceStyle}
              draggable={false}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.06)_36%,rgba(0,0,0,0.16)_100%)] mix-blend-multiply" />
        </div>

        <div
          className="pointer-events-none absolute top-0 bottom-0 z-20 w-[2px] bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_0_24px_rgba(255,255,255,0.12)]"
          style={{ left: `calc(${dividerPercent}% - 1px)` }}
        />

        <button
          type="button"
          role="slider"
          aria-label="Reveal installed wall preview"
          aria-valuemin={8}
          aria-valuemax={92}
          aria-valuenow={Math.round(dividerPercent)}
          onPointerDown={(event) => {
            event.stopPropagation();
            event.currentTarget.setPointerCapture?.(event.pointerId);
            handleDragStart(event.clientX);
          }}
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-[#0a0a0a]/92 text-white shadow-[0_12px_24px_rgba(0,0,0,0.34)] transition-transform duration-300 group-hover:scale-[1.04]"
          style={{ left: `calc(${dividerPercent}% - 22px)` }}
        >
          <ArrowLeftRight size={16} />
        </button>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.22)_100%)]" />
        <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] border border-white/6" />

        <div className="absolute left-5 top-5 z-20 rounded-full border border-white/10 bg-black/54 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/78 backdrop-blur-sm">
          Plastered Wall
        </div>
        <div className="absolute right-5 top-5 z-20 rounded-full border border-[#22c55e]/32 bg-[#050505]/56 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#22c55e] backdrop-blur-sm">
          {activeProduct.productName} Installation
        </div>
      </div>
    </div>
  );
}
