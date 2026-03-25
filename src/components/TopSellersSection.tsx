import React from 'react';
import { motion } from 'motion/react';
import { productData } from '../data/mockData';
import { ArrowRight } from 'lucide-react';
import { useVisualLab } from './VisualLabContext';

export function TopSellersSection() {
  const { activeCategory } = useVisualLab();
  const categoryData = productData[activeCategory];
  const { topSellers } = categoryData;

  return (
    <section className="py-24 px-8 md:px-16 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-['Anton'] text-white uppercase tracking-tighter leading-none"
          >
            TOP SELLERS
          </motion.h2>
          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`group flex items-center gap-2 text-xs tracking-widest uppercase text-white/50 transition-colors ${activeCategory === 'cladding-tiles' ? 'hover:text-[#22c55e]' : 'hover:text-[#eab308]'}`}
          >
            VIEW ALL PRODUCTS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {topSellers.map((product: any, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a] mb-6">
                <img 
                  src={product.image} 
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-black text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
                    {product.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs tracking-widest uppercase font-bold border border-white px-4 py-2 bg-black/40 backdrop-blur-sm">
                    QUICK VIEW
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-lg font-bold text-white tracking-tight transition-colors ${activeCategory === 'cladding-tiles' ? 'group-hover:text-[#22c55e]' : 'group-hover:text-[#eab308]'}`}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-white/40 tracking-widest uppercase mt-1">
                    {activeCategory === 'cladding-tiles' ? 'BRICK TILES' : 'CLAY BRICKS'}
                  </p>
                </div>
                <span className="text-sm font-mono text-white/60">
                  {product.price}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
