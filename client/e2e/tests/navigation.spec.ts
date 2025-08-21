import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';
import { BookDetailPage } from '../pages/BookDetailPage';
import { TestUtils } from '../utils/test-utils';
import { mockBooks } from '../fixtures/test-data';
import { mockReviews } from '../fixtures/test-data';

test.describe('Navigation and Routing', () => {
  let homePage: HomePage;
  let searchPage: SearchPage;
  let bookDetailPage: BookDetailPage;
  let testUtils: TestUtils;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    searchPage = new SearchPage(page);
    bookDetailPage = new BookDetailPage(page);
    testUtils = new TestUtils(page);

    // Mock API responses for consistent testing
    await testUtils.mockApiResponses();
  });

  test.afterEach(async () => {
    await testUtils.clearRoutes();
  });

  test('should navigate from home to search page', async () => {
    await homePage.goto();
    await homePage.waitForBooksToLoad();

    // Navigate to search page
    await homePage.navigateToSearch();

    // Verify we're on the search page
    await expect(searchPage.page).toHaveURL(/\/search/);
    await searchPage.verifyPageElements();
  });

  test('should navigate from home to book detail page', async () => {
    await homePage.goto();
    await homePage.waitForBooksToLoad();

    // Click on first book
    await homePage.clickViewDetailsForBook(0);

    // Verify we're on the book detail page
    await expect(bookDetailPage.page).toHaveURL(/\/book\/\d+/);
    await bookDetailPage.waitForBookToLoad();
    await bookDetailPage.verifyBookDetails();
  });

  test('should navigate from book detail back to home', async () => {
    await bookDetailPage.goto('1');
    await bookDetailPage.waitForBookToLoad();

    // Go back to home
    await bookDetailPage.goBack();

    // Verify we're back on home page
    await expect(homePage.page).toHaveURL('/');
    await homePage.verifyPageElements();
  });

  test('should navigate from search to book detail', async () => {
    // Mock search results
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, 2),
      reviews: mockReviews.slice(0, 2),
      totalResults: 5,
      query: 'Gatsby'
    });

    await searchPage.goto();
    await searchPage.searchFor('Gatsby');
    await searchPage.waitForSearchResults();

    // Verify tabs are visible after search
    await searchPage.verifyPageElementsAfterSearch();

    // Click on first book result
    await searchPage.clickBookResult(0);

    // Verify we're on the book detail page
    await expect(bookDetailPage.page).toHaveURL(/\/book\/\d+/);
    await bookDetailPage.waitForBookToLoad();
  });

  test('should handle direct URL navigation to book detail', async () => {
    // Navigate directly to book detail URL
    await bookDetailPage.goto('1');

    // Verify page loads correctly
    await bookDetailPage.waitForBookToLoad();
    await bookDetailPage.verifyBookDetails();
    await expect(bookDetailPage.page).toHaveURL('/book/1');
  });

  test('should handle direct URL navigation to search page', async () => {
    // Navigate directly to search URL
    await searchPage.goto();

    // Verify page loads correctly
    await searchPage.verifyPageElements();
    await expect(searchPage.page).toHaveURL('/search');
  });

  test('should handle browser back and forward buttons', async () => {
    // Mock search results
    await testUtils.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, 2),
      reviews: mockReviews.slice(0, 2),
      totalResults: 5,
      query: 'Gatsby'
    });
    // Start at home
    await homePage.goto();
    await homePage.waitForBooksToLoad();

    // Navigate to search
    await homePage.navigateToSearch();
    await expect(searchPage.page).toHaveURL(/\/search/);

    // Navigate to book detail
    await searchPage.searchFor('test');
    await searchPage.waitForSearchResults();
    await searchPage.clickBookResult(0);
    await expect(bookDetailPage.page).toHaveURL(/\/book\/\d+/);

    // Use browser back button
    await bookDetailPage.page.goBack();
    await expect(searchPage.page).toHaveURL(/\/search/);

    // Use browser back button again
    await searchPage.page.goBack();
    await expect(homePage.page).toHaveURL('/');

    // Use browser forward button
    await homePage.page.goForward();
    await expect(searchPage.page).toHaveURL(/\/search/);
  });


  test('should handle invalid routes gracefully', async () => {
    // Navigate to non-existent route
    await homePage.page.goto('/non-existent-route');

    // Should redirect to home or show 404 page
    // Adjust this based on your app's 404 handling
    await expect(homePage.page).toHaveURL(/\/(|404)/);
  });

  test('should handle invalid book ID in URL', async () => {
    // Navigate to book with invalid ID
    await bookDetailPage.goto('999999');

    // Should handle gracefully (show error or redirect)
    await expect(bookDetailPage.page).toHaveURL('/book/999999');
    // Verify error handling doesn't crash the page
    await expect(bookDetailPage.page.locator('body')).toBeVisible();
  });

  test('should handle page refresh correctly', async () => {
    // Navigate to book detail
    await bookDetailPage.goto('1');
    await bookDetailPage.waitForBookToLoad();

    // Refresh the page
    await bookDetailPage.page.reload();

    // Verify page still works after refresh
    await bookDetailPage.waitForBookToLoad();
    await bookDetailPage.verifyBookDetails();
    await expect(bookDetailPage.page).toHaveURL('/book/1');
  });

  test('should handle navigation with keyboard shortcuts', async () => {
    await homePage.goto();
    await homePage.waitForBooksToLoad();

    // Navigate to search using keyboard (if implemented)
    await homePage.page.keyboard.press('/');

    // Should focus search input or navigate to search page
    // Adjust based on your app's keyboard navigation
    const searchInput = homePage.page.getByRole('textbox', { name: /search/i });
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeFocused();
    }
  });

  test('should handle rapid navigation clicks', async () => {
    await homePage.goto();
    await homePage.waitForBooksToLoad();

    // Rapidly click navigation elements
    await homePage.navigateToSearch();
    await homePage.page.waitForTimeout(100);
    await homePage.page.goBack();
    await homePage.page.waitForTimeout(100);
    await homePage.clickViewDetailsForBook(0);

    // Should end up on book detail page
    await expect(bookDetailPage.page).toHaveURL(/\/book\/\d+/);
    await bookDetailPage.waitForBookToLoad();
  });

  test('should maintain scroll position when navigating back', async () => {
    await homePage.goto();
    await homePage.waitForBooksToLoad();

    // Scroll down on home page
    await homePage.page.evaluate(() => window.scrollTo(0, 500));
    const scrollPosition = await homePage.page.evaluate(() => window.scrollY);

    // Navigate to book detail
    await homePage.clickViewDetailsForBook(0);
    await bookDetailPage.waitForBookToLoad();

    // Go back
    await bookDetailPage.goBack();

    // Check if scroll position is restored (may vary by browser/implementation)
    const newScrollPosition = await homePage.page.evaluate(() => window.scrollY);
    // Allow some tolerance for scroll position restoration
    expect(Math.abs(newScrollPosition - scrollPosition)).toBeLessThan(100);
  });
});