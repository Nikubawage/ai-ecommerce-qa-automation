import { expect, test } from '../../src/fixtures/testFixtures';
import { LoginPage } from '../../src/pages/LoginPage';
import { getTestUser } from '../../src/utils/testData';

test('customer can sign in with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = getTestUser();

  await loginPage.navigate();
  await loginPage.enterCredentials(user.email, user.password);
  await loginPage.submitLogin();

  await expect(page.getByRole('heading', { name: 'My account' })).toBeVisible();
});
