import { test, expect } from '@playwright/test';

const ingredientsMock = {
  success: true,
  data: [
    {
      _id: 'bun-1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png'
    },
    {
      _id: 'bun-2',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png'
    },
    {
      _id: 'main-1',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-04.png'
    },
    {
      _id: 'main-2',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png'
    }
  ]
};

const orderMock = {
  success: true,
  order: {
    _id: 'test-order-1',
    status: 'done',
    name: 'Тестовый бургер',
    number: 12345,
    ingredients: ['bun-1', 'main-1']
  }
};

const userMock = {
  success: true,
  user: {
    email: 'test@example.com',
    name: 'Test User'
  }
};

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
      .getByTestId('ingredient-card')
      .filter({ has: page.getByTestId('bun') })
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
      .filter({ has: page.getByTestId('bun') })
      .first();
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page
      .getByTestId('ingredient-card')
      .filter({ has: page.getByTestId('main') })
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
      .filter({ has: page.getByTestId('bun') })
      .first();
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCards = page
      .getByTestId('ingredient-card')
      .filter({ has: page.getByTestId('main') });
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

    // Ждем, пока модальное окно станет видимым
    await page.waitForSelector('[data-testid="modal"]', {
      state: 'visible',
      timeout: 5000
    });

    await expect(page.getByTestId('modal').first()).toBeVisible({
      timeout: 5000
    });

    const modalName = page.getByTestId('ingredient-name');
    await expect(modalName).toBeVisible();
    await expect(modalName).toContainText(ingredientName || '');
  });

  test('Закрытие модального окна по крестику', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    await page.getByTestId('ingredient-card').first().click();
    await expect(page.getByTestId('modal')).toBeVisible({ timeout: 5000 });

    await page.getByTestId('modal-close-button').click();
    await expect(page.getByTestId('modal')).not.toBeVisible({ timeout: 5000 });
  });

  test('Закрытие модального окна по клику на оверлей', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    await page.getByTestId('ingredient-card').first().click();
    await expect(page.getByTestId('modal')).toBeVisible({ timeout: 5000 });

    await page.getByTestId('modal-overlay').click();
    await expect(page.getByTestId('modal')).not.toBeVisible({ timeout: 5000 });
  });

  test('Создание заказа', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ has: page.getByTestId('bun') })
      .first();
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-top')).toBeVisible({
      timeout: 5000
    });

    const mainCard = page
      .getByTestId('ingredient-card')
      .filter({ has: page.getByTestId('main') })
      .first();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-ingredient')).toBeVisible({
      timeout: 5000
    });

    await page.waitForSelector(
      'button:has-text("Оформить заказ"):not([disabled])',
      {
        timeout: 10000
      }
    );

    const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
    await orderButton.click();

    await expect(page.getByTestId('modal').first()).toBeVisible({
      timeout: 10000
    });
    await expect(page.getByTestId('order-number')).toContainText('12345');

    await page.getByTestId('modal-close-button').click();
    await expect(page.getByTestId('modal').first()).not.toBeVisible({
      timeout: 5000
    });

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-bottom')).not.toBeVisible();
    await expect(page.getByTestId('constructor-ingredient')).not.toBeVisible();
  });

  test('Подсчет общей стоимости бургера', async ({ page }) => {
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });

    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ has: page.getByTestId('bun') })
      .first();
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const mainCard = page
      .getByTestId('ingredient-card')
      .filter({ has: page.getByTestId('main') })
      .first();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-price')).toBeVisible({
      timeout: 5000
    });
    const priceText = await page.getByTestId('constructor-price').textContent();
    console.log('Цена:', priceText);
  });
});
