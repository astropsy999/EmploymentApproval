/**
 * Проверяет, есть ли несогласованные задачи в объекте для заданных критериев и выбранных дат.
 *
 * @param obj - Объект, в котором производится поиск.
 * @param searchString - Строка для поиска (например, 'objWrapper').
 * @param approved - Строка, указывающая на согласованные задачи (например, 'approved').
 * @param selectedDates - Массив дат в формате 'dd/MM/yyyy' для проверки.
 * @returns true, если есть несогласованные задачи на выбранные даты, иначе false.
 */
export function deepSearchObject(
  obj: { [x: string]: any },
  searchString: string,
  approved: string | undefined,
  selectedDates: string[]
): boolean {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      const dateKey = key; // Предполагается, что ключ — это дата в формате 'dd/MM/yyyy'
      if (
        obj[key]?.includes(searchString) &&
        !obj[key]?.includes(approved!) &&
        selectedDates?.includes(dateKey)
      ) {
        return true;
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (deepSearchObject(obj[key], searchString, approved, selectedDates)) {
        return true;
      }
    }
  }
  return false;
}