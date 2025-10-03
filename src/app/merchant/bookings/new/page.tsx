'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { createBooking } from '@/store/slices/bookingSlice';
import { fetchServices } from '@/store/slices/serviceSlice';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  DollarSign,
  Save,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn, formatCurrency, generateTimeSlots } from '@/lib/utils';

interface BookingFormData {
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  notes: string;
  status: string;
}

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { services } = useSelector((state: RootState) => state.service);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    bookingDate: '',
    bookingTime: '',
    notes: '',
    status: 'confirmed',
  });

  // Check if there's a pre-selected service from URL params
  const preSelectedServiceId = searchParams.get('service');

  useEffect(() => {
    dispatch(fetchServices({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (preSelectedServiceId && services.length > 0) {
      const service = services.find(s => s.id === preSelectedServiceId);
      if (service) {
        handleServiceChange(preSelectedServiceId);
      }
    }
  }, [preSelectedServiceId, services]);

  useEffect(() => {
    if (formData.bookingDate && selectedService) {
      // Generate available time slots
      // In a real app, you'd fetch this from the API based on existing bookings
      const slots = generateTimeSlots('09:00', '18:00', selectedService.duration);
      setAvailableSlots(slots);
    }
  }, [formData.bookingDate, selectedService]);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service);
    setFormData(prev => ({
      ...prev,
      serviceId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const bookingData = {
        ...formData,
        bookingDate: `${formData.bookingDate}T${formData.bookingTime}:00.000Z`,
        servicePrice: selectedService?.price || 0,
        totalAmount: selectedService?.price || 0,
        duration: selectedService?.duration || 30,
        serviceName: selectedService?.name || '',
      };

      await dispatch(createBooking(bookingData)).unwrap();
      router.push('/merchant/bookings');
    } catch (error) {
      console.error('Failed to create booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalAmount = () => {
    return selectedService?.price || 0;
  };

  const getBookingDuration = () => {
    return selectedService?.duration || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Booking</h1>
          <p className="text-gray-600 mt-1">Schedule a new appointment for a customer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 text-primary-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    placeholder="Enter customer's full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        required
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        placeholder="customer@email.com"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Service Selection</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Service *
                  </label>
                  <select
                    required
                    value={formData.serviceId}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Choose a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title} - {formatCurrency(service.price)} ({service.duration}min)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedService && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <h3 className="font-medium text-primary-900 mb-2">{selectedService.name}</h3>
                    <p className="text-sm text-primary-700 mb-3">{selectedService.description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-primary-900">{formatCurrency(selectedService.price)}</p>
                        <p className="text-primary-600">Price</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-primary-900">{selectedService.duration}min</p>
                        <p className="text-primary-600">Duration</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-primary-900">{selectedService.category}</p>
                        <p className="text-primary-600">Category</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Date & Time</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.bookingDate}
                    onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {formData.bookingDate && availableSlots.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Time Slots *
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleInputChange('bookingTime', slot)}
                          className={cn(
                            'p-2 text-sm border rounded-lg transition-colors',
                            formData.bookingTime === slot
                              ? 'bg-primary-500 text-white border-primary-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special requests or notes for this appointment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{formData.customerName || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{selectedService?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formData.bookingDate || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{formData.bookingTime || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{getBookingDuration()}min</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Total Amount:</span>
                  <span className="font-bold text-lg text-gray-900">
                    {formatCurrency(getTotalAmount())}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Creating Booking...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Create Booking
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-medium text-blue-900 mb-2">💡 Quick Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Double-check customer contact information</li>
                <li>• Confirm service details and pricing</li>
                <li>• Add any special requirements in notes</li>
                <li>• Send confirmation to customer</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}