import TableSearch from "../../../components/TableSearch"
import Pagination from "../../../components/Pagination"
import Table from "../../../components/Table"
import Link from "next/link"

const actuel = "admin"
const role =["admin", "manager"]

const data = [
  {
    id: 1,
    demandeId: "123123",
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
  // {
  //   header: "",
  //   accessor: "1"
  // },
  // {
  //   header: "",
  //   accessor: "2", 
  //   className:"hidden md:table-cell"
  // },
  // {
  //   header: "",
  //   accessor: "3", 
  //   className:"hidden md:table-cell"
  // },
  // {
  //   header: "",
  //   accessor: "4", 
  //   className:"hidden md:table-cell"
  // },
  // {
  //   header: "",
  //   accessor: "5", 
  //   className:"hidden lg:table-cell"
  // },
  // {
  //   header: "",
  //   accessor: "6"
  // },
]

const DemandePage = ()=> {

  // Personnalisation des cellules
  const renderRow = (item)=>(
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-green-400/10">
      <td className="flex items-center gap-4 p-4 w-fit">
        <img src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover"/>
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.etablissement} / {item.poste}</p>
        </div>
      </td>

      <td className="font-mono hidden md:table-cell">
        <div className="flex items-center gap-4 p-4">
          <img src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover"/>
          <div className="flex flex-col">
            <h3 className="font-semibold text-md">{item.type}</h3>
            <p className="text-xs text-gray-500"><span className="text-sm text-gray-500 font-medium">{item.nbrJrs}</span> jours</p>
          </div>
        </div>
      </td>

      <td className="hidden lg:table-cell font-mono">
        <div className="flex items-center gap-4 p-4">
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
          {/* <Link href={`/list/employes/${item.id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400">
              <img src="/view.png" alt="" width={20} height={20}/>
            </button>
          </Link> */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-green-400/20">
            <img src="/accept.png" alt="" width={30} height={30}/>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e66165]/20">
            <img src="/reject.png" alt="" width={25} height={25}/>
          </button>
          {/* {role.includes(actuel) && (
            <div className="flex gap-4">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#829af8]">
                <img src="/edit.png" alt="" width={20} height={20}/>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e66165]/20">
                <img src="/reject.png" alt="" width={20} height={20}/>
              </button>
            </div>
          )} */}
        </div>
      </td>
    </tr>
  )

  return (
    <div className="bg-white shadow-lg p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex justify-between items-center">
        <div className="flex gap-10">
          <h1 className="hidden md:block text-lg font-semibold">Tout</h1>
          <h1 className="hidden md:block text-lg font-semibold text-gray-500">En attente</h1>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch/>
        </div>
      </div>
      {/* TABLE */}
      <div className="">
        <Table col={col} render={renderRow} data={data}/>
      </div>
      {/* PAGINATION */}
      <Pagination/>
    </div>
  )
}

export default DemandePage