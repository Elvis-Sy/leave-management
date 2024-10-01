"use client"

import { useState, useEffect } from "react"
import TableSearch from "../../components/TableSearch"
import Table from "../../components/Table"
import Link from "next/link"
import {Tooltip, User, Pagination} from '@nextui-org/react'
import axios from "axios"

//Authorization
const role ="Employe"

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

  const [roles, setRole] = useState(null);
  const [row, setRow] = useState([])

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
        test()
    }, []);

    const test = async () => {
      try {
          const response = await axios.get('http://localhost:5000/api/employes/manager', {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });

          //Formatter le data
          const rows = response.data.employe.map((data)=>{
            return {
              id: data.idEmploye,
              managerId: data.CIN,
              name: `${data.nom} ${data.prenom}`,
              email: data.compte.email,
              photo: "/illustration1.png",
              etablissement: "Direction informatique",
              nbrSub: data._count.subordonne,
              poste: data.poste.designPoste,
            }
          })

          setRow(rows)

          console.log(rows)
      } catch (error) {
          console.error('Erreur lors de la requête:', error.response?.data || error.message);
      }
  };

  // Personnalisation des cellules
  const renderRow = (item)=>(
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-green-400/10">
      <td className="p-3">
        <User   
        name={item.name}
        description={item.email}
        avatarProps={{
          src: "/illustration1.png"
        }}
        />
      </td>
      <td className="hidden md:table-cell font-mono">{item.managerId}</td>
      <td className="hidden md:table-cell font-mono"><span className="text-2xl font-semibold">{item.nbrSub}</span> employes</td>
      <td className="hidden md:table-cell font-mono">{item.poste}</td>
      <td className="hidden lg:table-cell font-mono">{item.etablissement}</td>
      <td>
        <div className="flex items-center gap-4">
          <Tooltip content="Inspecter" color="success" showArrow={true}>
            <Link href={`/dashboard/manager/${item.id}`}>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400">
                <img src="/view.png" alt="" width={20} height={20}/>
              </button>
            </Link>
          </Tooltip>
          {role == roles && (
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
          )}
        </div>
      </td>
    </tr>
  )

  return (
    <div className="bg-white shadow-lg p-4 rounded-md flex-1 m-4 mt-0">
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
      <div className="">
        <Table col={col} render={renderRow} data={row}/>
      </div>
      {/* PAGINATION */}
      <div className="mt-4 flex justify-center">
        <Pagination loop showControls total={10} initialPage={1} variant="faded" className="rounded-md bg-[#f1f1f1]"/>
      </div>
    </div>
  )
}

export default ManagerPage