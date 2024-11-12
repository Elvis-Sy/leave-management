import React from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button,} from '@nextui-org/react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';

const RetirerFerrier = ({onClose, id, reload}) => {

    const retirer = async (id) => {
        try {
          const response = await axios.delete(`http://localhost:5000/api/ferrier/${id}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
    
          reload()
          onClose()

          toast(`${response.data.message}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: { color: "red"}
          });
    
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
      }; 

  return (
    <ModalContent>
        {(onClose) => (
        <>
            <ModalHeader className='flex justify-center'><Image src="/retirer.png" alt="retire" width={50} height={50}/></ModalHeader>
            <ModalBody>
                <p className="mb-2 px-2 text-center font-semibold text-gray-700">Etes-vous sûr de vouloir retirer la date des jours ferriés ?</p>
            </ModalBody>
            <ModalFooter>
            <Button color="primary" variant="light" onPress={onClose}>
                Non, annuler
            </Button>
            <Button color="danger" type='submit' onPress={() => retirer(id)}>
                Oui, continuer
            </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default RetirerFerrier