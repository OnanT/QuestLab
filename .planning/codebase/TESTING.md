# Testing Patterns

**Analysis Date:** 2024-07-25

## Test Frameworks

### End-to-End (E2E) Testing
- **Runner:** Playwright (`@playwright/test`).
- **Config:** `playwright.config.ts` at the project root.
- **Run Commands (from `package.json`):**
  ```bash
  npm run test:e2e              # Runs playwright tests
  npm run playwright:report     # Shows the last HTML report
  ```

### Backend (Integration) Testing
- **Runner:** Pytest.
- **Config:** `backend/pytest.ini`.
- **Run Command:**
  ```bash
  # From the 'backend' directory
  pytest
  ```

### Frontend (Unit/Component) Testing
- **Status:** Not detected. No test runner (like Vitest or Jest) is configured in `frontend/package.json`, and no `*.test.tsx` or `*.spec.tsx` files were found within `frontend/src`.

## Test File Organization

### E2E Tests
- **Location:** Stored in the root `/tests` directory.
- **Naming:** Files use the `*.spec.ts` suffix (e.g., `simple.spec.ts`).
- **Structure:**
  ```
  tests/
  ├── example.spec.ts
  └── simple.spec.ts
  ```

### Backend Tests
- **Location:** Stored in the `backend/tests/` directory.
- **Naming:** Files are prefixed with `test_` (e.g., `test_main.py`).
- **Structure:**
  ```
  backend/
  └── tests/
      └── test_main.py
  ```

## Test Structure & Patterns

### E2E Test Structure (Playwright)
- **Suite Organization:** Tests are grouped using `test.describe()`.
- **Pattern:** Tests follow a standard Arrange-Act-Assert pattern within an `async` function.
  ```typescript
  // In tests/simple.spec.ts
  import { test, expect } from '@playwright/test';

  test.describe('Games Page', () => {
    test('should display games after logging in', async ({ page }) => {
      // Arrange: Login
      await page.goto('/');
      await page.fill('input[name="username"]', 'student');
      await page.fill('input[name="password"]', 'Password1!');
      await page.click('button[type="submit"]');

      // Act: Navigate to the games page
      await page.waitForURL('/student/dashboard');
      await page.click('a[href="/student/games"]');
      await page.waitForSelector('.game-card');

      // Assert: Verify content
      const games = await page.locator('.game-card').count();
      expect(games).toBeGreaterThan(0);
    });
  });
  ```

### Backend Test Structure (Pytest)
- **Pattern:** These are integration tests that interact with the API endpoints via a test client.
- **Client:** `fastapi.testclient.TestClient` is used to instantiate the app for testing.
  ```python
  // In backend/tests/test_main.py
  from fastapi.testclient import TestClient
  from ..main import app

  client = TestClient(app)

  def test_read_main():
      response = client.get("/")
      assert response.status_code == 200
      assert response.json() == {"message": "Island Quest Lab API", "status": "running", "version": "1.0.0"}

  def test_health_check():
      response = client.get("/health")
      assert response.status_code == 200
      assert response.json() == {"status": "healthy"}
  ```

## Mocking & Test Data

- **Mocking:** No dedicated mocking framework (like `jest.mock` or `unittest.mock`) was observed in the analyzed test files. Tests rely on the actual application environment.
- **Fixtures/Factories:** No fixtures or data factories were observed. Test data is hardcoded directly within the tests (e.g., login credentials).

## Coverage

- **Configuration:** No test coverage tools (like `nyc` or `coverage.py`) are configured.
- **Requirements:** Test coverage is not measured or enforced.

## Test Types

- **Unit Tests:** Not implemented for either the frontend or backend.
- **Integration Tests:** Basic integration tests exist for the backend API (`backend/tests/test_main.py`), verifying endpoint responses.
- **End-to-End Tests:** Implemented with Playwright (`/tests`), covering key user flows like logging in and navigating to a page.

---

*Testing analysis: 2024-07-25*
