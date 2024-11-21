"use client";

import React, { useState } from 'react';
import { Input } from '@nextui-org/react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAttributesToken } from '@/helpers/attributesToken';
import Image from 'next/image';

const Register = () => {
  // États pour le nouveau mot de passe, la confirmation et les messages d'erreur
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Réinitialiser le message d'erreur

    // Validation des mots de passe
    if (newPassword !== confirmPassword) {
      return setErrorMessage("Les mots de passe ne correspondent pas.");
    }
    if (newPassword.length < 6) {
      return setErrorMessage("Le mot de passe doit comporter au moins 6 caractères.");
    }

    // Extraction du token et de la charge utile
    const token = window.location.pathname.split('/').pop();
    const payload = getAttributesToken(token);
    const currentTime = Math.floor(Date.now() / 1000);

    // Vérification de l'expiration du token
    if (payload.exp < currentTime) {
      return window.history.back(); // Retour si le token est expiré
    }

    // Tentative de définir le nouveau mot de passe
    try {
      const response = await axios.post(`http://localhost:5000/api/employes/set-password/${token}`, {
        password: newPassword,
      });

      const message = response.data.statut || response.data;
      const isError = !response.data.statut;

      // Affichage de la notification
      toast(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontSize: "x-medium",
          fontWeight: '500',
          backgroundColor: isError ? '#40c057' : '#fa5252',
          color: 'white',
        },
      });
      
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.");
    }
  };

  return (
    <div className='w-fit flex justify-center'>
      <ToastContainer />
      <div className="w-fit mr-2"> 
        {/* Section du formulaire */}
        <div className="p-5">
          <div className="py-6">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt='logo' width={70} height={70}/>
              <h2 className='text-xl font-bold text-bleuspat mb-2'>Confirmation du mot de passe</h2>
            </div>
            <div className='border-2 w-10 border-bleuspat inline-block mb-2'></div>
            <form onSubmit={handleSubmit} className='flex flex-col w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
              <Input
                isRequired
                type="password"
                label="Nouveau mot de passe"
                variant="bordered"
                isInvalid={!!errorMessage}
                className="w-full font-semibold login group"
                classNames={{inputWrapper: 'backdrop-blur-[2px]'}}
                onChange={(e) => { 
                  setNewPassword(e.target.value); 
                  setErrorMessage(''); // Réinitialiser l'erreur lors de la saisie
                }}
              />
              <Input
                isRequired
                type="password"
                label="Confirmation mot de passe"
                variant="bordered"
                isInvalid={!!errorMessage}
                className="w-full font-semibold login group"
                classNames={{inputWrapper: 'backdrop-blur-[2px]'}}
                onChange={(e) => { 
                  setConfirmPassword(e.target.value); 
                  setErrorMessage(''); // Réinitialiser l'erreur lors de la saisie
                }}
              />
            </form>
            {errorMessage && <p className="text-red-500 mt-2 text-xs">{errorMessage}</p>} {/* Afficher le message d'erreur */}
            <div className="flex mt-4 justify-start w-full">
              <button 
                type="submit" 
                className='transition-all duration-200 mt-2 border-2 border-bleuspat bg-bleuspat text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-default-50 hover:text-bleuspat' 
                onClick={handleSubmit}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex h-full flex-1 relative -left-16">
          <Image
            src="/cover2.png"
            alt="Société du Port à gestion Autonome de Toamasina"
            width={350}
            height={350}
            className="self-center rounded-lg -z-10 opacity-80"
          />
      </div>
    </div>
  );
}

export default Register;