"use client"

import React, { useEffect, useState } from 'react'
import BigCalendar from '../../../components/BigCalendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Recents from '../../../components/Recents'
import axios from 'axios'

const SingleManager = () => {

    const id = window.location.pathname.split('/').pop();
    const [info, setInfo]= useState({})
    const [supplement, setSupplement]= useState({})

    useEffect(()=>{
        const id = window.location.pathname.split('/').pop();
        Informations(id)
        supplementaire(id)
    }, [id])

    const Informations = async (id)=>{
        try {
            const response = await axios.get(`http://localhost:5000/api/employes/modif/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            setInfo(response.data.info)

        } catch (error) {
            console.log('erreur informations: ', error.message)
            setInfo({})
        }
    }

    const supplementaire = async (id)=>{
        try {
            const response = await axios.get(`http://localhost:5000/api/employes/supplementaire/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            setSupplement(response.data.info)

        } catch (error) {
            console.log('erreur informations: ', error.message)
            setSupplement({})
        }
    }
    

  return (
    <div className='flex-1 p-4 flex flex-col xl:flex-row gap-4'>
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
            {/* TOP */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* USER INFO CARD */}
                <div className="bg-white/80 backdrop-blur-lg flex-col h-fit shadow-lg py-6 px-4 rounded-md flex-1 flex justify-between lg:justify-normal items-center md:flex-row lg:flex-col gap-8">
                    <div className="flex gap-4">
                        <div className="">
                            <img src={info.photo ? `http://localhost:5000/${info.photo}` : 'http://localhost:5000/avatar.png'} alt="" width={100} height={100} className='w-20 h-20 rounded-full object-cover'/>
                        </div>
                        <div className=" flex flex-col justify-between gap-2">
                            <h1 className='text-lg font-semibold'>{info.prenom ? `${info.nom} ${info.prenom}` : info.nom}</h1>
                            <p className='text-sm text-gray-500'>
                                {info.poste} <br />
                                {info.etablissement}
                            </p>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex flex-col w-full px-4 items-center gap-2 flex-wrap text-xs font-medium">
                            <div className="w-full lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <img src="/blood.png" alt="" width={14} height={14}/>
                                <span>{info.email}</span>
                            </div>
                            <div className="w-full lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                <img src="/date.png" alt="" width={14} height={14}/>
                                <span>{info.CIN}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* SMALL CARD */}
                <div className="flex-1 flex flex-col gap-2 flex-wrap">
                    {/* CARD */}
                    <div className="w-full h-[93px] bg-white shadow-lg p-4 rounded-md flex gap-4 items-center">
                        <img src="/singleAttendance.png" alt="" width={24} height={24} className='w-10 h-10'/>
                        <h1 className='text-xl font-semibold'>{supplement.attente}</h1>
                        <span className='text-sm text-gray-500'> demandes en attente</span>
                    </div>
                    {/* CARD */}
                    <div className="w-full h-[93px] bg-white shadow-lg p-4 rounded-md flex gap-4 items-center">
                        <img src="/singleBranch.png" alt="" width={24} height={24} className='w-10 h-10'/>
                        <h1 className='text-xl font-semibold'>{supplement.total}</h1>
                        <span className='text-sm text-gray-500'>subordonnee</span>
                    </div>
                </div>
            </div>

            {/* BOTTOM */}
            <div className="mt-4 bg-white shadow-lg rounded-md p-4 h-[550px]">
                <h1 className='font-semibold text-xl'>Conges actifs des employes</h1>
                <BigCalendar id={id}/>
            </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <Recents id={id}/>
        </div>
    </div>
  )
}

export default SingleManager