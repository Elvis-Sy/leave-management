import React, { useCallback, useMemo } from 'react';
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, Input } from '@nextui-org/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'moment/locale/fr';

moment.locale('fr');

const FerrierModal = ({ onClose, date, reload }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Mémoriser le format de la date
    const ferrie = useMemo(() => moment(date).format('DD MMMM YYYY'), [date]);

    // Mémoriser la fonction addFerrier
    const addFerrier = useCallback(async (data) => {
        try {
            data.dateFeriee = new Date(date);

            const response = await axios.post('http://localhost:5000/api/ferrier/ajout', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            onClose();
            reload();

            toast.success(response.data.message, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: { fontSize: "bolder", fontWeight: "bolder" }
            });

        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
    }, [date, onClose, reload]);

    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex justify-center text-md text-white font-semibold bg-bleuspat">
                        Considérer cette date comme un jour férié
                    </ModalHeader>
                    <ModalBody>
                        <p className="mb-2 px-2 text-gray-700">
                            Date : <span className="font-semibold">{ferrie}</span>
                        </p>
                        <div className="mb-4">
                            <Input
                                isRequired
                                label="Label"
                                variant="bordered"
                                className="w-full mb-2"
                                {...register('label', { required: 'Ce champ est requis' })}
                                isInvalid={!!errors.label}
                                errorMessage={errors.label?.message}
                            />
                            <Textarea
                                variant="bordered"
                                label="Description"
                                placeholder="Mettre une petite description..."
                                className="w-full"
                                {...register('description')}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter className="mt-0">
                        <Button variant="light" color="danger" onPress={onClose}>
                            Annuler
                        </Button>
                        <Button color="primary" type="submit" onPress={handleSubmit(addFerrier)}>
                            Confirmer
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    );
};

export default FerrierModal;