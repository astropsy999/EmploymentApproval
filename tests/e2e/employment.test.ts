import { test, expect, BrowserContext, Page, Locator } from '@playwright/test';
import { authorizeAndGetCookies } from './helpers/auth';
import { CONFIG } from './config.e2e';
import { formatAriaLabel, formatDate, getMondayOfCurrentWeek, getMondayOfWeek } from './helpers/dates';

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
        
            console.log('Все элементы шапки успешно загружены.');
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

            console.log('Таблица успешно загружена и отображает необходимые элементы.');

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

            // // Ждём, пока индикатор загрузки станет невидимым или исчезнет из DOM
            // await page.waitForSelector('.temploaderWrapper', { state: 'hidden' });

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

            // Кликаем на кнопку "Следующая неделя"
            await page.click('button[aria-label="Следующая неделя"]');

            // await page.waitForSelector('.temploaderWrapper', { state: 'visible' });
            // // Ждём, пока индикатор загрузки станет невидимым или исчезнет из DOM
            // await page.waitForSelector('.temploaderWrapper', { state: 'detached' });

            // Проверяем, что календарь вернулся к текущей неделе
            for (const date of currentWeekDates) {
                await expect(
                    page.locator('div.ag-header-cell').filter({ hasText: date })
                ).toBeVisible();
            }

            console.log('Кнопки "Предыдущая неделя" и "Следующая неделя" работают корректно.');
        });

        await test.step('Проверка работы flatpickr календаря', async () => {
            await page.waitForSelector('.temploaderWrapper', { state: 'attached' });

            await page.waitForSelector('.temploaderWrapper', { state: 'detached' });
            // Находим поле ввода даты
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


            console.log('Календарь flatpickr успешно отображается при нажатии на поле ввода даты.');
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
        
            console.log('При выборе даты предыдущей недели в flatpickr, таблица успешно обновляется и отображает данные предыдущей недели.');
        });
        

    });

    test.afterAll(async () => {
        // Закрываем страницу и контекст после завершения всех тестов
        await page.close();
        await context.close();
    });
});
