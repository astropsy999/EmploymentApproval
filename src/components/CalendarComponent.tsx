// src/components/CalendarComponent.tsx

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import ruLocale from '@fullcalendar/core/locales/ru';
import { Box } from '@mui/system';

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
  // eventContent,
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

  const eventContent = (info: { event: { _def: { extendedProps: any; }; title: string; }; }) => {
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
