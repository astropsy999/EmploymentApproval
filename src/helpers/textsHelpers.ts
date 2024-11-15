/**
 * Фамилия Имя Отчество преобразует в Фамилия И.О. 
 * @param str 
 * @returns 
 */

export function initials(str: string) {
    const firstInit = str
      .split(/\s+/)
      .map((w: string, i: any) => (i ? w.substring(0, 1).toUpperCase() + '.' : w))
      .join(' ');
    const secondInit = firstInit.split(' ');
    return `${secondInit[0]} ${secondInit[1]}${secondInit[2]}`;
  }


/**
 * Преобразует строку с полными ФИО, разделёнными запятыми, в строку с инициалами.
 * @param str Строка с ФИО, разделёнными запятыми (например, "Иванов Иван Иванович, Петров Петр Петрович")
 * @returns Строка с ФИО в формате "Иванов И.И., Петров П.П."
 */
export function initialsStr(str: string): string {
  // Разбиваем строку на отдельные ФИО по запятым
  return str.split(',')
      .map(fullName => {
          // Убираем лишние пробелы в начале и конце
          const nameParts = fullName.trim().split(/\s+/);

          // Проверяем, что есть хотя бы фамилия и имя
          if (nameParts.length < 2) {
              // Если недостаточно частей, возвращаем как есть
              return fullName.trim();
          }

          const [surname, name, patronymic] = nameParts;

          // Формируем инициалы
          let initials = `${surname} ${name.charAt(0).toUpperCase()}.`;
          if (patronymic) {
              initials += `${patronymic.charAt(0).toUpperCase()}.`;
          }

          return initials;
      })
      .join(', ');
}