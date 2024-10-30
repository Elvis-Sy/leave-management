import React, { useEffect, useState } from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input} from '@nextui-org/react'
import axios from 'axios';
import { useForm } from 'react-hook-form';

const ModifType = ({onClose, id, reload, opt}) => {

    
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [design, setDesign] = useState('');
    const [nbr, setNbr] = useState('');

    useEffect(()=>{
        const temp = opt.find((item)=> item.id == id)
        setDesign(temp.designType)
        setNbr(temp.nbJours)
        setValue('designType', temp.designType)
        setValue('nbJours', temp.nbJours)
    }, [id])


    //Modifier
    const Modifier = async (data, id) => {
        try {
        
            const response = await axios.patch(`http://localhost:5000/api/conges/modif/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

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
            <ModalHeader className='flex justify-center text-md text-white font-semibold bg-bleuspat'>
                Modifier le type de congé
            </ModalHeader>
            <ModalBody>
                <form className="p-4 rounded-lg flex flex-col gap-4">

                    <Input
                    isRequired
                    label="Design"
                    defaultValue={design}
                    {...register('designType', { 
                        required: 'Le design est requis', 
                    })}
                    isInvalid={!!errors.designType}
                    errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.designType ? errors.designType.message : ''}</span>}
                    />

                    <Input
                    isRequired
                    label="Plafond"
                    defaultValue={nbr}
                    {...register('nbJours', { 
                        required: 'Le plafond est requis', 
                        pattern: {
                        value: /^[0-9]+$/,
                        message: 'Le champ doit contenir que des chiffres'
                        },
                        setValueAs: (value) => Number(value)
                    })}
                    isInvalid={!!errors.nbJours}
                    errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.nbJours ? errors.nbJours.message : ''}</span>}
                    placeholder="Nombre de jours"
                    />

                </form>
            </ModalBody>
            <ModalFooter className='mt-0'>
                <Button variant="light" color="danger" onPress={onClose}>
                    Annuler
                </Button>
                <Button color="primary" type='submit' onPress={handleSubmit((data)=>Modifier(data, id))}>
                    Confirmer
                </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default ModifType