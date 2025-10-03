'use client';

import { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star,
  Save,
  Edit2,
  Plus,
  X,
  DollarSign,
  Users,
  Upload,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BusinessHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  basePrice: number;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('business');
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Demo business data
  const [businessInfo, setBusinessInfo] = useState({
    businessName: 'Bella Beauty Salon',
    description: 'Premium beauty salon offering hair styling, nail care, facials, and spa treatments. We use only high-quality products and provide personalized service to each client.',
    address: '123 Beauty Street, Downtown, City 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@bellabeauty.com',
    website: 'www.bellabeauty.com',
    instagram: '@bellabeauty_salon',
    profileImage: null,
    logo: null as string | null
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
    { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
    { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '20:00' },
    { day: 'Saturday', isOpen: true, openTime: '08:00', closeTime: '17:00' },
    { day: 'Sunday', isOpen: false, openTime: '10:00', closeTime: '16:00' }
  ]);

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([
    { id: '1', name: 'Hair Styling', description: 'Cuts, coloring, styling, treatments', basePrice: 80 },
    { id: '2', name: 'Nail Care', description: 'Manicures, pedicures, nail art', basePrice: 45 },
    { id: '3', name: 'Facial Treatments', description: 'Deep cleansing, anti-aging, hydrating facials', basePrice: 120 },
    { id: '4', name: 'Spa Services', description: 'Massages, body treatments, relaxation', basePrice: 150 }
  ]);

  const [newCategory, setNewCategory] = useState({ name: '', description: '', basePrice: 0 });
  const [showAddCategory, setShowAddCategory] = useState(false);

  const [accountSettings, setAccountSettings] = useState({
    firstName: 'Isabella',
    lastName: 'Rodriguez',
    email: 'isabella@bellabeauty.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      emailBookings: true,
      emailPromotions: false,
      smsReminders: true,
      pushNotifications: true
    }
  });

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    toast.success('Profile saved successfully');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setLogoFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      // Update business info with the preview URL for immediate display
      setBusinessInfo(prev => ({ ...prev, logo: result as string }));
    };
    reader.readAsDataURL(file);

    toast.success('Logo uploaded successfully');
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setBusinessInfo(prev => ({ ...prev, logo: null }));
    toast.success('Logo removed');
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.description && newCategory.basePrice > 0) {
      setServiceCategories([...serviceCategories, {
        id: Date.now().toString(),
        ...newCategory
      }]);
      setNewCategory({ name: '', description: '', basePrice: 0 });
      setShowAddCategory(false);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setServiceCategories(serviceCategories.filter(cat => cat.id !== categoryId));
  };

  const tabs = [
    { id: 'business', name: 'Business Info', icon: Users },
    { id: 'hours', name: 'Business Hours', icon: Clock },
    { id: 'services', name: 'Service Categories', icon: Star },
    { id: 'account', name: 'Account Settings', icon: Edit2 }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Manage your business profile and account settings</p>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Business Info Tab */}
        {activeTab === 'business' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Business Information</h2>
            
            {/* Business Logo */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Logo
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {(logoPreview || businessInfo.logo || businessInfo.profileImage) ? (
                    <img 
                      src={(logoPreview || businessInfo.logo || businessInfo.profileImage) as string} 
                      alt="Business logo" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <div className="flex flex-col space-y-2">
                    <input
                      type="file"
                      id="profile-logo-upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-logo-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </label>
                    {(logoPreview || businessInfo.logo || businessInfo.profileImage) && (
                      <button 
                        onClick={handleRemoveLogo}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Recommended: Square image, at least 200x200px. Max file size: 5MB.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessInfo.businessName}
                  onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={businessInfo.website}
                  onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description
              </label>
              <textarea
                rows={4}
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Describe your business, services, and what makes you special..."
              />
            </div>
          </div>
        )}

        {/* Business Hours Tab */}
        {activeTab === 'hours' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Business Hours</h2>
            
            <div className="space-y-4">
              {businessHours.map((day, index) => (
                <div key={day.day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-20">
                      <span className="font-medium text-gray-900">{day.day}</span>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={day.isOpen}
                        onChange={(e) => {
                          const newHours = [...businessHours];
                          newHours[index].isOpen = e.target.checked;
                          setBusinessHours(newHours);
                        }}
                        disabled={!isEditing}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Open</span>
                    </label>
                  </div>
                  
                  {day.isOpen && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={day.openTime}
                        onChange={(e) => {
                          const newHours = [...businessHours];
                          newHours[index].openTime = e.target.value;
                          setBusinessHours(newHours);
                        }}
                        disabled={!isEditing}
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={day.closeTime}
                        onChange={(e) => {
                          const newHours = [...businessHours];
                          newHours[index].closeTime = e.target.value;
                          setBusinessHours(newHours);
                        }}
                        disabled={!isEditing}
                        className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  )}
                  
                  {!day.isOpen && (
                    <span className="text-gray-500 font-medium">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Categories Tab */}
        {activeTab === 'services' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Service Categories</h2>
              {isEditing && (
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              )}
            </div>

            {/* Add Category Form */}
            {showAddCategory && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4">Add New Service Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Base price"
                      value={newCategory.basePrice || ''}
                      onChange={(e) => setNewCategory({...newCategory, basePrice: Number(e.target.value)})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Add Category
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategory({ name: '', description: '', basePrice: 0 });
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Service Categories List */}
            <div className="space-y-4">
              {serviceCategories.map((category) => (
                <div key={category.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      <div className="flex items-center mt-2">
                        <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          Starting from ${category.basePrice}
                        </span>
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveCategory(category.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Settings Tab */}
        {activeTab === 'account' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>
            
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={accountSettings.firstName}
                      onChange={(e) => setAccountSettings({...accountSettings, firstName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={accountSettings.lastName}
                      onChange={(e) => setAccountSettings({...accountSettings, lastName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Password Change */}
              {isEditing && (
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={accountSettings.currentPassword}
                        onChange={(e) => setAccountSettings({...accountSettings, currentPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={accountSettings.newPassword}
                        onChange={(e) => setAccountSettings({...accountSettings, newPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={accountSettings.confirmPassword}
                        onChange={(e) => setAccountSettings({...accountSettings, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Preferences */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accountSettings.notifications.emailBookings}
                      onChange={(e) => setAccountSettings({
                        ...accountSettings,
                        notifications: {
                          ...accountSettings.notifications,
                          emailBookings: e.target.checked
                        }
                      })}
                      disabled={!isEditing}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Email notifications for new bookings</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accountSettings.notifications.smsReminders}
                      onChange={(e) => setAccountSettings({
                        ...accountSettings,
                        notifications: {
                          ...accountSettings.notifications,
                          smsReminders: e.target.checked
                        }
                      })}
                      disabled={!isEditing}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">SMS appointment reminders</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accountSettings.notifications.pushNotifications}
                      onChange={(e) => setAccountSettings({
                        ...accountSettings,
                        notifications: {
                          ...accountSettings.notifications,
                          pushNotifications: e.target.checked
                        }
                      })}
                      disabled={!isEditing}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Push notifications</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}