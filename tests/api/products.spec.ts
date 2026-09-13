import { expect, test } from '@playwright/test';

test('GET products returns product list', async ({ request }) => {
  const response = await request.get(
    'https://api.practicesoftwaretesting.com/products',
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.data).toBeDefined();
  expect(body.data.length).toBeGreaterThan(0);
  expect(body.total).toBe(50);

  const firstProduct = body.data[0];

  expect(firstProduct.name).toBe('Combination Pliers');
  expect(firstProduct.price).toBe(14.15);
  expect(firstProduct.in_stock).toBe(true);
});