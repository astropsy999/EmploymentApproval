// src/components/CalendarComponent.tsx

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import ruLocale from '@fullcalendar/core/locales/ru';
import { Box } from '@mui/system';
import { CalendarComponentProps } from '../types';

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events,
  selectedDate,
  slotMinTime,
  slotMaxTime,
  eventContent,
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
