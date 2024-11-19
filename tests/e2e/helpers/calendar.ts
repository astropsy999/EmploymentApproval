import { Page, expect } from '@playwright/test';
import { logSuccess, logError, logInfo } from './logger';
import { formatAriaLabel, formatDateWithWeekday } from './dates';

/**
 * Открывает календарь, кликая по полю ввода даты.
 * @param page Playwright Page объект.
 */
export async function openCalendar(page: Page): Promise<void> {
    const dateInput = page.locator('input.dateInput.flatpickr-input');
    try {
        await dateInput.click();
        const calendarPopup = page.locator('div.flatpickr-calendar');
        await expect(calendarPopup).toBeVisible({ timeout: 5000 });
        logInfo('Календарь flatpickr успешно открыт.');
    } catch (error) {
        logError(`Не удалось открыть календарь flatpickr: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Проверяет наличие основных элементов календаря.
 * @param page Playwright Page объект.
 */
export async function verifyCalendarElements(page: Page): Promise<void> {
    const calendarPopup = page.locator('div.flatpickr-calendar');
    try {
        await expect(calendarPopup.locator('div.flatpickr-months')).toBeVisible({ timeout: 5000 }); // Блок месяцев
        await expect(calendarPopup.locator('div.flatpickr-weekdays')).toBeVisible({ timeout: 5000 }); // Блок дней недели
        await expect(calendarPopup.locator('div.dayContainer')).toBeVisible({ timeout: 5000 }); // Блок дней
        logInfo('Основные элементы календаря flatpickr присутствуют.');
    } catch (error) {
        logError(`Основные элементы календаря flatpickr не найдены: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Проверяет наличие кнопок переключения месяцев.
 * @param page Playwright Page объект.
 */
export async function verifyCalendarNavigationButtons(page: Page): Promise<void> {
    const calendarPopup = page.locator('div.flatpickr-calendar');
    try {
        await expect(calendarPopup.locator('span.flatpickr-prev-month')).toBeVisible({ timeout: 5000 });
        await expect(calendarPopup.locator('span.flatpickr-next-month')).toBeVisible({ timeout: 5000 });
        logInfo('Кнопки переключения месяцев в календаре flatpickr присутствуют.');
    } catch (error) {
        logError(`Кнопки переключения месяцев в календаре flatpickr не найдены: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Проверяет текущий месяц и год в календаре.
 * @param page Playwright Page объект.
 * @param currentMonthIndex Индекс текущего месяца (0-11).
 * @param currentYear Текущий год в виде строки.
 */
export async function verifyCurrentMonthAndYear(page: Page, currentMonthIndex: string, currentYear: string): Promise<void> {
    const calendarPopup = page.locator('div.flatpickr-calendar');
    try {
        await expect(
            calendarPopup.locator('select.flatpickr-monthDropdown-months')
        ).toHaveValue(currentMonthIndex, { timeout: 5000 });

        await expect(
            calendarPopup.locator('input.cur-year')
        ).toHaveValue(currentYear, { timeout: 5000 });

        logInfo('Текущий месяц и год в календаре flatpickr корректны.');
    } catch (error) {
        logError(`Текущий месяц или год в календаре flatpickr некорректны: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Проверяет выделение текущей недели в календаре.
 * @param page Playwright Page объект.
 * @param weekDates Массив объектов Date, представляющих даты текущей недели.
 */
export async function verifyCurrentWeekHighlighted(page: Page, weekDates: Date[]): Promise<void> {
    const calendarPopup = page.locator('div.flatpickr-calendar');
    try {
        for (const date of weekDates) {
            const formattedAriaLabel = formatAriaLabel(date);
            const dayElement = calendarPopup.locator(`span.flatpickr-day[aria-label="${formattedAriaLabel}"]`);
            await expect(dayElement).toBeVisible({ timeout: 5000 });
            await expect(dayElement).toHaveClass(/(selected|startRange|inRange|endRange)/);
        }
        logInfo('Текущая неделя корректно выделена в календаре flatpickr.');
    } catch (error) {
        logError(`Выделение текущей недели в календаре flatpickr некорректно: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Выбирает дату в календаре flatpickr по aria-label.
 * @param page Playwright Page объект.
 * @param date Объект Date, представляющий выбранную дату.
 */
export async function selectDateInCalendar(page: Page, date: Date): Promise<void> {
    const calendarPopup = page.locator('div.flatpickr-calendar');
    const dateAriaLabel = formatAriaLabel(date);
    const dayElement = calendarPopup.locator(`span.flatpickr-day[aria-label="${dateAriaLabel}"]`);
    try {
        await expect(dayElement).toBeVisible({ timeout: 5000 });
        await dayElement.click();
        logInfo(`Дата ${formatDateWithWeekday(date)} успешно выбрана в календаре.`);
    } catch (error) {
        logError(`Не удалось выбрать дату ${formatDateWithWeekday(date)} в календаре: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Проверяет, что заголовки таблицы обновились на заданные даты недели.
 * @param page Playwright Page объект.
 * @param weekDates Массив строк с отформатированными датами недели.
 */
export async function verifyTableHeadersForWeek(page: Page, weekDates: string[]): Promise<void> {
    try {
        for (const date of weekDates) {
            await expect(
                page.locator('div.ag-header-cell').filter({ hasText: date })
            ).toBeVisible({ timeout: 5000 });
        }
        logInfo('Заголовки таблицы успешно обновились на даты предыдущей недели.');
    } catch (error) {
        logError(`Заголовки таблицы не обновились корректно: ${(error as Error).message}`);
        throw error;
    }
}
