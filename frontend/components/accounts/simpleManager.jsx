"use client"

import React, { useEffect, useState } from 'react'
import BigCalendar from '@/components/charts/BigCalendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Recents from '@/components/charts/Recents'
import axios from 'axios'
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import Link from "next/link";
import { useRouter } from 'next/navigation'

const SimpleManager = () => {

    const router = useRouter();
    const [info, setInfo] = useState({});
    const [supplement, setSupplement] = useState({});
    const [id, setId] = useState(null);

    useEffect(() => {
        
            const id = window.location.pathname.split('/').pop();
            if (id) {
                setId(id);
                Informations(id);
                supplementaire(id);
            }
    }, [router]);

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
    <div className="my-6 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex gap-2">
        <li className="flex gap-2">
          <UsersIcon />
          <span>Managers</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <Link href={"/managers"}>
            {" "}
            <span>Liste</span>
          </Link>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>{info.prenom ? `${info.nom} ${info.prenom}` : info.nom}</span>
        </li>
      </ul>

      <div className='flex-1 p-4 flex flex-col xl:flex-row gap-6'>
        {/* LEFT */}
        <div className="w-full xl:w-2/3">
            {/* TOP */}
            <div className="flex items-center flex-col lg:flex-row gap-4">
                {/* USER INFO CARD */}
                <div className="bg-default-50 shadow-md py-6 px-4 rounded-md flex-1 flex flex-col md:flex-row items-center md:items-start lg:items-center justify-between gap-8 h-full">


                    <img src={info.photo ? `http://localhost:5000/${info.photo}` : 'http://localhost:5000/avatar.png'} alt="" width={100} height={100} className='w-[70px] h-[70px] rounded-full object-cover'/>
                    <div className="flex flex-col items-center md:items-start gap-4 md:flex-1">
        
                    {/* Poste et établissement */}
                    <div className="text-center md:text-left">
                        <p className='text-sm text-gray-500'>
                            {info.poste ? info.poste : 'Poste'} <br />
                            {info.etablissement ? info.etablissement : 'Etablissement'}
                        </p>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="flex flex-col w-full gap-2 text-xs font-medium">
                        
                        {/* Email */}
                        <div className="flex items-center gap-2">
                            <span>Email:</span>
                            <span>{info.email}</span>
                        </div>

                        {/* CIN */}
                        <div className="flex items-center gap-2">
                            <span>CIN:</span>
                            <span>{info.CIN}</span>
                        </div>

                    </div>
                </div>

                </div>
                {/* SMALL CARD */}
                <div className="flex-1 flex flex-col gap-2 flex-wrap">
                    {/* CARD */}
                    <div className="w-full h-[93px] bg-default-50 shadow-md p-4 rounded-md flex gap-4 items-center">
                        <h1 className='text-xl font-semibold'>{supplement.attente ? supplement.attente : 0}</h1>
                        <span className='text-sm text-gray-500'> demandes en attente</span>
                    </div>
                    {/* CARD */}
                    <div className="w-full h-[93px] bg-default-50 shadow-md p-4 rounded-md flex gap-4 items-center">
                        <h1 className='text-xl font-semibold'>{supplement.total ? supplement.total : 0}</h1>
                        <span className='text-sm text-gray-500'>subordonnee</span>
                    </div>
                </div>
            </div>

            {/* BOTTOM */}
            <div className="mt-4 bg-default-50 shadow-lg rounded-md p-4 h-[550px]">
                <h1 className='font-semibold text-xl'>Conges actifs des employes</h1>
                <BigCalendar id={id}/>
            </div>
        </div>
        {/* RIGHT */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <Recents id={id}/>
        </div>
      </div>
    </div>
  )
}

export default SimpleManager