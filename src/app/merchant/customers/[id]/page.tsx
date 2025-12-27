'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Star,
  MapPin,
  Clock,
  Edit,
  MessageCircle,
  CalendarPlus,
  Gift,
  User,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  totalBookings?: number;
  totalSpent?: number;
  averageRating?: number;
  lastBooking?: string;
  joinedDate: string;
  status: 'active' | 'vip' | 'inactive';
  preferredServices?: string[];
  address?: string;
  birthday?: string;
  notes?: string;
}

interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  status: 'completed' | 'cancelled' | 'upcoming';
  amount: number;
  rating?: number;
}

const DEMO_CUSTOMERS: Customer[] = [
  {
    _id: '1',
    firstName: 'Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@email.com',
    phone: '+1 (555) 123-4567',
    totalBookings: 12,
    totalSpent: 1450,
    averageRating: 4.8,
    lastBooking: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    joinedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'vip',
    preferredServices: ['Facial Treatment', 'Massage', 'Manicure'],
    address: '123 Main Street, New York, NY 10001',
    birthday: '1990-05-15',
    notes: 'Prefers afternoon appointments. Allergic to lavender products.',
  },
  {
    _id: '2',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.w@email.com',
    phone: '+1 (555) 234-5678',
    totalBookings: 8,
    totalSpent: 920,
    averageRating: 4.6,
    lastBooking: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    joinedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    preferredServices: ['Hair Services', 'Eyebrow Threading'],
    address: '456 Oak Avenue, Brooklyn, NY 11201',
    birthday: '1988-09-22',
    notes: 'Regular monthly customer for hair services.',
  },
  {
    _id: '3',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1 (555) 345-6789',
    totalBookings: 15,
    totalSpent: 2100,
    averageRating: 4.9,
    lastBooking: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    joinedDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'vip',
    preferredServices: ['Hydrafacial', 'Nail Care', 'Spa Treatments'],
    address: '789 Park Place, Manhattan, NY 10016',
    birthday: '1985-03-10',
    notes: 'VIP client. Prefers premium products. Always tips generously.',
  },
  {
    _id: '4',
    firstName: 'Jessica',
    lastName: 'Brown',
    email: 'jessica.brown@email.com',
    phone: '+1 (555) 456-7890',
    totalBookings: 3,
    totalSpent: 285,
    averageRating: 4.3,
    lastBooking: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    joinedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    preferredServices: ['Eyebrow Threading', 'Facial'],
    address: '321 Elm Street, Queens, NY 11375',
    birthday: '1995-11-28',
    notes: 'New customer, building relationship.',
  },
  {
    _id: '5',
    firstName: 'Ashley',
    lastName: 'Davis',
    email: 'ashley.davis@email.com',
    phone: '+1 (555) 567-8901',
    totalBookings: 6,
    totalSpent: 780,
    averageRating: 4.7,
    lastBooking: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    preferredServices: ['Massage', 'Body Treatments', 'Skincare'],
    address: '654 Cedar Lane, Bronx, NY 10451',
    birthday: '1992-07-04',
    notes: 'Enjoys relaxation services. Works in healthcare.',
  },
  {
    _id: '6',
    firstName: 'Amanda',
    lastName: 'Wilson',
    email: 'amanda.wilson@email.com',
    phone: '+1 (555) 678-9012',
    totalBookings: 1,
    totalSpent: 95,
    averageRating: 4.0,
    lastBooking: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    joinedDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'inactive',
    preferredServices: ['Hair Services'],
    address: '987 Maple Drive, Staten Island, NY 10301',
    birthday: '1998-01-30',
    notes: 'Inactive - reach out for re-engagement.',
  },
  {
    _id: '7',
    firstName: 'Lisa',
    lastName: 'Miller',
    email: 'lisa.miller@email.com',
    phone: '+1 (555) 789-0123',
    totalBookings: 9,
    totalSpent: 1200,
    averageRating: 4.8,
    lastBooking: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    joinedDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    preferredServices: ['Manicure', 'Pedicure', 'Nail Art'],
    address: '147 Pine Road, Hoboken, NJ 07030',
    birthday: '1987-12-18',
    notes: 'Loves nail art. Shares on social media - potential influencer.',
  },
  {
    _id: '8',
    firstName: 'Jennifer',
    lastName: 'Taylor',
    email: 'jennifer.taylor@email.com',
    phone: '+1 (555) 890-1234',
    totalBookings: 4,
    totalSpent: 480,
    averageRating: 4.5,
    lastBooking: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    joinedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    preferredServices: ['Facial', 'Skincare'],
    address: '258 Birch Avenue, Jersey City, NJ 07302',
    birthday: '1993-04-25',
    notes: 'Interested in anti-aging treatments.',
  },
];

const generateBookingHistory = (customerId: string): Booking[] => {
  const bookings: Booking[] = [
    {
      id: '1',
      service: 'Facial Treatment',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      time: '2:00 PM',
      status: 'completed',
      amount: 120,
      rating: 5,
    },
    {
      id: '2',
      service: 'Massage Therapy',
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      time: '11:00 AM',
      status: 'completed',
      amount: 150,
      rating: 4,
    },
    {
      id: '3',
      service: 'Manicure & Pedicure',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      time: '3:30 PM',
      status: 'completed',
      amount: 85,
      rating: 5,
    },
    {
      id: '4',
      service: 'Hair Styling',
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      time: '10:00 AM',
      status: 'cancelled',
      amount: 95,
    },
    {
      id: '5',
      service: 'Hydrafacial',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      time: '1:00 PM',
      status: 'upcoming',
      amount: 180,
    },
  ];
  return bookings;
};

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCustomer = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const found = DEMO_CUSTOMERS.find(c => c._id === customerId);
      if (found) {
        setCustomer(found);
        setBookings(generateBookingHistory(customerId));
      }
      setIsLoading(false);
    };

    loadCustomer();
  }, [customerId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'upcoming':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500 mb-4" />
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push('/merchant/customers')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Customers
        </button>
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Customer not found</h3>
          <p className="text-gray-600 mb-6">The customer you are looking for does not exist.</p>
          <Link href="/merchant/customers">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">
              Back to Customers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/merchant/customers')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
            <p className="text-gray-600">View and manage customer information</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-blue-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 font-bold text-2xl">
                  {getInitials(customer.firstName, customer.lastName)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </h2>
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    getStatusColor(customer.status)
                  )}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  Customer since {new Date(customer.joinedDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{customer.phone}</p>
                </div>
              </div>
              {customer.address && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">{customer.address}</p>
                  </div>
                </div>
              )}
              {customer.birthday && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Gift className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Birthday</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(customer.birthday).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking History</h3>
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getBookingStatusIcon(booking.status)}
                    <div>
                      <p className="font-medium text-gray-900">{booking.service}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(booking.amount)}</p>
                    {booking.rating && (
                      <div className="flex items-center justify-end gap-1 text-sm text-yellow-600">
                        <Star className="w-3 h-3 fill-current" />
                        {booking.rating}
                      </div>
                    )}
                    {!booking.rating && (
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        booking.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      )}>
                        {booking.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Total Bookings</span>
                </div>
                <span className="font-bold text-gray-900">{customer.totalBookings}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-green-600 font-bold">$</span>
                  <span className="text-sm text-gray-600">Total Spent</span>
                </div>
                <span className="font-bold text-gray-900">{formatCurrency(customer.totalSpent || 0)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-gray-600">Average Rating</span>
                </div>
                <span className="font-bold text-gray-900">{(customer.averageRating || 0).toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Last Visit</span>
                </div>
                <span className="font-bold text-gray-900 text-sm">
                  {customer.lastBooking
                    ? new Date(customer.lastBooking).toLocaleDateString()
                    : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Preferred Services */}
          {customer.preferredServices && customer.preferredServices.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Services</h3>
              <div className="flex flex-wrap gap-2">
                {customer.preferredServices.map((service, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-pink-50 text-pink-700 text-sm rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="w-full justify-start">
                <CalendarPlus className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
