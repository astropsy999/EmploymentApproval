import ruLocale from '@fullcalendar/core/locales/ru';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Dialog, Modal, Stack } from '@mui/material';
import { Box } from '@mui/system';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import 'ag-grid-enterprise';
import { AgGridReact } from 'ag-grid-react';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import '../assets/css/timetracker.css';
import { AG_GRID_LOCALE_RU } from '../assets/translations/locale.ru';
import {
  getUsersForManagers,
  linkUnlinkUser,
  multiApproveEmployment,
  multiLockEmloyment,
  multiUnlockEmloyment,
  getLinkedAllUsers,
} from '../data/api';
import { HtmlRenderer } from '../data/trackerCols.data';
import {
  useFilters,
  useGGridStore,
  useIDs,
  useRange,
} from '../store/dataStore';
import { shortenNames } from '../helpers/shortenNames';
import { customLoader } from '../helpers/customLoader';

import { DatePicker } from '../helpers/datePicker';
import { calculateTotalRow } from '../helpers/calculateTotalRows';
import { extractNumbersFromValue } from '../helpers/extractNumbersFromValues';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { deepSearchObject } from '../helpers/deepSearchInObject';
import { SubmitEmploymentModal } from './Modals/SubmitEmploymentModal';
import { SubmitEmploymentLockModal } from './Modals/SubmitEmploymentLockModal';
import { SubmitEmploymentUnlockModal } from './Modals/SubmitEmploymentUnlockModal';
import { ApproveButton } from './Buttons/ApproveButton';
import { LockButton } from './Buttons/LockButton';
import { UnlockButton } from './Buttons/UnlockButton';
import { ReloadButton } from './Buttons/ReloadButton';
import { ToggleMessages } from './Buttons/ToggleMessages';
import { addTitleAttrToElem } from '../helpers/addTitleAttrToElem';

const TimeTracker = memo(() => {
  const gridRef = useRef();
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

  const overlayLoadingTemplate = `<div></div>`;

  const [open, setOpen] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openSubmitLock, setOpenSubmitLock] = useState(false);
  const [openSubmitUnlock, setOpenSubmitUnlock] = useState(false);
  const [eventsObj, setEventsObj] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slotMinTime, setSlotMinTime] = useState('07:00:00');
  const [slotMaxTime, setSlotMaxTime] = useState('22:00:00');
  const [loading, setLoading] = useState(false);
  const [hasUnsubmitted, setHasUmsubmitted] = useState(true);

  const onGridColumnsChanged = (columnDefs) => {
    const totalColumnDef = columnDefs?.find(
      (colDef) => colDef.field === '\u03A3',
    );

    totalColumnDef.valueGetter = function (params) {
      let total = 0;
      Object.values(params.data).forEach((val) => {
        const numbers = extractNumbersFromValue(val);
        total += numbers.reduce((sum, current) => sum + current, 0);
      });
      return total;
    };
  };

  const [components] = useState({
    htmlRenderer: HtmlRenderer,
  });

  // Обработчик события firstDataRendered

  async function onFirstDataRendered(params) {
    const columnApi = params.columnApi;

    columnApi?.autoSizeColumns();
    const columnState = columnApi.getColumnState();

    const gridApi = params.api;
    const filterInstance = gridApi.getFilterInstance('ФИО');

    const getAllLinkedUsers = await getLinkedAllUsers();

    const allNamesArr = getAllLinkedUsers?.map(
      (name) => name.LinkedObjName || '',
    );

    const shortenArr = shortenNames(allNamesArr);

    const getFilterKeys = filterInstance.getFilterKeys();

    const filteredArray = getFilterKeys.filter((item) => {
      return shortenArr.some((name) => item.includes(name));
    });

    filterInstance?.setModel({
      values: filteredArray,
    });
    filterInstance.applyModel();
    gridApi.onFilterChanged();

    customLoader(false);
    gridApi.sizeColumnsToFit();

    gridApi.addEventListener('filterChanged', function () {
      let currentUserLinked = filterInstance?.getModel()?.values;

      if (!currentUserLinked) {
        currentUserLinked = getFilterKeys;
      }
      function extractFirstPart(arr) {
        const resultArray = [];

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
    const getMenuBtn = document.querySelector('[ref="eMenu"]');
    addTitleAttrToElem(getMenuBtn, 'Список сотрудников');
    document.querySelector('.ag-center-cols-viewport').style.height =
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
        document.querySelector('.ag-menu').style.display = 'none';
      });

      getMenuheaderBar?.appendChild(closeBtn);
    };

    addCloseIconBtnToMenuTab();
  };

  // Переменная, которая будет хранить ссылку на API грида
  const gridApiRef = useRef(null);

  // Обработчик события onGridReady
  const onGridReady = (params) => {
    // Сохраняем API грида в переменную gridApiRef
    gridApiRef.current = params.api;
    setGGridRef && setGGridRef(params.api);

    const gridApi = params.api;
    gridApi?.sizeColumnsToFit();
    const columnDefs = gridApi.getColumnDefs();

    const totalColumnDef = columnDefs.find(
      (colDef) => colDef.field === '\u03A3',
    );

    totalColumnDef.valueGetter = function (params) {
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

  const gridOptions = {
    onFirstDataRendered: onFirstDataRendered,
    onGridColumnsChanged: onGridColumnsChanged(columnDefs),
    rowStyle: undefined,
    rowSelection: 'multiple',
    alwaysShowHorizontalScroll: true,
    suppressAnimationFrame: true,
    getRowHeight: function (params) {
      const hasEvents = 'objWrapper';
      const hasVacation = 'Отпуск' || 'Больничный' || 'Выходной';

      if (!deepSearchObject(params.data, hasEvents, hasVacation)) {
        return 50;
      }
    },
  };

  const localeText = useMemo(() => {
    return AG_GRID_LOCALE_RU;
  }, [AG_GRID_LOCALE_RU]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    autoHeight: true,
    width: undefined,
    sizeColumnsToFit: true,
    cellDataType: false,
  }));

  const eventContent = (info) => {
    const { extendedProps } = info.event._def;

    // Создаем элементы для отображения
    const eventContName = document.createElement('span');
    const eventTaskTitle = document.createElement('span');
    const eventTaskType = document.createElement(
      extendedProps.time <= 1 ? 'span' : 'div',
    );
    const eventTaskSubType = document.createElement(
      extendedProps.time <= 1 ? 'span' : 'div',
    );
    const eventObject = document.createElement(
      extendedProps.object && extendedProps.object !== 'Не выбрано'
        ? 'div'
        : 'span',
    );
    const fullDescription = document.createElement(
      extendedProps.time <= 1 ? 'span' : 'div',
    );
    const methTime = document.createElement('span');
    const employment = document.createElement(
      extendedProps.time <= 1 ? 'span' : 'div',
    );
    const location = document.createElement(
      extendedProps.time <= 1 ? 'span' : 'div',
    );

    // Добавляем классы к элементам, если необходимо

    eventContName.classList.add('factTime');
    eventTaskTitle.classList.add('title');
    eventTaskType.classList.add('eventTaskType');
    eventTaskSubType.classList.add('eventTaskSubType');
    methTime.classList.add('methTime');
    employment.classList.add('employment');
    location.classList.add('location');

    // Вставляем значения

    eventTaskSubType.innerHTML = extendedProps.subTaskType || '';
    if (extendedProps.methTime && extendedProps.methTime !== '') {
    }
    if (extendedProps.object && extendedProps.object !== 'Не выбрано') {
      eventObject.classList.add('eventObject');
    }
    fullDescription.classList.add('fullDescription');

    eventContName.innerHTML = `<b>${extendedProps.time}ч</b>`;
    eventTaskTitle.innerHTML = info.event.title || '';

    if (extendedProps.object !== 'Не выбрано') {
      eventObject.innerHTML = extendedProps.object;
    }
    eventTaskType.innerHTML = ` ${extendedProps.type}`;
    eventTaskSubType.innerHTML = extendedProps.subTaskType || '';
    fullDescription.innerHTML = extendedProps.fullDescription;
    methTime.innerHTML = ` ${extendedProps.methTime || ''}`;
    employment.innerHTML = `${extendedProps.employment || ''}`;
    location.innerHTML = `${extendedProps.location || ''}`;

    const arrayOfDomNodes = [
      eventContName,
      eventTaskTitle,
      employment,
      location,
      eventObject,
      eventTaskType,
      eventTaskSubType,
      methTime,
      fullDescription,
    ];

    return { domNodes: arrayOfDomNodes };
  };

  const eventTimeFormat = {
    hour: 'numeric',
    minute: '2-digit',
    meridiem: false,
  };

  const slotLabelFormat = {
    hour: 'numeric',
    minute: '2-digit',
    omitZeroMinute: false,
    meridiem: false,
  };

  // При клике на ячейку таблицы
  const cellClickedListener = (event) => {
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

      function getFamilyIO(fio) {
        const FamilyIO = fio?.split(' ');
        const FIO = FamilyIO?.slice(0, 2);
        const result = FIO?.join(' ');
        return result;
      }

      const clickedName = getFamilyIO(fio)?.trim();

      const date = colId.replaceAll('/', '.');

      const nameDataObjDate =
        clickedName && eventsDataFioObjAll[clickedName][date];
      const events = [];
      const eventsWithMethods = [];
      let methodsEventsArr = [];

      const addEventsWithMethods = (currevent) => {
        eventsWithMethods.push({ [currevent.objID]: currevent });
        methodsEventsArr.push(currevent.objID);
      };

      nameDataObjDate?.map((event) => {
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
          });
        }
        setSelectedDate(event.start);
      });

      const uniObjID = [...new Set(methodsEventsArr)];

      const eventsMethObjID = uniObjID.map((objid) =>
        eventsWithMethods.filter((str) => str[objid]),
      );

      const addMethEventToEvents = (evMethObjID) => {
        evMethObjID.forEach((ev) => {
          const mergedEventMeth = {};
          let metStr = '';
          ev.forEach((methEv) => {
            const methEv0 = Object.values(methEv)[0];
            mergedEventMeth['employment'] = methEv0.employment;
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

            metStr += `${methEv0.meth}-${methEv0.time}, `;
          });
          events.push({ ...mergedEventMeth, methTime: metStr });
        });
      };
      addMethEventToEvents(eventsMethObjID);

      const sortedEvents =
        events.length &&
        events.sort((a, b) => new Date(a.start) - new Date(b.start));
      if (sortedEvents.length > 0) {
        const firstEventStartTime = sortedEvents[0].start.split('T')[1];

        const lastEventEndTime =
          sortedEvents[sortedEvents.length - 1]?.end?.split('T')[1];

        const addHalfHour = (timeString) => {
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

        const subtractHalfHour = (timeString) => {
          const timeParts = timeString.split(':');
          const dateObj = new Date();
          dateObj.setHours(parseInt(timeParts[0]));
          dateObj.setMinutes(parseInt(timeParts[1]));
          dateObj.setSeconds(parseInt(timeParts[2]));
          dateObj.setMinutes(dateObj.getMinutes() - 30);

          const newTimeString = dateObj.toLocaleTimeString('ru-RU');
          return newTimeString;
        };

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

  const updateStateOfNewData = (newData) => {
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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '1px solid lighttgray',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    height: '85%',
  };

  const fullCalendar = (
    <Box sx={style}>
      <FullCalendar
        height={'100%'}
        headerToolbar={{
          left: 'title',
          center: '',
          right: '',
        }}
        eventColor="#cee2f2"
        eventClassNames="event"
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridDay"
        events={eventsObj}
        initialDate={selectedDate}
        locale={ruLocale}
        allDaySlot={false}
        slotDuration="00:15:00"
        slotMinTime={slotMinTime}
        slotMaxTime={slotMaxTime}
        scrollTime={slotMinTime}
        eventContent={eventContent}
        slotEventOverlap={false}
        eventTimeFormat={eventTimeFormat}
        slotLabelInterval={'00:30'}
        slotLabelFormat={slotLabelFormat}
        eventDisplay={'list-item'}
      />
    </Box>
  );

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

  const toastSuccess = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  const handleAction = async (actionType, dataArray) => {
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

  const onRowSelected = () => {
    const selectedUsers = ggridRef.getSelectedRows();

    const selectedUsersHaveEvents = 'objWrapper';
    const approved = 'approved';

    const haveEvents = selectedUsers.some((user) =>
      deepSearchObject(user, selectedUsersHaveEvents, approved),
    );

    setHasUmsubmitted(haveEvents);
  };

  return (
    <>
      <Modal open={open} onClose={handleCloseModal}>
        {fullCalendar}
      </Modal>

      <Dialog onClose={handleCloseSubmit} open={openSubmit} maxWidth="md">
        <SubmitEmploymentModal
          gridApi={gridApiRef.current}
          handleAction={handleAction}
          handleCloseSubmit={handleCloseSubmit}
          loading={loading}
        />
      </Dialog>

      <Dialog onClose={handleCloseSubmitLock} open={openSubmitLock}>
        <SubmitEmploymentLockModal
          gridApi={gridApiRef.current}
          handleAction={handleAction}
          handleCloseSubmitLock={handleCloseSubmitLock}
          hasUnsubmitted={hasUnsubmitted}
          toastSuccess={toastSuccess}
          updateStateOfNewData={updateStateOfNewData}
          loading={loading}
          setLoading={setLoading}
        />
      </Dialog>
      <Dialog onClose={handleCloseSubmitUnlock} open={openSubmitUnlock}>
        <SubmitEmploymentUnlockModal
          gridApi={gridApiRef.current}
          handleAction={handleAction}
          handleCloseSubmitUnlock={handleCloseSubmitUnlock}
          loading={loading}
        />
      </Dialog>
      <Box display="flex" justifyContent="space-between" margin={1}>
        <Stack direction="row" spacing={1} sx={{ m: 1, height: 40 }}>
          <DatePicker />
          <ApproveButton handleOpenModalSubmit={handleOpenModalSubmit} />
          <LockButton
            handleOpenModalSubmitLocking={handleOpenModalSubmitLocking}
          />
          <UnlockButton
            handleOpenModalSubmitUnlocking={handleOpenModalSubmitUnlocking}
          />
          <ReloadButton reloadPage={reloadPage} />
        </Stack>
        <ToggleMessages />
      </Box>

      <div
        className="ag-theme-alpine"
        style={{ width: '99%%', height: '85vh' }}
      >
        <AgGridReact
          ref={gridRef}
          onGridReady={onGridReady}
          rowData={rowData}
          columnDefs={columnDefs}
          localeText={localeText}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          onCellClicked={cellClickedListener}
          components={components}
          suppressLastEmptyLineOnPaste={true}
          gridOptions={gridOptions}
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={true}
          aggregateOnlyChangedColumns={true}
          detailRowAutoHeight={true}
          overlayLoadingTemplate={overlayLoadingTemplate}
          columnHoverHighlight={true}
          excludeHiddenColumnsFromQuickFilter
          suppressContextMenu={true}
          colResizeDefault={'shift'}
          enablePivot={true}
          rowMultiSelectWithClick={true}
          suppressRowClickSelection={true}
          onRowSelected={onRowSelected}
          onFilterOpened={onFilterOpened}
          suppressScrollOnNewData={true}
        />
      </div>
    </>
  );
});

export default TimeTracker;
