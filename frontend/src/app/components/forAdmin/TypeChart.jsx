"use client"

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Spinner } from "@nextui-org/react";

const data = [
  {
    name: 'Jan',
    paye: 4000,
    maladie: 5264,
    maternite: 2400,
    paternite: 2400,
  },
  {
    name: 'Fevr',
    paye: 3000,
    maladie: 859,
    maternite: 1398,
    paternite: 2210,
  },
  {
    name: 'Mars',
    paye: 2000,
    maladie: 2241,
    maternite: 9800,
    paternite: 2290,
  },
  {
    name: 'Avril',
    paye: 2780,
    maladie: 3908,
    maternite: 4865,
    paternite: 2000,
  },
  {
    name: 'Mai',
    paye: 1890,
    maladie: 2369,
    maternite: 4800,
    paternite: 2181,
  },
  {
    name: 'Juin',
    paye: 2390,
    maladie: 3800,
    maternite: 7951,
    paternite: 2500,
  },
  {
    name: 'Juil',
    paye: 3490,
    maladie: 4300,
    maternite: 654,
    paternite: 2100,
  },
  {
    name: 'Aout',
    paye: 3490,
    maladie: 4300,
    maternite: 961,
    paternite: 2100,
  },
  {
    name: 'Sept',
    paye: 3490,
    maladie: 4300,
    maternite: 155,
    paternite: 2100,
  },
  {
    name: 'Oct',
    paye: 3490,
    maladie: 4300,
    maternite: 469,
    paternite: 2100,
  },
  {
    name: 'Nov',
    paye: 3490,
    maladie: 4300,
    maternite: 852,
    paternite: 2100,
  },
  {
    name: 'dec',
    paye: 3490,
    maladie: 899,
    maternite: 4300,
    paternite: 2100,
  },
];

const TypeChart = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un temps de chargement des données
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl w-full h-full p-4">
        <div>
            <h1 className="text-lg font-semibold">Tendance des prises de conges</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner label='Chargement' size='lg' color='primary' />
          </div>
      ) : (
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke='#eee'/>
              <XAxis dataKey="name" tick={{fill: "gray"}} tickLine={false} tickMargin={10}/>
              <YAxis tick={{fill: "gray"}} tickLine={false} tickMargin={10}/>
              <Tooltip contentStyle={{borderRadius: "10px"}}/>
              <Legend verticalAlign="top" align='right' wrapperStyle={{paddingTop: "5px", paddingBottom: "25px"}}/>
              <Line type="monotone" dataKey="maternite" stroke="gray" strokeWidth={3}/>
              <Line type="monotone" dataKey="paye" stroke="#1d71b8" strokeWidth={3}/>
              <Line type="monotone" dataKey="maladie" stroke="#e30613a0" strokeWidth={3}/>
              <Line type="monotone" dataKey="paternite" stroke="#ffac0ea0" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
    </div>
  );
}

export default TypeChart;