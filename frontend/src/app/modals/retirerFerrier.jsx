import React from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button,} from '@nextui-org/react'
import axios from 'axios';

const RetirerFerrier = ({onClose, id, reload}) => {

    const retirer = async (id) => {
        try {
          await axios.delete(`http://localhost:5000/api/ferrier/${id}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
    
          reload()
          onClose()
    
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
      }; 

  return (
    <ModalContent>
        {(onClose) => (
        <>
            <ModalHeader className='flex justify-center'><img src="/retirer.png" alt="" width={50} height={50}/></ModalHeader>
            <ModalBody>
                <p className="mb-2 px-2 text-center font-semibold text-gray-700">Etes-vous sûr de vouloir retirer la date des jours ferriés ?</p>
            </ModalBody>
            <ModalFooter>
            <Button color="primary" variant="light" onPress={onClose}>
                Non, annuler
            </Button>
            <Button color="danger" type='submit' onPress={()=>retirer(id)}>
                Oui, continuer
            </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default RetirerFerrier