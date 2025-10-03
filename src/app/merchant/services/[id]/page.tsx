'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { fetchServiceById, deleteService, clearCurrentService } from '@/store/slices/serviceSlice';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Clock,
  DollarSign,
  Users,
  Tag,
  Calendar,
  TrendingUp,
  Eye,
  Share2,
  MoreVertical,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentService, isLoading } = useSelector((state: RootState) => state.service);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const serviceId = params.id as string;

  useEffect(() => {
    if (serviceId) {
      dispatch(fetchServiceById(serviceId));
    }

    return () => {
      dispatch(clearCurrentService());
    };
  }, [serviceId, dispatch]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      await dispatch(deleteService(serviceId));
      router.push('/merchant/services');
    }
  };

  const mockBookings = [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      date: '2024-01-20T14:00:00Z',
      status: 'confirmed',
      amount: 89.50,
    },
    {
      id: '2',
      customerName: 'Emma Wilson',
      date: '2024-01-18T10:00:00Z',
      status: 'completed',
      amount: 89.50,
    },
    {
      id: '3',
      customerName: 'Lisa Anderson',
      date: '2024-01-15T16:30:00Z',
      status: 'completed',
      amount: 89.50,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Service not found</h2>
        <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/merchant/services')}>
          Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentService.name}</h1>
            <p className="text-gray-600 mt-1">Service details and analytics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Link href={`/merchant/services/${serviceId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            {showDropdown && (
              <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Service
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Images */}
          {currentService.images && currentService.images.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Images</h2>
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={currentService.images[selectedImage]}
                    alt={currentService.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {currentService.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {currentService.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                          'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                          selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                        )}
                      >
                        <img
                          src={image}
                          alt={`${currentService.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Service Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900">{currentService.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                  <span className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                    <Tag className="w-3 h-3 mr-1" />
                    {currentService.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                  <span
                    className={cn(
                      'inline-flex items-center text-sm px-3 py-1 rounded-full font-medium',
                      currentService.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {currentService.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {currentService.features && currentService.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentService.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <Link href={`/merchant/bookings?service=${serviceId}`}>
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            
            {mockBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No bookings for this service yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{booking.customerName}</p>
                      <p className="text-sm text-gray-600">{formatDate(booking.date)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                          getStatusColor(booking.status)
                        )}
                      >
                        {booking.status}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(booking.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Service Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Price</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(currentService.price)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Duration</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {currentService.duration} min
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm text-gray-600">Rating</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {currentService.averageRating ? currentService.averageRating.toFixed(1) : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Total Bookings</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {currentService.totalBookings || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm text-gray-600">Views</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {currentService.views || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href={`/merchant/services/${serviceId}/edit`}>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Service
                </Button>
              </Link>
              <Link href={`/merchant/bookings/new?service=${serviceId}`}>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Booking
                </Button>
              </Link>
              <Link href={`/merchant/analytics?service=${serviceId}`}>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {formatDate(currentService.createdAt || new Date())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">
                  {formatDate(currentService.updatedAt || new Date())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service ID:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {currentService.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}