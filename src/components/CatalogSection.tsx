import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows, PresentationControls, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { useVisualLab } from './VisualLabContext';
import { productData } from '../data/mockData';
import { ChevronRight, X, Plus, Minus, ShoppingCart, Info, Ruler, Package, Truck, Star, Layers, Sun, Moon, ShieldCheck, Palette, LayoutGrid, Sparkles } from 'lucide-react';
import * as THREE from 'three';

const MOODS = [
  { id: 'Rich Aesthetic', icon: Star, label: 'Classic' },
  { id: 'Modern', icon: Layers, label: 'Modern' },
  { id: 'Tan', icon: Sun, label: 'Natural' },
  { id: 'Dark', icon: Moon, label: 'Premium' }
];

const BRICK_TYPES = [
  { id: 'NFB', icon: Package, label: 'NFB', description: 'Non-Facing Brick', strength: '7-10 MPa' },
  { id: 'NFX', icon: ShieldCheck, label: 'NFX', description: 'Non-Facing Extra', strength: '14-20 MPa' },
  { id: 'FBA', icon: Palette, label: 'FBA', description: 'Face Brick Aesthetic', strength: '20 MPa+' },
  { id: 'FBS', icon: LayoutGrid, label: 'FBS', description: 'Face Brick Standard', strength: '20 MPa+' },
  { id: 'FBX', icon: Sparkles, label: 'FBX', description: 'Face Brick Extra', strength: '25 MPa+' }
];

function CategoryMesh({ dimensions, color, type }: { dimensions: any, color: string, type: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={dimensions as any} />
        <meshStandardMaterial 
          color={color} 
          roughness={type.includes('FBX') ? 0.2 : 0.6} 
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

function Category3D({ type, category, color }: { type: string, category: string, color?: string }) {
  const dimensions = useMemo(() => {
    switch(category) {
      case 'bricks': return [1.6, 0.6, 0.6];
      case 'paving': return [1.2, 1.2, 0.3];
      default: return [1.6, 0.6, 0.1];
    }
  }, [category]);

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 3], fov: 35 }} className="h-32 w-full">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <CategoryMesh dimensions={dimensions} color={color || "#8B4513"} type={type} />
      <Environment preset="city" />
    </Canvas>
  );
}

function TileMesh({ item, isAnySelected }: { item: any, isAnySelected: boolean }) {
  const { activeCategory } = useVisualLab();
  const meshRef = useRef<THREE.Mesh>(null);
  
  const dimensions = useMemo(() => {
    switch(activeCategory) {
      case 'bricks': return [1.6, 0.6, 0.6];
      case 'paving': return [1.2, 1.2, 0.3];
      default: return [1.6, 0.6, 0.1];
    }
  }, [activeCategory]);
  
  useFrame((state) => {
    if (meshRef.current && !isAnySelected) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + item.id.length) * 0.2;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3 + item.id.length) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={dimensions as any} />
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
  
  const items = (productData as any)[activeCategory]?.catalog || [];
  const accentColor = activeCategory === 'cladding-tiles' ? '#F27D26' : activeCategory === 'paving' ? '#555555' : '#8B4513';

  const categories = useMemo(() => {
    if (activeCategory === 'bricks') return BRICK_TYPES;
    return MOODS;
  }, [activeCategory]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, any[]> = {};
    categories.forEach(cat => {
      groups[cat.id] = items.filter((item: any) => 
        activeCategory === 'bricks' ? item.subCategory === cat.id : item.mood === cat.id
      );
    });
    return groups;
  }, [items, categories, activeCategory]);

  const handleAddToCart = () => {
    setIsQuoteWizardOpen(true);
  };

  return (
    <section id="catalog" className="relative min-h-screen bg-[#050505] py-24 overflow-hidden">
      {/* Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.015] whitespace-nowrap">
        <h2 className="text-[25vw] font-bold uppercase leading-none">
          {activeCategory === 'bricks' ? 'Types' : 'Moods'}
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
            {activeCategory === 'bricks' ? 'Brick' : 'Colour'} <span className="italic font-serif text-[#C5A059]">{activeCategory === 'bricks' ? 'Types' : 'Moods'}</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            className="h-[1px] bg-white/10 max-w-4xl mx-auto"
          />
        </div>

        {/* Category Grid */}
        <div className={`grid grid-cols-1 ${activeCategory === 'bricks' ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-12 md:gap-8`}>
          {categories.map((cat: any, idx) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 flex flex-col items-center gap-4 w-full">
                <div className="h-32 w-full mb-4">
                  <Category3D 
                    type={cat.id} 
                    category={activeCategory} 
                    color={activeCategory === 'bricks' ? (groupedItems[cat.id]?.[0]?.color || '#8B4513') : undefined} 
                  />
                </div>
                <cat.icon size={20} className="text-[#C5A059]" />
                <h3 className="text-xl font-light text-white/80 tracking-widest uppercase text-center">
                  {cat.label}
                </h3>
                {cat.description && (
                  <p className="text-[10px] text-white/40 uppercase tracking-widest text-center max-w-[120px]">
                    {cat.description}
                  </p>
                )}
                <div className="w-16 h-[1px] bg-white/20" />
              </div>

              <div className="w-full space-y-8">
                {groupedItems[cat.id]?.map((item) => (
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
                            <boxGeometry args={
                              activeCategory === 'bricks' ? [2.2, 1, 1] :
                              activeCategory === 'paving' ? [2, 2, 0.5] :
                              [2.2, 1, 0.2]
                            } />
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
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
                      <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
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

      {/* Brick Guide Section */}
      {activeCategory === 'bricks' && (productData.bricks as any).brickTypesGuide && (
        <div className="max-w-7xl mx-auto px-6 mt-32 relative z-10">
          <div className="mb-16">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-light text-white tracking-tight mb-2"
            >
              Brick <span className="italic font-serif text-[#C5A059]">Classification Guide</span>
            </motion.h3>
            <p className="text-white/40 text-sm max-w-2xl">
              Understanding the technical classifications of clay and cement bricks to ensure the correct selection for your structural or aesthetic requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {(productData.bricks as any).brickTypesGuide.map((guide: any, idx: number) => (
              <motion.div
                key={guide.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.04] transition-all group"
              >
                <div className="text-[#C5A059] font-mono text-[10px] tracking-[0.2em] mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
                  {guide.strength}
                </div>
                <h4 className="text-white font-medium text-lg mb-3 tracking-tight">
                  {guide.type}
                </h4>
                <div className="w-8 h-[1px] bg-[#C5A059]/30 mb-4" />
                <p className="text-white/50 text-xs leading-relaxed">
                  {guide.useCase}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Cement Bricks Specific Info */}
          {(productData.bricks as any).cementBrickSpecs && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 p-8 bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-2xl flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-1">
                <h4 className="text-white font-medium mb-2 uppercase tracking-widest text-sm">Cement Bricks — Quality & Strength</h4>
                <p className="text-white/50 text-xs leading-relaxed max-w-2xl">
                  {(productData.bricks as any).cementBrickSpecs.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(productData.bricks as any).cementBrickSpecs.categories.map((cat: string) => (
                  <div key={cat} className="px-4 py-2 bg-black/40 border border-[#C5A059]/30 rounded-lg text-[#C5A059] text-[10px] font-bold tracking-widest">
                    {cat}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

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
