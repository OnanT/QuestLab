import { test, expect } from '@playwright/test';

test.describe('Typing Game', () => {
  test('should allow a student to complete a typing game', async ({ page }) => {
    // 1. Login as student
    await page.goto('/login');
    
    // Use data-testid as seen in LoginPage.jsx
    await page.fill('[data-testid="login-username-input"]', 'student');
    await page.fill('[data-testid="login-password-input"]', 'student123');
    await page.click('[data-testid="login-submit-btn"]');

    // 2. Wait for dashboard or successful login
    // The page should navigate to /dashboard for students
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // 3. Navigate directly to the typing game
    // ID 488: Pinneys Beach — Home Row
    await page.goto('/games/488');

    // 4. Wait for the game component to load
    // It should show "Island Challenge" and the title
    await expect(page.getByText('Island Challenge')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Pinneys Beach — Home Row')).toBeVisible();

    // 5. Get the target text
    // The target for lesson 488 is: "aaa sss ddd fff jjj kkk lll aaa sss ddd fff jjj"
    const targetText = "aaa sss ddd fff jjj kkk lll aaa sss ddd fff jjj";
    
    // 6. Focus and type
    // The game container is usually focused, but let's be explicit
    // TypingGame.jsx has tabIndex="0"
    await page.locator('div[tabindex="0"]').first().focus();
    
    // Type the characters
    // Using a small delay to be more realistic but still fast
    for (const char of targetText) {
      await page.keyboard.press(char);
    }

    // 7. Wait for completion modal
    // ResultModal.jsx should appear with stats
    await expect(page.getByText('Lesson Complete!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Accuracy')).toBeVisible();
    await expect(page.getByText('100%')).toBeVisible();
    
    // 8. Click Continue to exit
    await page.getByRole('button', { name: /Continue/i }).click();
    
    // 9. Verify redirection back to dashboard or games list
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
