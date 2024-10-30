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
import ModifType from '../modals/modifType'
import SuppType from '../modals/suppType'

const Type = () => {

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [row, setRow] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [id, setId] = useState('')
  const [openModal, setOpenModal] = useState(null);
  const rowsPerPage = 7 // Nombre de lignes par page
  const formRef = useRef()

  useEffect(() => {
    allMembre()
    const id = localStorage.getItem('id');
    if(id){
        setId(id)
    }
  }, []);

  //Ouvertur modal
  const onOpen = (modalId) => {
    setOpenModal(modalId);
  };

  //Fermeture modal
  const onClose = () => {
    setOpenModal(null);
  };

  //Prendre les donnees
  const allMembre = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/conges/list', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        setRow(response.data.type)

    } catch (error) {
        console.error('Erreur lors de la requête:', error.response?.data || error.message);
        setRow([])
    }
  };  

  //Envoie form
  const onSubmit = async (data)=>{
    try {
      const response = await axios.post('http://localhost:5000/api/conges/ajout', data, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      });

      if(response.data.cause){
        toast.warn(`${response.data.cause}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success(`${response.data.message}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        formRef.current.dispatchEvent(new Event('reset', { bubbles: true }));
        allMembre()         
      }

  } catch (error) {
      console.error('Erreur lors de la requête:', error.response?.data || error.message);
  }
  }

  //Gestion de la pagination et des pages
    //Calcul des nombres de pages
    const totalPages = Math.ceil(row.length / rowsPerPage)

    //Diviser les donnes selon le nombre de page
    const paginatedData = row.slice(
      (currentPage - 1) * rowsPerPage, 
      currentPage * rowsPerPage
    ) 

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }


  return (
    <>
      <ToastContainer/>
      <div className="my-6 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-5">
        <h1 className="text-xl font-semibold">Type de congé disponible</h1>

        <form onSubmit={handleSubmit(onSubmit)} ref={formRef} className="bg-default-50 p-4 rounded-lg flex flex-col md:flex-row gap-4">

          <Input
            isRequired
            label="Design"
            {...register('designType', { 
              required: 'Le design est requis', 
            })}
            isInvalid={!!errors.designType}
            errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.designType ? errors.designType.message : ''}</span>}
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
            errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.nbJours ? errors.nbJours.message : ''}</span>}
            placeholder="Nombre de jours"
          />

          <div className="flex items-center gap-2">
            <Button type="submit" color="primary">Ajouter</Button>
            <Button type="reset" variant="light" color="danger">Reset</Button>
          </div>

        </form>

        <div className="max-w-[95rem] mx-auto w-full">
          <TableWrapper RenderCell={(props) => <RenderCell {...props} onOpen={onOpen} setId={setId}/>} columns={colType} users={paginatedData}/>
        </div>
        {/* PAGINATION */}
        <div className="mt-4 flex justify-center">
          <Pagination 
            loop showControls
            total={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            variant="faded" 
            className="rounded-md"/>
        </div>
      </div>

      <Modal isOpen={openModal == "suppModal"} onClose={onClose} size="sm">
        <SuppType onClose={onClose} id={id} all={allMembre}/>
      </Modal>

      <Modal isOpen={openModal == "modifModal"} onClose={onClose} size="2xl">
        <ModifType onClose={onClose} id={id} reload={allMembre} opt={row}/>
      </Modal>
    </>
  );
};

export default Type;
