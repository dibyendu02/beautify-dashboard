'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  Check,
  Settings,
  Edit3,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
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

interface TimeSlot {
  startTime: string;
  endTime: string;
  maxBookings: number;
  isAvailable: boolean;
}

interface AvailabilitySchedule {
  [serviceId: string]: {
    [dayOfWeek: number]: TimeSlot[];
  };
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { startTime: '09:00', endTime: '10:00', maxBookings: 1, isAvailable: true },
  { startTime: '10:00', endTime: '11:00', maxBookings: 1, isAvailable: true },
  { startTime: '11:00', endTime: '12:00', maxBookings: 1, isAvailable: true },
  { startTime: '14:00', endTime: '15:00', maxBookings: 1, isAvailable: true },
  { startTime: '15:00', endTime: '16:00', maxBookings: 1, isAvailable: true },
  { startTime: '16:00', endTime: '17:00', maxBookings: 1, isAvailable: true },
];

// Demo services data - Same as main Services page
const DEMO_SERVICES: Service[] = [
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
];

const SERVICE_CATEGORIES = [
  'Facial Treatments',
  'Hair Services',
  'Nail Care',
  'Body Treatments',
  'Massage Therapy',
  'Skincare',
  'Makeup Services',
  'Eyebrow & Lash',
];

export default function ServiceAvailabilityPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(DEMO_SERVICES);
  const [selectedService, setSelectedService] = useState<string>(DEMO_SERVICES[0]._id);
  const [availability, setAvailability] = useState<AvailabilitySchedule>(() => {
    // Initialize with default availability for demo services
    const initialAvailability: AvailabilitySchedule = {};
    DEMO_SERVICES.forEach(service => {
      initialAvailability[service._id] = {};
      DAYS_OF_WEEK.forEach(day => {
        if (day.value >= 1 && day.value <= 5) { // Monday to Friday
          initialAvailability[service._id][day.value] = [...DEFAULT_TIME_SLOTS];
        } else {
          initialAvailability[service._id][day.value] = [];
        }
      });
    });
    return initialAvailability;
  });
  const [hasChanges, setHasChanges] = useState(false);

  const addTimeSlot = (dayOfWeek: number) => {
    if (!selectedService) return;
    
    const newSlot: TimeSlot = {
      startTime: '09:00',
      endTime: '10:00',
      maxBookings: 1,
      isAvailable: true,
    };

    setAvailability(prev => ({
      ...prev,
      [selectedService]: {
        ...prev[selectedService],
        [dayOfWeek]: [...(prev[selectedService]?.[dayOfWeek] || []), newSlot]
      }
    }));
    setHasChanges(true);
  };

  const removeTimeSlot = (dayOfWeek: number, slotIndex: number) => {
    if (!selectedService) return;

    setAvailability(prev => ({
      ...prev,
      [selectedService]: {
        ...prev[selectedService],
        [dayOfWeek]: prev[selectedService]?.[dayOfWeek]?.filter((_, index) => index !== slotIndex) || []
      }
    }));
    setHasChanges(true);
  };

  const updateTimeSlot = (dayOfWeek: number, slotIndex: number, field: keyof TimeSlot, value: any) => {
    if (!selectedService) return;

    setAvailability(prev => ({
      ...prev,
      [selectedService]: {
        ...prev[selectedService],
        [dayOfWeek]: prev[selectedService]?.[dayOfWeek]?.map((slot, index) => 
          index === slotIndex ? { ...slot, [field]: value } : slot
        ) || []
      }
    }));
    setHasChanges(true);
  };

  const copyToAllDays = (dayOfWeek: number) => {
    if (!selectedService) return;

    const sourceSlots = availability[selectedService]?.[dayOfWeek] || [];
    const updatedAvailability = { ...availability[selectedService] };

    DAYS_OF_WEEK.forEach(day => {
      if (day.value !== dayOfWeek) {
        updatedAvailability[day.value] = [...sourceSlots];
      }
    });

    setAvailability(prev => ({
      ...prev,
      [selectedService]: updatedAvailability
    }));
    setHasChanges(true);
  };

  const saveAvailability = () => {
    // Simulate saving to local storage or state management
    toast.success('Service availability updated successfully');
    setHasChanges(false);
  };

  const cancelChanges = () => {
    // Reset availability to initial state
    const initialAvailability: AvailabilitySchedule = {};
    services.forEach(service => {
      initialAvailability[service._id] = {};
      DAYS_OF_WEEK.forEach(day => {
        if (day.value >= 1 && day.value <= 5) { // Monday to Friday
          initialAvailability[service._id][day.value] = [...DEFAULT_TIME_SLOTS];
        } else {
          initialAvailability[service._id][day.value] = [];
        }
      });
    });
    setAvailability(initialAvailability);
    setHasChanges(false);
    toast.success('Changes discarded');
  };


  const removeService = (serviceId: string) => {
    if (services.length <= 1) {
      toast.error('You must have at least one service');
      return;
    }

    setServices(prev => prev.filter(s => s._id !== serviceId));
    
    // Remove availability data
    setAvailability(prev => {
      const newAvailability = { ...prev };
      delete newAvailability[serviceId];
      return newAvailability;
    });

    // Select first remaining service
    const remainingServices = services.filter(s => s._id !== serviceId);
    if (remainingServices.length > 0) {
      setSelectedService(remainingServices[0]._id);
    }

    toast.success('Service removed successfully');
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of ['00', '30']) {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();
  const currentService = services.find(s => s._id === selectedService);
  const currentAvailability = selectedService ? availability[selectedService] : {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/merchant/services')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Availability</h1>
            <p className="text-gray-600 mt-1">Configure when your services are available for booking</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => router.push('/merchant/services/new')}
            className="bg-green-500 hover:bg-green-600 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
          {hasChanges && (
            <Button
              onClick={cancelChanges}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          <Button
            onClick={saveAvailability}
            disabled={!hasChanges}
            className="!bg-blue-500 hover:!bg-blue-600 !text-white border-0 disabled:!bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">You have unsaved changes</p>
              <p className="text-sm text-yellow-700">Don't forget to save your availability settings.</p>
            </div>
          </div>
        </div>
      )}


      {/* Service Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Service
          </label>
          <div className="flex items-center space-x-3">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-[300px]"
            >
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} ({service.duration} min) - ${service.price}
                </option>
              ))}
            </select>
            {services.length > 1 && (
              <Button
                onClick={() => currentService && removeService(currentService._id)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {currentService && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="font-medium">Duration:</span> {currentService.duration} minutes
              </div>
              <div>
                <span className="font-medium">Price:</span> ${currentService.price}
              </div>
              <div>
                <span className="font-medium">Category:</span> {currentService.category}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <span className={cn(
                  'ml-1 px-2 py-1 rounded-full text-xs',
                  currentService.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                )}>
                  {currentService.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Availability Schedule */}
      {selectedService && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Availability Schedule</h3>
            <p className="text-sm text-gray-600 mt-1">
              Configure time slots when this service can be booked
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-8">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">{day.label}</h4>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => copyToAllDays(day.value)}
                        variant="outline"
                        size="sm"
                        disabled={!currentAvailability[day.value]?.length}
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                      >
                        Copy to All Days
                      </Button>
                      <Button
                        onClick={() => addTimeSlot(day.value)}
                        className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Slot
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {currentAvailability[day.value]?.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>No time slots configured</p>
                        <p className="text-sm">Click "Add Slot" to create availability</p>
                      </div>
                    ) : (
                      currentAvailability[day.value]?.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <select
                              value={slot.startTime}
                              onChange={(e) => updateTimeSlot(day.value, slotIndex, 'startTime', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            <span className="text-gray-500">to</span>
                            <select
                              value={slot.endTime}
                              onChange={(e) => updateTimeSlot(day.value, slotIndex, 'endTime', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center space-x-2">
                            <label className="text-xs text-gray-600">Max bookings:</label>
                            <input
                              type="number"
                              value={slot.maxBookings}
                              onChange={(e) => updateTimeSlot(day.value, slotIndex, 'maxBookings', parseInt(e.target.value))}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              min="1"
                              max="10"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <label className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                checked={slot.isAvailable}
                                onChange={(e) => updateTimeSlot(day.value, slotIndex, 'isAvailable', e.target.checked)}
                                className="mr-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              Available
                            </label>
                          </div>

                          <Button
                            onClick={() => removeTimeSlot(day.value, slotIndex)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}