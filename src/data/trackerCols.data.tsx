import { eachDayOfInterval, format } from 'date-fns';
import { readableDate } from '../helpers/datesRanges';
import { weekDatesDefault } from '../helpers/datesRanges';
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
} from 'ag-grid-community';
import React from 'react';

interface HtmlRendererProps {
  value: string;
}

export const HtmlRenderer: React.FC<HtmlRendererProps> = ({ value }) => {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </>
  );
};

export default HtmlRenderer;

// function CustomHeaderButton(props) {
//   const handleButtonClick = () => {
//     // Обработчик события при нажатии на кнопку
//     alert('Кнопка в шапке меню нажата!');
//   };

//   return (
//     <button onClick={handleButtonClick} className="custom-header-button">
//       Моя кнопка
//     </button>
//   );
// }

export function getColumnDefs (
  start: Date = weekDatesDefault()[0],
  end: Date = weekDatesDefault()[1],
)  {
  const columnDefs = [];

  let interval: Date[] = [];
  if (start && end) {
    interval = eachDayOfInterval({ start, end });
  }

  function stripHtmlTags(input: string | null | undefined) {
    return input?.replace(/<[^>]*>/g, '');
  }

  const noHTMLValueFormatter = (params: ValueFormatterParams) => {
    const stripHtml = params.value;

    return stripHtmlTags(stripHtml);
  };

  // Фамилии всех пользователей

  columnDefs.push({
    field: 'ФИО',
    valueFormatter: noHTMLValueFormatter,
    filter: 'agSetColumnFilter',
    filterParams: {
      valueFormatter: noHTMLValueFormatter,
      // suppressSelectAll: true,
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
  interval.forEach((item) => {
    columnDefs.push({
      headerName: readableDate(format(item, 'dd/MM/yyyy')),
      field: format(item, 'dd/MM/yyyy'),
      filter: false,
      menuTabs: [],
      cellRenderer: 'htmlRenderer',
      cellStyle: (params: ICellRendererParams): { [key: string]: string | number } => {
        const fio = params.data['ФИО']?.split('<')[0].trim();
        const lockedDates = getLockedDatesData();
        const approvedDates = getApprovedDates();

        function isDayLocked(): boolean {
          return fio && lockedDates[fio]?.length > 0;
        }
        function isDayApproved(): boolean {
          const date = format(item, 'dd/MM/yyyy').replace(/\//g, '.');
          const dateExists = approvedDates[fio]?.some((obj: any) => date in obj);
          return fio && approvedDates[fio]?.length > 0 && dateExists;
        }

        if (isDayLocked()) {
          return {
            backgroundColor: '#ffe7d6',
            zIndex: 10000,
            opacity: 0.5,
            borderRight: '1px solid #dde2eb',
          };
        } else if (isDayApproved()) {
          return {
            backgroundColor: '#aae0ac42',
            zIndex: 10000,
            borderRight: '1px solid #dde2eb',
          };
        }
        return {
          borderRight: '1px solid #dde2eb',
        };
      },
    });
  });

  columnDefs.push({
    headerName: '\u03A3',
    field: '\u03A3',
    filter: false,
    menuTabs: [],
    pinned: 'right',
    width: 80,

    cellStyle: function (params: IHeaderParams) {
      return {
        fontWeight: '500',
        color: '#013237',
        borderRight: '1px solid #dde2eb',
      };
    },
  });

  columnDefs.push({
    headerName: 'СООБЩЕНИЕ',
    field: 'СООБЩЕНИЕ',
    colId: 'messageColumn',
    // width: 150,
    pinned: 'right',
    hide: true,
    menuTabs: ['generalMenuTab'],
    autoHeight: true,

    cellRenderer: (params: ICellRendererParams) => {
      const fio = params.data['ФИО']?.split('<')[0].trim();
      const userSavedMessageDates = getUsersSavedMessagesDates();
      let savedMessage, savedDate;

      if (userSavedMessageDates[fio]) {
        savedMessage = Object.keys(userSavedMessageDates[fio])[0];
        savedDate = Object.values(userSavedMessageDates[fio])[0];
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
    },

    cellStyle: {
      borderLeft: '1px solid #dde2eb',
    },
    headerComponent: (params: IHeaderParams) => {
      return <CustomHeaderRenderer {...params} api={params.api} />;
    },
  });

  return columnDefs;
};
