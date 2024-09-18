import {Calendar, momentLocalizer, Views} from 'react-big-calendar'
import moment from 'moment' 
import { useState } from 'react'

const localizer = momentLocalizer(moment)

const events =[
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 18, 8, 0),
        end: new Date(2024, 8, 18, 8, 45),
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
        start: new Date(2024, 8, 18, 8, 0),
        end: new Date(2024, 8, 18, 8, 45),
    },
    {
        title: "Math",
        allDay: false,
        start: new Date(2024, 8, 18, 8, 0),
        end: new Date(2024, 8, 18, 8, 45),
    },
]

const BigCalendar = () => {
    const [views, setViews] = useState(Views.WORK_WEEK)

    const handleOnChangeView = (selectedView)=>{
        setViews(selectedView);
    }

  return (
    <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{height: "98%"}}
        views={["work_week","day"]}
        view={views}
        onView={handleOnChangeView}
        min={new Date(2024, 8, 19, 8, 0, 0)}
        max={new Date(2024, 8, 19, 18, 0, 0)}
    />
  )
}

export default BigCalendar