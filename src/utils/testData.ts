import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface TestUser {
  email: string;
  password: string;
}

export interface TestProduct {
  name: string;
  searchTerm: string;
}

export const invalidProductSearchTerm = 'invalid-product-xyz';

export interface TestCheckoutAddress {
  country: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
}

interface UsersData {
  standardUser: TestUser;
}

interface ProductsData {
  products: TestProduct[];
}

interface CheckoutData {
  address: TestCheckoutAddress;
}

function loadJsonFile<T>(fileName: string): T {
  const filePath = resolve(process.cwd(), 'test-data', fileName);

  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as T;
  } catch {
    throw new Error(`Unable to load test data from test-data/${fileName}.`);
  }
}

function getFirstItem<T>(items: T[] | undefined, dataType: string): T {
  if (!items?.length) {
    throw new Error(`No ${dataType} test data is available.`);
  }

  return items[0];
}

export function getTestUser(): TestUser {
  const { standardUser } = loadJsonFile<UsersData>('users.json');

  if (!standardUser?.email || !standardUser.password) {
    throw new Error('No standard user test data is available.');
  }

  return standardUser;
}

export function getTestProduct(): TestProduct {
  const { products } = loadJsonFile<ProductsData>('products.json');
  return getFirstItem(products, 'product');
}

export function getCheckoutAddress(): TestCheckoutAddress {
  const { address } = loadJsonFile<CheckoutData>('checkout.json');

  if (!address) {
    throw new Error('No checkout address test data is available.');
  }

  return address;
}
