"use client";
import { Button, Popover, PopoverTrigger, PopoverContent, Pagination, Autocomplete ,AutocompleteItem } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { TableWrapper } from "@/components/table/table";
import { colManager } from "../table/data";
import { RenderCell } from "../table/render-cell";
import TableSearch from "../table/tableSearch" 
import axios from "axios";

export const Accounts = () => {

  const [row, setRow] = useState([])
  const [tempRow, setTempRow] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 6 // Nombre de lignes par page
  const [selectedSort, setSelectedSort] = useState('ASC');
  const [etab, setEtab] = useState([])
  const [etablissement, setEtablissement] = useState(null);

  useEffect(() => {
    allManager()
    getEtab()
  }, []);

  // Fonction pour gérer la sélection de l'établissement
  const handleEtablissementSelect = (obj) => {
    setEtablissement(obj);
  };

  // Fonction qui sera appelée lors du clic sur le bouton "Filtrer"
  const handleFiltrer = () => {
    filtreManager(etablissement);
  };

  //Prendre les donnees
  const allManager = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/employes/manager', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        setRow(response.data.employe)
        setTempRow(response.data.employe)

    } catch (error) {
        console.error('Erreur lors de la requête:', error.response?.data || error.message);
    }
  };  

  //Recherche par nom
  const searchManager = async (val) => {
    const temp = tempRow.filter((item)=>item.name.toLowerCase().includes(val.toLowerCase()))
    setRow(temp)
  };

  //Trier les donners ASC ou DESC
  const handleSortClick = (order) => {
    const sortedData = [...row].sort((a, b) => {
      const aValue = a.nbrSub;
      const bValue = b.nbrSub;

      if (order === 'ASC') {
        return aValue > bValue ? 1 : -1; // Pour l'ordre croissant
      } else {
        return aValue < bValue ? 1 : -1; // Pour l'ordre décroissant
      }
    });

    setRow(sortedData);
    setSelectedSort(order); // Mettez à jour le tri sélectionné
  };

  //Filtrage des donnees
  const filtreManager = async (etablissement = '') => {
    try {
      
      if (!etablissement) {
        allManager()
        return;
      }
  
      // Construire la requête en fonction des filtres fournis
      let query = `http://localhost:5000/api/employes/managerFiltre?`;
  
      if (etablissement) {
        query += `etablissement=${encodeURIComponent(etablissement)}&`;
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

  //Etablissement
  const getEtab = async ()=> {
    try {

      const response = await axios.get('http://localhost:5000/api/details/etablissement', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

      setEtab(response.data.etabi)

    } catch (error) {
      console.error("Error listage departments:", error);
      setEtab([])
    }
  }

  return (
    <div className="my-6 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex gap-2">
        <li className="flex gap-2">
          <UsersIcon />
          <span>Managers</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <Link href={"/managers"}>
            {" "}<span>Liste</span>
          </Link>
        </li>
      </ul>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <TableSearch search={searchManager} all={allManager}/>
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
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper RenderCell={RenderCell} columns={colManager} users={paginatedData}/>
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
