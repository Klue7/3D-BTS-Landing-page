import React from 'react';

export function BrandLogo() {
  return (
    <div className="flex items-start gap-3 text-white">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/14 bg-white/[0.02]">
        <svg
          viewBox="0 0 172 160"
          role="img"
          aria-label="Brick Tile Shop mark"
          className="h-8 w-8 shrink-0 overflow-visible"
        >
          <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
            <path d="M102 10 L166 74 L102 138" stroke="#8a8a8d" strokeWidth="8" />
            <path d="M34 32 L92 90" stroke="#8a8a8d" strokeWidth="8" />
            <path d="M20 46 L78 104" stroke="#8a8a8d" strokeWidth="8" />
            <path d="M6 60 L64 118" stroke="#8a8a8d" strokeWidth="8" />
            <path d="M24 18 L82 76" stroke="#8a8a8d" strokeWidth="8" />
            <path d="M64 32 L122 90 L64 148 L6 90 Z" stroke="#fafafa" strokeWidth="8" />
            <path d="M64 88 L94 118 L64 148 L34 118 Z" stroke="#fafafa" strokeWidth="8" />
          </g>
        </svg>
      </div>

      <div className="pt-0.5 leading-none">
        <p
          className="text-[1.85rem] font-black tracking-[-0.05em] text-[#f5f3f2]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          BRICK
        </p>
        <p className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-white/76">
          BTS TILE SHOP
        </p>
        <p className="mt-1 text-[0.56rem] uppercase tracking-[0.48em] text-white/52">
          Material Study
        </p>
      </div>
    </div>
  );
}
