"use client"

import { useState, useEffect } from "react"
import UserCard from '../../components/forAdmin/UserCard'
import CountChart from '../../components/forAdmin/CountChart'
import TypeChart from '../../components/forAdmin/TypeChart'
import MiniCalendar from '../../components/forAdmin/MiniCalendar'
import axios from "axios"

const AdminPage = ()=> {

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
    <div className="p-4 flex gap-4 flex-col">

      {/* LEFT SIDE */}
      <div className="w-full flex flex-col gap-8">
        {/* Card utilisateur */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard type={"Approuvees"} color={"bg-[#40c057]"} count={stat.count2}/>
          <UserCard type={"Refusees"} color={"bg-[#fa5252]"} count={stat.count3}/>
          <UserCard type={"En attente..."} color={"bg-gray-400"} count={stat.count1}/>
          <UserCard type={"Total demandes"} color={"bg-bleuspat"} count={etat ? stat.count1 + stat.count2 + stat.count3 : 0}/>
        </div>

        {/* Middle Chart */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          <div className='w-full lg:w-1/3 h-[350px]'>
            <CountChart/>
          </div>
          <div className='w-full lg:w-2/3 h-[350px]'>
            <MiniCalendar/>
          </div>
        </div>

        {/* Bottom Chart */}
        <div className='w-full h-[400px]'>
          <TypeChart/>
        </div>
      </div>

      {/* RIGHT SIDE */}
      {/* <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <MiniCalendar/>
        <Recents/>
      </div> */}
    </div>
  )
}

export default AdminPage