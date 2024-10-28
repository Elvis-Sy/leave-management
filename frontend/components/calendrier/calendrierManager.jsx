"use client"

import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import {Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/fr';
import axios from 'axios';

moment.locale('fr'); // Changer la langue en français
const localizer = momentLocalizer(moment);

const CalendrierManager = () => {

    const [actif, setActif] = useState([])
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(()=>{
        const id = localStorage.getItem('id')
        allConge(id)
    }, [])


    const handleNavigate = (date) => {
        setCurrentDate(date);
    };

    //Prendre les donnees
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



  const CustomToolbar = (props) => {
    const { onNavigate, label } = props;

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group font-semibold">
          <button type="button" onClick={() =>{ onNavigate('PREV') }}>Précédent</button>
          <button type="button" onClick={() =>{ onNavigate('TODAY') }}>Aujourd'hui</button>
          <button type="button" onClick={() =>{ onNavigate('NEXT') }}>Suivant</button>
        </span>
        <span className="rbc-toolbar-label text-xl">{label}</span>
      </div>
    );
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
    let color;
    switch (event.type) {
      case 'Paye':
        backgroundColor = 'lightyellow';
        color = 'black';
        break;
      case 'Paternite':
        backgroundColor = 'lightblue';
        color = 'white';
        break;
      case 'Maladie':
        backgroundColor = 'lightcoral';
        color = 'white';
        break;
      case 'Maternite':
        backgroundColor = 'lightsalmon';
        color = 'black';
        break;
      default:
        backgroundColor = '#228be6';
        color = 'black';
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        fontWeight: 500,
        border: '1px solid gray',
        display: 'block',
        color
      },
    };
  };


  return (
    <div className='m-4 my-8'>
        <div className="flex gap-4 mb-4">
            <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-[#add8e6] rounded-full"></div>
                <span>Congé paternité</span>
            </div>
            <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-[#f08080] rounded-full"></div>
                <span>Congé maladie</span>
            </div>
            <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-[#ffa07a] rounded-full"></div>
                <span>Congé maternité</span>
            </div>
            <div className="flex gap-2 items-center">
                <div className="w-4 h-4 bg-[#ffffe0] rounded-full"></div>
                <span>Congé payé</span>
            </div>
        </div>
        <div className="bg-default-50 shadow-md p-4 rounded-md">
            <Calendar className="conge z-20"
                localizer={localizer}
                events={actif}
                startAccessor="start"
                endAccessor="end"
                date={currentDate}
                style={{ height: 500 }}
                views={['work_week']}
                view={'work_week'}
                popup={true}
                onNavigate={handleNavigate}
                eventPropGetter={eventStyleGetter}
                selectable
                components={{
                toolbar: (props) => CustomToolbar(props),
                eventWrapper: ({ event, children }) => (
                    <Popover placement='top' showArrow={true} className='sort'>
                        <PopoverTrigger>
                        {children}
                        </PopoverTrigger>
                        <PopoverContent className='flex w-full flex-col justify-start gap-2 p-4 border border-gray-300'>
                            <p className='w-full  font-semibold text-gray-500'>Employe: <span className='dark:text-white text-black'>{event.title}</span></p>
                            <p className='w-full text-gray-500 font-semibold'>Type: <span className='dark:text-white text-black'>Congé {event.type}</span></p>
                            <p className='w-full text-gray-500 font-semibold'>Du <span className='dark:text-white text-black'>{moment(event.start).format('DD MMMM YYYY')}</span> au <span className='dark:text-white text-black'>{moment(event.end).format('DD MMMM YYYY')}</span></p>            
                        </PopoverContent>
                    </Popover>
                ),
                
                }}
            />
        </div>
    </div>
  )
}

export default CalendrierManager