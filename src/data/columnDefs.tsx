import { eachDayOfInterval, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { readableDate, weekDatesDefault } from '../helpers/datesRanges';
import SendMessage from '../components/SendMessage';
import {
  getApprovedDates,
  getLockedDatesData,
  getUsersSavedMessagesDates,
} from './api';
import CustomHeaderRenderer from '../components/CustomHeaderRender';

import {
  ColDef,
  ValueFormatterParams,
  ICellRendererParams,
  IHeaderParams,
  CellClassParams,
  CellStyle,
} from 'ag-grid-community';
import { ApprovedDatesData, LockedDatesData } from './data.types';
import React from 'react';

// Интерфейс данных строки
interface EmployeeData {
  "ФИО": string;
  [date: string]: string;
}

// Компонент HtmlRenderer
export const HtmlRenderer: React.FC<{ value: string }> = ({ value }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: value }} />
  );
};

export default HtmlRenderer;

// Функция для получения столбцов
export function getColumnDefs (
  start: Date = weekDatesDefault()[0],
  end: Date = weekDatesDefault()[1],
): ColDef[] {
  const columnDefs: ColDef[] = [];

  let interval: Date[] = [];
  if (start && end) {
    interval = eachDayOfInterval({ start, end });
  }

  // Функция для удаления HTML-тегов
  function stripHtmlTags(input: string | null | undefined): string {
    return input?.replace(/<[^>]*>/g, '') || '';
  }

  // Форматировщик без HTML
  const noHTMLValueFormatter = (params: ValueFormatterParams): string => {
    const stripHtml = params.value as string | undefined;
    return stripHtmlTags(stripHtml) || '';
  };

  // Добавление столбца "ФИО"
  columnDefs.push({
    field: 'ФИО',
    valueFormatter: noHTMLValueFormatter,
    filter: 'agSetColumnFilter',
    filterParams: {
      valueFormatter: noHTMLValueFormatter,
    },
    menuTabs: ['filterMenuTab'],
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    pinned: 'left',
    sort: 'asc',
    cellRenderer: 'htmlRenderer',
    cellStyle: {
      backgroundColor: '#e8f1fc1a',
      fontWeight: '300',
      color: '#013237',
      fontStyle: 'italic',
    },
  });

  // Добавление столбцов с датами
  interval.forEach((item) => {
    if (!(item instanceof Date) || isNaN(item.getTime())) {
      console.error('Invalid date:', item);
      return;
    }

    const formattedDate = format(item, 'dd/MM/yyyy', { locale: ru });
    columnDefs.push({
      headerName: readableDate(formattedDate), 
      field: formattedDate,
      filter: false,
      menuTabs: [],
      cellRenderer: 'htmlRenderer',
      cellStyle: (params: CellClassParams<any, any>) => {
        const data = params.data as EmployeeData;
        const fio = data['ФИО']?.split('<')[0].trim();
        const lockedDates: LockedDatesData = getLockedDatesData();
        const approvedDates: ApprovedDatesData = getApprovedDates();

        function isDayLocked(): boolean {
          const date = format(item, 'dd/MM/yyyy', { locale: ru }).replace(/\//g, '.');
          const dateExists = lockedDates[fio]?.some((obj: any) => date in obj);
          return lockedDates[fio]?.length > 0 && dateExists;
        }

        function isDayApproved(): boolean {
          const date = format(item, 'dd/MM/yyyy', { locale: ru }).replace(/\//g, '.');
          const dateExists = approvedDates[fio]?.some((obj: any) => date in obj);
          return approvedDates[fio]?.length > 0 && dateExists;
        }

        const style: CellStyle = {
          borderRight: '1px solid #dde2eb',
          opacity: 1,
        };

        if (isDayLocked()) {
          style.backgroundColor = '#ffe7d6';
          style.zIndex = 10000;
        } else if (isDayApproved()) {
          style.backgroundColor = '#aae0ac42';
          style.zIndex = 10000;
        }
      
        return style;
      },
    });
  });

  // Добавление столбца "\u03A3"
  columnDefs.push({
    headerName: '\u03A3',
    field: '\u03A3',
    filter: false,
    menuTabs: [],
    pinned: 'right',
    width: 80,

    cellStyle: {
      fontWeight: '500',
      color: '#013237',
      borderRight: '1px solid #dde2eb',
    },
  });

  // Добавление столбца "СООБЩЕНИЕ"
  columnDefs.push({
    headerName: 'СООБЩЕНИЕ',
    field: 'СООБЩЕНИЕ',
    colId: 'messageColumn',
    pinned: 'right',
    hide: true,
    menuTabs: ['generalMenuTab'],
    autoHeight: true,

    cellRenderer: (params: ICellRendererParams) => {
      const data = params.data as EmployeeData;
      const fio = data['ФИО']?.split('<')[0].trim();
      const userSavedMessageDates: any = getUsersSavedMessagesDates();
      let savedMessage: string | undefined;
      let savedDate: string | undefined;

      if (fio && userSavedMessageDates[fio]) {
        savedMessage = Object.keys(userSavedMessageDates[fio])[0];
        savedDate = userSavedMessageDates[fio][savedMessage];
      }
      if (fio) {
        return (
          <SendMessage
            savedMessage={savedMessage}
            initialSavedDate={savedDate}
            {...params}
          />
        );
      }
      return null;
    },

    cellStyle: {
      borderLeft: '1px solid #dde2eb',
    },

    headerComponent: (params: IHeaderParams) => {
      return <CustomHeaderRenderer {...params} columnApi={params.columnApi} />;
    },
  });

  return columnDefs;
}
