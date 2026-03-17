import React from 'react';

export function ShowcaseSection() {
  return (
    <section id="showcase" className="relative w-full min-h-screen bg-[#0a0a0a] py-24 flex items-center justify-center">
      <div className="w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        
        {/* Left: Copy */}
        <div className="flex flex-col z-20 order-2 md:order-1">
          <p className="text-[#22c55e] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4">INSTALLATION SHOWCASE</p>
          <h2 className="text-4xl md:text-6xl font-['Anton'] text-white uppercase tracking-tighter leading-none mb-6">
            ARCHITECTURAL<br/>INTEGRATION
          </h2>
          <p className="text-sm md:text-base text-white/60 mb-8 max-w-md leading-relaxed">
            The Zambezi thin brick tile delivers the authentic texture and tonal variation of traditional masonry, engineered for modern cladding applications. Its slim profile allows for seamless integration across both interior feature walls and exterior facades.
          </p>
          
          <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
            <div>
              <p className="text-[#22c55e] text-[10px] font-bold tracking-widest uppercase mb-2">APPLICATION</p>
              <p className="text-sm text-white font-medium">Interior & Exterior</p>
            </div>
            <div>
              <p className="text-[#22c55e] text-[10px] font-bold tracking-widest uppercase mb-2">MORTAR JOINT</p>
              <p className="text-sm text-white font-medium">10mm Standard</p>
            </div>
          </div>
        </div>

        {/* Right: Image */}
        <div className="relative z-0 order-1 md:order-2">
          <div className="aspect-[4/5] w-full rounded-sm overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop" 
              alt="Zambezi Brick Tile Installation" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          {/* Detail View Box for 3D Tile */}
          <div className="hidden md:block absolute -bottom-12 -left-12 w-48 h-48 border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-4 z-10">
            <div className="w-full h-full border border-white/5 relative">
               <p className="absolute bottom-2 left-2 text-[8px] text-white/40 tracking-widest uppercase">DETAIL VIEW</p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
