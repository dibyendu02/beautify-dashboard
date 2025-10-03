import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  initialize(userId: string): void {
    if (this.socket && this.isConnected) {
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5003';
    const token = localStorage.getItem('authToken');

    this.socket = io(socketUrl, {
      auth: {
        token,
        userId,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      // Join merchant room for notifications
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'merchant' && user.merchantId) {
        this.socket?.emit('join_merchant_room', user.merchantId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        // Manual disconnect, don't attempt to reconnect
        return;
      }
      
      this.attemptReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      this.attemptReconnect();
    });

    // Real-time notification handlers
    this.socket.on('new_booking', (booking) => {
      toast.success(`New booking from ${booking.customer.firstName}`, {
        duration: 5000,
      });
      this.notifyBookingUpdate(booking);
    });

    this.socket.on('booking_updated', (booking) => {
      this.notifyBookingUpdate(booking);
    });

    this.socket.on('booking_cancelled', (booking) => {
      toast.error(`Booking cancelled: ${booking.service.name}`, {
        duration: 5000,
      });
      this.notifyBookingUpdate(booking);
    });

    this.socket.on('payment_received', (payment) => {
      toast.success(`Payment received: $${payment.amount}`, {
        duration: 5000,
      });
      this.notifyPaymentUpdate(payment);
    });

    this.socket.on('new_message', (message) => {
      if (window.location.pathname !== `/merchant/chat/${message.chatId}`) {
        toast.success(`New message from ${message.senderName}`, {
          duration: 4000,
        });
      }
      this.notifyNewMessage(message);
    });

    this.socket.on('customer_online', (data) => {
      this.notifyCustomerStatus(data.customerId, true);
    });

    this.socket.on('customer_offline', (data) => {
      this.notifyCustomerStatus(data.customerId, false);
    });

    this.socket.on('analytics_update', (data) => {
      this.notifyAnalyticsUpdate(data);
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      toast.error('Connection lost. Please refresh the page.');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.socket?.connect();
    }, delay);
  }

  // Event listeners registration
  private eventListeners = {
    bookingUpdate: new Set<(booking: any) => void>(),
    paymentUpdate: new Set<(payment: any) => void>(),
    newMessage: new Set<(message: any) => void>(),
    customerStatus: new Set<(customerId: string, online: boolean) => void>(),
    analyticsUpdate: new Set<(data: any) => void>(),
  };

  // Public methods for components to listen to events
  onBookingUpdate(callback: (booking: any) => void): () => void {
    this.eventListeners.bookingUpdate.add(callback);
    return () => this.eventListeners.bookingUpdate.delete(callback);
  }

  onPaymentUpdate(callback: (payment: any) => void): () => void {
    this.eventListeners.paymentUpdate.add(callback);
    return () => this.eventListeners.paymentUpdate.delete(callback);
  }

  onNewMessage(callback: (message: any) => void): () => void {
    this.eventListeners.newMessage.add(callback);
    return () => this.eventListeners.newMessage.delete(callback);
  }

  onCustomerStatus(callback: (customerId: string, online: boolean) => void): () => void {
    this.eventListeners.customerStatus.add(callback);
    return () => this.eventListeners.customerStatus.delete(callback);
  }

  onAnalyticsUpdate(callback: (data: any) => void): () => void {
    this.eventListeners.analyticsUpdate.add(callback);
    return () => this.eventListeners.analyticsUpdate.delete(callback);
  }

  // Notification methods
  private notifyBookingUpdate(booking: any): void {
    this.eventListeners.bookingUpdate.forEach(callback => callback(booking));
  }

  private notifyPaymentUpdate(payment: any): void {
    this.eventListeners.paymentUpdate.forEach(callback => callback(payment));
  }

  private notifyNewMessage(message: any): void {
    this.eventListeners.newMessage.forEach(callback => callback(message));
  }

  private notifyCustomerStatus(customerId: string, online: boolean): void {
    this.eventListeners.customerStatus.forEach(callback => callback(customerId, online));
  }

  private notifyAnalyticsUpdate(data: any): void {
    this.eventListeners.analyticsUpdate.forEach(callback => callback(data));
  }

  // Chat functionality
  joinChatRoom(chatId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_chat', chatId);
    }
  }

  leaveChatRoom(chatId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_chat', chatId);
    }
  }

  sendMessage(chatId: string, message: string, recipientId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', {
        chatId,
        message,
        recipientId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  sendTypingIndicator(chatId: string, isTyping: boolean): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', {
        chatId,
        isTyping,
      });
    }
  }

  // Merchant availability updates
  updateAvailabilityStatus(isAvailable: boolean): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('availability_update', {
        isAvailable,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Booking status updates
  updateBookingStatus(bookingId: string, status: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('booking_status_update', {
        bookingId,
        status,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Service updates
  updateService(serviceId: string, updates: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('service_update', {
        serviceId,
        updates,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  // Get socket instance for custom event handling
  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;