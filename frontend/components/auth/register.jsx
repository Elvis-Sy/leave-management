"use client"

import React, { useState, useEffect } from 'react';
import { Input } from '@nextui-org/react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAttributesToken } from '@/helpers/attributesToken';

const Register = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verifier si ca correspont
    if (newPassword !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    // Verifier la longeur
    if (newPassword.length < 6) {
      setErrorMessage("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    const token = window.location.pathname.split('/').pop();
    const payload = getAttributesToken(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if(payload.exp < currentTime){
      window.history.back();
    } else {

      try {

        const user = await axios.post(`http://localhost:5000/api/employes/set-password/${token}`, {
          password: newPassword,
        });

        if(user.data.statut){
          toast(`${user.data.statut}`, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {fontSize: "x-medium", fontWeight: '500', backgroundColor: '#fa5252', color: 'white'}
          });
        } else {
          toast(`${user.data}`, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {fontSize: "x-medium", fontWeight: '500', backgroundColor: '#40c057', color: 'white'}
          });
        }

      } catch (error) {
        console.error(error);
      setErrorMessage("Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.");
      }

    }
    
  };

  return (
    <div className='flex items-center justify-center text-center w-full h-screen flex-1 px-20'>
      <ToastContainer />
      <div className="w-full"> 
        {/* LEFT SIDE */}
        <div className="p-5">
          <div className="py-6">
            <h2 className='text-xl font-bold text-bleuspat mb-2'>Password Confirmation</h2>
            <div className='border-2 w-10 border-bleuspat inline-block mb-2'></div>
            <form onSubmit={handleSubmit} className='flex flex-col w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
              <Input
                isRequired
                type="password"
                label="Nouveau mot de passe"
                variant="bordered"
                isInvalid={!!errorMessage}
                className="w-full font-semibold login group"
                onChange={(e) =>{ setNewPassword(e.target.value); setErrorMessage(null) }}
              />
                
              <Input
                isRequired
                type="password"
                label="Confirmation mot de passe"
                variant="bordered"
                isInvalid={!!errorMessage}
                className="w-full font-semibold login group"
                onChange={(e) =>{ setConfirmPassword(e.target.value); setErrorMessage(null) }}
              />

            </form>
            {errorMessage && <p className="text-red-500 mt-2 text-xs">{errorMessage}</p>} {/* Display error message */}

            <div className="flex mt-4 justify-end w-full">
              <button type="submit" className='transition-all duration-200 mt-2 border-2 border-bleuspat bg-bleuspat text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-default-50 hover:text-bleuspat' onClick={handleSubmit}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;