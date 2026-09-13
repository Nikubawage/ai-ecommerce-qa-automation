import { Locator, Page } from '@playwright/test';

/** Page object for the Practice Software Testing login page. */
export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByRole('textbox', { name: 'Email address *' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/auth/login');
  }

  async enterCredentials(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitLogin(): Promise<void> {
    await this.loginButton.click();
    await this.page.waitForURL('**/account');
  }
}