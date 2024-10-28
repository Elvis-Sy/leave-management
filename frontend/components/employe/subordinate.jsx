"use client";
import { Pagination } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { TableWrapper } from "@/components/table/table";
import { colEmploye } from "../table/data";
import { RenderCell } from "../table/render-employe";
import TableSearch from "../table/tableSearch" 
import axios from "axios";
import { ToastContainer } from 'react-toastify';


export const Subordinate = () => {

    // const [roles, setRole] = useState(null);
    const [row, setRow] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const rowsPerPage = 6 // Nombre de lignes par page
    const [id, setId] = useState()

  //Ouvertur modal
  const onOpen = (modalId) => {
    return null
  };

  //Fermeture modal
  const onClose = () => {
    setOpenModal(null);
  };

  useEffect(() => {
    const id = localStorage.getItem('id')
    if(id){
        allEmploye(id);
    }
  }, []);

  //Prendre les donnees
  const allEmploye = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employes/all/${id}`, {
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
    const temp = row.filter((item)=>item.name.toLowerCase().includes(val.toLowerCase()))
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
    <div className="my-4 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ToastContainer/>
      <ul className="flex gap-2">
        <li className="flex gap-2">
          <UsersIcon />
          <span>Subordonnés</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <Link href={"/subordonnes"}>
            {" "}<span>Liste</span>
          </Link>
        </li>
      </ul>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <TableSearch search={searchEmploye} all={()=>allEmploye(localStorage.getItem('id'))}/>
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
          className="rounded-md"/>
      </div>

    </div>
  )
}
