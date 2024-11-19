import { Page, expect } from '@playwright/test';
import { logSuccess, logError, logInfo } from './logger';
import { ModalContent } from './types';

/**
 * Проверяет, что модальное окно содержит ожидаемый заголовок и список сотрудников.
 * @param page Playwright Page объект.
 * @param modalContent Объект с ожидаемым заголовком и содержанием модального окна.
 */
export async function verifyModalContent(page: Page, modalContent: ModalContent): Promise<void> {
    const modal = page.locator('div[role="dialog"]');
    try {
        await expect(modal).toBeVisible({ timeout: 5000 });
        await expect(modal.locator('h2')).toHaveText(modalContent.title, { timeout: 5000 });
        
        // Используем toContainText для проверки наличия имен сотрудников
        const modalBody = modal.locator('div.MuiDialogContent-root');
        await expect(modalBody).toContainText(modalContent.content, { timeout: 5000 });
        
        logSuccess(`Модальное окно с заголовком "${modalContent.title}" и содержанием "${modalContent.content}" успешно отображено.`);
    } catch (error) {
        logError(`Модальное окно не соответствует ожидаемым значениям: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Закрывает модальное окно.
 * @param page Playwright Page объект.
 */
export async function closeModal(page: Page): Promise<void> {
    try {
        const closeButton = page.locator('button[aria-label="close"]');
        await expect(closeButton).toBeVisible({ timeout: 5000 });
        await closeButton.click();
        logInfo('Модальное окно успешно закрыто.');
    } catch (error) {
        logError(`Не удалось закрыть модальное окно: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Проверяет, что модальное окно содержит список заданных сотрудников.
 * @param page Playwright Page объект.
 * @param employees Массив имён сотрудников.
 */
// helpers/modalHelpers.ts

export async function verifyEmployeeNamesInModal(page: Page, employees: string[]): Promise<void> {
    const modal = page.locator('div[role="dialog"]');
    try {
        const employeeParagraph = modal.locator('p.MuiTypography-body1');
        const spanElements = employeeParagraph.locator('span');

        const spanCount = await spanElements.count();
        expect(spanCount).toBe(employees.length);

        const actualEmployees: string[] = [];
        for (let i = 0; i < spanCount; i++) {
            const spanText = await spanElements.nth(i).textContent();
            const cleanedSpanText = spanText?.trim().replace(',', '') || '';
            actualEmployees.push(cleanedSpanText);
        }

        for (const employee of employees) {
            expect(actualEmployees).toContain(employee);
        }

        logInfo('Имена сотрудников в модальном окне соответствуют выбранным.');
    } catch (error) {
        logError(`Сотрудники отсутствуют или не соответствуют в модальном окне: ${(error as Error).message}`);
        throw error;
    }
}

