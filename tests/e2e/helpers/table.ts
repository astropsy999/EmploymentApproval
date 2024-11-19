import { Page, expect } from '@playwright/test';
import { logSuccess, logWarning, logError, logInfo } from './logger';

/**
 * Проверяет, что в таблице присутствует строка с указанным текстом.
 * @param page Playwright Page объект.
 * @param cellText Текст ячейки, которую нужно проверить.
 */
export async function verifyTableCellVisible(page: Page, cellText: string): Promise<void> {
    try {
        await expect(page.locator(`div.ag-cell:has-text("${cellText}")`)).toBeVisible({ timeout: 5000 });
        logInfo(`Ячейка с текстом "${cellText}" отображается в таблице.`);
    } catch (error) {
        logError(`Ячейка с текстом "${cellText}" не отображается: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Проверяет, что корневой элемент таблицы видим.
 * @param page Playwright Page объект.
 */
export async function verifyTableRootVisible(page: Page): Promise<void> {
    const tableRoot = page.locator('div.ag-root');
    await expect(tableRoot).toBeVisible();
}

/**
 * Проверяет, что заголовки таблицы имеют ожидаемое количество.
 * @param page Playwright Page объект.
 * @param expectedCount Ожидаемое количество заголовков.
 */
export async function verifyHeaderCellCount(page: Page, expectedCount: number): Promise<void> {
    const headerCells = page.locator('div.ag-header-cell');
    await expect(headerCells).toHaveCount(expectedCount);
}

/**
 * Проверяет, что в заголовках таблицы присутствуют конкретные тексты.
 * @param page Playwright Page объект.
 * @param headers Массив строк с ожидаемыми текстами заголовков.
 */
export async function verifySpecificHeaders(page: Page, headers: string[]): Promise<void> {
    for (const headerText of headers) {
        await expect(page.locator(`div.ag-header-cell:has-text("${headerText}")`)).toBeVisible();
    }
}

/**
 * Ожидает, пока индикатор загрузки станет невидимым или исчезнет из DOM.
 * @param page Playwright Page объект.
 */
export async function waitForLoadingIndicator(page: Page): Promise<void> {
    await page.waitForSelector('.temploaderWrapper', { state: 'hidden' });
}


/**
 * Выполняет все проверки загрузки таблицы.
 * @param page Playwright Page объект.
 * @param expectedHeaderCount Ожидаемое количество заголовков.
 * @param specificHeaders Массив строк с конкретными заголовками для проверки.
 * @param expectedCellText Текст ячейки, наличие которой нужно проверить.
 */
export async function verifyTableLoaded(
    page: Page,
    expectedHeaderCount: number,
    specificHeaders: string[],
    expectedCellText: string
): Promise<void> {
    await verifyTableRootVisible(page);
    await verifyHeaderCellCount(page, expectedHeaderCount);
    await verifySpecificHeaders(page, specificHeaders);
    await waitForLoadingIndicator(page);
    await verifyTableCellVisible(page, expectedCellText);

    logSuccess('Таблица успешно загружена и отображает необходимые элементы.');
}


/**
 * Проверяет, что таблица загружена и содержит строки.
 * @param page Playwright Page объект.
 */
export async function verifyTableIsLoaded(page: Page): Promise<void> {
    const tableContainer = page.locator('div.ag-pinned-left-cols-container');
    try {
        await expect(tableContainer).toBeVisible({ timeout: 10000 });
        const rows = tableContainer.locator('div.ag-row');
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);
        logInfo('Таблица загружена и содержит строки.');
    } catch (error) {
        logError(`Таблица не загрузилась или не содержит строк: ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Выбирает заданное количество строк в таблице и возвращает массив выбранных сотрудников.
 * @param page Playwright Page объект.
 * @param numberOfRows Количество строк для выбора.
 * @returns Массив имен выбранных сотрудников.
 */
export async function selectRowsInTable(page: Page, numberOfRows: number): Promise<string[]> {
    const tableContainer = page.locator('div.ag-pinned-left-cols-container');
    const rows = tableContainer.locator('div.ag-row');
    const rowCount = await rows.count();
    const selectedEmployees: string[] = [];

    for (let i = 0; i < numberOfRows && i < rowCount; i++) {
        const row = rows.nth(i);
        await row.scrollIntoViewIfNeeded();
        await expect(row).toBeVisible({ timeout: 5000 });

        const checkbox = row.locator('div.ag-cell[col-id="ФИО"] input[type="checkbox"]');
        await expect(checkbox).toBeVisible({ timeout: 5000 });
        await expect(checkbox).toBeEnabled({ timeout: 5000 });
        await checkbox.check();

        const nameCell = row.locator('div.ag-cell[col-id="ФИО"] .ag-cell-value > div');
        const employeeName = await nameCell.evaluate(el => el?.childNodes[0]?.textContent?.trim());
        selectedEmployees.push(employeeName!);
    }

    if (selectedEmployees.length !== numberOfRows) {
        logError(`Ожидалось выбрать ${numberOfRows} сотрудников, но выбрано ${selectedEmployees.length}.`);
        throw new Error(`Некорректное количество выбранных сотрудников.`);
    }

    logInfo(`Выбраны сотрудники: ${selectedEmployees.join(', ')}`);
    return selectedEmployees;
}

/**
 * Снимает все выбранные чекбоксы в таблице.
 * @param page Playwright Page объект.
 */
export async function deselectAllRows(page: Page): Promise<void> {
    const tableContainer = page.locator('div.ag-pinned-left-cols-container');
    const rows = tableContainer.locator('div.ag-row');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        const checkbox = row.locator('div.ag-cell[col-id="ФИО"] input[type="checkbox"]');
        if (await checkbox.isChecked()) {
            await checkbox.uncheck();
            const nameCell = row.locator('div.ag-cell[col-id="ФИО"] .ag-cell-value > div');
            const employeeName = await nameCell.evaluate(el => el?.childNodes[0]?.textContent?.trim());
        }
    }

    logInfo('Все чекбоксы в таблице сняты.');
}



