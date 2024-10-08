import React from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button,} from '@nextui-org/react'
import axios from 'axios';

const SuppEmploye = ({onClose, idEmp, all}) => {

    const supp = async (idEmp) => {
        try {
          await axios.delete(`http://localhost:5000/api/employes/${idEmp}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
    
          all()
          onClose()
    
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
            setRow([])
        }
      }; 

  return (
    <ModalContent>
        {(onClose) => (
        <>
            <ModalHeader className='flex justify-center'><img src="/delete2.png" alt="" width={30} height={30}/></ModalHeader>
            <ModalBody>
                <p className="mb-2 px-2 text-center font-semibold text-gray-700">Etes-vous sûr de vouloir continuer la supression cet(te) employé(e) ?</p>
            </ModalBody>
            <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
                Non, annuler
            </Button>
            <Button color="primary" type='submit' onPress={()=>supp(idEmp)}>
                Oui, continuer
            </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default SuppEmploye