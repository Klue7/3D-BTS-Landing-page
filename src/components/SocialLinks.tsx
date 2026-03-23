import React from 'react';

interface SocialLinkDefinition {
  id: string;
  label: string;
  href: string;
  path: string;
}

const SOCIAL_LINKS: SocialLinkDefinition[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/bricktileshop/',
    path: 'M13.45 20v-6.86h2.3l.34-2.68h-2.64V8.75c0-.78.22-1.3 1.34-1.3H16.2V5.04c-.24-.03-1.08-.1-2.06-.1-2.03 0-3.42 1.24-3.42 3.52v1.99H8.42v2.68h2.3V20h2.73Z',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/bricktileshop/',
    path: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.45 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 1.8A3 3 0 1 0 15 12a3 3 0 0 0-3-3Z',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://za.linkedin.com/company/brick-tile-shop',
    path: 'M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56c0-.99-.74-1.69-1.9-1.69-1.14 0-1.88.7-1.88 1.69 0 .97.72 1.7 1.84 1.7h.02c1.18 0 1.92-.73 1.92-1.7ZM20 12.9C20 9.34 18.1 7.68 15.56 7.68c-2.05 0-2.96 1.13-3.47 1.93V8.5H8.72c.04.74 0 11.5 0 11.5h3.37v-6.42c0-.34.02-.68.13-.92.27-.68.88-1.38 1.91-1.38 1.35 0 1.89 1.03 1.89 2.54V20H20v-7.1Z',
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://twitter.com/brick_tile',
    path: 'M4 4h3.22l4.12 5.53L16 4h4l-6.67 7.6L20 20h-3.21l-4.55-6.1L7 20H3l7.15-8.14L4 4Zm4.26 1.84H6.8l8.93 12.32h1.46L8.26 5.84Z',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UCxAgpVYF9Z7Q5gkgDielBSw',
    path: 'M20.4 7.34c-.2-.75-.8-1.35-1.55-1.55C17.48 5.43 12 5.43 12 5.43s-5.48 0-6.85.36c-.75.2-1.35.8-1.55 1.55-.36 1.37-.36 4.23-.36 4.23s0 2.86.36 4.23c.2.75.8 1.32 1.55 1.52 1.37.36 6.85.36 6.85.36s5.48 0 6.85-.36c.75-.2 1.35-.77 1.55-1.52.36-1.37.36-4.23.36-4.23s0-2.86-.36-4.23ZM10.2 14.18V8.96l4.53 2.61-4.53 2.61Z',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@bricktileshop',
    path: 'M14.73 3c.33 1.72 1.35 2.88 2.95 3v2.17a5.16 5.16 0 0 1-2.88-.87v5.19a4.49 4.49 0 1 1-4.49-4.49c.28 0 .5.03.76.08v2.23a2.47 2.47 0 1 0 1.71 2.35V3h1.95Z',
  },
];

interface SocialLinksProps {
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
}

export function SocialLinks({
  className = '',
  itemClassName = '',
  iconClassName = 'h-[16px] w-[16px]',
}: SocialLinksProps) {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map((socialLink) => (
        <a
          key={socialLink.id}
          href={socialLink.href}
          target="_blank"
          rel="noreferrer"
          aria-label={socialLink.label}
          title={socialLink.label}
          className={itemClassName}
        >
          <svg viewBox="0 0 24 24" className={`${iconClassName} fill-current`} aria-hidden="true">
            <path d={socialLink.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}
