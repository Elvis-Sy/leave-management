"use client";

import { useState, useEffect, useMemo } from "react";
import DemandeCard from "./demandeCard";
import Taux from "../charts/tauxChart";
import MiniCalendrier from '../charts/miniCalendrier';
import TypeChart from '../charts/typeChart';
import axios from "axios";

export const Content = () => {
  const [statistiques, setStatistiques] = useState({});
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('id');
    if(id){
      recupererStatistiques();
    }
  }, []);

  // Fonction pour récupérer les données des cartes
  const recupererStatistiques = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/demandes/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setStatistiques(response.data.demande);
    } catch (error) {
      console.error('Erreur lors de la requête:', error.response?.data || error.message);
    } finally {
      setChargement(false);
    }
  };

  // Utilisation de useMemo pour calculer le total des demandes
  const totalDemandes = useMemo(() => {
    if (chargement) return 0;
    const count1 = statistiques.count1 || 0;
    const count2 = statistiques.count2 || 0;
    const count3 = statistiques.count3 || 0;
    const count5 = statistiques.count5 || 0;
    return count1 + count2 + count3 + count5;
  }, [statistiques, chargement]);

  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Section des cartes */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Répartition des demandes</h3>
            <div className="flex gap-4 flex-wrap">
              <DemandeCard type="Approuvées" color="bg-[#40c057]" count={statistiques.count2 || 0} />
              <DemandeCard type="Refusées" color="bg-[#fa5252]" count={statistiques.count3 || 0} />
              <DemandeCard type="En attente" color="bg-gray-400" count={(statistiques.count1 || 0) + (statistiques.count5 || 0)} />
              <DemandeCard type="Total" color="bg-bleuspat" count={totalDemandes} />
            </div>
          </div>

          {/* Graphiques */}
          <div className='flex gap-4 flex-col lg:flex-row'>
            <div className='w-full lg:w-1/3 h-[350px]'>
              <Taux />
            </div>
            <div className='w-full lg:w-2/3 h-[350px]'>
              <MiniCalendrier />
            </div>
          </div>

          {/* Tableau des types */}
          <div className='w-full h-[400px]'>
            <TypeChart />
          </div>
        </div>
      </div>
    </div>
  );
};