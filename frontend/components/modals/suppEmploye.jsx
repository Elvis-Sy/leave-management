import React from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button,} from '@nextui-org/react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';

const SuppEmploye = ({onClose, idEmp, all}) => {

    const supp = async (idEmp) => {
        try {
          const response = await axios.patch(`http://localhost:5000/api/employes/delete/${idEmp}`, {}, {
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
            <ModalHeader className='flex items-center ml-8'>
                <Image src="/delete.png" alt="delete" width={30} height={30}/>
                <p className="text-medium px-2 text-left font-semibold dark:text-white text-gray-700">Etes-vous sûr de vouloir archiver cet(te) employé(e) ?</p>
            </ModalHeader>
            <ModalBody>
                
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