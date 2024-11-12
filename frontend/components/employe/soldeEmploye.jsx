"use client";

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Card, CardBody, Progress } from '@nextui-org/react';

const SoldeEmploye = React.memo(({ idEmp = null }) => {
  const [leaveTypes, setLeave] = useState([]);
  
  const infoConge = useCallback(async (id) => {
    if (!id) return; 

    try {
      const response = await axios.get(`http://localhost:5000/api/employes/${id}/soldes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log(response.data);
      setLeave(response.data.solde || []);
    } catch (error) {
      console.error('Erreur informations: ', error.message);
      setLeave([]); 
    }
  }, []);

  useEffect(() => {
    const id = localStorage.getItem('id');
    if (id) {
      infoConge(id);
    }
  }, [infoConge]); 

  return (
    <div className="flex-1 p-4 flex flex-col lg:flex-row gap-4 w-full">
      <div className="mt-4 flex flex-col space-y-4 flex-1">
        <h1 className='text-xl font-bold text-bleuspat font-mono'>Soldes</h1>
        {leaveTypes.length > 0 ? (
          leaveTypes.map((leave) => (
            <Card key={leave.type} className="shadow-md">
              <CardBody className="p-4 flex flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <h2 className='text-sm font-semibold'>{leave.type}</h2>
                  <Progress 
                    color={leave.accumulated > leave.total ? 'warning' : 'primary'}
                    value={(leave.accumulated / leave.total) * 100}
                    className="mt-2 w-full"
                    aria-label={`Progression des jours de congé pour ${leave.type}`}
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    {leave.accumulated} sur {leave.total} jours
                  </p>
                </div>
                <div className="text-right">
                  <p className='text-xs text-muted-foreground'>Solde actuel</p>
                  <span className='text-xl font-semibold'>{leave.accumulated}</span>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <p className='text-sm text-gray-500'>Aucun solde de congé disponible.</p>
        )}
      </div>
    </div>
  );
});

SoldeEmploye.displayName = "SoldeEmploye";

export default SoldeEmploye;









// "use client"

// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { Card, CardBody, Progress } from '@nextui-org/react';

// const SoldeEmploye = ({idEmp=null}) => {

//     const [leaveTypes, setLeave] = useState([]);

//     useEffect(() => {   
//       const id = localStorage.getItem('id');
//       if (id) {
//           infoConge(id)
//       }
//     }, []);

//     //Information Conge
//     const infoConge = async (id)=>{
//       try {
//           const response = await axios.get(`http://localhost:5000/api/employes/${id}/soldes`, {
//               headers: {
//                   Authorization: `Bearer ${localStorage.getItem('token')}`
//               }
//           })

//           console.log(response.data)
//           setLeave(response.data.solde || [])

//       } catch (error) {
//           console.log('erreur informations: ', error.message)
//           setLeave([])
//       }
//   }
    
//   return (
//       <div className="flex-1 p-4 flex flex-col lg:flex-row gap-4 w-full">      

//         <div className="mt-4 flex flex-col space-y-4 flex-1">
//             <h1 className='text-xl font-bold text-bleuspat font-mono'>Soldes</h1>
//           {leaveTypes.map((leave, index) => (
//             <Card key={index} className="shadow-md">
//             <CardBody className="p-4 flex flex-row gap-4 items-center">
//                 <div className="flex-1 w-full">
//                   <h2 className='text-sm font-semibold'>{leave.type}</h2>
//                   <Progress color={leave.accumulated > leave.total ? 'warning' : 'primary'} value={(leave.accumulated / leave.total) * 100} className="mt-2 w-full" aria-label={`Progression des jours de congé pour ${leave.type}`}/>
//                   <p className='text-xs text-muted-foreground mt-1'>
//                       {leave.accumulated} sur {leave.total} jours
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className='text-xs text-muted-foreground'>Solde actuel</p>
//                   <span className='text-xl font-semibold'>{leave.accumulated}</span>
//                 </div>
//             </CardBody>
//             </Card>
//           ))}
//         </div>

//       </div>
//   )
// }

// export default SoldeEmploye