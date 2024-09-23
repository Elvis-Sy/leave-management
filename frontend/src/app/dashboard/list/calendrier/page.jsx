"use client"

import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/fr';

moment.locale('fr'); // Changer la langue en français
const localizer = momentLocalizer(moment);

// Exemple d'événements
const events = [
  {
    title: 'Long Event',
    start: new Date(2024, 8, 19),
    end: new Date(2024, 8, 20),
    allDay: false,
  },
  {
    title: 'Meeting',
    start: new Date(2024, 8, 17),
    end: new Date(2024, 8, 20),
    allDay: false,
  },
  {
    title: 'Test',
    start: new Date(2024, 8, 17),
    end: new Date(2024, 8, 18),
    allDay: false,
  },
  {
    title: 'Test2',
    start: new Date(2024, 8, 17),
    end: new Date(2024, 8, 18),
    allDay: false,
  },
];


// const MyWorkWeekView = ({ date, events, startAccessor, endAccessor, ...props }) => {
//   const start = moment(date).startOf('month').startOf('week').toDate();
//   const end = moment(date).endOf('month').endOf('week').toDate();
  
//   // Filter events to only Monday-Friday
//   const daysToShow = [1, 2, 3, 4, 5]; // Monday to Friday

//   return (
//     <Calendar
//       {...props}
//       events={events}
//       localizer={localizer}
//       startAccessor={startAccessor}
//       endAccessor={endAccessor}
//       defaultView="month"
//       views={{
//         work_week_month: {
//           title: 'Work Week Month',
//           workWeek: true,
//           date: date,
//           start,
//           end,
//           daysToShow,
//         },
//       }}
//       formats={{
//         dayFormat: 'D', // Customize the day format (numbers for day of the month)
//       }}
//     />
//   );
// };



const MyBigCalendar = () => {
  const [currentView, setCurrentView] = useState('month'); // Gestion de la vue actuelle
  const [currentDate, setCurrentDate] = useState(new Date()); // Gestion de la date actuelle
  const [selectedDate, setSelectedDate] = useState(null); // Date sélectionnée

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  //Lors du clique de la date elle-meme
  const handleSelectDate = (date, view) => {
    if(view == "month"){
      setSelectedDate(date);
      alert(`Date sélectionnée: ${moment(date).format('DD MMMM YYYY')}`);
    }
  };

  //Lors du clique des slots dans les +2 more
  const handleExtraEvents = (events) => {
    const eventDetails = events.map(event => `${event.title} - du ${moment(event.start).format('DD MMMM YYYY')} au ${moment(event.end-1).format('DD MMMM YYYY')}`).join('\n');
    alert(`Événements supplémentaires :\n${eventDetails}`);
  };

  const CustomToolbar = (props) => {
    const { onNavigate, onView, label } = props;

    const btn = document.querySelectorAll('.rbc-btn-group button');
    btn.forEach(button=>{
      button.addEventListener('click', function(){
        btn.forEach(butt=>{
          butt.classList.remove('btn-actif');
        })
        button.classList.add('btn-actif');
      })
    })

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={() =>{ onNavigate('PREV') }}>Précédent</button>
          <button type="button" onClick={() =>{ onNavigate('TODAY') }}>Aujourd'hui</button>
          <button type="button" onClick={() =>{ onNavigate('NEXT') }}>Suivant</button>
        </span>
        <span className="rbc-toolbar-label">{label}</span>
        <span className="rbc-btn-group">
          <button type="button" onClick={() =>{ onView('month') }} className={`${currentView == "month" ? "btn-actif" : ""}`}>Jours ferries</button>
          <button type="button" onClick={() =>{ onView('work_week') }} className={`${currentView == "month" ? "" : "btn-actif"}`}>Conges actifs</button>
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg p-4 rounded-md m-4 flex-1">
      <Calendar className="calendrier"
        localizer={localizer}
        events={currentView == "work_week" ? events : []}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month', 'work_week', "agenda"]}
        view={currentView}
        onView={handleViewChange}
        date={currentDate}
        onNavigate={handleNavigate}
        popup={true}
        onSelectSlot={({ start }) => handleSelectDate(start, currentView)}
        selectable
        components={{
          toolbar: (props) => CustomToolbar(props),
          eventWrapper: ({ event, children }) => (
            <div onClick={() => handleExtraEvents([event])}>
              {children}
            </div>
          ),
          eventContainerWrapper: ({ children, event }) => (
            <div onClick={() => handleExtraEvents(event.events || [event])}>
              {children}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default MyBigCalendar;