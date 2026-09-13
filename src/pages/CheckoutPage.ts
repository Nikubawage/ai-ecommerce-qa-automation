import { Locator, Page } from '@playwright/test';

export interface CheckoutAddress {
  country: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
}

/** Page object for the Practice Software Testing checkout address and payment steps. */
export class CheckoutPage {
  readonly countrySelect: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly continueToPaymentButton: Locator;
  readonly paymentMethodSelect: Locator;
  readonly placeOrderButton: Locator;

  constructor(private readonly page: Page) {
    this.countrySelect = page.getByTestId('country');
    this.postalCodeInput = page.getByTestId('postal_code');
    this.houseNumberInput = page.getByTestId('house_number');
    this.addressInput = page.getByTestId('street');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');
    this.continueToPaymentButton = page.getByTestId('proceed-3');
    this.paymentMethodSelect = page.getByTestId('payment-method');
    this.placeOrderButton = page.getByTestId('finish');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/checkout');
  }

  async fillCheckoutInformation(address: CheckoutAddress): Promise<void> {
    await this.countrySelect.selectOption(address.country);
    await this.postalCodeInput.fill(address.postalCode);
    await this.houseNumberInput.fill(address.houseNumber);
    await this.addressInput.fill(address.street);
    await this.cityInput.fill(address.city);
    await this.stateInput.fill(address.state);
  }

  async continueToPayment(): Promise<void> {
    await this.continueToPaymentButton.click();
  }

  async selectPaymentMethod(paymentMethod: string): Promise<void> {
    await this.paymentMethodSelect.selectOption(paymentMethod);
  }

  async submitOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }
}
