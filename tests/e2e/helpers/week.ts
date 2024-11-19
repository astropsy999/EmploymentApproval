import { expect, Page } from 'playwright/test';
import { formatDateWithWeekday, getMondayOfWeek } from './dates';
import { logError, logInfo } from './logger';
import { clickNavigationButton } from './navigation';

/**
 * Возвращает массив отформатированных дат для заданной недели.
 * @param offset Смещение относительно текущей недели (0 - текущая, -1 - предыдущая, 1 - следующая и т.д.).
 * @returns Массив строк с отформатированными датами.
 */
export function getFormattedWeekDates(offset: number): string[] {
    const monday = getMondayOfWeek(offset);
    const weekDates: string[] = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(formatDateWithWeekday(date));
    }

    return weekDates;
}

/**
 * Проверяет, что все даты из массива отображаются в заголовках таблицы.
 * @param page Playwright Page объект.
 * @param weekDates Массив строк с датами.
 */
export async function verifyWeekDatesVisible(page: Page, weekDates: string[]): Promise<void> {
    try {
        for (const date of weekDates) {
            await expect(
                page.locator('div.ag-header-cell').filter({ hasText: date })
            ).toBeVisible({ timeout: 5000 });
        }
        logInfo(`Правильные даты недели отображаются в заголовках.`);
    } catch (error) {
        logError(`Проверка отображения дат недели не удалась: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Выполняет навигацию по неделям и проверяет отображение дат.
 * @param page Playwright Page объект.
 * @param navigateOffset Смещение для навигации (-1 - предыдущая неделя, 1 - следующая неделя).
 * @param expectedWeekDates Ожидаемые даты для проверки.
 */
export async function navigateAndVerifyWeek(page: Page, navigateOffset: number, expectedWeekDates: string[]): Promise<void> {
    try {
        const ariaLabel = navigateOffset < 0 ? 'Предыдущая неделя' : 'Следующая неделя';
        await clickNavigationButton(page, ariaLabel);
        await page.waitForSelector('.temploaderWrapper', { state: 'hidden' });
        await verifyWeekDatesVisible(page, expectedWeekDates);
        logInfo(`Навигация на ${ariaLabel} прошла успешно и даты обновились.`);
    } catch (error) {
        logError(`Ошибка при навигации на ${navigateOffset < 0 ? 'предыдущую' : 'следующую'} неделю: ${(error as Error).message}`);
        throw error;
    }
}