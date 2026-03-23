import * as THREE from 'three';
import type { BrickPalette } from '../data/mockData';

const BRICK_FACE_TEXTURE_WIDTH = 1536;
const BRICK_FACE_TEXTURE_HEIGHT = 512;
const imageLoadCache = new Map<string, Promise<HTMLImageElement>>();
const cropDataUrlCache = new Map<string, Promise<string>>();
const wallDataUrlCache = new Map<string, Promise<string>>();
const roomCompositeDataUrlCache = new Map<string, Promise<string>>();
let brandTileFaceDataUrlCache: string | null = null;
const brandBrickFaceDataUrlCache = new Map<string, string>();
const brickTextureCache = new Map<string, {
  colorMap: THREE.CanvasTexture;
  bumpMap: THREE.Texture;
  roughnessMap: THREE.Texture;
}>();

const BRAND_MARK_STROKES = [
  { path: 'M102 10 L166 74 L102 138', color: '#8a8a8d', width: 8 },
  { path: 'M34 32 L92 90', color: '#8a8a8d', width: 8 },
  { path: 'M20 46 L78 104', color: '#8a8a8d', width: 8 },
  { path: 'M6 60 L64 118', color: '#8a8a8d', width: 8 },
  { path: 'M24 18 L82 76', color: '#8a8a8d', width: 8 },
  { path: 'M64 32 L122 90 L64 148 L6 90 Z', color: '#fafafa', width: 8 },
  { path: 'M64 88 L94 118 L64 148 L34 118 Z', color: '#fafafa', width: 8 },
] as const;

function hashSeed(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createPrng(seed: number) {
  let state = seed || 1;

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function getPaletteCacheKey(palette: BrickPalette) {
  return [
    palette.highlight,
    palette.mid,
    palette.shadow,
    palette.noise,
    palette.lift,
    palette.ember,
    palette.ash,
    palette.speckLight,
    palette.speckDark,
    palette.body,
    palette.mortar,
  ].join('|');
}

function toRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const safeRadius = Math.min(radius, width * 0.5, height * 0.5);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function createFaceCanvas(
  palette: BrickPalette,
  width: number,
  height: number,
  variantSeed = 0
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return canvas;

  const rng = createPrng(
    hashSeed(
      [
        palette.highlight,
        palette.mid,
        palette.shadow,
        palette.ember,
        palette.ash,
        palette.speckLight,
        palette.speckDark,
        variantSeed,
      ].join('|')
    )
  );

  context.clearRect(0, 0, width, height);

  const baseGradient = context.createLinearGradient(0, 0, width, 0);
  baseGradient.addColorStop(0, palette.shadow);
  baseGradient.addColorStop(0.18, palette.mid);
  baseGradient.addColorStop(0.37, palette.ash);
  baseGradient.addColorStop(0.5, palette.ember);
  baseGradient.addColorStop(0.68, palette.highlight);
  baseGradient.addColorStop(0.82, palette.mid);
  baseGradient.addColorStop(1, palette.shadow);
  context.fillStyle = baseGradient;
  context.fillRect(0, 0, width, height);

  const topAndBottomBurn = context.createLinearGradient(0, 0, 0, height);
  topAndBottomBurn.addColorStop(0, toRgba(palette.speckDark, 0.48));
  topAndBottomBurn.addColorStop(0.16, 'rgba(0,0,0,0)');
  topAndBottomBurn.addColorStop(0.84, 'rgba(0,0,0,0)');
  topAndBottomBurn.addColorStop(1, toRgba(palette.speckDark, 0.42));
  context.fillStyle = topAndBottomBurn;
  context.fillRect(0, 0, width, height);

  const sideFalloff = context.createLinearGradient(0, 0, width, 0);
  sideFalloff.addColorStop(0, toRgba(palette.speckDark, 0.28));
  sideFalloff.addColorStop(0.1, 'rgba(0,0,0,0)');
  sideFalloff.addColorStop(0.9, 'rgba(0,0,0,0)');
  sideFalloff.addColorStop(1, toRgba(palette.speckDark, 0.26));
  context.fillStyle = sideFalloff;
  context.fillRect(0, 0, width, height);

  context.save();
  context.filter = `blur(${Math.max(12, width * 0.025)}px)`;
  context.globalAlpha = 0.26;
  for (let index = 0; index < 6; index += 1) {
    const centerX = width * (0.22 + rng() * 0.56);
    const centerY = height * (0.32 + rng() * 0.36);
    const radius = width * (0.08 + rng() * 0.12);
    const bloom = context.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius);
    bloom.addColorStop(0, toRgba(index % 2 === 0 ? palette.ember : palette.highlight, 0.9));
    bloom.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = bloom;
    context.beginPath();
    context.ellipse(centerX, centerY, radius, radius * (0.32 + rng() * 0.24), rng() * Math.PI, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();

  context.globalAlpha = 0.11;
  for (let y = 1; y < height; y += 2) {
    const thickness = 0.6 + rng() * 0.7;
    context.fillStyle = rng() > 0.5 ? toRgba(palette.speckDark, 0.7) : toRgba(palette.speckLight, 0.5);
    context.fillRect(0, y, width, thickness);
  }
  context.globalAlpha = 1;

  const mottledCount = Math.floor((width * height) / 4200);
  for (let index = 0; index < mottledCount; index += 1) {
    const x = rng() * width;
    const y = rng() * height;
    const radius = 6 + rng() * 18;
    const tint = rng() > 0.58 ? palette.ash : rng() > 0.35 ? palette.mid : palette.ember;
    const patch = context.createRadialGradient(x, y, radius * 0.18, x, y, radius);
    patch.addColorStop(0, toRgba(tint, 0.22));
    patch.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = patch;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const speckCount = Math.floor((width * height) / 24);
  for (let index = 0; index < speckCount; index += 1) {
    const x = rng() * width;
    const y = rng() * height;
    const radius = 0.35 + rng() * 1.9;
    const colorRoll = rng();
    let color = palette.speckDark;
    let alpha = 0.2 + rng() * 0.26;

    if (colorRoll > 0.72) {
      color = palette.speckLight;
      alpha = 0.18 + rng() * 0.2;
    } else if (colorRoll > 0.44) {
      color = palette.ash;
      alpha = 0.18 + rng() * 0.18;
    }

    context.fillStyle = toRgba(color, alpha);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const poreCount = Math.floor((width * height) / 980);
  for (let index = 0; index < poreCount; index += 1) {
    const x = rng() * width;
    const y = rng() * height;
    const radius = 0.7 + rng() * 2.8;

    context.fillStyle = toRgba(palette.speckDark, 0.18 + rng() * 0.16);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  return canvas;
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  width: number,
  height: number
) {
  const sourceWidth = image instanceof HTMLImageElement ? image.naturalWidth || image.width : (image as HTMLCanvasElement).width;
  const sourceHeight = image instanceof HTMLImageElement ? image.naturalHeight || image.height : (image as HTMLCanvasElement).height;

  if (!sourceWidth || !sourceHeight) return;

  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = width / height;

  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (sourceAspect > targetAspect) {
    drawHeight = height;
    drawWidth = drawHeight * sourceAspect;
    offsetX = (width - drawWidth) * 0.5;
  } else {
    drawWidth = width;
    drawHeight = drawWidth / sourceAspect;
    offsetY = (height - drawHeight) * 0.5;
  }

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

function createCanvasTexture(canvas: HTMLCanvasElement, colorSpace?: THREE.ColorSpace) {
  const texture = new THREE.CanvasTexture(canvas);
  if (colorSpace) {
    texture.colorSpace = colorSpace;
  }
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 4;
  return texture;
}

function drawBrandMark(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  targetWidth: number,
  targetHeight: number
) {
  const viewBoxWidth = 172;
  const viewBoxHeight = 160;
  const scale = Math.min(targetWidth / viewBoxWidth, targetHeight / viewBoxHeight);
  const offsetX = centerX - (viewBoxWidth * scale) * 0.5;
  const offsetY = centerY - (viewBoxHeight * scale) * 0.5;

  context.save();
  context.translate(offsetX, offsetY);
  context.scale(scale, scale);
  context.lineCap = 'square';
  context.lineJoin = 'miter';

  BRAND_MARK_STROKES.forEach((stroke) => {
    context.beginPath();
    context.strokeStyle = stroke.color;
    context.lineWidth = stroke.width;
    context.stroke(new Path2D(stroke.path));
  });

  context.restore();
}

function drawBrandMarkMonochrome(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  targetWidth: number,
  targetHeight: number,
  color: string,
  alpha = 1
) {
  const viewBoxWidth = 172;
  const viewBoxHeight = 160;
  const scale = Math.min(targetWidth / viewBoxWidth, targetHeight / viewBoxHeight);
  const offsetX = centerX - (viewBoxWidth * scale) * 0.5;
  const offsetY = centerY - (viewBoxHeight * scale) * 0.5;

  context.save();
  context.translate(offsetX, offsetY);
  context.scale(scale, scale);
  context.lineCap = 'square';
  context.lineJoin = 'miter';
  context.globalAlpha = alpha;

  BRAND_MARK_STROKES.forEach((stroke) => {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = stroke.width;
    context.stroke(new Path2D(stroke.path));
  });

  context.restore();
}

function hydrateTextureFromImage(
  imageSrc: string | undefined,
  canvas: HTMLCanvasElement,
  texture: THREE.CanvasTexture,
  painter: (context: CanvasRenderingContext2D, image: HTMLImageElement) => void
) {
  if (!imageSrc) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  loadImageAsync(imageSrc)
    .then((image) => {
      painter(context, image);
      texture.needsUpdate = true;
    })
    .catch(() => {
      // Keep the procedural fallback texture if the asset cannot be loaded.
    });
}

function loadImageAsync(imageSrc: string) {
  const cached = imageLoadCache.get(imageSrc);
  if (cached) return cached;

  const nextPromise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${imageSrc}`));
    image.src = imageSrc;
  });

  imageLoadCache.set(imageSrc, nextPromise);
  return nextPromise;
}

function paintColorMapFromImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  palette: BrickPalette,
  width: number,
  height: number
) {
  context.clearRect(0, 0, width, height);
  context.filter = 'saturate(1.04) contrast(1.08) brightness(0.98)';
  drawImageCover(context, image, width, height);
  context.filter = 'none';

  const firedEdge = context.createLinearGradient(0, 0, width, 0);
  firedEdge.addColorStop(0, toRgba(palette.shadow, 0.22));
  firedEdge.addColorStop(0.12, 'rgba(0,0,0,0)');
  firedEdge.addColorStop(0.88, 'rgba(0,0,0,0)');
  firedEdge.addColorStop(1, toRgba(palette.shadow, 0.18));
  context.fillStyle = firedEdge;
  context.fillRect(0, 0, width, height);

  const topBottomBurn = context.createLinearGradient(0, 0, 0, height);
  topBottomBurn.addColorStop(0, toRgba(palette.speckDark, 0.26));
  topBottomBurn.addColorStop(0.18, 'rgba(0,0,0,0)');
  topBottomBurn.addColorStop(0.82, 'rgba(0,0,0,0)');
  topBottomBurn.addColorStop(1, toRgba(palette.speckDark, 0.24));
  context.fillStyle = topBottomBurn;
  context.fillRect(0, 0, width, height);
}

function paintDerivedMapFromImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  mapper: (luminance: number) => number
) {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempContext = tempCanvas.getContext('2d');
  if (!tempContext) return;

  tempContext.clearRect(0, 0, width, height);
  tempContext.filter = 'grayscale(1) contrast(1.24) brightness(1.02)';
  drawImageCover(tempContext, image, width, height);
  tempContext.filter = 'none';

  const imageData = tempContext.getImageData(0, 0, width, height);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const luminance = data[index];
    const mapped = mapper(luminance);
    data[index] = mapped;
    data[index + 1] = mapped;
    data[index + 2] = mapped;
    data[index + 3] = 255;
  }

  context.clearRect(0, 0, width, height);
  context.putImageData(imageData, 0, 0);
}

export function createBrickTexture(palette: BrickPalette, imageSrc?: string) {
  const canvas = createFaceCanvas(palette, BRICK_FACE_TEXTURE_WIDTH, BRICK_FACE_TEXTURE_HEIGHT);
  const texture = createCanvasTexture(canvas, THREE.SRGBColorSpace);
  hydrateTextureFromImage(imageSrc, canvas, texture, (context, image) => {
    paintColorMapFromImage(context, image, palette, canvas.width, canvas.height);
  });
  return texture;
}

export function createBumpTexture(palette: BrickPalette, imageSrc?: string) {
  const canvas = document.createElement('canvas');
  canvas.width = BRICK_FACE_TEXTURE_WIDTH;
  canvas.height = BRICK_FACE_TEXTURE_HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.Texture();

  const rng = createPrng(hashSeed(`${palette.shadow}|${palette.highlight}|bump`));

  context.fillStyle = '#8f8f8f';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 0.2;
  for (let y = 0; y < canvas.height; y += 3) {
    context.fillStyle = rng() > 0.5 ? '#7a7a7a' : '#a2a2a2';
    context.fillRect(0, y, canvas.width, 0.8 + rng() * 0.8);
  }

  context.globalAlpha = 1;
  const poreCount = 1850;
  for (let index = 0; index < poreCount; index += 1) {
    const x = rng() * canvas.width;
    const y = rng() * canvas.height;
    const radius = 0.5 + rng() * 2.6;
    const value = Math.floor(58 + rng() * 84);
    context.fillStyle = `rgb(${value},${value},${value})`;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const ridgeCount = 420;
  for (let index = 0; index < ridgeCount; index += 1) {
    const x = rng() * canvas.width;
    const y = rng() * canvas.height;
    const width = 18 + rng() * 78;
    const height = 1 + rng() * 2;
    const value = Math.floor(148 + rng() * 50);
    context.fillStyle = `rgba(${value},${value},${value},0.55)`;
    context.fillRect(x, y, width, height);
  }

  const texture = createCanvasTexture(canvas);
  hydrateTextureFromImage(imageSrc, canvas, texture, (imageContext, image) => {
    paintDerivedMapFromImage(imageContext, image, canvas.width, canvas.height, (luminance) => {
      return THREE.MathUtils.clamp((luminance - 114) * 1.5 + 128, 24, 236);
    });
  });
  return texture;
}

export function createRoughnessTexture(palette: BrickPalette, imageSrc?: string) {
  const canvas = document.createElement('canvas');
  canvas.width = BRICK_FACE_TEXTURE_WIDTH;
  canvas.height = BRICK_FACE_TEXTURE_HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.Texture();

  const rng = createPrng(hashSeed(`${palette.highlight}|${palette.mid}|roughness`));
  context.fillStyle = '#d6d6d6';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const smoothBand = context.createLinearGradient(0, 0, canvas.width, 0);
  smoothBand.addColorStop(0, 'rgba(255,255,255,0)');
  smoothBand.addColorStop(0.28, 'rgba(255,255,255,0.1)');
  smoothBand.addColorStop(0.52, 'rgba(64,64,64,0.3)');
  smoothBand.addColorStop(0.72, 'rgba(255,255,255,0.08)');
  smoothBand.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = smoothBand;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 2200; index += 1) {
    const x = rng() * canvas.width;
    const y = rng() * canvas.height;
    const radius = 0.45 + rng() * 1.8;
    const value = Math.floor(120 + rng() * 110);
    context.fillStyle = `rgba(${value},${value},${value},0.28)`;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const texture = createCanvasTexture(canvas);
  hydrateTextureFromImage(imageSrc, canvas, texture, (imageContext, image) => {
    paintDerivedMapFromImage(imageContext, image, canvas.width, canvas.height, (luminance) => {
      return THREE.MathUtils.clamp(166 + (255 - luminance) * 0.34, 134, 246);
    });
  });
  return texture;
}

export function getBrickTextureSet(palette: BrickPalette, imageSrc?: string) {
  const cacheKey = `${getPaletteCacheKey(palette)}|${imageSrc ?? 'procedural'}`;
  const cachedSet = brickTextureCache.get(cacheKey);

  if (cachedSet) {
    return cachedSet;
  }

  const nextSet = {
    colorMap: createBrickTexture(palette, imageSrc),
    bumpMap: createBumpTexture(palette, imageSrc),
    roughnessMap: createRoughnessTexture(palette, imageSrc),
  };

  brickTextureCache.set(cacheKey, nextSet);
  return nextSet;
}

export function preloadImageAsset(imageSrc?: string) {
  if (!imageSrc) return Promise.resolve(null);

  return loadImageAsync(imageSrc).then(async (image) => {
    if ('decode' in image && typeof image.decode === 'function') {
      try {
        await image.decode();
      } catch {
        // Browsers can reject decode() when the image is already usable. Ignore and continue.
      }
    }

    return image;
  });
}

export function createBrandTileFaceDataUrl() {
  if (brandTileFaceDataUrlCache) {
    return brandTileFaceDataUrlCache;
  }

  const canvas = document.createElement('canvas');
  canvas.width = BRICK_FACE_TEXTURE_WIDTH;
  canvas.height = BRICK_FACE_TEXTURE_HEIGHT;

  const context = canvas.getContext('2d');
  if (!context) return '';

  const width = canvas.width;
  const height = canvas.height;

  context.fillStyle = '#050608';
  context.fillRect(0, 0, width, height);

  const faceGradient = context.createLinearGradient(0, 0, width, 0);
  faceGradient.addColorStop(0, '#090a0c');
  faceGradient.addColorStop(0.16, '#111418');
  faceGradient.addColorStop(0.5, '#181d21');
  faceGradient.addColorStop(0.84, '#101317');
  faceGradient.addColorStop(1, '#08090b');
  context.fillStyle = faceGradient;
  context.fillRect(0, 0, width, height);

  const topBloom = context.createLinearGradient(0, 0, 0, height);
  topBloom.addColorStop(0, 'rgba(255,255,255,0.06)');
  topBloom.addColorStop(0.18, 'rgba(255,255,255,0.012)');
  topBloom.addColorStop(0.52, 'rgba(255,255,255,0)');
  topBloom.addColorStop(1, 'rgba(0,0,0,0.08)');
  context.fillStyle = topBloom;
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(width * 0.5, height * 0.46, 16, width * 0.5, height * 0.46, width * 0.34);
  glow.addColorStop(0, 'rgba(34,197,94,0.12)');
  glow.addColorStop(0.34, 'rgba(34,197,94,0.035)');
  glow.addColorStop(1, 'rgba(34,197,94,0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'rgba(255,255,255,0.065)';
  context.lineWidth = 2;
  drawRoundedRect(context, 34, 34, width - 68, height - 68, 42);
  context.stroke();

  context.strokeStyle = 'rgba(34,197,94,0.18)';
  context.lineWidth = 3;
  drawRoundedRect(context, 104, 104, width - 208, height - 208, 24);
  context.stroke();

  context.fillStyle = 'rgba(255,255,255,0.04)';
  context.fillRect(146, height * 0.5, width - 292, 1);

  drawBrandMark(context, width * 0.5, height * 0.43, 206, 206);

  context.textAlign = 'center';
  context.fillStyle = '#f5f3f2';
  context.font = '700 46px Inter, sans-serif';
  context.fillText('BRICK TILE SHOP', width * 0.5, height * 0.77);

  brandTileFaceDataUrlCache = canvas.toDataURL('image/png');
  return brandTileFaceDataUrlCache;
}

export function createBrandBrickFaceDataUrl(palette: BrickPalette) {
  const cacheKey = getPaletteCacheKey(palette);
  const cached = brandBrickFaceDataUrlCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const canvas = createFaceCanvas(palette, BRICK_FACE_TEXTURE_WIDTH, BRICK_FACE_TEXTURE_HEIGHT, 21);
  const context = canvas.getContext('2d');
  if (!context) return '';

  const width = canvas.width;
  const height = canvas.height;

  // Keep the branded brick face materially consistent with the clay body.
  const clayWash = context.createLinearGradient(0, 0, width, 0);
  clayWash.addColorStop(0, toRgba(palette.mid, 0.18));
  clayWash.addColorStop(0.5, toRgba(palette.highlight, 0.12));
  clayWash.addColorStop(1, toRgba(palette.mid, 0.18));
  context.fillStyle = clayWash;
  context.fillRect(0, 0, width, height);

  const centerGlow = context.createRadialGradient(width * 0.5, height * 0.48, 18, width * 0.5, height * 0.48, width * 0.26);
  centerGlow.addColorStop(0, toRgba(palette.highlight, 0.16));
  centerGlow.addColorStop(0.56, toRgba(palette.highlight, 0.04));
  centerGlow.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = centerGlow;
  context.fillRect(0, 0, width, height);

  drawBrandMarkMonochrome(
    context,
    width * 0.5,
    height * 0.43,
    164,
    164,
    palette.shadow,
    0.16
  );

  context.textAlign = 'center';
  context.fillStyle = toRgba(palette.shadow, 0.34);
  context.font = '700 28px Inter, sans-serif';
  context.fillText('BRICK TILE SHOP', width * 0.5, height * 0.74);

  const nextDataUrl = canvas.toDataURL('image/png');
  brandBrickFaceDataUrlCache.set(cacheKey, nextDataUrl);
  return nextDataUrl;
}

export function createBrickBackdropDataUrl(palette: BrickPalette) {
  const width = 1440;
  const height = 920;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return '';

  context.fillStyle = '#050505';
  context.fillRect(0, 0, width, height);

  const brickWidth = 214;
  const brickHeight = 68;
  const mortar = 10;
  const variants = [
    createFaceCanvas(palette, 640, 210, 1),
    createFaceCanvas(palette, 640, 210, 2),
    createFaceCanvas(palette, 640, 210, 3),
    createFaceCanvas(palette, 640, 210, 4),
  ];
  const rng = createPrng(hashSeed(`${palette.mid}|${palette.shadow}|backdrop`));

  context.fillStyle = palette.mortar;
  context.fillRect(0, 0, width, height);

  for (let row = 0; row < 10; row += 1) {
    const y = row * (brickHeight + mortar);
    const offset = row % 2 === 0 ? 0 : -((brickWidth + mortar) * 0.5);

    for (let x = offset; x < width + brickWidth; x += brickWidth + mortar) {
      const variant = variants[Math.floor(rng() * variants.length)];
      const inset = 4 + rng() * 5;
      const drawX = x + inset;
      const drawY = y + inset;
      const drawWidth = brickWidth - inset * 2;
      const drawHeight = brickHeight - inset * 2;

      context.save();
      drawRoundedRect(context, drawX, drawY, drawWidth, drawHeight, 10);
      context.clip();
      context.globalAlpha = 0.9;
      context.drawImage(variant, drawX, drawY, drawWidth, drawHeight);
      context.restore();
    }
  }

  const vignette = context.createRadialGradient(width * 0.5, height * 0.48, 10, width * 0.5, height * 0.48, width * 0.62);
  vignette.addColorStop(0, 'rgba(0,0,0,0.04)');
  vignette.addColorStop(0.58, 'rgba(0,0,0,0.36)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.88)');
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);

  const topShade = context.createLinearGradient(0, 0, 0, height);
  topShade.addColorStop(0, 'rgba(0,0,0,0.68)');
  topShade.addColorStop(0.28, 'rgba(0,0,0,0.18)');
  topShade.addColorStop(1, 'rgba(0,0,0,0.46)');
  context.fillStyle = topShade;
  context.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.76);
}

export async function createBrickWallDataUrl(
  palette: BrickPalette,
  imageSrc?: string,
  options?: {
    width?: number;
    height?: number;
    courses?: number;
    quality?: number;
    mortar?: number;
  }
) {
  if (!imageSrc) return createBrickBackdropDataUrl(palette);

  const width = Math.max(960, Math.round(options?.width ?? 1920));
  const height = Math.max(360, Math.round(options?.height ?? 720));
  const courses = Math.max(8, Math.round(options?.courses ?? 10));
  const quality = THREE.MathUtils.clamp(options?.quality ?? 0.86, 0.68, 0.94);
  const mortar = Math.max(6, Math.round(options?.mortar ?? height * 0.012));
  const cacheKey = JSON.stringify({
    imageSrc,
    palette: getPaletteCacheKey(palette),
    width,
    height,
    courses,
    quality,
    mortar,
  });
  const cached = wallDataUrlCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const nextPromise = (async () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return '';

    let image: HTMLImageElement;
    try {
      image = await loadImageAsync(imageSrc);
    } catch {
      return createBrickBackdropDataUrl(palette);
    }

    const rng = createPrng(hashSeed(`${palette.mid}|${palette.shadow}|${imageSrc}|wall-build`));
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const sourceAspect = THREE.MathUtils.clamp(sourceWidth / sourceHeight, 2.82, 3.24);
    const brickHeight = Math.max(24, Math.floor((height - mortar * (courses - 1)) / courses));
    const brickWidth = Math.max(88, Math.round(brickHeight * sourceAspect));

    context.fillStyle = palette.mortar;
    context.fillRect(0, 0, width, height);

    for (let row = 0; row < courses; row += 1) {
      const y = row * (brickHeight + mortar);
      const offset = row % 2 === 0 ? 0 : -Math.round((brickWidth + mortar) * 0.5);

      for (let x = offset; x < width + brickWidth; x += brickWidth + mortar) {
        const insetX = 3 + rng() * 4;
        const insetY = 2 + rng() * 4;
        const drawX = x + insetX;
        const drawY = y + insetY;
        const drawWidth = brickWidth - insetX * 2;
        const drawHeight = brickHeight - insetY * 2;
        const sourceInsetX = Math.floor(sourceWidth * (0.008 + rng() * 0.038));
        const sourceInsetY = Math.floor(sourceHeight * (0.012 + rng() * 0.06));
        const sourceDrawWidth = Math.max(24, sourceWidth - sourceInsetX * 2);
        const sourceDrawHeight = Math.max(24, sourceHeight - sourceInsetY * 2);
        const brightness = 0.95 + rng() * 0.15;
        const contrast = 0.97 + rng() * 0.12;
        const flip = rng() > 0.52;

        context.save();
        drawRoundedRect(context, drawX, drawY, drawWidth, drawHeight, 7);
        context.clip();
        context.filter = `brightness(${brightness}) contrast(${contrast}) saturate(1.02)`;

        if (flip) {
          context.translate(drawX + drawWidth, drawY);
          context.scale(-1, 1);
          context.drawImage(image, sourceInsetX, sourceInsetY, sourceDrawWidth, sourceDrawHeight, 0, 0, drawWidth, drawHeight);
        } else {
          context.drawImage(
            image,
            sourceInsetX,
            sourceInsetY,
            sourceDrawWidth,
            sourceDrawHeight,
            drawX,
            drawY,
            drawWidth,
            drawHeight
          );
        }

        context.filter = 'none';

        const firedGradient = context.createLinearGradient(drawX, drawY, drawX, drawY + drawHeight);
        firedGradient.addColorStop(0, 'rgba(255,255,255,0.06)');
        firedGradient.addColorStop(0.18, 'rgba(255,255,255,0)');
        firedGradient.addColorStop(0.84, 'rgba(0,0,0,0)');
        firedGradient.addColorStop(1, 'rgba(0,0,0,0.12)');
        context.fillStyle = firedGradient;
        context.fillRect(drawX, drawY, drawWidth, drawHeight);

        context.lineWidth = 1;
        context.strokeStyle = 'rgba(255,255,255,0.08)';
        drawRoundedRect(context, drawX + 0.5, drawY + 0.5, drawWidth - 1, drawHeight - 1, 6);
        context.stroke();
        context.restore();
      }
    }

    const roomShade = context.createLinearGradient(0, 0, 0, height);
    roomShade.addColorStop(0, 'rgba(255,255,255,0.04)');
    roomShade.addColorStop(0.16, 'rgba(255,255,255,0)');
    roomShade.addColorStop(0.72, 'rgba(0,0,0,0.03)');
    roomShade.addColorStop(1, 'rgba(0,0,0,0.12)');
    context.fillStyle = roomShade;
    context.fillRect(0, 0, width, height);

    const edgeShade = context.createLinearGradient(0, 0, width, 0);
    edgeShade.addColorStop(0, 'rgba(0,0,0,0.1)');
    edgeShade.addColorStop(0.08, 'rgba(0,0,0,0)');
    edgeShade.addColorStop(0.92, 'rgba(0,0,0,0)');
    edgeShade.addColorStop(1, 'rgba(0,0,0,0.08)');
    context.fillStyle = edgeShade;
    context.fillRect(0, 0, width, height);

    return canvas.toDataURL('image/jpeg', quality);
  })();

  wallDataUrlCache.set(cacheKey, nextPromise);
  return nextPromise;
}

export async function createRoomCompositeDataUrl(
  roomImageSrc: string | undefined,
  wallImageSrc: string | undefined,
  options?: {
    width?: number;
    height?: number;
    roomCrop?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    wallBounds?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    quality?: number;
  }
) {
  if (!roomImageSrc || !wallImageSrc) return '';

  const width = Math.max(960, Math.round(options?.width ?? 1600));
  const height = Math.max(320, Math.round(options?.height ?? 720));
  const quality = THREE.MathUtils.clamp(options?.quality ?? 0.9, 0.72, 0.96);
  const roomCrop = options?.roomCrop ?? { x: 0, y: 0, width: 1, height: 1 };
  const wallBounds = options?.wallBounds ?? { x: 0.18, y: 0.04, width: 0.68, height: 0.52 };
  const cacheKey = JSON.stringify({ roomImageSrc, wallImageSrc, width, height, quality, roomCrop, wallBounds });
  const cached = roomCompositeDataUrlCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const nextPromise = (async () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return '';

    let roomImage: HTMLImageElement;
    let wallImage: HTMLImageElement;
    try {
      [roomImage, wallImage] = await Promise.all([loadImageAsync(roomImageSrc), loadImageAsync(wallImageSrc)]);
    } catch {
      return '';
    }

    const sourceWidth = roomImage.naturalWidth || roomImage.width;
    const sourceHeight = roomImage.naturalHeight || roomImage.height;
    const sourceX = Math.max(0, Math.round(sourceWidth * roomCrop.x));
    const sourceY = Math.max(0, Math.round(sourceHeight * roomCrop.y));
    const sourceDrawWidth = Math.max(24, Math.round(sourceWidth * roomCrop.width));
    const sourceDrawHeight = Math.max(24, Math.round(sourceHeight * roomCrop.height));

    context.clearRect(0, 0, width, height);
    context.drawImage(
      roomImage,
      sourceX,
      sourceY,
      Math.min(sourceDrawWidth, sourceWidth - sourceX),
      Math.min(sourceDrawHeight, sourceHeight - sourceY),
      0,
      0,
      width,
      height
    );

    const wallX = Math.round(width * wallBounds.x);
    const wallY = Math.round(height * wallBounds.y);
    const wallWidth = Math.max(24, Math.round(width * wallBounds.width));
    const wallHeight = Math.max(24, Math.round(height * wallBounds.height));

    const wallCanvas = document.createElement('canvas');
    wallCanvas.width = wallWidth;
    wallCanvas.height = wallHeight;
    const wallContext = wallCanvas.getContext('2d');

    if (!wallContext) {
      return canvas.toDataURL('image/jpeg', quality);
    }

    wallContext.clearRect(0, 0, wallWidth, wallHeight);
    wallContext.drawImage(wallImage, 0, 0, wallWidth, wallHeight);

    const fadeBottom = wallContext.createLinearGradient(0, 0, 0, wallHeight);
    fadeBottom.addColorStop(0, 'rgba(0,0,0,0)');
    fadeBottom.addColorStop(0.78, 'rgba(0,0,0,0)');
    fadeBottom.addColorStop(1, 'rgba(0,0,0,0.85)');
    wallContext.globalCompositeOperation = 'destination-out';
    wallContext.fillStyle = fadeBottom;
    wallContext.fillRect(0, 0, wallWidth, wallHeight);

    wallContext.globalCompositeOperation = 'source-over';
    const wallShade = wallContext.createLinearGradient(0, 0, 0, wallHeight);
    wallShade.addColorStop(0, 'rgba(255,255,255,0.04)');
    wallShade.addColorStop(0.18, 'rgba(255,255,255,0)');
    wallShade.addColorStop(1, 'rgba(0,0,0,0.08)');
    wallContext.fillStyle = wallShade;
    wallContext.fillRect(0, 0, wallWidth, wallHeight);

    context.drawImage(wallCanvas, wallX, wallY, wallWidth, wallHeight);

    return canvas.toDataURL('image/jpeg', quality);
  })();

  roomCompositeDataUrlCache.set(cacheKey, nextPromise);
  return nextPromise;
}

export async function createImageCropDataUrl(
  imageSrc: string | undefined,
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
) {
  if (!imageSrc) return '';

  const width = Math.max(960, Math.round(options?.width ?? 1600));
  const height = Math.max(320, Math.round(options?.height ?? 720));
  const quality = THREE.MathUtils.clamp(options?.quality ?? 0.9, 0.72, 0.96);
  const cacheKey = JSON.stringify({ imageSrc, crop, width, height, quality });
  const cached = cropDataUrlCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const nextPromise = (async () => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return '';

  let image: HTMLImageElement;
  try {
    image = await loadImageAsync(imageSrc);
  } catch {
    return '';
  }

  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const cropBox = crop ?? { x: 0, y: 0, width: 1, height: 1 };
  const sourceX = Math.max(0, Math.round(sourceWidth * cropBox.x));
  const sourceY = Math.max(0, Math.round(sourceHeight * cropBox.y));
  const sourceDrawWidth = Math.max(24, Math.round(sourceWidth * cropBox.width));
  const sourceDrawHeight = Math.max(24, Math.round(sourceHeight * cropBox.height));

  context.clearRect(0, 0, width, height);
  context.drawImage(
    image,
    sourceX,
    sourceY,
    Math.min(sourceDrawWidth, sourceWidth - sourceX),
    Math.min(sourceDrawHeight, sourceHeight - sourceY),
    0,
    0,
    width,
    height
  );

  return canvas.toDataURL('image/jpeg', quality);
  })();

  cropDataUrlCache.set(cacheKey, nextPromise);
  return nextPromise;
}
