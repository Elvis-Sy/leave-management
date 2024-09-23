"use client"

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Spinner, Tooltip } from "@nextui-org/react";

const joursFeries = [
  { date: new Date(2024, 0, 1), description: 'Jour de l\'An' },
  { date: new Date(2024, 8, 13), description: 'Lany date eeeeeeeeeeeeeeee ohh yeee' },
  { date: new Date(2024, 8, 15), description: 'Event 2' },
  { date: new Date(2024, 8, 30), description: 'Event 3' },
  { date: new Date(2024, 4, 8), description: 'Event 4' }
];

const CongeCalendar = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // S'assurer que le composant est rendu côté client
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const holidayInfo = joursFeries.find(holiday => holiday.date.toDateString() === date.toDateString());

      return (
        <Tooltip
          closeDelay={0}
          content={ holidayInfo ? (
              <div className="px-1 py-2">
                <div className="text-small font-bold">{holidayInfo.date.toLocaleDateString('fr-FR')}</div>
                <div className="text-tiny text-gray-600">{holidayInfo.description}</div>
              </div>
            ) : null
          }
        className="max-w-40 shadow-xl border">
          <div className="flex justify-center relative">
            {holidayInfo && <div className="w-2 h-2 rounded-full bg-[#e66165a0]"></div>}
          </div> 
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <div className="bg-white w-full shadow-lg p-4 rounded-md">
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