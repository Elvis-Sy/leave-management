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
    start: new Date(2024, 8, 1),
    end: new Date(2024, 8, 4),
    allDay: true,
  },
  {
    title: 'Meeting',
    start: new Date(2024, 8, 6),
    end: new Date(2024, 8, 6),
    allDay: false,
  },
];

const MyBigCalendar = () => {

  const [currentView, setCurrentView] = useState('month'); // Gestion de la vue actuelle
  const [currentDate, setCurrentDate] = useState(new Date()); // Gestion de la date actuelle

  const handleViewChange = (view) => {
    setCurrentView(view);
  };
  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const CustomToolbar = (props) => {
    const { onNavigate, onView, label } = props;

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={() => onNavigate('PREV')}>Précédent</button>
          <button type="button" onClick={() => onNavigate('TODAY')}>Aujourd'hui</button>
          <button type="button" onClick={() => onNavigate('NEXT')}>Suivant</button>
        </span>
        <span className="rbc-toolbar-label">{label}</span>
        <span className="rbc-btn-group">
          <button type="button" onClick={() => onView('month')}>Mois</button>
          <button type="button" onClick={() => onView('week')}>Semaine</button>
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-lg p-4 rounded-md m-4 flex-1">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month', 'week']}
        view={currentView}
        onView={handleViewChange}
        date={currentDate}
        onNavigate={handleNavigate}
        popup={true}
        components={{ toolbar:(props)=> CustomToolbar(props) }}
      />
    </div>
  );
};

export default MyBigCalendar;