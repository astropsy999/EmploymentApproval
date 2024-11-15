// src/components/CalendarComponent.tsx

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import ruLocale from '@fullcalendar/core/locales/ru';
import { Box } from '@mui/system';
import { initialsStr } from '../helpers/textsHelpers';

/**
 * Интерфейс для пропсов компонента CalendarComponent.
 */
export interface CalendarComponentProps {
  events: any[]; // Определите более конкретный тип, если возможно
  selectedDate: string | null;
  slotMinTime: string;
  slotMaxTime: string;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events,
  selectedDate,
  slotMinTime,
  slotMaxTime,
}) => {
  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '1px solid lightgray',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    height: '85%',
  };

  const eventContent = (info: any) => {
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
  
    // **Добавляем создание новых элементов**
    const brigadeListElement = document.createElement('span');
    brigadeListElement.classList.add('brigadeList');
  
    const isBrigadierElement = document.createElement('span');
    isBrigadierElement.classList.add('isBrigadier');
  
    // Добавляем классы к элементам, если необходимо
    eventContName.classList.add('factTime');
    eventTaskTitle.classList.add('title');
    eventTaskType.classList.add('eventTaskType');
    eventTaskSubType.classList.add('eventTaskSubType');
    methTime.classList.add('methTime');
    employment.classList.add('employment');
    location.classList.add('location');
    fullDescription.classList.add('fullDescription');
  
    // Вставляем значения
    eventContName.innerHTML = `<b>${extendedProps.time}ч</b>`;
    eventTaskTitle.innerHTML = info.event.title || '';
    eventTaskType.innerHTML = ` ${extendedProps.type}`;
    eventTaskSubType.innerHTML = extendedProps.subTaskType || '';
    methTime.innerHTML = ` ${extendedProps.methTime || ''}`;
    employment.innerHTML = `${extendedProps.employment || ''}`;
    location.innerHTML = `${extendedProps.location || ''}`;
    fullDescription.innerHTML = extendedProps.fullDescription || '';
  
    if (extendedProps.object && extendedProps.object !== 'Не выбрано') {
      eventObject.classList.add('eventObject');
      eventObject.innerHTML = extendedProps.object;
    }
  
    // **Устанавливаем значения для новых элементов**

    

    // if (extendedProps.brigadeList) {
    //   if (extendedProps.isBrigadier === 'Да') {
    //     isBrigadierElement.innerHTML = `<i class="fa fa-user" aria-hidden="true" style="font-size: 12px; color: #1862c6"></i>`;
    //   }
    //   brigadeListElement.innerHTML = `[${initialsStr(extendedProps.brigadeList)}]`;
    // }
  
    
  
    // Обновляем массив элементов для отображения
    const arrayOfDomNodes = [
      eventContName,
      eventTaskTitle,
      employment,
      location,
      eventObject,
      eventTaskType,
      eventTaskSubType,
      methTime,
      // isBrigadierElement,
      // brigadeListElement, 
      fullDescription,
    ];
  
    return { domNodes: arrayOfDomNodes };
  };
  

  return (
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
        events={events}
        initialDate={selectedDate || new Date()}
        locale={ruLocale}
        allDaySlot={false}
        slotDuration="00:15:00"
        slotMinTime={slotMinTime}
        slotMaxTime={slotMaxTime}
        scrollTime={slotMinTime}
        eventContent={eventContent}
        slotEventOverlap={false}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false,
        }}
        slotLabelInterval={'00:30'}
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: false,
        }}
        eventDisplay={'list-item'}
      />
    </Box>
  );
};

export default CalendarComponent;
