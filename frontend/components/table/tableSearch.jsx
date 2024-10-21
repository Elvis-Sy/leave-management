import React from 'react'
import { Input } from '@nextui-org/react'

const TableSearch = ({search, all}) => {

  const handleSearch = (e) => {
    if(e){
      search(e)
    } else {
      all()
    }
    
  };

  return (
    <Input
        classNames={{
            input: "w-full",
            mainWrapper: "w-full",
        }}
        className='w-[250px]'
        placeholder="Recherche"
        onValueChange={handleSearch}
    />
  )
}

export default TableSearch