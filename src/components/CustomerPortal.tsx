import React, { useState } from 'react';
import { productData } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Clock, Settings, LogOut, ChevronRight, CreditCard, ArrowLeft, Sparkles, LayoutGrid, FileText, Archive, ExternalLink, Copy, Eye, MoreVertical, Trash2, Building2, X, Upload, Plus, Share2, Home, CheckCircle2, AlertCircle, ShieldCheck, Download, Globe, Lock, MapPin, Layers, User, ShoppingBag } from 'lucide-react';

// Watermark Component for shared variants
const WatermarkOverlay = () => (
  <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
    <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
      <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
      <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white/80">Brick Tile Shop • Verified Design</span>
    </div>
    <div className="opacity-[0.03] rotate-[-35deg] scale-150 select-none pointer-events-none whitespace-nowrap">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="text-4xl font-black uppercase tracking-[1em] mb-12">
          BRICK TILE SHOP • BRICK TILE SHOP • BRICK TILE SHOP
        </div>
      ))}
    </div>
  </div>
);
import { useVisualLab } from './VisualLabContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function CustomerPortal() {
  const { setIsLoggedIn, setUserRole, designs, projects, deleteDesign, addDesign, updateDesign, addProject, deleteProject, updateProject } = useVisualLab();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'designs' | 'projects'>(
    location.pathname.includes('/portal/designs') ? 'designs' : 
    location.pathname.includes('/portal/projects') ? 'projects' : 'overview'
  );
  const [designFilter, setDesignFilter] = useState<'all' | 'draft' | 'published' | 'quote-requested' | 'archived'>('all');
  const [projectFilter, setProjectFilter] = useState<'all' | 'draft' | 'approved' | 'featured' | 'archived'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const navigate = useNavigate();

  // Project Upload Form State
  const [newProject, setNewProject] = useState({
    title: '',
    projectType: 'Residential',
    location: '',
    description: '',
    products: [] as string[],
    isPublic: false,
    attribution: {
      architect: '',
      designer: ''
    }
  });

  const handleProjectSubmit = () => {
    if (!newProject.title) return;

    const project: any = {
      id: `proj-${Date.now()}`,
      title: newProject.title,
      projectType: newProject.projectType,
      location: newProject.location,
      description: newProject.description,
      images: {
        original: 'https://picsum.photos/seed/newproj/1600/1200',
        publishVariant: 'https://picsum.photos/seed/newproj/1200/900',
        shareVariant: 'https://picsum.photos/seed/newproj/800/600'
      },
      products: newProject.products,
      attribution: newProject.attribution,
      status: newProject.isPublic ? 'submitted' : 'draft',
      isPublic: newProject.isPublic,
      createdAt: new Date().toISOString()
    };

    addProject(project);
    setIsUploadModalOpen(false);
    setNewProject({
      title: '',
      projectType: 'Residential',
      location: '',
      description: '',
      products: [],
      isPublic: false,
      attribution: {
        architect: '',
        designer: ''
      }
    });
  };

  const toggleProductTag = (productId: string) => {
    setNewProject(prev => ({
      ...prev,
      products: prev.products.includes(productId) 
        ? prev.products.filter(id => id !== productId)
        : [...prev.products, productId]
    }));
  };

  // Sync tab with URL if needed
  React.useEffect(() => {
    if (location.pathname.includes('/portal/designs')) {
      setActiveTab('designs');
    } else if (location.pathname.includes('/portal/projects')) {
      setActiveTab('projects');
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  const handleTabChange = (tab: 'overview' | 'designs' | 'projects') => {
    setActiveTab(tab);
    if (tab === 'overview') navigate('/portal');
    else navigate(`/portal/${tab}`);
  };

  const handleShare = (type: 'design' | 'project', item: any) => {
    setSelectedItem({ ...item, type });
    setIsShareModalOpen(true);
  };

  const handlePublishToggle = (type: 'design' | 'project', id: string) => {
    if (type === 'design') {
      const design = designs.find(d => d.id === id);
      if (!design) return;
      const isPublishing = !design.isPublic;
      updateDesign(id, { 
        status: isPublishing ? 'published' : 'draft',
        isPublic: isPublishing,
        moderationStatus: isPublishing ? 'pending' : 'none'
      });
    } else {
      const project = projects.find(p => p.id === id);
      if (!project) return;
      const isSubmitting = !project.isPublic;
      updateProject(id, { 
        status: isSubmitting ? 'submitted' : 'draft',
        isPublic: isSubmitting
      });
    }
  };

  const handleDuplicate = (design: any) => {
    const newDesign = {
      ...design,
      id: `design-${Date.now()}`,
      name: `${design.name} (Copy)`,
      createdAt: new Date().toISOString(),
      status: 'draft' as const
    };
    addDesign(newDesign);
  };

  const handleArchive = (id: string) => {
    updateDesign(id, { status: 'archived' });
  };

  const filteredDesigns = designs.filter(d => 
    designFilter === 'all' ? true : d.status === designFilter
  );

  const filteredProjects = projects.filter(p => 
    projectFilter === 'all' ? true : p.status === projectFilter
  );

  const orders = [
    { id: 'ORD-7291', date: 'Mar 12, 2026', status: 'In Production', total: '$4,250.00' },
    { id: 'ORD-6102', date: 'Feb 28, 2026', status: 'Delivered', total: '$1,820.00' },
  ];

  const stats = [
    { label: 'Total Orders', value: '12', icon: Package },
    { label: 'Saved Designs', value: designs.length.toString(), icon: Sparkles },
    { label: 'Built Projects', value: projects.length.toString(), icon: Home },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 md:px-16 selection:bg-[#22c55e] selection:text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-serif font-bold text-white tracking-tighter mb-2 uppercase">CUSTOMER PORTAL</h1>
            <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Manage your premium brick orders & designs</p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={14} />
              Back to Site
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold tracking-widest uppercase text-red-400 hover:bg-red-500/20 transition-all"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center text-[#22c55e]">
                <stat.icon size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 mb-12">
          <button 
            onClick={() => handleTabChange('overview')}
            className={`px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative ${activeTab === 'overview' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
          >
            Overview
            {activeTab === 'overview' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e]" />}
          </button>
          <button 
            onClick={() => handleTabChange('designs')}
            className={`px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative ${activeTab === 'designs' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
          >
            My Designs
            {activeTab === 'designs' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e]" />}
          </button>
          <button 
            onClick={() => handleTabChange('projects')}
            className={`px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative ${activeTab === 'projects' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
          >
            My Projects
            {activeTab === 'projects' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e]" />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-white uppercase tracking-widest">Recent Orders</h2>
                    <button className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">View All</button>
                  </div>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all group cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                            <Package size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{order.id}</div>
                            <div className="text-[10px] text-white/30 uppercase tracking-widest">{order.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-white">{order.total}</div>
                            <div className="text-[10px] text-[#22c55e] uppercase tracking-widest">{order.status}</div>
                          </div>
                          <ChevronRight size={18} className="text-white/20 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between h-48">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Billing Method</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">Visa ending in 4242</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between h-48">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                      <Settings size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Account Settings</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">Manage your profile</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Support</h2>
                  <div className="space-y-4">
                    <button className="w-full py-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:bg-white/10 transition-all">
                      Contact Specialist
                    </button>
                    <button className="w-full py-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:bg-white/10 transition-all">
                      Technical Docs
                    </button>
                  </div>
                </section>
                
                <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Project Status</h2>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div className="absolute top-0 left-0 h-full bg-[#22c55e] w-3/4"></div>
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
                    Your current project "Modern Villa" is 75% complete. Shipping scheduled for April 5th.
                  </p>
                </section>
              </div>
            </motion.div>
          ) : activeTab === 'designs' ? (
            <motion.div 
              key="designs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-2">My Designs</h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Manage your architectural visions and quote requests</p>
                </div>
                <Link to="/customize" className="px-8 py-4 bg-[#22c55e] text-black rounded-full text-[10px] font-bold tracking-widest uppercase hover:opacity-90 transition-all shadow-lg shadow-[#22c55e]/10">
                  Create New Design
                </Link>
              </div>

              {/* Design Filters */}
              <div className="flex flex-wrap gap-2 border-b border-white/5 pb-6">
                {(['all', 'draft', 'published', 'quote-requested', 'archived'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDesignFilter(filter)}
                    className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${designFilter === filter ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                  >
                    {filter.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {filteredDesigns.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
                    <LayoutGrid size={32} className="text-white/10" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4">No Designs Found</h3>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-8 max-w-xs mx-auto">
                    {designFilter === 'all' 
                      ? "Start your journey in the Customize Studio to create and save your architectural visions."
                      : `You have no designs with the status "${designFilter}".`}
                  </p>
                  <Link to="/customize" className="text-[#22c55e] text-[10px] font-bold tracking-widest uppercase hover:underline">
                    Open Customize Studio
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDesigns.map((design) => (
                    <div key={design.id} className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden group hover:border-[#22c55e]/30 transition-all flex flex-col shadow-2xl">
                      <div className="aspect-video bg-neutral-900 relative overflow-hidden">
                        {design.settings.baseImage ? (
                          <img src={design.settings.baseImage} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700" alt={design.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/5">
                            <LayoutGrid size={48} />
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1.5 rounded-full text-[7px] uppercase tracking-[0.2em] font-bold border ${
                            design.status === 'published' ? 'bg-[#22c55e] text-black border-[#22c55e]/30' : 
                            design.status === 'quote-requested' ? 'bg-blue-500 text-white border-blue-400/30' :
                            design.status === 'archived' ? 'bg-white/10 text-white/40 border-white/10' :
                            'bg-white/5 text-white/60 border-white/10 backdrop-blur-md'
                          }`}>
                            {design.status.replace('-', ' ')}
                          </span>
                        </div>

                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                          <button 
                            onClick={() => handleShare('design', design)}
                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                            title="Share"
                          >
                            <Share2 size={16} />
                          </button>
                          <Link 
                            to={`/customize?designId=${design.id}`}
                            className="w-10 h-10 rounded-full bg-[#22c55e] text-black flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                            title="Edit"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white tracking-tight mb-1 group-hover:text-[#22c55e] transition-colors">{design.name}</h3>
                            <div className="flex items-center gap-3 text-[8px] uppercase tracking-widest text-white/20 font-bold">
                              <span>{new Date(design.createdAt).toLocaleDateString()}</span>
                              <span className="w-1 h-1 rounded-full bg-white/10" />
                              <span>{design.settings.product?.name || 'Custom Material'}</span>
                            </div>
                          </div>
                          <div className="relative group/menu">
                            <button className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                              <MoreVertical size={16} />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#141414] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden backdrop-blur-xl">
                              <button 
                                onClick={() => handlePublishToggle('design', design.id)}
                                className="w-full px-5 py-4 text-left text-[9px] uppercase tracking-widest font-bold text-white/40 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
                              >
                                {design.isPublic ? <Lock size={14} className="text-red-400/50" /> : <Globe size={14} className="text-[#22c55e]/50" />} 
                                {design.isPublic ? 'Make Private' : 'Publish to Gallery'}
                              </button>
                              <button 
                                onClick={() => handleDuplicate(design)}
                                className="w-full px-5 py-4 text-left text-[9px] uppercase tracking-widest font-bold text-white/40 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
                              >
                                <Copy size={14} className="text-white/20" /> Duplicate
                              </button>
                              <div className="h-px bg-white/5 mx-2" />
                              {design.status !== 'archived' ? (
                                <button 
                                  onClick={() => handleArchive(design.id)}
                                  className="w-full px-5 py-4 text-left text-[9px] uppercase tracking-widest font-bold text-white/40 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
                                >
                                  <Archive size={14} className="text-white/20" /> Archive
                                </button>
                              ) : (
                                <button 
                                  onClick={() => updateDesign(design.id, { status: 'draft' })}
                                  className="w-full px-5 py-4 text-left text-[9px] uppercase tracking-widest font-bold text-white/40 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
                                >
                                  <FileText size={14} className="text-white/20" /> Restore
                                </button>
                              )}
                              <button 
                                onClick={() => deleteDesign(design.id)}
                                className="w-full px-5 py-4 text-left text-[9px] uppercase tracking-widest font-bold text-red-400/60 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-all"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                              <span className="text-[7px] uppercase tracking-widest text-white/20 mb-0.5 font-bold">Views</span>
                              <span className="text-[10px] font-bold text-white/60">0</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[7px] uppercase tracking-widest text-white/20 mb-0.5 font-bold">Saves</span>
                              <span className="text-[10px] font-bold text-white/60">0</span>
                            </div>
                          </div>
                          {design.status === 'quote-requested' && (
                            <div className="flex items-center gap-2 text-[#22c55e]">
                              <Clock size={12} />
                              <span className="text-[8px] uppercase tracking-widest font-bold">Pending Review</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-2">My Projects</h2>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Showcase your completed installations with Brick Tile Shop</p>
                </div>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-8 py-4 bg-[#22c55e] text-black rounded-full text-[10px] font-bold tracking-widest uppercase hover:opacity-90 transition-all shadow-lg shadow-[#22c55e]/10 flex items-center gap-2"
                >
                  <Package size={14} /> Upload New Project
                </button>
              </div>

              {/* Project Filters */}
              <div className="flex flex-wrap gap-2 border-b border-white/5 pb-6">
                    {(['all', 'draft', 'approved', 'featured', 'archived'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setProjectFilter(filter)}
                        className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${projectFilter === filter ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                      >
                        {filter.replace('-', ' ')}
                      </button>
                    ))}
              </div>

              {filteredProjects.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
                    <Building2 size={32} className="text-white/10" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4">No Projects Found</h3>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-8 max-w-xs mx-auto">
                    {projectFilter === 'all' 
                      ? "Share your completed projects to inspire the community and showcase your work."
                      : `You have no projects with the status "${projectFilter}".`}
                  </p>
                  <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="text-[#22c55e] text-[10px] font-bold tracking-widest uppercase hover:underline"
                  >
                    Upload Your First Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-[#22c55e]/30 transition-all flex flex-col">
                      <div className="aspect-video bg-neutral-900 relative overflow-hidden">
                        <img src={project.images.publishVariant} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt={project.title} />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <span className={`px-2 py-1 rounded text-[8px] uppercase tracking-widest font-bold ${
                            project.status === 'approved' ? 'bg-[#22c55e] text-black' : 
                            project.status === 'featured' ? 'bg-yellow-500 text-black' :
                            project.status === 'submitted' ? 'bg-blue-500 text-white' :
                            project.status === 'rejected' ? 'bg-red-500 text-white' :
                            project.status === 'draft' ? 'bg-white/20 text-white/60' :
                            'bg-white/10 text-white/60'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-[#22c55e] transition-colors">{project.title}</h3>
                            <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-white/40 font-bold">
                              <span className="flex items-center gap-1.5"><MapPin size={10} className="text-white/20" /> {project.location || 'Location Not Specified'}</span>
                              <span className="w-1 h-1 rounded-full bg-white/10" />
                              <span className="flex items-center gap-1.5"><Layers size={10} className="text-white/20" /> {project.projectType}</span>
                            </div>
                          </div>
                          <div className="relative group/menu">
                            <button className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                              <MoreVertical size={16} />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-52 bg-[#141414] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden backdrop-blur-xl">
                              <button 
                                onClick={() => handlePublishToggle('project', project.id)}
                                className="w-full px-5 py-4 text-left text-[9px] uppercase tracking-widest font-bold text-white/40 hover:text-white hover:bg-white/5 flex items-center gap-3 transition-all"
                              >
                                {project.isPublic ? <Lock size={14} className="text-red-400/50" /> : <Globe size={14} className="text-[#22c55e]/50" />} 
                                {project.isPublic ? 'Make Private' : 'Submit to Gallery'}
                              </button>
                              <div className="h-px bg-white/5 mx-2" />
                              <button 
                                onClick={() => deleteProject(project.id)}
                                className="w-full px-5 py-4 text-left text-[9px] uppercase tracking-widest font-bold text-red-400/60 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-all"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                        {project.attribution?.architect && (
                          <div className="mb-8">
                            <span className="text-[7px] uppercase tracking-widest text-white/20 block mb-2 font-bold">Architect / Designer</span>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <User size={10} className="text-white/40" />
                              </div>
                              <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold">{project.attribution.architect}</span>
                            </div>
                          </div>
                        )}

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col gap-1">
                              <span className="text-[7px] uppercase tracking-widest text-white/20 font-bold">Products</span>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/60">
                                <ShoppingBag size={10} className="text-white/20" />
                                <span>{project.products?.length || 0}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[7px] uppercase tracking-widest text-white/20 font-bold">Views</span>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/60">
                                <Eye size={10} className="text-white/20" />
                                <span>0</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex -space-x-2">
                            {project.products?.slice(0, 3).map((productId, i) => {
                              const allProducts = [...(productData['cladding-tiles'].catalog || []), ...(productData['clay-bricks']?.catalog || [])];
                              const product = allProducts.find(p => p.id === productId);
                              return product ? (
                                <div key={i} className="w-7 h-7 rounded-full border-2 border-black overflow-hidden bg-neutral-800 shadow-lg">
                                  <img src={product.images?.[0] || 'https://picsum.photos/seed/product/100/100'} className="w-full h-full object-cover" alt={product.name} />
                                </div>
                              ) : null;
                            })}
                            {(project.products?.length || 0) > 3 && (
                              <div className="w-7 h-7 rounded-full border-2 border-black bg-[#141414] flex items-center justify-center text-[7px] font-bold text-white/40 shadow-lg">
                                +{(project.products?.length || 0) - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Modal */}
        <AnimatePresence>
          {isShareModalOpen && selectedItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsShareModalOpen(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="flex flex-col md:flex-row h-full">
                  {/* Preview Area */}
                  <div className="flex-1 bg-neutral-900 relative aspect-square md:aspect-auto overflow-hidden">
                    <img 
                      src={selectedItem.type === 'design' 
                        ? selectedItem.settings.renderUrl 
                        : selectedItem.images.shareVariant
                      } 
                      className="w-full h-full object-cover"
                      alt="Share Preview"
                    />
                    <WatermarkOverlay />
                    
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Project Ref</div>
                        <div className="text-xs font-bold text-white uppercase tracking-widest">{selectedItem.title || selectedItem.name}</div>
                      </div>
                    </div>
                  </div>

                  {/* Controls Area */}
                  <div className="w-full md:w-80 p-8 border-l border-white/5 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest">Share Options</h3>
                      <button onClick={() => setIsShareModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-6 flex-1">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                          <ShieldCheck size={16} className="text-[#22c55e]" />
                          <span className="text-[10px] uppercase tracking-widest font-bold text-white">Managed Variant</span>
                        </div>
                        <p className="text-[9px] text-white/30 uppercase tracking-widest leading-relaxed">
                          This version includes a non-destructive watermark and project metadata for public sharing.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <button className="w-full py-4 bg-white text-black rounded-xl text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-3 hover:bg-[#22c55e] transition-all">
                          <Download size={14} /> Download Variant
                        </button>
                        <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                          <Share2 size={14} /> Copy Public Link
                        </button>
                      </div>

                      <div className="pt-6 border-t border-white/5">
                        <div className="text-[10px] uppercase tracking-widest text-white/20 mb-4">Direct Share</div>
                        <div className="grid grid-cols-4 gap-2">
                          {['Instagram', 'Pinterest', 'LinkedIn', 'X'].map(platform => (
                            <button key={platform} className="aspect-square bg-white/5 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all" title={platform}>
                              <ExternalLink size={16} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3 text-white/20">
                        <Lock size={12} />
                        <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Original Asset Protected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Project Upload Modal */}
        <AnimatePresence>
          {isUploadModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Upload Project</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Share your completed installation</p>
                  </div>
                  <button 
                    onClick={() => setIsUploadModalOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* Step 1: Basic Info */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Project Title</label>
                        <input 
                          type="text" 
                          value={newProject.title}
                          onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                          placeholder="e.g. Modern Coastal Villa" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs uppercase tracking-widest text-white focus:outline-none focus:border-[#22c55e]/50 transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Project Type</label>
                        <select 
                          value={newProject.projectType}
                          onChange={(e) => setNewProject({...newProject, projectType: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs uppercase tracking-widest text-white focus:outline-none focus:border-[#22c55e]/50 transition-all appearance-none"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Hospitality">Hospitality</option>
                          <option value="Public Space">Public Space</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Location (Optional)</label>
                        <input 
                          type="text" 
                          value={newProject.location}
                          onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                          placeholder="e.g. Malibu, CA" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs uppercase tracking-widest text-white focus:outline-none focus:border-[#22c55e]/50 transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Architect / Designer</label>
                        <input 
                          type="text" 
                          value={newProject.attribution.architect}
                          onChange={(e) => setNewProject({...newProject, attribution: {...newProject.attribution, architect: e.target.value}})}
                          placeholder="e.g. Studio Linear" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs uppercase tracking-widest text-white focus:outline-none focus:border-[#22c55e]/50 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Project Description</label>
                      <textarea 
                        rows={3} 
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        placeholder="Tell us about the project and how BTS tiles were used..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs uppercase tracking-widest text-white focus:outline-none focus:border-[#22c55e]/50 transition-all resize-none" 
                      />
                    </div>
                  </div>

                  {/* Step 2: Media Upload */}
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Project Media</label>
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-[#22c55e]/30 transition-all cursor-pointer group">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#22c55e]/10 transition-all">
                        <Upload size={24} className="text-white/20 group-hover:text-[#22c55e] transition-all" />
                      </div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Drop high-res photos here</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">or click to browse files (Max 10MB per image)</p>
                    </div>
                  </div>

                  {/* Step 3: Product Tagging */}
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Linked Products</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[...(productData['cladding-tiles'].catalog || []), ...(productData['clay-bricks']?.catalog || [])].slice(0, 6).map(product => (
                        <button 
                          key={product.id}
                          onClick={() => toggleProductTag(product.id)}
                          className={`p-3 border rounded-xl flex flex-col items-center gap-2 transition-all ${newProject.products.includes(product.id) ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'}`}
                        >
                          <div className="w-full aspect-square rounded-lg overflow-hidden">
                            <img src={product.images?.[0] || 'https://picsum.photos/seed/prod/400/400'} className="w-full h-full object-cover" alt={product.name} />
                          </div>
                          <span className="text-[8px] uppercase tracking-widest font-bold text-center line-clamp-1">{product.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Visibility */}
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-white mb-1">Submit to Public Gallery</h4>
                      <p className="text-[8px] uppercase tracking-widest text-white/30">Your project will be reviewed by our team before appearing in the community showcase.</p>
                    </div>
                    <button 
                      onClick={() => setNewProject({...newProject, isPublic: !newProject.isPublic})}
                      className={`w-12 h-6 rounded-full transition-all relative ${newProject.isPublic ? 'bg-[#22c55e]' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${newProject.isPublic ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="p-8 bg-white/5 border-t border-white/5 flex justify-end gap-4">
                  <button 
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleProjectSubmit}
                    disabled={!newProject.title}
                    className={`px-10 py-4 bg-[#22c55e] text-black rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg shadow-[#22c55e]/10 ${!newProject.title ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                  >
                    Save Project
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Share Modal */}
        <AnimatePresence>
          {isShareModalOpen && selectedItem && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsShareModalOpen(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              >
                {/* Preview Area */}
                <div className="flex-1 bg-neutral-900 p-8 flex flex-col items-center justify-center relative min-h-[400px]">
                  <div className="relative w-full max-w-md aspect-[4/5] bg-white shadow-2xl overflow-hidden rounded-sm flex flex-col">
                    <div className="flex-1 relative overflow-hidden">
                      <img 
                        src={selectedItem.settings?.baseImage || selectedItem.images?.publishVariant || 'https://picsum.photos/seed/share/800/1000'} 
                        className="w-full h-full object-cover" 
                        alt="Preview" 
                      />
                      <div className="absolute top-6 left-6">
                        <div className="text-[8px] font-bold tracking-[0.4em] uppercase text-white drop-shadow-md">Brick Tile Shop</div>
                      </div>
                    </div>
                    <div className="p-6 bg-white text-black">
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-1">{selectedItem.name || selectedItem.title}</div>
                      <div className="text-[8px] uppercase tracking-widest text-black/40">Design Concept • {new Date().toLocaleDateString()}</div>
                      <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-end">
                        <div>
                          <div className="text-[7px] uppercase tracking-widest text-black/30 mb-1">Featured Product</div>
                          <div className="text-[9px] font-bold uppercase tracking-widest">
                            {selectedItem.settings?.product?.name || 'Premium Cladding'}
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-[6px] font-bold">BTS</div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-[10px] text-white/30 uppercase tracking-widest">Branded Export Preview</p>
                </div>

                {/* Controls Area */}
                <div className="w-full md:w-80 p-10 border-l border-white/5 flex flex-col">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Share Design</h2>
                    <button onClick={() => setIsShareModalOpen(false)} className="text-white/20 hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6 flex-1">
                    <div>
                      <label className="text-[9px] text-white/30 uppercase tracking-[0.3em] mb-4 block font-bold">Export Format</label>
                      <div className="grid grid-cols-1 gap-2">
                        {['Instagram Story (9:16)', 'Pinterest Pin (2:3)', 'Standard PDF'].map(f => (
                          <button key={f} className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-xl text-[10px] uppercase tracking-widest font-bold text-white/60 hover:text-white hover:bg-white/10 text-left transition-all">
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] text-white/30 uppercase tracking-[0.3em] mb-4 block font-bold">Direct Link</label>
                      <div className="flex gap-2">
                        <input 
                          readOnly 
                          value={`https://bts.com/share/${selectedItem.id}`} 
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white/40 focus:outline-none"
                        />
                        <button className="p-3 bg-white/10 rounded-xl text-white hover:bg-[#22c55e] hover:text-black transition-all">
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-5 bg-[#22c55e] text-black rounded-2xl text-[10px] uppercase tracking-[0.4em] font-bold shadow-lg shadow-[#22c55e]/10 mt-10">
                    Download Asset
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
