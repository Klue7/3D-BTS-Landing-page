import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react';
import { useVisualLab } from './VisualLabContext';
import { motion, AnimatePresence } from 'motion/react';

export function NavigationBar() {
  const { setIsLoginPageOpen, isLoggedIn, userRole, setIsLoggedIn, setUserRole } = useVisualLab();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleUserClick = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      setIsLoginPageOpen(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleViewPortal = () => {
    navigate('/portal');
    setIsDropdownOpen(false);
  };

  const isCustomize = location.pathname.startsWith('/customize');
  const isGallery = location.pathname === '/customize/gallery';
  const isProjects = location.pathname === '/projects';
  const activeColorClass = 'text-[#22c55e]';
  const hoverColorClass = 'hover:text-[#22c55e]';
  const bgClass = 'bg-[#22c55e]';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 md:px-16 py-6 flex justify-between items-center mix-blend-difference">
      {/* Logo */}
      <Link 
        to="/"
        className="flex items-center gap-3 cursor-pointer" 
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
          <span className="font-serif text-2xl leading-none tracking-widest font-bold text-white">BRICK</span>
          <span className="font-serif text-[0.6rem] leading-none tracking-widest font-bold mt-[2px] text-white">TILE SHOP</span>
        </div>
      </Link>

      {/* Links */}
      <div className="hidden md:flex gap-8 items-center">
        <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? activeColorClass : `text-white/80 ${hoverColorClass}`}`}>Home</Link>
        <a href="/#catalog" className={`text-white/80 transition-colors text-sm font-medium ${hoverColorClass}`}>Catalog</a>
        <div className="flex items-center gap-6">
          <Link to="/customize" className={`text-sm font-medium transition-colors ${isCustomize && !isGallery ? activeColorClass : `text-white/80 ${hoverColorClass}`}`}>Customize</Link>
          <Link to="/customize/gallery" className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${isGallery ? activeColorClass : `text-white/80 ${hoverColorClass}`}`}>
            <Sparkles size={14} />
            Gallery
          </Link>
          <Link to="/projects" className={`text-sm font-medium transition-colors ${isProjects ? activeColorClass : `text-white/80 ${hoverColorClass}`}`}>Projects</Link>
        </div>
        <a href="/#brick-tiles" className={`text-white/80 transition-colors text-sm font-medium ${hoverColorClass}`}>Brick Tiles</a>
        <a href="/#building-materials" className={`text-white/80 transition-colors text-sm font-medium ${hoverColorClass}`}>Building Materials</a>
        <a href="/#contact" className={`text-white/80 transition-colors text-sm font-medium ${hoverColorClass}`}>Contact</a>
      </div>

      {/* Icons */}
      <div className="flex gap-6 items-center relative">
        <button className={`text-white transition-colors ${hoverColorClass}`}>
          <Search size={20} />
        </button>
        <button className={`text-white transition-colors relative ${hoverColorClass}`}>
          <ShoppingCart size={20} />
          <span className={`absolute -top-2 -right-2 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white font-bold ${bgClass}`}>0</span>
        </button>
        
        <div className="relative">
          <button 
            onClick={handleUserClick}
            className={`text-white transition-colors flex items-center gap-2 ${hoverColorClass}`}
          >
            <User size={20} className={isLoggedIn ? (userRole === 'employee' ? "text-blue-400" : "text-green-400") : ""} />
            {isLoggedIn && (
              <>
                <span className="text-[10px] uppercase tracking-widest hidden sm:inline">
                  {userRole === 'employee' ? 'Employee' : 'Customer'}
                </span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          <AnimatePresence>
            {isLoggedIn && isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
              >
                <div className="p-2">
                  <button 
                    onClick={handleViewPortal}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <LayoutDashboard size={14} />
                    View Portal
                  </button>
                  <div className="h-px bg-white/5 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-all"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
