# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: constructor.spec.ts >> Конструктор бургера >> Открытие модального окна ингредиента
- Location: tests\constructor.spec.ts:134:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[data-testid="modal"]') to be visible
    23 × locator resolved to 2 elements. Proceeding with the first one: <div data-testid="modal">…</div>

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - navigation [ref=e5]:
        - generic [ref=e6]:
          - link "Конструктор" [ref=e7] [cursor=pointer]:
            - /url: /
            - img [ref=e8]
            - paragraph [ref=e10]: Конструктор
          - link "Лента заказов" [ref=e11] [cursor=pointer]:
            - /url: /feed
            - img [ref=e12]
            - paragraph [ref=e14]: Лента заказов
        - link [ref=e16] [cursor=pointer]:
          - /url: /
          - img [ref=e17]
        - link "Test User" [ref=e85] [cursor=pointer]:
          - /url: /profile
          - img [ref=e86]
          - paragraph [ref=e88]: Test User
    - main [ref=e89]:
      - heading "Соберите бургер" [level=1] [ref=e90]
      - generic [ref=e91]:
        - generic [ref=e92]:
          - navigation [ref=e93]:
            - list [ref=e94]:
              - generic: Булки
              - generic [ref=e95] [cursor=pointer]: Начинки
              - generic [ref=e96] [cursor=pointer]: Соусы
          - generic [ref=e97]:
            - heading "Булки" [level=3] [ref=e98]
            - list [ref=e99]:
              - listitem [ref=e100]:
                - generic [ref=e101]: bun
                - link "картинка ингредиента. 1255 Краторная булка N-200i" [active] [ref=e102] [cursor=pointer]:
                  - /url: /ingredients/bun-1
                  - img "картинка ингредиента." [ref=e103]
                  - generic [ref=e104]:
                    - paragraph [ref=e105]: "1255"
                    - img [ref=e106]
                  - paragraph [ref=e112]: Краторная булка N-200i
                - button "Добавить" [ref=e113] [cursor=pointer]:
                  - img [ref=e114]
                  - text: Добавить
            - heading "Начинки" [level=3] [ref=e116]
            - list [ref=e117]:
              - listitem [ref=e118]:
                - generic [ref=e119]: main
                - link "картинка ингредиента. 424 Биокотлета из марсианской Магнолии" [ref=e120] [cursor=pointer]:
                  - /url: /ingredients/main-1
                  - img "картинка ингредиента." [ref=e121]
                  - generic [ref=e122]:
                    - paragraph [ref=e123]: "424"
                    - img [ref=e124]
                  - paragraph [ref=e130]: Биокотлета из марсианской Магнолии
                - button "Добавить" [ref=e131] [cursor=pointer]:
                  - img [ref=e132]
                  - text: Добавить
            - heading "Соусы" [level=3] [ref=e134]
            - list
        - generic [ref=e135]:
          - generic [ref=e136]:
            - generic [ref=e137]: Выберите булку
            - list [ref=e138]:
              - generic [ref=e139]: Выберите начинку
            - generic [ref=e140]: Выберите булку
          - generic [ref=e141]:
            - generic [ref=e142]:
              - paragraph [ref=e143]: "0"
              - img [ref=e144]
            - button "Оформить заказ" [disabled]
  - generic [ref=e150]:
    - generic [ref=e151]:
      - heading "Детали ингредиента" [level=3] [ref=e152]
      - button [ref=e153] [cursor=pointer]:
        - img [ref=e154]
    - generic [ref=e157]:
      - img "изображение ингредиента." [ref=e158]
      - heading "Краторная булка N-200i" [level=3] [ref=e159]
      - list [ref=e160]:
        - listitem [ref=e161]:
          - paragraph [ref=e162]: Калории, ккал
          - paragraph
        - listitem [ref=e163]:
          - paragraph [ref=e164]: Белки, г
          - paragraph
        - listitem [ref=e165]:
          - paragraph [ref=e166]: Жиры, г
          - paragraph
        - listitem [ref=e167]:
          - paragraph [ref=e168]: Углеводы, г
          - paragraph
```

# Test source

```ts
  44  |     await page.route('**/api/orders', async (route) => {
  45  |       if (route.request().method() === 'POST') {
  46  |         await route.fulfill({
  47  |           status: 200,
  48  |           contentType: 'application/json',
  49  |           body: JSON.stringify(orderMock)
  50  |         });
  51  |       } else {
  52  |         await route.continue();
  53  |       }
  54  |     });
  55  | 
  56  |     await page.route('**/api/auth/user', async (route) => {
  57  |       await route.fulfill({
  58  |         status: 200,
  59  |         contentType: 'application/json',
  60  |         body: JSON.stringify(userMock)
  61  |       });
  62  |     });
  63  | 
  64  |     await page.context().addCookies([
  65  |       {
  66  |         name: 'accessToken',
  67  |         value: 'mock-access-token',
  68  |         path: '/',
  69  |         domain: 'localhost'
  70  |       }
  71  |     ]);
  72  | 
  73  |     await page.goto('/', { waitUntil: 'networkidle' });
  74  |   });
  75  | 
  76  |   test('Добавление булки в конструктор', async ({ page }) => {
  77  |     await page.waitForSelector('[data-testid="ingredient-card"]', {
  78  |       timeout: 10000
  79  |     });
  80  | 
  81  |     const bunCard = page
  82  |       .locator('[data-testid="ingredient-card"]:has([data-testid="bun"])')
  83  |       .first();
  84  |     await bunCard.locator('button:has-text("Добавить")').click();
  85  | 
  86  |     await expect(
  87  |       page.locator('[data-testid="constructor-bun-top"]')
  88  |     ).toBeVisible({ timeout: 5000 });
  89  |     await expect(
  90  |       page.locator('[data-testid="constructor-bun-bottom"]')
  91  |     ).toBeVisible({ timeout: 5000 });
  92  |   });
  93  | 
  94  |   test('Добавление начинки в конструктор', async ({ page }) => {
  95  |     await page.waitForSelector('[data-testid="ingredient-card"]', {
  96  |       timeout: 10000
  97  |     });
  98  | 
  99  |     const bunCard = page
  100 |       .locator('[data-testid="ingredient-card"]:has([data-testid="bun"])')
  101 |       .first();
  102 |     await bunCard.locator('button:has-text("Добавить")').click();
  103 | 
  104 |     const mainCard = page
  105 |       .locator('[data-testid="ingredient-card"]:has([data-testid="main"])')
  106 |       .first();
  107 |     await mainCard.locator('button:has-text("Добавить")').click();
  108 | 
  109 |     await expect(
  110 |       page.locator('[data-testid="constructor-ingredient"]')
  111 |     ).toBeVisible({ timeout: 5000 });
  112 |   });
  113 | 
  114 |   test('Добавление нескольких ингредиентов', async ({ page }) => {
  115 |     await page.waitForSelector('[data-testid="ingredient-card"]', {
  116 |       timeout: 10000
  117 |     });
  118 | 
  119 |     const bunCard = page
  120 |       .locator('[data-testid="ingredient-card"]:has([data-testid="bun"])')
  121 |       .first();
  122 |     await bunCard.locator('button:has-text("Добавить")').click();
  123 | 
  124 |     const mainCards = page.locator(
  125 |       '[data-testid="ingredient-card"]:has([data-testid="main"])'
  126 |     );
  127 |     await mainCards.first().locator('button:has-text("Добавить")').click();
  128 | 
  129 |     await expect(
  130 |       page.locator('[data-testid="constructor-ingredient"]')
  131 |     ).toHaveCount(1, { timeout: 5000 });
  132 |   });
  133 | 
  134 |   test('Открытие модального окна ингредиента', async ({ page }) => {
  135 |     await page.waitForSelector('[data-testid="ingredient-card"]', {
  136 |       timeout: 10000
  137 |     });
  138 | 
  139 |     const ingredientCard = page
  140 |       .locator('[data-testid="ingredient-card"]')
  141 |       .first();
  142 |     await ingredientCard.click();
  143 | 
> 144 |     await page.waitForSelector('[data-testid="modal"]', { timeout: 10000 });
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  145 |     await expect(page.locator('[data-testid="modal"]')).toBeVisible();
  146 |   });
  147 | 
  148 |   test('Закрытие модального окна по крестику', async ({ page }) => {
  149 |     await page.waitForSelector('[data-testid="ingredient-card"]', {
  150 |       timeout: 10000
  151 |     });
  152 | 
  153 |     await page.locator('[data-testid="ingredient-card"]').first().click();
  154 |     await page.waitForSelector('[data-testid="modal"]', { timeout: 10000 });
  155 |     await expect(page.locator('[data-testid="modal"]')).toBeVisible();
  156 | 
  157 |     await page.locator('[data-testid="modal-close-button"]').click();
  158 |     await page.waitForSelector('[data-testid="modal"]', {
  159 |       state: 'hidden',
  160 |       timeout: 5000
  161 |     });
  162 |     await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
  163 |   });
  164 | 
  165 |   test('Закрытие модального окна по клику на оверлей', async ({ page }) => {
  166 |     await page.waitForSelector('[data-testid="ingredient-card"]', {
  167 |       timeout: 10000
  168 |     });
  169 | 
  170 |     await page.locator('[data-testid="ingredient-card"]').first().click();
  171 |     await page.waitForSelector('[data-testid="modal"]', { timeout: 10000 });
  172 |     await expect(page.locator('[data-testid="modal"]')).toBeVisible();
  173 | 
  174 |     await page.locator('[data-testid="modal-overlay"]').click();
  175 |     await page.waitForSelector('[data-testid="modal"]', {
  176 |       state: 'hidden',
  177 |       timeout: 5000
  178 |     });
  179 |     await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
  180 |   });
  181 | 
  182 |   test('Создание заказа', async ({ page }) => {
  183 |     await page.waitForSelector('[data-testid="ingredient-card"]', {
  184 |       timeout: 10000
  185 |     });
  186 | 
  187 |     const bunCard = page
  188 |       .locator('[data-testid="ingredient-card"]:has([data-testid="bun"])')
  189 |       .first();
  190 |     await bunCard.locator('button:has-text("Добавить")').click();
  191 | 
  192 |     const mainCard = page
  193 |       .locator('[data-testid="ingredient-card"]:has([data-testid="main"])')
  194 |       .first();
  195 |     await mainCard.locator('button:has-text("Добавить")').click();
  196 | 
  197 |     await page.waitForSelector(
  198 |       'button:has-text("Оформить заказ"):not([disabled])',
  199 |       { timeout: 10000 }
  200 |     );
  201 |     await page.locator('button:has-text("Оформить заказ")').click();
  202 | 
  203 |     await page.waitForSelector('[data-testid="modal"]', { timeout: 10000 });
  204 |     await expect(page.locator('[data-testid="modal"]')).toBeVisible();
  205 |     await expect(page.locator('[data-testid="order-number"]')).toContainText(
  206 |       '12345'
  207 |     );
  208 |   });
  209 | 
  210 |   test('Подсчет общей стоимости бургера', async ({ page }) => {
  211 |     await page.waitForSelector('[data-testid="ingredient-card"]', {
  212 |       timeout: 10000
  213 |     });
  214 | 
  215 |     const bunCard = page
  216 |       .locator('[data-testid="ingredient-card"]:has([data-testid="bun"])')
  217 |       .first();
  218 |     await bunCard.locator('button:has-text("Добавить")').click();
  219 | 
  220 |     const mainCard = page
  221 |       .locator('[data-testid="ingredient-card"]:has([data-testid="main"])')
  222 |       .first();
  223 |     await mainCard.locator('button:has-text("Добавить")').click();
  224 | 
  225 |     await page.waitForSelector('[data-testid="constructor-price"]', {
  226 |       timeout: 5000
  227 |     });
  228 |     const priceText = await page
  229 |       .locator('[data-testid="constructor-price"]')
  230 |       .textContent();
  231 |     console.log('Цена:', priceText);
  232 | 
  233 |     await expect(
  234 |       page.locator('[data-testid="constructor-price"]')
  235 |     ).toBeVisible();
  236 |   });
  237 | });
  238 | 
```