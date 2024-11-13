import { DateIdMap } from "../types";

/**
 * Функция фильтрации массива объектов по выбранным датам.
 *
 * @param selectedDates - Массив дат в формате 'dd/MM/yyyy'.
 * @param dataArray - Массив объектов с датами в формате 'dd.MM.yyyy' и числовыми значениями.
 * @returns Отфильтрованный массив объектов, содержащих только выбранные даты.
 */
export function filterDataByDates(
    selectedDates: string[],
    dataArray: DateIdMap[]
  ): DateIdMap[] {
    // Преобразуем даты из 'dd/MM/yyyy' в 'dd.MM.yyyy'
    const convertedDates = selectedDates.map(dateStr => dateStr.replace(/\//g, '.'));
  
    // Создаём Set для быстрого поиска
    const dateSet = new Set(convertedDates);
  
    // Фильтруем dataArray, оставляя только объекты с ключами, присутствующими в dateSet
    return dataArray.filter(obj => {
      const dateKey = Object.keys(obj)[0];
      return dateSet.has(dateKey);
    });
  }