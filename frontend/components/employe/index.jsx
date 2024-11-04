"use client";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Pagination,
  Autocomplete,
  AutocompleteItem,
  Modal,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { TableWrapper } from "@/components/table/table";
import { colEmploye } from "../table/data";
import { RenderCell } from "../table/render-employe";
import TableSearch from "../table/tableSearch";
import axios from "axios";
import { AddIcon } from "../icons/table/add-icon";
import NewEmploye from "../modals/newEmploye";
import { ToastContainer } from "react-toastify";
import SuppEmploye from "../modals/suppEmploye";
import ModifEmploye from "../modals/modifEmploye";

const BASE_URL = "http://localhost:5000/api";
const headers = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export const EmployePage = React.memo(() => {
  const [row, setRow] = useState([]);
  const [tempRow, setTempRow] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const [selectedSort, setSelectedSort] = useState("ASC");
  const [openModal, setOpenModal] = useState(null);
  const [idSupp, setId] = useState(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [etablissement, setEtablissement] = useState(null);
  const [etab, setEtab] = useState([]);

  const handleEtablissementSelect = (item) => setEtablissement(item);

  const handleFiltrer = () => filtreEmploye(etablissement, dateDebut, dateFin);

  const onOpen = (modalId) => setOpenModal(modalId);
  const onClose = () => setOpenModal(null);

  const fetchData = useCallback(async (url, setData) => {
    try {
      const response = await axios.get(url, { headers });
      setData(response.data);
    } catch (error) {
      console.error("Erreur de requête:", error.response?.data || error.message);
    }
  }, []);

  const reloadData = () => {
    fetchData(`${BASE_URL}/employes/all`, (data) => {
        setRow(data.employe);
        setTempRow(data.employe);
    });
    fetchData(`${BASE_URL}/details/etablissement`, (data) => setEtab(data.etabi));
};

  useEffect(() => {
    reloadData()
  }, [fetchData]);

  const searchEmploye = (val) => {
    const filtered = tempRow.filter((item) =>
      item.name.toLowerCase().includes(val.toLowerCase())
    );
    setRow(filtered);
  };

  const filtreEmploye = async (etablissement = "", dateDebut = "", dateFin = "") => {
    let query = `${BASE_URL}/employes/filtre?`;

    if (etablissement) query += `etablissement=${encodeURIComponent(etablissement)}&`;
    if (dateDebut || dateFin) query += `dateDebut=${encodeURIComponent(dateDebut || dateFin)}&dateFin=${encodeURIComponent(dateFin || dateDebut)}`;

    if (query.endsWith("&")) query = query.slice(0, -1);

    fetchData(query, (data) => setRow(data.employe || []));
  };

  const totalPages = Math.ceil(row.length / rowsPerPage);
  const paginatedData = Array.isArray(row) ? row.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : [];

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSortClick = (order) => {
    const sortedData = [...row].sort((a, b) => (order === "ASC" ? a.DateEmb > b.DateEmb : a.DateEmb < b.DateEmb) ? 1 : -1);
    setRow(sortedData);
    setSelectedSort(order);
  };

  return (
    <div className="my-4 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ToastContainer />
      <ul className="flex gap-2">
        <li className="flex gap-2">
          <UsersIcon />
          <span>Employés</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <Link href={"/employes"}>
            {" "}
            <span>Liste</span>
          </Link>
        </li>
      </ul>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <TableSearch search={searchEmploye} all={fetchData} />

        <div className="flex flex-row gap-3.5 flex-wrap">
          <Popover placement="left" showArrow={true} className="filter2">
            <PopoverTrigger>
              <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0070f0]">
                <img src="/filter.png" alt="" width={20} height={20}/>
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                  <h5 className="text-bleuspat font-medium">Par date</h5>
                  <div className="flex items-center gap-1">
                      <span>Entre</span>
                      <input type="date" className="border p-2 rounded-xl" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
                      <span>et</span>
                      <input type="date" className="border p-2 rounded-xl" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
                  </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                  <h5 className="text-bleuspat font-medium">Par types de congés</h5>
                  <Autocomplete variant="bordered" label="Etablissement" placeholder="Recherche de poste" className="w-full font-semibold auto"
                    defaultItems={etab}
                    defaultSelectedKey={etablissement}
                    onSelectionChange={handleEtablissementSelect}
                  >
                    {(item) => <AutocompleteItem value={item.value} key={item.value}>{item.label}</AutocompleteItem>}
                  </Autocomplete>
              </div>
              <Button variant="flat" className="w-full" color="primary" onPress={handleFiltrer}>Filtrer</Button>
            </PopoverContent>
          </Popover>

          <Popover placement="bottom" showArrow={true}>
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

          <Button color="primary" onPress={()=> onOpen("ajoutModal")} startContent={<AddIcon />}>Ajouter</Button>
          <Button color="primary" startContent={<ExportIcon />}>Export to CSV</Button>
        </div>
      </div>

      <TableWrapper RenderCell={(props) => <RenderCell {...props} onOpen={onOpen} setId={setId} />} columns={colEmploye} users={paginatedData} />

      <div className="mt-4 flex justify-center">
         <Pagination 
           loop showControls
           total={totalPages} 
           page={currentPage} 
           onChange={handlePageChange} 
           variant="faded" 
           className="rounded-md"/>
      </div>

      <Modal isOpen={openModal == "ajoutModal"} onClose={onClose} size="2xl">
        <NewEmploye onClose={onClose} reload={reloadData} />
      </Modal>

      <Modal isOpen={openModal == "suppModal"} onClose={onClose} size="md">
        <SuppEmploye onClose={onClose} idEmp={idSupp} all={reloadData} />
      </Modal>

      <Modal isOpen={openModal == "modifModal"} onClose={onClose} size="2xl">
        <ModifEmploye onClose={onClose} idEmploye={idSupp} all={reloadData} />
      </Modal>
    </div>
  );
});