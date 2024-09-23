"use client"

import React from 'react';
import TableSearch from '../../../components/TableSearch';
import { User } from '@nextui-org/react';

const studentsData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@doe.com",
    photo:
      "/illustration1.png",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@doe.com",
    photo:
      "/illustration1.png",
  },
  {
    id: 3,
    name: "Mike Geller",
    email: "mike@geller.com",
    photo:
      "/illustration1.png",
  },
  {
    id: 4,
    name: "Jay French",
    email: "jay@gmail.com",
    photo:
      "/illustration1.png",
  },
  {
    id: 5,
    name: "Jane Smith",
    email: "jane@gmail.com",
    photo:
      "/illustration1.png",
  },
  {
    id: 6,
    name: "Anna Santiago",
    email: "anna@gmail.com",
    photo:
      "/illustration1.png",
  },
]

const Historiques = ()=> {
  return (
    <div className="bg-white shadow-lg p-4 rounded-md flex-1 m-4 mt-0">
      {/* FILTRE */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block text-lg font-semibold">Historiques des donnees</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch/>
          <div className="flex items-center gap-4 self-end">
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
              <img src="/filter.png" alt="" width={14} height={14}/>
            </button>
            <button type="button" className="w-9 h-9 flex items-center justify-center rounded-full bg-[#829af8]">
              <img src="/sort.png" alt="" width={14} height={14}/>
            </button>
          </div>
        </div>
      </div>

      <div className="flex lg:flex-row m-2 h-full gap-2">
        {/* LEFT */}
        <div className="hidden lg:flex flex-col w-1/4 justify-center border-1 shadow-md border-gray-200 rounded-sm">
          <div className="p-2 font-medium bg-gray-200">
            Employes
          </div>

          <div className="w-full border-t-2 border-gray-200 overflow-y-scroll h-[470px]">
            {studentsData.map(item =>(
              <div key={item.id} className="p-2 border-gray-200 even:bg-slate-50 text-sm hover:bg-green-400/10">
                <User   
                  name={item.name}
                  description={item.email}
                  avatarProps={{
                    src: "/illustration1.png"
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT */}
        <div className="flex flex-col w-full lg:w-3/4 border-1 shadow-md border-gray-200 rounded-sm overflow-y-scroll h-[515px]">
            <div className="flex flex-col">
              <span className='sticky top-0 text-sx bg-bleuspat text-white font-medium p-2'>12/04/2024</span>
              <div className='py-4 px-2 border-2 text-sm hover:bg-green-400/10'>
                <p className='text-md font-semibold'>Action: <span className='bg-[#829af8] text-sm px-2 rounded-full text-white'>Modification</span></p>
                <div className="flex items-center py-2 justify-between">
                  <p className='text-gray-500 text-xs'>fait par: <span className='font-medium text-sm text-black'>Elvis Sylvano</span></p>
                  <p className='text-gray-500 text-xs'>ancienne valeur: <span className='font-medium text-sm text-black'>Conge paye, 12/05/2024</span></p>
                  <p className='text-gray-500 text-xs'>nouvelle valeur: <span className='font-medium text-sm text-black'>Conge maladie, 15/05/2024</span></p>
                </div>
              </div>
              <div className='py-4 px-2 border-2 text-sm hover:bg-green-400/10'>
                <p className='text-md font-semibold'>Action: <span className='bg-[#e66165] text-sm px-2 rounded-full text-white'>Suppression</span></p>
                <div className="flex items-center py-2 justify-between">
                  <p className='text-gray-500 text-xs'>fait par: <span className='font-medium text-sm text-black'>Elvis Sylvano</span></p>
                  <p className='text-gray-500 text-xs'>ancienne valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                  <p className='text-gray-500 text-xs'>nouvelle valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                </div>
              </div>
              <div className='py-4 px-2 border-2 text-sm hover:bg-green-400/10'>
                <p className='text-md font-semibold'>Action: <span className='bg-gray-400 text-sm px-2 rounded-full text-white'>Annulation</span></p>
                <div className="flex items-center py-2 justify-between">
                  <p className='text-gray-500 text-xs'>fait par: <span className='font-medium text-sm text-black'>Elvis Sylvano</span></p>
                  <p className='text-gray-500 text-xs'>ancienne valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                  <p className='text-gray-500 text-xs'>nouvelle valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className='sticky top-0 text-sx bg-bleuspat text-white font-medium p-2'>13/04/2024</span>
              <div className='py-4 px-2 border-2 text-sm hover:bg-green-400/10'>
                <p className='text-md font-semibold'>Action: <span className='bg-[#829af8] text-sm px-2 rounded-full text-white'>Modification</span></p>
                <div className="flex items-center py-2 justify-between">
                  <p className='text-gray-500 text-xs'>fait par: <span className='font-medium text-sm text-black'>Elvis Sylvano</span></p>
                  <p className='text-gray-500 text-xs'>ancienne valeur: <span className='font-medium text-sm text-black'>Conge paye, 12/05/2024</span></p>
                  <p className='text-gray-500 text-xs'>nouvelle valeur: <span className='font-medium text-sm text-black'>Conge maladie, 15/05/2024</span></p>
                </div>
              </div>
              <div className='py-4 px-2 border-2 text-sm hover:bg-green-400/10'>
                <p className='text-md font-semibold'>Action: <span className='bg-[#e66165] text-sm px-2 rounded-full text-white'>Suppression</span></p>
                <div className="flex items-center py-2 justify-between">
                  <p className='text-gray-500 text-xs'>fait par: <span className='font-medium text-sm text-black'>Elvis Sylvano</span></p>
                  <p className='text-gray-500 text-xs'>ancienne valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                  <p className='text-gray-500 text-xs'>nouvelle valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                </div>
              </div>
              <div className='py-4 px-2 border-2 text-sm hover:bg-green-400/10'>
                <p className='text-md font-semibold'>Action: <span className='bg-gray-400 text-sm px-2 rounded-full text-white'>Annulation</span></p>
                <div className="flex items-center py-2 justify-between">
                  <p className='text-gray-500 text-xs'>fait par: <span className='font-medium text-sm text-black'>Elvis Sylvano</span></p>
                  <p className='text-gray-500 text-xs'>ancienne valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                  <p className='text-gray-500 text-xs'>nouvelle valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className='sticky top-0 text-sx bg-bleuspat text-white font-medium p-2'>14/04/2024</span>
              <div className='py-4 px-2 border-2 text-sm hover:bg-green-400/10'>
                <p className='text-md font-semibold'>Action: <span className='bg-[#829af8] text-sm px-2 rounded-full text-white'>Modification</span></p>
                <div className="flex items-center py-2 justify-between">
                  <p className='text-gray-500 text-xs'>fait par: <span className='font-medium text-sm text-black'>Elvis Sylvano</span></p>
                  <p className='text-gray-500 text-xs'>ancienne valeur: <span className='font-medium text-sm text-black'>Conge paye, 12/05/2024</span></p>
                  <p className='text-gray-500 text-xs'>nouvelle valeur: <span className='font-medium text-sm text-black'>Conge maladie, 15/05/2024</span></p>
                </div>
              </div>
              <div className='py-4 px-2 border-2 text-sm hover:bg-green-400/10'>
                <p className='text-md font-semibold'>Action: <span className='bg-[#e66165] text-sm px-2 rounded-full text-white'>Suppression</span></p>
                <div className="flex items-center py-2 justify-between">
                  <p className='text-gray-500 text-xs'>fait par: <span className='font-medium text-sm text-black'>Elvis Sylvano</span></p>
                  <p className='text-gray-500 text-xs'>ancienne valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                  <p className='text-gray-500 text-xs'>nouvelle valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                </div>
              </div>
              <div className='py-4 px-2 border-2 text-sm hover:bg-green-400/10'>
                <p className='text-md font-semibold'>Action: <span className='bg-gray-400 text-sm px-2 rounded-full text-white'>Annulation</span></p>
                <div className="flex items-center py-2 justify-between">
                  <p className='text-gray-500 text-xs'>fait par: <span className='font-medium text-sm text-black'>Elvis Sylvano</span></p>
                  <p className='text-gray-500 text-xs'>ancienne valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                  <p className='text-gray-500 text-xs'>nouvelle valeur: <span className='font-medium text-sm text-black'>-/-</span></p>
                </div>
              </div>
            </div>
        </div>
      </div>
      
    </div>
  );
}

export default Historiques