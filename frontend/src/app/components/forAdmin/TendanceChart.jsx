"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Spinner } from "@nextui-org/react";

const data = [
    {
        name: 'Depart_Info',
        Total: 61,
    },
    {
        name: 'RH',
        Total: 15,
    },
    {
        name: 'Depart_Econo',
        Total: 50,
    },
    {
        name: 'Direction',
        Total: 37,
    },
    
]

const TendanceChart = () => {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simuler un temps de chargement des données
        setTimeout(() => {
        setIsLoading(false);
        }, 1000);
    }, []);


  return (
    <div className="bg-white shadow-lg rounded-lg h-full p-4 flex flex-col justify-between">
        {/* Titre */}
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold">Etablissements avec le plus de demandes</h1>
            <span className="text-gray-500 text-sm">(2024-2025)</span>
        </div>
    
        
        {/* Chart */}
        {isLoading ? (
            <div className="flex justify-center items-center h-full text-bleuspat">
                <Spinner label='Chargement' size='lg' color='primary' />
            </div>
        ) : (
            <ResponsiveContainer width={"100%"} height={"80%"} className="flex-1">
                <BarChart width={500} height={300} data={data} barSize={30} className="tendance">
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <YAxis axisLine={false} tick={{fill: "gray"}} tickLine={false}/>
                    <XAxis dataKey="name" axisLine={false} tick={{fill: "gray"}} tickLine={false}/>
                    <Tooltip contentStyle={{borderRadius: "10px"}}/>
                    <Bar dataKey="Total" fill="#1d71b8" legendType="circle" radius={[5,5,0,0]}/>
                </BarChart>
            </ResponsiveContainer>
        )}


    </div>
  )
}

export default TendanceChart