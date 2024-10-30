"use client";

import {useState, useEffect} from "react";
import  DemandeCard  from "./demandeCard";
import Taux from "../charts/tauxChart";
import MiniCalendrier from '../charts/miniCalendrier'
import TypeChart from '../charts/typeChart'
import axios from "axios";

export const Content = () => {

  const [stat, setStat] = useState([])
  const [etat, setEtat] = useState(false)

  useEffect(() => {
    infoCard()
  }, []);

  //Prendre les donnes pour les cards
  const infoCard = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/demandes/stats', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        setStat(response.data.demande)
        setEtat(true)

    } catch (error) {
        console.error('Erreur lors de la requête:', error.response?.data || error.message);
    }
  };
  
  return (
  <div className="h-full lg:px-6">
    <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
      <div className="mt-6 gap-6 flex flex-col w-full">
        {/* Card Section Top */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">Repartition des demandes</h3>
          <div className="flex gap-4 flex-wrap">
            <DemandeCard type={"Approuvees"} color={"bg-[#40c057]"} count={stat.count2 || 0}/>
            <DemandeCard type={"Refusees"} color={"bg-[#fa5252]"} count={stat.count3 || 0}/>
            <DemandeCard type={"En attente/revision"} color={"bg-gray-400"} count={stat.count1 + stat.count5}/>
            <DemandeCard type={"Total demandes"} color={"bg-bleuspat"} count={etat ? stat.count1 + stat.count2 + stat.count3 + stat.count5 : 0}/>
          </div>
        </div>

        {/* Chart */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          <div className='w-full lg:w-1/3 h-[350px]'>
            <Taux/>
          </div>
          <div className='w-full lg:w-2/3 h-[350px]'>
            <MiniCalendrier/>
          </div>
        </div>

        {/* Table Latest Users */}
        <div className='w-full h-[400px]'>
          <TypeChart/>
        </div>
      </div>
    </div>

  </div>
)};
