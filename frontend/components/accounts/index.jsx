"use client";
import { Button, Popover, PopoverTrigger, PopoverContent, Pagination, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { TableWrapper } from "@/components/table/table";
import { colManager } from "../table/data";
import { RenderCell } from "../table/render-cell";
import TableSearch from "../table/tableSearch";
import axios from "axios";
import Image from "next/image";

export const Accounts = () => {
  const [row, setRow] = useState([]);
  const [tempRow, setTempRow] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState('ASC');
  const [etab, setEtab] = useState([]);
  const [etablissement, setEtablissement] = useState(null);

  const rowsPerPage = 6; // Nombre de lignes par page

  const allManager = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employes/manager', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRow(response.data.employe);
      setTempRow(response.data.employe);
    } catch (error) {
      console.error('Erreur lors de la requête:', error.response?.data || error.message);
    }
  }, []);

  const getEtab = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/details/etablissement', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEtab(response.data.etabi);
    } catch (error) {
      console.error("Erreur lors de la requête des établissements:", error);
      setEtab([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await allManager();
      await getEtab();
    })();
  }, [allManager, getEtab]);

  const handleEtablissementSelect = useCallback((obj) => {
    setEtablissement(obj);
  }, []);

  const handleFiltrer = useCallback(async () => {
    if (!etablissement) return allManager();

    try {
      const query = `http://localhost:5000/api/employes/managerFiltre?etablissement=${encodeURIComponent(etablissement)}`;
      const response = await axios.get(query, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRow(response.data.employe || []);
    } catch (error) {
      console.error('Erreur lors de la requête de filtrage:', error.response?.data || error.message);
      setRow([]);
    }
  }, [etablissement, allManager]);

  const searchManager = useCallback((val) => {
    setRow(tempRow.filter((item) => item.name.toLowerCase().includes(val.toLowerCase())));
  }, [tempRow]);

  const handleSortClick = useCallback((order) => {
    setRow((prevRow) =>
      [...prevRow].sort((a, b) => order === 'ASC' ? b.nbrSub - a.nbrSub : a.nbrSub - b.nbrSub)
    );
    setSelectedSort(order);
  }, []);

  const totalPages = Math.ceil(row.length / rowsPerPage);
  const paginatedData = row.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="my-6 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex gap-2">
        <li className="flex gap-2">
          <UsersIcon />
          <span>Managers</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <Link href={"/managers"}>
            {" "}<span>Liste</span>
          </Link>
        </li>
      </ul>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <TableSearch search={searchManager} all={allManager} />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <div className="flex items-center gap-4 self-end">
            <Popover placement="left" showArrow={true} className="filter2">
              <PopoverTrigger>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0070f0]">
                  <Image src="/filter.png" alt="filtre" width={20} height={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-4 flex flex-col gap-3">
                <Autocomplete
                  variant="bordered"
                  label="Etablissement"
                  placeholder="Recherche de poste"
                  className="w-full font-semibold auto"
                  items={etab}
                  selectedKey={etablissement?.value}
                  onSelectionChange={handleEtablissementSelect}
                >
                  {(item) => (
                    <AutocompleteItem key={item.value} value={item.value}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Button variant="flat" className="w-full" color="primary" onPress={handleFiltrer}>Filtrer</Button>
              </PopoverContent>
            </Popover>

            <Popover placement="bottom" showArrow={true} className="sort">
              <PopoverTrigger>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0070f0]">
                  <Image src="/sort.png" alt="sort" width={24} height={24} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-2 flex flex-col gap-2 w-[150px]">
                <Button variant="flat" onClick={() => handleSortClick('ASC')} className="w-full" color={selectedSort === 'ASC' ? 'primary' : 'default'}>ASC</Button>
                <Button variant="flat" onClick={() => handleSortClick('DESC')} className="w-full" color={selectedSort === 'DESC' ? 'primary' : 'default'}>DESC</Button>
              </PopoverContent>
            </Popover>
          </div>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper RenderCell={RenderCell} columns={colManager} users={paginatedData} />
      </div>
      <div className="mt-4 flex justify-center">
        <Pagination
          loop showControls
          total={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="faded"
          className="rounded-md"
        />
      </div>
    </div>
  );
};