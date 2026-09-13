import { expect, test } from '../../src/fixtures/testFixtures';
import { HomePage } from '../../src/pages/HomePage';
import { ProductPage } from '../../src/pages/ProductPage';
import { getTestProduct } from '../../src/utils/testData';

test('customer can view product details', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const product = getTestProduct();

  await homePage.navigate();
  await homePage.searchFor(product.searchTerm);
  await homePage.openProduct(product.name);

  await expect(productPage.productName).toHaveText(product.name);
  await expect(productPage.productDescription).toBeVisible();
  await expect(productPage.productPrice).toContainText(/\d/);
  await expect(productPage.quantityInput).toHaveValue('1');
});

test('quantity is kept at the minimum when set to zero', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const product = getTestProduct();

  await homePage.navigate();
  await homePage.searchFor(product.searchTerm);
  await homePage.openProduct(product.name);

  await productPage.setQuantity(0);

  await expect(productPage.quantityInput).toHaveAttribute('min', '1');
  await expect(productPage.quantityInput).toHaveValue('1');
});

test('quantity accepts the maximum value of 99', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const product = getTestProduct();

  await homePage.navigate();
  await homePage.searchFor(product.searchTerm);
  await homePage.openProduct(product.name);

  await productPage.setQuantity(99);

  await expect(productPage.quantityInput).toHaveAttribute('max', '99');
  await expect(productPage.quantityInput).toHaveValue('99');
});

test('quantity is kept at the maximum when set to 100', async ({ page }) => {
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const product = getTestProduct();

  await homePage.navigate();
  await homePage.searchFor(product.searchTerm);
  await homePage.openProduct(product.name);

  await productPage.setQuantity(100);

  await expect(productPage.quantityInput).toHaveValue('99');
  await expect(productPage.quantityLimitAlert).toHaveText('You can order at most 99 of this product.');
});
