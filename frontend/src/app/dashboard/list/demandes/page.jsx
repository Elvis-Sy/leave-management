"use client"

import { useState, useEffect } from "react";
import Table from "../../../components/Table"
import { Popover, PopoverTrigger, PopoverContent,Tabs, Tab, Card, CardBody, User, Tooltip, Pagination, Chip, Avatar, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import TableSearch from '../../../components/TableSearch'
import axios from "axios";

const nbr = 9;

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

const data = [
  {
    id: 1,
    demandeId: "123123",
    dateEnvoi: "01-01-2024",
    name: "Jenna ortega",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    manager: "Elvis Sy",
    poste: "Directeur",
    type: "Conge paye",
    nbrJrs: 25,
    dateDebut: "25-01-2024",
    dateFin: "7-02-2024" 
  },
  {
    id: 2,
    demandeId: "123123",
    dateEnvoi: "01-01-2024",
    name: "Jenna ortega",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    manager: "Elvis Sy",
    poste: "Directeur",
    type: "Conge paye",
    nbrJrs: 25,
    dateDebut: "25-01-2024",
    dateFin: "7-02-2024" 
  },
  {
    id: 3,
    demandeId: "123123",
    dateEnvoi: "01-01-2024",
    name: "Jenna ortega",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    manager: "Elvis Sy",
    poste: "Directeur",
    type: "Conge paye",
    nbrJrs: 25,
    dateDebut: "25-01-2024",
    dateFin: "7-02-2024" 
  },
  {
    id: 6,
    demandeId: "123123",
    dateEnvoi: "01-01-2024",
    name: "Jenna ortega",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    manager: "Elvis Sy",
    poste: "Directeur",
    type: "Conge paye",
    nbrJrs: 25,
    dateDebut: "25-01-2024",
    dateFin: "7-02-2024" 
  },
  {
    id: 4,
    demandeId: "123123",
    dateEnvoi: "01-01-2024",
    name: "Jenna ortega",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    manager: "Elvis Sy",
    poste: "Directeur",
    type: "Conge paye",
    nbrJrs: 25,
    dateDebut: "25-01-2024",
    dateFin: "7-02-2024" 
  },
  {
    id: 5,
    demandeId: "123123",
    dateEnvoi: "01-01-2024",
    name: "Jenna ortega",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    manager: "Elvis Sy",
    poste: "Directeur",
    type: "Conge paye",
    nbrJrs: 25,
    dateDebut: "25-01-2024",
    dateFin: "7-02-2024" 
  }
]

const col =[
  {
    header: "Info demande",
    accessor: "infoD"
  },
  {
    header: "Date d'envoi",
    accessor: "dateEnvoi", 
    className: "hidden lg:table-cell"
  },
  {
    header: "Info demandeur",
    accessor: "infoDemande", 
    className: "hidden md:table-cell"
  },
  {
    header: "Date debut - fin",
    accessor: "Duree", 
    className:"hidden md:table-cell"
  },
  {
    header: "Actions",
    accessor: "actions"
  },
]

const col2 =[
  {
    header: "Info demande",
    accessor: "infoD"
  },
  {
    header: "Info demandeur",
    accessor: "infoDemande", 
    className: "hidden lg:table-cell"
  },
  {
    header: "Date d'envoi",
    accessor: "dateEnvoi", 
    className: "hidden md:table-cell"
  },
  {
    header: "Date confirmation",
    accessor: "dateConfirmation", 
    className: "hidden md:table-cell"
  },
  {
    header: "Responsable reponse",
    accessor: "respConfirmation", 
    className: "hidden lg:table-cell"
  },
  {
    header: "Statut",
    accessor: "statut", 
  },
  {
    header: "Action",
    accessor: "action"
  },
]

const DemandePage = ()=> {

  const [selectedSort, setSelectedSort] = useState('ASC');
  const [valid, setValid] = useState([])
  const [attente, setAttente] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPage2, setCurrentPage2] = useState(1)
  const rowsPerPage = 6 

  useEffect(()=>{
    allValid()
    allAttente()
  }, [])

  //Valide demande
    const allValid = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/demandes/valid', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        setValid(response.data.demande)

      } catch (error) {
          console.error('Erreur lors de la requête:', error.response?.data || error.message);
          setValid([])
      }
    }; 

    //Gestion de la pagination et des pages
      //Calcul des nombres de pages
      const totalPages = Math.ceil(valid.length / rowsPerPage)

      //Diviser les donnes selon le nombre de page
      const paginatedData = valid.slice(
        (currentPage - 1) * rowsPerPage, 
        currentPage * rowsPerPage
      ) 

      const handlePageChange = (page) => {
        setCurrentPage(page)
      }
  //

  //Valide demande
    const allAttente = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/demandes/attente', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        setAttente(response.data.demande)

      } catch (error) {
          console.error('Erreur lors de la requête:', error.response?.data || error.message);
          setAttente([])
      }
    }; 

    //Gestion de la pagination et des pages
      //Calcul des nombres de pages
      const totalPages2 = Math.ceil(valid.length / rowsPerPage)

      //Diviser les donnes selon le nombre de page
      const paginatedData2 = valid.slice(
        (currentPage2 - 1) * rowsPerPage, 
        currentPage2 * rowsPerPage
      ) 

      const handlePageChange2 = (page) => {
        setCurrentPage2(page)
      }
  //

  // Personnalisation des cellules
  const renderRow = (item)=>(
    <tr key={item.id} className="border-b border-gray-200 text-sm hover:bg-bleuspat/10">
      
      <td className=" p-3">
        <div className="flex items-center gap-4">
          <img src={
            item.type === "Paye" ? '/paye.png' :
            item.type === "Maternite" ? '/maternite.png' :
            item.type === "Paternite" ? '/paternite.png' :
            "/maladie.png"
          } alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover"/>
          <div className="flex flex-col">
            <h3 className="font-semibold text-md">{item.type}</h3>
            <p className="text-xs text-gray-500"><span className="text-sm text-gray-500 font-medium">{item.nbrJrs}</span> jours</p>
          </div>
        </div>
      </td>

      <td className=" hidden lg:table-cell">
        <p>{item.dateEnvoi}</p>
      </td>

      <td className="hidden md:table-cell">
        <User   
        name={item.name}
        description={item.etablissement}
        avatarProps={{
          src: `http://localhost:5000/${item.photo}`
        }}
        />
      </td>

      <td className="hidden md:table-cell ">
        <div className="flex items-center gap-4">
          <div className="p-2 text-md font-bold text-gray-700 border rounded-lg">
            {item.dateDebut}
          </div>
          <span>-</span>
          <div className="p-2 text-md font-bold text-gray-700 border rounded-lg">
            {item.dateFin}
          </div>
        </div>
      </td>

      <td>
        <div className="flex items-center gap-4">
          <Tooltip content="Approuver" color="success" showArrow={true}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400/20">
              <img src="/accept.png" alt="" width={25} height={25}/>
            </button>
          </Tooltip>
          <Tooltip content="Refuser" color="danger" showArrow={true}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e66165]/20">
              <img src="/reject.png" alt="" width={20} height={20}/>
            </button>
          </Tooltip>
        </div>
      </td>
    </tr>
  )

  const renderRow2 = (item)=>(
    <tr key={item.id} className="border-b border-gray-200 text-sm hover:bg-bleuspat/10">
      
      <td className=" p-3">
        <div className="flex items-center gap-4">
          <img src={
            item.type === "Paye" ? '/paye.png' :
            item.type === "Maternite" ? '/maternite.png' :
            item.type === "Paternite" ? '/paternite.png' :
            "/maladie.png"
          } alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover"/>
          <div className="flex flex-col">
            <h3 className="font-semibold text-md">{item.type}</h3>
            <p className="text-xs text-gray-500"><span className="text-sm text-gray-500 font-medium">{item.nbrJrs}</span> jours</p>
          </div>
        </div>
      </td>

      <td className="hidden lg:table-cell">
        <User   
        name={item.name}
        description={item.etablissement}
        avatarProps={{
          src: `http://localhost:5000/${item.photo}`
        }}
        />
      </td>

      <td className=" hidden md:table-cell">
        <p>{item.dateEnvoi}</p>
      </td>

      <td className=" hidden md:table-cell">
        <p>{item.dateConf}</p>
      </td>

      <td className="hidden lg:table-cell ">
        <Chip
          variant="flat"
          size="lg"
          avatar={
            <Avatar
              name={item.manager}
              src="http://localhost:5000/jenna-ortega-7680x4320-16936.jpg"
            />
          }
        >
          {item.manager}
        </Chip>
      </td>

      <td className="">
        <div className={`flex items-center gap-1 ${item.statut == "Refusee" ? "text-[#fa5252]" : "text-[#40c057]"}`}>
          <span>{item.statut == "Refusee" ? "Refusee" : "Approuvee"}</span>
          <img src={`${item.statut == "Refusee" ? "/invalid.png" : "/valid.png"}`} alt="" width={20} height={20}/>
        </div>
      </td>

      <td>
        <div className="flex items-center justify-center gap-4">
          <Tooltip content="Infos" color="primary" showArrow={true}>
            <button className="w-6 h-6 flex items-center justify-center rounded-full bg-bleuspat">
              <img src="/info.png" alt="" width={17} height={17}/>
            </button>
          </Tooltip>
        </div>
      </td>
    </tr>
  )

  const handleSortClick = (sortType) => {
    setSelectedSort(sortType);
  };

  return (
    <div className="relative bg-white shadow-lg p-4 rounded-md flex-1 m-3 mt-0">
      {/* TOP */}
      <Tabs aria-label="Options" className="m-0">
        
        <Tab title="Tout" className="text-md font-medium">
          <Card style={{boxShadow: "none"}}>
            <CardBody>
              <div className="h-[440px]">
                <Table col={col2} render={renderRow2} data={valid} margin={0}/>
              </div>
              <div className="mt-2 flex justify-center">
                <Pagination 
                  loop showControls 
                  total={totalPages} 
                  initialPage={1} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                  variant="faded" 
                  className="rounded-md bg-[#f1f1f1]"/>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab title={`En attente (${nbr})`} className="text-md font-medium">
          <Card style={{boxShadow: "none"}}>
            <CardBody>
              <div className="h-[440px]">
                <Table col={col} render={renderRow} data={attente} margin={0}/>
              </div>
              <div className="mt-2 flex justify-center">
              <Pagination 
                  loop showControls 
                  total={totalPages2} 
                  initialPage={1} 
                  page={currentPage2} 
                  onChange={handlePageChange2} 
                  variant="faded" 
                  className="rounded-md bg-[#f1f1f1]"/>
              </div>
            </CardBody>
          </Card>
          
        </Tab>
        
      </Tabs>

      <div className="absolute right-0 top-0 m-4">
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
            <Popover placement="bottom" showArrow={true} className="sort">
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
            
          </div>
        </div>
      </div>


    </div>
  )
}

export default DemandePage
