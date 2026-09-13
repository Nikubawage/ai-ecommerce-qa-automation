import { Locator, Page } from '@playwright/test';

/** Page object for the Practice Software Testing shopping cart. */
export class CartPage {
  readonly cartItems: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.locator('tbody tr').filter({
      has: page.getByTestId('product-title'),
    });
    this.cartTotal = page.getByTestId('cart-total');
    this.checkoutButton = page.getByTestId('proceed-1');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/checkout');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  cartItem(productName: string): Locator {
    return this.cartItems.filter({
      has: this.page.getByTestId('product-title').filter({ hasText: productName }),
    });
  }

  async getItemName(productName: string): Promise<string> {
    return this.cartItem(productName).getByTestId('product-title').innerText();
  }

  async getItemQuantity(productName: string): Promise<string> {
    return this.cartItem(productName).getByTestId('product-quantity').inputValue();
  }

  async getItemPrice(productName: string): Promise<string> {
    return this.cartItem(productName).getByTestId('product-price').innerText();
  }

  async setItemQuantity(productName: string, quantity: number): Promise<void> {
    await this.cartItem(productName)
      .getByTestId('product-quantity')
      .fill(String(quantity));
    await this.cartItem(productName).getByTestId('product-quantity').blur();
  }

  async removeItem(productName: string): Promise<void> {
    await this.cartItem(productName).locator('a.btn-danger').click();
  }

  async getTotal(): Promise<string> {
    return this.cartTotal.innerText();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
