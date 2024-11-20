import { Dialog, Modal } from '@mui/material';
import { Box } from '@mui/system';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import 'ag-grid-enterprise';
import { ColDef } from 'ag-grid-enterprise';
import React, { memo, useEffect, useRef, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/timetracker.css';
import {
  getLinkedAllUsers,
  getUsersForManagers,
  linkUnlinkUser,
  multiApproveEmployment,
  multiLockEmloyment,
  multiUnlockEmloyment,
} from '../data/api';
import { addAttrToElem, addTitleAttrToElem } from '../helpers/addTitleAttrToElem';
import { calculateTotalRow } from '../helpers/calculateTotalRows';
import { customLoader } from '../helpers/customLoader';
import { formatDateToKey, getDatesInRange } from '../helpers/datesRanges';
import { deepSearchObject } from '../helpers/deepSearchInObject';
import { extractNumbersFromValue } from '../helpers/extractNumbersFromValues';
import { addHalfHour, addMethEventToEvents } from '../helpers/fullCalendarHelpers';
import { shortenNames } from '../helpers/shortenNames';
import { toastSuccess } from '../helpers/toastMessages';
import {
  useFilters,
  useGGridStore,
  useIDs,
  useRange,
} from '../store/dataStore';
import { VacationType } from '../types/enums';
import AgGridTable from './AgGridTable';
import { ToggleMessages } from './Buttons/ToggleMessages';
import CalendarComponent from './CalendarComponent';
import { LockEmploymentModal } from './Modals/LockEmploymentModal';
import { SubmitEmploymentModal } from './Modals/SubmitEmploymentModal';
import { UnlockEmploymentModal } from './Modals/UnlockEmploymentModal';
import Toolbar from './Toolbar';
import { CalendarEvent } from './types';
import { CellClickedEvent, FirstDataRenderedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

const TimeTracker = memo(() => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const {
    startDate,
    endDate,
    rowData,
    setRowData,
    columnDefs,
    setObjectsArr,
    setTypesArr,
    setDivesArr,
    setEventsDataFioObj,
    eventsDataFioObjAll,
    setEventsDataFioObjAll,
    setSubTypesArr,
    setInitialLoadedSubtypes,
  } = useRange();

  const {
    setNamesIddbObj,
    setNamesDatesDayIDsObj,
    setLockedDates,
    setUsersSavedMessagesDates,
  } = useIDs();

  const { setLinkedAndFilteredUsers } = useFilters();

  const { setGGridRef, ggridRef } = useGGridStore();

  

  const [open, setOpen] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openSubmitLock, setOpenSubmitLock] = useState(false);
  const [openSubmitUnlock, setOpenSubmitUnlock] = useState(false);
  const [eventsObj, setEventsObj] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slotMinTime, setSlotMinTime] = useState('07:00:00');
  const [slotMaxTime, setSlotMaxTime] = useState('22:00:00');
  const [loading, setLoading] = useState(false);

  const onGridColumnsChanged = (columnDefs: ColDef[]) => {
    const totalColumnDef = columnDefs?.find(
      (colDef) => colDef.field === '\u03A3',
    );

    if (totalColumnDef) {
      totalColumnDef.valueGetter = function (params) {
          let total = 0;
          Object.values(params.data).forEach((val) => {
              const numbers = extractNumbersFromValue(val);
              total += numbers.reduce((sum, current) => sum + current, 0);
          });
          return total;
      };
  }
  };

  // Обработчик события firstDataRendered
  async function onFirstDataRendered(params: FirstDataRenderedEvent) {
    const columnApi = params.columnApi;

    columnApi?.autoSizeColumns(columnApi.getColumns()!);
    const columnState = columnApi.getColumnState();

    const gridApi = params.api;
    const filterInstance = gridApi.getFilterInstance('ФИО') as any;

    const getAllLinkedUsers = await getLinkedAllUsers();

    const allNamesArr = getAllLinkedUsers?.map(
      (name: { LinkedObjName: any; }) => name.LinkedObjName || '',
    );

    const shortenArr = shortenNames(allNamesArr);

    const getFilterKeys = filterInstance?.getFilterKeys();

    const filteredArray = getFilterKeys.filter((item: string | string[]) => {
      return shortenArr.some((name) => item.includes(name));
    });

    filterInstance?.setModel({
      values: filteredArray,
    });
    filterInstance?.applyModel();
    gridApi.onFilterChanged();

    customLoader(false);
    gridApi.sizeColumnsToFit();

    gridApi.addEventListener('filterChanged', function () {
      let currentUserLinked = filterInstance?.getModel()?.values;

      if (!currentUserLinked) {
        currentUserLinked = getFilterKeys;
      }
      function extractFirstPart(arr: any[]) {
        const resultArray: any[] = [];

        arr?.forEach((value) => {
          // Используем регулярное выражение для извлечения фамилии
          const match = value.match(/^(.*?)\s*</);
          if (match && match[1]) {
            resultArray.push(match[1].trim());
          }
        });
        setLinkedAndFilteredUsers(resultArray);
        return resultArray;
      }

      const cleanedLinked = extractFirstPart(currentUserLinked);

      linkUnlinkUser(cleanedLinked);
      calculateTotalRow(gridRef);
    });

    calculateTotalRow(gridRef);
    const getMenuBtn = document.querySelector('[ref="eMenu"]') as HTMLElement;
    // addTitleAttrToElem(getMenuBtn, 'Список сотрудников');
    addAttrToElem(getMenuBtn, 'title', 'Список сотрудников');
    addAttrToElem(getMenuBtn, 'data-testid', 'employeeListButton');
    (document?.querySelector('.ag-center-cols-viewport') as HTMLElement).style.height =
      'calc(100% + 20px)';
  }

  const onFilterOpened = () => {
    const addCloseIconBtnToMenuTab = () => {
      const getMenuheaderBar = document.querySelector('.ag-tabs-header');

      const closeBtn = document.createElement('button');
      closeBtn.className = 'ag-icon ag-icon-cross';
      closeBtn.classList.add('close-btn-on-menu');
      closeBtn.setAttribute('unselectable', 'on');
      closeBtn.setAttribute('role', 'presentation');

      closeBtn.addEventListener('click', () => {
        (document.querySelector('.ag-menu') as HTMLElement).style.display = 'none';
      });

      getMenuheaderBar?.appendChild(closeBtn);
    };

    addCloseIconBtnToMenuTab();
  };

  // Переменная, которая будет хранить ссылку на API грида
  const gridApiRef = useRef(null);

  // Обработчик события onGridReady
  const onGridReady = (params: any) => {
    // Сохраняем API грида в переменную gridApiRef
    gridApiRef.current = params.api;
    setGGridRef && setGGridRef(params.api);

    const gridApi = params.api;
    gridApi?.sizeColumnsToFit();
    const columnDefs = gridApi.getColumnDefs();

    const totalColumnDef = columnDefs.find(
      (colDef: { field: string; }) => colDef.field === '\u03A3',
    );

    totalColumnDef.valueGetter = function (params: { data: { [s: string]: unknown; } | ArrayLike<unknown>; }) {
      let total = 0;
      Object.values(params.data).forEach((val) => {
        const numbers = extractNumbersFromValue(val);
        total += numbers.reduce((sum, current) => sum + current, 0);
      });
      return total;
    };

    // Обновляем определение всех колонок
    gridApi.setColumnDefs(columnDefs);

    // Перерисовываем заголовок таблицы с обновленными параметрами фильтрации
    gridApi?.refreshHeader();
    gridApi.sizeColumnsToFit();
    // customLoader(false);
  };

  // Получаем массив дат за неделю
  const datesArray = getDatesInRange(new Date(startDate), new Date(endDate));
  const selectedDateKeys = datesArray
        .map(date => formatDateToKey(date));

  const gridOptions = {
    onFirstDataRendered: onFirstDataRendered,
    onGridColumnsChanged: onGridColumnsChanged(columnDefs),
    rowStyle: undefined,
    rowSelection: 'multiple',
    alwaysShowHorizontalScroll: true,
    suppressAnimationFrame: true,
    getRowHeight: function (params: { data: any; }) {
      const hasEvents = 'objWrapper';
      const hasVacation = VacationType.Vacation || VacationType.SickLeave || VacationType.Holiday;

      if (!deepSearchObject(params.data, hasEvents, hasVacation, selectedDateKeys)) {
        return 50;
      }
    },
  };

  // При клике на ячейку таблицы
  const cellClickedListener = (event: CellClickedEvent) => {
    if (event.colDef.field === 'ФИО') {
      if (!event.node.isSelected()) {
        event.node.setSelected(true);
      } else {
        event.node.setSelected(false);
      }
    }

    if (typeof event?.value !== 'number' && event?.value !== '') {
      const colId = event.column.getColId(); // получаем идентификатор столбца
      const rowNode = event?.node; // получаем узел строки
      const fio = rowNode.data.ФИО;

      function getFamilyIO(fio: string) {
        const FamilyIO = fio?.split(' ');
        const FIO = FamilyIO?.slice(0, 2);
        const result = FIO?.join(' ');
        return result;
      }

      const clickedName = getFamilyIO(fio)?.trim();

      const date = colId.replaceAll('/', '.');

      const nameDataObjDate =
        clickedName && eventsDataFioObjAll[clickedName][date];
      const events: CalendarEvent[] = [];
      const eventsWithMethods: { [x: number]: CalendarEvent; }[] = [];
      let methodsEventsArr: CalendarEvent['objID'][] = [];

      const addEventsWithMethods = (currevent: CalendarEvent) => {
        eventsWithMethods.push({ [currevent.objID!]: currevent });
        methodsEventsArr?.push(currevent.objID);
      };

      nameDataObjDate?.map((event: CalendarEvent) => {
        if (`meth` in event) {
          addEventsWithMethods(event);
        } else {
          events.push({
            title: event.title,
            start: event.start,
            end: event.end,
            time: event.time,
            type: event.type,
            object: event.object,
            subTaskType: event.subType,
            fullDescription: event.fullDescription,
            location: event.location,
            employment: event.employment,
            isBrigadier: event.isBrigadier,
            brigadeList: event.brigadeList,
          });
        }
        setSelectedDate(event.start);
      });

      const uniObjID = [...new Set(methodsEventsArr)];

      const eventsMethObjID = uniObjID.map((objid: any) =>
        eventsWithMethods.filter((str) => str[objid]),
      );

      
      addMethEventToEvents(eventsMethObjID, events);

      const sortedEvents =
        events.length ?
        events.sort((a, b) => {
          const startDate = Date.parse(a.start);
          const endDate = Date.parse(b.start);
          return startDate - endDate;
        }): [];
      if (sortedEvents.length > 0) {
        const firstEventStartTime = sortedEvents[0]?.start?.split('T')[1];

        const lastEventEndTime =
          sortedEvents[sortedEvents.length - 1]?.end?.split('T')[1];
        if (!firstEventStartTime && !lastEventEndTime) return
        setSlotMinTime(firstEventStartTime);
        setSlotMaxTime(addHalfHour(lastEventEndTime));
      }

      setEventsObj(events);
      if (event.value !== '') {
        if (nameDataObjDate && nameDataObjDate.length > 0) setOpen(true);
      }
      event.value = '';
      // ggridRef?.sizeColumnsToFit();
    }
  };

  const updateStateOfNewData = (newData: any) => {
    setRowData(newData[0]);
    setObjectsArr(newData[1]);
    setTypesArr(newData[2]);
    setDivesArr(newData[3]);
    setEventsDataFioObj(newData[4]);
    setSubTypesArr(newData[5]);
    setInitialLoadedSubtypes(newData[5]);
    setEventsDataFioObjAll(newData[6]);
    setNamesIddbObj(newData[7]);
    setNamesDatesDayIDsObj(newData[8]);
    setLockedDates(newData[9]);
    setUsersSavedMessagesDates(newData[10]);
  };

  // Самая первая загрузка данных с сервера и запись их в Store
  useEffect(() => {
    getUsersForManagers(startDate, endDate).then((rowData) => {
      updateStateOfNewData(rowData);
    });
  }, []);

  const handleCloseSubmit = () => {
    setOpenSubmit(false);
  };

  const handleCloseSubmitLock = () => {
    setOpenSubmitLock(false);
  };
  const handleCloseSubmitUnlock = () => {
    setOpenSubmitUnlock(false);
  };

  const handleOpenModalSubmit = () => {
    setOpenSubmit(true);
  };
  const handleOpenModalSubmitLocking = () => {
    setOpenSubmitLock(true);
  };
  const handleOpenModalSubmitUnlocking = () => {
    setOpenSubmitUnlock(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleAction = async (actionType: string, dataArray: any[]) => {
    setLoading(true);
    try {
      let response;
      switch (actionType) {
        case 'approve':
          response = await multiApproveEmployment(dataArray);
          toastSuccess('Успешно согласовано');
          break;
        case 'lock':
          response = await multiLockEmloyment(dataArray);
          toastSuccess('Успешно заблокировано');
          break;
        case 'unlock':
          response = await multiUnlockEmloyment(dataArray);
          toastSuccess('Успешно разблокировано');
          break;
        default:
          break;
      }

      if (response) {
        setLoading(false);
        getUsersForManagers(startDate, endDate).then((rowData) => {
          updateStateOfNewData(rowData);
          customLoader(false);
        });
      }
    } catch (error) {}
  };

  const reloadPage = () => {
    getUsersForManagers(startDate, endDate).then((rowData) => {
      updateStateOfNewData(rowData);
      customLoader(false);
      ggridRef.sizeColumnsToFit();
    });
    ggridRef.sizeColumnsToFit();
  };

  return (
    <>
      <Modal open={open} onClose={handleCloseModal}>
        <CalendarComponent
          events={eventsObj}
          selectedDate={selectedDate}
          slotMinTime={slotMinTime}
          slotMaxTime={slotMaxTime}
        />
      </Modal>

      <Dialog onClose={handleCloseSubmit} open={openSubmit} maxWidth="md">
        <SubmitEmploymentModal
          gridApi={gridApiRef.current !== null ? gridApiRef.current : undefined}
          handleAction={handleAction}
          handleCloseSubmit={handleCloseSubmit}
          loading={loading}
        />
      </Dialog>

      <Dialog onClose={handleCloseSubmitLock} open={openSubmitLock}>
        <LockEmploymentModal
          gridApi={gridApiRef.current !== null ? gridApiRef.current : undefined}
          handleAction={handleAction}
          handleCloseSubmitLock={handleCloseSubmitLock}
          updateStateOfNewData={updateStateOfNewData}
          loading={loading}
          setLoading={setLoading} 
          />
      </Dialog>
      <Dialog onClose={handleCloseSubmitUnlock} open={openSubmitUnlock}>
        <UnlockEmploymentModal
          gridApi={gridApiRef.current !== null ? gridApiRef.current : undefined}
          handleAction={handleAction}
          handleCloseSubmitUnlock={handleCloseSubmitUnlock}
          loading={loading}
        />
      </Dialog>
      <Box display="flex" justifyContent="space-between" margin={1}>
        <Toolbar 
          handleOpenModalSubmit={handleOpenModalSubmit} 
          handleOpenModalSubmitLocking={handleOpenModalSubmitLocking} 
          handleOpenModalSubmitUnlocking={handleOpenModalSubmitUnlocking} 
          reloadPage={reloadPage} 
        />
        <ToggleMessages />
      </Box>
      <AgGridTable
          gridRef={gridRef} 
          onGridReady={onGridReady} 
          rowData={rowData} 
          columnDefs={columnDefs} 
          cellClickedListener={cellClickedListener}
          //@ts-ignore 
          gridOptions={gridOptions} 
          onFilterOpened={onFilterOpened} 
      />
    </>
  );
});

export default TimeTracker;
