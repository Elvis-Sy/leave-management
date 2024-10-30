"use client";

import React, { useEffect, useState } from "react";
import { TableWrapper } from "@/components/table/table";
import { colHistory } from "../table/data";
import { RenderCell } from "../table/render-history";
import TableSearch from "../table/tableSearch" 
import axios from "axios";
import {Popover, PopoverTrigger, PopoverContent, Pagination, Autocomplete ,AutocompleteItem, Button } from "@nextui-org/react";

const History = () => {

  const [row, setRow] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7 // Nombre de lignes par page
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const action = [ 
    {value: "Refus"},
    {value: "Approbation"},
    {value: "Annulation"},
   ]

  useEffect(() => {
        allHistory()
  }, []);

  // Fonction pour gérer la sélection de l'établissement
  const handleEtablissementSelect = (item) => {
    setSelectedAction(item);
  };

  // Fonction qui sera appelée lors du clic sur le bouton "Filtrer"
  const handleFiltrer = () => {
    filtreEmploye(selectedAction, dateDebut, dateFin);
  };

  //Prendre les donnees
  const allHistory = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/details/history', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        setRow(response.data.type)

    } catch (error) {
        console.error('Erreur lors de la requête:', error.response?.data || error.message);
        setRow([])
    }
  };  

  //Filtrage des donnees
  const filtreEmploye = async (etablissement = '', dateDebut = '', dateFin = '') => {
    try {
      
      if (!etablissement && !dateDebut && !dateFin) {
        allEmploye()
        return;
      }
  
      // Construire la requête en fonction des filtres fournis
      let query = `http://localhost:5000/api/employes/filtre?`;
  
      if (etablissement) {
        query += `etablissement=${encodeURIComponent(etablissement)}&`;
      }
  
      if (dateDebut && dateFin) {
        query += `dateDebut=${encodeURIComponent(dateDebut)}&dateFin=${encodeURIComponent(dateFin)}&`;
      } else if (dateDebut) {
        query += `dateDebut=${encodeURIComponent(dateDebut)}&dateFin=${encodeURIComponent(dateDebut)}&`;
      } else if (dateFin){
        query += `dateDebut=${encodeURIComponent(dateFin)}&dateFin=${encodeURIComponent(dateFin)}&`;
      }
  
      // Retirer le dernier "&" inutile
      query = query.slice(0, -1);
  
      const response = await axios.get(query, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      setRow(response.data.employe || []);
    } catch (error) {
      console.error('Erreur lors de la requête:', error.response?.data || error.message);
      setRow([]);
    }
  };

  //Recherche par nom
  const searchHistory = async (val) => {
    const temp = row.filter((item)=>item.responsable != null && item.responsable.toLowerCase().includes(val.toLowerCase()))
    setRow(temp)
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


  return (
    <div className="my-6 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Historiques des demandes</h1>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap justify-between">
          <TableSearch search={searchHistory} all={allHistory}/>
        </div>

        {/* FILTER */}
        <Popover placement="left" showArrow={true} className="filter2">
            <PopoverTrigger>
            <button type="button" className="flex items-center px-4 py-1 bg-[#0070f0] gap-4 rounded-lg">
                <img src="/filter.png" alt="" width={20} height={20}/>
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

            {/* Filtrage par établissement */}
            <div className="flex flex-col gap-1 w-full">
                <h5 className="text-bleuspat font-medium">Par action</h5>
                    <Autocomplete
                        aria-hidden={false}
                        variant="bordered"
                        label="Action"
                        placeholder="Recherche de poste"
                        className="w-full font-semibold auto"
                        defaultItems={action}
                        defaultSelectedKey={selectedAction}
                        onSelectionChange={handleEtablissementSelect}
                    >
                    {(item) => <AutocompleteItem value={item.value} key={item.value}>{item.value}</AutocompleteItem>}
                    </Autocomplete>
            </div>

            <Button variant="flat" className="w-full" color="primary" onPress={handleFiltrer}>Filtrer</Button>

            </PopoverContent>
        </Popover>

      </div>

      <div className="max-w-[93rem] mx-auto w-full">
        <TableWrapper RenderCell={RenderCell} columns={colHistory} users={paginatedData}/>
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
  );
};

export default History;
