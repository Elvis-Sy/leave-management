import React from 'react'

const UserCard = ({type, color}) => {
  return (
    <div className='rounded-2xl bg-white/80 p-4 flex-1 min-w-[150px] backdrop-blur-lg shadow-lg'>
        <div className='flex justify-between items-center'>
            <span className='text-[15px] text-gray-600 font-medium'>Jan 2024</span>
            <img src="/moreDark.png" alt="" width={20} height={20}/>
        </div>
        <h1 className='text-2xl font-semibold my-4'>1,852</h1>
        <div className='flex justify-between'>
          <h2 className={`capitalize text-sm font-medium text-white px-2 py-1 rounded-full ${color}`}>{type}</h2>
        </div>
    </div>
  )
}

export default UserCard