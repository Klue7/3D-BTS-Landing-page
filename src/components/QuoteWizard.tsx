import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Check, ArrowLeft, Send } from 'lucide-react';
import { useVisualLab } from './VisualLabContext';

export function QuoteWizard() {
  const { 
    isQuoteWizardOpen, 
    setIsQuoteWizardOpen, 
    activeCategory, 
    selectedCatalogItem,
    quoteQuantity,
    setQuoteQuantity
  } = useVisualLab();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    timeline: '',
    email: ''
  });

  const activeColor = activeCategory === 'cladding-tiles' ? '#F27D26' : '#8B4513';

  const handleClose = () => {
    setIsQuoteWizardOpen(false);
    setStep(1);
  };

  const steps = [
    { title: 'Quantity', description: 'Confirm your order quantity' },
    { title: 'Project', description: 'What type of project is this?' },
    { title: 'Timeline', description: 'When do you need the materials?' },
    { title: 'Contact', description: 'Where should we send the quote?' }
  ];

  return (
    <AnimatePresence>
      {isQuoteWizardOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full" style={{ backgroundColor: selectedCatalogItem?.color }} />
                </div>
                <div>
                  <span className="text-[9px] tracking-[0.4em] text-white/30 uppercase font-bold mb-1 block">Quote Request</span>
                  <h2 className="text-xl font-light text-white tracking-tight">
                    {selectedCatalogItem?.name}
                  </h2>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/30 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-white/5 flex">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className="h-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${100 / steps.length}%`,
                    backgroundColor: i < step ? activeColor : 'transparent',
                    opacity: i < step ? 1 : 0.1
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="p-12 min-h-[450px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="space-y-10"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 bg-white/5 rounded border border-white/10 text-white/40">
                        Step 0{step}
                      </span>
                      <div className="h-[1px] w-8 bg-white/10" />
                    </div>
                    <h3 className="text-4xl font-light text-white tracking-tight leading-tight">
                      {steps[step - 1].description}
                    </h3>
                  </div>

                  {step === 1 && (
                    <div className="space-y-8">
                      <div className="flex items-center justify-center gap-8 p-10 bg-white/5 rounded-3xl border border-white/10">
                        <button 
                          onClick={() => setQuoteQuantity(Math.max(1, quoteQuantity - 1))}
                          className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-110 active:scale-90"
                        >
                          <ArrowLeft size={24} />
                        </button>
                        <div className="text-center">
                          <div className="text-6xl font-mono text-white mb-2">{quoteQuantity}</div>
                          <div className="text-[10px] uppercase tracking-[0.3em] text-white/30">Square Meters (m²)</div>
                        </div>
                        <button 
                          onClick={() => setQuoteQuantity(quoteQuantity + 1)}
                          className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-110 active:scale-90"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-3">
                        {[25, 50, 100, 250].map(val => (
                          <button 
                            key={val}
                            onClick={() => setQuoteQuantity(val)}
                            className={`py-3 rounded-xl border transition-all text-[10px] uppercase tracking-widest font-bold ${quoteQuantity === val ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'}`}
                          >
                            {val} m²
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-2 gap-4">
                      {['Residential', 'Commercial', 'Interior', 'Exterior'].map(type => (
                        <button 
                          key={type}
                          onClick={() => setFormData({ ...formData, projectType: type })}
                          className={`p-8 rounded-2xl border text-left transition-all group ${formData.projectType === type ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30 bg-white/[0.02]'}`}
                        >
                          <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors ${formData.projectType === type ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}>Project Type</span>
                          <span className="text-lg font-light text-white">{type}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      {['ASAP', '1-3 Months', '3-6 Months', 'Planning Phase'].map(time => (
                        <button 
                          key={time}
                          onClick={() => setFormData({ ...formData, timeline: time })}
                          className={`w-full p-6 rounded-2xl border text-left flex justify-between items-center transition-all ${formData.timeline === time ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/30 bg-white/[0.02]'}`}
                        >
                          <span className="text-sm font-light text-white tracking-wide">{time}</span>
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${formData.timeline === time ? 'bg-white border-white' : 'border-white/20'}`}>
                            {formData.timeline === time && <Check size={14} className="text-black" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="relative">
                        <input 
                          type="email" 
                          placeholder="your@email.com"
                          className="w-full bg-white/5 border border-white/10 p-8 rounded-2xl text-2xl text-white focus:border-white/30 outline-none transition-all placeholder:text-white/10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20">
                          <Send size={24} />
                        </div>
                      </div>
                      <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                        <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-widest text-center">
                          Our specialists will review your project requirements and provide a detailed quote within 24 hours.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 flex justify-between items-center bg-white/[0.02]">
              <button 
                onClick={() => step > 1 && setStep(step - 1)}
                className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-40 hover:opacity-100 hover:-translate-x-1'}`}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <button 
                onClick={() => {
                  if (step < 4) setStep(step + 1);
                  else handleClose();
                }}
                className="px-12 py-5 rounded-2xl flex items-center gap-4 group transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                style={{ backgroundColor: activeColor }}
              >
                <span className="text-white font-bold tracking-widest uppercase text-xs">
                  {step === 4 ? 'Submit Request' : 'Next Step'}
                </span>
                {step === 4 ? <Check size={18} className="text-white" /> : <ChevronRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
