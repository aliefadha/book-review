import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly bookCards: Locator;
  readonly bookTitles: Locator;
  readonly bookAuthors: Locator;
  readonly viewDetailsButtons: Locator;
  readonly loadingSkeletons: Locator;
  readonly errorAlert: Locator;
  readonly refreshButton: Locator;
  readonly navigationBar: Locator;
  readonly homeButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Book Review Library' });
    this.bookCards = page.locator('[data-testid="book-card"]');
    this.bookTitles = page.locator('[data-testid="book-title"]');
    this.bookAuthors = page.locator('[data-testid="book-author"]');
    this.viewDetailsButtons = page.getByRole('link', { name: /view details/i });
    this.loadingSkeletons = page.locator('.MuiSkeleton-root');
    this.errorAlert = page.getByRole('alert');
    this.navigationBar = page.locator('header');
    this.homeButton = page.getByRole('link', { name: 'Home' });
    this.searchButton = page.getByRole('link', { name: 'Search' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async waitForBooksToLoad() {
    // Wait for loading to finish
    await expect(this.loadingSkeletons).toHaveCount(0);
    // Wait for books to appear
    await expect(this.bookCards.first()).toBeVisible();
  }

  async getBookCount() {
    return await this.bookCards.count();
  }

  async clickViewDetailsForBook(index: number = 0) {
    await this.viewDetailsButtons.nth(index).click();
  }

  async getBookTitle(index: number = 0) {
    return await this.bookTitles.nth(index).textContent();
  }

  async getBookAuthor(index: number = 0) {
    return await this.bookAuthors.nth(index).textContent();
  }

  async navigateToSearch() {
    await this.searchButton.click();
  }

  async verifyPageElements() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.navigationBar).toBeVisible();
    await expect(this.homeButton).toBeVisible();
    await expect(this.searchButton).toBeVisible();
  }

  async verifyBookCard(index: number = 0) {
    const bookCard = this.bookCards.nth(index);
    await expect(bookCard).toBeVisible();
    await expect(this.bookTitles.nth(index)).toBeVisible();
    await expect(this.bookAuthors.nth(index)).toBeVisible();
    await expect(this.viewDetailsButtons.nth(index)).toBeVisible();
  }

  async handleError() {
    if (await this.errorAlert.isVisible()) {
      await this.refreshButton.click();
    }
  }
}