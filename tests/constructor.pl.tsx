import { test, expect } from '@playwright/test';

test.describe('Тестирование работы конструктора', () => {
  test('Отображение ингредиентов в конструкторе', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients/data.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.routeFromHAR('./tests/hars/user/user.har', {
      url: '**/api/auth/user',
      update: false
    });
    await page.goto('http://localhost:4000/');
    const buns = page.getByTestId('buns-category');
    const addedBun = await buns.locator('li').first().textContent();
    expect(addedBun).toContain('Краторная булка N-200i');

    const mains = page.getByTestId('mains-category');
    const addedMain = await mains.locator('li').first().textContent();
    expect(addedMain).toContain('Биокотлета из марсианской Магнолии');

    const sauses = page.getByTestId('sauses-category');
    const addedSause = await sauses.locator('li').first().textContent();
    expect(addedSause).toContain('Соус Spicy-X');
  });

  test('Работа модального окна', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients/data.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.routeFromHAR('./tests/hars/user/user.har', {
      url: '**/api/auth/user',
      update: false
    });
    await page.goto('http://localhost:4000/');

    const buns = page.getByTestId('buns-category');
    const bun = buns.locator('li').first();

    const modal = page.getByTestId('modal');
    await expect(modal).not.toBeVisible();

    await bun.getByRole('link').click();
    await expect(modal).toBeVisible();
    const modalContent = page.getByTestId('modal-content');
    await expect(modalContent.locator('h3')).toContainText(
      'Краторная булка N-200i'
    );

    await modal.getByRole('button').click();
    await expect(modal).not.toBeVisible();
  });

  test('Заркытие модального окна при клике в свободную область', async ({
    page
  }) => {
    await page.routeFromHAR('./tests/hars/ingredients/data.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.routeFromHAR('./tests/hars/user/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await page.goto('http://localhost:4000/');
    const buns = page.getByTestId('buns-category');
    const bun = buns.locator('li').first();

    const modal = page.getByTestId('modal');
    await expect(modal).not.toBeVisible();

    await bun.getByRole('link').click();
    const modalBox = await modal.boundingBox();
    await expect(modal).toBeVisible();
    if (modalBox) {
      await page.getByTestId('overlay').click({
        position: {
          x: modalBox.x + modalBox.width + 5,
          y: modalBox.y + modalBox.height + 5
        }
      });
    }
    await expect(modal).not.toBeVisible();
  });

  test('Создание заказа', async ({ page }) => {
    await page.addInitScript(() => {
      document.cookie = 'accessToken=mock-token; path=/';
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
    await page.routeFromHAR('./tests/hars/user/user.har', {
      url: '**/api/auth/user',
      update: false
    });
    await page.routeFromHAR('./tests/hars/orders/orders.har', {
      url: '**/api/orders',
      update: false
    });

    await page.routeFromHAR('./tests/hars/ingredients/data.har', {
      url: '**/api/ingredients',
      update: false
    });
    await page.goto('http://localhost:4000/');
    await expect(page.getByTestId('ingredients_data')).toBeVisible();
    const buns = page.getByTestId('buns-category');
    const mains = page.getByTestId('mains-category');
    const sauses = page.getByTestId('sauses-category');

    await expect(page.getByTestId('topBun-constructor')).not.toBeVisible();
    await expect(page.getByTestId('bottomBun-constructor')).not.toBeVisible();
    const constructorIngredients = page.getByTestId('ingredients-constructor');
    await expect(constructorIngredients.locator('li')).toHaveCount(0);

    const bun = buns.locator('li').first();
    await bun.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByTestId('topBun-constructor')).toBeVisible();
    await expect(page.getByTestId('bottomBun-constructor')).toBeVisible();
    const main = mains.locator('li').first();
    await main.getByRole('button', { name: 'Добавить' }).click();

    await expect(constructorIngredients.locator('li')).toHaveCount(1);

    const sause = sauses.locator('li').first();
    await sause.getByRole('button', { name: 'Добавить' }).click();
    await expect(constructorIngredients.locator('li')).toHaveCount(2);

    const constructorTopBun = page.getByTestId('topBun-constructor');
    const constructorBottomBun = page.getByTestId('bottomBun-constructor');

    await expect(constructorTopBun).not.toBeEmpty();
    await expect(constructorBottomBun).not.toBeEmpty();

    await page
      .getByTestId('constructor-section')
      .getByRole('button', { name: 'Оформить заказ' })
      .click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    const orderNumber = await modal.locator('h2').textContent();
    expect(orderNumber).toContain('109105');
    await expect(constructorIngredients.locator('li')).toHaveCount(0);
    await expect(constructorTopBun).toHaveCount(0);
    await expect(constructorBottomBun).toHaveCount(0);
    await modal.getByRole('button').click();
    await expect(modal).not.toBeVisible();
  });
});
