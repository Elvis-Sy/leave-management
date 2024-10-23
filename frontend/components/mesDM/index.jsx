"use client"

import React, { useState, useEffect, useRef } from 'react'
import { DateRangePicker, Autocomplete, AutocompleteItem, Button, Modal, ModalContent, ModalHeader, ModalFooter, useDisclosure, ModalBody, Divider, Pagination } from '@nextui-org/react'
import { useForm } from 'react-hook-form';
import { format, differenceInDays, addDays } from 'date-fns';
import { RenderCell } from '../table/render-Dm'
import { colDemandes } from '../table/data';
import { TableWrapper } from '../table/table';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';
import { toast, ToastContainer } from 'react-toastify';

moment.locale('fr');

const MesDemandes = () => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const { register, formState: { errors }, handleSubmit } = useForm()
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState([]);
  const [dayDifference, setDayDifference] = useState(null);
  const [maternite, setMaternite] = useState(false)
  const [selectedType, setSelectedType] = useState({});
  const [label, setLabel] = useState('');
  const [row, setRow] = useState([])
  const formRef = useRef();
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5
  

  useEffect(()=>{
    const id = localStorage.getItem('id');
    if(id){
        allDM(id)
    }
    getType();
    
  }, [])

  //Prendre les donnees
  const allDM = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/demandes/employeDM/${id}`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });

      setRow(response.data.demande)

    } catch (error) {
        console.error('Erreur lors de la requête:', error.response?.data || error.message);
        setRow([])
    }
  };

  // Gestion de la soumission du formulaire
  const onSubmit = async (data) => {
    try {
        data.typeId = selectedType.value
        data.dateDebut = new Date(startDate)
        data.dateFin = new Date(endDate)
        data.employeId = Number(localStorage.getItem('id'))
      
      const response = await axios.post('http://localhost:5000/api/demandes/ajout', data, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
      });

      if(response.data.cause){
        toast.warn(`${response.data.cause}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        onClose()
      } else {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        allDM()
        onClose()          
      }
  
    } catch (error) {
        console.error('Erreur lors de la soumission du formulaire :', error);
    }
    
  };

  // Calculer la différence en jours
  useEffect(() => {
    if (startDate && endDate) {
      const diff = differenceInDays(new Date(endDate), new Date(startDate));
      setDayDifference(diff+1);
    }
  }, [startDate, endDate]);

  const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : '';
  const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : '';

  // Handle date selection
  const handleDateSelect = (range) => {
    if(range){
        if(label == "Maternite"){
            const x = new Date(range.start)
            const fin = addDays(x, selectedType.duree-1)
            setStartDate(range.start);
            setEndDate(fin)
        } else {
            setStartDate(range.start);
            setEndDate(range.end);
        }
    }
  };

  const handleTypeSelect = (obj) => {
    const select = type.find((item)=>item.value == obj)
    if(select){
        select.label == "Maternite" ? setMaternite(true) : setMaternite(false);
        setLabel(select.label)
    } else {
        setLabel('')
    }
    setSelectedType(select)
  };

  //Type Conge
  const getType = async ()=> {
    try {

      const response = await axios.get('http://localhost:5000/api/details/types');

      setType(response.data.type)

    } catch (error) {
      console.error("Error listage departments:", error);
      setType([])
    }
  }

  //Gestion de la pagination et des pages
    //Calcul des nombres de pages
    let totalPages = 1;
    if(row){
        totalPages = Math.ceil(row.length / rowsPerPage)
    }
    
    //Diviser les donnes selon le nombre de page
    let paginatedData = [];
    if(row){
        paginatedData = row.slice(
            (currentPage - 1) * rowsPerPage, 
            currentPage * rowsPerPage
        ) 
    }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  return (
    <div className="my-6 px-4 lg:px-6 flex flex-col gap-4">
      <ToastContainer/>
      <div className="p-4 bg-default-50 rounded-lg shadow-sm">
        <h1 className='text-xl font-semibold'>Demande de congé</h1>
        <form onSubmit={handleSubmit(onSubmit)} ref={formRef} className='mt-8 flex flex-col lg:flex-row gap-4'>
            <Autocomplete
            variant="bordered"
            isRequired
            label="Type de congé"
            labelPlacement="outside"
            placeholder="Selectionnez type..."
            className="w-full font-semibold auto max-w-[250px]"
            items={type}
            {...register('typeId', { required: 'Champ requis' })}
            selectedKey={type?.value}
            onSelectionChange={handleTypeSelect}
            isInvalid={!!errors.typeId}
            errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.typeId ? errors.typeId.message : ''}</span>}
            >
            {(item) => (
                <AutocompleteItem key={item.value} value={item.value}>
                {item.label}
                </AutocompleteItem>
            )}
            </Autocomplete>


            <div className="flex flex-col lg:flex-row lg:items-center">

                <div className='h-full flex items-center p-2'>
                    <DateRangePicker
                        aria-label='range'
                        range
                        visibleMonths={maternite ? 1 : 2}
                        onChange={handleDateSelect}
                        initialVisibleMonth={new Date()}
                        rangeSeparator=" to "
                        classNames={{
                        timeInputLabel: 'hidden',
                        input: 'hidden',
                        separator: 'hidden',
                        timeInput: 'hidden',
                        inputWrapper: 'bg-transparent w-fit hover:bg-transparent active:bg-transparent shadow-none',
                        innerWrapper: 'w-fit bg-transparent'
                        }}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="mb-4">
                        <label className={`block dark:text-white ${errors.dateDebut ? 'text-[#f31260]' : 'text-black'} text-sm mb-1 font-semibold`}>
                            Date de debut <span className="text-red-500 text-sm">*</span>
                        </label>
                        <div className={`group relative border-2 p-2 rounded-xl ${errors.dateDebut ? 'border-[#f31260] focus-within:border-[#f31260] focus-within:ring-1 focus-within:ring-[#f31260]' : 'focus-within:border-[#bbcafc] focus-within:ring-1 focus-within:ring-[#bbcafc] border-gray-300/50'}`}>
                            <input 
                            type="date" 
                            value={formattedStartDate} 
                            className="block dark:text-white w-full text-gray-700 placeholder-gray-300 focus:outline-none bg-transparent text-sm" 
                            required 
                            {...register('dateDebut', { 
                                required: "Date de debut requise", 
                                setValueAs: (value) => new Date(value),
                            })}
                            />
                        </div>
                        <span className="flex justify-start text-[#f31260] text-xs text-right">{errors.dateDebut ? errors.dateDebut.message : ''}</span>
                    </div>

                    <div>
                        <label className={`block dark:text-white ${errors.dateFin ? 'text-[#f31260]' : 'text-black'} text-sm mb-1 font-semibold`}>
                            Date de fin <span className="text-red-500 text-sm">*</span>
                        </label>
                        <div className={`group relative border-2 p-2 rounded-xl ${errors.dateFin ? 'border-[#f31260] focus-within:border-[#f31260] focus-within:ring-1 focus-within:ring-[#f31260]' : 'focus-within:border-[#bbcafc] focus-within:ring-1 focus-within:ring-[#bbcafc] border-gray-300/50'}`}>
                            <input 
                            type="date" 
                            value={formattedEndDate}
                            className="block dark:text-white w-full text-gray-700 placeholder-gray-300 focus:outline-none bg-transparent text-sm" 
                            required 
                            {...register('dateFin', { 
                                required: "Date de fin requise", 
                                setValueAs: (value) => new Date(value),
                            })}
                            />
                        </div>
                        <span className="flex justify-start text-[#f31260] text-xs text-right">{errors.dateFin ? errors.dateFin.message : ''}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col ml-4 min-w-[120px]">
                <label className="text-sm mb-1 font-semibold text-black dark:text-white">
                    Durée du congé
                </label>
                <div className="p-2 text-sm font-semibold">
                    {dayDifference ? `${dayDifference} jour${dayDifference > 1 ? 's' : ''}` : '-/-'}
                </div>
            </div>

            <div className="h-full mt-4 flex items-center">
                <div className="flex gap-4">
                    <Button variant='flat' color='primary' onPress={onOpen}>Envoyer</Button>
                    <Button variant='light' color='danger' type='reset' onPress={()=>{setStartDate(''); setEndDate(''); setDayDifference('')}}>Reset</Button>
                </div>
            </div>
        </form>
      </div>

      <div className="flex flex-col gap-2">
        <div className="max-w-[95rem] mx-auto w-full">
            <TableWrapper RenderCell={RenderCell} columns={colDemandes} users={paginatedData}/>
        </div>
        {/* PAGINATION */}
        <div className="mt-4 flex justify-center">
            <Pagination 
            loop showControls
            total={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            variant="faded" 
            className="rounded-md"/>
        </div>
      </div>


      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
            {(onClose) => (
            <>
                <ModalHeader className='flex gap-2 bg-bleuspat text-white justify-center'>Demande de congé</ModalHeader>
                <ModalBody>
                    <div className="grid py-2 grid-flow-col grid-rows-3 justify-between md:justify-normal lg:grid-rows-1 md:grid-rows-2 gap-8 px-8">
                        <div className="flex flex-col gap-2">
                            <p className='font-semibold'>Congé</p>
                            <p className='font-medium text-gray-500'>{label ? label : '-/-'}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className='font-semibold'>Debut</p>
                            <p className='text-gray-500 font-medium'>{startDate ? moment(startDate).format('DD MMMM YYYY') : '-/-'}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className='font-semibold'>Fin</p>
                            <p className='text-gray-500 font-medium'>{endDate ? moment(endDate).format('DD MMMM YYYY') : '-/-'}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className='font-semibold'>Total</p>
                            <p className='text-gray-500 font-medium'>{dayDifference ? `${dayDifference} jours` : '-/-'}</p>
                        </div>
                    </div>
                    {label == "Paye" && (
                        <>
                            <Divider orientation='horizontal'/>
                            <div className="flex flex-col gap-2 my-2">
                                <div className="flex justify-between items-center gap-2">
                                    <p className='text-gray-500'>Solde congé actuel:</p>
                                    <p className='text-bleuspat'>56 jours</p>
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                    <p className='text-gray-500'>Après validation:</p>
                                    <p className='text-bleuspat'>36 jours</p>
                                </div>
                            </div>
                        </>
                    )}
                    <Divider orientation='horizontal'/>
                        <p className='px-8 text-gray-500 text-center font-medium'>Confirmer l'envoie de cette demande</p>
                    <Divider orientation='horizontal'/>
                </ModalBody>
                <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                    Annuler
                </Button>
                <Button color='primary' onPress={handleButtonClick}>
                    Confirmer
                </Button>
                </ModalFooter>
            </>
            )}
        </ModalContent>
      </Modal>
        
    </div>
  )
}

export default MesDemandes