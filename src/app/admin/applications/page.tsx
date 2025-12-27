'use client';

import { useState, useMemo } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  User,
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';

// Application interface
interface MerchantApplication {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  businessType: string;
  yearsExperience: number;
  specializations: string[];
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  documents: {
    businessLicense: string;
    insurance: string;
    certifications: string[];
  };
  businessHours: {
    [key: string]: string;
  };
  expectedServices: number;
  expectedRevenue: number;
  description: string;
}

// Mock merchant applications data - expanded for pagination testing
const mockApplications: MerchantApplication[] = [
  {
    id: 'APP-001',
    businessName: 'Luxe Beauty Spa',
    ownerName: 'Maria Rodriguez',
    email: 'maria@luxebeauty.com',
    phone: '+1 (555) 123-4567',
    address: '123 Beauty Ave, Beverly Hills, CA 90210',
    businessType: 'Full Service Spa',
    yearsExperience: 8,
    specializations: ['Facial Treatments', 'Body Therapy', 'Massage'],
    submittedAt: '2024-01-18T10:30:00Z',
    status: 'pending',
    documents: {
      businessLicense: 'business-license-001.pdf',
      insurance: 'insurance-cert-001.pdf',
      certifications: ['cosmetology-cert-001.pdf', 'massage-cert-001.pdf'],
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
    expectedServices: 15,
    expectedRevenue: 25000,
    description: 'Luxe Beauty Spa offers premium beauty and wellness services in an upscale environment. We specialize in advanced facial treatments, therapeutic massages, and body wellness services.',
  },
  {
    id: 'APP-002',
    businessName: 'Urban Hair Studio',
    ownerName: 'James Thompson',
    email: 'james@urbanhair.com',
    phone: '+1 (555) 234-5678',
    address: '456 Style Street, Brooklyn, NY 11201',
    businessType: 'Hair Salon',
    yearsExperience: 5,
    specializations: ['Hair Cutting', 'Color Treatment', 'Styling'],
    submittedAt: '2024-01-17T14:20:00Z',
    status: 'under_review',
    documents: {
      businessLicense: 'business-license-002.pdf',
      insurance: 'insurance-cert-002.pdf',
      certifications: ['cosmetology-cert-002.pdf'],
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
    expectedServices: 8,
    expectedRevenue: 18000,
    description: 'Modern hair salon focusing on contemporary cuts, advanced coloring techniques, and personalized styling services.',
  },
  {
    id: 'APP-003',
    businessName: 'Zen Wellness Center',
    ownerName: 'Lisa Chen',
    email: 'lisa@zenwellness.com',
    phone: '+1 (555) 345-6789',
    address: '789 Wellness Way, San Francisco, CA 94102',
    businessType: 'Wellness & Spa',
    yearsExperience: 12,
    specializations: ['Massage Therapy', 'Acupuncture', 'Aromatherapy'],
    submittedAt: '2024-01-16T09:45:00Z',
    status: 'approved',
    documents: {
      businessLicense: 'business-license-003.pdf',
      insurance: 'insurance-cert-003.pdf',
      certifications: ['massage-cert-003.pdf', 'acupuncture-cert-003.pdf'],
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
    expectedServices: 20,
    expectedRevenue: 35000,
    description: 'Holistic wellness center offering traditional and modern therapeutic services in a tranquil environment.',
    approvedAt: '2024-01-19T11:20:00Z',
    approvedBy: 'Admin User',
  },
  {
    id: 'APP-004',
    businessName: 'Elite Nail Bar',
    ownerName: 'Sophie Martin',
    email: 'sophie@elitenails.com',
    phone: '+1 (555) 456-7890',
    address: '321 Nail Street, Miami, FL 33101',
    businessType: 'Nail Salon',
    yearsExperience: 6,
    specializations: ['Manicure', 'Pedicure', 'Nail Art'],
    submittedAt: '2024-01-15T11:15:00Z',
    status: 'pending',
    documents: {
      businessLicense: 'business-license-004.pdf',
      insurance: 'insurance-cert-004.pdf',
      certifications: ['nail-tech-cert-004.pdf'],
    },
    businessHours: {
      monday: '9:00 AM - 7:00 PM',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '8:00 AM - 7:00 PM',
      sunday: '10:00 AM - 6:00 PM',
    },
    expectedServices: 12,
    expectedRevenue: 15000,
    description: 'Premium nail salon offering luxury manicures, pedicures, and custom nail art designs.',
  },
  {
    id: 'APP-005',
    businessName: 'Perfect Brows Studio',
    ownerName: 'Amanda Wilson',
    email: 'amanda@perfectbrows.com',
    phone: '+1 (555) 567-8901',
    address: '654 Brow Lane, Austin, TX 78701',
    businessType: 'Eyebrow Studio',
    yearsExperience: 4,
    specializations: ['Microblading', 'Eyebrow Threading', 'Lash Extensions'],
    submittedAt: '2024-01-14T16:45:00Z',
    status: 'rejected',
    documents: {
      businessLicense: 'business-license-005.pdf',
      insurance: 'insurance-cert-005.pdf',
      certifications: ['microblading-cert-005.pdf'],
    },
    businessHours: {
      monday: 'Closed',
      tuesday: '10:00 AM - 6:00 PM',
      wednesday: '10:00 AM - 6:00 PM',
      thursday: '10:00 AM - 7:00 PM',
      friday: '10:00 AM - 7:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: '11:00 AM - 4:00 PM',
    },
    expectedServices: 8,
    expectedRevenue: 12000,
    description: 'Specialized eyebrow and lash studio focusing on precision shaping and enhancement services.',
  },
  {
    id: 'APP-006',
    businessName: 'Glow Skin Studio',
    ownerName: 'Dr. Jennifer Park',
    email: 'jennifer@glowskin.com',
    phone: '+1 (555) 678-9012',
    address: '987 Glow Street, Seattle, WA 98101',
    businessType: 'Medical Spa',
    yearsExperience: 10,
    specializations: ['Chemical Peels', 'Botox', 'Dermal Fillers'],
    submittedAt: '2024-01-13T09:30:00Z',
    status: 'approved',
    documents: {
      businessLicense: 'business-license-006.pdf',
      insurance: 'insurance-cert-006.pdf',
      certifications: ['medical-license-006.pdf', 'aesthetics-cert-006.pdf'],
    },
    businessHours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 7:00 PM',
      friday: '8:00 AM - 7:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed',
    },
    expectedServices: 25,
    expectedRevenue: 45000,
    description: 'Medical spa offering advanced skincare treatments and aesthetic procedures.',
    approvedAt: '2024-01-20T10:15:00Z',
    approvedBy: 'Admin User',
  },
  {
    id: 'APP-007',
    businessName: 'Radiant Beauty Lounge',
    ownerName: 'Isabella Garcia',
    email: 'isabella@radiantbeauty.com',
    phone: '+1 (555) 789-0123',
    address: '147 Beauty Blvd, Phoenix, AZ 85001',
    businessType: 'Beauty Lounge',
    yearsExperience: 7,
    specializations: ['Makeup Application', 'Skincare', 'Waxing'],
    submittedAt: '2024-01-12T13:20:00Z',
    status: 'under_review',
    documents: {
      businessLicense: 'business-license-007.pdf',
      insurance: 'insurance-cert-007.pdf',
      certifications: ['cosmetology-cert-007.pdf'],
    },
    businessHours: {
      monday: '9:00 AM - 8:00 PM',
      tuesday: '9:00 AM - 8:00 PM',
      wednesday: '9:00 AM - 8:00 PM',
      thursday: '9:00 AM - 9:00 PM',
      friday: '9:00 AM - 9:00 PM',
      saturday: '8:00 AM - 8:00 PM',
      sunday: '10:00 AM - 6:00 PM',
    },
    expectedServices: 18,
    expectedRevenue: 28000,
    description: 'Full-service beauty lounge offering makeup, skincare, and grooming services.',
  },
  {
    id: 'APP-008',
    businessName: 'Classic Cuts Barbershop',
    ownerName: 'Michael Johnson',
    email: 'michael@classiccuts.com',
    phone: '+1 (555) 890-1234',
    address: '258 Barber Street, Chicago, IL 60601',
    businessType: 'Barbershop',
    yearsExperience: 15,
    specializations: ['Hair Cutting', 'Beard Trimming', 'Straight Razor Shaves'],
    submittedAt: '2024-01-11T08:45:00Z',
    status: 'pending',
    documents: {
      businessLicense: 'business-license-008.pdf',
      insurance: 'insurance-cert-008.pdf',
      certifications: ['barber-license-008.pdf'],
    },
    businessHours: {
      monday: 'Closed',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: '10:00 AM - 4:00 PM',
    },
    expectedServices: 10,
    expectedRevenue: 20000,
    description: 'Traditional barbershop offering classic cuts, beard grooming, and hot towel shaves.',
  },
  {
    id: 'APP-009',
    businessName: 'Serenity Day Spa',
    ownerName: 'Rachel Green',
    email: 'rachel@serenityspa.com',
    phone: '+1 (555) 901-2345',
    address: '369 Serenity Lane, Portland, OR 97201',
    businessType: 'Day Spa',
    yearsExperience: 9,
    specializations: ['Full Body Massage', 'Facials', 'Body Wraps'],
    submittedAt: '2024-01-10T15:30:00Z',
    status: 'approved',
    documents: {
      businessLicense: 'business-license-009.pdf',
      insurance: 'insurance-cert-009.pdf',
      certifications: ['massage-cert-009.pdf', 'aesthetics-cert-009.pdf'],
    },
    businessHours: {
      monday: '9:00 AM - 8:00 PM',
      tuesday: '9:00 AM - 8:00 PM',
      wednesday: '9:00 AM - 8:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '8:00 AM - 7:00 PM',
      sunday: '10:00 AM - 6:00 PM',
    },
    expectedServices: 22,
    expectedRevenue: 38000,
    description: 'Tranquil day spa offering relaxation and rejuvenation through various therapeutic treatments.',
    approvedAt: '2024-01-21T14:22:00Z',
    approvedBy: 'Admin User',
  },
  {
    id: 'APP-010',
    businessName: 'Modern Lashes',
    ownerName: 'Emily Davis',
    email: 'emily@modernlashes.com',
    phone: '+1 (555) 012-3456',
    address: '741 Lash Avenue, Las Vegas, NV 89101',
    businessType: 'Lash Studio',
    yearsExperience: 3,
    specializations: ['Eyelash Extensions', 'Lash Lifts', 'Brow Lamination'],
    submittedAt: '2024-01-09T12:15:00Z',
    status: 'pending',
    documents: {
      businessLicense: 'business-license-010.pdf',
      insurance: 'insurance-cert-010.pdf',
      certifications: ['lash-cert-010.pdf'],
    },
    businessHours: {
      monday: 'Closed',
      tuesday: '10:00 AM - 7:00 PM',
      wednesday: '10:00 AM - 7:00 PM',
      thursday: '10:00 AM - 8:00 PM',
      friday: '10:00 AM - 8:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: '11:00 AM - 5:00 PM',
    },
    expectedServices: 6,
    expectedRevenue: 14000,
    description: 'Specialized lash studio focusing on premium eyelash extensions and enhancement services.',
  },
  // Continue with more entries...
  {
    id: 'APP-011',
    businessName: 'The Wellness Room',
    ownerName: 'David Kim',
    email: 'david@wellnessroom.com',
    phone: '+1 (555) 123-4560',
    address: '852 Wellness St, Denver, CO 80201',
    businessType: 'Wellness Center',
    yearsExperience: 11,
    specializations: ['Reflexology', 'Reiki', 'Cupping Therapy'],
    submittedAt: '2024-01-08T10:00:00Z',
    status: 'under_review',
    documents: {
      businessLicense: 'business-license-011.pdf',
      insurance: 'insurance-cert-011.pdf',
      certifications: ['reflexology-cert-011.pdf', 'reiki-cert-011.pdf'],
    },
    businessHours: {
      monday: '8:00 AM - 7:00 PM',
      tuesday: '8:00 AM - 7:00 PM',
      wednesday: '8:00 AM - 7:00 PM',
      thursday: '8:00 AM - 7:00 PM',
      friday: '8:00 AM - 7:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: 'Closed',
    },
    expectedServices: 16,
    expectedRevenue: 24000,
    description: 'Holistic wellness center specializing in alternative healing therapies.',
  },
  {
    id: 'APP-012',
    businessName: 'Blush Makeup Studio',
    ownerName: 'Caroline White',
    email: 'caroline@blushmakeup.com',
    phone: '+1 (555) 234-5671',
    address: '963 Makeup Lane, Nashville, TN 37201',
    businessType: 'Makeup Studio',
    yearsExperience: 6,
    specializations: ['Bridal Makeup', 'Special Event Makeup', 'Photoshoot Makeup'],
    submittedAt: '2024-01-07T14:45:00Z',
    status: 'rejected',
    documents: {
      businessLicense: 'business-license-012.pdf',
      insurance: 'insurance-cert-012.pdf',
      certifications: ['makeup-artist-cert-012.pdf'],
    },
    businessHours: {
      monday: 'By Appointment',
      tuesday: '10:00 AM - 6:00 PM',
      wednesday: '10:00 AM - 6:00 PM',
      thursday: '10:00 AM - 8:00 PM',
      friday: '10:00 AM - 8:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: '9:00 AM - 5:00 PM',
    },
    expectedServices: 12,
    expectedRevenue: 22000,
    description: 'Professional makeup studio specializing in bridal and special event makeup artistry.',
  },
];

// Generate more applications for testing pagination
for (let i = 13; i <= 45; i++) {
  const statuses = ['pending', 'under_review', 'approved', 'rejected'];
  const businessTypes = ['Hair Salon', 'Nail Salon', 'Spa', 'Barbershop', 'Beauty Lounge', 'Medical Spa'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
  
  mockApplications.push({
    id: `APP-${i.toString().padStart(3, '0')}`,
    businessName: `Beauty Business ${i}`,
    ownerName: `Owner ${i}`,
    email: `owner${i}@business${i}.com`,
    phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    address: `${Math.floor(Math.random() * 999 + 1)} Beauty St, ${cities[Math.floor(Math.random() * cities.length)]}, NY 10001`,
    businessType: businessTypes[Math.floor(Math.random() * businessTypes.length)],
    yearsExperience: Math.floor(Math.random() * 15 + 1),
    specializations: ['Service A', 'Service B', 'Service C'].slice(0, Math.floor(Math.random() * 3 + 1)),
    submittedAt: new Date(2024, 0, Math.floor(Math.random() * 30 + 1), Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    documents: {
      businessLicense: `business-license-${i.toString().padStart(3, '0')}.pdf`,
      insurance: `insurance-cert-${i.toString().padStart(3, '0')}.pdf`,
      certifications: [`cert-${i.toString().padStart(3, '0')}.pdf`],
    },
    businessHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: 'Closed',
    },
    expectedServices: Math.floor(Math.random() * 20 + 5),
    expectedRevenue: Math.floor(Math.random() * 40000 + 10000),
    description: `Professional beauty business offering quality services in ${cities[Math.floor(Math.random() * cities.length)]}.`,
  });
}

export default function MerchantApplicationsPage() {
  const [applications, setApplications] = useState<MerchantApplication[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<MerchantApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === '' || app.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, selectedStatus]);

  // Reset to first page when filters change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Reset pagination when search or filter changes
  useMemo(() => {
    resetPagination();
  }, [searchTerm, selectedStatus]);

  // Calculate paginated data
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredApplications.slice(startIndex, endIndex);
  }, [filteredApplications, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleStatusUpdate = (applicationId: string, newStatus: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: newStatus,
            ...(newStatus === 'approved' ? {
              approvedAt: new Date().toISOString(),
              approvedBy: 'Current Admin'
            } : {})
          } 
        : app
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'under_review':
        return AlertCircle;
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      default:
        return FileText;
    }
  };

  const statusCounts = {
    pending: applications.filter(app => app.status === 'pending').length,
    under_review: applications.filter(app => app.status === 'under_review').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Merchant Applications</h1>
            <p className="text-black mt-1">Review and manage merchant application requests</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Export Applications
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <FileText className="w-4 h-4 mr-2 text-white" />
              Bulk Review
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.under_review}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Approved</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
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
                  placeholder="Search by business name, owner, or email..."
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
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Application</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Business Details</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Experience</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-black">Submitted</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplications.map((application) => {
                  const StatusIcon = getStatusIcon(application.status);
                  
                  return (
                    <tr key={application.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4 align-top">
                        <div>
                          <p className="font-semibold text-black">{application.id}</p>
                          <p className="text-sm text-black">{application.businessName}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div>
                          <p className="font-medium text-black">{application.ownerName}</p>
                          <div className="flex items-center text-sm text-black mt-1">
                            <Mail className="w-4 h-4 mr-2 text-gray-800 flex-shrink-0" />
                            <span className="mr-3">{application.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-black mt-1">
                            <MapPin className="w-4 h-4 mr-2 text-gray-800 flex-shrink-0" />
                            <span>{application.address.split(',')[1]?.trim()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="text-sm">
                          <p className="font-medium text-black">{application.yearsExperience} years</p>
                          <p className="text-black">{application.businessType}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {application.specializations.slice(0, 2).map((spec, idx) => (
                              <span key={idx} className="inline-block bg-slate-100 text-black text-xs px-2 py-0.5 rounded">
                                {spec}
                              </span>
                            ))}
                            {application.specializations.length > 2 && (
                              <span className="text-xs text-black">+{application.specializations.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                            getStatusColor(application.status)
                          )}
                        >
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {application.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="text-sm text-black">
                          <p>{formatDate(application.submittedAt)}</p>
                          {application.approvedAt && (
                            <p className="text-xs text-green-600 mt-1">
                              Approved {formatDate(application.approvedAt)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start justify-center pt-1">
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowModal(true);
                            }}
                            className="p-2 text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="View Application Details"
                          >
                            <Eye className="w-5 h-5 text-gray-800" />
                          </button>
                          {application.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(application.id, 'approved')}
                                className="p-2 text-green-600 border border-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 ml-1"
                                title="Approve Application"
                              >
                                <Check className="w-5 h-5 text-green-600" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                className="p-2 text-red-600 border border-red-600 hover:bg-red-50  rounded-lg transition-colors duration-200 ml-1"
                                title="Reject Application"
                              >
                                <X className="w-5 h-5 text-red-600" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {paginatedApplications.length === 0 && filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-black mb-2">No applications found</h3>
              <p className="text-black">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredApplications.length > itemsPerPage && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredApplications.length}
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

        {/* Application Detail Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" onClick={() => setShowModal(false)} />
            
            <div className="bg-white rounded-lg shadow-2xl transform transition-all max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-10">
              <div className="flex flex-col h-full">
                <div className="bg-white px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-black">
                      Application Details - {selectedApplication.id}
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
                          <p className="text-black">{selectedApplication.businessName}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Owner:</label>
                          <p className="text-black">{selectedApplication.ownerName}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Type:</label>
                          <p className="text-black">{selectedApplication.businessType}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Address:</label>
                          <p className="text-black">{selectedApplication.address}</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Contact:</label>
                          <p className="text-black">{selectedApplication.email}</p>
                          <p className="text-black">{selectedApplication.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-black mb-3">Experience & Specializations</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <label className="font-medium text-black">Years of Experience:</label>
                          <p className="text-black">{selectedApplication.yearsExperience} years</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Specializations:</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedApplication.specializations.map((spec: string, idx: number) => (
                              <span key={idx} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="font-medium text-black">Expected Services:</label>
                          <p className="text-black">{selectedApplication.expectedServices} services</p>
                        </div>
                        <div>
                          <label className="font-medium text-black">Expected Monthly Revenue:</label>
                          <p className="text-black">€{selectedApplication.expectedRevenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold text-black mb-3">Business Description</h4>
                    <p className="text-sm text-black">{selectedApplication.description}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3">
                  {selectedApplication.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleStatusUpdate(selectedApplication.id, 'rejected');
                          setShowModal(false);
                        }}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <p className='text-red-600'>Reject Application</p>
                      </Button>
                      <Button
                        onClick={() => {
                          handleStatusUpdate(selectedApplication.id, 'approved');
                          setShowModal(false);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve Application
                      </Button>
                    </>
                  )}
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}