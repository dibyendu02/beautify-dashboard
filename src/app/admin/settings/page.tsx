'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Globe,
  Mail,
  Bell,
  Database,
  Key,
  Users,
  CreditCard,
  FileText,
  ToggleLeft,
  ToggleRight,
  Save,
  AlertCircle,
  Check,
  Lock,
  Smartphone,
  Server,
  Cloud,
  Zap,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import AdminLayout from '@/components/layout/AdminLayout';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

interface PlatformSettings {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    allowRegistrations: boolean;
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
  };
  payments: {
    stripePublishableKey: string;
    platformFeePercentage: number;
    minimumPayoutAmount: number;
    payoutSchedule: 'daily' | 'weekly' | 'monthly';
    allowedPaymentMethods: string[];
  };
  security: {
    requireTwoFactor: boolean;
    passwordMinLength: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableAuditLog: boolean;
    ipWhitelist: string[];
  };
  communications: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    enableNotifications: boolean;
    enableSmsNotifications: boolean;
  };
  features: {
    enableChat: boolean;
    enableReviews: boolean;
    enablePromotions: boolean;
    enableMultiCurrency: boolean;
    enableGeolocation: boolean;
    enableAnalytics: boolean;
  };
}

const TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'communications', label: 'Communications', icon: Mail },
  { id: 'features', label: 'Features', icon: Zap },
];

const DEFAULT_SETTINGS: PlatformSettings = {
  general: {
    siteName: 'Beautify Platform',
    siteDescription: 'The ultimate beauty services marketplace',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    requirePhoneVerification: false,
  },
  payments: {
    stripePublishableKey: '',
    platformFeePercentage: 10,
    minimumPayoutAmount: 50,
    payoutSchedule: 'weekly',
    allowedPaymentMethods: ['credit_card', 'paypal', 'apple_pay'],
  },
  security: {
    requireTwoFactor: false,
    passwordMinLength: 8,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableAuditLog: true,
    ipWhitelist: [],
  },
  communications: {
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@beautify.com',
    fromName: 'Beautify Team',
    enableNotifications: true,
    enableSmsNotifications: false,
  },
  features: {
    enableChat: true,
    enableReviews: true,
    enablePromotions: true,
    enableMultiCurrency: true,
    enableGeolocation: true,
    enableAnalytics: true,
  },
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock API call - In real app, this would fetch actual settings
      setTimeout(() => {
        setSettings(DEFAULT_SETTINGS);
        setIsLoading(false);
      }, 1000);
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (section: keyof PlatformSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Mock API call - In real app, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Settings saved successfully');
      setHasChanges(false);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      // Mock email test
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Test email sent successfully');
    } catch (err: any) {
      toast.error('Failed to send test email');
    }
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={cn(
        'relative inline-flex items-center h-6 rounded-full w-11 transition-colors',
        enabled ? 'bg-primary-600' : 'bg-gray-200'
      )}
    >
      <span
        className={cn(
          'inline-block w-4 h-4 transform bg-white rounded-full transition-transform',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
            <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">You have unsaved changes</p>
              <p className="text-sm text-yellow-700">Don't forget to save your configuration.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => handleSettingsChange('general', 'siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteDescription}
                      onChange={(e) => handleSettingsChange('general', 'siteDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                      <p className="text-xs text-gray-500">Temporarily disable the platform for maintenance</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.general.maintenanceMode}
                      onChange={() => handleSettingsChange('general', 'maintenanceMode', !settings.general.maintenanceMode)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Allow New Registrations</label>
                      <p className="text-xs text-gray-500">Allow new users to register on the platform</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.general.allowRegistrations}
                      onChange={() => handleSettingsChange('general', 'allowRegistrations', !settings.general.allowRegistrations)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Require Email Verification</label>
                      <p className="text-xs text-gray-500">Users must verify their email before access</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.general.requireEmailVerification}
                      onChange={() => handleSettingsChange('general', 'requireEmailVerification', !settings.general.requireEmailVerification)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Require Phone Verification</label>
                      <p className="text-xs text-gray-500">Users must verify their phone number</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.general.requirePhoneVerification}
                      onChange={() => handleSettingsChange('general', 'requirePhoneVerification', !settings.general.requirePhoneVerification)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Fee Percentage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.payments.platformFeePercentage}
                        onChange={(e) => handleSettingsChange('payments', 'platformFeePercentage', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        min="0"
                        max="30"
                        step="0.1"
                      />
                      <span className="absolute right-3 top-2 text-gray-500">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Payout Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={settings.payments.minimumPayoutAmount}
                        onChange={(e) => handleSettingsChange('payments', 'minimumPayoutAmount', Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payout Schedule
                    </label>
                    <select
                      value={settings.payments.payoutSchedule}
                      onChange={(e) => handleSettingsChange('payments', 'payoutSchedule', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stripe Publishable Key
                    </label>
                    <input
                      type="text"
                      value={settings.payments.stripePublishableKey}
                      onChange={(e) => handleSettingsChange('payments', 'stripePublishableKey', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="pk_test_..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Minimum Length
                    </label>
                    <input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => handleSettingsChange('security', 'passwordMinLength', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      min="6"
                      max="20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingsChange('security', 'sessionTimeout', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      min="5"
                      max="120"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => handleSettingsChange('security', 'maxLoginAttempts', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      min="3"
                      max="10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Require Two-Factor Authentication</label>
                      <p className="text-xs text-gray-500">Force all users to enable 2FA</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.security.requireTwoFactor}
                      onChange={() => handleSettingsChange('security', 'requireTwoFactor', !settings.security.requireTwoFactor)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Audit Logging</label>
                      <p className="text-xs text-gray-500">Log all admin and user actions</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.security.enableAuditLog}
                      onChange={() => handleSettingsChange('security', 'enableAuditLog', !settings.security.enableAuditLog)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Communications Settings */}
            {activeTab === 'communications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Email Configuration</h3>
                  <Button onClick={handleTestEmail} variant="outline" size="sm">
                    Send Test Email
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={settings.communications.smtpHost}
                      onChange={(e) => handleSettingsChange('communications', 'smtpHost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={settings.communications.smtpPort}
                      onChange={(e) => handleSettingsChange('communications', 'smtpPort', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Email
                    </label>
                    <input
                      type="email"
                      value={settings.communications.fromEmail}
                      onChange={(e) => handleSettingsChange('communications', 'fromEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Name
                    </label>
                    <input
                      type="text"
                      value={settings.communications.fromName}
                      onChange={(e) => handleSettingsChange('communications', 'fromName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Email Notifications</label>
                      <p className="text-xs text-gray-500">Send email notifications to users</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.communications.enableNotifications}
                      onChange={() => handleSettingsChange('communications', 'enableNotifications', !settings.communications.enableNotifications)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable SMS Notifications</label>
                      <p className="text-xs text-gray-500">Send SMS notifications to users</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.communications.enableSmsNotifications}
                      onChange={() => handleSettingsChange('communications', 'enableSmsNotifications', !settings.communications.enableSmsNotifications)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Features Settings */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Features</h3>
                  <p className="text-sm text-gray-600">Enable or disable platform features</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Chat System</label>
                      <p className="text-xs text-gray-500">Allow real-time messaging between users</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.features.enableChat}
                      onChange={() => handleSettingsChange('features', 'enableChat', !settings.features.enableChat)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Reviews & Ratings</label>
                      <p className="text-xs text-gray-500">Allow customers to leave reviews</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.features.enableReviews}
                      onChange={() => handleSettingsChange('features', 'enableReviews', !settings.features.enableReviews)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Promotions</label>
                      <p className="text-xs text-gray-500">Allow merchants to create discount codes</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.features.enablePromotions}
                      onChange={() => handleSettingsChange('features', 'enablePromotions', !settings.features.enablePromotions)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Multi-Currency</label>
                      <p className="text-xs text-gray-500">Support multiple currencies on the platform</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.features.enableMultiCurrency}
                      onChange={() => handleSettingsChange('features', 'enableMultiCurrency', !settings.features.enableMultiCurrency)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Geolocation</label>
                      <p className="text-xs text-gray-500">Location-based merchant discovery</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.features.enableGeolocation}
                      onChange={() => handleSettingsChange('features', 'enableGeolocation', !settings.features.enableGeolocation)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enable Advanced Analytics</label>
                      <p className="text-xs text-gray-500">Provide detailed analytics to merchants</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.features.enableAnalytics}
                      onChange={() => handleSettingsChange('features', 'enableAnalytics', !settings.features.enableAnalytics)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}