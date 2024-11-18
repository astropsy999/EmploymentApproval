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