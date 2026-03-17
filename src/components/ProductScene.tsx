import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { BrickTile } from './BrickTile';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useVisualLab } from './VisualLabContext';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedBrickProps {
  isCustomizeRoute: boolean;
}

function AnimatedBrick({ isCustomizeRoute }: AnimatedBrickProps) {
  const wrapperRef = useRef<THREE.Group>(null);
  const brickRef = useRef<THREE.Group>(null);
  const interactiveRef = useRef<THREE.Group>(null);

  const { setCurrentSection } = useVisualLab();
  const currentSection = useRef('hero');
  const isTransitioning = useRef(false);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const heroRotationRef = useRef<gsap.core.Tween | null>(null);

  useFrame((state, delta) => {
    if (!interactiveRef.current) return;
    
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
    if (!wrapperRef.current || !brickRef.current) return;
    const wrapper = wrapperRef.current;
    const brick = brickRef.current;

    let mm = gsap.matchMedia();
    let heroTrigger: ScrollTrigger | null = null;

    // Continuous slow rotation in Hero (applied to wrapper)
    heroRotationRef.current = gsap.to(wrapper.rotation, {
      y: 0.15,
      x: 0.05,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      paused: true
    });
    const heroFloat = gsap.to(wrapper.position, {
      y: 0.1,
      duration: 3.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      paused: true
    });

    if (!isCustomizeRoute) {
      heroTrigger = ScrollTrigger.create({
        trigger: "#hero",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => { 
          if (!isDragging.current) heroRotationRef.current?.play(); 
          heroFloat.play(); 
        },
        onLeave: () => { heroRotationRef.current?.pause(); heroFloat.pause(); },
        onEnterBack: () => { 
          if (!isDragging.current) heroRotationRef.current?.play(); 
          heroFloat.play(); 
        },
        onLeaveBack: () => { heroRotationRef.current?.pause(); heroFloat.pause(); },
      });
    }

    const getUpdateHandler = (prevSection: string, nextSection: string) => (self: any) => {
      if (self.progress > 0 && self.progress < 1) {
        isTransitioning.current = true;
        if (isDragging.current) {
          isDragging.current = false;
          targetRotation.current = { x: 0, y: 0 };
          document.body.style.cursor = 'auto';
        }
      } else {
        isTransitioning.current = false;
        const newSection = self.progress === 0 ? prevSection : nextSection;
        if (currentSection.current !== newSection) {
          currentSection.current = newSection;
          setCurrentSection(newSection);
        }
      }
    };

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      let { isDesktop } = context.conditions as any;

      const heroPreset = isDesktop 
        ? { position: { x: 0, y: -0.2, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.85, y: 0.85, z: 0.85 } }
        : { position: { x: 0, y: -0.2, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.75, y: 0.75, z: 0.75 } };

      const materialPreset = isDesktop 
        ? { position: { x: 1.8, y: 0, z: 1.5 }, rotation: { x: 0.4, y: -0.8, z: 0.2 }, scale: { x: 2.2, y: 2.2, z: 2.2 } }
        : { position: { x: 0, y: -1.8, z: 1.2 }, rotation: { x: 0.4, y: -0.8, z: 0.2 }, scale: { x: 1.8, y: 1.8, z: 1.8 } };

      const technicalPreset = isDesktop 
        ? { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
        : { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 0.9, z: 0.9 } };

      const showcasePreset = isDesktop 
        ? { position: { x: 0.2, y: -1.5, z: 1.5 }, rotation: { x: 0.2, y: -0.4, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 } }
        : { position: { x: 0, y: -1.5, z: 1 }, rotation: { x: 0.2, y: 0.6, z: -0.1 }, scale: { x: 1.2, y: 1.2, z: 1.2 } };

      const visualLabPreset = isDesktop 
        ? { position: { x: 3, y: -1.5, z: 0 }, rotation: { x: 0.2, y: -0.4, z: 0 }, scale: { x: 0.6, y: 0.6, z: 0.6 } }
        : { position: { x: 0.8, y: -1.5, z: 0 }, rotation: { x: 0.2, y: -0.4, z: 0 }, scale: { x: 0.5, y: 0.5, z: 0.5 } };

      const relatedPreset = isDesktop
        ? { position: { x: -2.2, y: -1.6, z: 1.2 }, rotation: { x: 0.18, y: 0.8, z: -0.08 }, scale: { x: 0.95, y: 0.95, z: 0.95 } }
        : { position: { x: 0, y: -1.65, z: 0.8 }, rotation: { x: 0.2, y: 0.65, z: -0.06 }, scale: { x: 0.95, y: 0.95, z: 0.95 } };

      if (isCustomizeRoute) {
        gsap.to(brick.position, { ...visualLabPreset.position, duration: 1.2, ease: "power3.inOut" });
        gsap.to(brick.rotation, { ...visualLabPreset.rotation, duration: 1.2, ease: "power3.inOut" });
        gsap.to(brick.scale, { ...visualLabPreset.scale, duration: 1.2, ease: "power3.inOut" });
        setCurrentSection('visual-lab');
        currentSection.current = 'visual-lab';
        heroRotationRef.current?.pause();
        heroFloat.pause();
        return;
      }

      // Reset initial state for Hero (Centered premium reveal)
      currentSection.current = 'hero';
      setCurrentSection('hero');
      gsap.to(brick.position, { ...heroPreset.position, duration: 1, ease: "power2.out" });
      gsap.to(brick.rotation, { ...heroPreset.rotation, duration: 1, ease: "power2.out" });
      gsap.to(brick.scale, { ...heroPreset.scale, duration: 1, ease: "power2.out" });

      // 1. Hero -> Material Story
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: "#material-story",
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onUpdate: getUpdateHandler('hero', 'material')
        }
      });
      tl1.to(brick.position, { ...materialPreset.position, ease: "power2.inOut" }, 0);
      tl1.to(brick.rotation, { ...materialPreset.rotation, ease: "power2.inOut" }, 0);
      tl1.to(brick.scale, { ...materialPreset.scale, ease: "power2.inOut" }, 0);

      // 2. Material Story -> Technical Spotlight
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: "#technical-spotlight",
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onUpdate: getUpdateHandler('material', 'technical')
        }
      });
      tl2.to(brick.position, { ...technicalPreset.position, ease: "power2.inOut", immediateRender: false }, 0);
      tl2.to(brick.rotation, { ...technicalPreset.rotation, ease: "power2.inOut", immediateRender: false }, 0);
      tl2.to(brick.scale, { ...technicalPreset.scale, ease: "power2.inOut", immediateRender: false }, 0);

      // 3. Technical Spotlight -> Showcase
      const tl3 = gsap.timeline({
        scrollTrigger: {
          trigger: "#showcase",
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onUpdate: getUpdateHandler('technical', 'showcase')
        }
      });
      tl3.to(brick.position, { ...showcasePreset.position, ease: "power2.inOut", immediateRender: false }, 0);
      tl3.to(brick.rotation, { ...showcasePreset.rotation, ease: "power2.inOut", immediateRender: false }, 0);
      tl3.to(brick.scale, { ...showcasePreset.scale, ease: "power2.inOut", immediateRender: false }, 0);

      // 4. Showcase -> Related Products
      const tl4 = gsap.timeline({
        scrollTrigger: {
          trigger: "#related-products",
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onUpdate: getUpdateHandler('showcase', 'related')
        }
      });
      tl4.to(brick.position, { ...relatedPreset.position, ease: "power2.inOut", immediateRender: false }, 0);
      tl4.to(brick.rotation, { ...relatedPreset.rotation, ease: "power2.inOut", immediateRender: false }, 0);
      tl4.to(brick.scale, { ...relatedPreset.scale, ease: "power2.inOut", immediateRender: false }, 0);
    });

    return () => {
      heroTrigger?.kill();
      mm.revert();
      heroRotationRef.current?.kill();
      heroFloat.kill();
    };
  }, [isCustomizeRoute, setCurrentSection]);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    isHovered.current = true;
    if (isTransitioning.current) return;
    if (currentSection.current !== 'hero' && currentSection.current !== 'technical') return;
    if (!isDragging.current) document.body.style.cursor = 'grab';
  };

  const handlePointerOut = (e: any) => {
    isHovered.current = false;
    if (isDragging.current) return;
    document.body.style.cursor = 'auto';
  };

  const handlePointerDown = (e: any) => {
    if (isTransitioning.current) return;
    if (currentSection.current !== 'hero' && currentSection.current !== 'technical') return;
    
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    isDragging.current = true;
    previousPointer.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = 'grabbing';
    
    if (heroRotationRef.current) heroRotationRef.current.pause();
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
    targetRotation.current = { x: 0, y: 0 };
    
    if (isHovered.current && !isTransitioning.current && (currentSection.current === 'hero' || currentSection.current === 'technical')) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'auto';
    }
    
    if (currentSection.current === 'hero' && heroRotationRef.current) {
      heroRotationRef.current.play();
    }
  };

  return (
    <group ref={wrapperRef}>
      <group ref={brickRef}>
        <group 
          ref={interactiveRef}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <BrickTile />
        </group>
      </group>
    </group>
  );
}

function LightingController() {
  const { currentSection, activeLighting } = useVisualLab();
  const isVisualLab = currentSection === 'visual-lab';

  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLight1Ref = useRef<THREE.SpotLight>(null);
  const rimLight2Ref = useRef<THREE.PointLight>(null);

  const targetKeyColor = useRef(new THREE.Color("#fff0e6"));
  const targetFillColor = useRef(new THREE.Color("#e6f0ff"));

  useFrame((state, delta) => {
    // Default lighting values (cinematic)
    let targetKeyIntensity = 2.5;
    targetKeyColor.current.set("#fff0e6");
    let targetFillIntensity = 1.2;
    targetFillColor.current.set("#e6f0ff");
    let targetRim1Intensity = 4;
    let targetRim2Intensity = 2.5;

    if (isVisualLab) {
      if (activeLighting === 'daylight') {
        targetKeyIntensity = 3.5;
        targetKeyColor.current.set("#ffffff");
        targetFillIntensity = 2.0;
        targetFillColor.current.set("#f0f8ff");
        targetRim1Intensity = 1.0;
        targetRim2Intensity = 0.5;
      } else if (activeLighting === 'interior') {
        targetKeyIntensity = 1.5;
        targetKeyColor.current.set("#ffaa66");
        targetFillIntensity = 0.5;
        targetFillColor.current.set("#442211");
        targetRim1Intensity = 3.0;
        targetRim2Intensity = 2.0;
      }
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
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight ref={keyLightRef} position={[5, 5, 4]} intensity={2.5} color="#fff0e6" castShadow />
      <directionalLight ref={fillLightRef} position={[-5, -2, 4]} intensity={1.2} color="#e6f0ff" />
      <spotLight ref={rimLight1Ref} position={[-5, 5, -5]} angle={0.6} penumbra={0.5} intensity={4} color="#ffffff" />
      <pointLight ref={rimLight2Ref} position={[5, -5, -5]} intensity={2.5} color="#ffccaa" />
    </>
  );
}

interface ProductSceneProps {
  isCustomizeRoute: boolean;
}

export function ProductScene({ isCustomizeRoute }: ProductSceneProps) {
  const cameraRef = useRef<any>(null);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} fov={45} />
        
        <LightingController />
        
        <AnimatedBrick isCustomizeRoute={isCustomizeRoute} />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
