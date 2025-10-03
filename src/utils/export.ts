import { formatCurrency, formatDate } from '@/lib/utils';

export interface ExportBooking {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  service: {
    name: string;
    duration: number;
  };
  scheduledDate: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  notes?: string;
}

export const exportBookingsToCSV = (bookings: ExportBooking[], filename = 'bookings-export') => {
  const headers = [
    'Booking ID',
    'Customer Name',
    'Customer Email',
    'Service',
    'Duration (min)',
    'Scheduled Date',
    'Scheduled Time',
    'Status',
    'Amount',
    'Booking Date',
    'Notes'
  ];

  const csvContent = [
    headers.join(','),
    ...bookings.map(booking => [
      booking._id,
      `"${booking.customer.firstName} ${booking.customer.lastName}"`,
      booking.customer.email,
      `"${booking.service.name}"`,
      booking.service.duration,
      formatDate(booking.scheduledDate),
      new Date(booking.scheduledDate).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      booking.status,
      formatCurrency(booking.totalAmount).replace(',', ''),
      formatDate(booking.createdAt),
      booking.notes ? `"${booking.notes.replace(/"/g, '""')}"` : ''
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportBookingsToPDF = async (bookings: ExportBooking[], filename = 'bookings-export') => {
  // This would require a PDF library like jsPDF
  // For now, we'll create a simple HTML table that can be printed
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bookings Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-confirmed { background-color: #d1fae5; color: #065f46; }
        .status-completed { background-color: #dbeafe; color: #1e40af; }
        .status-cancelled { background-color: #fee2e2; color: #991b1b; }
      </style>
    </head>
    <body>
      <h1>Bookings Export - ${new Date().toLocaleDateString()}</h1>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.map(booking => `
            <tr>
              <td>
                ${booking.customer.firstName} ${booking.customer.lastName}<br>
                <small>${booking.customer.email}</small>
              </td>
              <td>
                ${booking.service.name}<br>
                <small>${booking.service.duration} minutes</small>
              </td>
              <td>
                ${formatDate(booking.scheduledDate)}<br>
                <small>${new Date(booking.scheduledDate).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}</small>
              </td>
              <td>
                <span class="status status-${booking.status}">${booking.status}</span>
              </td>
              <td>${formatCurrency(booking.totalAmount)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 100);
  }
};