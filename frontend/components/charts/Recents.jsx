'use client'

import { Avatar, Card, CardBody } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";

const items = [
    {
      name: "Jose Perez",
      picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      amount: "4500 USD",
      date: "9/20/2021",
    },
    {
      name: "Jose Perez",
      picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      amount: "4500 USD",
      date: "9/20/2021",
    },
    {
      name: "Jose Perez",
      picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      amount: "4500 USD",
      date: "9/20/2021",
    },
    {
      name: "Jose Perez",
      picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      amount: "4500 USD",
      date: "9/20/2021",
    },
    {
      name: "Jose Perez",
      picture: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      amount: "4500 USD",
      date: "9/20/2021",
    },
  ];

const Recents = ({id}) => {
    const [action, setAction] = useState([])

    useEffect(()=>{
        allAction(id)
    }, [id])

    //Recuperation des donnees
    const allAction = async (id) => {
        try {
          const response = await axios.get(`http://localhost:5000/api/employes/recents/${id}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
          
          setAction(response.data.recent)
    
        } catch (error) {
            setAction([])
            console.error('Erreur lors de la requête:', error.response?.data || error.message);
        }
    };


  return (
    <Card className="bg-default-50 shadow-lg p-4 rounded-md flex-1">
      <CardBody className="py-5 gap-4">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 mb-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">
                Activites recentes
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 ">
          {action.map((item) => (
            <div key={item.id} className="flex gap-4 items-center justify-between w-full">
              <span className="text-default-900 text-sm  font-semibold">
                DM:
              </span>
              <div className={`flex items-center gap-1 ${item.action == "Refus" ? "text-[#fa5252]" : "text-[#40c057]"}`}>
                <span className="text-sm">{item.action}</span>
              </div>
              <div>
                <span className="text-default-500 text-sm">{item.Date}</span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default Recents





{/* <div className="bg-default-50 shadow-lg p-4 rounded-md flex-1">
        <div className="w-full">
            <div className="flex items-center justify-start mb-4">
                <h1 className="text-xl font-semibold">Activites recentes</h1>
            </div>
            <div className="flex flex-col gap-2">
                {action.map(m=>(
                    <div key={m.id} className="flex justify-between items-center p-2 rounded-md border-2 border-gray-100">
                        <p>{m.Date}</p>
                        <div className="flex flex-col text-right mr-1">
                            <p className={`text-sm font-semibold ${m.action == "Approbation" ? "text-[#40c057]" : "text-[#fa5252]"}`}>{m.action}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div> */}