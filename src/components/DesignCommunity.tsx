import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Heart, 
  Share2, 
  Bookmark, 
  MessageCircle,
  MapPin, 
  User, 
  Sparkles, 
  Building2, 
  X,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Info,
  BookOpen,
  CheckCircle,
  Layout,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { NavigationBar } from './NavigationBar';
import { Footer } from './Footer';

// --- Types ---

type CommunityPostType = 'social_post' | 'generated_design' | 'built_project';
type CommunityCategory = 'all' | 'residential' | 'commercial' | 'hospitality' | 'retail' | 'landscape';
type CommunitySourceModule = 'marketing_studio' | 'design_studio' | 'project_submission';
type AuthorType = 'bts_team' | 'customer' | 'partner';
type VerificationState = 'editorial' | 'concept' | 'verified_build';

type EditorialPostType = 'industry_news' | 'educational_guide' | 'blog_post' | 'trend_article' | 'installation_tip' | 'material_tips';

interface EditorialPost {
  id: string;
  slug: string;
  type: EditorialPostType;
  title: string;
  excerpt: string;
  coverImage: string;
  readTime: string;
  publishedAt: string;
  category: string;
  author: { 
    name: string; 
    role?: string;
    avatar?: string;
  };
  featured: boolean;
  tags: string[];
  relatedProducts?: { id: string; name: string }[];
}

interface CommunityPost {
  id: string;
  type: CommunityPostType;
  sourceModule: CommunitySourceModule;
  publishOrigin: string;
  authorType: AuthorType;
  verificationState: VerificationState;
  title: string;
  description: string;
  mediaUrl: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  metadata: {
    category: CommunityCategory;
    location?: string;
    tags: string[];
    date: string;
    projectType?: string;
    roomType?: string;
    studioId?: string;
  };
  products: { id: string; name: string; price: string; image: string }[];
  stats: {
    likes: number;
    comments: number;
    saves: number;
    shares: number;
  };
}

// --- Mock Data ---

const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    type: 'social_post',
    sourceModule: 'marketing_studio',
    publishOrigin: 'BTS Editorial',
    authorType: 'bts_team',
    verificationState: 'editorial',
    title: 'Minimalist Industrial Loft',
    description: 'Exploring the raw beauty of exposed brick and polished concrete in a modern urban setting. Curated by the BTS Editorial team.',
    author: { name: 'BTS Editorial', role: 'Curator' },
    mediaUrl: 'https://images.unsplash.com/photo-1536376074432-bf1217709993?auto=format&fit=crop&q=80&w=1200',
    metadata: {
      category: 'residential',
      tags: ['Industrial', 'Minimalist', 'Urban'],
      date: '2024-03-20T10:00:00Z'
    },
    products: [
      { id: 'p1', name: 'Raw Charcoal Brick', price: 'R450/sqm', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200' }
    ],
    stats: { likes: 3200, comments: 45, saves: 1240, shares: 450 }
  },
  {
    id: '2',
    type: 'generated_design',
    sourceModule: 'design_studio',
    publishOrigin: 'Studio Workspace',
    authorType: 'customer',
    verificationState: 'concept',
    title: 'Coastal Retreat Concept',
    description: 'A customer-generated design using the BTS Customize Studio. Featuring light-toned bricks and airy textures for a beachside feel.',
    author: { name: 'Sarah Jenkins', role: 'Designer' },
    mediaUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    metadata: {
      category: 'residential',
      tags: ['Coastal', 'Light', 'Residential'],
      date: '2024-03-22T14:30:00Z',
      roomType: 'Living Room',
      studioId: 'studio-001'
    },
    products: [
      { id: 'p2', name: 'Sandstone Facing Brick', price: 'R380/sqm', image: 'https://images.unsplash.com/photo-1590069230002-70cc30445991?auto=format&fit=crop&q=80&w=200' }
    ],
    stats: { likes: 1500, comments: 28, saves: 850, shares: 120 }
  },
  {
    id: '3',
    type: 'built_project',
    sourceModule: 'project_submission',
    publishOrigin: 'Partner Portal',
    authorType: 'partner',
    verificationState: 'verified_build',
    title: 'The Urban Office HQ',
    description: 'A large-scale commercial project featuring custom-made architectural bricks. Completed in collaboration with Studio X Architects.',
    author: { name: 'Studio X Architects', role: 'Architectural Partner' },
    mediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    metadata: {
      category: 'commercial',
      tags: ['Commercial', 'Office', 'Modern'],
      date: '2024-03-15T09:00:00Z',
      location: 'Cape Town, SA',
      projectType: 'Commercial'
    },
    products: [
      { id: 'p3', name: 'Custom Architectural Grey', price: 'Contact for Quote', image: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&q=80&w=200' }
    ],
    stats: { likes: 5600, comments: 112, saves: 2100, shares: 890 }
  },
  {
    id: '4',
    type: 'social_post',
    sourceModule: 'marketing_studio',
    publishOrigin: 'BTS Editorial',
    authorType: 'bts_team',
    verificationState: 'editorial',
    title: 'Terracotta Textures',
    description: 'The warmth of traditional terracotta meets contemporary design. A look into our upcoming Autumn collection.',
    author: { name: 'BTS Editorial', role: 'Curator' },
    mediaUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
    metadata: {
      category: 'retail',
      tags: ['Terracotta', 'Warm', 'Traditional'],
      date: '2024-03-25T11:20:00Z'
    },
    products: [
      { id: 'p4', name: 'Classic Terracotta Tile', price: 'R290/sqm', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200' }
    ],
    stats: { likes: 980, comments: 12, saves: 560, shares: 89 }
  },
  {
    id: '5',
    type: 'generated_design',
    sourceModule: 'design_studio',
    publishOrigin: 'Studio Workspace',
    authorType: 'customer',
    verificationState: 'concept',
    title: 'Modern Farmhouse Kitchen',
    description: 'Combining rustic charm with sleek modern finishes. Designed in the BTS Studio for a private residence.',
    author: { name: 'Michael Chen', role: 'Customer' },
    mediaUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200',
    metadata: {
      category: 'residential',
      tags: ['Farmhouse', 'Kitchen', 'Modern'],
      date: '2024-03-26T16:45:00Z',
      roomType: 'Kitchen'
    },
    products: [
      { id: 'p5', name: 'Antique White Brick', price: 'R420/sqm', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=200' }
    ],
    stats: { likes: 2100, comments: 34, saves: 1100, shares: 230 }
  },
  {
    id: '6',
    type: 'built_project',
    sourceModule: 'project_submission',
    publishOrigin: 'Customer Submission',
    authorType: 'customer',
    verificationState: 'verified_build',
    title: 'Heritage Home Restoration',
    description: 'Preserving history with authentic heritage bricks. A meticulous restoration of a 1920s Victorian home.',
    author: { name: 'Heritage Builders', role: 'Restoration Specialist' },
    mediaUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200',
    metadata: {
      category: 'hospitality',
      tags: ['Heritage', 'Residential', 'Restoration'],
      date: '2024-03-10T08:30:00Z',
      location: 'Johannesburg, SA',
      projectType: 'Residential'
    },
    products: [
      { id: 'p6', name: 'Heritage Red Multi', price: 'R550/sqm', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=200' }
    ],
    stats: { likes: 8900, comments: 245, saves: 3400, shares: 1200 }
  },
  {
    id: '7',
    type: 'social_post',
    sourceModule: 'marketing_studio',
    publishOrigin: 'BTS Editorial',
    authorType: 'bts_team',
    verificationState: 'editorial',
    title: 'Zen Garden Path',
    description: 'Creating tranquility with natural stone and brick textures. A landscape design focused on mindfulness and flow.',
    author: { name: 'BTS Editorial', role: 'Curator' },
    mediaUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
    metadata: {
      category: 'landscape',
      tags: ['Zen', 'Landscape', 'Natural'],
      date: '2024-03-27T10:15:00Z'
    },
    products: [
      { id: 'p7', name: 'Slate Grey Paver', price: 'R320/sqm', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=200' }
    ],
    stats: { likes: 850, comments: 18, saves: 420, shares: 56 }
  },
  {
    id: '8',
    type: 'generated_design',
    sourceModule: 'design_studio',
    publishOrigin: 'Studio Workspace',
    authorType: 'customer',
    verificationState: 'concept',
    title: 'Boutique Hotel Lobby',
    description: 'A sophisticated and welcoming lobby concept using premium cladding tiles and warm lighting.',
    author: { name: 'Elena Rossi', role: 'Interior Designer' },
    mediaUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    metadata: {
      category: 'commercial',
      tags: ['Hotel', 'Lobby', 'Luxury'],
      date: '2024-03-28T09:45:00Z',
      roomType: 'Lobby'
    },
    products: [
      { id: 'p8', name: 'Polished Marble Tile', price: 'R1200/sqm', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=200' }
    ],
    stats: { likes: 4200, comments: 88, saves: 1800, shares: 410 }
  }
];

const MOCK_EDITORIALS: EditorialPost[] = [
  {
    id: 'e1',
    slug: 'resurgence-of-terracotta-modern-commercial',
    type: 'trend_article',
    title: 'The Resurgence of Terracotta in Modern Commercial Spaces',
    excerpt: 'How leading architects are utilizing warm, earthy tones to offset cold urban environments and create inviting public spaces.',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    readTime: '5 min read',
    publishedAt: '2024-03-26T09:00:00Z',
    category: 'Architecture',
    author: { name: 'BTS Editorial', role: 'Curator' },
    featured: true,
    tags: ['Terracotta', 'Commercial', 'Trends'],
    relatedProducts: [{ id: 'p4', name: 'Classic Terracotta' }]
  },
  {
    id: 'e2',
    slug: 'understanding-mortar-joints-technical-guide',
    type: 'educational_guide',
    title: 'Understanding Mortar Joints: A Technical Guide',
    excerpt: 'From flush to recessed, explore how different mortar joint profiles completely change the shadow play and aesthetic of your brickwork.',
    coverImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
    readTime: '8 min read',
    publishedAt: '2024-03-22T11:30:00Z',
    category: 'Technical',
    author: { name: 'Technical Team', role: 'Engineering' },
    featured: false,
    tags: ['Technical', 'Installation', 'Guide']
  },
  {
    id: 'e3',
    slug: 'sustainable-firing-practices-2024',
    type: 'industry_news',
    title: 'Sustainable Firing Practices in 2024',
    excerpt: 'Brick Tile Shop announces new carbon-offset initiatives and lower-emission kiln technologies for our core ranges.',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    readTime: '3 min read',
    publishedAt: '2024-03-18T15:45:00Z',
    category: 'Sustainability',
    author: { name: 'BTS Corporate', role: 'Strategy' },
    featured: false,
    tags: ['Sustainability', 'News', 'Innovation']
  },
  {
    id: 'e4',
    slug: 'sealing-exterior-cladding-best-practices',
    type: 'installation_tip',
    title: 'Sealing Exterior Cladding: Best Practices',
    excerpt: 'Protect your investment. Learn the optimal sealing schedule and product recommendations for coastal vs. inland projects.',
    coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
    readTime: '6 min read',
    publishedAt: '2024-03-15T10:20:00Z',
    category: 'Maintenance',
    author: { name: 'Support Team', role: 'Customer Success' },
    featured: false,
    tags: ['Maintenance', 'Tips', 'Exterior']
  },
  {
    id: 'e5',
    slug: 'the-future-of-brick-digital-craftsmanship',
    type: 'blog_post',
    title: 'The Future of Brick: Digital Craftsmanship',
    excerpt: 'Exploring the intersection of robotic masonry and traditional bricklaying in the next generation of architectural facades.',
    coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    readTime: '7 min read',
    publishedAt: '2024-03-10T14:00:00Z',
    category: 'Innovation',
    author: { name: 'BTS Studio', role: 'Design Lead' },
    featured: false,
    tags: ['Robotics', 'Craftsmanship', 'Future']
  }
];

// --- Sub-components ---

const TypeBadge = ({ type, count }: { type: CommunityPostType; count: number }) => {
  const config = {
    social_post: { label: 'Editorial', icon: BookOpen, color: 'text-white/40' },
    generated_design: { label: 'Concept', icon: Sparkles, color: 'text-blue-400' },
    built_project: { label: 'Built', icon: CheckCircle, color: 'text-[#00ff88]' }
  };

  const { label, icon: Icon, color } = config[type];

  return (
    <div className="flex items-center gap-4">
      <div className={`flex items-center gap-2 text-[8px] font-mono uppercase tracking-[0.3em] ${color}`}>
        <Icon size={10} />
        {label}
      </div>
      <div className="w-px h-3 bg-white/10" />
      <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
        {count} Materials
      </div>
    </div>
  );
};

const FeaturedCommunityCard = ({ post, onClick }: { post: CommunityPost; onClick: () => void }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      onClick={onClick}
      className="group relative bg-[#0a0a0a] border border-white/5 rounded-[24px] overflow-hidden cursor-pointer transition-all duration-700 hover:border-white/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] col-span-1 sm:col-span-2 lg:col-span-2 flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]"
    >
      {/* Media Container */}
      <div className="w-full md:w-3/5 h-[300px] md:h-auto overflow-hidden relative">
        <img 
          src={post.mediaUrl} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-70 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent opacity-90" />
        
        <div className="absolute top-8 left-8">
          <TypeBadge type={post.type} count={post.products.length} />
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between relative z-10 bg-gradient-to-t md:bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a] to-transparent md:from-[#0a0a0a] md:via-[#0a0a0a] md:to-transparent -mt-32 md:mt-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${
              post.type === 'built_project' ? 'bg-[#00ff88]' : 
              post.type === 'generated_design' ? 'bg-blue-400' : 'bg-white/40'
            } animate-pulse`} />
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.3em]">
              Featured {post.metadata.category}
            </span>
          </div>
          
          <h3 className="text-3xl md:text-5xl font-serif font-light text-white leading-[1.1] tracking-tight group-hover:text-[#00ff88] transition-colors duration-500">
            {post.title}
          </h3>

          <p className="text-white/40 font-light leading-relaxed text-sm md:text-base line-clamp-3">
            {post.description}
          </p>
          
          <div className="flex items-center gap-4 text-[9px] text-white/40 font-mono uppercase tracking-widest pt-4">
            <span className="hover:text-white transition-colors">{post.author.name}</span>
            {post.metadata.location && (
              <>
                <span className="w-px h-2 bg-white/10" />
                <span className="flex items-center gap-2">
                  <MapPin size={10} className="text-[#00ff88]/40" />
                  {post.metadata.location}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-8">
          <div className="flex gap-6 text-white/20">
            <div className="flex items-center gap-2 group/stat">
              <Heart size={12} className="group-hover/stat:text-red-500 transition-colors" />
              <span className="text-[10px] font-mono">{post.stats.likes}</span>
            </div>
            <div className="flex items-center gap-2 group/stat">
              <Bookmark size={12} className="group-hover/stat:text-[#00ff88] transition-colors" />
              <span className="text-[10px] font-mono">{post.stats.saves}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-widest text-[#00ff88] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
            Explore Case <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CommunityCard = ({ post, onClick }: { post: CommunityPost; onClick: () => void }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -12 }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      onClick={onClick}
      className="group relative bg-[#0a0a0a] border border-white/5 rounded-[24px] overflow-hidden cursor-pointer transition-all duration-700 hover:border-white/20 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
    >
      {/* Media Container - 3:4 Aspect Ratio */}
      <div className="aspect-[3/4] overflow-hidden relative">
        <img 
          src={post.mediaUrl} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        
        {/* Technical Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40 opacity-90" />
        
        {/* Top Technical Header */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
          <TypeBadge type={post.type} count={post.products.length} />
          <div className="text-[7px] font-mono text-white/20 uppercase tracking-[0.4em]">
            REF: BTS-{post.id}
          </div>
        </div>

        {/* Material Palette Strip (Appears on Hover) */}
        <div className="absolute top-1/2 left-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          {post.products.slice(0, 3).map((p, i) => (
            <div key={p.id} className="w-10 h-10 rounded-lg border border-white/20 overflow-hidden backdrop-blur-md bg-black/40">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
            </div>
          ))}
          {post.products.length > 3 && (
            <div className="w-10 h-10 rounded-lg border border-white/20 backdrop-blur-md bg-black/40 flex items-center justify-center text-[8px] font-mono text-white/40">
              +{post.products.length - 3}
            </div>
          )}
        </div>

        {/* Bottom Editorial Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                post.type === 'built_project' ? 'bg-[#00ff88]' : 
                post.type === 'generated_design' ? 'bg-blue-400' : 'bg-white/40'
              } animate-pulse`} />
              <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.3em]">
                {post.metadata.category}
              </span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-serif font-light text-white leading-[1.1] tracking-tight group-hover:text-[#00ff88] transition-colors duration-500">
              {post.title}
            </h3>
            
            <div className="flex items-center gap-4 text-[9px] text-white/40 font-mono uppercase tracking-widest">
              <span className="hover:text-white transition-colors">{post.author.name}</span>
              {post.metadata.location && (
                <>
                  <span className="w-px h-2 bg-white/10" />
                  <span className="flex items-center gap-2">
                    <MapPin size={10} className="text-[#00ff88]/40" />
                    {post.metadata.location}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex gap-6 text-white/20">
              <div className="flex items-center gap-2 group/stat">
                <Heart size={12} className="group-hover/stat:text-red-500 transition-colors" />
                <span className="text-[10px] font-mono">{post.stats.likes}</span>
              </div>
              <div className="flex items-center gap-2 group/stat">
                <Bookmark size={12} className="group-hover/stat:text-[#00ff88] transition-colors" />
                <span className="text-[10px] font-mono">{post.stats.saves}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-widest text-[#00ff88] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
              Explore Case <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DetailDrawer = ({ post, onClose }: { post: CommunityPost | null; onClose: () => void }) => {
  const navigate = useNavigate();
  if (!post) return null;

  // Derive related posts (same category, excluding current)
  const relatedPosts = MOCK_POSTS
    .filter(p => p.metadata.category === post.metadata.category && p.id !== post.id)
    .slice(0, 2);

  const mockComments = [
    { id: 'c1', author: 'David K.', role: 'Architect', timestamp: '2h ago', body: 'The way the charcoal brick catches the morning light in this project is exceptional. Great use of texture contrast.' },
    { id: 'c2', author: 'Sarah J.', role: 'Interior Designer', timestamp: '5h ago', body: 'Love the minimalist approach here. Are those custom mortar joints?' },
    { id: 'c3', author: 'BTS Support', role: 'Material Specialist', timestamp: '1d ago', body: 'Glad you like it, Sarah! Yes, these are 10mm recessed joints using our Charcoal Mortar mix.' },
  ];

  const palette = [
    { color: '#1a1a1a', label: 'Charcoal' },
    { color: '#4a4a4a', label: 'Slate' },
    { color: '#a1a1a1', label: 'Concrete' },
    { color: '#f5f5f5', label: 'Off-White' },
  ];

  const renderCTAs = () => {
    switch (post.type) {
      case 'generated_design':
        return (
          <>
            <button 
              onClick={() => {
                onClose();
                navigate(`/customize/${post.metadata.studioId || post.id}`);
              }}
              className="flex-1 py-5 md:py-6 bg-[#00ff88] text-black font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(0,255,136,0.4)]"
            >
              Start From This Design <Sparkles size={16} />
            </button>
            <button 
              onClick={() => {
                onClose();
                navigate('/#catalog');
              }}
              className="flex-1 py-5 md:py-6 bg-white text-black font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Shop Materials <ShoppingBag size={16} />
            </button>
          </>
        );
      case 'built_project':
        return (
          <>
            <button 
              onClick={() => {
                toast.info('Detailed case study documentation is being prepared.');
              }}
              className="flex-1 py-5 md:py-6 bg-[#00ff88] text-black font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(0,255,136,0.4)]"
            >
              View Case Details <BookOpen size={16} />
            </button>
            <button 
              onClick={() => {
                onClose();
                navigate('/#contact');
              }}
              className="flex-1 py-5 md:py-6 bg-white text-black font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              Request Similar Quote <ArrowRight size={16} />
            </button>
          </>
        );
      default: // social_post / editorial
        return (
          <>
            <button 
              onClick={() => {
                onClose();
                navigate('/#catalog');
              }}
              className="flex-1 py-5 md:py-6 bg-[#00ff88] text-black font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(0,255,136,0.4)]"
            >
              Explore Materials <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => {
                toast.info('Campaign details and editorial context coming soon.');
              }}
              className="flex-1 py-5 md:py-6 bg-white text-black font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              View Campaign <Layout size={16} />
            </button>
          </>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex justify-end"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md" 
        onClick={onClose}
      />

      {/* Content */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 35, stiffness: 300 }}
        className="relative w-full max-w-3xl bg-[#0a0a0a] h-full overflow-y-auto border-l border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] no-scrollbar"
      >
        {/* Sticky Header Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-6 md:p-8 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none">
          <button 
            onClick={onClose}
            className="p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-xl border border-white/10 pointer-events-auto group"
          >
            <X size={20} className="md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>
          
          <div className="flex gap-2 md:gap-3 pointer-events-auto">
            <button className="p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-xl border border-white/10 group">
              <Bookmark size={18} className="md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button className="p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-xl border border-white/10 group">
              <Share2 size={18} className="md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <div className="px-5 md:px-16 pb-24 space-y-12 md:space-y-24">
          {/* Main Hero Media */}
          <div className="space-y-8 md:space-y-12">
            <div className="aspect-[16/10] rounded-[24px] md:rounded-[40px] overflow-hidden border border-white/5 shadow-2xl relative group">
              <img 
                src={post.mediaUrl} 
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Technical Overlay */}
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="px-3 md:px-4 py-1.5 md:py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                  <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-[#00ff88] animate-pulse" />
                  <span className="text-[8px] md:text-[9px] font-mono text-white/60 uppercase tracking-widest">Live Viewport</span>
                </div>
              </div>
            </div>

            {/* Title & Narrative */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
              <div className="lg:col-span-8 space-y-8 md:space-y-10">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-4">
                    <TypeBadge type={post.type} count={post.products.length} />
                    <span className="text-[8px] md:text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Case ID: BTS-{post.id}024</span>
                  </div>
                  <h2 className="text-3xl md:text-8xl font-serif font-light text-white leading-[0.9] md:leading-[0.85] tracking-tighter">
                    {post.title}
                  </h2>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 py-8 md:py-10 border-y border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 md:w-14 h-12 md:h-14 rounded-full bg-[#00ff88]/10 flex items-center justify-center border border-[#00ff88]/20">
                      <User size={20} className="md:w-6 md:h-6 text-[#00ff88]" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-[11px] font-bold text-white uppercase tracking-widest leading-none">{post.author.name}</p>
                      <p className="text-[8px] md:text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mt-1 md:mt-1.5">{post.author.role}</p>
                    </div>
                  </div>
                  {post.metadata.location && (
                    <div className="flex items-center gap-3 px-5 md:px-6 py-2.5 md:py-3 bg-white/5 rounded-full border border-white/5 w-fit">
                      <MapPin size={12} className="md:w-3.5 md:h-3.5 text-[#00ff88]" />
                      <span className="text-[9px] md:text-[10px] font-mono text-white/60 uppercase tracking-widest">{post.metadata.location}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-center gap-4">
                    <h4 className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.4em] text-[#00ff88]">The Narrative</h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#00ff88]/20 to-transparent" />
                  </div>
                  <p className="text-white/60 leading-relaxed text-lg md:text-2xl font-light italic font-serif">
                    "{post.description}"
                  </p>
                </div>
              </div>

              {/* Specs Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                {/* Origin Context Section */}
                <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      post.sourceModule === 'marketing_studio' ? 'bg-white/10' : 
                      post.sourceModule === 'design_studio' ? 'bg-blue-500/20' : 'bg-[#00ff88]/20'
                    }`}>
                      {post.sourceModule === 'marketing_studio' ? <BookOpen size={20} className="text-white/60" /> :
                       post.sourceModule === 'design_studio' ? <Sparkles size={20} className="text-blue-400" /> :
                       <CheckCircle size={20} className="text-[#00ff88]" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 mb-1">Publishing Pipeline</p>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">
                        {post.publishOrigin}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-xs text-white/40 leading-relaxed font-light">
                      {post.sourceModule === 'marketing_studio' ? 'Curated by BTS Marketing Studio. This editorial piece highlights material excellence and architectural innovation.' :
                       post.sourceModule === 'design_studio' ? 'Generated in BTS Design Studio. A digital concept exploring material combinations and spatial aesthetics.' :
                       'Verified Build. A real-world project submission from our community of architects, builders, and homeowners.'}
                    </p>
                    
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 w-fit">
                      <div className={`w-1.5 h-1.5 rounded-full ${post.verificationState === 'verified_build' ? 'bg-[#00ff88]' : 'bg-amber-400'}`} />
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                        {post.verificationState.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-6">
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">Specifications</h4>
                    <div className="space-y-4">
                      {[
                        { label: 'Project Type', value: post.metadata.projectType || 'Residential' },
                        { label: 'Context', value: post.metadata.roomType || 'Exterior' },
                        { label: 'Category', value: post.metadata.category },
                        { label: 'Verification', value: post.verificationState.replace('_', ' ') }
                      ].map(spec => (
                        <div key={spec.label} className="space-y-1">
                          <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{spec.label}</p>
                          <p className="text-[10px] font-bold text-white uppercase tracking-widest">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">Technical Palette</h4>
                    <div className="flex gap-2">
                      {palette.map((item, i) => (
                        <div key={i} className="group relative">
                          <div 
                            className="w-8 h-8 rounded-lg border border-white/10 transition-transform group-hover:scale-110" 
                            style={{ backgroundColor: item.color }} 
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/10 rounded text-[8px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Material Components (Linked Products) */}
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#00ff88]">Material Components</h4>
                <p className="text-xs text-white/30">Authentic BTS products used in this project</p>
              </div>
              <button className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-[#00ff88] transition-colors">
                View Catalog
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.products.map(product => (
                <div key={product.id} className="group flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-[24px] hover:border-[#00ff88]/30 transition-all cursor-pointer">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-bold text-white uppercase tracking-tight leading-tight">{product.name}</p>
                    <p className="text-[10px] font-mono text-[#00ff88]">{product.price}</p>
                    <div className="flex items-center gap-2 text-[8px] font-mono text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">
                      View Details <ArrowRight size={10} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Thread */}
          <div className="space-y-10 pt-20 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#00ff88]">Technical Discussion</h4>
                <p className="text-xs text-white/30">{post.stats.comments} Professional Insights</p>
              </div>
              <button className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-[#00ff88] transition-colors">
                Join Conversation
              </button>
            </div>

            <div className="space-y-8">
              {mockComments.map((comment) => (
                <div key={comment.id} className="flex gap-6 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-white/40 shrink-0">
                    {comment.author[0]}
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">{comment.author}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[9px] font-mono text-[#00ff88]/60 uppercase tracking-widest">{comment.role}</span>
                      </div>
                      <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed font-light">
                      {comment.body}
                    </p>
                    <div className="flex items-center gap-6 pt-2">
                      <button className="text-[8px] font-mono uppercase tracking-widest text-white/20 hover:text-white transition-colors">Reply</button>
                      <button className="text-[8px] font-mono uppercase tracking-widest text-white/20 hover:text-white transition-colors">Appreciate</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input Placeholder */}
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Add your technical insight..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 px-8 text-xs text-white focus:outline-none focus:border-[#00ff88]/30 transition-all placeholder:text-white/10"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 rounded-xl text-white/20 group-focus-within:text-[#00ff88] transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Related Projects */}
          {relatedPosts.length > 0 && (
            <div className="space-y-10 pt-20 border-t border-white/5">
              <div className="space-y-1">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/20">Related Projects</h4>
                <p className="text-xs text-white/10">Similar architectural explorations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map(related => (
                  <div 
                    key={related.id}
                    onClick={() => { onClose(); /* In a real app we'd navigate here */ }}
                    className="group space-y-4 cursor-pointer"
                  >
                    <div className="aspect-[16/10] rounded-3xl overflow-hidden border border-white/5 relative">
                      <img 
                        src={related.mediaUrl} 
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:text-[#00ff88] transition-colors">{related.title}</p>
                      <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{related.author.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Cases */}
          <div className="space-y-10 pt-20 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#00ff88]">Related Cases</h4>
                <p className="text-xs text-white/30">Similar architectural explorations</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {MOCK_POSTS.filter(p => p.id !== post.id).slice(0, 2).map(related => (
                <div 
                  key={related.id} 
                  onClick={() => {
                    onClose();
                    // In a real app, we would navigate or update the selected post
                  }}
                  className="group space-y-4 cursor-pointer"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 relative">
                    <img src={related.mediaUrl} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white uppercase tracking-tight truncate">{related.title}</p>
                    <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{related.author.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky CTAs (Bottom) */}
          <div className="pt-12 flex flex-col md:flex-row gap-4">
            {renderCTAs()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const EditorialSection = () => {
  const [activeTab, setActiveTab] = useState<EditorialPostType | 'all'>('all');

  const tabs: { id: EditorialPostType | 'all', label: string }[] = [
    { id: 'all', label: 'All Insights' },
    { id: 'trend_article', label: 'Trends' },
    { id: 'educational_guide', label: 'Guides' },
    { id: 'industry_news', label: 'News' },
    { id: 'blog_post', label: 'Blog' },
    { id: 'material_tips', label: 'Tips' }
  ];

  const filtered = MOCK_EDITORIALS.filter(post => activeTab === 'all' || post.type === activeTab);

  return (
    <section className="px-6 md:px-16 pt-40 pb-40 relative bg-[#080808]">
      {/* Visual Break / Volume Marker */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-3 bg-[#080808] border border-white/10 rounded-full shadow-2xl">
        <span className="text-[9px] font-mono text-[#00ff88] uppercase tracking-[0.6em] font-bold">Volume 02 — The Journal</span>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16 mb-24">
          <div className="space-y-8 max-w-3xl">
            <div className="flex items-center gap-4 text-[#00ff88] font-mono text-[10px] uppercase tracking-[0.5em]">
              <span className="w-12 h-[1px] bg-[#00ff88]/30" />
              Intelligence Layer
            </div>
            <h2 className="text-6xl md:text-8xl font-serif font-light text-white leading-[0.85] tracking-tighter">
              Knowledge <br />
              <span className="italic text-white/20">& Insights</span>
            </h2>
            <p className="text-white/30 leading-relaxed text-lg md:text-2xl font-light max-w-2xl font-serif italic">
              "Curated technical guides, material trends, and industry reports designed to elevate the architectural discourse."
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all border ${
                  activeTab === tab.id
                    ? 'bg-[#00ff88] text-black border-[#00ff88] font-bold shadow-[0_10px_30px_-10px_rgba(0,255,136,0.4)]'
                    : 'bg-transparent text-white/30 border-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Grid with Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <AnimatePresence mode="popLayout">
            {filtered.map((post, index) => {
              const isFeatured = post.featured || (index === 0 && activeTab === 'all');

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 100 }}
                  key={post.id}
                  className={`group relative bg-[#0a0a0a] border border-white/5 rounded-[48px] overflow-hidden cursor-pointer transition-all duration-1000 hover:border-[#00ff88]/30 hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,1)] flex flex-col ${
                    isFeatured ? 'md:col-span-12 lg:col-span-8 md:min-h-[650px]' : 'md:col-span-6 lg:col-span-4 min-h-[500px]'
                  }`}
                >
                  {/* Image Container */}
                  <div className={`relative overflow-hidden ${isFeatured ? 'h-[400px] lg:h-full lg:absolute lg:inset-0' : 'h-[280px]'}`}>
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110 opacity-20 group-hover:opacity-40 grayscale group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent opacity-100" />
                    
                    {/* Featured Label / Category */}
                    <div className="absolute top-10 left-10 z-20 flex items-center gap-4">
                      {isFeatured && (
                        <div className="px-4 py-1.5 bg-[#00ff88] text-black text-[9px] font-mono font-bold uppercase tracking-[0.3em] rounded-full">
                          Featured Story
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-white/20 scale-y-100 group-hover:bg-[#00ff88] transition-colors duration-700" />
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] group-hover:text-white transition-colors">
                          {post.category || post.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className={`relative z-10 flex flex-col justify-end flex-1 p-10 md:p-14 ${isFeatured ? 'lg:w-3/5' : ''}`}>
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                          <Clock size={14} className="text-[#00ff88]" /> {post.readTime}
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="hover:text-white transition-colors">{post.author.name}</span>
                        </div>
                        
                        <h3 className={`${isFeatured ? 'text-4xl md:text-7xl' : 'text-3xl'} font-serif font-light text-white leading-[0.9] tracking-tighter group-hover:text-[#00ff88] transition-colors duration-700`}>
                          {post.title}
                        </h3>
                        
                        <p className={`text-white/30 font-light leading-relaxed ${isFeatured ? 'text-xl md:text-2xl' : 'text-base'} line-clamp-3 font-serif italic`}>
                          {post.excerpt}
                        </p>

                        {isFeatured && post.tags && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {post.tags.map(tag => (
                              <span key={tag} className="text-[8px] font-mono text-white/20 border border-white/5 px-2 py-1 rounded uppercase tracking-widest">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-10 flex items-center justify-between border-t border-white/5 mt-10">
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">Intelligence Report</span>
                          <span className="text-[12px] font-mono text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                        
                        <div className="group/btn relative flex items-center gap-6 overflow-hidden">
                          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#00ff88] translate-x-6 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                            Read Full Insight
                          </span>
                          <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#00ff88] group-hover:text-black transition-all duration-700 group-hover:border-[#00ff88] shadow-2xl">
                            <ArrowUpRight size={24} className="transition-transform group-hover:rotate-45" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtle Border Glow */}
                  <div className="absolute inset-0 border border-white/0 group-hover:border-[#00ff88]/20 rounded-[48px] transition-colors duration-1000 pointer-events-none" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* View All CTA */}
        <div className="mt-24 flex justify-center">
          <button className="group flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-500">
            View All Intelligence Reports
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
              <ArrowRight size={14} />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

// --- Main Page ---

export const DesignCommunity = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initial state from URL
  const typeParam = searchParams.get('type');
  const [activeType, setActiveType] = useState<CommunityPostType | 'all'>((typeParam as any) || 'all');
  
  // Sync URL when state changes
  useEffect(() => {
    const currentType = searchParams.get('type');
    if (activeType === 'all') {
      if (currentType) {
        searchParams.delete('type');
        setSearchParams(searchParams, { replace: true });
      }
    } else if (activeType !== currentType) {
      searchParams.set('type', activeType);
      setSearchParams(searchParams, { replace: true });
    }
  }, [activeType, searchParams, setSearchParams]);

  const [activeCategory, setActiveCategory] = useState<CommunityCategory>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'most_saved'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const filteredPosts = useMemo(() => {
    let result = MOCK_POSTS.filter(post => {
      const matchesType = activeType === 'all' || post.type === activeType;
      const matchesCategory = activeCategory === 'all' || post.metadata.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.metadata.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesCategory && matchesSearch;
    });

    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
    } else if (sortBy === 'most_saved') {
      result = [...result].sort((a, b) => b.stats.saves - a.stats.saves);
    }

    return result;
  }, [activeType, activeCategory, searchQuery, sortBy]);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-sans">
      <NavigationBar />

      <main className="relative pt-32 pb-24">
        {/* Volume 01: The Showcase */}
        <div className="relative">
          {/* Hero Section */}
          <section className="relative pt-24 md:pt-40 pb-16 md:pb-32 px-6 md:px-16 overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
                <div className="lg:col-span-8 space-y-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 text-[#00ff88] font-mono text-[10px] uppercase tracking-[0.5em]"
                  >
                    <span className="w-12 h-[1px] bg-[#00ff88]/30" />
                    Volume 01 — The Showcase
                  </motion.div>
                  
                  <div className="overflow-hidden">
                    <motion.h1 
                      initial={{ opacity: 0, y: 120 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[14vw] md:text-[10rem] font-serif font-light text-white leading-[0.8] tracking-tighter"
                    >
                      Design & <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-white/30 to-white/5 italic">Build</span>
                    </motion.h1>
                  </div>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-xl md:text-3xl text-white/40 max-w-2xl font-light leading-tight font-serif italic"
                  >
                    A unified destination for architectural vision, material innovation, and real-world built excellence.
                  </motion.p>
                </div>
                
                <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="flex flex-col gap-4 w-full"
                  >
                    <button 
                      onClick={() => navigate('/customize')}
                      className="group relative px-10 py-6 bg-white text-black font-bold uppercase text-[10px] tracking-[0.3em] rounded-full overflow-hidden transition-all hover:pr-16"
                    >
                      <span className="relative z-10">Start Design</span>
                      <ArrowRight className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={18} />
                    </button>
                    <button 
                      onClick={() => toast.info('Project sharing coming soon.')}
                      className="px-10 py-6 bg-white/5 border border-white/10 text-white font-bold uppercase text-[10px] tracking-[0.3em] rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-4"
                    >
                      <Share2 size={16} />
                      Share Build
                    </button>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="flex gap-16 border-t border-white/5 pt-10 w-full lg:w-auto"
                  >
                    {[
                      { label: 'Built Projects', value: '1.2k+' },
                      { label: 'Concepts', value: '850+' }
                    ].map((stat) => (
                      <div key={stat.label} className="space-y-2">
                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">{stat.label}</p>
                        <p className="text-3xl font-serif text-white">{stat.value}</p>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3 }}
                className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(0,255,136,0.05),transparent_70%)]" 
              />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
            </div>
          </section>

          {/* Unified Control Bar */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="px-6 md:px-16 mb-16 sticky top-24 z-40"
          >
            <div className="max-w-7xl mx-auto">
              <div className="p-2 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2">
                  {(['all', 'social_post', 'generated_design', 'built_project'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveType(type)}
                      className={`px-6 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                        activeType === type 
                          ? 'bg-[#00ff88] text-black' 
                          : 'text-white/30 hover:text-white'
                      }`}
                    >
                      {type === 'all' ? 'All Content' : 
                       type === 'social_post' ? 'Editorial' :
                       type === 'generated_design' ? 'Concepts' :
                       'Built Projects'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4 pr-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                    <input 
                      type="text"
                      placeholder="SEARCH ECOSYSTEM..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-none py-2 pl-10 pr-4 text-[9px] font-mono uppercase tracking-widest text-white focus:outline-none placeholder:text-white/10"
                    />
                  </div>
                  <div className="h-6 w-px bg-white/10 hidden md:block" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none py-2 px-4 text-[9px] font-mono uppercase tracking-widest text-white/40 focus:outline-none cursor-pointer hover:text-white transition-colors"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
              
              {/* Secondary Category Rail */}
              <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-6 px-4">
                {(['all', 'residential', 'commercial', 'hospitality', 'retail', 'landscape'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap text-[9px] font-mono uppercase tracking-[0.2em] transition-all ${
                      activeCategory === cat
                        ? 'text-[#00ff88]'
                        : 'text-white/20 hover:text-white/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Feed Grid */}
          <section className="px-8 md:px-16 pb-32">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post, index) => {
                    const isFeatured = index === 0 && activeType === 'all' && activeCategory === 'all' && !searchQuery && sortBy === 'featured';
                    
                    if (isFeatured) {
                      return (
                        <FeaturedCommunityCard 
                          key={post.id} 
                          post={post} 
                          onClick={() => setSelectedPost(post)}
                        />
                      );
                    }

                    return (
                      <CommunityCard 
                        key={post.id} 
                        post={post} 
                        onClick={() => setSelectedPost(post)}
                      />
                    );
                  })}
                  {/* Share Your Project CTA Card */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative bg-[#111] border border-dashed border-white/20 rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-[#00ff88]/50 flex flex-col items-center justify-center p-8 text-center space-y-6 aspect-[4/5]"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#00ff88]/10 flex items-center justify-center border border-[#00ff88]/20 group-hover:scale-110 transition-transform">
                      <Share2 size={32} className="text-[#00ff88]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif font-bold text-white">Share Your Project</h3>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Have you used BTS materials in your latest build? We'd love to showcase your work.
                      </p>
                    </div>
                    <button className="px-6 py-3 bg-white text-black font-bold uppercase text-[9px] tracking-widest rounded-lg group-hover:bg-[#00ff88] transition-colors">
                      Upload Now
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>

              {filteredPosts.length === 0 && (
                <div className="py-32 text-center space-y-4">
                  <p className="text-white/20 font-mono uppercase tracking-[0.2em]">No designs found matching your criteria</p>
                  <button 
                    onClick={() => { setActiveType('all'); setSearchQuery(''); }}
                    className="text-[#00ff88] text-[10px] font-mono uppercase tracking-widest hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Volume 02: The Journal (Editorial / Knowledge Layer) */}
        <EditorialSection />

        {/* Shop the Products CTA Section */}
        <section className="px-8 md:px-16 mt-32">
          <div className="max-w-7xl mx-auto">
            <div className="relative p-12 md:p-24 bg-[#111] border border-white/5 rounded-[40px] overflow-hidden group">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 group-hover:opacity-30 transition-opacity">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
                  alt="Brick Textures"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#111]" />
              </div>
              
              <div className="relative z-10 max-w-xl space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-px bg-[#00ff88]/30" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#00ff88]">Material Catalog</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-serif font-light text-white leading-[0.9] tracking-tight">
                  Shop the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00ff88]/40 italic pr-4">Materials</span>
                </h2>
                <p className="text-lg text-white/60 leading-relaxed">
                  Every design you see in our community is built using authentic Brick Tile Shop materials. Browse our full catalog to find the perfect match for your project.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-[#00ff88] text-black font-bold uppercase text-[10px] tracking-widest rounded-xl hover:scale-[1.02] transition-transform flex items-center gap-2">
                    Browse Catalog <ChevronRight size={14} />
                  </button>
                  <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/10 transition-all">
                    Request Samples
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedPost && (
          <DetailDrawer 
            post={selectedPost} 
            onClose={() => setSelectedPost(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesignCommunity;
