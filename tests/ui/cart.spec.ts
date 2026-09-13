import { expect, test } from '../../src/fixtures/testFixtures';
import { CartPage } from '../../src/pages/CartPage';
import { HomePage } from '../../src/pages/HomePage';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductPage } from '../../src/pages/ProductPage';
import { getTestProduct, getTestUser } from '../../src/utils/testData';

async function addTestProductToCart(
  homePage: HomePage,
  productPage: ProductPage,
  productName: string,
  searchTerm: string,
): Promise<void> {
  await homePage.navigate();
  await homePage.searchFor(searchTerm);
  await homePage.openProduct(productName);
  await productPage.addToCart();
}

// Blocked: the current public application does not retain an item after its Add to cart control is clicked.
test.fixme(
  'customer can add a product to the cart',
  async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const product = getTestProduct();
  const user = getTestUser();

  await loginPage.navigate();
  await loginPage.enterCredentials(user.email, user.password);
  await loginPage.submitLogin();
  await addTestProductToCart(homePage, productPage, product.name, product.searchTerm);
  await cartPage.navigate();

  await expect(cartPage.cartItem(product.name)).toBeVisible();
  await expect(cartPage.cartItem(product.name).getByTestId('product-quantity')).toHaveValue('1');
  },
);

test.fixme(
  'cart displays the selected product and a positive total',
  async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const product = getTestProduct();
  const user = getTestUser();

  await loginPage.navigate();
  await loginPage.enterCredentials(user.email, user.password);
  await loginPage.submitLogin();
  await addTestProductToCart(homePage, productPage, product.name, product.searchTerm);
  await cartPage.navigate();

  await expect(cartPage.cartItem(product.name)).toBeVisible();
  await expect(cartPage.cartTotal).toContainText(/\d/);
  await expect(cartPage.checkoutButton).toBeEnabled();
  },
);
