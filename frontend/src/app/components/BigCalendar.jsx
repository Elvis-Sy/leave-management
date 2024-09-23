import {Calendar, momentLocalizer, Views} from 'react-big-calendar'
import moment from 'moment' 
import { useState } from 'react'
import 'moment/locale/fr';

moment.locale('fr');

const localizer = momentLocalizer(moment)

const events =[
    {   
        type: "Réunion",
        title: "Réunion",
        allDay: false,
        start: new Date(2024, 8, 18),
        end: new Date(2024, 8, 20),
    },
    {
        title: "Hello word",
        type: "Physics",
        allDay: false,
        start: new Date(2024, 8, 13),
        end: new Date(2024, 8, 13),
    },
    {
        title: "Réunion",
        type: "Réunion",
        allDay: false,
        start: new Date(2024, 8, 18),
        end: new Date(2024, 8, 18),
    },
    {
        title: "Formation",
        type: "Formation",
        allDay: false,
        start: new Date(2024, 8, 19),
        end: new Date(2024, 8, 19),
    },
    {
        title: "Déjeuner",
        type: "Déjeuner",
        allDay: false,
        start: new Date(2024, 8, 19),
        end: new Date(2024, 8, 18),
    },
    {
        title: "Réunion",
        type: "Réunion",
        allDay: false,
        start: new Date(2024, 8, 20),
        end: new Date(2024, 8, 20),
    },
    {
        title: "Math",
        type: "Math",
        allDay: false,
        start: new Date(2024, 8, 20),
        end: new Date(2024, 8, 20),
    },
    {
        title: "Déjeuner",
        type: "Déjeuner",
        allDay: false,
        start: new Date(2024, 8, 18),
        end: new Date(2024, 8, 18),
    },
    {
        title: "Formation",
        type: "Formation",
        allDay: false,
        start: new Date(2024, 8, 22),
        end: new Date(2024, 8, 22),
    },
    {
        title: "Déjeuner",
        type: "Déjeuner",
        allDay: false,
        start: new Date(2024, 8, 18),
        end: new Date(2024, 8, 18),
    },
    {
        title: "Formation",
        type: "Formation",
        allDay: false,
        start: new Date(2024, 8, 18),
        end: new Date(2024, 8, 18),
    },
    {
        title: "Formation",
        type: "Formation",
        allDay: false,
        start: new Date(2024, 8, 19),
        end: new Date(2024, 8, 24),
    },
]

const BigCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())

    //Navigation
    const handleNavigate = (date) => {
        setCurrentDate(date);
    };

    //Choix des couleur selon le type de conge
    const eventStyleGetter = (event) => {
        let backgroundColor;
        switch (event.type) {
          case 'Réunion':
            backgroundColor = 'lightblue';
            break;
          case 'Formation':
            backgroundColor = 'lightgreen';
            break;
          case 'Déjeuner':
            backgroundColor = 'lightcoral';
            break;
          default:
            backgroundColor = 'lightgrey';
        }
        return {
          style: {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'black',
            border: 'none',
            display: 'block',
          },
        };
      };

    //Lors du clique de la date elle-meme
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    alert(`Date sélectionnée: ${moment(date).format('DD MMMM YYYY')}`);
  };

  //Lors du clique des slots dans les +2 more
  const handleExtraEvents = (events) => {
    const eventDetails = events.map(event => `${event.title} - du ${moment(event.start).format('DD MMMM YYYY')} au ${moment(event.end-1).format('DD MMMM YYYY')}`).join('\n');
    alert(`Événements supplémentaires :\n${eventDetails}`);
  };

  return (
    <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{height: "90%"}}
        views={["work_week"]}
        date={currentDate}
        view="work_week"
        onNavigate={handleNavigate}
        className="Bigcalendar"
        popup="true"
        eventPropGetter={eventStyleGetter}
        components={{
            // toolbar: (props) => CustomToolbar(props),
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
  )
}

export default BigCalendar