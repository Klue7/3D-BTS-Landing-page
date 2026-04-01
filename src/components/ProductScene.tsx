import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { BrickTile } from './BrickTile';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useVisualLab } from './VisualLabContext';

gsap.registerPlugin(ScrollTrigger);

function AnimatedBrick() {
  const wrapperRef = useRef<THREE.Group>(null);
  const brickRef = useRef<THREE.Group>(null);
  const interactiveRef = useRef<THREE.Group>(null);

  const { setCurrentSection, isCustomizeMode, isEstimating } = useVisualLab();
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

    if (!isCustomizeMode) {
      const sectionsWithRotation = ["#hero", "#product-journey"];
      sectionsWithRotation.forEach(trigger => {
        ScrollTrigger.create({
          trigger: trigger,
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
        ? { position: { x: 0, y: -0.2, z: 0 }, rotation: { x: 0.1, y: 0.3, z: 0 }, scale: { x: 0.85, y: 0.85, z: 0.85 } }
        : { position: { x: 0, y: -0.2, z: 0 }, rotation: { x: 0.1, y: 0.3, z: 0 }, scale: { x: 0.75, y: 0.75, z: 0.75 } };

      const catalogPreset = { position: { x: 0, y: 0, z: -10 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0, y: 0, z: 0 } };

      const journeyPreset = isDesktop
        ? { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0.1, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 } }
        : { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0.1, y: 0, z: 0 }, scale: { x: 1.0, y: 1.0, z: 1.0 } };

      const materialPreset = isDesktop 
        ? { position: { x: 1.8, y: 0, z: 1.5 }, rotation: { x: 0.4, y: -0.8, z: 0.2 }, scale: { x: 1.65, y: 1.65, z: 1.65 } }
        : { position: { x: 0, y: -1.8, z: 1.2 }, rotation: { x: 0.4, y: -0.8, z: 0.2 }, scale: { x: 1.35, y: 1.35, z: 1.35 } };

      const deliveryPreset = isDesktop
        ? { position: { x: -1.8, y: 0, z: 1.5 }, rotation: { x: 0.4, y: 0.8, z: -0.2 }, scale: { x: 1.65, y: 1.65, z: 1.65 } }
        : { position: { x: 0, y: 1.8, z: 1.2 }, rotation: { x: 0.4, y: 0.8, z: -0.2 }, scale: { x: 1.35, y: 1.35, z: 1.35 } };

      const technicalPreset = isDesktop 
        ? { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } }
        : { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 0.9, y: 0.9, z: 0.9 } };

      const showcasePreset = isDesktop 
        ? { position: { x: 0, y: -0.8, z: 1.5 }, rotation: { x: 0.2, y: -0.4, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 } }
        : { position: { x: 0, y: -0.5, z: 1 }, rotation: { x: 0.2, y: 0.6, z: -0.1 }, scale: { x: 1.2, y: 1.2, z: 1.2 } };

      const visualLabPreset = isDesktop 
        ? { position: { x: 3, y: -1.5, z: 0 }, rotation: { x: 0.2, y: -0.4, z: 0 }, scale: { x: 0.6, y: 0.6, z: 0.6 } }
        : { position: { x: 0.8, y: -1.5, z: 0 }, rotation: { x: 0.2, y: -0.4, z: 0 }, scale: { x: 0.5, y: 0.5, z: 0.5 } };

      const footerPreset = isDesktop
        ? { position: { x: 0, y: 0, z: 2 }, rotation: { x: 0.5, y: 0, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1.5 } }
        : { position: { x: 0, y: 0, z: 1.5 }, rotation: { x: 0.5, y: 0, z: 0 }, scale: { x: 1.2, y: 1.2, z: 1.2 } };

      if (isCustomizeMode) {
        gsap.to(brick.position, { ...visualLabPreset.position, duration: 1.2, ease: "power3.inOut" });
        gsap.to(brick.rotation, { ...visualLabPreset.rotation, duration: 1.2, ease: "power3.inOut" });
        gsap.to(brick.scale, { ...visualLabPreset.scale, duration: 1.2, ease: "power3.inOut" });
        setCurrentSection('visual-lab');
        heroRotationRef.current?.pause();
        heroFloat.pause();
        return;
      }

      // Reset initial state for Hero (Centered premium reveal)
      gsap.to(brick.position, { ...heroPreset.position, duration: 1, ease: "power2.out" });
      gsap.to(brick.rotation, { ...heroPreset.rotation, duration: 1, ease: "power2.out" });
      gsap.to(brick.scale, { ...heroPreset.scale, duration: 1, ease: "power2.out" });

      // 1. Hero -> Catalog
      const tl0 = gsap.timeline({
        scrollTrigger: {
          trigger: "#catalog",
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onUpdate: getUpdateHandler('hero', 'catalog')
        }
      });
      tl0.to(brick.position, { ...catalogPreset.position, ease: "power2.inOut" }, 0);
      tl0.to(brick.rotation, { ...catalogPreset.rotation, ease: "power2.inOut" }, 0);
      tl0.to(brick.scale, { ...catalogPreset.scale, ease: "power2.inOut" }, 0);

      // 1.2 Catalog -> Product Journey
      const tl05 = gsap.timeline({
        scrollTrigger: {
          trigger: "#product-journey",
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onUpdate: getUpdateHandler('catalog', 'journey')
        }
      });
      tl05.to(brick.position, { ...journeyPreset.position, ease: "power2.inOut", immediateRender: false }, 0);
      tl05.to(brick.rotation, { ...journeyPreset.rotation, ease: "power2.inOut", immediateRender: false }, 0);
      tl05.to(brick.scale, { ...journeyPreset.scale, ease: "power2.inOut", immediateRender: false }, 0);

      // 1.5 Product Journey -> Material Story
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: "#material-story",
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onUpdate: getUpdateHandler('journey', 'material')
        }
      });
      tl1.to(brick.position, { ...materialPreset.position, ease: "power2.inOut", immediateRender: false }, 0);
      tl1.to(brick.rotation, { ...materialPreset.rotation, ease: "power2.inOut", immediateRender: false }, 0);
      tl1.to(brick.scale, { ...materialPreset.scale, ease: "power2.inOut", immediateRender: false }, 0);

      // 1.8 Material Story -> Delivery Process
      const tl1_8 = gsap.timeline({
        scrollTrigger: {
          trigger: "#delivery-process",
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onUpdate: getUpdateHandler('material', 'delivery')
        }
      });
      tl1_8.to(brick.position, { ...deliveryPreset.position, ease: "power2.inOut", immediateRender: false }, 0);
      tl1_8.to(brick.rotation, { ...deliveryPreset.rotation, ease: "power2.inOut", immediateRender: false }, 0);
      tl1_8.to(brick.scale, { ...deliveryPreset.scale, ease: "power2.inOut", immediateRender: false }, 0);

      // 1.9 Delivery Process -> Technical Spotlight
      const tl1_9 = gsap.timeline({
        scrollTrigger: {
          trigger: "#technical-spotlight",
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onUpdate: getUpdateHandler('delivery', 'technical')
        }
      });
      tl1_9.to(brick.position, { ...technicalPreset.position, ease: "power2.inOut", immediateRender: false }, 0);
      tl1_9.to(brick.rotation, { ...technicalPreset.rotation, ease: "power2.inOut", immediateRender: false }, 0);
      tl1_9.to(brick.scale, { ...technicalPreset.scale, ease: "power2.inOut", immediateRender: false }, 0);

      // 2. Technical Spotlight -> Showcase
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: "#showcase",
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onUpdate: getUpdateHandler('technical', 'showcase')
        }
      });
      
      // Tile comes out and scales up
      tl2.to(brick.position, { ...showcasePreset.position, ease: "power2.inOut", immediateRender: false }, 0);
      tl2.to(brick.rotation, { ...showcasePreset.rotation, ease: "power2.inOut", immediateRender: false }, 0);
      tl2.to(brick.scale, { ...showcasePreset.scale, ease: "power2.inOut", immediateRender: false }, 0);

      // 4. Top Sellers -> Footer
      const tl4 = gsap.timeline({
        scrollTrigger: {
          trigger: "#footer",
          start: "top bottom",
          end: "center center",
          scrub: 1,
          onUpdate: getUpdateHandler('showcase', 'footer')
        }
      });
      tl4.to(brick.position, { ...footerPreset.position, ease: "power2.inOut", immediateRender: false }, 0);
      tl4.to(brick.rotation, { ...footerPreset.rotation, ease: "power2.inOut", immediateRender: false }, 0);
      tl4.to(brick.scale, { ...footerPreset.scale, ease: "power2.inOut", immediateRender: false }, 0);
    });

    return () => {
      mm.revert();
      heroRotationRef.current?.kill();
      heroFloat.kill();
    };
  }, [isCustomizeMode, setCurrentSection]);

  useEffect(() => {
    if (!brickRef.current) return;
    const brick = brickRef.current;
    
    const updatePose = () => {
      const isMobile = window.innerWidth < 768;
      
      if (currentSection.current === 'technical') {
        if (isEstimating) {
          // Lateral Flow Pose: Shifted left with parallax
          gsap.to(brick.position, { 
            x: isMobile ? 0 : -3.2, 
            y: isMobile ? 1.4 : 0, 
            z: isMobile ? 0.8 : 0.8, 
            duration: 1.8, 
            ease: "expo.inOut" 
          });
          gsap.to(brick.rotation, { 
            x: isMobile ? 0.4 : 0.1, 
            y: isMobile ? 0.2 : 0.8, 
            z: 0, 
            duration: 1.8, 
            ease: "expo.inOut" 
          });
          gsap.to(brick.scale, { 
            x: isMobile ? 0.6 : 0.65, 
            y: isMobile ? 0.6 : 0.65, 
            z: isMobile ? 0.6 : 0.65, 
            duration: 1.8, 
            ease: "expo.inOut" 
          });
        } else {
          // Return to Specs Pose
          gsap.to(brick.position, { x: 0, y: 0, z: 0, duration: 1.6, ease: "expo.out" });
          gsap.to(brick.rotation, { x: 0, y: 0, z: 0, duration: 1.6, ease: "expo.out" });
          gsap.to(brick.scale, { x: isMobile ? 0.9 : 1, y: isMobile ? 0.9 : 1, z: isMobile ? 0.9 : 1, duration: 1.6, ease: "expo.out" });
        }
      }
    };

    updatePose();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updatePose);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updatePose);
      }
    };
  }, [isEstimating]);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    isHovered.current = true;
    if (isTransitioning.current) return;
    if (currentSection.current !== 'hero') return;
    if (!isDragging.current) document.body.style.cursor = 'grab';
  };

  const handlePointerOut = (e: any) => {
    isHovered.current = false;
    if (isDragging.current) return;
    document.body.style.cursor = 'auto';
  };

  const handlePointerDown = (e: any) => {
    if (isTransitioning.current) return;
    if (currentSection.current !== 'hero') return;
    
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
    
    if (isHovered.current && !isTransitioning.current && currentSection.current === 'hero') {
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
    } else {
      // Dynamic lighting based on section
      if (currentSection === 'catalog') {
        targetKeyIntensity = 0;
        targetFillIntensity = 0;
        targetRim1Intensity = 0;
        targetRim2Intensity = 0;
      } else if (currentSection === 'journey') {
        targetKeyIntensity = 3.5;
        targetKeyColor.current.set("#ffffff");
        targetFillIntensity = 1.5;
        targetFillColor.current.set("#f0f8ff");
        targetRim1Intensity = 2.0;
        targetRim2Intensity = 1.0;
      } else if (currentSection === 'material') {
        targetKeyIntensity = 4.0;
        targetKeyColor.current.set("#ffffff");
        targetFillIntensity = 2.0;
        targetFillColor.current.set("#f0f8ff");
        targetRim1Intensity = 1.0;
        targetRim2Intensity = 0.5;
      } else if (currentSection === 'delivery') {
        targetKeyIntensity = 4.0;
        targetKeyColor.current.set("#ffffff");
        targetFillIntensity = 1.0;
        targetFillColor.current.set("#f0f8ff");
        targetRim1Intensity = 3.0;
        targetRim2Intensity = 1.0;
      } else if (currentSection === 'technical') {
        targetKeyIntensity = 3.5;
        targetKeyColor.current.set("#ffffff");
        targetFillIntensity = 1.5;
        targetFillColor.current.set("#f0f8ff");
        targetRim1Intensity = 2.0;
        targetRim2Intensity = 1.0;
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

export function ProductScene() {
  const cameraRef = useRef<any>(null);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      <Canvas shadows dpr={[1, 2]} eventSource={document.getElementById('root') || undefined} eventPrefix="client">
        <Suspense fallback={null}>
          <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} fov={45} />
          
          <LightingController />
          
          <AnimatedBrick />
        </Suspense>
      </Canvas>
    </div>
  );
}
