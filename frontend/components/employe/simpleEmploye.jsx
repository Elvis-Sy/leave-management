"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import Link from "next/link";
import { Card, CardBody, Progress } from '@nextui-org/react';

const SimpleEmploye = () => {

    const [info, setInfo] = useState({});
    const [id, setId] = useState(null);
    const [leaveTypes, setLeave] = useState([]);

  useEffect(() => {
        
    const id = window.location.pathname.split('/').pop();
    if (id) {
        setId(id);
        Informations(id);
        infoConge(id)
    }
    }, [id]);

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

    //Information Conge
    const infoConge = async (id)=>{
      try {
          const response = await axios.get(`http://localhost:5000/api/employes/${id}/soldes`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          })

          setLeave(response.data.solde)

      } catch (error) {
          console.log('erreur informations: ', error.message)
          setLeave([])
      }
  }
    
  return (
    <div className="my-6 px-4 lg:px-6 max-w-[95rem] h-full mx-auto w-full flex flex-col gap-4">
      <ul className="flex gap-2">
        <li className="flex gap-2">
          <UsersIcon />
          <span>Employés</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <Link href={ localStorage.getItem('role') == 'Admin' ? "/employes" : "/subordonnes"}>
            {" "}
            <span>Liste</span>
          </Link>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>{info.prenom ? `${info.nom} ${info.prenom}` : info.nom}</span>
        </li>
      </ul>

      <div className='h-full flex items-center'>   
        <div className="flex-1 p-4 flex flex-col lg:flex-row gap-4 w-full">      
            {/* USER INFO CARD */}
            <div className="bg-default-50 max-w-sm shadow-md py-6 px-4 rounded-md flex-1 flex flex-col items-center gap-4">


                <img src={info.photo ? `http://localhost:5000/${info.photo}` : 'http://localhost:5000/avatar.png'} alt="" width={100} height={100} className='w-[80px] h-[80px] rounded-full object-cover'/>
                <h1 className='text-xl mb-4 font-semibold'>{info.prenom ? `${info.nom} ${info.prenom}` : info.nom}</h1>
                <div className="flex flex-col items-center md:items-start gap-4 md:flex-1">

                    {/* Poste et établissement */}
                    <div className="text-left">
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
            

            <div className="mt-4 flex flex-col justify-center space-y-4 flex-1">
                <h1 className='text-xl font-bold text-bleuspat font-mono'>Solde congé</h1>
            {leaveTypes.map((leave, index) => (
                <Card key={index} className="shadow-md">
                <CardBody className="p-4 flex flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                      <h2 className='text-sm font-semibold'>{leave.type}</h2>
                      <Progress aria-label='solde' value={(leave.accumulated / leave.total) * 100} className="mt-2 w-full" />
                      <p className='text-xs text-muted-foreground mt-1'>
                          {leave.accumulated} sur {leave.total} jours
                      </p>
                    </div>
                    <div className="text-right">
                      <p className='text-xs text-muted-foreground'>Solde actuel</p>
                      <span className='text-xl font-semibold'>{leave.accumulated}</span>
                    </div>
                </CardBody>
                </Card>
            ))}
            </div>
        </div>
       </div>
    </div>
  )
}

export default SimpleEmploye