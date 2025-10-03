'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  Clock,
  DollarSign,
  Users,
  Loader2,
  Calendar,
  Settings,
  GripVertical,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Scissors,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
// Removed API imports - using demo data
import toast from 'react-hot-toast';

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  averageRating?: number;
  totalBookings?: number;
  isActive: boolean;
  images: string[];
}

interface ServicePerformance {
  _id: string;
  name: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  bookingTrend: number;
  revenueTrend: number;
  conversionRate: number;
  views: number;
  lastBooking?: string;
}

interface ApiResponse {
  success: boolean;
  data: Service[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'grid' | 'analytics'>('grid');
  const [performanceData, setPerformanceData] = useState<ServicePerformance[]>([]);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  const categories = [
    'Facial Treatments',
    'Hair Services',
    'Nail Care',
    'Body Treatments',
    'Massage Therapy',
    'Skincare',
    'Makeup Services',
    'Eyebrow & Lash',
  ];

  // Demo services data
  const demoServices: Service[] = [
    {
      _id: '1',
      name: 'Classic Facial Treatment',
      description: 'Deep cleansing facial with extractions, mask, and moisturizing treatment for all skin types',
      category: 'Facial Treatments',
      price: 120,
      duration: 60,
      averageRating: 4.8,
      totalBookings: 156,
      isActive: true,
      images: ['/images/facial-classic.jpg'],
    },
    {
      _id: '2',
      name: 'Deep Tissue Massage',
      description: 'Therapeutic massage targeting deep muscle layers to relieve tension and chronic pain',
      category: 'Massage Therapy',
      price: 150,
      duration: 90,
      averageRating: 4.9,
      totalBookings: 203,
      isActive: true,
      images: ['/images/massage-deep.jpg'],
    },
    {
      _id: '3',
      name: 'Gel Manicure & Pedicure',
      description: 'Long-lasting gel polish application with nail care and cuticle treatment',
      category: 'Nail Care',
      price: 85,
      duration: 120,
      averageRating: 4.7,
      totalBookings: 312,
      isActive: true,
      images: ['/images/nails-gel.jpg'],
    },
    {
      _id: '4',
      name: 'Eyebrow Threading & Tinting',
      description: 'Precision eyebrow shaping with threading technique and professional tinting service',
      category: 'Eyebrow & Lash',
      price: 65,
      duration: 45,
      averageRating: 4.6,
      totalBookings: 87,
      isActive: true,
      images: ['/images/eyebrow-threading.jpg'],
    },
    {
      _id: '5',
      name: 'Hydrafacial Treatment',
      description: 'Advanced hydradermabrasion treatment for instant skin rejuvenation and hydration',
      category: 'Facial Treatments',
      price: 180,
      duration: 75,
      averageRating: 4.9,
      totalBookings: 94,
      isActive: true,
      images: ['/images/hydrafacial.jpg'],
    },
    {
      _id: '6',
      name: 'Hair Cut & Style',
      description: 'Professional haircut with wash, styling, and finishing touches',
      category: 'Hair Services',
      price: 95,
      duration: 90,
      averageRating: 4.4,
      totalBookings: 145,
      isActive: true,
      images: ['/images/hair-cut.jpg'],
    },
    {
      _id: '7',
      name: 'Hot Stone Massage',
      description: 'Relaxing massage using heated volcanic stones to melt away tension',
      category: 'Massage Therapy',
      price: 175,
      duration: 75,
      averageRating: 4.8,
      totalBookings: 76,
      isActive: false,
      images: ['/images/hot-stone.jpg'],
    },
    {
      _id: '8',
      name: 'Acrylic Nail Extensions',
      description: 'Full set of acrylic nail extensions with custom length and shape',
      category: 'Nail Care',
      price: 110,
      duration: 150,
      averageRating: 4.5,
      totalBookings: 189,
      isActive: true,
      images: ['/images/acrylic-nails.jpg'],
    },
  ];

  useEffect(() => {
    fetchServices();
  }, [pagination.page, searchTerm, selectedCategory, sortBy, sortOrder, itemsPerPage]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Filter and sort demo data
      let filteredServices = [...demoServices];
      
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        filteredServices = filteredServices.filter(service =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
        );
      }
      
      if (selectedCategory) {
        filteredServices = filteredServices.filter(service => service.category === selectedCategory);
      }
      
      // Sort services
      if (sortBy !== 'manual') {
        filteredServices.sort((a, b) => {
          let aValue, bValue;
          
          switch (sortBy) {
            case 'name':
              aValue = a.name;
              bValue = b.name;
              break;
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            case 'duration':
              aValue = a.duration;
              bValue = b.duration;
              break;
            case 'rating':
              aValue = a.averageRating || 0;
              bValue = b.averageRating || 0;
              break;
            default:
              return 0;
          }
          
          if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
      }
      
      // Simulate pagination
      const totalItems = filteredServices.length;
      const startIndex = (pagination.page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedServices = filteredServices.slice(startIndex, endIndex);
      
      setServices(paginatedServices);
      setPagination({
        page: pagination.page,
        totalPages: Math.ceil(totalItems / itemsPerPage),
        totalItems,
        limit: itemsPerPage,
      });
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setServices([]);
      setError('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
  };

  const handleReorderServices = async (newOrder: Service[]) => {
    try {
      setServices(newOrder);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Services reordered successfully');
    } catch (error) {
      console.error('Error reordering services:', error);
      toast.error('Failed to reorder services');
    }
  };

  const fetchPerformanceData = async () => {
    try {
      setIsLoadingPerformance(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate demo performance data
      const mockData: ServicePerformance[] = demoServices.map(service => ({
        _id: service._id,
        name: service.name,
        totalBookings: service.totalBookings || Math.floor(Math.random() * 50) + 10,
        totalRevenue: (service.totalBookings || 30) * service.price,
        averageRating: service.averageRating || Number((Math.random() * 2 + 3).toFixed(1)),
        bookingTrend: Number((Math.random() * 40 - 20).toFixed(1)),
        revenueTrend: Number((Math.random() * 30 - 15).toFixed(1)),
        conversionRate: Number((Math.random() * 15 + 5).toFixed(1)),
        views: Math.floor(Math.random() * 200) + 50,
        lastBooking: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      
      setPerformanceData(mockData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setPerformanceData([]);
    } finally {
      setIsLoadingPerformance(false);
    }
  };

  // Fetch performance data when switching to analytics view
  useEffect(() => {
    if (viewMode === 'analytics' && services.length > 0) {
      fetchPerformanceData();
    }
  }, [viewMode, services]);

  const moveService = (dragIndex: number, hoverIndex: number) => {
    const draggedService = services[dragIndex];
    const newServices = [...services];
    newServices.splice(dragIndex, 1);
    newServices.splice(hoverIndex, 0, draggedService);
    handleReorderServices(newServices);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Service deleted successfully');
      
      // Remove service from local state
      setServices(prev => prev.filter(service => service._id !== serviceId));
    } catch (err: any) {
      toast.error('Failed to delete service');
      console.error('Error deleting service:', err);
    }
  };

  const toggleDropdown = (serviceId: string) => {
    setActiveDropdown(activeDropdown === serviceId ? null : serviceId);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage your beauty services and offerings</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-200 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={cn(
                'px-3 py-1 font-medium',
                viewMode === 'grid' 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              Services
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('analytics')}
              className={cn(
                'px-3 py-1 font-medium',
                viewMode === 'analytics' 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Analytics
            </Button>
          </div>
          <Link href="/merchant/services/availability">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white border-0">
              <Calendar className="w-4 h-4 mr-2" />
              Manage Availability
            </Button>
          </Link>
          <Link href="/merchant/services/new">
            <Button className="bg-green-500 hover:bg-green-600 text-white border-0">
              <Plus className="w-4 h-4 mr-2" />
              Add New Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters - Only show for grid view */}
      {viewMode === 'grid' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && 'bg-primary-50 border-primary-200')}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="duration">Duration</option>
                  <option value="rating">Rating</option>
                  <option value="manual">Manual Order</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={sortBy === 'manual'}
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items per page
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Manual Sorting Notice - Only show for grid view */}
      {viewMode === 'grid' && sortBy === 'manual' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <GripVertical className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">Manual sorting enabled</p>
              <p className="text-sm text-blue-700">Drag and drop services to reorder them. Changes will be saved automatically.</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          {/* Services Grid */}
          {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading services</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchServices} className="bg-blue-500 hover:bg-blue-600 text-white border-0">
            Try Again
          </Button>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first service offering</p>
          <Link href="/merchant/services/new">
            <Button className="bg-green-500 hover:bg-green-600 text-white border-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Service
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(services) ? services.map((service, index) => (
            <div
              key={service._id}
              className={cn(
                "bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative",
                sortBy === 'manual' && "cursor-move"
              )}
              draggable={sortBy === 'manual'}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', index.toString());
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const hoverIndex = index;
                if (dragIndex !== hoverIndex) {
                  moveService(dragIndex, hoverIndex);
                }
              }}
            >
              {/* Drag Handle */}
              {sortBy === 'manual' && (
                <div className="absolute top-2 left-2 text-gray-400 hover:text-gray-600 cursor-move">
                  <GripVertical className="w-5 h-5" />
                </div>
              )}

              {/* Service Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                    <div className="text-primary-600">
                      <Scissors className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <span
                      className={cn(
                        'inline-block px-2 py-1 rounded-full text-xs font-medium',
                        getStatusColor(service.isActive)
                      )}
                    >
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(service._id)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {activeDropdown === service._id && (
                    <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <Link
                        href={`/merchant/services/${service._id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                      <Link
                        href={`/merchant/services/${service._id}/edit`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Service
                      </Link>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Service
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Info */}
              <div className="space-y-3 mb-4">
                <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
                <div className="text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Service Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center text-green-600 mb-1">
                    <span className="text-sm">$</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(service.price)}
                  </p>
                  <p className="text-xs text-gray-500">Price</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-600 mb-1">
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{service.duration}min</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-yellow-600 mb-1">
                    <Star className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {service.averageRating ? service.averageRating.toFixed(1) : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link href={`/merchant/services/${service._id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Link href={`/merchant/services/${service._id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          )) : null}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === pagination.page ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={cn(
                  page === pagination.page && "bg-blue-500 hover:bg-blue-600 text-white border-0"
                )}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
        </>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          {isLoadingPerformance ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
                <p className="text-gray-600">Loading performance data...</p>
              </div>
            </div>
          ) : performanceData.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No performance data</h3>
              <p className="text-gray-600 mb-6">Performance analytics will appear here once you have services</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(performanceData) ? performanceData.reduce((sum, service) => sum + service.totalBookings, 0) : 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(Array.isArray(performanceData) ? performanceData.reduce((sum, service) => sum + service.totalRevenue, 0) : 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(performanceData) && performanceData.length > 0 ? (performanceData.reduce((sum, service) => sum + service.averageRating, 0) / performanceData.length).toFixed(1) : '0.0'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Conversion</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(performanceData) && performanceData.length > 0 ? (performanceData.reduce((sum, service) => sum + service.conversionRate, 0) / performanceData.length).toFixed(1) : '0.0'}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Performance Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Service Performance</h3>
                  <p className="text-sm text-gray-600 mt-1">Detailed metrics for each of your services</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversion
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(performanceData) ? performanceData.map((service) => (
                        <tr key={service._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900">{service.totalBookings}</span>
                              <div className="ml-2 flex items-center">
                                {service.bookingTrend >= 0 ? (
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-500" />
                                )}
                                <span className={cn(
                                  'text-xs ml-1',
                                  service.bookingTrend >= 0 ? 'text-green-600' : 'text-red-600'
                                )}>
                                  {Math.abs(service.bookingTrend)}%
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900">{formatCurrency(service.totalRevenue)}</span>
                              <div className="ml-2 flex items-center">
                                {service.revenueTrend >= 0 ? (
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-500" />
                                )}
                                <span className={cn(
                                  'text-xs ml-1',
                                  service.revenueTrend >= 0 ? 'text-green-600' : 'text-red-600'
                                )}>
                                  {Math.abs(service.revenueTrend)}%
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-sm text-gray-900">{service.averageRating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{service.conversionRate}%</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900">{service.views}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className={cn(
                                'w-2 h-2 rounded-full',
                                service.bookingTrend >= 10 ? 'bg-green-400' :
                                service.bookingTrend >= 0 ? 'bg-yellow-400' : 'bg-red-400'
                              )} />
                              <span className="text-xs text-gray-500">
                                {service.bookingTrend >= 10 ? 'Excellent' :
                                 service.bookingTrend >= 0 ? 'Good' : 'Needs attention'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}