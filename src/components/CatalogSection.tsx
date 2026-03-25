import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows, PresentationControls, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { useVisualLab } from './VisualLabContext';
import { productData } from '../data/mockData';
import { ChevronRight, X, Plus, Minus, ShoppingCart, Info, Ruler, Package, Truck, Star, Layers, Sun, Moon } from 'lucide-react';
import * as THREE from 'three';

const MOODS = [
  { id: 'Rich Aesthetic', icon: Star, label: 'Rich Aesthetic' },
  { id: 'Modern', icon: Layers, label: 'Modern' },
  { id: 'Tan', icon: Sun, label: 'Tan' },
  { id: 'Dark', icon: Moon, label: 'Dark' }
];

function TileMesh({ item, isAnySelected }: { item: any, isAnySelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && !isAnySelected) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + item.id.length) * 0.2;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3 + item.id.length) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.6, 0.1]} />
        <meshStandardMaterial 
          color={item.color} 
          roughness={0.4} 
          metalness={0.1}
          emissive={item.color}
          emissiveIntensity={0.05}
        />
      </mesh>
    </Float>
  );
}

function CatalogTile({ item, onSelect, isAnySelected }: { 
  item: any, 
  onSelect: (item: any) => void,
  isAnySelected: boolean
}) {
  return (
    <div className="group relative h-40 w-full flex flex-col items-center justify-center cursor-pointer" onClick={() => onSelect(item)}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 3], fov: 35 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <TileMesh item={item} isAnySelected={isAnySelected} />
          <Environment preset="city" />
        </Canvas>
      </div>
      <div className="relative z-10 mt-24 text-center">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
          {item.name}
        </span>
      </div>
    </div>
  );
}

export function CatalogSection() {
  const { 
    activeCategory, 
    selectedCatalogItem, 
    setSelectedCatalogItem, 
    setIsQuoteWizardOpen,
    quoteQuantity,
    setQuoteQuantity
  } = useVisualLab();
  
  const items = (productData as any)[activeCategory].catalog;
  const accentColor = activeCategory === 'cladding-tiles' ? '#F27D26' : '#8B4513';

  const groupedItems = useMemo(() => {
    const groups: Record<string, any[]> = {};
    MOODS.forEach(mood => {
      groups[mood.id] = items.filter((item: any) => item.mood === mood.id);
    });
    return groups;
  }, [items]);

  const handleAddToCart = () => {
    setIsQuoteWizardOpen(true);
  };

  return (
    <section id="catalog" className="relative min-h-screen bg-[#050505] py-24 overflow-hidden">
      {/* Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.015] whitespace-nowrap">
        <h2 className="text-[25vw] font-bold uppercase leading-none">
          Moods
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-light text-white tracking-tighter mb-4"
          >
            Colour <span className="italic font-serif text-[#C5A059]">Moods</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            className="h-[1px] bg-white/10 max-w-4xl mx-auto"
          />
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {MOODS.map((mood, idx) => (
            <motion.div 
              key={mood.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 flex flex-col items-center gap-4">
                <mood.icon size={24} className="text-[#C5A059]" />
                <h3 className="text-xl font-light text-white/80 tracking-widest uppercase text-center">
                  {mood.label}
                </h3>
                <div className="w-16 h-[1px] bg-white/20" />
              </div>

              <div className="w-full space-y-8">
                {groupedItems[mood.id]?.map((item) => (
                  <CatalogTile 
                    key={item.id} 
                    item={item} 
                    onSelect={setSelectedCatalogItem}
                    isAnySelected={!!selectedCatalogItem}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Overlay UI */}
        <AnimatePresence>
          {selectedCatalogItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            >
              <div 
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={() => setSelectedCatalogItem(null)}
              />
              
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              >
                <button 
                  onClick={() => setSelectedCatalogItem(null)}
                  className="absolute top-6 right-6 z-30 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                >
                  <X size={20} />
                </button>

                {/* Product Visuals */}
                <div className="w-full md:w-1/2 h-[300px] md:h-auto relative bg-[#111]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Canvas shadows dpr={[1, 2]}>
                      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />
                      <PresentationControls
                        global
                        rotation={[0, 0.3, 0]}
                        polar={[-Math.PI / 3, Math.PI / 3]}
                        azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                      >
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                          <mesh castShadow receiveShadow>
                            <boxGeometry args={[2.2, 1, 0.2]} />
                            <meshStandardMaterial 
                              color={selectedCatalogItem.color} 
                              roughness={0.4} 
                              metalness={0.1}
                              emissive={selectedCatalogItem.color}
                              emissiveIntensity={0.1}
                            />
                          </mesh>
                        </Float>
                      </PresentationControls>
                      <Environment preset="city" />
                      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
                    </Canvas>
                  </div>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 bg-white/5 rounded text-[9px] uppercase tracking-widest text-white/40 border border-white/10">
                        {selectedCatalogItem.mood}
                      </span>
                      <span className="px-2 py-1 bg-white/5 rounded text-[9px] uppercase tracking-widest text-white/40 border border-white/10">
                        Premium Grade
                      </span>
                    </div>
                    <h3 className="text-4xl font-light text-white mb-4 tracking-tight">
                      {selectedCatalogItem.name}
                    </h3>
                    <p className="text-white/60 leading-relaxed text-sm mb-6">
                      {selectedCatalogItem.description}
                    </p>
                    
                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="text-2xl font-mono text-white">{selectedCatalogItem.price}</span>
                      <span className="text-white/30 text-xs uppercase tracking-widest">per m²</span>
                    </div>
                  </div>

                  {/* Technical Specs */}
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {Object.entries(selectedCatalogItem.specs).map(([key, value]: [string, any]) => (
                      <div key={key} className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">{key}</div>
                        <div className="text-xs text-white font-mono">{value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-4">
                        <span className="text-xs uppercase tracking-widest text-white/40">Quantity</span>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setQuoteQuantity(Math.max(1, quoteQuantity - 1))}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-lg font-mono text-white w-8 text-center">{quoteQuantity}</span>
                          <button 
                            onClick={() => setQuoteQuantity(quoteQuantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] uppercase tracking-widest text-white/30">Estimated Total</div>
                        <div className="text-xl font-mono text-white">R{(parseFloat(selectedCatalogItem.price.replace('R ', '')) * quoteQuantity).toLocaleString()}</div>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="w-full py-5 rounded-xl flex items-center justify-center gap-3 text-sm uppercase tracking-widest font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ backgroundColor: accentColor, color: '#fff' }}
                    >
                      <ShoppingCart size={18} />
                      Add to Collection & Start Quote
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      {!selectedCatalogItem && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 flex flex-wrap justify-center gap-12 border-t border-white/5 pt-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
              <Ruler size={18} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/30">Precision Cut</div>
              <div className="text-xs text-white/60">Uniform dimensions for easy install</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
              <Info size={18} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/30">Expert Support</div>
              <div className="text-xs text-white/60">Consultation on every project</div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
