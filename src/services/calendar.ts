import { api } from './api';

export interface CalendarIntegration {
  id: string;
  provider: 'google' | 'outlook' | 'apple' | 'caldav';
  providerId: string;
  calendarId: string;
  calendarName: string;
  syncEnabled: boolean;
  autoCreateEvents: boolean;
  reminderMinutes: number[];
  syncDirection: 'one-way' | 'two-way';
  lastSyncAt?: string;
  syncStatus: 'active' | 'error' | 'expired' | 'disabled';
  syncErrors?: Array<{
    error: string;
    occurredAt: string;
    resolved: boolean;
  }>;
  settings: {
    colorId?: string;
    defaultReminders?: boolean;
    includeCustomerInfo: boolean;
    includeServiceDetails: boolean;
    eventPrefix?: string;
    timeZone: string;
  };
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarSyncResult {
  success: boolean;
  eventId?: string;
  calendarUrl?: string;
  error?: string;
}

export interface CalendarConflict {
  title: string;
  start: string;
  end: string;
}

export interface CalendarConflictCheck {
  hasConflicts: boolean;
  conflicts: CalendarConflict[];
}

export interface BulkSyncResult {
  synced: number;
  failed: number;
  errors: string[];
}

export interface CalendarStats {
  totalIntegrations: number;
  activeIntegrations: number;
  syncedEvents: number;
  pendingSync: number;
  lastSyncAt?: string;
  syncErrors: number;
}

export const calendarService = {
  /**
   * Get all calendar integrations for the current user/merchant
   */
  getIntegrations: async (): Promise<{
    success: boolean;
    data?: CalendarIntegration[];
    message?: string;
  }> => {
    try {
      const response = await api.get('/calendar/integrations');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch calendar integrations'
      };
    }
  },

  /**
   * Get a specific calendar integration
   */
  getIntegration: async (integrationId: string): Promise<{
    success: boolean;
    data?: CalendarIntegration;
    message?: string;
  }> => {
    try {
      const response = await api.get(`/calendar/integrations/${integrationId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch calendar integration'
      };
    }
  },

  /**
   * Generate OAuth authorization URL for calendar provider
   */
  generateAuthUrl: async (provider: 'google' | 'outlook' | 'apple'): Promise<{
    success: boolean;
    authUrl?: string;
    message?: string;
  }> => {
    try {
      const response = await api.post('/calendar/auth/generate-url', { provider });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate authorization URL'
      };
    }
  },

  /**
   * Handle OAuth callback and create integration
   */
  handleOAuthCallback: async (provider: string, code: string, state?: string): Promise<{
    success: boolean;
    data?: CalendarIntegration;
    message?: string;
  }> => {
    try {
      const response = await api.post('/calendar/auth/callback', {
        provider,
        code,
        state
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process OAuth callback'
      };
    }
  },

  /**
   * Update calendar integration settings
   */
  updateIntegration: async (integrationId: string, settings: Partial<CalendarIntegration>): Promise<{
    success: boolean;
    data?: CalendarIntegration;
    message?: string;
  }> => {
    try {
      const response = await api.put(`/calendar/integrations/${integrationId}`, settings);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update calendar integration'
      };
    }
  },

  /**
   * Disconnect calendar integration
   */
  disconnectIntegration: async (integrationId: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await api.delete(`/calendar/integrations/${integrationId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to disconnect calendar integration'
      };
    }
  },

  /**
   * Sync a specific booking to calendar
   */
  syncBooking: async (bookingId: string): Promise<CalendarSyncResult> => {
    try {
      const response = await api.post(`/calendar/sync/booking/${bookingId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to sync booking to calendar'
      };
    }
  },

  /**
   * Sync multiple bookings for a date range
   */
  bulkSyncBookings: async (startDate: string, endDate: string): Promise<{
    success: boolean;
    data?: BulkSyncResult;
    message?: string;
  }> => {
    try {
      const response = await api.post('/calendar/sync/bulk', {
        startDate,
        endDate
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to bulk sync bookings'
      };
    }
  },

  /**
   * Check for calendar conflicts
   */
  checkConflicts: async (startTime: string, endTime: string): Promise<{
    success: boolean;
    data?: CalendarConflictCheck;
    message?: string;
  }> => {
    try {
      const response = await api.post('/calendar/conflicts', {
        startTime,
        endTime
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check calendar conflicts'
      };
    }
  },

  /**
   * Get calendar sync statistics
   */
  getSyncStats: async (): Promise<{
    success: boolean;
    data?: CalendarStats;
    message?: string;
  }> => {
    try {
      const response = await api.get('/calendar/stats');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch calendar statistics'
      };
    }
  },

  /**
   * Force refresh calendar tokens
   */
  refreshTokens: async (integrationId: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await api.post(`/calendar/integrations/${integrationId}/refresh`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to refresh calendar tokens'
      };
    }
  },

  /**
   * Test calendar connection
   */
  testConnection: async (integrationId: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await api.post(`/calendar/integrations/${integrationId}/test`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to test calendar connection'
      };
    }
  },

  /**
   * Generate .ics file for customer download
   */
  generateIcsFile: async (bookingId: string): Promise<{
    success: boolean;
    data?: {
      icsContent: string;
      filename: string;
    };
    message?: string;
  }> => {
    try {
      const response = await api.get(`/calendar/booking/${bookingId}/ics`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate calendar file'
      };
    }
  },

  /**
   * Send calendar invitation to customer
   */
  sendCalendarInvitation: async (bookingId: string, customerEmail: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const response = await api.post(`/calendar/booking/${bookingId}/invite`, {
        customerEmail
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send calendar invitation'
      };
    }
  },

  /**
   * Get calendar events for a date range
   */
  getCalendarEvents: async (integrationId: string, startDate: string, endDate: string): Promise<{
    success: boolean;
    data?: Array<{
      id: string;
      title: string;
      start: string;
      end: string;
      description?: string;
      location?: string;
      attendees?: string[];
      source: 'beautify' | 'external';
      bookingId?: string;
    }>;
    message?: string;
  }> => {
    try {
      const response = await api.get(`/calendar/integrations/${integrationId}/events`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch calendar events'
      };
    }
  },

  /**
   * Utility function to download .ics file
   */
  downloadIcsFile: (icsContent: string, filename: string) => {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  },

  /**
   * Utility function to open Google Calendar add event URL
   */
  openGoogleCalendarAdd: (title: string, startTime: string, endTime: string, description?: string, location?: string) => {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startTime.replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endTime.replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
      details: description || '',
      location: location || ''
    });

    const url = `https://calendar.google.com/calendar/render?${params.toString()}`;
    window.open(url, '_blank');
  },

  /**
   * Utility function to open Outlook Calendar add event URL
   */
  openOutlookCalendarAdd: (title: string, startTime: string, endTime: string, description?: string, location?: string) => {
    const params = new URLSearchParams({
      subject: title,
      startdt: startTime,
      enddt: endTime,
      body: description || '',
      location: location || ''
    });

    const url = `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
    window.open(url, '_blank');
  }
};

export default calendarService;