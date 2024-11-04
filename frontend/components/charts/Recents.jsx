'use client';

import { Card, CardBody } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";

const Recents = ({ id }) => {
  const [action, setAction] = useState([]);

  useEffect(() => {
    if (id) {
      fetchRecentActions(id);
    }
  }, [id]);

  // Récupération des données
  const fetchRecentActions = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employes/recents/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setAction(response.data.recent);
    } catch (error) {
      console.error('Erreur lors de la requête:', error.response?.data || error.message);
      setAction([]);
    }
  };

  return (
    <Card className="bg-default-50 shadow-lg p-4 rounded-md flex-1">
      <CardBody className="py-5 gap-4">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 mb-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">
              Activités récentes
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {action.map(item => (
            <div key={item.id} className="flex gap-4 items-center justify-between w-full">
              <span className="text-default-900 text-sm font-semibold">DM:</span>
              <div className={`flex items-center gap-1 ${item.action === "Refus" ? "text-[#fa5252]" : "text-[#40c057]"}`}>
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
  );
};

export default Recents;