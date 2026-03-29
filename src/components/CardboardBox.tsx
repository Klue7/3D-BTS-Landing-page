import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

export const CardboardBox = forwardRef((props: any, ref) => {
  const group = useRef<THREE.Group>(null);
  
  const flapLeft = useRef<THREE.Group>(null);
  const flapRight = useRef<THREE.Group>(null);
  const flapBack = useRef<THREE.Group>(null);
  const flapFront = useRef<THREE.Group>(null);

  useImperativeHandle(ref, () => ({
    get group() { return group.current; },
    get flapLeft() { return flapLeft.current; },
    get flapRight() { return flapRight.current; },
    get flapBack() { return flapBack.current; },
    get flapFront() { return flapFront.current; }
  }));

  // Simple cardboard material
  const cardboardMaterial = new THREE.MeshStandardMaterial({
    color: '#d2b48c', // Tan/cardboard color
    roughness: 0.9,
    metalness: 0.1,
  });

  return (
    <group ref={group} {...props}>
      {/* Bottom */}
      <mesh position={[0, -0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[2, 0.05, 2]} />
        <primitive object={cardboardMaterial} attach="material" />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-0.975, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.05, 1, 2]} />
        <primitive object={cardboardMaterial} attach="material" />
      </mesh>
      {/* Right Wall */}
      <mesh position={[0.975, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.05, 1, 2]} />
        <primitive object={cardboardMaterial} attach="material" />
      </mesh>
      {/* Back Wall */}
      <mesh position={[0, 0, -0.975]} receiveShadow castShadow>
        <boxGeometry args={[1.9, 1, 0.05]} />
        <primitive object={cardboardMaterial} attach="material" />
      </mesh>
      {/* Front Wall */}
      <mesh position={[0, 0, 0.975]} receiveShadow castShadow>
        <boxGeometry args={[1.9, 1, 0.05]} />
        <primitive object={cardboardMaterial} attach="material" />
      </mesh>
      
      {/* Flaps with proper pivots */}
      {/* Left Flap Pivot */}
      <group ref={flapLeft} position={[-1, 0.5, 0]} rotation={[0, 0, Math.PI * 0.7]}>
        <mesh position={[-0.5, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[1, 0.02, 1.9]} />
          <primitive object={cardboardMaterial} attach="material" />
        </mesh>
      </group>
      
      {/* Right Flap Pivot */}
      <group ref={flapRight} position={[1, 0.5, 0]} rotation={[0, 0, -Math.PI * 0.7]}>
        <mesh position={[0.5, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[1, 0.02, 1.9]} />
          <primitive object={cardboardMaterial} attach="material" />
        </mesh>
      </group>

      {/* Back Flap Pivot */}
      <group ref={flapBack} position={[0, 0.5, -1]} rotation={[-Math.PI * 0.7, 0, 0]}>
        <mesh position={[0, 0, -0.5]} receiveShadow castShadow>
          <boxGeometry args={[1.9, 0.02, 1]} />
          <primitive object={cardboardMaterial} attach="material" />
        </mesh>
      </group>

      {/* Front Flap Pivot */}
      <group ref={flapFront} position={[0, 0.5, 1]} rotation={[Math.PI * 0.7, 0, 0]}>
        <mesh position={[0, 0, 0.5]} receiveShadow castShadow>
          <boxGeometry args={[1.9, 0.02, 1]} />
          <primitive object={cardboardMaterial} attach="material" />
        </mesh>
      </group>
    </group>
  );
});
