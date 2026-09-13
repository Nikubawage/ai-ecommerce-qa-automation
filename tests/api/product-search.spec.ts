import { expect, test } from '@playwright/test';

test('GET product search returns matching products', async ({ request }) => {
  const response = await request.get(
    'https://api.practicesoftwaretesting.com/products/search?q=pliers',
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.data).toBeDefined();
  expect(body.total).toBe(4);

  const productNames = body.data.map(
    (product: { name: string }) => product.name,
  );

  expect(productNames).toContain('Combination Pliers');
  expect(productNames).toContain('Pliers');
  expect(productNames).toContain('Long Nose Pliers');
  expect(productNames).toContain('Slip Joint Pliers');
});

test('GET product search returns no results for an invalid search', async ({ request }) => {
  const response = await request.get(
    'https://api.practicesoftwaretesting.com/products/search?q=invalid-product-xyz',
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.data).toEqual([]);
  expect(body.total).toBe(0);
});