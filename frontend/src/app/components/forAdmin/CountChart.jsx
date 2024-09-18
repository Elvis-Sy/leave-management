"use client"

import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from "recharts"

const data = [
    {
        name: 'Total',
        count: 75,
        fill: 'white'
    },
    {
        name: 'Boys',
        count: 47,
        fill: '#e66165'
    },
    {
        name: 'Girls',
        count: 28,
        fill: '#4ada80'
    }
    
]

const CountChart = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl w-full h-full p-4">
        {/* Titre */}
        <div className="text-center">
            <h1 className="text-lg font-semibold">Taux d'approbation</h1>
        </div>
        {/* Chart */}
        <div className="relative w-full h-[70%]">
            <ResponsiveContainer>
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={32} data={data}>
                    <RadialBar background dataKey="count"/>
                </RadialBarChart>
            </ResponsiveContainer> 

            {/* Image au milieu */}
            <img src="/noyes.png" alt="" width={50} height={50} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
        </div>
        {/* Legend */}
        <div className="flex justify-center gap-16">
            <div className="flex flex-col gap-1">
                <div className="w-5 h-5 bg-[#e66165] rounded-full"/>
                <h1 className="font-bold">1,256</h1>
                <h2 className="text-xs text-gray-400">Refus (55%)</h2>
            </div>
            <div className="flex flex-col gap-1">
                <div className="w-5 h-5 bg-green-400 rounded-full"/>
                <h1 className="font-bold">756</h1>
                <h2 className="text-xs text-gray-400">accord (45%)</h2>
            </div>
        </div>
    </div>
  )
}

export default CountChart