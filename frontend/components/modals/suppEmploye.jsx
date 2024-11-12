import React from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button,} from '@nextui-org/react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';

const SuppEmploye = ({onClose, idEmp, all}) => {

    const supp = async (idEmp) => {
        try {
          const response = await axios.delete(`http://localhost:5000/api/employes/${idEmp}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
    
          all()
          onClose()

          toast(`${response.data.message}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {fontSize: "bolder", fontWeight: "bolder", color: "#fa5252"},
          });
    
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
      }; 

  return (
    <ModalContent>
        {(onClose) => (
        <>
            <ModalHeader className='flex justify-center'><Image src="/delete.png" alt="delete" width={30} height={30}/></ModalHeader>
            <ModalBody>
                <p className="mb-2 px-2 text-center font-semibold dark:text-white text-gray-700">Etes-vous sûr de vouloir continuer la supression de cet(te) employé(e) ?</p>
            </ModalBody>
            <ModalFooter>
            <Button color="default" variant="light" onPress={onClose}>
                Non, annuler
            </Button>
            <Button color="danger" type='submit' onPress={()=>supp(idEmp)}>
                Oui, continuer
            </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default SuppEmploye