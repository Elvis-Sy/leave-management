"use client"

// import Pagination from "../../../components/Pagination"
import Table from "../../../components/Table"
import { Tabs, Tab, Card, CardBody, Badge, Tooltip, Pagination} from '@nextui-org/react';

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
  {
    header: "Info demandeur",
    accessor: "infoD"
  },
  {
    header: "Info demande",
    accessor: "infoDemande", 
    className: "hidden md:table-cell"
  },
  {
    header: "Date debut - fin",
    accessor: "Duree", 
    className:"hidden lg:table-cell"
  },
  {
    header: "Actions",
    accessor: "actions"
  },
]

const DemandePage = ()=> {

  // Personnalisation des cellules
  const renderRow = (item)=>(
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-green-400/10">
      <td className="flex items-center gap-4 p-3 w-fit">
        <img src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover"/>
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.etablissement} / {item.poste}</p>
        </div>
      </td>

      <td className="font-mono hidden md:table-cell">
        <div className="flex items-center gap-4">
          <img src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover"/>
          <div className="flex flex-col">
            <h3 className="font-semibold text-md">{item.type}</h3>
            <p className="text-xs text-gray-500"><span className="text-sm text-gray-500 font-medium">{item.nbrJrs}</span> jours</p>
          </div>
        </div>
      </td>

      <td className="hidden lg:table-cell font-mono">
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
          {/* <Link href={`/list/employes/${item.id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400">
              <img src="/view.png" alt="" width={20} height={20}/>
            </button>
          </Link> */}
          <Tooltip content="Approuver" color="success" showArrow={true}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-400/20">
              <img src="/accept.png" alt="" width={25} height={25}/>
            </button>
          </Tooltip>
          <Tooltip content="Refuser" color="danger" showArrow={true}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e66165]/20">
              <img src="/reject.png" alt="" width={20} height={20}/>
            </button>
          </Tooltip>
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
    <div className="bg-white shadow-lg p-4 rounded-md flex-1 m-3 mt-0">
      {/* TOP */}
      <Tabs aria-label="Options" className="m-0">
        
        <Tab title="Tout" className="text-md font-medium">
          <Card style={{boxShadow: "none"}}>
            <CardBody>
              <Table col={col} render={renderRow} data={data} margin={0}/>
              <div className="mt-4 flex justify-center">
                <Pagination loop showControls total={10} initialPage={1} variant="faded" className="rounded-md bg-[#dddedf]"/>
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab title={
          <Badge content={10} color="danger">
            En attente
          </Badge>
        } className="text-md font-medium">
          <Card style={{boxShadow: "none"}}>
            <CardBody>
              <Table col={col} render={renderRow} data={data} margin={0}/>
              <div className="mt-4 flex justify-center">
                <Pagination loop showControls total={10} initialPage={1} variant="faded" className="rounded-md bg-[#dddedf]"/>
              </div>
            </CardBody>
          </Card>
          
        </Tab>
        
      </Tabs>
      {/* PAGINATION */}
      
    </div>
  )
}

export default DemandePage
