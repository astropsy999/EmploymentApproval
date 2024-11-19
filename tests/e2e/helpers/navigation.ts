import { Page, expect } from '@playwright/test';
import { logSuccess, logError, logInfo } from './logger';

/**
 * Кликает на кнопку навигации по неделям.
 * @param page Playwright Page объект.
 * @param ariaLabel Атрибут aria-label кнопки (например, "Предыдущая неделя").
 */
export async function clickNavigationButton(page: Page, ariaLabel: string): Promise<void> {
    const button = page.locator(`button[aria-label="${ariaLabel}"]`);
    try {
        await expect(button).toBeVisible({ timeout: 10000 });
        await expect(button).toBeEnabled({ timeout: 10000 });
        await button.click();
        logInfo(`Кнопка "${ariaLabel}" успешно кликнута.`);
    } catch (error) {
        logError(`Не удалось кликнуть на кнопку "${ariaLabel}": ${(error as Error).message}`);
        throw error;
    }
}