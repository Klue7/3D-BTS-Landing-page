import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { BrickTile } from './BrickTile';
import type { BrickPalette } from '../data/mockData';

interface MiniTileObjectProps {
  faceImage?: string;
  palette: BrickPalette;
  objectMode: 'tile' | 'brick';
}

function MiniTileObject({ faceImage, palette, objectMode }: MiniTileObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dimensions = useMemo<[number, number, number]>(
    () => (objectMode === 'brick' ? [2.34, 0.84, 0.34] : [2.2, 0.73, 0.14]),
    [objectMode]
  );
  const scale = objectMode === 'brick' ? 0.92 : 1.08;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.getElapsedTime();
    const targetY = Math.sin(elapsed * 1.05) * 0.09;
    const targetRotateY = -0.42 + Math.sin(elapsed * 0.65) * 0.22;
    const targetRotateX = -0.06 + Math.cos(elapsed * 0.75) * 0.035;
    const targetRotateZ = Math.sin(elapsed * 0.52) * 0.02;

    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 3.6, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotateY, 3.2, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotateX, 3.2, delta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRotateZ, 3.2, delta);
  });

  return (
    <group ref={groupRef} scale={scale}>
      <BrickTile
        position={[0, objectMode === 'brick' ? -0.03 : 0, 0]}
        palette={palette}
        faceImage={faceImage}
        dimensions={dimensions}
        radius={objectMode === 'brick' ? 0.05 : 0.035}
      />
    </group>
  );
}

interface SelectionBoardMiniTileProps {
  faceImage?: string;
  palette: BrickPalette;
  objectMode?: 'tile' | 'brick';
}

export function SelectionBoardMiniTile({
  faceImage,
  palette,
  objectMode = 'tile',
}: SelectionBoardMiniTileProps) {
  return (
    <div className="pointer-events-none relative h-full w-full">
      <Canvas
        dpr={[1.1, 1.85]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.15]} fov={24} />
        <ambientLight intensity={1.22} color="#f5f7f8" />
        <directionalLight position={[2.8, 3.4, 4.4]} intensity={2.1} color="#fbfcfd" />
        <directionalLight position={[-3.2, -1.6, 2.6]} intensity={0.74} color="#8ac39e" />
        <pointLight position={[0, 0.25, 2.8]} intensity={0.48} color="#ffffff" />
        <MiniTileObject faceImage={faceImage} palette={palette} objectMode={objectMode} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1),transparent_58%)]" />
    </div>
  );
}
