'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  ArrowUpRight,
  Download,
  ChevronUp,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
// Removed API import - using demo data
import toast from 'react-hot-toast';

interface OrderItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  revenueGrowth: number;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const statusIcons = {
  pending: RefreshCw,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: RefreshCw,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<OrderAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ orderId: '', status: '', notes: '' });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  // Demo orders data
  const demoOrders: Order[] = [
    {
      _id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'Emma Johnson',
      customerEmail: 'emma.johnson@email.com',
      customerPhone: '+1 (555) 123-4567',
      status: 'delivered',
      paymentStatus: 'paid',
      items: [
        {
          _id: 'item1',
          productId: 'prod1',
          name: 'Luxury Face Cream Set',
          price: 89.99,
          quantity: 2,
          variant: '50ml',
          image: '/images/face-cream.jpg',
        },
        {
          _id: 'item2',
          productId: 'prod2',
          name: 'Hydrating Serum',
          price: 65.00,
          quantity: 1,
          image: '/images/serum.jpg',
        }
      ],
      subtotal: 244.98,
      tax: 19.60,
      shipping: 15.00,
      total: 279.58,
      shippingAddress: {
        street: '123 Beauty Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      paymentMethod: 'Credit Card',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Gift wrap requested',
    },
    {
      _id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Sarah Williams',
      customerEmail: 'sarah.w@email.com',
      customerPhone: '+1 (555) 234-5678',
      status: 'processing',
      paymentStatus: 'paid',
      items: [
        {
          _id: 'item3',
          productId: 'prod3',
          name: 'Professional Nail Kit',
          price: 125.00,
          quantity: 1,
          image: '/images/nail-kit.jpg',
        }
      ],
      subtotal: 125.00,
      tax: 10.00,
      shipping: 12.00,
      total: 147.00,
      shippingAddress: {
        street: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'United States',
      },
      paymentMethod: 'PayPal',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: '3',
      orderNumber: 'ORD-2024-003',
      customerName: 'Maria Garcia',
      customerEmail: 'maria.garcia@email.com',
      customerPhone: '+1 (555) 345-6789',
      status: 'pending',
      paymentStatus: 'paid',
      items: [
        {
          _id: 'item4',
          productId: 'prod4',
          name: 'Makeup Brush Set',
          price: 78.50,
          quantity: 1,
          image: '/images/brushes.jpg',
        },
        {
          _id: 'item5',
          productId: 'prod5',
          name: 'Foundation Collection',
          price: 95.00,
          quantity: 1,
          variant: 'Medium',
          image: '/images/foundation.jpg',
        }
      ],
      subtotal: 173.50,
      tax: 13.88,
      shipping: 10.00,
      total: 197.38,
      shippingAddress: {
        street: '789 Palm Drive',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101',
        country: 'United States',
      },
      paymentMethod: 'Credit Card',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const demoAnalytics: OrderAnalytics = {
    totalOrders: 156,
    totalRevenue: 18750.25,
    pendingOrders: 12,
    completedOrders: 134,
    averageOrderValue: 120.19,
    revenueGrowth: 15.2,
  };

  useEffect(() => {
    fetchOrders();
    fetchAnalytics();
  }, [pagination.page, searchTerm, statusFilter, dateFrom, dateTo]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter demo data
      let filteredOrders = [...demoOrders];
      
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter(order =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query)
        );
      }
      
      if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
      }
      
      if (dateFrom) {
        filteredOrders = filteredOrders.filter(order => 
          new Date(order.createdAt) >= new Date(dateFrom)
        );
      }
      
      if (dateTo) {
        filteredOrders = filteredOrders.filter(order => 
          new Date(order.createdAt) <= new Date(dateTo)
        );
      }
      
      // Simulate pagination
      const totalItems = filteredOrders.length;
      const startIndex = (pagination.page - 1) * 10;
      const endIndex = startIndex + 10;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
      
      setOrders(paginatedOrders);
      setPagination({
        page: pagination.page,
        totalPages: Math.ceil(totalItems / 10),
        totalItems,
        limit: 10,
      });
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnalytics(demoAnalytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Order status updated successfully');
      setShowStatusModal(false);
      
      // Update order status locally
      setOrders(prev =>
        prev.map(order =>
          order._id === statusUpdate.orderId 
            ? { ...order, status: statusUpdate.status as any }
            : order
        )
      );
      
      setStatusUpdate({ orderId: '', status: '', notes: '' });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateStatus = (orderId: string, currentStatus: string) => {
    setStatusUpdate({ orderId, status: currentStatus, notes: '' });
    setShowStatusModal(true);
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
    };
    return statusFlow[currentStatus as keyof typeof statusFlow] || currentStatus;
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage your product orders and fulfillment</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.totalRevenue)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.pendingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChevronUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.averageOrderValue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {Array.isArray(orders) && orders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => {
                    const StatusIcon = statusIcons[order.status] || RefreshCw;
                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{order.orderNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.items?.length || 0} items
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customerEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            statusColors[order.status]
                          )}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <div className="relative group">
                              <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                <button
                                  onClick={() => handleUpdateStatus(order._id, order.status)}
                                  className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                >
                                  <RefreshCw className="w-3 h-3 mr-2" />
                                  Update Status
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="outline"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.totalItems}</span> results
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={pagination.page === i + 1 ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter || dateFrom || dateTo
                ? 'Try adjusting your search filters'
                : 'Orders will appear here once customers start purchasing your products'
              }
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Order #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={cn(
                        'px-2.5 py-0.5 rounded-full text-xs font-medium',
                        statusColors[selectedOrder.status]
                      )}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="font-medium">{selectedOrder.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                    {selectedOrder.customerPhone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{selectedOrder.customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div>{selectedOrder.shippingAddress.street}</div>
                      <div>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                      </div>
                      <div>{selectedOrder.shippingAddress.country}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {item.variant && (
                            <div className="text-sm text-gray-600">{item.variant}</div>
                          )}
                          <div className="text-sm text-gray-600">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </div>
                        </div>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span>{formatCurrency(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span>{formatCurrency(selectedOrder.shipping)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Update Order Status</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={statusUpdate.notes}
                  onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this status change..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                >
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}