import { Locator, Page } from '@playwright/test';

/** Page object for a Practice Software Testing product details page. */
export class ProductPage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productSpecifications: Locator;
  readonly quantityInput: Locator;
  readonly quantityLimitAlert: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly increaseQuantityButton: Locator;
  readonly addToCartButton: Locator;

  constructor(private readonly page: Page) {
    this.productName = page.locator('[data-test="product-name"], h1').first();
    this.productPrice = page.locator('[data-test="unit-price"], [aria-label="unit-price"]').first();
    this.productDescription = page.locator('[data-test="product-description"], #description').first();
    this.productSpecifications = page.locator('[data-test="product-specs"], .specs-table').first();
    this.quantityInput = page.locator('[data-test="quantity"], #quantity-input').first();
    this.quantityLimitAlert = page.getByRole('alert');
    this.decreaseQuantityButton = page.locator('[data-test="decrease-quantity"], #btn-decrease-quantity').first();
    this.increaseQuantityButton = page.locator('[data-test="increase-quantity"], #btn-increase-quantity').first();
    this.addToCartButton = page.locator('[data-test="add-to-cart"], #btn-add-to-cart, button.btn-success').first();
  }

  async getProductName(): Promise<string> {
    return this.productName.innerText();
  }

  async getProductPrice(): Promise<string> {
    return this.productPrice.innerText();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async open(productUrl: string): Promise<void> {
    await this.page.goto(productUrl, { waitUntil: 'domcontentloaded' });
  }
}
