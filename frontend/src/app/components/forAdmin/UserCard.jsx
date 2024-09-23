import React from 'react'

const UserCard = ({type, color}) => {
  return (
    <div className='rounded-2xl bg-white flex-1 min-w-[150px] shadow-lg'>
      <div className="p-4">
        <span className='text-[15px] text-gray-600 font-medium'>Demandes</span>
        <h1 className='text-2xl font-semibold my-4'>1,852</h1>
      </div>
        <div className=''>
          <h2 className={`capitalize mb-4 ml-4 text-sm font-medium text-white px-2 py-1 rounded-l-full ${color}`}>{type}</h2>
        </div>
    </div>
  )
}

export default UserCard