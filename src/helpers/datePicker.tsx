import 'flatpickr/dist/flatpickr.min.css';
import { Russian } from 'flatpickr/dist/l10n/ru';
import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from 'react-flatpickr';
import '../assets/css/timetracker.css?inline';
import { getUsersForManagers } from '../data/api';
import { getColumnDefs } from '../data/columnDefs';
import { useGGridStore, useIDs, useRange } from '../store/dataStore';
import { customLoader } from './customLoader';
import { useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

export function DatePicker() {
  // Используйте текущую дату или другое значение по умолчанию
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setColumnDefs,
    setRowData,
    setObjectsArr,
    setTypesArr,
    setSubTypesArr,
    setDivesArr,
    setEventsDataFioObj,
    setEventsDataFioObjAll,
    setInitialLoadedSubtypes,
    rowData,
    isMessageColumnVisible,
    setMessageColumnVisible,
  } = useRange();

  const { setUsersSavedMessagesDates, setNamesDatesDayIDsObj } = useIDs();

  const fp = useRef<Flatpickr>(null);

  const { ggridRef } = useGGridStore();

  const changeDateHandler = ([start, end]: Date[]) => {
    setUsersSavedMessagesDates({});
    setMessageColumnVisible(false);
    // Определяем начало и конец текущей недели

    const clickedDate = start;
    const startOfWeek = new Date(clickedDate);
    startOfWeek.setDate(clickedDate.getDate() - clickedDate.getDay() + 1); // Понедельник

    const endOfWeek = new Date(clickedDate);
    endOfWeek.setDate(clickedDate.getDate() - clickedDate.getDay() + 7); // Воскресенье

    if (startOfWeek && endOfWeek) {
      // Закрыть окно календаря после выбора даты
      if (fp) {
        setTimeout(() => {
          fp?.current?.flatpickr.close();
        }, 1000);
      }
    }

    setColumnDefs(getColumnDefs(startOfWeek, endOfWeek));
    setStartDate(startOfWeek);
    setEndDate(endOfWeek);
    // Проверяем наличие значений startDate и endDate
    if (startOfWeek && endOfWeek) {
      // Запускаем функцию загрузки данных
      getUsersForManagers(startOfWeek, endOfWeek).then((rowData: any) => {
        setRowData(rowData[0]);
        setObjectsArr(rowData[1]);
        setTypesArr(rowData[2]);
        setDivesArr(rowData[3]);
        setEventsDataFioObj(rowData[4]);
        setSubTypesArr(rowData[5]);
        setInitialLoadedSubtypes(rowData[5]);
        setEventsDataFioObjAll(rowData[6]);
        setNamesDatesDayIDsObj(rowData[8]);
        setUsersSavedMessagesDates(rowData[10]);
        ggridRef?.sizeColumnsToFit();
        customLoader(false);
      });
    }
  };

  const loadPreviousWeek = () => {
    const currentStartDate = startDate;

    const previousWeekStartDate = new Date(currentStartDate);

    previousWeekStartDate.setDate(currentStartDate.getDate() - 7);

    const previousWeekEndDate = new Date(currentStartDate);
    previousWeekEndDate.setDate(currentStartDate.getDate() - 1);

    changeDateHandler([previousWeekStartDate, previousWeekEndDate]);
  };

  const loadNextWeek = () => {
    const currentEndDate = endDate;

    const nextWeekStartDate = new Date(currentEndDate);

    nextWeekStartDate.setDate(currentEndDate.getDate() + 1);

    const nextWeekEndDate = new Date(currentEndDate);

    nextWeekEndDate.setDate(nextWeekStartDate.getDate() + 6);

    changeDateHandler([nextWeekStartDate, nextWeekEndDate]);
  };

  useEffect(() => {
    const columnDefs = ggridRef?.getColumnDefs();

    const totalRowData: any = {};

    // перебираем все колонки
    columnDefs?.forEach((colDef: { colId: string; field: any; }) => {
      if (
        colDef.colId !== 'ФИО' &&
        colDef.colId !== 'СООБЩЕНИЕ' &&
        colDef.colId !== '\u03A3'
      ) {
        const fieldName = colDef.field;
        const columnValues = ggridRef
          .getModel()
          .rowsToDisplay.map((rowNode: { data: { [x: string]: any; }; }) => rowNode.data[fieldName]);

        // суммируем все значения колонки

        const total = columnValues.reduce((acc: number, val: string | undefined) => {
          const regex = /<span class="factTime"><b>([\d.]+)ч<\/b><\/span>/g;
          if (val !== '' && val !== undefined) {
            const matches = val.match(regex);
            if (matches && matches.length !== 0) {
              for (const match of matches) {
                //@ts-ignore
                const parsedNum = parseFloat(match?.match(/([\d.]+)ч/)[1]);

                if (!isNaN(parsedNum)) {
                  acc += parsedNum;
                }
                
              }
            }
          }
          return acc;
        }, 0);

        // записываем сумму в верхнюю строку
        totalRowData[fieldName] = total;
      }
    });

    // обновляем данные верхней строки
    ggridRef?.setPinnedTopRowData([totalRowData]);
  }, [rowData]);

  const buttonStyle = {
    backgroundColor: '#42a5f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '30px',
    maxHeight: '40px',
    minWidth: '30px',
    minHeight: '40px',
    '&:hover': {
      backgroundColor: '#0088D1',
    },
  };

  return (
    <>
      <Tooltip title="Предыдущая неделя" arrow>
        <Button
          onClick={loadPreviousWeek}
          variant="contained"
          sx={buttonStyle}
          color="primary"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 30 }} />
        </Button>
      </Tooltip>
      <Flatpickr
        ref={fp}
        className="dateInput"
        style={{
          outline: 'none',
          padding: '10px',
          border: '0.1px solid lightgrey',
          borderRadius: '0.3rem',
          background: '#42a5f6',
          color: 'white',
          width: '210px',
          fontSize: '1.2rem',
          fontWeight: '500',
          boxShadow:
            'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
          marginLeft: 3,
          marginRight: -5,
        }}
        options={{
          mode: 'range',
          enableTime: false,
          dateFormat: 'd.m.y',
          locale: Russian,
          minDate: new Date(2023, 3, 1),
        }}
        value={[startDate, endDate]}
        onChange={changeDateHandler}
      />
      <Tooltip title="Следующая неделя" arrow>
        <Button variant="contained" sx={buttonStyle} onClick={loadNextWeek}>
          <ArrowForwardIosIcon sx={{ fontSize: 30 }} />
        </Button>
      </Tooltip>
    </>
  );
}
