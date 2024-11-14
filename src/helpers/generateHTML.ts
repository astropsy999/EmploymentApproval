import { checkIcon } from '../helpers/checkIcon';


// Функция для генерации HTML события без методов
export const generateEventHTML = (obj: any, onVacation: boolean) => {
    return `
      <div class="objWrapper fc-event-main fc-event" objID="${obj.objID}" dayID="${obj.dayID}">
        ${obj.time !== '' ? `<span class="factTime"><b>${obj.time}ч</b></span>` : ''}
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
export const generateEventWithMethodsHTML = (resultObject: any) => {
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
            resultObject.brigadeList
              ? `<div class="brigadeList" style='width: 100%;'>[${resultObject.brigadeList}]</div>`
              : ''
          }
          ${
            resultObject.isBrigadier
              ? `<div class="isBrigadier">Бригадир: ${resultObject.isBrigadier}</div>`
              : ''
          }
        ${
          resultObject.isApproved
            ? `<span class="approved" title="${resultObject.isApproved}">${checkIcon}</span>`
            : ''
        }
      </div>
    `;
  };
