"use client"

import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import {Popover, PopoverContent, PopoverTrigger, Modal } from '@nextui-org/react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/fr';
import FerrierModal from '../../../modals/ferrierModal'
import axios from 'axios';
import RetirerFerrier from '../../../modals/retirerFerrier'
import ModifFerrier from '../../../modals/modifFerrier'

moment.locale('fr'); // Changer la langue en français
const localizer = momentLocalizer(moment);


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
  const [openModal, setOpenModal] = useState(null);
  const [ferrier, setFerrier] = useState([])
  const [id, setId] = useState()
  const [actif, setActif] = useState([])

  useEffect(()=>{
    allFerrier()
    allConge()
  }, [])

  //Ouvertur modal
  const onOpen = (modalId) => {
    setOpenModal(modalId);
  };

  //Fermeture modal
  const onClose = () => {
    setOpenModal(null);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  //Prendre les donnees
  const allFerrier = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ferrier/event', {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });

      setFerrier(response.data.ferrie)

    } catch (error) {
        setFerrier([])
        console.error('Erreur lors de la requête:', error.response?.data || error.message);
    }
  };
  
  //Prendre les donneesd des conges
  const allConge = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/demandes/event', {
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

  //Lors du clique de la date elle-meme
  const handleSelectDate = (date, view) => {
    if(view == "month"){
      setSelectedDate(date);
      onOpen('ferrierModal')
    }
  };

  //Lors du clique des slots dans les +2 more
  // const handleExtraEvents = (events) => {
  //   const eventDetails = events.map(event => `${event.title} - du ${moment(event.start).format('DD MMMM YYYY')} au ${moment(event.end-1).format('DD MMMM YYYY')}`).join('\n');
  //   // alert(`Événements supplémentaires :\n${eventDetails}`);
  // };

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
        opacity: 0.8,
        color: 'black',
        border: '1px solid gray',
        display: 'block',
      },
    };
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
        events={currentView == "work_week" ? actif : ferrier}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month', 'work_week']}
        view={currentView}
        onView={handleViewChange}
        date={currentDate}
        onNavigate={handleNavigate}
        popup={true}
        eventPropGetter={currentView == "work_week" ? eventStyleGetter : null}
        onSelectSlot={({ start }) => handleSelectDate(start, currentView)}
        selectable
        components={{
          toolbar: (props) => CustomToolbar(props),
          eventWrapper: ({ event, children }) => (
            <div>
              {currentView == 'month' ? (
                <Popover placement='right' showArrow={true} className='sort'>
                  <PopoverTrigger>
                    {children}
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-4 border border-[#228be6]'>
                    <div className="flex w-full">
                      <p className='text-left font-semibold text-gray-500'>Titre: <span className='font-normal text-black'>{event.title}</span></p>
                    </div>
                    <div className='mt-2 w-full'>
                      <p className='text-gray-500 font-semibold'>Description:</p>
                      <p>
                        {event.description ? event.description : '--/--'}
                      </p>
                    </div>
                    <div className="w-full flex items-center justify-end gap-1 mt-2 border-t border-[#228be6]">
                      <button onClick={()=>{ setId(event.id); onOpen('modifModal') }} className="w-8 h-8 flex items-center justify-center rounded-full">
                        <img src="/modif.png" alt="" width={20} height={20}/>
                      </button>
                      <button onClick={()=>{ setId(event.id); onOpen('retirerModal') }} className="w-8 h-8 flex items-center justify-center rounded-full">
                        <img src="/retirer.png" alt="" width={20} height={20}/>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover> ) : (
                <Popover placement='top' showArrow={true} className='sort'>
                  <PopoverTrigger>
                    {children}
                  </PopoverTrigger>
                  <PopoverContent className='flex w-full flex-col justify-start gap-2 p-4 border border-gray-300'>
                      <p className='w-full font-semibold text-gray-500'>Employe: <span className='text-black'>{event.title}</span></p>
                      <p className='w-full text-gray-500 font-semibold'>Type: <span className='text-black'>Congé {event.type}</span></p>
                      <p className='w-full text-gray-500 font-semibold'>Du <span className='text-black'>{moment(event.start).format('DD MMMM YYYY')}</span> au <span className='text-black'>{moment(event.end).format('DD MMMM YYYY')}</span></p>            
                  </PopoverContent>
                </Popover>
                )}
            </div>
          ),
          eventContainerWrapper: ({ children, event }) => (
            <div onClick={() => handleExtraEvents(event.events || [event])}>
                {children}
            </div>
          ),
        }}
      />

      <Modal isOpen={openModal == "ferrierModal"} onClose={onClose} size="sm">
        <FerrierModal onClose={onClose} date={selectedDate} reload={allFerrier}/>
      </Modal>

      <Modal isOpen={openModal == "retirerModal"} onClose={onClose} size="sm">
        <RetirerFerrier onClose={onClose} id={id} reload={allFerrier}/>
      </Modal>

      <Modal isOpen={openModal == "modifModal"} onClose={onClose} size="sm">
        <ModifFerrier onClose={onClose} id={id} reload={allFerrier}/>
      </Modal>


    </div>
  );
};

export default MyBigCalendar;