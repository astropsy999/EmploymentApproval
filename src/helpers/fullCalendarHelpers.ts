import { CalendarEvent } from "../components/types";
import { initialsStr } from "./textsHelpers";

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
export const addMethEventToEvents = (evMethObjID: any[], events: CalendarEvent[]): void => {
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
        mergedEventMeth['methObj'] = methEv0.methObj;
        mergedEventMeth['methZones'] = methEv0.methZones;

        metStr += `<b><div class="methTitle">${methEv0.meth}</div> <i class="fa fa-arrow-right" aria-hidden="true"></i> ${methEv0.time}ч</b> 
        ${(methEv0.methObj || methEv0.methZones) && `(${methEv0.methObj && methEv0.methObj > 0 && `об-${methEv0.methObj},`} ${methEv0.methZones && methEv0.methZones > 0 && `зон-${methEv0.methZones}`})`}
        ${methEv0.isBrigadier === 'Да' ? `<i class="fa fa-user" aria-hidden="true" style="font-size: 12px; color: #1862c6"></i>` : ''} ${methEv0.brigadeList ? `<span class="brigadeList">[${initialsStr(methEv0.brigadeList)}]</span>` : ''}<br>`;
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