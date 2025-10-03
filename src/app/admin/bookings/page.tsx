'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AdminLayout from '@/components/layout/AdminLayout';
import EnhancedDataTable from '@/components/enhanced/EnhancedDataTable';
import { usePaginatedApi } from '@/hooks/useApi';
import {
  Users,
  Store,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Server,
  Globe,
  Zap,
  BarChart3,
  UserCheck,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreVertical,
  Home,
  Settings,
  Database,
  FileText,
  Mail,
  Plus,
  Filter,
  Search,
  Download,
  UserX,
  UserPlus,
  Star,
  MapPin,
  Phone,
  Building,
  Crown,
  Ban,
  RefreshCw,
  XCircle,
  PlayCircle,
  PauseCircle,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface BookingData {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  merchantName: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  amount: number;
  commission: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'disputed';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
  notes?: string;
}

export default function BookingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    disputedBookings: 0,
    totalRevenue: 0,
    totalCommission: 0,
    averageBookingValue: 0,
  });

  // Demo data - replace with API calls
  const demoBookings: BookingData[] = [
    {
      id: '1',
      bookingNumber: 'BK001234',
      customerName: 'Emily Johnson',
      customerEmail: 'emily@example.com',
      merchantName: 'Bella Beauty Salon',
      serviceName: 'Haircut & Style',
      date: '2024-01-05',
      time: '14:00',
      duration: 90,
      amount: 85.00,
      commission: 8.50,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2024-01-02T10:30:00Z',
      notes: 'Customer requested blonde highlights'
    },
    {
      id: '2',
      bookingNumber: 'BK001235',
      customerName: 'Marcus Thompson',
      customerEmail: 'marcus@example.com',
      merchantName: 'Luxe Spa & Wellness',
      serviceName: 'Deep Tissue Massage',
      date: '2024-01-05',
      time: '16:30',
      duration: 60,
      amount: 120.00,
      commission: 12.00,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2024-01-01T15:45:00Z'
    },
    {
      id: '3',
      bookingNumber: 'BK001236',
      customerName: 'Sofia Martinez',
      customerEmail: 'sofia@example.com',
      merchantName: 'Urban Barber Co.',
      serviceName: 'Beard Trim',
      date: '2024-01-06',
      time: '11:00',
      duration: 30,
      amount: 35.00,
      commission: 3.50,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2024-01-03T09:15:00Z'
    },
    {
      id: '4',
      bookingNumber: 'BK001237',
      customerName: 'Jennifer Lee',
      customerEmail: 'jennifer@example.com',
      merchantName: 'Elite Nails Studio',
      serviceName: 'Gel Manicure',
      date: '2024-01-04',
      time: '13:00',
      duration: 45,
      amount: 45.00,
      commission: 4.50,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: '2024-01-02T11:20:00Z',
      notes: 'Customer cancelled due to illness'
    },
    {
      id: '5',
      bookingNumber: 'BK001238',
      customerName: 'Robert Wilson',
      customerEmail: 'robert@example.com',
      merchantName: 'Glow Aesthetic Center',
      serviceName: 'Botox Treatment',
      date: '2024-01-07',
      time: '15:00',
      duration: 45,
      amount: 350.00,
      commission: 35.00,
      status: 'disputed',
      paymentStatus: 'paid',
      createdAt: '2024-01-01T14:30:00Z',
      notes: 'Customer unhappy with results'
    },
    {
      id: '6',
      bookingNumber: 'BK001239',
      customerName: 'Lisa Chen',
      customerEmail: 'lisa@example.com',
      merchantName: 'Bella Beauty Salon',
      serviceName: 'Hair Color',
      date: '2024-01-08',
      time: '10:00',
      duration: 180,
      amount: 150.00,
      commission: 15.00,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2024-01-03T16:45:00Z'
    },
  ];

  useEffect(() => {
    // Calculate stats from demo data
    const totalBookings = demoBookings.length;
    const confirmedBookings = demoBookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = demoBookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = demoBookings.filter(b => b.status === 'cancelled').length;
    const disputedBookings = demoBookings.filter(b => b.status === 'disputed').length;
    const totalRevenue = demoBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amount, 0);
    const totalCommission = demoBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.commission, 0);
    const averageBookingValue = totalRevenue / demoBookings.filter(b => b.paymentStatus === 'paid').length;

    setStats({
      totalBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      disputedBookings,
      totalRevenue,
      totalCommission,
      averageBookingValue: averageBookingValue || 0,
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3" />;
      case 'disputed':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const handleBulkAction = (action: string, bookingIds: string[]) => {
    console.log(`Bulk ${action} for bookings:`, bookingIds);
    // Implement bulk actions
  };

  const handleBookingAction = (action: string, booking: BookingData) => {
    console.log(`${action} booking:`, booking);
    // Implement individual booking actions
  };

  const statsCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      icon: Calendar,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      darkColor: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: stats.completedBookings.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      darkColor: 'text-green-600',
    },
    {
      title: 'Disputed',
      value: stats.disputedBookings.toString(),
      icon: AlertTriangle,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      darkColor: 'text-red-600',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      darkColor: 'text-purple-600',
    },
  ];

  const columns = [
    {
      key: 'bookingNumber',
      label: 'Booking #',
      sortable: true,
      render: (value: string, row: BookingData) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">
            {new Date(row.createdAt).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (value: string, row: BookingData) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">{row.customerEmail}</div>
        </div>
      ),
    },
    {
      key: 'merchantName',
      label: 'Merchant',
      sortable: true,
      render: (value: string, row: BookingData) => (
        <div>
          <div className="font-medium text-slate-900">{value}</div>
          <div className="text-sm text-slate-500">{row.serviceName}</div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Appointment',
      sortable: true,
      render: (value: string, row: BookingData) => (
        <div>
          <div className="font-medium text-slate-900">
            {new Date(value).toLocaleDateString()}
          </div>
          <div className="text-sm text-slate-500">
            {row.time} ({row.duration}min)
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: number, row: BookingData) => (
        <div>
          <div className="font-medium text-slate-900">{formatCurrency(value)}</div>
          <div className="text-sm text-slate-500">
            Commission: {formatCurrency(row.commission)}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          getStatusColor(value)
        )}>
          {getStatusIcon(value)}
          <span className="ml-1 capitalize">{value}</span>
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      sortable: true,
      render: (value: string) => (
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          getPaymentStatusColor(value)
        )}>
          <span className="capitalize">{value}</span>
        </span>
      ),
    },
  ];

  const tableFilters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Pending', value: 'pending' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Disputed', value: 'disputed' },
      ],
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      type: 'select' as const,
      options: [
        { label: 'Paid', value: 'paid' },
        { label: 'Pending', value: 'pending' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      key: 'date',
      label: 'Date',
      type: 'date' as const,
    },
  ];

  const customActions = [
    {
      label: 'Contact Customer',
      icon: Mail,
      onClick: (booking: BookingData) => handleBookingAction('contact_customer', booking),
      color: 'text-blue-600 hover:text-blue-800',
      title: 'Send email to customer',
    },
    {
      label: 'Resolve Dispute',
      icon: MessageSquare,
      onClick: (booking: BookingData) => handleBookingAction('resolve_dispute', booking),
      color: 'text-orange-600 hover:text-orange-800',
      title: 'Open dispute resolution',
    },
    {
      label: 'Refund',
      icon: CreditCard,
      onClick: (booking: BookingData) => handleBookingAction('refund', booking),
      color: 'text-red-600 hover:text-red-800',
      title: 'Process refund',
    },
  ];

  const notifications = [
    {
      id: '1',
      title: 'Dispute Escalated',
      message: 'Booking BK001238 requires immediate attention',
      time: '2 min ago',
      unread: true,
    },
    {
      id: '2',
      title: 'High Volume Day',
      message: '50+ bookings scheduled for today',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Payment Failed',
      message: 'Multiple payment failures detected',
      time: '2 hours ago',
      unread: false,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Booking Management</h1>
            <p className="text-slate-600 mt-1">
              Monitor and manage all platform bookings
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Bookings
            </Button>
            <Button size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('p-3 rounded-xl', stat.lightColor)}>
                    <Icon className={cn('w-6 h-6', stat.darkColor)} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Revenue</span>
                <span className="font-semibold text-slate-900">{formatCurrency(stats.totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Platform Commission</span>
                <span className="font-semibold text-green-600">{formatCurrency(stats.totalCommission)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Average Booking Value</span>
                <span className="font-semibold text-slate-900">{formatCurrency(stats.averageBookingValue)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Booking Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Confirmed</span>
                <span className="font-semibold text-blue-600">{stats.confirmedBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Completed</span>
                <span className="font-semibold text-green-600">{stats.completedBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Cancelled</span>
                <span className="font-semibold text-gray-600">{stats.cancelledBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Disputed</span>
                <span className="font-semibold text-red-600">{stats.disputedBookings}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertCircle className="w-4 h-4 mr-2" />
                Handle Disputes ({stats.disputedBookings})
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Process Refunds
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Send Reminders
              </Button>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">All Bookings</h2>
            <p className="text-slate-600 mt-1">
              Comprehensive view of all platform bookings and transactions
            </p>
          </div>
          
          <EnhancedDataTable
            data={demoBookings}
            columns={columns}
            searchable={true}
            sortable={true}
            filterable={true}
            selectable={true}
            pagination={true}
            pageSize={10}
            filters={tableFilters}
            customActions={customActions}
            onView={(booking) => handleBookingAction('view', booking)}
            onEdit={(booking) => handleBookingAction('edit', booking)}
            onBulkAction={handleBulkAction}
          />
        </div>
      </div>
    </AdminLayout>
  );
}