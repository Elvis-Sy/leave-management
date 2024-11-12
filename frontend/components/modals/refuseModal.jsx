import React from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea} from '@nextui-org/react'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

const RefuseModal = ({onClose, id, reload}) => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const refuse = async (data, idDM = '', idUser = '') => {
        if (typeof window === 'undefined') return;
        
        try {
        
            let query = `http://localhost:5000/api/demandes/refuse?idDM=${encodeURIComponent(idDM)}`;
            
        
            if (idUser) {
                query += `&idUser=${encodeURIComponent(idUser)}`;
            }
        
            const response = await axios.patch(query, data, {
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

    const onSubmit = (data) => {
        refuse(data, id, localStorage.getItem('id'));
    };

  return (
    <ModalContent>
        {(onClose) => (
        <>
            <ModalHeader className='flex justify-center'>
                <Image src="/refuse.png" alt="refuse" width={70} height={70}/>
            </ModalHeader>
            <ModalBody>
                <p className="mb-2 dark:text-white px-2 text-center font-semibold text-gray-700">
                    Etes-vous sûr de vouloir refuser cette demande ?
                </p>
                <div className="mb-4">
                    <Textarea 
                        variant='bordered'
                        label="Motif du refus" 
                        placeholder="Entrez le motif du refus..." 
                        isRequired
                        className="w-full"
                        {...register('motif', { 
                            required: 'Ce champ est requis', 
                        })}
                        isInvalid={!!errors.motif}
                        errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.motif ? errors.motif.message : ''}</span>}
                    />
                </div>
            </ModalBody>
            <ModalFooter className='mt-0'>
                <Button variant="light" onPress={onClose}>
                    Non, annuler
                </Button>
                <Button color="danger" type='submit' onPress={handleSubmit(onSubmit)}>
                    Oui, refuser
                </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default RefuseModal