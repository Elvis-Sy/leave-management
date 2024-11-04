"use client";

import React, { useEffect, useState, useRef } from "react";
import { TableWrapper } from "@/components/table/table";
import { colType } from "../table/data";
import { RenderCell } from "../table/render-type";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Pagination, Button, Input, Modal } from "@nextui-org/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModifType from '../modals/modifType';
import SuppType from '../modals/suppType';

const Type = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState('');
  const [openModal, setOpenModal] = useState(null);
  const rowsPerPage = 7; // Nombre de lignes par page

  useEffect(() => {
    fetchTypes();
  }, []);

  // Fonction pour ouvrir les modals
  const openModalHandler = (modalId) => {
    setOpenModal(modalId);
  };

  // Fonction pour fermer les modals
  const closeModalHandler = () => {
    setOpenModal(null);
  };

  // Récupérer tous les types
  const fetchTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/conges/list', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRows(response.data.type);
    } catch (error) {
      console.error('Erreur lors de la récupération des types:', error);
      setRows([]);
    }
  };

  // Soumettre le formulaire
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/conges/ajout', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.cause) {
        toast.warn(response.data.cause, {
          position: "top-right",
          autoClose: 3000
        });
      } else {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 2000
        });
        reset(); // Réinitialiser le formulaire après soumission
        fetchTypes(); // Recharger les types
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  // Pagination
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const paginatedData = rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <ToastContainer />
      <div className="my-6 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-5">
        <h1 className="text-xl font-semibold">Types de congé disponibles</h1>

        {/* Formulaire d'ajout */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-default-50 p-4 rounded-lg flex flex-col md:flex-row gap-4">
          <Input
            isRequired
            label="Design"
            {...register('designType', { required: 'Le design est requis' })}
            isInvalid={!!errors.designType}
            errorMessage={errors.designType?.message && (
              <span className="flex justify-start text-[#f31260] text-xs">{errors.designType.message}</span>
            )}
          />

          <Input
            isRequired
            label="Plafond"
            {...register('nbJours', {
              required: 'Le plafond est requis',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Le champ doit contenir que des chiffres'
              },
              setValueAs: (value) => Number(value)
            })}
            isInvalid={!!errors.nbJours}
            errorMessage={errors.nbJours?.message && (
              <span className="flex justify-start text-[#f31260] text-xs">{errors.nbJours.message}</span>
            )}
            placeholder="Nombre de jours"
          />

          <div className="flex items-center gap-2">
            <Button type="submit" color="primary">Ajouter</Button>
            <Button type="reset" variant="light" color="danger" onClick={() => reset()}>Réinitialiser</Button>
          </div>
        </form>

        {/* Tableau des types de congé */}
        <div className="max-w-[95rem] mx-auto w-full">
          <TableWrapper 
            RenderCell={(props) => <RenderCell {...props} onOpen={openModalHandler} setId={setSelectedId} />}
            columns={colType}
            users={paginatedData}
          />
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination 
            loop 
            showControls
            total={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            variant="faded" 
            className="rounded-md" 
          />
        </div>
      </div>

      {/* Modal pour supprimer un type */}
      <Modal isOpen={openModal === "suppModal"} onClose={closeModalHandler} size="sm">
        <SuppType onClose={closeModalHandler} id={selectedId} all={fetchTypes} />
      </Modal>

      {/* Modal pour modifier un type */}
      <Modal isOpen={openModal === "modifModal"} onClose={closeModalHandler} size="2xl">
        <ModifType onClose={closeModalHandler} id={selectedId} reload={fetchTypes} opt={rows} />
      </Modal>
    </>
  );
};

export default Type;