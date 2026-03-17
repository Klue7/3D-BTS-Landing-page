import React, { useMemo, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { createBrickTexture, createBumpTexture } from '../utils/textureGenerator';

export function BrickTile(props: any) {
  const group = useRef<THREE.Group>(null);
  
  const [colorMap, bumpMap] = useMemo(() => {
    return [createBrickTexture(), createBumpTexture()];
  }, []);

  return (
    <group ref={group} {...props}>
      <RoundedBox args={[2.2, 0.73, 0.14]} radius={0.035} smoothness={8}>
        <meshStandardMaterial 
          map={colorMap} 
          bumpMap={bumpMap}
          bumpScale={0.05}
          roughness={0.9}
          metalness={0.05}
          color="#ffffff"
        />
      </RoundedBox>
    </group>
  );
}
