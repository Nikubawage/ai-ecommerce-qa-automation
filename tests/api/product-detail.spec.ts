import { expect, test } from '@playwright/test';
import { ApiClient } from '../../src/api/apiClient';

test('GET product by ID returns the expected product', async ({ request }) => {
  const apiClient = new ApiClient(request);

  const listResponse = await apiClient.get('/products');

  expect(listResponse.status()).toBe(200);

  const listBody = await listResponse.json();
  const product = listBody.data[0];

  expect(product).toBeDefined();
  expect(product.id).toBeTruthy();

  const response = await apiClient.get(`/products/${product.id}`);

  expect(response.status()).toBe(200);

  const productDetails = await response.json();

  expect(productDetails.id).toBe(product.id);
  expect(productDetails.name).toBe(product.name);
  expect(productDetails.price).toBe(product.price);
  expect(productDetails.in_stock).toBe(product.in_stock);
});

test('GET product by invalid ID returns not found', async ({ request }) => {
  const apiClient = new ApiClient(request);

  const response = await apiClient.get(
    '/products/invalid-product-id',
  );

  expect(response.status()).toBe(404);

  const body = await response.json();

  expect(body.message).toBe('Requested item not found');
});