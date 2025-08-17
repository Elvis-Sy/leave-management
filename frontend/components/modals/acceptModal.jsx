import React, { useCallback, useState } from 'react';
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'react-toastify';

// Création d'une instance Axios avec des configurations par défaut
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/demandes',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

const AcceptModal = ({ onClose, id, reload }) => {
    const [loading, setLoading] = useState(false); // État pour gérer le chargement

    // Filtrage des données
    const accept = useCallback(async () => {
        setLoading(true); // Commencer le chargement
        if (typeof window === 'undefined') return;
        try {
            const query = `accept?idDM=${encodeURIComponent(id)}&idUser=${encodeURIComponent(localStorage.getItem('id'))}`;
            const response = await axiosInstance.patch(query, {});

            console.log(response.data.message);
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
            onClose();
            reload();
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        } finally {
            setLoading(false); // Fin du chargement
        }
    }, [id, onClose, reload]);

    return (
        <ModalContent>
            <ModalHeader className='flex justify-center'></ModalHeader>
            <ModalBody className='flex flex-row justify-center gap-1 items-center'>
                <Image src="/approuve.png" alt="approuve" width={30} height={30} />
                <p className="mb-2 dark:text-white px-2 text-center font-semibold text-gray-700">
                    Approuver la demande de congé ?
                </p>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                    Annuler
                </Button>
                <Button color="success" type='submit' onPress={accept} disabled={loading}>
                    {loading ? 'Chargement...' : 'Confirmer'}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
};

export default AcceptModal;