export function shortenNames(names) {
  // Создаем новый массив с сокращенными именами
  const shortenedNames = names?.map((Name) => {
    const splitName = Name?.trim()?.split(' ');

    const firstName = splitName[0];
    const middleName = splitName[1];
    const lastName = splitName[2];

    // Сокращаем отчество и фамилию до первой буквы
    const shortenedMiddleName = middleName?.charAt(0) + '.';
    const shortenedLastName = lastName?.charAt(0) + '.';

    // Собираем сокращенное имя
    return `${firstName} ${shortenedMiddleName}${shortenedLastName}`;
  });

  return shortenedNames;
}
