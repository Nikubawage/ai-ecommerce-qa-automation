import { expect, test } from '../../src/fixtures/testFixtures';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { HomePage } from '../../src/pages/HomePage';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductPage } from '../../src/pages/ProductPage';
import { getCheckoutAddress, getTestProduct, getTestUser } from '../../src/utils/testData';

// Blocked: checkout has no product because the current public application does not retain added cart items.
test.fixme(
  'signed-in customer can complete checkout',
  async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const user = getTestUser();
  const product = getTestProduct();

  await loginPage.navigate();
  await loginPage.enterCredentials(user.email, user.password);
  await loginPage.submitLogin();

  await homePage.navigate();
  await homePage.searchFor(product.searchTerm);
  await homePage.openProduct(product.name);
  await productPage.addToCart();
  await cartPage.navigate();
  await cartPage.proceedToCheckout();

  await checkoutPage.fillCheckoutInformation(getCheckoutAddress());
  await checkoutPage.continueToPayment();
  await checkoutPage.selectPaymentMethod('cash-on-delivery');
  await checkoutPage.submitOrder();

  await expect(page.getByRole('heading', { name: /order confirmation|payment successful/i })).toBeVisible();
  },
);
