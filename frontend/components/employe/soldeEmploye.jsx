"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardBody, Progress } from '@nextui-org/react';

const SoldeEmploye = () => {

    const [leaveTypes, setLeave] = useState([]);

    const [activeStep, setActiveStep] = useState(0);

    const steps = ["Étape 1", "Étape 2", "Étape 3", "Étape 4"];

    const handleNext = () => {
      if (activeStep < steps.length - 1) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    };

    const handleBack = () => {
      if (activeStep > 0) {
        setActiveStep((prevStep) => prevStep - 1);
      }
    };

    useEffect(() => {   
      const id = localStorage.getItem('id');
      if (id) {
          infoConge(id)
      }
    }, []);

    //Information Conge
    const infoConge = async (id)=>{
      try {
          const response = await axios.get(`http://localhost:5000/api/employes/${id}/soldes`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          })

          setLeave(response.data.solde)

      } catch (error) {
          console.log('erreur informations: ', error.message)
          setLeave([])
      }
  }
    
  return (
    <div className="my-6 px-4 lg:px-6 h-full mx-auto w-full flex flex-col gap-4">
      <div className="flex-1 p-4 flex flex-col lg:flex-row gap-4 w-full">      

        <div className="mt-4 flex flex-col space-y-4 flex-1">
            <h1 className='text-xl font-bold text-bleuspat font-mono'>Soldes</h1>
          {leaveTypes.map((leave, index) => (
            <Card key={index} className="shadow-md">
            <CardBody className="p-4 flex flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <h2 className='text-sm font-semibold'>{leave.type}</h2>
                  <Progress value={(leave.accumulated / leave.total) * 100} className="mt-2 w-full" />
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
          ))}
        </div>

      </div>
    </div>
  )
}

export default SoldeEmploye