import React from 'react';
import type { SurfaceSwatch } from '../data/mockData';

interface MasonrySampleCardProps {
  swatch: SurfaceSwatch;
  className?: string;
}

const COURSE_PATTERNS = [
  [28, 42, 34],
  [36, 30, 40],
  [30, 44, 28],
  [40, 32, 34],
];

export function MasonrySampleCard({ swatch, className = '' }: MasonrySampleCardProps) {
  const tones = [swatch.from, swatch.via, swatch.to];
  const noiseTexture =
    'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 200 200%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.95%27 numOctaves=%272%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E")';

  return (
    <div className={`relative overflow-hidden border border-white/10 bg-[#ddd3c2] ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),transparent_26%,rgba(0,0,0,0.12)_100%)]" />

      <div className="absolute inset-[7%] flex flex-col gap-[7%]">
        {COURSE_PATTERNS.map((pattern, courseIndex) => (
          <div
            key={courseIndex}
            className={`flex flex-1 gap-[4%] ${courseIndex % 2 === 1 ? '-ml-[12%]' : ''}`}
          >
            {pattern.map((width, brickIndex) => {
              const toneIndex = (courseIndex + brickIndex) % tones.length;
              const startTone = tones[toneIndex];
              const endTone = tones[(toneIndex + 1) % tones.length];

              return (
                <div
                  key={`${courseIndex}-${brickIndex}`}
                  className="h-full flex-none rounded-[4px] border border-black/8 shadow-[inset_0_1px_2px_rgba(255,255,255,0.18),inset_0_-2px_3px_rgba(0,0,0,0.16)]"
                  style={{
                    width: `${width}%`,
                    background: `linear-gradient(135deg, ${startTone}, ${endTone})`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: noiseTexture, backgroundSize: '180px 180px' }}
      />
    </div>
  );
}
