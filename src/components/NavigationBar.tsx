import React from 'react';
import { Search, ShoppingBag, UserRound } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useProductCatalog } from './ProductCatalogContext';
import { SocialLinks } from './SocialLinks';

interface NavigationBarProps {
  pathname: string;
  navigate: (path: string) => void;
  placement?: 'fixed' | 'hero';
}

export function NavigationBar({ pathname, navigate, placement = 'fixed' }: NavigationBarProps) {
  const isCustomizeRoute = pathname === '/customize';
  const isHeroPlacement = placement === 'hero';
  const { cartCount, toggleCart } = useProductCatalog();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <nav
      className={
        isHeroPlacement
          ? 'absolute left-[clamp(14px,2vw,24px)] right-[clamp(14px,2vw,24px)] top-[clamp(14px,2vw,24px)] z-30'
          : `fixed top-0 z-50 ${isCustomizeRoute ? 'left-0 w-full px-8 py-6 md:px-16' : 'left-0 w-full px-[var(--stage-gap)] pt-[var(--stage-gap)]'}`
      }
    >
      <div
        className={
          isHeroPlacement
            ? 'mx-auto flex items-start justify-between gap-6 px-3 py-1 md:px-5 md:py-2 xl:px-6'
            : `${isCustomizeRoute ? 'w-full mix-blend-difference' : 'w-full max-w-[var(--stage-max-width)] rounded-t-[var(--stage-radius)] px-6 py-5 md:px-10 xl:px-14'} mx-auto flex items-start justify-between gap-6`
        }
      >
        <div
          className="flex cursor-pointer items-start gap-3 pointer-events-auto"
          onClick={() => handleNavigate('/')}
        >
          <BrandLogo />
        </div>

        <div className={`hidden items-center gap-8 ${isHeroPlacement ? 'pt-3' : 'pt-3'} md:flex`}>
          <button onClick={() => handleNavigate('/')} className={`text-sm font-semibold transition-colors ${!isCustomizeRoute ? 'text-[#22c55e]' : 'text-white/76 hover:text-[#22c55e]'}`}>Products</button>
          <button onClick={() => handleNavigate('/#material-story')} className="text-sm font-semibold text-white/76 transition-colors hover:text-[#22c55e]">Material</button>
          <button onClick={() => handleNavigate('/#technical-spotlight')} className="text-sm font-semibold text-white/76 transition-colors hover:text-[#22c55e]">Technical</button>
          <button onClick={() => handleNavigate('/customize')} className={`text-sm font-semibold transition-colors ${isCustomizeRoute ? 'text-[#22c55e]' : 'text-white/76 hover:text-[#22c55e]'}`}>Customize</button>
        </div>

        <div className={`flex items-center gap-3 pointer-events-auto ${isHeroPlacement ? 'pt-3' : 'pt-3'}`}>
          <SocialLinks
            className="hidden items-center gap-2 lg:flex"
            itemClassName="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/68 transition-colors hover:border-[#22c55e]/45 hover:text-[#22c55e]"
            iconClassName="h-[15px] w-[15px]"
          />
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/24 text-white/92 transition-colors hover:border-[#22c55e]/45 hover:text-[#22c55e]">
            <Search size={20} />
          </button>
          <button
            type="button"
            aria-label="User account"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/88 transition-colors hover:border-[#22c55e]/45 hover:text-[#22c55e]"
          >
            <UserRound size={17} />
            <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-[#22c55e] ring-2 ring-[#050505]" />
          </button>
          <button
            type="button"
            aria-label="Toggle cart drawer"
            aria-haspopup="dialog"
            onClick={toggleCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/92 transition-colors hover:border-[#22c55e]/45 hover:text-[#22c55e]"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-[#22c55e] px-1.5 text-[10px] font-bold leading-5 text-black shadow-[0_0_18px_rgba(34,197,94,0.25)]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
