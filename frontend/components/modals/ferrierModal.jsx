import React from 'react'
import {ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, Input} from '@nextui-org/react'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'moment/locale/fr';

moment.locale('fr');

const FerrierModal = ({onClose, date, reload}) => {

    const ferrie = moment(date).format('DD MMMM YYYY');

    const { register, handleSubmit, formState: { errors } } = useForm();

    const addFerrier = async (data, ferrie) => {
        try {
            // const newDate = new Date(date); // Crée une nouvelle instance pour éviter de modifier l'original
            // newDate.setDate(newDate.getDate() + 1); // Ajoute un jour
            data.dateFeriee = new Date(ferrie);
            // data.dateFeriee = newDate;
        
            const response = await axios.post('http://localhost:5000/api/ferrier/ajout', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log(response.data.message)
            onClose()
            reload()

            toast.success(`${response.data.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: {fontSize: "bolder", fontWeight: "bolder"}
              });

    
        
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
    };

  return (
    <ModalContent>
        {(onClose) => (
        <>
            <ModalHeader className='flex justify-center text-md text-white font-semibold bg-bleuspat'>
                Considerer cette date comme un jour ferrié
            </ModalHeader>
            <ModalBody>
                <p className="mb-2 px-2 text-gray-700">
                    Date: <span className='font-semibold'>{ferrie}</span>
                </p>
                <div className="mb-4">
                    <Input
                        isRequired
                        label='Label'
                        variant='bordered'
                        className="w-full"
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
                        {...register('description')}
                    />
                </div>
            </ModalBody>
            <ModalFooter className='mt-0'>
                <Button variant="light" color="danger" onPress={onClose}>
                    Annuler
                </Button>
                <Button color="primary" type='submit' onPress={handleSubmit((data)=>addFerrier(data, date))}>
                    Confirmer
                </Button>
            </ModalFooter>
        </>
        )}
    </ModalContent>
  )
}

export default FerrierModal