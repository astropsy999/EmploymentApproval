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

/**
 * Универсальная функция для проверки функциональности кнопки.
 * @param page Playwright Page объект.
 * @param buttonTestId Тестовый идентификатор кнопки.
 * @param loaderSelector Селектор загрузчика.
 * @param apiEndpoint Конечная точка API для отслеживания запроса.
 * @param expectedResponse Ожидаемый ответ от API.
 */
export async function verifyUpdateButtonFunctionality(
    page: Page,
    buttonTestId: string,
    apiEndpoint: string,
): Promise<void> {
    try {
        await page.waitForSelector('.temploaderWrapper', { state: 'hidden' });

        logInfo(`Проверка работы кнопки с test-id="${buttonTestId}"`);
        
        // Локатор кнопки "Обновить"
        const updateButton = page.getByTestId(buttonTestId);
        await expect(updateButton).toBeVisible();
        await expect(updateButton).toBeEnabled();
        
        // Настройка ожидания запроса
        const [response] = await Promise.all([
            page.waitForResponse(response => response.url().includes(apiEndpoint) && response.status() === 200),
            updateButton.click(),
        ]);
        
        logInfo('Кликнули по кнопке "Обновить"');
        
         // Проверка появления загрузчика
         const loader = page.locator('.temploaderWrapper');
         await expect(loader).toBeVisible({ timeout: 5000 });
         logInfo('Загрузчик появился');
         
         // Ожидание завершения запроса и скрытия загрузчика
         await expect(loader).toBeHidden({ timeout: 15000 });
         logInfo('Загрузчик скрыт');
         
          // Проверка успешного ответа
         expect(response.ok()).toBeTruthy(); // Или используйте response.status()
        // await expect(response.status()).toBe(200);
        logInfo('Запрос отправлен и получен успешный ответ');
        
    } catch (error) {
        logError(`Ошибка при проверке кнопки "Обновить": ${(error as Error).message}`);
        throw error;
    }
}

/**
 * Проверяет функциональность кнопки для Сообщения.
 * @param page Playwright Page объект.
 * @param buttonTestId data-testid кнопки.
 * @param columnHeader Название столбца для проверки.
 */
export async function verifyToggleColumnFunctionality(
    page: Page,
    buttonTestId: string,
    columnHeader: string
): Promise<void> {
    try {
        logInfo(`Проверка работы кнопки с data-testid="${buttonTestId}" для столбца "${columnHeader}"`);
        
        // Локатор кнопки "Сообщения"
        const toggleButton = page.getByTestId(buttonTestId);
        await expect(toggleButton).toBeVisible({ timeout: 5000 });
        await expect(toggleButton).toBeEnabled({ timeout: 5000 });
        
        // Кликаем на кнопку, чтобы показать столбец
        await toggleButton.click();
        logInfo(`Кликнули по кнопке "${buttonTestId}" для показа столбца "${columnHeader}"`);
        
        // Проверяем, что столбец появился
        const columnHeaderLocator = page.locator('div.ag-header-cell-comp-wrapper', { hasText: columnHeader });
        await expect(columnHeaderLocator).toBeVisible({ timeout: 5000 });
        logInfo(`Столбец "${columnHeader}" успешно появился.`);
        
        // Кликаем на кнопку снова, чтобы скрыть столбец
        await toggleButton.click();
        logInfo(`Кликнули по кнопке "${buttonTestId}" для скрытия столбца "${columnHeader}"`);
        
        // Проверяем, что столбец исчез
        await expect(columnHeaderLocator).toBeHidden({ timeout: 5000 });
        logInfo(`Столбец "${columnHeader}" успешно скрыт.`);
        
    } catch (error) {
        logError(`Ошибка при проверке кнопки "${buttonTestId}": ${(error as Error).message}`);
        throw error;
    }
}


/**
 * Проверяет функциональность кнопки "Список сотрудников".
 * @param page Playwright Page объект.
 * @param buttonTestId data-testid кнопки.
 * @param columnHeader Название столбца для проверки.
 */
export async function verifyEmployeeListButtonFunctionality(
    page: Page,
    buttonTestId: string,
): Promise<void> {
    try {
        logInfo(`Проверка работы кнопки с data-testid="${buttonTestId}" для столбца`);
        
        // Локатор кнопки "Список сотрудников"
        const toggleButton = page.getByTestId(buttonTestId);
        await expect(toggleButton).toBeVisible({ timeout: 5000 });
        await expect(toggleButton).toBeEnabled({ timeout: 5000 });
        
        // Кликаем на кнопку, чтобы показать столбец
        await toggleButton.click();
        logInfo(`Кликнули по кнопке "${buttonTestId}" для показа окна для выбора сотрудников`);
        
        // Проверяем, что окно открылось
        const employmentListWindow = page.locator('div.ag-virtual-list-container');
        await expect(employmentListWindow).toBeVisible({ timeout: 5000 });
        logInfo(`Окно со списком сотрудников успешно появилось.`);

        const closeBtn = page.locator('button.close-btn-on-menu');
        await closeBtn.click()
        logInfo(`Окно со списком сотрудников успешно скрыто по нажатию на крестик.`);
        
        
    } catch (error) {
        logError(`Ошибка при проверке кнопки "${buttonTestId}": ${(error as Error).message}`);
        throw error;
    }
}