import { CalendarEvent } from "../components/types";

/**
 * @description
 * Функция добавляет события с методами в общий массив events.
 * Массив events будет содержать объекты событий с методами, которые
 * будут отображаться на календаре.
 * @param {any[]} evMethObjID - массив из объектов, каждый из которых
 *                               содержит массив событий CalendarEvent
 *                               и id объекта.
 * @param {CalendarEvent[]} events - целевой массив, в который будут
 *                                   добавляться события.
 * @returns {void}
 */
export const addMethEventToEvents = (evMethObjID: any[], events: CalendarEvent[]) => {
    evMethObjID.forEach((ev) => {
      const mergedEventMeth: any = {};
      let metStr = '';
      ev.forEach((methEv: CalendarEvent) => {
        const methEv0 = Object.values(methEv)[0];
        mergedEventMeth['employment'] = methEv0?.employment;
        mergedEventMeth['title'] = methEv0.title;
        mergedEventMeth['start'] = methEv0.start;
        mergedEventMeth['end'] = methEv0.end;
        mergedEventMeth['fullDescription'] = methEv0.fullDescription;
        mergedEventMeth['globTime'] = methEv0.globTime;
        mergedEventMeth['object'] = methEv0.object;
        mergedEventMeth['type'] = methEv0.type;
        mergedEventMeth['subTaskType'] = methEv0.subType;
        mergedEventMeth['time'] = methEv0.globTime;
        mergedEventMeth['location'] = methEv0.location;
        mergedEventMeth['employment'] = methEv0.employment;
        mergedEventMeth['isBrigadier'] = methEv0.isBrigadier;
        mergedEventMeth['brigadeList'] = methEv0.brigadeList;

        metStr += `${methEv0.meth}-${methEv0.time}, `;
      });
      events.push({ ...mergedEventMeth, methTime: metStr });
    });
  };

/**
 * @description
 * Функция добавляет 15 минут к строке времени.
 * @param {string} timeString - строка времени.
 * @returns {string} строка времени, увеличена на 15 минут.
 */
export const addHalfHour = (timeString: string) => {
    const timeParts = timeString?.split(':');
    const dateObj = new Date();
    if (timeParts) {
        dateObj.setHours(parseInt(timeParts[0]));
        dateObj.setMinutes(parseInt(timeParts[1]));
        dateObj.setSeconds(parseInt(timeParts[2]));
        dateObj.setMinutes(dateObj.getMinutes() + 15);
    }

    const newTimeString = dateObj.toLocaleTimeString('ru-RU');
    return newTimeString;
  };