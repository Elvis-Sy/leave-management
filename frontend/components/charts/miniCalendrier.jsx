"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Spinner, Tooltip } from "@nextui-org/react";
import axios from "axios";

const CongeCalendar = () => {
  const [isClient, setIsClient] = useState(false);
  const [joursFeries, setJoursFeries] = useState([]);

  useEffect(() => {
    setIsClient(true);
    fetchHolidays();
  }, []);

  // Récupération des jours fériés
  const fetchHolidays = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ferrier/event', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const holidays = response.data.ferrie.map(ev => ({
        date: new Date(ev.start),
        description: ev.description,
        title: ev.title,
      }));

      setJoursFeries(holidays);
    } catch (error) {
      console.error('Erreur lors de la requête:', error.response?.data || error.message);
      setJoursFeries([]);
    }
  };

  // Contenu des tuiles de calendrier
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const holidayInfo = joursFeries.find(holiday => holiday.date.toDateString() === date.toDateString());

      return (
        <Tooltip
          closeDelay={0}
          content={holidayInfo ? (
            <div className="px-1 py-2">
              <div className="text-small font-bold">{holidayInfo.title}</div>
              <div className="text-tiny text-gray-700 dark:text-gray-100">{holidayInfo.description}</div>
            </div>
          ) : null}
          className="max-w-40 shadow-xl border"
        >
          <div className="flex justify-center relative">
            {holidayInfo && <div className="w-2 h-2 rounded-full bg-[#e66165a0]"></div>}
          </div>
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <div className="bg-default-50 w-full shadow-md p-4 rounded-md h-full">
      {isClient ? (
        <Calendar
          tileContent={tileContent}
        />
      ) : (
        <div className="flex justify-center items-center h-full">
          <Spinner label='Chargement' size='md' color='primary' />
        </div>
      )}
    </div>
  );
};

export default CongeCalendar;