"use client"

import { useState, useEffect } from "react"
import TableSearch from "../../components/TableSearch"
import Table from "../../components/Table"
import Link from "next/link"
import {Tooltip, User, Pagination} from '@nextui-org/react'
import axios from "axios"

const col =[
  {
    header: "Info",
    accessor: "info"
  },
  {
    header: "Manager ID",
    accessor: "managerId", 
    className:"hidden md:table-cell"
  },
  {
    header: "Effectifs",
    accessor: "nbrSub", 
    className:"hidden md:table-cell"
  },
  {
    header: "Poste",
    accessor: "poste", 
    className:"hidden md:table-cell"
  },
  {
    header: "Etablissement",
    accessor: "etablissement", 
    className:"hidden lg:table-cell"
  },
  {
    header: "Actions",
    accessor: "actions"
  },
]

const ManagerPage = ()=> {

  const [row, setRow] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 6 // Nombre de lignes par page

    useEffect(() => {
        allManager()
    }, []);

    //Prendre les donnees
    const allManager = async () => {
      try {
          const response = await axios.get('http://localhost:5000/api/employes/manager', {
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

  // Personnalisation des cellules
  const renderRow = (item)=>(
    <tr key={item.id} className="border-b border-gray-200 text-sm hover:bg-bleuspat/10">
      <td className="p-3">
        <User   
        name={item.name}
        description={item.email}
        avatarProps={{
          src: "http://localhost:5000/jenna-ortega-7680x4320-16936.jpg"
        }}
        />
      </td>
      <td className="hidden md:table-cell">{item.managerId}</td>
      <td className="hidden md:table-cell"><span className="text-2xl font-semibold">{item.nbrSub}</span> employes</td>
      <td className="hidden md:table-cell">{item.poste}</td>
      <td className="hidden lg:table-cell">{item.etablissement}</td>
      <td>
        <div className="flex items-center gap-4">
          <Tooltip content="Inspecter" color="success" showArrow={true}>
            <Link href={`/dashboard/manager/${item.id}`}>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400">
                <img src="/view.png" alt="" width={20} height={20}/>
              </button>
            </Link>
          </Tooltip>
          <div className="flex gap-4">
            <Tooltip content="Modifier" color="primary" showArrow={true}>
              <button onClick={()=>console.log(roles)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#7591ff]">
                <img src="/edit.png" alt="" width={20} height={20}/>
              </button>
            </Tooltip>
            <Tooltip content="Supprimer" color="danger" showArrow={true}>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e66165]">
                <img src="/delete.png" alt="" width={20} height={20}/>
              </button>
            </Tooltip>
          </div>
        </div>
      </td>
    </tr>
  )

  return (
    <div className=" bg-white shadow-lg p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">Managers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch/>
          <div className="flex items-center gap-4 self-end">
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
              <img src="/filter.png" alt="" width={20} height={20}/>
            </button>
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
              <img src="/sort.png" alt="" width={24} height={24}/>
            </button>
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
    </div>
  )
}

export default ManagerPage