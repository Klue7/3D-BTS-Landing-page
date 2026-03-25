import React, { useMemo, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { createBrickTexture, createBumpTexture } from '../utils/textureGenerator';
import { useVisualLab } from './VisualLabContext';
import { useFrame } from '@react-three/fiber';

export function BrickTile(props: any) {
  const group = useRef<THREE.Group>(null);
  const { activeCategory, selectedCatalogItem } = useVisualLab();
  const meshRef = useRef<any>(null);
  
  const [colorMap, bumpMap] = useMemo(() => {
    return [createBrickTexture(), createBumpTexture()];
  }, []);

  // Target depth based on category
  const targetDepth = activeCategory === 'clay-bricks' ? 1.0 : 0.14;
  const tileColor = selectedCatalogItem?.color || "#ffffff";

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smoothly animate the depth (z-scale)
      meshRef.current.scale.z = THREE.MathUtils.damp(
        meshRef.current.scale.z,
        targetDepth / 0.14, // Scale relative to base depth
        4,
        delta
      );
    }
  });

  return (
    <group ref={group} {...props}>
      <group ref={meshRef}>
        <RoundedBox args={[2.2, 0.73, 0.14]} radius={0.035} smoothness={8}>
          <meshStandardMaterial 
            map={colorMap} 
            bumpMap={bumpMap}
            bumpScale={0.05}
            roughness={0.9}
            metalness={0.05}
            color={tileColor}
          />
        </RoundedBox>
      </group>
    </group>
  );
}
