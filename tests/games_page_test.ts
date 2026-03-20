import { test, expect } from '@playwright/test';

console.log('Executing games_page_test.ts');

test.describe('Games Page', () => {
  test('should display games after logging in', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[name="username"]', 'student');
    await page.fill('input[name="password"]', 'Password1!');
    await page.click('button[type="submit"]');

    // Wait for navigation to the dashboard
    await page.waitForURL('/student/dashboard');

    // Navigate to the games page
    await page.click('a[href="/student/games"]');

    // Wait for the games to be visible
    await page.waitForSelector('.game-card');

    // Assert that there are games on the page
    const games = await page.locator('.game-card').count();
    expect(games).toBeGreaterThan(0);
  });
});
