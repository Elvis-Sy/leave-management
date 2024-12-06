"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';
import Image from 'next/image';
import { Input } from '@nextui-org/react';

moment.locale('fr');

const InfoHead = () => {

    const [info, setInfo] = useState({});

    useEffect(()=>{
        const id = localStorage.getItem('id')
        if(id){
            getInfo(id)
        }
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
        <div className="flex flex-col lg:flex-row w-full p-4 gap-4">
            <div className="flex flex-col gap-8 bg-default-50/50 p-8 rounded-lg">
                <div className="flex flex-col lg:flex-row gap-4 item-center">
                    <Image src={info ? `http://localhost:5000/${info.photo}` : `http://localhost:5000/avatar.png`} alt="profil" width='100' height='100' className='w-20 h-20 rounded-full'/>
                    <div className="flex flex-col gap-4 text-center lg:text-left">
                        <h1 className='text-3xl'>Bonjour <span className='font-semibold'>{info.prenom ? info.prenom : info.nom}</span>,</h1>
                        <p className='text-gray-500 text-xl'>Bienvenu sur notre plateform de gestion de congé.</p>
                    </div>
                </div>
                <div className="grid grid-flow-row grid-rows-3 justify-between md:justify-normal lg:grid-rows-1 md:grid-rows-2 gap-8 px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <Input readOnly label='Nom' variant='underlined' value={info.prenom ? `${info.nom} ${info.prenom}` : info.nom}/>
                        <Input readOnly label='E-mail' variant='underlined' value={info.email}/>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <Input readOnly label="Date d'embauche" variant='underlined' value={info.dateEmbauche ? moment(info.dateEmbauche).format('DD MMMM YYYY') : 'Période essaie'}/>
                        <Input readOnly label='CIN' variant='underlined' value={info.CIN}/>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <Input readOnly label='Poste / Etablissement' variant='underlined' value={`${info.poste} / ${info.etablissement}`}/>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <Input readOnly label='Manager' variant='underlined' value={info.manager ? info.manager : '-/-'}/>
                    </div>
                </div>
            </div>
            <div className="flex flex-1 justify-center">
                <div className="flex flex-col items-center h-fit p-8 bg-default-50 rounded-xl shadow-md">
                    <p className='font-semibold'>Solde de conge paye</p>
                    <p className='text-gray-500 font-semibold'>
                        <span className='font-bold text-2xl text-bleuspat'>{info.solde ? info.solde : '-/-'} </span> jours
                    </p>
                </div>
            </div>
        </div>
    </>
  )
}

export default InfoHead