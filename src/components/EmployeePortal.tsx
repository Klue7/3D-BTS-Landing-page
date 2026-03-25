import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
 ReactFlow, 
 addEdge, 
 Background, 
 Controls, 
 Connection, 
 Edge, 
 Node, 
 Panel, 
 useNodesState, 
 useEdgesState, 
 Handle, 
 Position,
 NodeProps,
 MarkerType,
 useReactFlow,
 ReactFlowProvider,
 BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
 Users, 
 BarChart3, 
 Settings, 
 LogOut, 
 ChevronRight, 
 ShoppingBag, 
 FileText, 
 AlertCircle, 
 ArrowLeft,
 Share2,
 Phone,
 Globe,
 Mail,
 MessageSquare,
 CreditCard,
 Truck,
 CheckCircle2,
 Megaphone,
 Database,
 Terminal,
 Save,
 Trash2,
 Plus,
 Zap,
 LayoutDashboard,
 Box,
 X,
 Image,
 Wand2,
 Calendar,
 ListOrdered,
 Link,
 Eye,
 Check,
 Clock,
 ArrowUpRight,
 Filter,
 Search,
 Download,
 MoreVertical,
 Layers,
 Palette,
 Type as TypeIcon,
 MousePointer2,
 Activity,
 Quote,
 Monitor,
 RefreshCw,
 Video,
 Lock,
 Share
} from 'lucide-react';
import { useVisualLab } from './VisualLabContext';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';

// --- Types & Interfaces ---

type AssetStatus = 'Draft' | 'Review' | 'Approved' | 'Archived' | 'Restricted';
type AssetUsage = 'Hero' | 'Gallery' | 'Installation' | 'Detail' | 'Campaign' | '3D Ready' | 'Model' | 'Render' | 'Publishable Variant';
type AssetType = 'Image' | 'Video' | '3D Asset' | '3D Render' | 'Model';
type ProtectionLevel = 'Protected Original' | 'Managed Variant' | 'Publishable Variant';

interface Asset {
 id: string;
 name: string;
 type: AssetType;
 protectionLevel: ProtectionLevel;
 size: string;
 status: AssetStatus;
 usage: AssetUsage[];
 img: string;
 parentId?: string;
 productId?: string;
 productName?: string;
 linkedProductIds?: string[];
 linkedCampaignIds?: string[];
 completeness?: number;
 is3DReady?: boolean;
 campaignId?: string;
 campaignName?: string;
 tags: string[];
 workflowNode?: 'asset.uploaded' | 'variant.generated' | 'creative.approved';
 pipeline?: {
 sourceUploaded: boolean;
 textureReady: boolean;
 previewAttached: boolean;
 modelReferenceAttached: boolean;
 conversionStatus: 'Pending' | 'Processing' | 'Complete' | 'Failed';
 };
 watermarkProfile?: string;
 backgroundTransparent?: boolean;
}

interface MarketingTemplate {
 id: string;
 name: string;
 description: string;
 type: 'Product Card' | 'Collection Highlight' | 'Quote CTA';
 thumbnail: string;
 blueprint: string;
}

type CampaignStatus = 'Active' | 'Draft' | 'Completed' | 'Scheduled';

interface Campaign {
 id: string;
 name: string;
 owner: string;
 description: string;
 status: CampaignStatus;
 startDate: string;
 endDate: string;
 channels: string[];
 linkedAssetIds: string[];
 productIds: string[];
 budget: string;
 workflowNode?: 'campaign.created';
}

const MOCK_CAMPAIGNS: Campaign[] = [
 {
 id: 'CMP_001',
 name: 'Spring Revival 2024',
 owner: 'Rikus Klue',
 description: 'Seasonal refresh focusing on outdoor slate and garden textures.',
 status: 'Active',
 startDate: '2024-03-01',
 endDate: '2024-05-31',
 channels: ['Instagram', 'Facebook', 'Pinterest'],
 linkedAssetIds: ['AST_001', 'AST_002'],
 productIds: ['PRD_882', 'PRD_443'],
 budget: '$5,000',
 workflowNode: 'campaign.created'
 },
 {
 id: 'CMP_002',
 name: 'Luxury Obsidian Launch',
 owner: 'Sarah Chen',
 description: 'High-end product launch for the Midnight Obsidian series.',
 status: 'Scheduled',
 startDate: '2024-04-15',
 endDate: '2024-06-15',
 channels: ['LinkedIn', 'Instagram', 'Email'],
 linkedAssetIds: ['AST_003'],
 productIds: ['PRD_501'],
 budget: '$12,500'
 },
 {
 id: 'CMP_003',
 name: 'Industrial Series Promo',
 owner: 'Marcus Thorne',
 description: 'B2B outreach for commercial tile applications.',
 status: 'Draft',
 startDate: '2024-05-01',
 endDate: '2024-07-01',
 channels: ['LinkedIn', 'Email'],
 linkedAssetIds: [],
 productIds: ['PRD_882'],
 budget: '$3,000'
 }
];

const MOCK_TEMPLATES: MarketingTemplate[] = [
 {
 id: 'TMP_001',
 name: 'Standard Product Card',
 description: 'Deterministic layout for single product showcase with price and CTA.',
 type: 'Product Card',
 thumbnail: 'https://picsum.photos/seed/tmp1/400/300',
 blueprint: '1:1 Image | Bottom-Left Overlay | Price Badge | Primary CTA'
 },
 {
 id: 'TMP_002',
 name: 'Collection Highlight',
 description: 'Grid-based layout for showcasing multiple products in a series.',
 type: 'Collection Highlight',
 thumbnail: 'https://picsum.photos/seed/tmp2/400/300',
 blueprint: '2x2 Grid | Central Header | Shared Texture Background'
 },
 {
 id: 'TMP_003',
 name: 'Quote CTA',
 description: 'Minimalist layout focusing on customer testimonials and direct action.',
 type: 'Quote CTA',
 thumbnail: 'https://picsum.photos/seed/tmp3/400/300',
 blueprint: 'Full-bleed Texture | Centered Serif Quote | Floating CTA'
 }
];

interface ScheduledPost {
 id: string;
 title: string;
 channel: string;
 time: string;
 date: string;
 status: 'Scheduled' | 'Published' | 'Failed' | 'Draft';
 assetId?: string;
 campaignId?: string;
 workflowNode?: 'post.scheduled';
}

const MOCK_SCHEDULED_POSTS: ScheduledPost[] = [
 { id: 'POST_001', title: 'Spring Hero IG', channel: 'Instagram', time: '14:00', date: '2026-03-27', status: 'Scheduled', assetId: 'AST_001', campaignId: 'CMP_001', workflowNode: 'post.scheduled' },
 { id: 'POST_002', title: 'Slate Promo FB', channel: 'Facebook', time: '12:30', date: '2026-03-27', status: 'Scheduled', assetId: 'AST_002', campaignId: 'CMP_001', workflowNode: 'post.scheduled' },
 { id: 'POST_003', title: 'Catalog Sync WA', channel: 'WhatsApp', time: '09:00', date: '2026-03-28', status: 'Published', campaignId: 'CMP_001' },
 { id: 'POST_004', title: 'TikTok Trend #1', channel: 'TikTok', time: '10:00', date: '2026-03-30', status: 'Scheduled', campaignId: 'CMP_002' },
 { id: 'POST_005', title: 'LinkedIn B2B', channel: 'LinkedIn', time: '11:00', date: '2026-03-31', status: 'Draft', campaignId: 'CMP_002' },
];

type PublishingStatus = 'Queued' | 'Publishing' | 'Published' | 'Failed' | 'Retrying';

interface PublishingJob {
 id: string;
 creativeName: string;
 channel: string;
 status: PublishingStatus;
 timestamp: string;
 progress?: number;
 error?: string;
 campaignId?: string;
 postId?: string;
 workflowNode?: 'publish.queued' | 'publish.succeeded' | 'publish.failed';
}

const MOCK_PUBLISHING_JOBS: PublishingJob[] = [
 { id: 'PUB_001', creativeName: 'Spring Hero IG', channel: 'Instagram', status: 'Published', timestamp: '10:45:12', campaignId: 'CMP_001', postId: 'POST_001', workflowNode: 'publish.succeeded' },
 { id: 'PUB_002', creativeName: 'Catalog Sync WA', channel: 'WhatsApp', status: 'Publishing', timestamp: '10:46:05', progress: 65, campaignId: 'CMP_001', postId: 'POST_003' },
 { id: 'PUB_003', creativeName: 'Slate Promo FB', channel: 'Facebook', status: 'Failed', timestamp: '10:40:22', error: 'API_TIMEOUT', campaignId: 'CMP_001', postId: 'POST_002', workflowNode: 'publish.failed' },
 { id: 'PUB_004', creativeName: 'TikTok Trend #1', channel: 'TikTok', status: 'Queued', timestamp: '10:47:00', campaignId: 'CMP_002', postId: 'POST_004', workflowNode: 'publish.queued' },
 { id: 'PUB_005', creativeName: 'LinkedIn B2B', channel: 'LinkedIn', status: 'Retrying', timestamp: '10:42:15', progress: 20, campaignId: 'CMP_002', postId: 'POST_005' },
 { id: 'PUB_006', creativeName: 'Pinterest Board', channel: 'Pinterest', status: 'Queued', timestamp: '10:48:30', campaignId: 'CMP_001', workflowNode: 'publish.queued' },
];

interface ChannelHealth {
 name: string;
 status: 'Healthy' | 'Degraded' | 'Down';
 latency: string;
 uptime: string;
}

const MOCK_CHANNEL_HEALTH: ChannelHealth[] = [
 { name: 'Instagram', status: 'Healthy', latency: '124ms', uptime: '99.99%' },
 { name: 'Facebook', status: 'Healthy', latency: '142ms', uptime: '99.98%' },
 { name: 'TikTok', status: 'Healthy', latency: '186ms', uptime: '99.95%' },
 { name: 'WhatsApp', status: 'Degraded', latency: '450ms', uptime: '99.20%' },
 { name: 'LinkedIn', status: 'Healthy', latency: '110ms', uptime: '99.99%' },
];

interface CampaignPerformance {
 id: string;
 name: string;
 leads: number;
 quotes: number;
 conversion: string;
 spend: string;
 roas: string;
 workflowNode?: 'analytics.updated';
}

const MOCK_CAMPAIGN_PERFORMANCE: CampaignPerformance[] = [
 { id: 'CMP_001', name: 'Spring Revival 2024', leads: 452, quotes: 128, conversion: '28.3%', spend: '$5,000', roas: '4.2x', workflowNode: 'analytics.updated' },
 { id: 'CMP_002', name: 'Luxury Obsidian Launch', leads: 184, quotes: 56, conversion: '30.4%', spend: '$12,500', roas: '3.8x' },
 { id: 'CMP_003', name: 'Industrial Series Promo', leads: 92, quotes: 34, conversion: '36.9%', spend: '$3,000', roas: '5.1x' },
];

const BTS_PRODUCTS = [
 { id: 'PRD_882', name: 'Slate Grey Tile', price: '$45.00', category: 'Industrial', img: 'https://picsum.photos/seed/slate1/800/800' },
 { id: 'PRD_112', name: 'Emerald Glaze Brick', price: '$12.50', category: 'Premium', img: 'https://picsum.photos/seed/emerald3d/800/800' },
 { id: 'PRD_443', name: 'Rustic Red Brick', price: '$8.90', category: 'Lifestyle', img: 'https://picsum.photos/seed/rustic_inst/800/800' },
 { id: 'PRD_501', name: 'Midnight Obsidian Slab', price: '$120.00', category: 'Luxury', img: 'https://picsum.photos/seed/obsidian/800/800' },
];

const MOCK_ASSETS: Asset[] = [
 {
 id: 'AST_001',
 name: 'Slate Grey Hero Original',
 type: 'Image',
 protectionLevel: 'Protected Original',
 size: '12.4MB',
 status: 'Approved',
 usage: ['Hero', 'Detail'],
 img: 'https://picsum.photos/seed/slate1/800/800',
 productId: 'PRD_882',
 productName: 'Slate Grey Tile',
 linkedProductIds: ['PRD_882', 'PRD_883'],
 linkedCampaignIds: ['CMP_001'],
 completeness: 100,
 is3DReady: false,
 tags: ['Premium', 'Industrial', 'High-Res'],
 workflowNode: 'asset.uploaded',
 },
 {
 id: 'AST_002',
 name: 'Slate Grey - Web Variant',
 type: 'Image',
 protectionLevel: 'Publishable Variant',
 size: '1.2MB',
 status: 'Approved',
 usage: ['Gallery', 'Publishable Variant'],
 img: 'https://picsum.photos/seed/slate1_v/800/800',
 parentId: 'AST_001',
 productId: 'PRD_882',
 productName: 'Slate Grey Tile',
 linkedProductIds: ['PRD_882'],
 linkedCampaignIds: ['CMP_001', 'CMP_003'],
 completeness: 100,
 is3DReady: false,
 tags: ['Optimized', 'Web'],
 watermarkProfile: 'Standard BTS',
 backgroundTransparent: false,
 workflowNode: 'variant.generated',
 },
 {
 id: 'AST_003',
 name: 'Emerald Glaze 3D Master',
 type: '3D Asset',
 protectionLevel: 'Protected Original',
 size: '45.8MB',
 status: 'Review',
 usage: ['Detail', '3D Ready', 'Model'],
 img: 'https://picsum.photos/seed/emerald3d/800/800',
 productId: 'PRD_112',
 productName: 'Emerald Glaze Brick',
 linkedProductIds: ['PRD_112'],
 linkedCampaignIds: [],
 completeness: 85,
 is3DReady: true,
 tags: ['3D', 'PBR', 'Master'],
 workflowNode: 'creative.approved',
 pipeline: {
 sourceUploaded: true,
 textureReady: true,
 previewAttached: true,
 modelReferenceAttached: true,
 conversionStatus: 'Processing',
 }
 },
 {
 id: 'AST_004',
 name: 'Spring Campaign Video',
 type: 'Video',
 protectionLevel: 'Managed Variant',
 size: '120MB',
 status: 'Draft',
 usage: ['Campaign'],
 img: 'https://picsum.photos/seed/springvid/800/800',
 campaignId: 'CMP_2026_01',
 campaignName: 'Spring Collection Launch',
 linkedProductIds: ['PRD_443', 'PRD_882', 'PRD_112'],
 linkedCampaignIds: ['CMP_2026_01'],
 completeness: 60,
 is3DReady: false,
 tags: ['Social', 'Motion'],
 },
 {
 id: 'AST_005',
 name: 'Rustic Installation Shot',
 type: 'Image',
 protectionLevel: 'Protected Original',
 size: '8.5MB',
 status: 'Restricted',
 usage: ['Installation', 'Render'],
 img: 'https://picsum.photos/seed/rustic_inst/800/800',
 productId: 'PRD_443',
 productName: 'Rustic Red Brick',
 linkedProductIds: ['PRD_443'],
 linkedCampaignIds: ['CMP_001'],
 completeness: 95,
 is3DReady: false,
 tags: ['Lifestyle', 'On-Site'],
 }
];

// --- Custom Node Components ---

const CustomNode = ({ data, selected }: NodeProps) => {
 const Icon = data.icon as any;
 const category = data.category as string;
 
 const getCategoryColor = (cat: string) => {
 switch (cat) {
 case 'DEMAND': return 'text-[#00ff88] border-[#00ff88]/20 bg-[#00ff88]/2';
 case 'HUB': return 'text-blue-400 border-blue-400/20 bg-blue-400/2';
 case 'SALES': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/2';
 case 'SUPPLY': return 'text-amber-400 border-amber-400/20 bg-amber-400/2';
 case 'LOGISTICS': return 'text-cyan-400 border-cyan-400/20 bg-cyan-400/2';
 case 'SUPPORT': return 'text-purple-400 border-purple-400/20 bg-purple-400/2';
 case 'MARKETING': return 'text-pink-400 border-pink-400/20 bg-pink-400/2';
 default: return 'text-white border-white/20 bg-white/2';
 }
 };

 const colorClasses = getCategoryColor(category);

 return (
 <motion.div 
 initial={{ scale: 0.95, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ type: 'spring', damping: 20, stiffness: 100 }}
 className={`px-5 py-4 rounded-xl border backdrop-blur-xl transition-all duration-500 min-w-[260px] relative overflow-hidden group ${selected ? 'border-[#00ff88]/50 shadow-[0_0_50px_rgba(0,255,136,0.1)] ring-1 ring-[#00ff88]/30' : 'border-white/5'} bg-[#0a0a0a]/90`}
 >
 {/* Subtle Gradient Overlay */}
 <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
 
 {/* Scanline Effect - More Restrained */}
 <div className="absolute inset-0 pointer-events-none opacity-[0.01] z-10" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
 
 <Handle type="target" position={Position.Left} className="!bg-[#00ff88] !border-none !w-1.5 !h-1.5 !-left-0.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity" />
 
 <div className="flex items-center gap-5 relative z-20">
 <div className={`p-3 rounded-xl bg-black/60 border border-white/5 ${colorClasses.split(' ')[0]} shadow-2xl transition-transform group-hover:scale-110 duration-500`}>
 <Icon size={20} strokeWidth={2} />
 </div>
 <div className="flex-1">
 <div className="flex items-center justify-between mb-1">
 <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.4em] opacity-60 ${colorClasses.split(' ')[0]}`}>{category}</span>
 </div>
 <div className="text-[14px] font-bold text-white tracking-tight leading-none uppercase group-hover:text-[#00ff88] transition-colors">{data.label as string}</div>
 </div>
 </div>

 <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between relative z-20">
 <div className="flex items-center gap-2.5 text-[9px] font-mono text-white/30 uppercase tracking-widest">
 <Zap size={11} className={data.logic ? 'text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]' : 'text-white/5'} fill={data.logic ? '#00ff88' : 'none'} />
 <span className={data.logic ? 'text-white/60' : ''}>{data.logic ? 'Logic Executable' : 'Static Node'}</span>
 </div>
 <div className="flex gap-1.5">
 <div className={`w-1.5 h-1.5 rounded-full ${data.logic ? 'bg-[#00ff88] ' : 'bg-white/5'}`}></div>
 <div className="w-1.5 h-1.5 rounded-full bg-white/5"></div>
 </div>
 </div>

 <Handle type="source" position={Position.Right} className="!bg-[#00ff88] !border-none !w-1.5 !h-1.5 !-right-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
 </motion.div>
 );
};

const nodeTypes = {
 businessStep: CustomNode,
};

// --- Initial Data ---

const initialNodes: Node[] = [
 // --- Demand Generation (Sources) ---
 { 
 id: 'meta', 
 type: 'businessStep', 
 position: { x: 50, y: 100 }, 
 data: { label: 'Meta Ads Manager', category: 'DEMAND', icon: Share2, logic: 'IF lead_captured THEN trigger_webhook(n8n_flow_01)' } 
 },
 { 
 id: 'whatsapp', 
 type: 'businessStep', 
 position: { x: 50, y: 200 }, 
 data: { label: 'WhatsApp API', category: 'DEMAND', icon: Phone, logic: 'IF incoming_msg THEN parse_intent(gpt-4) -> route_to(comms)' } 
 },
 { 
 id: 'tiktok', 
 type: 'businessStep', 
 position: { x: 50, y: 300 }, 
 data: { label: 'TikTok Shop Sync', category: 'DEMAND', icon: Globe, logic: 'IF order_placed THEN sync_inventory -> create_draft_order' } 
 },
 { 
 id: 'email', 
 type: 'businessStep', 
 position: { x: 50, y: 400 }, 
 data: { label: 'Outlook / Gmail', category: 'DEMAND', icon: Mail, logic: 'IF inquiry_received THEN extract_contact -> push_to_crm' } 
 },

 // --- Marketing Subsystem (Workflow Nodes) ---
 { 
 id: 'mkt_assets', 
 type: 'businessStep', 
 position: { x: 400, y: -100 }, 
 data: { label: 'Asset Lab (AI)', category: 'MARKETING', icon: Image, logic: 'IF new_inventory_data THEN generate_creative_variants(gemini-2.5-flash-image)' } 
 },
 { 
 id: 'mkt_templates', 
 type: 'businessStep', 
 position: { x: 700, y: -100 }, 
 data: { label: 'Template Engine', category: 'MARKETING', icon: LayoutDashboard, logic: 'IF asset_approved THEN apply_brand_blueprint -> generate_final_render' } 
 },
 { 
 id: 'mkt_campaigns', 
 type: 'businessStep', 
 position: { x: 1000, y: -100 }, 
 data: { label: 'Campaign Engine', category: 'MARKETING', icon: Megaphone, logic: 'IF campaign_triggered THEN assemble_payload -> notify_scheduler' } 
 },
 { 
 id: 'mkt_calendar', 
 type: 'businessStep', 
 position: { x: 1300, y: -100 }, 
 data: { label: 'Calendar Scheduler', category: 'MARKETING', icon: Calendar, logic: 'IF payload_received THEN find_optimal_slot -> lock_schedule' } 
 },
 { 
 id: 'mkt_publishing', 
 type: 'businessStep', 
 position: { x: 1600, y: -100 }, 
 data: { label: 'Publishing Queue', category: 'MARKETING', icon: ListOrdered, logic: 'IF schedule_reached THEN execute_publish -> verify_live_status' } 
 },
 { 
 id: 'mkt_connectors', 
 type: 'businessStep', 
 position: { x: 1900, y: -100 }, 
 data: { label: 'Channel Connectors', category: 'MARKETING', icon: Link, logic: 'IF publish_ready THEN push_to_api(meta|tiktok|wa) -> return_tracking_id' } 
 },
 { 
 id: 'mkt_analytics', 
 type: 'businessStep', 
 position: { x: 2200, y: -100 }, 
 data: { label: 'Marketing Analytics', category: 'MARKETING', icon: BarChart3, logic: 'IF post_live THEN track_engagement -> update_roas_model' } 
 },

 // --- Core Operations ---
 { 
 id: 'comms', 
 type: 'businessStep', 
 position: { x: 400, y: 250 }, 
 data: { label: 'Neural Comms Hub', category: 'HUB', icon: MessageSquare, logic: 'CENTRAL_TRIAGE: Aggregate all streams -> Assign Agent' } 
 },
 { 
 id: 'sales', 
 type: 'businessStep', 
 position: { x: 700, y: 250 }, 
 data: { label: 'Sales Engine (ERP)', category: 'SALES', icon: FileText, logic: 'IF quote_accepted THEN trigger_payment_link(stripe) -> PUSH_DATA(mkt_assets)' } 
 },
 { 
 id: 'supply', 
 type: 'businessStep', 
 position: { x: 1000, y: 250 }, 
 data: { label: 'Supply Chain PO', category: 'SUPPLY', icon: Box, logic: 'IF payment_success THEN auto_generate_po -> notify_vendor' } 
 },
 { 
 id: 'logistics', 
 type: 'businessStep', 
 position: { x: 1300, y: 250 }, 
 data: { label: 'Logistics OS', category: 'LOGISTICS', icon: Truck, logic: 'IF po_confirmed THEN book_delivery(truck_os) -> send_tracking' } 
 },
 { 
 id: 'fulfillment', 
 type: 'businessStep', 
 position: { x: 1600, y: 250 }, 
 data: { label: 'Fulfillment POD', category: 'SUPPORT', icon: CheckCircle2, logic: 'IF pod_signed THEN finalize_invoice -> archive_order' } 
 },
 { 
 id: 'marketing_ai', 
 type: 'businessStep', 
 position: { x: 1900, y: 150 }, 
 data: { label: 'Post-Sale Marketing', category: 'MARKETING', icon: Megaphone, logic: 'POST_SALE: Trigger review_request -> Update LTV' } 
 },
 { 
 id: 'finance', 
 type: 'businessStep', 
 position: { x: 1900, y: 350 }, 
 data: { label: 'Finance Ledger', category: 'HUB', icon: BarChart3, logic: 'RECONCILIATION: Sync all transactions -> Xero/Quickbooks' } 
 },
];

const initialEdges: Edge[] = [
 // Demand to Comms
 { id: 'e_meta_comms', source: 'meta', target: 'comms', animated: true, style: { stroke: '#00ff88', strokeDasharray: '5 5' } },
 { id: 'e_wa_comms', source: 'whatsapp', target: 'comms', animated: true, style: { stroke: '#00ff88', strokeDasharray: '5 5' } },
 { id: 'e_tiktok_comms', source: 'tiktok', target: 'comms', animated: true, style: { stroke: '#00ff88', strokeDasharray: '5 5' } },
 { id: 'e_email_comms', source: 'email', target: 'comms', animated: true, style: { stroke: '#00ff88', strokeDasharray: '5 5' } },

 // Operational Flow
 { id: 'e_comms_sales', source: 'comms', target: 'sales', animated: true, style: { stroke: '#00ff88' } },
 { id: 'e_sales_supply', source: 'sales', target: 'supply', animated: true, style: { stroke: '#00ff88' } },
 { id: 'e_supply_logistics', source: 'supply', target: 'logistics', animated: true, style: { stroke: '#00ff88' } },
 { id: 'e_logistics_fulfillment', source: 'logistics', target: 'fulfillment', animated: true, style: { stroke: '#00ff88' } },
 { id: 'e_fulfillment_mkt_ai', source: 'fulfillment', target: 'marketing_ai', animated: true, style: { stroke: '#00ff88' } },
 { id: 'e_fulfillment_finance', source: 'fulfillment', target: 'finance', animated: true, style: { stroke: '#00ff88' } },

 // Marketing Subsystem Integration
 { id: 'e_sales_mkt_assets', source: 'sales', target: 'mkt_assets', animated: true, label: 'Product Data Feed', style: { stroke: '#ec4899', strokeDasharray: '5 5' } },
 { id: 'e_mkt_assets_templates', source: 'mkt_assets', target: 'mkt_templates', animated: true, style: { stroke: '#ec4899' } },
 { id: 'e_mkt_templates_campaigns', source: 'mkt_templates', target: 'mkt_campaigns', animated: true, style: { stroke: '#ec4899' } },
 { id: 'e_mkt_campaigns_calendar', source: 'mkt_campaigns', target: 'mkt_calendar', animated: true, style: { stroke: '#ec4899' } },
 { id: 'e_mkt_calendar_publishing', source: 'mkt_calendar', target: 'mkt_publishing', animated: true, style: { stroke: '#ec4899' } },
 { id: 'e_mkt_publishing_connectors', source: 'mkt_publishing', target: 'mkt_connectors', animated: true, style: { stroke: '#ec4899' } },
 { id: 'e_mkt_publishing_analytics', source: 'mkt_publishing', target: 'mkt_analytics', animated: true, style: { stroke: '#ec4899' } },
 
 // Connectors back to Demand Channels (Execution)
 { id: 'e_mkt_connectors_meta', source: 'mkt_connectors', target: 'meta', animated: true, style: { stroke: '#ec4899', strokeDasharray: '2 2' } },
];

export function EmployeePortal() {
 return (
 <ReactFlowProvider>
 <EmployeePortalContent />
 </ReactFlowProvider>
 );
}

function EmployeePortalContent() {
 const { setIsLoggedIn, setUserRole, setIsViewingPortal } = useVisualLab();
 const { screenToFlowPosition } = useReactFlow();
 const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
 const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 const [selectedNode, setSelectedNode] = useState<Node | null>(null);
 const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
 const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
 const [isMasterPromptOpen, setIsMasterPromptOpen] = useState(false);
 const [activeModule, setActiveModule] = useState<'Map' | 'Customers' | 'Suppliers' | 'Inventory' | 'Marketing'>('Map');
 const [activeMarketingSubModule, setActiveMarketingSubModule] = useState<'Dashboard' | 'AssetLab' | 'Templates' | 'CreativeGenerator' | 'Campaigns' | 'Calendar' | 'Publishing' | 'Analytics'>('Dashboard');
 const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
 const [isGeneratingVariant, setIsGeneratingVariant] = useState(false);
 const [variantWizardStep, setVariantWizardStep] = useState(1);
 const [variantSettings, setVariantSettings] = useState({
 transparentBg: false,
 watermarkProfile: 'Standard BTS',
 usagePurpose: 'Publishable Variant',
 channelSize: 'Original'
 });
 const [selectedTemplate, setSelectedTemplate] = useState<MarketingTemplate | null>(null);
 const [selectedProduct, setSelectedProduct] = useState<any>(BTS_PRODUCTS[0]);
 const [generatorCopy, setGeneratorCopy] = useState('Premium materials for modern architectural visions.');
 const [isRendering, setIsRendering] = useState(false);
 const [isWizardOpen, setIsWizardOpen] = useState(false);
 const [wizardStep, setWizardStep] = useState(1);
 const [calendarView, setCalendarView] = useState<'Week' | 'Month'>('Week');
 const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(MOCK_SCHEDULED_POSTS);
 const [publishingJobs, setPublishingJobs] = useState<PublishingJob[]>(MOCK_PUBLISHING_JOBS);
 const [channelHealth, setChannelHealth] = useState<ChannelHealth[]>(MOCK_CHANNEL_HEALTH);
 const [isRefreshingQueue, setIsRefreshingQueue] = useState(false);
 const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
 name: '',
 description: '',
 owner: 'Rikus Klue',
 status: 'Draft',
 startDate: '',
 endDate: '',
 channels: [],
 linkedAssetIds: [],
 productIds: [],
 budget: '',
 });
 const [assetSearch, setAssetSearch] = useState('');
 const [assetFilter, setAssetFilter] = useState('All');
 const [systemLogs, setSystemLogs] = useState<{ id: string; text: string; time: string }[]>([]);
 const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);
 
 const canvasRef = useRef<HTMLDivElement>(null);

 const onDragStart = (event: React.DragEvent, nodeType: string, label: string, category: string, icon: any) => {
 event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, label, category, iconName: icon.name }));
 event.dataTransfer.effectAllowed = 'move';
 };

 const onDragOver = useCallback((event: React.DragEvent) => {
 event.preventDefault();
 event.dataTransfer.dropEffect = 'move';
 }, []);

 const onDrop = useCallback(
 (event: React.DragEvent) => {
 event.preventDefault();

 const dataStr = event.dataTransfer.getData('application/reactflow');
 if (!dataStr) return;

 const { label, category, iconName } = JSON.parse(dataStr);
 
 // Map icon name back to component
 const iconMap: { [key: string]: any } = {
 Database, Share2, FileText, Box, Truck, Megaphone, CheckCircle2, Image, Wand2, BarChart3, Link
 };

 const position = screenToFlowPosition({
 x: event.clientX,
 y: event.clientY,
 });

 const newNode: Node = {
 id: Math.random().toString(36).substr(2, 9),
 type: 'businessStep',
 position,
 data: { 
 label, 
 category, 
 icon: iconMap[iconName] || Database, 
 logic: '' 
 },
 };

 setNodes((nds) => nds.concat(newNode));
 },
 [screenToFlowPosition, setNodes]
 );

 // Simulate System Logs
 useEffect(() => {
 const logs = [
"CAPTURED: FB_LEAD_ID_8829 -> ROUTING: COMMS_HUB",
"INCOMING: WHATSAPP_MSG -> STATUS: QUEUED_FOR_TRIAGE",
"SYNC_SUCCESS: TIKTOK_ORDER_#9921 -> MODULE: SALES_ENGINE",
"GENERATE: QUOTE_PDF_CUST_A -> TRIGGER: MANUAL_ACTION",
"DISPATCH: PO_#4421 -> VENDOR: GLOBAL_TILES_CO",
"BOOKED: LOGISTICS_WAYBILL_772 -> CARRIER: TRUCK_OS",
"UPDATE: FULFILLMENT_STATUS -> VALUE: OUT_FOR_DELIVERY",
"LEDGER_ENTRY: REVENUE_+$1,200 -> MODULE: FINANCE_HUB",
"ATTRIBUTION: CAMPAIGN_FB_ADS_01 -> SOURCE: META_PIXEL",
];

 const interval = setInterval(() => {
 const randomLog = logs[Math.floor(Math.random() * logs.length)];
 setSystemLogs(prev => [{
 id: Math.random().toString(36).substr(2, 9),
 text: randomLog,
 time: new Date().toLocaleTimeString('en-GB', { hour12: false })
 }, ...prev].slice(0, 8));
 }, 2500);

 return () => clearInterval(interval);
 }, []);

 const onConnect = useCallback(
 (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#00ff88', strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00ff88' } }, eds)),
 [setEdges]
 );

 const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
 setSelectedNode(node);
 setSelectedEdge(null);
 setIsDetailPanelOpen(true);
 }, []);

 const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
 setSelectedEdge(edge);
 setSelectedNode(null);
 setIsDetailPanelOpen(true);
 }, []);

 const deleteNode = () => {
 if (selectedNode) {
 setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
 setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
 setIsDetailPanelOpen(false);
 }
 };

 const deleteEdge = () => {
 if (selectedEdge) {
 setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
 setIsDetailPanelOpen(false);
 }
 };

 const clearMap = () => {
 setNodes([]);
 setEdges([]);
 const toast = document.createElement('div');
 toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-red-500 text-white font-bold rounded-full text-[10px] uppercase tracking-widest shadow-2xl';
 toast.innerText = 'Map Cleared';
 document.body.appendChild(toast);
 setTimeout(() => toast.remove(), 3000);
 };

 const saveChanges = () => {
 // Simulate saving
 const toast = document.createElement('div');
 toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-[#00ff88] text-black font-bold rounded-full text-[10px] uppercase tracking-widest shadow-2xl animate-bounce';
 toast.innerText = 'Changes Saved to Cloud';
 document.body.appendChild(toast);
 setTimeout(() => toast.remove(), 3000);
 };

 const handleLogout = () => {
 setIsLoggedIn(false);
 setUserRole(null);
 setIsViewingPortal(false);
 };

 const generateMasterPrompt = () => {
 const workflowDescription = nodes.map(node => {
 const outgoingEdges = edges.filter(e => e.source === node.id);
 const targets = outgoingEdges.map(e => nodes.find(n => n.id === e.target)?.data.label).join(', ');
 return `- ${node.data.label} (${node.data.category}): Logic:"${node.data.logic || 'None'}". Flows to: ${targets || 'End'}`;
 }).join('\n');

 return `SYSTEM WORKFLOW PROMPT:\n\nThis business operates as a high-tech retail OS with the following automated logic:\n\n${workflowDescription}\n\nExecute all backend operations following these triggers and actions.`;
 };

 return (
 <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden relative">
 {/* Technical Grid Overlay */}
 <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
 <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
 
 {/* Side Navigation Rail */}
 <aside className="w-20 flex flex-col items-center py-8 border-r border-white/5 bg-[#0a0a0a] z-50">
 <div className="mb-12">
 <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center text-[#00ff88]">
 <Database size={20} />
 </div>
 </div>
 
 <nav className="flex-1 flex flex-col gap-8">
 {[
 { id: 'Map', icon: Share2, label: 'OS Map' },
 { id: 'Customers', icon: Users, label: 'CRM' },
 { id: 'Suppliers', icon: Truck, label: 'Vendors' },
 { id: 'Inventory', icon: Box, label: 'Stock' },
 { id: 'Marketing', icon: Megaphone, label: 'Social' },
].map((item) => (
 <button
 key={item.id}
 onClick={() => setActiveModule(item.id as any)}
 className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${activeModule === item.id ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
 >
 <item.icon size={20} />
 <span className="absolute left-16 px-2 py-1 bg-[#1a1a1a] border border-white/10 rounded text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
 {item.label}
 </span>
 </button>
 ))}
 </nav>

 <div className="mt-auto flex flex-col gap-6">
 <button onClick={() => setIsViewingPortal(false)} className="text-white/30 hover:text-white transition-colors">
 <ArrowLeft size={20} />
 </button>
 <button onClick={handleLogout} className="text-white/30 hover:text-red-400 transition-colors">
 <LogOut size={20} />
 </button>
 </div>
 </aside>

 {/* Main Content Area */}
 <main className="flex-1 relative overflow-hidden flex flex-col">
 {activeModule === 'Map' && (
 <>
 {/* Header Overlay */}
 <header className="absolute top-8 left-8 z-40 pointer-events-none">
 <h1 className="text-2xl font-serif font-bold tracking-tighter text-white uppercase mb-1">Brick Tile Shop</h1>
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></div>
 <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#00ff88]">OPERATING SYSTEM MAP</span>
 </div>
 </header>

 {/* Live System Stats Overlay */}
 <Panel position="top-right" className="m-8 z-40">
 <div className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 w-64 shadow-2xl">
 <div className="flex items-center justify-between mb-6">
 <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
 <Zap size={10} className="text-[#00ff88]" /> Live System Stats
 </span>
 <div className="flex gap-1">
 <div className="w-1 h-1 bg-[#00ff88] rounded-full"></div>
 <div className="w-1 h-1 bg-[#00ff88]/30 rounded-full"></div>
 <div className="w-1 h-1 bg-[#00ff88]/30 rounded-full"></div>
 </div>
 </div>

 <div className="space-y-6">
 <div>
 <div className="flex items-center justify-between mb-1">
 <span className="text-[10px] uppercase tracking-widest text-white/30">Total Revenue</span>
 <BarChart3 size={12} className="text-[#00ff88]" />
 </div>
 <div className="text-2xl font-bold font-mono tracking-tighter">$125,237</div>
 </div>
 
 <div>
 <div className="flex items-center justify-between mb-1">
 <span className="text-[10px] uppercase tracking-widest text-white/30">Stock Units</span>
 <Box size={12} className="text-amber-400" />
 </div>
 <div className="text-2xl font-bold font-mono tracking-tighter">8,420</div>
 </div>

 <div>
 <div className="flex items-center justify-between mb-1">
 <span className="text-[10px] uppercase tracking-widest text-white/30">Active Workflows</span>
 <Zap size={12} className="text-blue-400" />
 </div>
 <div className="text-2xl font-bold font-mono tracking-tighter">{nodes.length}</div>
 </div>
 </div>

 <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
 <span className="text-[8px] font-mono text-white/20 uppercase">Last Sync: 16:25:48</span>
 <div className="flex items-center gap-1">
 <span className="text-[8px] font-mono text-[#00ff88] uppercase">Online</span>
 </div>
 </div>
 </div>
 </Panel>

 {/* System Log Overlay */}
 <div className="absolute bottom-32 right-8 z-40 w-72 bg-[#1a1a1a]/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-4">Automation Log</h3>
 <div className="space-y-3">
 <AnimatePresence mode="popLayout">
 {systemLogs.map((log) => (
 <motion.div
 key={log.id}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="text-[9px] font-mono leading-relaxed"
 >
 <span className="text-white/20 mr-2">[{log.time}]</span>
 <span className="text-[#00ff88]/80">{log.text}</span>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 </div>

 {/* Node Library Sidebar (Floating) */}
 <div className="absolute top-32 left-8 z-40 w-64 bg-[#1a1a1a]/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-6">Node Library</h3>
 <div className="space-y-3">
 {[
 { label: 'Hub Node', icon: Database, category: 'HUB', color: 'text-blue-400' },
 { label: 'Demand Source', icon: Share2, category: 'DEMAND', color: 'text-[#00ff88]' },
 { label: 'Sales Step', icon: FileText, category: 'SALES', color: 'text-emerald-400' },
 { label: 'Supply Step', icon: Box, category: 'SUPPLY', color: 'text-amber-400' },
 { label: 'Logistics Step', icon: Truck, category: 'LOGISTICS', color: 'text-cyan-400' },
 { label: 'Asset Lab', icon: Image, category: 'MARKETING', color: 'text-pink-400' },
 { label: 'Creative Gen', icon: Wand2, category: 'MARKETING', color: 'text-purple-400' },
 { label: 'Campaign Engine', icon: Megaphone, category: 'MARKETING', color: 'text-pink-500' },
 { label: 'Analytics Node', icon: BarChart3, category: 'MARKETING', color: 'text-blue-400' },
 { label: 'Channel Sync', icon: Link, category: 'MARKETING', color: 'text-emerald-400' },
 { label: 'Support Step', icon: CheckCircle2, category: 'SUPPORT', color: 'text-purple-400' },
].map((node) => (
 <div
 key={node.label}
 draggable
 onDragStart={(e) => onDragStart(e, 'businessStep', node.label, node.category, node.icon)}
 className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 cursor-grab active:cursor-grabbing transition-all group"
 >
 <div className={`p-2 rounded-lg bg-black/40 ${node.color}`}>
 <node.icon size={14} />
 </div>
 <span className="text-[11px] font-bold text-white/60 group-hover:text-white transition-colors">{node.label}</span>
 </div>
 ))}
 </div>
 </div>

 {/* React Flow Canvas */}
 <div ref={canvasRef} className="flex-1 w-full h-full" onDragOver={onDragOver} onDrop={onDrop}>
 <ReactFlow
 nodes={nodes}
 edges={edges}
 onNodesChange={onNodesChange}
 onEdgesChange={onEdgesChange}
 onConnect={onConnect}
 onNodeClick={onNodeClick}
 nodeTypes={nodeTypes}
 fitView
 colorMode="dark"
 className="bg-[#050505]"
 >
 <Background color="#1a1a1a" gap={25} size={1} variant={BackgroundVariant.Dots} />
 <Controls className="!bg-[#1a1a1a] !border-white/10 !fill-white" />
 </ReactFlow>
 </div>

 {/* Bottom Action Bar */}
 <div className="absolute bottom-8 left-8 z-40 flex gap-4">
 <button 
 onClick={clearMap}
 className="px-6 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-[10px] font-bold tracking-widest uppercase text-white/60 hover:text-white hover:bg-white/20 transition-all flex items-center gap-2"
 >
 <Trash2 size={14} /> Clear Map
 </button>
 <button 
 onClick={saveChanges}
 className="px-6 py-3 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-xl text-[10px] font-bold tracking-widest uppercase text-[#00ff88] hover:bg-[#00ff88]/20 transition-all flex items-center gap-2"
 >
 <Save size={14} /> Save Changes
 </button>
 <button 
 onClick={() => setIsMasterPromptOpen(true)}
 className="px-6 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[10px] font-bold tracking-widest uppercase text-purple-400 hover:bg-purple-500/20 transition-all flex items-center gap-2"
 >
 <Terminal size={14} /> Master Prompt
 </button>
 <button onClick={() => setIsViewingPortal(false)} className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold tracking-widest uppercase text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2">
 <LogOut size={14} /> Exit OS
 </button>
 </div>
 </>
 )}

 {activeModule === 'Customers' && (
 <div className="p-8 h-full overflow-y-auto">
 <header className="mb-12">
 <h1 className="text-4xl font-serif font-bold tracking-tighter text-white uppercase mb-2">CRM Dashboard</h1>
 <p className="text-[10px] font-mono text-[#00ff88] uppercase tracking-[0.3em]">Customer Relationship Management</p>
 </header>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
 {[
 { label: 'Total Customers', value: '1,284', trend: '+12%', icon: Users },
 { label: 'Active Leads', value: '42', trend: '+5%', icon: Zap },
 { label: 'Conversion Rate', value: '8.4%', trend: '+2%', icon: BarChart3 },
].map((stat) => (
 <div key={stat.label} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8">
 <div className="flex items-center justify-between mb-4">
 <stat.icon size={20} className="text-[#00ff88]" />
 <span className="text-[10px] font-mono text-[#00ff88]">{stat.trend}</span>
 </div>
 <div className="text-3xl font-bold font-mono tracking-tighter mb-1">{stat.value}</div>
 <div className="text-[10px] uppercase tracking-widest text-white/30">{stat.label}</div>
 </div>
 ))}
 </div>

 <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden">
 <div className="p-6 border-b border-white/5 flex items-center justify-between">
 <h3 className="text-xs font-bold uppercase tracking-widest">Recent Interactions</h3>
 <button className="text-[10px] text-[#00ff88] uppercase tracking-widest hover:underline">View All</button>
 </div>
 <table className="w-full text-left">
 <thead>
 <tr className="text-[10px] uppercase tracking-widest text-white/30 border-b border-white/5">
 <th className="px-6 py-4 font-normal">Customer</th>
 <th className="px-6 py-4 font-normal">Source</th>
 <th className="px-6 py-4 font-normal">Status</th>
 <th className="px-6 py-4 font-normal">Last Active</th>
 </tr>
 </thead>
 <tbody className="text-sm">
 {[
 { name: 'John Doe', source: 'WhatsApp', status: 'Lead', time: '2 mins ago' },
 { name: 'Sarah Smith', source: 'Instagram', status: 'Quote Sent', time: '15 mins ago' },
 { name: 'Mike Ross', source: 'Email', status: 'Customer', time: '1 hour ago' },
 { name: 'Rachel Zane', source: 'TikTok', status: 'Lead', time: '3 hours ago' },
].map((row, i) => (
 <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
 <td className="px-6 py-4 font-bold">{row.name}</td>
 <td className="px-6 py-4 text-white/60">{row.source}</td>
 <td className="px-6 py-4">
 <span className="px-2 py-1 rounded-full bg-[#00ff88]/10 text-[#00ff88] text-[8px] uppercase font-bold tracking-widest border border-[#00ff88]/20">
 {row.status}
 </span>
 </td>
 <td className="px-6 py-4 text-white/40 font-mono text-xs">{row.time}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {activeModule === 'Suppliers' && (
 <div className="p-8 h-full overflow-y-auto">
 <header className="mb-12">
 <h1 className="text-4xl font-serif font-bold tracking-tighter text-white uppercase mb-2">Vendor Portal</h1>
 <p className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.3em]">Supply Chain Management</p>
 </header>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {[
 { name: 'Global Tiles Co.', items: 12, status: 'Active', rating: '4.8/5' },
 { name: 'Brick Masters Ltd.', items: 8, status: 'Restocking', rating: '4.5/5' },
 { name: 'Ceramic Solutions', items: 15, status: 'Active', rating: '4.9/5' },
 { name: 'Stone & Clay Inc.', items: 5, status: 'Delayed', rating: '3.8/5' },
].map((vendor) => (
 <div key={vendor.name} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8 hover:border-[#00ff88]/20 transition-all group">
 <div className="flex items-center justify-between mb-6">
 <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-[#00ff88] transition-colors">
 <Truck size={24} />
 </div>
 <span className={`text-[8px] uppercase font-bold tracking-widest px-2 py-1 rounded-full border ${vendor.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
 {vendor.status}
 </span>
 </div>
 <h3 className="text-xl font-bold mb-2">{vendor.name}</h3>
 <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-white/30">
 <span>{vendor.items} SKUs</span>
 <span>Rating: {vendor.rating}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {activeModule === 'Inventory' && (
 <div className="p-8 h-full overflow-y-auto">
 <header className="mb-12">
 <h1 className="text-4xl font-serif font-bold tracking-tighter text-white uppercase mb-2">Stock Control & Assets</h1>
 <p className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em]">Inventory & Marketing Linkage</p>
 </header>
 
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-xs font-bold uppercase tracking-widest">Low Stock Alerts</h3>
 <div className="flex items-center gap-2 text-red-400 text-[10px] uppercase tracking-widest font-bold">
 <AlertCircle size={14} /> 4 Items Critical
 </div>
 </div>
 <div className="space-y-4">
 {[
 { name: 'Red Clay Brick', stock: 120, min: 500, status: 'Critical' },
 { name: 'Ceramic Floor Tile', stock: 45, min: 200, status: 'Critical' },
 { name: 'White Subway Tile', stock: 850, min: 1000, status: 'Low' },
 { name: 'Grey Slate Paver', stock: 12, min: 100, status: 'Critical' },
].map((item) => (
 <div key={item.name} className="flex items-center gap-6 p-4 bg-white/5 rounded-xl border border-white/5">
 <div className="flex-1">
 <div className="text-sm font-bold mb-1">{item.name}</div>
 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
 <div 
 className={`h-full ${item.status === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`} 
 style={{ width: `${(item.stock / item.min) * 100}%` }}
 ></div>
 </div>
 </div>
 <div className="text-right">
 <div className="text-xs font-mono font-bold">{item.stock} / {item.min}</div>
 <div className={`text-[8px] uppercase tracking-widest font-bold ${item.status === 'Critical' ? 'text-red-400' : 'text-amber-400'}`}>{item.status}</div>
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-8">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-xs font-bold uppercase tracking-widest">Marketing Asset Health</h3>
 <div className="flex items-center gap-2 text-[#00ff88] text-[10px] uppercase tracking-widest font-bold">
 <CheckCircle2 size={14} /> 85% Coverage
 </div>
 </div>
 <div className="space-y-4">
 {[
 { id: 'PRD_882', name: 'Slate Grey Tile', images: 12, campaigns: 3, model3D: true, renders: 5, health: 'Excellent' },
 { id: 'PRD_112', name: 'Emerald Glaze Brick', images: 4, campaigns: 1, model3D: true, renders: 0, health: 'Good' },
 { id: 'PRD_443', name: 'Rustic Red Brick', images: 2, campaigns: 0, model3D: false, renders: 0, health: 'Needs Assets' },
 { id: 'PRD_991', name: 'Carrara Marble Slab', images: 0, campaigns: 0, model3D: false, renders: 0, health: 'Missing All' },
].map((item) => (
 <div key={item.id} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <div>
 <div className="text-sm font-bold">{item.name}</div>
 <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest">{item.id}</div>
 </div>
 <div className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
 item.health === 'Excellent' ? 'bg-[#00ff88]/10 text-[#00ff88]' :
 item.health === 'Good' ? 'bg-blue-500/10 text-blue-400' :
 item.health === 'Needs Assets' ? 'bg-amber-500/10 text-amber-400' :
 'bg-red-500/10 text-red-400'
 }`}>
 {item.health}
 </div>
 </div>
 <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-white/60">
 <div className="flex items-center gap-1" title="Images"><Image size={12} className={item.images > 0 ? 'text-[#00ff88]' : 'text-white/20'} /> {item.images}</div>
 <div className="flex items-center gap-1" title="Campaigns"><Megaphone size={12} className={item.campaigns > 0 ? 'text-[#00ff88]' : 'text-white/20'} /> {item.campaigns}</div>
 <div className="flex items-center gap-1" title="3D Model"><Box size={12} className={item.model3D ? 'text-[#00ff88]' : 'text-red-400'} /> {item.model3D ? 'Yes' : 'No'}</div>
 <div className="flex items-center gap-1" title="Renders"><Wand2 size={12} className={item.renders > 0 ? 'text-[#00ff88]' : 'text-white/20'} /> {item.renders}</div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {activeModule === 'Marketing' && (
 <div className="flex h-full overflow-hidden">
 {/* Marketing Sub-Nav */}
 <div className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col">
 <div className="p-8 border-bottom border-white/5">
 <h2 className="text-xl font-serif font-bold tracking-tighter text-white uppercase">Marketing Studio</h2>
 <p className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest mt-1">Subsystem v2.5</p>
 </div>
 
 <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
 {[
 { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
 { id: 'AssetLab', label: 'Asset Lab', icon: Image },
 { id: 'Templates', label: 'Templates', icon: FileText },
 { id: 'CreativeGenerator', label: 'Creative Gen', icon: Wand2 },
 { id: 'Campaigns', label: 'Campaigns', icon: Megaphone },
 { id: 'Calendar', label: 'Calendar', icon: Calendar },
 { id: 'Publishing', label: 'Publishing', icon: ListOrdered },
 { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
].map((sub) => {
 const Icon = sub.icon;
 const isActive = activeMarketingSubModule === sub.id;
 return (
 <button
 key={sub.id}
 onClick={() => setActiveMarketingSubModule(sub.id as any)}
 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
 isActive 
 ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 shadow-[0_0_20px_rgba(0,255,136,0.1)]' 
 : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
 }`}
 >
 <Icon size={18} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
 <span className="text-xs font-bold uppercase tracking-widest">{sub.label}</span>
 {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00ff88]" />}
 </button>
 );
 })}
 </nav>

 <div className="p-6 border-t border-white/5">
 <div className="bg-[#00ff88]/5 border border-[#00ff88]/10 rounded-xl p-4">
 <div className="flex items-center gap-2 mb-2">
 <Activity size={12} className="text-[#00ff88]" />
 <span className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest">System Health</span>
 </div>
 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
 <div className="w-3/4 h-full bg-[#00ff88]" />
 </div>
 <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest mt-2">All Nodes Operational</p>
 </div>
 </div>
 </div>

 {/* Marketing Content Area */}
 <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.03),transparent)]">
 <div className="p-8 max-w-7xl mx-auto">
 {activeMarketingSubModule === 'Dashboard' && (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
 <header>
 <h1 className="text-4xl font-serif font-bold tracking-tighter text-white uppercase mb-2">Command Center</h1>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Runtime Monitoring & Global Orchestration</p>
 </header>

 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 {[
 { label: 'Active Campaigns', value: '12', trend: '+2', icon: Megaphone, color: 'text-blue-400' },
 { label: 'Pending Renders', value: '48', trend: 'High', icon: Wand2, color: 'text-purple-400' },
 { label: 'Total Reach', value: '1.2M', trend: '+12%', icon: Users, color: 'text-[#00ff88]' },
 { label: 'Conversion', value: '3.8%', trend: '+0.4%', icon: Activity, color: 'text-pink-400' },
].map((stat, i) => (
 <motion.div 
 key={stat.label} 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.05 }}
 className="bg-[#111] border border-white/10 rounded-xl p-6 hover:border-[#00ff88]/20 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(0,255,136,0.15)] transition-all duration-300 group relative overflow-hidden shadow-xl"
 >
 <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-4">
 <div className={`p-3 rounded-xl bg-black border border-white/5 shadow-inner ${stat.color}`}>
 <stat.icon size={20} />
 </div>
 <span className="text-[10px] font-mono text-[#00ff88] px-2 py-1 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 shadow-sm">{stat.trend}</span>
 </div>
 <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1 group-hover:text-white/60 transition-colors">{stat.label}</h3>
 <p className="text-3xl font-bold text-white tracking-tighter group-hover:text-[#00ff88] transition-colors">{stat.value}</p>
 </div>
 </motion.div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="bg-[#111] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group shadow-2xl hover:border-[#00ff88]/20 transition-all duration-500"
 >
 <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-10">
 <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Live Campaign Stream</h3>
 <button className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest hover:underline">View All</button>
 </div>
 <div className="space-y-6">
 {[
 { name: 'Spring Collection Launch', status: 'Active', progress: 75, color: 'bg-[#00ff88]', id: 'CMP_001' },
 { name: 'Retargeting: High Value', status: 'Active', progress: 42, color: 'bg-blue-400', id: 'CMP_002' },
 { name: 'Influencer Seeding', status: 'Draft', progress: 10, color: 'bg-white/20', id: 'CMP_003' },
].map((camp, i) => (
 <motion.div 
 key={camp.name} 
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.2 + (i * 0.1) }}
 className="p-8 bg-black border border-white/5 rounded-xl hover:border-[#00ff88]/20 transition-all group/item relative overflow-hidden shadow-inner"
 >
 <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-6">
 <div className="space-y-1">
 <span className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest opacity-60 group-hover/item:opacity-100 transition-opacity">{camp.id}</span>
 <h4 className="text-xl font-serif font-bold text-white uppercase tracking-tight group-hover/item:text-[#00ff88] transition-colors">{camp.name}</h4>
 </div>
 <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${camp.status === 'Active' ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20' : 'bg-white/5 text-white/40 border-white/10'}`}>
 {camp.status}
 </span>
 </div>
 <div className="space-y-3">
 <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase tracking-widest">
 <span>Execution Progress</span>
 <span className="group-hover/item:text-[#00ff88] transition-colors">{camp.progress}%</span>
 </div>
 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${camp.progress}%` }}
 transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.5 + (i * 0.1) }}
 className={`h-full ${camp.color} shadow-[0_0_15px_currentColor]`}
 />
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </motion.div>

 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="bg-[#111] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group shadow-2xl hover:border-[#00ff88]/20 transition-all duration-500"
 >
 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-10">
 <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Asset Lab Status</h3>
 <button className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest hover:underline">Open Lab</button>
 </div>
 <div className="grid grid-cols-2 gap-6">
 {[
 { label: 'Total Assets', value: '1,240', color: 'text-white' },
 { label: '3D Readiness', value: '85%', color: 'text-[#00ff88]' },
 { label: 'Active Renders', value: '12', color: 'text-purple-400' },
 { label: 'New Variants', value: '4', color: 'text-blue-400' },
].map((stat, i) => (
 <motion.div 
 key={i} 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.3 + (i * 0.05) }}
 className="p-8 bg-black border border-white/5 rounded-xl hover:border-[#00ff88]/20 transition-all group/stat relative overflow-hidden shadow-inner"
 >
 <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
 <div className="relative z-10">
 <p className={`text-4xl font-serif font-bold mb-2 ${stat.color} group-hover/stat:scale-110 group-hover/stat:text-[#00ff88] transition-all origin-left duration-500`}>{stat.value}</p>
 <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest group-hover/stat:text-white/60 transition-colors">{stat.label}</p>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </motion.div>
 </div>
 </motion.div>
 )}

 {activeMarketingSubModule === 'AssetLab' && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
 <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h1 className="text-4xl font-serif font-bold tracking-tighter text-white uppercase mb-2">Asset Lab</h1>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Media Intelligence & Variant Management</p>
 </div>
 <div className="flex items-center gap-4">
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
 <input 
 type="text" 
 placeholder="SEARCH ASSETS..." 
 value={assetSearch}
 onChange={(e) => setAssetSearch(e.target.value)}
 className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-[10px] font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff88]/50 w-64 uppercase tracking-widest"
 />
 </div>
 <button className="px-8 py-4 bg-[#00ff88] text-black font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#00cc6e] transition-all flex items-center gap-2">
 <Plus size={16} /> Upload Asset
 </button>
 </div>
 </header>

 <div className="flex flex-wrap gap-4 p-2 bg-white/5 border border-white/10 rounded-xl w-fit">
 {['All', 'Images', 'Videos', '3D Models', 'Renders', 'Originals', 'Variants'].map((filter) => (
 <button 
 key={filter} 
 onClick={() => setAssetFilter(filter)}
 className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${assetFilter === filter ? 'bg-[#00ff88] text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
 >
 {filter}
 </button>
 ))}
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
 {MOCK_ASSETS
 .filter(asset => {
 const matchesSearch = asset.name.toLowerCase().includes(assetSearch.toLowerCase()) || asset.tags.some(t => t.toLowerCase().includes(assetSearch.toLowerCase()));
 const matchesFilter = assetFilter === 'All' || 
 (assetFilter === 'Originals' && asset.protectionLevel === 'Protected Original') ||
 (assetFilter === 'Variants' && asset.protectionLevel !== 'Protected Original') ||
 (assetFilter === asset.type + 's') || 
 (assetFilter === '3D Models' && asset.type === '3D Asset');
 return matchesSearch && matchesFilter;
 })
 .map((asset, i) => (
 <motion.div 
 key={asset.id} 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 onClick={() => setSelectedAsset(asset)}
 className="group relative bg-[#111] border border-white/10 rounded-xl overflow-hidden hover:border-[#00ff88]/20 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(0,255,136,0.15)] transition-all duration-300 cursor-pointer"
 >
 <div className="aspect-square overflow-hidden relative bg-black">
 <img src={asset.img} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" referrerPolicy="no-referrer" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
 <div className="p-3 bg-white/10 rounded-xl text-white backdrop-blur-md border border-white/20">
 <Eye size={20} />
 </div>
 </div>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[7px] font-bold text-white/60 uppercase tracking-widest w-fit shadow-lg flex items-center gap-1.5">
            {asset.type === '3D Asset' || asset.type === 'Model' ? <Box size={10} /> : asset.type === 'Video' ? <Video size={10} /> : <Image size={10} />}
            {asset.type}
          </div>
          {asset.protectionLevel === 'Protected Original' ? (
            <div className="px-2 py-1 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded text-[7px] font-bold text-red-400 uppercase tracking-widest w-fit shadow-lg flex items-center gap-1.5">
              <Lock size={10} /> Protected Original
            </div>
          ) : asset.protectionLevel === 'Publishable Variant' ? (
            <div className="px-2 py-1 bg-[#00ff88]/20 backdrop-blur-md border border-[#00ff88]/30 rounded text-[7px] font-bold text-[#00ff88] uppercase tracking-widest w-fit shadow-lg flex items-center gap-1.5">
              <Share size={10} /> Publishable Variant
            </div>
          ) : (
            <div className="px-2 py-1 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded text-[7px] font-bold text-blue-400 uppercase tracking-widest w-fit shadow-lg flex items-center gap-1.5">
              <Layers size={10} /> Managed Variant
            </div>
          )}
        </div>
        <div className="absolute bottom-4 right-4">
          <span className={`text-[7px] font-bold uppercase tracking-widest px-2 py-1 rounded backdrop-blur-md border shadow-lg ${
            asset.status === 'Approved' ? 'bg-black/60 text-[#00ff88] border-[#00ff88]/30' : 
            asset.status === 'Review' ? 'bg-black/60 text-orange-400 border-orange-500/30' : 
            'bg-black/60 text-white/40 border-white/10'
          }`}>
            {asset.status}
          </span>
        </div>
 </div>
 <div className="p-5 relative z-10 bg-gradient-to-b from-[#111] to-black">
 <div className="flex items-center justify-between mb-2">
 <h4 className="text-xs font-bold text-white truncate group-hover:text-[#00ff88] transition-colors">{asset.name}</h4>
 {asset.is3DReady && (
 <div className="text-[#00ff88] bg-[#00ff88]/10 p-1 rounded border border-[#00ff88]/20" title="3D Ready">
 <Box size={12} />
 </div>
 )}
 </div>
 
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{asset.size}</span>
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{asset.usage[0]}</span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[7px] uppercase tracking-widest text-white/20 font-bold">Products</span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/60">
              <ShoppingBag size={10} className="text-white/20" />
              <span>{asset.linkedProductIds?.length || (asset.productId ? 1 : 0)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[7px] uppercase tracking-widest text-white/20 font-bold">Campaigns</span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/60">
              <Megaphone size={10} className="text-white/20" />
              <span>{asset.linkedCampaignIds?.length || (asset.campaignId ? 1 : 0)}</span>
            </div>
          </div>
          {asset.completeness !== undefined && (
            <div className="flex-1 flex flex-col gap-1.5 ml-2">
              <span className="text-[7px] uppercase tracking-widest text-white/20 font-bold">Health</span>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${asset.completeness === 100 ? 'bg-[#00ff88]' : 'bg-amber-400'}`} 
                  style={{ width: `${asset.completeness}%` }} 
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {asset.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[7px] font-bold text-white/30 bg-white/5 border border-white/10 px-2 py-1 rounded uppercase tracking-widest">{tag}</span>
          ))}
          {asset.tags.length > 2 && <span className="text-[7px] font-bold text-white/30 bg-white/5 border border-white/10 px-2 py-1 rounded uppercase tracking-widest">+ {asset.tags.length - 2}</span>}
        </div>
        
        {asset.workflowNode && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[7px] font-bold text-purple-400/60 uppercase tracking-widest">
            <Activity size={10} /> {asset.workflowNode}
          </div>
        )}
 </div>
 </motion.div>
 ))}
 </div>
 </motion.div>
 )}

 {activeMarketingSubModule === 'Templates' && (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
 <header className="flex items-center justify-between">
 <div>
 <h1 className="text-4xl font-serif font-bold tracking-tighter text-white uppercase mb-2">Templates</h1>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Deterministic Blueprints for Creative Output</p>
 </div>
 <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
 <Plus size={16} /> New Blueprint
 </button>
 </header>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {MOCK_TEMPLATES.map((template, i) => (
 <motion.div 
 key={template.id} 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.1 }}
 className="bg-[#111] border border-white/10 rounded-3xl p-8 hover:border-[#00ff88]/20 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(0,255,136,0.15)] transition-all duration-300 group relative overflow-hidden flex flex-col"
 >
 <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
 <div className="w-full aspect-video bg-black border border-white/5 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden shadow-inner">
 <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" referrerPolicy="no-referrer" />
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-mono text-[#00ff88] uppercase tracking-widest shadow-lg">
 {template.type}
 </div>
 </div>
 </div>
 <h3 className="text-xl font-serif font-bold text-white uppercase tracking-tighter mb-2 group-hover:text-[#00ff88] transition-colors relative z-10">{template.name}</h3>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-relaxed mb-6 flex-1 relative z-10">{template.description}</p>
 
 <div className="p-4 bg-black/40 border border-white/5 rounded-xl mb-8 relative z-10 shadow-inner">
 <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-2">Deterministic Blueprint</p>
 <p className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest">{template.blueprint}</p>
 </div>

 <button 
 onClick={() => {
 setSelectedTemplate(template);
 setActiveMarketingSubModule('CreativeGenerator');
 }}
 className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88] transition-all relative z-10"
 >
 Use Template
 </button>
 </motion.div>
 ))}
 </div>
 </motion.div>
 )}

 {activeMarketingSubModule === 'CreativeGenerator' && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col">
 <header className="mb-12 flex items-center justify-between">
 <div>
 <h1 className="text-4xl font-serif font-bold tracking-tighter text-white uppercase mb-2">Creative Generator</h1>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Deterministic Asset Synthesis</p>
 </div>
 <div className="flex items-center gap-4">
 <button 
 onClick={() => setActiveMarketingSubModule('Templates')}
 className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all"
 >
 Change Template
 </button>
 <button 
 onClick={() => {
 setIsRendering(true);
 setTimeout(() => {
 setIsRendering(false);
 setSystemLogs(prev => [{ id: Date.now().toString(), text: `RENDER_COMPLETE: ${selectedTemplate?.name} generated for ${selectedProduct?.name}`, time: new Date().toLocaleTimeString() }, ...prev]);
 }, 2000);
 }}
 disabled={isRendering}
 className="px-8 py-4 bg-[#00ff88] text-black font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#00cc6e] transition-all disabled:opacity-50"
 >
 {isRendering ? 'RENDERING...' : 'SAVE & RENDER'}
 </button>
 </div>
 </header>

 <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
 {/* Left Side: Source Product Mapping */}
 <div className="bg-white/5 border border-white/10 rounded-3xl p-8 overflow-y-auto custom-scrollbar space-y-8">
 <section className="space-y-6">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">Source Product Mapping</h3>
 <div className="grid grid-cols-2 gap-4">
 {BTS_PRODUCTS.map((product) => (
 <button 
 key={product.id}
 onClick={() => setSelectedProduct(product)}
 className={`p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${selectedProduct?.id === product.id ? 'bg-[#00ff88]/10 border-[#00ff88]/50 ring-1 ring-[#00ff88]/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
 >
 <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black">
 <img src={product.img} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 <div className="min-w-0">
 <p className="text-[10px] font-bold text-white uppercase truncate">{product.name}</p>
 <p className="text-[8px] font-mono text-white/30 uppercase">{product.id}</p>
 </div>
 </button>
 ))}
 </div>
 </section>

 <section className="space-y-6">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">Template Blueprint: {selectedTemplate?.name || 'Standard Product Card'}</h3>
 <div className="space-y-4">
 <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-6">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-mono text-white/40 uppercase">Layout Logic</span>
 <span className="text-[10px] font-mono text-[#00ff88] uppercase">Deterministic</span>
 </div>
 <div className="space-y-4">
 <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
 <span className="text-[10px] font-bold text-white uppercase">Image Aspect</span>
 <span className="text-[10px] font-mono text-white/40 uppercase">1:1 Square</span>
 </div>
 <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
 <span className="text-[10px] font-bold text-white uppercase">Overlay Position</span>
 <span className="text-[10px] font-mono text-white/40 uppercase">Bottom Left</span>
 </div>
 <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
 <span className="text-[10px] font-bold text-white uppercase">Typography</span>
 <span className="text-[10px] font-mono text-white/40 uppercase">Serif Display</span>
 </div>
 </div>
 </div>
 </div>
 </section>

 <section className="space-y-6">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">Variant Settings</h3>
 <div className="space-y-4">
 <div 
 onClick={() => setVariantSettings(s => ({ ...s, transparentBg: !s.transparentBg }))}
 className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:border-[#00ff88]/20 transition-all"
 >
 <div>
 <span className={`text-[10px] font-bold uppercase block mb-1 ${variantSettings.transparentBg ? 'text-[#00ff88]' : 'text-white'}`}>Transparent Background</span>
 <span className="text-[8px] font-mono text-white/40 uppercase">AI Subject Isolation</span>
 </div>
 <div className={`w-8 h-4 rounded-full relative transition-colors ${variantSettings.transparentBg ? 'bg-[#00ff88]' : 'bg-white/10'}`}>
 <div className={`w-4 h-4 bg-white rounded-full absolute shadow-md transition-all ${variantSettings.transparentBg ? 'right-0' : 'left-0'}`}></div>
 </div>
 </div>
 <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
 <div>
 <span className="text-[10px] font-bold text-white uppercase block mb-1">Channel Size</span>
 <span className="text-[8px] font-mono text-white/40 uppercase">Dimensions</span>
 </div>
 <select 
 value={variantSettings.channelSize}
 onChange={(e) => setVariantSettings(s => ({ ...s, channelSize: e.target.value }))}
 className="bg-black border border-white/10 rounded-lg text-[10px] font-mono text-white/60 p-2 uppercase tracking-widest outline-none focus:border-[#00ff88]/50 transition-colors"
 >
 <option value="Original">Original Size</option>
 <option value="1080x1080">1080x1080 (Square)</option>
 <option value="1080x1920">1080x1920 (Story)</option>
 <option value="1200x630">1200x630 (Web Hero)</option>
 </select>
 </div>
 <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
 <div>
 <span className="text-[10px] font-bold text-white uppercase block mb-1">Watermark Profile</span>
 <span className="text-[8px] font-mono text-white/40 uppercase">Protection Level</span>
 </div>
 <select 
 value={variantSettings.watermarkProfile}
 onChange={(e) => setVariantSettings(s => ({ ...s, watermarkProfile: e.target.value }))}
 className="bg-black border border-white/10 rounded-lg text-[10px] font-mono text-white/60 p-2 uppercase tracking-widest outline-none focus:border-[#00ff88]/50 transition-colors"
 >
 <option value="None">None</option>
 <option value="Standard BTS">Standard BTS</option>
 <option value="Confidential">Confidential</option>
 <option value="Draft">Draft</option>
 </select>
 </div>
 <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
 <div>
 <span className="text-[10px] font-bold text-white uppercase block mb-1">Usage Purpose</span>
 <span className="text-[8px] font-mono text-white/40 uppercase">Asset Role</span>
 </div>
 <select 
 value={variantSettings.usagePurpose}
 onChange={(e) => setVariantSettings(s => ({ ...s, usagePurpose: e.target.value }))}
 className="bg-black border border-white/10 rounded-lg text-[10px] font-mono text-white/60 p-2 uppercase tracking-widest outline-none focus:border-[#00ff88]/50 transition-colors"
 >
 <option value="Publishable Variant">Publishable Variant</option>
 <option value="Campaign">Campaign</option>
 <option value="Gallery">Gallery</option>
 <option value="Social">Social</option>
 </select>
 </div>
 </div>
 </section>

 <section className="space-y-6">
 <div className="flex items-center justify-between">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">AI Copy Assistant (Secondary)</h3>
 <button className="text-[8px] font-mono text-[#00ff88] uppercase tracking-widest hover:underline">Regenerate</button>
 </div>
 <textarea 
 value={generatorCopy}
 onChange={(e) => setGeneratorCopy(e.target.value)}
 className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-6 text-sm font-mono text-white/80 focus:outline-none focus:border-[#00ff88]/50 transition-colors resize-none"
 placeholder="Enter or generate copy..."
 />
 </section>
 </div>

 {/* Right Side: Live Preview */}
 <div className="flex flex-col gap-6">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">Live Deterministic Preview</h3>
 <div className="flex-1 bg-black rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center p-8">
 {/* Mock Render Area */}
 <div className="relative w-full aspect-square max-w-md shadow-2xl overflow-hidden rounded-xl bg-[#0a0a0a]">
 <img 
 src={selectedProduct?.img} 
 alt="Preview" 
 className="w-full h-full object-cover opacity-80"
 referrerPolicy="no-referrer"
 />
 
 {/* Deterministic Overlays based on Template */}
 {(!selectedTemplate || selectedTemplate.type === 'Product Card') && (
 <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
 <div className="flex items-end justify-between">
 <div className="max-w-[70%]">
 <h4 className="text-3xl font-serif font-bold text-white uppercase tracking-tighter leading-none mb-2">{selectedProduct?.name}</h4>
 <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest leading-relaxed">{generatorCopy}</p>
 </div>
 <div className="text-right">
 <div className="px-3 py-1 bg-[#00ff88] text-black text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">
 {selectedProduct?.price}
 </div>
 <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Brick Tile Shop</div>
 </div>
 </div>
 </div>
 )}

 {selectedTemplate?.type === 'Collection Highlight' && (
 <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
 <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
 <div className="relative z-10">
 <span className="text-[10px] font-mono text-[#00ff88] uppercase tracking-[0.4em] mb-4 block">New Collection</span>
 <h4 className="text-4xl font-serif font-bold text-white uppercase tracking-tighter leading-none mb-6">{selectedProduct?.category} Series</h4>
 <p className="text-xs font-mono text-white/60 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">{generatorCopy}</p>
 <div className="mt-8 flex gap-2 justify-center">
 {[1, 2, 3].map(i => (
 <div key={i} className="w-12 h-12 rounded-lg border border-white/20 overflow-hidden">
 <img src={`https://picsum.photos/seed/coll${i}/100/100`} alt="thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {selectedTemplate?.type === 'Quote CTA' && (
 <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center">
 <div className="absolute inset-0 bg-black/60" />
 <div className="relative z-10 space-y-8">
 <Quote size={40} className="text-[#00ff88] mx-auto opacity-50" />
 <h4 className="text-2xl font-serif italic text-white leading-tight">"{generatorCopy}"</h4>
 <div className="space-y-1">
 <p className="text-[10px] font-bold text-white uppercase tracking-widest">Architectural Digest</p>
 <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Review: {selectedProduct?.name}</p>
 </div>
 <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl">
 Explore Series
 </button>
 </div>
 </div>
 )}

 {/* Scanline / Technical Overlay */}
 <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
 </div>

 {/* Render Progress Overlay */}
 <AnimatePresence>
 {isRendering && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-6"
 >
 <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: '100%' }}
 transition={{ duration: 2 }}
 className="h-full bg-[#00ff88]"
 />
 </div>
 <p className="text-[10px] font-mono text-[#00ff88] uppercase tracking-[0.5em] animate-pulse">Rendering Deterministic Asset...</p>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
 <Monitor size={20} />
 </div>
 <div>
 <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Preview Mode</p>
 <p className="text-xs font-bold text-white uppercase">1080x1080 (1:1)</p>
 </div>
 </div>
 <div className="flex gap-2">
 {['1:1', '9:16', '16:9'].map(ratio => (
 <button key={ratio} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-mono text-white/60 uppercase hover:border-[#00ff88]/50 transition-all">
 {ratio}
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 )}

 {activeMarketingSubModule === 'Publishing' && (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
 <header className="flex items-center justify-between">
 <div>
 <h1 className="text-4xl font-serif font-bold tracking-tighter text-white uppercase mb-2">Publishing</h1>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Runtime Monitor & Job Execution Status</p>
 </div>
 <button 
 onClick={() => {
 setIsRefreshingQueue(true);
 setTimeout(() => setIsRefreshingQueue(false), 1500);
 }}
 className={`flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all ${isRefreshingQueue ? 'opacity-50 cursor-not-allowed' : ''}`}
 >
 <RefreshCw size={14} className={isRefreshingQueue ? 'animate-spin' : ''} />
 {isRefreshingQueue ? 'Refreshing...' : 'Refresh Status'}
 </button>
 </header>

 {/* Summary Cards */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
 {[
 { label: 'Total Jobs', value: publishingJobs.length, icon: Activity, color: 'text-white' },
 { label: 'Publishing', value: publishingJobs.filter(j => j.status === 'Publishing' || j.status === 'Retrying').length, icon: Zap, color: 'text-blue-400' },
 { label: 'Failed', value: publishingJobs.filter(j => j.status === 'Failed').length, icon: AlertCircle, color: 'text-red-400' },
 { label: 'Completed', value: publishingJobs.filter(j => j.status === 'Published').length, icon: CheckCircle2, color: 'text-[#00ff88]' },
].map((stat, i) => (
 <motion.div 
 key={i} 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.05 }}
 className="bg-[#111] border border-white/10 rounded-xl p-8 space-y-6 relative overflow-hidden group hover:border-[#00ff88]/20 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(0,255,136,0.15)] transition-all duration-300 shadow-xl"
 >
 <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-6">
 <div className={`p-3 rounded-xl bg-black border border-white/5 shadow-inner ${stat.color}`}>
 <stat.icon size={24} />
 </div>
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
 <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Live Monitor</span>
 </div>
 </div>
 <div>
 <p className="text-4xl font-serif font-bold text-white tracking-tighter mb-1 group-hover:scale-105 group-hover:text-[#00ff88] transition-all origin-left duration-500">{stat.value}</p>
 <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{stat.label}</p>
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
 {/* Job Table */}
 <div className="lg:col-span-3 space-y-8">
 <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl hover:border-[#00ff88]/20 transition-all duration-500">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-white/10 bg-white/5">
 <th className="px-10 py-8 text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Job ID</th>
 <th className="px-10 py-8 text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Creative / Channel</th>
 <th className="px-10 py-8 text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Status / Progress</th>
 <th className="px-10 py-8 text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] text-right">Timestamp</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {publishingJobs.map((job, i) => (
 <motion.tr 
 key={job.id} 
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: i * 0.05 }}
 className="hover:bg-white/[0.02] transition-colors group relative"
 >
 <td className="px-10 py-8">
 <span className="text-xs font-mono text-white/40 group-hover:text-[#00ff88] transition-colors">{job.id}</span>
 </td>
 <td className="px-10 py-8">
 <div className="space-y-1.5">
 <p className="text-sm font-serif font-bold text-white uppercase tracking-tight group-hover:text-[#00ff88] transition-colors">{job.creativeName}</p>
 <div className="flex items-center gap-2">
 <p className="text-[10px] font-mono text-[#00ff88]/60 uppercase tracking-widest">{job.channel}</p>
 {job.campaignId && (
 <>
 <span className="text-white/20">•</span>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1">
 <Megaphone size={10} /> {MOCK_CAMPAIGNS.find(c => c.id === job.campaignId)?.name}
 </p>
 </>
 )}
 {job.workflowNode && (
 <>
 <span className="text-white/20">•</span>
 <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1">
 <Activity size={10} /> {job.workflowNode}
 </p>
 </>
 )}
 </div>
 </div>
 </td>
 <td className="px-10 py-8">
 <div className="flex items-center gap-6">
 <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border whitespace-nowrap shadow-sm ${
 job.status === 'Published' ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20' :
 job.status === 'Publishing' ? 'bg-blue-500/10 text-blue-400 border-blue-400/20 animate-pulse' :
 job.status === 'Failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
 job.status === 'Retrying' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
 'bg-white/5 text-white/40 border-white/10'
 }`}>
 {job.status}
 </span>
 {(job.status === 'Publishing' || job.status === 'Retrying') && (
 <div className="w-40 h-1.5 bg-black rounded-full overflow-hidden border border-white/5 shadow-inner">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${job.progress}%` }}
 transition={{ type: 'spring', damping: 20, delay: 0.5 + (i * 0.05) }}
 className={`h-full ${job.status === 'Retrying' ? 'bg-yellow-400' : 'bg-blue-400'} shadow-[0_0_10px_currentColor]`}
 />
 </div>
 )}
 {job.status === 'Failed' && (
 <span className="text-[9px] font-mono text-red-400/60 uppercase tracking-widest">{job.error}</span>
 )}
 </div>
 </td>
 <td className="px-10 py-8 text-right">
 <span className="text-xs font-mono text-white/40">{job.timestamp}</span>
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Channel Health */}
 <div className="space-y-6">
 <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
 <div className="flex items-center justify-between">
 <h3 className="text-xs font-bold uppercase tracking-widest text-white">Channel Health</h3>
 <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
 </div>
 
 <div className="space-y-6">
 {channelHealth.map((channel) => (
 <div key={channel.name} className="space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-mono text-white uppercase tracking-widest">{channel.name}</span>
 <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
 channel.status === 'Healthy' ? 'text-[#00ff88] bg-[#00ff88]/10' :
 channel.status === 'Degraded' ? 'text-yellow-400 bg-yellow-400/10' :
 'text-red-400 bg-red-400/10'
 }`}>
 {channel.status}
 </span>
 </div>
 <div className="flex items-center justify-between text-[8px] font-mono text-white/20 uppercase tracking-tighter">
 <span>LATENCY: {channel.latency}</span>
 <span>UPTIME: {channel.uptime}</span>
 </div>
 <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
 <div className={`h-full ${
 channel.status === 'Healthy' ? 'bg-[#00ff88]' :
 channel.status === 'Degraded' ? 'bg-yellow-400' :
 'bg-red-400'
 } w-full opacity-30`} />
 </div>
 </div>
 ))}
 </div>

 <div className="pt-6 border-t border-white/5">
 <div className="p-4 bg-white/5 rounded-xl space-y-2">
 <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">System Load</p>
 <div className="flex items-end gap-1 h-8">
 {Array.from({ length: 12 }).map((_, i) => (
 <div key={i} className="flex-1 bg-[#00ff88]/20 rounded-t-sm" style={{ height: `${30 + Math.random() * 70}%` }} />
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 )}

 {activeMarketingSubModule === 'Campaigns' && (
 <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
 <header className="flex items-center justify-between">
 <div>
 <h1 className="text-4xl font-serif font-bold tracking-tighter text-white uppercase mb-2">Campaigns</h1>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Multi-Channel Orchestration & Lifecycle Management</p>
 </div>
 <button 
 onClick={() => {
 setWizardStep(1);
 setIsWizardOpen(true);
 }}
 className="px-8 py-4 bg-[#00ff88] text-black font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#00cc6e] transition-all"
 >
 Create Campaign
 </button>
 </header>

 <div className="grid grid-cols-1 gap-6">
 {MOCK_CAMPAIGNS.map((camp, i) => {
 const isExpanded = expandedCampaignId === camp.id;
 const campPosts = scheduledPosts.filter(p => p.campaignId === camp.id);
 const campJobs = publishingJobs.filter(j => j.campaignId === camp.id);
 
 return (
 <motion.div 
 key={camp.id} 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.1 }}
 className={`bg-[#111] border ${isExpanded ? 'border-[#00ff88]/50 shadow-[0_0_40px_rgba(0,255,136,0.1)]' : 'border-white/10 hover:border-[#00ff88]/20 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(0,255,136,0.15)]'} rounded-xl p-8 transition-all duration-300 group relative overflow-hidden cursor-pointer`}
 onClick={() => setExpandedCampaignId(isExpanded ? null : camp.id)}
 >
 <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
 <div className="absolute top-0 right-0 p-6 z-10">
 <span className={`text-[8px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border shadow-lg ${
 camp.status === 'Active' ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20' :
 camp.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
 'bg-white/5 text-white/40 border-white/10'
 }`}>
 {camp.status}
 </span>
 </div>

 <div className="flex flex-col lg:flex-row items-center gap-8">
 <div className="w-20 h-20 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-white/20 group-hover:text-[#00ff88] transition-colors relative z-10 shadow-inner">
 <Megaphone size={32} />
 <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#00ff88] text-black flex items-center justify-center text-[10px] font-bold border-4 border-[#111] shadow-lg">
 {camp.linkedAssetIds.length}
 </div>
 </div>

 <div className="flex-1 space-y-4 text-center lg:text-left relative z-10">
 <div>
 <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-tighter group-hover:text-[#00ff88] transition-colors">{camp.name}</h3>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{camp.description}</p>
 </div>
 <div className="flex flex-wrap justify-center lg:justify-start gap-2 items-center">
 {camp.channels.map(c => (
 <span key={c} className="px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-[8px] font-mono text-white/60 uppercase tracking-widest shadow-sm">{c}</span>
 ))}
 {camp.workflowNode && (
 <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[8px] font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1 shadow-sm">
 <Activity size={10} /> {camp.workflowNode}
 </span>
 )}
 </div>
 </div>

 <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12 relative z-10">
 <div className="space-y-1">
 <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Owner</p>
 <p className="text-xs font-bold text-white uppercase">{camp.owner}</p>
 </div>
 <div className="space-y-1">
 <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Timeline</p>
 <p className="text-xs font-bold text-white uppercase">{camp.startDate} — {camp.endDate}</p>
 </div>
 <div className="space-y-1">
 <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Budget</p>
 <p className="text-xs font-bold text-[#00ff88] uppercase">{camp.budget}</p>
 </div>
 </div>

 <button className={`p-4 rounded-xl transition-all relative z-10 ${isExpanded ? 'bg-[#00ff88] text-black' : 'bg-white/5 text-white/20 hover:text-white hover:bg-[#00ff88] hover:text-black'}`}>
 <ChevronRight size={24} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
 </button>
 </div>

 {/* Expanded Lifecycle View */}
 <AnimatePresence>
 {isExpanded && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="mt-8 pt-8 border-t border-white/10 relative z-10"
 >
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Scheduled Posts */}
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
 <Calendar size={12} /> Scheduled Posts ({campPosts.length})
 </h4>
 <button 
 onClick={(e) => { e.stopPropagation(); setActiveMarketingSubModule('Calendar'); }}
 className="text-[10px] font-bold text-[#00ff88] uppercase hover:underline"
 >
 View Calendar
 </button>
 </div>
 <div className="space-y-2">
 {campPosts.length === 0 ? (
 <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
 <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">No posts scheduled</p>
 </div>
 ) : (
 campPosts.map(post => (
 <div key={post.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className={`w-2 h-2 rounded-full ${post.status === 'Published' ? 'bg-[#00ff88]' : post.status === 'Scheduled' ? 'bg-blue-400' : 'bg-white/20'}`} />
 <div>
 <p className="text-[10px] font-bold text-white uppercase">{post.title}</p>
 <p className="text-[8px] font-mono text-white/40">{post.date} @ {post.time} • {post.channel}</p>
 </div>
 </div>
 <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{post.status}</span>
 </div>
 ))
 )}
 </div>
 </div>

 {/* Publishing Jobs */}
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
 <Activity size={12} /> Publishing Queue ({campJobs.length})
 </h4>
 <button 
 onClick={(e) => { e.stopPropagation(); setActiveMarketingSubModule('Publishing'); }}
 className="text-[10px] font-bold text-[#00ff88] uppercase hover:underline"
 >
 View Monitor
 </button>
 </div>
 <div className="space-y-2">
 {campJobs.length === 0 ? (
 <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
 <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">No active jobs</p>
 </div>
 ) : (
 campJobs.map(job => (
 <div key={job.id} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between">
 <div className="flex items-center gap-3">
 {job.status === 'Published' ? <CheckCircle2 size={14} className="text-[#00ff88]" /> :
 job.status === 'Failed' ? <AlertCircle size={14} className="text-red-400" /> :
 <RefreshCw size={14} className="text-blue-400 animate-spin" />}
 <div>
 <p className="text-[10px] font-bold text-white uppercase">{job.creativeName}</p>
 <p className="text-[8px] font-mono text-white/40">{job.channel} • {job.timestamp}</p>
 </div>
 </div>
 <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{job.status}</span>
 </div>
 ))
 )}
 </div>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 );
 })}
 </div>

 {/* Campaign Creation Wizard Modal */}
 <AnimatePresence>
 {isWizardOpen && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl"
 >
 <motion.div 
 initial={{ scale: 0.9, y: 20 }}
 animate={{ scale: 1, y: 0 }}
 exit={{ scale: 0.9, y: 20 }}
 className="w-full max-w-5xl bg-[#121212] border border-white/10 rounded-[48px] overflow-hidden flex flex-col h-[80vh]"
 >
 {/* Wizard Header */}
 <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
 <div className="flex items-center gap-6">
 <div className="w-12 h-12 rounded-xl bg-[#00ff88] text-black flex items-center justify-center">
 <Plus size={24} />
 </div>
 <div>
 <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-tighter">New Campaign Wizard</h2>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Step {wizardStep} of 5 — {
 wizardStep === 1 ? 'Core Details' :
 wizardStep === 2 ? 'Product Selection' :
 wizardStep === 3 ? 'Channel Mapping' :
 wizardStep === 4 ? 'Creative Assets' :
 'Final Review'
 }</p>
 </div>
 </div>
 <button 
 onClick={() => setIsWizardOpen(false)}
 className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
 >
 <X size={20} />
 </button>
 </div>

 {/* Wizard Steps Progress */}
 <div className="px-10 py-6 bg-black/40 border-b border-white/5 flex items-center justify-between gap-4">
 {[1, 2, 3, 4, 5].map((step) => (
 <div key={step} className="flex-1 flex items-center gap-3">
 <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
 wizardStep >= step ? 'bg-[#00ff88] text-black' : 'bg-white/5 text-white/20 border border-white/10'
 }`}>
 {step}
 </div>
 <div className={`flex-1 h-1 rounded-full transition-all ${
 wizardStep > step ? 'bg-[#00ff88]' : 'bg-white/5'
 }`} />
 </div>
 ))}
 </div>

 {/* Wizard Content */}
 <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
 {wizardStep === 1 && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-2xl mx-auto">
 <div className="space-y-4">
 <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Campaign Name</label>
 <input 
 type="text"
 value={newCampaign.name}
 onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-xl font-serif font-bold text-white focus:border-[#00ff88] transition-all outline-none"
 placeholder="e.g. SUMMER_SOLSTICE_2024"
 />
 </div>
 <div className="space-y-4">
 <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Description</label>
 <textarea 
 value={newCampaign.description}
 onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-sm font-mono text-white/60 focus:border-[#00ff88] transition-all outline-none h-32 resize-none"
 placeholder="Describe the campaign objectives..."
 />
 </div>
 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-4">
 <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Start Date</label>
 <input 
 type="date"
 value={newCampaign.startDate}
 onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-xs font-mono text-white focus:border-[#00ff88] transition-all outline-none"
 />
 </div>
 <div className="space-y-4">
 <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">End Date</label>
 <input 
 type="date"
 value={newCampaign.endDate}
 onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-xs font-mono text-white focus:border-[#00ff88] transition-all outline-none"
 />
 </div>
 </div>
 </motion.div>
 )}

 {wizardStep === 2 && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
 {BTS_PRODUCTS.map((product) => (
 <button 
 key={product.id}
 onClick={() => {
 const current = newCampaign.productIds || [];
 const next = current.includes(product.id) 
 ? current.filter(id => id !== product.id)
 : [...current, product.id];
 setNewCampaign({...newCampaign, productIds: next});
 }}
 className={`p-6 rounded-3xl border transition-all text-left space-y-4 ${
 newCampaign.productIds?.includes(product.id) 
 ? 'bg-[#00ff88]/10 border-[#00ff88] ring-1 ring-[#00ff88]' 
 : 'bg-white/5 border-white/10 hover:border-white/20'
 }`}
 >
 <div className="aspect-square rounded-xl overflow-hidden bg-black">
 <img src={product.img} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 <div>
 <p className="text-[10px] font-bold text-white uppercase truncate">{product.name}</p>
 <p className="text-[8px] font-mono text-white/30 uppercase">{product.category}</p>
 </div>
 </button>
 ))}
 </div>
 </motion.div>
 )}

 {wizardStep === 3 && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-2xl mx-auto">
 <div className="grid grid-cols-2 gap-4">
 {['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Email', 'WhatsApp', 'Pinterest'].map((channel) => (
 <button 
 key={channel}
 onClick={() => {
 const current = newCampaign.channels || [];
 const next = current.includes(channel) 
 ? current.filter(c => c !== channel)
 : [...current, channel];
 setNewCampaign({...newCampaign, channels: next});
 }}
 className={`p-6 rounded-xl border transition-all flex items-center justify-between ${
 newCampaign.channels?.includes(channel) 
 ? 'bg-[#00ff88]/10 border-[#00ff88] text-[#00ff88]' 
 : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
 }`}
 >
 <span className="text-xs font-bold uppercase tracking-widest">{channel}</span>
 {newCampaign.channels?.includes(channel) && <Check size={16} />}
 </button>
 ))}
 </div>
 </motion.div>
 )}

 {wizardStep === 4 && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
 {MOCK_ASSETS.map((asset) => (
 <button 
 key={asset.id}
 onClick={() => {
 const current = newCampaign.linkedAssetIds || [];
 const next = current.includes(asset.id) 
 ? current.filter(id => id !== asset.id)
 : [...current, asset.id];
 setNewCampaign({...newCampaign, linkedAssetIds: next});
 }}
 className={`p-4 rounded-3xl border transition-all text-left space-y-4 ${
 newCampaign.linkedAssetIds?.includes(asset.id) 
 ? 'bg-[#00ff88]/10 border-[#00ff88] ring-1 ring-[#00ff88]' 
 : 'bg-white/5 border-white/10 hover:border-white/20'
 }`}
 >
 <div className="aspect-video rounded-xl overflow-hidden bg-black relative">
 <img src={asset.img} alt={asset.name} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
 <div className="absolute top-2 right-2">
 <span className="text-[8px] font-mono bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-white/60 uppercase">{asset.type}</span>
 </div>
 </div>
 <div>
 <p className="text-[10px] font-bold text-white uppercase truncate">{asset.name}</p>
 <p className="text-[8px] font-mono text-white/30 uppercase">{asset.id}</p>
 </div>
 </button>
 ))}
 </div>
 </motion.div>
 )}

 {wizardStep === 5 && (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-3xl mx-auto">
 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-8">
 <div className="space-y-2">
 <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Campaign Identity</p>
 <h4 className="text-3xl font-serif font-bold text-white uppercase tracking-tighter">{newCampaign.name || 'Untitled Campaign'}</h4>
 <p className="text-sm font-mono text-white/40">{newCampaign.description || 'No description provided.'}</p>
 </div>
 <div className="grid grid-cols-2 gap-6">
 <div className="p-4 bg-white/2 border border-white/5 rounded-xl">
 <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">Start</p>
 <p className="text-xs font-bold text-white uppercase">{newCampaign.startDate || 'Not set'}</p>
 </div>
 <div className="p-4 bg-white/2 border border-white/5 rounded-xl">
 <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">End</p>
 <p className="text-xs font-bold text-white uppercase">{newCampaign.endDate || 'Not set'}</p>
 </div>
 </div>
 </div>
 <div className="space-y-8">
 <div className="space-y-4">
 <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Target Channels</p>
 <div className="flex flex-wrap gap-2">
 {newCampaign.channels?.map(c => (
 <span key={c} className="px-3 py-1 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-lg text-[8px] font-mono text-[#00ff88] uppercase tracking-widest">{c}</span>
 ))}
 </div>
 </div>
 <div className="space-y-4">
 <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Linked Resources</p>
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-2">
 <Box size={16} className="text-white/40" />
 <span className="text-xs font-bold text-white">{newCampaign.productIds?.length || 0} Products</span>
 </div>
 <div className="flex items-center gap-2">
 <Image size={16} className="text-white/40" />
 <span className="text-xs font-bold text-white">{newCampaign.linkedAssetIds?.length || 0} Assets</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 )}
 </div>

 {/* Wizard Footer */}
 <div className="p-8 border-t border-white/5 bg-white/2 flex items-center justify-between">
 <button 
 onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
 disabled={wizardStep === 1}
 className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-20"
 >
 Previous Step
 </button>
 <div className="flex items-center gap-4">
 <button 
 onClick={() => setIsWizardOpen(false)}
 className="px-8 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-all"
 >
 Cancel
 </button>
 {wizardStep < 5 ? (
 <button 
 onClick={() => setWizardStep(prev => Math.min(5, prev + 1))}
 className="px-12 py-4 bg-[#00ff88] text-black font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#00cc6e] transition-all"
 >
 Next Step
 </button>
 ) : (
 <button 
 onClick={() => {
 setSystemLogs(prev => [{ id: Date.now().toString(), text: `CAMPAIGN_CREATED: ${newCampaign.name}`, time: new Date().toLocaleTimeString() }, ...prev]);
 setIsWizardOpen(false);
 }}
 className="px-12 py-4 bg-[#00ff88] text-black font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#00cc6e] transition-all"
 >
 Launch Campaign
 </button>
 )}
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 )}

 {activeMarketingSubModule === 'Calendar' && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
 <header className="flex items-center justify-between">
 <div>
 <h1 className="text-4xl font-serif font-bold tracking-tighter text-white uppercase mb-2">Calendar</h1>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Temporal Planning & Publishing Schedule</p>
 </div>
 <div className="flex items-center gap-6">
 <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
 {['Week', 'Month'].map((view) => (
 <button
 key={view}
 onClick={() => setCalendarView(view as 'Week' | 'Month')}
 className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
 calendarView === view ? 'bg-[#00ff88] text-black' : 'text-white/40 hover:text-white'
 }`}
 >
 {view}
 </button>
 ))}
 </div>
 <button className="px-8 py-4 bg-[#00ff88] text-black font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#00cc6e] transition-all flex items-center gap-2">
 <Plus size={16} /> Schedule Post
 </button>
 </div>
 </header>

 {calendarView === 'Month' ? (
 <div className="grid grid-cols-7 gap-4">
 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
 <div key={day} className="text-center text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">{day}</div>
 ))}
 {Array.from({ length: 35 }).map((_, i) => {
 const day = i - 2; // Offset for March 2026 (starts on Sunday, but let's just mock it)
 const dateStr = `2026-03-${String(day).padStart(2, '0')}`;
 const posts = scheduledPosts.filter(p => p.date === dateStr);
 
 return (
 <div key={i} className={`min-h-[140px] bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#00ff88]/20 transition-all relative group ${day < 1 || day > 31 ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
 <span className="text-[10px] font-mono text-white/20">{day > 0 && day <= 31 ? day : ''}</span>
 <div className="mt-2 space-y-2">
 {posts.map(post => {
 const camp = MOCK_CAMPAIGNS.find(c => c.id === post.campaignId);
 return (
 <div key={post.id} className="p-2 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-lg group/post cursor-pointer hover:bg-[#00ff88]/20 transition-all">
 <div className="flex items-center justify-between mb-1">
 <span className="text-[8px] font-bold text-[#00ff88] uppercase truncate">{post.channel}</span>
 <span className="text-[8px] font-mono text-white/40">{post.time}</span>
 </div>
 <p className="text-[10px] font-bold text-white uppercase truncate">{post.title}</p>
 {camp && (
 <p className="text-[8px] font-mono text-white/30 uppercase truncate mt-1 flex items-center gap-1">
 <Megaphone size={8} /> {camp.name}
 </p>
 )}
 {post.workflowNode && (
 <p className="text-[8px] font-mono text-purple-400 uppercase truncate mt-1 flex items-center gap-1">
 <Activity size={8} /> {post.workflowNode}
 </p>
 )}
 </div>
 );
 })}
 </div>
 {day > 0 && day <= 31 && (
 <button className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#00ff88] hover:text-black transition-all">
 <Plus size={14} />
 </button>
 )}
 </div>
 );
 })}
 </div>
 ) : (
 <div className="grid grid-cols-7 gap-6">
 {['Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27', 'Sat 28', 'Sun 29'].map((day, idx) => {
 const dateStr = `2026-03-${23 + idx}`;
 const posts = scheduledPosts.filter(p => p.date === dateStr);
 const isToday = dateStr === '2026-03-25';

 return (
 <div key={day} className="space-y-6">
 <div className="text-center space-y-2">
 <p className={`text-[10px] font-mono uppercase tracking-widest ${isToday ? 'text-[#00ff88]' : 'text-white/30'}`}>{day.split(' ')[0]}</p>
 <p className={`text-3xl font-serif font-bold ${isToday ? 'text-[#00ff88]' : 'text-white'}`}>{day.split(' ')[1]}</p>
 {isToday && <div className="w-1 h-1 bg-[#00ff88] rounded-full mx-auto" />}
 </div>
 
 <div className="space-y-4 min-h-[600px] bg-white/[0.02] border border-white/5 rounded-xl p-4">
 {posts.map(post => (
 <div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4 hover:border-[#00ff88]/50 transition-all group cursor-pointer">
 <div className="flex items-center justify-between">
 <span className={`text-[8px] font-mono uppercase tracking-widest px-2 py-1 rounded ${
 post.status === 'Published' ? 'bg-[#00ff88]/10 text-[#00ff88]' :
 post.status === 'Draft' ? 'bg-white/10 text-white/40' :
 'bg-blue-500/10 text-blue-400'
 }`}>
 {post.status}
 </span>
 <span className="text-[10px] font-mono text-white/40">{post.time}</span>
 </div>
 
 <div className="space-y-1">
 <p className="text-[8px] font-mono text-[#00ff88] uppercase tracking-widest">{post.channel}</p>
 <h4 className="text-sm font-bold text-white uppercase leading-tight">{post.title}</h4>
 {post.workflowNode && (
 <p className="text-[8px] font-mono text-purple-400 uppercase mt-2 flex items-center gap-1">
 <Activity size={10} /> {post.workflowNode}
 </p>
 )}
 </div>

 {post.assetId && (
 <div className="aspect-video rounded-lg overflow-hidden bg-black border border-white/5">
 <img src={`https://picsum.photos/seed/${post.id}/400/225`} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
 </div>
 )}

 <div className="flex items-center justify-between pt-4 border-t border-white/5">
 <div className="flex -space-x-2">
 {[1, 2].map(i => (
 <div key={i} className="w-6 h-6 rounded-full border-2 border-[#121212] bg-white/10 overflow-hidden">
 <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </div>
 ))}
 </div>
 <button className="text-white/20 hover:text-white transition-colors">
 <MoreVertical size={14} />
 </button>
 </div>
 </div>
 ))}
 <button className="w-full py-4 border border-dashed border-white/10 rounded-xl text-[10px] font-mono text-white/20 uppercase tracking-widest hover:border-[#00ff88]/20 hover:text-[#00ff88]/50 transition-all flex items-center justify-center gap-2">
 <Plus size={14} /> Add Slot
 </button>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </motion.div>
 )}


 {activeMarketingSubModule === 'Analytics' && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
 <header className="flex items-center justify-between">
 <div>
 <h1 className="text-4xl font-serif font-bold tracking-tighter text-white uppercase mb-2">Analytics</h1>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Performance Attribution & Growth Metrics</p>
 </div>
 <div className="flex gap-4">
 <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all">Export Report</button>
 <button className="px-6 py-3 bg-[#00ff88] text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#00cc6e] transition-all">Live View</button>
 </div>
 </header>

 {/* KPI Cards */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
 {[
 { label: 'Total Leads', value: '728', trend: '+12.5%', icon: Users, color: 'text-white' },
 { label: 'Quote Conversion', value: '31.2%', trend: '+4.2%', icon: FileText, color: 'text-[#00ff88]' },
 { label: 'Avg. CAC', value: '$42.50', trend: '-8.1%', icon: CreditCard, color: 'text-blue-400' },
 { label: 'ROAS', value: '4.1x', trend: '+0.5x', icon: BarChart3, color: 'text-purple-400' },
].map((kpi, i) => (
 <motion.div 
 key={i} 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.05 }}
 className="bg-[#111] border border-white/10 rounded-xl p-8 space-y-6 relative overflow-hidden group hover:border-[#00ff88]/20 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(0,255,136,0.15)] transition-all duration-300 shadow-xl"
 >
 <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-6">
 <div className={`p-3 rounded-xl bg-black border border-white/5 shadow-inner ${kpi.color}`}>
 <kpi.icon size={24} />
 </div>
 <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded-full border shadow-sm ${kpi.trend.startsWith('+') ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
 {kpi.trend}
 </span>
 </div>
 <div>
 <p className="text-4xl font-serif font-bold text-white tracking-tighter mb-1 group-hover:scale-105 group-hover:text-[#00ff88] transition-all origin-left duration-500">{kpi.value}</p>
 <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{kpi.label}</p>
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Trend Panel */}
 <motion.div 
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 className="lg:col-span-2 bg-[#111] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group shadow-2xl hover:border-[#00ff88]/20 transition-all duration-500"
 >
 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-12">
 <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Conversion Trend</h3>
 <div className="flex gap-8">
 <div className="flex items-center gap-3">
 <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88]" />
 <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Leads</span>
 </div>
 <div className="flex items-center gap-3">
 <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
 <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Quotes</span>
 </div>
 </div>
 </div>
 <div className="h-80 flex items-end gap-3 px-4">
 {Array.from({ length: 24 }).map((_, i) => (
 <div key={i} className="flex-1 flex flex-col gap-1.5 group/bar">
 <motion.div 
 initial={{ height: 0 }}
 animate={{ height: `${20 + Math.random() * 60}%` }}
 transition={{ delay: i * 0.02, type: 'spring', damping: 15 }}
 className="w-full bg-blue-400/20 rounded-t-sm group-hover/bar:bg-blue-400/40 transition-colors shadow-inner"
 />
 <motion.div 
 initial={{ height: 0 }}
 animate={{ height: `${10 + Math.random() * 40}%` }}
 transition={{ delay: i * 0.02 + 0.1, type: 'spring', damping: 15 }}
 className="w-full bg-[#00ff88]/40 rounded-t-sm group-hover/bar:bg-[#00ff88]/60 transition-colors shadow-inner"
 />
 </div>
 ))}
 </div>
 <div className="flex justify-between mt-10 px-4 text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">
 <span>01 Mar</span>
 <span>08 Mar</span>
 <span>15 Mar</span>
 <span>22 Mar</span>
 <span>Today</span>
 </div>
 </div>
 </motion.div>

 {/* Attribution Panel */}
 <motion.div 
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 className="bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-[#00ff88]/20 transition-all duration-500 shadow-2xl"
 >
 <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
 <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-8 relative z-10 group-hover:text-[#00ff88] transition-colors">Channel Attribution</h3>
 <div className="space-y-8 relative z-10">
 {[
 { name: 'Instagram Ads', value: 45, color: 'bg-blue-400' },
 { name: 'Google Search', value: 28, color: 'bg-red-400' },
 { name: 'Direct Traffic', value: 15, color: 'bg-[#00ff88]' },
 { name: 'Email Marketing', value: 12, color: 'bg-purple-400' },
].map((channel, i) => (
 <div key={channel.name} className="space-y-3 group/channel">
 <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
 <span className="text-white/40 group-hover/channel:text-white transition-colors">{channel.name}</span>
 <span className="text-white group-hover/channel:text-[#00ff88] transition-colors">{channel.value}%</span>
 </div>
 <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/5 shadow-inner">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${channel.value}%` }}
 transition={{ delay: 0.5 + (i * 0.1), type: 'spring', damping: 20 }}
 className={`h-full ${channel.color} shadow-[0_0_10px_currentColor]`}
 />
 </div>
 </div>
 ))}
 </div>
 <div className="mt-12 p-6 bg-black border border-white/10 rounded-xl space-y-4 shadow-inner relative overflow-hidden group/top-asset hover:border-[#00ff88]/20 transition-colors">
 <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 to-transparent opacity-0 group-hover/top-asset:opacity-100 transition-opacity" />
 <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60 relative z-10">Top Performing Asset</h4>
 <div className="flex items-center gap-4 relative z-10">
 <div className="w-12 h-12 rounded-lg bg-black overflow-hidden border border-white/10 shadow-md">
 <img src="https://picsum.photos/seed/slate1/100/100" alt="top asset" className="w-full h-full object-cover opacity-60 group-hover/top-asset:opacity-100 transition-opacity group-hover/top-asset:scale-110 duration-500" referrerPolicy="no-referrer" />
 </div>
 <div>
 <p className="text-xs font-bold text-white uppercase group-hover/top-asset:text-[#00ff88] transition-colors">Slate Grey Hero</p>
 <p className="text-[8px] font-mono text-[#00ff88] uppercase">128 Quotes Generated</p>
 </div>
 </div>
 </div>
 </motion.div>
 </div>

 {/* Campaign Performance Table */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:border-[#00ff88]/20 transition-all duration-500"
 >
 <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
 <h3 className="text-xs font-bold uppercase tracking-widest text-white">Campaign Performance</h3>
 <button 
 onClick={() => setActiveMarketingSubModule('Campaigns')}
 className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest hover:underline"
 >
 View All Campaigns
 </button>
 </div>
 <table className="w-full text-left">
 <thead>
 <tr className="bg-black/50">
 <th className="px-8 py-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">Campaign</th>
 <th className="px-8 py-4 text-[10px] font-mono text-white/30 uppercase tracking-widest text-center">Published</th>
 <th className="px-8 py-4 text-[10px] font-mono text-white/30 uppercase tracking-widest text-center">Leads</th>
 <th className="px-8 py-4 text-[10px] font-mono text-white/30 uppercase tracking-widest text-center">Quotes</th>
 <th className="px-8 py-4 text-[10px] font-mono text-white/30 uppercase tracking-widest text-center">Conv. Rate</th>
 <th className="px-8 py-4 text-[10px] font-mono text-white/30 uppercase tracking-widest text-center">Spend</th>
 <th className="px-8 py-4 text-[10px] font-mono text-white/30 uppercase tracking-widest text-right">ROAS</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {MOCK_CAMPAIGN_PERFORMANCE.map((campaign, i) => {
 const publishedCount = publishingJobs.filter(j => j.campaignId === campaign.id && j.status === 'Published').length;
 return (
 <motion.tr 
 key={campaign.id} 
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: i * 0.05 }}
 className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
 onClick={() => {
 setExpandedCampaignId(campaign.id);
 setActiveMarketingSubModule('Campaigns');
 }}
 >
 <td className="px-8 py-6">
 <div className="space-y-1">
 <p className="text-xs font-bold text-white uppercase group-hover:text-[#00ff88] transition-colors">{campaign.name}</p>
 <div className="flex items-center gap-2">
 <p className="text-[8px] font-mono text-white/30 uppercase">{campaign.id}</p>
 {campaign.workflowNode && (
 <p className="text-[8px] font-mono text-purple-400 uppercase flex items-center gap-1">
 <Activity size={8} /> {campaign.workflowNode}
 </p>
 )}
 </div>
 </div>
 </td>
 <td className="px-8 py-6 text-center">
 <span className="text-xs font-mono text-white/60 group-hover:text-[#00ff88] transition-colors">{publishedCount} Posts</span>
 </td>
 <td className="px-8 py-6 text-center text-xs font-mono text-white/60">{campaign.leads}</td>
 <td className="px-8 py-6 text-center text-xs font-mono text-white/60">{campaign.quotes}</td>
 <td className="px-8 py-6 text-center">
 <span className="text-xs font-mono text-[#00ff88]">{campaign.conversion}</span>
 </td>
 <td className="px-8 py-6 text-center text-xs font-mono text-white/60">{campaign.spend}</td>
 <td className="px-8 py-6 text-right">
 <span className="text-xs font-mono font-bold text-white group-hover:text-[#00ff88] transition-colors">{campaign.roas}</span>
 </td>
 </motion.tr>
 );
 })}
 </tbody>
 </table>
 </motion.div>
 </motion.div>
 )}

 </div>
 </div>
 </div>
 )}

 {/* Detail Panel (Slide-out) */}
 <AnimatePresence>
 {isDetailPanelOpen && (selectedNode || selectedEdge) && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setIsDetailPanelOpen(false)}
 className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60]"
 />
 <motion.div
 initial={{ x: '100%' }}
 animate={{ x: 0 }}
 exit={{ x: '100%' }}
 transition={{ type: 'spring', damping: 25, stiffness: 200 }}
 className="absolute top-0 right-0 h-full w-[450px] bg-[#0a0a0a] border-l border-white/10 z-[70] p-8 overflow-y-auto"
 >
 <div className="flex items-center justify-between mb-12">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center text-[#00ff88]">
 {selectedNode ? <Settings size={24} /> : <Share2 size={24} />}
 </div>
 <div>
 <h2 className="text-2xl font-serif font-bold tracking-tighter uppercase">
 {selectedNode ? 'Edit Node' : 'Edit Connection'}
 </h2>
 <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
 {selectedNode ? 'Configure Automation Triggers' : 'Define Workflow Logic'}
 </p>
 </div>
 </div>
 <button onClick={() => setIsDetailPanelOpen(false)} className="text-white/30 hover:text-white transition-colors">
 <X size={24} />
 </button>
 </div>

 <div className="space-y-10">
 {selectedNode && (
 <>
 <div className="space-y-4">
 <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Group</label>
 <div className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest">{selectedNode.data.category as string}</div>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Name</label>
 <input
 type="text"
 value={selectedNode.data.label as string}
 onChange={(e) => {
 const newLabel = e.target.value;
 setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: newLabel } } : n));
 }}
 className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold text-white focus:outline-none focus:border-[#00ff88]/50 transition-colors"
 />
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Purpose</label>
 <textarea
 value={selectedNode.data.purpose as string || ''}
 onChange={(e) => {
 const newPurpose = e.target.value;
 setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, purpose: newPurpose } } : n));
 }}
 className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/80 focus:outline-none focus:border-[#00ff88]/50 transition-colors resize-none"
 placeholder="Describe the purpose of this step..."
 />
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Workflow & Automation Logic</label>
 <textarea
 value={selectedNode.data.logic as string || ''}
 onChange={(e) => {
 const newLogic = e.target.value;
 setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, logic: newLogic } } : n));
 }}
 className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-mono text-white/80 focus:outline-none focus:border-[#00ff88]/50 transition-colors resize-none"
 placeholder="Define triggers, conditions, or actions..."
 />
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Mock Metadata</label>
 <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
 <div className="flex justify-between items-center">
 <span className="text-[10px] uppercase tracking-widest text-white/30">Status</span>
 <span className="text-[10px] font-mono text-[#00ff88]">Active</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-[10px] uppercase tracking-widest text-white/30">Connections</span>
 <span className="text-[10px] font-mono text-white/60">3 Active</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-[10px] uppercase tracking-widest text-white/30">Last Sync</span>
 <span className="text-[10px] font-mono text-white/60">Just now</span>
 </div>
 </div>
 </div>

 <button 
 onClick={deleteNode}
 className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
 >
 <Trash2 size={14} /> Delete Node
 </button>
 </>
 )}

 {selectedEdge && (
 <>
 <div className="space-y-4">
 <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Label</label>
 <input
 type="text"
 value={selectedEdge.label as string || ''}
 onChange={(e) => {
 const newLabel = e.target.value;
 setEdges(eds => eds.map(edge => edge.id === selectedEdge.id ? { ...edge, label: newLabel } : edge));
 }}
 className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-bold text-white focus:outline-none focus:border-[#00ff88]/50 transition-colors"
 placeholder="Connection Label (e.g., Triage)"
 />
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Workflow & Automation Logic</label>
 <textarea
 value={selectedEdge.data?.logic as string || ''}
 onChange={(e) => {
 const newLogic = e.target.value;
 setEdges(eds => eds.map(edge => edge.id === selectedEdge.id ? { ...edge, data: { ...edge.data, logic: newLogic } } : edge));
 }}
 className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-mono text-white/80 focus:outline-none focus:border-[#00ff88]/50 transition-colors resize-none"
 placeholder="Define triggers, conditions, or actions..."
 />
 </div>

 <button 
 onClick={deleteEdge}
 className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
 >
 <Trash2 size={14} /> Delete Connection
 </button>
 </>
 )}
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>

 {/* Master Prompt Modal */}
 <AnimatePresence>
 {isMasterPromptOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setIsMasterPromptOpen(false)}
 className="absolute inset-0 bg-black/80 backdrop-blur-md"
 />
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0.9, opacity: 0 }}
 className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl"
 >
 <div className="flex items-center justify-between mb-8">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
 <Terminal size={20} />
 </div>
 <h2 className="text-2xl font-serif font-bold tracking-tighter uppercase">Master Prompt Export</h2>
 </div>
 <button onClick={() => setIsMasterPromptOpen(false)} className="text-white/30 hover:text-white transition-colors">
 <ArrowLeft size={24} className="rotate-180" />
 </button>
 </div>

 <p className="text-xs text-white/40 uppercase tracking-widest mb-6 leading-relaxed">
 This utility parses the visual map state and generates a structured system prompt for backend LLM execution.
 </p>

 <div className="bg-black/40 border border-white/5 rounded-xl p-6 mb-8">
 <pre className="text-[10px] font-mono text-[#00ff88]/80 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
 {generateMasterPrompt()}
 </pre>
 </div>

 <div className="flex gap-4">
 <button 
 onClick={() => {
 navigator.clipboard.writeText(generateMasterPrompt());
 const toast = document.createElement('div');
 toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-purple-500 text-white font-bold rounded-full text-[10px] uppercase tracking-widest shadow-2xl';
 toast.innerText = 'Prompt Copied to Clipboard';
 document.body.appendChild(toast);
 setTimeout(() => toast.remove(), 3000);
 }}
 className="flex-1 py-4 bg-white text-black font-bold rounded-xl uppercase tracking-widest text-sm hover:bg-gray-200 transition-all"
 >
 Copy to Clipboard
 </button>
 <button 
 onClick={() => setIsMasterPromptOpen(false)}
 className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
 >
 Close
 </button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 {/* Asset Detail Overlay */}
 <AnimatePresence>
 {selectedAsset && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm"
 onClick={() => setSelectedAsset(null)}
 >
 <motion.div 
 initial={{ scale: 0.9, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.9, opacity: 0, y: 20 }}
 className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl"
 onClick={(e) => e.stopPropagation()}
 >
 {/* Visual Preview */}
 <div className="lg:w-1/2 bg-black flex items-center justify-center relative group overflow-hidden">
 <img src={selectedAsset.img} alt={selectedAsset.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
 <div className="absolute top-8 left-8 flex gap-4">
 <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-2">
 {selectedAsset.type === '3D Asset' || selectedAsset.type === 'Model' ? <Box size={14} /> : selectedAsset.type === 'Video' ? <Video size={14} /> : <Image size={14} />}
 {selectedAsset.type}
 </div>
 <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-mono text-white/60 uppercase tracking-widest">
 {selectedAsset.size}
 </div>
 </div>
 <div className="absolute bottom-8 right-8 flex gap-4">
 {selectedAsset.protectionLevel === 'Protected Original' ? (
 <div className="flex items-center gap-4 bg-black/80 backdrop-blur-md border border-red-500/30 p-2 rounded-xl pr-6 shadow-2xl">
 <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
 <Lock size={20} />
 </div>
 <div>
 <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Internal Original</p>
 <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Direct download restricted</p>
 </div>
 </div>
 ) : (
 <button className="px-8 py-4 bg-white text-black rounded-xl hover:bg-gray-200 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
 <Download size={16} /> Download {selectedAsset.protectionLevel === 'Publishable Variant' ? 'for Publishing' : 'Variant'}
 </button>
 )}
 <button onClick={() => setIsGeneratingVariant(true)} className="px-8 py-4 bg-[#00ff88] text-black rounded-xl hover:bg-[#00cc6e] transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
 <Wand2 size={16} /> Generate Variant
 </button>
 </div>
 </div>

 {/* Metadata & Controls */}
 <div className="lg:w-1/2 p-8 overflow-y-auto custom-scrollbar space-y-8">
 <header className="flex items-start justify-between">
 <div>
 <div className="flex items-center gap-3 mb-4">
 <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-2 ${selectedAsset.protectionLevel === 'Protected Original' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : selectedAsset.protectionLevel === 'Publishable Variant' ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
 {selectedAsset.protectionLevel === 'Protected Original' ? <Lock size={12} /> : selectedAsset.protectionLevel === 'Publishable Variant' ? <Share size={12} /> : <Layers size={12} />}
 {selectedAsset.protectionLevel}
 </span>
 <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{selectedAsset.id}</span>
 </div>
 <h2 className="text-4xl font-serif font-bold text-white uppercase tracking-tighter leading-none mb-4">{selectedAsset.name}</h2>
 <div className="flex flex-wrap gap-2">
 {selectedAsset.usage.map(u => (
 <span key={u} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono text-white/60 uppercase tracking-widest">{u}</span>
 ))}
 </div>
 </div>
 <button onClick={() => setSelectedAsset(null)} className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
 <X size={24} />
 </button>
 </header>

 <div className="grid grid-cols-2 gap-8">
 <div className="space-y-4">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">System Linkage</h3>
 <div className="space-y-3">
 {selectedAsset.workflowNode && (
 <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-between group hover:border-purple-500/40 transition-all cursor-default">
 <div className="flex items-center gap-3">
 <Activity size={16} className="text-purple-400" />
 <div className="flex flex-col">
 <span className="text-[10px] font-bold text-white uppercase">Workflow Node</span>
 <span className="text-[8px] font-mono text-purple-400">{selectedAsset.workflowNode}</span>
 </div>
 </div>
 </div>
 )}
 <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-[#00ff88]/20 transition-all cursor-pointer">
 <div className="flex items-center gap-3">
 <ShoppingBag size={16} className="text-amber-400" />
 <div className="flex flex-col">
 <span className="text-[10px] font-bold text-white uppercase">Linked Products</span>
 <span className="text-[8px] font-mono text-white/30">{selectedAsset.linkedProductIds?.length || (selectedAsset.productId ? 1 : 0)} Products Connected</span>
 </div>
 </div>
 <ArrowUpRight size={14} className="text-white/20 group-hover:text-[#00ff88]" />
 </div>
 <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between group hover:border-pink-500/30 transition-all cursor-pointer">
 <div className="flex items-center gap-3">
 <Megaphone size={16} className="text-pink-400" />
 <div className="flex flex-col">
 <span className="text-[10px] font-bold text-white uppercase">Linked Campaigns</span>
 <span className="text-[8px] font-mono text-white/30">{selectedAsset.linkedCampaignIds?.length || (selectedAsset.campaignId ? 1 : 0)} Campaigns Connected</span>
 </div>
 </div>
 <ArrowUpRight size={14} className="text-white/20 group-hover:text-pink-400" />
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">Status & Readiness</h3>
 <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-full ${
 selectedAsset.status === 'Approved' ? 'bg-[#00ff88]/10 text-[#00ff88]' :
 selectedAsset.status === 'Review' ? 'bg-orange-500/10 text-orange-400' :
 'bg-white/5 text-white/20'
 }`}>
 {selectedAsset.status === 'Approved' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
 </div>
 <span className="text-sm font-bold text-white uppercase tracking-tighter">{selectedAsset.status}</span>
 </div>
 {selectedAsset.is3DReady && (
 <div className="px-3 py-1 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] rounded text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
 <Box size={12} /> 3D Ready
 </div>
 )}
 </div>
 
 {selectedAsset.completeness !== undefined && (
 <div className="space-y-2">
 <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
 <span className="text-white/40">Asset Completeness</span>
 <span className={selectedAsset.completeness === 100 ? 'text-[#00ff88]' : 'text-amber-400'}>{selectedAsset.completeness}%</span>
 </div>
 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
 <div 
 className={`h-full rounded-full ${selectedAsset.completeness === 100 ? 'bg-[#00ff88]' : 'bg-amber-400'}`} 
 style={{ width: `${selectedAsset.completeness}%` }} 
 />
 </div>
 </div>
 )}
 </div>
 </div>
 </div>

 {selectedAsset.pipeline && (
 <div className="space-y-6">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">3D Asset Pipeline</h3>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {[
 { label: 'Source Uploaded', status: selectedAsset.pipeline.sourceUploaded },
 { label: 'Texture Ready', status: selectedAsset.pipeline.textureReady },
 { label: 'Preview Attached', status: selectedAsset.pipeline.previewAttached },
 { label: 'Model Reference', status: selectedAsset.pipeline.modelReferenceAttached },
].map((step) => (
 <div key={step.label} className={`p-4 rounded-xl border ${step.status ? 'bg-[#00ff88]/5 border-[#00ff88]/20 text-[#00ff88]' : 'bg-white/5 border-white/10 text-white/20'}`}>
 <div className="flex items-center justify-between mb-2">
 {step.status ? <Check size={12} /> : <Clock size={12} />}
 </div>
 <p className="text-[8px] font-mono uppercase tracking-widest leading-tight">{step.label}</p>
 </div>
 ))}
 </div>
 <div className="p-6 bg-black/40 border border-white/5 rounded-3xl flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
 <Activity size={20} className={selectedAsset.pipeline.conversionStatus === 'Processing' ? 'text-[#00ff88] animate-spin' : 'text-white/20'} />
 </div>
 <div>
 <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Conversion Status</p>
 <p className="text-sm font-bold text-white uppercase">{selectedAsset.pipeline.conversionStatus}</p>
 </div>
 </div>
 <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">
 Re-Process
 </button>
 </div>
 </div>
 )}

 <div className="space-y-4">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">Usage Tags</h3>
 <div className="flex flex-wrap gap-2">
 {selectedAsset.tags.map(tag => (
 <span key={tag} className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-[10px] font-mono text-white/60 uppercase tracking-widest hover:border-[#00ff88]/20 transition-all cursor-default">
 #{tag}
 </span>
 ))}
 <button className="px-4 py-2 bg-white/5 border border-white/10 border-dashed rounded-xl text-[10px] font-mono text-white/20 uppercase tracking-widest hover:text-white transition-all">
 + Add Tag
 </button>
 </div>
 </div>

 <div className="pt-12 border-t border-white/5 flex items-center justify-between">
 <div className="flex gap-4">
 <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">
 Archive Asset
 </button>
 <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">
 Duplicate
 </button>
 </div>
 <button className="px-12 py-4 bg-[#00ff88] text-black font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#00cc6e] transition-all">
 Update Metadata
 </button>
 </div>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Generate Variant Modal */}
 <AnimatePresence>
 {isGeneratingVariant && selectedAsset && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md"
 onClick={() => setIsGeneratingVariant(false)}
 >
 <motion.div 
 initial={{ scale: 0.9, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.9, opacity: 0, y: 20 }}
 className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
 onClick={(e) => e.stopPropagation()}
 >
 <header className="p-8 border-b border-white/5 flex items-center justify-between">
 <div>
 <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-tighter leading-none mb-2">Generate Variant</h2>
 <div className="flex items-center gap-3">
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Source: {selectedAsset.name}</p>
 <span className="text-[10px] text-white/20">•</span>
 <p className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest">Step {variantWizardStep} of 3</p>
 </div>
 </div>
 <button onClick={() => { setIsGeneratingVariant(false); setVariantWizardStep(1); }} className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
 <X size={24} />
 </button>
 </header>
 
 <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row gap-8">
 <div className="lg:w-1/2 space-y-8">
 {variantWizardStep === 1 && (
 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
 <div className="space-y-4">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">1. Background Processing</h3>
 <div 
 onClick={() => setVariantSettings(s => ({ ...s, transparentBg: !s.transparentBg }))}
 className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${variantSettings.transparentBg ? 'bg-[#00ff88]/5 border-[#00ff88]/30' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
 >
 <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${variantSettings.transparentBg ? 'border-[#00ff88]/50 bg-[#00ff88]/20 text-[#00ff88]' : 'border-white/20 text-transparent'}`}>
 <Check size={14} />
 </div>
 <div>
 <p className={`text-sm font-bold uppercase ${variantSettings.transparentBg ? 'text-[#00ff88]' : 'text-white'}`}>Transparent Background</p>
 <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">AI-powered background removal</p>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">2. Channel Size Preset</h3>
 <div className="grid grid-cols-2 gap-4">
 {[
 { id: 'Original', label: 'Original Size', desc: 'Keep source dimensions' },
 { id: '1080x1080', label: '1080x1080', desc: 'Instagram Square' },
 { id: '1080x1920', label: '1080x1920', desc: 'Story / Reel' },
 { id: '1200x630', label: '1200x630', desc: 'Web Hero / Social' }
].map(size => (
 <div 
 key={size.id} 
 onClick={() => setVariantSettings(s => ({ ...s, channelSize: size.id }))}
 className={`p-4 border rounded-xl cursor-pointer transition-all ${variantSettings.channelSize === size.id ? 'bg-[#00ff88]/5 border-[#00ff88]/30 text-[#00ff88]' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
 >
 <p className="text-xs font-bold uppercase tracking-widest mb-1">{size.label}</p>
 <p className="text-[9px] font-mono opacity-60 uppercase">{size.desc}</p>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 )}

 {variantWizardStep === 2 && (
 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
 <div className="space-y-4">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">3. Watermark Profile</h3>
 <div className="grid grid-cols-2 gap-4">
 {['None', 'Standard BTS', 'Confidential', 'Draft'].map(profile => (
 <div 
 key={profile} 
 onClick={() => setVariantSettings(s => ({ ...s, watermarkProfile: profile }))}
 className={`p-4 border rounded-xl cursor-pointer transition-all ${variantSettings.watermarkProfile === profile ? 'bg-[#00ff88]/5 border-[#00ff88]/30 text-[#00ff88]' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
 >
 <p className="text-xs font-bold uppercase tracking-widest text-center">{profile}</p>
 </div>
 ))}
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">4. Usage Purpose</h3>
 <div className="grid grid-cols-2 gap-4">
 {['Publishable Variant', 'Gallery', 'Campaign', 'Social'].map(usage => (
 <div 
 key={usage} 
 onClick={() => setVariantSettings(s => ({ ...s, usagePurpose: usage }))}
 className={`p-4 border rounded-xl cursor-pointer transition-all ${variantSettings.usagePurpose === usage ? 'bg-[#00ff88]/5 border-[#00ff88]/30 text-[#00ff88]' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
 >
 <p className="text-xs font-bold uppercase tracking-widest text-center">{usage}</p>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 )}

 {variantWizardStep === 3 && (
 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
 <div className="space-y-4">
 <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/30">Variant Summary</h3>
 <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
 <div className="flex items-center justify-between pb-4 border-b border-white/5">
 <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Source Asset</span>
 <span className="text-xs font-bold text-white uppercase">{selectedAsset.name}</span>
 </div>
 <div className="flex items-center justify-between pb-4 border-b border-white/5">
 <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Background</span>
 <span className="text-xs font-bold text-white uppercase">{variantSettings.transparentBg ? 'Transparent (AI Removed)' : 'Original'}</span>
 </div>
 <div className="flex items-center justify-between pb-4 border-b border-white/5">
 <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Dimensions</span>
 <span className="text-xs font-bold text-white uppercase">{variantSettings.channelSize}</span>
 </div>
 <div className="flex items-center justify-between pb-4 border-b border-white/5">
 <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Watermark</span>
 <span className="text-xs font-bold text-white uppercase">{variantSettings.watermarkProfile}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Usage Type</span>
 <span className="text-xs font-bold text-[#00ff88] uppercase">{variantSettings.usagePurpose}</span>
 </div>
 </div>
 </div>
 <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-4">
 <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
 <Layers size={16} />
 </div>
 <div>
 <p className="text-xs font-bold text-blue-400 uppercase mb-1">Non-Destructive Generation</p>
 <p className="text-[10px] font-mono text-white/60 leading-relaxed">This will create a new Managed Variant. The Protected Original will remain untouched and secured in the Asset Lab.</p>
 </div>
 </div>
 </motion.div>
 )}
 </div>

 <div className="lg:w-1/2 bg-black rounded-3xl border border-white/5 overflow-hidden relative flex items-center justify-center">
 <img 
 src={selectedAsset.img} 
 alt="Preview" 
 className={`w-full h-full object-contain transition-all duration-500 ${variantSettings.transparentBg ? 'opacity-90 mix-blend-screen' : 'opacity-50'}`} 
 referrerPolicy="no-referrer" 
 />
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
 <div className="text-center bg-black/60 backdrop-blur-md p-6 rounded-3xl border border-white/10">
 <Wand2 size={32} className="mx-auto mb-3 text-[#00ff88] opacity-80" />
 <p className="text-[10px] font-mono text-[#00ff88] uppercase tracking-widest">Live Preview</p>
 <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest mt-2">
 {variantSettings.channelSize} • {variantSettings.watermarkProfile}
 </p>
 </div>
 </div>
 {/* Mock Watermark Overlay */}
 {variantSettings.watermarkProfile !== 'None' && (
 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
 <div className="rotate-[-30deg] text-4xl font-bold text-white uppercase tracking-[0.5em] mix-blend-overlay">
 {variantSettings.watermarkProfile}
 </div>
 </div>
 )}
 </div>
 </div>

 <footer className="p-8 border-t border-white/5 flex justify-between items-center">
 <div className="flex gap-2">
 {[1, 2, 3].map(step => (
 <div key={step} className={`w-12 h-1.5 rounded-full transition-all ${variantWizardStep >= step ? 'bg-[#00ff88]' : 'bg-white/10'}`} />
 ))}
 </div>
 <div className="flex gap-4">
 {variantWizardStep > 1 && (
 <button onClick={() => setVariantWizardStep(s => s - 1)} className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">
 Back
 </button>
 )}
 {variantWizardStep < 3 ? (
 <button onClick={() => setVariantWizardStep(s => s + 1)} className="px-8 py-4 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all">
 Continue
 </button>
 ) : (
 <button onClick={() => { setIsGeneratingVariant(false); setVariantWizardStep(1); }} className="px-12 py-4 bg-[#00ff88] text-black font-bold rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#00cc6e] transition-all flex items-center gap-2">
 <Wand2 size={16} /> Generate & Save
 </button>
 )}
 </div>
 </footer>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </main>
 </div>
 );
}
