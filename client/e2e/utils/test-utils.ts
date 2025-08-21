import { Page, expect } from '@playwright/test';
import { mockBooks, mockReviews, searchResults } from '../fixtures/test-data';

/**
 * Utility functions for e2e tests
 */

const isApi = (route: { request: () => { resourceType: () => string } }) => {
  const t = route.request().resourceType();
  return t === 'xhr' || t === 'fetch';
};

export class TestUtils {
  constructor(private page: Page) { }

  async mockApiResponses() {
    // books list
    await this.page.route('**/books', async (route) => {
      if (!isApi(route)) return route.fallback();   // ← important
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockBooks),
      });
    });

    // individual book
    await this.page.route('**/books/*', async (route) => {
      if (!isApi(route)) return route.fallback();
      const url = new URL(route.request().url());
      const bookId = url.pathname.split('/').pop()!;
      const book = mockBooks.find(b => b.id === bookId);

      if (book) {
        const bookWithReviews = {
          ...book,
          reviews: mockReviews.filter(r => r.bookId === bookId),
        };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(bookWithReviews),
        });
      } else {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Book not found' }),
        });
      }
    });

    // search
    await this.page.route('**/search**', async (route) => {
      if (!isApi(route)) return route.fallback();
      const url = new URL(route.request().url());
      const q = url.searchParams.get('q');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(q ? searchResults : { books: [], reviews: [] }),
      });
    });

    // reviews POST
    await this.page.route('**/reviews', async (route) => {
      if (!isApi(route)) return route.fallback();
      if (route.request().method() !== 'POST') return route.fallback();

      const requestBody = await route.request().postDataJSON();
      const newReview = {
        id: String(Date.now()),
        ...requestBody,
        createdAt: new Date().toISOString(),
      };
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(newReview),
      });
    });

    // Optional: a final catch-all that lets everything else pass
    await this.page.route('**/*', (route) => route.fallback());
  }

  async mockApiErrors() {
    await this.page.route('**/books', (route) => {
      if (!isApi(route)) return route.fallback();
      return route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await this.page.route('**/search**', (route) => {
      if (!isApi(route)) return route.fallback();
      return route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Search service unavailable' }),
      });
    });
  }

  /**
   * Mock search results with custom data for tab testing
   */
  async mockSearchResultsWithTabs(customResults?: {
    books?: typeof mockBooks;
    reviews?: typeof mockReviews;
    totalResults?: number;
    query?: string;
  }) {
    const defaultResults = {
      books: mockBooks.slice(0, 2),
      reviews: mockReviews.slice(0, 2),
    };

    const results = { ...defaultResults, ...customResults };

    await this.page.route('**/search**', async (route) => {
      if (!isApi(route)) return route.fallback();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(results),
      });
    });
  }

  /**
   * Mock search results with only books (empty reviews tab)
   */
  async mockSearchResultsOnlyBooks(bookCount: number = 3) {
    await this.mockSearchResultsWithTabs({
      books: mockBooks.slice(0, bookCount),
      reviews: [],
      totalResults: bookCount,
      query: 'books only'
    });
  }

  /**
   * Mock search results with only reviews (empty books tab)
   */
  async mockSearchResultsOnlyReviews(reviewCount: number = 3) {
    await this.mockSearchResultsWithTabs({
      books: [],
      reviews: mockReviews.slice(0, reviewCount),
      totalResults: reviewCount,
      query: 'reviews only'
    });
  }

  /**
   * Mock empty search results (no tabs should appear)
   */
  async mockEmptySearchResults() {
    await this.mockSearchResultsWithTabs({
      books: [],
      reviews: [],
      totalResults: 0,
      query: 'no results'
    });
  }

  /**
   * Wait for network requests to complete
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `e2e/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  /**
   * Verify page accessibility
   */
  async checkAccessibility() {
    // Check for basic accessibility attributes
    const headings = this.page.locator('h1, h2, h3, h4, h5, h6');
    const buttons = this.page.locator('button');
    const links = this.page.locator('a');
    const inputs = this.page.locator('input, textarea');

    // Verify headings have text content
    const headingCount = await headings.count();
    for (let i = 0; i < headingCount; i++) {
      await expect(headings.nth(i)).not.toBeEmpty();
    }

    // Verify buttons have accessible names
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();
      expect(hasAriaLabel || hasText).toBeTruthy();
    }

    // Verify links have accessible names
    const linkCount = await links.count();
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const hasAriaLabel = await link.getAttribute('aria-label');
      const hasText = await link.textContent();
      expect(hasAriaLabel || hasText).toBeTruthy();
    }

    // Verify form inputs have labels
    const inputCount = await inputs.count();
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const inputId = await input.getAttribute('id');
      const hasAriaLabel = await input.getAttribute('aria-label');
      const hasAriaLabelledBy = await input.getAttribute('aria-labelledby');
      const hasLabel = await this.page.locator(`label[for="${inputId}"]`).count() > 0;

      expect(hasAriaLabel || hasAriaLabelledBy || hasLabel).toBeTruthy();
    }
  }

  /**
   * Verify responsive design at different viewport sizes
   */
  async testResponsiveDesign() {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForTimeout(500); // Allow time for responsive changes
      await this.takeScreenshot(`responsive-${viewport.name}`);
    }
  }

  /**
   * Simulate slow network conditions
   */
  async simulateSlowNetwork() {
    // Add delay to API calls while preserving existing mocks
    await this.page.route('**/books', async (route) => {
      if (!isApi(route)) return route.fallback();
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      const url = new URL(route.request().url());
      const bookId = url.pathname.split('/').pop();
      
      // If it's a specific book request
      if (bookId && bookId !== 'books') {
        const book = mockBooks.find(b => b.id === bookId);
        if (book) {
          const bookWithReviews = {
            ...book,
            reviews: mockReviews.filter(r => r.bookId === bookId),
          };
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(bookWithReviews),
          });
        } else {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Book not found' }),
          });
        }
      } else {
        // Books list request
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockBooks),
        });
      }
    });

    await this.page.route('**/books/*', async (route) => {
      if (!isApi(route)) return route.fallback();
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      const url = new URL(route.request().url());
      const bookId = url.pathname.split('/').pop()!;
      const book = mockBooks.find(b => b.id === bookId);

      if (book) {
        const bookWithReviews = {
          ...book,
          reviews: mockReviews.filter(r => r.bookId === bookId),
        };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(bookWithReviews),
        });
      } else {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Book not found' }),
        });
      }
    });

    // Add delay to other resources (CSS, JS, images) without breaking them
    await this.page.route('**/*', async (route) => {
      if (isApi(route)) {
        // Let API routes be handled by the specific handlers above
        return route.fallback();
      }
      await new Promise(resolve => setTimeout(resolve, 200)); // Shorter delay for assets
      await route.continue();
    });
  }

  /**
   * Clear all route handlers
   */
  async clearRoutes() {
    await this.page.unrouteAll();
  }
}

/**
 * Common test data generators
 */
export const generateTestData = {
  randomString: (length: number = 10) => {
    return Math.random().toString(36).substring(2, length + 2);
  },

  randomEmail: () => {
    return `test${Date.now()}@example.com`;
  },

  randomReview: () => ({
    reviewerName: `Test User ${Date.now()}`,
    comment: `This is a test review generated at ${new Date().toISOString()}`,
    rating: Math.floor(Math.random() * 5) + 1
  })
};