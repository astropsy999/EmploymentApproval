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

export const HtmlRenderer = ({ value }) => {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </>
  );
};

export default HtmlRenderer;

function CustomHeaderButton(props) {
  const handleButtonClick = () => {
    // Обработчик события при нажатии на кнопку
    alert('Кнопка в шапке меню нажата!');
  };

  return (
    <button onClick={handleButtonClick} className="custom-header-button">
      Моя кнопка
    </button>
  );
}

export const getColumnDefs = (
  start = weekDatesDefault()[0],
  end = weekDatesDefault()[1],
) => {
  const columnDefs = [];

  let interval = [];
  if (start && end) {
    interval = eachDayOfInterval({ start, end });
  }

  function stripHtmlTags(input) {
    return input?.replace(/<[^>]*>/g, '');
  }

  const noHTMLValueFormatter = (params) => {
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
      cellStyle: (params) => {
        const fio = params.data['ФИО']?.split('<')[0].trim();
        const lockedDates = getLockedDatesData();
        const approvedDates = getApprovedDates();

        function isDayLocked() {
          if (lockedDates[fio]?.length > 0) {
            return true;
          }

          return false;
        }
        function isDayApproved() {
          const date = format(item, 'dd/MM/yyyy').replaceAll('/', '.');

          const dateExists = approvedDates[fio]?.some((obj) => date in obj);

          if (approvedDates[fio]?.length > 0 && dateExists) {
            return true;
          }

          return false;
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

    cellStyle: function (params) {
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

    cellRenderer: (params) => {
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
    headerComponent: (params) => {
      return <CustomHeaderRenderer {...params} api={params.api} />;
    },
  });

  return columnDefs;
};
