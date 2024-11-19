import { Page, expect } from '@playwright/test';
import { logSuccess, logError, logInfo } from './logger';
import { deselectAllRows, selectRowsInTable } from './table';

/**
 * Универсальная функция для проверки функциональности кнопки.
 * @param page Playwright Page объект.
 * @param buttonName Название кнопки.
 * @param modalTitle Ожидаемый заголовок модального окна.
 * @param modalContent Ожидаемое содержание модального окна.
 * @param numberOfRows Количество строк для выбора (если требуется).
 */
export async function verifyButtonFunctionality(
    page: Page,
    buttonName: string,
    modalTitle: string,
    modalContent: string,
    numberOfRows: number = 0
): Promise<void> {
    try {
        const CHOOSE_EMPLOYEES = 'Выберите сотрудников'
        logInfo(`Проверка работы кнопки "${buttonName}" без выбора сотрудников`);
        await page.waitForSelector('.temploaderWrapper', { state: 'hidden' });

        const button = page.getByRole('button', { name: buttonName });
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
        await button.click();

        const modal = page.locator('div[role="dialog"]');
        await expect(modal).toBeVisible();

        const modalTitleLocator = modal.locator('h2');
        await expect(modalTitleLocator).toHaveText(CHOOSE_EMPLOYEES);

        const modalContentLocator = modal.locator('div.MuiDialogContent-root');
        await expect(modalContentLocator).toContainText(modalContent);

        await modal.locator('button[aria-label="close"]').click();
        await expect(modal).toBeHidden();

        logSuccess(`Кнопка "${buttonName}" работает корректно без выбора строк в таблице`);

        if (numberOfRows > 0) {
            logInfo(`Проверка работы кнопки "${buttonName}" с выбором сотрудников`);
            
            // Выбор строк
            logInfo(`Выбираем ${numberOfRows} сотрудников в таблице`);
            const selectedEmployees = await selectRowsInTable(page, numberOfRows);

            expect(selectedEmployees.length).toBe(numberOfRows);

            await button.click();

            await expect(modal).toBeVisible();
            await expect(modalTitleLocator).toHaveText(modalTitle);

            // Проверка имен сотрудников
            for (const name of selectedEmployees) {
                await expect(modalContentLocator).toContainText(name);
            }

            // Закрытие модального окна
            await modal.locator('button[aria-label="close"]').click();
            await expect(modal).toBeHidden();

            await deselectAllRows(page);

            logSuccess(`Кнопка "${buttonName}" работает корректно с выбранными сотрудниками.`);
        }
    } catch (error) {
        logError(`Ошибка при проверке кнопки "${buttonName}": ${(error as Error).message}`);
        throw error;
    }
}
