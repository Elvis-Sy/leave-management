 import React from 'react'
 
 const Table = ({col, render, data, margin = 4}) => {

    
   return (
     <table className={`w-full mt-${margin}`}>
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