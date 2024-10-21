import {Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment' 
import { useEffect, useState } from 'react'
import 'moment/locale/fr';
import axios from 'axios';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';

moment.locale('fr');

const localizer = momentLocalizer(moment)

const BigCalendar = ({id}) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [actif, setActif] = useState([])

    useEffect(()=>{
      allConge(id)
    }, [id])

    //Prendre les donneesd des conges
    const allConge = async (id) => {
      try {
      const response = await axios.get(`http://localhost:5000/api/demandes/event/${id}`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });
      const conges = response.data.demande;

      const events = conges.map(conge => ({
          title: conge.employe.prenom ? `${conge.employe.nom} ${conge.employe.prenom}` : conge.employe.nom,
          type: conge.type.designType,  
          allDay: false,             
          start: new Date(conge.dateDebut), 
          end: new Date(conge.dateFin),     
      }));

      setActif(events)

      } catch (error) {
          setActif([])
          console.error('Erreur lors de la requête:', error.response?.data || error.message);
      }
    };

    //Navigation
    const handleNavigate = (date) => {
        setCurrentDate(date);
    };

    //Choix des couleur selon le type de conge
    const eventStyleGetter = (event) => {
      let backgroundColor;
      switch (event.type) {
        case 'Paye':
          backgroundColor = 'lightyellow';
          break;
        case 'Paternite':
          backgroundColor = 'lightblue';
          break;
        case 'Maladie':
          backgroundColor = 'lightcoral';
          break;
        case 'Maternite':
          backgroundColor = 'lightsalmon';
          break;
        default:
          backgroundColor = '#228be6';
      }
      return {
        style: {
          backgroundColor,
          borderRadius: '5px',
          opacity: 0.9,
          fontWeight: 500,
          color: 'black',
          border: '1px solid gray',
          display: 'block',
        },
      };
    };


  // //Lors du clique des slots dans les +2 more
  // const handleExtraEvents = (events) => {
  //   const eventDetails = events.map(event => `${event.title} - du ${moment(event.start).format('DD MMMM YYYY')} au ${moment(event.end-1).format('DD MMMM YYYY')}`).join('\n');
  //   alert(`Événements supplémentaires :\n${eventDetails}`);
  // };

  return (
    <Calendar
        localizer={localizer}
        events={actif}
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
              <Popover placement='right' showArrow={true} className='sort'>
                  <PopoverTrigger>
                    {children}
                  </PopoverTrigger>
                  <PopoverContent className='flex w-full dark:bg-gray-100 flex-col justify-start gap-2 p-4 border border-gray-300'>
                      <p className='w-full font-semibold text-gray-500'>Employe: <span className='text-black'>{event.title}</span></p>
                      <p className='w-full text-gray-500 font-semibold'>Type: <span className='text-black'>Congé {event.type}</span></p>
                      <p className='w-full text-gray-500 font-semibold'>Du <span className='text-black'>{moment(event.start).format('DD MMMM YYYY')}</span> au <span className='text-black'>{moment(event.end).format('DD MMMM YYYY')}</span></p>            
                  </PopoverContent>
              </Popover>
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