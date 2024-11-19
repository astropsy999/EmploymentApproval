// helpers/headerHelpers.ts

import { Page, expect } from '@playwright/test';
import { logSuccess, logWarning, logError } from './logger';

/**
 * Проверяет видимость шапки календаря.
 * @param page Playwright Page объект.
 */
export async function verifyHeaderVisibility(page: Page): Promise<void> {
    const header = page.locator('.MuiBox-root');
    await expect(header).toBeVisible();
}

/**
 * Проверяет видимость кнопки "Предыдущая неделя".
 * @param page Playwright Page объект.
 */
export async function verifyPreviousWeekButtonVisible(page: Page): Promise<void> {
    const prevWeekButton = page.locator('button[aria-label="Предыдущая неделя"]');
    await expect(prevWeekButton).toBeVisible();
}

/**
 * Проверяет видимость поля ввода даты.
 * @param page Playwright Page объект.
 */
export async function verifyDateInputVisible(page: Page): Promise<void> {
    const dateInput = page.locator('input.dateInput.flatpickr-input');
    await expect(dateInput).toBeVisible();
}

/**
 * Проверяет видимость кнопки "Следующая неделя".
 * @param page Playwright Page объект.
 */
export async function verifyNextWeekButtonVisible(page: Page): Promise<void> {
    const nextWeekButton = page.locator('button[aria-label="Следующая неделя"]');
    await expect(nextWeekButton).toBeVisible();
}

/**
 * Проверяет видимость кнопки "Согласовать".
 * @param page Playwright Page объект.
 */
export async function verifyAgreeButtonVisible(page: Page): Promise<void> {
    const agreeButton = page.locator('button:has-text("Согласовать")');
    await expect(agreeButton).toBeVisible();
}

/**
 * Проверяет видимость кнопки "Заблокировать".
 * @param page Playwright Page объект.
 */
export async function verifyBlockButtonVisible(page: Page): Promise<void> {
    const blockButton = page.locator('button:has-text("Заблокировать")');
    await expect(blockButton).toBeVisible();
}

/**
 * Проверяет видимость кнопки "Разблокировать".
 * @param page Playwright Page объект.
 */
export async function verifyUnblockButtonVisible(page: Page): Promise<void> {
    const unblockButton = page.locator('button:has-text("Разблокировать")');
    await expect(unblockButton).toBeVisible();
}

/**
 * Проверяет видимость иконки обновления (CachedIcon).
 * @param page Playwright Page объект.
 */
export async function verifyCachedIconVisible(page: Page): Promise<void> {
    const cachedIcon = page.locator('button >> svg[data-testid="CachedIcon"]');
    await expect(cachedIcon).toBeVisible();
}

/**
 * Проверяет видимость иконки почты (MailOutlineIcon).
 * @param page Playwright Page объект.
 */
export async function verifyMailIconVisible(page: Page): Promise<void> {
    const mailIcon = page.locator('button >> svg[data-testid="MailOutlineIcon"]');
    await expect(mailIcon).toBeVisible();
}

/**
 * Проверяет все элементы шапки.
 * @param page Playwright Page объект.
 */
export async function verifyAllHeaderElements(page: Page): Promise<void> {
    await verifyHeaderVisibility(page);
    await verifyPreviousWeekButtonVisible(page);
    await verifyDateInputVisible(page);
    await verifyNextWeekButtonVisible(page);
    await verifyAgreeButtonVisible(page);
    await verifyBlockButtonVisible(page);
    await verifyUnblockButtonVisible(page);
    await verifyCachedIconVisible(page);
    await verifyMailIconVisible(page);

    logSuccess('Все элементы шапки успешно загружены.');
}
