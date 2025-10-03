'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Save,
  Eye,
  EyeOff,
  Upload,
  Clock,
  MapPin,
  Phone,
  Mail,
  Camera,
  Loader2,
  ExternalLink,
  AlertTriangle,
  Users,
  Key,
  Plus,
  Trash2,
  Edit,
  Copy,
  Calendar as CalendarIcon,
  Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { merchantService, calendarService } from '@/services/api';
import { CalendarIntegration } from '@/services/calendar';
import toast from 'react-hot-toast';

const mockSettings = {
  profile: {
    businessName: 'Elegant Beauty Studio',
    ownerName: 'Sarah Johnson',
    email: 'sarah@elegantbeauty.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Downtown, NY 10001',
    website: 'www.elegantbeauty.com',
    description: 'Premium beauty services in the heart of downtown. We specialize in facial treatments, hair styling, and nail care.',
    logo: null,
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '19:00', closed: false },
      saturday: { open: '10:00', close: '17:00', closed: false },
      sunday: { open: '', close: '', closed: true },
    },
  },
  notifications: {
    emailBookings: true,
    emailCancellations: true,
    emailReviews: true,
    emailPromotions: false,
    smsBookings: true,
    smsCancellations: true,
    smsReminders: true,
    pushNotifications: true,
  },
  security: {
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 60,
  },
  payment: {
    stripeConnected: true,
    paypalConnected: false,
    acceptCash: true,
    acceptCards: true,
    processingFee: 2.9,
  },
  integrations: {
    googleCalendar: { connected: false, email: '' },
    appleCalendar: { connected: false, email: '' },
    outlookCalendar: { connected: false, email: '' },
    instagramBusiness: { connected: false, handle: '' },
    facebookBusiness: { connected: false, pageId: '' },
    googleMyBusiness: { connected: false, businessId: '' },
    apiKeys: [
      { id: 1, name: 'Booking System API', key: 'bk_live_...', created: '2024-01-15', lastUsed: '2024-09-20' },
      { id: 2, name: 'Analytics API', key: 'ak_live_...', created: '2024-02-10', lastUsed: '2024-09-19' },
    ],
  },
  team: {
    members: [
      { id: 1, name: 'Sarah Johnson', email: 'sarah@elegantbeauty.com', role: 'owner', permissions: ['all'], avatar: null, status: 'active' },
      { id: 2, name: 'Maria Garcia', email: 'maria@elegantbeauty.com', role: 'manager', permissions: ['bookings', 'customers', 'services'], avatar: null, status: 'active' },
      { id: 3, name: 'Emma Wilson', email: 'emma@elegantbeauty.com', role: 'staff', permissions: ['bookings'], avatar: null, status: 'active' },
    ],
    invitations: [
      { id: 1, email: 'john@beautify.com', role: 'staff', permissions: ['bookings'], sentAt: '2024-09-18', status: 'pending' },
    ],
  },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState(mockSettings);
  const [showPassword, setShowPassword] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [stripeAccount, setStripeAccount] = useState<any>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [platformFees, setPlatformFees] = useState<any>(null);
  const [calendarIntegrations, setCalendarIntegrations] = useState<CalendarIntegration[]>([]);
  const [calendarLoading, setCalendarLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (activeTab === 'payment') {
      fetchStripeAccount();
      fetchPlatformFees();
    }
    if (activeTab === 'integrations') {
      fetchCalendarIntegrations();
    }
  }, [activeTab]);

  useEffect(() => {
    // Check for Stripe onboarding success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast.success('Stripe account connected successfully!');
      fetchStripeAccount();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchStripeAccount = async () => {
    // Using demo data instead of API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const demoStripeAccount = {
      accountId: 'acct_demo123',
      connected: true,
      details_submitted: true,
      charges_enabled: true,
      payouts_enabled: true,
      business_profile: {
        name: 'Demo Beauty Salon',
        support_email: 'support@demosalon.com'
      }
    };
    setStripeAccount(demoStripeAccount);
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        stripeConnected: demoStripeAccount.connected,
      }
    }));
  };

  const fetchPlatformFees = async () => {
    // Using demo data instead of API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const demoPlatformFees = {
      application_fee_percent: 2.9,
      stripe_fee_percent: 2.9,
      fixed_fee_cents: 30,
      currency: 'eur'
    };
    setPlatformFees(demoPlatformFees);
  };

  const fetchCalendarIntegrations = async () => {
    try {
      const response = await calendarService.getIntegrations();
      if (response.success && response.data) {
        setCalendarIntegrations(response.data);
      }
    } catch (error) {
      console.error('Error fetching calendar integrations:', error);
    }
  };

  const handleCalendarConnect = async (provider: 'google' | 'outlook' | 'apple') => {
    try {
      setCalendarLoading(prev => ({ ...prev, [provider]: true }));
      
      const response = await calendarService.generateAuthUrl(provider);
      if (response.success && response.authUrl) {
        // Redirect to OAuth authorization URL
        window.location.href = response.authUrl;
      } else {
        toast.error(response.message || 'Failed to generate authorization URL');
      }
    } catch (error) {
      console.error('Calendar connect error:', error);
      toast.error('Failed to connect calendar');
    } finally {
      setCalendarLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleCalendarDisconnect = async (integrationId: string, providerName: string) => {
    if (!confirm(`Are you sure you want to disconnect ${providerName} Calendar? This will stop syncing all appointments.`)) {
      return;
    }

    try {
      setCalendarLoading(prev => ({ ...prev, [providerName]: true }));
      
      const response = await calendarService.disconnectIntegration(integrationId);
      if (response.success) {
        toast.success(`${providerName} Calendar disconnected successfully`);
        fetchCalendarIntegrations(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to disconnect calendar');
      }
    } catch (error) {
      console.error('Calendar disconnect error:', error);
      toast.error('Failed to disconnect calendar');
    } finally {
      setCalendarLoading(prev => ({ ...prev, [providerName]: false }));
    }
  };

  const handleTestCalendarConnection = async (integrationId: string, providerName: string) => {
    try {
      setCalendarLoading(prev => ({ ...prev, [`test-${providerName}`]: true }));
      
      const response = await calendarService.testConnection(integrationId);
      if (response.success) {
        toast.success(`${providerName} Calendar connection is working properly`);
      } else {
        toast.error(response.message || 'Calendar connection test failed');
      }
    } catch (error) {
      console.error('Calendar test error:', error);
      toast.error('Failed to test calendar connection');
    } finally {
      setCalendarLoading(prev => ({ ...prev, [`test-${providerName}`]: false }));
    }
  };

  const getCalendarIntegration = (provider: string) => {
    return calendarIntegrations.find(integration => integration.provider === provider);
  };

  const handleStripeConnect = async () => {
    try {
      setStripeLoading(true);
      
      if (stripeAccount?.connected) {
        // Already connected - redirect to Stripe dashboard
        // Simulate dashboard link creation
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('Stripe dashboard opened (demo mode)');
        // In demo mode, just show a success message instead of opening external link
      } else {
        // Not connected - start onboarding process
        let accountId = stripeAccount?.accountId;
        
        if (!accountId) {
          // Create new Stripe Connect account
          // Simulate account creation
          await new Promise(resolve => setTimeout(resolve, 800));
          accountId = 'acct_demo123';
        }
        
        // Generate onboarding link
        // Simulate onboarding link creation
        await new Promise(resolve => setTimeout(resolve, 600));
        toast.success('Stripe account setup completed (demo mode)');
        // Update local state to show connected status
        const demoAccount = {
          accountId: accountId,
          connected: true,
          details_submitted: true,
          charges_enabled: true,
          payouts_enabled: true,
          business_profile: {
            name: 'Demo Beauty Salon',
            support_email: 'support@demosalon.com'
          }
        };
        setStripeAccount(demoAccount);
        setSettings(prev => ({
          ...prev,
          payment: {
            ...prev.payment,
            stripeConnected: true,
          }
        }));
      }
    } catch (error: any) {
      console.error('Stripe connection error:', error);
      toast.error(error.message || 'Failed to manage Stripe connection');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleStripeDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your Stripe account? This will disable card payments.')) {
      return;
    }

    try {
      setStripeLoading(true);
      // Simulate account disconnection
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Stripe account disconnected successfully (demo mode)');
      setStripeAccount(null);
      setSettings(prev => ({
        ...prev,
        payment: {
          ...prev.payment,
          stripeConnected: false,
        }
      }));
    } catch (error: any) {
      console.error('Stripe disconnect error:', error);
      toast.error(error.message || 'Failed to disconnect Stripe account');
    } finally {
      setStripeLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Business Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payment', label: 'Payment Settings', icon: CreditCard },
    { id: 'integrations', label: 'API & Integrations', icon: Globe },
    { id: 'team', label: 'Team Management', icon: Users },
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleSave = () => {
    // Save settings logic here
    setUnsavedChanges(false);
    console.log('Settings saved:', settings);
  };

  const updateProfile = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
    setUnsavedChanges(true);
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
      // Update settings with the preview URL for immediate display
      updateProfile('logo', result);
    };
    reader.readAsDataURL(file);

    toast.success('Logo uploaded successfully');
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    updateProfile('logo', null);
    toast.success('Logo removed');
  };

  const updateBusinessHours = (day: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        businessHours: {
          ...prev.profile.businessHours,
          [day]: { ...prev.profile.businessHours[day as keyof typeof prev.profile.businessHours], [field]: value }
        }
      }
    }));
    setUnsavedChanges(true);
  };

  const updateNotifications = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value }
    }));
    setUnsavedChanges(true);
  };

  const updateSecurity = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [field]: value }
    }));
    setUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your business preferences and configurations</p>
        </div>
        {unsavedChanges && (
          <Button onClick={handleSave} className="bg-primary-500 hover:bg-primary-600 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            {/* Business Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                  
                  {/* Business Logo */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-primary-100 rounded-xl flex items-center justify-center overflow-hidden">
                        {logoPreview || settings.profile.logo ? (
                          <img 
                            src={logoPreview || settings.profile.logo} 
                            alt="Business Logo" 
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <Camera className="w-8 h-8 text-primary-600" />
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </label>
                        {(logoPreview || settings.profile.logo) && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleRemoveLogo}
                            className="text-black hover:text-black hover:bg-gray-50 border-gray-300"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: Square image, at least 200x200px. Max file size: 5MB.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={settings.profile.businessName}
                        onChange={(e) => updateProfile('businessName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        value={settings.profile.ownerName}
                        onChange={(e) => updateProfile('ownerName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => updateProfile('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <input
                      type="text"
                      value={settings.profile.address}
                      onChange={(e) => updateProfile('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={settings.profile.website}
                      onChange={(e) => updateProfile('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description
                    </label>
                    <textarea
                      value={settings.profile.description}
                      onChange={(e) => updateProfile('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Business Hours */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Business Hours</h4>
                  <div className="space-y-3">
                    {days.map((day) => {
                      const dayData = settings.profile.businessHours[day as keyof typeof settings.profile.businessHours];
                      return (
                        <div key={day} className="flex items-center space-x-4">
                          <div className="w-24">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {day}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={!dayData.closed}
                              onChange={(e) => updateBusinessHours(day, 'closed', !e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-600">Open</span>
                          </div>
                          {!dayData.closed && (
                            <>
                              <input
                                type="time"
                                value={dayData.open}
                                onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                              <span className="text-sm text-gray-500">to</span>
                              <input
                                type="time"
                                value={dayData.close}
                                onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Email Notifications</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'emailBookings', label: 'New bookings' },
                          { key: 'emailCancellations', label: 'Booking cancellations' },
                          { key: 'emailReviews', label: 'Customer reviews' },
                          { key: 'emailPromotions', label: 'Promotional updates' },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{item.label}</span>
                            <input
                              type="checkbox"
                              checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                              onChange={(e) => updateNotifications(item.key, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">SMS Notifications</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'smsBookings', label: 'New bookings' },
                          { key: 'smsCancellations', label: 'Booking cancellations' },
                          { key: 'smsReminders', label: 'Appointment reminders' },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{item.label}</span>
                            <input
                              type="checkbox"
                              checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                              onChange={(e) => updateNotifications(item.key, e.target.checked)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Push Notifications</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Browser notifications</span>
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushNotifications}
                          onChange={(e) => updateNotifications('pushNotifications', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <Button
                        variant={settings.security.twoFactorAuth ? "default" : "outline"}
                        onClick={() => updateSecurity('twoFactorAuth', !settings.security.twoFactorAuth)}
                      >
                        {settings.security.twoFactorAuth ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Login Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security.loginAlerts}
                        onChange={(e) => updateSecurity('loginAlerts', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Session Timeout</h4>
                        <p className="text-sm text-gray-600">Automatically log out after inactive period</p>
                      </div>
                      <select
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSecurity('sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={0}>Never</option>
                      </select>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-yellow-800">Change Password</h4>
                        <p className="text-sm text-yellow-700">Update your account password</p>
                      </div>
                      <Button variant="outline" className="border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Configuration</h3>
                  
                  <div className="space-y-4">
                    {/* Platform Payment Flow Info */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Platform Payment Flow
                      </h4>
                      <p className="text-sm text-blue-800 mb-2">
                        Payments flow through our secure platform: Customer → Platform → You
                      </p>
                      <div className="text-xs text-blue-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Customers pay the platform directly</li>
                          <li>Platform collects processing fees</li>
                          <li>Remaining amount is transferred to your account</li>
                          <li>You receive automated payouts from Stripe</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-900">Stripe Connect Integration</h4>
                            {stripeAccount?.connected && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Connected
                              </span>
                            )}
                            {!stripeAccount?.connected && stripeAccount?.accountId && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                Setup Required
                              </span>
                            )}
                            {!stripeAccount?.accountId && (
                              <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Not Connected
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Accept credit card payments through Stripe Connect
                          </p>
                          {stripeAccount?.connected && (
                            <div className="text-xs text-gray-500">
                              <p>Account: {stripeAccount.email || stripeAccount.accountId}</p>
                              {stripeAccount.payoutsEnabled && (
                                <p className="text-green-600">✓ Payouts enabled</p>
                              )}
                              {stripeAccount.chargesEnabled && (
                                <p className="text-green-600">✓ Charges enabled</p>
                              )}
                            </div>
                          )}
                          {!stripeAccount?.connected && stripeAccount?.accountId && (
                            <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded mt-2">
                              <AlertTriangle className="w-3 h-3 inline mr-1" />
                              Complete your Stripe setup to start accepting payments
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          onClick={handleStripeConnect}
                          disabled={stripeLoading}
                          className="flex items-center"
                        >
                          {stripeLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          {stripeAccount?.connected ? (
                            <>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Manage Stripe
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4 mr-2" />
                              {stripeAccount?.accountId ? 'Complete Setup' : 'Connect Stripe'}
                            </>
                          )}
                        </Button>
                        
                        {stripeAccount?.connected && (
                          <Button 
                            variant="outline"
                            onClick={handleStripeDisconnect}
                            disabled={stripeLoading}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Disconnect
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">PayPal Integration</h4>
                          <p className="text-sm text-gray-600">Accept PayPal payments</p>
                        </div>
                        <span className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          settings.payment.paypalConnected
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        )}>
                          {settings.payment.paypalConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <Button variant="outline">
                        {settings.payment.paypalConnected ? 'Manage' : 'Connect'} PayPal
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Accepted Payment Methods</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Credit/Debit Cards</span>
                          <input
                            type="checkbox"
                            checked={settings.payment.acceptCards}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              payment: { ...prev.payment, acceptCards: e.target.checked }
                            }))}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Cash Payments</span>
                          <input
                            type="checkbox"
                            checked={settings.payment.acceptCash}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              payment: { ...prev.payment, acceptCash: e.target.checked }
                            }))}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Platform Processing Fees</h4>
                      {platformFees ? (
                        <div className="space-y-2">
                          <p className="text-sm text-blue-800">
                            Stripe Processing: {platformFees.stripeProcessingFee}% + ${platformFees.stripeFixedFee}
                          </p>
                          <p className="text-sm text-blue-800">
                            Platform Fee: {platformFees.platformFee}%
                          </p>
                          <p className="text-sm text-blue-800 font-medium">
                            Total Fee: {platformFees.totalFeePercentage}% + ${platformFees.stripeFixedFee} per transaction
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-blue-800 mb-3">
                          Current processing fee: {settings.payment.processingFee}% per transaction
                        </p>
                      )}
                      <p className="text-xs text-blue-700 mt-3">
                        Processing fees are automatically deducted from your payments. You receive the remaining amount via Stripe payouts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API & Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">API & Integrations</h3>
                  
                  {/* Calendar Integrations */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Calendar Integrations</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'google', name: 'Google Calendar', icon: '📅' },
                        { key: 'apple', name: 'Apple Calendar', icon: '🍎' },
                        { key: 'outlook', name: 'Outlook Calendar', icon: '📧' },
                      ].map((provider) => {
                        const integration = getCalendarIntegration(provider.key);
                        const isConnected = integration?.isActive && integration?.syncStatus === 'active';
                        const isLoading = calendarLoading[provider.key];
                        const isTestLoading = calendarLoading[`test-${provider.key}`];
                        
                        return (
                          <div key={provider.key} className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="text-2xl mr-3">{provider.icon}</span>
                                <div>
                                  <h5 className="text-sm font-medium text-gray-900">{provider.name}</h5>
                                  <p className="text-sm text-gray-600">
                                    {isConnected 
                                      ? `Connected • Last sync: ${integration?.lastSyncAt ? new Date(integration.lastSyncAt).toLocaleDateString() : 'Never'}` 
                                      : 'Sync appointments automatically'
                                    }
                                  </p>
                                  {integration?.syncStatus === 'error' && (
                                    <p className="text-xs text-red-600 mt-1">Sync error - needs attention</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {isConnected && (
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleTestCalendarConnection(integration!.id, provider.name)}
                                    disabled={isTestLoading}
                                  >
                                    {isTestLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test'}
                                  </Button>
                                )}
                                <Button 
                                  variant={isConnected ? "outline" : "default"}
                                  size="sm"
                                  onClick={() => isConnected 
                                    ? handleCalendarDisconnect(integration!.id, provider.name)
                                    : handleCalendarConnect(provider.key as 'google' | 'outlook' | 'apple')
                                  }
                                  disabled={isLoading}
                                >
                                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                  {isConnected ? 'Disconnect' : 'Connect'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Social Media Integrations */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Social Media & Marketing</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'instagramBusiness', name: 'Instagram Business', icon: '📸', desc: 'Showcase your work and attract customers' },
                        { key: 'facebookBusiness', name: 'Facebook Business', icon: '👥', desc: 'Manage your business page and bookings' },
                        { key: 'googleMyBusiness', name: 'Google My Business', icon: '🗺️', desc: 'Improve local search visibility' },
                      ].map((integration) => (
                        <div key={integration.key} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{integration.icon}</span>
                              <div>
                                <h5 className="text-sm font-medium text-gray-900">{integration.name}</h5>
                                <p className="text-sm text-gray-600">{integration.desc}</p>
                              </div>
                            </div>
                            <Button 
                              variant={settings.integrations[integration.key as keyof typeof settings.integrations].connected ? "outline" : "default"}
                              size="sm"
                            >
                              {settings.integrations[integration.key as keyof typeof settings.integrations].connected ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* API Keys */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">API Keys</h4>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Generate New Key
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {settings.integrations.apiKeys.map((apiKey) => (
                        <div key={apiKey.id} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">{apiKey.name}</h5>
                              <div className="flex items-center space-x-4 mt-1">
                                <p className="text-xs text-gray-500">Created: {apiKey.created}</p>
                                <p className="text-xs text-gray-500">Last used: {apiKey.lastUsed}</p>
                              </div>
                              <div className="flex items-center mt-2">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{apiKey.key}</code>
                                <Button variant="ghost" size="sm" className="ml-2">
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Management Tab */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Management</h3>
                  
                  {/* Team Members */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">Team Members</h4>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Invite Member
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {settings.team.members.map((member) => (
                        <div key={member.id} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                {member.avatar ? (
                                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                                ) : (
                                  <User className="w-5 h-5 text-primary-600" />
                                )}
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-gray-900">{member.name}</h5>
                                <p className="text-sm text-gray-600">{member.email}</p>
                                <div className="flex items-center mt-1">
                                  <span className={cn(
                                    'px-2 py-1 text-xs font-medium rounded-full capitalize',
                                    member.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                                    member.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                  )}>
                                    {member.role}
                                  </span>
                                  <span className={cn(
                                    'ml-2 px-2 py-1 text-xs font-medium rounded-full',
                                    member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  )}>
                                    {member.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              {member.role !== 'owner' && (
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-xs text-gray-500">
                              Permissions: {member.permissions.includes('all') ? 'All permissions' : member.permissions.join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pending Invitations */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Pending Invitations</h4>
                    <div className="space-y-3">
                      {settings.team.invitations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No pending invitations
                        </div>
                      ) : (
                        settings.team.invitations.map((invitation) => (
                          <div key={invitation.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="text-sm font-medium text-gray-900">{invitation.email}</h5>
                                <div className="flex items-center mt-1">
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                                    {invitation.role}
                                  </span>
                                  <span className="ml-2 text-xs text-gray-500">
                                    Sent: {invitation.sentAt}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Permissions: {invitation.permissions.join(', ')}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                  Resend
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Role Permissions */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="text-sm font-medium text-blue-900 mb-2">Role Permissions</h5>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div><strong>Owner:</strong> Full access to all features and settings</div>
                      <div><strong>Manager:</strong> Can manage bookings, customers, services, and view analytics</div>
                      <div><strong>Staff:</strong> Can view and manage assigned bookings only</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}