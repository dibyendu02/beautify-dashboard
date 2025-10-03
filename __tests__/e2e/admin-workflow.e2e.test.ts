import { test, expect } from '@playwright/test';

test.describe('Admin Workflow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start each test at the login page
    await page.goto('/login');
  });

  test('should complete admin login and dashboard workflow', async ({ page }) => {
    // Step 1: Admin Login
    await page.fill('[data-testid="email-input"]', 'admin@beautify.com');
    await page.fill('[data-testid="password-input"]', 'AdminPassword123!');
    await page.click('[data-testid="login-button"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('Dashboard');

    // Step 2: Verify Dashboard Stats
    await expect(page.locator('[data-testid="total-users-stat"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-merchants-stat"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-bookings-stat"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-revenue-stat"]')).toBeVisible();

    // Step 3: Check Recent Activity
    await expect(page.locator('[data-testid="recent-bookings-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="booking-item"]').first()).toBeVisible();

    // Step 4: Navigate to Users Management
    await page.click('[data-testid="users-nav-link"]');
    await expect(page).toHaveURL('/admin/users');
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible();

    // Step 5: Search for Users
    await page.fill('[data-testid="users-search-input"]', 'john');
    await page.press('[data-testid="users-search-input"]', 'Enter');
    await expect(page.locator('[data-testid="user-row"]')).toContainText('john');

    // Step 6: View User Details
    await page.click('[data-testid="user-row"]').first();
    await expect(page.locator('[data-testid="user-detail-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-join-date"]')).toBeVisible();

    // Step 7: Close Modal and Navigate to Merchants
    await page.click('[data-testid="close-modal-button"]');
    await page.click('[data-testid="merchants-nav-link"]');
    await expect(page).toHaveURL('/admin/merchants');

    // Step 8: Review Pending Merchant Applications
    await page.click('[data-testid="pending-applications-tab"]');
    await expect(page.locator('[data-testid="pending-merchant-card"]')).toBeVisible();

    // Step 9: Approve a Merchant
    await page.click('[data-testid="review-application-button"]').first();
    await expect(page.locator('[data-testid="merchant-application-modal"]')).toBeVisible();
    
    // Review documents
    await page.click('[data-testid="view-business-license"]');
    await expect(page.locator('[data-testid="document-viewer"]')).toBeVisible();
    await page.click('[data-testid="close-document-viewer"]');

    // Approve merchant
    await page.fill('[data-testid="approval-notes"]', 'All documents verified. Application approved.');
    await page.click('[data-testid="approve-merchant-button"]');
    await expect(page.locator('[data-testid="success-notification"]')).toContainText('Merchant approved successfully');

    // Step 10: Navigate to Bookings Management
    await page.click('[data-testid="bookings-nav-link"]');
    await expect(page).toHaveURL('/admin/bookings');
    await expect(page.locator('[data-testid="bookings-table"]')).toBeVisible();

    // Step 11: Filter Bookings by Status
    await page.click('[data-testid="status-filter-dropdown"]');
    await page.click('[data-testid="status-filter-pending"]');
    await expect(page.locator('[data-testid="booking-row"]')).toContainText('Pending');

    // Step 12: View Booking Details
    await page.click('[data-testid="booking-row"]').first();
    await expect(page.locator('[data-testid="booking-detail-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="customer-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="merchant-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="service-info"]')).toBeVisible();

    // Step 13: Navigate to Analytics
    await page.click('[data-testid="close-modal-button"]');
    await page.click('[data-testid="analytics-nav-link"]');
    await expect(page).toHaveURL('/admin/analytics');

    // Step 14: Verify Analytics Charts
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="bookings-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-growth-chart"]')).toBeVisible();

    // Step 15: Change Analytics Time Period
    await page.click('[data-testid="time-period-dropdown"]');
    await page.click('[data-testid="time-period-last-7-days"]');
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();

    // Step 16: Export Analytics Data
    await page.click('[data-testid="export-data-button"]');
    await page.click('[data-testid="export-csv-option"]');
    
    // Wait for download
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="confirm-export-button"]');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.csv');

    // Step 17: Navigate to Settings
    await page.click('[data-testid="settings-nav-link"]');
    await expect(page).toHaveURL('/admin/settings');

    // Step 18: Update Platform Settings
    await page.click('[data-testid="platform-settings-tab"]');
    await page.fill('[data-testid="commission-rate-input"]', '15');
    await page.click('[data-testid="save-settings-button"]');
    await expect(page.locator('[data-testid="success-notification"]')).toContainText('Settings updated successfully');

    // Step 19: Logout
    await page.click('[data-testid="user-menu-button"]');
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL('/login');
  });

  test('should handle admin merchant management workflow', async ({ page }) => {
    // Login as admin
    await page.fill('[data-testid="email-input"]', 'admin@beautify.com');
    await page.fill('[data-testid="password-input"]', 'AdminPassword123!');
    await page.click('[data-testid="login-button"]');

    // Navigate to merchants
    await page.click('[data-testid="merchants-nav-link"]');

    // Test merchant search
    await page.fill('[data-testid="merchant-search-input"]', 'Elite Hair Studio');
    await page.press('[data-testid="merchant-search-input"]', 'Enter');
    await expect(page.locator('[data-testid="merchant-row"]')).toContainText('Elite Hair Studio');

    // Test merchant filtering
    await page.click('[data-testid="merchant-filter-dropdown"]');
    await page.click('[data-testid="filter-by-type-salon"]');
    await expect(page.locator('[data-testid="merchant-row"]')).toContainText('Salon');

    // View merchant performance
    await page.click('[data-testid="view-merchant-details"]').first();
    await expect(page.locator('[data-testid="merchant-performance-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="merchant-rating"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-bookings"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible();

    // Send message to merchant
    await page.click('[data-testid="send-message-tab"]');
    await page.fill('[data-testid="message-input"]', 'Please update your service descriptions for better visibility.');
    await page.click('[data-testid="send-message-button"]');
    await expect(page.locator('[data-testid="message-sent-notification"]')).toBeVisible();

    // Suspend merchant (if needed)
    await page.click('[data-testid="actions-tab"]');
    await page.click('[data-testid="suspend-merchant-button"]');
    await page.fill('[data-testid="suspension-reason"]', 'Multiple customer complaints');
    await page.click('[data-testid="confirm-suspension-button"]');
    await expect(page.locator('[data-testid="merchant-suspended-notification"]')).toBeVisible();

    await page.click('[data-testid="close-modal-button"]');
  });

  test('should handle customer support workflow', async ({ page }) => {
    // Login as admin
    await page.fill('[data-testid="email-input"]', 'admin@beautify.com');
    await page.fill('[data-testid="password-input"]', 'AdminPassword123!');
    await page.click('[data-testid="login-button"]');

    // Navigate to support
    await page.click('[data-testid="support-nav-link"]');
    await expect(page).toHaveURL('/admin/support');

    // Check support ticket list
    await expect(page.locator('[data-testid="support-tickets-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="ticket-item"]')).toHaveCount.greaterThan(0);

    // Filter by priority
    await page.click('[data-testid="priority-filter-dropdown"]');
    await page.click('[data-testid="priority-high"]');
    await expect(page.locator('[data-testid="high-priority-badge"]')).toBeVisible();

    // Open a support ticket
    await page.click('[data-testid="ticket-item"]').first();
    await expect(page.locator('[data-testid="ticket-detail-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="customer-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="ticket-description"]')).toBeVisible();

    // Respond to ticket
    await page.fill('[data-testid="response-input"]', 'Thank you for contacting us. We are looking into your issue and will resolve it shortly.');
    await page.click('[data-testid="send-response-button"]');
    await expect(page.locator('[data-testid="response-sent-notification"]')).toBeVisible();

    // Update ticket status
    await page.click('[data-testid="status-dropdown"]');
    await page.click('[data-testid="status-in-progress"]');
    await expect(page.locator('[data-testid="status-updated-notification"]')).toBeVisible();

    // Escalate to merchant
    await page.click('[data-testid="escalate-button"]');
    await page.fill('[data-testid="escalation-note"]', 'Customer is experiencing issues with their recent booking. Please investigate.');
    await page.click('[data-testid="confirm-escalation-button"]');
    await expect(page.locator('[data-testid="escalation-sent-notification"]')).toBeVisible();

    await page.click('[data-testid="close-modal-button"]');
  });

  test('should handle financial management workflow', async ({ page }) => {
    // Login as admin
    await page.fill('[data-testid="email-input"]', 'admin@beautify.com');
    await page.fill('[data-testid="password-input"]', 'AdminPassword123!');
    await page.click('[data-testid="login-button"]');

    // Navigate to financial management
    await page.click('[data-testid="finance-nav-link"]');
    await expect(page).toHaveURL('/admin/finance');

    // Check financial overview
    await expect(page.locator('[data-testid="total-revenue-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="commission-earned-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="pending-payouts-card"]')).toBeVisible();

    // View transaction history
    await page.click('[data-testid="transactions-tab"]');
    await expect(page.locator('[data-testid="transactions-table"]')).toBeVisible();

    // Filter transactions by date
    await page.click('[data-testid="date-filter-button"]');
    await page.fill('[data-testid="start-date-input"]', '2024-01-01');
    await page.fill('[data-testid="end-date-input"]', '2024-12-31');
    await page.click('[data-testid="apply-filter-button"]');

    // View payout management
    await page.click('[data-testid="payouts-tab"]');
    await expect(page.locator('[data-testid="pending-payouts-table"]')).toBeVisible();

    // Process a payout
    await page.click('[data-testid="process-payout-button"]').first();
    await expect(page.locator('[data-testid="payout-confirmation-modal"]')).toBeVisible();
    await page.click('[data-testid="confirm-payout-button"]');
    await expect(page.locator('[data-testid="payout-processed-notification"]')).toBeVisible();

    // Generate financial report
    await page.click('[data-testid="reports-tab"]');
    await page.click('[data-testid="generate-report-button"]');
    await page.click('[data-testid="report-type-dropdown"]');
    await page.click('[data-testid="monthly-revenue-report"]');
    await page.click('[data-testid="generate-button"]');

    // Wait for report generation
    await expect(page.locator('[data-testid="report-generating"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-ready"]')).toBeVisible();

    // Download report
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="download-report-button"]');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('revenue-report');
  });

  test('should verify responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Login
    await page.fill('[data-testid="email-input"]', 'admin@beautify.com');
    await page.fill('[data-testid="password-input"]', 'AdminPassword123!');
    await page.click('[data-testid="login-button"]');

    // Check mobile navigation
    await expect(page.locator('[data-testid="mobile-nav-toggle"]')).toBeVisible();
    await page.click('[data-testid="mobile-nav-toggle"]');
    await expect(page.locator('[data-testid="mobile-nav-menu"]')).toBeVisible();

    // Navigate using mobile menu
    await page.click('[data-testid="mobile-nav-users"]');
    await expect(page).toHaveURL('/admin/users');
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible();

    // Check mobile table responsiveness
    await expect(page.locator('[data-testid="mobile-user-card"]')).toBeVisible();

    // Test mobile search
    await page.click('[data-testid="mobile-search-button"]');
    await expect(page.locator('[data-testid="mobile-search-overlay"]')).toBeVisible();
    await page.fill('[data-testid="mobile-search-input"]', 'john');
    await page.press('[data-testid="mobile-search-input"]', 'Enter');

    // Close mobile menu
    await page.click('[data-testid="mobile-nav-close"]');
    await expect(page.locator('[data-testid="mobile-nav-menu"]')).not.toBeVisible();
  });

  test('should handle error scenarios gracefully', async ({ page }) => {
    // Login
    await page.fill('[data-testid="email-input"]', 'admin@beautify.com');
    await page.fill('[data-testid="password-input"]', 'AdminPassword123!');
    await page.click('[data-testid="login-button"]');

    // Mock network failure
    await page.route('**/api/admin/users', route => route.abort());

    // Navigate to users page
    await page.click('[data-testid="users-nav-link"]');

    // Should show error state
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();

    // Test retry functionality
    await page.unroute('**/api/admin/users');
    await page.click('[data-testid="retry-button"]');
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
  });

  test('should maintain security and access control', async ({ page }) => {
    // Try to access admin page without authentication
    await page.goto('/admin/users');
    await expect(page).toHaveURL('/login');

    // Login as regular user (not admin)
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'UserPassword123!');
    await page.click('[data-testid="login-button"]');

    // Should redirect to appropriate dashboard
    await expect(page).toHaveURL('/customer/dashboard');

    // Try to access admin page
    await page.goto('/admin/users');
    await expect(page.locator('[data-testid="access-denied"]')).toBeVisible();
    
    // Should redirect back to customer dashboard
    await expect(page).toHaveURL('/customer/dashboard');
  });
});