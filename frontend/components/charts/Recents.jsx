'use client'

import axios from "axios";
import { useEffect, useState } from "react";


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
    <div className="bg-default-50 shadow-lg p-4 rounded-md flex-1">
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
    </div>
  )
}

export default Recents