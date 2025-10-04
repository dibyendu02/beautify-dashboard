'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Lock,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Smartphone,
  Server,
  Activity,
  Database,
  FileText,
  Clock,
  Globe,
  Zap,
  Settings,
  Save,
  RefreshCw,
  Ban,
  UserX,
  Loader2,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import AdminLayout from '@/components/layout/AdminLayout';
import toast from 'react-hot-toast';

interface SecuritySettings {
  authentication: {
    requireTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
  };
  accessControl: {
    ipWhitelist: string[];
    allowMultipleSessions: boolean;
    adminSessionTimeout: number;
    requireApprovalForNewAdmins: boolean;
  };
  monitoring: {
    logFailedLogins: boolean;
    alertOnSuspiciousActivity: boolean;
    enableAuditLog: boolean;
    dataRetentionDays: number;
  };
  encryption: {
    enforceHttps: boolean;
    encryptDatabaseBackups: boolean;
    keyRotationDays: number;
  };
}

interface SecurityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ip: string;
  status: 'success' | 'failed' | 'suspicious';
  details: string;
}

export default function SecurityPage() {
  const [settings, setSettings] = useState<SecuritySettings>({
    authentication: {
      requireTwoFactor: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
    },
    accessControl: {
      ipWhitelist: [],
      allowMultipleSessions: false,
      adminSessionTimeout: 15,
      requireApprovalForNewAdmins: true,
    },
    monitoring: {
      logFailedLogins: true,
      alertOnSuspiciousActivity: true,
      enableAuditLog: true,
      dataRetentionDays: 90,
    },
    encryption: {
      enforceHttps: true,
      encryptDatabaseBackups: true,
      keyRotationDays: 30,
    },
  });

  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      user: 'admin@beautify.com',
      action: 'Admin Login',
      ip: '192.168.1.100',
      status: 'success',
      details: 'Successful admin login with 2FA',
    },
    {
      id: '2',
      timestamp: '2024-01-15T09:45:00Z',
      user: 'unknown',
      action: 'Failed Login Attempt',
      ip: '45.123.456.789',
      status: 'failed',
      details: 'Multiple failed login attempts detected',
    },
    {
      id: '3',
      timestamp: '2024-01-15T08:20:00Z',
      user: 'support@beautify.com',
      action: 'Settings Modified',
      ip: '192.168.1.101',
      status: 'success',
      details: 'Updated platform security settings',
    },
    {
      id: '4',
      timestamp: '2024-01-14T16:15:00Z',
      user: 'unknown',
      action: 'Suspicious Activity',
      ip: '123.456.789.012',
      status: 'suspicious',
      details: 'Unusual access pattern detected',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('authentication');

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Security settings updated successfully');
    } catch (error) {
      toast.error('Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'suspicious':
        return <Ban className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const securityCards = [
    {
      title: 'Active Sessions',
      value: '12',
      description: 'Currently logged in users',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Failed Logins (24h)',
      value: '3',
      description: 'Recent failed login attempts',
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Security Alerts',
      value: '1',
      description: 'Require attention',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'SSL Status',
      value: 'Active',
      description: 'Certificate expires in 45 days',
      icon: Lock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Security Settings</h1>
            <p className="text-slate-600 mt-1">
              Manage platform security, authentication, and monitoring
            </p>
          </div>
          <Button 
            onClick={handleSaveSettings} 
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('p-3 rounded-xl', card.bgColor)}>
                    <Icon className={cn('w-6 h-6', card.color)} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 mb-1">{card.value}</p>
                  <p className="text-sm font-medium text-slate-600 mb-1">{card.title}</p>
                  <p className="text-xs text-slate-500">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Settings Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          {/* Tab Navigation */}
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'authentication', label: 'Authentication', icon: Key },
                { id: 'access', label: 'Access Control', icon: Shield },
                { id: 'monitoring', label: 'Monitoring', icon: Activity },
                { id: 'encryption', label: 'Encryption', icon: Lock },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center py-4 border-b-2 font-medium text-sm transition-colors',
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'authentication' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Authentication Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Require Two-Factor Authentication</p>
                        <p className="text-sm text-slate-600">Enforce 2FA for all admin users</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          authentication: { ...prev.authentication, requireTwoFactor: !prev.authentication.requireTwoFactor }
                        }))}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          settings.authentication.requireTwoFactor ? 'bg-indigo-600' : 'bg-slate-200'
                        )}
                      >
                        <span className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          settings.authentication.requireTwoFactor ? 'translate-x-6' : 'translate-x-1'
                        )} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.authentication.sessionTimeout}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          authentication: { ...prev.authentication, sessionTimeout: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.authentication.maxLoginAttempts}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          authentication: { ...prev.authentication, maxLoginAttempts: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        value={settings.authentication.passwordMinLength}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          authentication: { ...prev.authentication, passwordMinLength: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <p className="font-medium text-slate-900">Password Requirements</p>
                      
                      {[
                        { key: 'requireSpecialChars', label: 'Require Special Characters' },
                        { key: 'requireNumbers', label: 'Require Numbers' },
                        { key: 'requireUppercase', label: 'Require Uppercase Letters' },
                      ].map((requirement) => (
                        <div key={requirement.key} className="flex items-center justify-between">
                          <p className="text-sm text-slate-600">{requirement.label}</p>
                          <button
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              authentication: { 
                                ...prev.authentication, 
                                [requirement.key]: !prev.authentication[requirement.key as keyof typeof prev.authentication] 
                              }
                            }))}
                            className={cn(
                              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                              settings.authentication[requirement.key as keyof typeof settings.authentication] 
                                ? 'bg-indigo-600' : 'bg-slate-200'
                            )}
                          >
                            <span className={cn(
                              'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                              settings.authentication[requirement.key as keyof typeof settings.authentication] 
                                ? 'translate-x-5' : 'translate-x-1'
                            )} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'access' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Access Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Allow Multiple Sessions</p>
                        <p className="text-sm text-slate-600">Users can log in from multiple devices</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          accessControl: { ...prev.accessControl, allowMultipleSessions: !prev.accessControl.allowMultipleSessions }
                        }))}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          settings.accessControl.allowMultipleSessions ? 'bg-indigo-600' : 'bg-slate-200'
                        )}
                      >
                        <span className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          settings.accessControl.allowMultipleSessions ? 'translate-x-6' : 'translate-x-1'
                        )} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Admin Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.accessControl.adminSessionTimeout}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          accessControl: { ...prev.accessControl, adminSessionTimeout: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Require Admin Approval</p>
                        <p className="text-sm text-slate-600">New admin accounts need approval</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          accessControl: { ...prev.accessControl, requireApprovalForNewAdmins: !prev.accessControl.requireApprovalForNewAdmins }
                        }))}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          settings.accessControl.requireApprovalForNewAdmins ? 'bg-indigo-600' : 'bg-slate-200'
                        )}
                      >
                        <span className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          settings.accessControl.requireApprovalForNewAdmins ? 'translate-x-6' : 'translate-x-1'
                        )} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'monitoring' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Security Monitoring</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { key: 'logFailedLogins', label: 'Log Failed Login Attempts', desc: 'Track unsuccessful login attempts' },
                      { key: 'alertOnSuspiciousActivity', label: 'Alert on Suspicious Activity', desc: 'Send notifications for unusual patterns' },
                      { key: 'enableAuditLog', label: 'Enable Audit Logging', desc: 'Track all admin actions' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{setting.label}</p>
                          <p className="text-sm text-slate-600">{setting.desc}</p>
                        </div>
                        <button
                          onClick={() => setSettings(prev => ({
                            ...prev,
                            monitoring: { 
                              ...prev.monitoring, 
                              [setting.key]: !prev.monitoring[setting.key as keyof typeof prev.monitoring] 
                            }
                          }))}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            settings.monitoring[setting.key as keyof typeof settings.monitoring] 
                              ? 'bg-indigo-600' : 'bg-slate-200'
                          )}
                        >
                          <span className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            settings.monitoring[setting.key as keyof typeof settings.monitoring] 
                              ? 'translate-x-6' : 'translate-x-1'
                          )} />
                        </button>
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Data Retention (days)
                      </label>
                      <input
                        type="number"
                        value={settings.monitoring.dataRetentionDays}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          monitoring: { ...prev.monitoring, dataRetentionDays: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'encryption' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Encryption Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { key: 'enforceHttps', label: 'Enforce HTTPS', desc: 'Force secure connections only' },
                      { key: 'encryptDatabaseBackups', label: 'Encrypt Database Backups', desc: 'Encrypt all backup files' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{setting.label}</p>
                          <p className="text-sm text-slate-600">{setting.desc}</p>
                        </div>
                        <button
                          onClick={() => setSettings(prev => ({
                            ...prev,
                            encryption: { 
                              ...prev.encryption, 
                              [setting.key]: !prev.encryption[setting.key as keyof typeof prev.encryption] 
                            }
                          }))}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            settings.encryption[setting.key as keyof typeof settings.encryption] 
                              ? 'bg-indigo-600' : 'bg-slate-200'
                          )}
                        >
                          <span className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            settings.encryption[setting.key as keyof typeof settings.encryption] 
                              ? 'translate-x-6' : 'translate-x-1'
                          )} />
                        </button>
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Key Rotation Period (days)
                      </label>
                      <input
                        type="number"
                        value={settings.encryption.keyRotationDays}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          encryption: { ...prev.encryption, keyRotationDays: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Activity Log */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Recent Security Activity</h3>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {securityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {log.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(log.status)}
                        <span className={cn(
                          'ml-2 text-sm font-medium',
                          log.status === 'success' && 'text-green-600',
                          log.status === 'failed' && 'text-red-600',
                          log.status === 'suspicious' && 'text-orange-600'
                        )}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}