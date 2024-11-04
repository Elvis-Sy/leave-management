"use client";

import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Popover, PopoverContent, PopoverTrigger, Modal } from '@nextui-org/react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/fr';
import axios from 'axios';
import FerrierModal from '../modals/ferrierModal';
import ModifFerrier from '../modals/modifFerrier';
import RetirerFerrier from '../modals/retirerFerrier';
import { ToastContainer } from 'react-toastify';

moment.locale('fr');
const localizer = momentLocalizer(moment);

const Ferries = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [ferrier, setFerrier] = useState([]);
  const [id, setId] = useState();

  useEffect(() => {
    fetchFerries();
  }, []);

  const fetchFerries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ferrier/event', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFerrier(response.data.ferrie || []);
    } catch (error) {
      console.error('Erreur lors de la requête:', error.response?.data || error.message);
      setFerrier([]);
    }
  };

  const handleModalOpen = (modalId, eventId = null) => {
    setId(eventId);
    setOpenModal(modalId);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    handleModalOpen('ferrierModal');
  };

  const CustomToolbar = ({ onNavigate, label }) => (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group font-semibold">
        <button type="button" onClick={() => onNavigate('PREV')}>Précédent</button>
        <button type="button" onClick={() => onNavigate('TODAY')}>Aujourd'hui</button>
        <button type="button" onClick={() => onNavigate('NEXT')}>Suivant</button>
      </span>
      <span className="rbc-toolbar-label text-xl">{label}</span>
    </div>
  );

  return (
    <div className="bg-default-50 shadow-md p-4 rounded-md m-4 my-10">
      <ToastContainer />
      <Calendar
        className="calendrier z-20"
        localizer={localizer}
        events={ferrier}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month']}
        view={'month'}
        popup
        date={currentDate}
        onNavigate={setCurrentDate}
        onSelectSlot={({ start }) => handleSelectDate(start)}
        selectable
        components={{
          toolbar: CustomToolbar,
          eventWrapper: ({ event, children }) => (
            <Popover placement='right' showArrow className='sort'>
              <PopoverTrigger>{children}</PopoverTrigger>
              <PopoverContent className='w-[200px] p-4 border border-[#228be6] z-50' onClick={(e) => e.stopPropagation()}>
                <div className="flex w-full">
                  <p className='text-left font-semibold text-gray-500'>
                    Titre: <span className='font-normal dark:text-white text-black'>{event.title}</span>
                  </p>
                </div>
                <div className='mt-2 w-full'>
                  <p className='text-gray-500 font-semibold'>Description:</p>
                  <p>{event.description || '--/--'}</p>
                </div>
                <div className="w-full flex items-center justify-end gap-1 mt-2 border-t border-[#228be6]">
                  <button onClick={() => handleModalOpen('modifModal', event.id)} className="w-8 h-8 flex items-center justify-center rounded-full">
                    <img src="/modif.png" alt="modify" width={20} height={20} />
                  </button>
                  <button onClick={() => handleModalOpen('retirerModal', event.id)} className="w-8 h-8 flex items-center justify-center rounded-full">
                    <img src="/retirer.png" alt="delete" width={20} height={20} />
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ),
        }}
      />

      <Modal isOpen={openModal === "ferrierModal"} onClose={() => setOpenModal(null)} size="sm">
        <FerrierModal onClose={() => setOpenModal(null)} date={selectedDate} reload={fetchFerries} />
      </Modal>

      <Modal isOpen={openModal === "retirerModal"} onClose={() => setOpenModal(null)} size="sm">
        <RetirerFerrier onClose={() => setOpenModal(null)} id={id} reload={fetchFerries} />
      </Modal>

      <Modal isOpen={openModal === "modifModal"} onClose={() => setOpenModal(null)} size="sm">
        <ModifFerrier onClose={() => setOpenModal(null)} id={id} reload={fetchFerries} />
      </Modal>
    </div>
  );
};

export default Ferries;