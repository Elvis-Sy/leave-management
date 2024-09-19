"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Spinner } from "@nextui-org/react";

const data = [
    {
        name: 'Jan',
        Direction: 60,
        Dep_Info: 40,
        Dep_RH: 41,
        Dep_Commercial: 5
    },
    {
        name: 'Fevr',
        Direction: 15,
        Dep_Info: 33,
        Dep_RH: 33,
        Dep_Commercial: 15
    },
    {
        name: 'Mai',
        Direction: 50,
        Dep_Info: 92,
        Dep_RH: 7,
        Dep_Commercial: 70
    },
    {
        name: 'Avr',
        Direction: 75,
        Dep_Info: 16,
        Dep_RH: 7,
        Dep_Commercial: 55
    },
    {
        name: 'Juin',
        Direction: 2,
        Dep_Info: 75,
        Dep_RH: 8,
        Dep_Commercial: 16
    },
    {
        name: 'Mars',
        Direction: 91,
        Dep_Info: 17,
        Dep_RH: 20,
        Dep_Commercial: 78
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
        <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Tendances des établissements</h1>
            <img src="/moreDark.png" alt="" width={20} height={20}/>
        </div>
        
        
        {/* Chart */}
        {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <Spinner label='Chargement' size='lg' color='primary' />
            </div>
        ) : (
            <ResponsiveContainer width={"100%"} height={"80%"} className="flex-1">
                <BarChart width={500} height={300} data={data} barSize={10} className="tendance">
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <YAxis axisLine={false} tick={{fill: "gray"}} tickLine={false}/>
                    <XAxis dataKey="name" axisLine={false} tick={{fill: "gray"}} tickLine={false}/>
                    <Tooltip contentStyle={{borderRadius: "10px"}}/>
                    <Legend align="left" verticalAlign="top" wrapperStyle={{paddingTop: "5px", paddingBottom: "25px"}} className="text-xs"/>
                    <Bar dataKey="Direction" fill="#b269ffa0" legendType="circle" radius={[5,5,0,0]}/>
                    <Bar dataKey="Dep_Info" fill="#829af8a0" legendType="circle" radius={[5,5,0,0]}/>
                    <Bar dataKey="Dep_Commercial" fill="#fe930ea0" legendType="circle" radius={[5,5,0,0]}/>
                    <Bar dataKey="Dep_RH" fill="#e661afa0" legendType="circle" radius={[5,5,0,0]}/>
                </BarChart>
            </ResponsiveContainer>
        )}


    </div>
  )
}

export default TendanceChart