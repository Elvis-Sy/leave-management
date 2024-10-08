import React from 'react'

const TableSearch = ({search, all}) => {

  const handleSearch = (e) => {
    if(e.target.value){
      search(e.target.value)
    } else {
      all()
    }
    
  };

  return (
    <div className='flex w-full md:w-auto items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <img src="/search.png" alt="" width={14} height={14}/>
        <input type="search" name="tblsearch" placeholder='Recherche...' className='w-full p-2 bg-transparent outline-none'
          onChange={handleSearch}
        />
    </div>
  )
}

export default TableSearch