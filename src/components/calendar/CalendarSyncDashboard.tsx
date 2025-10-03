'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Eye,
  Settings,
  BarChart3,
  Activity,
  Loader2,
  Plus,
  Zap,
  Shield,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { calendarService, CalendarIntegration } from '@/services/calendar';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  attendees?: string[];
  source: 'beautify' | 'external';
  bookingId?: string;
}

interface SyncStats {
  totalIntegrations: number;
  activeIntegrations: number;
  syncedEvents: number;
  pendingSync: number;
  lastSyncAt?: string;
  syncErrors: number;
}

export default function CalendarSyncDashboard() {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState<{ [key: string]: boolean }>({});
  const [selectedDateRange, setSelectedDateRange] = useState('7d');

  useEffect(() => {
    loadCalendarData();
  }, [selectedDateRange]);

  const loadCalendarData = async () => {
    try {
      setIsLoading(true);

      // Load integrations
      const integrationsResponse = await calendarService.getIntegrations();
      if (integrationsResponse.success && integrationsResponse.data) {
        setIntegrations(integrationsResponse.data);
      }

      // Load sync stats
      const statsResponse = await calendarService.getSyncStats();
      if (statsResponse.success && statsResponse.data) {
        setSyncStats(statsResponse.data);
      }

      // Load recent events for active integrations
      if (integrationsResponse.success && integrationsResponse.data) {
        const activeIntegration = integrationsResponse.data.find(
          integration => integration.isActive && integration.syncStatus === 'active'
        );

        if (activeIntegration) {
          const endDate = new Date();
          const startDate = new Date();
          const days = selectedDateRange === '7d' ? 7 : selectedDateRange === '30d' ? 30 : 90;
          startDate.setDate(startDate.getDate() - days);

          const eventsResponse = await calendarService.getCalendarEvents(
            activeIntegration.id,
            startDate.toISOString(),
            endDate.toISOString()
          );

          if (eventsResponse.success && eventsResponse.data) {
            setRecentEvents(eventsResponse.data);
          }
        }
      }
    } catch (error) {
      console.error('Error loading calendar data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSync = async () => {
    try {
      setIsSyncing(prev => ({ ...prev, bulk: true }));

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Sync last 30 days

      const response = await calendarService.bulkSyncBookings(
        startDate.toISOString(),
        endDate.toISOString()
      );

      if (response.success && response.data) {
        toast.success(`Successfully synced ${response.data.synced} bookings`);
        if (response.data.failed > 0) {
          toast.error(`${response.data.failed} bookings failed to sync`);
        }
        loadCalendarData(); // Refresh data
      } else {
        toast.error(response.message || 'Failed to sync bookings');
      }
    } catch (error) {
      console.error('Bulk sync error:', error);
      toast.error('Failed to sync bookings');
    } finally {
      setIsSyncing(prev => ({ ...prev, bulk: false }));
    }
  };

  const handleRefreshTokens = async (integrationId: string, providerName: string) => {
    try {
      setIsSyncing(prev => ({ ...prev, [integrationId]: true }));

      const response = await calendarService.refreshTokens(integrationId);
      if (response.success) {
        toast.success(`${providerName} tokens refreshed successfully`);
        loadCalendarData(); // Refresh data
      } else {
        toast.error(response.message || 'Failed to refresh tokens');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      toast.error('Failed to refresh tokens');
    } finally {
      setIsSyncing(prev => ({ ...prev, [integrationId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'expired':
        return 'text-orange-600 bg-orange-100';
      case 'disabled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'error':
        return XCircle;
      case 'expired':
        return AlertTriangle;
      case 'disabled':
        return Clock;
      default:
        return Clock;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading calendar dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar Sync Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor and manage your calendar integrations</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button
            variant="outline"
            onClick={loadCalendarData}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleBulkSync}
            disabled={isSyncing.bulk}
          >
            {isSyncing.bulk ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sync Bookings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {syncStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">{syncStats.totalIntegrations}</span>
            </div>
            <p className="text-sm text-gray-600">Total Integrations</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-900">{syncStats.activeIntegrations}</span>
            </div>
            <p className="text-sm text-gray-600">Active Connections</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-gray-900">{syncStats.syncedEvents}</span>
            </div>
            <p className="text-sm text-gray-600">Synced Events</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">{syncStats.pendingSync}</span>
            </div>
            <p className="text-sm text-gray-600">Pending Sync</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">{syncStats.syncErrors}</span>
            </div>
            <p className="text-sm text-gray-600">Sync Errors</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Integrations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Calendar Integrations</h3>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </div>

          <div className="space-y-4">
            {integrations.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Calendar Integrations</h4>
                <p className="text-gray-600 mb-4">Connect your calendar to sync appointments automatically</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Calendar
                </Button>
              </div>
            ) : (
              integrations.map((integration) => {
                const StatusIcon = getStatusIcon(integration.syncStatus);
                const isRefreshing = isSyncing[integration.id];

                return (
                  <div key={integration.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <Calendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">
                            {integration.provider} Calendar
                          </h4>
                          <p className="text-sm text-gray-600">{integration.calendarName}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(integration.syncStatus)
                        )}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {integration.syncStatus}
                        </span>

                        {integration.syncStatus === 'expired' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRefreshTokens(integration.id, integration.provider)}
                            disabled={isRefreshing}
                          >
                            {isRefreshing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                          </Button>
                        )}

                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {integration.lastSyncAt && (
                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <Activity className="w-3 h-3 mr-1" />
                        Last sync: {formatDate(new Date(integration.lastSyncAt))}
                      </div>
                    )}

                    {integration.syncErrors && integration.syncErrors.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                          <p className="font-medium">Recent Error:</p>
                          <p>{integration.syncErrors[integration.syncErrors.length - 1].error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Calendar Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Calendar Events</h3>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentEvents.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Recent Events</h4>
                <p className="text-gray-600">Calendar events will appear here once syncing begins</p>
              </div>
            ) : (
              recentEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className={cn(
                    'w-3 h-3 rounded-full mt-2',
                    event.source === 'beautify' ? 'bg-primary-500' : 'bg-gray-400'
                  )} />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center mt-1">
                      <Clock className="w-3 h-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-600">
                        {formatDate(new Date(event.start))} • {new Date(event.start).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    {event.source === 'beautify' && event.bookingId && (
                      <div className="flex items-center mt-1">
                        <Shield className="w-3 h-3 text-primary-500 mr-1" />
                        <p className="text-xs text-primary-600">Synced from Beautify</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sync Health Notice */}
      {syncStats && syncStats.syncErrors > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-900">Sync Issues Detected</h3>
              <p className="text-red-700 mt-1">
                {syncStats.syncErrors} calendar integration{syncStats.syncErrors > 1 ? 's have' : ' has'} sync errors. 
                This may cause appointments to not appear in your calendar.
              </p>
              <Button variant="outline" size="sm" className="mt-3 border-red-300 text-red-700 hover:bg-red-100">
                Review Issues
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}