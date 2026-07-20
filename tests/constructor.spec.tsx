import { test, expect } from '@playwright/test';

const MOCK_ORDER = {
  success: true,
  name: 'Краторный марсианский бургер',
  order: {
    number: 12345
  }
};

const MOCK_USER = {
  success: true,
  user: {
    email: 'test@yandex.ru',
    name: 'TestUser'
  }
};

test.describe('Проверка конструктора бургеров', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
    });

    await page.goto('/');
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    await page.locator('li').filter({ hasText: 'Краторная булка N-200i' }).getByRole('button', { name: 'Добавить' }).click();
    await page.locator('li').filter({ hasText: 'Биокотлета из марсианской Магнолии' }).getByRole('button', { name: 'Добавить' }).click();

    const constructorArea = page.locator('section').filter({ hasText: 'Оформить заказ' });
    await expect(constructorArea.locator('text=Краторная булка N-200i').first()).toBeVisible();
    await expect(constructorArea.locator('text=Биокотлета из марсианской Магнолии')).toBeVisible();
  });

  test('работа модального окна ингредиента (открытие, закрытие по крестику и оверлею)', async ({ page }) => {
    await page.locator('text=Краторная булка N-200i').first().click();
      
    const modal = page.locator('#modals'); 
    await expect(modal.locator('text=Детали ингредиента')).toBeVisible();
    await expect(modal.locator('text=Краторная булка N-200i')).toBeVisible();

    const closeButton = modal.locator('button').first();
    await closeButton.click();
    await expect(modal.locator('text=Детали ингредиента')).not.toBeVisible();

    await page.locator('text=Краторная булка N-200i').first().click();
    await expect(modal.locator('text=Детали ингредиента')).toBeVisible();
      
    await page.mouse.click(10, 10);
    await expect(modal.locator('text=Детали ингредиента')).not.toBeVisible();
  });

  test('полный цикл создания заказа', async ({ page }) => {
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({ json: MOCK_USER });
    });
    
    await page.evaluate(() => {
      document.cookie = 'accessToken=mock_token; path=/;';
      localStorage.setItem('refreshToken', 'mock_refresh_token');
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_ORDER)
      });
    });

    await page.goto('/');

    await page.locator('li').filter({ hasText: 'Краторная булка N-200i' }).getByRole('button', { name: 'Добавить' }).click();
    await page.locator('li').filter({ hasText: 'Биокотлета из марсианской Магнолии' }).getByRole('button', { name: 'Добавить' }).click();

    const orderButton = page.locator('button', { hasText: 'Оформить заказ' });
    await orderButton.click();

    const modal = page.locator('#modals');
    await expect(modal.locator('text=12345')).toBeVisible();

    const closeButton = modal.locator('button').first();
    await closeButton.click();
    await expect(modal.locator('text=12345')).not.toBeVisible();

    const constructorArea = page.locator('section').filter({ hasText: 'Оформить заказ' });
    await expect(constructorArea.locator('text=Краторная булка N-200i')).not.toBeVisible();
    await expect(constructorArea.locator('text=Биокотлета из марсианской Магнолии')).not.toBeVisible();
  });
});