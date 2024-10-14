"use client"

import { useState, useEffect } from "react";
import Table from "../../../components/Table"
import { Modal, Popover, PopoverTrigger, PopoverContent,Tabs, Tab, Card, CardBody, User, Tooltip, Pagination, Chip, Avatar, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import TableSearch from '../../../components/TableSearch'
import axios from "axios";
import AcceptModal from '../../../modals/acceptModal'
import RefuseModal from '../../../modals/refuseModal'


const nbr = 9;

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
]

const DemandePage = ()=> {

  const [type, setType] = useState([]);
  const [valid, setValid] = useState([])
  const [attente, setAttente] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPage2, setCurrentPage2] = useState(1)
  const rowsPerPage = 6 
  const [activeTab, setActiveTab] = useState('$.0')
  const [typeConge, setTypeConge] = useState()
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [openModal, setOpenModal] = useState(null);
  const [idDM, setIdDM] = useState();


  useEffect(()=>{
    allValid()
    allAttente()
    getType()
  }, [])

  const handleTypeSelect = (item) => {
    setTypeConge(item);
  };

  //Ouvertur modal
  const onOpen = (modalId) => {
    setOpenModal(modalId);
  };

  //Fermeture modal
  const onClose = () => {
    setOpenModal(null);
  };

  // Fonction qui sera appelée lors du clic sur le bouton "Filtrer"
  const handleFiltrer = () => {
    filtreEmploye(typeConge, dateDebut, dateFin, activeTab);
  };

  const refresh = (val)=>{
    if(val == '$.0'){
      allValid()
    } else {
      allAttente()
    }
  }

  const fullRefresh = ()=>{
    allValid()
    allAttente()
  }

  //Valide demande/////////////////////////////////
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

      //Recherche par nom
      const searchValid = async (val) => {
        try {
          const response = await axios.get(`http://localhost:5000/api/demandes/searchValid/${val}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });

          setValid(response.data.demande || []);

        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
            setValid([])
        }
      }; 
  ///////////////////////////////////////////////

  //Attente demande//////////////////////////////
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
      const paginatedData2 = attente.slice(
        (currentPage2 - 1) * rowsPerPage, 
        currentPage2 * rowsPerPage
      ) 

      const handlePageChange2 = (page) => {
        setCurrentPage2(page)
      }

    //Recherche par nom
    const searchAttente = async (val) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/demandes/searchAttente/${val}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        setAttente(response.data.demande || []);

      } catch (error) {
          console.error('Erreur lors de la requête:', error.response?.data || error.message);
          setAttente([])
      }
    }; 
  /////////////////////////////////////////////

  //Filtrage des donnees
  const filtreEmploye = async (type = '', dateDebut = '', dateFin = '', active) => {
    try {
      
      if (!type && !dateDebut && !dateFin) {
        allAttente()
        allValid()
        return;
      }
  
      // Construire la requête en fonction des filtres fournis
      let query = ''
      if(active == '$.0'){
        query = `http://localhost:5000/api/demandes/validFiltre?`;
      } else {
        query = `http://localhost:5000/api/demandes/attenteFiltre?`;
      }
      
  
      if (type) {
        query += `type=${encodeURIComponent(type)}&`;
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

      if(active == '$.0'){
        setValid(response.data.demande || []);
      } else {
        setAttente(response.data.demande || []);
      }
  
      
    } catch (error) {
      console.error('Erreur lors de la requête:', error.response?.data || error.message);
      setValid([]);
      setAttente([]);
    }
  };

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
            <button onClick={()=>{ setIdDM(item.id); onOpen("AcceptModal") }} className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400/20">
              <img src="/accept.png" alt="" width={25} height={25}/>
            </button>
          </Tooltip>
          <Tooltip content="Refuser" color="danger" showArrow={true}>
            <button onClick={()=>{ setIdDM(item.id); onOpen("RefuseModal") }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e66165]/20">
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
        {item.manager ? <Chip
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
        </Chip> :
        <Chip variant="flat" size='lg'>Admin</Chip>}
      </td>

      <td className="">
        <div className={`flex items-center gap-1 ${item.statut == "Refusee" ? "text-[#fa5252]" : "text-[#40c057]"}`}>
          <span>{item.statut == "Refusee" ? "Refusee" : "Approuvee"}</span>
          <img src={`${item.statut == "Refusee" ? "/invalid.png" : "/valid.png"}`} alt="" width={20} height={20}/>
        </div>
      </td>

    </tr>
  )

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

  return (
    <div className="relative bg-white shadow-lg p-4 rounded-md flex-1 m-3 mt-0">
      {/* TOP */}
      <Tabs aria-label="Options" className="m-0" selectedKey={activeTab} onSelectionChange={(key)=>{ setActiveTab(key); refresh(key) }}>
        
        <Tab title="Tout" className="text-md font-medium">
          <Card style={{boxShadow: "none"}}>
            <CardBody>
              <div className="h-[440px]">
                <Table col={col2} render={renderRow2} data={paginatedData} margin={0}/>
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
                <Table col={col} render={renderRow} data={paginatedData2} margin={0}/>
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
          {activeTab == '$.0' ? <TableSearch search={searchValid} all={allValid}/> : <TableSearch search={searchAttente} all={allAttente}/>}
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
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Filtrage par établissement */}
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

      <Modal isOpen={openModal == "AcceptModal"} onClose={onClose} size="sm">
        <AcceptModal onClose={onClose} id={idDM} reload={fullRefresh}/>
      </Modal>
      
      <Modal isOpen={openModal == "RefuseModal"} onClose={onClose} size="sm">
        <RefuseModal onClose={onClose} id={idDM} reload={fullRefresh}/>
      </Modal>

    </div>
  )
}

export default DemandePage
