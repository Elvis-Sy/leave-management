"use client"

import { useState, useEffect } from "react"
import TableSearch from "../../components/TableSearch"
import Table from "../../components/Table"
import Link from "next/link"
import axios from "axios"
import {Tooltip, User, Chip, Avatar, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from '@nextui-org/react'

const role =["Admin"]

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

const EmployePage = ()=> {

  const [roles, setRole] = useState(null);
  const [row, setRow] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 6 // Nombre de lignes par page

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
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
        console.log(row)

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
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  // Personnalisation des cellules
  const renderRow = (item)=>(
    <tr key={item.id} className="border-b border-gray-200 text-sm hover:bg-bleuspat/10">
      <td className="flex items-center gap-4 p-4">
        <User   
          name={item.name}
          description={item.email}
          avatarProps={{
            src: "http://localhost:5000/jenna-ortega-7680x4320-16936.jpg"
          }}
        />
      </td>
      <td className="hidden md:table-cell">{item.employeId}</td>
      <td className="hidden md:table-cell">{item.DateEmb}</td>
      <td className="hidden md:table-cell">{item.Etablissement}</td>
      <td className="hidden lg:table-cell">{item.poste}</td>
      <td className="hidden lg:flex items-center justify-center">
        {item.manager ? (
          <Chip
            variant="flat"
            size="lg"
            avatar={
              <Avatar
                name={item.manager}
                src="http://localhost:5000/file_20241002T213137819Z.png"
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
          {role.includes(roles) && (
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

  return (
    <div className="bg-white shadow-lg p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">Employes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch/>
          <div className="flex items-center justify-center gap-4 self-end">
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
              <img src="/filter.png" alt="" width={20} height={20}/>
            </button>
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
              <img src="/sort.png" alt="" width={24} height={24}/>
            </button>
            {role.includes(roles) && (
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p> 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                  dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. 
                  Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. 
                  Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur 
                  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>


    </div>
  )
}

export default EmployePage