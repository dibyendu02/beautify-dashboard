'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Tag,
  Calendar,
  Percent,
  Eye,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Users,
  TrendingUp,
  AlertCircle,
  Loader2,
  Gift,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

interface Promotion {
  _id: string;
  code: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed' | 'bogo';
  value: number;
  minimumSpend?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
  applicableServices?: string[];
  createdAt: string;
}

const PROMOTION_TYPES = [
  { value: 'percentage', label: 'Percentage Off', icon: Percent },
  { value: 'fixed', label: 'Fixed Amount', icon: Tag },
  { value: 'bogo', label: 'Buy One Get One', icon: Gift },
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewPromotionModal, setShowNewPromotionModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // New promotion form state
  const [newPromotion, setNewPromotion] = useState({
    code: '',
    title: '',
    description: '',
    type: 'percentage' as const,
    value: 0,
    minimumSpend: 0,
    maxDiscount: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Since promotion endpoint might not exist, create mock data
      const mockPromotions: Promotion[] = [
        {
          _id: '1',
          code: 'WELCOME20',
          title: '20% Off First Visit',
          description: 'Get 20% discount on your first service booking',
          type: 'percentage',
          value: 20,
          minimumSpend: 50,
          maxDiscount: 100,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          isActive: true,
          usageLimit: 500,
          usedCount: 127,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          _id: '2',
          code: 'SUMMER25',
          title: 'Summer Special',
          description: '25% off all facial treatments during summer',
          type: 'percentage',
          value: 25,
          minimumSpend: 80,
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          isActive: false,
          usageLimit: 200,
          usedCount: 156,
          createdAt: '2024-05-15T00:00:00.000Z',
        },
        {
          _id: '3',
          code: 'SAVE50',
          title: '$50 Off Premium Services',
          description: 'Save $50 on premium spa packages',
          type: 'fixed',
          value: 50,
          minimumSpend: 200,
          startDate: '2024-09-01',
          endDate: '2024-12-31',
          isActive: true,
          usageLimit: 100,
          usedCount: 23,
          createdAt: '2024-08-20T00:00:00.000Z',
        },
      ];
      
      setPromotions(mockPromotions);
    } catch (err: any) {
      console.error('Error fetching promotions:', err);
      setError('Failed to load promotions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePromotion = async () => {
    try {
      if (!newPromotion.code || !newPromotion.title) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Generate random ID for demo
      const newPromo: Promotion = {
        ...newPromotion,
        _id: Date.now().toString(),
        isActive: true,
        usedCount: 0,
        createdAt: new Date().toISOString(),
      };

      setPromotions(prev => [newPromo, ...prev]);
      setShowNewPromotionModal(false);
      setNewPromotion({
        code: '',
        title: '',
        description: '',
        type: 'percentage',
        value: 0,
        minimumSpend: 0,
        maxDiscount: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 100,
      });
      toast.success('Promotion created successfully');
    } catch (err: any) {
      console.error('Error creating promotion:', err);
      toast.error('Failed to create promotion');
    }
  };

  const togglePromotionStatus = (promotionId: string) => {
    setPromotions(prev => 
      prev.map(promo => 
        promo._id === promotionId 
          ? { ...promo, isActive: !promo.isActive }
          : promo
      )
    );
    toast.success('Promotion status updated');
  };

  const duplicatePromotion = (promotion: Promotion) => {
    const duplicated: Promotion = {
      ...promotion,
      _id: Date.now().toString(),
      code: `${promotion.code}_COPY`,
      title: `${promotion.title} (Copy)`,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    
    setPromotions(prev => [duplicated, ...prev]);
    toast.success('Promotion duplicated successfully');
  };

  const deletePromotion = (promotionId: string) => {
    setPromotions(prev => prev.filter(promo => promo._id !== promotionId));
    toast.success('Promotion deleted successfully');
  };

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || promotion.type === selectedType;
    const matchesStatus = !selectedStatus || 
                         (selectedStatus === 'active' && promotion.isActive) ||
                         (selectedStatus === 'inactive' && !promotion.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getPromotionValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}% Off`;
      case 'fixed':
        return `${formatCurrency(promotion.value)} Off`;
      case 'bogo':
        return 'Buy 1 Get 1';
      default:
        return promotion.value;
    }
  };

  const getUsagePercentage = (promotion: Promotion) => {
    if (!promotion.usageLimit) return 0;
    return Math.min((promotion.usedCount / promotion.usageLimit) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
            <p className="text-gray-600 mt-1">Create and manage discount codes and special offers</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading promotions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-600 mt-1">Create and manage discount codes and special offers</p>
        </div>
        <Button
          onClick={() => setShowNewPromotionModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Promotion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Promotions</p>
              <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
            </div>
            <Tag className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Promotions</p>
              <p className="text-2xl font-bold text-green-600">
                {promotions.filter(p => p.isActive).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Uses</p>
              <p className="text-2xl font-bold text-blue-600">
                {promotions.reduce((sum, p) => sum + p.usedCount, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Usage Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(promotions.reduce((sum, p) => sum + getUsagePercentage(p), 0) / promotions.length || 0)}%
              </p>
            </div>
            <Percent className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search promotions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Types</option>
            {PROMOTION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Promotions List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredPromotions.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No promotions found</h3>
            <p className="text-gray-600 mb-6">Create your first promotion to attract more customers</p>
            <Button
              onClick={() => setShowNewPromotionModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Promotion
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPromotions.map((promotion) => (
                  <tr key={promotion._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{promotion.title}</div>
                        <div className="text-sm text-gray-500">{promotion.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {promotion.code}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {getPromotionValue(promotion)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {promotion.usedCount} / {promotion.usageLimit || '∞'}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-primary-600 h-1.5 rounded-full"
                          style={{ width: `${getUsagePercentage(promotion)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(promotion.endDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          promotion.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        )}
                      >
                        {promotion.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveDropdown(activeDropdown === promotion._id ? null : promotion._id)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        {activeDropdown === promotion._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="p-1">
                              <button
                                onClick={() => {
                                  togglePromotionStatus(promotion._id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                              >
                                {promotion.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => {
                                  duplicatePromotion(promotion);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center"
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </button>
                              <button
                                onClick={() => {
                                  deletePromotion(promotion._id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Promotion Modal */}
      {showNewPromotionModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Promotion</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promotion Title *
                </label>
                <input
                  type="text"
                  value={newPromotion.title}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Summer Special Offer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code *
                </label>
                <input
                  type="text"
                  value={newPromotion.code}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                  placeholder="e.g., SUMMER25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newPromotion.description}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  placeholder="Describe the promotion..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newPromotion.type}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {PROMOTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newPromotion.type === 'percentage' ? 'Percentage' : 'Amount'}
                  </label>
                  <input
                    type="number"
                    value={newPromotion.value}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={newPromotion.usageLimit}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 100"
                  min="1"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowNewPromotionModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePromotion}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                Create Promotion
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}