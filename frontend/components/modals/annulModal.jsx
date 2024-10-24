import React from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea} from '@nextui-org/react'
import axios from 'axios';

const AnnulModal = ({onClose, id, reload}) => {

    const annuler = async (id) => {
        try {
            const employeId = localStorage.getItem('id');
            const data = {
                idDemande: id,
                userId: employeId
            }
        
            const response = await axios.patch('http://localhost:5000/api/demandes/annulee', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            onClose()
            reload(localStorage.getItem('id'))
    
        
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
    };

  return (
    <ModalContent>
        {(onClose) => (
        <>
            <ModalHeader className='flex justify-center'></ModalHeader>
            <ModalBody>
                <p className="mb-2 dark:text-white px-2 text-center font-semibold text-gray-700">
                    Etes-vous sûr de vouloir annuler votre demande ?
                </p>
            </ModalBody>
            <ModalFooter className='mt-0'>
                <Button variant="light" onPress={onClose}>
                    retour
                </Button>
                <Button color="primary" type='submit' onPress={()=>annuler(id)}>
                    Confirmer
                </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default AnnulModal