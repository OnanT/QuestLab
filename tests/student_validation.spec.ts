import { test, expect } from '@playwright/test';

/**
 * Student Validation Tests
 */

test.describe('Student User Validation', () => {

  test.beforeEach(async ({ page }) => {
    // Set viewport to ensure sidebar/nav links are visible
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Log console messages for debugging
    page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));

    // Login as Emma Smith
    await page.goto('/login');
    await page.fill('[data-testid="login-username-input"]', 'emma_smith');
    await page.fill('[data-testid="login-password-input"]', 'password123');
    await page.click('[data-testid="login-submit-btn"]');
    await page.waitForURL('**/dashboard**');
  });

  test('Step 1: Dashboard Welcome & Stats', async ({ page }) => {
    // Dashboard header should welcome the student
    await expect(page.locator('h1')).toContainText('Welcome back, Emma!');
    
    // Check for progress stats
    await expect(page.locator('p:has-text("Total Points")')).toBeVisible();
    await expect(page.locator('p:has-text("Quizzes")').first()).toBeVisible();
    await expect(page.locator('p:has-text("Games")').first()).toBeVisible();
  });

  test('Step 2: Lessons Page - Search & Explore', async ({ page }) => {
    await page.click('[data-testid="nav-lessons"]');
    await page.waitForURL('**/lessons');
    
    await expect(page.locator('h1:has-text("Explore Lessons")')).toBeVisible();
    
    // Check that lessons are loaded
    const lessonCards = page.locator('[data-testid^="lesson-card-"]');
    await expect(lessonCards.first()).toBeVisible();
    const count = await lessonCards.count();
    console.log(`STUDENT LESSONS COUNT: ${count}`);
    expect(count).toBeGreaterThan(0);
    
    // Test search
    await page.fill('input[placeholder*="Search lessons"]', 'Hook');
    await page.waitForTimeout(500);
    const filteredCount = await page.locator('[data-testid^="lesson-card-"]').count();
    console.log(`FILTERED LESSONS COUNT: ${filteredCount}`);
    expect(filteredCount).toBeLessThanOrEqual(count);
  });

  test('Step 3: Lesson View Flow', async ({ page }) => {
    await page.click('[data-testid="nav-lessons"]');
    await page.waitForURL('**/lessons');
    
    const firstLesson = page.locator('[data-testid^="lesson-card-"]').first();
    const lessonTitle = await firstLesson.locator('h3').innerText();
    await firstLesson.click();
    
    await page.waitForURL('**/lessons/*');
    await expect(page.locator('h1')).toContainText(lessonTitle);
    await expect(page.locator('div.prose')).toBeVisible();
  });

  test('Step 4: Games Page', async ({ page }) => {
    await page.click('[data-testid="nav-games"]');
    await page.waitForURL('**/games');
    
    // Fixed: Title is just "Games"
    await expect(page.locator('h1:has-text("Games")')).toBeVisible();
    
    const gameCards = page.locator('[data-testid^="game-card-"]');
    await expect(gameCards.first()).toBeVisible();
    const count = await gameCards.count();
    console.log(`FOUND GAME CARDS: ${count}`);
    expect(count).toBeGreaterThan(0);
  });

  test('Step 5: Logout Flow', async ({ page }) => {
    await page.click('[data-testid="logout-btn"]');
    await page.waitForURL('**/');
    await expect(page).toHaveURL(/.*\//);
  });
});
