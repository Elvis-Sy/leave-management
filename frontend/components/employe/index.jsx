"use client";
import { Button, Popover, PopoverTrigger, PopoverContent, Pagination, Autocomplete ,AutocompleteItem, Modal } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { TableWrapper } from "@/components/table/table";
import { colEmploye } from "../table/data";
import { RenderCell } from "../table/render-employe";
import TableSearch from "../table/tableSearch" 
import axios from "axios";
import { AddIcon } from "../icons/table/add-icon";
import NewEmploye from '../modals/newEmploye'
import { ToastContainer } from 'react-toastify';
import SuppEmploye from '../modals/suppEmploye'
import ModifEmploye from '../modals/modifEmploye'


export const EmployePage = () => {

    // const [roles, setRole] = useState(null);
    const [row, setRow] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 6 // Nombre de lignes par page
    const [selectedSort, setSelectedSort] = useState("ASC"); // Pour suivre le tri actuel
    const [openModal, setOpenModal] = useState(null);
    const [idSupp, setId] = useState(null);
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [etablissement, setEtablissement] = useState(null);
    const [etab, setEtab] = useState([])

    // Fonction pour gérer la sélection de l'établissement
  const handleEtablissementSelect = (item) => {
    setEtablissement(item);
  };

  // Fonction qui sera appelée lors du clic sur le bouton "Filtrer"
  const handleFiltrer = () => {
    filtreEmploye(etablissement, dateDebut, dateFin);
  };

  //Ouvertur modal
  const onOpen = (modalId) => {
    setOpenModal(modalId);
  };

  //Fermeture modal
  const onClose = () => {
    setOpenModal(null);
  };

  useEffect(() => {
    // const storedRole = localStorage.getItem('role');
    // setRole(storedRole);
    allEmploye();
    getEtab()
  }, []);

  //Prendre les donnees
  const allEmploye = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employes/all', {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });

      setRow(response.data.employe)

    } catch (error) {
        console.error('Erreur lors de la requête:', error.response?.data || error.message);
    }
  }; 

  //Recherche par nom
  const searchEmploye = async (val) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employes/search/${val}`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });

      setRow(response.data.employe || []);

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

  //Trier les donners ASC ou DESC
  const handleSortClick = (order) => {
    const sortedData = [...row].sort((a, b) => {
      const aValue = a.DateEmb;
      const bValue = b.DateEmb;

      if (order === 'ASC') {
        return aValue > bValue ? 1 : -1; // Pour l'ordre croissant
      } else {
        return aValue < bValue ? 1 : -1; // Pour l'ordre décroissant
      }
    });

    setRow(sortedData);
    setSelectedSort(order); // Mettez à jour le tri sélectionné
  };

  //Etablissement
  const getEtab = async ()=> {
    try {

      const response = await axios.get('http://localhost:5000/api/details/etablissement');

      setEtab(response.data.etabi)

    } catch (error) {
      console.error("Error listage departments:", error);
      setEtab([])
    }
  }

  return (
    <div className="my-4 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ToastContainer/>
      <ul className="flex gap-2">
        <li className="flex gap-2">
          <UsersIcon />
          <span>Employés</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <Link href={"/employes"}>
            {" "}<span>Liste</span>
          </Link>
        </li>
      </ul>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <TableSearch search={searchEmploye} all={allEmploye}/>
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <div className="flex items-center gap-4 self-end">

            {/* FILTER */}
            <Popover placement="left" showArrow={true} className="filter2">
              <PopoverTrigger>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0070f0]">
                  <img src="/filter.png" alt="" width={20} height={20}/>
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
                  <h5 className="text-bleuspat font-medium">Par établissement</h5>
                  <Autocomplete
                    variant="bordered"
                    label="Etablissement"
                    placeholder="Recherche de poste"
                    className="w-full font-semibold auto"
                    defaultItems={etab}
                    defaultSelectedKey={etablissement}
                    onSelectionChange={handleEtablissementSelect}
                  >
                    {(item) => <AutocompleteItem value={item.value} key={item.value}>{item.label}</AutocompleteItem>}
                  </Autocomplete>
                </div>

                <Button variant="flat" className="w-full" color="primary" onPress={handleFiltrer}>Filtrer</Button>

              </PopoverContent>
            </Popover>

            {/* SORT */}
            <Popover placement="bottom" showArrow={true} className="sort">
              <PopoverTrigger>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0070f0]">
                  <img src="/sort.png" alt="" width={24} height={24}/>
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-2 flex flex-col gap-2 w-[150px]">
                <Button variant="flat" onClick={() => handleSortClick('ASC')} className="w-full" color={selectedSort === 'ASC' ? 'primary' : 'default'}>ASC</Button>
                <Button variant="flat" onClick={() => handleSortClick('DESC')} className="w-full" color={selectedSort === 'DESC' ? 'primary' : 'default'}>DESC</Button>
              </PopoverContent>
            </Popover>

          </div>

          {localStorage.getItem('role') == 'Admin' && <Button color="primary" onPress={()=> onOpen("ajoutModal")} startContent={<AddIcon />}>
            Ajouter
          </Button>}
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper RenderCell={(props) => <RenderCell {...props} onOpen={onOpen} setId={setId}/>} columns={colEmploye} users={paginatedData}/>
      </div>
      {/* PAGINATION */}
      <div className="mt-4 flex justify-center">
        <Pagination 
          loop showControls
          total={totalPages} 
          page={currentPage} 
          onChange={handlePageChange} 
          variant="faded" 
          className="rounded-md bg-default-50"/>
      </div>

      {/* Modal */}
      <Modal isOpen={openModal == "ajoutModal"} onClose={onClose} size="2xl" scrollBehavior="inside">
        <NewEmploye onClose={onClose} reload={allEmploye} />
      </Modal>

      <Modal isOpen={openModal == "suppModal"} onClose={onClose} size="sm">
        <SuppEmploye onClose={onClose} idEmp={idSupp} all={allEmploye}/>
      </Modal>

      <Modal isOpen={openModal == "modifModal"} onClose={onClose} size="2xl">
        <ModifEmploye onClose={onClose} idEmploye={idSupp} all={allEmploye}/>
      </Modal>

    </div>
  )
}
