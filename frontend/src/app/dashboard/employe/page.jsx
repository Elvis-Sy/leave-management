import TableSearch from "../../components/TableSearch"
import Table from "../../components/Table"
import Link from "next/link"
import {Tooltip, User, Chip, Avatar, Pagination} from '@nextui-org/react'

const actuel = "admin"
const role =["admin", "manager"]

const data = [
  {
    id: 1,
    employeId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    poste: "Secretaire",
    DateEmb: "20-01-2024",
    Etablissement: "Direction informatique",
    manager: "Kim Dokja",
  },
  {
    id: 2,
    employeId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    poste: "Secretaire",
    DateEmb: "20-01-2024",
    Etablissement: "Direction informatique",
    manager: "Kim Dokja",
  },
  {
    id: 3,
    employeId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    poste: "Secretaire",
    DateEmb: "20-01-2024",
    Etablissement: "Direction informatique",
    manager: "Kim Dokja",
  },
  {
    id: 6,
    employeId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    poste: "Secretaire",
    DateEmb: "20-01-2024",
    Etablissement: "Direction informatique",
    manager: "Kim Dokja",
  },
  {
    id: 4,
    employeId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    poste: "Secretaire",
    DateEmb: "20-01-2024",
    Etablissement: "Direction informatique",
    manager: "Kim Dokja",
  },
  {
    id: 5,
    employeId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    poste: "Secretaire",
    DateEmb: "20-01-2024",
    Etablissement: "Direction informatique",
    manager: "Kim Dokja",
  }
]

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

  // Personnalisation des cellules
  const renderRow = (item)=>(
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-green-400/10">
      <td className="flex items-center gap-4 p-4">
        <User   
          name={item.name}
          description={item.email}
          avatarProps={{
            src: "/illustration1.png"
          }}
        />
      </td>
      <td className="hidden md:table-cell font-mono">{item.employeId}</td>
      <td className="hidden md:table-cell font-mono">{item.DateEmb}</td>
      <td className="hidden md:table-cell font-mono">{item.Etablissement}</td>
      <td className="hidden lg:table-cell font-mono">{item.poste}</td>
      <td className="hidden lg:table-cell font-mono">
        <Chip
          variant="flat"
          size="lg"
          avatar={
            <Avatar
              name={item.manager}
              src="/illustration1.png"
            />
          }
        >
          {item.manager}
        </Chip>
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
          {role.includes(actuel) && (
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
          <div className="flex items-center gap-4 self-end">
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
              <img src="/filter.png" alt="" width={14} height={14}/>
            </button>
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
              <img src="/sort.png" alt="" width={14} height={14}/>
            </button>
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
              <img src="/plus.png" alt="" width={14} height={14}/>
            </button>
          </div>
        </div>
      </div>
      {/* TABLE */}
      <div className="">
        <Table col={col} render={renderRow} data={data}/>
      </div>
      {/* PAGINATION */}
      <div className="mt-4 flex justify-center">
        <Pagination loop showControls total={10} initialPage={1} variant="faded" className="rounded-md bg-[#f1f1f1]"/>
      </div>
    </div>
  )
}

export default EmployePage