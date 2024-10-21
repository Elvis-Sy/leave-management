'use client'
import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalFooter, useDisclosure, ModalBody, Button} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { getAttributesToken } from '@/helpers/attributesToken'
import axios from 'axios'

const DeconnexionModal = () => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const router = useRouter();

    const handleLogout = async () => {
        try {
            const attribut = getAttributesToken(localStorage.getItem('token'));
            let mail = {};
            mail.email = attribut.email;

            const response = await axios.post('http://localhost:5000/api/employes/deconnex', mail, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if(response.data.cause){
                alert('Aucun compte associé !')
            } else {
                localStorage.removeItem('token');

                localStorage.removeItem('role'); 

                localStorage.removeItem('id')

                // Rediriger a la page de login
                router.push('/login'); 

                console.log('Deconnexion')
            } 

        } catch (error) {
            console.log(error.message)
        }
        
        
    };


  return (
    <>
        <button className="hover:text-redspat dark:hover:text-[#fa5252] dark:text-[#fa5252]/50 text-redspat/50" onClick={onOpen}>
            Se deconnecter
        </button>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                <>
                    <ModalHeader className='flex gap-2 justify-center'><img src="/deconnex.png" alt="" width={30} height={30}/> <span className='text-xl text-[#fa5252] font-semibold'>Deconnexion</span></ModalHeader>
                    <ModalBody>
                        <p className="mb-2 px-2 text-center font-semibold dark:text-white text-gray-700">Etes-vous sûr de vouloir vous déconnecter ?</p>
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
  )
}

export default DeconnexionModal