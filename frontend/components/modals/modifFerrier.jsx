import React, { useEffect, useState, useCallback } from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, Input} from '@nextui-org/react'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import moment from 'moment';

const ModifFerrier = ({onClose, id, reload}) => {

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [label, setLabel] = useState();
    const [description, setDescription] = useState();
    const [date, setDate] = useState()

    useEffect(()=>{
        getInfo(id)
    }, [id, getInfo])

    const getInfo = useCallback(async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/ferrier/info/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            const info = response.data.ferrie;
            setLabel(info.label)
            setDescription(info.description)
            setDate(info.dateFeriee)
            setValue('label', info.label)
            setValue('description', info.description)
    
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
    }, [setValue]);

    //Modifier
    const ModifFerrier = async (data, id) => {
        try {
        
            const response = await axios.patch(`http://localhost:5000/api/ferrier/modif/${id}`, data, {
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
            <ModalHeader className='flex justify-center text-md text-white font-semibold bg-bleuspat'>
                Modifier le jour ferrié
            </ModalHeader>
            <ModalBody>
                <p className="mb-2 px-2 text-gray-700">
                    Date: <span className='font-semibold'>{moment(date).format('DD MMMM YYYY')}</span>
                </p>
                <div className="mb-4">
                    <Input
                        isRequired
                        label='Label'
                        variant='bordered'
                        className="w-full"
                        value={label}
                        onValueChange={setLabel}
                        {...register('label', { 
                            required: 'Ce champ est requis', 
                        })}
                        isInvalid={!!errors.label}
                        errorMessage={<span className="flex justify-start text-[#f31260] text-xs text-right">{errors.label ? errors.label.message : ''}</span>}
                    />
                    <Textarea 
                        variant='bordered'
                        label="Description" 
                        placeholder="Mettre une petite description..." 
                        className="w-full"
                        value={description}
                        onValueChange={setDescription}
                        {...register('description')}
                    />
                </div>
            </ModalBody>
            <ModalFooter className='mt-0'>
                <Button variant="light" color="danger" onPress={onClose}>
                    Annuler
                </Button>
                <Button color="primary" type='submit' onPress={handleSubmit((data)=>ModifFerrier(data, id))}>
                    Confirmer
                </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default ModifFerrier