import React from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input} from '@nextui-org/react'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const ExcelModal = ({onClose, id, reload}) => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const refuse = async (data) => {
        if (typeof window === 'undefined') return;
        
        try {

            data.idEmploye = id;
        
            const response = await axios.post('http://localhost:5000/api/demandes/export', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if(response.data.cause){
                toast.warn(`${response.data.cause}`, {
                    position: "top-right",
                    autoClose: 2000,
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
            }
                

            onClose()
        
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
    };

    const onSubmit = (data) => {
        refuse(data, id);
    };

  return (
    <ModalContent>
        {(onClose) => (
        <>
            <ModalBody>
                <p className="mb-2 dark:text-white px-2 text-center font-semibold text-gray-700">
                    Générer un fichier excel des congés annuels de l&apos;employé.
                </p>
                <div className="">
                    <Input 
                        variant='bordered'
                        label="Année souhaitée" 
                        placeholder="Entre 1900 et 2099" 
                        isRequired
                        className="w-full"
                        {...register('annee', { 
                            required: 'Ce champ est requis',
                            pattern: {
                                value: /^(19|20)\d{2}$/,
                                message: 'Veuillez entrer une année valide (ex: 2010)',
                            },
                        })}
                        isInvalid={!!errors.annee}
                        errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.annee ? errors.annee.message : ''}</span>}
                    />
                </div>
            </ModalBody>
            <ModalFooter className='mt-0'>
                <Button variant="light" onPress={onClose}>
                    Annuler
                </Button>
                <Button color="success" type='submit' onPress={handleSubmit(onSubmit)}>
                    Confirmer
                </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default ExcelModal