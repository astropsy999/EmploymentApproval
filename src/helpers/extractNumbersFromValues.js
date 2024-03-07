export function extractNumbersFromValue(val) {
  // Используем регулярное выражение для поиска чисел внутри элементов с классом "factTime"
  const regex = /<span class="factTime"><b>([\d.]+)ч<\/b><\/span>/g;

  if (typeof val === 'number') {
    return [val];
  }

  if (typeof val !== 'string') {
    return [];
  }

  const matches = val.match(regex);

  if (!matches) {
    return []; // Если совпадений не найдено, возвращаем пустой массив
  }

  // Извлекаем числа из найденных совпадений
  const numbers = matches.map((match) => {
    const numberMatch = /<span class="factTime"><b>([\d.]+)ч<\/b><\/span>/.exec(
      match,
    );
    if (numberMatch) {
      return parseFloat(numberMatch[1]); // Преобразуем строку числа в число с плавающей запятой
    }
    return null; // Если не удается извлечь число, возвращаем null
  });

  // Фильтруем null значения и возвращаем массив чисел
  return numbers.filter((number) => number !== null);
}
