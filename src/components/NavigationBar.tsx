import React from 'react';
import { Search, ShoppingCart } from 'lucide-react';

interface NavigationBarProps {
  pathname: string;
  navigate: (path: string) => void;
}

export function NavigationBar({ pathname, navigate }: NavigationBarProps) {
  const isCustomizeRoute = pathname === '/customize';

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 md:px-16 py-6 flex justify-between items-center mix-blend-difference">
      {/* Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={() => handleNavigate('/')}
      >
        <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" strokeWidth="6" strokeLinecap="square">
          <g className="text-gray-400" stroke="currentColor">
            <line x1="40" y1="10" x2="10" y2="40" />
            <line x1="50" y1="20" x2="20" y2="50" />
            <line x1="60" y1="30" x2="30" y2="60" />
            <line x1="70" y1="40" x2="40" y2="70" />
            <polyline points="50,10 90,50 50,90" />
          </g>
          <g className="text-white" stroke="currentColor">
            <polygon points="40,30 70,60 40,90 10,60" />
            <polygon points="40,70 55,85 40,100 25,85" />
          </g>
        </svg>
        <div className="flex flex-col justify-center items-start">
          <span className="font-serif text-2xl leading-none tracking-widest font-black text-white">BRICK</span>
          <span className="font-serif text-[0.6rem] leading-none tracking-[0.2em] font-bold mt-[2px] text-white">TILE SHOP</span>
        </div>
      </div>

      {/* Links */}
      <div className="hidden md:flex gap-8 items-center">
        <button onClick={() => handleNavigate('/')} className={`text-sm font-medium transition-colors ${!isCustomizeRoute ? 'text-[#22c55e]' : 'text-white/80 hover:text-[#22c55e]'}`}>Home</button>
        <button onClick={() => handleNavigate('/#technical-spotlight')} className="text-white/80 hover:text-[#22c55e] transition-colors text-sm font-medium">Technical</button>
        <button onClick={() => handleNavigate('/#showcase')} className="text-white/80 hover:text-[#22c55e] transition-colors text-sm font-medium">Installation</button>
        <button onClick={() => handleNavigate('/#related-products')} className="text-white/80 hover:text-[#22c55e] transition-colors text-sm font-medium">Top Sellers</button>
        <button onClick={() => handleNavigate('/customize')} className={`text-sm font-medium transition-colors ${isCustomizeRoute ? 'text-[#22c55e]' : 'text-white/80 hover:text-[#22c55e]'}`}>Customize</button>
      </div>

      {/* Icons */}
      <div className="flex gap-6 items-center">
        <button className="text-white hover:text-[#22c55e] transition-colors">
          <Search size={20} />
        </button>
        <button className="text-white hover:text-[#22c55e] transition-colors relative">
          <ShoppingCart size={20} />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#22c55e] rounded-full text-[10px] flex items-center justify-center text-white font-bold">0</span>
        </button>
      </div>
    </nav>
  );
}
