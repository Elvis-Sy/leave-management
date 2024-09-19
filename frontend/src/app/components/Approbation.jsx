"use client"

import {PieChart, Pie, Sector, Cell, ResponsiveContainer} from 'recharts'

const data =[
    {
        name: "Refus", value: 32, fill: "#e66165"
    },
    {
        name: "Accord", value: 8, fill: "#4ade80"
    },
]

const Approbation = () => {
  return (
    <>
        <ResponsiveContainer width="100%" height="90%" className="relative">
            <PieChart className='mt-4'>
                <Pie
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={data}
                    cx="50%"
                    cy="60%"
                    innerRadius={50}
                    outerRadius={80}
                    fill="#8884d8"
                />
            </PieChart>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
                <h1 className='text-3xl font-bold'>27%</h1>
                <p className='text-xs text-gray-500'>d'approbation</p>
            </div>
        </ResponsiveContainer> 
    </>
  )
}

export default Approbation