import { expect, test } from '../../src/fixtures/testFixtures';
import { HomePage } from '../../src/pages/HomePage';
import { getTestProduct, invalidProductSearchTerm } from '../../src/utils/testData';

test('customer can search for a product', async ({ page }) => {
  const homePage = new HomePage(page);
  const product = getTestProduct();

  await homePage.navigate();
  await homePage.searchFor(product.searchTerm);

  await expect(homePage.productCard(product.name)).toBeVisible();
});

test('customer sees no-results state for an invalid product search', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.navigate();
  await homePage.searchFor(invalidProductSearchTerm);

  await expect(homePage.noResultsMessage).toHaveText('There are no products found.');
});

test('customer can reset a product search', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.navigate();
  await homePage.searchFor('pliers');

  await expect(homePage.productCard('Combination Pliers')).toBeVisible();

  await homePage.clearSearch();

  await expect(homePage.searchInput).toHaveValue('');
  await expect(homePage.searchCaption).toBeHidden();
  await expect(homePage.productCards.first()).toBeVisible();
});
