import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';
import { useVisualLab } from './VisualLabContext';
import { productData } from '../data/mockData';

export function Footer() {
  const { activeCategory } = useVisualLab();
  const categoryData = productData[activeCategory];
  const activeColor = activeCategory === 'cladding-tiles' ? '#22c55e' : '#eab308';
  const activeColorClass = activeCategory === 'cladding-tiles' ? 'text-[#22c55e]' : 'text-[#eab308]';
  const activeBorderClass = activeCategory === 'cladding-tiles' ? 'border-[#22c55e]' : 'border-[#eab308]';
  const activeBgClass = activeCategory === 'cladding-tiles' ? 'bg-[#22c55e]' : 'bg-[#eab308]';
  const hoverBgClass = activeCategory === 'cladding-tiles' ? 'hover:bg-[#22c55e]' : 'hover:bg-[#eab308]';

  return (
    <footer id="footer" className="relative pt-32 pb-12 px-8 md:px-16 overflow-hidden min-h-screen flex flex-col justify-between" style={{ background: 'linear-gradient(to bottom, #0a0a0a 0%, transparent 20%, transparent 80%, #0a0a0a 100%)' }}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-10 transition-colors duration-1000 ${activeBgClass}`} />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center flex-1 justify-center">
        {/* Top Label */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`px-4 py-1 border rounded-full mb-8 transition-colors duration-1000 ${activeBorderClass}/30`}
        >
          <span className={`text-[10px] tracking-[0.3em] uppercase font-bold transition-colors duration-1000 ${activeColorClass}`}>
            Architectural Excellence
          </span>
        </motion.div>

        {/* 3D Model Placeholder Space */}
        <div className="w-full h-[40vh] md:h-[50vh] pointer-events-none" />

        {/* Product Info Overlay */}
        <div className="w-full flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="flex flex-col gap-2">
            <h3 className="text-4xl md:text-6xl font-['Anton'] uppercase tracking-tighter text-white">
              {categoryData.productName}
            </h3>
            <p className="text-white/50 text-sm tracking-widest uppercase">
              {categoryData.category}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <div className="flex gap-8 text-right">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 tracking-widest uppercase mb-1">{categoryData.technical.specs[0].label}</span>
                <span className="text-sm font-bold text-white">{categoryData.technical.specs[0].value}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 tracking-widest uppercase mb-1">{categoryData.technical.specs[1].label}</span>
                <span className="text-sm font-bold text-white">{categoryData.technical.specs[1].value}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 tracking-widest uppercase mb-1">Price</span>
                <span className={`text-sm font-bold transition-colors duration-1000 ${activeColorClass}`}>$12.99 / sq ft</span>
              </div>
            </div>
            
            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-white text-black px-12 py-4 text-sm font-bold tracking-widest uppercase transition-colors ${hoverBgClass} hover:text-white`}
            >
              SHOP NOW
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom Footer Area */}
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Info Bar */}
        <div className="w-full border-y border-white/5 py-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-8 text-[10px] tracking-widest uppercase font-bold text-white/40">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-1000 ${activeBgClass}`} />
              PREMIUM QUALITY
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-1000 ${activeBgClass}`} />
              WORLDWIDE DELIVERY
            </div>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-white/40 hover:text-white transition-colors"><Instagram size={18} /></a>
            <a href="#" className="text-white/40 hover:text-white transition-colors"><Youtube size={18} /></a>
          </div>

          <div className="text-[10px] tracking-widest uppercase font-bold text-white/40">
            SECURE CHECKOUT
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="w-full flex justify-center pt-4">
          <p className="text-[10px] tracking-widest text-white/20 uppercase">
            © 2024 BRICK TILE SHOP. ENGINEERED FOR GREATNESS.
          </p>
        </div>
      </div>
    </footer>
  );
}
