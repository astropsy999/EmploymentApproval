import { format, parseISO } from 'date-fns';

interface EmployeeData {
  "ФИО": string;
  [date: string]: string;
}

/**
 * Фильтрует массив сотрудников `selectedRows` по выбранным датам `checkedDates`.
 *
 * @param selectedRows - Массив объектов сотрудников с их данными.
 * @param checkedDates - Объект, где ключи - даты в формате ISO, а значения - булевы флаги выбора.
 * @returns Новый массив сотрудников с данными только по выбранным датам.
 */
const filterSelectedRowsByDates = (
  selectedRows: EmployeeData[],
  checkedDates: { [key: string]: boolean }
): EmployeeData[] => {
  // Шаг 1: Извлечь выбранные даты и преобразовать их в формат 'dd/MM/yyyy'
  const selectedDateKeys: string[] = Object.keys(checkedDates)
    .filter((isoDate) => checkedDates[isoDate])
    .map((isoDate) => {
      // Парсим ISO дату и форматируем в 'dd/MM/yyyy'
      const date = parseISO(isoDate);
      return format(date, 'dd/MM/yyyy');
    });

  // Шаг 2: Фильтровать каждую запись в `selectedRows`
  const filteredRows: EmployeeData[] = selectedRows.map((employee) => {
    // Создаём новый объект для каждого сотрудника
    const filteredEmployee: EmployeeData = {
      "ФИО": employee["ФИО"], // Сохраняем ФИО
    };

    // Добавляем только те даты, которые выбраны
    selectedDateKeys.forEach((dateKey) => {
      if (employee[dateKey]) {
        filteredEmployee[dateKey] = employee[dateKey];
      }
    });

    return filteredEmployee;
  });

  return filteredRows;
};

export default filterSelectedRowsByDates;
