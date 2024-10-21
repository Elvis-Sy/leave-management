"use client"

import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import {Popover, PopoverContent, PopoverTrigger, Modal } from '@nextui-org/react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/fr';
import axios from 'axios';
import FerrierModal from '../modals/ferrierModal'
import ModifFerrier from '../modals/modifFerrier'
import RetirerFerrier from '../modals/retirerFerrier'
import { ToastContainer } from 'react-toastify';

moment.locale('fr'); // Changer la langue en français
const localizer = momentLocalizer(moment);

const Ferries = () => {

    const [currentDate, setCurrentDate] = useState(new Date()); // Gestion de la date actuelle
    const [selectedDate, setSelectedDate] = useState(null); // Date sélectionnée
    const [openModal, setOpenModal] = useState(null);
    const [ferrier, setFerrier] = useState([])
    const [id, setId] = useState()

    useEffect(()=>{
        allFerrier()
    }, [])

    //Ouvertur modal
    const onOpen = (modalId) => {
        setOpenModal(modalId);
    };

    //Fermeture modal
    const onClose = () => {
        setOpenModal(null);
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

  //Lors du clique de la date elle-meme
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    onOpen('ferrierModal')
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


  return (
    <div className="bg-default-50 shadow-md p-4 rounded-md m-4 my-10">
      <ToastContainer/>
      <Calendar className="calendrier z-20"
        localizer={localizer}
        events={ferrier}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month']}
        view={'month'}
        popup={true}
        date={currentDate}
        onNavigate={handleNavigate}
        onSelectSlot={({ start }) => handleSelectDate(start)}
        selectable
        components={{
          toolbar: (props) => CustomToolbar(props),
          eventWrapper: ({ event, children }) => (
            <Popover placement='right' showArrow={true} className='sort'>
              <PopoverTrigger>
                {children}
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-4 border border-[#228be6] z-50' onClick={(e) => e.stopPropagation()}>
                <div className="flex w-full">
                  <p className='text-left font-semibold text-gray-500'>
                    Titre: <span className='font-normal dark:text-white text-black'>{event.title}</span>
                  </p>
                </div>
                <div className='mt-2 w-full'>
                  <p className='text-gray-500 font-semibold'>Description:</p>
                  <p>{event.description ? event.description : '--/--'}</p>
                </div>
                <div className="w-full flex items-center justify-end gap-1 mt-2 border-t border-[#228be6]">
                  <button onClick={() => { setId(event.id); onOpen('modifModal') }} className="w-8 h-8 flex items-center justify-center rounded-full">
                    <img src="/modif.png" alt="modify" width={20} height={20}/>
                  </button>
                  <button onClick={() => { setId(event.id); onOpen('retirerModal'); }} className="w-8 h-8 flex items-center justify-center rounded-full">
                    <img src="/retirer.png" alt="delete" width={20} height={20}/>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
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
  )
}

export default Ferries