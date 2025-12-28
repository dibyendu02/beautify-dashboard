'use client';

import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Target,
  Zap,
  BarChart3,
  Users,
  Mail,
  MessageSquare,
  Gift,
  Percent,
  Calendar,
  Clock,
  TrendingUp,
  Eye,
  MousePointer,
  Share2,
  Star,
  DollarSign,
  Send,
  Pause,
  Play,
  Edit3,
  Copy,
  Trash2,
  Plus,
  Filter,
  Download,
  Instagram,
  Facebook,
  Twitter,
  Globe,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface Campaign {
  _id: string;
  name: string;
  type: 'promotion' | 'loyalty' | 'referral' | 'social' | 'email' | 'sms';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'scheduled';
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  targetAudience: string;
  description: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    cpa: number;
    roas: number;
  };
  channels: string[];
  createdAt: string;
  updatedAt: string;
}

interface Promotion {
  _id: string;
  name: string;
  type: 'discount' | 'bogo' | 'free_service' | 'package_deal';
  discountType: 'percentage' | 'fixed' | 'free';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  applicableServices: string[];
  customerSegments: string[];
  status: 'active' | 'inactive' | 'expired';
  code?: string;
}

interface SocialPost {
  _id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  content: string;
  image?: string;
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'published';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  publishedAt?: string;
}

const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function AdvancedMarketingManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [marketingStats, setMarketingStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'campaigns' | 'promotions' | 'social' | 'analytics'>('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    loadMarketingData();
  }, [dateRange]);

  const loadMarketingData = async () => {
    try {
      setIsLoading(true);
      
      // Mock API calls - replace with actual API
      const [campaignsRes, promotionsRes, socialRes, statsRes] = await Promise.allSettled([
        fetch(`/api/marketing/campaigns?period=${dateRange}`).then(r => r.json()).catch(() => generateMockCampaigns()),
        fetch('/api/marketing/promotions').then(r => r.json()).catch(() => generateMockPromotions()),
        fetch('/api/marketing/social').then(r => r.json()).catch(() => generateMockSocialPosts()),
        fetch(`/api/marketing/stats?period=${dateRange}`).then(r => r.json()).catch(() => generateMockStats()),
      ]);

      if (campaignsRes.status === 'fulfilled') setCampaigns(campaignsRes.value);
      if (promotionsRes.status === 'fulfilled') setPromotions(promotionsRes.value);
      if (socialRes.status === 'fulfilled') setSocialPosts(socialRes.value);
      if (statsRes.status === 'fulfilled') setMarketingStats(statsRes.value);

    } catch (error) {
      console.error('Error loading marketing data:', error);
      
      // Load mock data as fallback
      setCampaigns(generateMockCampaigns());
      setPromotions(generateMockPromotions());
      setSocialPosts(generateMockSocialPosts());
      setMarketingStats(generateMockStats());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockCampaigns = (): Campaign[] => [
    {
      _id: '1',
      name: 'Summer Beauty Special',
      type: 'promotion',
      status: 'active',
      startDate: '2024-09-01T00:00:00Z',
      endDate: '2024-09-30T23:59:59Z',
      budget: 2000,
      spent: 1245.50,
      targetAudience: 'All customers',
      description: '20% off on all facial treatments',
      metrics: {
        impressions: 15420,
        clicks: 892,
        conversions: 67,
        revenue: 5340.00,
        ctr: 5.8,
        cpa: 18.60,
        roas: 4.3,
      },
      channels: ['email', 'social', 'website'],
      createdAt: '2024-08-25T00:00:00Z',
      updatedAt: '2024-09-20T00:00:00Z',
    },
    {
      _id: '2',
      name: 'VIP Customer Appreciation',
      type: 'loyalty',
      status: 'completed',
      startDate: '2024-08-01T00:00:00Z',
      endDate: '2024-08-31T23:59:59Z',
      budget: 1500,
      spent: 1500,
      targetAudience: 'VIP customers',
      description: 'Exclusive perks and rewards for VIP members',
      metrics: {
        impressions: 8950,
        clicks: 654,
        conversions: 89,
        revenue: 8950.00,
        ctr: 7.3,
        cpa: 16.85,
        roas: 5.97,
      },
      channels: ['email', 'app'],
      createdAt: '2024-07-20T00:00:00Z',
      updatedAt: '2024-08-31T00:00:00Z',
    },
  ];

  const generateMockPromotions = (): Promotion[] => [
    {
      _id: '1',
      name: 'First Visit 30% Off',
      type: 'discount',
      discountType: 'percentage',
      discountValue: 30,
      minPurchase: 50,
      validFrom: '2024-09-01T00:00:00Z',
      validUntil: '2024-12-31T23:59:59Z',
      usageLimit: 100,
      usedCount: 34,
      applicableServices: ['all'],
      customerSegments: ['new'],
      status: 'active',
      code: 'FIRST30',
    },
    {
      _id: '2',
      name: 'Buy 2 Get 1 Free Manicures',
      type: 'bogo',
      discountType: 'free',
      discountValue: 1,
      validFrom: '2024-09-15T00:00:00Z',
      validUntil: '2024-10-15T23:59:59Z',
      usageLimit: 50,
      usedCount: 12,
      applicableServices: ['manicure'],
      customerSegments: ['all'],
      status: 'active',
      code: 'MANI3FOR2',
    },
  ];

  const generateMockSocialPosts = (): SocialPost[] => [
    {
      _id: '1',
      platform: 'instagram',
      content: 'Transform your look with our expert stylists! ✨ Book your appointment today.',
      scheduledFor: '2024-09-24T15:00:00Z',
      status: 'scheduled',
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
      },
    },
    {
      _id: '2',
      platform: 'facebook',
      content: 'Client showcase: Amazing hair transformation by our team!',
      status: 'published',
      engagement: {
        likes: 156,
        comments: 23,
        shares: 12,
        reach: 2450,
      },
      publishedAt: '2024-09-22T10:00:00Z',
    },
  ];

  const generateMockStats = () => ({
    totalCampaigns: 8,
    activeCampaigns: 3,
    totalSpent: 12450.00,
    totalRevenue: 45680.00,
    avgROAS: 3.67,
    campaignPerformance: [
      { month: 'Jun', campaigns: 2, revenue: 8500, spent: 2100 },
      { month: 'Jul', campaigns: 3, revenue: 12400, spent: 3200 },
      { month: 'Aug', campaigns: 4, revenue: 15600, spent: 3850 },
      { month: 'Sep', campaigns: 3, revenue: 9180, spent: 3300 },
    ],
    channelPerformance: [
      { channel: 'Email', revenue: 18500, spent: 4200, roas: 4.4 },
      { channel: 'Social Media', revenue: 15200, spent: 3800, roas: 4.0 },
      { channel: 'Website', revenue: 11980, spent: 4450, roas: 2.7 },
    ],
  });

  const pauseCampaign = async (campaignId: string) => {
    try {
      toast.loading('Pausing campaign...', { id: 'pause' });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCampaigns(prev => prev.map(c => 
        c._id === campaignId ? { ...c, status: 'paused' as const } : c
      ));
      
      toast.success('Campaign paused successfully', { id: 'pause' });
    } catch (error) {
      toast.error('Failed to pause campaign', { id: 'pause' });
    }
  };

  const resumeCampaign = async (campaignId: string) => {
    try {
      toast.loading('Resuming campaign...', { id: 'resume' });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCampaigns(prev => prev.map(c => 
        c._id === campaignId ? { ...c, status: 'active' as const } : c
      ));
      
      toast.success('Campaign resumed successfully', { id: 'resume' });
    } catch (error) {
      toast.error('Failed to resume campaign', { id: 'resume' });
    }
  };

  const publishSocialPost = async (postId: string) => {
    try {
      toast.loading('Publishing post...', { id: 'publish' });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSocialPosts(prev => prev.map(p => 
        p._id === postId 
          ? { ...p, status: 'published' as const, publishedAt: new Date().toISOString() }
          : p
      ));
      
      toast.success('Post published successfully', { id: 'publish' });
    } catch (error) {
      toast.error('Failed to publish post', { id: 'publish' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'scheduled': return 'text-purple-600 bg-purple-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'promotion': return <Percent className="w-4 h-4" />;
      case 'loyalty': return <Star className="w-4 h-4" />;
      case 'referral': return <Share2 className="w-4 h-4" />;
      case 'social': return <Instagram className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      default: return <Megaphone className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'twitter': return <Twitter className="w-5 h-5 text-blue-400" />;
      default: return <Globe className="w-5 h-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Management</h1>
          <p className="text-gray-600">Create and manage marketing campaigns and promotions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'campaigns', label: 'Campaigns', icon: Megaphone },
              { key: 'promotions', label: 'Promotions', icon: Gift },
              { key: 'social', label: 'Social Media', icon: Share2 },
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key as any)}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  currentView === key
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      {marketingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{marketingStats.activeCampaigns}</p>
                <p className="text-sm text-blue-600 mt-2">of {marketingStats.totalCampaigns} total</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Marketing Spend</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(marketingStats.totalSpent)}
                </p>
                <p className="text-sm text-orange-600 mt-2">This period</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Marketing Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(marketingStats.totalRevenue)}
                </p>
                <p className="text-sm text-green-600 mt-2">Generated</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Average ROAS</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{marketingStats.avgROAS}x</p>
                <p className="text-sm text-purple-600 mt-2">Return on ad spend</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentView === 'campaigns' && (
        <div className="space-y-6">
          {/* Campaigns */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Marketing Campaigns</h3>
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Campaign</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {campaigns.filter(c => filterStatus === 'all' || c.status === filterStatus).map((campaign) => (
                <div key={campaign._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary-100">
                        {getCampaignTypeIcon(campaign.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                        <p className="text-sm text-gray-500 capitalize">{campaign.type} Campaign</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                        getStatusColor(campaign.status)
                      )}>
                        {campaign.status}
                      </span>
                      {campaign.status === 'active' && (
                        <Button variant="ghost" size="sm" onClick={() => pauseCampaign(campaign._id)}>
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      {campaign.status === 'paused' && (
                        <Button variant="ghost" size="sm" onClick={() => resumeCampaign(campaign._id)}>
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ROAS</p>
                      <p className="font-semibold text-gray-900">{campaign.metrics.roas}x</p>
                      <p className="text-sm text-green-600">
                        {formatCurrency(campaign.metrics.revenue)} revenue
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Impressions</p>
                      <p className="font-semibold text-gray-900">{campaign.metrics.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Clicks</p>
                      <p className="font-semibold text-gray-900">{campaign.metrics.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Conversions</p>
                      <p className="font-semibold text-gray-900">{campaign.metrics.conversions}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      {campaign.channels.map((channel, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentView === 'promotions' && (
        <div className="space-y-6">
          {/* Promotions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Active Promotions</h3>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Promotion</span>
              </Button>
            </div>

            <div className="space-y-4">
              {promotions.map((promotion) => (
                <div key={promotion._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Gift className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{promotion.name}</h4>
                        <p className="text-sm text-gray-500">
                          {promotion.code && `Code: ${promotion.code} • `}
                          {promotion.type.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                      getStatusColor(promotion.status)
                    )}>
                      {promotion.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Discount</p>
                      <p className="font-semibold text-gray-900">
                        {promotion.discountType === 'percentage' 
                          ? `${promotion.discountValue}%`
                          : promotion.discountType === 'fixed'
                          ? formatCurrency(promotion.discountValue)
                          : `${promotion.discountValue} Free`
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Usage</p>
                      <p className="font-semibold text-gray-900">
                        {promotion.usedCount} / {promotion.usageLimit || '∞'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valid From</p>
                      <p className="font-semibold text-gray-900">{formatDate(promotion.validFrom)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valid Until</p>
                      <p className="font-semibold text-gray-900">{formatDate(promotion.validUntil)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        Applies to: {promotion.applicableServices.join(', ')}
                      </span>
                      <span className="text-sm text-gray-600">
                        Segments: {promotion.customerSegments.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentView === 'social' && (
        <div className="space-y-6">
          {/* Social Media */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Social Media Posts</h3>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </Button>
            </div>

            <div className="space-y-4">
              {socialPosts.map((post) => (
                <div key={post._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        {getPlatformIcon(post.platform)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">{post.platform}</p>
                        <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                        getStatusColor(post.status)
                      )}>
                        {post.status}
                      </span>
                      {post.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={() => publishSocialPost(post._id)}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Publish Now
                        </Button>
                      )}
                    </div>
                  </div>

                  {post.status === 'published' && (
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Likes</p>
                        <p className="text-lg font-semibold text-gray-900">{post.engagement.likes}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Comments</p>
                        <p className="text-lg font-semibold text-gray-900">{post.engagement.comments}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Shares</p>
                        <p className="text-lg font-semibold text-gray-900">{post.engagement.shares}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Reach</p>
                        <p className="text-lg font-semibold text-gray-900">{post.engagement.reach}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {post.scheduledFor && (
                      <span>Scheduled for {formatDate(post.scheduledFor)}</span>
                    )}
                    {post.publishedAt && (
                      <span>Published {formatDate(post.publishedAt)}</span>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentView === 'analytics' && marketingStats && (
        <div className="space-y-6">
          {/* Marketing Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={marketingStats.campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(Number(value)) : value,
                    name === 'revenue' ? 'Revenue' : name === 'spent' ? 'Spent' : 'Campaigns'
                  ]} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="spent"
                    stackId="2"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
              <div className="space-y-4">
                {marketingStats.channelPerformance.map((channel: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                      ></div>
                      <span className="font-medium text-gray-900">{channel.channel}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(channel.revenue)}</p>
                      <p className="text-sm text-gray-500">ROAS: {channel.roas}x</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}