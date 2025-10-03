'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  MessageSquare,
  Check,
  X,
  AlertCircle,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Eye,
  Edit3,
  MoreHorizontal,
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface Booking {
  _id: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  service: {
    _id: string;
    name: string;
    duration: number;
    price: number;
    category: string;
  };
  scheduledDate: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  'no-show': 'bg-gray-100 text-gray-800 border-gray-200',
};

const paymentStatusColors = {
  pending: 'text-yellow-600',
  paid: 'text-green-600',
  refunded: 'text-red-600',
  failed: 'text-red-600',
};

export default function EnhancedBookingManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');

  // Stats
  const [stats, setStats] = useState({
    today: 0,
    thisWeek: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
  });

  // Demo booking data
  const demoBookings: Booking[] = [
    {
      _id: '1',
      customer: {
        _id: 'cust1',
        firstName: 'Emma',
        lastName: 'Johnson',
        email: 'emma.johnson@email.com',
        phone: '+1 (555) 123-4567',
        avatar: undefined,
      },
      service: {
        _id: 'svc1',
        name: 'Classic Facial Treatment',
        duration: 60,
        price: 120,
        category: 'Facial',
      },
      scheduledDate: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(), // Today at 5:00 PM
      status: 'confirmed',
      totalAmount: 120,
      paymentStatus: 'paid',
      notes: 'First time customer, allergic to fragrances',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      customer: {
        _id: 'cust2',
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah.w@email.com',
        phone: '+1 (555) 234-5678',
        avatar: undefined,
      },
      service: {
        _id: 'svc2',
        name: 'Deep Tissue Massage',
        duration: 90,
        price: 150,
        category: 'Massage',
      },
      scheduledDate: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(), // Today at 3:00 PM
      status: 'pending',
      totalAmount: 150,
      paymentStatus: 'pending',
      notes: 'Requested specific therapist, has lower back pain from desk job',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '7',
      customer: {
        _id: 'cust7',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 789-0123',
        avatar: undefined,
      },
      service: {
        _id: 'svc7',
        name: 'Men\'s Haircut & Beard Trim',
        duration: 45,
        price: 75,
        category: 'Hair',
      },
      scheduledDate: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(), // Today at 10:00 AM
      status: 'pending',
      totalAmount: 75,
      paymentStatus: 'pending',
      notes: 'First-time customer, wants consultation before cut',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '8',
      customer: {
        _id: 'cust8',
        firstName: 'Lisa',
        lastName: 'Rodriguez',
        email: 'lisa.rodriguez@email.com',
        phone: '+1 (555) 890-1234',
        avatar: undefined,
      },
      service: {
        _id: 'svc8',
        name: 'Anti-Aging Facial with Microdermabrasion',
        duration: 105,
        price: 220,
        category: 'Facial',
      },
      scheduledDate: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(), // Today at 11:00 AM
      status: 'pending',
      totalAmount: 220,
      paymentStatus: 'pending',
      notes: 'Birthday appointment, sensitive skin, prefers organic products only',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '9',
      customer: {
        _id: 'cust9',
        firstName: 'David',
        lastName: 'Thompson',
        email: 'david.thompson@email.com',
        phone: '+1 (555) 901-2345',
        avatar: undefined,
      },
      service: {
        _id: 'svc9',
        name: 'Sports Massage & Stretching Session',
        duration: 120,
        price: 180,
        category: 'Massage',
      },
      scheduledDate: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(), // Today at 4:00 PM
      status: 'pending',
      totalAmount: 180,
      paymentStatus: 'pending',
      notes: 'Professional athlete, preparing for marathon, focus on legs and calves',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '3',
      customer: {
        _id: 'cust3',
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1 (555) 345-6789',
        avatar: undefined,
      },
      service: {
        _id: 'svc3',
        name: 'Gel Manicure & Pedicure',
        duration: 120,
        price: 85,
        category: 'Nails',
      },
      scheduledDate: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(), // Tomorrow
      status: 'confirmed',
      totalAmount: 85,
      paymentStatus: 'paid',
      notes: 'Regular customer, prefers nude colors',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '4',
      customer: {
        _id: 'cust4',
        firstName: 'Jessica',
        lastName: 'Brown',
        email: 'jessica.brown@email.com',
        phone: '+1 (555) 456-7890',
        avatar: undefined,
      },
      service: {
        _id: 'svc4',
        name: 'Eyebrow Threading & Tinting',
        duration: 45,
        price: 65,
        category: 'Eyebrows',
      },
      scheduledDate: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(), // Today at 1:00 PM
      status: 'completed',
      totalAmount: 65,
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '5',
      customer: {
        _id: 'cust5',
        firstName: 'Ashley',
        lastName: 'Davis',
        email: 'ashley.davis@email.com',
        phone: '+1 (555) 567-8901',
        avatar: undefined,
      },
      service: {
        _id: 'svc5',
        name: 'Hydrafacial Treatment',
        duration: 75,
        price: 180,
        category: 'Facial',
      },
      scheduledDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      status: 'confirmed',
      totalAmount: 180,
      paymentStatus: 'paid',
      notes: 'VIP customer, birthday treat',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '6',
      customer: {
        _id: 'cust6',
        firstName: 'Amanda',
        lastName: 'Wilson',
        email: 'amanda.wilson@email.com',
        phone: '+1 (555) 678-9012',
        avatar: undefined,
      },
      service: {
        _id: 'svc6',
        name: 'Hair Cut & Style',
        duration: 90,
        price: 95,
        category: 'Hair',
      },
      scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      status: 'cancelled',
      totalAmount: 95,
      paymentStatus: 'refunded',
      cancellationReason: 'Customer emergency',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchQuery, statusFilter, dateFilter, selectedDate]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings(demoBookings);
      calculateStats(demoBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingUpdate = useCallback((updatedBooking: Booking) => {
    setBookings(prev => {
      const existingIndex = prev.findIndex(b => b._id === updatedBooking._id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedBooking;
        return updated;
      } else {
        return [...prev, updatedBooking];
      }
    });

    // Show notification
    if (updatedBooking.status === 'pending') {
      toast.success(`New booking from ${updatedBooking.customer.firstName}`, {
        duration: 5000,
      });
    }
  }, []);

  const calculateStats = (bookingList: Booking[]) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const todayBookings = bookingList.filter(b =>
      new Date(b.scheduledDate).toDateString() === today.toDateString()
    );

    const weekBookings = bookingList.filter(b =>
      new Date(b.scheduledDate) >= startOfWeek && new Date(b.scheduledDate) <= today
    );

    setStats({
      today: todayBookings.length,
      thisWeek: weekBookings.length,
      pending: bookingList.filter(b => b.status === 'pending').length,
      confirmed: bookingList.filter(b => b.status === 'confirmed').length,
      completed: bookingList.filter(b => b.status === 'completed').length,
      cancelled: bookingList.filter(b => b.status === 'cancelled').length,
      revenue: bookingList
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalAmount, 0),
    });
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.customer.firstName.toLowerCase().includes(query) ||
        booking.customer.lastName.toLowerCase().includes(query) ||
        booking.customer.email.toLowerCase().includes(query) ||
        booking.service.name.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(b =>
          new Date(b.scheduledDate).toDateString() === today.toDateString()
        );
        break;
      case 'tomorrow':
        filtered = filtered.filter(b =>
          new Date(b.scheduledDate).toDateString() === tomorrow.toDateString()
        );
        break;
      case 'week':
        filtered = filtered.filter(b => {
          const bookingDate = new Date(b.scheduledDate);
          return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
        });
        break;
      case 'selected':
        filtered = filtered.filter(b =>
          new Date(b.scheduledDate).toDateString() === selectedDate.toDateString()
        );
        break;
    }

    setFilteredBookings(filtered);
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Booking status updated successfully');
      
      // Update local state
      setBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId ? { ...booking, status: newStatus as any } : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleCancelBooking = async (bookingId: string, reason: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Booking cancelled successfully');
      
      // Update local state
      setBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId ? { 
            ...booking, 
            status: 'cancelled' as any,
            cancellationReason: reason 
          } : booking
        )
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getTimeSlots = (date: Date) => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        bookings: filteredBookings.filter(booking => {
          const bookingDate = new Date(booking.scheduledDate);
          return (
            bookingDate.toDateString() === date.toDateString() &&
            bookingDate.getHours() === hour
          );
        }),
      });
    }
    return slots;
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div
      className={cn(
        "bg-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer",
        booking.status === 'pending' 
          ? "border-yellow-300 bg-yellow-50 ring-2 ring-yellow-200 shadow-sm animate-pulse" 
          : "border-gray-200"
      )}
      onClick={() => {
        setSelectedBooking(booking);
        setShowBookingDetails(true);
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            {booking.customer.avatar ? (
              <img
                src={booking.customer.avatar}
                alt={`${booking.customer.firstName} ${booking.customer.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-primary-600 font-medium text-sm">
                {booking.customer.firstName.charAt(0)}
                {booking.customer.lastName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {booking.customer.firstName} {booking.customer.lastName}
            </p>
            <p className="text-sm text-gray-500">{booking.service.name}</p>
          </div>
        </div>
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          statusColors[booking.status]
        )}>
          {booking.status === 'pending' && (
            <AlertCircle className="w-3 h-3 mr-1" />
          )}
          {booking.status.replace('-', ' ')}
        </span>
      </div>

      {booking.status === 'pending' && (
        <div className="mb-3 p-2 bg-yellow-100 border border-yellow-200 rounded-md">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-800">
              Awaiting your response - New booking request!
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>
            {new Date(booking.scheduledDate).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span>({booking.service.duration}min)</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span>{formatCurrency(booking.totalAmount)}</span>
          <span className={cn('text-xs', paymentStatusColors[booking.paymentStatus])}>
            ({booking.paymentStatus})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4" />
          <span>{booking.customer.phone}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          {booking.status === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(booking._id, 'confirmed');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
              >
                <Check className="w-4 h-4 mr-1" />
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelBooking(booking._id, 'Declined by merchant');
                }}
                className="!text-red-600 border-red-300 hover:bg-red-50 hover:!text-red-700 bg-white"
              >
                <X className="w-4 h-4 mr-1 text-red-600" />
                Decline
              </Button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(booking._id, 'in-progress');
              }}
              className="text-xs"
            >
              Start Service
            </Button>
          )}
          {booking.status === 'in-progress' && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(booking._id, 'completed');
              }}
              className="text-xs"
            >
              Complete
            </Button>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBooking(booking);
            setShowChat(true);
          }}
          className="text-xs"
          title="Chat with Customer"
        >
          <MessageSquare className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Manage your appointments and schedule</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'calendar' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('calendar')}
              className="flex items-center space-x-1"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Calendar</span>
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="flex items-center space-x-1"
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Today</p>
          <p className="text-xl font-bold text-blue-600">{stats.today}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">This Week</p>
          <p className="text-xl font-bold text-purple-600">{stats.thisWeek}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Confirmed</p>
          <p className="text-xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="text-xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Revenue</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(stats.revenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="selected">Selected Date</option>
          </select>

          {dateFilter === 'selected' && (
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(selectedDate.getDate() - 1);
                    setSelectedDate(newDate);
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(selectedDate.getDate() + 1);
                    setSelectedDate(newDate);
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              {getTimeSlots(selectedDate).map((slot) => (
                <div key={slot.time} className="flex">
                  <div className="w-20 text-sm text-gray-600 pt-2">
                    {slot.time}
                  </div>
                  <div className="flex-1 min-h-[60px] border-l border-gray-200 pl-4">
                    {slot.bookings.length > 0 ? (
                      <div className="space-y-2">
                        {slot.bookings.map((booking) => (
                          <BookingCard key={booking._id} booking={booking} />
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center text-gray-400 text-sm">
                        No bookings
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
          {filteredBookings.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Your bookings will appear here'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBookingDetails(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {selectedBooking.customer.firstName.charAt(0)}
                        {selectedBooking.customer.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedBooking.customer.firstName} {selectedBooking.customer.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{selectedBooking.customer.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedBooking.customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedBooking.customer.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Service Details</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Service</p>
                      <p className="font-medium text-gray-900">{selectedBooking.service.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium text-gray-900">{selectedBooking.service.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-medium text-gray-900">{formatCurrency(selectedBooking.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <p className={cn('font-medium', paymentStatusColors[selectedBooking.paymentStatus])}>
                        {selectedBooking.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Booking Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedBooking.scheduledDate).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        statusColors[selectedBooking.status]
                      )}>
                        {selectedBooking.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Booked</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedBooking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedBooking.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {selectedBooking.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="text-gray-900">{selectedBooking.notes}</p>
                    </div>
                  )}
                  
                  {selectedBooking.cancellationReason && (
                    <div>
                      <p className="text-sm text-gray-600">Cancellation Reason</p>
                      <p className="text-red-600">{selectedBooking.cancellationReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowChat(true);
                    setShowBookingDetails(false);
                  }}
                  className="flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Customer</span>
                </Button>
                
                <div className="flex items-center space-x-2">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleCancelBooking(selectedBooking._id, 'Declined by merchant');
                          setShowBookingDetails(false);
                        }}
                        className="text-red-600"
                      >
                        Decline
                      </Button>
                      <Button
                        onClick={() => {
                          handleStatusUpdate(selectedBooking._id, 'confirmed');
                          setShowBookingDetails(false);
                        }}
                      >
                        Confirm
                      </Button>
                    </>
                  )}
                  
                  {selectedBooking.status === 'confirmed' && (
                    <Button
                      onClick={() => {
                        handleStatusUpdate(selectedBooking._id, 'in-progress');
                        setShowBookingDetails(false);
                      }}
                    >
                      Start Service
                    </Button>
                  )}
                  
                  {selectedBooking.status === 'in-progress' && (
                    <Button
                      onClick={() => {
                        handleStatusUpdate(selectedBooking._id, 'completed');
                        setShowBookingDetails(false);
                      }}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[600px]">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">
                    {selectedBooking.customer.firstName.charAt(0)}
                    {selectedBooking.customer.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedBooking.customer.firstName} {selectedBooking.customer.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedBooking.service.name}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-4 h-96 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Demo Chat Interface</h3>
                <p className="text-gray-600 mb-4">
                  This would be a real-time chat with {selectedBooking.customer.firstName}
                </p>
                <Button
                  onClick={() => {
                    toast.success('Demo message sent!');
                    setShowChat(false);
                  }}
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                >
                  Send Demo Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}