export const addTitleAttrToElem = (elem: HTMLElement, title: string) => {
  elem.setAttribute('title', title);
};

/**
 * Функция добавляет атрибут и значение к элементу
 */

export const addAttrToElem = (elem: HTMLElement, attrName: string, attrValue: string) => {
  elem.setAttribute(attrName, attrValue);
}
