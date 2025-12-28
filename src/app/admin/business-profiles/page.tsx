'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  MoreVertical,
  MapPin,
  Clock,
  Star,
  Users,
  Calendar,
  Phone,
  Mail,
  Globe,
  Verified,
  AlertCircle,
  Settings,
  TrendingUp,
  DollarSign,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import { cn } from '@/lib/utils';

interface BusinessProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  businessType: string;
  description: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  businessHours: {
    [key: string]: string;
  };
  services: string[];
  specializations: string[];
  teamSize: number;
  yearsInBusiness: number;
  rating: number;
  totalReviews: number;
  monthlyRevenue: number;
  totalBookings: number;
  isVerified: boolean;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  joinedDate: string;
  lastActive: string;
  certifications: string[];
  images: string[];
}

// Mock business profiles data
const mockBusinessProfiles: BusinessProfile[] = [
  {
    id: 'BIZ-001',
    businessName: 'Luxe Beauty Spa',
    ownerName: 'Maria Rodriguez',
    email: 'maria@luxebeauty.com',
    phone: '+1 (555) 123-4567',
    address: '123 Beauty Ave',
    city: 'Beverly Hills',
    state: 'CA',
    zipCode: '90210',
    businessType: 'Full Service Spa',
    description: 'Premium beauty and wellness services in an upscale environment. We specialize in advanced facial treatments, therapeutic massages, and body wellness services.',
    website: 'https://luxebeauty.com',
    socialMedia: {
      instagram: '@luxebeauty',
      facebook: 'luxebeauty',
    },
    businessHours: {
      monday: '9:00 AM - 8:00 PM',
      tuesday: '9:00 AM - 8:00 PM',
      wednesday: '9:00 AM - 8:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 9:00 PM',
      saturday: '8:00 AM - 9:00 PM',
      sunday: 'Closed',
    },
    services: ['Facial Treatments', 'Body Therapy', 'Massage', 'Skincare'],
    specializations: ['Anti-Aging', 'Hydrafacial', 'Deep Tissue Massage'],
    teamSize: 12,
    yearsInBusiness: 8,
    rating: 4.8,
    totalReviews: 324,
    monthlyRevenue: 45000,
    totalBookings: 1250,
    isVerified: true,
    status: 'active',
    joinedDate: '2020-03-15T10:30:00Z',
    lastActive: '2024-01-20T15:45:00Z',
    certifications: ['Licensed Esthetician', 'Massage Therapy License', 'Health Department Certified'],
    images: ['spa1.jpg', 'spa2.jpg', 'spa3.jpg']
  },
  {
    id: 'BIZ-002',
    businessName: 'Urban Hair Studio',
    ownerName: 'James Thompson',
    email: 'james@urbanhair.com',
    phone: '+1 (555) 234-5678',
    address: '456 Style Street',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201',
    businessType: 'Hair Salon',
    description: 'Modern hair salon focusing on contemporary cuts, advanced coloring techniques, and personalized styling services.',
    website: 'https://urbanhair.com',
    socialMedia: {
      instagram: '@urbanhair',
    },
    businessHours: {
      monday: 'Closed',
      tuesday: '10:00 AM - 7:00 PM',
      wednesday: '10:00 AM - 7:00 PM',
      thursday: '10:00 AM - 8:00 PM',
      friday: '10:00 AM - 8:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: '10:00 AM - 5:00 PM',
    },
    services: ['Hair Cutting', 'Color Treatment', 'Styling', 'Hair Extensions'],
    specializations: ['Balayage', 'Precision Cuts', 'Color Correction'],
    teamSize: 6,
    yearsInBusiness: 5,
    rating: 4.6,
    totalReviews: 189,
    monthlyRevenue: 28000,
    totalBookings: 890,
    isVerified: true,
    status: 'active',
    joinedDate: '2021-06-10T14:20:00Z',
    lastActive: '2024-01-19T11:30:00Z',
    certifications: ['Cosmetology License', 'Advanced Color Certification'],
    images: ['salon1.jpg', 'salon2.jpg']
  },
  {
    id: 'BIZ-003',
    businessName: 'Elite Nail Bar',
    ownerName: 'Sophie Martin',
    email: 'sophie@elitenails.com',
    phone: '+1 (555) 345-6789',
    address: '789 Nail Street',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    businessType: 'Nail Salon',
    description: 'Premium nail salon offering luxury manicures, pedicures, and custom nail art designs.',
    businessHours: {
      monday: '9:00 AM - 7:00 PM',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '8:00 AM - 7:00 PM',
      sunday: '10:00 AM - 6:00 PM',
    },
    services: ['Manicure', 'Pedicure', 'Nail Art', 'Gel Polish'],
    specializations: ['Custom Nail Art', 'Luxury Spa Pedicures', 'Gel Extensions'],
    teamSize: 8,
    yearsInBusiness: 6,
    rating: 4.7,
    totalReviews: 267,
    monthlyRevenue: 22000,
    totalBookings: 1100,
    isVerified: false,
    status: 'pending',
    joinedDate: '2023-11-08T09:15:00Z',
    lastActive: '2024-01-18T16:20:00Z',
    certifications: ['Nail Technician License'],
    images: ['nails1.jpg']
  },
  {
    id: 'BIZ-004',
    businessName: 'Zen Wellness Center',
    ownerName: 'Lisa Chen',
    email: 'lisa@zenwellness.com',
    phone: '+1 (555) 456-7890',
    address: '321 Wellness Way',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    businessType: 'Wellness & Spa',
    description: 'Holistic wellness center offering traditional and modern therapeutic services in a tranquil environment.',
    website: 'https://zenwellness.com',
    socialMedia: {
      instagram: '@zenwellness',
      facebook: 'zenwellness',
      twitter: '@zenwell'
    },
    businessHours: {
      monday: '8:00 AM - 8:00 PM',
      tuesday: '8:00 AM - 8:00 PM',
      wednesday: '8:00 AM - 8:00 PM',
      thursday: '8:00 AM - 8:00 PM',
      friday: '8:00 AM - 8:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: '10:00 AM - 5:00 PM',
    },
    services: ['Massage Therapy', 'Acupuncture', 'Aromatherapy', 'Yoga Classes'],
    specializations: ['Deep Tissue Massage', 'Traditional Chinese Medicine', 'Mindfulness'],
    teamSize: 15,
    yearsInBusiness: 12,
    rating: 4.9,
    totalReviews: 445,
    monthlyRevenue: 65000,
    totalBookings: 1680,
    isVerified: true,
    status: 'active',
    joinedDate: '2019-01-20T08:00:00Z',
    lastActive: '2024-01-20T14:10:00Z',
    certifications: ['Licensed Massage Therapist', 'Acupuncture License', 'Yoga Alliance Certified'],
    images: ['wellness1.jpg', 'wellness2.jpg', 'wellness3.jpg', 'wellness4.jpg']
  },
  {
    id: 'BIZ-005',
    businessName: 'Perfect Brows Studio',
    ownerName: 'Amanda Wilson',
    email: 'amanda@perfectbrows.com',
    phone: '+1 (555) 567-8901',
    address: '654 Brow Lane',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    businessType: 'Eyebrow Studio',
    description: 'Specialized eyebrow and lash studio focusing on precision shaping and enhancement services.',
    businessHours: {
      monday: 'Closed',
      tuesday: '10:00 AM - 6:00 PM',
      wednesday: '10:00 AM - 6:00 PM',
      thursday: '10:00 AM - 7:00 PM',
      friday: '10:00 AM - 7:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: '11:00 AM - 4:00 PM',
    },
    services: ['Microblading', 'Eyebrow Threading', 'Lash Extensions', 'Brow Tinting'],
    specializations: ['Microblading', 'Lash Lifts', 'Precision Threading'],
    teamSize: 4,
    yearsInBusiness: 4,
    rating: 4.4,
    totalReviews: 98,
    monthlyRevenue: 15000,
    totalBookings: 420,
    isVerified: false,
    status: 'suspended',
    joinedDate: '2022-09-12T12:30:00Z',
    lastActive: '2024-01-15T10:45:00Z',
    certifications: ['Microblading Certification'],
    images: ['brows1.jpg']
  }
];

export default function BusinessProfilesPage() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>(mockBusinessProfiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = 
        profile.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.businessType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === '' || profile.status === selectedStatus;
      const matchesType = selectedType === '' || profile.businessType === selectedType;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [profiles, searchTerm, selectedStatus, selectedType]);

  // Calculate paginated data
  const paginatedProfiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProfiles.slice(startIndex, endIndex);
  }, [filteredProfiles, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Verified className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'suspended':
        return <AlertCircle className="w-4 h-4" />;
      case 'inactive':
        return <Settings className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const businessTypes = [...new Set(profiles.map(p => p.businessType))];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Business Profiles</h1>
            <p className="text-black mt-1">Manage merchant business profiles and information</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Export Profiles
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <TrendingUp className="w-4 h-4 mr-2 text-white" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Businesses</p>
                <p className="text-2xl font-bold text-blue-600">{profiles.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {profiles.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Verified className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Verified</p>
                <p className="text-2xl font-bold text-purple-600">
                  {profiles.filter(p => p.isVerified).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Avg Revenue</p>
                <p className="text-2xl font-bold text-orange-600">
                  €{Math.round(profiles.reduce((sum, p) => sum + p.monthlyRevenue, 0) / profiles.length).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by business name, owner, city, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-black bg-white"
                />
              </div>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-black bg-white"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="lg:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-black bg-white"
              >
                <option value="">All Types</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Business Profiles Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Business</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Owner & Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Performance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProfiles.map((profile) => (
                  <tr key={profile.id} className="border-b border-slate-100 hover:bg-slate-50 align-top">
                    <td className="py-4 px-4 align-top">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-black">{profile.businessName}</p>
                          {profile.isVerified && (
                            <Verified className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-black mt-1">{profile.businessType}</p>
                        <div className="flex items-center text-sm text-black mt-1">
                          <MapPin className="w-4 h-4 mr-1 text-gray-600" />
                          <span>{profile.city}, {profile.state}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {profile.specializations.slice(0, 2).map((spec, idx) => (
                            <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                              {spec}
                            </span>
                          ))}
                          {profile.specializations.length > 2 && (
                            <span className="text-xs text-black">+{profile.specializations.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div>
                        <p className="font-medium text-black">{profile.ownerName}</p>
                        <div className="flex items-center text-sm text-black mt-1">
                          <Mail className="w-4 h-4 mr-1 text-gray-600" />
                          <span className="truncate max-w-[200px]">{profile.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-black mt-1">
                          <Phone className="w-4 h-4 mr-1 text-gray-600" />
                          <span>{profile.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-black mt-1">
                          <Users className="w-4 h-4 mr-1 text-gray-600" />
                          <span>{profile.teamSize} team members</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="text-sm">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-black">{profile.rating}</span>
                          <span className="text-black">({profile.totalReviews} reviews)</span>
                        </div>
                        <div className="flex items-center text-black mb-1">
                          <Calendar className="w-4 h-4 mr-1 text-gray-600" />
                          <span>{profile.totalBookings} bookings</span>
                        </div>
                        <div className="flex items-center text-black mb-1">
                          <DollarSign className="w-4 h-4 mr-1 text-gray-600" />
                          <span>€{profile.monthlyRevenue.toLocaleString()}/mo</span>
                        </div>
                        <div className="text-xs text-black">
                          {profile.yearsInBusiness} years in business
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                          getStatusColor(profile.status)
                        )}
                      >
                        {getStatusIcon(profile.status)}
                        <span className="ml-1">{profile.status}</span>
                      </span>
                      <div className="text-xs text-black mt-1">
                        Joined {new Date(profile.joinedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => {
                            setSelectedProfile(profile);
                            setShowModal(true);
                          }}
                          className="p-2 text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="View Profile Details"
                        >
                          <Eye className="w-5 h-5 text-gray-800" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedProfiles.length === 0 && filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No business profiles found</h3>
              <p className="text-black">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Pagination - only show when there's more than one page */}
        {filteredProfiles.length > itemsPerPage && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredProfiles.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              showItemsPerPageSelector={true}
              showTotalItems={true}
              showPageNumbers={true}
              itemsPerPageOptions={[5, 10, 25, 50]}
              className="justify-between"
            />
          </div>
        )}

        {/* Business Profile Detail Modal */}
        {showModal && selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" onClick={() => setShowModal(false)} />
            
            <div className="bg-white rounded-lg shadow-2xl transform transition-all max-w-6xl w-full max-h-[90vh] overflow-hidden relative z-10">
              <div className="flex flex-col h-full">
                <div className="bg-white px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-black">
                      Business Profile - {selectedProfile.businessName}
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-black hover:text-gray-600"
                    >
                      <X className="w-6 h-6 text-black" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-black mb-3">Business Information</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <label className="font-medium text-black">Business Name:</label>
                          <p className="text-black">{selectedProfile.businessName}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Owner:</label>
                          <p className="text-black">{selectedProfile.ownerName}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Type:</label>
                          <p className="text-black">{selectedProfile.businessType}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Address:</label>
                          <p className="text-black">{selectedProfile.address}, {selectedProfile.city}, {selectedProfile.state} {selectedProfile.zipCode}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Contact:</label>
                          <p className="text-black">{selectedProfile.email}</p>
                          <p className="text-black">{selectedProfile.phone}</p>
                        </div>
                        {selectedProfile.website && (
                          <div>
                            <label className="font-medium text-black">Website:</label>
                            <p className="text-black">{selectedProfile.website}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-black mb-3">Performance & Details</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <label className="font-medium text-black">Rating:</label>
                          <p className="text-black">{selectedProfile.rating}/5 ({selectedProfile.totalReviews} reviews)</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Team Size:</label>
                          <p className="text-black">{selectedProfile.teamSize} members</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Experience:</label>
                          <p className="text-black">{selectedProfile.yearsInBusiness} years</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Monthly Revenue:</label>
                          <p className="text-black">€{selectedProfile.monthlyRevenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Total Bookings:</label>
                          <p className="text-black">{selectedProfile.totalBookings}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Services:</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedProfile.services.map((service: string, idx: number) => (
                              <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold text-black mb-3">Business Description</h4>
                    <p className="text-sm text-black">{selectedProfile.description}</p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-black mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfile.certifications.map((cert: string, idx: number) => (
                        <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Edit2 className="w-4 h-4 mr-2 text-white" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}