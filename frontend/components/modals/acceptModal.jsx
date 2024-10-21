import React from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button,} from '@nextui-org/react'
import axios from 'axios';

const AcceptModal = ({onClose, id, reload}) => {

    //Filtrage des donnees
    const accept = async (idDM = '', idUser = '') => {
        try {
        
            let query = `http://localhost:5000/api/demandes/accept?idDM=${encodeURIComponent(idDM)}`;
            
        
            if (idUser) {
                query += `&idUser=${encodeURIComponent(idUser)}`;
            }
        
            const response = await axios.patch(query, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log(response.data.message)
            onClose()
            reload()
    
        
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
    };


  return (
    <ModalContent>
        {(onClose) => (
        <>
            <ModalHeader className='flex justify-center'></ModalHeader>
            <ModalBody className='flex flex-row justify-center gap-1 items-center'>
                <img src="/approuve.png" alt="" width={30} height={30}/>
                <p className="mb-2 dark:text-white px-2 text-center font-semibold text-gray-700">Approuver la demande de congé ?</p>
            </ModalBody>
            <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
                Annuler
            </Button>
            <Button color="success" type='submit' onPress={()=>accept(id, localStorage.getItem('id'))}>
                Confirmer
            </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default AcceptModal