import {Calendar, momentLocalizer, Views} from 'react-big-calendar'
import moment from 'moment' 
import { useState } from 'react'
import 'moment/locale/fr';

moment.locale('fr');

const localizer = momentLocalizer(moment)

const events =[
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 18, 8, 0),
        end: new Date(2024, 8, 20, 8, 45),
    },
    {
        title: "Physics",
        allDay: false,
        start: new Date(2024, 8, 13, 9, 0),
        end: new Date(2024, 8, 13, 9, 40),
    },
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 18, 9, 0),
        end: new Date(2024, 8, 18, 9, 45),
    },
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 19, 8, 0),
        end: new Date(2024, 8, 19, 8, 45),
    },
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 19, 16, 0),
        end: new Date(2024, 8, 18, 18, 45),
    },
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 20, 8, 0),
        end: new Date(2024, 8, 20, 8, 45),
    },
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 20, 8, 30),
        end: new Date(2024, 8, 20, 9, 45),
    },
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 18, 20, 0),
        end: new Date(2024, 8, 18, 21, 45),
    },
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 22, 8, 0),
        end: new Date(2024, 8, 22, 8, 45),
    },
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 18, 10, 0),
        end: new Date(2024, 8, 18, 14, 45),
    },
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 18, 8, 0),
        end: new Date(2024, 8, 18, 9, 30),
    },
]

const BigCalendar = () => {
    const [views, setViews] = useState(Views.MONTH)

    const handleOnChangeView = (selectedView)=>{
        setViews(selectedView);
    }

  return (
    <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{height: "95%"}}
        views={["work_week","month"]}
        view={views}
        onView={handleOnChangeView}
        min={new Date(2024, 8, 19, 8, 0, 0)}
        max={new Date(2024, 8, 19, 18, 0, 0)}
        className="Bigcalendar"
        popup="true"
    />
  )
}

export default BigCalendar