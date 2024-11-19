import { test, expect, BrowserContext, Page, Locator } from '@playwright/test';
import { authorizeAndGetCookies } from './helpers/auth';
import { CONFIG } from './config.e2e';
import { extractStartDateFromHeader, formatAriaLabel, formatDate, generateExpectedDayLabels, getMondayOfCurrentWeek, getMondayOfWeek } from './helpers/dates';
import { deselectAllRows } from './helpers/tableHelpers';
import { logSuccess } from './helpers/logger';

let context: BrowserContext;
let page: Page;

test.describe('Тестирование сводного календаря', () => {
    test.beforeAll(async ({ browser }) => {
        // Создаем контекст
        context = await browser.newContext();

        // Создаем страницу для авторизации
        page = await context.newPage();

        // Авторизация и получение cookies
        const cookies = await authorizeAndGetCookies(
            page,
            CONFIG.AUTH.url,
            CONFIG.AUTH.username,
            CONFIG.AUTH.password
        );

        // Добавляем cookies в контекст
        await context.addCookies(cookies);

        // Переход на страницу календаря
        await page.goto(CONFIG.APP.url);

        // Проверяем, что шапка календаря видна
        await expect(page.locator('.MuiBox-root')).toBeVisible();
    });


    test('Проверка функционала сводного календаря', async () => {
        
        test.setTimeout(100000);

        await test.step('Проверка элементов шапки', async () => {
            const header = page.locator('.MuiBox-root');
            await expect(header).toBeVisible();
        
             // Проверяем наличие кнопки "Предыдущая неделя"
            await expect(page.locator('button[aria-label="Предыдущая неделя"]')).toBeVisible();

            // Проверяем наличие поля ввода даты
            await expect(page.locator('input.dateInput.flatpickr-input')).toBeVisible();

            // Проверяем наличие кнопки "Следующая неделя"
            await expect(page.locator('button[aria-label="Следующая неделя"]')).toBeVisible();

            // Проверяем наличие кнопки "Согласовать"
            await expect(page.locator('button:has-text("Согласовать")')).toBeVisible();

            // Проверяем наличие кнопки "Заблокировать"
            await expect(page.locator('button:has-text("Заблокировать")')).toBeVisible();

            // Проверяем наличие кнопки "Разблокировать"
            await expect(page.locator('button:has-text("Разблокировать")')).toBeVisible();

            // Проверяем наличие кнопки с иконкой обновления (CachedIcon)
            await expect(page.locator('button >> svg[data-testid="CachedIcon"]')).toBeVisible();

            // Проверяем наличие кнопки с иконкой почты (MailOutlineIcon)
            await expect(page.locator('button >> svg[data-testid="MailOutlineIcon"]')).toBeVisible();
        
            logSuccess('Все элементы шапки успешно загружены.');
        });

        await test.step('Проверка загрузки таблицы', async ()=> {
            // Ожидаем, что корневой элемент таблицы присутствует
            await expect(page.locator('div.ag-root')).toBeVisible();

            // Проверяем наличие заголовков колонок
            const headerCells = page.locator('div.ag-header-cell');
            await expect(headerCells).toHaveCount(9); // фактическое количество колонок

            const monday = getMondayOfCurrentWeek();
            const startWeekDate = formatDate(monday);

            // Проверяем наличие колонок с конкретными заголовками
            await expect(page.locator('div.ag-header-cell[col-id="ФИО"]')).toBeVisible();
            await expect(page.locator(`div.ag-header-cell:has-text("${startWeekDate}")`)).toBeVisible();
            await expect(page.locator('div.ag-header-cell:has-text("Σ")')).toBeVisible();

            // Ждём, пока индикатор загрузки станет невидимым или исчезнет из DOM
            await page.waitForSelector('.temploaderWrapper', { state: 'hidden' });

            // Проверяем наличие строк в таблице

            await expect(page.locator('div.ag-cell:has-text("Стужук Е.В.")')).toBeVisible();

            logSuccess('Таблица успешно загружена и отображает необходимые элементы.');

        });

        await test.step('Проверка работы кнопок "Предыдущая неделя" и "Следующая неделя"', async () => {

            // Вычисляем даты текущей недели
            const currentMonday = getMondayOfWeek(0); // 0 - текущая неделя
            const currentWeekDates: any = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(currentMonday);
                date.setDate(currentMonday.getDate() + i);
                currentWeekDates.push(formatDate(date));
            }

            // Проверяем, что текущие даты отображаются
            for (const date of currentWeekDates) {
                await expect(
                    page.locator('div.ag-header-cell').filter({ hasText: date })
                ).toBeVisible();
            }

            // Кликаем на кнопку "Предыдущая неделя"
            await page.click('button[aria-label="Предыдущая неделя"]');

            // Вычисляем даты предыдущей недели
            const previousMonday = getMondayOfWeek(-1); // -1 - предыдущая неделя
            const previousWeekDates: any = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(previousMonday);
                date.setDate(previousMonday.getDate() + i);
                previousWeekDates.push(formatDate(date));
            }

            // Проверяем, что даты обновились на предыдущую неделю
            for (const date of previousWeekDates) {
                await expect(
                    page.locator('div.ag-header-cell').filter({ hasText: date })
                ).toBeVisible();
            }

            await page.waitForSelector('.temploaderWrapper', { state: 'hidden' });

            // Кликаем на кнопку "Следующая неделя"
            await page.click('button[aria-label="Следующая неделя"]');

            // Проверяем, что календарь вернулся к текущей неделе
            for (const date of currentWeekDates) {
                await expect(
                    page.locator('div.ag-header-cell').filter({ hasText: date })
                ).toBeVisible();
            }

            logSuccess('Кнопки "Предыдущая неделя" и "Следующая неделя" работают корректно.');
        });

        await test.step('Проверка работы flatpickr календаря', async () => {

            await page.waitForSelector('.temploaderWrapper', { state: 'hidden' });

            const dateInput = page.locator('input.dateInput.flatpickr-input');

            // Кликаем по полю ввода даты
            await dateInput.click();

            // Проверяем, что появился календарь
            const calendarPopup = page.locator('div.flatpickr-calendar');
            await expect(calendarPopup).toBeVisible();

            // Проверяем наличие основных элементов календаря
            await expect(calendarPopup.locator('div.flatpickr-months')).toBeVisible(); // Блок месяцев
            await expect(calendarPopup.locator('div.flatpickr-weekdays')).toBeVisible(); // Блок дней недели
            await expect(calendarPopup.locator('div.dayContainer')).toBeVisible(); // Блок дней

            // Проверяем наличие кнопок переключения месяцев
            await expect(calendarPopup.locator('span.flatpickr-prev-month')).toBeVisible();
            await expect(calendarPopup.locator('span.flatpickr-next-month')).toBeVisible();

            // Дополнительно проверяем наличие текущей даты
            const today = new Date();

            // Получаем индекс текущего месяца в виде строки
            const currentMonthIndex = today.getMonth().toString();

            // Проверяем, что элемент <select> имеет значение текущего месяца
            await expect(
                calendarPopup.locator('select.flatpickr-monthDropdown-months')
            ).toHaveValue(currentMonthIndex);

            // Проверяем, что текущий год отображается
            const currentYear = today.getFullYear().toString();
            await expect(calendarPopup.locator('input.cur-year')).toHaveValue(currentYear);

            // Проверяем, что текущая неделя отмечена

             // Получаем понедельник текущей недели
            const monday = getMondayOfWeek(0);

            // Создаем массив дат текущей недели
            const weekDates: any = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
                weekDates.push(date);
            }

            // Проходим по каждой дате текущей недели
            for (const date of weekDates) {
                // Формируем aria-label в нужном формате
                const formattedAriaLabel = formatAriaLabel(date);

                // Ищем элемент дня с соответствующим aria-label
                const dayElement = calendarPopup.locator(`span.flatpickr-day[aria-label="${formattedAriaLabel}"]`);

                // Проверяем, что элемент видим
                await expect(dayElement).toBeVisible();

                // Проверяем, что элемент имеет классы, указывающие на выделение недели
                await expect(dayElement).toHaveClass(/(selected|startRange|inRange|endRange)/);
            }


            logSuccess('Календарь flatpickr успешно отображается при нажатии на поле ввода даты.');
        });

        await test.step('Проверка выбора предыдущей недели в flatpickr и обновления таблицы', async () => {
            // Находим поле ввода даты
            const dateInput = page.locator('input.dateInput.flatpickr-input');
        
            // Кликаем по полю ввода даты, чтобы открыть календарь
            await dateInput.click();
        
            // Ждём появления календаря
            const calendarPopup = page.locator('div.flatpickr-calendar');
            await expect(calendarPopup).toBeVisible();
        
            // Вычисляем любую дату предыдущей недели (например, среда)
            const previousMonday = getMondayOfWeek(-1); // -1 означает предыдущую неделю
            const anyDateOfPreviousWeek = new Date(previousMonday);
            anyDateOfPreviousWeek.setDate(previousMonday.getDate() + 2); // Добавляем 2 дня, получаем среду
        
            // Форматируем aria-label для выбранной даты
            const dateAriaLabel = formatAriaLabel(anyDateOfPreviousWeek);
        
            // Находим и кликаем по элементу дня с соответствующим aria-label
            const dayElement = calendarPopup.locator(`span.flatpickr-day[aria-label="${dateAriaLabel}"]`);
            await dayElement.click();
        
            // Ждём обновления таблицы
            // Рекомендуется заменить на явное ожидание, например, ожидание изменения заголовков
            await page.waitForTimeout(1000);
        
            // Проверяем, что заголовки таблицы обновились на даты предыдущей недели
            const weekDates: any = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(previousMonday.getFullYear(), previousMonday.getMonth(), previousMonday.getDate() + i);
                weekDates.push(formatDate(date));
            }
        
            for (const date of weekDates) {
                await expect(
                    page.locator('div.ag-header-cell').filter({ hasText: date })
                ).toBeVisible();
            }
        
            logSuccess('При выборе даты предыдущей недели в flatpickr, таблица успешно обновляется и отображает данные предыдущей недели.');
        });

        await test.step('Проверка работы кнопки "Согласовать" без выбора сотрудников', async () => {

            await page.waitForSelector('.temploaderWrapper', { state: 'hidden' });

            // **Сценарий 1: Без выбора строки в таблице**
        
            // Создаём локатор для кнопки "Согласовать" по её роли и имени
            const agreeButton = page.getByRole('button', { name: 'Согласовать' });
        
            // Убеждаемся, что кнопка видима и доступна для клика
            await expect(agreeButton).toBeVisible();
            await expect(agreeButton).toBeEnabled();
        
            // Кликаем на кнопку "Согласовать" без выбора строки
            await agreeButton.click();
        
            // Ожидаем появления модального окна с сообщением "Выберите сотрудников!"
            const modalSelectEmployees = page.locator('div[role="dialog"]');
        
            await expect(modalSelectEmployees).toBeVisible();
        
            // Проверяем заголовок модального окна
            await expect(modalSelectEmployees.locator('h2')).toHaveText('Выберите сотрудников!');
        
            // Проверяем содержание модального окна
            await expect(modalSelectEmployees.locator('div.MuiDialogContent-root')).toHaveText('Необходимо выбрать сотрудников для согласования');
        
            // Закрываем модальное окно
            await modalSelectEmployees.locator('button[aria-label="close"]').click();
        
            logSuccess('Кнопка "Согласовать" работает корректно без выбора строк в таблице');
        });

        await test.step('Проверка работы кнопки "Согласовать" с выбором сотрудников', async () => {

            // **1. Ожидаем загрузки таблицы и появления строк**
            const tableContainer = page.locator('div.ag-pinned-left-cols-container');
            await expect(tableContainer).toBeVisible({ timeout: 10000 });

            const rows = tableContainer.locator('div.ag-row');
            const rowCount = await rows.count();

            // Проверяем, что таблица содержит хотя бы одну строку
            expect(rowCount).toBeGreaterThan(0);

            // **1. Выбираем определённые строки, отмечая чекбоксы**
            const numberOfRowsToSelect = 2; // Выберите нужное количество строк
            const selectedEmployees: string[] = [];

            for (let i = 0; i < numberOfRowsToSelect && i < rowCount; i++) {
                const row = rows.nth(i);

                // Прокручиваем до строки, чтобы убедиться, что она видима (если используется виртуализация)
                await row.scrollIntoViewIfNeeded();

                // Проверяем, что строка видима
                await expect(row).toBeVisible({ timeout: 5000 });

                // Находим чекбокс в ячейке "ФИО"
                const checkbox = row.locator('div.ag-cell[col-id="ФИО"] input[type="checkbox"]');

                // Проверяем, что чекбокс видим и доступен
                await expect(checkbox).toBeVisible({ timeout: 5000 });
                await expect(checkbox).toBeEnabled({ timeout: 5000 });

                // Отмечаем чекбокс
                await checkbox.check();

                // Извлекаем имя сотрудника из ячейки "ФИО" только из первого текстового узла
                const nameCell = row.locator('div.ag-cell[col-id="ФИО"] .ag-cell-value > div');
                const employeeName = await nameCell.evaluate(el => el?.childNodes[0]?.textContent?.trim());

                selectedEmployees.push(employeeName!);
            }

            // Проверяем, что выбрано нужное количество сотрудников
            expect(selectedEmployees.length).toBe(numberOfRowsToSelect);
            console.log(`Выбраны сотрудники: ${selectedEmployees.join(', ')}`);

            // **3. Извлекаем начальную дату недели и генерируем ожидаемые метки дней недели**
            const expectedDays = await extractStartDateFromHeader(page);

            // **4. Кликаем на кнопку "Согласовать"**
            const agreeButton = page.getByRole('button', { name: 'Согласовать' });
            await expect(agreeButton).toBeVisible({ timeout: 5000 });
            await expect(agreeButton).toBeEnabled({ timeout: 5000 });
            console.log('Кликаем на кнопку "Согласовать"');
            await agreeButton.click();

            // **5. Ожидаем появления модального окна**
            const modal = page.locator('div[role="dialog"]');
            await expect(modal).toBeVisible({ timeout: 10000 });
            console.log('Модальное окно появилось');

            // **6. Проверяем заголовок модального окна**
            const modalTitle = modal.locator('h2');
            await expect(modalTitle).toHaveText('Массовое согласование занятости', { timeout: 5000 });
            console.log('Проверяем заголовок модального окна');

            // **7. Проверяем имена сотрудников в модальном окне**
            const employeesInModal = modal.locator('p').nth(1); // Предполагаем, что второй <p> содержит имена
            const employeesText = await employeesInModal.textContent();
            console.log(`Имена в модальном окне: ${employeesText}`);

            for (const name of selectedEmployees) {
                expect(employeesText).toContain(name);
            }

            // **8. Проверяем наличие чекбоксов для дней недели на основе начальной даты**
            // Находим все чекбоксы для дней недели в модальном окне
            const dayCheckboxes = modal.locator('input[type="checkbox"]');
            await expect(dayCheckboxes).toHaveCount(7, { timeout: 5000 });
            console.log('Проверяем количество чекбоксов для дней недели');

            // Находим метки дней недели
            const dayLabels = modal.locator('.MuiFormControlLabel-label');

            // Проверяем каждую метку дня недели
            for (let i = 0; i < expectedDays.length; i++) {
                await expect(dayLabels.nth(i)).toHaveText(expectedDays[i], { timeout: 5000 });
            }


            // **9. Закрываем модальное окно**
            const closeModalButton = modal.locator('button[aria-label="close"]');
            await expect(closeModalButton).toBeVisible({ timeout: 5000 });
            await closeModalButton.click();
            await expect(modal).toBeHidden({ timeout: 5000 });
            console.log('Модальное окно успешно закрыто');

             // **10. Снимаем все чекбоксы**
            await deselectAllRows(page);
                
            logSuccess('Кнопка "Согласовать" работает корректно с выбранными сотрудниками.');
        });

        await test.step('Проверка работы кнопки "Заблокировать" без выбора сотрудников', async () => {

            await page.waitForSelector('.temploaderWrapper', { state: 'hidden' });

            // **Сценарий 1: Без выбора строки в таблице**
        
            // Создаём локатор для кнопки "Заблокировать" по её роли и имени
            const blockButton = page.getByRole('button', { name: 'Заблокировать' });
        
            // Убеждаемся, что кнопка видима и доступна для клика
            await expect(blockButton).toBeVisible();
            await expect(blockButton).toBeEnabled();
        
            // Кликаем на кнопку "Согласовать" без выбора строки
            await blockButton.click();
        
            // Ожидаем появления модального окна с сообщением "Выберите сотрудников"
            const modalSelectEmployees = page.locator('div[role="dialog"]');
        
            await expect(modalSelectEmployees).toBeVisible();
        
            // Проверяем заголовок модального окна
            await expect(modalSelectEmployees.locator('h2')).toHaveText('Выберите сотрудников');
        
            // Проверяем содержание модального окна
            await expect(modalSelectEmployees.locator('div.MuiDialogContent-root')).toHaveText('Необходимо выбрать сотрудников для блокировки');
        
            // Закрываем модальное окно
            await modalSelectEmployees.locator('button[aria-label="close"]').click();
        
            logSuccess('Кнопка "Заблокировать" работает корректно без выбора строк в таблице');
        });

        await test.step('Проверка работы кнопки "Заблокировать" с выбором сотрудников', async () => {

            // **1. Ожидаем загрузки таблицы и появления строк**
            const tableContainer = page.locator('div.ag-pinned-left-cols-container');
            await expect(tableContainer).toBeVisible({ timeout: 10000 });

            const rows = tableContainer.locator('div.ag-row');
            const rowCount = await rows.count();

            // Проверяем, что таблица содержит хотя бы одну строку
            expect(rowCount).toBeGreaterThan(0);

            // **1. Выбираем определённые строки, отмечая чекбоксы**
            const numberOfRowsToSelect = 2; // Выберите нужное количество строк
            const selectedEmployees: string[] = [];

            for (let i = 0; i < numberOfRowsToSelect && i < rowCount; i++) {
                const row = rows.nth(i);

                // Прокручиваем до строки, чтобы убедиться, что она видима (если используется виртуализация)
                await row.scrollIntoViewIfNeeded();

                // Проверяем, что строка видима
                await expect(row).toBeVisible({ timeout: 5000 });

                // Находим чекбокс в ячейке "ФИО"
                const checkbox = row.locator('div.ag-cell[col-id="ФИО"] input[type="checkbox"]');

                // Проверяем, что чекбокс видим и доступен
                await expect(checkbox).toBeVisible({ timeout: 5000 });
                await expect(checkbox).toBeEnabled({ timeout: 5000 });

                // Отмечаем чекбокс
                await checkbox.check();

                // Извлекаем имя сотрудника из ячейки "ФИО" только из первого текстового узла
                const nameCell = row.locator('div.ag-cell[col-id="ФИО"] .ag-cell-value > div');
                const employeeName = await nameCell.evaluate(el => el?.childNodes[0]?.textContent?.trim());

                selectedEmployees.push(employeeName!);
            }

            // Проверяем, что выбрано нужное количество сотрудников
            expect(selectedEmployees.length).toBe(numberOfRowsToSelect);
            console.warn(`Выбраны сотрудники: ${selectedEmployees.join(', ')}`);


            // **3. Извлекаем начальную дату недели и генерируем ожидаемые метки дней недели**
            const expectedDays = await extractStartDateFromHeader(page);

            // **4. Кликаем на кнопку "Заблокировать"**
            const agreeButton = page.getByRole('button', { name: 'Заблокировать' });
            await expect(agreeButton).toBeVisible({ timeout: 5000 });
            await expect(agreeButton).toBeEnabled({ timeout: 5000 });
            console.log('Кликаем на кнопку "Заблокировать"');
            await agreeButton.click();

            // **5. Ожидаем появления модального окна**
            const modal = page.locator('div[role="dialog"]');
            await expect(modal).toBeVisible({ timeout: 10000 });
            console.log('Модальное окно появилось');

            // **6. Проверяем заголовок модального окна**
            const modalTitle = modal.locator('h2');
            await expect(modalTitle).toHaveText('Массовая блокировка занятости', { timeout: 5000 });
            console.log('Проверяем заголовок модального окна');

            // **7. Проверяем имена сотрудников в модальном окне**
            const employeesInModal = modal.locator('p').nth(1); // Предполагаем, что второй <p> содержит имена
            const employeesText = await employeesInModal.textContent();
            console.log(`Имена в модальном окне: ${employeesText}`);

            for (const name of selectedEmployees) {
                expect(employeesText).toContain(name);
            }

            // **8. Проверяем наличие чекбоксов для дней недели на основе начальной даты**
            // Находим все чекбоксы для дней недели в модальном окне
            const dayCheckboxes = modal.locator('input[type="checkbox"]');
            await expect(dayCheckboxes).toHaveCount(7, { timeout: 5000 });
            console.log('Проверяем количество чекбоксов для дней недели');

            // Находим метки дней недели
            const dayLabels = modal.locator('.MuiFormControlLabel-label');

            // Проверяем каждую метку дня недели
            for (let i = 0; i < expectedDays.length; i++) {
                await expect(dayLabels.nth(i)).toHaveText(expectedDays[i], { timeout: 5000 });
            }


            // **9. Закрываем модальное окно**
            const closeModalButton = modal.locator('button[aria-label="close"]');
            await expect(closeModalButton).toBeVisible({ timeout: 5000 });
            await closeModalButton.click();
            await expect(modal).toBeHidden({ timeout: 5000 });
            console.log('Модальное окно успешно закрыто');

            // **10. Снимаем все чекбоксы**
            await deselectAllRows(page);
                
            logSuccess('Кнопка "Заблокировать" работает корректно с выбранными сотрудниками.');
        });

    });

    test.afterAll(async () => {
        // Закрываем страницу и контекст после завершения всех тестов
        await page.close();
        await context.close();
    });
});
