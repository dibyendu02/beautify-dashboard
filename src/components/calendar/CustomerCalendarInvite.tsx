'use client';

import { useState } from 'react';
import {
  Calendar,
  Download,
  Mail,
  ExternalLink,
  Clock,
  MapPin,
  User,
  Scissors,
  DollarSign,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { calendarService } from '@/services/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface BookingDetails {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  serviceDescription?: string;
  duration: number;
  price: number;
  appointmentDate: string;
  merchantName: string;
  merchantAddress?: string;
  notes?: string;
}

interface CustomerCalendarInviteProps {
  booking: BookingDetails;
  onClose?: () => void;
  showHeader?: boolean;
}

export default function CustomerCalendarInvite({ 
  booking, 
  onClose, 
  showHeader = true 
}: CustomerCalendarInviteProps) {
  const [isGeneratingIcs, setIsGeneratingIcs] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const appointmentStart = new Date(booking.appointmentDate);
  const appointmentEnd = new Date(appointmentStart.getTime() + booking.duration * 60 * 1000);

  const handleDownloadIcs = async () => {
    try {
      setIsGeneratingIcs(true);
      
      const response = await calendarService.generateIcsFile(booking.id);
      if (response.success && response.data) {
        calendarService.downloadIcsFile(response.data.icsContent, response.data.filename);
        toast.success('Calendar file downloaded successfully');
      } else {
        toast.error(response.message || 'Failed to generate calendar file');
      }
    } catch (error) {
      console.error('Error generating ICS file:', error);
      toast.error('Failed to download calendar file');
    } finally {
      setIsGeneratingIcs(false);
    }
  };

  const handleAddToGoogleCalendar = () => {
    const title = `${booking.serviceName} - ${booking.merchantName}`;
    const description = `
Appointment Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: ${booking.serviceName}
Duration: ${booking.duration} minutes
Price: ${formatCurrency(booking.price)}
Business: ${booking.merchantName}
${booking.merchantAddress ? `Location: ${booking.merchantAddress}` : ''}
${booking.notes ? `Notes: ${booking.notes}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking ID: ${booking.id}
Powered by Beautify
    `.trim();

    calendarService.openGoogleCalendarAdd(
      title,
      appointmentStart.toISOString(),
      appointmentEnd.toISOString(),
      description,
      booking.merchantAddress
    );
  };

  const handleAddToOutlookCalendar = () => {
    const title = `${booking.serviceName} - ${booking.merchantName}`;
    const description = `
Service: ${booking.serviceName}
Duration: ${booking.duration} minutes
Price: ${formatCurrency(booking.price)}
Business: ${booking.merchantName}
${booking.merchantAddress ? `Location: ${booking.merchantAddress}` : ''}
${booking.notes ? `Notes: ${booking.notes}` : ''}

Booking ID: ${booking.id}
    `.trim();

    calendarService.openOutlookCalendarAdd(
      title,
      appointmentStart.toISOString(),
      appointmentEnd.toISOString(),
      description,
      booking.merchantAddress
    );
  };

  const handleSendEmailInvitation = async () => {
    try {
      setIsSendingEmail(true);
      
      const response = await calendarService.sendCalendarInvitation(booking.id, booking.customerEmail);
      if (response.success) {
        setEmailSent(true);
        toast.success('Calendar invitation sent to your email');
      } else {
        toast.error(response.message || 'Failed to send calendar invitation');
      }
    } catch (error) {
      console.error('Error sending calendar invitation:', error);
      toast.error('Failed to send calendar invitation');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-primary-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Add to Calendar</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="space-y-3">
          <div className="flex items-center">
            <Scissors className="w-4 h-4 text-gray-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">{booking.serviceName}</p>
              {booking.serviceDescription && (
                <p className="text-sm text-gray-600">{booking.serviceDescription}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-900">
                {formatDate(appointmentStart)} at {appointmentStart.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </p>
              <p className="text-xs text-gray-600">{booking.duration} minutes</p>
            </div>
          </div>

          <div className="flex items-center">
            <User className="w-4 h-4 text-gray-500 mr-3" />
            <p className="text-sm text-gray-900">{booking.merchantName}</p>
          </div>

          {booking.merchantAddress && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-gray-500 mr-3" />
              <p className="text-sm text-gray-900">{booking.merchantAddress}</p>
            </div>
          )}

          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-gray-500 mr-3" />
            <p className="text-sm text-gray-900">{formatCurrency(booking.price)}</p>
          </div>
        </div>
      </div>

      {/* Calendar Options */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Add to Calendar</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleAddToGoogleCalendar}
              className="flex items-center justify-center"
            >
              <span className="mr-2">📅</span>
              Google Calendar
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              onClick={handleAddToOutlookCalendar}
              className="flex items-center justify-center"
            >
              <span className="mr-2">📧</span>
              Outlook Calendar
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Download Calendar File</h4>
          <Button
            variant="outline"
            onClick={handleDownloadIcs}
            disabled={isGeneratingIcs}
            className="w-full flex items-center justify-center"
          >
            {isGeneratingIcs ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download .ics File
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Compatible with Apple Calendar, Thunderbird, and other calendar apps
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Email Invitation</h4>
          {emailSent ? (
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-800 font-medium">
                  Calendar invitation sent!
                </p>
                <p className="text-xs text-green-700">
                  Check your email for the calendar invitation
                </p>
              </div>
            </div>
          ) : (
            <div>
              <Button
                variant="outline"
                onClick={handleSendEmailInvitation}
                disabled={isSendingEmail}
                className="w-full flex items-center justify-center"
              >
                {isSendingEmail ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Send to {booking.customerEmail}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                We'll send a calendar invitation to your email address
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Adding this appointment to your calendar will help you remember 
          the time and receive automatic reminders before your appointment.
        </p>
      </div>
    </div>
  );
}