/**
 * Функция применяется для того, чтобы подставить 0 перед целым числом для дней или месяцев в тех случаях, где это необходимо
 * @param {*} datePart - Является частью даты (день, месяц или год)
 * @returns возвращает строку с 0, если число от 1 до 9 и без 0, если больше 9
 */
const addZeroBefore = (datePart) => {
  const datePartStr = datePart.toString();

  if (datePartStr.length == 1) {
    return `0${datePartStr}`;
  } else return datePartStr;
};

/**
 * Функция для отпределения интервала по умолчанию
 * @returns возвращает кортеж объектов дат 1го и последнего дня текущего месяца [fD, lD]
 */
export const datesRangesDefault = () => {
  const date = new Date(),
    y = date.getFullYear().toString(),
    m = date.getMonth();
  const fD = new Date(y, m, 1);
  const lD = new Date(y, m + 1, 0);

  return [fD, lD];
};

/**
 * Функция для отпределения интервала по умолчанию для недели
 * @returns возвращает кортеж объектов дат 1го и последнего дня текущей недели [fD, lD]
 */

export const weekDatesDefault = () => {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // Получаем текущий день недели (0 - воскресенье, 1 - понедельник, и так далее)
  const diff = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // Рассчитываем разницу между текущим днем недели и понедельником (0 - если воскресенье, иначе текущий день минус 1)

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - diff); // Вычисляем начальную дату недели
  startDate.setHours(0, 0, 0, 0); // Устанавливаем время на начало дня

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // Вычисляем конечную дату недели
  endDate.setHours(23, 59, 59, 999); // Устанавливаем время на конец дня

  return [startDate, endDate];
};

/**
 * Изменяет формат даты-времени c объекта Data на подходящий для базы данных => dd.mm.yyyy hh?:mm?
 * @param {*} date - стандартный объект даты
 * @returns строку даты в виде ${d}.${m}.${yy}
 */

export const transformDate = (date) => {
  const day = addZeroBefore(date.getDate());
  const month = addZeroBefore(date.getMonth() + 1);
  const year = addZeroBefore(date.getFullYear());

  return `${day}.${month}.${year}`;
};
/**
 * Изменяет формат даты-времени c объекта Data на строку вида => dd.mm.yy
 * @param {*} date - стандартный объект даты
 * @returns строку даты в виде ${d}.${m}.${yy}
 */

export const transformDateYY = (date) => {
  const day = addZeroBefore(date.getDate());
  const month = addZeroBefore(date.getMonth() + 1);
  let year = date.getFullYear().toString();
  let yy = year.substring(2);
  return `${day}.${month}.${yy}`;
};

export const readableDate = (date) => {
  const [day, month, year] = date.split('/').map(Number);

  const months = [
    '',
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
  ];
  const daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

  const monthStr = months[month];
  const yearStr = String(year).slice(-2);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeekStr = daysOfWeek[dateObj.getDay()];

  return `${day} ${monthStr} ${yearStr} | ${dayOfWeekStr}`;
};

// Функция для преобразования даты в строку "dd.MM.yyyy"
export function formatDateToDDMMYYYY(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
