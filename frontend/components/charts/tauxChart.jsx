"use client"

import { useEffect, useState } from "react"
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts"
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";


const Taux = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [taux, setTaux] = useState({})

    useEffect(() => {
        
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        infoApprobation();

    }, []);

    const data = [
        {
            name: 'Total',
            count: taux.refus + taux.accord,
            fill: 'hsl(var(--nextui-default-50) / var(--nextui-default-50-opacity, var(--tw-bg-opacity)))'
        },
        {
            name: 'refus',
            count: taux.refus,
            fill: '#fa5252'
        },
        {
            name: 'accord',
            count: taux.accord,
            fill: '#40c057'
        }
        
    ]

    //Prendre les donnee necessaire
    const infoApprobation = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/demandes/approbation', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            setTaux(response.data.demande)
            
    
        } catch (error) {
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
      };

  return (
    <div className="bg-default-50 shadow-md rounded-xl w-full h-full p-4">
        {/* Titre */}
        <div className="text-center">
            <h1 className="text-lg font-semibold">Taux d&apos;approbation</h1>
        </div>
        {/* Chart */}
        <div className="relative w-full h-[70%]">
             

        {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <Spinner label='Chargement' size='lg' color='primary' />
            </div>
        ) : (
            <>
                <ResponsiveContainer>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={32} data={data}>
                        <RadialBar background dataKey="count"/>
                    </RadialBarChart>
                </ResponsiveContainer>

                {/* Image au milieu */}
                <Image src="/noyes.png" alt="noyes" width={50} height={50} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
            </>
        )}

        </div>
        {/* Legend */}
        <div className="flex justify-center gap-16">
            <div className="flex flex-col gap-1">
                <div className="w-5 h-5 bg-[#fa5252] rounded-full"/>
                <h1 className="font-bold">({taux.tauxRefus}%) <span className="text-sm text-gray-400">Refus</span></h1>
            </div>
            <div className="flex flex-col gap-1">
                <div className="w-5 h-5 bg-[#40c057] rounded-full"/>
                <h1 className="font-bold">({taux.tauxAccord}%) <span className="text-sm text-gray-400">Accord</span></h1>
            </div>
        </div>
    </div>
  )
}

export default Taux