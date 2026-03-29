import React, { useMemo, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { createBrickTexture, createBumpTexture, createPavingTexture, createPavingBumpTexture } from '../utils/textureGenerator';
import { useVisualLab } from './VisualLabContext';
import { useFrame } from '@react-three/fiber';

export function BrickTile(props: any) {
  const group = useRef<THREE.Group>(null);
  const { activeCategory, selectedCatalogItem } = useVisualLab();
  const meshRef = useRef<any>(null);
  
  const [colorMap, bumpMap, pavingColorMap, pavingBumpMap] = useMemo(() => {
    return [
      createBrickTexture(), 
      createBumpTexture(),
      createPavingTexture(),
      createPavingBumpTexture()
    ];
  }, []);

  console.log('BrickTile rendered, activeCategory:', activeCategory);

  console.log('BrickTile rendered, activeCategory:', activeCategory);

  // Target depth and dimensions based on category
  const targetDepth = activeCategory === 'bricks' ? 1.0 : activeCategory === 'paving' ? 0.5 : 0.14;
  const targetWidth = activeCategory === 'paving' ? 2.0 : 2.2;
  const targetHeight = activeCategory === 'paving' ? 1.0 : 0.73;
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
      // Smoothly animate width and height for paving
      meshRef.current.scale.x = THREE.MathUtils.damp(
        meshRef.current.scale.x,
        targetWidth / 2.2,
        4,
        delta
      );
      meshRef.current.scale.y = THREE.MathUtils.damp(
        meshRef.current.scale.y,
        targetHeight / 0.73,
        4,
        delta
      );
    }
  });

  return (
    <group ref={group} {...props}>
      <group ref={meshRef}>
        <RoundedBox args={[2.2, 0.73, 0.14]} radius={0.035} smoothness={8}>
          {activeCategory === 'paving' ? (
            <meshStandardMaterial 
              map={pavingColorMap} 
              bumpMap={pavingBumpMap}
              bumpScale={0.05}
              roughness={0.9}
              metalness={0.05}
              color={tileColor}
            />
          ) : (
            <meshStandardMaterial 
              map={colorMap} 
              bumpMap={bumpMap}
              bumpScale={0.05}
              roughness={0.9}
              metalness={0.05}
              color={tileColor}
            />
          )}
        </RoundedBox>
      </group>
    </group>
  );
}
