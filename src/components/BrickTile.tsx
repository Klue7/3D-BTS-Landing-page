import React, { useMemo, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { getBrickTextureSet } from '../utils/textureGenerator';
import type { BrickPalette } from '../data/mockData';

const BRICK_TILE_WIDTH = 2.2;
const BRICK_TILE_HEIGHT = 0.73;
const BRICK_TILE_DEPTH = 0.14;

interface BrickTileProps {
  palette: BrickPalette;
  faceImage?: string;
  dimensions?: [number, number, number];
  radius?: number;
  faceMaterialRef?: React.RefObject<THREE.MeshPhysicalMaterial | null>;
  bodyMaterialRef?: React.RefObject<THREE.MeshPhysicalMaterial | null>;
  [key: string]: any;
}

function normalizeFaceTexture(texture: THREE.Texture, width: number, height: number) {
  texture.repeat.set(1 / width, 1 / height);
  texture.offset.set(0, 0);
  texture.needsUpdate = true;
}

export function BrickTile({
  palette,
  faceImage,
  dimensions = [BRICK_TILE_WIDTH, BRICK_TILE_HEIGHT, BRICK_TILE_DEPTH],
  radius = 0.035,
  faceMaterialRef,
  bodyMaterialRef,
  ...props
}: BrickTileProps) {
  const group = useRef<THREE.Group>(null);
  const [width, height, depth] = dimensions;

  const [colorMap, bumpMap, roughnessMap] = useMemo(() => {
    const textures = Object.values(getBrickTextureSet(palette, faceImage));

    textures.forEach((texture) => normalizeFaceTexture(texture, width, height));
    return textures;
  }, [faceImage, height, palette, width]);

  return (
    <group ref={group} {...props}>
      <RoundedBox args={[width, height, depth]} radius={radius} smoothness={8} castShadow receiveShadow>
        <meshPhysicalMaterial
          attach="material-0"
          ref={faceMaterialRef}
          transparent
          opacity={1}
          map={colorMap}
          bumpMap={bumpMap}
          roughnessMap={roughnessMap}
          bumpScale={0.085}
          roughness={0.91}
          metalness={0.01}
          clearcoat={0.02}
          clearcoatRoughness={0.9}
          color="#ffffff"
        />
        <meshPhysicalMaterial
          attach="material-1"
          ref={bodyMaterialRef}
          transparent
          opacity={1}
          color={palette.body}
          roughness={0.97}
          metalness={0.01}
          clearcoat={0.01}
          clearcoatRoughness={0.96}
        />
      </RoundedBox>
    </group>
  );
}
