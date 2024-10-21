"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import moment from 'moment';

const InfoHead = () => {

    const [info, setInfo] = useState({});

    useEffect(()=>{
        const id = localStorage.getItem('id')
        getInfo(id)
    }, [])

    //Prendre les infos
    const getInfo = async (id) => {
        try {
          const response = await axios.get(`http://localhost:5000/api/employes/employe/${id}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
          
          setInfo(response.data.info)
    
        } catch (error) {
            setInfo({})
          console.log(error.message)
        }
      };


  return (
    <>
        <div className="flex flex-col lg:flex-row items-center justify-between w-full p-8 gap-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <img src={`http://localhost:5000/avatar.png`} alt="profil" className='w-20 h-20'/>
                <div className="flex flex-col gap-4 text-center lg:text-left">
                    <h1 className='text-3xl font-semibold'>Bonjour {info.prenom ? info.prenom : info.nom},</h1>
                    <p className='text-gray-500'>Bienvenu sur notre plateform de gestion de congé.</p>
                </div>
            </div>
            <div className="flex flex-col items-center p-8 bg-default-50 rounded-xl shadow-md">
                <p className='font-semibold'>Solde conge paye</p>
                <p className='text-gray-500 font-semibold'>
                    <span className='font-bold text-2xl text-bleuspat'>{info.solde ? info.solde : '-/-'} </span> jours
                </p>
            </div>
        </div>
        <div className="grid grid-flow-col grid-rows-3 justify-between md:justify-normal lg:grid-rows-1 md:grid-rows-2 gap-8 px-8">
            <div className="flex flex-col gap-2">
                <p className='font-semibold'>{info.prenom ? `${info.nom} ${info.prenom}` : info.nom}</p>
                <p className='font-medium'>{info.email}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className='font-semibold'>Date d'embauche</p>
                <p className='text-gray-500 font-medium'>{info.dateEmbauche ? moment(info.dateEmbauche).format('DD MMMM YYYY') : 'Période essaie'}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className='font-semibold'>CIN</p>
                <p className='text-gray-500 font-medium'>{info.CIN}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className='font-semibold'>Manager</p>
                <p className='text-gray-500 font-medium'>{info.manager ? info.manager : '-/-'}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className='font-semibold'>Poste</p>
                <p className='text-gray-500 font-medium'>{info.poste} / {info.etablissement}</p>
            </div>
        </div>
    </>
  )
}

export default InfoHead