import { BrowserContext, Page } from '@playwright/test';
import test from './fixtures';
import { verifyButtonFunctionality, verifyUpdateButtonFunctionality } from './helpers/buttonFunctionality';
import { openCalendar, selectDateInCalendar, verifyCalendarElements, verifyCalendarNavigationButtons, verifyCurrentMonthAndYear, verifyCurrentWeekHighlighted, verifyTableHeadersForWeek } from './helpers/calendar';
import { formatDateWithWeekday, getMondayOfCurrentWeek, getMondayOfWeek } from './helpers/dates';
import { verifyAllHeaderElements } from './helpers/header';
import { logSuccess } from './helpers/logger';
import { verifyTableLoaded } from './helpers/table';
import { getFormattedWeekDates, navigateAndVerifyWeek, verifyWeekDatesVisible } from './helpers/week';

let context: BrowserContext;
let page: Page;

test.describe('Тестирование сводного календаря', () => {

    test('Проверка функционала сводного календаря', async ({authenticatedPage }) => {
        
        test.setTimeout(200000);

        // Шаг 1: Проверка элементов шапки
        await test.step('Проверка элементов шапки', async () => {
            await verifyAllHeaderElements(authenticatedPage);
        });

        // Шаг 2: Проверка загрузки таблицы
        await test.step('Проверка загрузки таблицы', async () => {
            const expectedHeaderCount = 9; // Фактическое количество колонок
            const monday = getMondayOfCurrentWeek();
            const startWeekDate = formatDateWithWeekday(monday);
            const specificHeaders = [
                'ФИО',
                startWeekDate,
                'Σ'
                // Добавьте другие конкретные заголовки по необходимости
            ];
            const expectedCellText = 'Стужук Е.В.';

            await verifyTableLoaded(authenticatedPage, expectedHeaderCount, specificHeaders, expectedCellText);
        });

        // Шаг 3: Проверка работы кнопок навигации "Предыдущая неделя" и "Следующая неделя"
        await test.step('Проверка работы кнопок "Предыдущая неделя" и "Следующая неделя"', async () => {
            // Вычисляем даты текущей недели
            const currentWeekDates = getFormattedWeekDates(0); // 0 - текущая неделя

            // Проверяем, что текущие даты отображаются
            await verifyWeekDatesVisible(authenticatedPage, currentWeekDates);

            // Навигация на предыдущую неделю и проверка
            const previousWeekDates = getFormattedWeekDates(-1); // -1 - предыдущая неделя
            await navigateAndVerifyWeek(authenticatedPage, -1, previousWeekDates);

            // Навигация на следующую неделю и проверка (возвращение к текущей неделе)
            await navigateAndVerifyWeek(authenticatedPage, 1, currentWeekDates);

            logSuccess('Кнопки "Предыдущая неделя" и "Следующая неделя" работают корректно.');
        });

         // Шаг 4: Проверка работы flatpickr календаря
        await test.step('Проверка работы flatpickr календаря', async () => {
            // 1. Ожидание исчезновения индикатора загрузки
            await authenticatedPage.waitForSelector('.temploaderWrapper', { state: 'hidden', timeout: 10000 });

            // 2. Открытие календаря
            await openCalendar(authenticatedPage);

            // 3. Проверка основных элементов календаря
            await verifyCalendarElements(authenticatedPage);

            // 4. Проверка кнопок навигации календаря
            await verifyCalendarNavigationButtons(authenticatedPage);

            // 5. Проверка текущего месяца и года
            const today = new Date();
            const currentMonthIndex = today.getMonth().toString(); // 0-11
            const currentYear = today.getFullYear().toString();
            await verifyCurrentMonthAndYear(authenticatedPage, currentMonthIndex, currentYear);

            // 6. Проверка выделения текущей недели
            const monday = getMondayOfWeek(0);
            const weekDates: Date[] = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
                weekDates.push(date);
            }
            await verifyCurrentWeekHighlighted(authenticatedPage, weekDates);

            logSuccess('Календарь flatpickr успешно отображается при нажатии на поле ввода даты.');
        });

        // Шаг 5: Проверка выбора предыдущей недели в flatpickr и обновления таблицы
        await test.step('Проверка выбора предыдущей недели в flatpickr и обновления таблицы', async () => {
            // 1. Открытие календаря
            await openCalendar(authenticatedPage);

            // 2. Выбор даты предыдущей недели (например, среда)
            const previousMonday = getMondayOfWeek(-1); // -1 означает предыдущую неделю
            const anyDateOfPreviousWeek = new Date(previousMonday);
            anyDateOfPreviousWeek.setDate(previousMonday.getDate() + 2); // Добавляем 2 дня, получаем среду
            await selectDateInCalendar(authenticatedPage, anyDateOfPreviousWeek);

            // 3. Вычисляем даты предыдущей недели
            const weekDates: string[] = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(previousMonday.getFullYear(), previousMonday.getMonth(), previousMonday.getDate() + i);
                weekDates.push(formatDateWithWeekday(date));
            }

            // 4. Проверяем, что заголовки таблицы обновились на даты предыдущей недели
            await verifyTableHeadersForWeek(authenticatedPage, weekDates);

            logSuccess('При выборе даты предыдущей недели в flatpickr, таблица успешно обновляется и отображает данные предыдущей недели.');
        });

         // Шаг 6: Проверка работы кнопки "Согласовать"
        await test.step('Проверка работы кнопки "Согласовать"', async () => {
            await verifyButtonFunctionality(
                authenticatedPage,
                'Согласовать',
                'Массовое согласование занятости',
                'Необходимо выбрать сотрудников для согласования',
                2 // Количество сотрудников для выбора
            );
        });

        // Шаг 7: Проверка работы кнопки "Заблокировать"
        await test.step('Проверка работы кнопки "Заблокировать"', async () => {
            await verifyButtonFunctionality(
                authenticatedPage,
                'Заблокировать',
                'Массовая блокировка занятости',
                'Необходимо выбрать сотрудников для блокировки',
                2 // Количество сотрудников для выбора
            );
        });

        // Шаг 7: Проверка работы кнопки "Разблокировать"
        await test.step('Проверка работы кнопки "Разблокировать"', async () => {
            await verifyButtonFunctionality(
                authenticatedPage,
                'Разблокировать',
                'Массовая разблокировка занятости',
                'Необходимо выбрать сотрудников для разблокировки',
                2 // Количество сотрудников для выбора
            );
        });

        // Шаг8: Проверка работы кнопки "Обновить"
        await test.step('Проверка работы кнопки "Обновить"', async () => {
            await verifyUpdateButtonFunctionality(
                authenticatedPage,
                'reloadButton', 
                'https://telegram.giapdc.ru:8443/index.php/ObjectController/GetTableData' 
            );
            logSuccess('Кнопка "Обновить" корректно работает.');
        });

    });

    // test.afterAll(async ({authenticatedPage}) => {
    //     // Закрываем страницу и контекст после завершения всех тестов
    //     await authenticatedPage.close();
    //     await context.close();
    // });
});
