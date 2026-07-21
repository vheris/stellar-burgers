import { test, expect, Page } from '@playwright/test';

const HAR = {
  ingredients: './tests/hars/ingredients.har',
  user: './tests/hars/user.har',
  order: './tests/hars/order.har'
};

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const ORDER_NUMBER = 12345;

const constructorArea = (page: Page) =>
  page.locator('section').filter({ hasText: 'Оформить заказ' });

const addIngredient = (page: Page, name: string) =>
  page
    .locator('li')
    .filter({ hasText: name })
    .getByRole('button', { name: 'Добавить' })
    .click();

test.describe('Проверка конструктора бургеров', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(HAR.ingredients, {
      url: '**/api/ingredients',
      notFound: 'fallback'
    });
    await page.goto('/');
    await expect(
      page.locator('li').filter({ hasText: BUN_NAME }).first()
    ).toBeVisible();
  });

  test('добавление булки и начинки в конструктор', async ({ page }) => {
    await addIngredient(page, BUN_NAME);
    await addIngredient(page, MAIN_NAME);

    const area = constructorArea(page);
    await expect(area.locator(`text=${BUN_NAME}`).first()).toBeVisible();
    await expect(area.locator(`text=${MAIN_NAME}`)).toBeVisible();
  });

  test('работа модального окна ингредиента (открытие, закрытие по крестику и оверлею)', async ({
    page
  }) => {
    const modal = page.locator('#modals');

    await page.locator(`text=${BUN_NAME}`).first().click();
    await expect(modal.locator('text=Детали ингредиента')).toBeVisible();
    await expect(modal.locator(`text=${BUN_NAME}`)).toBeVisible();

    await page.getByTestId('modal-close-button').click();
    await expect(modal.locator('text=Детали ингредиента')).not.toBeVisible();

    await page.locator(`text=${BUN_NAME}`).first().click();
    await expect(modal.locator('text=Детали ингредиента')).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
    await expect(modal.locator('text=Детали ингредиента')).not.toBeVisible();
  });

  test('полный цикл создания заказа', async ({ page }) => {
    await page.routeFromHAR(HAR.user, {
      url: '**/api/auth/user',
      notFound: 'fallback'
    });
    await page.routeFromHAR(HAR.order, {
      url: '**/api/orders',
      notFound: 'fallback'
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'mock_token',
        domain: 'localhost',
        path: '/'
      }
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mock_refresh_token');
    });

    await page.goto('/');

    await addIngredient(page, BUN_NAME);
    await addIngredient(page, MAIN_NAME);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');
    await expect(modal.locator(`text=${ORDER_NUMBER}`)).toBeVisible();

    await page.getByTestId('modal-close-button').click();
    await expect(modal.locator(`text=${ORDER_NUMBER}`)).not.toBeVisible();

    const area = constructorArea(page);
    await expect(area.locator(`text=${BUN_NAME}`)).not.toBeVisible();
    await expect(area.locator(`text=${MAIN_NAME}`)).not.toBeVisible();
  });
});
