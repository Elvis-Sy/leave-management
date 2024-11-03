"use client";

import React, { useEffect, useState } from "react";
import { TableWrapper } from "@/components/table/table";
import { colCollegue } from "../table/data";
import { RenderCell } from "../table/render-collegue";
import TableSearch from "../table/tableSearch" 
import axios from "axios";
import { Pagination } from "@nextui-org/react";

const Equipe = () => {

  const [row, setRow] = useState([])
  const [tempRow, setTempRow] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [id, setId] = useState('')
  const rowsPerPage = 6 // Nombre de lignes par page

  useEffect(() => {
    const id = localStorage.getItem('id');
    if(id){
        allMembre(id)
        setId(id)
    }
  }, []);


  //Prendre les donnees
  const allMembre = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/employes/collegue/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        setRow(response.data.employe)
        setTempRow(response.data.employe)

    } catch (error) {
        console.error('Erreur lors de la requête:', error.response?.data || error.message);
        setRow([])
    }
  };  

  //Recherche par nom
  const searchMembre = async (val) => {
    const temp = tempRow.filter((item)=>item.name.toLowerCase().includes(val.toLowerCase()))
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
      <h1 className="text-xl font-semibold">Liste des membres d'équipe</h1>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <TableSearch search={searchMembre} all={()=>allMembre(id)}/>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper RenderCell={RenderCell} columns={colCollegue} users={paginatedData}/>
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

export default Equipe;
