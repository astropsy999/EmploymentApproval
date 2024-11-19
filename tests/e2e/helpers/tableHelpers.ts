import { Page, expect } from '@playwright/test';

/**
 * Снимает все выбранные чекбоксы в столбце "ФИО" таблицы.
 * @param page Playwright Page объект.
 */
export async function deselectAllRows(page: Page): Promise<void> {
    // Локатор для заголовка столбца "ФИО"
    const fioHeader = page.locator('div.ag-header-cell[col-id="ФИО"]');

    // Проверяем, что заголовок "ФИО" видим
    await expect(fioHeader).toBeVisible({ timeout: 5000 });

    // Локатор для чекбокса "Снять все"
    const selectAllCheckbox = fioHeader.locator('input[type="checkbox"]');

    // Проверяем, что чекбокс видим и доступен
    await expect(selectAllCheckbox).toBeVisible({ timeout: 5000 });
    await expect(selectAllCheckbox).toBeEnabled({ timeout: 5000 });

    // Проверяем состояние чекбокса и снимаем, если он отмечен
    const isChecked = await selectAllCheckbox.isChecked();
    if (isChecked) {
        await selectAllCheckbox.uncheck();
        console.log('Все чекбоксы сняты.');
    } else {
        console.log('Чекбоксы уже сняты.');
    }

    // Дополнительно, можно убедиться, что все индивидуальные чекбоксы сняты
    const rowCheckboxes = page.locator('div.ag-row').locator('input[type="checkbox"]');
    const checkboxCount = await rowCheckboxes.count();

    for (let i = 0; i < checkboxCount; i++) {
        await expect(rowCheckboxes.nth(i)).not.toBeChecked({ timeout: 5000 });
    }

    console.log(`Проверено, что все из ${checkboxCount} чекбоксов сняты.`);
}
