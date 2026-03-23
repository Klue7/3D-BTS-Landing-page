import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { BrickTile } from './BrickTile';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useVisualLab } from './VisualLabContext';
import { useProductCatalog } from './ProductCatalogContext';
import { createBrandBrickFaceDataUrl, createBrandTileFaceDataUrl, getBrickTextureSet, preloadImageAsset } from '../utils/textureGenerator';
import { productCatalog, type BrickPalette } from '../data/mockData';

gsap.registerPlugin(ScrollTrigger);

type HomepageSection = 'intro' | 'moodboard' | 'hero' | 'material' | 'detail' | 'technical' | 'showcase' | 'footer';

interface StagePreset {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

interface AnimatedBrickProps {
  isCustomizeRoute: boolean;
  introObjectMode: 'tile' | 'brick';
}

const HOMEPAGE_SECTIONS: HomepageSection[] = ['intro', 'moodboard', 'hero', 'material', 'detail', 'technical', 'showcase', 'footer'];
const INTERACTIVE_SECTIONS = new Set<HomepageSection>(['intro', 'hero', 'material', 'technical']);
const SHOWCASE_PODIUM_POSITIONS = {
  platformY: -1.34,
  hiddenY: -2.16,
};
const BRAND_TILE_PALETTE: BrickPalette = {
  highlight: '#2d3137',
  mid: '#171b20',
  shadow: '#090b0e',
  noise: 18,
  lift: 2,
  ember: '#23272d',
  ash: '#565d68',
  speckLight: '#77808d',
  speckDark: '#050607',
  body: '#0d0f12',
  mortar: '#171a1f',
};
const BRAND_BRICK_PALETTE: BrickPalette = {
  highlight: '#8d6648',
  mid: '#6c492f',
  shadow: '#2d1c13',
  noise: 32,
  lift: 4,
  ember: '#b27b55',
  ash: '#8e6f57',
  speckLight: '#c8a07b',
  speckDark: '#1c110b',
  body: '#6d4a30',
  mortar: '#4a3427',
};
const TILE_OBJECT_SPEC = {
  dimensions: [2.2, 0.73, 0.14] as [number, number, number],
  radius: 0.035,
  yOffset: 0,
  scale: [0.994, 0.994, 0.994] as [number, number, number],
};
const BRICK_OBJECT_SPEC = {
  dimensions: [2.2, 0.7, 1] as [number, number, number],
  radius: 0.055,
  yOffset: -0.035,
  scale: [0.88, 0.88, 0.88] as [number, number, number],
};

function getObjectSpec(mode: 'tile' | 'brick') {
  return mode === 'brick' ? BRICK_OBJECT_SPEC : TILE_OBJECT_SPEC;
}

function BeveledStage({
  radius,
  height,
  bevel,
  segments = 96,
  children,
}: {
  radius: number;
  height: number;
  bevel: number;
  segments?: number;
  children: React.ReactNode;
}) {
  const geometry = useMemo(() => {
    const safeBevel = Math.min(bevel, height * 0.48, radius * 0.18);
    const halfHeight = height / 2;
    const profile = [
      new THREE.Vector2(0, -halfHeight),
      new THREE.Vector2(radius - safeBevel, -halfHeight),
      new THREE.Vector2(radius - safeBevel * 0.35, -halfHeight + safeBevel * 0.28),
      new THREE.Vector2(radius, -halfHeight + safeBevel),
      new THREE.Vector2(radius, halfHeight - safeBevel),
      new THREE.Vector2(radius - safeBevel * 0.35, halfHeight - safeBevel * 0.28),
      new THREE.Vector2(radius - safeBevel, halfHeight),
      new THREE.Vector2(0, halfHeight),
    ];

    const stageGeometry = new THREE.LatheGeometry(profile, segments);
    stageGeometry.computeVertexNormals();
    return stageGeometry;
  }, [bevel, height, radius, segments]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      {children}
    </mesh>
  );
}

function ShowcasePlatform({
  motionRef,
  platformRef,
  bodyMaterialRef,
  deckMaterialRef,
  insetMaterialRef,
  rimMaterialRef,
}: {
  motionRef: React.RefObject<THREE.Group | null>;
  platformRef: React.RefObject<THREE.Group | null>;
  bodyMaterialRef: React.RefObject<THREE.MeshPhysicalMaterial | null>;
  deckMaterialRef: React.RefObject<THREE.MeshStandardMaterial | null>;
  insetMaterialRef: React.RefObject<THREE.MeshStandardMaterial | null>;
  rimMaterialRef: React.RefObject<THREE.MeshStandardMaterial | null>;
}) {
  return (
    <group ref={motionRef}>
      <group ref={platformRef}>
        <BeveledStage radius={1.34} height={0.42} bevel={0.12}>
          <meshPhysicalMaterial
            ref={bodyMaterialRef}
            transparent
            opacity={1}
            color="#050608"
            metalness={0.72}
            roughness={0.46}
            clearcoat={0.12}
            envMapIntensity={0.74}
          />
        </BeveledStage>
        <mesh position={[0, 0.205, 0]} receiveShadow>
          <cylinderGeometry args={[1.28, 1.28, 0.03, 96]} />
          <meshStandardMaterial
            ref={deckMaterialRef}
            transparent
            opacity={1}
            color="#8a9099"
            metalness={0.52}
            roughness={0.34}
          />
        </mesh>
        <mesh position={[0, 0.228, 0]} receiveShadow>
          <cylinderGeometry args={[1.02, 1.02, 0.055, 96]} />
          <meshStandardMaterial
            ref={insetMaterialRef}
            transparent
            opacity={1}
            color="#434953"
            metalness={0.34}
            roughness={0.74}
          />
        </mesh>
        <mesh position={[0, 0.214, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.028, 20, 96]} />
          <meshStandardMaterial
            ref={rimMaterialRef}
            transparent
            opacity={1}
            color="#d7dce1"
            metalness={0.64}
            roughness={0.26}
          />
        </mesh>
      </group>
    </group>
  );
}

function SceneCameraController({
  cameraRef,
}: {
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
}) {
  const { currentSection } = useVisualLab();
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (!cameraRef.current) return;

    const camera = cameraRef.current;
    const isIntro = currentSection === 'intro';
    const isShowcase = currentSection === 'showcase';
    const nextPosition =
      isShowcase
        ? { x: 0, y: 0.28, z: 5.2 }
        : isIntro
          ? { x: 0, y: 0.1, z: 5.45 }
        : { x: 0, y: 0, z: 5 };
    const nextLookTarget =
      isShowcase
        ? { x: 0, y: -0.72, z: 0 }
        : isIntro
          ? { x: 0, y: 0.08, z: 0 }
        : { x: 0, y: 0, z: 0 };

    const positionTween = gsap.to(camera.position, {
      ...nextPosition,
      duration: 0.85,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: () => {
        camera.lookAt(lookTarget.current);
      },
    });

    const lookTween = gsap.to(lookTarget.current, {
      ...nextLookTarget,
      duration: 0.85,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: () => {
        camera.lookAt(lookTarget.current);
      },
    });

    return () => {
      positionTween.kill();
      lookTween.kill();
    };
  }, [cameraRef, currentSection]);

  useFrame(() => {
    if (!cameraRef.current) return;
    cameraRef.current.lookAt(lookTarget.current);
  });

  return null;
}

function AnimatedBrick({ isCustomizeRoute, introObjectMode }: AnimatedBrickProps) {
  const wrapperRef = useRef<THREE.Group>(null);
  const brickRef = useRef<THREE.Group>(null);
  const tileIdleRef = useRef<THREE.Group>(null);
  const interactiveRef = useRef<THREE.Group>(null);
  const brandObjectRef = useRef<THREE.Group>(null);
  const productObjectRef = useRef<THREE.Group>(null);
  const podiumMotionRef = useRef<THREE.Group>(null);
  const platformRef = useRef<THREE.Group>(null);
  const brandTileFaceMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const brandTileBodyMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const tileFaceMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const tileBodyMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const platformBodyMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const platformDeckMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const platformInsetMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const platformRimMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  const { setCurrentSection } = useVisualLab();
  const { activeProduct } = useProductCatalog();
  const brandObjectFaceImage = useMemo(
    () => (
      introObjectMode === 'brick'
        ? createBrandBrickFaceDataUrl(BRAND_BRICK_PALETTE)
        : createBrandTileFaceDataUrl()
    ),
    [introObjectMode]
  );
  const brandObjectSpec = useMemo(() => getObjectSpec(introObjectMode), [introObjectMode]);
  const productObjectSpec = useMemo(
    () => getObjectSpec(activeProduct.objectMode ?? 'tile'),
    [activeProduct.objectMode]
  );
  const brandObjectPalette = introObjectMode === 'brick' ? BRAND_BRICK_PALETTE : BRAND_TILE_PALETTE;
  const currentSection = useRef<HomepageSection | 'visual-lab'>('intro');
  const isTransitioning = useRef(false);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const autoRotateAngleRef = useRef(0);
  const tileDisplayModeRef = useRef<'brand' | 'product' | 'hidden'>('brand');
  const tileDisplayTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const introRotationRef = useRef<gsap.core.Tween | null>(null);
  const introFloatRef = useRef<gsap.core.Tween | null>(null);
  const heroRotationRef = useRef<gsap.core.Tween | null>(null);
  const heroFloatRef = useRef<gsap.core.Tween | null>(null);
  const showcaseFloatRef = useRef<gsap.core.Tween | null>(null);
  const showcaseRotateRef = useRef<gsap.core.Tween | null>(null);
  const showcaseEntranceRef = useRef<gsap.core.Timeline | null>(null);
  const productSpinRef = useRef<gsap.core.Timeline | null>(null);
  const introMorphRef = useRef<gsap.core.Timeline | null>(null);
  const previousIntroModeRef = useRef(introObjectMode);
  const isTopSection = (section: HomepageSection | 'visual-lab') => section === 'intro' || section === 'moodboard';
  const shouldUseBrandObject = (section: HomepageSection | 'visual-lab') => section === 'intro';

  useFrame((_, delta) => {
    if (!interactiveRef.current) return;

    const syncMaterialRenderState = (material: THREE.Material | null | undefined) => {
      if (!material || !('opacity' in material) || !('transparent' in material) || !('depthWrite' in material)) return;
      const nextTransparent = material.opacity < 0.999;
      if (material.transparent === nextTransparent) return;
      material.transparent = nextTransparent;
      material.depthWrite = !nextTransparent;
      material.needsUpdate = true;
    };

    syncMaterialRenderState(brandTileFaceMaterialRef.current);
    syncMaterialRenderState(brandTileBodyMaterialRef.current);
    syncMaterialRenderState(tileFaceMaterialRef.current);
    syncMaterialRenderState(tileBodyMaterialRef.current);

    const shouldAutoRotateShowroomObject =
      ((
        currentSection.current === 'hero' &&
        tileDisplayModeRef.current === 'product'
      ) || (
        currentSection.current === 'intro' &&
        tileDisplayModeRef.current === 'brand'
      ) || (
        currentSection.current === 'technical' &&
        tileDisplayModeRef.current === 'product'
      )) &&
      !isDragging.current &&
      !isTransitioning.current;

    if (shouldAutoRotateShowroomObject) {
      autoRotateAngleRef.current += delta * (
        currentSection.current === 'intro'
          ? 0.18
          : currentSection.current === 'technical'
            ? 0.2
            : 0.24
      );
      targetRotation.current.y = autoRotateAngleRef.current;
      targetRotation.current.x = THREE.MathUtils.damp(targetRotation.current.x, 0, 3.2, delta);
    }

    interactiveRef.current.rotation.y = THREE.MathUtils.damp(
      interactiveRef.current.rotation.y,
      targetRotation.current.y,
      isDragging.current ? 15 : 5,
      delta
    );
    interactiveRef.current.rotation.x = THREE.MathUtils.damp(
      interactiveRef.current.rotation.x,
      targetRotation.current.x,
      isDragging.current ? 15 : 5,
      delta
    );
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeoutHandles: Array<ReturnType<typeof globalThis.setTimeout>> = [];
    const idleHandles: number[] = [];
    let isCancelled = false;
    const idleWindow = window as Window & typeof globalThis & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const preloadProductAssets = () => {
      createBrandTileFaceDataUrl();
      createBrandBrickFaceDataUrl(BRAND_BRICK_PALETTE);

      productCatalog.forEach((product) => {
        preloadImageAsset(product.finishAssets.faceImage);
        preloadImageAsset(product.finishAssets.backdropImage);
        preloadImageAsset(product.finishAssets.decorRevealPresentation?.installedRoomImage);
        product.finishAssets.galleryImages?.forEach((image) => preloadImageAsset(image));
      });
    };

    const warmTextureSet = (index: number) => {
      if (isCancelled || index >= productCatalog.length) return;

      const product = productCatalog[index];
      const runWarmup = () => {
        if (isCancelled) return;

        getBrickTextureSet(product.scenePalette, product.finishAssets.faceImage);
        warmTextureSet(index + 1);
      };

      if (idleWindow.requestIdleCallback) {
        const idleHandle = idleWindow.requestIdleCallback(runWarmup, { timeout: 180 });
        idleHandles.push(idleHandle);
        return;
      }

      const timeoutHandle = globalThis.setTimeout(runWarmup, index === 0 ? 40 : 24);
      timeoutHandles.push(timeoutHandle);
    };

    preloadProductAssets();
    const kickoffHandle = globalThis.setTimeout(() => {
      warmTextureSet(0);
    }, 90);
    timeoutHandles.push(kickoffHandle);

    return () => {
      isCancelled = true;
      timeoutHandles.forEach((handle) => globalThis.clearTimeout(handle));

      if (idleWindow.cancelIdleCallback) {
        idleHandles.forEach((handle) => idleWindow.cancelIdleCallback?.(handle));
      }
    };
  }, []);

  useEffect(() => {
    if (isCustomizeRoute) return;
    setCurrentSection('intro');
  }, [isCustomizeRoute, setCurrentSection]);

  useEffect(() => {
    if (
      isCustomizeRoute ||
      !tileIdleRef.current ||
      !tileFaceMaterialRef.current ||
      !tileBodyMaterialRef.current
    ) {
      return;
    }

    const tileIdle = tileIdleRef.current;
    const tileMaterials = [tileFaceMaterialRef.current, tileBodyMaterialRef.current];

    if (isTopSection(currentSection.current)) {
      gsap.killTweensOf(tileMaterials);
      gsap.set(tileMaterials, { opacity: 0 });
      return;
    }

    productSpinRef.current?.kill();
    gsap.killTweensOf(tileIdle.rotation);
    gsap.killTweensOf(tileIdle.position);
    gsap.killTweensOf(tileMaterials);

    heroRotationRef.current?.pause();
    heroFloatRef.current?.pause();

    autoRotateAngleRef.current = 0;
    targetRotation.current = { x: 0, y: 0 };
    gsap.set(tileIdle.rotation, {
      x: 0.05,
      y: -Math.PI * 1.08,
      z: 0.02,
    });
    gsap.set(tileIdle.position, { y: -0.035 });
    gsap.set(tileMaterials, { opacity: 0.2 });

    const isBrickProduct = activeProduct.objectMode === 'brick';
    const productSpinTimeline = gsap.timeline({
      onComplete: () => {
        if (currentSection.current === 'hero' && !isDragging.current) {
          heroRotationRef.current?.play();
          heroFloatRef.current?.play();
        }
      },
    });

    productSpinTimeline
      .to(
        tileIdle.rotation,
        {
          x: 0,
          y: 0,
          z: 0,
          duration: isBrickProduct ? 0.74 : 0.82,
          ease: 'power2.out',
        },
        0
      )
      .to(
        tileIdle.position,
        {
          y: isBrickProduct ? 0.034 : 0.042,
          duration: isBrickProduct ? 0.28 : 0.34,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        },
        0.02
      )
      .to(
        tileMaterials,
        {
          opacity: 1,
          duration: isBrickProduct ? 0.22 : 0.26,
          ease: 'power2.out',
          stagger: 0.04,
        },
        0.1
      );

    productSpinRef.current = productSpinTimeline;

    return () => {
      productSpinTimeline.kill();
    };
  }, [activeProduct.id, isCustomizeRoute]);

  useEffect(() => {
    if (!wrapperRef.current || !tileIdleRef.current || isCustomizeRoute) return;

    if (previousIntroModeRef.current === introObjectMode) return;
    previousIntroModeRef.current = introObjectMode;

    if (!shouldUseBrandObject(currentSection.current)) return;

    introMorphRef.current?.kill();
    introRotationRef.current?.pause();
    introFloatRef.current?.pause();

    const wrapper = wrapperRef.current;
    const tileIdle = tileIdleRef.current;
    const brandMaterials = [brandTileFaceMaterialRef.current, brandTileBodyMaterialRef.current].filter(Boolean);
    const isBrickIntro = introObjectMode === 'brick';
    const morphTimeline = gsap.timeline({
      onComplete: () => {
        if (currentSection.current === 'intro') {
          introRotationRef.current?.play();
          introFloatRef.current?.play();
        }
      },
    });

    morphTimeline
      .to(
        wrapper.rotation,
        {
          y: wrapper.rotation.y + (isBrickIntro ? Math.PI * 0.68 : Math.PI * 0.9),
          x: isBrickIntro ? -0.032 : 0.016,
          duration: isBrickIntro ? 0.56 : 0.62,
          ease: 'power2.inOut',
          overwrite: 'auto',
        },
        0
      )
      .fromTo(
        brandMaterials,
        { opacity: 0.58 },
        {
          opacity: 1,
          duration: 0.3,
          stagger: 0.02,
          ease: 'power1.out',
          overwrite: 'auto',
        },
        0.06
      )
      .to(
        tileIdle.position,
        {
          y: isBrickIntro ? 0.058 : 0.038,
          duration: 0.22,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          overwrite: 'auto',
        },
        0.04
      )
      .fromTo(
        tileIdle.scale,
        { x: 0.972, y: 0.972, z: 0.972 },
        {
          x: isBrickIntro ? 1.008 : 1.016,
          y: isBrickIntro ? 1.008 : 1.016,
          z: isBrickIntro ? 1.008 : 1.016,
          duration: 0.26,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          overwrite: 'auto',
        },
        0
      );

    introMorphRef.current = morphTimeline;

    return () => {
      morphTimeline.kill();
    };
  }, [introObjectMode, isCustomizeRoute]);

  useEffect(() => {
    if (
      !wrapperRef.current ||
      !brickRef.current ||
      !tileIdleRef.current ||
      !podiumMotionRef.current ||
      !platformRef.current ||
      !brandTileFaceMaterialRef.current ||
      !brandTileBodyMaterialRef.current ||
      !tileFaceMaterialRef.current ||
      !tileBodyMaterialRef.current ||
      !platformBodyMaterialRef.current ||
      !platformDeckMaterialRef.current ||
      !platformInsetMaterialRef.current ||
      !platformRimMaterialRef.current
    ) {
      return;
    }

    const wrapper = wrapperRef.current;
    const brick = brickRef.current;
    const tileIdle = tileIdleRef.current;
    const podiumMotion = podiumMotionRef.current;
    const platform = platformRef.current;
    const brandTileMaterials = [brandTileFaceMaterialRef.current, brandTileBodyMaterialRef.current];
    const tileMaterials = [tileFaceMaterialRef.current, tileBodyMaterialRef.current];
    const platformMaterials = [
      platformBodyMaterialRef.current,
      platformDeckMaterialRef.current,
      platformInsetMaterialRef.current,
      platformRimMaterialRef.current,
    ];
    const mm = gsap.matchMedia();

    let masterTimeline: gsap.core.Timeline | null = null;
    let masterTrigger: ScrollTrigger | null = null;
    let showcaseVisibilityTrigger: ScrollTrigger | null = null;
    let activeIdleSection: string | null = null;
    let showcaseIsVisible = false;

    introRotationRef.current = gsap.to(wrapper.rotation, {
      x: introObjectMode === 'brick' ? -0.016 : -0.022,
      z: introObjectMode === 'brick' ? 0.008 : 0.012,
      duration: introObjectMode === 'brick' ? 6.6 : 5.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      paused: true,
    });

    introFloatRef.current = gsap.to(wrapper.position, {
      y: introObjectMode === 'brick' ? 0.095 : 0.13,
      duration: introObjectMode === 'brick' ? 5.4 : 4.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      paused: true,
    });

    heroRotationRef.current = gsap.to(wrapper.rotation, {
      x: 0.03,
      z: 0.01,
      duration: 4.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      paused: true,
    });

    heroFloatRef.current = gsap.to(wrapper.position, {
      y: 0.1,
      duration: 3.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      paused: true,
    });

    showcaseFloatRef.current = gsap.to(tileIdle.position, {
      y: 0.016,
      duration: 3.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      paused: true,
    });

    showcaseRotateRef.current = gsap.to(tileIdle.rotation, {
      y: Math.PI * 2,
      duration: 13.5,
      repeat: -1,
      ease: 'none',
      paused: true,
    });

    const setShowcaseHiddenState = () => {
      gsap.set(podiumMotion.position, { y: SHOWCASE_PODIUM_POSITIONS.hiddenY });
      gsap.set(platform.position, { y: SHOWCASE_PODIUM_POSITIONS.platformY + 0.16 });
      gsap.set(platform.scale, { x: 0.92, y: 0.92, z: 0.92 });
      gsap.set(platformMaterials, { opacity: 0 });
      gsap.set(tileIdle.position, { y: 0 });
      gsap.set(tileIdle.rotation, { x: 0, y: 0, z: 0 });
      gsap.set(tileIdle.scale, { x: 1, y: 1, z: 1 });
      gsap.set(tileMaterials, { opacity: 1 });
    };

    const setTileDisplayMode = (mode: 'brand' | 'product' | 'hidden', immediate = false) => {
      if (tileDisplayModeRef.current === mode && !immediate) return;

      tileDisplayModeRef.current = mode;
      tileDisplayTimelineRef.current?.kill();

      const brandObject = brandObjectRef.current;
      const productObject = productObjectRef.current;

      if (immediate) {
        if (brandObject) {
          brandObject.visible = mode === 'brand';
        }
        if (productObject) {
          productObject.visible = mode === 'product';
        }
        gsap.set(tileIdle.scale, { x: 1, y: 1, z: 1 });
        gsap.set(brandTileMaterials, { opacity: mode === 'brand' ? 1 : 0 });
        gsap.set(tileMaterials, { opacity: mode === 'product' ? 1 : 0 });
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: 'power2.out',
        },
      });

      if (mode === 'brand') {
        if (brandObject) brandObject.visible = true;
        if (productObject) productObject.visible = true;
        timeline
          .to(tileMaterials, { opacity: 0, duration: 0.24, stagger: 0.02 }, 0)
          .fromTo(
            brandTileMaterials,
            { opacity: 0.12 },
            { opacity: 1, duration: 0.32, stagger: 0.03 },
            0.08
          )
          .fromTo(
            tileIdle.scale,
            { x: 0.972, y: 0.972, z: 0.972 },
            { x: 1, y: 1, z: 1, duration: 0.48 },
            0
          );
        timeline.add(() => {
          if (productObject) productObject.visible = false;
          if (brandObject) brandObject.visible = true;
        });
      } else if (mode === 'product') {
        if (brandObject) brandObject.visible = true;
        if (productObject) productObject.visible = true;
        timeline
          .to(brandTileMaterials, { opacity: 0, duration: 0.24, stagger: 0.02 }, 0)
          .fromTo(
            tileMaterials,
            { opacity: 0.16 },
            { opacity: 1, duration: 0.34, stagger: 0.03 },
            0.08
          )
          .fromTo(
            tileIdle.scale,
            { x: 0.968, y: 0.968, z: 0.968 },
            { x: 1, y: 1, z: 1, duration: 0.52 },
            0
          );
        timeline.add(() => {
          if (brandObject) brandObject.visible = false;
          if (productObject) productObject.visible = true;
        });
      } else {
        if (brandObject) brandObject.visible = true;
        if (productObject) productObject.visible = true;
        timeline
          .to(brandTileMaterials, { opacity: 0, duration: 0.24, stagger: 0.02 }, 0)
          .to(tileMaterials, { opacity: 0, duration: 0.24, stagger: 0.02 }, 0)
          .fromTo(
            tileIdle.scale,
            { x: 0.984, y: 0.984, z: 0.984 },
            { x: 0.956, y: 0.956, z: 0.956, duration: 0.34 },
            0
          );
        timeline.add(() => {
          if (brandObject) brandObject.visible = false;
          if (productObject) productObject.visible = false;
        });
      }

      tileDisplayTimelineRef.current = timeline;
    };

    const playShowcaseEntrance = () => {
      if (showcaseIsVisible) return;
      showcaseIsVisible = true;
      showcaseEntranceRef.current?.kill();
      showcaseFloatRef.current?.pause(0);
      showcaseRotateRef.current?.pause(0);
      setShowcaseHiddenState();

      showcaseEntranceRef.current = gsap.timeline();
      showcaseEntranceRef.current
        .to(podiumMotion.position, { y: 0, duration: 0.28, ease: 'power3.out' }, 0)
        .to(platform.position, { y: SHOWCASE_PODIUM_POSITIONS.platformY, duration: 0.28, ease: 'power3.out' }, 0)
        .to(platform.scale, { x: 1, y: 1, z: 1, duration: 0.28, ease: 'power2.out' }, 0)
        .to(tileMaterials, { opacity: 1, duration: 0.16, ease: 'power2.out' }, 0.02)
        .to(platformMaterials, { opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.04)
        .add(() => {
          showcaseFloatRef.current?.play(0);
          showcaseRotateRef.current?.play(0);
        }, 0.2);
    };

    const playShowcaseExitDown = () => {
      if (!showcaseIsVisible) return;
      showcaseIsVisible = false;
      showcaseEntranceRef.current?.kill();
      showcaseFloatRef.current?.pause(0);
      showcaseRotateRef.current?.pause(0);
      gsap.to(tileIdle.position, { y: 0, duration: 0.12, ease: 'power2.inOut', overwrite: 'auto' });
      gsap.to(tileIdle.rotation, { y: 0, duration: 0.14, ease: 'power2.inOut', overwrite: 'auto' });
      gsap.to(tileMaterials, {
        opacity: 0,
        duration: 0.08,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(platformMaterials, {
        opacity: 0,
        duration: 0.08,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(platform.position, {
        y: SHOWCASE_PODIUM_POSITIONS.platformY - 0.18,
        duration: 0.14,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
      gsap.to(platform.scale, {
        x: 0.92,
        y: 0.92,
        z: 0.92,
        duration: 0.14,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
      gsap.to(podiumMotion.position, {
        y: SHOWCASE_PODIUM_POSITIONS.hiddenY,
        duration: 0.16,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
    };

    const playShowcaseExitUp = () => {
      if (!showcaseIsVisible) return;
      showcaseIsVisible = false;
      showcaseEntranceRef.current?.kill();
      showcaseFloatRef.current?.pause(0);
      showcaseRotateRef.current?.pause(0);
      gsap.to(tileIdle.position, { y: 0, duration: 0.12, ease: 'power2.inOut', overwrite: 'auto' });
      gsap.to(tileIdle.rotation, { y: 0, duration: 0.14, ease: 'power2.inOut', overwrite: 'auto' });
      gsap.to(tileMaterials, {
        opacity: 1,
        duration: 0.08,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(platformMaterials, {
        opacity: 0,
        duration: 0.08,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(platform.position, {
        y: SHOWCASE_PODIUM_POSITIONS.platformY - 0.18,
        duration: 0.14,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
      gsap.to(platform.scale, {
        x: 0.92,
        y: 0.92,
        z: 0.92,
        duration: 0.14,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
      gsap.to(podiumMotion.position, {
        y: SHOWCASE_PODIUM_POSITIONS.hiddenY,
        duration: 0.16,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });
    };

    setShowcaseHiddenState();

    const resetWrapper = () => {
      gsap.to(wrapper.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(wrapper.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const applyIdleState = (section: HomepageSection | 'visual-lab') => {
      const previousSection = activeIdleSection;
      if (activeIdleSection === section) return;
      activeIdleSection = section;

      introRotationRef.current?.pause();
      introFloatRef.current?.pause();
      heroRotationRef.current?.pause();
      heroFloatRef.current?.pause();
      showcaseFloatRef.current?.pause();
      showcaseRotateRef.current?.pause();

      if (previousSection === 'showcase' && section !== 'showcase') {
        showcaseFloatRef.current?.pause(0);
        showcaseRotateRef.current?.pause(0);
      }

      if (section === 'intro') {
        resetWrapper();
        autoRotateAngleRef.current = interactiveRef.current?.rotation.y ?? 0;
        targetRotation.current = {
          x: interactiveRef.current?.rotation.x ?? 0,
          y: autoRotateAngleRef.current,
        };
        introRotationRef.current?.play();
        introFloatRef.current?.play();
        return;
      }

      if (section === 'moodboard') {
        resetWrapper();
        return;
      }

      if (section === 'hero') {
        resetWrapper();
        autoRotateAngleRef.current = interactiveRef.current?.rotation.y ?? 0;
        targetRotation.current = {
          x: interactiveRef.current?.rotation.x ?? 0,
          y: autoRotateAngleRef.current,
        };
        if (!isDragging.current) {
          heroRotationRef.current?.play();
        }
        heroFloatRef.current?.play();
        return;
      }

      if (section === 'technical') {
        resetWrapper();
        autoRotateAngleRef.current = interactiveRef.current?.rotation.y ?? 0;
        targetRotation.current = {
          x: interactiveRef.current?.rotation.x ?? 0,
          y: autoRotateAngleRef.current,
        };
        return;
      }

      if (section === 'showcase') {
        resetWrapper();
        return;
      }

      resetWrapper();
    };

    const setSectionState = (section: HomepageSection | 'visual-lab') => {
      applyIdleState(section);
      setTileDisplayMode(
        section === 'intro' ? 'brand' : section === 'moodboard' ? 'hidden' : 'product'
      );

      if (currentSection.current === section) return;

      currentSection.current = section;
      setCurrentSection(section);
    };

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        const presets: Record<HomepageSection | 'visual-lab', StagePreset> = {
          intro: isDesktop
            ? {
                position: { x: 0, y: 0.04, z: 0.02 },
                rotation: { x: 0.02, y: 0, z: 0 },
                scale: { x: 1.16, y: 1.16, z: 1.16 },
              }
            : {
                position: { x: 0, y: -0.02, z: 0 },
                rotation: { x: 0.03, y: 0, z: 0 },
                scale: { x: 0.96, y: 0.96, z: 0.96 },
              },
          moodboard: isDesktop
            ? {
                position: { x: 0, y: -0.08, z: -0.04 },
                rotation: { x: 0.02, y: -0.12, z: 0 },
                scale: { x: 0.72, y: 0.72, z: 0.72 },
              }
            : {
                position: { x: 0, y: -0.18, z: -0.06 },
                rotation: { x: 0.03, y: -0.12, z: 0 },
                scale: { x: 0.64, y: 0.64, z: 0.64 },
              },
          hero: isDesktop
            ? { position: { x: 0.03, y: 0.18, z: 0 }, rotation: { x: 0.04, y: 0.02, z: 0 }, scale: { x: 0.84, y: 0.84, z: 0.84 } }
            : { position: { x: 0, y: -0.08, z: 0 }, rotation: { x: 0.02, y: 0.02, z: 0 }, scale: { x: 0.74, y: 0.74, z: 0.74 } },
          material: isDesktop
            ? { position: { x: 1.58, y: 0.14, z: 0.72 }, rotation: { x: 0.15, y: Math.PI - 0.08, z: 0.05 }, scale: { x: 1.78, y: 1.78, z: 1.78 } }
            : { position: { x: 0.32, y: -1.12, z: 0.78 }, rotation: { x: 0.16, y: Math.PI - 0.12, z: 0.04 }, scale: { x: 1.32, y: 1.32, z: 1.32 } },
          detail: isDesktop
            ? { position: { x: -2.82, y: 0.18, z: 1.12 }, rotation: { x: -0.18, y: 0.94, z: -0.12 }, scale: { x: 2.18, y: 2.18, z: 2.18 } }
            : { position: { x: 0, y: -2.2, z: 1.16 }, rotation: { x: -0.12, y: 0.92, z: -0.08 }, scale: { x: 1.84, y: 1.84, z: 1.84 } },
          technical: isDesktop
            ? { position: { x: 0, y: -0.02, z: 0.08 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.98, y: 0.98, z: 0.98 } }
            : { position: { x: 0, y: -0.15, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.82, y: 0.82, z: 0.82 } },
          showcase: isDesktop
            ? { position: { x: 0.02, y: -0.54, z: 0.08 }, rotation: { x: 0.035, y: -0.1, z: 0.01 }, scale: { x: 0.72, y: 0.72, z: 0.72 } }
            : { position: { x: 0.02, y: -0.3, z: 0.08 }, rotation: { x: 0.04, y: -0.12, z: 0.01 }, scale: { x: 0.58, y: 0.58, z: 0.58 } },
          footer: isDesktop
            ? { position: { x: 0, y: -2.9, z: -0.6 }, rotation: { x: 0.14, y: -0.66, z: 0.05 }, scale: { x: 0.52, y: 0.52, z: 0.52 } }
            : { position: { x: 0, y: -3.1, z: -0.8 }, rotation: { x: 0.12, y: 0.5, z: 0 }, scale: { x: 0.44, y: 0.44, z: 0.44 } },
          'visual-lab': isDesktop
            ? { position: { x: 3, y: -1.5, z: 0 }, rotation: { x: 0.2, y: -0.4, z: 0 }, scale: { x: 0.6, y: 0.6, z: 0.6 } }
            : { position: { x: 0.8, y: -1.5, z: 0 }, rotation: { x: 0.2, y: -0.4, z: 0 }, scale: { x: 0.5, y: 0.5, z: 0.5 } },
        };

        if (isCustomizeRoute) {
          isTransitioning.current = false;
          targetRotation.current = { x: 0, y: 0 };
          gsap.to(brick.position, { ...presets['visual-lab'].position, duration: 1.2, ease: 'power3.inOut' });
          gsap.to(brick.rotation, { ...presets['visual-lab'].rotation, duration: 1.2, ease: 'power3.inOut' });
          gsap.to(brick.scale, { ...presets['visual-lab'].scale, duration: 1.2, ease: 'power3.inOut' });
          setSectionState('visual-lab');
          return;
        }

        const applyPreset = (preset: StagePreset) => {
          gsap.set(brick.position, preset.position);
          gsap.set(brick.rotation, preset.rotation);
          gsap.set(brick.scale, preset.scale);
        };

        applyPreset(presets.intro);
        setTileDisplayMode('brand', true);
        setSectionState('intro');

        masterTimeline = gsap.timeline({ paused: true });

        HOMEPAGE_SECTIONS.slice(1).forEach((section, index) => {
          masterTimeline!.to(
            brick.position,
            { ...presets[section].position, duration: 1, ease: 'power2.inOut' },
            index
          );
          masterTimeline!.to(
            brick.rotation,
            { ...presets[section].rotation, duration: 1, ease: 'power2.inOut' },
            index
          );
          masterTimeline!.to(
            brick.scale,
            { ...presets[section].scale, duration: 1, ease: 'power2.inOut' },
            index
          );
        });

        const sectionSpan = HOMEPAGE_SECTIONS.length - 1;

        masterTrigger = ScrollTrigger.create({
          trigger: '#homepage-slides',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.45,
          animation: masterTimeline,
          onUpdate: (self) => {
            const rawIndex = self.progress * sectionSpan;
            const snappedIndex = Math.min(sectionSpan, Math.max(0, Math.round(rawIndex)));
            const nextSection = HOMEPAGE_SECTIONS[snappedIndex];

            isTransitioning.current = Math.abs(rawIndex - snappedIndex) > 0.035;
            setSectionState(nextSection);
          },
        });

        showcaseVisibilityTrigger = ScrollTrigger.create({
          trigger: '#showcase',
          start: 'top center+=140',
          end: 'bottom center+=80',
          onEnter: playShowcaseEntrance,
          onEnterBack: playShowcaseEntrance,
          onLeave: playShowcaseExitDown,
          onLeaveBack: playShowcaseExitUp,
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    );

    return () => {
      masterTrigger?.kill();
      showcaseVisibilityTrigger?.kill();
      masterTimeline?.kill();
      mm.revert();
      showcaseEntranceRef.current?.kill();
      tileDisplayTimelineRef.current?.kill();
      productSpinRef.current?.kill();
      introMorphRef.current?.kill();
      introRotationRef.current?.kill();
      introFloatRef.current?.kill();
      heroRotationRef.current?.kill();
      heroFloatRef.current?.kill();
      showcaseFloatRef.current?.kill();
      showcaseRotateRef.current?.kill();
    };
  }, [introObjectMode, isCustomizeRoute, setCurrentSection]);

  const canInteract = () => {
    return !isTransitioning.current && INTERACTIVE_SECTIONS.has(currentSection.current as HomepageSection);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    isHovered.current = true;
    if (!canInteract()) return;
    if (!isDragging.current) document.body.style.cursor = 'grab';
  };

  const handlePointerOut = () => {
    isHovered.current = false;
    if (isDragging.current) return;
    document.body.style.cursor = 'auto';
  };

  const handlePointerDown = (e: any) => {
    if (!canInteract()) return;

    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    isDragging.current = true;
    previousPointer.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = 'grabbing';
    autoRotateAngleRef.current = interactiveRef.current?.rotation.y ?? targetRotation.current.y;

    if (currentSection.current === 'intro') {
      introRotationRef.current?.pause();
    }
    if (currentSection.current === 'hero') {
      heroRotationRef.current?.pause();
    }
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;
    e.stopPropagation();

    const deltaX = e.clientX - previousPointer.current.x;
    const deltaY = e.clientY - previousPointer.current.y;
    previousPointer.current = { x: e.clientX, y: e.clientY };

    targetRotation.current.y += deltaX * 0.01;
    targetRotation.current.x += deltaY * 0.01;
    targetRotation.current.x = THREE.MathUtils.clamp(targetRotation.current.x, -0.2, 0.2);
  };

  const handlePointerUp = (e: any) => {
    if (!isDragging.current) return;

    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    isDragging.current = false;

    if (
      (
        currentSection.current === 'intro' ||
        currentSection.current === 'hero' ||
        currentSection.current === 'technical'
      ) &&
      interactiveRef.current
    ) {
      autoRotateAngleRef.current = interactiveRef.current.rotation.y;
      targetRotation.current = {
        x: interactiveRef.current.rotation.x,
        y: interactiveRef.current.rotation.y,
      };
    } else {
      targetRotation.current = { x: 0, y: 0 };
    }

    if (isHovered.current && canInteract()) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'auto';
    }

    if (currentSection.current === 'intro') {
      introRotationRef.current?.play();
    }
    if (currentSection.current === 'hero') {
      heroRotationRef.current?.play();
    }
  };

  return (
    <group ref={wrapperRef}>
      <ShowcasePlatform
        motionRef={podiumMotionRef}
        platformRef={platformRef}
        bodyMaterialRef={platformBodyMaterialRef}
        deckMaterialRef={platformDeckMaterialRef}
        insetMaterialRef={platformInsetMaterialRef}
        rimMaterialRef={platformRimMaterialRef}
      />
      <group ref={brickRef}>
        <group ref={tileIdleRef}>
          <group
            ref={interactiveRef}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <group ref={brandObjectRef}>
              <BrickTile
                position={[0, brandObjectSpec.yOffset, -0.004]}
                scale={brandObjectSpec.scale}
                palette={brandObjectPalette}
                faceImage={brandObjectFaceImage}
                dimensions={brandObjectSpec.dimensions}
                radius={brandObjectSpec.radius}
                faceMaterialRef={brandTileFaceMaterialRef}
                bodyMaterialRef={brandTileBodyMaterialRef}
              />
            </group>
            <group ref={productObjectRef}>
              <BrickTile
                position={[0, productObjectSpec.yOffset, 0.004]}
                scale={productObjectSpec.scale}
                palette={activeProduct.scenePalette}
                faceImage={activeProduct.finishAssets.faceImage}
                dimensions={productObjectSpec.dimensions}
                radius={productObjectSpec.radius}
                faceMaterialRef={tileFaceMaterialRef}
                bodyMaterialRef={tileBodyMaterialRef}
              />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function LightingController() {
  const { currentSection, activeLighting } = useVisualLab();
  const isVisualLab = currentSection === 'visual-lab';
  const isShowcase = currentSection === 'showcase';

  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLight1Ref = useRef<THREE.SpotLight>(null);
  const rimLight2Ref = useRef<THREE.PointLight>(null);
  const showcaseKeyLightRef = useRef<THREE.SpotLight>(null);
  const showcaseFillLightRef = useRef<THREE.DirectionalLight>(null);
  const showcaseRimLightRef = useRef<THREE.SpotLight>(null);

  const targetKeyColor = useRef(new THREE.Color('#fff0e6'));
  const targetFillColor = useRef(new THREE.Color('#e6f0ff'));

  useFrame((_, delta) => {
    let targetKeyIntensity = 2.4;
    targetKeyColor.current.set('#fff0e6');
    let targetFillIntensity = 1.15;
    targetFillColor.current.set('#e6f0ff');
    let targetRim1Intensity = 3.5;
    let targetRim2Intensity = 2.1;
    let targetShowcaseKeyIntensity = 0;
    let targetShowcaseFillIntensity = 0;
    let targetShowcaseRimIntensity = 0;

    if (isVisualLab) {
      if (activeLighting === 'daylight') {
        targetKeyIntensity = 3.5;
        targetKeyColor.current.set('#ffffff');
        targetFillIntensity = 2.0;
        targetFillColor.current.set('#f0f8ff');
        targetRim1Intensity = 1.0;
        targetRim2Intensity = 0.5;
      } else if (activeLighting === 'interior') {
        targetKeyIntensity = 1.5;
        targetKeyColor.current.set('#ffaa66');
        targetFillIntensity = 0.5;
        targetFillColor.current.set('#442211');
        targetRim1Intensity = 3.0;
        targetRim2Intensity = 2.0;
      }
    } else if (isShowcase) {
      targetKeyIntensity = 1.05;
      targetFillIntensity = 0.35;
      targetRim1Intensity = 0.9;
      targetRim2Intensity = 0.45;
      targetShowcaseKeyIntensity = 2.8;
      targetShowcaseFillIntensity = 0.28;
      targetShowcaseRimIntensity = 1.2;
    }

    if (keyLightRef.current) {
      keyLightRef.current.intensity = THREE.MathUtils.damp(keyLightRef.current.intensity, targetKeyIntensity, 4, delta);
      keyLightRef.current.color.lerp(targetKeyColor.current, delta * 4);
    }
    if (fillLightRef.current) {
      fillLightRef.current.intensity = THREE.MathUtils.damp(fillLightRef.current.intensity, targetFillIntensity, 4, delta);
      fillLightRef.current.color.lerp(targetFillColor.current, delta * 4);
    }
    if (rimLight1Ref.current) {
      rimLight1Ref.current.intensity = THREE.MathUtils.damp(rimLight1Ref.current.intensity, targetRim1Intensity, 4, delta);
    }
    if (rimLight2Ref.current) {
      rimLight2Ref.current.intensity = THREE.MathUtils.damp(rimLight2Ref.current.intensity, targetRim2Intensity, 4, delta);
    }
    if (showcaseKeyLightRef.current) {
      showcaseKeyLightRef.current.intensity = THREE.MathUtils.damp(
        showcaseKeyLightRef.current.intensity,
        targetShowcaseKeyIntensity,
        4,
        delta
      );
    }
    if (showcaseFillLightRef.current) {
      showcaseFillLightRef.current.intensity = THREE.MathUtils.damp(
        showcaseFillLightRef.current.intensity,
        targetShowcaseFillIntensity,
        4,
        delta
      );
    }
    if (showcaseRimLightRef.current) {
      showcaseRimLightRef.current.intensity = THREE.MathUtils.damp(
        showcaseRimLightRef.current.intensity,
        targetShowcaseRimIntensity,
        4,
        delta
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight ref={keyLightRef} position={[5, 5, 4]} intensity={2.4} color="#fff0e6" castShadow />
      <directionalLight ref={fillLightRef} position={[-5, -2, 4]} intensity={1.15} color="#e6f0ff" />
      <spotLight ref={rimLight1Ref} position={[-5, 5, -5]} angle={0.6} penumbra={0.5} intensity={3.5} color="#ffffff" />
      <pointLight ref={rimLight2Ref} position={[5, -5, -5]} intensity={2.1} color="#ffccaa" />
      <spotLight
        ref={showcaseKeyLightRef}
        position={[-3.8, 4.2, 4.8]}
        angle={0.42}
        penumbra={0.92}
        intensity={0}
        color="#fff3e8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0002}
      />
      <directionalLight ref={showcaseFillLightRef} position={[0.3, 1.1, 3.9]} intensity={0} color="#cfd5dd" />
      <spotLight
        ref={showcaseRimLightRef}
        position={[3.4, 3.1, -3.6]}
        angle={0.5}
        penumbra={1}
        intensity={0}
        color="#ffffff"
      />
    </>
  );
}

interface ProductSceneProps {
  isCustomizeRoute: boolean;
  introObjectMode: 'tile' | 'brick';
}

export function ProductScene({ isCustomizeRoute, introObjectMode }: ProductSceneProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  return (
    <div className={isCustomizeRoute ? 'fixed inset-0 z-10 pointer-events-auto' : 'homepage-canvas'}>
      <Canvas shadows dpr={[1, 1.6]}>
        <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} fov={45} />
        <SceneCameraController cameraRef={cameraRef} />
        <LightingController />
        <AnimatedBrick isCustomizeRoute={isCustomizeRoute} introObjectMode={introObjectMode} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
