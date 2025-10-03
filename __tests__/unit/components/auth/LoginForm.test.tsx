import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginForm from '@/components/auth/LoginForm';
import { authSlice } from '@/store/slices/authSlice';

// Mock the API service
jest.mock('@/services/api', () => ({
  authApi: {
    login: jest.fn(),
  },
}));

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
  }),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('LoginForm Component', () => {
  let store: any;
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockDispatch = jest.fn();
    store = configureStore({
      reducer: {
        auth: authSlice.reducer,
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isLoading: false,
          error: null,
        },
      },
    });

    // Mock the dispatch function
    store.dispatch = mockDispatch;
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  it('should render login form with all required fields', () => {
    renderWithProvider(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for short password', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LoginForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, '123');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    const mockLogin = require('@/services/api').authApi.login;
    const mockToast = require('react-hot-toast').toast;

    mockLogin.mockResolvedValue({
      success: true,
      user: { id: '1', email: 'test@example.com', role: 'admin' },
      token: 'mock-token',
    });

    renderWithProvider(<LoginForm />);

    // Fill in form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockToast.success).toHaveBeenCalledWith('Login successful!');
    });
  });

  it('should handle login error', async () => {
    const user = userEvent.setup();
    const mockLogin = require('@/services/api').authApi.login;
    const mockToast = require('react-hot-toast').toast;

    mockLogin.mockRejectedValue({
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    });

    renderWithProvider(<LoginForm />);

    // Fill in form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LoginForm />);

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');

    // Click toggle button
    await user.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    // Click again to hide
    await user.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('should handle remember me checkbox', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LoginForm />);

    const rememberCheckbox = screen.getByRole('checkbox', { name: /remember me/i }) as HTMLInputElement;

    // Initially unchecked
    expect(rememberCheckbox.checked).toBe(false);

    // Click to check
    await user.click(rememberCheckbox);
    expect(rememberCheckbox.checked).toBe(true);

    // Click to uncheck
    await user.click(rememberCheckbox);
    expect(rememberCheckbox.checked).toBe(false);
  });

  it('should show loading state during login', async () => {
    const user = userEvent.setup();
    const mockLogin = require('@/services/api').authApi.login;

    // Create a promise that we can control
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    mockLogin.mockReturnValue(loginPromise);

    renderWithProvider(<LoginForm />);

    // Fill in form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    // Resolve the promise
    resolveLogin!({
      success: true,
      user: { id: '1', email: 'test@example.com' },
      token: 'token',
    });

    // Should return to normal state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  it('should have proper accessibility attributes', () => {
    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Check for proper ARIA attributes
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    expect(submitButton).toHaveAttribute('type', 'submit');

    // Check for proper labeling
    expect(emailInput).toHaveAccessibleName();
    expect(passwordInput).toHaveAccessibleName();
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Tab navigation
    await user.tab();
    expect(emailInput).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('checkbox')).toHaveFocus();

    await user.tab();
    expect(submitButton).toHaveFocus();

    // Enter key should submit form when on submit button
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('should clear form errors when user starts typing', async () => {
    const user = userEvent.setup();
    renderWithProvider(<LoginForm />);

    // Submit empty form to generate errors
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    // Start typing in email field
    await user.type(screen.getByLabelText(/email/i), 't');

    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    });
  });

  it('should handle social login buttons', () => {
    renderWithProvider(<LoginForm />);

    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with apple/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with facebook/i })).toBeInTheDocument();
  });

  it('should redirect to dashboard after successful login', async () => {
    const user = userEvent.setup();
    const mockRouter = require('next/router').useRouter();
    const mockLogin = require('@/services/api').authApi.login;

    mockLogin.mockResolvedValue({
      success: true,
      user: { id: '1', email: 'test@example.com', role: 'admin' },
      token: 'mock-token',
    });

    renderWithProvider(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });
});