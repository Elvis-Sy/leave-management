"use client"

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const joursFeries = [
  { date: new Date(2024, 0, 1), description: 'Jour de l\'An' },
  { date: new Date(2024, 8, 13), description: 'Event 1' },
  { date: new Date(2024, 8, 15), description: 'Event 2' },
  { date: new Date(2024, 8, 30), description: 'Event 3' },
  { date: new Date(2024, 4, 8), description: 'Event 4' }
];

const CongeCalendar = () => {

  const [value, onChange] = useState(new Date());
  const [activeMonth, setActiveMonth] = useState(new Date());
  const [holidaysInMonth, setHolidaysInMonth] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    handleActiveStartDateChange(activeMonth);
    setIsClient(true);
  }, [activeMonth]);

  // Fonction pour filtrer les jours fériés du mois actif
  const updateHolidaysInMonth = (startDate) => {
    const currentMonth = startDate.getMonth();
    const currentYear = startDate.getFullYear();
    
    const holidays = joursFeries.filter(
      holiday => holiday.date.getMonth() === currentMonth && holiday.date.getFullYear() === currentYear
    );
    setHolidaysInMonth(holidays);
  };

  // Gestion du changement de mois
  const handleActiveStartDateChange = (startDate) => {
    setActiveMonth(startDate);
    updateHolidaysInMonth(startDate);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const isHoliday = joursFeries.some(holiday => holiday.date.toDateString() === date.toDateString());
      const holidayInfo = joursFeries.find(holiday => holiday.date.toDateString() === date.toDateString());

      return (
        <div className="flex justify-center relative">
          <div>
            {isHoliday ? <div className="w-2 h-2 rounded-full bg-[#e66165a0]"></div> : null}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white shadow-lg p-4 rounded-md">
      {isClient && (
        <Calendar
          onChange={onChange}
          value={value}
          tileContent={tileContent}
          onActiveStartDateChange={({ activeStartDate }) => handleActiveStartDateChange(activeStartDate)}
        />
      )}

      {/* Détails des jours fériés */}
      {holidaysInMonth.length > 0 ? (
        <div className="w-full">
            <div className="flex items-center justify-between mt-4 mb-2 border-t-2 border-gray-500">
                <h1 className="text-xl font-semibold mt-4">Jours fériés pour ce mois :</h1>
            </div>
            <div className="flex flex-col gap-2">
                {holidaysInMonth.map((holiday, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rouned-md border-2 border-gray-100 border-t-4 border-t-[#e66165a0]">  
                      <h1 className="font-semibold text-gray-600">{holiday.date.toLocaleDateString()}</h1>
                      <p className="text-gray-400 text-sm text-right">{holiday.description}</p>
                    </div>
                ))}
            </div>
        </div>
      ) : (
        <div className="mt-4 text-gray-600">Aucun jour férié pour ce mois.</div>
      )}
    </div>
  );
}

export default CongeCalendar;