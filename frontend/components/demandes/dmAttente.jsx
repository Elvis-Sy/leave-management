"use client";
import { Modal, Popover, PopoverTrigger, PopoverContent, Pagination, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import React, { useEffect, useState } from "react";
import { TableWrapper } from "@/components/table/table";
import { colAttente } from "../table/data";
import { RenderCell } from "../table/render-attente";
import TableSearch from "../table/tableSearch" 
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import { addDays } from 'date-fns';
import Image from 'next/image';
import dynamic from 'next/dynamic'

const AccepModal = dynamic(() => import('@/components/modals/acceptModal'));
const RefuseModal = dynamic(() => import('@/components/modals/refuseModal'));

export const DMAttente = () => {

    const [type, setType] = useState([]);
    const [row, setRow] = useState([])
    const [tempRow, setTempRow] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 5 // Nombre de lignes par page
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [typeConge, setTypeConge] = useState()
    const [openModal, setOpenModal] = useState(null);
    const [idSupp, setId] = useState(null);

    // Fonction pour gérer la sélection du type de conge
    const handleTypeSelect = (item) => {
        setTypeConge(item);
      };

  // Fonction qui sera appelée lors du clic sur le bouton "Filtrer"
  const handleFiltrer = () => {
    filtreEmploye(typeConge, dateDebut, dateFin);
  };

  //Ouvertur modal
  const onOpen = (modalId) => {
    setOpenModal(modalId);
  };

  //Fermeture modal
  const onClose = () => {
    setOpenModal(null);
  };

  useEffect(()=>{
    if (typeof window !== "undefined") {
      const id = localStorage.getItem('id');
      if (id) {
          allAttente(id);
      }
      getType();
    }
  }, [])

  //Prendre les donnees
  const allAttente = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/demandes/attente/${id}`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });

      setRow(response.data.demande)
      setTempRow(response.data.demande)

    } catch (error) {
        console.error('Erreur lors de la requête:', error.response?.data || error.message);
        setRow([])
    }
  };

  //Recherche par nom
  const searchAttente = async (val) => {
    const temp = tempRow.filter((item)=>item.name.toLowerCase().includes(val.toLowerCase()))
    setRow(temp)
  }; 

  //Filtrage des donnees
  const filtreEmploye = async (type = '', dateDebut = '', dateFin = '') => {
    try {
      
      if (!type && !dateDebut && !dateFin) {
        allAttente(localStorage.getItem('id'))
        return;
      }
  
      // Construire la requête en fonction des filtres fournis
      let query = ''
      query = `http://localhost:5000/api/demandes/attenteFiltre/${localStorage.getItem('id')}?`;
      
      
  
      if (type) {
        query += `type=${encodeURIComponent(type)}&`;
      }
  
      if (dateDebut && dateFin) {
        query += `dateDebut=${encodeURIComponent(dateDebut)}&dateFin=${encodeURIComponent(dateFin)}&`;
      } else if (dateDebut) {
        query += `dateDebut=${encodeURIComponent(dateDebut)}&dateFin=${encodeURIComponent(addDays(dateDebut, 1))}&`;
      } else if (dateFin){
        query += `dateDebut=${encodeURIComponent(addDays(dateFin, 1))}&dateFin=${encodeURIComponent(dateFin)}&`;
      }
  
      // Retirer le dernier "&" inutile
      query = query.slice(0, -1);
  
      const response = await axios.get(query, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setRow(response.data.demande)
  
      
    } catch (error) {
      console.error('Erreur lors de la requête:', error.response?.data || error.message);
      setRow([]);
    }
  };

  //Gestion de la pagination et des pages
    //Calcul des nombres de pages
    const totalPages = Math.ceil(row.length / rowsPerPage)

    //Diviser les donnes selon le nombre de page
    const paginatedData = row.slice(
      (currentPage - 1) * rowsPerPage, 
      currentPage * rowsPerPage
    ) 

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }


  //Type Conge
  const getType = async ()=> {
    try {

      const response = await axios.get('http://localhost:5000/api/details/types', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

      setType(response.data.type)

    } catch (error) {
      console.error("Error listage departments:", error);
      setType([])
    }
  }

  return (
    <div className="my-8 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ToastContainer/>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <TableSearch search={searchAttente} all={()=>allAttente(localStorage.getItem('id'))}/>
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <div className="flex items-center gap-4 self-end">

            {/* FILTER */}
            <Popover placement="left" showArrow={true} className="filter2">
              <PopoverTrigger>
                <button type="button" className="flex items-center px-4 py-1 bg-[#0070f0] gap-4 rounded-lg">
                    <Image src="/filter.png" alt="filtre" width={20} height={20}/>
                    <span className='text-lg text-white font-semibold'>Filtrer</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-4 flex flex-col gap-3">

                {/* Filtrage par date */}
                <div className="flex flex-col gap-1">
                  <h5 className="text-bleuspat font-medium">Par date</h5>
                  <div className="flex items-center gap-1">
                    <span>Entre</span> 
                    <div className='relative border-2 p-2 rounded-xl focus-within:border-[#bbcafc] focus-within:ring-1 focus-within:ring-[#bbcafc] border-gray-200'>
                      <input 
                        type="date" 
                        className="block dark:text-white w-full text-gray-700 bg-transparent placeholder-gray-400 focus:outline-none" 
                        placeholder="jj-mm-aaaa" 
                        name="dateDebut"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                      />
                    </div>
                    <span>et</span>
                    <div className='relative border-2 p-2 rounded-xl focus-within:border-[#bbcafc] focus-within:ring-1 focus-within:ring-[#bbcafc] border-gray-200'>
                      <input 
                        type="date" 
                        className="block dark:text-white w-full text-gray-700 bg-transparent placeholder-gray-400 focus:outline-none" 
                        placeholder="jj-mm-aaaa" 
                        name="dateFin"
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Filtrage par type de conge */}
                <div className="flex flex-col gap-1 w-full">
                  <h5 className="text-bleuspat font-medium">Par types de congés</h5>
                  <Autocomplete
                    variant="bordered"
                    label="Type de conges"
                    placeholder="Recherche du type"
                    className="w-full font-semibold auto"
                    defaultItems={type}
                    defaultSelectedKey={typeConge}
                    onSelectionChange={handleTypeSelect}
                  >
                    {(item) => <AutocompleteItem value={item.value} key={item.value}>{item.label}</AutocompleteItem>}
                  </Autocomplete>
                </div>

                <Button variant="flat" className="w-full" color="primary" onPress={handleFiltrer}>Filtrer</Button>

              </PopoverContent>
            </Popover>

          </div>

        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
      <TableWrapper RenderCell={(props) => <RenderCell {...props} onOpen={onOpen} setId={setId}/>} columns={colAttente} users={paginatedData}/>
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

      <Modal isOpen={openModal == "AcceptModal"} onClose={onClose} size="sm">
        <AccepModal onClose={onClose} id={idSupp} reload={()=>allAttente(localStorage.getItem('id'))}/>
      </Modal>
      
      <Modal isOpen={openModal == "RefuseModal"} onClose={onClose} size="sm">
        <RefuseModal onClose={onClose} id={idSupp} reload={()=>allAttente(localStorage.getItem('id'))}/>
      </Modal>

    </div>
  )
}