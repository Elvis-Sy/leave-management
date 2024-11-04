"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Spinner } from "@nextui-org/react";
import axios from 'axios';

const TypeChart = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [typeData, setTypeData] = useState([]);

  // Fetching the data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/demandes/tendance', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTypeData(response.data.demande);
      } catch (error) {
        console.error('Erreur lors de la requête:', error.response?.data || error.message);
      } finally {
        setIsLoading(false); // Ensure loading is set to false once data is fetched
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-default-50 shadow-lg rounded-xl w-full h-full p-4">
      <h1 className="text-lg font-semibold">Tendance des prises de congés</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner label='Chargement' size='lg' color='primary' />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={typeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke='#eee' />
            <XAxis dataKey="name" tick={{ fill: "gray" }} tickLine={false} tickMargin={10} />
            <YAxis tick={{ fill: "gray" }} tickLine={false} tickMargin={10} />
            <Tooltip contentStyle={{ borderRadius: "10px", backgroundColor: 'hsl(var(--nextui-default-50) / var(--nextui-default-50-opacity, var(--tw-bg-opacity)))' }} />
            <Legend verticalAlign="top" align='right' wrapperStyle={{ paddingTop: "5px", paddingBottom: "25px" }} />

            {typeData.length > 0 && Object.entries(typeData[0]).map(([key, value], index) => {
              if (key !== 'name') {
                const color = ["#1d71b8", "#e30613a0", "#ffac0ea0", "gray", "#6a5acd", "#4682b4", "#8b4513", "#2e8b57", "#d2691e", "#556b2f"][index % 10];
                return (
                  <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={3} />
                );
              }
              return null;
            })}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default TypeChart;