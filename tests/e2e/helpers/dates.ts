import { Page } from "playwright/test";

export function getMondayOfCurrentWeek() {
    const currentDate = new Date();
    const day = currentDate.getDay(); // 0 (воскресенье) до 6 (суббота)
    const diff = (day === 0 ? -6 : 1 - day); // Если воскресенье (0), то отнимаем 6 дней
    const monday = new Date(currentDate.setDate(currentDate.getDate() + diff));
    return monday;
}

export  function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0'); // День месяца с ведущим нулём
    const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const month = monthNames[date.getMonth()]; // Название месяца
    const year = date.getFullYear().toString().slice(-2); // Последние две цифры года
    const weekdayNames = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    const weekday = weekdayNames[date.getDay()]; // Название дня недели

    return `${day} ${month} ${year} | ${weekday}`;
}

/**
 * Возвращает дату понедельника недели, смещенной на offset недель относительно текущей.
 * @param offset Количество недель относительно текущей (-1 для предыдущей, 0 для текущей, 1 для следующей)
 */
export function getMondayOfWeek(offset: number): Date {
    const currentDate = new Date();
    const day = currentDate.getDay(); // 0 (вс) до 6 (сб)
    const diff = (day === 0 ? -6 : 1 - day) + offset * 7;
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + diff);
}

// Функция для форматирования даты в формат aria-label из flatpickr
export function formatAriaLabel(date: Date): string {
    const day = date.getDate();
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}


export function generateExpectedDayLabels(startDate: Date): string[] {

    // Генерируем ожидаемые метки дней недели
    const dayNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    const expectedDays: string[] = [];

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

      // Форматируем день как 'пн 18', 'вт 19' и т.д.
        const dayLabel = `${dayNames[i]} ${currentDate.getDate()}`;
        expectedDays.push(dayLabel);
    }

    return expectedDays;
}


/**
 * Извлекает начальную дату недели из заголовков таблицы и генерирует ожидаемые метки дней недели.
 * @param page Playwright Page объект.
 * @returns Массив строк с ожидаемыми метками дней недели, например: ['пн 18', 'вт 19', ...]
 */
export async function extractStartDateFromHeader(page: Page): Promise<string[]> {
    // Локатор для всех заголовков столбцов с ролью "columnheader"
    const headerCells = page.locator('div.ag-header-cell[role="columnheader"] .ag-header-cell-text');

    // Получаем количество заголовков
    const headerCount = await headerCells.count()-1;

    if(headerCount === 0){
        throw new Error('Не удалось найти ни одного заголовка столбца.');
    }

    // Массив названий дней недели на русском языке
    const dayNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

    // Маппинг русских сокращений месяцев на числовые значения
    const monthMap: { [key: string]: number } = {
        'янв': 0,
        'фев': 1,
        'мар': 2,
        'апр': 3,
        'май': 4,
        'июн': 5,
        'июл': 6,
        'авг': 7,
        'сен': 8,
        'окт': 9,
        'ноя': 10,
        'дек': 11
    };

    for (let i = 0; i < headerCount; i++) {
        const headerText = (await headerCells.nth(i).textContent())?.trim();

        if (!headerText) {
            continue; // Пропускаем пустые заголовки
        }

        // Проверяем, не является ли заголовок "ФИО" или другим не-дата заголовком
        if (headerText.toLowerCase() === 'фио') {
            continue; // Пропускаем заголовок "ФИО"
        }

        // Предполагаем, что формат текста - '18 ноя 24 | пн'
        const dateMatch = headerText.match(/^(\d{1,2})\s+([а-яё]{3})\s+(\d{2})\s+\|\s+([а-яё]{2})$/i);

        if (dateMatch) {

            const [, dayStr, monthStr, yearStr] = dateMatch;

            const month = monthMap[monthStr.toLowerCase()];

            if (month === undefined) {
                throw new Error(`Неизвестный месяц: ${monthStr}`);
            }

            const day = parseInt(dayStr, 10);
            const year = parseInt(yearStr, 10) + 2000; // Предполагаем, что год в формате 'yy'

            const startDate = new Date(year, month, day);

            if (isNaN(startDate.getTime())) {
                throw new Error(`Некорректная дата: ${dayStr} ${monthStr} ${yearStr}`);
            }

            console.log(`Начальная дата недели: ${startDate.toLocaleDateString('ru-RU')}`);

            // Генерируем ожидаемые метки дней недели
            const expectedDays: string[] = [];

            for (let j = 0; j < 7; j++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + j);

                // Форматируем день как 'пн 18', 'вт 19' и т.д.
                const dayLabel = `${dayNames[j]} ${currentDate.getDate()}`;
                expectedDays.push(dayLabel);
            }

            console.log(`Ожидаемые метки дней недели: ${expectedDays.join(', ')}`);

            return expectedDays; // Возвращаем после нахождения первой даты
        } else {
            console.log(`Заголовок ${i+1} не соответствует формату даты`);
        }
    }

    throw new Error('Не удалось найти заголовок столбца с датой.');
}
