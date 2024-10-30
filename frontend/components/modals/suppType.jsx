import React from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button,} from '@nextui-org/react'
import axios from 'axios';
import { toast } from 'react-toastify';

const SuppType = ({onClose, id, all}) => {

    const supp = async (id) => {
        try {
          const response = await axios.delete(`http://localhost:5000/api/conges/delete/${id}`, {
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
            style: {fontSize: "bolder", color: "#fa5252"},
          });
    
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
      }; 

  return (
    <ModalContent>
        {(onClose) => (
        <>
            <ModalHeader className='flex justify-center'><img src="/delete.png" alt="" width={30} height={30}/></ModalHeader>
            <ModalBody>
                <p className="mb-2 px-2 text-center font-semibold dark:text-white text-gray-700">Etes-vous sûr de vouloir continuer la supression ?</p>
            </ModalBody>
            <ModalFooter>
            <Button color="default" variant="light" onPress={onClose}>
                Non, annuler
            </Button>
            <Button color="danger" type='submit' onPress={()=>supp(id)}>
                Oui, continuer
            </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default SuppType