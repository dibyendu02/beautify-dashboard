'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  DollarSign,
  Loader2,
  Filter,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { bookingService } from '@/services/api';
import toast from 'react-hot-toast';

interface Booking {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  service: {
    name: string;
    duration: number;
  };
  scheduledDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
}

interface CalendarDay {
  date: Date;
  bookings: Booking[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function BookingCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, [currentDate, statusFilter]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, bookings]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const params: any = {
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
        sortBy: 'scheduledDate',
        sortOrder: 'asc',
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await bookingService.getAll(params);
      
      if (response.success) {
        setBookings(response.data || []);
      } else {
        toast.error('Failed to fetch bookings');
        setBookings([]);
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfCalendar = new Date(firstDayOfMonth);
    firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfCalendar.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(firstDayOfCalendar);
      date.setDate(date.getDate() + i);
      
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.scheduledDate);
        return bookingDate.toDateString() === date.toDateString();
      });
      
      days.push({
        date,
        bookings: dayBookings,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
      });
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleBookingAction = async (bookingId: string, action: 'confirm' | 'reject') => {
    try {
      const status = action === 'confirm' ? 'confirmed' : 'cancelled';
      const response = await bookingService.updateStatus(bookingId, status);
      
      if (response.success) {
        toast.success(`Booking ${action === 'confirm' ? 'confirmed' : 'cancelled'} successfully`);
        fetchBookings();
        setSelectedBooking(null);
      } else {
        toast.error(`Failed to ${action} booking`);
      }
    } catch (error: any) {
      console.error(`Error ${action}ing booking:`, error);
      toast.error(`Failed to ${action} booking`);
    }
  };

  const getBookingTimeSlots = (date: Date) => {
    const dayBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.scheduledDate);
      return bookingDate.toDateString() === date.toDateString();
    });
    
    return dayBookings.sort((a, b) => 
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking Calendar</h1>
            <p className="text-gray-600 mt-1">Manage your appointments in calendar view</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading calendar...</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Booking Calendar</h1>
          <p className="text-gray-600 mt-1">Manage your appointments in calendar view</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button onClick={goToToday} variant="outline">
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Calendar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center py-2 text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      'min-h-[120px] p-2 border border-gray-100 rounded-lg cursor-pointer transition-colors',
                      day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50',
                      day.isToday && 'ring-2 ring-primary-500 bg-primary-50',
                      selectedDate?.toDateString() === day.date.toDateString() && 'bg-primary-100'
                    )}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <div className={cn(
                      'text-sm font-medium mb-1',
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                      day.isToday && 'text-primary-700'
                    )}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.bookings.slice(0, 2).map(booking => (
                        <div
                          key={booking._id}
                          className={cn(
                            'text-xs px-2 py-1 rounded border truncate',
                            statusColors[booking.status]
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                          }}
                        >
                          {new Date(booking.scheduledDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })} {booking.customer.firstName}
                        </div>
                      ))}
                      {day.bookings.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{day.bookings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Selected Day Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {selectedDate ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {formatDate(selectedDate)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getBookingTimeSlots(selectedDate).length} appointments
                  </p>
                </div>
                <div className="space-y-4">
                  {getBookingTimeSlots(selectedDate).length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">No appointments</p>
                    </div>
                  ) : (
                    getBookingTimeSlots(selectedDate).map(booking => (
                      <div
                        key={booking._id}
                        className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="font-medium text-sm">
                              {new Date(booking.scheduledDate).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })}
                            </span>
                          </div>
                          <span className={cn(
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize',
                            statusColors[booking.status].replace('border-', '')
                          )}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 text-sm">
                          {booking.customer.firstName} {booking.customer.lastName}
                        </p>
                        <p className="text-gray-600 text-xs">{booking.service.name}</p>
                        <p className="text-primary-600 font-medium text-sm">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Select a date to view appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBooking(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Customer</label>
                <p className="text-gray-900">
                  {selectedBooking.customer.firstName} {selectedBooking.customer.lastName}
                </p>
                <p className="text-sm text-gray-500">{selectedBooking.customer.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Service</label>
                <p className="text-gray-900">{selectedBooking.service.name}</p>
                <p className="text-sm text-gray-500">{selectedBooking.service.duration} minutes</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Date & Time</label>
                <p className="text-gray-900">
                  {formatDate(selectedBooking.scheduledDate)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(selectedBooking.scheduledDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Amount</label>
                <p className="text-gray-900 font-semibold">
                  {formatCurrency(selectedBooking.totalAmount)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={cn(
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize mt-1',
                  statusColors[selectedBooking.status]
                )}>
                  {selectedBooking.status}
                </span>
              </div>

              {selectedBooking.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="text-gray-900">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            {selectedBooking.status === 'pending' && (
              <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => handleBookingAction(selectedBooking._id, 'confirm')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
                <Button
                  onClick={() => handleBookingAction(selectedBooking._id, 'reject')}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}