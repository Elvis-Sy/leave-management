"use client";
import { Modal, Popover, PopoverTrigger, PopoverContent, Button, Autocomplete, AutocompleteItem, Pagination } from '@nextui-org/react';
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import AccepModal from '@/components/modals/acceptModal';
import RefuseModal from '@/components/modals/refuseModal';
import { TableWrapper } from "@/components/table/table";
import { colAttente } from "../table/data";
import { RenderCell } from "../table/render-attente";
import TableSearch from "../table/tableSearch"; 
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import debounce from 'lodash.debounce'; // Make sure to install lodash

export const Attentes = () => {
    const [type, setType] = useState([]);
    const [row, setRow] = useState([]);
    const [tempRow, setTempRow] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [typeConge, setTypeConge] = useState();
    const [openModal, setOpenModal] = useState(null);
    const [idSupp, setId] = useState(null);

    const fetchAllAttente = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/demandes/attente', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRow(response.data.demande);
            setTempRow(response.data.demande);
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
            setRow([]);
        }
    }, []);

    const fetchType = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/details/types', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setType(response.data.type);
        } catch (error) {
            console.error("Error fetching types:", error);
            setType([]);
        }
    }, []);

    const handleTypeSelect = (value) => {
      setTypeConge(value);
    };

    useEffect(() => {
        fetchAllAttente();
        fetchType();
    }, [fetchAllAttente, fetchType]);

    const handleSearch = useCallback(debounce(async (val) => {
        const temp = tempRow.filter(item => item.name.toLowerCase().includes(val.toLowerCase()));
        setRow(temp);
    }, 300), [tempRow]);

    const handleFiltrer = useCallback(async () => {
        try {
            if (!typeConge && !dateDebut && !dateFin) {
                fetchAllAttente();
                return;
            }

            const queryParams = new URLSearchParams({
                ...(typeConge && { type: typeConge }),
                ...(dateDebut && { dateDebut: dateDebut }),
                ...(dateFin && { dateFin: dateFin })
            }).toString();

            const response = await axios.get(`http://localhost:5000/api/demandes/attenteFiltre?${queryParams}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            console.log(response.data)

            setRow(response.data.demande || []);
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
            setRow([]);
        }
    }, [typeConge, dateDebut, dateFin, fetchAllAttente]);

    const handlePageChange = (page) => setCurrentPage(page);

    const totalPages = Math.ceil(row.length / rowsPerPage);
    const paginatedData = row.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const onOpen = (modalId) => setOpenModal(modalId);
    const onClose = () => setOpenModal(null);

    return (
        <div className="my-8 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
            <ToastContainer />
            <div className="flex justify-between flex-wrap gap-4 items-center">
                <TableSearch search={handleSearch} all={fetchAllAttente} />
                <div className="flex flex-row gap-3.5 flex-wrap">
                    <Popover placement="left" showArrow={true} className="filter2">
                        <PopoverTrigger>
                            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0070f0]">
                                <img src="/filter.png" alt="" width={20} height={20} />
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
                                <Autocomplete variant="bordered" label="Type de conges" placeholder="Recherche du type" className="w-full font-semibold auto" defaultItems={type} defaultSelectedKey={typeConge} onSelectionChange={handleTypeSelect}>
                                    {(item) => <AutocompleteItem value={item.value} key={item.value}>{item.label}</AutocompleteItem>}
                                </Autocomplete>
                            </div>
                            <Button variant="flat" className="w-full" color="primary" onPress={handleFiltrer}>Filtrer</Button>
                        </PopoverContent>
                    </Popover>
                    <Button color="primary" startContent={<ExportIcon />}>Export to CSV</Button>
                </div>
            </div>
            <TableWrapper RenderCell={(props) => <RenderCell {...props} onOpen={onOpen} setId={setId} />} columns={colAttente} users={paginatedData} />
            <div className="mt-4 flex justify-center">
                <Pagination loop showControls total={totalPages} page={currentPage} onChange={handlePageChange} variant="faded" className="rounded-md" />
            </div>
            <Modal isOpen={openModal} onClose={onClose} size="sm">
                {openModal === "AcceptModal" && <AccepModal onClose={onClose} id={idSupp} reload={fetchAllAttente}/>}
                {openModal === "RefuseModal" && <RefuseModal onClose={onClose} id={idSupp} reload={fetchAllAttente}/>}
            </Modal>
        </div>
    );
};

export default Attentes;