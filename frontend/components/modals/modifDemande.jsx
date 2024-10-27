import { useRef, useEffect } from 'react';
import React from 'react'
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Autocomplete, AutocompleteItem } from '@nextui-org/react'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

const ModifDemande = ({ onClose, reload, donnee }) => {

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const formRef = useRef();

    useEffect(() => {
        if (donnee) {
            setValue('dateDebut', format(new Date(donnee.dateDebut), 'yyyy-MM-dd'));
            setValue('dateFin', format(new Date(donnee.dateFin), 'yyyy-MM-dd'));
        }
    }, [donnee, setValue]);


    const modif = async (data) => {
        try {
            if(data.dateDebut > data.dateFin){
                const temp = data.dateDebut;
                data.dateDebut = data.dateFin;
                data.dateFin = temp;
            }

            data.dateDebut = new Date(data.dateDebut)
            data.dateFin = new Date(data.dateFin)
            
            await axios.patch(`http://localhost:5000/api/demandes/update/${donnee.idDemande}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            onClose();
            reload(localStorage.getItem('id'));
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
    };

    const handleButtonClick = () => {
        if (formRef.current) {
          formRef.current.dispatchEvent(new Event('submit', { bubbles: true }));
        }
    };

    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className='flex justify-center bg-bleuspat text-white mb-2'>Modification de la demande</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit(modif)} ref={formRef} className='w-full flex flex-col gap-8'>

                            <div className="flex flex-col justify-normal md:flex-row md:justify-between gap-8">
                                <div className="mb-4">
                                    <label className={`block dark:text-white ${errors.dateDebut ? 'text-[#f31260]' : 'text-black'} text-sm mb-1 font-semibold`}>
                                        Date de debut <span className="text-[#f31260] text-sm">*</span>
                                    </label>
                                    <div className={`group relative border-2 p-2 rounded-xl focus-within:border-[#bbcafc] focus-within:ring-1 focus-within:ring-[#bbcafc] ${errors.dateDebut ? 'border-[#f31260]' : 'border-gray-300/50'}`}>
                                        <input
                                            type="date"
                                            className="block dark:text-white w-full text-gray-700 placeholder-gray-300 focus:outline-none bg-transparent text-sm"
                                            {...register('dateDebut', { required: "Date de debut requise" })}
                                        />
                                    </div>
                                    <span className="flex justify-start text-[#f31260] text-xs">{errors.dateDebut ? errors.dateDebut.message : ''}</span>
                                </div>

                                <div>
                                    <label className={`block dark:text-white ${errors.dateFin ? 'text-[#f31260]' : 'text-black'} text-sm mb-1 font-semibold`}>
                                        Date de fin <span className="text-[#f31260] text-sm">*</span>
                                    </label>
                                    <div className={`group relative border-2 p-2 rounded-xl focus-within:border-[#bbcafc] focus-within:ring-1 focus-within:ring-[#bbcafc] ${errors.dateFin ? 'border-[#f31260]' : 'border-gray-300/50'}`}>
                                        <input
                                            type="date"
                                            className="block dark:text-white w-full text-gray-700 placeholder-gray-300 focus:outline-none bg-transparent text-sm"
                                            {...register('dateFin', { required: "Date de fin requise" })}
                                        />
                                    </div>
                                    <span className="flex justify-start text-[#f31260] text-xs">{errors.dateFin ? errors.dateFin.message : ''}</span>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter className='mt-0'>
                        <Button variant="light" onPress={onClose}>
                            Annuler
                        </Button>
                        <Button color="primary" type='submit' onPress={handleButtonClick}>
                            Modifier
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    )
}

export default ModifDemande;