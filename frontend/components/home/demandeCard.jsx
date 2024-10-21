import React from 'react'
import { ReportsIcon } from '../icons/sidebar/reports-icon'

const DemandeCard = ({type, color, count}) => {
  return (
    <div className='rounded-2xl bg-default-50 flex-1 min-w-[150px] shadow-md'>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <ReportsIcon /> <span className='text-medium text-gray-600 font-medium'>Demandes</span>
        </div>
        <h1 className='text-4xl font-semibold my-4'>{count}</h1>
      </div>
        <div className=''>
          <h2 className={`capitalize mb-4 ml-20 text-sm font-medium text-white px-2 py-1 rounded-l-full ${color}`}>{type}</h2>
        </div>
    </div>
  )
}

export default DemandeCard