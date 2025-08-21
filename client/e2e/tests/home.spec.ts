import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { TestUtils } from '../utils/test-utils';

test.describe('Home Page', () => {
  let homePage: HomePage;
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    testUtils = new TestUtils(page);

    // Mock API responses for consistent testing
    await testUtils.mockApiResponses();
  });

  test.afterEach(async () => {
    await testUtils.clearRoutes();
  });

  test('should display the home page with correct elements', async () => {
    await homePage.goto();

    // Verify page elements are visible
    await homePage.verifyPageElements();

    // Verify page title
    await expect(homePage.page).toHaveTitle(/Book Review Library/i);
  });

  test('should load and display books', async () => {
    await homePage.goto();

    // Wait for books to load
    await homePage.waitForBooksToLoad();

    // Verify books are displayed
    const bookCount = await homePage.getBookCount();
    expect(bookCount).toBeGreaterThan(0);

    // Verify first book card elements
    await homePage.verifyBookCard(0);
  });

  test('should display book information correctly', async () => {
    await homePage.goto();
    await homePage.waitForBooksToLoad();

    // Get book information
    const bookTitle = await homePage.getBookTitle(0);
    const bookAuthor = await homePage.getBookAuthor(0);

    // Verify book information is not empty
    expect(bookTitle).toBeTruthy();
    expect(bookAuthor).toBeTruthy();

    // Verify expected test data
    expect(bookTitle).toContain('The Great Gatsby');
    expect(bookAuthor).toContain('F. Scott Fitzgerald');
  });

  test('should navigate to book detail when clicking view details', async () => {
    await homePage.goto();
    await homePage.waitForBooksToLoad();

    // Click on first book's view details button
    await homePage.clickViewDetailsForBook(0);

    // Verify navigation to book detail page
    await expect(homePage.page).toHaveURL(/\/book\/\d+/);
  });

  test('should navigate to search page when clicking search button', async () => {
    await homePage.goto();

    // Click search button in navigation
    await homePage.navigateToSearch();

    // Verify navigation to search page
    await expect(homePage.page).toHaveURL('/search');
  });

  test('should handle loading state correctly', async () => {
    await homePage.goto();

    // Initially, loading skeletons might be visible
    // Then they should disappear when content loads
    await homePage.waitForBooksToLoad();

    // Verify no loading skeletons are visible
    await expect(homePage.loadingSkeletons).toHaveCount(0);
  });

  test('should handle error state gracefully', async () => {
    // Mock API error
    await testUtils.mockApiErrors();

    await homePage.goto();

    // Handle potential error state
    await homePage.handleError();

    // Verify error handling doesn't break the page
    await homePage.verifyPageElements();
  });

  test('should be responsive on different screen sizes', async () => {
    await homePage.goto();
    await homePage.waitForBooksToLoad();

    // Test responsive design
    await testUtils.testResponsiveDesign();

    // Verify elements are still visible on mobile
    await homePage.page.setViewportSize({ width: 375, height: 667 });
    await homePage.verifyPageElements();
  });

  test('should maintain accessibility standards', async () => {
    await homePage.goto();
    await homePage.waitForBooksToLoad();

    // Check accessibility
    await testUtils.checkAccessibility();
  });

  test('should handle multiple books display', async () => {
    await homePage.goto();
    await homePage.waitForBooksToLoad();

    const bookCount = await homePage.getBookCount();

    // Verify multiple books are displayed (based on mock data)
    expect(bookCount).toBe(3);

    // Verify each book card
    for (let i = 0; i < bookCount; i++) {
      await homePage.verifyBookCard(i);
    }
  });

  test('should handle navigation bar interactions', async () => {
    await homePage.goto();

    // Verify navigation bar is visible
    await expect(homePage.navigationBar).toBeVisible();

    // Test home button (should stay on home page)
    await homePage.homeButton.click();
    await expect(homePage.page).toHaveURL('/');

    // Test search button navigation
    await homePage.searchButton.click();
    await expect(homePage.page).toHaveURL('/search');
  });

  test('should handle slow network conditions', async () => {
    // Simulate slow network
    await testUtils.simulateSlowNetwork();

    await homePage.goto();

    await homePage.verifyPageElements();
  });

  test('should display correct page metadata', async () => {
    await homePage.goto();

    // Verify page title
    await expect(homePage.page).toHaveTitle(/Book Review Library/i);

    // Verify main heading
    await expect(homePage.pageTitle).toBeVisible();
  });
});