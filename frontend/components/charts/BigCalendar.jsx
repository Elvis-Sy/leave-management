import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useEffect, useState } from 'react';
import 'moment/locale/fr';
import axios from 'axios';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';

moment.locale('fr');

const localizer = momentLocalizer(moment);

const BigCalendar = ({ id }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [actif, setActif] = useState([]);

    useEffect(() => {
        fetchCongeData(id);
    }, [id]);

    // Récupération des données des congés
    const fetchCongeData = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/demandes/event/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const events = response.data.demande.map(conge => ({
                title: conge.employe.prenom ? `${conge.employe.nom} ${conge.employe.prenom}` : conge.employe.nom,
                type: conge.type.designType,
                allDay: false,
                start: new Date(conge.dateDebut),
                end: new Date(conge.dateFin),
            }));

            setActif(events);
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
            setActif([]);
        }
    };

    // Navigation dans le calendrier
    const handleNavigate = (date) => {
        setCurrentDate(date);
    };

    // Définition des styles selon le type de congé
    const getEventStyle = (event) => {
        const eventStyles = {
            Paye: 'lightyellow',
            Paternite: 'lightblue',
            Maladie: 'lightcoral',
            Maternite: 'lightsalmon',
        };
        return {
            style: {
                backgroundColor: eventStyles[event.type] || '#228be6',
                borderRadius: '5px',
                opacity: 0.9,
                fontWeight: 500,
                color: 'black',
                border: '1px solid gray',
                display: 'block',
            },
        };
    };

    return (
        <Calendar
            localizer={localizer}
            events={actif}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '90%' }}
            views={['work_week']}
            date={currentDate}
            view="work_week"
            onNavigate={handleNavigate}
            className="Bigcalendar"
            popup={true}
            eventPropGetter={getEventStyle}
            components={{
                eventWrapper: ({ event, children }) => (
                    <Popover placement='right' showArrow className='sort'>
                        <PopoverTrigger>
                            {children}
                        </PopoverTrigger>
                        <PopoverContent className='flex w-full dark:bg-gray-100 flex-col justify-start gap-2 p-4 border border-gray-300'>
                            <p className='w-full font-semibold text-gray-500'>Employé: <span className='text-black'>{event.title}</span></p>
                            <p className='w-full text-gray-500 font-semibold'>Type: <span className='text-black'>Congé {event.type}</span></p>
                            <p className='w-full text-gray-500 font-semibold'>Du <span className='text-black'>{moment(event.start).format('DD MMMM YYYY')}</span> au <span className='text-black'>{moment(event.end).format('DD MMMM YYYY')}</span></p>
                        </PopoverContent>
                    </Popover>
                ),
            }}
        />
    );
};

export default BigCalendar;