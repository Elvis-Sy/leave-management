"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Autocomplete,
  AutocompleteItem,
  Pagination
} from "@nextui-org/react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { TableWrapper } from "@/components/table/table";
import { colValide } from "../table/data";
import { RenderCell } from "../table/render-valide";
import TableSearch from "../table/tableSearch";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Image from "next/image";

export const Valides = () => {
  const [type, setType] = useState([]);
  const [row, setRow] = useState([]);
  const [tempRow, setTempRow] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Nombre de lignes par page
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [typeConge, setTypeConge] = useState();

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/demandes/valid", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setRow(response.data.demande);
      setTempRow(response.data.demande);
    } catch (error) {
      console.error("Erreur lors de la requête:", error.response?.data || error.message);
      setRow([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
    getType();
  }, [fetchData]);

  const getType = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/details/types", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setType(response.data.type);
    } catch (error) {
      console.error("Erreur lors de la récupération des types:", error);
      setType([]);
    }
  };

  const searchValid = (val) => {
    const temp = tempRow.filter((item) => item.name.toLowerCase().includes(val.toLowerCase()));
    setRow(temp);
  };

  const filtreEmploye = async (type = "", dateDebut = "", dateFin = "") => {
    if (!type && !dateDebut && !dateFin) {
      fetchData();
      return;
    }

    try {
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (dateDebut) params.append("dateDebut", dateDebut);
      if (dateFin) params.append("dateFin", dateFin);

      const response = await axios.get(`http://localhost:5000/api/demandes/validFiltre?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setRow(response.data.demande || []);
    } catch (error) {
      console.error("Erreur lors de la requête:", error.response?.data || error.message);
      setRow([]);
    }
  };

  // Mémorisation des données paginées
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return row.slice(startIndex, endIndex);
  }, [row, currentPage]);

  // Pagination
  const totalPages = Math.ceil(row.length / rowsPerPage);

  return (
    <div className="my-8 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ToastContainer />

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <TableSearch search={searchValid} all={fetchData} />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <div className="flex items-center gap-4 self-end">
            {/* FILTER */}
            <Popover placement="left" showArrow={true} className="filter2">
              <PopoverTrigger>
                <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0070f0]">
                  <Image src="/filter.png" alt="filtre" width={20} height={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-4 flex flex-col gap-3">
                {/* Filtrage par date */}
                <div className="flex flex-col gap-1">
                    <h5 className="text-bleuspat font-medium">Par date</h5>
                    <div className="flex items-center gap-1">
                        <span>Entre</span>
                        <input type="date" className="border p-2 rounded-xl" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
                        <span>et</span>
                        <input type="date" className="border p-2 rounded-xl" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
                    </div>
                </div>

                {/* Filtrage par type de congé */}
                <div className="flex flex-col gap-1 w-full">
                  <h5 className="text-bleuspat font-medium">Par types de congés</h5>
                  <Autocomplete
                    variant="bordered"
                    label="Type de congés"
                    placeholder="Recherche du type"
                    className="w-full font-semibold auto"
                    defaultItems={type}
                    defaultSelectedKey={typeConge}
                    onSelectionChange={setTypeConge}
                  >
                    {(item) => <AutocompleteItem value={item.value} key={item.value}>{item.label}</AutocompleteItem>}
                  </Autocomplete>
                </div>

                <Button variant="flat" className="w-full" color="primary" onPress={() => filtreEmploye(typeConge, dateDebut, dateFin)}>
                  Filtrer
                </Button>
              </PopoverContent>
            </Popover>

          </div>

          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper RenderCell={RenderCell} columns={colValide} users={paginatedData} />
      </div>
      {/* PAGINATION */}
      <div className="mt-4 flex justify-center">
        <Pagination
          loop
          showControls
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
          variant="faded"
          className="rounded-md"
        />
      </div>
    </div>
  );
};