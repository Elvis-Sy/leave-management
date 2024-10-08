"use client"

import { useState, useEffect } from "react"
import TableSearch from "../../components/TableSearch"
import Table from "../../components/Table"
import Link from "next/link"
import axios from "axios"
import {Button, Autocomplete, AutocompleteItem, Popover, PopoverContent, PopoverTrigger, Tooltip, User, Chip, Avatar, Pagination, useDisclosure, Modal,} from '@nextui-org/react'
import NewEmploye from '../../modals/newEmploye'
import { format } from "date-fns";
import {fr} from 'date-fns/locale'

//Formater la date
const formatDate = (date)=>{
  const temp = date ? new Date(date) : new Date();
  return format(temp, "dd-MM-yyyy", {locale: fr})
}

const role = localStorage.getItem('role');

const col =[
  {
    header: "Info",
    accessor: "info"
  },
  {
    header: "Employe ID",
    accessor: "employeId", 
    className:"hidden md:table-cell"
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

const etab = [
  {
      label: "Directeur",
      value: "directeur"
  },
  {
      label: "Secretaire",
      value: "secretaire"
  },
  {
      label: "Gardien",
      value: "gardien"
  },
  {
      label: "Chat",
      value: "chat"
  },
]

const EmployePage = ()=> {

  // const [roles, setRole] = useState(null);
  const [row, setRow] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 6 // Nombre de lignes par page
  // const [selectedSort, setSelectedSort] = useState('ASC');
  const [selectedSort, setSelectedSort] = useState(null); // Pour suivre le tri actuel

  useEffect(() => {
    // const storedRole = localStorage.getItem('role');
    // setRole(storedRole);
    allEmploye();
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

  //Open Close
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

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
      <td className="hidden md:table-cell">{item.employeId}</td>
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
          {role == "Admin" && (
            <div className="flex gap-4">
              <Tooltip content="Modifier" color="primary" showArrow={true}>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#829af8]">
                  <img src="/edit.png" alt="" width={20} height={20}/>
                </button>
              </Tooltip>
              <Tooltip content="Supprimer" color="danger" showArrow={true}>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e66165]">
                  <img src="/delete.png" alt="" width={20} height={20}/>
                </button>
              </Tooltip>
            </div>)}
        </div>
      </td>
    </tr>
  )

  // const handleSortClick = (sortType) => {
  //   setSelectedSort(sortType);
  // };

  //Trier les donners ASC ou DESC
  // Fonction de tri
  const handleSortClick = (order) => {
    const sortedData = [...row].sort((a, b) => {
      // Remplacez `accessor` par la clé sur laquelle vous voulez trier
      const aValue = a.DateEmb; // Changez ici pour trier par d'autres colonnes si nécessaire
      const bValue = b.DateEmb; // Changez ici pour trier par d'autres colonnes si nécessaire

      if (order === 'ASC') {
        return aValue > bValue ? 1 : -1; // Pour l'ordre croissant
      } else {
        return aValue < bValue ? 1 : -1; // Pour l'ordre décroissant
      }
    });

    setRow(sortedData);
    setSelectedSort(order); // Mettez à jour le tri sélectionné
  };

  return (
    <div className="bg-white shadow-lg p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">Employes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch/>
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
                  <h5 className="text-bleuspat font-medium">Filtrage par date</h5>
                  <div className="flex items-center gap-1">
                    <span>Entre</span> 
                    <div className='relative border-2 p-2 rounded-xl focus-within:border-[#bbcafc] focus-within:ring-1 focus-within:ring-[#bbcafc] border-gray-200'>
                      <input 
                        type="date" 
                        className="block w-full text-gray-700 bg-transparent placeholder-gray-400 focus:outline-none" 
                        placeholder="jj-mm-aaaa" 
                      />
                    </div>
                    <span>et</span>
                    <div className='relative border-2 p-2 rounded-xl focus-within:border-[#bbcafc] focus-within:ring-1 focus-within:ring-[#bbcafc] border-gray-200'>
                      <input 
                        type="date" 
                        className="block w-full text-gray-700 bg-transparent placeholder-gray-400 focus:outline-none" 
                        placeholder="jj-mm-aaaa" 
                      />
                    </div>
                  </div>
                </div>

                {/* Filtrage par établissement */}
                <div className="flex flex-col gap-1 w-full">
                  <h5 className="text-bleuspat font-medium">Filtrer par établissement</h5>
                  <Autocomplete
                    variant="bordered"
                    label="Etablissement"
                    placeholder="Recherche de poste"
                    className="w-full font-semibold auto"
                    defaultItems={etab}
                  >
                    {(item) => <AutocompleteItem value={item.value} key={item.value}>{item.label}</AutocompleteItem>}
                  </Autocomplete>
                </div>

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
                <Button variant="flat" onClick={() => handleSortClick('ASC')} className="w-full" color={selectedSort === 'ASC' ? 'primary' : 'default'}>ASC</Button>
                <Button variant="flat" onClick={() => handleSortClick('DESC')} className="w-full" color={selectedSort === 'DESC' ? 'primary' : 'default'}>DESC</Button>
              </PopoverContent>
            </Popover>

            {role == "Admin" && (
              <button type="button" onClick={onOpen} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
        <NewEmploye onClose={onClose} reload={allEmploye} />
      </Modal>
      
    </div>
  )
}

export default EmployePage