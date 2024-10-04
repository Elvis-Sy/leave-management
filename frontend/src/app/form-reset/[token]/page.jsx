"use client"

import React, { useState } from 'react';
import { Input } from '@nextui-org/react';
import axios from 'axios';

const FormReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const token = window.location.pathname.split('/').pop(); // Assuming the token is the last part of the URL
      await axios.post(`http://localhost:3000/api/employes/set-password/${token}`, {
        password: newPassword,
      });

      // Optionally redirect the user or show a success message
      alert('Mot de passe réinitialisé avec succès.');
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.");
    }
  };

  return (
    <div className='flex items-center justify-center text-center w-full h-screen flex-1 px-20'>
      <div className="bg-white rounded-2xl shadow-2xl"> 
        {/* LEFT SIDE */}
        <div className="w-[300px] p-5">
          <div className="py-6">
            <h2 className='text-xl font-bold text-bleuspat mb-2'>Reset Password</h2>
            <div className='border-2 w-10 border-bleuspat inline-block mb-2'></div>
            <form onSubmit={handleSubmit} className='flex flex-col w-full flex-wrap md:flex-nowrap md:mb-0 gap-4'>
              <Input
                isRequired
                type="password"
                label="Nouveau mot de passe"
                variant="bordered"
                isInvalid={!!errorMessage}
                errorMessage={errorMessage}
                className="max-w-lg font-semibold login group"
                onChange={(e) => setNewPassword(e.target.value)}
              />
                
              <Input
                isRequired
                type="password"
                label="Confirmation mot de passe"
                variant="bordered"
                isInvalid={!!errorMessage}
                errorMessage={errorMessage}
                className="max-w-lg font-semibold login group"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </form>
            <button type="submit" className='transition-all duration-200 mt-2 border-2 border-bleuspat bg-bleuspat text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-bleuspat' onClick={handleSubmit}>
              Confirmer
            </button>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>} {/* Display error message */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormReset;