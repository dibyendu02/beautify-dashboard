'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Pagination from '@/components/ui/Pagination';
import {
  Store,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  BarChart3,
  UserCheck,
  Eye,
  Settings,
  Mail,
  Plus,
  Download,
  UserX,
  Star,
  Building,
  Crown,
  Ban,
  Edit,
  Trash2,
  X,
  TrendingUp,
  Calendar,
  Users,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface MerchantData {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'suspended' | 'pending' | 'rejected';
  joinDate: string;
  totalRevenue: number;
  totalBookings: number;
  rating: number;
  verified: boolean;
  category: string;
  lastActivity: string;
}

// Modal interfaces
interface AddMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (merchant: Partial<MerchantData>) => void;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  title: string;
}

interface ViewMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantData | null;
}

interface EditMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantData | null;
  onSave: (merchant: MerchantData) => void;
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantData | null;
  onConfirm: () => void;
}

// Add Merchant Modal Component
const AddMerchantModal: React.FC<AddMerchantModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: Date.now().toString(),
      status: 'pending' as const,
      joinDate: new Date().toISOString().split('T')[0],
      totalRevenue: 0,
      totalBookings: 0,
      rating: 0,
      verified: false,
      lastActivity: new Date().toISOString().split('T')[0],
    });
    setFormData({
      businessName: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      category: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 ease-out">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Merchant</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
            <input
              type="text"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Hair Salon">Hair Salon</option>
              <option value="Spa">Spa</option>
              <option value="Barbershop">Barbershop</option>
              <option value="Nail Salon">Nail Salon</option>
              <option value="Medical Spa">Medical Spa</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Merchant
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Settings Modal Component
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-2xl transform transition-all duration-300 ease-out">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Merchant Management Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Approval Process</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Auto-approve verified merchants
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Require manual review for all applications
              </label>
            </div>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Notifications</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Email on new merchant applications
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Alert on policy violations
              </label>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Performance Thresholds</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">Min Rating</label>
                <input type="number" step="0.1" min="0" max="5" defaultValue="3.0" className="w-full px-2 py-1 border rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Max Complaints</label>
                <input type="number" min="0" defaultValue="5" className="w-full px-2 py-1 border rounded" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

// Quick Action Modal Component
const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose, action, title }) => {
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const renderContent = () => {
    switch (action) {
      case 'approve':
        return (
          <div className="space-y-4">
            <p>Review and approve pending merchant applications:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Pending Applications:</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Ready for Review:</span>
                  <span className="font-semibold">2</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'announce':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Message</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your announcement message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Send To</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  All Active Merchants
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Pending Merchants
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Suspended Merchants
                </label>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-4">
            <p>View detailed analytics for merchant performance:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">87%</div>
                <div className="text-sm text-blue-600">Satisfaction Rate</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">€124K</div>
                <div className="text-sm text-green-600">Total Revenue</div>
              </div>
            </div>
          </div>
        );
      case 'policy':
        return (
          <div className="space-y-4">
            <p>Review policy violations and disputes:</p>
            <div className="space-y-2">
              <div className="border border-red-200 bg-red-50 p-3 rounded-lg">
                <div className="font-semibold text-red-800">Active Violations: 2</div>
                <div className="text-sm text-red-600">Requires immediate attention</div>
              </div>
              <div className="border border-yellow-200 bg-yellow-50 p-3 rounded-lg">
                <div className="font-semibold text-yellow-800">Under Review: 5</div>
                <div className="text-sm text-yellow-600">Pending investigation</div>
              </div>
            </div>
          </div>
        );
      default:
        return <p>Action not found</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-2xl transform transition-all duration-300 ease-out">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        {renderContent()}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            {action === 'announce' ? 'Send Announcement' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// View Merchant Modal Component
const ViewMerchantModal: React.FC<ViewMerchantModalProps> = ({ isOpen, onClose, merchant }) => {
  if (!isOpen || !merchant) return null;

  // Define status color and icon functions within the modal scope
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'suspended':
        return <Ban className="w-3 h-3" />;
      case 'rejected':
        return <UserX className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Merchant Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Business Information */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  {merchant.businessName}
                  {merchant.verified && <Crown className="w-5 h-5 text-yellow-500 ml-2" />}
                </h3>
                <p className="text-gray-600">{merchant.category}</p>
              </div>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(merchant.status)}`}>
              {getStatusIcon(merchant.status)}
              <span className="ml-1 capitalize">{merchant.status}</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Owner Name</label>
                  <p className="text-gray-900 font-medium">{merchant.ownerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{merchant.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{merchant.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{merchant.address}</p>
                </div>
              </div>
            </div>

            {/* Business Statistics */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Business Statistics</h4>
              <div className="grid grid-cols-2 gap-4">

                {/* Revenue Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-900 mb-1">
                      {formatCurrency(merchant.totalRevenue)}
                    </div>
                    <div className="text-sm text-gray-500">Total Revenue</div>
                  </div>
                </div>

                {/* Bookings Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-900 mb-1">
                      {merchant.totalBookings.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total Bookings</div>
                  </div>
                </div>

                {/* Rating Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <div className="text-xl font-semibold text-gray-900 mr-2">
                        {merchant.rating > 0 ? merchant.rating.toFixed(1) : 'N/A'}
                      </div>
                      {merchant.rating > 0 && (
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= merchant.rating
                                  ? 'text-blue-500 fill-current'
                                  : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">Average Rating</div>
                  </div>
                </div>

                {/* Join Date Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-900 mb-1">
                      {new Date(merchant.joinDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-gray-500">Member Since</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="block text-gray-500 font-medium">Verification Status</label>
                <p className={`font-semibold ${merchant.verified ? 'text-green-600' : 'text-red-600'}`}>
                  {merchant.verified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
              <div>
                <label className="block text-gray-500 font-medium">Last Activity</label>
                <p className="text-gray-900">{new Date(merchant.lastActivity).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-gray-500 font-medium">Merchant ID</label>
                <p className="text-gray-900 font-mono">{merchant.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <Button onClick={onClose} className="px-6">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// Edit Merchant Modal Component
const EditMerchantModal: React.FC<EditMerchantModalProps> = ({ isOpen, onClose, merchant, onSave }) => {
  const [formData, setFormData] = useState<MerchantData>({
    id: '',
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    status: 'pending',
    joinDate: '',
    totalRevenue: 0,
    totalBookings: 0,
    rating: 0,
    verified: false,
    category: '',
    lastActivity: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (merchant) {
      setFormData(merchant);
    }
  }, [merchant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const handleInputChange = (field: keyof MerchantData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen || !merchant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Merchant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select Category</option>
                  <option value="Hair Salon">Hair Salon</option>
                  <option value="Spa">Spa</option>
                  <option value="Barbershop">Barbershop</option>
                  <option value="Nail Salon">Nail Salon</option>
                  <option value="Medical Spa">Medical Spa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Status and Verification */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Status & Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'suspended' | 'pending' | 'rejected')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => handleInputChange('verified', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Verified Merchant</span>
                </label>
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, merchant, onConfirm }) => {
  if (!isOpen || !merchant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Merchant</h3>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{merchant.businessName}</strong>?
            This action cannot be undone and will permanently remove all associated data.
          </p>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Merchant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MerchantsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedMerchants, setSelectedMerchants] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    verified: '',
    dateRange: '',
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  // Modal states
  const [addMerchantModal, setAddMerchantModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState<{
    isOpen: boolean;
    action: string;
    title: string;
  }>({ isOpen: false, action: '', title: '' });
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantData | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Generate comprehensive demo data (40+ merchants for pagination testing)
  const generateDemoMerchants = (): MerchantData[] => {
    const businessTypes = ['Hair Salon', 'Spa', 'Barbershop', 'Nail Salon', 'Medical Spa'];
    const statuses: Array<'active' | 'suspended' | 'pending' | 'rejected'> = ['active', 'suspended', 'pending', 'rejected'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Boston', 'Seattle', 'Austin', 'Denver'];

    const demoData: MerchantData[] = [];

    for (let i = 1; i <= 45; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const category = businessTypes[Math.floor(Math.random() * businessTypes.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];

      demoData.push({
        id: i.toString(),
        businessName: `${category === 'Hair Salon' ? 'Bella' : category === 'Spa' ? 'Luxe' : category === 'Barbershop' ? 'Urban' : category === 'Nail Salon' ? 'Elite' : 'Glow'} ${category} ${i}`,
        ownerName: `Owner ${i}`,
        email: `owner${i}@example.com`,
        phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        address: `${Math.floor(Math.random() * 999) + 1} ${['Main', 'Oak', 'Pine', 'Elm', 'Maple'][Math.floor(Math.random() * 5)]} St, ${city}`,
        status,
        joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        totalRevenue: status === 'active' ? Math.floor(Math.random() * 50000) + 5000 : status === 'pending' ? 0 : Math.floor(Math.random() * 20000),
        totalBookings: status === 'active' ? Math.floor(Math.random() * 300) + 50 : status === 'pending' ? 0 : Math.floor(Math.random() * 100),
        rating: status === 'active' ? Number((Math.random() * 2 + 3).toFixed(1)) : status === 'pending' ? 0 : Number((Math.random() * 1.5 + 2.5).toFixed(1)),
        verified: status === 'active' ? Math.random() > 0.3 : false,
        category,
        lastActivity: new Date(2024, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
      });
    }

    return demoData;
  };

  // Demo data - replace with API calls
  const [demoMerchants, setDemoMerchants] = useState<MerchantData[]>(generateDemoMerchants());

  useEffect(() => {
    // Calculate stats from demo data
    const totalMerchants = demoMerchants.length;
    const activeMerchants = demoMerchants.filter(m => m.status === 'active').length;
    const pendingMerchants = demoMerchants.filter(m => m.status === 'pending').length;
    const suspendedMerchants = demoMerchants.filter(m => m.status === 'suspended').length;
    const totalRevenue = demoMerchants.reduce((sum, m) => sum + m.totalRevenue, 0);
    const averageRating = demoMerchants
      .filter(m => m.rating > 0)
      .reduce((sum, m, _, arr) => sum + m.rating / arr.length, 0);

    setStats({
      total: totalMerchants,
      active: activeMerchants,
      pending: pendingMerchants,
      suspended: suspendedMerchants,
      totalRevenue: totalRevenue,
      averageRating: averageRating,
    });
  }, [demoMerchants]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'suspended':
        return <Ban className="w-3 h-3" />;
      case 'rejected':
        return <UserX className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  // Handler functions for all actions
  const handleAddMerchant = (newMerchant: Partial<MerchantData>) => {
    setDemoMerchants(prev => [...prev, newMerchant as MerchantData]);
  };

  const handleQuickAction = (action: string, title: string) => {
    setQuickActionModal({ isOpen: true, action, title });
  };

  const handleBulkAction = (action: string, merchantIds: string[]) => {
    console.log(`Bulk ${action} for merchants:`, merchantIds);
  };

  const handleMerchantAction = (action: string, merchant: MerchantData) => {
    switch (action) {
      case 'view':
        setSelectedMerchant(merchant);
        setShowViewModal(true);
        break;
      case 'edit':
        setSelectedMerchant(merchant);
        setShowEditModal(true);
        break;
      case 'approve':
        setDemoMerchants(prev =>
          prev.map(m => m.id === merchant.id ? { ...m, status: 'active' as const } : m)
        );
        break;
      case 'toggleStatus':
        const newStatus = merchant.status === 'active' ? 'suspended' : 'active';
        setDemoMerchants(prev =>
          prev.map(m => m.id === merchant.id ? { ...m, status: newStatus } : m)
        );
        break;
      case 'delete':
        setSelectedMerchant(merchant);
        setShowDeleteModal(true);
        break;
      default:
        console.log(`${action} merchant:`, merchant);
    }
  };

  const handleEditSave = (updatedMerchant: MerchantData) => {
    setDemoMerchants(prev =>
      prev.map(m => m.id === updatedMerchant.id ? updatedMerchant : m)
    );
  };

  const handleDeleteConfirm = () => {
    if (selectedMerchant) {
      setDemoMerchants(prev => prev.filter(m => m.id !== selectedMerchant.id));
      setShowDeleteModal(false);
      setSelectedMerchant(null);
    }
  };

  // Pagination helpers
  const filteredMerchants = demoMerchants.filter(merchant => {
    if (filters.status && merchant.status !== filters.status) return false;
    if (filters.category && merchant.category !== filters.category) return false;
    if (filters.verified && merchant.verified.toString() !== filters.verified) return false;
    return true;
  });

  const totalItems = filteredMerchants.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMerchants = filteredMerchants.slice(startIndex, endIndex);

  const statsCards = [
    {
      title: 'Total Merchants',
      value: stats.total.toString(),
      icon: Store,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      darkColor: 'text-blue-600',
    },
    {
      title: 'Active Merchants',
      value: stats.active.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      darkColor: 'text-green-600',
    },
    {
      title: 'Pending Approval',
      value: stats.pending.toString(),
      icon: Clock,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50',
      darkColor: 'text-yellow-600',
    },
    {
      title: 'Platform Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      darkColor: 'text-purple-600',
    },
  ];

  const columns = [
    {
      key: 'businessName' as keyof MerchantData,
      label: 'Business',
      sortable: true,
      render: (value: any, row: MerchantData) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-slate-900 flex items-center">
              {value}
              {row.verified && <Crown className="w-4 h-4 text-yellow-500 ml-1" />}
            </div>
            <div className="text-sm text-slate-500">{row.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'ownerName' as keyof MerchantData,
      label: 'Owner',
      sortable: true,
      render: (value: any, row: MerchantData) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'status' as keyof MerchantData,
      label: 'Status',
      sortable: true,
      render: (value: any) => (
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          getStatusColor(value)
        )}>
          {getStatusIcon(value)}
          <span className="ml-1 capitalize">{value}</span>
        </span>
      ),
    },
    {
      key: 'totalRevenue' as keyof MerchantData,
      label: 'Revenue',
      sortable: true,
      render: (value: any) => (
        <div className="font-medium text-slate-900">{formatCurrency(value)}</div>
      ),
    },
    {
      key: 'totalBookings' as keyof MerchantData,
      label: 'Bookings',
      sortable: true,
      render: (value: any) => (
        <div className="font-medium text-slate-900">{value}</div>
      ),
    },
    {
      key: 'rating' as keyof MerchantData,
      label: 'Rating',
      sortable: true,
      render: (value: any) => (
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          <span className="font-medium text-slate-900">
            {value > 0 ? value.toFixed(1) : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'joinDate' as keyof MerchantData,
      label: 'Join Date',
      sortable: true,
      render: (value: any) => (
        <div className="text-sm text-slate-900">
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
  ];


  const notifications = [
    {
      id: '1',
      title: 'New Merchant Application',
      message: 'Urban Barber Co. submitted application',
      time: '5 min ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Merchant Suspended',
      message: 'Elite Nails Studio suspended for policy violation',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: '3',
      title: 'High-Rating Achievement',
      message: 'Luxe Spa & Wellness reached 4.9 rating',
      time: '2 hours ago',
      unread: false,
    },
  ];

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Merchant Management</h1>
            <p className="text-slate-600 mt-1">
              Manage and oversee all merchants on the platform
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSettingsModal(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" onClick={() => setAddMerchantModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Merchant
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('p-3 rounded-xl', stat.lightColor)}>
                    <Icon className={cn('w-6 h-6', stat.darkColor)} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => handleQuickAction('approve', 'Approve Pending Merchants')}
              className="p-4 border border-slate-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Approve Pending</h3>
              <p className="text-sm text-slate-600 mt-1">Review and approve merchant applications</p>
            </div>

            <div
              onClick={() => handleQuickAction('announce', 'Send Announcements')}
              className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Send Announcements</h3>
              <p className="text-sm text-slate-600 mt-1">Communicate with all merchants</p>
            </div>

            <div
              onClick={() => handleQuickAction('analytics', 'View Analytics')}
              className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900">View Analytics</h3>
              <p className="text-sm text-slate-600 mt-1">Analyze merchant performance</p>
            </div>

            <div
              onClick={() => handleQuickAction('policy', 'Policy Review')}
              className="p-4 border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-200 transition-colors">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Policy Review</h3>
              <p className="text-sm text-slate-600 mt-1">Review policy violations and disputes</p>
            </div>
          </div>
        </div>

        {/* Merchants Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">All Merchants</h2>
            <p className="text-slate-600 mt-1">
              Comprehensive view of all merchants on the platform
            </p>
          </div>

          {/* Custom Table Implementation */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMerchants.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                      No merchants found
                    </td>
                  </tr>
                ) : (
                  paginatedMerchants.map((merchant) => (
                    <tr key={merchant.id} className="hover:bg-gray-50">
                      {columns.map((column) => (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                          {column.render
                            ? column.render(merchant[column.key as keyof MerchantData], merchant)
                            : <span className="text-sm text-gray-900">{merchant[column.key as keyof MerchantData]}</span>
                          }
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center space-x-2 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMerchantAction('view', merchant)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMerchantAction('edit', merchant)}
                            title="Edit Merchant"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {merchant.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMerchantAction('approve', merchant)}
                              className="text-green-600 hover:text-green-800"
                              title="Approve Merchant"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}
                          {(merchant.status === 'active' || merchant.status === 'suspended' || merchant.status === 'rejected') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMerchantAction('toggleStatus', merchant)}
                              className={
                                merchant.status === 'active'
                                  ? "text-red-600 hover:text-red-800"
                                  : "text-blue-600 hover:text-blue-800"
                              }
                              title={
                                merchant.status === 'active'
                                  ? "Suspend Merchant"
                                  : "Activate Merchant"
                              }
                            >
                              {merchant.status === 'active' ? (
                                <Ban className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMerchantAction('delete', merchant)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Merchant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
                showItemsPerPageSelector={true}
                showTotalItems={true}
                showPageNumbers={true}
                maxPageNumbers={5}
                itemsPerPageOptions={[10, 25, 50, 100]}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddMerchantModal
        isOpen={addMerchantModal}
        onClose={() => setAddMerchantModal(false)}
        onSave={handleAddMerchant}
      />

      <SettingsModal
        isOpen={settingsModal}
        onClose={() => setSettingsModal(false)}
      />

      <QuickActionModal
        isOpen={quickActionModal.isOpen}
        onClose={() => setQuickActionModal({ isOpen: false, action: '', title: '' })}
        action={quickActionModal.action}
        title={quickActionModal.title}
      />

      <ViewMerchantModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedMerchant(null);
        }}
        merchant={selectedMerchant}
      />

      <EditMerchantModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMerchant(null);
        }}
        merchant={selectedMerchant}
        onSave={handleEditSave}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMerchant(null);
        }}
        merchant={selectedMerchant}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}