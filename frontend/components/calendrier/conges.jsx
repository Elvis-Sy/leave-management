"use client"

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Popover, PopoverContent, PopoverTrigger, Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/fr';
import axios from 'axios';

moment.locale('fr'); // Changer la langue en français
const localizer = momentLocalizer(moment);

const Conges = () => {
    const [actif, setActif] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [etab, setEtab] = useState([]);
    const [etablissement, setEtablissement] = useState(null);

    const fetchEtablissements = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/details/etablissement', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setEtab(response.data.etabi);
        } catch (error) {
            console.error("Erreur lors de la récupération des établissements:", error);
            setEtab([]);
        }
    }, []);

    const fetchConge = useCallback(async (etablissement = '') => {
        try {
            const endpoint = etablissement ? `http://localhost:5000/api/demandes/congeFiltre?etablissement=${encodeURIComponent(etablissement)}` : 'http://localhost:5000/api/demandes/events';
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const events = response.data.demande.map(conge => ({
                title: `${conge.employe.nom}${conge.employe.prenom ? ' ' + conge.employe.prenom : ''}`,
                type: conge.type.designType,
                allDay: false,
                start: new Date(conge.dateDebut),
                end: new Date(conge.dateFin),
            }));

            setActif(events);
        } catch (error) {
            console.error('Erreur lors de la récupération des congés:', error.response?.data || error.message);
            setActif([]);
        }
    }, []);

    useEffect(() => {
        fetchEtablissements();
        fetchConge();
    }, [fetchEtablissements, fetchConge]);

    const handleEtablissementSelect = (obj) => setEtablissement(obj);
    
    const handleFiltrer = () => fetchConge(etablissement);

    const handleNavigate = (date) => setCurrentDate(date);

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

    const eventStyleGetter = (event) => {
        const styleMapping = {
            'Paye': { backgroundColor: 'lightyellow', color: 'black' },
            'Paternite': { backgroundColor: 'lightblue', color: 'white' },
            'Maladie': { backgroundColor: 'lightcoral', color: 'white' },
            'Maternite': { backgroundColor: 'lightsalmon', color: 'black' },
        };

        const { backgroundColor, color } = styleMapping[event.type] || { backgroundColor: '#228be6', color: 'black' };
        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                fontWeight: 500,
                border: '1px solid gray',
                display: 'block',
                color,
            },
        };
    };

    return (
        <div className='m-4 my-10'>
            <div className="flex items-center justify-between my-4">
                <div className="flex gap-4">
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

                {/* FILTER */}
                <Popover placement="left" showArrow={true} className="filter2">
                    <PopoverTrigger>
                        <button type="button" className="flex items-center px-4 py-1 bg-[#0070f0] gap-4 rounded-lg">
                            <img src="/filter.png" alt="" width={20} height={20} />
                            <span className='text-lg text-white font-semibold'>Filtrer</span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 flex flex-col gap-3">
                        {/* Filtrage par établissement */}
                        <Autocomplete
                            variant="bordered"
                            label="Etablissement"
                            placeholder="Recherche de poste"
                            className="w-full font-semibold auto"
                            items={etab}
                            selectedKey={etablissement?.value}
                            onSelectionChange={handleEtablissementSelect}
                        >
                            {(item) => (
                                <AutocompleteItem key={item.value} value={item.value}>
                                    {item.label}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>
                        <Button variant="flat" className="w-full" color="primary" onPress={handleFiltrer}>Filtrer</Button>
                    </PopoverContent>
                </Popover>
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
                        toolbar: CustomToolbar,
                        eventWrapper: ({ event, children }) => (
                            <Popover placement='top' showArrow={true} className='sort'>
                                <PopoverTrigger>
                                    {children}
                                </PopoverTrigger>
                                <PopoverContent className='flex w-full flex-col justify-start gap-2 p-4 border border-gray-300'>
                                    <p className='w-full font-semibold text-gray-500'>Employe: <span className='dark:text-white text-black'>{event.title}</span></p>
                                    <p className='w-full text-gray-500 font-semibold'>Type: <span className='dark:text-white text-black'>Congé {event.type}</span></p>
                                    <p className='w-full text-gray-500 font-semibold'>Du <span className='dark:text-white text-black'>{moment(event.start).format('DD MMMM YYYY')}</span> au <span className='dark:text-white text-black'>{moment(event.end).format('DD MMMM YYYY')}</span></p>
                                </PopoverContent>
                            </Popover>
                        ),
                    }}
                />
            </div>
        </div>
    );
};

export default Conges;