'use client';

import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Users,
  Repeat,
  Copy,
  Scissors,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  staff: {
    id: string;
    name: string;
    avatar?: string;
  };
  datetime: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  isRecurring?: boolean;
  recurringPattern?: {
    frequency: 'weekly' | 'bi-weekly' | 'monthly';
    endDate?: string;
  };
  paymentStatus: 'pending' | 'paid' | 'refunded';
  reminders: {
    email: boolean;
    sms: boolean;
    sentAt?: string;
  };
}

interface CalendarView {
  type: 'day' | 'week' | 'month';
  date: Date;
}

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  'no-show': 'bg-gray-100 text-gray-800 border-gray-200',
};

const timeSlots = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 9; // Start from 9 AM
  return `${hour.toString().padStart(2, '0')}:00`;
});

export default function AdvancedScheduling() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calendarView, setCalendarView] = useState<CalendarView>({
    type: 'week',
    date: new Date(),
  });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    staff: 'all',
    status: 'all',
    service: 'all',
    search: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, [calendarView]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - In production, this would be an API call
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          customerName: 'Emma Johnson',
          customerEmail: 'emma@example.com',
          customerPhone: '+1 (555) 123-4567',
          service: { id: '1', name: 'Deluxe Facial', duration: 90, price: 150 },
          staff: { id: '1', name: 'Sarah Wilson' },
          datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          status: 'confirmed',
          paymentStatus: 'paid',
          reminders: { email: true, sms: true },
        },
        {
          id: '2',
          customerName: 'Michael Brown',
          customerEmail: 'michael@example.com',
          customerPhone: '+1 (555) 987-6543',
          service: { id: '2', name: 'Hair Cut & Style', duration: 60, price: 85 },
          staff: { id: '2', name: 'Maria Garcia' },
          datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
          status: 'scheduled',
          paymentStatus: 'pending',
          reminders: { email: true, sms: false },
          isRecurring: true,
          recurringPattern: { frequency: 'monthly' },
        },
        {
          id: '3',
          customerName: 'Sophie Davis',
          customerEmail: 'sophie@example.com',
          customerPhone: '+1 (555) 456-7890',
          service: { id: '3', name: 'Gel Manicure', duration: 45, price: 65 },
          staff: { id: '1', name: 'Sarah Wilson' },
          datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'in-progress',
          paymentStatus: 'paid',
          reminders: { email: true, sms: true, sentAt: new Date().toISOString() },
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      // Mock API call
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
      toast.success(`Appointment ${newStatus}`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment');
    }
  };

  const handleSendReminder = async (appointment: Appointment, type: 'email' | 'sms') => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${type.toUpperCase()} reminder sent to ${appointment.customerName}`);
      
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointment.id
            ? {
                ...apt,
                reminders: {
                  ...apt.reminders,
                  sentAt: new Date().toISOString(),
                },
              }
            : apt
        )
      );
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    }
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    setCalendarView(prev => {
      const newDate = new Date(prev.date);
      const increment = prev.type === 'day' ? 1 : prev.type === 'week' ? 7 : 30;
      
      if (direction === 'next') {
        newDate.setDate(newDate.getDate() + increment);
      } else {
        newDate.setDate(newDate.getDate() - increment);
      }
      
      return { ...prev, date: newDate };
    });
  };

  const getFilteredAppointments = () => {
    return appointments.filter(appointment => {
      const matchesStaff = filters.staff === 'all' || appointment.staff.id === filters.staff;
      const matchesStatus = filters.status === 'all' || appointment.status === filters.status;
      const matchesService = filters.service === 'all' || appointment.service.id === filters.service;
      const matchesSearch = !filters.search || 
        appointment.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        appointment.service.name.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStaff && matchesStatus && matchesService && matchesSearch;
    });
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return getFilteredAppointments().filter(apt => 
      apt.datetime.startsWith(dateStr)
    );
  };

  const renderCalendarGrid = () => {
    if (calendarView.type === 'day') {
      return renderDayView();
    } else if (calendarView.type === 'week') {
      return renderWeekView();
    } else {
      return renderMonthView();
    }
  };

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(calendarView.date);
    
    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {calendarView.date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <div className="space-y-2">
            {timeSlots.map(time => {
              const appointmentAtTime = dayAppointments.find(apt => 
                new Date(apt.datetime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: false 
                }) === time
              );
              
              return (
                <div key={time} className="flex items-center min-h-[60px] border-b border-gray-100 last:border-b-0">
                  <div className="w-16 text-sm text-gray-600 font-medium">{time}</div>
                  <div className="flex-1 ml-4">
                    {appointmentAtTime ? (
                      <AppointmentCard 
                        appointment={appointmentAtTime}
                        onStatusChange={handleStatusChange}
                        onSendReminder={handleSendReminder}
                        onClick={() => setSelectedAppointment(appointmentAtTime)}
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">Available</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(calendarView.date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 font-medium text-gray-700">Time</div>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="p-4 text-center border-l border-gray-200">
              <div className="font-medium text-gray-900">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-sm text-gray-600">
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
        
        {timeSlots.map(time => (
          <div key={time} className="grid grid-cols-8 min-h-[80px] border-b border-gray-100">
            <div className="p-4 text-sm text-gray-600 font-medium border-r border-gray-200">
              {time}
            </div>
            {weekDays.map(day => {
              const dayAppointments = getAppointmentsForDate(day);
              const appointmentAtTime = dayAppointments.find(apt => 
                new Date(apt.datetime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: false 
                }) === time
              );
              
              return (
                <div key={`${day.toISOString()}-${time}`} className="p-2 border-l border-gray-200">
                  {appointmentAtTime && (
                    <AppointmentCard 
                      appointment={appointmentAtTime}
                      onStatusChange={handleStatusChange}
                      onSendReminder={handleSendReminder}
                      onClick={() => setSelectedAppointment(appointmentAtTime)}
                      compact
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="text-center text-gray-600">
          Month view coming soon. Use Week or Day view for detailed scheduling.
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Scheduling</h2>
          <p className="text-gray-600 mt-1">Manage appointments and optimize your schedule</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Customer or service..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff Member</label>
              <select
                value={filters.staff}
                onChange={(e) => setFilters(prev => ({ ...prev, staff: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Staff</option>
                <option value="1">Sarah Wilson</option>
                <option value="2">Maria Garcia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="ghost"
                onClick={() => setFilters({ staff: 'all', status: 'all', service: 'all', search: '' })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Controls */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigateCalendar('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold text-gray-900">
            {calendarView.date.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          <Button variant="ghost" onClick={() => navigateCalendar('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {(['day', 'week', 'month'] as const).map(type => (
            <Button
              key={type}
              variant={calendarView.type === type ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setCalendarView(prev => ({ ...prev, type }))}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      {renderCalendarGrid()}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <CalendarIcon className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">
              {getFilteredAppointments().length}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Total Appointments</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">
              {getFilteredAppointments().filter(apt => apt.status === 'confirmed').length}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Confirmed</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900">
              {getFilteredAppointments().filter(apt => apt.status === 'scheduled').length}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Pending Confirmation</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <DollarSign className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                getFilteredAppointments()
                  .filter(apt => apt.paymentStatus === 'paid')
                  .reduce((sum, apt) => sum + apt.service.price, 0)
              )}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Revenue (Paid)</p>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onStatusChange={handleStatusChange}
          onSendReminder={handleSendReminder}
        />
      )}
    </div>
  );
}

// Appointment Card Component
interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange: (id: string, status: Appointment['status']) => void;
  onSendReminder: (appointment: Appointment, type: 'email' | 'sms') => void;
  onClick: () => void;
  compact?: boolean;
}

function AppointmentCard({ appointment, onStatusChange, onSendReminder, onClick, compact = false }: AppointmentCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow',
        statusColors[appointment.status],
        compact ? 'text-xs' : 'text-sm'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{appointment.customerName}</p>
          <p className="text-gray-600 truncate">{appointment.service.name}</p>
          {!compact && (
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {appointment.service.duration}min
              <span className="mx-2">•</span>
              <DollarSign className="w-3 h-3 mr-1" />
              {formatCurrency(appointment.service.price)}
            </div>
          )}
        </div>
        {appointment.isRecurring && (
          <Repeat className="w-4 h-4 text-primary-500 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

// Appointment Details Modal
interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
  onStatusChange: (id: string, status: Appointment['status']) => void;
  onSendReminder: (appointment: Appointment, type: 'email' | 'sms') => void;
}

function AppointmentDetailsModal({ appointment, onClose, onStatusChange, onSendReminder }: AppointmentDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-900">{appointment.customerName}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-600">{appointment.customerEmail}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-600">{appointment.customerPhone}</span>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Details</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Scissors className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-900">{appointment.service.name}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-600">{appointment.service.duration} minutes</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-600">{formatCurrency(appointment.service.price)}</span>
              </div>
            </div>
          </div>

          {/* Status & Actions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Status & Actions</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'] as const).map(status => (
                <Button
                  key={status}
                  variant={appointment.status === status ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onStatusChange(appointment.id, status)}
                >
                  {status.replace('-', ' ')}
                </Button>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSendReminder(appointment, 'email')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Reminder
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSendReminder(appointment, 'sms')}
              >
                <Phone className="w-4 h-4 mr-2" />
                SMS Reminder
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}