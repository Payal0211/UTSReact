import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for drag-and-drop and date click

const MyCalendar = ({calEvents}) => {

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const calendarRef = useRef(null); // Ref for FullCalendar instance


// Handle year and month change
const handleDatesSet = (dateInfo) => {
    console.log('Current visible range:', dateInfo.startStr, 'to', dateInfo.endStr);
    console.log('dateInfo:', dateInfo);
    // You can use this to refetch or update events based on the visible range
  };

  // Handle year and month change via dropdown
  const handleYearChange = (e) => {
    setCurrentYear(Number(e.target.value));
  };

  const handleMonthChange = (e) => {
    setCurrentMonth(Number(e.target.value));
  };

  const handleGoToDate = () => {    
    const calendarApi = calendarRef.current.getApi(); // Access FullCalendar API from ref
    const selectedDate = new Date(currentYear, currentMonth, 1);
    calendarApi.gotoDate(selectedDate);
   
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

{/* <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <select value={currentYear} onChange={handleYearChange}>
          {[...Array(10)].map((_, index) => {
            const year = new Date().getFullYear() - 5 + index;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        <select value={currentMonth} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index}>
              {new Date(0, index).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <button onClick={handleGoToDate}>Go</button>
      </div> */}

      <FullCalendar
      ref={calendarRef} // Attach ref to FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        events={calEvents}
        datesSet={handleDatesSet} // Listen to year and month changes
        eventContent={(eventInfo) => (
          <div style={{ backgroundColor: eventInfo.event.extendedProps.color, padding: '5px', borderRadius: '5px', color: 'white' }}>
            {eventInfo.event.title}
          </div>
        )}
      />
    </div>
  );
};

export default MyCalendar;
