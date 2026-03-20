import { test, expect } from '@playwright/test';

test.describe('Login Functionality', () => {
  test('should successfully log in a student user', async ({ page }) => {
    // Navigate to the login page (or root if it redirects to login)
    await page.goto('/');

    // Fill in credentials
    await page.fill('input#username', 'student'); // Updated selector
    await page.fill('input#password', 'Password1!'); // Updated selector

    // Click the submit button
    await page.click('button[type="submit"]');

    // Wait for navigation to the dashboard or a known post-login page
    // We expect to be redirected to /student/dashboard upon successful login
    await page.waitForURL('/student/dashboard');

    // Optionally, assert that a logout button or user-specific element is visible
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(page.getByText('Welcome, student')).toBeVisible(); // Assuming a welcome message
  });
});