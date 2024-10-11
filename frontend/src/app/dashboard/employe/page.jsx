"use client"

import { useState, useEffect } from "react"
import TableSearch from "../../components/TableSearch"
import Table from "../../components/Table"
import Link from "next/link"
import axios from "axios"
import {Button, Autocomplete, AutocompleteItem, Popover, PopoverContent, PopoverTrigger, Tooltip, User, Chip, Avatar, Pagination, Modal,} from '@nextui-org/react'
import NewEmploye from '../../modals/newEmploye'
import SuppEmploye from '../../modals/suppEmploye'
import ModifEmploye from '../../modals/modifEmploye'
import { format } from "date-fns";
import {fr} from 'date-fns/locale'
import { ToastContainer } from 'react-toastify';

//Formater la date
const formatDate = (date)=>{
  const temp = date ? new Date(date) : new Date();
  return format(temp, "dd-MM-yyyy", {locale: fr})
}

const col =[
  {
    header: "Info",
    accessor: "info"
  },
  {
    header: "Date Embauche",
    accessor: "DateEmb", 
    className:"hidden md:table-cell"
  },
  {
    header: "Etablissement",
    accessor: "Etablissement", 
    className:"hidden md:table-cell"
  },
  {
    header: "Poste",
    accessor: "poste", 
    className:"hidden lg:table-cell"
  },
  {
    header: "Manager",
    accessor: "manager", 
    className:"hidden lg:table-cell"
  },
  {
    header: "Actions",
    accessor: "actions"
  },
]

const EmployePage = ()=> {

  const [roles, setRole] = useState(null);
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
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
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

  // Personnalisation des cellules
  const renderRow = (item)=>(
    <tr key={item.id} className="border-b border-gray-200 text-sm hover:bg-bleuspat/10">
      <td className="flex items-center gap-4 p-4">
        <User   
          name={item.name}
          description={item.email}
          avatarProps={{
            src: `http://localhost:5000/${item.photo}`
          }}
        />
      </td>
      <td className="hidden md:table-cell">
        {item.DateEmb ? 
          <span>{formatDate(item.DateEmb)}</span>
         : (
            <Chip variant="flat" size="lg" className="text-[#e66165] font-medium text-sm">En période d'essai</Chip>
        ) }
      </td>
      <td className="hidden md:table-cell">{item.Etablissement}</td>
      <td className="hidden lg:table-cell">{item.poste}</td>
      <td className="hidden lg:table-cell">
        {item.manager ? (
          <Chip
            variant="flat"
            size="lg"
            avatar={
              <Avatar
                name={item.manager}
                src={`http://localhost:5000/${item.photoManager}`}
              />
            }
          >
            {item.manager}
          </Chip> ) : (
            <Chip variant="flat" size="lg">-/-</Chip>
          )}
      </td>
      <td>
        <div className="flex items-center gap-4">
          <Tooltip content="Inspecter" color="success" showArrow={true}>
            <Link href={`/list/employes/${item.id}`}>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400">
                <img src="/view.png" alt="" width={20} height={20} className="bg-transparent"/>
              </button>
            </Link>
          </Tooltip>
          {roles == "Admin" && (
            <div className="flex gap-4">
              <Tooltip content="Modifier" color="primary" showArrow={true}>
                <button onClick={()=>{ setId(item.id); onOpen("modifModal") }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#829af8]">
                  <img src="/edit.png" alt="" width={20} height={20}/>
                </button>
              </Tooltip>
              <Tooltip content="Supprimer" color="danger" showArrow={true}>
                <button onClick={()=>{ setId(item.id); onOpen("suppModal") }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e66165]">
                  <img src="/delete.png" alt="" width={20} height={20}/>
                </button>
              </Tooltip>
            </div>)}
        </div>
      </td>
    </tr>
  )

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
    <div className="bg-white shadow-lg p-4 rounded-md flex-1 m-4 mt-0">
       <ToastContainer/>
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">Employes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch search={searchEmploye} all={allEmploye}/>
          <div className="flex items-center justify-center gap-4 self-end">
            
            {/* FILTER */}
            <Popover placement="left" showArrow={true} className="filter">
              <PopoverTrigger>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
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
                        className="block w-full text-gray-700 bg-transparent placeholder-gray-400 focus:outline-none" 
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
                        className="block w-full text-gray-700 bg-transparent placeholder-gray-400 focus:outline-none" 
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
            <Popover placement="bottom" showArrow={true} className="sortE">
              <PopoverTrigger>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
                  <img src="/sort.png" alt="" width={24} height={24}/>
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-2 flex flex-col gap-2 w-[150px]">
                <Button variant="flat" onClick={() => handleSortClick('ASC')} className="w-full" color={selectedSort === 'ASC' ? 'primary' : 'default'} disabled={selectedSort === 'ASC' ? true : false}>ASC</Button>
                <Button variant="flat" onClick={() => handleSortClick('DESC')} className="w-full" color={selectedSort === 'DESC' ? 'primary' : 'default'} disabled={selectedSort === 'DESC' ? true : false}>DESC</Button>
              </PopoverContent>
            </Popover>

            {roles == "Admin" && (
              <button type="button" onClick={()=> onOpen("ajoutModal")} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
                <img src="/plus.png" alt="" width={24} height={24}/>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* TABLE */}
      <div className="h-[460px]">
        <Table col={col} render={renderRow} data={paginatedData}/>
      </div>
      {/* PAGINATION */}
      <div className="mt-4 flex justify-center">
        <Pagination 
          loop showControls 
          total={totalPages} 
          initialPage={1} 
          page={currentPage} 
          onChange={handlePageChange} 
          variant="faded" 
          className="rounded-md bg-[#f1f1f1]"/>
      </div>

      {/* Modal */}
      <Modal isOpen={openModal == "ajoutModal"} onClose={onClose} size="2xl">
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

export default EmployePage