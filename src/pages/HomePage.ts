import { Locator, Page } from '@playwright/test';

/** Page object for the Practice Software Testing product catalogue. */
export class HomePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResetButton: Locator;
  readonly sortSelect: Locator;
  readonly productCards: Locator;
  readonly searchCaption: Locator;
  readonly noResultsMessage: Locator;
  readonly cartLink: Locator;
  readonly accountMenu: Locator;
  readonly homeLink: Locator;
  readonly categoriesMenu: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.getByTestId('search-submit');
    this.searchResetButton = page.locator('[data-test="search-reset"]');
    this.sortSelect = page.getByTestId('sort');
    this.productCards = page.locator('a[data-test^="product-"]');
    this.searchCaption = page.locator('[data-test="search-caption"]');
    this.noResultsMessage = page.locator('[data-test="no-results"]');
    this.cartLink = page.getByTestId('nav-cart');
    this.accountMenu = page.getByTestId('nav-menu');
    this.homeLink = page.getByTestId('nav-home');
    this.categoriesMenu = page.getByTestId('nav-categories');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'commit' });
    await this.searchInput.waitFor({ state: 'visible' });
  }

  async searchFor(searchTerm: string): Promise<void> {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
  }

  async clearSearch(): Promise<void> {
    await this.searchResetButton.click();
  }

  async sortProducts(option: string): Promise<void> {
    await this.sortSelect.selectOption({ label: option });
  }

  productCard(productName: string): Locator {
    return this.productCards.filter({
      has: this.page.locator(`img[alt="${productName}"]`),
    });
  }

  async openProduct(productName: string): Promise<void> {
    await this.productCard(productName).click();
    await this.page.waitForURL('**/product/**');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openAccountMenu(): Promise<void> {
    await this.accountMenu.click();
  }
}
