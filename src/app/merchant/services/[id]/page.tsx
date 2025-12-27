'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Scissors,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Link from 'next/link';
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
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Demo services data - Same as main Services page
const DEMO_SERVICES: Service[] = [
  {
    _id: '1',
    name: 'Classic Facial Treatment',
    description: 'Deep cleansing facial with extractions, mask, and moisturizing treatment for all skin types. Our expert estheticians use premium products to cleanse, exfoliate, and hydrate your skin, leaving it refreshed and glowing.',
    category: 'Facial Treatments',
    price: 120,
    duration: 60,
    averageRating: 4.8,
    totalBookings: 156,
    isActive: true,
    images: ['/images/facial-classic.jpg'],
    features: ['Deep Cleansing', 'Exfoliation', 'Face Mask', 'Moisturizing'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    _id: '2',
    name: 'Deep Tissue Massage',
    description: 'Therapeutic massage targeting deep muscle layers to relieve tension and chronic pain. Perfect for athletes and those with muscle tension. Our skilled therapists use firm pressure techniques to release knots and restore mobility.',
    category: 'Massage Therapy',
    price: 150,
    duration: 90,
    averageRating: 4.9,
    totalBookings: 203,
    isActive: true,
    images: ['/images/massage-deep.jpg'],
    features: ['Muscle Relief', 'Stress Reduction', 'Improved Circulation', 'Pain Management'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
  },
  {
    _id: '3',
    name: 'Gel Manicure & Pedicure',
    description: 'Long-lasting gel polish application with nail care and cuticle treatment. Includes nail shaping, cuticle care, hand and foot massage, and your choice of gel color that lasts up to 3 weeks without chipping.',
    category: 'Nail Care',
    price: 85,
    duration: 120,
    averageRating: 4.7,
    totalBookings: 312,
    isActive: true,
    images: ['/images/nails-gel.jpg'],
    features: ['Long-lasting Polish', 'Cuticle Care', 'Hand Massage', 'Nail Art Options'],
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
  },
  {
    _id: '4',
    name: 'Eyebrow Threading & Tinting',
    description: 'Precision eyebrow shaping with threading technique and professional tinting service. Our threading experts create the perfect arch for your face shape, followed by semi-permanent tinting for fuller-looking brows.',
    category: 'Eyebrow & Lash',
    price: 65,
    duration: 45,
    averageRating: 4.6,
    totalBookings: 87,
    isActive: true,
    images: ['/images/eyebrow-threading.jpg'],
    features: ['Precision Shaping', 'Gentle Threading', 'Custom Tinting', 'Brow Consultation'],
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-23T13:20:00Z',
  },
  {
    _id: '5',
    name: 'Hydrafacial Treatment',
    description: 'Advanced hydradermabrasion treatment for instant skin rejuvenation and hydration. This multi-step treatment cleanses, extracts, and hydrates the skin using patented technology for immediate, noticeable results.',
    category: 'Facial Treatments',
    price: 180,
    duration: 75,
    averageRating: 4.9,
    totalBookings: 94,
    isActive: true,
    images: ['/images/hydrafacial.jpg'],
    features: ['Deep Hydration', 'Pore Extraction', 'Anti-Aging Serums', 'Instant Glow'],
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-24T10:30:00Z',
  },
  {
    _id: '6',
    name: 'Hair Cut & Style',
    description: 'Professional haircut with wash, styling, and finishing touches. Our experienced stylists will consult with you to create the perfect cut that complements your features and lifestyle.',
    category: 'Hair Services',
    price: 95,
    duration: 90,
    averageRating: 4.4,
    totalBookings: 145,
    isActive: true,
    images: ['/images/hair-cut.jpg'],
    features: ['Consultation', 'Precision Cut', 'Blow Dry', 'Styling Products'],
    createdAt: '2024-01-03T09:30:00Z',
    updatedAt: '2024-01-21T15:00:00Z',
  },
  {
    _id: '7',
    name: 'Hot Stone Massage',
    description: 'Relaxing massage using heated volcanic stones to melt away tension. The warmth of the stones penetrates deep into muscles, promoting relaxation and easing muscle stiffness.',
    category: 'Massage Therapy',
    price: 175,
    duration: 75,
    averageRating: 4.8,
    totalBookings: 76,
    isActive: false,
    images: ['/images/hot-stone.jpg'],
    features: ['Heated Stones', 'Deep Relaxation', 'Muscle Relief', 'Aromatherapy'],
    createdAt: '2024-01-07T10:00:00Z',
    updatedAt: '2024-01-19T12:45:00Z',
  },
  {
    _id: '8',
    name: 'Acrylic Nail Extensions',
    description: 'Full set of acrylic nail extensions with custom length and shape. Choose from various shapes including coffin, almond, stiletto, or square, with endless color and design options.',
    category: 'Nail Care',
    price: 110,
    duration: 150,
    averageRating: 4.5,
    totalBookings: 189,
    isActive: true,
    images: ['/images/acrylic-nails.jpg'],
    features: ['Custom Length', 'Shape Options', 'Nail Art', 'Durable Finish'],
    createdAt: '2024-01-06T13:00:00Z',
    updatedAt: '2024-01-26T09:15:00Z',
  },
];

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);

  const serviceId = params.id as string;

  useEffect(() => {
    // Simulate loading and find service from demo data
    setIsLoading(true);
    setTimeout(() => {
      const foundService = DEMO_SERVICES.find(s => s._id === serviceId);
      setService(foundService || null);
      setIsLoading(false);
    }, 500);
  }, [serviceId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      toast.success('Service deleted successfully');
      router.push('/merchant/services');
    }
  };

  const mockBookings = [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      date: '2024-01-20T14:00:00Z',
      status: 'confirmed',
      amount: service?.price || 89.50,
    },
    {
      id: '2',
      customerName: 'Emma Wilson',
      date: '2024-01-18T10:00:00Z',
      status: 'completed',
      amount: service?.price || 89.50,
    },
    {
      id: '3',
      customerName: 'Lisa Anderson',
      date: '2024-01-15T16:30:00Z',
      status: 'completed',
      amount: service?.price || 89.50,
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Service not found</h2>
        <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/merchant/services')} className="bg-blue-500 hover:bg-blue-600 text-white">
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
          <button
            onClick={() => router.push('/merchant/services')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
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
          {/* Service Image Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-blue-100 rounded-xl flex items-center justify-center">
                <Scissors className="w-10 h-10 text-pink-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{service.name}</h2>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      service.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <span className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  <Tag className="w-3 h-3 mr-1" />
                  {service.category}
                </span>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900">{service.description}</p>
              </div>

              {service.features && service.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
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
                  {formatCurrency(service.price)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">Duration</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {service.duration} min
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm text-gray-600">Rating</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {service.averageRating ? service.averageRating.toFixed(1) : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Total Bookings</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {service.totalBookings || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm text-gray-600">Views</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {Math.floor(Math.random() * 500) + 100}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Link href={`/merchant/services/${serviceId}/edit`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Service
                </Button>
              </Link>
              <Link href={`/merchant/bookings/new?service=${serviceId}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Booking
                </Button>
              </Link>
              <Link href={`/merchant/services/analytics`} className="block">
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
                  {formatDate(service.createdAt || new Date().toISOString())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">
                  {formatDate(service.updatedAt || new Date().toISOString())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service ID:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {service._id}
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
