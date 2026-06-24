import { test, expect } from '@playwright/test';

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
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true
      });
    });

    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
      notFound: 'fallback'
    });

    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders',
      update: false,
      notFound: 'fallback'
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
      notFound: 'fallback'
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
      .getByTestId('ingredient-card')
      .filter({ hasText: /булка/i })
      .first();

    const bunName = await bunCard
      .locator('.text_type_main-default')
      .textContent();

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-top')).toBeVisible({
      timeout: 5000
    });
    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      bunName || ''
    );

    await expect(page.getByTestId('constructor-bun-bottom')).toBeVisible({
      timeout: 5000
    });
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      bunName || ''
    );
  });

  test('Добавление начинки в конструктор', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: /булка/i })
      .first();
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page
      .getByTestId('ingredient-card')
      .filter({ hasNotText: /булка/i })
      .first();

    const mainName = await mainCard
      .locator('.text_type_main-default')
      .textContent();

    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-ingredient')).toBeVisible({
      timeout: 5000
    });
    await expect(page.getByTestId('constructor-ingredient')).toContainText(
      mainName || ''
    );
  });

  test('Добавление нескольких ингредиентов', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: /булка/i })
      .first();
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCards = page
      .getByTestId('ingredient-card')
      .filter({ hasNotText: /булка/i });
    await mainCards.first().getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-ingredient')).toHaveCount(1, {
      timeout: 5000
    });
  });

  test('Открытие модального окна ингредиента', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const ingredientCard = page.getByTestId('ingredient-card').first();
    const ingredientName = await ingredientCard
      .locator('.text_type_main-default')
      .first()
      .textContent();

    await ingredientCard.click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible({ timeout: 5000 });

    const modalName = page.getByTestId('ingredient-name');
    await expect(modalName).toBeVisible();
    await expect(modalName).toContainText(ingredientName || '');
  });

  test('Закрытие модального окна по клику на оверлей', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    await page.getByTestId('ingredient-card').first().click();

    const modalTitle = page.getByRole('heading', {
      name: 'Детали ингредиента'
    });
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    await expect(page.getByTestId('ingredient-name')).toBeVisible();

    const closeButton = page.locator('[data-testid="modal-close-button"]');
    await closeButton.click();

    await expect(modalTitle).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('ingredient-name')).not.toBeVisible();
  });

  test('Создание заказа', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: /булка/i })
      .first();
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-top')).toBeVisible({
      timeout: 5000
    });

    const mainCard = page
      .getByTestId('ingredient-card')
      .filter({ hasNotText: /булка/i })
      .first();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-ingredient')).toBeVisible({
      timeout: 5000
    });

    await page.waitForSelector(
      'button:has-text("Оформить заказ"):not([disabled])',
      { timeout: 10000 }
    );

    const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
    await orderButton.click();

    await expect(page.getByTestId('order-number')).toBeVisible({
      timeout: 10000
    });
    await expect(page.getByTestId('order-number')).toContainText('12345');

    await page.getByTestId('modal-close-button').click();

    await page.waitForSelector('[data-testid="modal"]', {
      state: 'hidden',
      timeout: 5000
    });

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-bottom')).not.toBeVisible();

    const ingredientContainer = page.getByTestId('constructor-ingredient');
    await expect(ingredientContainer).toContainText('Выберите начинку');
  });

  test('Подсчет общей стоимости бургера', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: /булка/i })
      .first();
    await bunCard
      .getByRole('button', { name: 'Добавить' })
      .click({ timeout: 5000 });

    const mainCard = page
      .getByTestId('ingredient-card')
      .filter({ hasNotText: /булка/i })
      .first();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-price')).toBeVisible({
      timeout: 5000
    });
    const priceText = await page.getByTestId('constructor-price').textContent();
    console.log('Цена:', priceText);
  });
});
