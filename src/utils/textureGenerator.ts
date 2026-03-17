import * as THREE from 'three';

export function createBrickTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.Texture();

  // Base gradient (warmer center, darker edges)
  const gradient = context.createRadialGradient(512, 256, 0, 512, 256, 600);
  gradient.addColorStop(0, '#5C3A21'); // Muted terracotta
  gradient.addColorStop(0.6, '#3A2315'); // Dark charcoal/brown
  gradient.addColorStop(1, '#1A110B'); // Very dark charcoal

  context.fillStyle = gradient;
  context.fillRect(0, 0, 1024, 512);

  // Add noise for granular texture
  const imageData = context.getImageData(0, 0, 1024, 512);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 50; // Increased noise for more granular contrast
    data[i] = Math.max(0, Math.min(255, data[i] + noise + 10)); // Slight exposure lift
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise + 10));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise + 10));
  }
  context.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createBumpTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.Texture();

  context.fillStyle = '#808080';
  context.fillRect(0, 0, 1024, 512);

  const imageData = context.getImageData(0, 0, 1024, 512);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    // High frequency noise for bump with pits
    const noise = Math.random() * 255;
    const isPit = Math.random() > 0.85; // slightly fewer pits
    const val = isPit ? noise * 0.2 : 160 + noise * 0.3; // deeper pits, more contrast
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = 255;
  }
  context.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
