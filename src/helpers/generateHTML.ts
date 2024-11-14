import { checkIcon } from '../helpers/checkIcon';


// Функция для генерации HTML события без методов
export const generateEventHTML = (obj: { objID: any; dayID: any; time: any; title: any; location: any; object: any; type: any; subType: any; isApproved: any; }, onVacation: boolean) => {
    return `
      <div class="objWrapper fc-event-main fc-event" objID="${obj.objID}" dayID="${obj.dayID}">
        <span class="factTime"><b>${obj.time}ч</b></span>
        <span class="title">${obj.title}</span>
        <div class="objLocationWrapper">
          ${!onVacation ? `<div style="margin-bottom:3px"><span class="location">${obj.location}</span></div>` : ''}
          ${isObjectSelected(obj.object)}
        </div>
        <div class="eventTaskType">${obj.type}</div>
        <div class="eventTaskSubType">${obj.subType}</div>
        ${
          obj.isApproved
            ? `<span class="approved" title="${obj.isApproved}">${checkIcon}</span>`
            : ''
        }
      </div>
    `;
  };

// Функция для проверки и генерации HTML выбранного объекта
const isObjectSelected = (objectSelected: any) => {
    return objectSelected ? `<span class="eventObject">${objectSelected}</span>` : '';
  };

// Функция для генерации HTML методов
export const generateMethodsHTML = (meth: any[], methObj: { [x: string]: any; }, methZones: { [x: string]: any; }, methTime: { [x: string]: any; }) => {
    return meth
      .map((item, i) => {
        return `<span style="white-space: nowrap;">${item}-${methTime[i]}ч (об-${methObj[i]}, зон-${methZones[i]})</span><br>`;
      })
      .join('');
  };

// Функция для генерации HTML события с методами
export const generateEventWithMethodsHTML = (resultObject: { objID: any; dayID: any; globTime: any; title: any; location: any; object: any; type: any; subType: any; meth: any[]; methObj: { [x: string]: any; }; methZones: { [x: string]: any; }; time: { [x: string]: any; }; isApproved: any; }) => {
    return `
      <div class="objWrapper fc-event-main fc-event" objID="${resultObject.objID}" dayID="${resultObject.dayID}">
        <span class="factTime"><b>${resultObject.globTime}ч</b></span>
        <span class="title">${resultObject.title}</span>
        <div class="objLocationWrapper">
          <div style='margin-bottom:3px'><span class="location">${resultObject.location}</span></div>
          ${isObjectSelected(resultObject.object)}
        </div>
        <div class="eventTaskType">${resultObject.type}</div>
        <div class="eventTaskSubType">${resultObject.subType}</div>
        <div class="meths">${generateMethodsHTML(
          resultObject.meth,
          resultObject.methObj,
          resultObject.methZones,
          resultObject.time
        )}</div>
        ${
          resultObject.isApproved
            ? `<span class="approved" title="${resultObject.isApproved}">${checkIcon}</span>`
            : ''
        }
      </div>
    `;
  };