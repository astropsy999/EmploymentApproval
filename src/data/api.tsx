import ky from 'ky';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkIcon } from '../helpers/checkIcon';
import { customLoader } from '../helpers/customLoader';
import * as dr from '../helpers/datesRanges';
import * as e from './endpoints';
import { PreparedData } from '../helpers/getInfoOfSelectedUsers';
import { filterDataByDates } from '../helpers/filterDataByDateForLocking';
import { DateIdMap } from '../types';
import { LinkedUsersResponse } from './types';



/**
 * Получение пользователей прикрелпенных к руководителю.
 * @returns [] ФИО пользователей
 */

let currFamName: string,
  currName: string,
  currSurname: string,
  currIddb: string,
  currManagerLevel: number,
  currManagerFullName: string;
const namesIddbObj: Record<string, number> = {};
let namesDatesDayIDsObj: Record<string, DateIdMap[]> = {};
let lockedDates = {};
let approvedDates = {};
const managersLevels = {};
let usersSavedMessagesDates = {};

export const getLinkedUsers = async () => {
  let getLinkedUsersFD = new FormData();

  getLinkedUsersFD.append('Settings[DisplayModeForSideFilter]', '');
  getLinkedUsersFD.append('Settings[ParamsForSideFilter]', '');
  getLinkedUsersFD.append('Settings[TypesForSideFilter]', '');
  getLinkedUsersFD.append('Settings[TypeForSideFilterParam]', '');
  getLinkedUsersFD.append('Settings[NameAdvArea]', '');
  getLinkedUsersFD.append('Settings[Preview]', '0');
  getLinkedUsersFD.append('Settings[DefSelFirstRow]', '0');
  getLinkedUsersFD.append('Settings[Formula]', '0');
  getLinkedUsersFD.append('Settings[Table]', '0');
  getLinkedUsersFD.append('Settings[ViewMode]', '0');
  getLinkedUsersFD.append('Settings[Horizontal]', '2');
  getLinkedUsersFD.append('Settings[isTableAndForm]', '0');
  getLinkedUsersFD.append('Settings[isEditMode]', '0');
  getLinkedUsersFD.append('Settings[ManyAdd]', '0');
  getLinkedUsersFD.append('Settings[AllowAddManyObj]', '0');
  getLinkedUsersFD.append('Settings[PagingMode]', '0');
  getLinkedUsersFD.append('Settings[InterModeParalSett]', '0');
  getLinkedUsersFD.append('Settings[nameAddFormDeplTable]', '');
  getLinkedUsersFD.append('Settings[WidthTD]', '');
  getLinkedUsersFD.append('Settings[WidthTDUnit]', '0');
  getLinkedUsersFD.append('Settings[RapidCalc]', '0');
  getLinkedUsersFD.append('Settings[AddOpenForm]', '0');
  getLinkedUsersFD.append('Settings[AvatarParam]', '-1');
  getLinkedUsersFD.append('Settings[SortLegend]', '');
  getLinkedUsersFD.append('Settings[AddModalOpenTablAndForm]', '0');
  getLinkedUsersFD.append('Settings[HorizWidthTDAuto]', '0');
  getLinkedUsersFD.append('Settings[TypeMultiRowBtn]', '0');
  getLinkedUsersFD.append('Settings[MainTypeMultiRow]', '0');
  getLinkedUsersFD.append('Settings[HeightImageForTable]', '');
  getLinkedUsersFD.append('Settings[AutoHeightForRow]', '0');
  getLinkedUsersFD.append('Settings[DefDispDiagramms]', '0');
  getLinkedUsersFD.append('Settings[InterDataPath]', '');
  getLinkedUsersFD.append('Settings[InterfaceIDAdd]', '0');
  getLinkedUsersFD.append('Settings[InterfaceIDEdit]', '0');
  getLinkedUsersFD.append('Settings[InterfaceIDEditDown]', '0');
  getLinkedUsersFD.append('Settings[InterfaceIDEditSide]', '0');
  getLinkedUsersFD.append('Settings[ObjTypeIDAdd]', '0');
  getLinkedUsersFD.append('Settings[ObjTypeIDEdit]', '0');
  getLinkedUsersFD.append('Settings[DispButtEditTable]', '1');
  getLinkedUsersFD.append('Settings[DispButtMinusEditTable]', '1');
  getLinkedUsersFD.append('Settings[Report]', '0');
  getLinkedUsersFD.append('Settings[CopyObj]', '0');
  getLinkedUsersFD.append('Settings[TemplateImport]', '0');
  getLinkedUsersFD.append('Settings[Type]', '-1');
  getLinkedUsersFD.append('Settings[ButtonsPlusMinus]', '');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][ID]', ' 871');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][Name]', ' Персонал');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][IsMainType]', '-1');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][RelationType]', '1');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][Filter]', '');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][JoinParamID]', '');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][JoinType]', '1');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][SearchParam1]', '0');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][SearchParam2]', '0');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][SearchValue]', '');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][IsOpen]', '0');
  getLinkedUsersFD.append('Settings[SeveralTypes][0][AddAllMainTypeObj]', '0');
  getLinkedUsersFD.append(
    'Settings[SeveralTypes][0][MultiLineForOneDateForKK]',
    '0',
  );
  getLinkedUsersFD.append('TableID', 'm-t-807695');
  getLinkedUsersFD.append('FilterRelationType', '-1');
  getLinkedUsersFD.append('LvNeedOpen', '1');
  getLinkedUsersFD.append('ObjTypeID', '871');
  getLinkedUsersFD.append('iddb', '-1');
  getLinkedUsersFD.append('InterfaceID', '1798');
  getLinkedUsersFD.append('ParrentTabIDSideFilter', '1798');
  getLinkedUsersFD.append('GroupID', '2727');
  getLinkedUsersFD.append('UserTabID', '');
  getLinkedUsersFD.append('Criteria2', '');
  getLinkedUsersFD.append('newXP', '1');
  getLinkedUsersFD.append('columns[0][data]', '1');
  getLinkedUsersFD.append('columns[0][search][value]', '');
  getLinkedUsersFD.append('columns[0][name]', '№');
  getLinkedUsersFD.append('columns[0][Width]', '54');
  getLinkedUsersFD.append('columns[1][data]', '2');
  getLinkedUsersFD.append('columns[1][search][value]', '[]');
  getLinkedUsersFD.append('columns[1][search][Color]', '');
  getLinkedUsersFD.append('columns[1][name]', ' 5608');
  getLinkedUsersFD.append('columns[1][DisplayAllText]', '0');
  getLinkedUsersFD.append('columns[1][Width]', ' 210.765625');
  getLinkedUsersFD.append('columns[2][data]', ' 3');
  getLinkedUsersFD.append('columns[2][search][value]', ' []');
  getLinkedUsersFD.append('columns[2][search][Color]', '');
  getLinkedUsersFD.append('columns[2][name]', ' 5609');
  getLinkedUsersFD.append('columns[2][DisplayAllText]', '0');
  getLinkedUsersFD.append('columns[2][Width]', ' 135.8203125');
  getLinkedUsersFD.append('columns[3][data]', ' 4');
  getLinkedUsersFD.append('columns[3][search][value]', ' []');
  getLinkedUsersFD.append('columns[3][search][Color]', '');
  getLinkedUsersFD.append('columns[3][name]', ' 5610');
  getLinkedUsersFD.append('columns[3][DisplayAllText]', '0');
  getLinkedUsersFD.append('columns[3][Width]', ' 212.4296875');
  getLinkedUsersFD.append('columns[4][data]', ' 5');
  getLinkedUsersFD.append('columns[4][search][value]', ' []');
  getLinkedUsersFD.append('columns[4][search][Color]', '');
  getLinkedUsersFD.append('columns[4][name]', ' 8111');
  getLinkedUsersFD.append('columns[4][DisplayAllText]', '0');
  getLinkedUsersFD.append('columns[4][Width]', ' 318.484375');
  getLinkedUsersFD.append('FullText', '0');
  getLinkedUsersFD.append('kirkinator', '0');
  getLinkedUsersFD.append('horizontal', '0');
  getLinkedUsersFD.append('draw', '1');
  getLinkedUsersFD.append('order[columnIndex]', ' 5608');
  getLinkedUsersFD.append('order[Order]', '1');
  getLinkedUsersFD.append('start', '0');
  getLinkedUsersFD.append('length', ' 200');
  getLinkedUsersFD.append('search[value]', '');
  getLinkedUsersFD.append('isFirst', '1');
  getLinkedUsersFD.append('isLoadTotal', '0');
  getLinkedUsersFD.append('getOnlyTotal', '0');
  getLinkedUsersFD.append('startAssociation', '');
  getLinkedUsersFD.append('allCountAssociation', '0');

  let LinkedUsersRes = await ky
    .post(e.getUseridURL, {
      body: getLinkedUsersFD,
      credentials: 'include',
      timeout: false,
    })
    .json();

  console.log("🚀 ~ getLinkedUsers ~ LinkedUsersRes:", LinkedUsersRes)
  

  currIddb = LinkedUsersRes.data[0][2].ObjID;

  currFamName = LinkedUsersRes.data[0][2].Value;
  currName = LinkedUsersRes.data[0][3].Value;
  currSurname = LinkedUsersRes.data[0][4].Value;

  currManagerFullName = `${currFamName} ${currName.slice(
    0,
    1,
  )}.${currSurname.slice(0, 1)}.`;

  return LinkedUsersRes.data[0][5].Value.split(',');
};

export const getLinkedAllUsers = async () => {
  let getAllLinkedUsers = new FormData();

  getAllLinkedUsers.append('InterfaceID', '1798');
  getAllLinkedUsers.append('iddb', currIddb);
  getAllLinkedUsers.append('GroupID', '2727');
  getAllLinkedUsers.append('ObjTypeID', '871');
  getAllLinkedUsers.append('ParentID', '-1');
  getAllLinkedUsers.append('ModalName', '0');
  getAllLinkedUsers.append('iddbParentModal', '');
  getAllLinkedUsers.append('ImportantInterfaceID', '');
  getAllLinkedUsers.append('GlobalInterfaceID', '1798');
  getAllLinkedUsers.append('templ_mode', 'false');

  let allLinkedUsersRes = await ky
    .post(e.buildWindowForm, {
      body: getAllLinkedUsers,
      credentials: 'include',
      timeout: false,
    })
    .json();

  const linkedUsersArr =
    allLinkedUsersRes.TreeContent[0].ParamsDATA[3].LinkedObjIDs;

  return linkedUsersArr;
};

/**
 * Функция для получения всех данных пользователей и их занятости
 * @param {*} startDate начальная дата для загрузки
 * @param {*} endDate конечная дата для загрузки
 * @returns {tableDataArr, objectsArr, typesArr, divesArr, eventsDataFioObjNew, subTypesArr}
 */

export const getUsersForManagers = async (startDate: Date, endDate: Date) => {
  console.log('getUsersForManagers ЗАПУСК');
  namesDatesDayIDsObj = {};
  usersSavedMessagesDates = {};
  lockedDates = {};
  approvedDates = {};

  customLoader(true);

  const linkedUsers = await getLinkedUsers();

  const start = dr.transformDate(startDate);
  const end = dr.transformDate(endDate);

  let getUsersFD = new FormData();

  getUsersFD.append('TableID', 'm-t-800526');
  getUsersFD.append('FilterRelationType', '-1');
  getUsersFD.append('LvNeedOpen', '1');
  getUsersFD.append('ObjTypeID', '871');
  getUsersFD.append('iddb', '-1');
  getUsersFD.append('InterfaceID', '1749');
  getUsersFD.append('ParrentTabIDSideFilter', '1749');
  getUsersFD.append('GroupID', '2662');
  getUsersFD.append('UserTabID', '');
  getUsersFD.append('Criteria2', '');
  getUsersFD.append('newXP', '1');
  getUsersFD.append('columns[0][name]', '№');
  getUsersFD.append('columns[1][name]', '6183');
  getUsersFD.append('columns[2][name]', '5608');
  getUsersFD.append('columns[3][name]', '7319');
  getUsersFD.append('columns[4][name]', '5614');
  getUsersFD.append('columns[5][name]', '6122');
  getUsersFD.append('columns[6][search][value][0][sign]', '>=');
  getUsersFD.append('columns[6][search][value][0][value]', start);
  getUsersFD.append('columns[6][search][value][1][sign]', '<=');
  getUsersFD.append('columns[6][search][value][1][value]', end);
  getUsersFD.append('columns[6][name]', '7416');
  getUsersFD.append('columns[7][name]', '7459');
  getUsersFD.append('columns[8][name]', '7445');
  getUsersFD.append('columns[9][name]', '8102');
  getUsersFD.append('columns[10][name]', '8105');
  getUsersFD.append('columns[11][name]', '8568');
  getUsersFD.append('columns[12][name]', '8570');
  getUsersFD.append('columns[13][name]', '8106');
  getUsersFD.append('columns[14][name]', '8103');
  getUsersFD.append('columns[15][name]', '8104');
  getUsersFD.append('columns[16][name]', '8108');
  getUsersFD.append('columns[17][name]', '8107');
  getUsersFD.append('columns[18][name]', '8627');
  getUsersFD.append('columns[19][name]', '8651');
  getUsersFD.append('columns[20][name]', '8673');
  getUsersFD.append('columns[21][name]', '8764');
  getUsersFD.append('columns[22][name]', '8767');
  getUsersFD.append('columns[23][name]', '8766');
  getUsersFD.append('columns[24][name]', '8765');
  getUsersFD.append('columns[25][name]', '8852');
  getUsersFD.append('FullText', '1');
  getUsersFD.append('kirkinator', '0');
  getUsersFD.append('horizontal', '0');
  getUsersFD.append('draw', '1');
  getUsersFD.append('order[columnIndex]', '7416');
  getUsersFD.append('order[Order]', '1');
  getUsersFD.append('start', '1');
  getUsersFD.append('length', '10000');
  getUsersFD.append('search[value]', '');
  getUsersFD.append('isFirst', '1');
  getUsersFD.append('isLoadTotal', '0');
  getUsersFD.append('getOnlyTotal', '0');

  let UsersForManagersRes = await ky
    .post(e.getUseridURL, {
      body: getUsersFD,
      credentials: 'include',
      timeout: false,
    })
    .json();

  // customLoader(false);

  let tableDataArr: { ФИО: string; }[] = [];
  const namesArray: any[] = [];

  const res = UsersForManagersRes.data;
  const setArr = (arr: any[] | Iterable<unknown> | null | undefined) => {
    return [...new Set(arr)];
  };

  // Собираем ФИО, iDDb, dayIDs, isBlocked
  res.map((item: { ObjID: any; }[]) => {
    const name = item[2].Value;
    const date = item[7].Value;
    const id = item[7].ObjID;
    const isBlocked = item[33].Value;
    const isManager = item[37].Value;
    const managerLevel = item[38].Value;
    const savedMessage = item[35].Value;
    const savedMessageDate = item[36].Value;
    const isApproved = item[34].Value;

    namesArray.push(name);
    namesIddbObj[name] = item[2].ObjID;

    if (!namesDatesDayIDsObj[name]) {
      namesDatesDayIDsObj[name] = [];
    }

    if (!lockedDates[name]) {
      lockedDates[name] = [];
    }
    if (!approvedDates[name]) {
      approvedDates[name] = [];
    }

    if (savedMessage != '' && savedMessageDate != '') {
      if (!usersSavedMessagesDates[name]) {
        usersSavedMessagesDates[name] = [];
      }
      usersSavedMessagesDates[name] = { [savedMessage]: savedMessageDate };
    }
    if (isManager) {
      managersLevels[name] = managerLevel;
    }

    // Проверяем, есть ли уже объект с такой датой
    const hasBlockedDate = lockedDates[name].find((entry: { hasOwnProperty: (arg0: any) => any; }) =>
      entry.hasOwnProperty(date),
    );
    const hasApprovedDate = approvedDates[name].find((entry: { hasOwnProperty: (arg0: any) => any; }) =>
      entry.hasOwnProperty(date),
    );

    if (isBlocked && isBlocked != '' && !hasBlockedDate) {
      lockedDates[name].push({ [date]: isBlocked });
    }

    if (isApproved && isApproved != '' && !hasApprovedDate) {
      approvedDates[name].push({ [date]: isApproved });
    }

    // Проверяем, есть ли уже объект с такой датой
    const existingEntry = namesDatesDayIDsObj[name].find((entry: { hasOwnProperty: (arg0: any) => any; }) =>
      entry.hasOwnProperty(date),
    );

    // Если такого объекта нет, добавляем новый
    if (!existingEntry) {
      namesDatesDayIDsObj[name].push({ [date]: id });
    }
  });

  currManagerLevel = Number(managersLevels[currManagerFullName]);

  // Уникализируем ФИО
  const namesArr = setArr(namesArray);

  let dateObj = {};
  let objectsArray: Iterable<any> | null | undefined = [];
  let typesArray: Iterable<any> | null | undefined = [];
  let divsArray: Iterable<any> | null | undefined = [];
  let taskSubtypeArr: Iterable<any> | null | undefined = [];
  let eventsDataFioObj = {};

  // На основе собранных уникальных ФИО выгребаем данные для каждого человека на каждую дату и собираем для отрисовки в таблице
  namesArr.map((name) => {
    const nameArray = res.filter((item: { Value: unknown; }[]) => item[2].Value === name);
    let division;
    let position;
    let redDivision;

    let total = 0;

    nameArray.map((nameA: { Value: any; }[]) => {
      const date = nameA[7].Value;
      const object = nameA[13].Value;
      const time = nameA[17].Value;
      const type = nameA[14].Value;
      const location = nameA[23].Value;
      const meth = nameA[24].Value;
      const timeOnObj = nameA[25].Value;
      const title = nameA[12].Value;
      const start = nameA[21].Value;
      const end = nameA[22].Value;
      const taskSubtype = nameA[15].Value;
      const fullDescription = nameA[16].Value;
      const director = nameA[18].Value;
      const source = nameA[18].Value;
      const notes = nameA[20].Value;
      const employment = nameA[30].Value;
      const subTaskTypeNew = nameA[31].Value;
      const taskTypeNew = nameA[29].Value;
      const objID = nameA[10].ObjID;
      const methObj = nameA[26].Value;
      const methZones = nameA[27].Value;

      const isApproved = nameA[34].Value;
      const isBlocked = nameA[33].Value;
      const dayID = nameA[7].ObjID;

      const toFullcalFormat = (erpdate: string) => {
        //01.06.2018 11','30 => 2018-06-01T11','30','00
        // Разбиваем строку даты на отдельные части
        const parts = erpdate.split(' ');
        const date = parts[0];
        const time = parts[1];

        // Разбиваем дату на отдельные компоненты
        const dateParts = date.split('.');
        const day = dateParts[0].padStart(2, '0');
        const month = dateParts[1].padStart(2, '0');
        const year = dateParts[2];

        // Собираем дату и время в нужном формате
        const fullCalDate = `${year}-${month}-${day}T${time}:00`;

        return fullCalDate;
      };

      let startDateTime;
      let endDateTime;

      if (start && end) {
        startDateTime = toFullcalFormat(start);
        endDateTime = toFullcalFormat(end);
      }

      division = nameA[5].Value;
      position = nameA[32].Value;

      // Объект
      if (object && object != '') {
        objectsArray.push(object);
      }

      //Вид работ
      if (taskTypeNew && taskTypeNew != '') {
        typesArray.push(taskTypeNew);
      }

      // Подвид работ
      if (subTaskTypeNew && subTaskTypeNew != '') {
        taskSubtypeArr.push(subTaskTypeNew);
      }

      // Подразделение
      if (division && division != '') {
        divsArray.push(division);
      }

      if (!dateObj[date]) {
        dateObj[date] = [];
      }

      if (
        employment &&
        (employment === 'Отпуск' ||
          employment === 'Больничный' ||
          employment === 'Выходной')
      ) {
        dateObj[date].push({
          title,
          start: startDateTime,
          end: endDateTime,
          object: employment,
          type: taskTypeNew,
          time,
          subType: subTaskTypeNew,
          fullDescription,
          employment,
          objID,
          location,
          methObj,
          methZones,
          isApproved,
          isBlocked,
          dayID,
          position,
        });
        total += Number(time);
      } else if (
        timeOnObj != '' &&
        employment &&
        (employment !== 'Отпуск' ||
          employment !== 'Больничный' ||
          employment !== 'Выходной')
      ) {
        dateObj[date].push({
          title,
          object,
          start: startDateTime,
          end: endDateTime,
          type: taskTypeNew,
          time: timeOnObj,
          globTime: time,
          subType: subTaskTypeNew,
          fullDescription,
          employment,
          objID,
          meth,
          location,
          methObj,
          methZones,
          isApproved,
          isBlocked,
          dayID,
          position,
        });
        total += Number(timeOnObj);
      } else if (
        employment &&
        (employment !== 'Отпуск' ||
          employment !== 'Больничный' ||
          employment !== 'Выходной')
      ) {
        dateObj[date].push({
          title,
          start: startDateTime,
          end: endDateTime,
          object,
          type: taskTypeNew,
          time,
          subType: subTaskTypeNew,
          fullDescription,
          employment,
          objID,
          location,
          methObj,
          methZones,
          isApproved,
          isBlocked,
          dayID,
          position,
        });
        total += Number(time);
      }
    });

    // [{},{},{}] => ''
    const transformMethArr = (methArr: any[]) => {
      let finData = `<div class="methsWrapper">`;
      let totalDayTime = 0;
      let globTime;
      let isVacation = false;
      const isObjecSelected = (objectSelected: any) => {
        if (objectSelected) {
          return `<span class="eventObject">${objectSelected}</span>`;
        } else {
          return '';
        }
      };
      let currObjIDArr: { [x: number]: any; }[] = [];
      let fullEventsWithMets = {};
      let objStrMeth = '';
      methArr.map((obj: { title: string; meth: any; objID: any; dayID: any; time: any; location: any; object: any; type: any; subType: any; isApproved: any; globTime: any; employment: string; }) => {
        const onVacation =
          obj.title === 'Отпуск' ||
          obj.title === 'Больничный' ||
          obj.title === 'Выходной';
        if (!obj.meth) {
          objStrMeth = `<div class="objWrapper fc-event-main fc-event" objID="${
            obj.objID
          }" dayID="${obj.dayID}">
              <span class="factTime"><b>${obj.time}ч</b></span>
              <span class="title">${obj.title}</span>
              <div class="objLocationWrapper">${
                !onVacation
                  ? `<div style="margin-bottom:3px">
                    <span class="location">${obj.location}</span>
                  </div>`
                  : ''
              } ${isObjecSelected(obj.object)}</div>
              <div class="eventTaskType">${obj.type}</div>
              <div class="eventTaskSubType">${obj.subType}</div>
               ${
                 obj.isApproved
                   ? `<span class="approved" title="${obj.isApproved}">${checkIcon}</span>`
                   : ''
               }
             </div>`;
        } else {
          currObjIDArr.push({ [obj.objID]: obj });
        }

        totalDayTime += Number(obj.time);
        globTime = Number(obj.globTime);
        if (
          obj.employment &&
          (obj.employment === 'Отпуск' ||
            obj.employment === 'Больничный' ||
            obj.employment === 'Выходной')
        ) {
          isVacation = true;
        }

        if (currObjIDArr.length === 0) {
          finData += objStrMeth;
        }
      });

      if (currObjIDArr.length !== 0) {
        let objStrWithMeths = '';

        const generateEventsWithMethods = (arr: any[]) => {
          const methodDataMap = {};

          arr.forEach((item: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }) => {
            for (const method in item) {
              if (item.hasOwnProperty(method)) {
                if (!methodDataMap[method]) {
                  methodDataMap[method] = [];
                }
                methodDataMap[method].push(item[method]);
              }
            }
          });

          for (let methodEv in methodDataMap) {
            if (methodDataMap.hasOwnProperty(methodEv)) {
              const resultObject = methodDataMap[methodEv].reduce(
                (acc: { [x: string]: any; meth: any[]; methObj: any[]; methZones: any[]; time: any[]; hasOwnProperty: (arg0: string) => any; }, obj: { [x: string]: any; meth: any; methObj: any; methZones: any; time: any; }) => {
                  const { meth, methObj, methZones, time, ...rest } = obj;

                  if (!acc.meth) {
                    acc.meth = [meth];
                    acc.methObj = [methObj];
                    acc.methZones = [methZones];
                    acc.time = [time];
                  } else {
                    acc.meth.push(meth);
                    acc.methObj.push(methObj);
                    acc.methZones.push(methZones);
                    acc.time.push(time);
                  }

                  for (const key in rest) {
                    if (acc.hasOwnProperty(key)) {
                      if (acc[key] !== rest[key]) {
                        throw new Error(`Inconsistent values for key ${key}`);
                      }
                    } else {
                      acc[key] = rest[key];
                    }
                  }

                  return acc;
                },
                {},
              );

              const methodsView = (meth: any[], methObj: { [x: string]: any; }, methZones: { [x: string]: any; }, methTime: { [x: string]: any; }) => {
                let metViewObj = ''; // ВО-1ч(об-1,зон-3)

                meth.map((item: any, i: string | number) => {
                  const methName = item;
                  const time = methTime[i];
                  const obj = methObj[i];
                  const zones = methZones[i];

                  metViewObj += `<span style="white-space: nowrap;">${methName}-${time}ч (об-${obj}, зон-${zones})</span><br>`;
                });

                return metViewObj;
              };

              objStrWithMeths = `<div class="objWrapper fc-event-main fc-event" objID="${
                resultObject.objID
              }" dayID="${resultObject.dayID}">
                <span class="factTime"><b>${resultObject.globTime}ч</b></span>
                <span class="title">${resultObject.title}</span>
                <div class="objLocationWrapper"><div style='margin-bottom:3px'><span class="location">${
                  resultObject.location
                }</span></div> ${isObjecSelected(resultObject.object)}</div>
              <div class="eventTaskType">${resultObject.type}</div>
              <div class="eventTaskSubType">${resultObject.subType}</div>
              <div class="meths">${methodsView(
                resultObject.meth,
                resultObject.methObj,
                resultObject.methZones,
                resultObject.time,
              )}</div>
              ${
                resultObject.isApproved
                  ? `<span class="approved" title="${resultObject.isApproved}">${checkIcon}</span>`
                  : ''
              }
              </div>`;
            }
            finData += objStrWithMeths;
          }
        };
        generateEventsWithMethods(currObjIDArr);
        if (!finData.includes(objStrMeth)) {
          finData += objStrMeth;
        }
      }

      return finData;
    };

    const transformArrToDataObj = (arrobj: { [x: string]: any; }) => {
      let dayStrObj = {};
      // {data','[{},{},{}]} => {data','''}
      for (let key in arrobj) {
        dayStrObj = {
          ...dayStrObj,
          [key.replaceAll('.', '/')]: transformMethArr(arrobj[key]),
        };
      }

      return dayStrObj;
    };
    dateObj;

    function isUserForbidden(username: unknown) {
      // Проверяем, существует ли пользователь в объекте
      if (managersLevels.hasOwnProperty(username)) {
        // Получаем уровень доступа для данного пользователя
        const userLevel = Number(managersLevels[username]);

        // Проверяем, больше или равно ли уровень доступа текущему уровню
        if (!isNaN(userLevel) && userLevel <= currManagerLevel) {
          return true;
        }
      }
    }

    // if (total !== 0) {

    if (name === currManagerFullName && currManagerLevel === 1) {
      tableDataArr.push({
        ФИО: `${name} <br><div class="typeWrapper divWrapper">[${position}] ${division}</div>`,
        ...transformArrToDataObj(dateObj),
      });
    }
    if (!isUserForbidden(name)) {
      tableDataArr.push({
        ФИО: `${name} <br><div class="typeWrapper divWrapper">[${position}] ${division}</div>`,
        ...transformArrToDataObj(dateObj),
      });
    }
    // }

    eventsDataFioObj[name] = dateObj;

    dateObj = {};
    total = 0;
  });

  let objectsArr = [...new Set(objectsArray)];
  let typesArr = [...new Set(typesArray)];
  let divesArr = [...new Set(divsArray)];
  let subTypesArr = [...new Set(taskSubtypeArr)];

  // Фильтруем результирующий объект и массив с пользователями в соответствии с выбранными руководителем пользователями

  function filterObjectAndArrayByNames(namesArray: any[], dataObject: { [x: string]: any; hasOwnProperty?: any; }, dataArray: any[]) {
    const filteredObject = {};
    const filteredArray: any[] = [];

    namesArray.forEach((fullName: string) => {
      const trimmedFullName = fullName.trim();
      const nameParts = trimmedFullName.split(' ');

      if (nameParts.length >= 3) {
        // Проверяем, что есть фамилия, имя и два инициала
        const lastName = nameParts[0];
        const initials = `${nameParts[1][0]}.${nameParts[2][0]}.`; // Формируем инициалы

        const key = `${lastName} ${initials}`;

        if (dataObject.hasOwnProperty(key)) {
          filteredObject[key] = dataObject[key];
        }

        filteredArray.push(
          dataArray.filter((str: { [x: string]: string | string[]; }) => str['ФИО'].includes(key))[0],
        );
      }
    });

    return { filteredObject, filteredArray };
  }

  const eventsDataFioObjAll = eventsDataFioObj;

  const { linkedUsersData, filteredArray } = filterObjectAndArrayByNames(
    linkedUsers,
    eventsDataFioObj,
    tableDataArr,
  );

  // const eventsDataFioObjLinked = linkedUsersData;
  const eventsDataFioObjLinked = eventsDataFioObj;
  // tableDataArr = filteredArray;

  return [
    tableDataArr,
    objectsArr,
    typesArr,
    divesArr,
    eventsDataFioObjLinked,
    subTypesArr,
    eventsDataFioObjAll,
    namesIddbObj,
    namesDatesDayIDsObj,
    lockedDates,
    usersSavedMessagesDates,
  ];
};

export const getInitialTypeSubtypesData = async () => {
  let formDatatypeSubtype = new FormData();

  formDatatypeSubtype.append('Settings[DisplayModeForSideFilter]', '0');
  formDatatypeSubtype.append('Settings[ParamsForSideFilter]', '');
  formDatatypeSubtype.append('Settings[TypesForSideFilter]', '');
  formDatatypeSubtype.append('Settings[TypeForSideFilterParam]', '');
  formDatatypeSubtype.append('Settings[NameAdvArea]', '');
  formDatatypeSubtype.append('Settings[Preview]', '0');
  formDatatypeSubtype.append('Settings[DefSelFirstRow]', '0');
  formDatatypeSubtype.append('Settings[Formula]', '0');
  formDatatypeSubtype.append('Settings[Table]', '0');
  formDatatypeSubtype.append('Settings[ViewMode]', '0');
  formDatatypeSubtype.append('Settings[Horizontal]', '2');
  formDatatypeSubtype.append('Settings[isTableAndForm]', '0');
  formDatatypeSubtype.append('Settings[isEditMode]', '0');
  formDatatypeSubtype.append('Settings[ManyAdd]', '0');
  formDatatypeSubtype.append('Settings[AllowAddManyObj]', '0');
  formDatatypeSubtype.append('Settings[PagingMode]', '0');
  formDatatypeSubtype.append('Settings[InterModeParalSett]', '0');
  formDatatypeSubtype.append('Settings[nameAddFormDeplTable]', '');
  formDatatypeSubtype.append('Settings[WidthTD]', '');
  formDatatypeSubtype.append('Settings[WidthTDUnit]', '0');
  formDatatypeSubtype.append('Settings[RapidCalc]', '0');
  formDatatypeSubtype.append('Settings[AddOpenForm]', '0');
  formDatatypeSubtype.append('Settings[AvatarParam]', '-1');
  formDatatypeSubtype.append('Settings[SortLegend]', '');
  formDatatypeSubtype.append('Settings[AddModalOpenTablAndForm]', '0');
  formDatatypeSubtype.append('Settings[HorizWidthTDAuto]', '0');
  formDatatypeSubtype.append('Settings[TypeMultiRowBtn]', '0');
  formDatatypeSubtype.append('Settings[MainTypeMultiRow]', '0');
  formDatatypeSubtype.append('Settings[HeightImageForTable]', '');
  formDatatypeSubtype.append('Settings[AutoHeightForRow]', '0');
  formDatatypeSubtype.append('Settings[DefDispDiagramms]', '0');
  formDatatypeSubtype.append('Settings[InterDataPath]', '');
  formDatatypeSubtype.append('Settings[InterfaceIDAdd]', '0');
  formDatatypeSubtype.append('Settings[InterfaceIDEdit]', '0');
  formDatatypeSubtype.append('Settings[InterfaceIDEditDown]', '0');
  formDatatypeSubtype.append('Settings[InterfaceIDEditSide]', '0');
  formDatatypeSubtype.append('Settings[ObjTypeIDAdd]', '0');
  formDatatypeSubtype.append('Settings[ObjTypeIDEdit]', '0');
  formDatatypeSubtype.append('Settings[DispButtEditTable]', '1');
  formDatatypeSubtype.append('Settings[DispButtMinusEditTable]', '1');
  formDatatypeSubtype.append('Settings[Report]', '0');
  formDatatypeSubtype.append('Settings[CopyObj]', '0');
  formDatatypeSubtype.append('Settings[TemplateImport]', '0');
  formDatatypeSubtype.append('Settings[Type]', '-1');
  formDatatypeSubtype.append('Settings[ButtonsPlusMinus]', '');
  formDatatypeSubtype.append('Settings[SeveralTypes][0][ID]', '1173');
  formDatatypeSubtype.append(
    'Settings[SeveralTypes][0][Name]',
    '(Справочник) Вид работ',
  );
  formDatatypeSubtype.append('Settings[SeveralTypes][0][IsMainType]', '-1');
  formDatatypeSubtype.append('Settings[SeveralTypes][0][RelationType]', '1');
  formDatatypeSubtype.append('Settings[SeveralTypes][0][Filter]', '');
  formDatatypeSubtype.append('Settings[SeveralTypes][0][JoinParamID]', '');
  formDatatypeSubtype.append('Settings[SeveralTypes][0][JoinType]', '1');
  formDatatypeSubtype.append('Settings[SeveralTypes][0][SearchParam1]', '0');
  formDatatypeSubtype.append('Settings[SeveralTypes][0][SearchParam2]', '0');
  formDatatypeSubtype.append('Settings[SeveralTypes][0][SearchValue]', '');
  formDatatypeSubtype.append('Settings[SeveralTypes][0][IsOpen]', '0');
  formDatatypeSubtype.append(
    'Settings[SeveralTypes][0][AddAllMainTypeObj]',
    '0',
  );
  formDatatypeSubtype.append(
    'Settings[SeveralTypes][0][MultiLineForOneDateForKK]',
    '0',
  );
  formDatatypeSubtype.append('Settings[SeveralTypes][1][ID]', '1174');
  formDatatypeSubtype.append(
    'Settings[SeveralTypes][1][Name]',
    '(Справочник) Подвид работ',
  );
  formDatatypeSubtype.append('Settings[SeveralTypes][1][IsMainType]', '1173');
  formDatatypeSubtype.append('Settings[SeveralTypes][1][RelationType]', '1');
  formDatatypeSubtype.append('Settings[SeveralTypes][1][Filter]', '');
  formDatatypeSubtype.append('Settings[SeveralTypes][1][JoinParamID]', '');
  formDatatypeSubtype.append('Settings[SeveralTypes][1][JoinType]', '1');
  formDatatypeSubtype.append('Settings[SeveralTypes][1][SearchParam1]', '0');
  formDatatypeSubtype.append('Settings[SeveralTypes][1][SearchParam2]', '0');
  formDatatypeSubtype.append('Settings[SeveralTypes][1][SearchValue]', '');
  formDatatypeSubtype.append('Settings[SeveralTypes][1][IsOpen]', '0');
  formDatatypeSubtype.append(
    'Settings[SeveralTypes][1][AddAllMainTypeObj]',
    '0',
  );
  formDatatypeSubtype.append(
    'Settings[SeveralTypes][1][MultiLineForOneDateForKK]',
    '0',
  );
  formDatatypeSubtype.append('TableID', 'm-t-961218');
  formDatatypeSubtype.append('FilterRelationType', '-1');
  formDatatypeSubtype.append('LvNeedOpen', '1');
  formDatatypeSubtype.append('ObjTypeID', '1173');
  formDatatypeSubtype.append('iddb', '-1');
  formDatatypeSubtype.append('InterfaceID', '1765');
  formDatatypeSubtype.append('ParrentTabIDSideFilter', '1765');
  formDatatypeSubtype.append('GroupID', '2682');
  formDatatypeSubtype.append('UserTabID', '');
  formDatatypeSubtype.append('Criteria2', '');
  formDatatypeSubtype.append('newXP', '1');
  formDatatypeSubtype.append('columns[0][data]', '1');
  formDatatypeSubtype.append('columns[0][search][value]', '');
  formDatatypeSubtype.append('columns[0][name]', '№');
  formDatatypeSubtype.append('columns[0][Width]', '54');
  formDatatypeSubtype.append('columns[1][data]', '2');
  formDatatypeSubtype.append('columns[1][search][value]', '[]');
  formDatatypeSubtype.append('columns[1][search][Color]', '');
  formDatatypeSubtype.append('columns[1][name]', '9045');
  formDatatypeSubtype.append('columns[1][DisplayAllText]', '0');
  formDatatypeSubtype.append('columns[1][Width]', '113.640625');
  formDatatypeSubtype.append('columns[2][data]', '3');
  formDatatypeSubtype.append('columns[2][search][value]', '[]');
  formDatatypeSubtype.append('columns[2][search][Color]', '');
  formDatatypeSubtype.append('columns[2][name]', '9048');
  formDatatypeSubtype.append('columns[2][DisplayAllText]', '0');
  formDatatypeSubtype.append('columns[2][Width]', '220.4453125');
  formDatatypeSubtype.append('columns[3][data]', '4');
  formDatatypeSubtype.append('columns[3][search][value]', '[]');
  formDatatypeSubtype.append('columns[3][search][Color]', '');
  formDatatypeSubtype.append('columns[3][name]', '9047');
  formDatatypeSubtype.append('columns[3][DisplayAllText]', '0');
  formDatatypeSubtype.append('columns[3][Width]', '127.75');
  formDatatypeSubtype.append('columns[4][data]', '5');
  formDatatypeSubtype.append('columns[4][search][value]', '[]');
  formDatatypeSubtype.append('columns[4][search][Color]', '');
  formDatatypeSubtype.append('columns[4][name]', '9046');
  formDatatypeSubtype.append('columns[4][DisplayAllText]', '0');
  formDatatypeSubtype.append('columns[4][Width]', '140.4375');
  formDatatypeSubtype.append('columns[5][data]', '6');
  formDatatypeSubtype.append('columns[5][search][value]', '[]');
  formDatatypeSubtype.append('columns[5][search][Color]', '');
  formDatatypeSubtype.append('columns[5][name]', '9050');
  formDatatypeSubtype.append('columns[5][DisplayAllText]', '0');
  formDatatypeSubtype.append('columns[5][Width]', '220.4453125');
  formDatatypeSubtype.append('columns[6][data]', '7');
  formDatatypeSubtype.append('columns[6][search][value]', '[]');
  formDatatypeSubtype.append('columns[6][search][Color]', '');
  formDatatypeSubtype.append('columns[6][name]', '9049');
  formDatatypeSubtype.append('columns[6][DisplayAllText]', '0');
  formDatatypeSubtype.append('columns[6][Width]', '127.78125');
  formDatatypeSubtype.append('FullText', '0');
  formDatatypeSubtype.append('kirkinator', '0');
  formDatatypeSubtype.append('horizontal', '0');
  formDatatypeSubtype.append('draw', '1');
  formDatatypeSubtype.append('order[columnIndex]', '9045');
  formDatatypeSubtype.append('order[Order]', '1');
  formDatatypeSubtype.append('start', '0');
  formDatatypeSubtype.append('length', '200');
  formDatatypeSubtype.append('search[value]', '');
  formDatatypeSubtype.append('isFirst', '1');
  formDatatypeSubtype.append('isLoadTotal', '0');
  formDatatypeSubtype.append('getOnlyTotal', '0');
  formDatatypeSubtype.append('startAssociation', '');
  formDatatypeSubtype.append('allCountAssociation', '0');

  let typesSubtypesRes = await ky
    .post(e.getUseridURL, {
      body: formDatatypeSubtype,
      credentials: 'include',
      timeout: false,
    })
    .json();

  const typeSubtypesData = typesSubtypesRes.data;
  let typesSubtypesBase = {};

  typeSubtypesData.map((tsbt: { Value: any; }[]) => {
    const type = tsbt[2].Value;
    const subType = tsbt[5].Value;

    if (!typesSubtypesBase[type]) {
      typesSubtypesBase[type] = [];
    }

    typesSubtypesBase[type].push(subType);
  });

  return typesSubtypesBase;
};

export const getDataForLinkedUsersFilter = async () => {
  let formDaLinkedUsersFilter = new FormData();

  formDaLinkedUsersFilter.append('TableID', 'm-t-977101');
  formDaLinkedUsersFilter.append('FilterRelationType', '-1');
  formDaLinkedUsersFilter.append('LvNeedOpen', '1');
  formDaLinkedUsersFilter.append('ObjTypeID', '871');
  formDaLinkedUsersFilter.append('iddb', '-1');
  formDaLinkedUsersFilter.append('InterfaceID', '1756');
  formDaLinkedUsersFilter.append('ParrentTabIDSideFilter', '1756');
  formDaLinkedUsersFilter.append('GroupID', '2670');
  formDaLinkedUsersFilter.append('UserTabID', '');
  formDaLinkedUsersFilter.append('Criteria2', '');
  formDaLinkedUsersFilter.append('newXP', '1');
  formDaLinkedUsersFilter.append('columns[0][data]', '1');
  formDaLinkedUsersFilter.append('columns[0][search][value]', '');
  formDaLinkedUsersFilter.append('columns[0][name]', '№');
  formDaLinkedUsersFilter.append('columns[0][Width]', '54');
  formDaLinkedUsersFilter.append('columns[1][data]', '2');
  formDaLinkedUsersFilter.append('columns[1][search][value]', '[]');
  formDaLinkedUsersFilter.append('columns[1][search][Color]', '');
  formDaLinkedUsersFilter.append('columns[1][name]', '5608');
  formDaLinkedUsersFilter.append('columns[1][DisplayAllText]', '0');
  formDaLinkedUsersFilter.append('columns[1][Width]', '121.4921875');
  formDaLinkedUsersFilter.append('columns[2][data]', '3');
  formDaLinkedUsersFilter.append('columns[2][search][value]', '[]');
  formDaLinkedUsersFilter.append('columns[2][search][Color]', '');
  formDaLinkedUsersFilter.append('columns[2][name]', '5609');
  formDaLinkedUsersFilter.append('columns[2][DisplayAllText]', '0');
  formDaLinkedUsersFilter.append('columns[2][Width]', '78.90625');
  formDaLinkedUsersFilter.append('columns[3][data]', '4');
  formDaLinkedUsersFilter.append('columns[3][search][value]', '[]');
  formDaLinkedUsersFilter.append('columns[3][search][Color]', '');
  formDaLinkedUsersFilter.append('columns[3][name]', '5610');
  formDaLinkedUsersFilter.append('columns[3][DisplayAllText]', '0');
  formDaLinkedUsersFilter.append('columns[3][Width]', '122.4375');
  formDaLinkedUsersFilter.append('columns[4][data]', '5');
  formDaLinkedUsersFilter.append('columns[4][search][value]', '[]');
  formDaLinkedUsersFilter.append('columns[4][search][Color]', '');
  formDaLinkedUsersFilter.append('columns[4][name]', '5614');
  formDaLinkedUsersFilter.append('columns[4][DisplayAllText]', '0');
  formDaLinkedUsersFilter.append('columns[4][Width]', '175.5078125');
  formDaLinkedUsersFilter.append('columns[5][data]', '6');
  formDaLinkedUsersFilter.append('columns[5][search][value]', '[]');
  formDaLinkedUsersFilter.append('columns[5][search][Color]', '');
  formDaLinkedUsersFilter.append('columns[5][name]', '5611');
  formDaLinkedUsersFilter.append('columns[5][DisplayAllText]', '0');
  formDaLinkedUsersFilter.append('columns[5][Width]', '139.8203125');
  formDaLinkedUsersFilter.append('columns[6][data]', '7');
  formDaLinkedUsersFilter.append('columns[6][search][value]', '[]');
  formDaLinkedUsersFilter.append('columns[6][search][Color]', '');
  formDaLinkedUsersFilter.append('columns[6][name]', '6114');
  formDaLinkedUsersFilter.append('columns[6][DisplayAllText]', '0');
  formDaLinkedUsersFilter.append('columns[6][Width]', '285.3359375');
  formDaLinkedUsersFilter.append('FullText', '0');
  formDaLinkedUsersFilter.append('kirkinator', '0');
  formDaLinkedUsersFilter.append('horizontal', '0');
  formDaLinkedUsersFilter.append('draw', '1');
  formDaLinkedUsersFilter.append('order[columnIndex]', '5608');
  formDaLinkedUsersFilter.append('order[Order]', '1');
  formDaLinkedUsersFilter.append('start', '0');
  formDaLinkedUsersFilter.append('length', '300');
  formDaLinkedUsersFilter.append('search[value]', '');
  formDaLinkedUsersFilter.append('isFirst', '1');
  formDaLinkedUsersFilter.append('isLoadTotal', '0');
  formDaLinkedUsersFilter.append('getOnlyTotal', '0');
  formDaLinkedUsersFilter.append('startAssociation', '');
  formDaLinkedUsersFilter.append('allCountAssociation', '0');

  let dataLinkedUserFilter = await ky
    .post(e.getUseridURL, {
      body: formDaLinkedUsersFilter,
      credentials: 'include',
      timeout: false,
    })
    .json();

  const dataLinkedUserFilterView: string[] = [];

  dataLinkedUserFilter.data.forEach((user: { Value: any; }[]) => {
    const surName = user[2].Value;
    const initials = `${user[3].Value.slice(0, 1)}.${user[4].Value.slice(
      0,
      1,
    )}.`;

    const occupation = user[6].Value;
    const dep = user[7].Value;
    dataLinkedUserFilterView.push(
      `${surName} ${initials}-${occupation}-${dep}`,
    );
  });

  return dataLinkedUserFilterView;
};

/**
 * Функция для сохранения/удаления прикрепленных к руководителю сотрудников
 */

export const linkUnlinkUser = async (filteredUsers: any) => {
  function generateIdString(namesArray: any[], namesIddbObj: { [x: string]: any; }) {
    // Создаем массив ID на основе фамилий
    const idArray = namesArray.map((name: string | number) => namesIddbObj[name] || '');

    // Фильтруем массив ID, убирая пустые значения
    const filteredIdArray = idArray.filter((id: string) => id !== '');

    // Создаем строку, перечисляя ID через пробел
    const idString = filteredIdArray.join('\n');

    return idString;
  }

  const filteredString = generateIdString(filteredUsers, namesIddbObj);

  try {
    let linkUnlinkUserFD = new FormData();

    linkUnlinkUserFD.append('ID', currIddb);
    linkUnlinkUserFD.append('TypeID', '871');
    linkUnlinkUserFD.append('Data[0][name]', '5608');
    linkUnlinkUserFD.append('Data[0][value]', currFamName);
    linkUnlinkUserFD.append('Data[0][isName]', 'true');
    linkUnlinkUserFD.append('Data[0][maninp]', 'false');
    linkUnlinkUserFD.append('Data[0][GroupID]', '2727');
    linkUnlinkUserFD.append('Data[1][name]', '5609');
    linkUnlinkUserFD.append('Data[1][value]', currName);
    linkUnlinkUserFD.append('Data[1][isName]', 'true');
    linkUnlinkUserFD.append('Data[1][maninp]', 'false');
    linkUnlinkUserFD.append('Data[1][GroupID]', '2727');
    linkUnlinkUserFD.append('Data[2][name]', '5610');
    linkUnlinkUserFD.append('Data[2][value]', currSurname);
    linkUnlinkUserFD.append('Data[2][isName]', 'true');
    linkUnlinkUserFD.append('Data[2][maninp]', 'false');
    linkUnlinkUserFD.append('Data[2][GroupID]', '2727');
    linkUnlinkUserFD.append('Data[3][name]', 'tE8111');
    linkUnlinkUserFD.append('Data[3][value]', filteredString);
    linkUnlinkUserFD.append('Data[3][isName]', 'false');
    linkUnlinkUserFD.append('Data[3][maninp]', 'false');
    linkUnlinkUserFD.append('Data[3][GroupID]', '2727');
    linkUnlinkUserFD.append('ParentObjID', '-1');
    linkUnlinkUserFD.append('CalcParamID', '-1');
    linkUnlinkUserFD.append('InterfaceID', '1798');
    linkUnlinkUserFD.append('ImportantInterfaceID', '');
    linkUnlinkUserFD.append('templ_mode', 'false');
    linkUnlinkUserFD.append('Ignor39', '0');

    let LinkedUnlinkedUsersRes = await ky
      .post(e.addValueObjectURL, {
        body: linkUnlinkUserFD,
        credentials: 'include',
        timeout: false,
      })
      .json();
    if (LinkedUnlinkedUsersRes.result != -100) {
      toast.success(`Успешно!`, {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 500,
        theme: 'colored',
      });
    } else {
      toast.error('Произошла ошибка', {
        position: toast.POSITION.TOP_LEFT, // Местоположение сообщения
        autoClose: 2000,
        theme: 'colored',
      });
    }
  } catch (error) {
    console.error('Во время добавления сотрудника произошла ошибка', error);
    toast.error('Во время добавления сотрудника произошла ошибка', {
      position: toast.POSITION.TOP_RIGHT, // Местоположение сообщения
      autoClose: 2000,
      theme: 'colored',
    });
  }
};

/**
 * Функция для массового согласования занятости сотрудников
 */

export const multiApproveEmployment = async (delIDiDDbArr: any[]) => {
  const managerName = Object.keys(namesIddbObj).find(
    (key) => namesIddbObj[key] === currIddb,
  );

  try {
    const requests = delIDiDDbArr.map(async (user: { [s: string]: unknown; } | ArrayLike<unknown>) => {
      const userIDDb = namesIddbObj[Object.keys(user)[0]];
      const userEmplValues = Object.values(user)[0].join(';');

      let formDataMultiApprove = new FormData();

      formDataMultiApprove.append('ID', userEmplValues);
      formDataMultiApprove.append('TypeID', '1094');
      formDataMultiApprove.append('Data[0][name]', '9245');
      formDataMultiApprove.append('Data[0][value]', managerName);
      formDataMultiApprove.append('Data[0][isName]', 'false');
      formDataMultiApprove.append('Data[0][maninp]', 'false');
      formDataMultiApprove.append('Data[0][GroupID]', '2442');
      formDataMultiApprove.append('ParentObjID', userIDDb);
      formDataMultiApprove.append('InterfaceID', '1592');
      formDataMultiApprove.append('AddOpenForm', '0');
      formDataMultiApprove.append('templ_mode', '0');
      formDataMultiApprove.append('MultipleMode', '1');
      formDataMultiApprove.append('Ignor39', '0');

      const response = await ky
        .post(e.addValueObjectURL, {
          body: formDataMultiApprove,
          credentials: 'include',
          timeout: false,
        })
        .json();

      return response; // Возвращаем результат запроса
    });

    const responses = await Promise.all(requests);

    return responses;
  } catch (error) {
    console.error('Во время массового согласования произошла ошибка', error);
    toast.error('Во время массового согласования произошла ошибка', {
      position: toast.POSITION.TOP_RIGHT, // Местоположение сообщения
      autoClose: 3000,
      theme: 'colored',
    });
  }
};

/**
 * Массовая блокировка занятости выбранных сотрудников
 */

export const multiLockEmloyment = async (lockIDiDDbArray: PreparedData): Promise<any> => {
    
  const managerName = Object.keys(namesIddbObj).find(
    (key) => namesIddbObj[key] === Number(currIddb),
  );

  try {
    const requests = lockIDiDDbArray.map(async (user: {}) => {
      const userIDDb = namesIddbObj[Object.keys(user)[0]].toString();
      const userDayIDsArr = namesDatesDayIDsObj[Object.keys(user)[0]];

      const selectedDates = Object.values(lockIDiDDbArray[0])[0]

      const userLockValues = filterDataByDates(selectedDates, userDayIDsArr).map(obj => Object.values(obj)[0]).join(';');

      let formDataMultiLock = new FormData();

      formDataMultiLock.append('ID', userLockValues);
      formDataMultiLock.append('TypeID', '1040');
      formDataMultiLock.append('Data[0][name]', '9249');
      formDataMultiLock.append('Data[0][value]', managerName as string);
      formDataMultiLock.append('Data[0][isName]', 'false');
      formDataMultiLock.append('Data[0][maninp]', 'false');
      formDataMultiLock.append('Data[0][forFilter]', '0');
      formDataMultiLock.append('Data[0][GroupID]', '2442');
      formDataMultiLock.append('ParentObjID', userIDDb);
      formDataMultiLock.append('InterfaceID', '1592');
      formDataMultiLock.append('AddOpenForm', '0');
      formDataMultiLock.append('templ_mode', '0');
      formDataMultiLock.append('MultipleMode', '1');
      formDataMultiLock.append('Ignor39', '0');

      const response = await ky
        .post(e.addValueObjectURL, {
          body: formDataMultiLock,
          credentials: 'include',
          timeout: false,
        })
        .json();

      return response;
    });

    const responses = await Promise.all(requests);

    return responses;
  } catch (error) {
    console.error('Во время массовой блокировки произошла ошибка', error);
    toast.error('Во время массовой блокировки произошла ошибка', {
      position: toast.POSITION.TOP_RIGHT, 
      autoClose: 3000,
      theme: 'colored',
    });
  }
};

/**
 * Массовая разблокировка занятости выбранных сотрудников
 */

export const multiUnlockEmloyment = async (unlockIDiDDbArray: any[]) => {
  try {
    const requests = unlockIDiDDbArray.map(async (user: {}) => {
      const userIDDb = namesIddbObj[Object.keys(user)[0]];
      const userDayIDsArr = namesDatesDayIDsObj[Object.keys(user)[0]];
      const getUserUnlockValues = () => {
        return userDayIDsArr.map((day: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(day)[0]).join(';');
      };

      const userUnlockValues = getUserUnlockValues();

      let formDataMultiUnlock = new FormData();

      formDataMultiUnlock.append('ID', userUnlockValues);
      formDataMultiUnlock.append('TypeID', '1040');
      formDataMultiUnlock.append('Data[0][name]', '9249');
      formDataMultiUnlock.append('Data[0][value]', '');
      formDataMultiUnlock.append('Data[0][isName]', 'false');
      formDataMultiUnlock.append('Data[0][maninp]', 'false');
      formDataMultiUnlock.append('Data[0][forFilter]', '0');
      formDataMultiUnlock.append('Data[0][GroupID]', '2442');
      formDataMultiUnlock.append('ParentObjID', userIDDb);
      formDataMultiUnlock.append('InterfaceID', '1592');
      formDataMultiUnlock.append('AddOpenForm', '0');
      formDataMultiUnlock.append('templ_mode', '0');
      formDataMultiUnlock.append('MultipleMode', '1');
      formDataMultiUnlock.append('Ignor39', '0');

      const response = await ky
        .post(e.addValueObjectURL, {
          body: formDataMultiUnlock,
          credentials: 'include',
          timeout: false,
        })
        .json();

      return response;
    });

    const responses = await Promise.all(requests);
    return responses;
  } catch (error) {
    toast.error('Во время массовой разблокировки произошла ошибка', {
      position: toast.POSITION.TOP_RIGHT, // Местоположение сообщения
      autoClose: 3000,
      theme: 'colored',
    });
  }
};

export const getLockedDatesData = () => {
  return lockedDates;
};

export const getApprovedDates = () => {
  return approvedDates;
};

export const getManagersLevels = () => {
  return managersLevels;
};

/**
 * Отправка сообщения пользователю
 */

export const sendMessageToUser = async (message: string | Blob, dayId: unknown, date: string | Blob | null, fio: any) => {
  let sendDataFD = new FormData();

  // Первый запрос

  sendDataFD.append('ID', dayId);
  sendDataFD.append('TypeID', '1040');
  sendDataFD.append('Data[0][name]', '7416');
  sendDataFD.append('Data[0][value]', date);
  sendDataFD.append('Data[0][isName]', 'true');
  sendDataFD.append('Data[0][maninp]', 'false');
  sendDataFD.append('Data[0][GroupID]', '2728');
  sendDataFD.append('Data[1][name]', 't9266');
  sendDataFD.append('Data[1][value]', message);
  sendDataFD.append('Data[1][isName]', 'false');
  sendDataFD.append('Data[1][maninp]', 'false');
  sendDataFD.append('Data[1][GroupID]', '2728');
  sendDataFD.append('ParentObjID', '-1');
  sendDataFD.append('CalcParamID', '9267');
  sendDataFD.append('InterfaceID', '1799');
  sendDataFD.append('ImportantInterfaceID', '');
  sendDataFD.append('templ_mode', 'false');
  sendDataFD.append('Ignor39', '0');

  let sentDataRes = await ky
    .post(e.addValueObjectURL, {
      body: sendDataFD,
      credentials: 'include',
      timeout: false,
    })
    .json();

  // Второй запрос

  let sendToCalc = new FormData();

  const calcUID = sentDataRes[0]?.calc;

  sendToCalc.append('uid', calcUID);
  sendToCalc.append('index', '0');

  let sentToCalcRes = await ky
    .post(e.calcsController, {
      body: sendToCalc,
      credentials: 'include',
      timeout: false,
    })
    .json();

  toast.success(`Сообщение успешно отправлено! Получатель: ${fio}`, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    theme: 'colored',
  });

  return sentToCalcRes;
};

export const getUsersSavedMessagesDates = () => {
  return usersSavedMessagesDates;
};
