import React, { useState, useEffect } from 'react'
import { Button } from '@nextui-org/react'
import axios from 'axios'
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const InfoFoot = () => {

    const [info, setInfo] = useState(null);
    const [showImage, setShowImage] = useState(false);

    useEffect(()=>{
        const timer = setTimeout(() => {
            setShowImage(true);
        }, 500);

        const id = localStorage.getItem('id')
        getInfo(id)

        return () => clearTimeout(timer);
    }, [])

    //Prendre les infos
    const getInfo = async (id) => {
        try {
          const response = await axios.get(`http://localhost:5000/api/demandes/lastDemande/${id}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
          
          setInfo(response.data.demande)
    
        } catch (error) {
            setInfo({})
          console.log(error.message)
        }
      };

  return (
    <div className="h-[315px] bg-default-50 rounded-lg m-8 p-8">
        {info ? (
            <>
                <div className="flex justify-between gap-10">
                    <h1 className='text-xl font-semibold'>Dernière demande</h1>
                    <div className="flex gap-8 items-center">
                        <p className={`hidden md:flex text-medium h-fit text-gray-900 justify-center items-center ${info.statuts.designStatut == 'En attente' ? 'bg-gray-300' : info.statuts.designStatut == 'Approuvee' ? 'bg-[#40c057] text-white': 'bg-[#fa5252] text-white'} px-3 py-1 rounded-full`}>{info.statuts.designStatut}</p>
                        {info.statuts.designStatut == 'En attente' && <div className="flex items-center gap-4">
                            <Button color='default' variant='flat' className='px-4 rounded-xl' size='lg'>Annuler</Button>
                            <Button color='primary' className='px-4 rounded-xl' size='lg'>Modifier</Button>
                        </div>}
                    </div>
                </div>
                <div className="flex-1 mt-14">
                    <div className="grid grid-flow-col grid-rows-2 md:grid-rows-1 justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <img src={
                                info.type.designType === "Paye" ? '/paye.png' :
                                info.type.designType === "Maternite" ? '/maternite.png' :
                                info.type.designType === "Paternite" ? '/paternite.png' :
                                "/maladie.png"
                            } alt="" width={40} height={40} className="w-14 h-14 rounded-full object-cover"/>
                            <div className="flex flex-col text-lg">
                                <h3 className="font-semibold">Congé</h3>
                                <span className="text-gray-500 font-medium">{info.type.designType}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-lg">
                            <p className='font-semibold'>Date d'envoi</p>
                            <p className='text-gray-500 font-medium'>{moment(info.dateEnvoie).format('DD MMMM YYYY')}</p>
                        </div>
                        <div className="flex flex-col gap-2 text-lg">
                            <p className='font-semibold'>Date de début</p>
                            <p className='text-gray-500 font-medium'>{moment(info.dateDebut).format('DD MMMM YYYY')}</p>
                        </div>
                        <div className="flex flex-col gap-2 text-lg">
                            <p className='font-semibold'>Date de fin</p>
                            <p className='text-gray-500 font-medium'>{moment(info.dateFin).format('DD MMMM YYYY')}</p>
                        </div>
                        <div className="flex flex-col gap-2 text-lg">
                            <p className='font-semibold'>Durée</p>
                            <p className='text-gray-500 font-medium'>{info.nombreJours} <span className='text-sm'>jours</span></p>
                        </div>
                    </div>
                </div>
                {info.statuts.designStatut == 'Refusee' &&<div className="flex justify-start mt-10">
                    <div className="flex bg-default-100 p-4 rounded-md items-center gap-2">
                        <p className='font-semibold text-[#fa5252]'>Motif de refus:</p>
                        <p className='font-medium'>{info.motifRefus ? info.motifRefus : '-/-'}</p>
                    </div>
                </div>}
            </>
        ) : (
            <>
                <h1 className='text-xl font-semibold'>Dernière demande</h1>
                <div className="h-full w-full flex text-gray-500 justify-center items-center text-2xl font-semibold">
                    <img src='/vide.png' width={200} height={200} className={`transition-all duration-500 ${showImage ? 'opacity-100' : 'opacity-0'}`}/>
                </div>
            </>
        )}
    </div>
  )
}

export default InfoFoot