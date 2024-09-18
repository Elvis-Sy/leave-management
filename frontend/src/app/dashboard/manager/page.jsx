import TableSearch from "../../components/TableSearch"
import Pagination from "../../components/Pagination"
import Table from "../../components/Table"
import Link from "next/link"

const actuel = "admin"
const role =["admin", "manager"]

const data = [
  {
    id: 1,
    managerId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    nbrSub: "3054",
    poste: "Directeur",
  },
  {
    id: 2,
    managerId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    nbrSub: "3054",
    poste: "Directeur",
  },
  {
    id: 3,
    managerId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    nbrSub: "3054",
    poste: "Directeur",
  },
  {
    id: 6,
    managerId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    nbrSub: "3054",
    poste: "Directeur",
  },
  {
    id: 4,
    managerId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    nbrSub: "3054",
    poste: "Directeur",
  },
  {
    id: 5,
    managerId: "123123",
    name: "Jenna ortega",
    email: "jenna@gmail.com",
    photo: "/illustration1.png",
    etablissement: "Direction informatique",
    nbrSub: "3054",
    poste: "Directeur",
  }
]

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

  // Personnalisation des cellules
  const renderRow = (item)=>(
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-green-400/10">
      <td className="flex items-center gap-4 p-4">
        <img src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover"/>
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell font-mono">{item.managerId}</td>
      <td className="hidden md:table-cell font-mono"><span className="text-2xl font-semibold">{item.nbrSub}</span> employes</td>
      <td className="hidden md:table-cell font-mono">{item.poste}</td>
      <td className="hidden lg:table-cell font-mono">{item.etablissement}</td>
      <td>
        <div className="flex items-center gap-4">
          <Link href={`/list/employes/${item.id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400">
              <img src="/view.png" alt="" width={20} height={20}/>
            </button>
          </Link>
          {role.includes(actuel) && (
            <div className="flex gap-4">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#829af8]">
                <img src="/edit.png" alt="" width={20} height={20}/>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e66165]">
                <img src="/delete.png" alt="" width={20} height={20}/>
              </button>
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
      <Pagination/>
    </div>
  )
}

export default ManagerPage