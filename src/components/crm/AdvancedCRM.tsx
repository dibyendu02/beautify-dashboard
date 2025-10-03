'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Star,
  Gift,
  TrendingUp,
  Heart,
  Clock,
  DollarSign,
  Tag,
  Eye,
  Edit3,
  MoreHorizontal,
  Send,
  Download,
  FileText,
  Target,
  Zap,
  Award,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
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

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  joinedAt: string;
  lastVisit: string;
  totalBookings: number;
  totalSpent: number;
  averageRating: number;
  status: 'active' | 'inactive' | 'vip' | 'new';
  preferences: {
    services: string[];
    communication: 'email' | 'sms' | 'both';
    notifications: boolean;
  };
  loyalty: {
    points: number;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    joinedAt: string;
  };
  tags: string[];
  notes: string;
  upcomingBookings: number;
  lastBookingDate?: string;
  birthDate?: string;
  acquisitionSource: string;
}

interface CustomerSegment {
  name: string;
  count: number;
  criteria: string;
  color: string;
  value?: number;
}

interface CampaignTemplate {
  _id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  subject: string;
  content: string;
  targetSegment: string;
  status: 'draft' | 'active' | 'completed';
  openRate?: number;
  clickRate?: number;
  sentCount?: number;
}

const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function AdvancedCRM() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [currentView, setCurrentView] = useState<'customers' | 'segments' | 'campaigns'>('customers');
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  useEffect(() => {
    loadCRMData();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchQuery, statusFilter, tierFilter]);

  const loadCRMData = async () => {
    try {
      setIsLoading(true);
      
      // Mock API calls - replace with actual API
      const [customersRes, segmentsRes, campaignsRes] = await Promise.allSettled([
        fetch('/api/crm/customers').then(r => r.json()).catch(() => generateMockCustomers()),
        fetch('/api/crm/segments').then(r => r.json()).catch(() => generateMockSegments()),
        fetch('/api/crm/campaigns').then(r => r.json()).catch(() => generateMockCampaigns()),
      ]);

      if (customersRes.status === 'fulfilled') setCustomers(customersRes.value);
      if (segmentsRes.status === 'fulfilled') setCustomerSegments(segmentsRes.value);
      if (campaignsRes.status === 'fulfilled') setCampaigns(campaignsRes.value);

    } catch (error) {
      console.error('Error loading CRM data:', error);
      
      // Load mock data as fallback
      setCustomers(generateMockCustomers());
      setCustomerSegments(generateMockSegments());
      setCampaigns(generateMockCampaigns());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockCustomers = (): Customer[] => [
    {
      _id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      phone: '+1234567890',
      joinedAt: '2024-01-15T00:00:00Z',
      lastVisit: '2024-09-20T00:00:00Z',
      totalBookings: 12,
      totalSpent: 1440.00,
      averageRating: 4.8,
      status: 'vip',
      preferences: {
        services: ['Hair Styling', 'Facial'],
        communication: 'email',
        notifications: true,
      },
      loyalty: {
        points: 2880,
        tier: 'gold',
        joinedAt: '2024-01-15T00:00:00Z',
      },
      tags: ['High Value', 'Regular'],
      notes: 'Prefers morning appointments. Very loyal customer.',
      upcomingBookings: 1,
      lastBookingDate: '2024-09-20T00:00:00Z',
      birthDate: '1988-05-15T00:00:00Z',
      acquisitionSource: 'Instagram',
    },
    {
      _id: '2',
      firstName: 'Emma',
      lastName: 'Wilson',
      email: 'emma@example.com',
      phone: '+1234567891',
      joinedAt: '2024-08-10T00:00:00Z',
      lastVisit: '2024-09-18T00:00:00Z',
      totalBookings: 3,
      totalSpent: 285.00,
      averageRating: 5.0,
      status: 'active',
      preferences: {
        services: ['Massage', 'Manicure'],
        communication: 'both',
        notifications: true,
      },
      loyalty: {
        points: 570,
        tier: 'bronze',
        joinedAt: '2024-08-10T00:00:00Z',
      },
      tags: ['New Customer'],
      notes: 'Interested in package deals.',
      upcomingBookings: 0,
      lastBookingDate: '2024-09-18T00:00:00Z',
      acquisitionSource: 'Google Ads',
    },
  ];

  const generateMockSegments = (): CustomerSegment[] => [
    { name: 'VIP Customers', count: 45, criteria: 'Total spent > $1000', color: '#8b5cf6', value: 45 },
    { name: 'Regular Customers', count: 120, criteria: 'Bookings > 5', color: '#06b6d4', value: 120 },
    { name: 'New Customers', count: 38, criteria: 'Joined last 30 days', color: '#10b981', value: 38 },
    { name: 'At Risk', count: 22, criteria: 'No booking in 60 days', color: '#f59e0b', value: 22 },
    { name: 'Inactive', count: 15, criteria: 'No booking in 120 days', color: '#ef4444', value: 15 },
  ];

  const generateMockCampaigns = (): CampaignTemplate[] => [
    {
      _id: '1',
      name: 'VIP Exclusive Offer',
      type: 'email',
      subject: 'Exclusive 20% Off for Our VIP Members',
      content: 'Limited time offer for our most valued customers...',
      targetSegment: 'VIP Customers',
      status: 'active',
      openRate: 68.5,
      clickRate: 24.3,
      sentCount: 45,
    },
    {
      _id: '2',
      name: 'Win Back Campaign',
      type: 'email',
      subject: 'We Miss You! Come Back for 30% Off',
      content: 'Its been a while since your last visit...',
      targetSegment: 'At Risk',
      status: 'completed',
      openRate: 42.1,
      clickRate: 18.7,
      sentCount: 22,
    },
  ];

  const filterCustomers = () => {
    let filtered = [...customers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.firstName.toLowerCase().includes(query) ||
        customer.lastName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    if (tierFilter !== 'all') {
      filtered = filtered.filter(customer => customer.loyalty.tier === tierFilter);
    }

    setFilteredCustomers(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vip': return 'text-purple-600 bg-purple-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'new': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return <Award className="w-4 h-4 text-gray-800" />;
      case 'gold': return <Award className="w-4 h-4 text-yellow-600" />;
      case 'silver': return <Award className="w-4 h-4 text-gray-500" />;
      default: return <Award className="w-4 h-4 text-amber-600" />;
    }
  };

  const sendCampaign = async (campaignId: string) => {
    try {
      toast.loading('Sending campaign...', { id: 'campaign' });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCampaigns(prev => prev.map(c => 
        c._id === campaignId 
          ? { ...c, status: 'active' as const, sentCount: 45 }
          : c
      ));
      
      toast.success('Campaign sent successfully', { id: 'campaign' });
    } catch (error) {
      toast.error('Failed to send campaign', { id: 'campaign' });
    }
  };

  const exportCustomers = async (format: 'csv' | 'excel') => {
    try {
      toast.loading('Exporting customer data...', { id: 'export' });
      
      // Mock export
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Customer data exported as ${format.toUpperCase()}`, { id: 'export' });
    } catch (error) {
      toast.error('Failed to export data', { id: 'export' });
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
          <h1 className="text-2xl font-bold text-gray-900">Customer Relationship Management</h1>
          <p className="text-gray-600">Manage customers, segments, and campaigns</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'customers', label: 'Customers', icon: Users },
              { key: 'segments', label: 'Segments', icon: Target },
              { key: 'campaigns', label: 'Campaigns', icon: Send },
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
          <Button
            onClick={() => exportCustomers('excel')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</p>
              <p className="text-sm text-green-600 mt-2">+12% this month</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">VIP Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {customers.filter(c => c.status === 'vip').length}
              </p>
              <p className="text-sm text-purple-600 mt-2">Top tier customers</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Avg. Customer Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length || 0)}
              </p>
              <p className="text-sm text-green-600 mt-2">Lifetime value</p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Retention Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">87%</p>
              <p className="text-sm text-green-600 mt-2">Customer retention</p>
            </div>
            <div className="p-3 rounded-full bg-orange-500">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'customers' && (
        <div className="space-y-6">
          {/* Customer Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Database</h3>
              <Button className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Add Customer</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="vip">VIP</option>
                <option value="active">Active</option>
                <option value="new">New</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Tiers</option>
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Customer</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Tier</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Total Spent</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Bookings</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-900">Last Visit</th>
                    <th className="text-center py-3 px-6 text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-sm">
                              {customer.firstName[0]}{customer.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                          getStatusColor(customer.status)
                        )}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1">
                          {getTierIcon(customer.loyalty.tier)}
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {customer.loyalty.tier}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">{customer.totalBookings}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">
                          {formatDate(customer.lastVisit)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedCustomer(customer);
                            setShowCustomerDetails(true);
                          }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentView === 'segments' && (
        <div className="space-y-6">
          {/* Customer Segments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerSegments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {customerSegments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Details</h3>
              <div className="space-y-4">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: segment.color }}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900">{segment.name}</p>
                        <p className="text-sm text-gray-500">{segment.criteria}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{segment.count}</p>
                      <p className="text-sm text-gray-500">customers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'campaigns' && (
        <div className="space-y-6">
          {/* Campaign Management */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Marketing Campaigns</h3>
              <Button className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Create Campaign</span>
              </Button>
            </div>

            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        campaign.type === 'email' ? 'bg-blue-100' :
                        campaign.type === 'sms' ? 'bg-green-100' : 'bg-purple-100'
                      )}>
                        {campaign.type === 'email' ? (
                          <Mail className="w-5 h-5 text-blue-600" />
                        ) : campaign.type === 'sms' ? (
                          <MessageSquare className="w-5 h-5 text-green-600" />
                        ) : (
                          <Send className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                        <p className="text-sm text-gray-500">
                          {campaign.type.toUpperCase()} • {campaign.targetSegment}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        campaign.status === 'active' ? 'text-green-600 bg-green-100' :
                        campaign.status === 'completed' ? 'text-blue-600 bg-blue-100' :
                        'text-gray-600 bg-gray-100'
                      )}>
                        {campaign.status}
                      </span>
                      {campaign.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => sendCampaign(campaign._id)}
                        >
                          Send Campaign
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-medium text-gray-900 mb-1">{campaign.subject}</p>
                    <p className="text-sm text-gray-600">{campaign.content}</p>
                  </div>

                  {campaign.sentCount && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Sent</p>
                        <p className="text-lg font-semibold text-gray-900">{campaign.sentCount}</p>
                      </div>
                      {campaign.openRate && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Open Rate</p>
                          <p className="text-lg font-semibold text-gray-900">{campaign.openRate}%</p>
                        </div>
                      )}
                      {campaign.clickRate && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Click Rate</p>
                          <p className="text-lg font-semibold text-gray-900">{campaign.clickRate}%</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}