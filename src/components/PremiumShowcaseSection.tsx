import React from 'react';
import { motion } from 'motion/react';
import { productData } from '../data/mockData';
import { useVisualLab } from './VisualLabContext';

export function PremiumShowcaseSection() {
  const { activeCategory } = useVisualLab();
  const categoryData = productData[activeCategory];

  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden py-24 px-8">
      {/* Background HUD Elements */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-[600px] h-[600px] border border-dashed border-white rounded-full"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 0.1, scale: 1.1 }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
          className="absolute w-[800px] h-[800px] border border-white/20 rounded-full"
        />
        {/* Crosshair lines */}
        <div className="absolute w-full h-[1px] bg-white/5 top-1/2" />
        <div className="absolute h-full w-[1px] bg-white/5 left-1/2" />
      </div>

      {/* Top Label */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="z-10 mb-8"
      >
        <span className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-bold">
          LIMITED EDITION
        </span>
      </motion.div>

      {/* Main Heading */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-7xl md:text-9xl font-['Anton'] text-white uppercase tracking-tighter leading-none z-10 mb-16 text-center"
      >
        THE {categoryData.productName.toUpperCase()}
      </motion.h2>

      {/* Centerpiece Area */}
      <div className="relative w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 z-10">
        
        {/* Left Spec */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-left max-w-[200px]"
        >
          <span className={`text-[10px] font-bold tracking-widest uppercase mb-2 block ${activeCategory === 'cladding-tiles' ? 'text-[#22c55e]' : 'text-[#eab308]'}`}>RANK 01</span>
          <h3 className="text-2xl font-bold text-white mb-2">Elite Tier</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Constructed for the highest level of architectural competition.
          </p>
        </motion.div>

        {/* Product on Podium */}
        <div className="relative group">
          {/* Podium */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-t from-white/10 to-transparent rounded-full blur-2xl opacity-50" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: -45 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 w-64 h-80 md:w-80 md:h-[450px] bg-[#1a1a1a] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden"
          >
            <img 
              src={activeCategory === 'cladding-tiles' ? "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800" : "https://images.unsplash.com/photo-1517231426071-2940212f3bc3?q=80&w=800&auto=format&fit=crop"}
              alt={`${categoryData.productName} Detail`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
            />
            {/* HUD Callouts on Image */}
            <div className="absolute top-4 left-4 border-l border-t border-white/20 w-8 h-8" />
            <div className="absolute bottom-4 right-4 border-r border-b border-white/20 w-8 h-8" />
          </motion.div>

          {/* Digital Base */}
          <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-2 blur-sm opacity-30 animate-pulse ${activeCategory === 'cladding-tiles' ? 'bg-[#22c55e]' : 'bg-[#eab308]'}`} />
        </div>

        {/* Right Spec */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-right max-w-[200px]"
        >
          <span className={`text-[10px] font-bold tracking-widest uppercase mb-2 block ${activeCategory === 'cladding-tiles' ? 'text-[#22c55e]' : 'text-[#eab308]'}`}>CERTIFIED</span>
          <h3 className="text-2xl font-bold text-white mb-2">Gold Standard</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Meets all regulation weight and architectural requirements.
          </p>
        </motion.div>
      </div>

      {/* HUD Callouts */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-24 opacity-30">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-white/60 tracking-widest uppercase">ELEVATION</span>
          <span className="text-xl font-mono text-white">12.8°</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-white/60 tracking-widest uppercase">AZIMUTH</span>
          <span className="text-xl font-mono text-white">45.2°</span>
        </div>
      </div>
    </section>
  );
}
