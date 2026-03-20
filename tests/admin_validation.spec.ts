import { test, expect } from '@playwright/test';

/**
 * Admin Validation Tests
 */

test.describe('Admin User Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set viewport to ensure sidebar/nav links are visible
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Log console messages for debugging
    page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));

    await page.goto('/login');
    await page.fill('[data-testid="login-username-input"]', 'admin');
    await page.fill('[data-testid="login-password-input"]', 'password123');
    await page.click('[data-testid="login-submit-btn"]');
    await page.waitForURL('**/admin**');
  });

  test('Step 1: Dashboard Overview & Stats', async ({ page }) => {
    await expect(page).toHaveURL(/.*admin/);
    await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();
    
    // Validate stat cards are present and have values
    const statTypes = ['users', 'lessons', 'quizzes', 'games'];
    for (const type of statTypes) {
      const card = page.locator(`[data-testid="stat-${type}"]`);
      await expect(card).toBeVisible();
      const value = page.locator(`[data-testid="stat-${type}-value"]`);
      await expect(value).toContainText(/\d+/);
    }
  });

  test('Step 2: Lessons Management', async ({ page }) => {
    await page.click('[data-testid="admin-nav-lessons"]');
    await page.waitForURL('**/admin/lessons');
    
    await expect(page.locator('h1:has-text("Lessons")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    
    const rowCount = await page.locator('tbody tr').count();
    console.log(`ADMIN LESSONS COUNT: ${rowCount}`);
    await expect(rowCount).toBeGreaterThan(0);
  });

  test('Step 3: User Management & Filtering', async ({ page }) => {
    await page.click('[data-testid="admin-nav-users"]');
    await page.waitForURL('**/admin/users');
    
    await expect(page.locator('h1:has-text("Users")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    
    const roleFilter = page.locator('[data-testid="users-role-filter"]');
    await expect(roleFilter).toBeVisible();
    
    const initialCount = await page.locator('tbody tr').count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Filter by Admin
    await roleFilter.click();
    await page.locator('div[role="option"]:has-text("Admins")').click();
    
    await page.waitForTimeout(1000); 
    const adminCount = await page.locator('tbody tr').count();
    console.log(`ADMIN ROLE COUNT: ${adminCount}`);
    expect(adminCount).toBeGreaterThan(0);
  });

  test('Step 4: Add New Lesson Flow (via Dialog)', async ({ page }) => {
    await page.click('[data-testid="admin-nav-lessons"]');
    await page.waitForURL('**/admin/lessons');
    
    await page.click('[data-testid="add-lesson-btn"]');
    
    // Fill the dialog
    const testTitle = `Test Lesson ${Date.now()}`;
    await page.fill('[data-testid="lesson-title-input"]', testTitle);
    
    // Select subject
    await page.click('[data-testid="lesson-subject-select"]');
    await page.locator('div[role="option"]').first().click();
    
    await page.fill('[data-testid="lesson-content-input"]', 'This is a test lesson content.');
    await page.fill('[data-testid="lesson-points-input"]', '20');
    
    // Save
    await page.click('[data-testid="save-lesson-btn"]');
    
    // Check for success or error toast
    // The dialog should close on success
    const dialog = page.locator('[role="dialog"]');
    
    try {
      await expect(dialog).not.toBeVisible({ timeout: 5000 });
    } catch (e) {
      // If dialog is still visible, check for error message
      const errorToast = page.locator('text=Failed to save lesson');
      if (await errorToast.isVisible()) {
        console.log("FAILED TO SAVE LESSON: Error toast detected");
      }
      throw e;
    }
    
    // Check if added to table
    await expect(page.locator(`td:has-text("${testTitle}")`)).toBeVisible({ timeout: 10000 });
  });

  test('Step 5: Schools Management', async ({ page }) => {
    await page.click('[data-testid="admin-nav-schools"]');
    await page.waitForURL('**/admin/schools');
    
    await expect(page.locator('h1:has-text("Schools")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });
});
