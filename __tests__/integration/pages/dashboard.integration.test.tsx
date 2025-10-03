import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DashboardPage from '@/pages/dashboard';
import { authSlice } from '@/store/slices/authSlice';
import { dashboardSlice } from '@/store/slices/dashboardSlice';

// Mock the API services
jest.mock('@/services/api', () => ({
  dashboardApi: {
    getStats: jest.fn(),
    getRecentBookings: jest.fn(),
    getRecentUsers: jest.fn(),
    getAnalytics: jest.fn(),
  },
  bookingApi: {
    getBookings: jest.fn(),
  },
  userApi: {
    getUsers: jest.fn(),
  },
}));

// Mock recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
}));

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

describe('Dashboard Page Integration Tests', () => {
  let store: any;
  let mockDashboardApi: any;
  let mockBookingApi: any;
  let mockUserApi: any;

  beforeEach(() => {
    mockDashboardApi = require('@/services/api').dashboardApi;
    mockBookingApi = require('@/services/api').bookingApi;
    mockUserApi = require('@/services/api').userApi;

    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock responses
    mockDashboardApi.getStats.mockResolvedValue({
      success: true,
      stats: {
        totalUsers: 1250,
        totalMerchants: 85,
        totalBookings: 3420,
        totalRevenue: 125000,
        revenueGrowth: 15.2,
        userGrowth: 8.5,
        bookingGrowth: 12.3,
        merchantGrowth: 6.8,
      },
    });

    mockDashboardApi.getRecentBookings.mockResolvedValue({
      success: true,
      bookings: [
        {
          id: '1',
          customerName: 'Sarah Johnson',
          serviceName: 'Hair Cut & Style',
          merchantName: 'Elite Hair Studio',
          dateTime: '2024-12-25T10:00:00Z',
          status: 'confirmed',
          amount: 75.00,
        },
        {
          id: '2',
          customerName: 'Mike Chen',
          serviceName: 'Beard Trim',
          merchantName: 'Modern Barber',
          dateTime: '2024-12-25T11:00:00Z',
          status: 'pending',
          amount: 25.00,
        },
      ],
    });

    mockDashboardApi.getAnalytics.mockResolvedValue({
      success: true,
      analytics: {
        revenue: [
          { month: 'Jan', amount: 10000 },
          { month: 'Feb', amount: 12000 },
          { month: 'Mar', amount: 11500 },
          { month: 'Apr', amount: 13000 },
          { month: 'May', amount: 14500 },
          { month: 'Jun', amount: 16000 },
        ],
        bookings: [
          { month: 'Jan', count: 200 },
          { month: 'Feb', count: 240 },
          { month: 'Mar', count: 230 },
          { month: 'Apr', count: 260 },
          { month: 'May', count: 290 },
          { month: 'Jun', count: 320 },
        ],
        categories: [
          { name: 'Hair', value: 45 },
          { name: 'Nails', value: 25 },
          { name: 'Massage', value: 20 },
          { name: 'Skincare', value: 10 },
        ],
      },
    });

    store = configureStore({
      reducer: {
        auth: authSlice.reducer,
        dashboard: dashboardSlice.reducer,
      },
      preloadedState: {
        auth: {
          user: {
            id: 'admin-1',
            email: 'admin@beautify.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
          },
          token: 'mock-admin-token',
          isLoading: false,
          error: null,
        },
        dashboard: {
          stats: null,
          recentBookings: [],
          analytics: null,
          isLoading: false,
          error: null,
        },
      },
    });
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  it('should render dashboard with loading state initially', () => {
    renderWithProvider(<DashboardPage />);

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should load and display dashboard stats', async () => {
    renderWithProvider(<DashboardPage />);

    await waitFor(() => {
      expect(mockDashboardApi.getStats).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('1,250')).toBeInTheDocument(); // Total Users
      expect(screen.getByText('85')).toBeInTheDocument(); // Total Merchants
      expect(screen.getByText('3,420')).toBeInTheDocument(); // Total Bookings
      expect(screen.getByText('€125,000')).toBeInTheDocument(); // Total Revenue
    });

    // Check growth indicators
    expect(screen.getByText('+15.2%')).toBeInTheDocument(); // Revenue growth
    expect(screen.getByText('+8.5%')).toBeInTheDocument(); // User growth
    expect(screen.getByText('+12.3%')).toBeInTheDocument(); // Booking growth
    expect(screen.getByText('+6.8%')).toBeInTheDocument(); // Merchant growth
  });

  it('should load and display recent bookings', async () => {
    renderWithProvider(<DashboardPage />);

    await waitFor(() => {
      expect(mockDashboardApi.getRecentBookings).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Hair Cut & Style')).toBeInTheDocument();
      expect(screen.getByText('Elite Hair Studio')).toBeInTheDocument();
      expect(screen.getByText('Mike Chen')).toBeInTheDocument();
      expect(screen.getByText('Beard Trim')).toBeInTheDocument();
      expect(screen.getByText('Modern Barber')).toBeInTheDocument();
    });

    // Check status badges
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should load and display analytics charts', async () => {
    renderWithProvider(<DashboardPage />);

    await waitFor(() => {
      expect(mockDashboardApi.getAnalytics).toHaveBeenCalled();
    });

    await waitFor(() => {
      // Check if chart components are rendered
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });
  });

  it('should handle time period filter changes', async () => {
    const user = userEvent.setup();
    renderWithProvider(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/last 30 days/i)).toBeInTheDocument();
    });

    // Click on time period dropdown
    const timeFilter = screen.getByRole('button', { name: /last 30 days/i });
    await user.click(timeFilter);

    // Select different time period
    const lastWeekOption = screen.getByText(/last 7 days/i);
    await user.click(lastWeekOption);

    await waitFor(() => {
      // Should refetch data with new time period
      expect(mockDashboardApi.getStats).toHaveBeenCalledWith({ period: '7d' });
      expect(mockDashboardApi.getAnalytics).toHaveBeenCalledWith({ period: '7d' });
    });
  });

  it('should handle refresh functionality', async () => {
    const user = userEvent.setup();
    renderWithProvider(<DashboardPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(mockDashboardApi.getStats).toHaveBeenCalledTimes(1);
    });

    // Click refresh button
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    await user.click(refreshButton);

    await waitFor(() => {
      // Should call APIs again
      expect(mockDashboardApi.getStats).toHaveBeenCalledTimes(2);
      expect(mockDashboardApi.getRecentBookings).toHaveBeenCalledTimes(2);
      expect(mockDashboardApi.getAnalytics).toHaveBeenCalledTimes(2);
    });
  });

  it('should display error state when API calls fail', async () => {
    // Mock API failure
    mockDashboardApi.getStats.mockRejectedValue(new Error('Network error'));

    renderWithProvider(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/error loading dashboard data/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });

  it('should handle real-time updates via WebSocket', async () => {
    const mockSocket = require('socket.io-client').io();
    renderWithProvider(<DashboardPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(mockDashboardApi.getStats).toHaveBeenCalled();
    });

    // Simulate real-time booking update
    const mockBookingUpdate = {
      type: 'NEW_BOOKING',
      data: {
        id: '3',
        customerName: 'Jane Doe',
        serviceName: 'Manicure',
        merchantName: 'Nail Art Studio',
        dateTime: '2024-12-25T14:00:00Z',
        status: 'pending',
        amount: 35.00,
      },
    };

    // Simulate WebSocket event
    const onCallback = mockSocket.on.mock.calls.find(call => call[0] === 'dashboard-update')[1];
    onCallback(mockBookingUpdate);

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Manicure')).toBeInTheDocument();
    });
  });

  it('should navigate to detailed views when clicking on stats cards', async () => {
    const user = userEvent.setup();
    const mockRouter = require('next/router').useRouter();
    renderWithProvider(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('1,250')).toBeInTheDocument();
    });

    // Click on users stat card
    const usersCard = screen.getByTestId('users-stat-card');
    await user.click(usersCard);

    expect(mockRouter.push).toHaveBeenCalledWith('/admin/users');

    // Click on bookings stat card
    const bookingsCard = screen.getByTestId('bookings-stat-card');
    await user.click(bookingsCard);

    expect(mockRouter.push).toHaveBeenCalledWith('/admin/bookings');
  });

  it('should export dashboard data', async () => {
    const user = userEvent.setup();
    renderWithProvider(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    // Click export button
    const exportButton = screen.getByRole('button', { name: /export/i });
    await user.click(exportButton);

    // Should show export options
    expect(screen.getByText(/export as csv/i)).toBeInTheDocument();
    expect(screen.getByText(/export as pdf/i)).toBeInTheDocument();

    // Click CSV export
    const csvOption = screen.getByText(/export as csv/i);
    await user.click(csvOption);

    // Mock download should be triggered
    // This would need additional mocking for file download
  });

  it('should handle search functionality', async () => {
    const user = userEvent.setup();
    renderWithProvider(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });

    // Use search input
    const searchInput = screen.getByPlaceholderText(/search bookings/i);
    await user.type(searchInput, 'Sarah');

    await waitFor(() => {
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Mike Chen')).not.toBeInTheDocument();
    });

    // Clear search
    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Mike Chen')).toBeInTheDocument();
    });
  });

  it('should handle pagination for recent bookings', async () => {
    const user = userEvent.setup();
    
    // Mock more bookings for pagination
    mockDashboardApi.getRecentBookings.mockResolvedValue({
      success: true,
      bookings: Array.from({ length: 15 }, (_, i) => ({
        id: `booking-${i}`,
        customerName: `Customer ${i}`,
        serviceName: `Service ${i}`,
        merchantName: `Merchant ${i}`,
        dateTime: '2024-12-25T10:00:00Z',
        status: 'confirmed',
        amount: 50.00,
      })),
      pagination: {
        page: 1,
        limit: 10,
        totalPages: 2,
        totalCount: 15,
      },
    });

    renderWithProvider(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Customer 0')).toBeInTheDocument();
    });

    // Should show pagination controls
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();

    // Click next page
    const nextButton = screen.getByRole('button', { name: /next page/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(mockDashboardApi.getRecentBookings).toHaveBeenCalledWith({ page: 2, limit: 10 });
    });
  });

  it('should show different content based on user role', async () => {
    // Test merchant dashboard
    const merchantStore = configureStore({
      reducer: {
        auth: authSlice.reducer,
        dashboard: dashboardSlice.reducer,
      },
      preloadedState: {
        auth: {
          user: {
            id: 'merchant-1',
            email: 'merchant@beautify.com',
            firstName: 'Merchant',
            lastName: 'User',
            role: 'merchant',
          },
          token: 'mock-merchant-token',
          isLoading: false,
          error: null,
        },
        dashboard: {
          stats: null,
          recentBookings: [],
          analytics: null,
          isLoading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={merchantStore}>
        <DashboardPage />
      </Provider>
    );

    await waitFor(() => {
      // Merchant should see their specific stats
      expect(screen.getByText(/my bookings/i)).toBeInTheDocument();
      expect(screen.getByText(/my revenue/i)).toBeInTheDocument();
      expect(screen.queryByText(/total users/i)).not.toBeInTheDocument(); // Admin-only stat
    });
  });
});