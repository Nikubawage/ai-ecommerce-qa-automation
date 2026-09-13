import {
  After,
  Before,
  Given,
  Then,
  When,
  setWorldConstructor,
  setDefaultTimeout,
  World,
} from '@cucumber/cucumber';
import { expect, type Browser, type BrowserContext, chromium, type Page } from '@playwright/test';
import { environmentConfig } from '../../src/config/environments';
import { HomePage } from '../../src/pages/HomePage';
import { ProductPage } from '../../src/pages/ProductPage';
import { getTestProduct } from '../../src/utils/testData';

class ProductQuantityWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  productPage!: ProductPage;
}

setWorldConstructor(ProductQuantityWorld);

Before(async function (this: ProductQuantityWorld) {
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext({ baseURL: environmentConfig.baseURL });
  this.page = await this.context.newPage();
});

After(async function (this: ProductQuantityWorld) {
  await this.context?.close();
  await this.browser?.close();
});

Given('the customer is viewing a product with a quantity field', async function (this: ProductQuantityWorld) {
  const homePage = new HomePage(this.page);
  this.productPage = new ProductPage(this.page);
  const product = getTestProduct();

  await homePage.navigate();
  await homePage.searchFor(product.searchTerm);
  await homePage.openProduct(product.name);
  await expect(this.productPage.quantityInput).toBeVisible();
});

When('they set the quantity to {int}', async function (this: ProductQuantityWorld, quantity: number) {
  await this.productPage.setQuantity(quantity);
});

Then('the quantity input should show {int}', async function (this: ProductQuantityWorld, quantity: number) {
  await expect(this.productPage.quantityInput).toHaveValue(String(quantity));
});

Then('the quantity limit message should say {string}', async function (this: ProductQuantityWorld, message: string) {
  await expect(this.productPage.quantityLimitAlert).toHaveText(message);
});
