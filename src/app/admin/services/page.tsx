'use client';

import { useState } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import Button from '../../../components/ui/Button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import Pagination from '../../../components/ui/Pagination';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Star,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
  businessName: string;
  businessId: string;
  price: number;
  duration: number;
  description: string;
  status: 'active' | 'inactive' | 'pending' | 'flagged';
  rating: number;
  totalBookings: number;
  totalReviews: number;
  dateCreated: string;
  lastUpdated: string;
  isPopular: boolean;
  tags: string[];
  images: string[];
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Classic Haircut & Style',
      category: 'Hair',
      businessName: 'Elite Salon & Spa',
      businessId: 'bus_001',
      price: 75,
      duration: 60,
      description: 'Professional haircut with styling and wash',
      status: 'active',
      rating: 4.8,
      totalBookings: 1250,
      totalReviews: 89,
      dateCreated: '2024-01-15',
      lastUpdated: '2024-09-20',
      isPopular: true,
      tags: ['haircut', 'styling', 'wash'],
      images: ['hair1.jpg', 'hair2.jpg']
    },
    {
      id: '2',
      name: 'Deep Tissue Massage',
      category: 'Massage',
      businessName: 'Zen Wellness Center',
      businessId: 'bus_002',
      price: 120,
      duration: 90,
      description: 'Therapeutic deep tissue massage for muscle tension relief',
      status: 'active',
      rating: 4.9,
      totalBookings: 890,
      totalReviews: 156,
      dateCreated: '2024-02-01',
      lastUpdated: '2024-09-25',
      isPopular: true,
      tags: ['massage', 'therapy', 'relaxation'],
      images: ['massage1.jpg']
    },
    {
      id: '3',
      name: 'Facial Treatment',
      category: 'Skincare',
      businessName: 'Glow Beauty Studio',
      businessId: 'bus_003',
      price: 95,
      duration: 75,
      description: 'Rejuvenating facial with cleansing and moisturizing',
      status: 'pending',
      rating: 4.6,
      totalBookings: 234,
      totalReviews: 42,
      dateCreated: '2024-03-10',
      lastUpdated: '2024-09-18',
      isPopular: false,
      tags: ['facial', 'skincare', 'cleansing'],
      images: ['facial1.jpg', 'facial2.jpg']
    },
    {
      id: '4',
      name: 'Manicure & Pedicure',
      category: 'Nails',
      businessName: 'Nail Art Studio',
      businessId: 'bus_004',
      price: 65,
      duration: 90,
      description: 'Complete nail care with polish and design',
      status: 'active',
      rating: 4.7,
      totalBookings: 567,
      totalReviews: 78,
      dateCreated: '2024-01-20',
      lastUpdated: '2024-09-22',
      isPopular: false,
      tags: ['nails', 'manicure', 'pedicure'],
      images: ['nails1.jpg']
    },
    {
      id: '5',
      name: 'Eyebrow Threading',
      category: 'Beauty',
      businessName: 'Perfect Brows',
      businessId: 'bus_005',
      price: 25,
      duration: 30,
      description: 'Precise eyebrow shaping with threading technique',
      status: 'active',
      rating: 4.5,
      totalBookings: 892,
      totalReviews: 134,
      dateCreated: '2024-02-15',
      lastUpdated: '2024-09-19',
      isPopular: true,
      tags: ['eyebrows', 'threading', 'shaping'],
      images: ['brows1.jpg']
    },
    {
      id: '6',
      name: 'Hot Stone Massage',
      category: 'Massage',
      businessName: 'Zen Wellness Center',
      businessId: 'bus_002',
      price: 140,
      duration: 90,
      description: 'Relaxing massage with heated volcanic stones',
      status: 'flagged',
      rating: 4.3,
      totalBookings: 123,
      totalReviews: 23,
      dateCreated: '2024-03-01',
      lastUpdated: '2024-09-10',
      isPopular: false,
      tags: ['massage', 'hot stone', 'relaxation'],
      images: ['hotstone1.jpg']
    },
    {
      id: '7',
      name: 'Brazilian Blowout',
      category: 'Hair',
      businessName: 'Elite Salon & Spa',
      businessId: 'bus_001',
      price: 200,
      duration: 180,
      description: 'Hair smoothing treatment for frizz-free results',
      status: 'active',
      rating: 4.8,
      totalBookings: 345,
      totalReviews: 67,
      dateCreated: '2024-02-20',
      lastUpdated: '2024-09-21',
      isPopular: true,
      tags: ['hair', 'smoothing', 'treatment'],
      images: ['blowout1.jpg', 'blowout2.jpg']
    },
    {
      id: '8',
      name: 'Acne Treatment',
      category: 'Skincare',
      businessName: 'Clear Skin Clinic',
      businessId: 'bus_006',
      price: 85,
      duration: 60,
      description: 'Specialized treatment for acne-prone skin',
      status: 'inactive',
      rating: 4.4,
      totalBookings: 156,
      totalReviews: 34,
      dateCreated: '2024-03-05',
      lastUpdated: '2024-08-15',
      isPopular: false,
      tags: ['skincare', 'acne', 'treatment'],
      images: ['acne1.jpg']
    },
    {
      id: '9',
      name: 'Gel Nail Extensions',
      category: 'Nails',
      businessName: 'Nail Art Studio',
      businessId: 'bus_004',
      price: 85,
      duration: 120,
      description: 'Long-lasting gel nail extensions with custom design',
      status: 'active',
      rating: 4.6,
      totalBookings: 423,
      totalReviews: 89,
      dateCreated: '2024-01-25',
      lastUpdated: '2024-09-23',
      isPopular: false,
      tags: ['nails', 'extensions', 'gel'],
      images: ['gel1.jpg', 'gel2.jpg']
    },
    {
      id: '10',
      name: 'Makeup Application',
      category: 'Beauty',
      businessName: 'Glamour Studio',
      businessId: 'bus_007',
      price: 60,
      duration: 45,
      description: 'Professional makeup for special occasions',
      status: 'active',
      rating: 4.7,
      totalBookings: 234,
      totalReviews: 56,
      dateCreated: '2024-02-28',
      lastUpdated: '2024-09-24',
      isPopular: false,
      tags: ['makeup', 'special occasion', 'professional'],
      images: ['makeup1.jpg']
    }
  ]);

  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categories = ['all', 'Hair', 'Massage', 'Skincare', 'Nails', 'Beauty'];
  const statuses = ['all', 'active', 'inactive', 'pending', 'flagged'];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterServices(term, statusFilter, categoryFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterServices(searchTerm, status, categoryFilter);
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    filterServices(searchTerm, statusFilter, category);
  };

  const filterServices = (search: string, status: string, category: string) => {
    let filtered = services;

    if (search) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.businessName.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(service => service.status === status);
    }

    if (category !== 'all') {
      filtered = filtered.filter(service => service.category === category);
    }

    setFilteredServices(filtered);
    setCurrentPage(1);
  };

  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  const handleUpdateStatus = (serviceId: string, newStatus: 'active' | 'inactive' | 'pending' | 'flagged') => {
    setServices(prev => prev.map(service =>
      service.id === serviceId ? { ...service, status: newStatus } : service
    ));
    filterServices(searchTerm, statusFilter, categoryFilter);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
      filterServices(searchTerm, statusFilter, categoryFilter);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      flagged: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'flagged': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 'active').length;
  const pendingServices = services.filter(s => s.status === 'pending').length;
  const flaggedServices = services.filter(s => s.status === 'flagged').length;
  const avgRating = (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1);

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
            <p className="text-gray-600 mt-1">Manage and moderate all platform services</p>
          </div>
          <Button
            onClick={() => {}}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            <p className="text-white">Add Service</p>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-green-600">{activeServices}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingServices}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged Services</p>
                <p className="text-2xl font-bold text-red-600">{flaggedServices}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-600">{avgRating}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search services, businesses, or descriptions..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">{service.name}</p>
                            {service.isPopular && (
                              <TrendingUp className="w-4 h-4 text-orange-500 ml-2" />
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="w-3 h-3 text-gray-400 mr-1" />
                            <p className="text-xs text-gray-500">{service.duration} min</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{service.businessName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-purple-100 text-purple-800">
                        {service.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                        <p className="text-sm font-medium text-gray-900">{service.price}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <p className="text-sm text-gray-900">{service.rating}</p>
                        <p className="text-xs text-gray-500 ml-1">({service.totalReviews})</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{service.totalBookings}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusBadge(service.status)}>
                        <div className="flex items-center">
                          {getStatusIcon(service.status)}
                          <span className="ml-1">{service.status}</span>
                        </div>
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewService(service)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          title="View Service Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {}}
                          className="text-green-600 hover:text-green-800 hover:bg-green-50"
                          title="Edit Service"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination - only show when there's more than one page */}
          {filteredServices.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredServices.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(newItemsPerPage) => {
                  setItemsPerPage(newItemsPerPage);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>

        {showServiceModal && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedService.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedService.businessName}</p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setShowServiceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="text-sm text-gray-900">{selectedService.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Price</p>
                    <p className="text-sm text-gray-900">${selectedService.price}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-sm text-gray-900">{selectedService.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rating</p>
                    <p className="text-sm text-gray-900">{selectedService.rating} ({selectedService.totalReviews} reviews)</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-sm text-gray-900">{selectedService.totalBookings}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge className={getStatusBadge(selectedService.status)}>
                      {selectedService.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                  <p className="text-sm text-gray-900">{selectedService.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.tags.map((tag, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Actions</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdateStatus(selectedService.id, 'active')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={selectedService.status === 'active'}
                    >
                      <p className="text-white">Approve</p>
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(selectedService.id, 'flagged')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={selectedService.status === 'flagged'}
                    >
                      <p className="text-white">Flag</p>
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(selectedService.id, 'inactive')}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      disabled={selectedService.status === 'inactive'}
                    >
                      <p className="text-gray-700">Deactivate</p>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}