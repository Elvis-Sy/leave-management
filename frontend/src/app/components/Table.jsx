 import React from 'react'
 
 const Table = ({col, render, data}) => {

    
   return (
     <table className='w-full mt-4'>
        <thead>
            <tr className='text-left text-gray-500 text-sm'>
                {col.map(column =>(
                    <th key={column.accessor} className={column.className}>{column.header}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {data.map((item) =>render(item))}
        </tbody>
     </table>
   )
 }
 
 export default Table