"use client"

import React, { useState } from 'react';
import { Card, CardBody, Progress } from '@nextui-org/react';

const SimpleEmploye = () => {
  const [employeeInfo] = useState({
    name: "ANDRIAMANANTENA",
    firstName: "John",
    position: "Directeur",
    department: "Dpt Informatique et telecom",
    email: "elvwwovnidedc04@gmail.com",
    id: "125478843284",
    photo: "/avatar.png"
  });

  const [leaveTypes] = useState([
    { type: 'Congés payés', total: 30, accumulated: 20, used: 5, },
    { type: 'Congés maladie', total: 15, accumulated: 10, used: 2 },
    { type: 'Congés exceptionnels', total: 5, accumulated: 5, used: 1 },
  ]);

  const [lastRequest] = useState({
    type: "Conge Maladie",
    date: "22/04/2024"
  });

  return (
    <div className='flex-1 p-4 flex flex-col gap-4'>
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-white/80 backdrop-blur-lg flex-col h-fit shadow-lg py-6 px-4 rounded-md flex-1 flex justify-between lg:justify-normal items-center md:flex-row lg:flex-col gap-8">
            <div className="flex gap-4">
              <div>
                <img src={employeeInfo.photo} alt="" width={100} height={100} className='w-20 h-20 rounded-full object-cover'/>
              </div>
              <div className="flex flex-col justify-between gap-2">
                <h1 className='text-lg font-semibold'>{`${employeeInfo.name} ${employeeInfo.firstName}`}</h1>
                <p className='text-sm text-gray-500'>
                  {employeeInfo.position} <br />
                  {employeeInfo.department}
                </p>
              </div>
            </div>
            <div>
              <div className="flex flex-col w-full px-4 items-center gap-2 flex-wrap text-xs font-medium">
                <div className="w-full lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <span>{employeeInfo.email}</span>
                </div>
                <div className="w-full lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <span>{employeeInfo.id}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-2">
            <div className="w-full h-full flex-col justify-center bg-white shadow-lg p-4 rounded-md flex gap-4 items-center">
              <span className='text-md text-gray-500 font-semibold'>Solde congé payé</span>
              <h1 className='text-3xl font-bold'>{leaveTypes[0].accumulated - leaveTypes[0].used}</h1>
            </div>
            <div className="w-full h-full flex-col justify-center bg-white shadow-lg p-4 gap-2 rounded-md flex items-center">
              <span className='text-md text-gray-500 font-semibold'>Dernière demande</span>
              <div className="w-full pl-12">
                <p className='text-sm font-semibold text-gray-500'>Type: <span className='text-medium text-black'>{lastRequest.type}</span></p>
                <p className='text-sm font-semibold text-gray-500'>Date: <span className='text-medium text-black'>{lastRequest.date}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4 space-y-4">
          {leaveTypes.map((leave, index) => (
            <Card key={index} className="w-fit shadow-md">
              <CardBody className="p-4 flex flex-row gap-4 items-center">
                {leave.icon}
                <div className="flex-1 max-w-lg">
                  <h2 className='text-sm font-semibold'>{leave.type}</h2>
                  <Progress value={(leave.used / leave.total) * 100} className="mt-2 w-full lg:w-[350px]" />
                  <p className='text-xs text-muted-foreground mt-1'>
                    {leave.used} accumulé sur {leave.total} jours
                  </p>
                </div>
                <div className="text-right">
                  <p className='text-xs text-muted-foreground'>Solde actuel</p>
                  <span className='text-xl font-semibold'>{leave.accumulated - leave.used}</span>
                </div>
                <div className="text-right">
                  <p className='text-xs text-muted-foreground'>Solde accumulé</p>
                  <span className='text-xl font-semibold'>{leave.accumulated}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleEmploye;