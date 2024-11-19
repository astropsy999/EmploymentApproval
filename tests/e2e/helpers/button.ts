import { Page, expect } from '@playwright/test';
import { logSuccess, logError, logInfo } from './logger';

/**
 * Получает кнопку по её роли и имени.
 * @param page Playwright Page объект.
 * @param role Роль элемента (например, 'button').
 * @param name Имя кнопки.
 * @returns Локатор кнопки.
 */
export function getButtonByRoleAndName(page: Page, role: any, name: string) {
    return page.getByRole(role, { name });
}

/**
 * Проверяет, что кнопка видима и доступна для клика.
 * @param button Локатор кнопки.
 */
export async function verifyButtonVisibleAndEnabled(button: any): Promise<void> {
    try {
        await expect(button).toBeVisible({ timeout: 5000 });
        await expect(button).toBeEnabled({ timeout: 5000 });
        logInfo(`Кнопка "${await button.textContent()}" видима и доступна для клика.`);
    } catch (error) {
        logError(`Кнопка "${await button.textContent()}" не видима или недоступна для клика: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Кликает по кнопке и логирует действие.
 * @param button Локатор кнопки.
 */
export async function clickButton(button: any): Promise<void> {
    let buttonText = 'Unknown';
    try {
        buttonText = await button.textContent();
        await button.click();
        logInfo(`Кнопка "${buttonText}" успешно кликнута.`);
    } catch (error) {
        logError(`Не удалось кликнуть по кнопке "${buttonText}": ${(error as Error).message}`);
        throw error;
    }
}
