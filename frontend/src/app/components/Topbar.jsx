"use client"

import {Popover, PopoverTrigger, PopoverContent, User} from "@nextui-org/react";
import { format } from "date-fns";
import {fr} from 'date-fns/locale'
import { useEffect, useState } from "react";

const Topbar = ({infoUser})=> {

  const [role, setRole] = useState('')
  const date = infoUser.dernier;

  useEffect(()=>{
    setRole(localStorage.getItem('role'))
  }, [])

  //Formater la date
  const formatDate = (date)=>{
    const temp = date ? new Date(date) : new Date(null);
    return format(temp, "d MMMM yyyy", {locale: fr})
  }
  

  return (
      <div className="flex mb-2 items-center md:justify-between justify-end p-2 bg-bleuspat">
        {/* Toogle */}
          <img src="/menu.png" alt="" width={32} height={32} className="cursor-pointer hidden md:block"/>

        {/* UTILISATEUR (photo et nom)*/}
        <Popover placement="left">
          <PopoverTrigger className="flex items-center gap-2 bg-[#f1f1f1] py-2 px-2 rounded-xl">
            <div className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] leading-3 font-medium text-gray-900">{infoUser.name}</span>
                <div className="flex justify-end">
                  <span className="text-xs text-white px-2 rounded-full bg-gray-500">{role}</span>
                </div>
              </div>
              <img src="http://localhost:5000/jenna-ortega-7680x4320-16936.jpg" alt="" width={30} height={30} className=" w-8 h-8 rounded-full object-cover"/>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-1">
            <div className="flex flex-col gap-4 p-2">
              <div className="flex items-center justify-between w-[250px]">
                <User   
                  name={infoUser.name}
                  description={infoUser.email}
                  avatarProps={{
                    src: "http://localhost:5000/jenna-ortega-7680x4320-16936.jpg"
                  }}
                />
                <span className="text-[12px] text-white px-2 rounded-full bg-gray-500">{role}</span>
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium font-mono">-{infoUser.poste}</p>
                <p className="text-sm text-gray-700">Dernière connexion : <span className="font-semibold">{formatDate(date)}</span></p>
              </div>
              <div className="border-t text-sm border-gray-300 pt-2 flex items-center justify-end">
                <button className="hover:text-redspat text-redspat/50">Se deconnecter</button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
  )
}

export default Topbar