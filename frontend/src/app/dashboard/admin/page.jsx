"use client"

import { useRef } from "react";
import UserCard from '../../components/forAdmin/UserCard'
import CountChart from '../../components/forAdmin/CountChart'
import TendanceChart from '../../components/forAdmin/TendanceChart'
import TypeChart from '../../components/forAdmin/TypeChart'
import MiniCalendar from '../../components/forAdmin/MiniCalendar'
import Recents from '../../components/Recents'

const AdminPage = ()=> {

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* Card utilisateur */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard type={"Approuvees"} color={"bg-green-400"}/>
          <UserCard type={"Refusees"} color={"bg-[#e66165]"}/>
          <UserCard type={"En cours..."} color={"bg-gray-400"}/>
          <UserCard type={"Total demandes"} color={"bg-[#829af8]"}/>
        </div>

        {/* Middle Chart */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          <div className='w-full lg:w-1/3 h-[350px]'>
            <CountChart/>
          </div>
          <div className='w-full lg:w-2/3 h-[350px]'>
            <TendanceChart/>
          </div>
        </div>

        {/* Bottom Chart */}
        <div className='w-full h-[400px]'>
          <TypeChart/>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 h-[960px]">
        <MiniCalendar/>
        <Recents/>
      </div>
    </div>
  )
}

export default AdminPage