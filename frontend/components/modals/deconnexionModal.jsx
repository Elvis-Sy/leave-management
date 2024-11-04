'use client'
import React, { useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter, useDisclosure, ModalBody, Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { getAttributesToken } from '@/helpers/attributesToken';
import axios from 'axios';

const DeconnexionModal = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter();

    // Fonction pour retirer plusieurs éléments du localStorage
    const removeLocalStorageItems = (items) => {
        items.forEach(item => localStorage.removeItem(item));
    };

    // Fonction de déconnexion mémorisée
    const handleLogout = useCallback(async () => {
        try {
            const attribut = getAttributesToken(localStorage.getItem('token'));
            const mail = { email: attribut.email };

            const response = await axios.post('http://localhost:5000/api/employes/deconnex', mail, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.cause) {
                alert('Aucun compte associé !');
            } else {
                router.push('/login'); // Redirection vers la page de login
                removeLocalStorageItems(['token', 'role', 'id']); // Supprimer les éléments
                console.log('Déconnexion réussie'); // Mieux pour le débogage
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion :', error.message); // Afficher l'erreur dans la console
            alert('Une erreur est survenue lors de la déconnexion.'); // Message d'erreur convivial
        }
    }, [router]);

    return (
        <>
            <button className="hover:text-redspat dark:hover:text-[#fa5252] dark:text-[#fa5252]/50 text-redspat/50" onClick={onOpen}>
                Se déconnecter
            </button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className='flex gap-2 justify-center'>
                                <img src="/deconnex.png" alt="" width={30} height={30} />
                                <span className='text-xl text-[#fa5252] font-semibold'>Déconnexion</span>
                            </ModalHeader>
                            <ModalBody>
                                <p className="mb-2 px-2 text-center font-semibold dark:text-white text-gray-700">
                                    Êtes-vous sûr de vouloir vous déconnecter ?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Non, annuler
                                </Button>
                                <Button className='bg-[#fa5252] text-white' type='submit' onPress={handleLogout}>
                                    Oui, continuer
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default DeconnexionModal;