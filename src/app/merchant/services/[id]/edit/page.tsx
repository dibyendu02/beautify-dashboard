'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  DollarSign,
  Clock,
  Tag,
  FileText,
  Image as ImageIcon,
  Save,
  Scissors,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
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

interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  isActive: boolean;
  images: string[];
  features: string[];
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

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    category: '',
    price: 0,
    duration: 30,
    isActive: true,
    images: [],
    features: [],
  });
  const [newFeature, setNewFeature] = useState('');

  const serviceId = params.id as string;

  const categories = [
    'Facial Treatments',
    'Hair Services',
    'Nail Care',
    'Body Treatments',
    'Massage Therapy',
    'Skincare',
    'Makeup Services',
    'Eyebrow & Lash',
  ];

  useEffect(() => {
    // Simulate loading and find service from demo data
    setIsLoading(true);
    setTimeout(() => {
      const foundService = DEMO_SERVICES.find(s => s._id === serviceId);
      if (foundService) {
        setService(foundService);
        setFormData({
          name: foundService.name,
          description: foundService.description,
          category: foundService.category,
          price: foundService.price,
          duration: foundService.duration,
          isActive: foundService.isActive,
          images: foundService.images,
          features: foundService.features || [],
        });
      }
      setIsLoading(false);
    }, 500);
  }, [serviceId]);

  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, you would upload to Cloudinary or another service
      // For now, we'll create object URLs for preview
      const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Service updated successfully');
      router.push(`/merchant/services/${serviceId}`);
    } catch (error) {
      console.error('Failed to update service:', error);
      toast.error('Failed to update service');
    } finally {
      setIsSubmitting(false);
    }
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
        <p className="text-gray-600 mb-4">The service you're trying to edit doesn't exist.</p>
        <Button onClick={() => router.push('/merchant/services')} className="bg-blue-500 hover:bg-blue-600 text-white">
          Back to Services
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push('/merchant/services')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
          <p className="text-gray-600 mt-1">Update your service information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-pink-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Deep Cleansing Facial"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your service in detail..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Duration */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Pricing & Duration</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (EUR) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      required
                      min="15"
                      step="15"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 30)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Service Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Tag className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Service Features</h2>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature (e.g., Includes moisturizer)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddFeature}
                    variant="outline"
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Service Images */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <ImageIcon className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Service Images</h2>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload images or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, JPEG up to 5MB each
                    </p>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="w-full h-24 bg-gradient-to-br from-pink-100 to-blue-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <Scissors className="w-8 h-8 text-pink-400" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h2>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <p className="text-xs text-gray-500">
                  When active, customers can book this service
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full !bg-blue-500 hover:!bg-blue-600 !text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Save className="w-4 h-4 mr-2" />
                      Update Service
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/merchant/services')}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-right max-w-[150px] truncate">{formData.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{formData.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">€{formData.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formData.duration}min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    formData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  )}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Features:</span>
                  <span className="font-medium">{formData.features.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Images:</span>
                  <span className="font-medium">{formData.images.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
