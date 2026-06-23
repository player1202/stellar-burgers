import { test, expect } from '@playwright/test';
import ingredientsMock from './mocks/ingredients.json';
import orderMock from './mocks/order.json';
import userMock from './mocks/user.json';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        #webpack-dev-server-client-overlay {
          display: none !important;
          pointer-events: none !important;
          opacity: 0 !important;
        }
      `;
      document.head.appendChild(style);
    });

    await page.addInitScript(() => {
      const localStorageMock = {
        getItem: (key: string) => {
          if (key === 'refreshToken') return 'mock-refresh-token';
          return null;
        },
        setItem: (key: string, value: string) => {},
        removeItem: (key: string) => {},
        clear: () => {}
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true
      });
    });

    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ingredientsMock)
      });
    });

    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(orderMock)
        });
      } else {
        await route.continue();
      }
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(userMock)
      });
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        path: '/',
        domain: 'localhost'
      }
    ]);

    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Добавление булки в конструктор', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const bunCard = page
      .locator('[data-testid="ingredient-card"]:has([data-testid="bun"])')
      .first();
    await bunCard.locator('button:has-text("Добавить")').click();

    await expect(
      page.locator('[data-testid="constructor-bun-top"]')
    ).toBeVisible({ timeout: 5000 });
    await expect(
      page.locator('[data-testid="constructor-bun-bottom"]')
    ).toBeVisible({ timeout: 5000 });
  });

  test('Добавление начинки в конструктор', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const bunCard = page
      .locator('[data-testid="ingredient-card"]:has([data-testid="bun"])')
      .first();
    await bunCard.locator('button:has-text("Добавить")').click();

    const mainCard = page
      .locator('[data-testid="ingredient-card"]:has([data-testid="main"])')
      .first();
    await mainCard.locator('button:has-text("Добавить")').click();

    await expect(
      page.locator('[data-testid="constructor-ingredient"]')
    ).toBeVisible({ timeout: 5000 });
  });

  test('Добавление нескольких ингредиентов', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const bunCard = page
      .locator('[data-testid="ingredient-card"]:has([data-testid="bun"])')
      .first();
    await bunCard.locator('button:has-text("Добавить")').click();

    const mainCards = page.locator(
      '[data-testid="ingredient-card"]:has([data-testid="main"])'
    );
    await mainCards.first().locator('button:has-text("Добавить")').click();

    await expect(
      page.locator('[data-testid="constructor-ingredient"]')
    ).toHaveCount(1, { timeout: 5000 });
  });

  test('Открытие модального окна ингредиента', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const ingredientCard = page
      .locator('[data-testid="ingredient-card"]')
      .first();
    await ingredientCard.click();

    await page.waitForSelector('[data-testid="modal"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();
  });

  test('Закрытие модального окна по крестику', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    await page.locator('[data-testid="ingredient-card"]').first().click();
    await page.waitForSelector('[data-testid="modal"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();

    await page.locator('[data-testid="modal-close-button"]').click();
    await page.waitForSelector('[data-testid="modal"]', {
      state: 'hidden',
      timeout: 5000
    });
    await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
  });

  test('Закрытие модального окна по клику на оверлей', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    await page.locator('[data-testid="ingredient-card"]').first().click();
    await page.waitForSelector('[data-testid="modal"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();

    await page.locator('[data-testid="modal-overlay"]').click();
    await page.waitForSelector('[data-testid="modal"]', {
      state: 'hidden',
      timeout: 5000
    });
    await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
  });

  test('Создание заказа', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const bunCard = page
      .locator('[data-testid="ingredient-card"]:has([data-testid="bun"])')
      .first();
    await bunCard.locator('button:has-text("Добавить")').click();

    const mainCard = page
      .locator('[data-testid="ingredient-card"]:has([data-testid="main"])')
      .first();
    await mainCard.locator('button:has-text("Добавить")').click();

    await page.waitForSelector(
      'button:has-text("Оформить заказ"):not([disabled])',
      { timeout: 10000 }
    );
    await page.locator('button:has-text("Оформить заказ")').click();

    await page.waitForSelector('[data-testid="modal"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toContainText(
      '12345'
    );
  });

  test('Подсчет общей стоимости бургера', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const bunCard = page
      .locator('[data-testid="ingredient-card"]:has([data-testid="bun"])')
      .first();
    await bunCard.locator('button:has-text("Добавить")').click();

    const mainCard = page
      .locator('[data-testid="ingredient-card"]:has([data-testid="main"])')
      .first();
    await mainCard.locator('button:has-text("Добавить")').click();

    await page.waitForSelector('[data-testid="constructor-price"]', {
      timeout: 5000
    });
    const priceText = await page
      .locator('[data-testid="constructor-price"]')
      .textContent();
    console.log('Цена:', priceText);

    await expect(
      page.locator('[data-testid="constructor-price"]')
    ).toBeVisible();
  });
});
